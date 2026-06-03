// Current account profile: Cognito identity + company record + key count.
import { getAccountContext } from "@/lib/bff";
import { getCompany, listKeys } from "@/lib/dynamo";

export const dynamic = "force-dynamic";

export async function GET() {
  const ctx = await getAccountContext();
  if (!ctx) return Response.json({ error: { detail: "Not signed in" } }, { status: 401 });
  try {
    const [company, keys] = await Promise.all([getCompany(ctx.companyId), listKeys(ctx.companyId)]);
    return Response.json({
      email: ctx.claims.email,
      name: ctx.claims.name ?? company?.name ?? null,
      company: company ?? { company_id: ctx.companyId },
      key_count: keys.length,
      active_key_count: keys.filter((k) => k.status === "active").length,
    });
  } catch (err) {
    return Response.json(
      { error: { detail: err instanceof Error ? err.message : "Failed to load account" } },
      { status: 500 },
    );
  }
}
