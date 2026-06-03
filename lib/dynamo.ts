// Server-side data layer: the product app talks directly to the backend's
// DynamoDB tables (the same store the API validates keys against). This keeps
// account onboarding + key management self-contained in the product app.
//
// Key scheme mirrors the backend exactly (app/core/security.py):
//   raw      = "rp_live_" + base64url(32 random bytes)
//   key_hash = sha256(raw) hex  (only the hash is stored)
//   prefix   = raw.slice(0,12) + "…"
//
// Requires AWS creds in the server env (standard chain) and region us-east-2.

import crypto from "node:crypto";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type {
  ApiKeyInfo,
  CreatedWebhook,
  IssuedKey,
  Usage,
  Webhook,
  WebhookEvent,
} from "@/lib/types";

const REGION = process.env.AWS_REGION || "us-east-2";
const T_API_KEYS = process.env.DYNAMODB_TABLE_API_KEYS || "resume-parser-api-keys";
const T_COMPANIES = process.env.DYNAMODB_TABLE_COMPANIES || "resume-parser-companies";
const T_AUDIT = process.env.DYNAMODB_TABLE_AUDIT_LOGS || "resume-parser-audit-logs";
const T_WEBHOOKS = process.env.DYNAMODB_TABLE_WEBHOOKS || "resume-parser-webhooks";
const API_KEYS_COMPANY_INDEX = "company-index";
const COMPANIES_EMAIL_INDEX = "email-index";
const AUDIT_COMPANY_INDEX = "company-timestamp-index";

let _doc: DynamoDBDocumentClient | null = null;
function doc(): DynamoDBDocumentClient {
  if (!_doc) {
    _doc = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
      marshallOptions: { removeUndefinedValues: true },
    });
  }
  return _doc;
}

function slug(name: string): string {
  return (name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "company").slice(0, 40);
}
function generateRawKey(): string {
  return "rp_live_" + crypto.randomBytes(32).toString("base64url");
}
function hashKey(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

// ── Companies / onboarding ────────────────────────────────────────────────────

export interface CompanyRecord {
  company_id: string;
  name?: string;
  email?: string;
  plan?: string;
  status?: string;
  created_at?: string;
}

async function getCompanyByEmail(email: string): Promise<CompanyRecord | null> {
  const out = await doc().send(
    new QueryCommand({
      TableName: T_COMPANIES,
      IndexName: COMPANIES_EMAIL_INDEX,
      KeyConditionExpression: "email = :e",
      ExpressionAttributeValues: { ":e": email },
      Limit: 1,
    }),
  );
  return (out.Items?.[0] as CompanyRecord) ?? null;
}

export async function getCompany(companyId: string): Promise<CompanyRecord | null> {
  const out = await doc().send(new GetCommand({ TableName: T_COMPANIES, Key: { company_id: companyId } }));
  return (out.Item as CompanyRecord) ?? null;
}

/** Resolve the company for a signed-in user, creating it on first sign-in. */
export async function resolveCompanyId(email: string, name?: string): Promise<string> {
  const existing = await getCompanyByEmail(email);
  if (existing) return existing.company_id;

  const companyId = `${slug(name || email)}-${crypto.randomBytes(3).toString("hex")}`;
  try {
    await doc().send(
      new PutCommand({
        TableName: T_COMPANIES,
        Item: {
          company_id: companyId,
          name: name || email,
          email,
          plan: "free",
          status: "active",
          created_at: new Date().toISOString(),
        },
        ConditionExpression: "attribute_not_exists(company_id)",
      }),
    );
    return companyId;
  } catch {
    // Concurrent first-load created it — re-look-up.
    const after = await getCompanyByEmail(email);
    if (after) return after.company_id;
    throw new Error("Onboarding failed");
  }
}

// ── API keys ──────────────────────────────────────────────────────────────────

export async function listKeys(companyId: string): Promise<ApiKeyInfo[]> {
  const out = await doc().send(
    new QueryCommand({
      TableName: T_API_KEYS,
      IndexName: API_KEYS_COMPANY_INDEX,
      KeyConditionExpression: "company_id = :c",
      ExpressionAttributeValues: { ":c": companyId },
    }),
  );
  const items = (out.Items ?? []).map((k) => ({
    key_hash: String(k.key_hash),
    key_prefix: String(k.key_prefix ?? ""),
    status: String(k.status ?? "active"),
    created_at: String(k.created_at ?? ""),
  }));
  items.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return items;
}

export async function createKey(companyId: string): Promise<IssuedKey> {
  const raw = generateRawKey();
  const created_at = new Date().toISOString();
  await doc().send(
    new PutCommand({
      TableName: T_API_KEYS,
      Item: {
        key_hash: hashKey(raw),
        key_prefix: raw.slice(0, 12) + "…",
        company_id: companyId,
        status: "active",
        created_at,
      },
    }),
  );
  return { api_key: raw, key_prefix: raw.slice(0, 12) + "…", status: "active", created_at };
}

export async function revokeKey(companyId: string, keyHash: string): Promise<void> {
  const existing = await doc().send(new GetCommand({ TableName: T_API_KEYS, Key: { key_hash: keyHash } }));
  if (!existing.Item || existing.Item.company_id !== companyId) {
    throw new Error("Key not found");
  }
  await doc().send(
    new UpdateCommand({
      TableName: T_API_KEYS,
      Key: { key_hash: keyHash },
      UpdateExpression: "SET #s = :r",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":r": "revoked" },
    }),
  );
}

