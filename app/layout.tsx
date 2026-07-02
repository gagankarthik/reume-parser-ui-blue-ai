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
    default: "ParsingLab | Healthcare Resume Parsing API by Blue-IQ",
    template: "%s · ParsingLab by Blue-IQ",
  },
  description:
    "Parse PDF, DOCX, and scanned resumes into schema-validated JSON: licences, credentials, specialties, confidence scores, and signed webhooks. Built on the Blue-IQ Sonar engine.",
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
      <body className="paper-grain min-h-full">{children}</body>
    </html>
  );
}
