// Server-side proxy to the resume-parser API.
//
// The browser calls this same-origin route, so there are no CORS concerns when
// hitting the Lambda Function URL. The target base URL and API key are passed
// from the client via the x-target-base-url and x-api-key headers.
//
// Multipart uploads are re-assembled via formData() so fetch sets a correct
// boundary; everything else is forwarded as a raw text body.

import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

async function forward(req: NextRequest, path: string[]): Promise<Response> {
  const baseUrl = req.headers.get("x-target-base-url");
  const apiKey = req.headers.get("x-api-key") ?? "";

  if (!baseUrl) {
    return Response.json(
      { error: { detail: "Missing x-target-base-url header" } },
      { status: 400 },
    );
  }

  const base = baseUrl.replace(/\/+$/, "");
  const target = `${base}/${path.join("/")}${req.nextUrl.search}`;

  const headers: Record<string, string> = {};
  if (apiKey) headers["X-API-Key"] = apiKey;

  const method = req.method.toUpperCase();
  let body: BodyInit | undefined;

  if (method !== "GET" && method !== "HEAD") {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      // Re-assemble multipart so fetch generates a fresh, valid boundary.
      body = await req.formData();
    } else {
      const text = await req.text();
      if (text) {
        body = text;
        headers["Content-Type"] = contentType || "application/json";
      }
    }
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, { method, headers, body });
  } catch (err) {
    return Response.json(
      {
        error: {
          detail: `Could not reach API at ${target}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        },
      },
      { status: 502 },
    );
  }

  // Stream the upstream response back, preserving status and content type.
  const respHeaders = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) respHeaders.set("content-type", upstreamType);

  const buf = await upstream.arrayBuffer();
  return new Response(buf, { status: upstream.status, headers: respHeaders });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}
