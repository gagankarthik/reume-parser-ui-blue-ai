import type { NextConfig } from "next";

// Security headers for every route. A strict CSP is intentionally omitted for
// now (Next inlines styles/scripts that would need nonces); these are the
// uncontroversial baseline.
const securityHeaders = [
  // The app is never embedded — block clickjacking.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Served over HTTPS (Amplify); pin browsers to it.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
