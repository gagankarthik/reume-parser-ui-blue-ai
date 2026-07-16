"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { StatCard } from "@/components/charts";
import { JobsIcon, SuccessIcon, TokenIcon } from "@/components/icons";
import { Badge, Button, ErrorBanner, Spinner } from "@/components/ui";
import { getAdminCompany, updateAdminCompany } from "@/lib/account";
import { ApiError, type AdminCompanyDetail, type KeyUsageRow } from "@/lib/types";

/**
 * Roll per-key usage up from the org's activity logs. Each log carries the key
 * that produced it (key_hash); we count jobs and sum tokens per key, then join
 * against the live key list so every key appears (even with zero recent usage)
 * and used-but-unlisted keys (e.g. revoked, since deleted) still show up.
 */
function rollUpKeyUsage(detail: AdminCompanyDetail): { rows: KeyUsageRow[]; attributed: boolean } {
  const agg = new Map<string, { jobs: number; tokens: number; prefix: string }>();
  let attributed = false;
  for (const l of detail.logs) {
    if (!l.key_hash) continue;
    attributed = true;
    const cur = agg.get(l.key_hash) ?? { jobs: 0, tokens: 0, prefix: l.key_prefix ?? "" };
    cur.jobs += 1;
    cur.tokens += l.ai_tokens_used || 0;
    if (!cur.prefix && l.key_prefix) cur.prefix = l.key_prefix;
    agg.set(l.key_hash, cur);
  }

  const seen = new Set<string>();
  const rows: KeyUsageRow[] = detail.keys.map((k) => {
    seen.add(k.key_hash);
    const u = agg.get(k.key_hash);
    return {
      key_hash: k.key_hash,
      key_prefix: k.key_prefix || u?.prefix || "",
      status: k.status,
      jobs: u?.jobs ?? 0,
      tokens: u?.tokens ?? 0,
    };
  });

  // Keys that produced activity but are no longer in the key list.
  for (const [hash, u] of agg) {
    if (seen.has(hash)) continue;
    rows.push({ key_hash: hash, key_prefix: u.prefix, status: "unknown", jobs: u.jobs, tokens: u.tokens });
  }

  rows.sort((a, b) => b.tokens - a.tokens || b.jobs - a.jobs);
  return { rows, attributed };
}

const PLANS = ["free", "starter", "pro", "enterprise"];

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

