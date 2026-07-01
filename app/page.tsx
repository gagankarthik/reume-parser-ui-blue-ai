import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { API_BASE } from "@/lib/config";
import { getSessionClaims } from "@/lib/session";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { Reveal } from "@/components/landing/Reveal";
import { ParseDemo } from "@/components/landing/ParseDemo";

export const metadata: Metadata = {
  title: "Blue-IQ Parser — healthcare resume parsing API",
  description:
    "Parse PDF, DOCX, and scanned resumes into schema-validated JSON. Built for healthcare staffing: licence numbers, credentials, specialties, and travel work histories — with confidence scores and signed webhooks.",
  keywords: [
    "resume parsing API",
    "healthcare resume parser",
    "CV parsing",
    "nurse licence extraction",
    "OCR resume",
    "structured resume JSON",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Blue-IQ Parser — healthcare resume parsing API",
    description:
      "One API call turns any resume — including scans — into schema-validated, confidence-scored JSON that knows what an RN licence is.",
    siteName: "Blue-IQ Parser",
  },
  twitter: {
    card: "summary",
    title: "Blue-IQ Parser — healthcare resume parsing API",
    description:
      "Schema-validated JSON from any resume, built for healthcare staffing.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Blue-IQ Parser API",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description:
    "Healthcare-grade resume parsing API: PDF, DOCX, and scanned resumes to schema-validated JSON with licence numbers, credentials, specialties, confidence scores, and signed webhooks.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free to start — no credit card required" },
};

