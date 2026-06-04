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
import transferData from "@/lib/lottie/transfer.json";

export const metadata = {
  title: "Blue-IQ Parser API — structured data from any resume",
  description:
    "Turn PDF, DOCX, and scanned resumes into schema-validated JSON with one API call. Confidence scores, webhooks, privacy-first.",
};

/* Bright, varied hues for playful cards (literal classes for Tailwind JIT). */
const HUES = [
  { tile: "bg-blue-100 text-blue-600 ring-blue-200", grad: "from-blue-500 to-indigo-500", soft: "from-blue-50" },
  { tile: "bg-violet-100 text-violet-600 ring-violet-200", grad: "from-violet-500 to-fuchsia-500", soft: "from-violet-50" },
  { tile: "bg-pink-100 text-pink-600 ring-pink-200", grad: "from-pink-500 to-rose-500", soft: "from-pink-50" },
  { tile: "bg-cyan-100 text-cyan-600 ring-cyan-200", grad: "from-cyan-500 to-sky-500", soft: "from-cyan-50" },
  { tile: "bg-amber-100 text-amber-600 ring-amber-200", grad: "from-amber-400 to-orange-500", soft: "from-amber-50" },
  { tile: "bg-emerald-100 text-emerald-600 ring-emerald-200", grad: "from-emerald-500 to-teal-500", soft: "from-emerald-50" },
];

