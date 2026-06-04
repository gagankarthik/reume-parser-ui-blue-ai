"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandMark, Logo } from "@/components/ui";
import { logout } from "@/lib/account";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: OverviewIcon },
  { href: "/dashboard/analytics", label: "Analytics", icon: AnalyticsIcon },
  { href: "/dashboard/keys", label: "API Keys", icon: KeyIcon },
  { href: "/dashboard/webhooks", label: "Webhooks", icon: WebhookIcon },
  { href: "/dashboard/profile", label: "Profile", icon: UserIcon },
  { href: "/docs", label: "Docs", icon: DocsIcon },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

function NavLinks({
  pathname,
  collapsed,
  onNavigate,
}: {
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            aria-label={label}
            className={
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all " +
              (collapsed ? "justify-center " : "") +
              (active
                ? "bg-accent-50 text-accent-800 shadow-[inset_0_0_0_1px_var(--color-accent-200)]"
                : "text-ink-soft hover:bg-black/[0.035] hover:text-ink")
            }
          >
            {active && !collapsed && (
              <span aria-hidden className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent-700" />
            )}
            <span className={active ? "text-accent-700" : "text-ink-soft/80 group-hover:text-ink"}>
              <Icon active={active} />
            </span>
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

/** Account block: clicking the identity opens the Profile page; sign-out is separate. */
function Account({ email, collapsed }: { email: string; collapsed?: boolean }) {
  const router = useRouter();
  const initial = (email || "?").charAt(0).toUpperCase();

  async function onSignOut() {
    await logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="space-y-1 border-t border-line pt-3">
      <Link
        href="/dashboard/profile"
        title={collapsed ? "Profile" : undefined}
        className={
          "flex items-center gap-2.5 rounded-xl p-2 transition-colors hover:bg-black/[0.04] " +
          (collapsed ? "justify-center" : "")
        }
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-600 text-sm font-semibold text-white shadow-sm ring-1 ring-black/10">
          {initial}
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-ink">Profile</span>
              <span className="block truncate font-mono text-[11px] text-ink-soft" title={email}>{email}</span>
            </span>
            <svg className="h-4 w-4 shrink-0 text-ink-soft/60" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </>
        )}
      </Link>
      <button
        onClick={onSignOut}
        title={collapsed ? "Sign out" : undefined}
        aria-label="Sign out"
        className={
          "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink " +
          (collapsed ? "justify-center" : "")
        }
      >
        <LogoutIcon />
        {!collapsed && "Sign out"}
      </button>
    </div>
  );
}

/** Desktop rail (md+) — collapsible, persisted to localStorage. */
export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem("sb_collapsed") === "1");
  }, []);

  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem("sb_collapsed", next ? "1" : "0");
      return next;
    });
  }

  const w = collapsed ? "w-[76px]" : "w-64";

  return (
    <div className={"hidden shrink-0 md:block " + w}>
      <div className={"fixed h-screen " + w}>
        <aside className="flex h-full flex-col border-r border-line bg-paper">
          {/* Header */}
          <div className={"flex h-16 shrink-0 items-center border-b border-line " + (collapsed ? "justify-center px-2" : "justify-between px-4")}>
            <Link href="/dashboard" aria-label="Blue-IQ dashboard">
              {collapsed ? <BrandMark className="h-8 w-8" /> : <Logo className="h-7 w-auto" />}
            </Link>
            {!collapsed && (
              <button
                onClick={toggle}
                aria-label="Collapse sidebar"
                title="Collapse"
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink"
              >
                <CollapseIcon collapsed={false} />
              </button>
            )}
          </div>

          <NavLinks pathname={pathname} collapsed={collapsed} />

          {collapsed && (
            <div className="flex shrink-0 justify-center pb-1">
              <button
                onClick={toggle}
                aria-label="Expand sidebar"
                title="Expand"
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink"
              >
                <CollapseIcon collapsed />
              </button>
            </div>
          )}

          <div className={"shrink-0 " + (collapsed ? "px-2 pb-4" : "px-3 pb-4")}>
            <Account email={email} collapsed={collapsed} />
          </div>
        </aside>
      </div>
    </div>
  );
}

/** Mobile hamburger + slide-over drawer. */
export function MobileNav({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="grid h-10 w-10 place-items-center rounded-xl text-ink-soft hover:bg-black/[0.04]"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[82%] flex-col gap-1 border-r border-line bg-paper px-3 py-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between px-2">
              <Logo className="h-7 w-auto" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-black/[0.04]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            <Account email={email} />
          </div>
        </div>
      )}
    </>
  );
}

/* ── Icons ─────────────────────────────────────────────────────────────────── */
const cls = "h-[18px] w-[18px] shrink-0";
function OverviewIcon({ active }: { active?: boolean }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M4 13h7V4H4v9zM13 20h7V4h-7v16zM4 20h7v-4H4v4z" stroke="currentColor" strokeWidth={active ? 1.9 : 1.7} strokeLinejoin="round" /></svg>;
}
function AnalyticsIcon({ active }: { active?: boolean }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M4 19V5M4 19h16M8 19v-5M12 19V9M16 19v-7M20 19V6" stroke="currentColor" strokeWidth={active ? 1.9 : 1.7} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function KeyIcon({ active }: { active?: boolean }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M15 7a4 4 0 1 0-3.9 5L7 16v3h3v-2h2v-2h1.1A4 4 0 0 0 15 7z" stroke="currentColor" strokeWidth={active ? 1.9 : 1.7} strokeLinejoin="round" /></svg>;
}
function UserIcon({ active }: { active?: boolean }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth={active ? 1.9 : 1.7} strokeLinecap="round" /></svg>;
}
function WebhookIcon({ active }: { active?: boolean }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M9 7a3 3 0 1 1 4 2.8L10 15M7 13a3 3 0 1 0 3 3h6M17 13a3 3 0 1 1-2.8 4" stroke="currentColor" strokeWidth={active ? 1.9 : 1.7} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function DocsIcon({ active }: { active?: boolean }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M7 3h7l4 4v14H7zM14 3v4h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth={active ? 1.9 : 1.7} strokeLinejoin="round" /></svg>;
}
function LogoutIcon() {
  return <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M15 12H6m9 0-3-3m3 3-3 3M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function CollapseIcon({ collapsed }: { collapsed?: boolean }) {
  return (
    <svg className={cls + (collapsed ? " rotate-180" : "")} viewBox="0 0 24 24" fill="none">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 4v16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
