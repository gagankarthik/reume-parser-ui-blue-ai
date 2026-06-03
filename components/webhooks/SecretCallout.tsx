"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function SecretCallout({
  secret,
  onDismiss,
}: {
  secret: string;
  onDismiss: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            Webhook created — copy your HMAC secret now
          </h3>
          <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
            Save this secret now — it cannot be retrieved again.
          </p>
        </div>
        <Button variant="ghost" onClick={onDismiss} aria-label="Dismiss secret">
          Dismiss
        </Button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-lg border border-amber-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 dark:border-amber-800 dark:bg-zinc-900 dark:text-zinc-100">
          {secret}
        </code>
        <Button variant="secondary" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
