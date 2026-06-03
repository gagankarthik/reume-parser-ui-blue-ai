import Link from "next/link";
import type { ReactNode } from "react";

import { BackButton } from "@/components/BackButton";
import { Logo } from "@/components/ui";
import { API_BASE } from "@/lib/config";

export const metadata = {
  title: "Docs — Blue-IQ Parser API",
  description: "How to authenticate and use your Blue-IQ Parser API keys.",
};

const SECTIONS = [
  { id: "get-key", label: "Get an API key" },
  { id: "auth", label: "Authentication" },
  { id: "parse", label: "Parse a resume" },
  { id: "poll", label: "Poll async jobs" },
  { id: "webhooks", label: "Webhooks" },
  { id: "errors", label: "Errors" },
  { id: "quickstart", label: "Quickstart" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-1">
            <BackButton />
            <Link href="/" className="hidden sm:block"><Logo className="h-7 w-auto" /></Link>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link href="/dashboard" className="rounded-lg px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink">
              Dashboard
            </Link>
            <Link href="/signup" className="rounded-lg bg-accent-700 px-4 py-2 text-sm font-medium text-[var(--surface)] transition-colors hover:bg-accent-800">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-12 px-5 py-10 sm:px-6 lg:py-14">
        {/* TOC */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1 text-sm">
            <p className="label-caps mb-3 text-ink-soft">On this page</p>
            {SECTIONS.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink"
              >
                <span className="font-mono text-xs text-accent-600/70">{String(i + 1).padStart(2, "0")}</span>
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <article className="min-w-0 flex-1 space-y-14">
          <div>
            <p className="label-caps text-accent-700">API Reference</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">Using your API keys</h1>
            <p className="mt-3 max-w-2xl text-ink-soft">
              Authenticate with your API key, send a resume, and get structured JSON back. All requests go to the
              base URL below.
            </p>
            <div className="mt-5 max-w-2xl">
              <BaseUrl />
            </div>
          </div>

          <Section n="01" id="get-key" title="Get an API key">
            <P>
              Sign in and open the{" "}
              <Link href="/dashboard" className="font-medium text-accent-700 hover:underline">dashboard</Link>, then
              click <b>Generate key</b>. Your key looks like <Mono>rp_live_…</Mono> and is shown <b>once</b> — copy it
              somewhere safe (or download the .csv). Treat it as a secret: use it only from your server, never in
              browser or mobile code.
            </P>
          </Section>

          <Section n="02" id="auth" title="Authentication">
            <P>Send your key in the <Mono>X-API-Key</Mono> header on every request.</P>
            <Code>{`X-API-Key: rp_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}</Code>
            <Table head={["HTTP", "Meaning"]} rows={[["401", "Missing or invalid API key"], ["403", "API key revoked"]]} />
          </Section>

          <Section n="03" id="parse" title="Parse a resume">
            <P>
              <Mono>POST /api/v1/resume/parse</Mono> with <Mono>multipart/form-data</Mono> and a single{" "}
              <Mono>file</Mono> field. Supported: PDF, DOCX, PNG, JPG, TIFF (max 10&nbsp;MB).
            </P>
            <Code>{`curl -X POST "${API_BASE}/api/v1/resume/parse" \\
  -H "X-API-Key: rp_live_your_key" \\
  -F "file=@resume.pdf"`}</Code>
            <P>
              Digital PDFs and DOCX return the result immediately (<Mono>status: &quot;completed&quot;</Mono>).
              Scanned PDFs and images need OCR and return <Mono>status: &quot;processing&quot;</Mono> with a{" "}
              <Mono>job_id</Mono> to poll (or use a webhook).
            </P>
            <Code>{`{
  "job_id": "01J3K…",
  "status": "completed",
  "data": { "personal_info": { … }, "experience": [ … ], "skills": [ … ] },
  "confidence": { "overall": 0.91 },
  "poll_url": null
}`}</Code>
          </Section>

          <Section n="04" id="poll" title="Poll async jobs">
            <P>
              For async jobs, poll <Mono>GET /api/v1/resume/job/&#123;job_id&#125;</Mono> until{" "}
              <Mono>status</Mono> is <Mono>completed</Mono> or <Mono>failed</Mono>. Results are kept for 1 hour.
            </P>
            <Code>{`GET /api/v1/resume/job/01J3K…
→ { "status": "completed", "data": { … }, "confidence": { … } }`}</Code>
          </Section>

          <Section n="05" id="webhooks" title="Webhooks">
            <P>
              Instead of polling, register a webhook to receive results. Each delivery is signed: verify{" "}
              <Mono>X-Signature</Mono> = <Mono>HMAC-SHA256(secret, &quot;&#123;timestamp&#125;.&#123;body&#125;&quot;)</Mono>{" "}
              against the raw body, and reject deliveries older than 5 minutes.
            </P>
            <Code>{`X-Signature: sha256=<hex>
X-Timestamp: <unix seconds>
X-Event:     parse.completed`}</Code>
          </Section>

          <Section n="06" id="errors" title="Errors">
            <P>All errors share one envelope. Branch on <Mono>error_code</Mono>; show <Mono>hint</Mono> to users.</P>
            <Code>{`{ "error": { "status_code": 413, "error_code": "FILE_TOO_LARGE",
            "detail": "…", "hint": "…", "request_id": "…" } }`}</Code>
            <Table
              head={["HTTP", "error_code"]}
              rows={[
                ["401 / 403", "MISSING_API_KEY · INVALID_API_KEY · REVOKED_API_KEY"],
                ["413 / 415", "FILE_TOO_LARGE · UNSUPPORTED_FILE_TYPE"],
                ["404", "JOB_NOT_FOUND"],
                ["500", "PARSE_FAILED · EXTRACTION_FAILED · OCR_FAILED"],
              ]}
            />
          </Section>

          <Section n="07" id="quickstart" title="Quickstart">
            <H3>Node.js</H3>
            <Code>{`const form = new FormData();
form.append("file", fileBlob, "resume.pdf");

const res = await fetch("${API_BASE}/api/v1/resume/parse", {
  method: "POST",
  headers: { "X-API-Key": process.env.RP_API_KEY },
  body: form,
});
const json = await res.json();
console.log(json.status === "completed" ? json.data : json.job_id);`}</Code>

            <H3>Python</H3>
            <Code>{`import requests

with open("resume.pdf", "rb") as f:
    r = requests.post(
        "${API_BASE}/api/v1/resume/parse",
        headers={"X-API-Key": "rp_live_your_key"},
        files={"file": f},
    )
data = r.json()
print(data["data"] if data["status"] == "completed" else data["job_id"])`}</Code>
          </Section>

          <div className="rule pt-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-accent-700 hover:underline">
              Go to the dashboard to generate a key
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

/* ── bits ── */

function BaseUrl() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
      <span className="label-caps shrink-0 text-ink-soft">Base URL</span>
      <code className="overflow-x-auto font-mono text-sm text-ink">{API_BASE}</code>
    </div>
  );
}

function Section({ n, id, title, children }: { n: string; id: string; title: string; children: ReactNode }) {
  return (
    <section className="scroll-mt-24">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-lg font-semibold italic text-accent-700/80">{n}</span>
        <h2 id={id} className="scroll-mt-24 font-display text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      </div>
      <hr className="rule mt-3 mb-5" />
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="label-caps mt-6 text-ink-soft">{children}</h3>;
}

function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-ink-soft">{children}</p>;
}

function Mono({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-accent-50 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-800 ring-1 ring-inset ring-accent-100">{children}</code>;
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-line bg-[#0a1330] p-4 font-mono text-[13px] leading-relaxed text-[#dbe4fb]">
      <code>{children}</code>
    </pre>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[22rem] text-left text-sm">
        <thead className="label-caps bg-black/[0.025] text-ink-soft">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-2.5 text-ink-soft">
                  {j === 0 ? <span className="font-mono text-xs text-ink">{c}</span> : c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
