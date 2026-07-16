import { redirect } from "next/navigation";

import { isCurrentUserAdmin } from "@/lib/admin";
import { PARSER_TABLES } from "@/lib/dynamo";

import DataClient from "./DataClient";

export const metadata = { title: "Data - Blue-IQ Parser" };
export const dynamic = "force-dynamic";

// Server gate: only allow-listed operators reach the raw DynamoDB viewer.
export default async function AdminDataPage() {
  if (!(await isCurrentUserAdmin())) redirect("/dashboard");
  const tables = PARSER_TABLES.map((t) => ({ id: t.id, label: t.label, name: t.name }));
  return <DataClient tables={tables} />;
}
