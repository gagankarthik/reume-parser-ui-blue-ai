"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { AreaChart, BarList, Donut, StatCard } from "@/components/charts";
import { ClockIcon, JobsIcon, KeyIcon, ScanIcon, SuccessIcon, TokenIcon } from "@/components/icons";
import { Button, ErrorBanner, Spinner } from "@/components/ui";
import { getUsage, listKeys } from "@/lib/account";
import { ApiError, type Usage } from "@/lib/types";

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

export default function AnalyticsPage() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [activeKeys, setActiveKeys] = useState<number | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [u, keys] = await Promise.all([getUsage(days), listKeys()]);
      setUsage(u);
      setActiveKeys(keys.filter((k) => k.status === "active").length);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  const t = usage?.totals;
  const successRate = t && t.jobs ? Math.round((t.completed / t.jobs) * 100) : 0;
  const other = t ? Math.max(0, t.jobs - t.completed - t.failed) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M4 19V5M4 19h16M8 19v-5M12 19V9M16 19v-7M20 19V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <div>
            <p className="label-caps text-accent-700">Usage</p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">Analytics</h1>
            <p className="mt-1 text-sm text-ink-soft">Usage and token analytics for your account.</p>
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

      {loading && !usage ? (
        <div className="flex items-center gap-2 py-16 text-sm text-ink-soft">
          <Spinner /> Loading analytics…
        </div>
      ) : usage ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Active keys" value={activeKeys ?? "—"} accent="accent" icon={<KeyIcon />} />
            <StatCard label={`Jobs · ${days}d`} value={t!.jobs.toLocaleString()} accent="ink" icon={<JobsIcon />} />
            <StatCard label="Tokens used" value={t!.tokens_used.toLocaleString()} accent="brass" icon={<TokenIcon />} />
            <StatCard label="Success rate" value={`${successRate}%`} sub={`${t!.completed} ok · ${t!.failed} failed`} accent={successRate >= 90 ? "accent" : successRate >= 70 ? "amber" : "rose"} icon={<SuccessIcon />} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <AreaChart label="Tokens per day" color="#1d4ed8" data={usage.by_day.map((d) => ({ date: d.date, value: d.tokens }))} />
            <AreaChart label="Jobs per day" color="#d97706" data={usage.by_day.map((d) => ({ date: d.date, value: d.jobs }))} />
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
            <BarList
              title="By file type"
              items={Object.entries(usage.by_file_type).map(([label, value]) => ({ label, value }))}
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-line bg-surface p-5 text-sm text-ink-soft">
            <span className="flex items-center gap-2">
              <span className="text-accent-700"><ClockIcon width={18} height={18} /></span>
              Avg. processing time <b className="font-mono text-ink">{t!.avg_duration_ms.toLocaleString()} ms</b>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-accent-700"><ScanIcon width={18} height={18} /></span>
              OCR jobs <b className="font-mono text-ink">{t!.ocr_jobs.toLocaleString()}</b>
            </span>
            <Link href="/dashboard/keys" className="ml-auto inline-flex items-center gap-1.5 font-medium text-accent-700 hover:underline">
              <KeyIcon width={16} height={16} /> Manage API keys →
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
