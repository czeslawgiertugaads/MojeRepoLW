import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://laweciarz.pro.pl"),
  title: "Profesjonalna Pomoc Drogowa, Laweta i Holowanie 24/7 - LAWECIARZ.PRO",
  description: `Pomoc Drogowa, Laweta i Holowanie ☎️ 572 272 930 | Najszybsza pomoc drogowa, laweta i holowanie 24/7 w Twojej okolicy. Profesjonalna obsługa, dojazd 15 minut! LAWECIARZ.PRO ⭐ 5.0`,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: "LAWECIARZ.PRO",
  }
};

import { Suspense } from "react";
import Tracker from "@/components/Tracker";
import CookieConsent from "@/components/CookieConsent";
import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${geistSans.variable} ${geistMono.variable}`} data-scroll-behavior="smooth">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-C6JHW715ZE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-C6JHW715ZE');
          `}
        </Script>
      </head>
      <body>
        <Suspense fallback={null}>
          <Tracker />
        </Suspense>
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
