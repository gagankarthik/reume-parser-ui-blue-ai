// My API keys (scoped to the signed-in user's company), via the backend.
import { createKey, errorStatus, listKeys } from "@/lib/api";
import { getAccountContext } from "@/lib/bff";

export const dynamic = "force-dynamic";

function fail(status: number, detail: string) {
  return Response.json({ error: { detail } }, { status });
}

export async function GET() {
  try {
    const ctx = await getAccountContext();
    if (!ctx) return fail(401, "Not signed in");
    return Response.json(await listKeys(ctx.companyId));
  } catch (err) {
    return fail(errorStatus(err) || 500, err instanceof Error ? err.message : "Failed to list keys");
  }
}

export async function POST() {
  try {
    const ctx = await getAccountContext();
    if (!ctx) return fail(401, "Not signed in");
    return Response.json(await createKey(ctx.companyId), { status: 201 });
  } catch (err) {
    return fail(errorStatus(err) || 500, err instanceof Error ? err.message : "Failed to create key");
  }
}
