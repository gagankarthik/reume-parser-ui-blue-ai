"use client";

import { useState } from "react";
import { Button, Input, Label, cn } from "@/components/ui";
import type { WebhookEvent } from "@/lib/types";

const EVENT_OPTIONS: { value: WebhookEvent; label: string; description: string }[] = [
  {
    value: "parse.completed",
    label: "parse.completed",
    description: "A single resume parse job finished successfully.",
  },
  {
    value: "parse.failed",
    label: "parse.failed",
    description: "A single resume parse job failed.",
  },
  {
    value: "batch.completed",
    label: "batch.completed",
    description: "A batch of resume parse jobs finished.",
  },
];

export function WebhookForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (payload: { url: string; events: WebhookEvent[] }) => void | Promise<void>;
  submitting: boolean;
}) {
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  function toggleEvent(event: WebhookEvent) {
    setEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setLocalError("A delivery URL is required.");
      return;
    }
    if (events.length === 0) {
      setLocalError("Select at least one event.");
      return;
    }
    setLocalError(null);
    void onSubmit({ url: trimmed, events });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label>Delivery URL</Label>
        <Input
          type="url"
          inputMode="url"
          placeholder="https://example.com/hooks/resume-parser"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Events</Label>
        <div className="space-y-2">
          {EVENT_OPTIONS.map((opt) => {
            const checked = events.includes(opt.value);
            return (
              <label
                key={opt.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                  checked
                    ? "border-indigo-300 bg-indigo-50/60 dark:border-indigo-800 dark:bg-indigo-950/30"
                    : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/50",
                )}
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800"
                  checked={checked}
                  onChange={() => toggleEvent(opt.value)}
                />
                <span className="min-w-0">
                  <span className="block font-mono text-sm text-zinc-900 dark:text-zinc-100">
                    {opt.label}
                  </span>
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                    {opt.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {localError && (
        <p className="text-sm text-red-600 dark:text-red-400">{localError}</p>
      )}

      <Button type="submit" variant="primary" loading={submitting}>
        Create webhook
      </Button>
    </form>
  );
}
