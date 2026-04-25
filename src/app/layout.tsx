import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Fustat, Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'

import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fustat = Fustat({
  subsets: ["latin"], // Use ['latin', 'arabic'] if you need Arabic support
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"], // Use ['latin', 'arabic'] if you need Arabic support
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MYResearchGuide",
  description:
    "MYResearchGuide is a student-led platform designed to help young innovators turn their questions into high-quality research. From finding your first topic to publishing your findings, we’re here to provide the tools and community you need to lead the way.",
  icons: {
    icon: "./favicon.ico", // Path to your logo in the public folder
    shortcut: "./favicon.ico",
    apple: "./favicon.ico", // Optional: for iOS home screen
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
