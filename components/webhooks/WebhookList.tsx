"use client";

import { Badge, Button, Spinner } from "@/components/ui";
import type { Webhook } from "@/lib/types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function WebhookRow({
  webhook,
  onDelete,
  deleting,
}: {
  webhook: Webhook;
  onDelete: (webhook: Webhook) => void;
  deleting: boolean;
}) {
  const isActive = webhook.status.toLowerCase() === "active";
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <code className="block min-w-0 truncate font-mono text-sm text-zinc-900 dark:text-zinc-100">
            {webhook.url}
          </code>
          <Badge tone={isActive ? "success" : "neutral"}>{webhook.status}</Badge>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {webhook.events.map((event) => (
            <Badge key={event} tone="info">
              {event}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Created {formatDate(webhook.created_at)}
        </p>
      </div>
      <Button
        variant="danger"
        loading={deleting}
        onClick={() => onDelete(webhook)}
        className="shrink-0"
      >
        Delete
      </Button>
    </div>
  );
}

export function WebhookList({
  webhooks,
  loading,
  deletingId,
  onDelete,
}: {
  webhooks: Webhook[];
  loading: boolean;
  deletingId: string | null;
  onDelete: (webhook: Webhook) => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-zinc-500 dark:text-zinc-400">
        <Spinner />
        Loading webhooks…
      </div>
    );
  }

  if (webhooks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 py-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        No webhooks registered yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {webhooks.map((webhook) => (
        <WebhookRow
          key={webhook.webhook_id}
          webhook={webhook}
          onDelete={onDelete}
          deleting={deletingId === webhook.webhook_id}
        />
      ))}
    </div>
  );
}
