"use client";

import { useCallback, useEffect, useState } from "react";

import { AreaChart, Donut, StatCard } from "@/components/charts";
import { JobsIcon, SuccessIcon, TokenIcon, UsersIcon } from "@/components/icons";
import { Button, ErrorBanner, Spinner } from "@/components/ui";
import { getPlatformStats } from "@/lib/account";
import { ApiError, type PlatformStats } from "@/lib/types";

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

type SortKey = "jobs" | "tokens";

export default function AdminClient() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [days, setDays] = useState(30);
  const [sort, setSort] = useState<SortKey>("jobs");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setStats(await getPlatformStats(days));
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  const t = stats?.totals;
  const successRate = t && t.jobs ? Math.round((t.completed / t.jobs) * 100) : 0;
  const other = t ? Math.max(0, t.jobs - t.completed - t.failed) : 0;
  const rows = [...(stats?.companies_list ?? [])].sort((a, b) => b[sort] - a[sort]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.4-3 7.6-7 8.6C8 18.6 5 15.4 5 11V6l7-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9.5 12l1.8 1.8 3.4-3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <div>
            <p className="label-caps text-accent-700">Platform</p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">Admin overview</h1>
            <p className="mt-1 text-sm text-ink-soft">Customers and usage across the whole platform.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-lg border border-line p-1">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={
                  "rounded-md px-3 py-1 text-sm font-medium transition-colors " +
                  (d === days ? "bg-accent-700 text-[var(--surface)]" : "text-ink-soft hover:bg-black/[0.04]")
                }
              >
                {d}d
              </button>
            ))}
          </div>
          <Button variant="ghost" onClick={load} type="button">Refresh</Button>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading && !stats ? (
        <div className="flex items-center gap-2 py-16 text-sm text-ink-soft">
          <Spinner /> Loading platform stats…
        </div>
      ) : stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Users" value={stats.companies.total.toLocaleString()} sub={`${stats.companies.active} active`} accent="accent" icon={<UsersIcon />} />
            <StatCard label={`Jobs · ${days}d`} value={t!.jobs.toLocaleString()} sub={`${stats.active_keys} active keys`} accent="ink" icon={<JobsIcon />} />
            <StatCard label="Tokens used" value={t!.tokens_used.toLocaleString()} accent="brass" icon={<TokenIcon />} />
            <StatCard label="Success rate" value={`${successRate}%`} sub={`${t!.completed} ok · ${t!.failed} failed`} accent={successRate >= 90 ? "accent" : successRate >= 70 ? "amber" : "rose"} icon={<SuccessIcon />} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <AreaChart label="Tokens per day" color="#1d4ed8" data={stats.by_day.map((d) => ({ date: d.date, value: d.tokens }))} />
            <AreaChart label="Jobs per day" color="#d97706" data={stats.by_day.map((d) => ({ date: d.date, value: d.jobs }))} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Donut
              title="Job outcomes"
              segments={[
                { label: "Completed", value: t!.completed, color: "#1d4ed8" },
                { label: "Failed", value: t!.failed, color: "#dc2626" },
                { label: "Other", value: other, color: "#94a3b8" },
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <MiniStat label="OCR jobs" value={t!.ocr_jobs.toLocaleString()} />
              <MiniStat label="Avg time" value={`${t!.avg_duration_ms.toLocaleString()} ms`} />
              <MiniStat label="Active keys" value={stats.active_keys.toLocaleString()} />
              <MiniStat label="Active users" value={stats.companies.active.toLocaleString()} />
            </div>
          </div>

          <CompaniesTable rows={rows} sort={sort} onSort={setSort} />
        </>
      ) : null}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="label-caps text-ink-soft">{label}</div>
      <div className="mt-1.5 font-display text-xl font-semibold tabular-nums text-ink">{value}</div>
    </div>
  );
}

function CompaniesTable({
  rows,
  sort,
  onSort,
}: {
  rows: PlatformStats["companies_list"];
  sort: SortKey;
  onSort: (k: SortKey) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold tracking-tight text-ink">Customers</h3>
        <div className="flex gap-1 rounded-lg border border-line p-1 text-xs">
          {(["jobs", "tokens"] as SortKey[]).map((k) => (
            <button
              key={k}
              onClick={() => onSort(k)}
              className={
                "rounded-md px-2.5 py-1 font-medium capitalize transition-colors " +
                (sort === k ? "bg-accent-700 text-[var(--surface)]" : "text-ink-soft hover:bg-black/[0.04]")
              }
            >
              {k}
            </button>
          ))}
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="grid h-24 place-items-center text-sm text-ink-soft/70">No customers yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="label-caps bg-black/[0.015] text-ink-soft">
              <tr>
                <th className="px-5 py-2.5 font-semibold">Customer</th>
                <th className="px-4 py-2.5 font-semibold">Plan</th>
                <th className="px-4 py-2.5 text-right font-semibold">Jobs</th>
                <th className="px-4 py-2.5 text-right font-semibold">Tokens</th>
                <th className="px-4 py-2.5 text-right font-semibold">Keys</th>
                <th className="px-5 py-2.5 font-semibold">Last active</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.company_id} className="border-t border-line transition-colors hover:bg-black/[0.02]">
                  <td className="px-5 py-3">
                    <div className="font-medium text-ink">{c.name}</div>
                    <div className="font-mono text-[11px] text-ink-soft/70">{c.company_id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={"inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium " + (c.status === "active" ? "bg-accent-50 text-accent-700" : "bg-black/[0.05] text-ink-soft")}>
                      <span className={"h-1.5 w-1.5 rounded-full " + (c.status === "active" ? "bg-accent-600" : "bg-ink-soft/50")} />
                      {c.plan || "free"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">{c.jobs.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">{c.tokens.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-ink-soft">{c.active_keys}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-soft">{c.last_active ? c.last_active.slice(0, 10) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
