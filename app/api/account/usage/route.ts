// My usage & token stats (scoped to the signed-in user's company), via the backend.
import { NextRequest } from "next/server";

import { errorStatus, getUsage } from "@/lib/api";
import { getAccountContext } from "@/lib/bff";

export const dynamic = "force-dynamic";

function fail(status: number, detail: string) {
  return Response.json({ error: { detail } }, { status });
}

export async function GET(req: NextRequest) {
  const days = Number(req.nextUrl.searchParams.get("days") || "30");
  try {
    const ctx = await getAccountContext();
    if (!ctx) return fail(401, "Not signed in");
    return Response.json(await getUsage(ctx.companyId, days));
  } catch (err) {
    return fail(errorStatus(err) || 500, err instanceof Error ? err.message : "Failed to load usage");
  }
}