export default async function Landing() {
  const authed = !!(await getSessionClaims());
  return (
    <div className="relative overflow-x-clip">
      {/* Static, server-defined JSON-LD; "<" escaped so "</script>" can never break out. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
      <SiteNav authed={authed} />
      <main>
        <Hero authed={authed} />
        <SpecStrip />
        <Healthcare />
        <Pipeline />
        <Review />
        <Developers />
        <Security />
        <Cta authed={authed} />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */

function Hero({ authed }: { authed?: boolean }) {
  return (
    <section className="relative bg-surface" aria-label="Introduction">
      <div className="bg-grid absolute inset-x-0 top-0 h-[34rem] text-line" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-start gap-12 px-5 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16 lg:pb-24 lg:pt-20">
        <div className="lg:pt-6">
          <p className="animate-fade-up label-caps inline-flex items-center gap-2 text-accent-700" style={{ animationDelay: "40ms" }}>
            <span className="h-px w-8 bg-accent-400" aria-hidden />
            Resume Parsing API · Healthcare-grade
          </p>

          <h1
            className="animate-fade-up mt-5 font-display text-[2.6rem] font-bold leading-[1.04] tracking-tight text-balance text-ink sm:text-[3.4rem] lg:text-[3.8rem]"
            style={{ animationDelay: "90ms" }}
          >
            The resume parser that knows what an RN licence is.
          </h1>

          <p className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-ink-soft" style={{ animationDelay: "140ms" }}>
            One call turns any PDF, DOCX, or scan into schema-validated JSON — licence numbers, post-nominal
            credentials, canonical specialties, and travel work histories where the agency never swallows the
            facility. Confidence-scored, so your team only reviews what needs eyes.
          </p>

          <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "190ms" }}>
            <Link
              href={authed ? "/dashboard" : "/signup"}
              className="group inline-flex items-center gap-2 rounded-lg bg-accent-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-800"
            >
              {authed ? "Go to dashboard" : "Get an API key"}
              <Arrow />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent-300 hover:bg-accent-50"
            >
              Read the docs
            </Link>
          </div>

          <p className="animate-fade-up mt-5 font-mono text-xs text-ink-soft/70" style={{ animationDelay: "230ms" }}>
            curl -F &quot;file=@resume.pdf&quot; — that&apos;s the integration.
          </p>
        </div>

        <Reveal delay={140}>
          <ParseDemo />
        </Reveal>
      </div>
    </section>
  );
}

/* ── Spec strip — facts, not logos ───────────────────────────────────────── */

function SpecStrip() {
  const specs: [string, string][] = [
    ["6", "input formats, scans included"],
    ["40+", "structured output fields"],
    ["2-stage", "OCR with Textract fallback"],
    ["≤ 2 min", "per resume, scans included"],
    ["0", "documents retained after parsing"],
  ];
  return (
    <section className="border-y border-line bg-paper" aria-label="At a glance">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-line px-5 sm:px-6 md:grid-cols-5 md:divide-x">
        {specs.map(([n, label]) => (
          <div key={label} className="px-2 py-7 md:px-6">
            <dt className="sr-only">{label}</dt>
            <dd>
              <span className="block font-display text-3xl font-bold tracking-tight text-ink">{n}</span>
              <span className="mt-1 block text-[13px] leading-snug text-ink-soft">{label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── Section header (numbered, left-aligned — same family as /docs) ──────── */

function SectionHead({ n, eyebrow, title, lede }: { n: string; eyebrow: string; title: string; lede?: string }) {
  return (
    <Reveal>
      <div className="max-w-3xl">
        <p className="label-caps flex items-center gap-3 text-accent-700">
          <span className="font-display text-base font-semibold italic text-accent-600/70">{n}</span>
          {eyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-[2.5rem] sm:leading-[1.08]">
          {title}
        </h2>
        {lede && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{lede}</p>}
        <hr className="rule mt-7" />
      </div>
    </Reveal>
  );
}

/* ── 01 · Healthcare field ledger ────────────────────────────────────────── */

function Healthcare() {
  const rows: { field: string; what: string; detail: string }[] = [
    {
      field: "licenses[]",
      what: "Real practice licences",
      detail: "Number verbatim with letter prefix, state as written, compact/multistate flag, status — never mislabelled as a certification.",
    },
    {
      field: "personal_info.credentials[]",
      what: "Post-nominals, preserved",
      detail: "“Jane Smith, RN, BSN, CCRN” → name cleanly split from every credential, in order, exactly as written.",
    },
    {
      field: "experience[].agency_name",
      what: "Travel histories, untangled",
      detail: "One entry per facility under an agency umbrella. The staffing agency lands in agency_name — it never overwrites the hospital.",
    },
    {
      field: "experience[].specialties[]",
      what: "Specialties mapped to platform IDs",
      detail: "“Med Surg/Tele”, “CVICU”, “L&D” matched to your platform’s specialty IDs — profession-scoped, with a confidence score, exact names kept, and anything unmatched flagged for review instead of dropped.",
    },
    {
      field: "professional_associations[]",
      what: "Memberships & committees",
      detail: "Sigma Theta Tau, AACN, unit committees, process-owner roles — captured, not silently dropped.",
    },
    {
      field: "certifications[]",
      what: "Certs with honest dates",
      detail: "BLS, ACLS, CCRN with issued vs. expiry kept apart — an unlabelled date is never guessed into an expiry.",
    },
  ];
  return (
    <section id="solutions" className="bg-surface" aria-label="Built for healthcare staffing">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-28">
        <SectionHead
          n="01"
          eyebrow="Built for healthcare staffing"
          title="Generic parsers see text. This one sees a clinician."
          lede="Nurses and allied health professionals carry structure most parsers destroy — licences with numbers, credential strings after names, travel assignments nested under agencies. Blue-IQ extracts each into its own field."
        />
        <div className="mt-12 grid gap-x-12 gap-y-0 lg:grid-cols-2">
          {rows.map((r, i) => (
            <Reveal key={r.field} delay={(i % 2) * 80}>
              <div className="group flex gap-5 border-b border-line py-7 transition-colors hover:bg-accent-50/40 sm:px-3">
                <span className="font-display text-sm font-semibold italic text-accent-600/60">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold tracking-tight text-ink">{r.what}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{r.detail}</p>
                  <code className="mt-3 inline-block rounded-md bg-accent-50 px-2 py-1 font-mono text-xs text-accent-800 ring-1 ring-inset ring-accent-100">
                    {r.field}
                  </code>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
            Not nurse-only: radiologic and CT/MRI technologists, respiratory therapists, OT/PT/SLP, surgical and lab
            techs, and social workers parse with the same depth. And it remains a fully general resume parser — send
            it an accountant and you get clean JSON back.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 02 · Pipeline ───────────────────────────────────────────────────────── */

function Pipeline() {
  const steps: { title: string; body: string; mono: string }[] = [
    {
      title: "Read anything",
      body: "Digital text comes straight out. Scans and photos run tiered OCR — Tesseract first, AWS Textract when quality demands it.",
      mono: "pdf · docx · png · jpg · tiff · scan",
    },
    {
      title: "Map the document",
      body: "A multi-pass engine locates every role before extracting it, so a 15-job travel history keeps all 15 employers.",
      mono: "structure → per-role extraction",
    },
    {
      title: "Validate, never invent",
      body: "Output is forced through a strict schema. A missing date stays null — it is never padded into a fake one.",
      mono: "08/2018, not 08/01/2018",
    },
    {
      title: "Score and flag",
      body: "Per-section confidence plus plain-language warnings: a summary that looks copied, a name the email contradicts.",
      mono: '"confidence": { "overall": 0.93 }',
    },
  ];
  return (
    <section className="border-y border-line bg-paper" aria-label="How a parse runs">
      <div className="bg-ledger">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-28">
          <SectionHead
            n="02"
            eyebrow="How a parse runs"
            title="Four stages between upload and JSON."
          />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 80} className="bg-surface">
                <div className="flex h-full flex-col p-7">
                  <span className="font-display text-2xl font-bold italic text-accent-600/50">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink">{s.title}</h3>
                  <p className="mt-2 grow text-sm leading-relaxed text-ink-soft">{s.body}</p>
                  <code className="mt-5 block truncate border-t border-line pt-3 font-mono text-[11px] text-ink-soft/80">{s.mono}</code>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ── 03 · Confidence & review ────────────────────────────────────────────── */

function Review() {
  const fields: [string, number][] = [
    ["personal_info", 0.96],
    ["experience", 0.91],
    ["education", 0.88],
    ["skills", 0.74],
  ];
  return (
    <section className="bg-surface" aria-label="Confidence scores and review routing">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <SectionHead
              n="03"
              eyebrow="Human-in-the-loop"
              title="Your team reviews four resumes, not four hundred."
              lede="Every section carries a 0–1 confidence score. Set a threshold: clean records flow straight into your system, and only the uncertain ones queue for a person. Degraded parses come back flagged partial with plain-language warnings — never a silent failure."
            />
            <Reveal delay={80}>
              <ul className="mt-8 space-y-3 text-[15px] text-ink">
                {[
                  "Per-section and overall scores on every response",
                  "partial: true on degraded documents — nothing fails silently",
                  "Warnings a recruiter can read, not error codes",
                  "Feedback endpoint: corrected JSON flows back to improve the model",
                ].map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden />
                    <span className="text-ink-soft">{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
              <div className="flex items-baseline justify-between">
                <span className="label-caps text-ink-soft/70">confidence</span>
                <span className="font-mono text-xs text-ink-soft/60">threshold 0.80</span>
              </div>
              <div className="mt-6 space-y-5">
                {fields.map(([label, s], i) => {
                  const low = s < 0.8;
                  return (
                    <div key={label}>
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="font-mono text-[13px] text-ink">{label}</span>
                        <span className={"font-mono text-[13px] font-semibold " + (low ? "text-brass-500" : "text-accent-700")}>
                          {s.toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                        <span
                          className={"grow-x block h-full rounded-full " + (low ? "bg-brass-400" : "bg-accent-600")}
                          style={{ width: `${s * 100}%`, animationDelay: `${i * 120}ms` }}
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-ink-soft/70">
                        {low ? "→ queued for human review" : "→ auto-accepted"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── 04 · Developers ─────────────────────────────────────────────────────── */

function Developers() {
  return (
    <section id="api" className="border-y border-line bg-paper" aria-label="Developer experience">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-28">
        <SectionHead
          n="04"
          eyebrow="Developer-first"
          title="A request and a response. That’s the integration."
          lede="No SDK required, no callback gymnastics for the simple case. Async OCR jobs return a job_id to poll — or register a signed webhook and skip polling entirely."
        />

        <Reveal delay={100}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-[#1e2942] bg-[#0b1220] shadow-[0_44px_90px_-50px_rgba(11,18,32,0.8)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <span className="font-mono text-xs text-[#7d889e]">POST /api/v1/resume/parse</span>
              <Link href="/docs" className="font-mono text-xs text-[#8fb4ff] hover:text-white">
                full reference →
              </Link>
            </div>
            <div className="grid gap-px bg-white/10 lg:grid-cols-2">
              <pre className="overflow-x-auto bg-[#0b1220] p-6 font-mono text-[13px] leading-relaxed text-[#dbe4f5]">
                <code>
                  <span className="text-[#64748b]"># one call</span>
                  {"\n"}<span className="text-[#8fb4ff]">curl</span> -X POST \
                  {"\n  "}{API_BASE}<span className="text-[#64748b]">/api/v1/resume/parse</span> \
                  {"\n  "}-H <S>&quot;X-API-Key: rp_live_…&quot;</S> \
                  {"\n  "}-F <S>&quot;file=@resume.pdf&quot;</S>
                  {"\n\n"}<span className="text-[#64748b]"># difficult scan? force high-accuracy OCR</span>
                  {"\n  "}-F <S>&quot;force_textract=true&quot;</S>
                </code>
              </pre>
              <pre className="overflow-x-auto bg-[#0b1220] p-6 font-mono text-[13px] leading-relaxed text-[#dbe4f5]">
                <code>
                  <span className="text-[#64748b]">{"// 200 OK"}</span>
                  {"\n"}<span className="text-[#64748b]">{"{"}</span>
                  {"\n  "}<K>&quot;status&quot;</K>: <S>&quot;completed&quot;</S>,
                  {"\n  "}<K>&quot;data&quot;</K>: <span className="text-[#64748b]">{"{"}</span> <K>&quot;licenses&quot;</K>, <K>&quot;experience&quot;</K>, <K>&quot;credentials&quot;</K>… <span className="text-[#64748b]">{"}"}</span>,
                  {"\n  "}<K>&quot;confidence&quot;</K>: <span className="text-[#64748b]">{"{"}</span> <K>&quot;overall&quot;</K>: <span className="text-[#f0b454]">0.91</span> <span className="text-[#64748b]">{"}"}</span>,
                  {"\n  "}<K>&quot;partial&quot;</K>: <span className="text-[#f0b454]">false</span>,
                  {"\n  "}<K>&quot;warnings&quot;</K>: <span className="text-[#64748b]">[]</span>
                  {"\n"}<span className="text-[#64748b]">{"}"}</span>
                </code>
              </pre>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            {
              h: "Uniform errors",
              p: "Every failure shares one envelope with a machine error_code and a hint written for end users.",
              c: '"error_code": "FILE_TOO_LARGE"',
            },
            {
              h: "Signed webhooks",
              p: "Async results carry an HMAC-SHA256 signature and timestamp. Verify, then trust the payload.",
              c: "X-Signature: sha256=…",
            },
            {
              h: "Batch up to 200",
              p: "Submit a folder of resumes in one request; per-file jobs report back individually.",
              c: "POST /api/v1/resume/batch",
            },
          ].map((b, i) => (
            <Reveal key={b.h} delay={i * 70}>
              <div className="h-full rounded-2xl border border-line bg-surface p-6">
                <h3 className="font-display text-base font-bold tracking-tight text-ink">{b.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{b.p}</p>
                <code className="mt-4 block truncate border-t border-line pt-3 font-mono text-[11px] text-ink-soft/80">{b.c}</code>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 05 · Security ───────────────────────────────────────────────────────── */

function Security() {
  const items: [string, string][] = [
    ["Zero document retention", "Resumes are parsed in memory and deleted on completion. There is no stored copy to breach."],
    ["Encrypted in transit", "Every request runs over TLS, authenticated by a per-account key you can rotate at any time."],
    ["Signed webhooks", "Async deliveries carry an HMAC-SHA256 signature and timestamp; replay-window guidance is in the docs."],
    ["Content-free audit trail", "We log that a parse happened — duration, file type, token spend — never what the document said."],
  ];
  return (
    <section id="security" className="bg-surface" aria-label="Security and privacy">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionHead
            n="05"
            eyebrow="Security & privacy"
            title="Candidate documents are radioactive. Handle accordingly."
            lede="A resume is PII end-to-end. The safest place to keep it is nowhere — so that’s the design."
          />
          <div>
            <dl className="divide-y divide-line border-y border-line">
              {items.map(([t, d], i) => (
                <Reveal key={t} delay={i * 60}>
                  <div className="grid gap-2 py-6 sm:grid-cols-[200px_1fr] sm:gap-8">
                    <dt className="font-display text-base font-bold tracking-tight text-ink">{t}</dt>
                    <dd className="text-[15px] leading-relaxed text-ink-soft">{d}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────────────────────── */

function Cta({ authed }: { authed?: boolean }) {
  return (
    <section id="pricing" className="relative border-t border-line bg-paper" aria-label="Get started">
      <div className="bg-grid absolute inset-0 text-line" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 py-24 text-center sm:px-6 lg:py-32">
        <Reveal>
          <p className="label-caps text-accent-700">Start free · no credit card</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance text-ink sm:text-5xl">
            Your first parsed resume is five minutes away.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-ink-soft">
            Create an account, generate a key, send a file. The dashboard tracks every job from day one.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={authed ? "/dashboard" : "/signup"}
              className="group inline-flex items-center gap-2 rounded-lg bg-accent-700 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-800"
            >
              {authed ? "Go to dashboard" : "Create your account"}
              <Arrow />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-accent-300 hover:bg-accent-50"
            >
              Read the docs
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Bits ────────────────────────────────────────────────────────────────── */

function K({ children }: { children: ReactNode }) {
  return <span className="text-[#7fb4ff]">{children}</span>;
}
function S({ children }: { children: ReactNode }) {
  return <span className="text-[#86efac]">{children}</span>;
}
function Arrow() {
  return (
    <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
