// Browser-side client: Cognito auth + account data (/api/account/*).

import * as cognito from "@/lib/cognito";
import {
  ApiError,
  type ApiErrorBody,
  type ApiKeyInfo,
  type CreatedWebhook,
  type IssuedKey,
  type PlatformStats,
  type Usage,
  type Webhook,
  type WebhookEvent,
} from "@/lib/types";

export interface Me {
  email: string;
  name: string | null;
  company: { company_id: string; name?: string; email?: string; plan?: string; status?: string; created_at?: string };
  key_count: number;
  active_key_count: number;
}

async function handle<T>(res: Response): Promise<T> {
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
    const body = parsed as ApiErrorBody | string | null;
    let message = `Request failed (HTTP ${res.status})`;
    if (body && typeof body === "object") message = body.error?.detail || body.detail || message;
    else if (typeof body === "string" && body) message = body;
    throw new ApiError(res.status, message);
  }
  return parsed as T;
}

// ── Auth (Cognito) ─────────────────────────────────────────────────────────────

export const signUp = cognito.signUp;
export const confirmSignUp = cognito.confirmSignUp;
export const resendCode = cognito.resendCode;

/** Sign in via Cognito, then establish the server session cookie. */
export async function login(email: string, password: string): Promise<void> {
  const idToken = await cognito.signIn(email, password);
  await handle(
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }),
  );
}

export async function logout(): Promise<void> {
  cognito.signOutLocal();
  await fetch("/api/auth/logout", { method: "POST" });
}

// ── Account data ────────────────────────────────────────────────────────────

export async function listKeys(): Promise<ApiKeyInfo[]> {
  return handle<ApiKeyInfo[]>(await fetch("/api/account/keys"));
}

export async function createKey(): Promise<IssuedKey> {
  return handle<IssuedKey>(await fetch("/api/account/keys", { method: "POST" }));
}

export async function revokeKey(keyHash: string): Promise<void> {
  await handle(await fetch(`/api/account/keys/${encodeURIComponent(keyHash)}/revoke`, { method: "POST" }));
}

export async function getUsage(days = 30): Promise<Usage> {
  return handle<Usage>(await fetch(`/api/account/usage?days=${days}`));
}

export async function getMe(): Promise<Me> {
  return handle<Me>(await fetch("/api/account/me"));
}

// ── Admin (allow-listed operators only; the route enforces it) ────────────────

export async function getPlatformStats(days = 30): Promise<PlatformStats> {
  return handle<PlatformStats>(await fetch(`/api/admin/stats?days=${days}`));
}

// ── Webhooks ──────────────────────────────────────────────────────────────────

export async function listWebhooks(): Promise<Webhook[]> {
  return handle<Webhook[]>(await fetch("/api/account/webhooks"));
}

export async function createWebhook(url: string, events: WebhookEvent[]): Promise<CreatedWebhook> {
  return handle<CreatedWebhook>(
    await fetch("/api/account/webhooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, events }),
    }),
  );
}

export async function deleteWebhook(webhookId: string): Promise<void> {
  await handle(await fetch(`/api/account/webhooks/${encodeURIComponent(webhookId)}`, { method: "DELETE" }));
}
