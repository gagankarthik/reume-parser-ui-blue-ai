"use client";

// The hero demo: a résumé fragment beside the JSON it becomes. Hovering (or
// tapping) a résumé line highlights exactly the output lines it produced, and
// vice versa — the product explained in one interaction. Auto-cycles gently
// until the visitor touches it.

import { useEffect, useRef, useState } from "react";

type Seg = "name" | "contact" | "license" | "work" | "certs" | "assoc";

const ORDER: Seg[] = ["name", "license", "work", "certs", "assoc"];

const RESUME_LINES: { seg: Seg; text: string; indent?: boolean }[] = [
  { seg: "name", text: "Maria Delgado, RN, BSN, CCRN" },
  { seg: "contact", text: "maria.delgado@outlook.com · (737) 555-0182 · Austin, TX" },
  { seg: "license", text: "TX RN License #885201 — Compact" },
  { seg: "work", text: "Travel RN, ICU — Aya Healthcare" },
  { seg: "work", text: "St. David’s Medical Center · 01/2023 – 09/2024", indent: true },
  { seg: "certs", text: "ACLS · BLS (exp. 12/2026)" },
  { seg: "assoc", text: "American Association of Critical-Care Nurses, Member" },
];

type JsonLine = { seg: Seg | null; html: React.ReactNode };

function Key({ children }: { children: React.ReactNode }) {
  return <span className="text-[#7fb4ff]">&quot;{children}&quot;</span>;
}
function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-[#86efac]">&quot;{children}&quot;</span>;
}
function Pun({ children }: { children: React.ReactNode }) {
  return <span className="text-[#64748b]">{children}</span>;
}
function Num({ children }: { children: React.ReactNode }) {
  return <span className="text-[#f0b454]">{children}</span>;
}

