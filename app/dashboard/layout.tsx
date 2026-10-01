import { LayoutDashboard, Code, Users, Settings } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full">
      <aside className="w-64 border-r border-border p-6 hidden md:block">
        <nav className="space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-surfaceHover text-cyan-400 rounded-lg text-sm font-medium">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Code className="w-4 h-4" /> Scripts
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Users className="w-4 h-4" /> Licenses
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}