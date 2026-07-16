"use client";

import { useCallback, useEffect, useState } from "react";

import { Badge, Button, Card, ErrorBanner, Input, Label, SectionTitle, Spinner } from "@/components/ui";
import { createWebhook, deleteWebhook, listWebhooks } from "@/lib/account";
import { ApiError, type CreatedWebhook, type Webhook, type WebhookEvent } from "@/lib/types";

const EVENTS: WebhookEvent[] = ["parse.completed", "parse.failed", "batch.completed"];

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

export default function WebhooksPage() {
  const [hooks, setHooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<WebhookEvent[]>(["parse.completed", "parse.failed"]);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<CreatedWebhook | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setHooks(await listWebhooks());
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function toggle(ev: WebhookEvent) {
    setEvents((prev) => (prev.includes(ev) ? prev.filter((x) => x !== ev) : [...prev, ev]));
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || events.length === 0) return;
    setCreating(true);
    setError("");
    setCreated(null);
    try {
      setCreated(await createWebhook(url.trim(), events));
      setUrl("");
      await load();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this webhook?")) return;
    setBusy(id);
    try {
      await deleteWebhook(id);
      await load();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M9 7a3 3 0 1 1 4 2.8L10 15M7 13a3 3 0 1 0 3 3h6M17 13a3 3 0 1 1-2.8 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <div>
          <p className="label-caps text-accent-700">Delivery</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">Webhooks</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Receive signed callbacks when parsing jobs complete. URLs must be public HTTPS.
          </p>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {created && (
        <div className="overflow-hidden rounded-2xl border border-brass-400/50 bg-surface shadow-[0_1px_2px_rgba(10,23,51,0.04),0_16px_40px_-24px_rgba(10,23,51,0.28)]">
          <div className="flex items-center justify-between border-b border-brass-400/30 bg-brass-400/10 px-5 py-3">
            <h3 className="font-display text-sm font-semibold text-ink">Signing secret - copy it now</h3>
            <button onClick={() => setCreated(null)} className="text-sm text-ink-soft hover:text-ink">Dismiss</button>
          </div>
          <div className="p-5">
            <p className="mb-3 text-sm text-ink-soft">
              Verify deliveries with HMAC-SHA256 over <code className="font-mono text-ink">{"{timestamp}.{body}"}</code>. Shown once.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <code className="flex-1 overflow-x-auto rounded-lg border border-line bg-paper px-3 py-2.5 font-mono text-sm text-ink">{created.hmac_secret}</code>
              <Button
                variant="secondary"
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(created.hmac_secret);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <SectionTitle hint="At least one event. HTTPS only.">Add a webhook</SectionTitle>
        <form onSubmit={onCreate} className="space-y-4">
          <div>
            <Label>Endpoint URL</Label>
            <Input type="url" value={url} placeholder="https://your-server.com/hooks/resume" onChange={(e) => setUrl(e.target.value)} required />
          </div>
          <div>
            <Label>Events</Label>
            <div className="flex flex-wrap gap-2.5">
              {EVENTS.map((ev) => {
                const on = events.includes(ev);
                return (
                  <label
                    key={ev}
                    className={
                      "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors " +
                      (on ? "border-accent-300 bg-accent-50" : "border-line-strong hover:border-accent-300")
                    }
                  >
                    <input type="checkbox" checked={on} onChange={() => toggle(ev)} className="accent-accent-600" />
                    <code className="font-mono text-xs text-ink">{ev}</code>
                  </label>
                );
              })}
            </div>
          </div>
          <Button type="submit" loading={creating} disabled={!url.trim() || events.length === 0}>Add webhook</Button>
        </form>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle>Registered webhooks</SectionTitle>
          <Button variant="ghost" onClick={load} type="button">Refresh</Button>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-ink-soft"><Spinner /> Loading...</div>
        ) : hooks.length === 0 ? (
          <p className="text-sm text-ink-soft">No webhooks registered yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {hooks.map((h) => (
              <li key={h.webhook_id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
                <div className="min-w-0">
                  <div className="truncate font-mono text-sm text-ink">{h.url}</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {h.events.map((ev) => (
                      <Badge key={ev} tone="info">{ev}</Badge>
                    ))}
                    <span className="text-xs text-ink-soft">· {h.created_at ? new Date(h.created_at).toLocaleDateString() : ""}</span>
                  </div>
                </div>
                <Button variant="danger" loading={busy === h.webhook_id} onClick={() => onDelete(h.webhook_id)} type="button">Delete</Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
