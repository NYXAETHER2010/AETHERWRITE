import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AetherWrite - AI Fiction Novel Writing SaaS",
  description: "AI-powered fiction novel writing platform with multi-tool dashboard",
  keywords: ["AetherWrite", "AI", "Novel Writing", "Fiction", "SaaS"],
  authors: [{ name: "AetherWrite Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "AetherWrite - AI Fiction Novel Writing SaaS",
    description: "AI-powered fiction novel writing platform with multi-tool dashboard",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AetherWrite - AI Fiction Novel Writing SaaS",
    description: "AI-powered fiction novel writing platform with multi-tool dashboard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
