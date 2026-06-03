// Read-only connectivity smoke test for the product app's DynamoDB data layer.
// Confirms creds + table/index names work (no data written).
import fs from "node:fs";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const env = {};
for (const l of fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const doc = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: env.AWS_REGION,
    credentials: { accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY },
  }),
);

async function q(label, params) {
  const out = await doc.send(new QueryCommand(params));
  console.log(`✓ ${label} — ${out.Items?.length ?? 0} items`);
}

try {
  await q("companies email-index", {
    TableName: "resume-parser-companies",
    IndexName: "email-index",
    KeyConditionExpression: "email = :e",
    ExpressionAttributeValues: { ":e": "smoke@example.com" },
  });
  await q("api_keys company-index", {
    TableName: "resume-parser-api-keys",
    IndexName: "company-index",
    KeyConditionExpression: "company_id = :c",
    ExpressionAttributeValues: { ":c": "smoke-test" },
  });
  await q("audit_logs company-timestamp-index", {
    TableName: "resume-parser-audit-logs",
    IndexName: "company-timestamp-index",
    KeyConditionExpression: "company_id = :c",
    ExpressionAttributeValues: { ":c": "smoke-test" },
  });
  console.log("\nDynamoDB connection OK — creds, tables, and GSIs all reachable.");
} catch (e) {
  console.error(`✗ ${e.name}: ${e.message}`);
  process.exitCode = 1;
}
