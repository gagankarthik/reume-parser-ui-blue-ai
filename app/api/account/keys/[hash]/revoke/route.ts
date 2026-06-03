// Revoke one of my keys. The BFF confirms the key belongs to my company first.
import { NextRequest } from "next/server";

import { adminFetch, bffConfigured, getAccountContext } from "@/lib/bff";

export const dynamic = "force-dynamic";

function fail(status: number, detail: string) {
  return Response.json({ error: { detail } }, { status });
}

type Ctx = { params: Promise<{ hash: string }> };

export async function POST(_req: NextRequest, ctx: Ctx) {
  if (!bffConfigured()) return fail(500, "Server missing API_BASE_URL or ADMIN_API_TOKEN");
  const account = await getAccountContext();
  if (!account) return fail(401, "Not signed in");

  const { hash } = await ctx.params;

  // Ownership check: the key must belong to this account's company.
  const listRes = await adminFetch(`companies/${encodeURIComponent(account.companyId)}/keys`);
  if (!listRes.ok) return fail(502, "Could not verify key ownership");
  const keys = (await listRes.json()) as Array<{ key_hash: string }>;
  if (!keys.some((k) => k.key_hash === hash)) {
    return fail(404, "Key not found");
  }

  const res = await adminFetch(`keys/${encodeURIComponent(hash)}/revoke`, { method: "POST" });
  return new Response(await res.arrayBuffer(), {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
}
