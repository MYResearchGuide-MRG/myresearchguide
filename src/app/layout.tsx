import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "katex/dist/katex.min.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-site-sans",
});

const siteDescription =
  "MYResearchGuide is a free, beginner-friendly platform that helps Malaysian students start and grow in STEM research with practical steps, researcher insight, and a community built by Malaysians for Malaysians.";

export const metadata: Metadata = {
  title: "MYResearchGuide | Malaysia's #1 Guide to STEM Research",
  description: siteDescription,
  openGraph: {
    title: "MYResearchGuide | Malaysia's #1 Guide to STEM Research",
    description: siteDescription,
    siteName: "MYResearchGuide",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MYResearchGuide | Malaysia's #1 Guide to STEM Research",
    description: siteDescription,
  },
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./favicon.ico" />
      </head>
      <body id="app" className={`${inter.className} ${inter.variable}`} suppressHydrationWarning>
        {children}
      </body>
      <GoogleAnalytics gaId="G-MQSLLXRJCJ" />
    </html>
  );
}
