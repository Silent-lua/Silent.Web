import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Terminal } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Silent.Web | Enterprise Script Library",
  description: "Advanced Luau Script Ecosystem",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <nav className="sticky top-0 z-50 glass-panel border-b border-border border-x-0 border-t-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
              <Terminal className="w-5 h-5 text-cyan-500" />
              <span>Silent<span className="text-cyan-500">Hub</span></span>
            </Link>
            <div className="flex gap-6 text-sm font-medium text-zinc-400">
              <Link href="/scripts" className="hover:text-white transition-colors">Scripts</Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            </div>
          </div>
        </nav>
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}