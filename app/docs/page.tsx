import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Docs — Blue-IQ Parser API",
  description: "How to authenticate and use your Blue-IQ Parser API keys.",
};

const SECTIONS = [
  { id: "get-key", label: "Get an API key" },
  { id: "auth", label: "Authentication" },
  { id: "parse", label: "Parse a résumé" },
  { id: "poll", label: "Poll async jobs" },
  { id: "webhooks", label: "Webhooks" },
  { id: "errors", label: "Errors" },
  { id: "quickstart", label: "Quickstart" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-[var(--background)]/85 backdrop-blur-md dark:border-zinc-800/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">B</span>
            Blue-IQ Parser
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200/60 dark:text-zinc-300 dark:hover:bg-zinc-800/60">
              Dashboard
            </Link>
            <Link href="/signup" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-10 px-6 py-12">
        {/* TOC */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1 text-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">On this page</p>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block rounded-md px-3 py-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <article className="min-w-0 flex-1 space-y-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">API reference</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Using your API keys</h1>
            <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
              Authenticate with your API key, send a résumé, and get structured JSON back. Base URL is your
              API endpoint (shown when you generate a key).
            </p>
          </div>

          <Section id="get-key" title="1. Get an API key">
            <P>
              Sign in and open the{" "}
              <Link href="/dashboard" className="font-medium text-indigo-600 hover:underline">dashboard</Link>, then
              click <b>Generate key</b>. Your key looks like <Mono>rp_live_…</Mono> and is shown <b>once</b> —
              copy it somewhere safe. Treat it as a secret: use it only from your server, never in browser or
              mobile code.
            </P>
          </Section>

          <Section id="auth" title="2. Authentication">
            <P>Send your key in the <Mono>X-API-Key</Mono> header on every request.</P>
            <Code>{`X-API-Key: rp_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}</Code>
            <Table
              rows={[
                ["401", "Missing or invalid API key"],
                ["403", "API key revoked"],
              ]}
              head={["HTTP", "Meaning"]}
            />
          </Section>

          <Section id="parse" title="3. Parse a résumé">
            <P>
              <Mono>POST /api/v1/resume/parse</Mono> with <Mono>multipart/form-data</Mono> and a single{" "}
              <Mono>file</Mono> field. Supported: PDF, DOCX, PNG, JPG, TIFF (max 10&nbsp;MB).
            </P>
            <Code>{`curl -X POST "https://api.your-domain.com/api/v1/resume/parse" \\
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

          <Section id="poll" title="4. Poll async jobs">
            <P>
              For async jobs, poll <Mono>GET /api/v1/resume/job/&#123;job_id&#125;</Mono> until{" "}
              <Mono>status</Mono> is <Mono>completed</Mono> or <Mono>failed</Mono>. Results are kept for 1 hour.
            </P>
            <Code>{`GET /api/v1/resume/job/01J3K…
→ { "status": "completed", "data": { … }, "confidence": { … } }`}</Code>
          </Section>

          <Section id="webhooks" title="5. Webhooks">
            <P>
              Instead of polling, register a webhook to receive results. Each delivery is signed:
              verify <Mono>X-Signature</Mono> = <Mono>HMAC-SHA256(secret, &quot;&#123;timestamp&#125;.&#123;body&#125;&quot;)</Mono>{" "}
              against the raw body, and reject deliveries older than 5 minutes.
            </P>
            <Code>{`X-Signature: sha256=<hex>
X-Timestamp: <unix seconds>
X-Event:     parse.completed`}</Code>
          </Section>

          <Section id="errors" title="6. Errors">
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

          <Section id="quickstart" title="7. Quickstart">
            <H3>Node.js</H3>
            <Code>{`const form = new FormData();
form.append("file", fileBlob, "resume.pdf");

const res = await fetch("https://api.your-domain.com/api/v1/resume/parse", {
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
        "https://api.your-domain.com/api/v1/resume/parse",
        headers={"X-API-Key": "rp_live_your_key"},
        files={"file": f},
    )
data = r.json()
print(data["data"] if data["status"] == "completed" else data["job_id"])`}</Code>
          </Section>

          <div className="border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <Link href="/dashboard" className="text-sm font-medium text-indigo-600 hover:underline">
              → Go to the dashboard to generate a key
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

/* ── bits ── */

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="scroll-mt-24">
      <h2 id={id} className="scroll-mt-24 text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{children}</h3>;
}

function P({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{children}</p>;
}

function Mono({ children }: { children: ReactNode }) {
  return <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.85em] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">{children}</code>;
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed text-zinc-100">
      <code>{children}</code>
    </pre>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-2 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-zinc-100 dark:border-zinc-800/60">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300">
                  {j === 0 ? <span className="font-mono text-xs">{c}</span> : c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
