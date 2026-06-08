import { redirect } from "next/navigation";

import { isCurrentUserAdmin } from "@/lib/admin";

import AdminClient from "./AdminClient";

export const metadata = { title: "Admin — Blue-IQ Parser" };

// Server gate: only allow-listed operators reach the admin overview. The session
// is already verified by the dashboard layout; here we additionally check the
// admin allow-list and redirect everyone else back to their own dashboard.
export default async function AdminPage() {
  if (!(await isCurrentUserAdmin())) redirect("/dashboard");
  return <AdminClient />;
}
