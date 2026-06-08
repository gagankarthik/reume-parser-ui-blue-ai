// Admin org detail (GET) and update (PATCH). Allow-listed operators only.
import { NextRequest } from "next/server";

import { isCurrentUserAdmin } from "@/lib/admin";
import { errorStatus, getCompanyDetail, updateCompany } from "@/lib/api";

export const dynamic = "force-dynamic";

function fail(status: number, detail: string) {
  return Response.json({ error: { detail } }, { status });
}

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  if (!(await isCurrentUserAdmin())) return fail(403, "Admin access required");
  const { id } = await ctx.params;
  const days = Number(req.nextUrl.searchParams.get("days") || "30");
  try {
    return Response.json(await getCompanyDetail(id, days));
  } catch (err) {
    return fail(errorStatus(err) || 500, err instanceof Error ? err.message : "Failed to load company");
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!(await isCurrentUserAdmin())) return fail(403, "Admin access required");
  const { id } = await ctx.params;

  let body: { plan?: unknown; status?: unknown };
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const patch: { plan?: string; status?: string } = {};
  if (typeof body.plan === "string") patch.plan = body.plan;
  if (typeof body.status === "string") patch.status = body.status;
  if (patch.plan === undefined && patch.status === undefined) {
    return fail(422, "Provide plan and/or status to update");
  }

  try {
    return Response.json(await updateCompany(id, patch));
  } catch (err) {
    return fail(errorStatus(err) || 500, err instanceof Error ? err.message : "Failed to update company");
  }
}
