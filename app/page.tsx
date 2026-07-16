import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { API_BASE } from "@/lib/config";
import { getSessionClaims } from "@/lib/session";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { Reveal } from "@/components/landing/Reveal";
import { RotatingWord } from "@/components/landing/RotatingWord";
import { FoundationStack } from "@/components/landing/FoundationStack";

const DEMO_URL = "https://blue-iq.ai/contact";
const PLATFORM_URL = "https://blue-iq.ai/products";

export const metadata: Metadata = {
  title: "Blue-IQ Capture | Universal Document AI (Any Document to Structured Data)",
  description:
    "Blue-IQ Capture turns any document (resumes, contracts, invoices, licenses) into structured, confidence-scored data. Domain-tuned, never fabricates, SOC 2 / HIPAA / GDPR aligned. Powered by the Sonar engine.",
  keywords: [
    "document AI",
    "intelligent document processing",
    "IDP",
    "document data extraction",
    "confidence scoring",
    "schema-validated JSON",
    "resume parsing",
    "contract data extraction",
    "invoice extraction",
    "Sonar engine",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Blue-IQ Capture | Universal Document AI",
    description:
      "Point Capture at your paperwork and get back clean, schema-validated, confidence-scored data - for any document, in any industry. Powered by the Sonar engine.",
    siteName: "Blue-IQ Capture",
  },
  twitter: {
    card: "summary",
    title: "Blue-IQ Capture | Universal Document AI",
    description: "Any document in. Structured, scored data out. Powered by the Sonar engine.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Blue-IQ Capture",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Universal document AI: turns resumes, contracts, invoices, and licenses into schema-validated, confidence-scored data. Domain-tuned, never fabricates, powered by the Sonar engine. SOC 2 Type II, HIPAA, and GDPR aligned.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Book a demo on your own documents" },
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
        <Hero />
        <WhatItDoes />
        <HowItWorks />
        <MoreThanParser />
        <WhatItReads />
        <Foundation />
        <Trust />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface" aria-label="Blue-IQ Capture">
      {/* structural grid background, masked to fade downward */}
      <div className="bg-grid absolute inset-x-0 top-0 h-[34rem] text-line" aria-hidden />

      <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-20 text-center sm:px-6 lg:pb-32 lg:pt-28">
        <p className="animate-fade-up inline-flex items-center gap-3" style={{ animationDelay: "40ms" }}>
          <span className="h-px w-8 bg-accent-500" aria-hidden />
          <span className="label-caps text-accent-700">Blue-IQ Capture</span>
          <span className="hidden text-[11px] uppercase tracking-[0.16em] text-ink-soft/55 sm:inline">Universal Document AI</span>
        </p>

        <h1
          className="animate-fade-up mt-6 font-display text-[2.9rem] font-semibold leading-[1.03] tracking-tight text-balance text-ink sm:text-6xl lg:text-[4.4rem]"
          style={{ animationDelay: "90ms" }}
        >
          Turn any{" "}
          <RotatingWord
            words={["resume", "contract", "invoice", "licence"]}
            className="text-accent-700"
          />
          <br />
          into structured data.
        </h1>

        <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft" style={{ animationDelay: "150ms" }}>
          Capture reads the resumes, contracts, invoices, and licenses your teams drown in and hands back clean,
          schema-validated, confidence-scored data - for any document, in any industry.
        </p>

        <div className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "210ms" }}>
          <a
            href={DEMO_URL}
            className="group inline-flex items-center gap-2 rounded-lg bg-accent-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-800"
          >
            Book a demo
            <Arrow />
          </a>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-accent-300 hover:bg-accent-50"
          >
            Read the docs
          </Link>
        </div>

        <p className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-ink-soft" style={{ animationDelay: "270ms" }}>
          {["Never fabricates", "Confidence on every field", "SOC 2 · HIPAA · GDPR aligned"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden />
              {t}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

/* ── What Capture does ───────────────────────────────────────────────────── */

function WhatItDoes() {
  return (
    <section className="border-y border-line bg-paper" aria-label="What Capture does">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <SectionHead
            eyebrow="What Capture does"
            title="Any document in. Structured, scored data out."
          />
          <Reveal delay={80}>
            <div className="space-y-6 text-lg leading-relaxed text-ink-soft lg:pt-1">
              <p>
                Drop in a PDF, a scan, an export, or an email attachment. Capture returns every field that matters as
                schema-validated JSON, and scores its own confidence on each one - so your team reviews only what is
                uncertain instead of re-keying everything by hand.
              </p>
              <p>
                It is the foundation the rest of Blue-IQ is built on. The same engine that credentials a clinician also
                reads a master services agreement and reconciles an invoice.{" "}
                <span className="font-medium text-ink">One product, every document type.</span>
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["PDF", "Scan", "Export", "Email attachment", "Phone photo"].map((t) => (
                  <span key={t} className="rounded-md border border-line bg-surface px-3 py-1 font-mono text-[12px] text-ink-soft">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── How it works - three genuine, ordered stages ────────────────────────── */

function HowItWorks() {
  const steps: { n: string; title: string; body: string; mono: string }[] = [
    {
      n: "01",
      title: "Ingest anything",
      body: "PDFs, scans, exports, email attachments. Send them through the API or a watched folder. OCR handles the ones that were photographed on a phone.",
      mono: "api · watched folder · ocr",
    },
    {
      n: "02",
      title: "Read and score with Sonar",
      body: "Sonar, the Blue-IQ engine, pulls out the fields that matter and scores its own confidence on each one - so uncertainty is surfaced for review, never buried in the output. It never invents a value.",
      mono: 'confidence: { field: 0.91 }',
    },
    {
      n: "03",
      title: "Deliver where you work",
      body: "Schema-validated JSON lands in your ATS, CRM, or warehouse over a documented REST API and signed webhooks. No re-keying, no export step.",
      mono: "-> ATS · CRM · warehouse",
    },
  ];
  return (
    <section id="how" className="bg-surface" aria-label="How it works">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-28">
        <SectionHead eyebrow="How it works" title="From paperwork to payload in three stages." />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 90} className="bg-surface">
              <div className="flex h-full flex-col p-7 lg:p-8">
                <div className="flex items-center gap-3">
                  <span className="font-display text-3xl font-bold italic text-accent-600/40">{s.n}</span>
                  <span className="h-px grow bg-line" aria-hidden />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">{s.title}</h3>
                <p className="mt-2.5 grow text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
                <code className="mt-6 block truncate border-t border-line pt-4 font-mono text-[11px] text-ink-soft/80">{s.mono}</code>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={120}>
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#1e2942] bg-[#0b1220] shadow-[0_44px_90px_-52px_rgba(11,18,32,0.8)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <span className="font-mono text-xs text-[#7d889e]">POST /api/v1/parse</span>
              <Link href="/docs" className="font-mono text-xs text-[#8fb4ff] hover:text-white">full reference {"->"}</Link>
            </div>
            <div className="grid gap-px bg-white/10 lg:grid-cols-2">
              <pre className="overflow-x-auto bg-[#0b1220] p-6 font-mono text-[13px] leading-relaxed text-[#dbe4f5]">
                <code>
                  <span className="text-[#64748b]"># one call, any document</span>
                  {"\n"}<span className="text-[#8fb4ff]">curl</span> -X POST \
                  {"\n  "}{API_BASE}<span className="text-[#64748b]">/api/v1/parse</span> \
                  {"\n  "}-H <S>&quot;X-API-Key: cap_live_...&quot;</S> \
                  {"\n  "}-F <S>&quot;file=@contract.pdf&quot;</S>
                </code>
              </pre>
              <pre className="overflow-x-auto bg-[#0b1220] p-6 font-mono text-[13px] leading-relaxed text-[#dbe4f5]">
                <code>
                  <span className="text-[#64748b]">{"// 200 OK"}</span>
                  {"\n"}<span className="text-[#64748b]">{"{"}</span>
                  {"\n  "}<K>&quot;status&quot;</K>: <S>&quot;completed&quot;</S>,
                  {"\n  "}<K>&quot;data&quot;</K>: <span className="text-[#64748b]">{"{"}</span> <K>&quot;parties&quot;</K>, <K>&quot;term&quot;</K>, <K>&quot;total&quot;</K>... <span className="text-[#64748b]">{"}"}</span>,
                  {"\n  "}<K>&quot;confidence&quot;</K>: <span className="text-[#64748b]">{"{"}</span> <K>&quot;overall&quot;</K>: <span className="text-[#f0b454]">0.94</span> <span className="text-[#64748b]">{"}"}</span>,
                  {"\n  "}<K>&quot;fabricated&quot;</K>: <span className="text-[#f0b454]">false</span>
                  {"\n"}<span className="text-[#64748b]">{"}"}</span>
                </code>
              </pre>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Why it is more than a parser - bento of differentiators ─────────────── */

function MoreThanParser() {
  const rows: { tag: string; h: string; p: string }[] = [
    {
      tag: "domain_tuned",
      h: "Domain-tuned extraction",
      p: "Capture understands the credentials, clauses, and line items a generic model flattens. It reads the documents that run your business, not text in the abstract.",
    },
    {
      tag: "confidence",
      h: "Confidence on every field",
      p: "Each value is scored, so review is targeted, not wholesale.",
    },
    {
      tag: "no_fabrication",
      h: "Never fabricates",
      p: "Uncertain fields are flagged, not invented.",
    },
    {
      tag: "human_review",
      h: "Human-in-the-loop by design",
      p: "Set a confidence threshold and route only what needs a second look.",
    },
    {
      tag: "schema_valid",
      h: "Schema-validated output",
      p: "Clean JSON that fits your systems - not a blob of text to clean up later.",
    },
  ];
  return (
    <section id="why" className="border-y border-line bg-paper" aria-label="More than a parser">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-y-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-x-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHead
              eyebrow="More than a parser"
              title="Not a parser. An intelligence layer."
              lede="Generic parsers flatten the detail and guess when they are unsure. Capture is built for the documents that run your business - and it tells you how sure it is."
            />
          </div>

          {/* Editorial ledger: the schema key each claim maps to, then the claim. */}
          <div className="border-t border-line">
            {rows.map((r, i) => (
              <Reveal key={r.tag} delay={i * 55}>
                <div className="group grid gap-x-8 gap-y-1.5 border-b border-line py-6 transition-colors hover:bg-accent-50/30 sm:grid-cols-[minmax(9.5rem,auto)_1fr] sm:py-7">
                  <code className="font-mono text-[12.5px] leading-6 text-accent-600/90 transition-colors group-hover:text-accent-700">
                    {r.tag}
                  </code>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">{r.h}</h3>
                    <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-ink-soft">{r.p}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── What Capture reads - universality ───────────────────────────────────── */

function WhatItReads() {
  const rows: { t: string; d: string; files: string }[] = [
    { t: "Resumes & CVs", d: "Names, credentials, licences, and work history - untangled.", files: "resume.pdf · cv.docx" },
    { t: "Licences & certifications", d: "Numbers, states, and honest issue/expiry dates.", files: "rn_license.jpg · cert.png" },
    { t: "Contracts, MSAs & SOWs", d: "Parties, terms, clauses, and governing law.", files: "msa_v3.docx · sow.pdf" },
    { t: "Invoices, POs & receipts", d: "Vendors, line items, totals, and due dates.", files: "invoice_4471.pdf · po.pdf" },
    { t: "Forms & applications", d: "Fielded data from scanned and structured records.", files: "application.tiff · form.pdf" },
  ];
  return (
    <section className="bg-surface" aria-label="What Capture reads">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-28">
        <SectionHead
          eyebrow="Universality"
          title="Built for every document your business runs on."
          lede="If it carries data your team needs, Capture turns it into structured fields - in dozens of languages, at scale."
        />
        <div className="mt-12 border-t border-line">
          {rows.map((r, i) => (
            <Reveal key={r.t} delay={i * 55}>
              <div className="grid items-baseline gap-x-8 gap-y-1 border-b border-line py-6 sm:grid-cols-[1fr_auto]">
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">{r.t}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{r.d}</p>
                </div>
                <code className="font-mono text-[12.5px] text-ink-soft/60 sm:text-right">{r.files}</code>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── The foundation for every Blue-IQ product ────────────────────────────── */

function Foundation() {
  return (
    <section id="platform" className="border-y border-line bg-paper" aria-label="The platform foundation">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-28">
        <SectionHead
          eyebrow="The platform"
          title="One engine. One foundation."
          lede="Capture runs on the Sonar engine and forms the base of the Blue-IQ platform. The same core reads a resume, a contract, and an invoice - and everything you build sits on top. Start with Capture, expand as you grow."
        />

        <Reveal delay={100}>
          <div className="mt-12">
            <FoundationStack />
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={PLATFORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-800"
            >
              Explore the platform
              <Arrow />
            </a>
            <a
              href={DEMO_URL}
              className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-accent-300 hover:bg-accent-50"
            >
              Book a demo
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Trust & security ────────────────────────────────────────────────────── */

function Trust() {
  const measures: [string, string][] = [
    ["Encryption in transit", "Every request runs over TLS, authenticated by a per-workspace key you can rotate at any time."],
    ["Workspace isolation", "Documents and keys are scoped to a workspace, with role-based access and single sign-on."],
    ["Zero-retention option", "Turn on zero retention and documents are parsed in memory and never stored - nothing to breach."],
    ["Content-free audit trail", "We log that a parse happened - duration, file type, token spend - never what the document said."],
  ];
  return (
    <section id="security" className="bg-surface" aria-label="Trust and security">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHead
              eyebrow="Trust & security"
              title="Sensitive documents, handled that way."
              lede="Your documents carry clinical records, signed contracts, and financial detail. Capture treats them accordingly."
            />
            <Reveal delay={80}>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {["SOC 2 Type II", "HIPAA", "GDPR"].map((b) => (
                  <span key={b} className="inline-flex items-center gap-2 rounded-md border border-line bg-paper px-3.5 py-2 text-[13px] font-semibold text-ink">
                    <ShieldTick />
                    {b} aligned
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
          <div>
            <dl className="divide-y divide-line border-y border-line">
              {measures.map(([t, d], i) => (
                <Reveal key={t} delay={i * 60}>
                  <div className="grid gap-2 py-6 sm:grid-cols-[210px_1fr] sm:gap-8">
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

/* ── Closing CTA ─────────────────────────────────────────────────────────── */

function Cta() {
  return (
    <section id="demo" className="border-t border-line bg-paper" aria-label="Get started">
      <div className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-6 lg:py-32">
        <Reveal>
          <p className="label-caps text-accent-700">On your own documents · live</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl">
            Put your documents to work.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-ink-soft">
            Tell us what your team is working with. We will show you what Capture does with it, live, on your own documents.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={DEMO_URL}
              className="group inline-flex items-center gap-2 rounded-lg bg-accent-700 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-800"
            >
              Talk to us
              <Arrow />
            </a>
            <a
              href={DEMO_URL}
              className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-accent-300 hover:bg-accent-50"
            >
              Book a demo
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Section header (eyebrow + title + optional lede) ────────────────────── */

function SectionHead({ eyebrow, title, lede }: { eyebrow: string; title: string; lede?: string }) {
  return (
    <Reveal>
      <div className="max-w-3xl">
        <p className="label-caps flex items-center gap-3 text-accent-700">
          <span className="h-px w-8 bg-accent-400" aria-hidden />
          {eyebrow}
        </p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance text-ink sm:text-[2.5rem] sm:leading-[1.08]">
          {title}
        </h2>
        {lede && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{lede}</p>}
      </div>
    </Reveal>
  );
}

/* ── Bits ────────────────────────────────────────────────────────────────── */

function ShieldTick() {
  return (
    <svg className="h-4 w-4 text-accent-700" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
