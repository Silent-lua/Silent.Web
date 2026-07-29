/**
 * ==========================================================================
 * SilentHub Enterprise - SPA & UI Logic
 * ==========================================================================
 */

// ==========================================================================
// SilentHub Enterprise - Base de Datos de Scripts Integrada
// ==========================================================================

const scriptDatabase = [
    {
        id: "99-nights-in-the-forest",
        title: "99 Nights In The Forest",
        scripts: [
            { title: "Bonk Hub", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/99-Nights-In-The-Forest/Kaitan-Hub.lua"))()' },
            { title: "Voidware Hub", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/99-Nights-In-The-Forest/Voidware-Hub.lua"))()' }
        ]
    },
    {
        id: "arsenal",
        title: "Arsenal",
        scripts: [
            { title: "Quotas Hub", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/Arsenal/Quotas-Hub.lua"))()' },
            { title: "Neusence Full", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/Arsenal/Neusence-Full.lua"))()' },
            { title: "Ignite", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/Arsenal/Ignite.lua"))()' }
        ]
    },
    {
        id: "bee-swarm-simulator",
        title: "Bee Swarm Simulator",
        scripts: [
            { title: "Neon Hub", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/Bee-Swarm-Simulator/Neon-Hub.lua"))()' }
        ]
    },
    {
        id: "blox-fruits",
        title: "Blox Fruits",
        scripts: [
            { title: "Astra Hub", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/Blox-Fruits/Astra-Hub.lua"))()' },
            { title: "Ky Hub", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/Blox-Fruits/Ky-Hub.lua"))()' },
            { title: "Vylera Hub", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/Blox-Fruits/Vylera-Hub.lua"))()' },
            { title: "ZX9 Hub", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/Blox-Fruits/ZX9-Hub.lua"))()' },
            { title: "Astral Hub", code: 'loadstring(game:HttpGet("https://cdn.robloxscripts.gg/public/furky/furky-astral-source.lua"))()' },
            { title: "Hoho Hub", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/acsu123/HOHO_H/main/Loading_UI"))()' }
        ]
    },
    {
        id: "blue-lock-rivals",
        title: "Blue Lock Rivals",
        scripts: [
            { title: "The Bill Dev Hub", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/Blue-Lock-Rivals/The-Bill-Dev-Hub.lua"))()' }
        ]
    },
    {
        id: "brookhaven",
        title: "Brookhaven",
        scripts: [
            { title: "Chaos Hub", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/Brookhaven/Chaos-Hub.lua"))()' }
        ]
    },
    {
        id: "dead-rails",
        title: "Dead Rails",
        scripts: [
            { title: "Ringta Hub", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/Dead-Rails/Ringta-Hub.lua"))()' }
        ]
    },
    {
        id: "fisch",
        title: "Fisch",
        scripts: [
            { title: "Alchemy Hub", code: 'loadstring(game:HttpGet("https://scripts.alchemyhub.xyz"))()' }
        ]
    },
    {
        id: "funky-friday",
        title: "Funky Friday",
        scripts: [
            { title: "Luna Hub", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/Funky-Friday/Luna-Hub.lua"))()' }
        ]
    },
    {
        id: "ink-game",
        title: "Ink Game",
        scripts: [
            { title: "Dollar Hub", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/Ink-Game/Dollar-Hub.lua"))()' }
        ]
    },
    {
        id: "prison-life",
        title: "Prison Life",
        scripts: [
            { title: "Ultra Sigma Hax v2", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/Prison-Life/Ultra-Sigma-Hax-v2.lua"))()' }
        ]
    },
    {
        id: "rivals",
        title: "Rivals",
        scripts: [
            { title: "Soluna Hub", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Games/Rivals/Soluna-Hub.lua"))()' }
        ]
    },
    {
        id: "utilitarios",
        title: "Utilitarios",
        scripts: [
            { title: "Universal Shiftlock", code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Synergy-Team-Official/Script-Repository/main/Obfuscated-Scripts/Utilities/Shiftlock.lua"))()' }
        ]
    }
];

let currentTotalScripts = 0;

function initSystem() {
    renderSidebar();
    initSpotlightEffect();
    calculateStats();
    setupEventListeners();
}

function navigateTo(viewId, gameData = null) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    if(viewId === 'home' || viewId === 'dashboard') {
        const el = document.querySelector(`button[onclick="navigateTo('${viewId}')"]`);
        if(el) el.classList.add('active');
    } else if (viewId === 'catalog' && gameData) {
        const el = document.getElementById(`nav-${gameData.id}`);
        if(el) el.classList.add('active');
    }

    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.add('hidden');
    });
    
    const targetView = document.getElementById(`view-${viewId}`);
    if(targetView) targetView.classList.remove('hidden');

    const breadcrumb = document.getElementById('breadcrumb-path');
    if (viewId === 'catalog' && gameData) {
        document.getElementById('catalog-title').innerText = gameData.title;
        breadcrumb.innerText = `~ / repos / ${gameData.id}`;
        renderScriptsGrid(gameData.scripts, 'scripts-grid');
    } else {
        breadcrumb.innerText = `~ / root / ${viewId}`;
    }

    closeMobileMenu();
    setTimeout(initSpotlightEffect, 50);
    
    if (viewId === 'dashboard') {
        initTerminalSim();
    }
}

function renderSidebar() {
    const container = document.getElementById('dynamic-sidebar-categories');
    if(!container) return;
    container.innerHTML = '';
    currentTotalScripts = 0;

    scriptDatabase.forEach(game => {
        const btn = document.createElement('button');
        btn.id = `nav-${game.id}`;
        btn.className = 'nav-item w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-textMuted hover:text-white hover:bg-white/5 transition-all text-left';
        btn.onclick = () => navigateTo('catalog', game);
        
        btn.innerHTML = `
            <div class="flex items-center gap-3 truncate">
                <svg class="w-3.5 h-3.5 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
                <span class="truncate">${game.title}</span>
            </div>
            <span class="text-[10px] font-mono bg-surface border border-border px-1.5 py-0.5 rounded opacity-50">${game.scripts.length}</span>
        `;
        container.appendChild(btn);
        currentTotalScripts += game.scripts.length;
    });
}

function renderScriptsGrid(scriptsArray, containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '';

    if (scriptsArray.length === 0) {
        container.innerHTML = `<div class="col-span-full py-10 text-center text-textMuted">No se encontraron scripts.</div>`;
        return;
    }

    scriptsArray.forEach((script) => {
        const safeCode = script.code.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
        const escapedForCopy = script.code.replace(/\\/g, '\\\\').replace(/"/g, '&quot;');
        
        const card = document.createElement('div');
        card.className = 'spotlight-card flex flex-col h-full';
        card.innerHTML = `
            <div class="flex items-center justify-between p-4 border-b border-border/50 bg-white/[0.02]">
                <h3 class="font-semibold text-white text-sm truncate pr-2">${script.title}</h3>
                <button onclick="copyToClipboard(this, \`${escapedForCopy}\`)" class="shrink-0 p-1.5 rounded-md hover:bg-white hover:text-black text-textMuted border border-transparent hover:border-white transition-all">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
            </div>
            <div class="p-4 bg-black/40 flex-1 relative group overflow-hidden">
                <pre class="code-block text-textMuted group-hover:text-gray-300 transition-colors overflow-x-auto thin-scrollbar pb-2"><code>${safeCode}</code></pre>
            </div>
        `;
        container.appendChild(card);
    });
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    if (query.length > 0) {
        let results = [];
        scriptDatabase.forEach(game => {
            game.scripts.forEach(script => {
                if(script.title.toLowerCase().includes(query) || game.title.toLowerCase().includes(query)){
                    results.push({...script, parent: game.title});
                }
            });
        });
        
        const queryDisplay = document.getElementById('search-query-display');
        if(queryDisplay) queryDisplay.innerText = query;
        
        navigateTo('search');
        document.getElementById('breadcrumb-path').innerText = `~ / root / search?q=${query}`;
        
        const container = document.getElementById('search-results-grid');
        if(!container) return;
        container.innerHTML = '';
        
        results.forEach(script => {
            const escapedForCopy = script.code.replace(/\\/g, '\\\\').replace(/"/g, '&quot;');
            const card = document.createElement('div');
            card.className = 'spotlight-card flex flex-col h-full';
            card.innerHTML = `
                <div class="flex items-center justify-between p-4 border-b border-border/50 bg-white/[0.02]">
                    <div class="overflow-hidden pr-2">
                        <div class="text-[10px] text-primary font-mono uppercase truncate">${script.parent}</div>
                        <h3 class="font-semibold text-white text-sm truncate">${script.title}</h3>
                    </div>
                    <button onclick="copyToClipboard(this, \`${escapedForCopy}\`)" class="shrink-0 p-1.5 rounded-md hover:bg-white hover:text-black text-textMuted border border-transparent hover:border-white transition-all">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                </div>
                <div class="p-4 bg-black/40 flex-1 relative overflow-hidden">
                    <pre class="code-block text-textMuted overflow-x-auto thin-scrollbar pb-2"><code>${script.code.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}</code></pre>
                </div>
            `;
            container.appendChild(card);
        });
        initSpotlightEffect();
    } else {
        navigateTo('home');
    }
}

function copyToClipboard(btnElement, text) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHtml = btnElement.innerHTML;
        
        btnElement.innerHTML = `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>`;
        btnElement.classList.add('bg-green-500', 'text-black', 'border-green-500');
        btnElement.classList.remove('hover:bg-white', 'text-textMuted');

        const toast = document.getElementById('toast');
        if(toast) toast.classList.remove('translate-y-20', 'opacity-0');
        
        setTimeout(() => {
            btnElement.innerHTML = originalHtml;
            btnElement.classList.remove('bg-green-500', 'text-black', 'border-green-500');
            btnElement.classList.add('hover:bg-white', 'text-textMuted');
            
            if(toast) toast.classList.add('translate-y-20', 'opacity-0');
        }, 2000);
    });
}

function initSpotlightEffect() {
    document.querySelectorAll('.spotlight-card').forEach(card => {
        const clone = card.cloneNode(true);
        card.parentNode.replaceChild(clone, card);
        
        clone.addEventListener('mousemove', e => {
            const rect = clone.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            clone.style.setProperty('--mouse-x', `${x}px`);
            clone.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

function calculateStats() {
    const el = document.getElementById('stat-scripts');
    if(el) el.innerText = currentTotalScripts;
}

function simulateNetworkCheck(btn) {
    const originalContent = btn.innerHTML;
    btn.innerHTML = `<div class="loader"></div> <span>Analizando nodos...</span>`;
    btn.classList.add('pointer-events-none', 'opacity-80');
    
    setTimeout(() => {
        btn.innerHTML = `<svg class="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg> <span class="text-green-500">Conexión Establecida</span>`;
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.classList.remove('pointer-events-none', 'opacity-80');
        }, 3000);
    }, 1500);
}

function openMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    if(sidebar) sidebar.classList.remove('max-lg:-translate-x-full');
    if(overlay) overlay.classList.remove('hidden');
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    if(sidebar) sidebar.classList.add('max-lg:-translate-x-full');
    if(overlay) overlay.classList.add('hidden');
}

function setupEventListeners() {
    const searchInput = document.getElementById('global-search');
    if(searchInput) searchInput.addEventListener('input', handleSearch);

    const openBtn = document.getElementById('open-mobile-menu');
    const closeBtn = document.getElementById('close-mobile-menu');
    const overlay = document.getElementById('mobile-overlay');

    if(openBtn) openBtn.addEventListener('click', openMobileMenu);
    if(closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
    if(overlay) overlay.addEventListener('click', closeMobileMenu);
}

document.addEventListener('DOMContentLoaded', initSystem);

// --- SISTEMA DE TERMINAL EN VIVO (DASHBOARD) ---
function initTerminalSim() {
    const terminal = document.getElementById('terminal-logs');
    if (!terminal) return;
    
    terminal.innerHTML = ''; // Limpiar
    
    const logs = [
        { type: 'info', msg: 'Iniciando conexión con Supabase Cluster...' },
        { type: 'success', msg: 'Conexión exitosa. Latencia: 14ms' },
        { type: 'info', msg: 'Sincronizando repositorios de GitHub...' },
        { type: 'success', msg: 'Repositorios sincronizados. 4 juegos detectados.' },
        { type: 'warn', msg: 'Buscando actualizaciones de ejecutores externos...' },
        { type: 'success', msg: 'Rutas de API estables.' },
        { type: 'info', msg: 'Esperando nuevas peticiones de usuario...' }
    ];

    let delay = 0;
    logs.forEach((log, index) => {
        setTimeout(() => {
            if(!document.getElementById('terminal-logs')) return; // Evitar error si cambia de vista
            
            const div = document.createElement('div');
            div.className = 'log-entry';
            
            // Generar hora actual simulada
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            
            let colorClass = log.type === 'success' ? 'log-success' : log.type === 'warn' ? 'log-warn' : 'log-info';
            let prefix = log.type === 'success' ? '[200 OK]' : log.type === 'warn' ? '[WARN]' : '[INFO]';
            
            div.innerHTML = `<span class="log-time">${timeStr}</span> <span class="${colorClass}">${prefix}</span> <span class="text-gray-300">${log.msg}</span>`;
            terminal.appendChild(div);
            
            // Auto scroll abajo
            terminal.scrollTop = terminal.scrollHeight;
            
        }, delay);
        
        // Randomizar tiempo de aparición entre logs para mayor realismo (entre 300ms y 1200ms)
        delay += Math.floor(Math.random() * 900) + 300; 
    });
}