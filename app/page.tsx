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
    "Turn PDF, DOCX, and scanned resumes into schema-validated JSON with one API call. Confidence scores, signed webhooks, privacy-first.",
};

export default async function Landing() {
  const authed = !!(await getSessionClaims());
  return (
    <div className="relative overflow-x-clip">
      <SiteNav authed={authed} />
      <Hero authed={authed} />
      <TrustStrip />
      <FeatureRow
        eyebrow="Predictable output"
        title="Schema-validated JSON, every single time"
        body="Every response is a strict, documented shape — personal info, experience, education, skills, certifications. Build against one contract and stop writing defensive code for the resume that breaks your parser."
        points={["Strict, versioned schema", "Stable field names", "Empty fields, never missing keys"]}
        visual={<SchemaVisual />}
      />
      <FeatureRow
        reverse
        tint
        eyebrow="Human-in-the-loop"
        title="Confidence scores you can route on"
        body="Per-field scores from 0 to 1 let you auto-accept clean records and send only the uncertain ones to a person. Most files clear automatically — your team reviews the handful that actually need eyes."
        points={["Per-field and overall scores", "Auto-accept thresholds", "Route the rest to review"]}
        visual={<ConfidenceVisual />}
      />
      <FeatureRow
        eyebrow="Async at scale"
        title="Signed webhooks for batch and OCR jobs"
        body="Scanned files and high-volume batches return over signed webhooks you can verify — no polling loops, no lost results. Each delivery carries an HMAC signature and timestamp."
        points={["HMAC-signed deliveries", "parse.completed · parse.failed · batch.completed", "Automatic retries"]}
        visual={<WebhookVisual />}
      />
      <Coverage />
      <UseCases />
      <Security />
      <ApiSample />
      <Cta authed={authed} />
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
        <span className="aurora-blob animate-aurora" style={{ background: "#1d4ed8", width: 520, height: 520, top: -180, left: "-10%", opacity: 0.32 }} />
        <span className="aurora-blob animate-aurora" style={{ background: "#5f87f6", width: 420, height: 420, top: -40, right: "-8%", opacity: 0.28, animationDelay: "-7s" }} />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:pt-20 lg:pb-28">
        <div>
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-xs font-semibold text-ink-soft shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-accent-600" aria-hidden />
            Resume Parsing API
          </span>

          <h1
            className="animate-fade-up mt-6 font-display text-[2.9rem] leading-[1.03] font-bold tracking-tight text-balance text-ink sm:text-6xl lg:text-[4rem]"
            style={{ animationDelay: "60ms" }}
          >
            Turn any resume into{" "}
            <span className="text-gradient">clean structured data</span>
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-lg text-lg leading-relaxed text-ink-soft"
            style={{ animationDelay: "100ms" }}
          >
            One API call extracts schema-validated, confidence-scored JSON from any PDF, DOCX, or scan — built for the documents your candidates actually send.
          </p>

          <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "150ms" }}>
            <Link
              href={authed ? "/dashboard" : "/signup"}
              className="group inline-flex items-center gap-2 rounded-full bg-accent-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-600/25 transition-all hover:-translate-y-0.5 hover:bg-accent-700"
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

          <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft" style={{ animationDelay: "200ms" }}>
            {["Privacy-first", "Any format", "Signed webhooks"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <CheckMini /> {t}
              </span>
            ))}
          </div>
        </div>

        <Reveal delay={120}>
          <HeroMockup />
        </Reveal>
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-accent-300/35 via-accent-400/20 to-accent-500/20 blur-2xl" />
      <Frame label="jane_okonkwo.pdf" badge="Parsed">
        <div className="grid grid-cols-[0.85fr_1.15fr] gap-4">
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
      </Frame>
    </div>
  );
}

/* ── Trust strip ─────────────────────────────────────────────────────────── */

