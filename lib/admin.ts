// Admin gating by email allow-list. The admin area exposes every customer's
// usage, so it is restricted to operator emails listed in ADMIN_EMAILS
// (comma-separated, server-side only — never exposed to the browser).

import { getSessionClaims } from "@/lib/session";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** True if the given email is an allow-listed operator. */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

/** True if the current verified session belongs to an admin. Server-only. */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const claims = await getSessionClaims();
  return isAdminEmail(claims?.email);
}
