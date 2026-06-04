import Link from "next/link";
import type { ReactNode } from "react";

import { API_BASE } from "@/lib/config";
import { getSessionClaims } from "@/lib/session";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { Reveal } from "@/components/landing/Reveal";

export const metadata = {
  title: "Blue-IQ Parser API — structured data from any resume",
  description:
    "Turn PDF, DOCX, and scanned resumes into schema-validated JSON with one API call. Confidence scores, webhooks, privacy-first.",
};

const GRAD = "bg-gradient-to-br from-accent-500 to-accent-700";

export default async function Landing() {
  const authed = !!(await getSessionClaims());
  return (
    <div className="relative overflow-x-clip">
      <SiteNav authed={authed} />
      <Hero authed={authed} />
      <Formats />
      <Features />
      <Steps />
      <Solutions />
      <Showcase />
      <Security />
      <ApiSample />
      <Cta authed={authed} />
      <SiteFooter />
    </div>
  );
}

/* ── Hero (split) ────────────────────────────────────────────────────────── */

function Hero({ authed }: { authed?: boolean }) {
  return (
    <section className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-vibrant-soft" />
        <span className="aurora-blob animate-aurora" style={{ background: "#1d4ed8", width: 520, height: 520, top: -160, left: "-10%", opacity: 0.5 }} />
        <span className="aurora-blob animate-aurora" style={{ background: "#2f80ed", width: 420, height: 420, top: -40, right: "-8%", opacity: 0.4, animationDelay: "-7s" }} />
        <span className="aurora-blob animate-aurora" style={{ background: "#5f87f6", width: 360, height: 360, bottom: -120, left: "30%", opacity: 0.3, animationDelay: "-13s" }} />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:pt-20 lg:pb-28">
        <div>
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-xs font-semibold text-ink-soft shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-vibrant" aria-hidden />
            Resume Parsing API
          </span>

          <h1
            className="animate-fade-up mt-6 font-display text-[2.9rem] leading-[1.03] font-bold tracking-tight text-balance text-ink sm:text-6xl lg:text-[4.1rem]"
            style={{ animationDelay: "60ms" }}
          >
            Any resume, into{" "}
            <span className="text-gradient">clean structured data</span>.
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-lg text-lg leading-relaxed text-ink-soft"
            style={{ animationDelay: "100ms" }}
          >
            One API call turns any PDF, DOCX, or scan into confidence-scored JSON your app can use immediately.
          </p>

          <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "150ms" }}>
            <Link
              href={authed ? "/dashboard" : "/signup"}
              className="group inline-flex items-center gap-2 rounded-full bg-vibrant px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent-500/40"
            >
              {authed ? "Go to dashboard" : "Get your API key"}
              <Arrow />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-full border-2 border-line-strong bg-surface px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-accent-300 hover:bg-accent-50"
            >
              Read the docs
            </Link>
          </div>

          <p className="animate-fade-up mt-6 text-sm text-ink-soft" style={{ animationDelay: "200ms" }}>
            No SDK · inline or webhook · zero file retention
          </p>
        </div>

        <Reveal delay={120}>
          <Mockup />
        </Reveal>
      </div>
    </section>
  );
}

