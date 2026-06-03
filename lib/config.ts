// Public, client-safe config shared across the app (docs samples, key export).
// Single source of truth for the API base URL so it can't drift between pages.

// Override with NEXT_PUBLIC_API_BASE_URL when a custom domain fronts the API;
// defaults to the deployed Lambda Function URL.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://dqzxwwacosqcxipouyzxnrh7ky0sdnqw.lambda-url.us-east-2.on.aws";

// Auth header clients send their key in, and the single-file parse endpoint.
export const AUTH_HEADER = "X-API-Key";
export const PARSE_ENDPOINT = "/api/v1/resume/parse";
