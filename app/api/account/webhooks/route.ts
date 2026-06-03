// My webhooks (scoped to the signed-in user's company), via the backend.
import { NextRequest } from "next/server";

import { createWebhook, errorStatus, listWebhooks } from "@/lib/api";
import { getAccountContext } from "@/lib/bff";
import type { WebhookEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

function fail(status: number, detail: string) {
  return Response.json({ error: { detail } }, { status });
}

export async function GET() {
  try {
    const ctx = await getAccountContext();
    if (!ctx) return fail(401, "Not signed in");
    return Response.json(await listWebhooks(ctx.companyId));
  } catch (err) {
    return fail(errorStatus(err) || 500, err instanceof Error ? err.message : "Failed to list webhooks");
  }
}

export async function POST(req: NextRequest) {
  let body: { url?: string; events?: WebhookEvent[] };
  try {
    body = await req.json();
  } catch {
    return fail(400, "Invalid JSON body");
  }
  if (!body.url) return fail(422, "url is required");
  try {
    const ctx = await getAccountContext();
    if (!ctx) return fail(401, "Not signed in");
    return Response.json(await createWebhook(ctx.companyId, body.url, body.events ?? []), { status: 201 });
  } catch (err) {
    return fail(errorStatus(err) || 422, err instanceof Error ? err.message : "Failed to create webhook");
  }
}
