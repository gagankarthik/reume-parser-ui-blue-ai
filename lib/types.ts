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

// ── Admin / platform-wide stats ───────────────────────────────────────────────

export interface PlatformCompanyRow {
  company_id: string;
  name: string;
  email?: string;
  plan?: string;
  status?: string;
  jobs: number;
  tokens: number;
  active_keys: number;
  last_active: string;
}

export interface PlatformStats {
  window_days: number;
  companies: { total: number; active: number };
  active_keys: number;
  totals: {
    jobs: number;
    completed: number;
    failed: number;
    ocr_jobs: number;
    tokens_used: number;
    avg_duration_ms: number;
  };
  by_day: { date: string; jobs: number; tokens: number }[];
  companies_list: PlatformCompanyRow[];
}

export interface AdminCompany {
  company_id: string;
  name?: string;
  email?: string;
  plan?: string;
  status?: string;
  created_at?: string;
  active_key_count?: number;
}

export interface AdminLogEntry {
  job_id: string;
  timestamp: string;
  file_type: string;
  status: string;
  duration_ms: number;
  ocr_used: boolean;
  ai_tokens_used: number;
  error_code: string;
}

export interface AdminCompanyDetail {
  company: AdminCompany;
  usage: Usage;
  keys: ApiKeyInfo[];
  webhooks: Webhook[];
  logs: AdminLogEntry[];
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
