// Server-side BFF helpers: call the backend admin API with the server-held admin
// token, and resolve (or onboard) the company for the signed-in Cognito user.

import { getSessionClaims, type SessionClaims } from "@/lib/session";

const BASE = (process.env.API_BASE_URL || "").replace(/\/+$/, "");
const TOKEN = process.env.ADMIN_API_TOKEN || "";

export function bffConfigured(): boolean {
  return Boolean(BASE && TOKEN);
}

export async function adminFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("X-Admin-Token", TOKEN);
  return fetch(`${BASE}/api/v1/admin/${path.replace(/^\/+/, "")}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

async function lookupByEmail(email: string): Promise<string | null> {
  const res = await adminFetch(`companies/lookup?email=${encodeURIComponent(email)}`);
  if (res.ok) return (await res.json()).company_id as string;
  if (res.status === 404) return null;
  throw new Error(`Lookup failed (HTTP ${res.status})`);
}

/** Find the company for this email, creating it on first sign-in (onboarding). */
export async function resolveCompanyId(claims: SessionClaims): Promise<string> {
  const existing = await lookupByEmail(claims.email);
  if (existing) return existing;

  // First sign-in → create the company (onboard).
  const created = await adminFetch("companies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: claims.name || claims.email, email: claims.email }),
  });
  if (created.ok) return (await created.json()).company_id as string;

  // 409/422 means a concurrent first-load already created it — re-look-up.
  if (created.status === 409 || created.status === 422) {
    const afterRace = await lookupByEmail(claims.email);
    if (afterRace) return afterRace;
  }
  throw new Error(`Onboarding failed (HTTP ${created.status})`);
}

/** Returns {claims, companyId} for the signed-in user, or null if not signed in. */
export async function getAccountContext(): Promise<{ claims: SessionClaims; companyId: string } | null> {
  const claims = await getSessionClaims();
  if (!claims) return null;
  const companyId = await resolveCompanyId(claims);
  return { claims, companyId };
}
