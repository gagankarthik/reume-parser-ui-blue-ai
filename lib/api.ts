// Server-side data layer: the product app calls the Resume Parser backend's
// server-to-server admin API (/api/v1/admin/*) instead of touching DynamoDB.
// The backend owns the key/webhook scheme and is the single source of truth.
//
// The admin token is held server-side only (never sent to the browser):
//   - BACKEND_API_URL   base URL of the backend, e.g. https://api.your-domain.com
//   - ADMIN_API_TOKEN   shared secret sent as the X-Admin-Token header

import type {
  AdminCompany,
  AdminCompanyDetail,
  AdminLogEntry,
  ApiKeyInfo,
  CreatedWebhook,
  IssuedKey,
  PlatformStats,
  Usage,
  Webhook,
  WebhookEvent,
} from "@/lib/types";

const BASE = (process.env.BACKEND_API_URL || "http://localhost:8000").replace(/\/+$/, "");
const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || "";

interface BackendError {
  error?: { detail?: string; status_code?: number };
  detail?: string;
}

/** Call the backend admin API. Throws Error(detail) with the backend's status on failure. */
async function req<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<{ status: number; data: T }> {
  if (!ADMIN_TOKEN) throw new Error("ADMIN_API_TOKEN is not configured");

  const res = await fetch(`${BASE}/api/v1/admin${path}`, {
    method,
    headers: {
      "X-Admin-Token": ADMIN_TOKEN,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!res.ok) {
    const b = parsed as BackendError | string | null;
    let detail = `Backend request failed (HTTP ${res.status})`;
    if (b && typeof b === "object") detail = b.error?.detail || b.detail || detail;
    else if (typeof b === "string" && b) detail = b;
    const err = new Error(detail) as Error & { status: number };
    err.status = res.status;
    throw err;
  }

  return { status: res.status, data: parsed as T };
}

/** Extract the HTTP status carried on an error thrown by req(), or 0 if none. */
export function errorStatus(err: unknown): number {
  return err && typeof err === "object" && "status" in err ? Number((err as { status: number }).status) : 0;
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

export async function getCompany(companyId: string): Promise<CompanyRecord | null> {
  try {
    const { data } = await req<CompanyRecord>("GET", `/companies/${encodeURIComponent(companyId)}`);
    return data;
  } catch (err) {
    if (errorStatus(err) === 404) return null;
    throw err;
  }
}

async function lookupByEmail(email: string): Promise<CompanyRecord | null> {
  try {
    const { data } = await req<CompanyRecord>("GET", `/companies/lookup?email=${encodeURIComponent(email)}`);
    return data;
  } catch (err) {
    if (errorStatus(err) === 404) return null;
    throw err;
  }
}

/** Resolve the company for a signed-in user, creating it on first sign-in. */
export async function resolveCompanyId(email: string, name?: string): Promise<string> {
  const existing = await lookupByEmail(email);
  if (existing?.company_id) return existing.company_id;

  try {
    const { data } = await req<CompanyRecord>("POST", "/companies", { name: name || email, email });
    return data.company_id;
  } catch (err) {
    // Concurrent first-load already created it — re-look-up.
    if (errorStatus(err) === 422) {
      const after = await lookupByEmail(email);
      if (after?.company_id) return after.company_id;
    }
    throw err instanceof Error ? err : new Error("Onboarding failed");
  }
}

// ── API keys ──────────────────────────────────────────────────────────────────

export async function listKeys(companyId: string): Promise<ApiKeyInfo[]> {
  const { data } = await req<ApiKeyInfo[]>("GET", `/companies/${encodeURIComponent(companyId)}/keys`);
  const items = (data ?? []).map((k) => ({
    key_hash: String(k.key_hash),
    key_prefix: String(k.key_prefix ?? ""),
    status: String(k.status ?? "active"),
    created_at: String(k.created_at ?? ""),
  }));
  items.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return items;
}

export async function createKey(companyId: string): Promise<IssuedKey> {
  const { data } = await req<IssuedKey>("POST", `/companies/${encodeURIComponent(companyId)}/keys`);
  return data;
}

export async function revokeKey(companyId: string, keyHash: string): Promise<void> {
  // Enforce ownership: only revoke a key that belongs to this company.
  const owned = await listKeys(companyId);
  if (!owned.some((k) => k.key_hash === keyHash)) throw new Error("Key not found");
  await req("POST", `/keys/${encodeURIComponent(keyHash)}/revoke`);
}

// ── Webhooks ──────────────────────────────────────────────────────────────────

const VALID_EVENTS: WebhookEvent[] = ["parse.completed", "parse.failed", "batch.completed"];

/** Lightweight SSRF/scheme guard for fast feedback. The backend re-validates. */
function validateWebhookUrl(url: string): void {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    throw new Error("Webhook URL is not a valid URL");
  }
  if (u.protocol !== "https:") throw new Error("Webhook URL must use HTTPS");
  // URL.hostname keeps IPv6 brackets ("[::1]") — strip them so the checks see the raw address.
  const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host === "0.0.0.0" ||
    host.endsWith(".local") ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
    // IPv6: loopback, unspecified, link-local (fe80::/10), unique-local (fc00::/7)
    host === "::1" ||
    host === "::" ||
    /^fe[89ab]/.test(host) ||
    /^f[cd]/.test(host)
  ) {
    throw new Error("Webhook URL must be a public address");
  }
}

export async function listWebhooks(companyId: string): Promise<Webhook[]> {
  const { data } = await req<Webhook[]>("GET", `/companies/${encodeURIComponent(companyId)}/webhooks`);
  return (data ?? []).map((w) => ({
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
  const { data } = await req<CreatedWebhook>(
    "POST",
    `/companies/${encodeURIComponent(companyId)}/webhooks`,
    { url, events: clean },
  );
  return data;
}

export async function deleteWebhook(companyId: string, webhookId: string): Promise<void> {
  await req(
    "DELETE",
    `/companies/${encodeURIComponent(companyId)}/webhooks/${encodeURIComponent(webhookId)}`,
  );
}

// ── Usage / stats ─────────────────────────────────────────────────────────────

export async function getUsage(companyId: string, days = 30): Promise<Usage> {
  const d = Math.max(1, Math.min(Number.isFinite(days) ? days : 30, 365));
  const { data } = await req<Usage>("GET", `/companies/${encodeURIComponent(companyId)}/usage?days=${d}`);
  return data;
}

// ── Platform-wide stats (admin) ───────────────────────────────────────────────

/** Aggregate usage across ALL companies — for the admin overview. */
export async function getPlatformStats(days = 30): Promise<PlatformStats> {
  const d = Math.max(1, Math.min(Number.isFinite(days) ? days : 30, 365));
  const { data } = await req<PlatformStats>("GET", `/stats?days=${d}`);
  return data;
}

/** Update a company's plan and/or status (activate/deactivate). */
export async function updateCompany(
  companyId: string,
  patch: { plan?: string; status?: string },
): Promise<AdminCompany> {
  const { data } = await req<AdminCompany>(
    "PATCH",
    `/companies/${encodeURIComponent(companyId)}`,
    patch,
  );
  return data;
}

/** Recent activity logs for one company (content-free audit entries). */
export async function getCompanyLogs(companyId: string, days = 30, limit = 100): Promise<AdminLogEntry[]> {
  const d = Math.max(1, Math.min(Number.isFinite(days) ? days : 30, 365));
  const { data } = await req<AdminLogEntry[]>(
    "GET",
    `/companies/${encodeURIComponent(companyId)}/logs?days=${d}&limit=${Math.max(1, Math.min(Number.isFinite(limit) ? limit : 100, 500))}`,
  );
  return data ?? [];
}

/** Everything the admin org-detail page needs, assembled in one round of calls. */
export async function getCompanyDetail(companyId: string, days = 30): Promise<AdminCompanyDetail> {
  const [company, usage, keys, webhooks, logs] = await Promise.all([
    getCompany(companyId),
    getUsage(companyId, days),
    listKeys(companyId),
    listWebhooks(companyId),
    getCompanyLogs(companyId, days),
  ]);
  if (!company) {
    const err = new Error("Company not found") as Error & { status: number };
    err.status = 404;
    throw err;
  }
  return { company, usage, keys, webhooks, logs };
}
