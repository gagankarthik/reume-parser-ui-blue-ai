// Full enterprise footer: brand + newsletter, four link columns, and a legal
// bar. Marketing links point at on-page anchors or real routes (/docs, /login).

import Link from "next/link";
import type { ReactNode } from "react";

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
      { label: "Quickstart", href: "/docs" },
      { label: "Webhook events", href: "/docs" },
      { label: "Error handling", href: "/docs" },
      { label: "Status", href: "#" },
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

            <div className="mt-6 flex items-center gap-2.5">
              <Social label="GitHub" href="#"><GithubIcon /></Social>
              <Social label="LinkedIn" href="#"><LinkedinIcon /></Social>
              <Social label="X" href="#"><XIcon /></Social>
            </div>
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
            <a href="#" className="hover:text-ink">Terms</a>
            <a href="#" className="hover:text-ink">DPA</a>
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

function Social({ label, href, children }: { label: string; href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-accent-300 hover:bg-accent-50 hover:text-accent-700"
    >
      {children}
    </a>
  );
}

function GithubIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" /></svg>;
}
function LinkedinIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 8.5H4V20h2.94V8.5zM5.47 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM20 13.4c0-2.84-1.52-4.16-3.54-4.16-1.63 0-2.36.9-2.77 1.53V8.5H10.8c.04.83 0 11.5 0 11.5h2.93v-6.42c0-.26.02-.52.1-.7.2-.52.68-1.06 1.48-1.06 1.05 0 1.47.8 1.47 1.97V20H20v-6.6z" /></svg>;
}
function XIcon() {
  return <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.5 8.6L23 22h-6.9l-5.4-7-6.2 7H1.4l8-9.2L1 2h7l4.9 6.5L18.9 2zm-2.4 18h1.9L7.6 4H5.6l10.9 16z" /></svg>;
}
