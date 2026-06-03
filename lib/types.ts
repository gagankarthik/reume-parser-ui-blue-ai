// Product-platform types (account, API keys, usage stats).

export interface Account {
  company_id: string;
  name?: string;
  email?: string;
  plan?: string;
  status?: string;
  created_at?: string;
}

export interface ApiKeyInfo {
  key_hash: string; // opaque handle used for revoke
  key_prefix: string;
  status: string;
  created_at: string;
}

export interface IssuedKey {
  api_key: string; // shown once
  key_prefix: string;
  status: string;
  created_at: string;
}

export interface UsageByDay {
  date: string;
  jobs: number;
  tokens: number;
}

export interface Usage {
  company_id: string;
  window_days: number;
  totals: {
    jobs: number;
    completed: number;
    failed: number;
    ocr_jobs: number;
    tokens_used: number;
    avg_duration_ms: number;
  };
  by_day: UsageByDay[];
  by_file_type: Record<string, number>;
}

export type WebhookEvent = "parse.completed" | "parse.failed" | "batch.completed";

export interface Webhook {
  webhook_id: string;
  url: string;
  events: WebhookEvent[];
  status: string;
  created_at: string;
}

export interface CreatedWebhook extends Webhook {
  hmac_secret: string; // shown once
}

export interface ApiErrorBody {
  error?: { detail?: string };
  detail?: string;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
