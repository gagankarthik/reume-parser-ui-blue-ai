"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { UsersIcon } from "@/components/icons";
import { Button, ErrorBanner, Spinner } from "@/components/ui";
import { getPlatformStats } from "@/lib/account";
import { ApiError, type PlatformStats } from "@/lib/types";

type SortKey = "jobs" | "tokens";

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

export default function CustomersClient() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [days, setDays] = useState(30);
  const [sort, setSort] = useState<SortKey>("jobs");
  const [query, setQuery] = useState("");
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

  const rows = useMemo(() => {
    const all = stats?.companies_list ?? [];
    const q = query.trim().toLowerCase();
    const filtered = q
      ? all.filter((c) => `${c.name} ${c.email ?? ""} ${c.company_id}`.toLowerCase().includes(q))
      : all;
    return [...filtered].sort((a, b) => b[sort] - a[sort]);
  }, [stats, query, sort]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200">
            <UsersIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="label-caps text-accent-700">Platform · Admin</p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">Customers</h1>
            <p className="mt-1 text-sm text-ink-soft">Every organisation, its usage, and account controls.</p>
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
          <Spinner /> Loading customers...
        </div>
      ) : stats ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, or id..."
              className="h-9 w-64 max-w-full rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-accent-500"
            />
            <div className="flex items-center gap-2 text-xs text-ink-soft">
              <span>Sort by</span>
              <div className="flex gap-1 rounded-lg border border-line p-1">
                {(["jobs", "tokens"] as SortKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setSort(k)}
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
          </div>

          {rows.length === 0 ? (
            <div className="grid h-24 place-items-center text-sm text-ink-soft/70">No customers found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[44rem] text-left text-sm">
                <thead className="label-caps bg-black/[0.015] text-ink-soft">
                  <tr>
                    <th className="px-5 py-2.5 font-semibold">Customer</th>
                    <th className="px-4 py-2.5 font-semibold">Plan</th>
                    <th className="px-4 py-2.5 font-semibold">Status</th>
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
                        <Link href={`/dashboard/admin/customers/${encodeURIComponent(c.company_id)}`} className="font-medium text-accent-700 hover:underline">
                          {c.name}
                        </Link>
                        <div className="truncate text-[11px] text-ink-soft">{c.email || c.company_id}</div>
                      </td>
                      <td className="px-4 py-3 text-ink-soft">{c.plan || "free"}</td>
                      <td className="px-4 py-3">
                        <span className={"inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium " + (c.status !== "disabled" ? "bg-accent-50 text-accent-700" : "bg-rose-50 text-rose-600")}>
                          <span className={"h-1.5 w-1.5 rounded-full " + (c.status !== "disabled" ? "bg-accent-600" : "bg-rose-500")} />
                          {c.status === "disabled" ? "Disabled" : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">{c.jobs.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">{c.tokens.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-ink-soft">{c.active_keys}</td>
                      <td className="px-5 py-3 font-mono text-xs text-ink-soft">{c.last_active ? c.last_active.slice(0, 10) : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
