"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, ErrorBanner, SectionTitle } from "@/components/ui";
import { createWebhook, deleteWebhook, listWebhooks } from "@/lib/api";
import { getSettings } from "@/lib/settings";
import { ApiError, type Webhook, type WebhookCreateRequest } from "@/lib/types";
import { WebhookForm } from "@/components/webhooks/WebhookForm";
import { WebhookList } from "@/components/webhooks/WebhookList";
import { SecretCallout } from "@/components/webhooks/SecretCallout";

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong.";
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(true);

  const load = useCallback(async () => {
    if (!getSettings().apiKey) {
      setHasApiKey(false);
      setLoading(false);
      return;
    }
    setHasApiKey(true);
    setLoading(true);
    setError(null);
    try {
      const data = await listWebhooks();
      setWebhooks(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(payload: WebhookCreateRequest) {
    if (!getSettings().apiKey) {
      setHasApiKey(false);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const created = await createWebhook(payload);
      if (created.hmac_secret) {
        setNewSecret(created.hmac_secret);
      }
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(webhook: Webhook) {
    if (!window.confirm(`Delete webhook for ${webhook.url}?`)) return;
    setDeletingId(webhook.webhook_id);
    setError(null);
    try {
      await deleteWebhook(webhook.webhook_id);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Webhooks</h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Register endpoints to receive resume-parser events. The HMAC secret is
          shown only once, at creation time.
        </p>
      </div>

      {!hasApiKey && (
        <ErrorBanner
          message="No API key set — add one in Settings"
        />
      )}
      {!hasApiKey && (
        <p className="text-sm">
          <Link
            href="/settings"
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Go to Settings →
          </Link>
        </p>
      )}

      {error && <ErrorBanner message={error} />}

      {newSecret && (
        <SecretCallout secret={newSecret} onDismiss={() => setNewSecret(null)} />
      )}

      <Card>
        <SectionTitle hint="Pick a delivery URL and the events you want to receive.">
          Create webhook
        </SectionTitle>
        <WebhookForm onSubmit={handleCreate} submitting={submitting} />
      </Card>

      <Card>
        <SectionTitle hint="Endpoints currently registered for your API key.">
          Registered webhooks
        </SectionTitle>
        <WebhookList
          webhooks={webhooks}
          loading={loading && hasApiKey}
          deletingId={deletingId}
          onDelete={handleDelete}
        />
      </Card>
    </div>
  );
}
