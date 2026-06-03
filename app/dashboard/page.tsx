"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { AreaChart, BarList, Donut, StatCard } from "@/components/charts";
import { Button, ErrorBanner, Spinner } from "@/components/ui";
import { getUsage, listKeys } from "@/lib/account";
import { ApiError, type Usage } from "@/lib/types";

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

export default function OverviewPage() {
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Usage and token analytics for your account.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-lg border border-zinc-200 p-1 dark:border-zinc-800">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={
                  "rounded-md px-3 py-1 text-sm font-medium transition-colors " +
                  (d === days ? "bg-indigo-600 text-white" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800")
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
        <div className="flex items-center gap-2 py-16 text-sm text-zinc-500">
          <Spinner /> Loading analytics…
        </div>
      ) : usage ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Active keys" value={activeKeys ?? "—"} accent="indigo" />
            <StatCard label={`Jobs · ${days}d`} value={t!.jobs.toLocaleString()} accent="zinc" />
            <StatCard label="Tokens used" value={t!.tokens_used.toLocaleString()} accent="emerald" />
            <StatCard label="Success rate" value={`${successRate}%`} sub={`${t!.completed} ok · ${t!.failed} failed`} accent={successRate >= 90 ? "emerald" : successRate >= 70 ? "amber" : "rose"} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <AreaChart label="Tokens per day" color="#6366f1" data={usage.by_day.map((d) => ({ date: d.date, value: d.tokens }))} />
            <AreaChart label="Jobs per day" color="#10b981" data={usage.by_day.map((d) => ({ date: d.date, value: d.jobs }))} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Donut
              title="Job outcomes"
              segments={[
                { label: "Completed", value: t!.completed, color: "#10b981" },
                { label: "Failed", value: t!.failed, color: "#f43f5e" },
                { label: "Other", value: other, color: "#a1a1aa" },
              ]}
            />
            <BarList
              title="By file type"
              items={Object.entries(usage.by_file_type).map(([label, value]) => ({ label, value }))}
            />
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            Avg. processing time: <b className="text-zinc-900 dark:text-zinc-100">{t!.avg_duration_ms.toLocaleString()} ms</b> ·
            OCR jobs: <b className="text-zinc-900 dark:text-zinc-100">{t!.ocr_jobs}</b> ·{" "}
            <Link href="/dashboard/keys" className="font-medium text-indigo-600 hover:underline">Manage API keys →</Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
