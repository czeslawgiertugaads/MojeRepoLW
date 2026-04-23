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
  title: "LAWECIARZ.PRO - Profesjonalna Pomoc Drogowa, Laweta i Holowanie 24/7",
  description: `Pomoc Drogowa i Holowanie ⭐⭐⭐⭐⭐ 📞 572 272 930. laweciarz.pro to najszybsza pomoc drogowa, laweta i holowanie 24/7 w Twojej okolicy. Profesjonalna obsługa, dojazd 15 minut!`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${geistSans.variable} ${geistMono.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
