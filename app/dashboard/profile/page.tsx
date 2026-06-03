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
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className={"text-sm text-zinc-900 dark:text-zinc-100 " + (mono ? "font-mono" : "")}>{value}</span>
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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Your account and organization details.</p>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500"><Spinner /> Loading…</div>
      ) : me ? (
        <>
          <Card>
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-indigo-600 text-xl font-semibold text-white">
                {(me.name || me.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight">{me.name || me.company.name || "—"}</div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">{me.email}</div>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Account</SectionTitle>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
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
