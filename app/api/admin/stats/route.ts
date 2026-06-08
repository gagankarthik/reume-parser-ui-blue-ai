// Platform-wide stats for the admin overview. Restricted to allow-listed
// operator emails (ADMIN_EMAILS) — verified server-side from the Cognito session.
import { NextRequest } from "next/server";

import { isCurrentUserAdmin } from "@/lib/admin";
import { errorStatus, getPlatformStats } from "@/lib/api";

export const dynamic = "force-dynamic";

function fail(status: number, detail: string) {
  return Response.json({ error: { detail } }, { status });
}

export async function GET(req: NextRequest) {
  if (!(await isCurrentUserAdmin())) return fail(403, "Admin access required");

  const days = Number(req.nextUrl.searchParams.get("days") || "30");
  try {
    return Response.json(await getPlatformStats(days));
  } catch (err) {
    return fail(errorStatus(err) || 500, err instanceof Error ? err.message : "Failed to load stats");
  }
}
