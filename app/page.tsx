import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Blue-IQ Parser API — structured data from any résumé",
  description:
    "Turn PDF, DOCX, and scanned résumés into schema-validated JSON with one API call. Confidence scores, webhooks, privacy-first.",
};

export default function Landing() {
  return (
    <div className="relative overflow-x-hidden">
      <Nav />
      <Hero />
      <Trust />
      <Features />
      <HowItWorks />
      <ApiSample />
      <CtaBand />
      <Footer />
    </div>
  );
}

/* ── Navigation ──────────────────────────────────────────────────────────── */

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-[var(--background)]/80 backdrop-blur-md dark:border-zinc-800/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-lg font-semibold tracking-tight">Blue-IQ Parser</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-zinc-600 md:flex dark:text-zinc-400">
          <a href="#features" className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-100">Features</a>
          <a href="#how" className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-100">How it works</a>
          <a href="#api" className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-100">API</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200/60 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow-sm transition-transform hover:-translate-y-0.5 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative">
      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 text-zinc-300/50 bg-dot-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)] dark:text-zinc-700/40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 -z-10 h-[420px] w-[420px] rounded-full bg-indigo-500/20 blur-[120px]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 pt-20 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:pt-28">
        <div>
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-zinc-300/70 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Résumé parsing API
          </span>

          <h1
            className="animate-fade-up mt-6 font-display text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl"
            style={{ animationDelay: "60ms" }}
          >
            Turn any résumé into{" "}
            <span className="relative whitespace-nowrap text-indigo-600 dark:text-indigo-400">
              structured data
              <Underline />
            </span>
            .
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400"
            style={{ animationDelay: "120ms" }}
          >
            One API call converts PDF, DOCX, and scanned résumés into schema-validated JSON —
            with per-field confidence scores, ready to auto-fill your candidate forms and ATS.
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "180ms" }}
          >
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-500"
            >
              Get your API key
              <Arrow />
            </Link>
            <a
              href="#api"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-200/50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800/50"
            >
              See the API
            </a>
          </div>

          <p
            className="animate-fade-up mt-6 text-sm text-zinc-500 dark:text-zinc-500"
            style={{ animationDelay: "240ms" }}
          >
            Privacy-first · résumé files never stored · built for healthcare staffing
          </p>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
          <TransformCard />
        </div>
      </div>
    </section>
  );
}

