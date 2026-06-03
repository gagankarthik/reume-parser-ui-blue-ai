// Revoke one of my keys (ownership enforced in lib/dynamo).
import { NextRequest } from "next/server";

import { getAccountContext } from "@/lib/bff";
import { revokeKey } from "@/lib/dynamo";

export const dynamic = "force-dynamic";

function fail(status: number, detail: string) {
  return Response.json({ error: { detail } }, { status });
}

type Ctx = { params: Promise<{ hash: string }> };

export async function POST(_req: NextRequest, ctx: Ctx) {
  const account = await getAccountContext();
  if (!account) return fail(401, "Not signed in");
  const { hash } = await ctx.params;
  try {
    await revokeKey(account.companyId, hash);
    return Response.json({ key_hash: hash, status: "revoked" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to revoke key";
    return fail(msg === "Key not found" ? 404 : 500, msg);
  }
}
