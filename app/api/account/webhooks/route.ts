// My webhooks (scoped to the signed-in user's company), direct to DynamoDB.
import { NextRequest } from "next/server";

import { getAccountContext } from "@/lib/bff";
import { createWebhook, listWebhooks } from "@/lib/dynamo";
import type { WebhookEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

function fail(status: number, detail: string) {
  return Response.json({ error: { detail } }, { status });
}

export async function GET() {
  const ctx = await getAccountContext();
  if (!ctx) return fail(401, "Not signed in");
  try {
    return Response.json(await listWebhooks(ctx.companyId));
  } catch (err) {
    return fail(500, err instanceof Error ? err.message : "Failed to list webhooks");
  }
}

export async function POST(req: NextRequest) {
  const ctx = await getAccountContext();
  if (!ctx) return fail(401, "Not signed in");
  let body: { url?: string; events?: WebhookEvent[] };
  try {
    body = await req.json();
  } catch {
    return fail(400, "Invalid JSON body");
  }
  if (!body.url) return fail(422, "url is required");
  try {
    return Response.json(await createWebhook(ctx.companyId, body.url, body.events ?? []), { status: 201 });
  } catch (err) {
    return fail(422, err instanceof Error ? err.message : "Failed to create webhook");
  }
}
