"use client";

import { useCallback, useEffect, useState } from "react";
import { getHealth } from "@/lib/api";
import { ApiError, type HealthResponse } from "@/lib/types";
import {
  Badge,
  Button,
  Card,
  ErrorBanner,
  SectionTitle,
  Spinner,
} from "@/components/ui";

function StatRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {children}
      </span>
    </div>
  );
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Health is unauthenticated, so this works even without an API key set.
      const data = await getHealth();
      setHealth(data);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to reach the health endpoint.";
      setError(message);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHealth();
  }, [fetchHealth]);

  const deps = health?.dependencies
    ? Object.entries(health.dependencies)
    : [];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Health</h1>
          <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
            Live status of the configured API and its dependencies. This endpoint is
            unauthenticated.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => void fetchHealth()}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      <div className="space-y-6">
        {error && <ErrorBanner message={error} />}

        {loading && !health && (
          <Card>
            <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              <Spinner />
              Checking health…
            </div>
          </Card>
        )}

        {health && (
          <>
            <Card>
              <div className="mb-4 flex items-center justify-between gap-4">
                <SectionTitle>Overview</SectionTitle>
                <Badge tone={health.status === "ok" ? "success" : "warning"}>
                  {health.status === "ok" ? "Operational" : "Degraded"}
                </Badge>
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                <StatRow label="Status">
                  <Badge tone={health.status === "ok" ? "success" : "warning"}>
                    {health.status}
                  </Badge>
                </StatRow>
                <StatRow label="Version">
                  <code className="font-mono text-xs">{health.version}</code>
                </StatRow>
                <StatRow label="Environment">
                  <Badge tone="info">{health.environment}</Badge>
                </StatRow>
                {typeof health.latency_ms === "number" && (
                  <StatRow label="Latency">{health.latency_ms} ms</StatRow>
                )}
              </div>
            </Card>

            {deps.length > 0 && (
              <Card>
                <SectionTitle hint="Each upstream service the API depends on.">
                  Dependencies
                </SectionTitle>
                <div className="grid gap-3 sm:grid-cols-2">
                  {deps.map(([name, value]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800"
                    >
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {name}
                      </span>
                      <Badge tone={value === "ok" ? "success" : "danger"}>{value}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
