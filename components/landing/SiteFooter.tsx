// Full enterprise footer: brand + newsletter, four link columns, and a legal
// bar. Marketing links point at on-page anchors or real routes (/docs, /login).

import Link from "next/link";

type Col = { heading: string; links: { label: string; href: string }[] };

const COLUMNS: Col[] = [
  {
    heading: "Product",
    links: [
      { label: "Resume Parser API", href: "#api" },
      { label: "Confidence scoring", href: "#api" },
      { label: "Webhooks", href: "#api" },
      { label: "Schema & validation", href: "#api" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "Healthcare staffing", href: "#solutions" },
      { label: "Recruiting & ATS", href: "#solutions" },
      { label: "Job boards", href: "#solutions" },
      { label: "RPO & high-volume", href: "#solutions" },
      { label: "Background screening", href: "#solutions" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "API documentation", href: "/docs" },
      { label: "Quickstart", href: "/docs#quickstart" },
      { label: "Webhook events", href: "/docs#webhooks" },
      { label: "Error handling", href: "/docs#errors" },
      { label: "Batch & large files", href: "/docs#batch" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Why Blue-IQ", href: "#api" },
      { label: "Security & privacy", href: "#security" },
      { label: "Sign in", href: "/login" },
      { label: "Get started", href: "/signup" },
      { label: "Contact sales", href: "#pricing" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface/60">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          {/* Brand + newsletter */}
          <div className="max-w-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Blue-IQ" className="h-9 w-auto" />
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Turn any resume — PDF, DOCX, or scanned image — into schema-validated JSON
              with one API call. Confidence-scored, privacy-first, built for scale.
            </p>

            <p className="mt-6 font-mono text-xs text-ink-soft/70">
              POST /api/v1/resume/parse · one call, structured JSON back
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="label-caps text-ink-soft/70">{col.heading}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.href.startsWith("/") ? (
                        <Link href={l.href} className="text-sm text-ink-soft transition-colors hover:text-accent-700">
                          {l.label}
                        </Link>
                      ) : (
                        <a href={l.href} className="text-sm text-ink-soft transition-colors hover:text-accent-700">
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Legal bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-7 sm:flex-row">
          <p className="text-sm text-ink-soft">© {new Date().getFullYear()} Blue-IQ. All rights reserved.</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-soft">
            <a href="#security" className="hover:text-ink">Privacy</a>
            <a href="#security" className="hover:text-ink">Security</a>
            <Link href="/docs" className="hover:text-ink">API docs</Link>
          </nav>
          <p className="inline-flex items-center gap-2 text-sm text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}