function TransformCard() {
  return (
    <div className="relative">
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
          <span className="ml-2 font-mono text-xs text-zinc-400">POST /api/v1/resume/parse</span>
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
          <code>
            <span className="text-zinc-400">{"{"}</span>
            {"\n  "}
            <K>{'"personal_info"'}</K>: <span className="text-zinc-400">{"{"}</span>
            {"\n    "}
            <K>{'"full_name"'}</K>: <S>{'"Jane Okonkwo, RN"'}</S>,
            {"\n    "}
            <K>{'"email"'}</K>: <S>{'"jane@example.com"'}</S>,
            {"\n    "}
            <K>{'"location"'}</K>: <S>{'"Austin, TX"'}</S>
            {"\n  "}
            <span className="text-zinc-400">{"},"}</span>
            {"\n  "}
            <K>{'"experience"'}</K>: <span className="text-zinc-400">[{"{"}</span>
            {"\n    "}
            <K>{'"role"'}</K>: <S>{'"ICU Nurse"'}</S>,
            {"\n    "}
            <K>{'"company"'}</K>: <S>{'"St. David’s"'}</S>,
            {"\n    "}
            <K>{'"start_date"'}</K>: <S>{'"2021-03"'}</S>
            {"\n  "}
            <span className="text-zinc-400">{"}],"}</span>
            {"\n  "}
            <K>{'"skills"'}</K>: <span className="text-zinc-400">[</span>
            <S>{'"ACLS"'}</S>, <S>{'"Triage"'}</S>
            <span className="text-zinc-400">],</span>
            {"\n  "}
            <K>{'"confidence"'}</K>: <span className="text-emerald-500">0.94</span>
            {"\n"}
            <span className="text-zinc-400">{"}"}</span>
          </code>
        </pre>
      </div>
      {/* little input chip */}
      <div className="absolute -left-5 -top-5 hidden rotate-[-4deg] rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-lg sm:block dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <FileIcon />
          jane_okonkwo_resume.pdf
        </div>
      </div>
    </div>
  );
}

/* ── Trust strip ─────────────────────────────────────────────────────────── */

function Trust() {
  const items = ["PDF", "DOCX", "Scanned PDF", "PNG · JPG · TIFF", "Webhooks", "Structured JSON"];
  return (
    <section className="border-y border-zinc-200/70 bg-white/40 dark:border-zinc-800/70 dark:bg-zinc-900/20">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-6 text-sm font-medium text-zinc-500 dark:text-zinc-500">
        {items.map((i) => (
          <span key={i}>{i}</span>
        ))}
      </div>
    </section>
  );
}

/* ── Features ────────────────────────────────────────────────────────────── */

function Features() {
  const features = [
    {
      icon: <BracesIcon />,
      title: "Schema-validated JSON",
      body: "Every response is a strict, predictable shape — personal info, experience, education, skills, certifications. No surprises to defend against.",
    },
    {
      icon: <ScanIcon />,
      title: "Smart tiered OCR",
      body: "Digital files parse instantly; scans and photos fall back from Tesseract to Amazon Textract automatically — only when needed.",
    },
    {
      icon: <GaugeIcon />,
      title: "Confidence scores",
      body: "Per-field 0–1 scores let you auto-accept clean records and route uncertain ones to human review.",
    },
    {
      icon: <WebhookIcon />,
      title: "Signed webhooks",
      body: "HMAC-signed delivery for async OCR jobs with retries — no polling required for large or scanned documents.",
    },
    {
      icon: <ShieldIcon />,
      title: "Privacy by design",
      body: "Résumé files are processed in memory and deleted immediately. We keep content-free audit metadata only.",
    },
    {
      icon: <PulseIcon />,
      title: "Specialty-aware",
      body: "Normalises 360+ clinical specialties and credentials (RN, RRT, BLS, ACLS…) for healthcare staffing workflows.",
    },
  ];
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Why Blue-IQ Parser"
        title="Built to drop straight into your pipeline"
        sub="Everything you need to go from an uploaded file to a candidate record — accurately, and without storing sensitive data."
      />
      <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-800">
        {features.map((f) => (
          <div
            key={f.title}
            className="group bg-[var(--background)] p-8 transition-colors hover:bg-white dark:hover:bg-zinc-900"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/50 dark:text-indigo-400">
              {f.icon}
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── How it works ────────────────────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Upload a file",
      body: "POST a PDF, DOCX, or image to /resume/parse with your API key. Up to 10 MB.",
    },
    {
      n: "02",
      title: "We extract & structure",
      body: "Text extraction, OCR when needed, then AI structuring with rule-based anchors for contact details.",
    },
    {
      n: "03",
      title: "Receive clean JSON",
      body: "Digital files return inline; scanned files arrive via webhook. Validate, score, done.",
    },
  ];
  return (
    <section id="how" className="border-y border-zinc-200/70 bg-white/40 dark:border-zinc-800/70 dark:bg-zinc-900/20">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading eyebrow="How it works" title="Three steps to structured candidates" />
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="font-display text-5xl font-semibold text-indigo-600/90 dark:text-indigo-400/90">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── API sample ──────────────────────────────────────────────────────────── */

function ApiSample() {
  return (
    <section id="api" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Developer-first"
        title="A request and a response. That's the integration."
        sub="API-key auth, multipart upload, structured JSON back. No SDK required."
      />
      <div className="mt-14 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-zinc-900/30">
        <div className="flex items-center gap-2 border-b border-zinc-800 px-5 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
          <span className="ml-2 font-mono text-xs text-zinc-500">Terminal</span>
        </div>
        <div className="grid gap-px bg-zinc-800 md:grid-cols-2">
          <pre className="overflow-x-auto bg-zinc-950 p-6 font-mono text-[13px] leading-relaxed text-zinc-300">
            <code>
              <span className="text-zinc-500"># Send a résumé</span>
              {"\n"}
              <span className="text-emerald-400">curl</span> -X POST {"\\"}
              {"\n  "}https://api.your-domain.com<span className="text-zinc-500">/api/v1/resume/parse</span> {"\\"}
              {"\n  "}-H <S>{'"X-API-Key: rp_live_…"'}</S> {"\\"}
              {"\n  "}-F <S>{'"file=@resume.pdf"'}</S>
            </code>
          </pre>
          <pre className="overflow-x-auto bg-zinc-950 p-6 font-mono text-[13px] leading-relaxed">
            <code>
              <span className="text-zinc-500">{"// 200 OK"}</span>
              {"\n"}
              <span className="text-zinc-500">{"{"}</span>
              {"\n  "}
              <K>{'"status"'}</K>: <S>{'"completed"'}</S>,
              {"\n  "}
              <K>{'"data"'}</K>: <span className="text-zinc-500">{"{ … }"}</span>,
              {"\n  "}
              <K>{'"confidence"'}</K>: <span className="text-zinc-500">{"{"}</span>{" "}
              <K>{'"overall"'}</K>: <span className="text-emerald-400">0.91</span> <span className="text-zinc-500">{"}"}</span>
              {"\n"}
              <span className="text-zinc-500">{"}"}</span>
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────────────────────── */

function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-8 py-16 text-center sm:px-16">
        <div aria-hidden className="pointer-events-none absolute inset-0 text-white/10 bg-dot-grid" />
        <div className="relative">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-white text-balance">
            Start parsing résumés in minutes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            Create an account, generate an API key, and make your first call today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-indigo-700 transition-transform hover:-translate-y-0.5"
            >
              Create your account
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-zinc-200/70 dark:border-zinc-800/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <Logo />
          <span className="font-display font-semibold">Blue-IQ Parser</span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-500">
          <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-200">Features</a>
          <a href="#api" className="hover:text-zinc-900 dark:hover:text-zinc-200">API</a>
          <Link href="/login" className="hover:text-zinc-900 dark:hover:text-zinc-200">Sign in</Link>
          <Link href="/signup" className="hover:text-zinc-900 dark:hover:text-zinc-200">Get started</Link>
        </nav>
        <p className="text-sm text-zinc-400">© {new Date().getFullYear()} BlueIQ</p>
      </div>
    </footer>
  );
}

/* ── Bits ────────────────────────────────────────────────────────────────── */

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance">{title}</h2>
      {sub && <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">{sub}</p>}
    </div>
  );
}

function K({ children }: { children: ReactNode }) {
  return <span className="text-indigo-500 dark:text-indigo-400">{children}</span>;
}
function S({ children }: { children: ReactNode }) {
  return <span className="text-emerald-600 dark:text-emerald-400">{children}</span>;
}

function Logo() {
  return (
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-sm">
      B
    </span>
  );
}

function Underline() {
  return (
    <span
      aria-hidden
      className="absolute -bottom-1.5 left-0 h-1 w-full rounded-full bg-indigo-500/40"
    />
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-0.5">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* icons (stroke, currentColor) */
const ic = "h-5 w-5";
function BracesIcon() {
  return (
    <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M8 4c-2 0-3 1-3 3v2c0 1-1 2-2 2 1 0 2 1 2 2v2c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2c0 1 1 2 2 2-1 0-2 1-2 2v2c0 2-1 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}
function ScanIcon() {
  return (
    <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M3 12h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}
function GaugeIcon() {
  return (
    <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M12 13l4-4M3.5 18a9 9 0 1 1 17 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}
function WebhookIcon() {
  return (
    <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M9 7a3 3 0 1 1 4 2.8L10 15M7 13a3 3 0 1 0 3 3h6M17 13a3 3 0 1 1-2.8 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}
function ShieldIcon() {
  return (
    <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM9.5 12l1.8 1.8L15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}
function PulseIcon() {
  return (
    <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M3 12h4l2-5 4 10 2-5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}
function FileIcon() {
  return (
    <svg className="h-4 w-4 text-indigo-500" viewBox="0 0 24 24" fill="none"><path d="M14 3v4a1 1 0 0 0 1 1h4M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}
