// My usage & token stats (scoped to the signed-in user's company), from DynamoDB.
import { NextRequest } from "next/server";

import { getAccountContext } from "@/lib/bff";
import { getUsage } from "@/lib/dynamo";

export const dynamic = "force-dynamic";

function fail(status: number, detail: string) {
  return Response.json({ error: { detail } }, { status });
}

export async function GET(req: NextRequest) {
  const ctx = await getAccountContext();
  if (!ctx) return fail(401, "Not signed in");
  const days = Number(req.nextUrl.searchParams.get("days") || "30");
  try {
    return Response.json(await getUsage(ctx.companyId, days));
  } catch (err) {
    return fail(500, err instanceof Error ? err.message : "Failed to load usage");
  }
}
