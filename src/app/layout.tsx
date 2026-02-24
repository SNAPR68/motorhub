import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://autovinci.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Autovinci — AI-Powered Used Car Marketplace",
    template: "%s | Autovinci",
  },
  description:
    "Intelligence & Elegance. India's AI-powered luxury automotive marketplace for buying and selling pre-owned cars. Smart pricing, virtual tours, and dealer intelligence.",
  keywords: [
    "used cars India",
    "pre-owned cars",
    "buy used car",
    "sell car online",
    "AI car marketplace",
    "luxury used cars",
    "Autovinci",
    "car dealer platform",
    "used car Delhi",
    "second hand car",
  ],
  authors: [{ name: "Autovinci", url: SITE_URL }],
  creator: "Autovinci",
  publisher: "Autovinci",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Autovinci",
    title: "Autovinci — AI-Powered Used Car Marketplace",
    description:
      "India's AI-powered luxury automotive marketplace. Smart pricing, virtual tours, dealer intelligence.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Autovinci — AI-Powered Automotive Marketplace",
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "Autovinci — AI-Powered Used Car Marketplace",
    description:
      "India's AI-powered luxury automotive marketplace. Smart pricing, virtual tours, dealer intelligence.",
    images: ["/og-image.png"],
    creator: "@autovinci",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // App manifest
  manifest: "/manifest.json",

  // Icons
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // Verification (fill in when ready)
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0c10" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Noto+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-dark text-slate-100 min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
