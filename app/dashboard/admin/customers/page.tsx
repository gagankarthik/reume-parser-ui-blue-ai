import { redirect } from "next/navigation";

import { isCurrentUserAdmin } from "@/lib/admin";

import CustomersClient from "./CustomersClient";

export const metadata = { title: "Customers — Admin" };

export default async function CustomersPage() {
  if (!(await isCurrentUserAdmin())) redirect("/dashboard");
  return <CustomersClient />;
}
