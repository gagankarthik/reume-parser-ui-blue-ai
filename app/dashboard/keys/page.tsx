"use client";

import { useCallback, useEffect, useState } from "react";

import { Badge, Button, Card, ErrorBanner, SectionTitle, Spinner } from "@/components/ui";
import { createKey, listKeys, revokeKey } from "@/lib/account";
import { API_BASE, AUTH_HEADER, PARSE_ENDPOINT } from "@/lib/config";
import { ApiError, type ApiKeyInfo, type IssuedKey } from "@/lib/types";

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

/** Quote a CSV field only when it contains a comma, quote, or newline. */
function csvField(v: string): string {
  return /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** Download the issued key + integration details as a .csv file. */
function downloadKeyCsv(key: IssuedKey): void {
  const rows: [string, string][] = [
    ["name", "value"],
    ["api_key", key.api_key],
    ["base_url", API_BASE],
    ["auth_header", AUTH_HEADER],
    ["parse_endpoint", PARSE_ENDPOINT],
    ["created_at", key.created_at],
  ];
  const csv = rows.map((r) => r.map(csvField).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `blue-iq-api-key-${key.key_prefix.replace(/[^a-zA-Z0-9]/g, "")}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
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
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M15 7a4 4 0 1 0-3.9 5L7 16v3h3v-2h2v-2h1.1A4 4 0 0 0 15 7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
        </span>
        <div>
          <p className="label-caps text-accent-700">Credentials</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">API keys</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Generate keys to authenticate your requests to the parsing API.
          </p>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {issued && (
        <div className="overflow-hidden rounded-2xl border border-brass-400/50 bg-surface shadow-[0_1px_2px_rgba(10,23,51,0.04),0_16px_40px_-24px_rgba(10,23,51,0.28)]">
          <div className="flex items-center justify-between border-b border-brass-400/30 bg-brass-400/10 px-5 py-3">
            <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-brass-500 text-[var(--surface)]">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              New API key - copy it now
            </h3>
            <button onClick={() => setIssued(null)} className="text-sm text-ink-soft hover:text-ink">Dismiss</button>
          </div>
          <div className="p-5">
            <p className="mb-3 text-sm text-ink-soft">This is the only time the full key is shown. Store it somewhere safe.</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <code className="flex-1 overflow-x-auto rounded-lg border border-line bg-paper px-3 py-2.5 font-mono text-sm text-ink">{issued.api_key}</code>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(issued.api_key);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="secondary" type="button" onClick={() => downloadKeyCsv(issued)}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  CSV
                </Button>
              </div>
            </div>
            <p className="mt-2.5 text-xs text-ink-soft">
              The .csv bundles your key with the base URL, auth header, and parse endpoint - drop it straight into your config.
            </p>
          </div>
        </div>
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle>Your keys</SectionTitle>
          <Button onClick={onCreate} loading={creating} type="button">Generate key</Button>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-ink-soft"><Spinner /> Loading...</div>
        ) : keys.length === 0 ? (
          <p className="text-sm text-ink-soft">No keys yet. Generate one to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="label-caps text-ink-soft">
                <tr className="border-b border-line">
                  <th className="py-2 pr-4 font-semibold">Key</th>
                  <th className="py-2 pr-4 font-semibold">Status</th>
                  <th className="py-2 pr-4 font-semibold">Created</th>
                  <th className="py-2 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.key_hash} className="border-b border-line/60 last:border-0">
                    <td className="py-3 pr-4 font-mono text-ink">{k.key_prefix}</td>
                    <td className="py-3 pr-4"><Badge tone={k.status === "active" ? "success" : "danger"}>{k.status}</Badge></td>
                    <td className="py-3 pr-4 text-ink-soft">{k.created_at ? new Date(k.created_at).toLocaleDateString() : "-"}</td>
                    <td className="py-3 text-right">
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
