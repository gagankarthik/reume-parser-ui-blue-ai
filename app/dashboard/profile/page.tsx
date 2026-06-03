"use client";

import { useEffect, useState } from "react";

import { Button, Card, ErrorBanner, SectionTitle, Spinner } from "@/components/ui";
import { getMe, logout, type Me } from "@/lib/account";
import { ApiError } from "@/lib/types";
import { useRouter } from "next/navigation";

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Unexpected error";
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="label-caps shrink-0 text-ink-soft">{label}</span>
      <span className={"min-w-0 break-all text-right text-sm text-ink " + (mono ? "font-mono" : "")}>{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setMe(await getMe());
      } catch (e) {
        setError(errMsg(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </span>
        <div>
          <p className="label-caps text-accent-700">Account</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">Profile</h1>
          <p className="mt-1 text-sm text-ink-soft">Your account and organization details.</p>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-ink-soft"><Spinner /> Loading…</div>
      ) : me ? (
        <>
          <Card>
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent-700 font-display text-xl font-semibold text-[var(--surface)] ring-1 ring-black/10">
                {(me.name || me.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-display text-lg font-semibold tracking-tight text-ink">{me.name || me.company.name || "—"}</div>
                <div className="text-sm text-ink-soft">{me.email}</div>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Account</SectionTitle>
            <div className="divide-y divide-line">
              <Row label="Email" value={me.email} />
              <Row label="Organization" value={me.company.name || "—"} />
              <Row label="Account ID" value={me.company.company_id} mono />
              <Row label="Plan" value={me.company.plan || "free"} />
              <Row label="Status" value={me.company.status || "active"} />
              <Row label="Member since" value={me.company.created_at ? new Date(me.company.created_at).toLocaleDateString() : "—"} />
              <Row label="API keys" value={`${me.active_key_count} active · ${me.key_count} total`} />
            </div>
          </Card>

          <Card>
            <SectionTitle hint="Authentication is managed by AWS Cognito.">Session</SectionTitle>
            <Button
              variant="secondary"
              onClick={async () => {
                await logout();
                router.push("/login");
                router.refresh();
              }}
            >
              Sign out
            </Button>
          </Card>
        </>
      ) : null}
    </div>
  );
}
