"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getJobStatus, parseResume } from "@/lib/api";
import { getSettings } from "@/lib/settings";
import {
  ApiError,
  type ConfidenceScores,
  type JobStatusResponse,
  type ParseResponse,
  type ParsedResume,
} from "@/lib/types";
import {
  Badge,
  Button,
  Card,
  ErrorBanner,
  SectionTitle,
  Spinner,
  cn,
} from "@/components/ui";
import { ResumeResult } from "@/components/parse/ResumeResult";

const ACCEPT = ".pdf,.docx,.png,.jpg,.jpeg,.tiff,.tif,.webp";
const MAX_POLL_ATTEMPTS = 60; // ~2 minutes at 2s intervals
const POLL_INTERVAL_MS = 2000;

type Phase =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "processing"; jobId: string; attempts: number }
  | { kind: "timeout"; jobId: string }
  | { kind: "completed"; data: ParsedResume; confidence: ConfidenceScores | null }
  | { kind: "failed"; message: string };

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export default function ParsePage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [error, setError] = useState<string | null>(null);
  const [missingKey, setMissingKey] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [raw, setRaw] = useState<ParseResponse | JobStatusResponse | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  // Guards against state updates / late polls after the component unmounts.
  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;
    return () => {
      activeRef.current = false;
    };
  }, []);

  const onPickFile = useCallback((f: File | null) => {
    if (!f) return;
    setFile(f);
    setError(null);
    setPhase({ kind: "idle" });
    setRaw(null);
  }, []);

  const handleResponse = useCallback(
    (res: ParseResponse | JobStatusResponse, attempts: number) => {
      if (!activeRef.current) return;
      setRaw(res);

      if (res.status === "completed") {
        if (res.data) {
          setPhase({ kind: "completed", data: res.data, confidence: res.confidence });
        } else {
          setPhase({ kind: "failed", message: "Job completed but returned no data." });
        }
        return;
      }

      if (res.status === "failed") {
        const message =
          "error" in res && res.error
            ? res.error
            : "The parse job failed without a specific error message.";
        setPhase({ kind: "failed", message });
        return;
      }

      // pending | processing → keep polling
      setPhase({ kind: "processing", jobId: res.job_id, attempts });
    },
    [],
  );

  // Drives polling whenever we enter/advance the processing phase.
  useEffect(() => {
    if (phase.kind !== "processing") return;

    if (phase.attempts >= MAX_POLL_ATTEMPTS) {
      setPhase({ kind: "timeout", jobId: phase.jobId });
      return;
    }

    const jobId = phase.jobId;
    const nextAttempt = phase.attempts + 1;
    const timer = setTimeout(async () => {
      try {
        const res = await getJobStatus(jobId);
        handleResponse(res, nextAttempt);
      } catch (err) {
        if (!activeRef.current) return;
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to fetch job status.";
        setPhase({ kind: "failed", message });
      }
    }, POLL_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [phase, handleResponse]);

  const submit = useCallback(async () => {
    if (!file) return;

    const { apiKey } = getSettings();
    if (!apiKey) {
      setMissingKey(true);
      return;
    }
    setMissingKey(false);
    setError(null);
    setRaw(null);
    setPhase({ kind: "submitting" });

    try {
      const res = await parseResume(file);
      handleResponse(res, 0);
    } catch (err) {
      if (!activeRef.current) return;
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while uploading the résumé.");
      }
      setPhase({ kind: "idle" });
    }
  }, [file, handleResponse]);

  const checkAgain = useCallback(() => {
    if (phase.kind === "timeout") {
      setPhase({ kind: "processing", jobId: phase.jobId, attempts: 0 });
    }
  }, [phase]);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files?.[0] ?? null;
      onPickFile(dropped);
    },
    [onPickFile],
  );

  const busy = phase.kind === "submitting" || phase.kind === "processing";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Parse a résumé</h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Upload a résumé and inspect the structured result with confidence scores.
          Image and scanned PDFs may take a few seconds while OCR runs.
        </p>
      </div>

      {missingKey && (
        <div className="mb-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            No API key set —{" "}
            <Link
              href="/settings"
              className="font-medium text-amber-900 underline dark:text-amber-100"
            >
              add one in Settings
            </Link>{" "}
            to start parsing.
          </div>
        </div>
      )}

      <Card>
        <SectionTitle hint="Drag a file here or click to browse. Max upload ~4 MB (Lambda Function URL limit).">
          Upload
        </SectionTitle>

        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
            dragging
              ? "border-indigo-500 bg-indigo-50/60 dark:border-indigo-500 dark:bg-indigo-950/30"
              : "border-zinc-300 hover:border-indigo-400 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-indigo-600 dark:hover:bg-zinc-800/40",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
          />
          <svg
            className="mb-3 h-8 w-8 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            <span className="text-indigo-600 dark:text-indigo-400">Click to browse</span>{" "}
            or drag and drop
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            PDF, DOCX, PNG, JPG, TIFF, or WEBP · up to ~4 MB
          </p>
        </div>

        {file && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/40">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                {file.name}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {formatSize(file.size)}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setFile(null);
                setPhase({ kind: "idle" });
                setRaw(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              disabled={busy}
            >
              Remove
            </Button>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={submit} disabled={!file || busy} loading={busy}>
            Parse résumé
          </Button>
          {raw && (
            <Button variant="secondary" onClick={() => setShowRaw((v) => !v)}>
              {showRaw ? "Hide raw JSON" : "Show raw JSON"}
            </Button>
          )}
        </div>

        {error && (
          <div className="mt-4">
            <ErrorBanner message={error} />
          </div>
        )}
      </Card>

      {phase.kind === "processing" && (
        <Card className="mt-6">
          <div className="flex items-center gap-3">
            <Spinner className="text-indigo-600 dark:text-indigo-400" />
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                Processing… <Badge tone="info">async job</Badge>
              </p>
              <p className="mt-0.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                job_id: {phase.jobId}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Polling for results (attempt {phase.attempts} / {MAX_POLL_ATTEMPTS})…
              </p>
            </div>
          </div>
        </Card>
      )}

      {phase.kind === "timeout" && (
        <Card className="mt-6">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Still processing after {MAX_POLL_ATTEMPTS} checks. The job may complete
            shortly.
          </p>
          <p className="mt-0.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
            job_id: {phase.jobId}
          </p>
          <div className="mt-4">
            <Button variant="secondary" onClick={checkAgain}>
              Check again
            </Button>
          </div>
        </Card>
      )}

      {phase.kind === "failed" && (
        <div className="mt-6">
          <ErrorBanner message={phase.message} />
        </div>
      )}

      {phase.kind === "completed" && (
        <div className="mt-6">
          <ResumeResult data={phase.data} confidence={phase.confidence} />
        </div>
      )}

      {showRaw && raw && (
        <Card className="mt-6">
          <SectionTitle hint="The exact response object returned by the API.">
            Raw JSON
          </SectionTitle>
          <pre className="max-h-96 overflow-auto rounded-lg bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-100">
            {JSON.stringify(raw, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
