"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { StatCard } from "@/components/charts";
import { JobsIcon, KeyIcon as KeyStatIcon, SuccessIcon, TokenIcon } from "@/components/icons";
import { ErrorBanner, Spinner } from "@/components/ui";
import { getUsage, listKeys } from "@/lib/account";
import { ApiError, type Usage } from "@/lib/types";

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

const LINKS = [
  { href: "/dashboard/analytics", title: "Analytics", desc: "Usage, tokens & job outcomes", icon: <AnalyticsIcon /> },
  { href: "/dashboard/keys", title: "API Keys", desc: "Generate and revoke keys", icon: <KeyIcon /> },
  { href: "/dashboard/webhooks", title: "Webhooks", desc: "Signed delivery for async jobs", icon: <WebhookIcon /> },
  { href: "/docs", title: "Docs", desc: "Authenticate and parse a resume", icon: <DocsIcon /> },
];

export default function OverviewPage() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [activeKeys, setActiveKeys] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [u, keys] = await Promise.all([getUsage(30), listKeys()]);
        setUsage(u);
        setActiveKeys(keys.filter((k) => k.status === "active").length);
      } catch (e) {
        setError(errMsg(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const t = usage?.totals;
  const successRate = t && t.jobs ? Math.round((t.completed / t.jobs) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200">
          <OverviewIcon />
        </span>
        <div>
          <p className="label-caps text-accent-700">Dashboard</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">Overview</h1>
          <p className="mt-1 text-sm text-ink-soft">Your account at a glance.</p>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <div className="flex items-center gap-2 py-10 text-sm text-ink-soft"><Spinner /> Loading...</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Active keys" value={activeKeys ?? "-"} accent="accent" icon={<KeyStatIcon />} />
            <StatCard label="Jobs · 30d" value={t ? t.jobs.toLocaleString() : "-"} accent="ink" icon={<JobsIcon />} />
            <StatCard label="Tokens used" value={t ? t.tokens_used.toLocaleString() : "-"} accent="brass" icon={<TokenIcon />} />
            <StatCard label="Success rate" value={t ? `${successRate}%` : "-"} accent={successRate >= 90 ? "accent" : successRate >= 70 ? "amber" : "rose"} icon={<SuccessIcon />} />
          </div>

          <div>
            <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-ink">Quick links</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {LINKS.map((l) => (
                <QuickLink key={l.href} {...l} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function QuickLink({ href, title, desc, icon }: { href: string; title: string; desc: string; icon: ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-[0_20px_44px_-30px_rgba(10,23,51,0.35)]"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200 transition-colors group-hover:bg-accent-700 group-hover:text-white group-hover:ring-accent-700">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-semibold tracking-tight text-ink">{title}</span>
        <span className="block truncate text-sm text-ink-soft">{desc}</span>
      </span>
      <svg className="h-4 w-4 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </Link>
  );
}

/* icons */
function OverviewIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M4 13h7V4H4v9zM13 20h7V4h-7v16zM4 20h7v-4H4v4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>;
}
function AnalyticsIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M4 19V5M4 19h16M8 19v-5M12 19V9M16 19v-7M20 19V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function KeyIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M15 7a4 4 0 1 0-3.9 5L7 16v3h3v-2h2v-2h1.1A4 4 0 0 0 15 7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>;
}
function WebhookIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M9 7a3 3 0 1 1 4 2.8L10 15M7 13a3 3 0 1 0 3 3h6M17 13a3 3 0 1 1-2.8 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function DocsIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l4 4v14H7zM14 3v4h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>;
}
