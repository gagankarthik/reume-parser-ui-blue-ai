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

/** Find the company for this email, creating it on first sign-in (onboarding). */
export async function resolveCompanyId(claims: SessionClaims): Promise<string> {
  const lookup = await adminFetch(`companies/lookup?email=${encodeURIComponent(claims.email)}`);
  if (lookup.ok) {
    return (await lookup.json()).company_id as string;
  }
  if (lookup.status !== 404) {
    throw new Error(`Lookup failed (HTTP ${lookup.status})`);
  }
  // First sign-in → create the company (onboard).
  const created = await adminFetch("companies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: claims.name || claims.email, email: claims.email }),
  });
  if (!created.ok) {
    throw new Error(`Onboarding failed (HTTP ${created.status})`);
  }
  return (await created.json()).company_id as string;
}

/** Returns {claims, companyId} for the signed-in user, or null if not signed in. */
export async function getAccountContext(): Promise<{ claims: SessionClaims; companyId: string } | null> {
  const claims = await getSessionClaims();
  if (!claims) return null;
  const companyId = await resolveCompanyId(claims);
  return { claims, companyId };
}
