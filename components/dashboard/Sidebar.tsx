"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/account";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: OverviewIcon },
  { href: "/dashboard/keys", label: "API Keys", icon: KeyIcon },
  { href: "/dashboard/webhooks", label: "Webhooks", icon: WebhookIcon },
  { href: "/dashboard/profile", label: "Profile", icon: UserIcon },
  { href: "/docs", label: "Docs", icon: DocsIcon },
];

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-full flex-col gap-1 border-r border-zinc-200 bg-white px-3 py-4 dark:border-zinc-800 dark:bg-zinc-950">
      <Link href="/dashboard" className="mb-4 flex items-center gap-2.5 px-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">B</span>
        <span className="font-semibold tracking-tight">Blue-IQ Parser</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                (active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/60")
              }
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
        <div className="truncate px-3 pb-2 text-xs text-zinc-500 dark:text-zinc-400" title={email}>
          {email}
        </div>
        <button
          onClick={async () => {
            await logout();
            router.push("/login");
            router.refresh();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
        >
          <LogoutIcon />
          Sign out
        </button>
      </div>
    </aside>
  );
}

const cls = "h-[18px] w-[18px] shrink-0";
function OverviewIcon() {
  return <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M4 13h7V4H4v9zM13 20h7V4h-7v16zM4 20h7v-4H4v4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>;
}
function KeyIcon() {
  return <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M15 7a4 4 0 1 0-3.9 5L7 16v3h3v-2h2v-2h1.1A4 4 0 0 0 15 7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>;
}
function UserIcon() {
  return <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
}
function WebhookIcon() {
  return <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M9 7a3 3 0 1 1 4 2.8L10 15M7 13a3 3 0 1 0 3 3h6M17 13a3 3 0 1 1-2.8 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function DocsIcon() {
  return <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M7 3h7l4 4v14H7zM14 3v4h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>;
}
function LogoutIcon() {
  return <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M15 12H6m9 0-3-3m3 3-3 3M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
