import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const tagline = "Automation Test Engineer | Embedded, Industrial (OT) & AI Automation";
const description =
  "Automation Test Engineer with 5+ years building Python and Robot Framework automation for embedded instruments, industrial (OT) networks and wireless medical devices — SCPI precision instruments, BLE/Wi-Fi protocol validation, AI test-case generation and OT security testing.";

export const metadata: Metadata = {
  title: `Ifrahuddin Azmi | ${tagline}`,
  description,
  keywords: [
    "Ifrahuddin Azmi",
    "Automation Test Engineer",
    "Robot Framework",
    "Python",
    "SCPI",
    "BLE",
    "Wi-Fi",
    "OT security",
    "Embedded testing",
    "Azure AI Foundry",
    "Wireshark",
    "Scapy",
  ],
  authors: [{ name: "Ifrahuddin Azmi" }],
  openGraph: {
    title: `Ifrahuddin Azmi | ${tagline}`,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Ifrahuddin Azmi | ${tagline}`,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased bg-slate-900 text-slate-100 font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
