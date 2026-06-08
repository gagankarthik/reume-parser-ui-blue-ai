import { redirect } from "next/navigation";

import { isCurrentUserAdmin } from "@/lib/admin";

import CompanyDetailClient from "./CompanyDetailClient";

export const metadata = { title: "Customer — Admin" };

export default async function Page({ params }: { params: Promise<{ companyId: string }> }) {
  if (!(await isCurrentUserAdmin())) redirect("/dashboard");
  const { companyId } = await params;
  return <CompanyDetailClient companyId={companyId} />;
}
