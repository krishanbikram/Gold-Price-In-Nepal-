import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: {
    default: "Gold Price in Nepal Today 2025 | Suna Ko Bhaau | goldpricenp.com",
    template: "%s | GoldPriceNP",
  },
  description:
    "Check today's Gold Price in Nepal (Suna Ko Bhaau). Live 24 Carat & Hallmark Gold rates per Tola, updated daily by FENEGOSIDA. View price history, silver rates & gold calculator.",
  keywords: [
    "gold price in Nepal",
    "gold price today Nepal",
    "suna ko bhaau",
    "सुनको भाउ",
    "hallmark gold price Nepal",
    "24 carat gold price Nepal",
    "Nepal gold rate today",
    "FENEGOSIDA gold price",
    "silver price Nepal",
    "chandi ko bhaau",
    "gold price per tola Nepal",
    "goldpricenp",
  ],
  authors: [{ name: "GoldPriceNP" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.goldpricenp.com",
    siteName: "GoldPriceNP",
    title: "Gold Price in Nepal Today | Suna Ko Bhaau | GoldPriceNP",
    description:
      "Nepal's most accurate gold price tracker. Check daily 24 Carat & Hallmark Gold rates per Tola, silver prices, historical charts, and gold calculator at goldpricenp.com.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gold Price in Nepal Today - GoldPriceNP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gold Price in Nepal Today | Suna Ko Bhaau | GoldPriceNP",
    description:
      "Check today's gold and silver prices in Nepal. Updated daily by FENEGOSIDA. goldpricenp.com",
  },
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
  verification: {
    google: "e687b3e5bc27cc94",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Gold Price Nepal",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.goldpricenp.com",
  description: "Nepal's most accurate gold and silver price tracker",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.goldpricenp.com"}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-navy-950 text-slate-50 antialiased">
        <QueryProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
