"use client";

// Enterprise top navigation with mega-menu dropdowns (Product / Developers),
// a Pricing link, a Company link to blue-iq.ai, and auth CTAs. Hover-to-open on
// desktop with keyboard + click support; a full slide-down sheet on mobile.

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

type MenuItem = {
  label: string;
  desc: string;
  href: string;
  icon: ReactNode;
};

type Menu = {
  id: string;
  label: string;
  columns: { heading: string; items: MenuItem[] }[];
  feature?: { eyebrow: string; title: string; body: string; href: string; cta: string; geo?: string };
};

const MENUS: Menu[] = [
  {
    id: "product",
    label: "Product",
    columns: [
      {
        heading: "Capabilities",
        items: [
          { label: "Resume Parser API", desc: "PDF, DOCX & scanned files to structured JSON", href: "#api", icon: <FileIcon /> },
          { label: "Confidence scoring", desc: "Per-field scores to route human review", href: "#api", icon: <GaugeIcon /> },
          { label: "Webhooks & events", desc: "Signed callbacks for async & batch jobs", href: "#api", icon: <BoltIcon /> },
          { label: "Schema & validation", desc: "One strict, versioned output contract", href: "#api", icon: <BracketsIcon /> },
        ],
      },
      {
        heading: "By industry",
        items: [
          { label: "Healthcare staffing", desc: "Clinical specialties, licences & credentials", href: "#solutions", icon: <PulseIcon /> },
          { label: "Recruiting & ATS", desc: "Auto-fill candidate records, zero re-keying", href: "#solutions", icon: <UsersIcon /> },
          { label: "Security & privacy", desc: "In-memory processing, zero retention", href: "#security", icon: <ShieldIcon /> },
        ],
      },
    ],
    feature: {
      eyebrow: "Featured",
      title: "Healthcare-grade extraction",
      body: "Normalise specialties, licences, and certifications across every clinical resume format.",
      href: "#solutions",
      cta: "See healthcare",
      geo: "Geometric-Line-08.svg",
    },
  },
  {
    id: "developers",
    label: "Developers",
    columns: [
      {
        heading: "Build",
        items: [
          { label: "API documentation", desc: "Auth, parsing, polling, webhooks & errors", href: "/docs", icon: <BookIcon /> },
          { label: "Quickstart", desc: "First structured response in minutes", href: "/docs#quickstart", icon: <RocketIcon /> },
        ],
      },
      {
        heading: "Reference",
        items: [
          { label: "Webhook events", desc: "parse.completed, parse.failed, batch.completed", href: "/docs#webhooks", icon: <BoltIcon /> },
          { label: "Error handling", desc: "Status codes & retry guidance", href: "/docs#errors", icon: <AlertIcon /> },
        ],
      },
    ],
    feature: {
      eyebrow: "No SDK required",
      title: "A request and a response",
      body: "API-key auth, multipart upload, structured JSON back. Integrate with the stack you already run.",
      href: "/docs",
      cta: "Read the docs",
      geo: "Geometric-Line-13.svg",
    },
  },
];

