import { NextRequest } from "next/server";

import { deleteWebhook, errorStatus } from "@/lib/api";
import { getAccountContext } from "@/lib/bff";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const account = await getAccountContext();
    if (!account) return Response.json({ error: { detail: "Not signed in" } }, { status: 401 });
    await deleteWebhook(account.companyId, id);
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { error: { detail: err instanceof Error ? err.message : "Failed to delete webhook" } },
      { status: errorStatus(err) || 500 },
    );
  }
}
