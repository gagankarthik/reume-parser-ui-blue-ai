import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Distinctive editorial grotesque for display — authoritative, enterprise, not generic.
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// Clean geometric humanist sans for body/UI.
const sans = Plus_Jakarta_Sans({
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
    default: "Blue-IQ Parser — healthcare resume parsing API",
    template: "%s · Blue-IQ Parser",
  },
  description:
    "Parse PDF, DOCX, and scanned resumes into schema-validated JSON — licences, credentials, specialties, confidence scores, and signed webhooks.",
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
