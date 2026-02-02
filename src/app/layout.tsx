import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { Header } from "@/components/Header";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://bananastudio.app"),
  title: {
    default: "Banana Studio",
    template: "%s | Banana Studio",
  },
  description: "Generate high-quality prompts for your AI portrait edits. Professional AI prompt engineering made simple.",
  keywords: ["AI", "Prompt Engineering", "Portraits", "Nano Banana Pro", "Image Generation", "AI Art", "Photography", "Studio"],
  authors: [{ name: "Ahmad Mostafa", url: "https://z3by.com" }],
  creator: "Ahmad Mostafa",
  publisher: "Banana Studio",
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
    title: "Banana Studio",
    description: "Generate high-quality prompts for your AI portrait edits. Create stunning AI art with professional prompts.",
    url: "https://bananastudio.app",
    siteName: "Banana Studio",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "Banana Studio Logo" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Banana Studio",
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
  "name": "Banana Studio",
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
        
        {/* Subtle Background Gradient - Refined for minimalism */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          {/* Main Top Glow */}
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-gradient-to-b from-amber-500/10 to-transparent rounded-[100%] blur-[100px] opacity-60" />
           {/* Bottom subtle glow */}
           <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
        </div>

        <LanguageProvider>
          <Header />
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-16 relative z-10">
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