const JSON_LINES: JsonLine[] = [
  { seg: null, html: <Pun>{"{"}</Pun> },
  {
    seg: "name",
    html: (
      <>
        {"  "}
        <Key>full_name</Key>
        <Pun>: </Pun>
        <Str>Maria Delgado</Str>
        <Pun>,</Pun>
      </>
    ),
  },
  {
    seg: "name",
    html: (
      <>
        {"  "}
        <Key>credentials</Key>
        <Pun>: [</Pun>
        <Str>RN</Str>
        <Pun>, </Pun>
        <Str>BSN</Str>
        <Pun>, </Pun>
        <Str>CCRN</Str>
        <Pun>],</Pun>
      </>
    ),
  },
  {
    seg: "license",
    html: (
      <>
        {"  "}
        <Key>licenses</Key>
        <Pun>: [{"{ "}</Pun>
        <Key>type</Key>
        <Pun>: </Pun>
        <Str>RN</Str>
        <Pun>, </Pun>
        <Key>state</Key>
        <Pun>: </Pun>
        <Str>TX</Str>
        <Pun>,</Pun>
      </>
    ),
  },
  {
    seg: "license",
    html: (
      <>
        {"      "}
        <Key>number</Key>
        <Pun>: </Pun>
        <Str>885201</Str>
        <Pun>, </Pun>
        <Key>is_compact</Key>
        <Pun>: </Pun>
        <Num>true</Num>
        <Pun>{" }],"}</Pun>
      </>
    ),
  },
  {
    seg: "work",
    html: (
      <>
        {"  "}
        <Key>experience</Key>
        <Pun>: [{"{ "}</Pun>
        <Key>company</Key>
        <Pun>: </Pun>
        <Str>St. David’s Medical Center</Str>
        <Pun>,</Pun>
      </>
    ),
  },
  {
    seg: "work",
    html: (
      <>
        {"      "}
        <Key>agency_name</Key>
        <Pun>: </Pun>
        <Str>Aya Healthcare</Str>
        <Pun>, </Pun>
        <Key>profession</Key>
        <Pun>: </Pun>
        <Str>RN</Str>
        <Pun>,</Pun>
      </>
    ),
  },
  {
    seg: "work",
    html: (
      <>
        {"      "}
        <Key>specialties</Key>
        <Pun>: [{"{ "}</Pun>
        <Key>name</Key>
        <Pun>: </Pun>
        <Str>ICU</Str>
        <Pun>, </Pun>
        <Key>specialty_id</Key>
        <Pun>: </Pun>
        <Str>56</Str>
        <Pun>, </Pun>
        <Key>confidence</Key>
        <Pun>: </Pun>
        <Num>1.0</Num>
        <Pun>{" }] }],"}</Pun>
      </>
    ),
  },
  {
    seg: "certs",
    html: (
      <>
        {"  "}
        <Key>certifications</Key>
        <Pun>: [{"{ "}</Pun>
        <Key>name</Key>
        <Pun>: </Pun>
        <Str>ACLS</Str>
        <Pun>{" }, { "}</Pun>
        <Key>name</Key>
        <Pun>: </Pun>
        <Str>BLS</Str>
        <Pun>, </Pun>
        <Key>expiry_date</Key>
        <Pun>: </Pun>
        <Str>12/2026</Str>
        <Pun>{" }],"}</Pun>
      </>
    ),
  },
  {
    seg: "assoc",
    html: (
      <>
        {"  "}
        <Key>professional_associations</Key>
        <Pun>: [</Pun>
        <Str>AACN Member</Str>
        <Pun>],</Pun>
      </>
    ),
  },
  {
    seg: null,
    html: (
      <>
        {"  "}
        <Key>confidence</Key>
        <Pun>: {"{ "}</Pun>
        <Key>overall</Key>
        <Pun>: </Pun>
        <Num>0.93</Num>
        <Pun>{" }"}</Pun>
      </>
    ),
  },
  { seg: null, html: <Pun>{"}"}</Pun> },
];

const SEG_LABEL: Record<Seg, string> = {
  name: "Post-nominal credentials, split and kept",
  contact: "Contact anchors",
  license: "A real licence — number, state, compact status",
  work: "Agency and facility, never confused",
  certs: "Certifications with their dates",
  assoc: "Memberships & committees, not dropped",
};

export function ParseDemo() {
  const [active, setActive] = useState<Seg | null>("license");
  const touched = useRef(false);

  // Gentle auto-cycle until the first real interaction.
  useEffect(() => {
    if (touched.current) return;
    const id = setInterval(() => {
      if (touched.current) {
        clearInterval(id);
        return;
      }
      setActive((cur) => ORDER[(ORDER.indexOf((cur as Seg) ?? "name") + 1) % ORDER.length]);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const engage = (seg: Seg | null) => {
    touched.current = true;
    setActive(seg);
  };

  return (
    <figure aria-label="Example: a résumé fragment and the structured JSON extracted from it">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_36px_80px_-44px_rgba(11,18,32,0.5)]">
        {/* Source document */}
        <div className="border-b border-line bg-paper/60 px-5 pb-4 pt-4">
          <div className="flex items-baseline justify-between">
            <span className="label-caps text-ink-soft/70">maria_delgado_rn.pdf</span>
            <span className="font-mono text-[0.65rem] text-ink-soft/60">source</span>
          </div>
          <div className="mt-3 space-y-0.5" onMouseLeave={() => engage(null)}>
            {RESUME_LINES.map((l, i) => (
              <button
                type="button"
                key={i}
                onMouseEnter={() => engage(l.seg)}
                onFocus={() => engage(l.seg)}
                onClick={() => engage(l.seg)}
                className={
                  "block w-full cursor-default rounded-md px-2 py-1 text-left font-[450] transition-colors duration-150 " +
                  (l.indent ? "pl-6 " : "") +
                  (active === l.seg
                    ? "bg-accent-100/80 text-ink"
                    : "text-ink-soft hover:bg-black/[0.03]")
                }
              >
                <span className={l.seg === "name" && !l.indent ? "text-[15px] font-semibold" : "text-[13px]"}>
                  {l.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="bg-[#0b1220] px-5 pb-5 pt-4">
          <div className="flex items-baseline justify-between">
            <span className="label-caps text-[#7d889e]">response</span>
            <span className="font-mono text-[0.65rem] text-[#7d889e]">200 · application/json</span>
          </div>
          <pre className="mt-3 overflow-x-auto font-mono text-[12px] leading-[1.7]">
            <code>
              {JSON_LINES.map((l, i) => (
                <span
                  key={i}
                  onMouseEnter={() => l.seg && engage(l.seg)}
                  className={
                    "block rounded px-2 transition-colors duration-150 " +
                    (l.seg && active === l.seg
                      ? "bg-white/[0.09] shadow-[inset_2px_0_0_var(--color-accent-400)]"
                      : "")
                  }
                >
                  {l.html}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>

      <figcaption className="mt-3 flex min-h-5 items-center gap-2 px-1 text-[13px] text-ink-soft" aria-live="polite">
        <span className={"h-1.5 w-1.5 shrink-0 rounded-full transition-colors " + (active ? "bg-accent-500" : "bg-line-strong")} />
        {active ? SEG_LABEL[active] : "Hover the résumé — or the JSON — to trace a field."}
      </figcaption>
    </figure>
  );
}
