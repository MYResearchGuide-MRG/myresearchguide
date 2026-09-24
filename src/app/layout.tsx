import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "katex/dist/katex.min.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const siteDescription =
  "MYResearchGuide is a student-led platform that helps young innovators turn curiosity into high-quality science research. From finding your first topic to publishing your findings, we provide free tools, guidance, and community for Malaysian youth.";

export const metadata: Metadata = {
  title: "MYResearchGuide — Malaysia's #1 Guide to Science Research",
  description: siteDescription,
  openGraph: {
    title: "MYResearchGuide — Malaysia's #1 Guide to Science Research",
    description: siteDescription,
    siteName: "MYResearchGuide",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MYResearchGuide — Malaysia's #1 Guide to Science Research",
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
      <body id="app" className={inter.className} suppressHydrationWarning>
        {children}
      </body>
      <GoogleAnalytics gaId="G-MQSLLXRJCJ" />
    </html>
  );
}
