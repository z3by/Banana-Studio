import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Banana Studio",
  description: "Generate high-quality prompts for your AI portrait edits.",
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
    description: "Generate high-quality prompts for your AI portrait edits.",
    images: [{ url: "/icon.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Banana Studio",
    description: "Generate high-quality prompts for your AI portrait edits.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col relative`}
      >
        {/* Ambient Background globs */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]" />
        </div>

        <LanguageProvider>
          <Header />
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
            {children}
          </main>
          <footer className="py-8 text-center text-zinc-600 text-sm relative z-10">
            Made with <span className="text-yellow-500">🍌</span> for <span className="text-zinc-400 font-medium">Banana Studio</span>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
