import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Space Grotesk display, set light: matches the Blue-IQ platform brand.
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Inter for body/UI, consistent with the Blue-IQ platform.
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Technical mono for keys, code, and tabular data.
const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  // Resolves canonical/OG URLs; set NEXT_PUBLIC_SITE_URL to the public domain in prod.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Blue-IQ Capture | Universal Document AI",
    template: "%s · Blue-IQ Capture",
  },
  description:
    "Blue-IQ Capture turns any document - resumes, contracts, invoices, licenses - into structured, confidence-scored data. Domain-tuned, never fabricates, SOC 2 / HIPAA / GDPR aligned. Powered by the Sonar engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
