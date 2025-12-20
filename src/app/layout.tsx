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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <LanguageProvider>
          <Header />
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-8">
            {children}
          </main>
          <footer className="py-8 text-center text-zinc-500 text-sm">
            Made with 🍌 for Banana Studio
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
