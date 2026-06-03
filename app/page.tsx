import Link from "next/link";
import type { ReactNode } from "react";

import { API_BASE } from "@/lib/config";
import { getSessionClaims } from "@/lib/session";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { Reveal } from "@/components/landing/Reveal";
import { LottieFx } from "@/components/landing/LottieFx";
import scanData from "@/lib/lottie/scan.json";
import checkData from "@/lib/lottie/check.json";

export const metadata = {
  title: "Blue-IQ Parser API — structured data from any resume",
  description:
    "Turn PDF, DOCX, and scanned resumes into schema-validated JSON with one API call. Confidence scores, webhooks, privacy-first — built for the enterprise.",
};

export default async function Landing() {
  // If a signed-in session exists, surface "Dashboard" CTAs instead of sign-in.
  const authed = !!(await getSessionClaims());
  return (
    <div className="relative overflow-x-clip">
      <SiteNav authed={authed} />
      <Hero authed={authed} />
      <Bento />
      <Showcase />
      <Solutions />
      <Workflow />
      <Security />
      <ApiSample />
      <CtaBand />
      <SiteFooter />
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */

function Hero({ authed }: { authed?: boolean }) {
  return (
    <section className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-100/80 via-[#eaf2ff] to-surface" />
        <span className="aurora-blob animate-aurora" style={{ background: "#5d91f9", width: 520, height: 520, top: -140, left: "-8%", opacity: 0.55 }} />
        <span className="aurora-blob animate-aurora" style={{ background: "#22c3d6", width: 440, height: 440, top: -60, right: "-6%", opacity: 0.5, animationDelay: "-7s" }} />
        <span className="aurora-blob" style={{ background: "#8b5cf6", width: 380, height: 380, top: 120, left: "42%", opacity: 0.28 }} />
        <div className="bg-grid absolute inset-0 text-accent-300/40" />
      </div>
      <div className="mx-auto max-w-7xl px-5 pt-14 pb-16 text-center sm:px-6 lg:pt-20">
        <Link
          href="/docs"
          className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-soft shadow-sm transition-colors hover:border-accent-300"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden />
          Resume parsing API
          <span className="text-accent-700">→</span>
        </Link>

        <h1
          className="animate-fade-up mx-auto mt-7 max-w-4xl font-display text-[2.9rem] leading-[1.02] font-semibold tracking-tight text-balance text-ink sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "60ms" }}
        >
          Structured candidate data,{" "}
          <span className="text-gradient">from any resume</span>.
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
          style={{ animationDelay: "100ms" }}
        >
          One API call turns any PDF, DOCX, or scan into clean, confidence-scored JSON.
        </p>

        <div
          className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "150ms" }}
        >
          <Link
            href={authed ? "/dashboard" : "/signup"}
            className="group inline-flex items-center gap-2 rounded-full bg-accent-700 px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-accent-900/20 transition-all hover:-translate-y-0.5 hover:bg-accent-800"
          >
            {authed ? "Go to dashboard" : "Get your API key"}
            <Arrow />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-accent-300 hover:bg-accent-50"
          >
            Read the docs
          </Link>
        </div>
      </div>

      <Reveal className="mx-auto max-w-6xl px-5 sm:px-6" delay={120}>
        <HeroScene />
      </Reveal>
    </section>
  );
}

/* "Resume → structured JSON" product scene with two gentle floating cards. */
function HeroScene() {
  return (
    <div className="relative">
      <div className="absolute -left-5 top-14 z-20 hidden animate-float lg:block">
        <ScanCard />
      </div>
      <div className="absolute -right-5 bottom-16 z-20 hidden animate-float-slow lg:block">
        <WebhookCard />
      </div>

      <div className="relative overflow-hidden rounded-[2.25rem] border border-line/70 bg-gradient-to-b from-accent-100/70 via-surface to-surface shadow-[0_50px_120px_-55px_rgba(10,23,51,0.6)]">
        <span className="aurora-blob" style={{ background: "#5d91f9", width: 340, height: 340, top: -90, left: -60, opacity: 0.5 }} />
        <span className="aurora-blob" style={{ background: "#22c3d6", width: 300, height: 300, bottom: -120, right: -40, opacity: 0.45 }} />
        <div aria-hidden className="bg-grid absolute inset-0 text-accent-300/40" />

        <div className="relative px-5 py-14 sm:px-8 sm:py-20">
          <div className="glass mx-auto max-w-md rounded-2xl p-5">
            <div className="flex items-center gap-3 rounded-xl border border-line bg-surface/80 px-3.5 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-100">
                <FileIcon />
              </span>
              <span className="flex-1 truncate text-sm font-medium text-ink">jane_okonkwo.pdf</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-2.5 py-1 text-[0.7rem] font-medium text-accent-700">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-600" />
                Parsed
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                ["name", "Jane Okonkwo"],
                ["role", "ICU Nurse"],
                ["license", "TX · RN"],
                ["skills", "ACLS · Triage"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-line bg-surface/80 px-3 py-2">
                  <div className="label-caps text-ink-soft/70">{k}</div>
                  <div className="mt-0.5 truncate text-xs font-medium text-ink">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {["PDF", "DOCX", "Scanned", "Webhooks", "JSON"].map((t) => (
              <span key={t} className="rounded-full border border-line bg-surface/70 px-3 py-1 text-[0.7rem] font-medium text-ink-soft backdrop-blur">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanCard() {
  return (
    <div className="glass flex items-center gap-2.5 rounded-2xl p-2.5 pr-4">
      <LottieFx data={scanData} className="h-12 w-12 shrink-0" />
      <div>
        <div className="label-caps text-ink-soft/70">Parsing</div>
        <div className="text-xs font-semibold text-ink">Extracting fields…</div>
      </div>
    </div>
  );
}

function WebhookCard() {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl p-3.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-100 text-accent-700">
        <CheckIcon />
      </span>
      <div>
        <div className="font-mono text-xs font-medium text-ink">parse.completed</div>
        <div className="text-[0.7rem] text-ink-soft">signed webhook delivered</div>
      </div>
    </div>
  );
}

/* ── Bento feature grid ──────────────────────────────────────────────────── */

function Bento() {
  return (
    <section id="api" className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:py-32">
      <Reveal>
        <SectionHeading eyebrow="The platform" title="Less parsing code. More clean data." />
      </Reveal>

      <div className="mt-14 grid auto-rows-[minmax(0,1fr)] gap-5 lg:grid-cols-6">
        <Reveal className="lg:col-span-3" delay={0}>
          <BentoCard title="Schema-validated JSON" sub="One strict contract, every file">
            <div className="space-y-2">
              {[
                ["personal_info", "object"],
                ["experience", "array"],
                ["education", "array"],
                ["skills", "array"],
                ["certifications", "array"],
              ].map(([k, t]) => (
                <div key={k} className="flex items-center justify-between rounded-lg border border-line bg-surface px-3.5 py-2.5">
                  <span className="font-mono text-sm text-ink">{k}</span>
                  <span className="rounded-md bg-accent-50 px-2 py-0.5 font-mono text-[0.7rem] font-medium text-accent-700 ring-1 ring-inset ring-accent-200">{t}</span>
                </div>
              ))}
            </div>
          </BentoCard>
        </Reveal>

        <Reveal className="lg:col-span-3" delay={80}>
          <BentoCard title="Confidence you can route on" sub="Auto-accept clean, review the rest">
            <div className="space-y-3.5">
              {[
                ["full_name", 0.98],
                ["experience", 0.91],
                ["education", 0.74],
                ["skills", 0.62],
              ].map(([label, score], i) => {
                const s = score as number;
                const low = s < 0.8;
                return (
                  <div key={label as string}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-mono text-ink">{label}</span>
                      <span className={"font-mono font-semibold " + (low ? "text-brass-600" : "text-accent-700")}>{s.toFixed(2)}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line">
                      <span
                        className={"grow-x block h-full rounded-full " + (low ? "bg-brass-400" : "bg-accent-500")}
                        style={{ width: `${s * 100}%`, animationDelay: `${i * 120}ms` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </BentoCard>
        </Reveal>

        <Reveal className="lg:col-span-2" delay={0}>
          <BentoCard title="Any format in" sub="Digital or scanned, we handle it">
            <div className="grid grid-cols-3 gap-2">
              {["PDF", "DOCX", "PNG", "JPG", "TIFF", "OCR"].map((t) => (
                <span key={t} className="flex items-center justify-center rounded-lg border border-line bg-surface py-3 text-xs font-semibold text-ink-soft">{t}</span>
              ))}
            </div>
          </BentoCard>
        </Reveal>

        <Reveal className="lg:col-span-2" delay={80}>
          <BentoCard title="Signed webhooks" sub="Async results you can trust">
            <div className="space-y-2">
              {["parse.completed", "parse.failed", "batch.completed"].map((e, i) => (
                <div key={e} className="flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3 py-2.5">
                  <span className={"h-1.5 w-1.5 rounded-full " + (i === 1 ? "bg-brass-400" : "bg-accent-500")} />
                  <span className="font-mono text-xs text-ink">{e}</span>
                </div>
              ))}
            </div>
          </BentoCard>
        </Reveal>

        <Reveal className="lg:col-span-2" delay={160}>
          <BentoCard title="Private by design" sub="Parsed in memory, never stored">
            <div className="flex h-full flex-col items-center justify-center py-2 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200">
                <ShieldIcon big />
              </span>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {["Zero retention", "TLS", "Audit-only"].map((t) => (
                  <span key={t} className="rounded-full bg-accent-50 px-2.5 py-1 text-[0.7rem] font-medium text-accent-700 ring-1 ring-inset ring-accent-100">{t}</span>
                ))}
              </div>
            </div>
          </BentoCard>
        </Reveal>
      </div>
    </section>
  );
}

function BentoCard({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-line bg-gradient-to-br from-surface to-accent-50/45 p-6 shadow-[0_1px_2px_rgba(10,23,51,0.04)] transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-[0_24px_50px_-30px_rgba(10,23,51,0.35)] sm:p-7">
      <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-1 mb-5 text-sm text-ink-soft">{sub}</p>
      <div className="flex-1">{children}</div>
    </div>
  );
}

/* ── Showcase (dark, animated) ───────────────────────────────────────────── */

function Showcase() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent-800 via-accent-900 to-[#0a1330]">
      <div aria-hidden className="bg-dot-grid pointer-events-none absolute inset-0 text-white/[0.06]" />
      <span aria-hidden className="aurora-blob animate-aurora" style={{ background: "#22c3d6", width: 460, height: 460, top: -140, left: "6%", opacity: 0.4 }} />
      <span aria-hidden className="aurora-blob animate-aurora" style={{ background: "#5d91f9", width: 400, height: 400, bottom: -160, right: "6%", opacity: 0.4, animationDelay: "-8s" }} />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <Reveal>
          <p className="label-caps text-brass-400">In action</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance text-white sm:text-[2.6rem] sm:leading-[1.08]">
            From upload to structured JSON — in one call
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-accent-100">
            Send any resume; get back clean, confidence-scored fields your app can use immediately.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            {["No SDK", "Inline or webhook", "Per-field scores", "Zero retention"].map((t) => (
              <span key={t} className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur">
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto w-full max-w-md rounded-[2rem] border border-white/15 bg-white/[0.06] p-6 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.7)] backdrop-blur sm:p-8">
            <LottieFx data={scanData} className="mx-auto h-56 w-56 sm:h-64 sm:w-64" />
            <div className="mt-2 flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              <LottieFx data={checkData} className="h-6 w-6" />
              Parsed · confidence 0.94
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Solutions ───────────────────────────────────────────────────────────── */

function Solutions() {
  const cards = [
    { icon: <PulseIcon />, title: "Healthcare staffing", tags: ["Specialties", "Licenses"] },
    { icon: <UsersIcon />, title: "Recruiting & ATS", tags: ["Profiles", "Skills"] },
    { icon: <BriefcaseIcon />, title: "Job boards", tags: ["1-click apply"] },
    { icon: <LayersIcon />, title: "RPO & high-volume", tags: ["Batch", "Webhooks"] },
    { icon: <ShieldIcon />, title: "Background screening", tags: ["History", "Dates"] },
    { icon: <PlugIcon />, title: "HR tech & ERP", tags: ["Embeddable"] },
  ];
  return (
    <section id="solutions" className="border-y border-line/70 bg-gradient-to-b from-accent-50/70 to-surface">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:py-32">
        <Reveal>
          <SectionHeading eyebrow="AI Solutions" title="One engine, every hiring workflow" />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 80}>
              <div className="group h-full rounded-3xl border border-line bg-gradient-to-br from-surface to-accent-50/40 p-7 transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-[0_24px_50px_-30px_rgba(10,23,51,0.35)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200 transition-colors group-hover:bg-accent-700 group-hover:text-white group-hover:ring-accent-700">
                  {c.icon}
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-ink">{c.title}</h3>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span key={t} className="rounded-full bg-accent-50 px-2.5 py-1 text-[0.7rem] font-medium text-accent-700 ring-1 ring-inset ring-accent-100">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Workflow ────────────────────────────────────────────────────────────── */

function Workflow() {
  const steps = [
    { n: "01", title: "Send a file", body: "POST any resume with your API key." },
    { n: "02", title: "We structure it", body: "Extraction, OCR when needed, then AI structuring." },
    { n: "03", title: "Get clean JSON", body: "Inline or via signed webhook. Score, done." },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:py-32">
      <Reveal>
        <SectionHeading eyebrow="How it works" title="Three steps, into your pipeline" />
      </Reveal>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 100}>
            <div className="relative h-full rounded-3xl border border-line bg-gradient-to-br from-surface to-accent-50/40 p-8 shadow-sm">
              <div className="font-display text-5xl font-semibold text-accent-600">{s.n}</div>
              <hr className="mt-5 w-10 border-t-2 border-brass-400" />
              <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Security ────────────────────────────────────────────────────────────── */

function Security() {
  const items = [
    { icon: <ShieldIcon />, title: "Zero retention" },
    { icon: <LockIcon />, title: "TLS + API keys" },
    { icon: <SignIcon />, title: "Signed webhooks" },
    { icon: <ListIcon />, title: "Audit-only logs" },
  ];
  return (
    <section id="security" className="border-y border-line/70 bg-gradient-to-b from-surface to-accent-50/70">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="label-caps text-accent-700">Security &amp; privacy</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance text-ink sm:text-[2.4rem] sm:leading-[1.1]">
              Enterprise-grade by default
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Resumes are parsed in memory and deleted on completion. We log that a parse happened — never what was inside.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {items.map((it, i) => (
              <Reveal key={it.title} delay={i * 70}>
                <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-5 text-center shadow-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200">
                    {it.icon}
                  </span>
                  <span className="text-sm font-semibold text-ink">{it.title}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── API sample ──────────────────────────────────────────────────────────── */

function ApiSample() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:py-32">
      <Reveal>
        <SectionHeading eyebrow="Developer-first" title="A request and a response" />
      </Reveal>
      <Reveal delay={100}>
        <div className="mt-12 overflow-hidden rounded-3xl border border-accent-900/30 bg-[#0a1330] shadow-[0_40px_80px_-40px_rgba(10,23,51,0.7)]">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-xs text-[#7c89ab]">Terminal</span>
          </div>
          <div className="grid gap-px bg-white/10 md:grid-cols-2">
            <pre className="overflow-x-auto bg-[#0a1330] p-6 font-mono text-[13px] leading-relaxed text-[#dbe4fb]">
              <code>
                <span className="text-[#7c89ab]"># Send a resume</span>
                {"\n"}<span className="text-[#5d91f9]">curl</span> -X POST {"\\"}
                {"\n  "}{API_BASE}<span className="text-[#7c89ab]">/api/v1/resume/parse</span> {"\\"}
                {"\n  "}-H <S>{'"X-API-Key: rp_live_…"'}</S> {"\\"}
                {"\n  "}-F <S>{'"file=@resume.pdf"'}</S>
              </code>
            </pre>
            <pre className="overflow-x-auto bg-[#0a1330] p-6 font-mono text-[13px] leading-relaxed text-[#dbe4fb]">
              <code>
                <span className="text-[#7c89ab]">{"// 200 OK"}</span>
                {"\n"}<span className="text-[#7c89ab]">{"{"}</span>
                {"\n  "}<K>{'"status"'}</K>: <S>{'"completed"'}</S>,
                {"\n  "}<K>{'"data"'}</K>: <span className="text-[#7c89ab]">{"{ … }"}</span>,
                {"\n  "}<K>{'"confidence"'}</K>: <span className="text-[#7c89ab]">{"{"}</span>{" "}
                <K>{'"overall"'}</K>: <span className="text-[#22c3d6]">0.91</span> <span className="text-[#7c89ab]">{"}"}</span>
                {"\n"}<span className="text-[#7c89ab]">{"}"}</span>
              </code>
            </pre>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────────────────────── */

function CtaBand() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-5 pb-24 sm:px-6 lg:pb-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-accent-900/30 bg-gradient-to-br from-accent-700 via-accent-800 to-accent-900 px-7 py-16 text-center shadow-[0_40px_90px_-50px_rgba(10,23,51,0.8)] sm:px-16 sm:py-20">
          <div aria-hidden className="bg-dot-grid pointer-events-none absolute inset-0 text-white/[0.06]" />
          <span className="aurora-blob animate-aurora" style={{ background: "#22c3d6", width: 320, height: 320, top: -120, right: -40, opacity: 0.45 }} />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
              Parse your first resume today
            </h2>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/signup" className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-accent-800 shadow-lg transition-transform hover:-translate-y-0.5">
                Create your account
              </Link>
              <Link href="/docs" className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10">
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── Bits ────────────────────────────────────────────────────────────────── */

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="label-caps text-accent-700">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance text-ink sm:text-[2.6rem] sm:leading-[1.08]">{title}</h2>
    </div>
  );
}

function K({ children }: { children: ReactNode }) {
  return <span className="text-[#6fc3d6]">{children}</span>;
}
function S({ children }: { children: ReactNode }) {
  return <span className="text-[#86e1a0]">{children}</span>;
}

/* icons */
const ic = "h-5 w-5";
function Arrow() {
  return <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function CheckIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function FileIcon() {
  return <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none"><path d="M14 3v4a1 1 0 0 0 1 1h4M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function LayersIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M12 3l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ShieldIcon({ big }: { big?: boolean }) {
  return <svg className={big ? "h-7 w-7" : ic} viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM9.5 12l1.8 1.8L15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function PulseIcon({ small }: { small?: boolean }) {
  return <svg className={small ? "h-4 w-4" : ic} viewBox="0 0 24 24" fill="none"><path d="M3 12h4l2-5 4 10 2-5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function UsersIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.5M21 20a6 6 0 0 0-4-5.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
function BriefcaseIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" stroke="currentColor" strokeWidth="1.8" /></svg>;
}
function PlugIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0V8zM12 16v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function LockIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
function SignIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 11l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ListIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
