"use client";

import { useEffect, useRef, useState } from "react";
import { getHealth } from "@/lib/api";
import { DEFAULT_BASE_URL, getSettings, saveSettings } from "@/lib/settings";
import { ApiError, type HealthResponse } from "@/lib/types";
import {
  Badge,
  Button,
  Card,
  ErrorBanner,
  Input,
  Label,
  SectionTitle,
} from "@/components/ui";

type TestState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; health: HealthResponse }
  | { kind: "error"; message: string };

export default function SettingsPage() {
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [test, setTest] = useState<TestState>({ kind: "idle" });

  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // localStorage is client-only; initialize from getSettings in an effect to
  // avoid a hydration mismatch with the server-rendered markup.
  useEffect(() => {
    const s = getSettings();
    setBaseUrl(s.baseUrl);
    setApiKey(s.apiKey);
  }, []);

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  function handleSave() {
    saveSettings({ baseUrl: baseUrl.trim() || DEFAULT_BASE_URL, apiKey: apiKey.trim() });
    setSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 2500);
  }

  async function handleTest() {
    setTest({ kind: "loading" });
    try {
      const health = await getHealth();
      setTest({ kind: "success", health });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Connection failed.";
      setTest({ kind: "error", message });
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Point the console at an API endpoint and provide your key. These values are
          stored only in this browser.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <SectionTitle hint="The console forwards requests to this endpoint via a same-origin proxy.">
            API connection
          </SectionTitle>

          <div className="space-y-4">
            <div>
              <Label>API Base URL</Label>
              <Input
                type="url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder={DEFAULT_BASE_URL}
                spellCheck={false}
                autoComplete="off"
              />
              <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                Defaults to{" "}
                <code className="font-mono text-[11px] break-all text-zinc-600 dark:text-zinc-300">
                  {DEFAULT_BASE_URL}
                </code>
              </p>
            </div>

            <div>
              <Label>API Key</Label>
              <div className="flex gap-2">
                <Input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="rp_live_..."
                  spellCheck={false}
                  autoComplete="off"
                  className="font-mono"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowKey((v) => !v)}
                  className="shrink-0"
                  aria-pressed={showKey}
                >
                  {showKey ? "Hide" : "Show"}
                </Button>
              </div>
              <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                Sent as the <code className="font-mono text-[11px]">X-API-Key</code>{" "}
                header. Keys look like{" "}
                <code className="font-mono text-[11px]">rp_live_…</code>
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleTest}
              loading={test.kind === "loading"}
            >
              Test connection
            </Button>
            {saved && (
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Saved ✓
              </span>
            )}
          </div>

          {test.kind === "success" && (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
              <Badge tone="success">Reachable</Badge>
              <span>
                status <span className="font-medium">{test.health.status}</span> · version{" "}
                <span className="font-medium">{test.health.version}</span>
              </span>
            </div>
          )}

          {test.kind === "error" && (
            <div className="mt-4">
              <ErrorBanner message={test.message} />
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle>Privacy</SectionTitle>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Your base URL and API key are saved in this browser&apos;s{" "}
            <code className="font-mono text-[11px]">localStorage</code> only. They are
            never sent anywhere except to the API endpoint you configure above. Clearing
            your browser storage removes them.
          </p>
        </Card>
      </div>
    </div>
  );
}
