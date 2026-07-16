"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Button, Input, cn } from "@/components/ui";

interface TableRef {
  id: string;
  label: string;
  name: string;
}
interface ScanResult {
  table: string;
  name: string;
  items: Record<string, unknown>[];
  count: number;
  scannedCount: number;
  truncated: boolean;
}
interface TableSummary extends TableRef {
  count: number;
  sizeBytes: number;
  ok: boolean;
}

function cellText(v: unknown): string {
  if (v == null) return "-";
  if (typeof v === "object") return Array.isArray(v) ? `[${v.length}]` : JSON.stringify(v);
  return String(v);
}

function StatusPill({ status, ms }: { status: number; ms: number }) {
  const cls =
    status === 0 || status >= 500
      ? "bg-red-100 text-red-700 ring-red-200"
      : status < 300
        ? "bg-accent-50 text-accent-700 ring-accent-200"
        : status < 500
          ? "bg-amber-100 text-amber-800 ring-amber-200"
          : "bg-red-100 text-red-700 ring-red-200";
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-xs font-semibold ring-1 ring-inset", cls)}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {status === 0 ? "NETWORK" : status}
      </span>
      <span className="font-mono text-xs text-ink-soft">{ms} ms</span>
    </span>
  );
}

function JsonBlock({ value, max = "max-h-[26rem]" }: { value: unknown; max?: string }) {
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return (
    <pre className={cn("overflow-auto rounded-xl border border-line bg-paper/70 p-4 font-mono text-[12.5px] leading-relaxed text-ink", max)}>{text}</pre>
  );
}

export default function DataClient({ tables }: { tables: TableRef[] }) {
  const [active, setActive] = useState(tables[0]?.id ?? "");
  const [summary, setSummary] = useState<TableSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ code: number; ms: number } | null>(null);
  const [data, setData] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [raw, setRaw] = useState(false);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    setError("");
    setExpanded(null);
    const t0 = performance.now();
    try {
      const res = await fetch(`/api/admin/dynamo?table=${encodeURIComponent(id)}`);
      const ms = Math.round(performance.now() - t0);
      const body = await res.json();
      setStatus({ code: res.status, ms });
      if (!res.ok) {
        setData(null);
        setError(body?.error?.detail || `Request failed (${res.status})`);
      } else {
        setData(body as ScanResult);
      }
    } catch (e) {
      setStatus({ code: 0, ms: Math.round(performance.now() - t0) });
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (active) {
      setQuery("");
      load(active);
    }
  }, [active, load]);

  // Live at-a-glance counts for every table.
  useEffect(() => {
    fetch("/api/admin/dynamo?summary=1")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setSummary(d?.tables ?? null))
      .catch(() => {});
  }, []);

  const items = data?.items ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => JSON.stringify(it).toLowerCase().includes(q));
  }, [items, query]);

  const columns = useMemo(() => {
    const seen = new Set<string>();
    for (const it of items) for (const k of Object.keys(it)) seen.add(k);
    const all = Array.from(seen);
    const priority = ["company_id", "id", "key_hash", "email", "name", "status", "created_at", "job_id", "batch_id", "webhook_id"];
    all.sort((a, b) => {
      const ia = priority.indexOf(a), ib = priority.indexOf(b);
      if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      return a.localeCompare(b);
    });
    return all.slice(0, 8);
  }, [items]);

  return (
    <div>
      <div className="mb-6">
        <p className="label-caps text-accent-700">Admin · DynamoDB</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">Data viewer</h1>
        <p className="mt-1 text-sm text-ink-soft">Live contents of the resume-parser tables (region us-east-2). Read-only.</p>
      </div>

      {/* At-a-glance: every table + item count */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {(summary ?? tables.map((t) => ({ ...t, count: -1, sizeBytes: 0, ok: true }))).map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              "rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5",
              active === t.id ? "border-accent-300 bg-accent-50 shadow-sm" : "border-line bg-surface hover:border-accent-200",
            )}
          >
            <p className="truncate text-[11px] font-medium uppercase tracking-wide text-ink-soft">{t.label}</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-ink">
              {(t as TableSummary).count >= 0 ? (t as TableSummary).count.toLocaleString() : "..."}
            </p>
            {"ok" in t && !(t as TableSummary).ok && <p className="text-[10px] text-red-600">unreachable</p>}
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {tables.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              "rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-colors",
              active === t.id ? "border-accent-500 bg-accent-50 text-accent-700" : "border-line text-ink-soft hover:border-accent-300 hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        {status && <StatusPill status={status.code} ms={status.ms} />}
        {data && (
          <span className="text-sm text-ink-soft">
            <span className="font-mono font-semibold text-ink">{data.count}</span> items
            {data.truncated && <span className="ml-1 text-amber-600"> · truncated at 300</span>}
            <span className="ml-2 font-mono text-xs text-ink-soft/70">{data.name}</span>
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter..." className="h-9 w-44" />
          <Button variant="secondary" className="h-9 px-3 text-xs" onClick={() => setRaw((v) => !v)}>{raw ? "Table" : "Raw JSON"}</Button>
          <Button variant="secondary" className="h-9 px-3 text-xs" loading={loading} onClick={() => load(active)}>Refresh</Button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {!error && raw && data && <JsonBlock value={filtered} max="max-h-[70vh]" />}

      {!error && !raw && data && (
        filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-sm text-ink-soft">
            {items.length === 0 ? "This table is empty." : "No rows match your filter."}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-sm">
            <table className="w-full min-w-[42rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-paper/60">
                  <th className="w-8" />
                  {columns.map((c) => (
                    <th key={c} className="whitespace-nowrap px-3 py-2.5 text-left font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((it, i) => (
                  <Row key={i} item={it} columns={columns} open={expanded === i} onToggle={() => setExpanded(expanded === i ? null : i)} />
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

function Row({ item, columns, open, onToggle }: { item: Record<string, unknown>; columns: string[]; open: boolean; onToggle: () => void }) {
  return (
    <>
      <tr className="cursor-pointer border-b border-line/70 transition-colors hover:bg-accent-50/50" onClick={onToggle}>
        <td className="px-2 text-center text-ink-soft">
          <svg className={cn("inline h-3.5 w-3.5 transition-transform", open && "rotate-90")} viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </td>
        {columns.map((c) => (
          <td key={c} className="max-w-[16rem] truncate px-3 py-2 font-mono text-[12px] text-ink" title={cellText(item[c])}>{cellText(item[c])}</td>
        ))}
      </tr>
      {open && (
        <tr className="bg-paper/40">
          <td colSpan={columns.length + 1} className="px-3 py-3"><JsonBlock value={item} max="max-h-96" /></td>
        </tr>
      )}
    </>
  );
}
