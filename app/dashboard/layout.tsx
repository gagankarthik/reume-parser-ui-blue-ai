import Link from "next/link";
import { redirect } from "next/navigation";

import { MobileNav, Sidebar } from "@/components/dashboard/Sidebar";
import { Logo } from "@/components/ui";
import { isAdminEmail } from "@/lib/admin";
import { getSessionClaims } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Security: server-side verification of the Cognito session on every request.
  const claims = await getSessionClaims();
  if (!claims) redirect("/login");

  const isAdmin = isAdminEmail(claims.email);

  return (
    <div className="flex min-h-screen">
      {/* Collapsible fixed rail on md+ (manages its own width) */}
      <Sidebar email={claims.email} isAdmin={isAdmin} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar with slide-over nav */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-paper/85 px-3 backdrop-blur-md md:hidden">
          <MobileNav email={claims.email} isAdmin={isAdmin} />
          <Link href="/dashboard">
            <Logo className="h-7 w-auto" />
          </Link>
          <span className="w-10" aria-hidden />
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-7 lg:py-12">{children}</main>
      </div>
    </div>
  );
}
