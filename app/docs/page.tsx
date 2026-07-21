import Link from "next/link";
import type { ReactNode } from "react";

import { BackButton } from "@/components/BackButton";
import { Logo } from "@/components/ui";
import { API_BASE } from "@/lib/config";

export const metadata = {
  title: "Docs - Blue-IQ Parser API",
  description: "How to authenticate and use your Blue-IQ Parser API keys.",
};

const SECTIONS = [
  { id: "get-key", label: "Get an API key" },
  { id: "auth", label: "Authentication" },
  { id: "parse", label: "Parse a resume" },
  { id: "output", label: "Output fields" },
  { id: "poll", label: "Poll async jobs" },
  { id: "batch", label: "Batch & large files" },
  { id: "feedback", label: "Submit feedback" },
  { id: "webhooks", label: "Webhooks" },
  { id: "errors", label: "Errors" },
  { id: "quickstart", label: "Quickstart" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
          <Link href="/"><Logo className="h-7 w-auto" /></Link>
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

      <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-6">
        <BackButton />
      </div>

      <div className="mx-auto flex max-w-6xl gap-12 px-5 pb-10 pt-4 sm:px-6 lg:pb-14">
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
              Authenticate with your API key, submit a resume, then poll for structured JSON. Every parse is
              asynchronous: the request returns a job id immediately and you poll (or use a webhook) for the
              result. All requests go to the base URL below.
            </p>
            <div className="mt-5 max-w-2xl">
              <BaseUrl />
            </div>
          </div>

          <Section n="01" id="get-key" title="Get an API key">
            <P>
              Sign in and open the{" "}
              <Link href="/dashboard" className="font-medium text-accent-700 hover:underline">dashboard</Link>, then
              click <b>Generate key</b>. Your key looks like <Mono>rp_live_...</Mono> and is shown <b>once</b> - copy it
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
              <Mono>file</Mono> field. Supported: PDF, DOCX, PNG, JPG, TIFF, WEBP (max 10&nbsp;MB).
            </P>
            <Code>{`curl -X POST "${API_BASE}/api/v1/resume/parse" \\
  -H "X-API-Key: rp_live_your_key" \\
  -F "file=@resume.pdf"`}</Code>
            <P>
              <b>Every parse is asynchronous.</b> The request returns immediately with a <Mono>job_id</Mono> and{" "}
              <Mono>status: &quot;processing&quot;</Mono> - it never returns parsed data inline. Poll the{" "}
              <Mono>poll_url</Mono> (see <a href="#poll" className="font-medium text-accent-700 hover:underline">Poll async jobs</a>)
              until the job is <Mono>completed</Mono>, or register a <a href="#webhooks" className="font-medium text-accent-700 hover:underline">webhook</a>.
              Add <Mono>-F &quot;force_textract=true&quot;</Mono> to force high-accuracy OCR on a difficult scan.
            </P>
            <Code>{`{
  "job_id":   "01J3K...",
  "status":   "processing",
  "poll_url": "/api/v1/resume/job/01J3K..."
}`}</Code>
            <Callout>
              <b>Breaking change.</b> The parse endpoints used to return the parsed record inline for digital
              PDFs and DOCX. They no longer do - <b>every</b> call to <Mono>/resume/parse</Mono>,{" "}
              <Mono>/resume/parse-uploaded</Mono> and <Mono>/resume/&#123;id&#125;/retry</Mono> now returns{" "}
              <Mono>&#123; job_id, status: &quot;processing&quot;, poll_url &#125;</Mono>, and you must poll (or use a
              webhook) for the result. Any client that read <Mono>data</Mono> from the POST response must switch
              to polling. This also removes the <Mono>&quot;The API did not respond within 27s&quot;</Mono> timeout on
              slow scans: the API returns instantly and runs OCR on the worker. The old <Mono>async_only</Mono>{" "}
              flag is deprecated and ignored - everything is async now.
            </Callout>
          </Section>

          <Section n="04" id="output" title="Output fields">
            <P>
              Every completed parse returns a healthcare-normalized record. Each per-role specialty is
              mapped to a platform specialty <Mono>id</Mono> (scoped to the role&apos;s profession) with a
              confidence score, credentials and state licences are captured separately, and each section
              carries a confidence score so you can route low-confidence records to human review.
            </P>
            <Table
              head={["Field", "What it holds"]}
              rows={[
                ["data.personal_info", "Name, post-nominal credentials[] (RN, BSN, MPH...), full address, contact, summary"],
                ["data.experience[]", "Per-role facility, title, dates, location, profession, specialties[] (each mapped to a platform specialty_id + confidence), shift, responsibilities[]"],
                ["data.licenses[]", "State licences with license_number, state, status, and compact flag - kept separate from certifications"],
                ["data.certifications[]", "Time-limited certifications (BLS, ACLS, CCRN...) with issuer and dates"],
                ["data.professional_associations[]", "Society / honor-society memberships, committees, and collaboratives (Sigma Theta Tau, unit committees...)"],
                ["data.awards[] · publications[]", "Awards and academic honors (Summa Cum Laude...); publications as citation strings"],
                ["confidence", "Per-section + overall scores, 0-1"],
                ["skills_validation", "Taxonomy match ratio and recognized / unrecognized split"],
                ["partial · warnings", "partial=true flags a degraded record; warnings[] explains what to review (e.g. no email detected on a low-quality scan, or a name that looks truncated vs the email)"],
              ]}
            />
            <P>
              <b>Always check <Mono>partial</Mono>.</b> When extraction degrades on a difficult document the API
              still returns whatever could be recovered (rather than failing), with <Mono>partial: true</Mono>{" "}
              and a human-readable <Mono>warnings</Mono> list - surface these records for review instead of
              auto-importing them.
            </P>
            <P>
              <b>Specialty mapping.</b> Each role&apos;s <Mono>specialties[]</Mono> is an array of objects, not
              strings. Every specialty is matched to a platform specialty <Mono>id</Mono> through a tiered
              match - exact name, then full name, then keyword, then an AI shortlist for the rest - <b>scoped to the
              role&apos;s profession</b>, so the same name resolves to the right id (an RN&apos;s{" "}
              <Mono>ICU</Mono> and a CNA&apos;s <Mono>ICU</Mono> carry different ids). The platform&apos;s exact
              names are preserved (never re-worded), and each match carries a <Mono>confidence</Mono> plus the{" "}
              <Mono>match_tier</Mono> that resolved it. A specialty that doesn&apos;t map is <b>still returned</b>{" "}
              with <Mono>specialty_id: null</Mono> and <Mono>matched: false</Mono> - review it, don&apos;t drop it.
            </P>
            <Code>{`"specialties": [
  {
    "name":         "ICU",        // platform's exact name, preserved
    "raw":          "ICU",        // original text as written on the résumé
    "specialty_id": "56",         // platform id - null when unmatched
    "group":        "ICU",
    "confidence":   1.0,          // 0-1 certainty of the id
    "matched":      true,
    "match_tier":   "name"        // name | full_name | keywords | ai | null
  },
  {
    "name":         "Cardiac Drip Unit",
    "raw":          "Cardiac Drip Unit",
    "specialty_id": null,         // no confident match -> kept for admin review
    "confidence":   0.0,
    "matched":      false,
    "match_tier":   null
  }
]`}</Code>
          </Section>

          <Section n="05" id="poll" title="Poll async jobs">
            <P>
              Every parse returns a <Mono>job_id</Mono>. Poll <Mono>GET /api/v1/resume/job/&#123;job_id&#125;</Mono>{" "}
              until <Mono>status</Mono> is <Mono>completed</Mono> - then read <Mono>data</Mono>,{" "}
              <Mono>confidence</Mono>, <Mono>partial</Mono> and <Mono>warnings</Mono> - or <Mono>failed</Mono>, which
              carries an <Mono>error</Mono> message. Results are kept for 1 hour. A parse you&apos;re unhappy with can
              be re-run with <Mono>POST /api/v1/resume/&#123;job_id&#125;/retry</Mono>, which re-uploads the file and
              returns a new <Mono>job_id</Mono> to poll (up to 3 retries).
            </P>
            <Code>{`GET /api/v1/resume/job/01J3K...

// still running
-> { "status": "processing" }

// done
-> { "status": "completed", "data": { ... }, "confidence": { ... },
    "skills_validation": { ... }, "partial": false, "warnings": [] }

// failed
-> { "status": "failed", "error": "OCR_FAILED: ..." }`}</Code>
          </Section>

          <Section n="06" id="batch" title="Batch & large files">
            <P>
              <b>Batch:</b> send up to 200 files in one <Mono>multipart/form-data</Mono> request to{" "}
              <Mono>POST /api/v1/resume/batch</Mono>. You get a <Mono>batch_id</Mono> plus per-file{" "}
              <Mono>job_ids</Mono>; poll <Mono>GET /api/v1/resume/batch/&#123;batch_id&#125;</Mono> for overall
              progress, or subscribe to the <Mono>batch.completed</Mono> webhook.
            </P>
            <Code>{`curl -X POST "${API_BASE}/api/v1/resume/batch" \\
  -H "X-API-Key: rp_live_your_key" \\
  -F "files=@a.pdf" -F "files=@b.docx" -F "files=@c.png"`}</Code>
            <P>
              <b>Large files (&gt; ~6 MB):</b> the direct endpoint is capped by the platform request limit, so use the
              two-step flow - <Mono>POST /api/v1/resume/upload-url</Mono> returns a presigned S3 form; upload the file
              straight to storage, then call <Mono>POST /api/v1/resume/parse-uploaded</Mono> with the returned{" "}
              <Mono>job_id</Mono> (and optional <Mono>force_textract</Mono>) and poll as usual. Files up to 10&nbsp;MB.
            </P>
          </Section>

          <Section n="07" id="feedback" title="Submit feedback">
            <P>
              After a user reviews and corrects a parsed resume, send the original and the
              corrected JSON back so we can improve accuracy.{" "}
              <Mono>POST /api/v1/resume/&#123;job_id&#125;/feedback</Mono> - server-to-server
              (uses your <Mono>X-API-Key</Mono>). Returns <Mono>202 Accepted</Mono>; feedback is
              processed asynchronously.
            </P>
            <Code>{`curl -X POST "${API_BASE}/api/v1/resume/01J3K.../feedback" \\
  -H "X-API-Key: rp_live_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
        "original": { ...parser JSON... },
        "updated":  { ...user-corrected JSON... },
        "changed":  true
      }'`}</Code>
            <P>
              Send it after the review step - only when the user changed something, or always as
              a quality signal (both are accepted). If you omit <Mono>changed</Mono> we derive it
              from the diff. The response lists the exact fields that changed.
            </P>
            <Code>{`{
  "feedback_id": "01J3K...",
  "job_id": "01J3K...",
  "status": "accepted",
  "changed": true,
  "changed_fields": ["personal_info.full_name", "skills[1]"]
}`}</Code>
          </Section>

          <Section n="08" id="webhooks" title="Webhooks">
            <P>
              Instead of polling, register a webhook to receive results. Each delivery is signed: verify{" "}
              <Mono>X-Signature</Mono> = <Mono>HMAC-SHA256(secret, &quot;&#123;timestamp&#125;.&#123;body&#125;&quot;)</Mono>{" "}
              against the raw body, and reject deliveries older than 5 minutes.
            </P>
            <Code>{`X-Signature: sha256=<hex>
X-Timestamp: <unix seconds>
X-Event:     parse.completed`}</Code>
          </Section>

          <Section n="09" id="errors" title="Errors">
            <P>All errors share one envelope. Branch on <Mono>error_code</Mono>; show <Mono>hint</Mono> to users.</P>
            <Code>{`{ "error": { "status_code": 413, "error_code": "FILE_TOO_LARGE",
            "detail": "...", "hint": "...", "request_id": "..." } }`}</Code>
            <Table
              head={["HTTP", "error_code"]}
              rows={[
                ["401 / 403", "MISSING_API_KEY · INVALID_API_KEY · REVOKED_API_KEY"],
                ["413 / 415", "FILE_TOO_LARGE · UNSUPPORTED_FILE_TYPE"],
                ["404", "JOB_NOT_FOUND"],
                ["500", "PARSE_FAILED · EXTRACTION_FAILED · OCR_FAILED"],
                ["failed job (poll)", "WORKER_DISPATCH_FAILED - async processing could not start; retry the upload"],
              ]}
            />
          </Section>

          <Section n="10" id="quickstart" title="Quickstart">
            <H3>Node.js</H3>
            <Code>{`const key = process.env.RP_API_KEY;
const form = new FormData();
form.append("file", fileBlob, "resume.pdf");

// 1. Submit - returns a job_id immediately
const submit = await fetch("${API_BASE}/api/v1/resume/parse", {
  method: "POST",
  headers: { "X-API-Key": key },
  body: form,
});
const { job_id } = await submit.json();

// 2. Poll until it leaves "processing" (or use a webhook)
let job;
do {
  await new Promise((r) => setTimeout(r, 1500));
  job = await (await fetch(
    "${API_BASE}/api/v1/resume/job/" + job_id,
    { headers: { "X-API-Key": key } },
  )).json();
} while (job.status === "processing");

console.log(job.status === "completed" ? job.data : job.error);`}</Code>

            <H3>Python</H3>
            <Code>{`import time, requests

BASE = "${API_BASE}"
KEY  = "rp_live_your_key"

# 1. Submit - returns a job_id immediately
with open("resume.pdf", "rb") as f:
    job_id = requests.post(
        f"{BASE}/api/v1/resume/parse",
        headers={"X-API-Key": KEY},
        files={"file": f},
    ).json()["job_id"]

# 2. Poll until it leaves "processing" (or use a webhook)
while True:
    job = requests.get(
        f"{BASE}/api/v1/resume/job/{job_id}",
        headers={"X-API-Key": KEY},
    ).json()
    if job["status"] != "processing":
        break
    time.sleep(1.5)

print(job["data"] if job["status"] == "completed" else job["error"])`}</Code>
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

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-accent-200 bg-accent-50/60 px-4 py-3 text-[15px] leading-relaxed text-ink-soft">
      {children}
    </div>
  );
}

function Mono({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-accent-50 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-800 ring-1 ring-inset ring-accent-100">{children}</code>;
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-line bg-[#0b1220] p-4 font-mono text-[13px] leading-relaxed text-[#dbe4f5]">
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