export default async function Landing() {
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
      <CtaBand authed={authed} />
      <SiteFooter />
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */

function Hero({ authed }: { authed?: boolean }) {
  return (
    <section className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-vibrant-soft" />
        <span className="aurora-blob animate-aurora" style={{ background: "#6366f1", width: 520, height: 520, top: -150, left: "-8%", opacity: 0.5 }} />
        <span className="aurora-blob animate-aurora" style={{ background: "#ec4899", width: 440, height: 440, top: -60, right: "-6%", opacity: 0.42, animationDelay: "-7s" }} />
        <span className="aurora-blob animate-aurora" style={{ background: "#22d3ee", width: 400, height: 400, top: 160, left: "38%", opacity: 0.34, animationDelay: "-13s" }} />
        <span className="aurora-blob" style={{ background: "#fbbf24", width: 300, height: 300, top: 60, right: "26%", opacity: 0.26 }} />
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-14 pb-16 text-center sm:px-6 lg:pt-20">
        <Link
          href="/docs"
          className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-xs font-semibold text-ink-soft shadow-sm backdrop-blur transition-colors hover:border-accent-300"
        >
          <span className="h-2 w-2 rounded-full bg-vibrant" aria-hidden />
          Resume Parsing API
          <span className="text-accent-600">→</span>
        </Link>

        <h1
          className="animate-fade-up mx-auto mt-7 max-w-4xl font-display text-[3rem] leading-[1.02] font-bold tracking-tight text-balance text-ink sm:text-6xl lg:text-7xl"
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
      </div>

      <Reveal className="mx-auto max-w-6xl px-5 sm:px-6" delay={120}>
        <HeroScene />
      </Reveal>
    </section>
  );
}

function HeroScene() {
  return (
    <div className="relative">
      <div className="absolute -left-5 top-14 z-20 hidden animate-float lg:block">
        <ScanCard />
      </div>
      <div className="absolute -right-5 bottom-16 z-20 hidden animate-float-slow lg:block">
        <WebhookCard />
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-gradient-to-br from-violet-100/80 via-surface to-cyan-100/70 p-1 shadow-[0_50px_120px_-55px_rgba(99,102,241,0.55)]">
        <div className="relative overflow-hidden rounded-[2.2rem]">
          <span className="aurora-blob" style={{ background: "#818cf8", width: 320, height: 320, top: -80, left: -50, opacity: 0.5 }} />
          <span className="aurora-blob" style={{ background: "#f472b6", width: 280, height: 280, bottom: -110, right: -40, opacity: 0.42 }} />

          <div className="relative px-5 py-14 sm:px-8 sm:py-20">
            <div className="glass mx-auto max-w-md rounded-3xl p-5">
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface/80 px-3.5 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100 text-blue-600 ring-1 ring-inset ring-blue-200">
                  <FileIcon />
                </span>
                <span className="flex-1 truncate text-sm font-semibold text-ink">jane_okonkwo.pdf</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[0.7rem] font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Parsed
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  ["name", "Jane Okonkwo", "violet"],
                  ["role", "ICU Nurse", "blue"],
                  ["license", "TX · RN", "cyan"],
                  ["skills", "ACLS · Triage", "pink"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-line bg-surface/80 px-3 py-2">
                    <div className="label-caps text-ink-soft/70">{k}</div>
                    <div className="mt-0.5 truncate text-xs font-semibold text-ink">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {["PDF", "DOCX", "Scanned", "Webhooks", "JSON"].map((t) => (
                <span key={t} className="rounded-full border border-line bg-surface/70 px-3 py-1 text-[0.7rem] font-semibold text-ink-soft backdrop-blur">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanCard() {
  return (
    <div className="glass flex items-center gap-2.5 rounded-2xl p-2.5 pr-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
        <LottieFx data={scanData} className="h-9 w-9" />
      </span>
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
      <span className="grid h-9 w-9 place-items-center rounded-full bg-pink-100 text-pink-600">
        <CheckIcon />
      </span>
      <div>
        <div className="font-mono text-xs font-semibold text-ink">parse.completed</div>
        <div className="text-[0.7rem] text-ink-soft">signed webhook delivered</div>
      </div>
    </div>
  );
}

/* ── Bento feature grid ──────────────────────────────────────────────────── */

function Bento() {
  return (
    <section id="api" className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:py-28">
      <Reveal>
        <SectionHeading eyebrow="The platform" title="Less parsing code. More clean data." />
      </Reveal>

      <div className="mt-14 grid auto-rows-[minmax(0,1fr)] gap-5 lg:grid-cols-6">
        <Reveal className="lg:col-span-3" delay={0}>
          <BentoCard hue={0} icon={<BracketsIcon />} title="Schema-validated JSON" sub="One strict contract, every file">
            <div className="space-y-2">
              {[
                ["personal_info", "object"],
                ["experience", "array"],
                ["education", "array"],
                ["skills", "array"],
                ["certifications", "array"],
              ].map(([k, t]) => (
                <div key={k} className="flex items-center justify-between rounded-xl border border-line bg-surface px-3.5 py-2.5">
                  <span className="font-mono text-sm text-ink">{k}</span>
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 font-mono text-[0.7rem] font-semibold text-blue-600">{t}</span>
                </div>
              ))}
            </div>
          </BentoCard>
        </Reveal>

        <Reveal className="lg:col-span-3" delay={80}>
          <BentoCard hue={1} icon={<GaugeIcon />} title="Confidence you can route on" sub="Auto-accept clean, review the rest">
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
                      <span className={"font-mono font-semibold " + (low ? "text-pink-600" : "text-violet-600")}>{s.toFixed(2)}</span>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-line">
                      <span
                        className={"grow-x block h-full rounded-full bg-gradient-to-r " + (low ? "from-pink-400 to-rose-500" : "from-violet-500 to-fuchsia-500")}
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
          <BentoCard hue={3} icon={<FileIcon />} title="Any format in" sub="Digital or scanned, we handle it">
            <div className="grid grid-cols-3 gap-2">
              {["PDF", "DOCX", "PNG", "JPG", "TIFF", "OCR"].map((t) => (
                <span key={t} className="flex items-center justify-center rounded-xl border border-line bg-surface py-3 text-xs font-bold text-ink-soft">{t}</span>
              ))}
            </div>
          </BentoCard>
        </Reveal>

        <Reveal className="lg:col-span-2" delay={80}>
          <BentoCard hue={2} icon={<BoltIcon />} title="Signed webhooks" sub="Async results you can trust">
            <div className="space-y-2">
              {["parse.completed", "parse.failed", "batch.completed"].map((e, i) => (
                <div key={e} className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5">
                  <span className={"h-2 w-2 rounded-full " + (i === 1 ? "bg-pink-500" : "bg-emerald-500")} />
                  <span className="font-mono text-xs text-ink">{e}</span>
                </div>
              ))}
            </div>
          </BentoCard>
        </Reveal>

        <Reveal className="lg:col-span-2" delay={160}>
          <BentoCard hue={5} icon={<ShieldIcon />} title="Private by design" sub="Parsed in memory, never stored">
            <div className="flex h-full flex-col items-center justify-center py-2 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-300/50">
                <ShieldIcon big />
              </span>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {["Zero retention", "TLS", "Audit-only"].map((t) => (
                  <span key={t} className="rounded-full bg-emerald-100 px-2.5 py-1 text-[0.7rem] font-semibold text-emerald-600">{t}</span>
                ))}
              </div>
            </div>
          </BentoCard>
        </Reveal>
      </div>
    </section>
  );
}

function BentoCard({ hue, icon, title, sub, children }: { hue: number; icon: ReactNode; title: string; sub: string; children: ReactNode }) {
  const h = HUES[hue];
  return (
    <div className={"group flex h-full flex-col rounded-[1.75rem] border border-line bg-gradient-to-br to-surface p-6 shadow-[0_2px_4px_rgba(25,22,54,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(99,102,241,0.4)] sm:p-7 " + h.soft}>
      <div className="mb-5 flex items-center gap-3">
        <span className={"grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1 ring-inset " + h.tile}>{icon}</span>
        <div>
          <h3 className="font-display text-lg font-bold tracking-tight text-ink">{title}</h3>
          <p className="text-sm text-ink-soft">{sub}</p>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

/* ── Showcase (dark, animated) ───────────────────────────────────────────── */

function Showcase() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#241f53] via-[#191636] to-[#0e0c24]">
      <div aria-hidden className="bg-dot-grid pointer-events-none absolute inset-0 text-white/[0.06]" />
      <span aria-hidden className="aurora-blob animate-aurora" style={{ background: "#8b5cf6", width: 460, height: 460, top: -140, left: "6%", opacity: 0.5 }} />
      <span aria-hidden className="aurora-blob animate-aurora" style={{ background: "#ec4899", width: 400, height: 400, bottom: -160, right: "6%", opacity: 0.42, animationDelay: "-8s" }} />
      <span aria-hidden className="aurora-blob animate-aurora" style={{ background: "#22d3ee", width: 320, height: 320, top: "30%", left: "44%", opacity: 0.3, animationDelay: "-4s" }} />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <Reveal>
          <p className="label-caps text-pink-300">In action</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-white sm:text-[2.7rem] sm:leading-[1.08]">
            From upload to structured JSON — in one call
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-indigo-100/80">
            Send any resume; get back clean, confidence-scored fields your app can use immediately.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            {["No SDK", "Inline or webhook", "Per-field scores", "Zero retention"].map((t) => (
              <span key={t} className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur">
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto w-full max-w-md rounded-[2.25rem] border border-white/15 bg-white/[0.06] p-6 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.8)] backdrop-blur sm:p-8">
            <div className="mx-auto grid h-56 w-56 place-items-center rounded-full ring-1 ring-inset ring-white/10 sm:h-64 sm:w-64" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.35), rgba(14,12,36,0))" }}>
              <LottieFx data={scanData} className="h-44 w-44 sm:h-52 sm:w-52" />
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
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
    <section id="solutions" className="relative overflow-hidden bg-vibrant-soft">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="AI Solutions" title="One engine, every hiring workflow" />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => {
            const h = HUES[i % HUES.length];
            return (
              <Reveal key={c.title} delay={(i % 3) * 80}>
                <div className="group h-full rounded-[1.75rem] border border-line bg-surface p-7 transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(99,102,241,0.4)]">
                  <div className={"flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg " + h.grad}>
                    {c.icon}
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-ink">{c.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <span key={t} className={"rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ring-1 ring-inset " + h.tile}>{t}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Workflow ────────────────────────────────────────────────────────────── */

function Workflow() {
  const steps = [
    { n: "01", title: "Send a file", body: "POST any resume with your API key.", anim: transferData, grad: "from-blue-500 to-indigo-600" },
    { n: "02", title: "We structure it", body: "Extraction, OCR when needed, then AI structuring.", anim: scanData, grad: "from-violet-500 to-fuchsia-600" },
    { n: "03", title: "Get clean JSON", body: "Inline or via signed webhook. Score, done.", anim: checkData, grad: "from-pink-500 to-rose-600" },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:py-28">
      <Reveal>
        <SectionHeading eyebrow="How it works" title="Three steps, into your pipeline" />
      </Reveal>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 100}>
            <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-line bg-surface p-8 shadow-sm">
              <span className="pointer-events-none absolute right-6 top-6 font-display text-5xl font-bold text-accent-100">{s.n}</span>
              <span className={"grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg " + s.grad}>
                <LottieFx data={s.anim} className="h-11 w-11" />
              </span>
              <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-ink">{s.title}</h3>
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
    { icon: <ShieldIcon />, title: "Zero retention", hue: 5 },
    { icon: <LockIcon />, title: "TLS + API keys", hue: 0 },
    { icon: <SignIcon />, title: "Signed webhooks", hue: 1 },
    { icon: <ListIcon />, title: "Audit-only logs", hue: 2 },
  ];
  return (
    <section id="security" className="mx-auto max-w-7xl px-5 py-20 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
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
          {items.map((it, i) => {
            const h = HUES[it.hue];
            return (
              <Reveal key={it.title} delay={i * 70}>
                <div className="flex h-full flex-col items-center gap-3 rounded-[1.5rem] border border-line bg-surface p-5 text-center shadow-sm">
                  <span className={"grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg " + h.grad}>
                    {it.icon}
                  </span>
                  <span className="text-sm font-bold text-ink">{it.title}</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── API sample ──────────────────────────────────────────────────────────── */

function ApiSample() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:py-28">
      <Reveal>
        <SectionHeading eyebrow="Developer-first" title="A request and a response" />
      </Reveal>
      <Reveal delay={100}>
        <div className="mt-12 overflow-hidden rounded-[2rem] border border-[#2a2550] bg-[#15122f] shadow-[0_40px_80px_-40px_rgba(99,102,241,0.5)]">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-xs text-[#9b94c9]">Terminal</span>
          </div>
          <div className="grid gap-px bg-white/10 md:grid-cols-2">
            <pre className="overflow-x-auto bg-[#15122f] p-6 font-mono text-[13px] leading-relaxed text-[#e6e2ff]">
              <code>
                <span className="text-[#9b94c9]"># Send a resume</span>
                {"\n"}<span className="text-[#a5b4fc]">curl</span> -X POST {"\\"}
                {"\n  "}{API_BASE}<span className="text-[#9b94c9]">/api/v1/resume/parse</span> {"\\"}
                {"\n  "}-H <S>{'"X-API-Key: rp_live_…"'}</S> {"\\"}
                {"\n  "}-F <S>{'"file=@resume.pdf"'}</S>
              </code>
            </pre>
            <pre className="overflow-x-auto bg-[#15122f] p-6 font-mono text-[13px] leading-relaxed text-[#e6e2ff]">
              <code>
                <span className="text-[#9b94c9]">{"// 200 OK"}</span>
                {"\n"}<span className="text-[#9b94c9]">{"{"}</span>
                {"\n  "}<K>{'"status"'}</K>: <S>{'"completed"'}</S>,
                {"\n  "}<K>{'"data"'}</K>: <span className="text-[#9b94c9]">{"{ … }"}</span>,
                {"\n  "}<K>{'"confidence"'}</K>: <span className="text-[#9b94c9]">{"{"}</span>{" "}
                <K>{'"overall"'}</K>: <span className="text-[#f9a8d4]">0.91</span> <span className="text-[#9b94c9]">{"}"}</span>
                {"\n"}<span className="text-[#9b94c9]">{"}"}</span>
              </code>
            </pre>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────────────────────── */

function CtaBand({ authed }: { authed?: boolean }) {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-5 pb-24 sm:px-6 lg:pb-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-vibrant px-7 py-16 text-center shadow-[0_40px_90px_-45px_rgba(99,102,241,0.7)] sm:px-16 sm:py-20">
          <div aria-hidden className="bg-dot-grid pointer-events-none absolute inset-0 text-white/[0.12]" />
          <span aria-hidden className="aurora-blob" style={{ background: "#22d3ee", width: 320, height: 320, top: -120, right: -40, opacity: 0.45 }} />
          <span aria-hidden className="aurora-blob" style={{ background: "#fbbf24", width: 260, height: 260, bottom: -110, left: -20, opacity: 0.35 }} />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-white sm:text-5xl">
              Parse your first resume today
            </h2>
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

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
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
function CheckIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function FileIcon() {
  return <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none"><path d="M14 3v4a1 1 0 0 0 1 1h4M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
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
function ShieldIcon({ big }: { big?: boolean }) {
  return <svg className={big ? "h-7 w-7" : ic} viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM9.5 12l1.8 1.8L15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
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
function LockIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
function SignIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 11l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ListIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
