// Revoke one of my keys (ownership enforced in lib/api).
import { NextRequest } from "next/server";

import { errorStatus, revokeKey } from "@/lib/api";
import { getAccountContext } from "@/lib/bff";

export const dynamic = "force-dynamic";

function fail(status: number, detail: string) {
  return Response.json({ error: { detail } }, { status });
}

type Ctx = { params: Promise<{ hash: string }> };

export async function POST(_req: NextRequest, ctx: Ctx) {
  const { hash } = await ctx.params;
  try {
    const account = await getAccountContext();
    if (!account) return fail(401, "Not signed in");
    await revokeKey(account.companyId, hash);
    return Response.json({ key_hash: hash, status: "revoked" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to revoke key";
    return fail(msg === "Key not found" ? 404 : errorStatus(err) || 500, msg);
  }
}
