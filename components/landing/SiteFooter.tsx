// Full enterprise footer: brand + newsletter, four link columns, and a legal
// bar. Marketing links point at on-page anchors or real routes (/docs, /login).

import Link from "next/link";

type Col = { heading: string; links: { label: string; href: string }[] };

const COLUMNS: Col[] = [
  {
    heading: "Capture",
    links: [
      { label: "How it works", href: "#how" },
      { label: "Confidence scoring", href: "#why" },
      { label: "Schema & validation", href: "#why" },
      { label: "What it reads", href: "#how" },
      { label: "Trust & security", href: "#security" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "The Sonar engine", href: "#platform" },
      { label: "How it works", href: "#how" },
      { label: "Why it is more", href: "#why" },
      { label: "Trust & security", href: "#security" },
      { label: "Explore the platform", href: "https://blue-iq.ai/products" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "API documentation", href: "/docs" },
      { label: "Quickstart", href: "/docs#quickstart" },
      { label: "Webhook events", href: "/docs#webhooks" },
      { label: "Error handling", href: "/docs#errors" },
      { label: "UAT console", href: "https://uat.parsinglab.blue-iq.ai/" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Blue-IQ", href: "https://blue-iq.ai/about" },
      { label: "Our products", href: "https://blue-iq.ai/products" },
      { label: "Book a demo", href: "https://blue-iq.ai/contact" },
      { label: "Contact sales", href: "https://blue-iq.ai/contact" },
      { label: "Security & privacy", href: "#security" },
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
              Blue-IQ Capture turns any document - resumes, contracts, invoices, licenses -
              into schema-validated, confidence-scored data. The foundation of the Blue-IQ
              platform, powered by the Sonar engine.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              {["SOC 2 Type II", "HIPAA", "GDPR"].map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink">
                  <svg className="h-3.5 w-3.5 text-accent-700" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {b}
                </span>
              ))}
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
                        <a
                          href={l.href}
                          {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="text-sm text-ink-soft transition-colors hover:text-accent-700"
                        >
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
            <a href="https://blue-iq.ai/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-ink">Privacy</a>
            <a href="https://blue-iq.ai/terms" target="_blank" rel="noopener noreferrer" className="hover:text-ink">Terms</a>
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


