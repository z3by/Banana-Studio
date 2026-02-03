import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { Header } from "@/components/Header";
import Link from "next/link";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://bananastudio.app"),
  title: {
    default: "Banana Prompt",
    template: "%s | Banana Prompt",
  },
  description: "Generate high-quality prompts for your AI portrait edits. Professional AI prompt engineering made simple.",
  keywords: ["AI", "Prompt Engineering", "Portraits", "Nano Banana Pro", "Image Generation", "AI Art", "Photography", "Studio"],
  authors: [{ name: "Ahmad Mostafa", url: "https://z3by.com" }],
  creator: "Ahmad Mostafa",
  publisher: "Banana Prompt",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Banana Prompt",
    description: "Generate high-quality prompts for your AI portrait edits. Create stunning AI art with professional prompts.",
    url: "https://bananastudio.app",
    siteName: "Banana Prompt",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "Banana Prompt Logo" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Banana Prompt",
    description: "Generate high-quality prompts for your AI portrait edits.",
    creator: "@z3by",
    images: ["/icon.png"],
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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Banana Prompt",
  "url": "https://bananastudio.app",
  "description": "Generate high-quality prompts for your AI portrait edits.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Any",
  "author": {
    "@type": "Person",
    "name": "Ahmad Mostafa",
    "url": "https://z3by.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${inter.className} antialiased min-h-screen flex flex-col relative bg-[#0c0c0e] text-zinc-100 selection:bg-amber-500/30`}
      >
        {/* JSON-LD structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5354627004153904"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-BCG0V6DB6L"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-BCG0V6DB6L');
          `}
        </Script>

        {/* Organic Background Elements */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          {/* Noise Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

          {/* Main Kinetic Glow - Amber */}
          <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] animate-[float_10s_ease-in-out_infinite]" />

          {/* Secondary Deep Glow - Purple/Blue Mix */}
          <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] animate-[float_12s_ease-in-out_infinite_reverse]" />

          {/* Bottom Ambient - Gold */}
          <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[600px] bg-amber-600/5 rounded-full blur-[140px] animate-[pulse_8s_ease-in-out_infinite]" />
        </div>

        <LanguageProvider>
          <Header />
          <main className="flex-1 w-full mx-auto px-4 md:px-6 py-8 md:py-16 relative z-10">
            {children}
          </main>
          <footer className="py-8 text-center text-zinc-600 text-xs relative z-10 border-t border-white/5 mt-12">
            <div className="flex items-center justify-center gap-2">
              <span>Made with 🍌 by</span>
              <Link href="https://z3by.com" target="_blank" className="font-medium text-zinc-500 hover:text-amber-400 transition-colors">
                Ahmad Mostafa
              </Link>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
