"use client";

import { useCallback, useEffect, useState } from "react";

import { Badge, Button, Card, ErrorBanner, SectionTitle, Spinner } from "@/components/ui";
import { createKey, listKeys, revokeKey } from "@/lib/account";
import { ApiError, type ApiKeyInfo, type IssuedKey } from "@/lib/types";

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKeyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [issued, setIssued] = useState<IssuedKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [busyHash, setBusyHash] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setKeys(await listKeys());
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate() {
    setCreating(true);
    setError("");
    setIssued(null);
    try {
      setIssued(await createKey());
      await load();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setCreating(false);
    }
  }

  async function onRevoke(hash: string) {
    if (!window.confirm("Revoke this key? It stops working immediately.")) return;
    setBusyHash(hash);
    try {
      await revokeKey(hash);
      await load();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusyHash(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">API keys</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Generate keys to authenticate your requests to the parsing API.
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      {issued && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-amber-800 dark:text-amber-300">New API key — copy it now</h3>
            <button onClick={() => setIssued(null)} className="text-sm text-amber-700 hover:underline dark:text-amber-400">Dismiss</button>
          </div>
          <p className="mb-3 text-sm text-amber-700 dark:text-amber-400">This is the only time the full key is shown.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded-lg bg-white px-3 py-2 font-mono text-sm dark:bg-zinc-900">{issued.api_key}</code>
            <Button
              variant="secondary"
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(issued.api_key);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Copied ✓" : "Copy"}
            </Button>
          </div>
        </div>
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle>Your keys</SectionTitle>
          <Button onClick={onCreate} loading={creating} type="button">Generate key</Button>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-zinc-500"><Spinner /> Loading…</div>
        ) : keys.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No keys yet. Generate one to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-2 pr-4 font-medium">Key</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Created</th>
                  <th className="py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.key_hash} className="border-b border-zinc-100 dark:border-zinc-800/60">
                    <td className="py-2.5 pr-4 font-mono text-zinc-800 dark:text-zinc-200">{k.key_prefix}</td>
                    <td className="py-2.5 pr-4"><Badge tone={k.status === "active" ? "success" : "danger"}>{k.status}</Badge></td>
                    <td className="py-2.5 pr-4 text-zinc-600 dark:text-zinc-400">{k.created_at ? new Date(k.created_at).toLocaleDateString() : "—"}</td>
                    <td className="py-2.5">
                      {k.status === "active" && (
                        <Button variant="secondary" loading={busyHash === k.key_hash} onClick={() => onRevoke(k.key_hash)} type="button">Revoke</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