// ── Webhooks ──────────────────────────────────────────────────────────────────

const VALID_EVENTS: WebhookEvent[] = ["parse.completed", "parse.failed", "batch.completed"];

/** Lightweight SSRF/scheme guard. The backend re-validates at delivery time. */
function validateWebhookUrl(url: string): void {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    throw new Error("Webhook URL is not a valid URL");
  }
  if (u.protocol !== "https:") throw new Error("Webhook URL must use HTTPS");
  const host = u.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "0.0.0.0" ||
    host.endsWith(".local") ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  ) {
    throw new Error("Webhook URL must be a public address");
  }
}

export async function listWebhooks(companyId: string): Promise<Webhook[]> {
  const out = await doc().send(
    new QueryCommand({
      TableName: T_WEBHOOKS,
      KeyConditionExpression: "company_id = :c",
      ExpressionAttributeValues: { ":c": companyId },
    }),
  );
  return (out.Items ?? []).map((w) => ({
    webhook_id: String(w.webhook_id),
    url: String(w.url ?? ""),
    events: (w.events as WebhookEvent[]) ?? [],
    status: String(w.status ?? "active"),
    created_at: String(w.created_at ?? ""),
  }));
}

export async function createWebhook(
  companyId: string,
  url: string,
  events: WebhookEvent[],
): Promise<CreatedWebhook> {
  validateWebhookUrl(url);
  const clean = events.filter((e) => VALID_EVENTS.includes(e));
  if (clean.length === 0) throw new Error("Select at least one event");

  const webhook_id = crypto.randomUUID();
  const hmac_secret = crypto.randomBytes(32).toString("hex");
  const created_at = new Date().toISOString();
  await doc().send(
    new PutCommand({
      TableName: T_WEBHOOKS,
      Item: { company_id: companyId, webhook_id, url, hmac_secret, events: clean, status: "active", created_at },
    }),
  );
  return { webhook_id, url, events: clean, status: "active", created_at, hmac_secret };
}

export async function deleteWebhook(companyId: string, webhookId: string): Promise<void> {
  await doc().send(
    new DeleteCommand({ TableName: T_WEBHOOKS, Key: { company_id: companyId, webhook_id: webhookId } }),
  );
}

// ── Usage / stats ─────────────────────────────────────────────────────────────

export async function getUsage(companyId: string, days = 30): Promise<Usage> {
  const since = new Date(Date.now() - Math.max(1, Math.min(days, 365)) * 86400_000).toISOString();
  const logs: Record<string, unknown>[] = [];
  let ExclusiveStartKey: Record<string, unknown> | undefined;
  do {
    const out = await doc().send(
      new QueryCommand({
        TableName: T_AUDIT,
        IndexName: AUDIT_COMPANY_INDEX,
        KeyConditionExpression: "company_id = :c AND #ts >= :since",
        ExpressionAttributeNames: { "#ts": "timestamp" },
        ExpressionAttributeValues: { ":c": companyId, ":since": since },
        ExclusiveStartKey,
      }),
    );
    logs.push(...((out.Items as Record<string, unknown>[]) ?? []));
    ExclusiveStartKey = out.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (ExclusiveStartKey);

  const num = (v: unknown) => Number(v ?? 0) || 0;
  const totals = {
    jobs: logs.length,
    completed: logs.filter((r) => r.status === "completed").length,
    failed: logs.filter((r) => r.status === "failed").length,
    ocr_jobs: logs.filter((r) => r.ocr_used).length,
    tokens_used: logs.reduce((s, r) => s + num(r.ai_tokens_used), 0),
    avg_duration_ms: 0,
  };
  const durations = logs.map((r) => num(r.duration_ms)).filter(Boolean);
  totals.avg_duration_ms = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

  const byDay = new Map<string, { jobs: number; tokens: number }>();
  const byType: Record<string, number> = {};
  for (const r of logs) {
    const day = String(r.timestamp ?? "").slice(0, 10);
    if (day) {
      const e = byDay.get(day) ?? { jobs: 0, tokens: 0 };
      e.jobs += 1;
      e.tokens += num(r.ai_tokens_used);
      byDay.set(day, e);
    }
    const t = String(r.file_type ?? "unknown");
    byType[t] = (byType[t] ?? 0) + 1;
  }

  return {
    company_id: companyId,
    window_days: days,
    totals,
    by_day: [...byDay.entries()].sort().map(([date, v]) => ({ date, jobs: v.jobs, tokens: v.tokens })),
    by_file_type: byType,
  };
}