export default function CompanyDetailClient({ companyId }: { companyId: string }) {
  const [detail, setDetail] = useState<AdminCompanyDetail | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState("");
  const [savingPlan, setSavingPlan] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const d = await getAdminCompany(companyId, days);
      setDetail(d);
      setPlan(d.company.plan || "free");
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [companyId, days]);

  useEffect(() => {
    load();
  }, [load]);

  const c = detail?.company;
  const disabled = c?.status === "disabled";
  const t = detail?.usage?.totals;
  const successRate = t && t.jobs ? Math.round((t.completed / t.jobs) * 100) : 0;
  const keyUsage = useMemo(() => (detail ? rollUpKeyUsage(detail) : null), [detail]);
  const planOptions = c?.plan && !PLANS.includes(c.plan) ? [c.plan, ...PLANS] : PLANS;

  async function savePlan() {
    setSavingPlan(true);
    setError("");
    setNotice("");
    try {
      await updateAdminCompany(companyId, { plan });
      setNotice("Plan updated.");
      await load();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setSavingPlan(false);
    }
  }

  async function toggleStatus() {
    const next = disabled ? "active" : "disabled";
    if (next === "disabled" && !window.confirm("Deactivate this account? Its API keys will stop working until reactivated.")) {
      return;
    }
    setTogglingStatus(true);
    setError("");
    setNotice("");
    try {
      await updateAdminCompany(companyId, { status: next });
      setNotice(next === "disabled" ? "Account deactivated." : "Account reactivated.");
      await load();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setTogglingStatus(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/admin/customers" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 hover:underline">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        All customers
      </Link>

      {error && <ErrorBanner message={error} />}

      {loading && !detail ? (
        <div className="flex items-center gap-2 py-16 text-sm text-ink-soft"><Spinner /> Loading customer...</div>
      ) : detail && c ? (
        <>
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{c.name || c.company_id}</h1>
                <Badge tone={disabled ? "danger" : "success"}>{disabled ? "Disabled" : "Active"}</Badge>
                <Badge tone="neutral">{c.plan || "free"}</Badge>
              </div>
              <div className="mt-2 space-y-0.5 text-sm text-ink-soft">
                <div>{c.email || "-"}</div>
                <div className="font-mono text-xs text-ink-soft/70">
                  {c.company_id}{c.created_at ? ` · joined ${c.created_at.slice(0, 10)}` : ""}
                </div>
              </div>
            </div>
            <div className="flex gap-1 rounded-lg border border-line p-1">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={"rounded-md px-3 py-1 text-sm font-medium transition-colors " + (d === days ? "bg-accent-700 text-[var(--surface)]" : "text-ink-soft hover:bg-black/[0.04]")}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {notice && <div className="rounded-xl border border-accent-200 bg-accent-50 px-4 py-2.5 text-sm text-accent-800">{notice}</div>}

          {/* Admin controls */}
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="mb-4 font-display text-sm font-semibold tracking-tight text-ink">Account controls</h3>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-soft">Plan</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="h-10 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink outline-none focus:border-accent-500"
                >
                  {planOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <Button variant="secondary" onClick={savePlan} loading={savingPlan} disabled={plan === (c.plan || "free")} type="button">
                Save plan
              </Button>
              <div className="ml-auto">
                <Button variant={disabled ? "primary" : "danger"} onClick={toggleStatus} loading={togglingStatus} type="button">
                  {disabled ? "Activate account" : "Deactivate account"}
                </Button>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-soft">
              Deactivating sets the account to <b>disabled</b>; its API keys stop working within a minute until reactivated.
            </p>
          </div>

          {/* Usage */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label={`Jobs · ${days}d`} value={t!.jobs.toLocaleString()} accent="ink" icon={<JobsIcon />} />
            <StatCard label="Tokens used" value={t!.tokens_used.toLocaleString()} accent="brass" icon={<TokenIcon />} />
            <StatCard label="Success rate" value={`${successRate}%`} sub={`${t!.completed} ok · ${t!.failed} failed`} accent={successRate >= 90 ? "accent" : successRate >= 70 ? "amber" : "rose"} icon={<SuccessIcon />} />
          </div>

          {/* API keys - with per-key usage rolled up from recent activity */}
          <Panel
            title={`API keys (${detail.keys.length})`}
            subtitle={
              keyUsage?.attributed
                ? `Usage from the ${detail.logs.length} most recent events in this window`
                : undefined
            }
          >
            {(keyUsage?.rows.length ?? 0) === 0 ? (
              <EmptyRow text="No API keys" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[40rem] text-left text-sm">
                  <thead className="label-caps bg-black/[0.015] text-ink-soft">
                    <tr>
                      <th className="px-5 py-2.5 font-semibold">Key</th>
                      <th className="px-4 py-2.5 font-semibold">Status</th>
                      <th className="px-4 py-2.5 text-right font-semibold">Jobs</th>
                      <th className="px-4 py-2.5 text-right font-semibold">Tokens</th>
                      <th className="px-5 py-2.5 text-right font-semibold">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keyUsage!.rows.map((k) => {
                      const share = t && t.tokens_used ? Math.round((k.tokens / t.tokens_used) * 100) : 0;
                      return (
                        <tr key={k.key_hash} className="border-t border-line">
                          <td className="px-5 py-3 font-mono text-sm text-ink">{k.key_prefix || k.key_hash.slice(0, 8)}...</td>
                          <td className="px-4 py-3">
                            <Badge tone={k.status === "active" ? "success" : k.status === "unknown" ? "neutral" : "neutral"}>
                              {k.status === "unknown" ? "deleted" : k.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">{k.jobs.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">{k.tokens.toLocaleString()}</td>
                          <td className="px-5 py-3 text-right font-mono tabular-nums text-ink-soft">{keyUsage!.attributed ? `${share}%` : "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {!keyUsage!.attributed && (
                  <p className="border-t border-line px-5 py-3 text-xs text-ink-soft">
                    Per-key usage is unavailable - recent activity isn't attributed to a specific key.
                  </p>
                )}
              </div>
            )}
          </Panel>

          {/* Webhooks */}
          <Panel title={`Webhooks (${detail.webhooks.length})`}>
            {detail.webhooks.length === 0 ? (
              <EmptyRow text="No webhooks" />
            ) : (
              detail.webhooks.map((w) => (
                <div key={w.webhook_id} className="border-t border-line px-5 py-3 first:border-t-0">
                  <div className="truncate font-mono text-sm text-ink">{w.url}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
                    <Badge tone={w.status === "active" ? "success" : "neutral"}>{w.status}</Badge>
                    {w.events.map((e) => <Badge key={e} tone="neutral">{e}</Badge>)}
                  </div>
                </div>
              ))
            )}
          </Panel>

          {/* Logs */}
          <Panel title={`Recent activity (${detail.logs.length})`}>
            {detail.logs.length === 0 ? (
              <EmptyRow text="No activity in this window" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[44rem] text-left text-sm">
                  <thead className="label-caps bg-black/[0.015] text-ink-soft">
                    <tr>
                      <th className="px-5 py-2.5 font-semibold">When</th>
                      <th className="px-4 py-2.5 font-semibold">Type</th>
                      <th className="px-4 py-2.5 font-semibold">Status</th>
                      <th className="px-4 py-2.5 text-right font-semibold">Tokens</th>
                      <th className="px-4 py-2.5 text-right font-semibold">Time</th>
                      <th className="px-5 py-2.5 font-semibold">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.logs.map((l) => (
                      <tr key={l.job_id} className="border-t border-line">
                        <td className="px-5 py-2.5 font-mono text-xs text-ink-soft">{l.timestamp ? l.timestamp.slice(0, 19).replace("T", " ") : "-"}</td>
                        <td className="px-4 py-2.5 text-ink-soft">{l.file_type}{l.ocr_used ? " · OCR" : ""}</td>
                        <td className="px-4 py-2.5">
                          <Badge tone={l.status === "completed" ? "success" : l.status === "failed" ? "danger" : "neutral"}>{l.status}</Badge>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-ink">{l.ai_tokens_used.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-ink-soft">{l.duration_ms ? `${l.duration_ms} ms` : "-"}</td>
                        <td className="px-5 py-2.5 font-mono text-xs text-rose-600">{l.error_code || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </>
      ) : null}
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="border-b border-line px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold tracking-tight text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-ink-soft">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <div className="grid h-20 place-items-center text-sm text-ink-soft/70">{text}</div>;
}
