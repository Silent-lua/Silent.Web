import { Search } from 'lucide-react';
import ScriptCard from '@/components/scripts/ScriptCard';

const mockScripts = [
  { id: '1', name: 'Silent Aim V2', game: 'Rivals', status: 'ACTIVE', version: '2.1.0', author: 'SilentTeam', rawLink: 'https://raw.githubusercontent.com/Silent-Aim/scripts/main/rivals.lua' },
  { id: '2', name: 'ESP & Hitbox', game: 'Murder Mystery 2', status: 'MAINTENANCE', version: '1.0.4', author: 'SilentTeam', rawLink: 'https://raw.githubusercontent.com/Silent-Aim/scripts/main/mm2.lua' },
  { id: '3', name: 'Sheriff Auto-Track', game: 'Duelos', status: 'ACTIVE', version: '1.2.0', author: 'SilentTeam', rawLink: 'https://raw.githubusercontent.com/Silent-Aim/scripts/main/duelos.lua' }
];

export default function ScriptsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-4">Script Catalog</h1>
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Buscar por juego, nombre o compatibilidad..."
            className="block w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockScripts.map((script) => (
          <ScriptCard key={script.id} script={script} />
        ))}
      </div>
    </div>
  );
}
