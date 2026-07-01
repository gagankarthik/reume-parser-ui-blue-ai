// Public, client-safe config shared across the app (docs samples, key export).
// Single source of truth for the API base URL so it can't drift between pages.

// Override with NEXT_PUBLIC_API_BASE_URL if needed; defaults to the production
// custom domain (CloudFront → Lambda Function URL).
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.parsinglab.blue-iq.ai";

// Auth header clients send their key in, and the single-file parse endpoint.
export const AUTH_HEADER = "X-API-Key";
export const PARSE_ENDPOINT = "/api/v1/resume/parse";
