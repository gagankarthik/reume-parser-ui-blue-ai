"use client";

// Interactive use-case selector for the landing hero — Affinda-style segmented
// audience picker. Swaps the supporting line and the highlighted chip on the
// illustration, keeping the visual calm and consistent.

import Link from "next/link";
import { useState } from "react";

const CASES = [
  {
    id: "healthcare",
    label: "Healthcare staffing",
    line: "Parse nursing and allied-health resumes with 360+ clinical specialties, licenses, and credentials normalized — RN, RRT, BLS, ACLS.",
    chip: "ICU Nurse · ACLS · TX license",
  },
  {
    id: "ats",
    label: "Recruiting & ATS",
    line: "Auto-fill candidate records from any resume and drop them straight into your applicant tracking system — no manual re-keying.",
    chip: "Profile · Skills · History",
  },
  {
    id: "jobboards",
    label: "Job boards",
    line: "Let applicants apply in one click. Turn their upload into a complete, structured profile the moment it lands.",
    chip: "Apply · Auto-profile",
  },
  {
    id: "rpo",
    label: "RPO & volume",
    line: "Process resumes at scale with signed webhooks, automatic retries, and confidence-scored output for clean hand-off.",
    chip: "Batch · Webhooks · Scores",
  },
] as const;

export function UseCaseHero() {
  const [active, setActive] = useState(0);
  const current = CASES[active];

  return (
    <div>
      <div
        className="animate-fade-up flex flex-wrap gap-2"
        role="tablist"
        aria-label="Choose your use case"
      >
        {CASES.map((c, i) => {
          const selected = i === active;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(i)}
              className={
                "rounded-full px-4 py-2 text-sm font-medium transition-all " +
                (selected
                  ? "bg-accent-700 text-[var(--surface)] shadow-sm"
                  : "border border-line-strong text-ink-soft hover:border-accent-300 hover:text-ink")
              }
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <p
        className="animate-fade-up mt-7 max-w-xl text-lg leading-relaxed text-ink-soft"
        style={{ animationDelay: "120ms" }}
        key={current.id}
      >
        {current.line}
      </p>

      <div
        className="animate-fade-up mt-9 flex flex-wrap items-center gap-3"
        style={{ animationDelay: "180ms" }}
      >
        <Link
          href="/signup"
          className="group inline-flex items-center gap-2 rounded-full bg-accent-700 px-6 py-3 text-sm font-medium text-[var(--surface)] shadow-lg shadow-accent-900/15 transition-all hover:-translate-y-0.5 hover:bg-accent-800"
        >
          Get your API key
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-0.5">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent-300 hover:bg-accent-50"
        >
          Read the docs
        </Link>
      </div>

      <p
        className="animate-fade-up mt-7 text-sm text-ink-soft"
        style={{ animationDelay: "240ms" }}
      >
        Highlighting:{" "}
        <span
          key={current.chip}
          className="animate-fade-up font-medium text-accent-700"
        >
          {current.chip}
        </span>
      </p>
    </div>
  );
}