export function SiteNav({ authed = false }: { authed?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  // Close menus on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function openMenu(id: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(id);
  }
  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  }

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6" onMouseLeave={scheduleClose}>
        <div className="flex shrink-0 items-center gap-2.5">
          <Link href="/" className="flex items-center" onMouseEnter={scheduleClose}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Blue-IQ" className="h-7 w-auto sm:h-8" />
          </Link>
          <span className="hidden h-6 w-px bg-line sm:block" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Geometrics/Geometric-Line-16.svg" alt="" aria-hidden className="hidden h-6 w-6 select-none opacity-40 sm:block" />
        </div>

        {/* Desktop nav, single centered panel so it never runs off-screen */}
        <nav className="hidden items-center gap-1 lg:flex">
          {MENUS.map((m) => (
            <div key={m.id} onMouseEnter={() => openMenu(m.id)}>
              <button
                type="button"
                aria-expanded={open === m.id}
                aria-haspopup="true"
                onClick={() => setOpen(open === m.id ? null : m.id)}
                onFocus={() => openMenu(m.id)}
                className={
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors " +
                  (open === m.id ? "bg-accent-50 text-accent-700" : "text-ink-soft hover:text-ink")
                }
              >
                {m.label}
                <Chevron open={open === m.id} />
              </button>
            </div>
          ))}

          <a
            href="#pricing"
            onMouseEnter={scheduleClose}
            className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
          >
            Pricing
          </a>

          <a
            href="https://blue-iq.ai"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={scheduleClose}
            className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
          >
            Company
            <svg className="h-3.5 w-3.5 opacity-60" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {authed ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-px hover:bg-accent-700"
            >
              Dashboard
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden rounded-full bg-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-px hover:bg-accent-700 sm:inline-flex"
              >
                Get started
              </Link>
            </>
          )}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobile}
            onClick={() => setMobile((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-black/[0.04] lg:hidden"
          >
            {mobile ? <CloseIcon /> : <BurgerIcon />}
          </button>
        </div>

        {open && (
          <MegaPanel menu={MENUS.find((m) => m.id === open)!} onNavigate={() => setOpen(null)} />
        )}
      </div>
    </header>

    {mobile && <MobileSheet authed={authed} onNavigate={() => setMobile(false)} />}
    </>
  );
}

/* ── Desktop mega panel ──────────────────────────────────────────────────── */

function MegaPanel({ menu, onNavigate }: { menu: Menu; onNavigate: () => void }) {
  return (
    <div
      role="menu"
      className="animate-menu absolute left-1/2 top-full z-50 hidden w-[min(43rem,calc(100vw-1.5rem))] -translate-x-1/2 pt-3 lg:block"
    >
      <div className="grid w-full grid-cols-[1.45fr_0.85fr] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-24px_rgba(10,23,51,0.28)]">
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 p-5">
          {menu.columns.map((col) => (
            <div key={col.heading}>
              <p className="label-caps mb-1.5 text-ink-soft/70">{col.heading}</p>
              <ul className="space-y-1">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <PanelLink item={it} onNavigate={onNavigate} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {menu.feature && (
          <Link
            href={menu.feature.href}
            onClick={onNavigate}
            className="group relative flex flex-col justify-between overflow-hidden border-l border-line bg-accent-50 p-5 transition-colors hover:bg-accent-100"
          >
            {menu.feature.geo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/Geometrics/${menu.feature.geo}`}
                alt=""
                aria-hidden
                className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 select-none opacity-[0.5] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105"
              />
            )}
            <div className="relative">
              <p className="label-caps text-accent-700">{menu.feature.eyebrow}</p>
              <h4 className="mt-2.5 font-display text-[1.05rem] font-semibold leading-snug tracking-tight text-ink">
                {menu.feature.title}
              </h4>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{menu.feature.body}</p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700">
              {menu.feature.cta}
              <Arrow />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

function PanelLink({ item, onNavigate }: { item: MenuItem; onNavigate: () => void }) {
  const inner = (
    <span className="flex items-start gap-2.5 rounded-lg p-2 transition-colors hover:bg-accent-50">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-100">
        {item.icon}
      </span>
      <span>
        <span className="block text-[13px] font-semibold text-ink">{item.label}</span>
        <span className="mt-0.5 block text-[11px] leading-snug text-ink-soft">{item.desc}</span>
      </span>
    </span>
  );
  return item.href.startsWith("/") ? (
    <Link href={item.href} onClick={onNavigate} role="menuitem">
      {inner}
    </Link>
  ) : (
    <a href={item.href} onClick={onNavigate} role="menuitem" {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {inner}
    </a>
  );
}

/* ── Mobile sheet ────────────────────────────────────────────────────────── */

function MobileSheet({ authed, onNavigate }: { authed?: boolean; onNavigate: () => void }) {
  const [section, setSection] = useState<string | null>(MENUS[0].id);
  return (
    <div className="animate-menu fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-line bg-paper px-5 pb-10 pt-4 lg:hidden">
      <div className="space-y-1">
        {MENUS.map((m) => {
          const expanded = section === m.id;
          return (
            <div key={m.id} className="border-b border-line/70">
              <button
                type="button"
                onClick={() => setSection(expanded ? null : m.id)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between py-3.5 text-left text-base font-semibold text-ink"
              >
                {m.label}
                <Chevron open={expanded} />
              </button>
              {expanded && (
                <div className="pb-3">
                  {m.columns.map((col) => (
                    <div key={col.heading} className="mb-2">
                      <p className="label-caps px-1 py-1.5 text-ink-soft/70">{col.heading}</p>
                      {col.items.map((it) => (
                        <MobileLink key={it.label} item={it} onNavigate={onNavigate} />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <a href="#pricing" onClick={onNavigate} className="block border-b border-line/70 py-3.5 text-base font-semibold text-ink">
          Pricing
        </a>
        <a href="https://blue-iq.ai" target="_blank" rel="noopener noreferrer" onClick={onNavigate} className="flex items-center gap-1.5 border-b border-line/70 py-3.5 text-base font-semibold text-ink">
          Company
          <svg className="h-4 w-4 opacity-60" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        {authed ? (
          <Link href="/dashboard" onClick={onNavigate} className="inline-flex h-11 items-center justify-center rounded-full bg-accent-700 px-5 text-sm font-medium text-white shadow-sm">
            Go to dashboard
          </Link>
        ) : (
          <>
            <Link href="/signup" onClick={onNavigate} className="inline-flex h-11 items-center justify-center rounded-full bg-accent-700 px-5 text-sm font-medium text-white shadow-sm">
              Get started
            </Link>
            <Link href="/login" onClick={onNavigate} className="inline-flex h-11 items-center justify-center rounded-full border border-line-strong px-5 text-sm font-medium text-ink">
              Sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function MobileLink({ item, onNavigate }: { item: MenuItem; onNavigate: () => void }) {
  const inner = (
    <span className="flex items-center gap-3 rounded-xl px-1 py-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-100">
        {item.icon}
      </span>
      <span>
        <span className="block text-sm font-semibold text-ink">{item.label}</span>
        <span className="block text-xs text-ink-soft">{item.desc}</span>
      </span>
    </span>
  );
  return item.href.startsWith("/") ? (
    <Link href={item.href} onClick={onNavigate}>{inner}</Link>
  ) : (
    <a href={item.href} onClick={onNavigate} {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{inner}</a>
  );
}

/* ── Icons ───────────────────────────────────────────────────────────────── */

const ic = "h-[18px] w-[18px]";
function Chevron({ open }: { open: boolean }) {
  return (
    <svg className={"h-3.5 w-3.5 transition-transform " + (open ? "rotate-180" : "")} viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Arrow() {
  return <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function BurgerIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
function CloseIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
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
function LayersIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M12 3l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ShieldIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM9.5 12l1.8 1.8L15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function PlugIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0V8zM12 16v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function FileIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M14 3v4a1 1 0 0 0 1 1h4M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function GaugeIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M4 18a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M12 18l4-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
function BoltIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function BracketsIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M8 4H6a2 2 0 0 0-2 2v4l-2 2 2 2v4a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v4l2 2-2 2v4a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function BookIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5zM19 18H6a2 2 0 0 0-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function RocketIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M14 5c3-3 6-2 6-2s1 3-2 6l-7 7-4-4 7-7zM15 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function AlertIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
function ChartIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M4 20V10M10 20V4M16 20v-7M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
function SparkIcon() {
  return <svg className={ic} viewBox="0 0 24 24" fill="none"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
}
