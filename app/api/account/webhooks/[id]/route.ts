import { NextRequest } from "next/server";

import { getAccountContext } from "@/lib/bff";
import { deleteWebhook } from "@/lib/dynamo";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const account = await getAccountContext();
  if (!account) return Response.json({ error: { detail: "Not signed in" } }, { status: 401 });
  const { id } = await ctx.params;
  try {
    await deleteWebhook(account.companyId, id);
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { error: { detail: err instanceof Error ? err.message : "Failed to delete webhook" } },
      { status: 500 },
    );
  }
}
