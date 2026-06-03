// Browser-side API client. All calls go through the same-origin /api/proxy
// route handler (see app/api/proxy/[...path]/route.ts), which forwards to the
// configured target API with the X-API-Key header. This avoids CORS entirely.

import { getSettings } from "@/lib/settings";
import {
  ApiError,
  type ApiErrorBody,
  type HealthResponse,
  type JobStatusResponse,
  type ParseResponse,
  type Webhook,
  type WebhookCreateRequest,
} from "@/lib/types";

function proxyHeaders(): Record<string, string> {
  const { baseUrl, apiKey } = getSettings();
  return { "x-target-base-url": baseUrl, "x-api-key": apiKey };
}

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!res.ok) {
    const body = parsed as ApiErrorBody | string | null;
    let message = `Request failed (HTTP ${res.status})`;
    if (body && typeof body === "object" && "error" in body && body.error?.detail) {
      message = body.error.detail;
    } else if (typeof body === "string" && body) {
      message = body;
    }
    throw new ApiError(res.status, message, body);
  }

  return parsed as T;
}

const proxy = (path: string) => `/api/proxy/${path.replace(/^\/+/, "")}`;

export async function parseResume(file: File): Promise<ParseResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(proxy("api/v1/resume/parse"), {
    method: "POST",
    headers: proxyHeaders(), // do NOT set Content-Type; the browser sets the boundary
    body: form,
  });
  return handle<ParseResponse>(res);
}

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  const res = await fetch(proxy(`api/v1/resume/job/${jobId}`), {
    headers: proxyHeaders(),
  });
  return handle<JobStatusResponse>(res);
}

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(proxy("api/v1/health"), { headers: proxyHeaders() });
  return handle<HealthResponse>(res);
}

export async function listWebhooks(): Promise<Webhook[]> {
  const res = await fetch(proxy("api/v1/webhooks"), { headers: proxyHeaders() });
  return handle<Webhook[]>(res);
}

export async function createWebhook(payload: WebhookCreateRequest): Promise<Webhook> {
  const res = await fetch(proxy("api/v1/webhooks"), {
    method: "POST",
    headers: { ...proxyHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle<Webhook>(res);
}

export async function deleteWebhook(webhookId: string): Promise<void> {
  const res = await fetch(proxy(`api/v1/webhooks/${webhookId}`), {
    method: "DELETE",
    headers: proxyHeaders(),
  });
  if (!res.ok) {
    await handle(res);
  }
}
