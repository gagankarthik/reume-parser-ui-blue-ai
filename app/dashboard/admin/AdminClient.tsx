"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { AreaChart, Donut, StatCard } from "@/components/charts";
import { JobsIcon, SuccessIcon, TokenIcon, UsersIcon } from "@/components/icons";
import { Button, ErrorBanner, Spinner } from "@/components/ui";
import { getPlatformStats } from "@/lib/account";
import { ApiError, type PlatformStats } from "@/lib/types";

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

export default function AdminClient() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [days, setDays] = useState(30);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.4-3 7.6-7 8.6C8 18.6 5 15.4 5 11V6l7-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9.5 12l1.8 1.8 3.4-3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <div>
            <p className="label-caps text-accent-700">Platform · Admin</p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">Overview</h1>
            <p className="mt-1 text-sm text-ink-soft">Usage across the whole platform.</p>
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
          <Spinner /> Loading platform stats...
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

          <Link
            href="/dashboard/admin/customers"
            className="group flex items-center justify-between rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-[0_18px_40px_-30px_rgba(10,23,51,0.4)]"
          >
            <span>
              <span className="block font-display text-base font-semibold tracking-tight text-ink">View all customers</span>
              <span className="block text-sm text-ink-soft">{stats.companies.total.toLocaleString()} organisations · usage, keys, logs &amp; controls</span>
            </span>
            <svg className="h-5 w-5 text-ink-soft transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
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
