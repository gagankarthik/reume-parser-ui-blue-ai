import Link from "next/link";

const CARDS = [
  {
    href: "/parse",
    title: "Parse a resume",
    body: "Upload a PDF, DOCX, or image and see the structured JSON with confidence scores. Handles sync and async (OCR) jobs.",
  },
  {
    href: "/webhooks",
    title: "Webhooks",
    body: "Register, list, and delete webhooks. The HMAC secret is shown once on creation.",
  },
  {
    href: "/health",
    title: "Health",
    body: "Check the API health endpoint and dependency status (DynamoDB, S3).",
  },
  {
    href: "/settings",
    title: "Settings",
    body: "Configure the API base URL and your X-API-Key. Stored locally in your browser.",
  },
];

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Resume Parser — Test Console</h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          A lightweight client for exercising the resume-parser API. Set your API key in{" "}
          <Link href="/settings" className="font-medium text-indigo-600 hover:underline">
            Settings
          </Link>{" "}
          first, then head to Parse.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/20"
          >
            <h2 className="text-base font-semibold text-zinc-900 group-hover:text-indigo-700 dark:text-zinc-50 dark:group-hover:text-indigo-300">
              {c.title}
            </h2>
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">{c.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
