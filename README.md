# Blue-IQ Parser — Product Platform

Customer-facing platform for the resume-parser API: landing page, **AWS Cognito**
sign-up / sign-in, onboarding, and **API-key generation** + usage stats. No résumé
parsing happens here (that's the UAT tool / the API itself).

## Architecture

- **Auth:** AWS Cognito (custom sign-up/login pages via `amazon-cognito-identity-js`).
  The Cognito **ID token** is verified server-side with `aws-jwt-verify` and stored in
  an httpOnly cookie.
- **BFF:** Next.js route handlers verify the Cognito session, resolve the user's
  company by email (creating it on first sign-in = onboarding), and call the backend
  **admin API** with a server-held admin token (`X-Admin-Token`). The browser never
  sees AWS credentials or the admin token.
- **Backend:** the resume-parser engine (`resume-parser-blue-iq-dev`) exposes
  `/api/v1/admin/*` for company + key + usage management.

```
Browser ──Cognito SDK──> Cognito (auth)
   │  id token
   ▼
Next BFF (/api/account/*, /api/auth/*) ──X-Admin-Token──> Backend /api/v1/admin/*
   (verifies Cognito JWT, resolves company by email)
```

## Setup

```bash
cp .env.local.example .env.local   # fill in Cognito IDs, API_BASE_URL, ADMIN_API_TOKEN
npm install
npm run dev                        # http://localhost:3000
```

### Environment

| Var | Purpose |
|---|---|
| `API_BASE_URL` | Backend API base URL |
| `ADMIN_API_TOKEN` | Must match `ADMIN_API_TOKEN` on the backend |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` / `NEXT_PUBLIC_COGNITO_CLIENT_ID` | Cognito (browser) |
| `COGNITO_USER_POOL_ID` / `COGNITO_CLIENT_ID` | Cognito (server token verification) |

**Cognito pool requirements:** email as the sign-in identifier, a public app client
(no secret — the SDK uses SRP), and the `email`/`name` attributes. Set
`ADMIN_API_TOKEN` on the backend so the admin API is enabled.

## Pages

- `/` — landing page
- `/signup` — Cognito sign-up + email-code verification
- `/login` — Cognito sign-in
- `/dashboard` — generate/revoke API keys, view usage & token stats
