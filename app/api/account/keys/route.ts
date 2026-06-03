// My API keys (scoped to the signed-in user's company), direct to DynamoDB.
import { getAccountContext } from "@/lib/bff";
import { createKey, listKeys } from "@/lib/dynamo";

export const dynamic = "force-dynamic";

function fail(status: number, detail: string) {
  return Response.json({ error: { detail } }, { status });
}

export async function GET() {
  const ctx = await getAccountContext();
  if (!ctx) return fail(401, "Not signed in");
  try {
    return Response.json(await listKeys(ctx.companyId));
  } catch (err) {
    return fail(500, err instanceof Error ? err.message : "Failed to list keys");
  }
}

export async function POST() {
  const ctx = await getAccountContext();
  if (!ctx) return fail(401, "Not signed in");
  try {
    return Response.json(await createKey(ctx.companyId), { status: 201 });
  } catch (err) {
    return fail(500, err instanceof Error ? err.message : "Failed to create key");
  }
}
