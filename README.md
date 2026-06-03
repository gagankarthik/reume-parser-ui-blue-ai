# Blue-IQ Parser — Product Platform

Customer-facing platform for the résumé-parser API: landing page, **AWS Cognito**
sign-up / sign-in, onboarding, and **API-key generation** + usage stats. No résumé
parsing happens here (that's the API itself).

## Architecture

- **Auth:** AWS Cognito (custom sign-up/login pages via `amazon-cognito-identity-js`).
  The Cognito **ID token** is verified server-side with `aws-jwt-verify` and stored in
  an httpOnly cookie.
- **Data:** Next.js server (BFF) verifies the Cognito session, then calls the backend's
  **server-to-server admin API** (`/api/v1/admin/*`) using a shared admin token —
  onboarding the user's company by email on first sign-in, generating/revoking keys,
  managing webhooks, and aggregating usage. The **backend owns the key scheme**
  (`rp_live_` + SHA-256) and is the single source of truth; this app never touches
  DynamoDB directly.
- The admin token and AWS credentials stay server-side — the browser never sees them.

```
Browser ──Cognito SDK──> Cognito (auth)
   │  id token (httpOnly cookie)
   ▼
Next BFF (/api/account/*) ──X-Admin-Token──> Backend /api/v1/admin/* ──> DynamoDB
   (verifies Cognito JWT, resolves/creates company by email)
```

## Setup

```bash
cp .env.example .env.local         # fill in backend URL + admin token + Cognito IDs
npm install
npm run dev                        # http://localhost:3000
```

### Environment

| Var | Purpose |
|---|---|
| `BACKEND_API_URL` | Base URL of the Resume Parser backend (e.g. `https://api.your-domain.com`) |
| `ADMIN_API_TOKEN` | Shared secret sent as `X-Admin-Token`; must match the backend's `ADMIN_API_TOKEN` |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` / `NEXT_PUBLIC_COGNITO_CLIENT_ID` | Cognito IDs (public; used by both browser SDK and server token verification) |
| `NEXT_PUBLIC_API_BASE_URL` | Public API base URL shown in `/docs` samples (optional; defaults to the deployed Lambda URL) |

**Cognito pool requirements:** email as the sign-in identifier, a public app client
(no secret — the SDK uses SRP), and the `email`/`name` attributes.

**Backend admin API** must be reachable from this server and have `ADMIN_API_TOKEN`
set to the same value — it gates company onboarding, key/webhook management, and usage
stats under `/api/v1/admin/*`.

## Deploy to AWS Amplify (GitHub)

This is a **Next.js SSR app** (server components, `app/api/*` routes, cookie sessions),
so Amplify hosts it on managed compute — not as a static export.

1. **Connect the repo:** Amplify Console → *New app* → *Host web app* → GitHub →
   pick this repo + branch. Amplify auto-detects Next.js (SSR / `WEB_COMPUTE`) and
   uses the committed `amplify.yml` build spec.
2. **Set environment variables** (App settings → Environment variables) — see the
   table above. At minimum: `BACKEND_API_URL`, `ADMIN_API_TOKEN`,
   `NEXT_PUBLIC_COGNITO_USER_POOL_ID`, `NEXT_PUBLIC_COGNITO_CLIENT_ID`.
   The `NEXT_PUBLIC_*` ones are inlined at build time (`amplify.yml` writes them
   into `.env.production`); `BACKEND_API_URL` / `ADMIN_API_TOKEN` stay server-side.
3. **Deploy.** Each push to the connected branch triggers a build + deploy.
4. **After first deploy:** add the Amplify app URL to the Cognito app client's
   allowed callback/sign-out URLs, and allow it as an origin on the backend admin API.

> Node 20+ is required (Next.js 16); `amplify.yml` pins it via `nvm`.

## Pages

- `/` — landing page
- `/docs` — API usage docs
- `/signup` — Cognito sign-up + email-code verification
- `/login` — Cognito sign-in
- `/dashboard` — generate/revoke API keys, view usage & token stats
