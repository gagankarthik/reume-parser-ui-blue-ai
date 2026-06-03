// My API keys (scoped to the signed-in user's company via the BFF).
import { adminFetch, bffConfigured, getAccountContext } from "@/lib/bff";

export const dynamic = "force-dynamic";

function fail(status: number, detail: string) {
  return Response.json({ error: { detail } }, { status });
}

export async function GET() {
  if (!bffConfigured()) return fail(500, "Server missing API_BASE_URL or ADMIN_API_TOKEN");
  const ctx = await getAccountContext();
  if (!ctx) return fail(401, "Not signed in");
  const res = await adminFetch(`companies/${encodeURIComponent(ctx.companyId)}/keys`);
  return new Response(await res.arrayBuffer(), {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
}

export async function POST() {
  if (!bffConfigured()) return fail(500, "Server missing API_BASE_URL or ADMIN_API_TOKEN");
  const ctx = await getAccountContext();
  if (!ctx) return fail(401, "Not signed in");
  const res = await adminFetch(`companies/${encodeURIComponent(ctx.companyId)}/keys`, { method: "POST" });
  return new Response(await res.arrayBuffer(), {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
}
