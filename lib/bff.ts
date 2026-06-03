// Server-side BFF: verify the Cognito session, then resolve (and onboard) the
// user's company via the backend admin API (single source of truth).

import { resolveCompanyId } from "@/lib/api";
import { getSessionClaims, type SessionClaims } from "@/lib/session";

/** Returns {claims, companyId} for the signed-in user, or null if not signed in. */
export async function getAccountContext(): Promise<{ claims: SessionClaims; companyId: string } | null> {
  const claims = await getSessionClaims();
  if (!claims) return null;
  const companyId = await resolveCompanyId(claims.email, claims.name);
  return { claims, companyId };
}
