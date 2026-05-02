import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWAInstaller from "../components/PWAInstaller";
import BFCacheReload from "../components/BFCacheReload";
import FeedbackWidget from "../components/FeedbackWidget";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TestPath — Certificações para QA",
  description: "Plataforma de certificações para QA. Trilhas personalizadas, simulados com IA e progresso visual para CTFL, CTAL e mais. Grátis.",
  openGraph: {
    title: "TestPath — Certificações para QA",
    description: "Prepare-se para o CTFL e outras certificações ISTQB com trilhas personalizadas, simulados gerados por IA e lembretes inteligentes. Grátis.",
    url: "https://www.testpath.online",
    siteName: "TestPath",
    images: [
      {
        url: "https://www.testpath.online/og-image.png",
        width: 1200,
        height: 630,
        alt: "TestPath — Plataforma de certificações para QA",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TestPath — Certificações para QA",
    description: "Prepare-se para o CTFL com trilhas personalizadas e simulados com IA. Grátis.",
    images: ["https://www.testpath.online/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/favicon.ico", sizes: "any" },
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png" },
      { url: "/icons/web-app-manifest-192x192.png", sizes: "192x192" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TestPath",
  },
  other: {
    "google-adsense-account": "ca-pub-1108191012937979",
  },
};

import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0b0f1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* CSS crítico do nav — garante que o responsive funcione antes do globals.css */}
        <style dangerouslySetInnerHTML={{ __html: `
          .nav-link {
            color: #9ca3af;
            text-decoration: none;
            font-size: 14px;
            padding: 6px 12px;
            border-radius: 8px;
            transition: background 0.15s, color 0.15s;
          }
          .nav-link:hover {
            background: rgba(59,130,246,0.12);
            color: #3b82f6;
          }
          .nav-mobile { display: none; }
          .nav-desktop { display: flex; gap: 10px; align-items: center; }
          .nav-mobile-only { display: none; }
          @media (max-width: 640px) {
            .nav-links { display: none !important; }
            .nav-mobile { display: flex !important; gap: 8px; align-items: center; }
            .nav-desktop { display: none !important; }
            .nav-mobile-only { display: flex !important; gap: 8px; align-items: center; }
          }
        `}} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <BFCacheReload />
        <PWAInstaller />
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <FeedbackWidget />
      </body>
    </html>
  );
}