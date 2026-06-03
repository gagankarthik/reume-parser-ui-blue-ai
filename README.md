# Blue-IQ Parser — Product Platform

Customer-facing platform for the résumé-parser API: landing page, **AWS Cognito**
sign-up / sign-in, onboarding, and **API-key generation** + usage stats. No résumé
parsing happens here (that's the API itself).

## Architecture

- **Auth:** AWS Cognito (custom sign-up/login pages via `amazon-cognito-identity-js`).
  The Cognito **ID token** is verified server-side with `aws-jwt-verify` and stored in
  an httpOnly cookie.
- **Data:** Next.js server (BFF) verifies the Cognito session, then reads/writes the
  backend's **DynamoDB tables directly** (`companies`, `api_keys`, `audit_logs`) using
  AWS credentials — onboarding the user's company by email on first sign-in, generating
  keys, and aggregating usage. Keys use the same scheme the API validates against
  (`rp_live_` + SHA-256), so they work immediately with the parsing API.
- **No admin token / no Lambda dependency** for key management — the product server owns
  its data access. The browser never sees AWS credentials.

```
Browser ──Cognito SDK──> Cognito (auth)
   │  id token (httpOnly cookie)
   ▼
Next BFF (/api/account/*) ──AWS SDK──> DynamoDB (companies · api_keys · audit_logs)
   (verifies Cognito JWT, resolves/creates company by email)
```

## Setup

```bash
cp .env.local.example .env.local   # fill in AWS creds + Cognito IDs
npm install
npm run dev                        # http://localhost:3000
```

### Environment

| Var | Purpose |
|---|---|
| `AWS_REGION` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | DynamoDB access |
| `DYNAMODB_TABLE_*` | Table names (defaults to `resume-parser-*`) |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` / `NEXT_PUBLIC_COGNITO_CLIENT_ID` | Cognito (browser) |
| `COGNITO_USER_POOL_ID` / `COGNITO_CLIENT_ID` | Cognito (server token verification) |

**Cognito pool requirements:** email as the sign-in identifier, a public app client
(no secret — the SDK uses SRP), and the `email`/`name` attributes.

**AWS credentials** need DynamoDB access (Get/Put/Update/Query) to the `companies`,
`api_keys`, and `audit_logs` tables and their GSIs.

## Pages

- `/` — landing page
- `/docs` — API usage docs
- `/signup` — Cognito sign-up + email-code verification
- `/login` — Cognito sign-in
- `/dashboard` — generate/revoke API keys, view usage & token stats