/* Clean static product mockup with a CSS scan-line (no external animation libs). */
function Mockup() {
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-accent-300/40 via-accent-400/30 to-accent-500/25 blur-2xl" />

      <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-surface shadow-[0_40px_90px_-45px_rgba(29,78,216,0.55)]">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 inline-flex items-center gap-2 text-xs font-medium text-ink-soft">
            <FileIcon /> jane_okonkwo.pdf
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[0.7rem] font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Parsed
          </span>
        </div>

        <div className="grid grid-cols-[0.85fr_1.15fr] gap-4 p-5">
          {/* document with scan line */}
          <div className="relative h-[150px] overflow-hidden rounded-xl border border-line bg-gradient-to-b from-accent-50 to-surface p-4">
            <div className="space-y-2.5">
              <span className="block h-2 w-3/4 rounded-full bg-accent-200" />
              <span className="block h-2 w-full rounded-full bg-line-strong" />
              <span className="block h-2 w-5/6 rounded-full bg-line-strong" />
              <span className="block h-2 w-2/3 rounded-full bg-line-strong" />
              <span className="mt-3 block h-2 w-1/2 rounded-full bg-accent-200" />
              <span className="block h-2 w-full rounded-full bg-line-strong" />
              <span className="block h-2 w-4/5 rounded-full bg-line-strong" />
            </div>
            <span aria-hidden className="animate-scanline absolute left-3 right-3 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-accent-500 to-transparent shadow-[0_0_14px_3px_rgba(29,78,216,0.5)]" />
          </div>

          {/* structured fields */}
          <div className="space-y-2">
            {[
              ["name", "Jane Okonkwo, RN"],
              ["role", "ICU Nurse"],
              ["location", "Austin, TX"],
              ["skills", "ACLS · Triage"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between rounded-lg border border-line bg-surface px-3 py-2">
                <span className="label-caps text-ink-soft/70">{k}</span>
                <span className="truncate pl-2 text-xs font-semibold text-ink">{v}</span>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-lg border border-accent-200 bg-accent-50 px-3 py-2">
              <span className="label-caps text-accent-700">confidence</span>
              <span className="font-mono text-sm font-bold text-accent-700">0.94</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 -left-3 hidden items-center gap-2 rounded-2xl border border-line bg-surface px-3.5 py-2.5 shadow-lg sm:flex">
        <span className={"grid h-7 w-7 place-items-center rounded-lg text-white " + GRAD}><BoltIcon /></span>
        <span className="text-xs font-semibold text-ink">webhook delivered</span>
      </div>
    </div>
  );
}

/* ── Formats strip ───────────────────────────────────────────────────────── */

function Formats() {
  const items = ["PDF", "DOCX", "Scanned PDF", "PNG · JPG · TIFF", "Webhooks", "Structured JSON"];
  return (
    <section className="border-y border-line bg-surface/60">
      <div className="mx-auto max-w-7xl px-6 py-7">
        <p className="text-center text-sm font-medium text-ink-soft/80">Built for the formats your candidates actually send</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {items.map((i) => (
            <span key={i} className="label-caps text-ink-soft">{i}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features ────────────────────────────────────────────────────────────── */

function Features() {
  const feats = [
    { icon: <BracketsIcon />, title: "Schema-validated JSON", body: "One strict, versioned contract — stable field names, empty values, never missing keys." },
    { icon: <GaugeIcon />, title: "Confidence scoring", body: "Per-field scores let you auto-accept clean records and route only the uncertain ones to review." },
    { icon: <BoltIcon />, title: "Signed webhooks", body: "Async and batch results arrive with a signature you verify — no polling required." },
    { icon: <LayersIcon />, title: "Every format", body: "Digital PDFs, DOCX, and phone photos of a printed CV. Tiered OCR kicks in only when needed." },
    { icon: <ShieldIcon />, title: "Private by design", body: "Parsed in memory, deleted on completion. Content-free audit metadata only." },
    { icon: <PlugIcon />, title: "Drop-in API", body: "API-key auth, multipart upload, JSON back. Integrate with the stack you already run." },
  ];
  return (
    <section id="api" className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:py-28">
      <Reveal><Heading eyebrow="The platform" title="Everything you need to ship resume parsing" /></Reveal>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {feats.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 80}>
            <div className="group h-full rounded-[1.6rem] border border-line bg-surface p-7 transition-all hover:-translate-y-1 hover:border-accent-200 hover:shadow-[0_28px_56px_-30px_rgba(29,78,216,0.4)]">
              <div className={"flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg shadow-accent-500/25 " + GRAD}>
                {f.icon}
              </div>
              <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Steps ───────────────────────────────────────────────────────────────── */

function Steps() {
  const steps = [
    { n: "1", title: "Send a file", body: "POST a PDF, DOCX, or image to /resume/parse with your API key." },
    { n: "2", title: "We structure it", body: "Text extraction, OCR when a scan needs it, then AI structuring." },
    { n: "3", title: "Get clean JSON", body: "Digital files return inline; scans arrive via signed webhook." },
  ];
  return (
    <section id="how" className="relative overflow-hidden bg-vibrant-soft">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:py-28">
        <Reveal><Heading eyebrow="How it works" title="Three steps, into your pipeline" /></Reveal>
        <div className="relative mt-14 grid gap-5 md:grid-cols-3">
          <div aria-hidden className="absolute left-[16%] right-[16%] top-12 hidden h-0.5 bg-gradient-to-r from-accent-200 via-accent-300 to-accent-200 md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div className="relative h-full rounded-[1.6rem] border border-line bg-surface p-8 text-center shadow-sm">
                <div className={"mx-auto grid h-16 w-16 place-items-center rounded-full font-display text-2xl font-bold text-white shadow-lg shadow-accent-500/30 " + GRAD}>
                  {s.n}
                </div>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Solutions ───────────────────────────────────────────────────────────── */

function Solutions() {
  const cards = [
    { icon: <PulseIcon />, title: "Healthcare staffing", body: "360+ clinical specialties, licenses & credentials normalized." },
    { icon: <UsersIcon />, title: "Recruiting & ATS", body: "Auto-fill candidate records straight into your tracking system." },
    { icon: <BriefcaseIcon />, title: "Job boards", body: "One-click apply — turn any upload into a complete profile." },
    { icon: <LayersIcon />, title: "RPO & high-volume", body: "Batch, signed webhooks and retries for clean hand-off at scale." },
    { icon: <ShieldIcon />, title: "Background screening", body: "Verifiable work history and dates in a consistent shape." },
    { icon: <PlugIcon />, title: "HR tech & ERP", body: "Embed structured parsing inside your own product." },
  ];
  return (
    <section id="solutions" className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:py-28">
      <Reveal><Heading eyebrow="AI Solutions" title="One engine, every hiring workflow" /></Reveal>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={(i % 3) * 80}>
            <div className="group flex h-full items-start gap-4 rounded-[1.6rem] border border-line bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent-200 hover:shadow-[0_28px_56px_-30px_rgba(29,78,216,0.4)]">
              <span className={"grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-lg shadow-accent-500/25 " + GRAD}>
                {c.icon}
              </span>
              <div>
                <h3 className="font-display text-base font-bold tracking-tight text-ink">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{c.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Showcase (dark) ─────────────────────────────────────────────────────── */

function Showcase() {
  const points = [
    { icon: <TargetIcon />, title: "Accuracy you can trust", body: "Rule-based anchors for contact details, AI structuring for the rest." },
    { icon: <BoltIcon />, title: "Fast by default", body: "Digital files return inline in seconds — no queues, no batch windows." },
    { icon: <ShieldIcon />, title: "Private, always", body: "Processed in memory and deleted on completion. Nothing left behind." },
  ];
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1630] via-[#0b1220] to-[#070b16]">
      <div aria-hidden className="bg-dot-grid pointer-events-none absolute inset-0 text-white/[0.06]" />
      <span aria-hidden className="aurora-blob animate-aurora" style={{ background: "#1d4ed8", width: 440, height: 440, top: -140, left: "8%", opacity: 0.5 }} />
      <span aria-hidden className="aurora-blob animate-aurora" style={{ background: "#2f80ed", width: 380, height: 380, bottom: -150, right: "8%", opacity: 0.4, animationDelay: "-8s" }} />

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:py-28">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="label-caps text-accent-300">Why Blue-IQ</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-white sm:text-[2.7rem] sm:leading-[1.06]">
              Built for the documents your candidates actually send
            </h2>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <div className="h-full rounded-[1.6rem] border border-white/12 bg-white/[0.06] p-7 backdrop-blur">
                <span className={"flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg " + GRAD}>{p.icon}</span>
                <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300/80">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
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
    <section id="security" className="mx-auto max-w-7xl px-5 py-20 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <p className="label-caps text-accent-600">Security &amp; privacy</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-[2.4rem] sm:leading-[1.1]">
            Enterprise-grade by default
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Resumes are parsed in memory and deleted on completion. We log that a parse happened — never what was inside.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 70}>
              <div className="flex h-full flex-col items-center gap-3 rounded-[1.5rem] border border-line bg-surface p-5 text-center shadow-sm">
                <span className={"grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg " + GRAD}>{it.icon}</span>
                <span className="text-sm font-bold text-ink">{it.title}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── API sample ──────────────────────────────────────────────────────────── */

function ApiSample() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-6 lg:pb-28">
      <Reveal><Heading eyebrow="Developer-first" title="A request and a response" /></Reveal>
      <Reveal delay={100}>
        <div className="mt-12 overflow-hidden rounded-[2rem] border border-[#1e2942] bg-[#0b1220] shadow-[0_40px_80px_-40px_rgba(29,78,216,0.5)]">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-xs text-[#7d889e]">Terminal</span>
          </div>
          <div className="grid gap-px bg-white/10 md:grid-cols-2">
            <pre className="overflow-x-auto bg-[#0b1220] p-6 font-mono text-[13px] leading-relaxed text-[#dbe4f5]">
              <code>
                <span className="text-[#7d889e]"># Send a resume</span>
                {"\n"}<span className="text-[#8fb4ff]">curl</span> -X POST {"\\"}
                {"\n  "}{API_BASE}<span className="text-[#7d889e]">/api/v1/resume/parse</span> {"\\"}
                {"\n  "}-H <S>{'"X-API-Key: rp_live_…"'}</S> {"\\"}
                {"\n  "}-F <S>{'"file=@resume.pdf"'}</S>
              </code>
            </pre>
            <pre className="overflow-x-auto bg-[#0b1220] p-6 font-mono text-[13px] leading-relaxed text-[#dbe4f5]">
              <code>
                <span className="text-[#7d889e]">{"// 200 OK"}</span>
                {"\n"}<span className="text-[#7d889e]">{"{"}</span>
                {"\n  "}<K>{'"status"'}</K>: <S>{'"completed"'}</S>,
                {"\n  "}<K>{'"data"'}</K>: <span className="text-[#7d889e]">{"{ … }"}</span>,
                {"\n  "}<K>{'"confidence"'}</K>: <span className="text-[#7d889e]">{"{"}</span>{" "}
                <K>{'"overall"'}</K>: <span className="text-[#f59e0b]">0.91</span> <span className="text-[#7d889e]">{"}"}</span>
                {"\n"}<span className="text-[#7d889e]">{"}"}</span>
              </code>
            </pre>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────────────────────── */

function Cta({ authed }: { authed?: boolean }) {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-5 pb-24 sm:px-6 lg:pb-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-vibrant px-7 py-16 text-center shadow-[0_40px_90px_-45px_rgba(29,78,216,0.7)] sm:px-16 sm:py-20">
          <div aria-hidden className="bg-dot-grid pointer-events-none absolute inset-0 text-white/[0.12]" />
          <span aria-hidden className="aurora-blob" style={{ background: "#5f87f6", width: 320, height: 320, top: -120, right: -40, opacity: 0.45 }} />
          <span aria-hidden className="aurora-blob" style={{ background: "#fbbf24", width: 260, height: 260, bottom: -110, left: -20, opacity: 0.3 }} />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-white sm:text-5xl">
              Parse your first resume today
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg text-blue-100">
              Create an account, generate a key, and make your first call in minutes.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href={authed ? "/dashboard" : "/signup"} className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-accent-700 shadow-lg transition-transform hover:-translate-y-0.5">
                {authed ? "Go to dashboard" : "Create your account"}
              </Link>
              <Link href="/docs" className="rounded-full border-2 border-white/40 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10">
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

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="label-caps text-accent-600">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-[2.7rem] sm:leading-[1.06]">{title}</h2>
    </div>
  );
}

function K({ children }: { children: ReactNode }) {
  return <span className="text-[#7dd3fc]">{children}</span>;
}
function S({ children }: { children: ReactNode }) {
  return <span className="text-[#86efac]">{children}</span>;
}

/* icons */
const ic = "h-5 w-5";
function Arrow() {
  return <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function FileIcon() {
  return <svg className="h-4 w-4 text-accent-600" viewBox="0 0 24 24" fill="none"><path d="M14 3v4a1 1 0 0 0 1 1h4M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function BracketsIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M8 4H6a2 2 0 0 0-2 2v4l-2 2 2 2v4a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v4l2 2-2 2v4a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function GaugeIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M4 18a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M12 18l4-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
function BoltIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function LayersIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M12 3l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ShieldIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM9.5 12l1.8 1.8L15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function PulseIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M3 12h4l2-5 4 10 2-5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
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
function TargetIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" /></svg>;
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
