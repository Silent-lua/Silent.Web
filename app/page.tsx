import Link from "next/link";
import { Terminal, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
      <div className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-400 mb-8">
        <span className="flex h-2 w-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></span>
        Silent.Web v2.0 is Live
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
        The Next Generation of <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Luau Execution
        </span>
      </h1>
      <p className="text-lg text-zinc-400 mb-10 max-w-2xl">
        Descubre, gestiona y ejecuta scripts sin fricción. Arquitectura directa, copiado instantáneo y control total sobre tu experiencia en Roblox.
      </p>
      <div className="flex gap-4">
        <Link href="/scripts" className="px-6 py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-colors">
          Explore Scripts
        </Link>
        <Link href="/dashboard" className="px-6 py-3 rounded-lg bg-surface border border-border text-white hover:bg-surfaceHover transition-colors">
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
}