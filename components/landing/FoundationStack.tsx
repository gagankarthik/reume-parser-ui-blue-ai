"use client";

// The platform story as one interactive object: a foundation you build on.
// Three layers - the Sonar engine at the base, Capture as the product, and the
// systems your team already runs on top. Hover or tap a layer to lift it and
// read what it does; a flow indicator traces the path from engine to output.

import { useEffect, useRef, useState } from "react";

type LayerId = "engine" | "capture" | "systems";

type Layer = {
  id: LayerId;
  eyebrow: string;
  title: string;
  blurb: string;
  detail: string;
  chips: string[];
};

// Rendered top-to-bottom (output -> product -> foundation), which is how the
// stack reads visually; the flow itself runs bottom-up.
const LAYERS: Layer[] = [
  {
    id: "systems",
    eyebrow: "Where it lands",
    title: "Your systems",
    blurb: "The tools you already run",
    detail:
      "Structured output flows straight into the systems your team already works in - over a documented REST API and signed webhooks. No re-keying, no export step.",
    chips: ["ATS", "CRM", "Warehouse"],
  },
  {
    id: "capture",
    eyebrow: "The product",
    title: "Blue-IQ Capture",
    blurb: "Any document to structured data",
    detail:
      "One product that turns any document into schema-validated, confidence-scored JSON. Domain-tuned extraction that understands the credentials, clauses, and line items a generic model flattens.",
    chips: ["Extraction", "Confidence", "Schema validation"],
  },
  {
    id: "engine",
    eyebrow: "Foundation",
    title: "Sonar engine",
    blurb: "The Blue-IQ engine that reads and scores",
    detail:
      "Sonar reads every document and scores its own confidence on each field, so uncertainty is surfaced for review, never buried. It never invents a value - the foundation everything above is built on.",
    chips: ["Reads", "Scores", "Never fabricates"],
  },
];

const ORDER: LayerId[] = ["engine", "capture", "systems"];

export function FoundationStack() {
  const [active, setActive] = useState<LayerId>("engine");
  const touched = useRef(false);

  // Gentle auto-cycle up the stack until the visitor engages.
  useEffect(() => {
    if (touched.current) return;
    const id = setInterval(() => {
      if (touched.current) return clearInterval(id);
      setActive((cur) => ORDER[(ORDER.indexOf(cur) + 1) % ORDER.length]);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const engage = (id: LayerId) => {
    touched.current = true;
    setActive(id);
  };

  const current = LAYERS.find((l) => l.id === active)!;

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
      {/* Interactive stack */}
      <div className="relative">
        {/* flow rail: engine (bottom) -> systems (top) */}
        <div aria-hidden className="pointer-events-none absolute bottom-6 left-4 top-6 w-px bg-line sm:left-6">
          <span className="flow-dot absolute -left-[3px] h-[7px] w-[7px] rounded-full bg-accent-500 shadow-[0_0_0_4px_rgba(95,124,230,0.18)]" />
        </div>

        <div role="tablist" aria-label="Platform layers" className="flex flex-col gap-3 pl-9 sm:pl-12">
          {LAYERS.map((l, i) => {
            const on = l.id === active;
            const isEngine = l.id === "engine";
            return (
              <button
                key={l.id}
                role="tab"
                aria-selected={on}
                type="button"
                onMouseEnter={() => engage(l.id)}
                onFocus={() => engage(l.id)}
                onClick={() => engage(l.id)}
                className={
                  "group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 sm:p-6 " +
                  (isEngine
                    ? on
                      ? "border-accent-700 bg-accent-700 text-white shadow-[0_28px_60px_-30px_rgba(0,33,129,0.6)] -translate-y-0.5"
                      : "border-accent-200 bg-accent-700/95 text-white"
                    : on
                      ? "border-accent-300 bg-surface shadow-[0_28px_60px_-34px_rgba(11,18,32,0.5)] -translate-y-0.5"
                      : "border-line bg-surface hover:border-line-strong")
                }
              >
                {/* node marker on the rail */}
                <span
                  aria-hidden
                  className={
                    "absolute -left-[26px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ring-4 transition-colors sm:-left-[30px] " +
                    (on
                      ? "bg-accent-500 ring-accent-100"
                      : isEngine
                        ? "bg-white/70 ring-transparent"
                        : "bg-line-strong ring-transparent")
                  }
                />

                <div className="flex items-center justify-between gap-3">
                  <span
                    className={
                      "label-caps " + (isEngine ? "text-white/70" : on ? "text-accent-700" : "text-ink-soft/60")
                    }
                  >
                    {l.eyebrow}
                  </span>
                  <span
                    className={
                      "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 font-mono text-[10.5px] transition-colors " +
                      (isEngine
                        ? "bg-white/10 text-white/80 ring-1 ring-inset ring-white/20"
                        : on
                          ? "bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-100"
                          : "text-ink-soft/50")
                    }
                  >
                    {isEngine && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#86efac]" aria-hidden />
                    )}
                    {isEngine ? "core" : `layer ${3 - i}`}
                  </span>
                </div>

                <h3
                  className={
                    "mt-2 font-display text-xl font-bold tracking-tight " + (isEngine ? "text-white" : "text-ink")
                  }
                >
                  {l.title}
                </h3>
                <p className={"mt-1 text-sm " + (isEngine ? "text-white/80" : "text-ink-soft")}>{l.blurb}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel - updates with the active layer */}
      <div className="flex flex-col rounded-2xl border border-line bg-paper p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden />
          <span className="label-caps text-accent-700">{current.eyebrow}</span>
        </div>

        <div key={current.id} className="mt-3 flex grow flex-col">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">{current.title}</h3>
          <p className="animate-fade-up mt-3 text-[15px] leading-relaxed text-ink-soft" style={{ animationDuration: "0.5s" }}>
            {current.detail}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {current.chips.map((c, i) => (
              <span
                key={c}
                className="animate-fade-up rounded-md border border-line bg-surface px-3 py-1 font-mono text-[12px] text-ink-soft"
                style={{ animationDelay: `${i * 60}ms`, animationDuration: "0.5s" }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-6 border-t border-line pt-4 text-[13px] leading-relaxed text-ink-soft/80">
          <span className="font-medium text-ink">Start with Capture, expand as you grow.</span> One engine, one
          foundation - the same core reads a resume, a contract, and an invoice.
        </p>
      </div>
    </div>
  );
}
