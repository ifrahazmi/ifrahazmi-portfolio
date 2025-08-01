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

export const metadata: Metadata = {
  title: "Ifrahuddin Azmi | Technology Leader",
  description: "Embedded & Automation Test Engineer skilled in Python, BLE/Wi-Fi protocol testing, and cloud-integrated systems.",
  keywords: ["Ifrahuddin Azmi", "Embedded Systems", "Automation Testing", "Python", "BLE", "WiFi", "Test Engineer"],
  authors: [{ name: "Ifrahuddin Azmi" }],
  openGraph: {
    title: "Ifrahuddin Azmi | Technology Leader",
    description: "Embedded & Automation Test Engineer skilled in Python, BLE/Wi-Fi protocol testing, and cloud-integrated systems.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ifrahuddin Azmi | Technology Leader",
    description: "Embedded & Automation Test Engineer skilled in Python, BLE/Wi-Fi protocol testing, and cloud-integrated systems.",
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
