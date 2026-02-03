import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { Header } from "@/components/Header";
import Link from "next/link";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
  themeColor: "#eab308",
};

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
        className={`${inter.className} antialiased min-h-screen flex flex-col relative bg-[#020204] text-zinc-100`}
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

        {/* Immersive Background v4 - Aurora Edition */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          {/* Deep Space Base */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0a0a12_0%,#020204_100%)]" />

          {/* Aurora Gradient Mesh */}
          <div className="absolute inset-0 gradient-mesh opacity-90" />

          {/* Noise Texture - Refined */}
          <div
            className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%225%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
              backgroundSize: '200px 200px'
            }}
          />

          {/* Primary Orb - Warm Amber (Top Left) */}
          <div
            className="absolute top-[-20%] left-[10%] w-[800px] h-[800px] rounded-full blur-[180px] animate-[float_14s_ease-in-out_infinite]"
            style={{
              background: 'radial-gradient(circle, rgba(255, 184, 0, 0.15) 0%, rgba(245, 158, 11, 0.08) 35%, rgba(217, 119, 6, 0.03) 55%, transparent 70%)'
            }}
          />

          {/* Secondary Orb - Deep Indigo (Top Right) */}
          <div
            className="absolute top-[0%] right-[-15%] w-[700px] h-[700px] rounded-full blur-[160px] animate-[float_18s_ease-in-out_infinite_reverse]"
            style={{
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(79, 70, 229, 0.08) 45%, transparent 70%)'
            }}
          />

          {/* Tertiary Orb - Electric Cyan (Center Right) */}
          <div
            className="absolute top-[35%] right-[5%] w-[500px] h-[500px] rounded-full blur-[140px] animate-[breathe_10s_ease-in-out_infinite]"
            style={{
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(8, 145, 178, 0.05) 50%, transparent 70%)'
            }}
          />

          {/* Fourth Orb - Rose Accent (Center Left) */}
          <div
            className="absolute top-[50%] left-[-5%] w-[450px] h-[450px] rounded-full blur-[130px] animate-[float_12s_ease-in-out_infinite]"
            style={{
              background: 'radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, rgba(225, 29, 72, 0.03) 50%, transparent 70%)'
            }}
          />

          {/* Bottom Ambient Orb - Rich Gold */}
          <div
            className="absolute bottom-[-20%] left-[20%] w-[900px] h-[700px] rounded-full blur-[200px] animate-[pulse_12s_ease-in-out_infinite]"
            style={{
              background: 'radial-gradient(ellipse, rgba(217, 119, 6, 0.1) 0%, rgba(180, 83, 9, 0.04) 45%, transparent 70%)'
            }}
          />

          {/* Bottom Right Purple */}
          <div
            className="absolute bottom-[5%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[160px] animate-[float_20s_ease-in-out_infinite_reverse]"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.04) 50%, transparent 70%)'
            }}
          />

          {/* Soft Grid Overlay */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px'
            }}
          />

          {/* Vignette - Enhanced */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.5)_100%)]" />

          {/* Top Edge Light */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <LanguageProvider>
          <Header />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 relative z-10">
            {children}
          </main>

          {/* Premium Footer */}
          <footer className="relative z-10 mt-20">
            {/* Glowing Divider */}
            <div className="divider-glow" />

            <div className="py-12 text-center relative overflow-hidden">
              {/* Subtle Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/[0.02] to-transparent pointer-events-none" />

              <div className="relative flex flex-col items-center justify-center gap-4">
                {/* Brand Mark */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center text-black font-black text-sm shadow-lg shadow-amber-500/20">
                    B
                  </div>
                  <span className="text-sm font-bold text-gradient-gold">Banana Prompt</span>
                </div>

                {/* Made By */}
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <span>Made with</span>
                  <span className="text-lg animate-[float_3s_ease-in-out_infinite]">🍌</span>
                  <span>by</span>
                  <Link
                    href="https://z3by.com"
                    target="_blank"
                    className="font-semibold text-zinc-400 hover:text-amber-400 transition-all duration-300 hover:text-glow"
                  >
                    Ahmad Mostafa
                  </Link>
                </div>

                {/* Tagline */}
                <p className="text-[10px] text-zinc-700 tracking-[0.3em] uppercase">
                  Professional AI Prompt Engineering
                </p>
              </div>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
