export default function DashboardOverview() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">System Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Scripts', value: '3' },
          { label: 'Active Licenses', value: 'Unavailable' },
          { label: 'Total Requests', value: 'Unavailable' },
          { label: 'System Status', value: 'Online', color: 'text-emerald-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-surface border border-border p-5 rounded-xl">
            <p className="text-sm text-zinc-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color || 'text-white'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-4">Conexión API</h2>
        <p className="text-sm text-zinc-400 mb-4">
          Configura tu variable de entorno <code className="bg-zinc-900 px-1 py-0.5 rounded text-cyan-400 border border-border">NEXT_PUBLIC_API_URL</code> en Vercel para conectar el backend de Render o tu repositorio privado de GitHub.
        </p>
      </div>
    </div>
  );
}