function TrustStrip() {
  const cats = ["ATS Platforms", "Job Boards", "RPO & Volume", "Healthcare Staffing", "HR Tech"];
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-9">
        <p className="text-center text-sm font-medium text-ink-soft/80">Built to power resume parsing across your stack</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {cats.map((c) => (
            <span key={c} className="text-sm font-bold uppercase tracking-wide text-ink-soft/55">{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Alternating feature rows ────────────────────────────────────────────── */

function FeatureRow({
  eyebrow, title, body, points, visual, reverse, tint,
}: {
  eyebrow: string; title: string; body: string; points: string[]; visual: ReactNode; reverse?: boolean; tint?: boolean;
}) {
  return (
    <section className={tint ? "bg-paper" : "bg-surface"}>
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className={reverse ? "lg:order-2" : ""}>
            <p className="label-caps text-accent-600">{eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-[2.4rem] sm:leading-[1.1]">{title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{body}</p>
            <ul className="mt-7 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-[15px] font-medium text-ink">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700"><CheckMini /></span>
                  {p}
                </li>
              ))}
            </ul>
            <Link href="/docs" className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:text-accent-700">
              Read the docs <Arrow />
            </Link>
          </Reveal>
          <Reveal delay={120} className={reverse ? "lg:order-1" : ""}>
            {visual}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Coverage ────────────────────────────────────────────────────────────── */

function Coverage() {
  const formats = ["PDF", "DOCX", "PNG", "JPG", "TIFF", "Scanned PDF"];
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-24">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="label-caps text-accent-600">Coverage</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-[2.4rem] sm:leading-[1.1]">Every format your candidates send</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">From a crisp PDF to a phone photo of a printed CV — tiered OCR falls back automatically, only when it’s needed.</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
            {formats.map((f) => (
              <div key={f} className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-paper py-6 text-base font-bold text-ink">
                <span className="text-accent-600"><FileIcon /></span> {f}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Use cases ───────────────────────────────────────────────────────────── */

function UseCases() {
  const cards = [
    { icon: <UsersIcon />, title: "ATS & recruiting", body: "Auto-fill candidate records straight into your tracking system — no manual re-keying." },
    { icon: <BriefcaseIcon />, title: "Job boards", body: "One-click apply: turn any upload into a complete, structured profile the moment it lands." },
    { icon: <PlugIcon />, title: "RPO & HR tech", body: "Embed structured parsing inside your product, and process volume over signed webhooks." },
  ];
  return (
    <section id="solutions" className="bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-24">
        <Reveal><Heading eyebrow="Solutions" title="One engine, every hiring workflow" /></Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="group h-full rounded-3xl border border-line bg-surface p-8 transition-all hover:-translate-y-1 hover:border-accent-200 hover:shadow-[0_28px_56px_-30px_rgba(29,78,216,0.35)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-600 text-white shadow-lg shadow-accent-600/25">{c.icon}</div>
                <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-ink">{c.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Security (not an add-on) ────────────────────────────────────────────── */

function Security() {
  const items = [
    { icon: <ShieldIcon />, title: "Zero retention", body: "Resumes are parsed in memory and deleted on completion — never written to disk." },
    { icon: <LockIcon />, title: "Encrypted in transit", body: "Every request runs over TLS, authenticated with a per-account key you can rotate." },
    { icon: <SignIcon />, title: "Signed webhooks", body: "Async results carry an HMAC signature, so you can trust the payload’s origin." },
    { icon: <ListIcon />, title: "Content-free audit", body: "We log that a parse happened — never what was inside the document." },
  ];
  return (
    <section id="security" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-24">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="label-caps text-accent-600">Security &amp; privacy</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-[2.4rem] sm:leading-[1.1]">Security isn’t an add-on. It’s the default.</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">Candidate documents are some of the most sensitive data you handle. Blue-IQ treats them that way.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 70}>
              <div className="h-full rounded-3xl border border-line bg-paper p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-600 text-white shadow-lg shadow-accent-600/25">{it.icon}</span>
                <h3 className="mt-5 font-display text-base font-bold tracking-tight text-ink">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{it.body}</p>
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
    <section id="api" className="bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-24">
        <Reveal><Heading eyebrow="Developer-first" title="A request and a response. That’s the integration." /></Reveal>
        <Reveal delay={100}>
          <div className="mt-12 overflow-hidden rounded-[1.75rem] border border-[#1e2942] bg-[#0b1220] shadow-[0_40px_80px_-40px_rgba(29,78,216,0.45)]">
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
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────────────────────── */

function Cta({ authed }: { authed?: boolean }) {
  return (
    <section id="pricing" className="bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-vibrant px-7 py-16 text-center shadow-[0_40px_90px_-45px_rgba(29,78,216,0.6)] sm:px-16 sm:py-20">
            <div aria-hidden className="bg-dot-grid pointer-events-none absolute inset-0 text-white/[0.1]" />
            <span aria-hidden className="aurora-blob" style={{ background: "#5f87f6", width: 360, height: 360, top: -130, right: -50, opacity: 0.4 }} />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-white sm:text-5xl">Parse your first resume today</h2>
              <p className="mx-auto mt-4 max-w-md text-lg text-blue-100">Create an account, generate a key, and make your first call in minutes — no credit card.</p>
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
      </div>
    </section>
  );
}

/* ── Visuals (product frames) ────────────────────────────────────────────── */

function Frame({ label, badge, children }: { label: string; badge?: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-surface shadow-[0_40px_90px_-45px_rgba(29,78,216,0.45)]">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 inline-flex items-center gap-2 text-xs font-medium text-ink-soft"><FileIcon /> {label}</span>
        {badge && (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[0.7rem] font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {badge}
          </span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function SchemaVisual() {
  const rows = [
    ["personal_info", "object"],
    ["experience", "array"],
    ["education", "array"],
    ["skills", "array"],
    ["certifications", "array"],
  ];
  return (
    <Frame label="schema.json">
      <div className="space-y-2">
        {rows.map(([k, t]) => (
          <div key={k} className="flex items-center justify-between rounded-lg border border-line bg-surface px-3.5 py-2.5">
            <span className="font-mono text-sm text-ink">{k}</span>
            <span className="rounded-md bg-accent-50 px-2 py-0.5 font-mono text-[0.7rem] font-semibold text-accent-700">{t}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function ConfidenceVisual() {
  const fields: [string, number][] = [
    ["full_name", 0.98],
    ["email", 0.96],
    ["experience", 0.91],
    ["education", 0.74],
    ["skills", 0.62],
  ];
  return (
    <Frame label="confidence.json">
      <div className="space-y-3.5">
        {fields.map(([label, s], i) => {
          const low = s < 0.8;
          return (
            <div key={label}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono text-ink">{label}</span>
                <span className={"font-mono font-semibold " + (low ? "text-amber-600" : "text-accent-700")}>{s.toFixed(2)}</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-line">
                <span className={"grow-x block h-full rounded-full " + (low ? "bg-amber-500" : "bg-accent-600")} style={{ width: `${s * 100}%`, animationDelay: `${i * 110}ms` }} />
              </div>
            </div>
          );
        })}
        <p className="pt-1 text-xs text-ink-soft"><span className="font-semibold text-amber-600">Amber</span> fields fall below your threshold → route to review.</p>
      </div>
    </Frame>
  );
}

function WebhookVisual() {
  const events = [
    { e: "parse.completed", ok: true },
    { e: "batch.completed", ok: true },
    { e: "parse.failed", ok: false },
  ];
  return (
    <Frame label="deliveries">
      <div className="space-y-2">
        {events.map((ev) => (
          <div key={ev.e} className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3.5 py-3">
            <span className={"grid h-7 w-7 place-items-center rounded-full text-white " + (ev.ok ? "bg-accent-600" : "bg-amber-500")}>
              {ev.ok ? <CheckMini /> : <span className="text-xs font-bold">!</span>}
            </span>
            <span className="font-mono text-xs text-ink">{ev.e}</span>
            <span className="ml-auto font-mono text-[0.7rem] text-ink-soft">200 · 38ms</span>
          </div>
        ))}
        <div className="mt-1 rounded-lg bg-[#0b1220] px-3.5 py-2.5 font-mono text-[11px] text-[#8fb4ff]">
          X-Signature: <span className="text-[#dbe4f5]">sha256=…</span>
        </div>
      </div>
    </Frame>
  );
}

/* ── Bits ────────────────────────────────────────────────────────────────── */

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="label-caps text-accent-600">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-[2.5rem] sm:leading-[1.08]">{title}</h2>
    </div>
  );
}

function K({ children }: { children: ReactNode }) {
  return <span className="text-[#7fb4ff]">{children}</span>;
}
function S({ children }: { children: ReactNode }) {
  return <span className="text-[#86efac]">{children}</span>;
}

/* icons */
const ic = "h-5 w-5";
function Arrow() {
  return <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function CheckMini() {
  return <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function FileIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M14 3v4a1 1 0 0 0 1 1h4M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
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
function ShieldIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM9.5 12l1.8 1.8L15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
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
