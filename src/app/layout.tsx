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
  metadataBase: new URL("https://laweciarz.pro"),
  title: "LAWECIARZ.PRO - Pomoc Drogowa, Laweta i Holowanie 24H",
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
  },
  icons: {
    icon: [
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/images/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/images/site.webmanifest',
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "LAWECIARZ.PRO",
  "url": "https://laweciarz.pro",
  "logo": "https://laweciarz.pro/images/logo-sm.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+48572272930",
    "contactType": "emergency",
    "areaServed": "PL",
    "availableLanguage": "Polish"
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <Suspense fallback={null}>
          <Tracker />
        </Suspense>
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
