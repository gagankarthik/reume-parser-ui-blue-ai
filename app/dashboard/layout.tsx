import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/LogoutButton";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getSessionClaims } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Security: server-side verification of the Cognito session on every request.
  const claims = await getSessionClaims();
  if (!claims) redirect("/login");

  return (
    <div className="flex min-h-screen">
      {/* Fixed sidebar on md+ */}
      <div className="hidden w-60 shrink-0 md:block">
        <div className="fixed h-screen w-60">
          <Sidebar email={claims.email} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 md:hidden dark:border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">B</span>
            Blue-IQ Parser
          </Link>
          <LogoutButton />
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">{children}</main>
      </div>
    </div>
  );
}
