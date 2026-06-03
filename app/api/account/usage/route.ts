// My usage & token stats (scoped to the signed-in user's company).
import { NextRequest } from "next/server";

import { adminFetch, bffConfigured, getAccountContext } from "@/lib/bff";

export const dynamic = "force-dynamic";

function fail(status: number, detail: string) {
  return Response.json({ error: { detail } }, { status });
}

export async function GET(req: NextRequest) {
  if (!bffConfigured()) return fail(500, "Server missing API_BASE_URL or ADMIN_API_TOKEN");
  const ctx = await getAccountContext();
  if (!ctx) return fail(401, "Not signed in");
  const days = req.nextUrl.searchParams.get("days") || "30";
  const res = await adminFetch(`companies/${encodeURIComponent(ctx.companyId)}/usage?days=${encodeURIComponent(days)}`);
  return new Response(await res.arrayBuffer(), {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
}
