const scriptDatabase = [
    {
        id: "silenthub-oficial",
        title: "SilentHub",
        folder: "SilentHub",
        scripts: [
            { title: "Universal Shooters (Movil)", code: 'loadstring(game:HttpGet("https://silenthub-web.vercel.app/Scripts/SilentHub/Universal.lua"))()' }
        ]
    },
    {
        id: "others",
        title: "Others",
        folder: "Others",
        scripts: [
            { title: "CyberCode Main", code: 'loadstring(game:HttpGet("https://silenthub-web.vercel.app/Scripts/Others/CyberCode.lua"))()' }
        ]
    },
    {
        id: "utilities-tools",
        title: "Rendimiento y Herramientas",
        folder: "Utilities",
        scripts: [
            { title: "Boost FPS", code: 'loadstring(game:HttpGet("https://silenthub-web.vercel.app/Scripts/Utilities/BoostFps"))()' },
            { title: "Universal ShiftLock", code: 'loadstring(game:HttpGet("https://silenthub-web.vercel.app/Scripts/Utilities/ShiftLock"))()' }
        ]
    }
];

const changelogDatabase = [
    { version: "v2.1.0", date: "Hoy", changes: ["Migración a plataforma dinámica SSR.", "Integración de Buscador Global y Bento Grid.", "Optimización PWA para iOS/Android."] },
    { version: "v2.0.5", date: "Hace 2 días", changes: ["Actualización de módulo Universal Shooters.", "Latencia de red reducida en nodos Vercel."] }
];

const faqDatabase = [
    { q: "¿Cómo inyecto los scripts?", a: "Navega al directorio deseado, pulsa el botón de copiar y pega el código Lua en tu ejecutor compatible." },
    { q: "¿Es seguro usar SilentHub?", a: "Absolutamente. Todo el código fuente está alojado en repositorios privados y servido a través de CDN segura, aplicando ofuscación militar antes de llegar al cliente." },
    { q: "¿Qué ejecutores están soportados?", a: "Nuestras llamadas a la API (game:HttpGet) son un estándar compatible con todos los ejecutores modernos de nivel 7 y superiores (móvil y PC)." }
];

let currentTotalScripts = 0;

function initSystem() {
    renderSidebar();
    renderHomeDynamicContent();
    initSpotlightEffect();
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

    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    
    const targetView = document.getElementById(`view-${viewId}`);
    if(targetView) targetView.classList.remove('hidden');

    const breadcrumb = document.getElementById('breadcrumb-path');
    if (viewId === 'catalog' && gameData) {
        document.getElementById('catalog-title').innerText = gameData.title;
        document.getElementById('catalog-category').innerText = `DIR: /${gameData.folder}/`;
        breadcrumb.innerText = `~/scripts/${gameData.folder.toLowerCase()}/${gameData.id}`;
        renderScriptsGrid(gameData.scripts, 'scripts-grid');
    } else {
        breadcrumb.innerText = `~/root/${viewId}`;
    }

    closeMobileMenu();
    setTimeout(initSpotlightEffect, 50);
    
    if (viewId === 'dashboard') initTerminalSim();
}

function renderSidebar() {
    const container = document.getElementById('dynamic-sidebar-categories');
    if(!container) return;
    container.innerHTML = '';
    currentTotalScripts = 0;

    const folderOrder = [
        { name: "SilentHub", id: "SilentHub", isOpen: true },
        { name: "Others", id: "Others", isOpen: true },
        { name: "Utilities", id: "Utilities", isOpen: false }
    ];

    folderOrder.forEach(folder => {
        const folderGames = scriptDatabase.filter(g => g.folder === folder.id);
        if (folderGames.length === 0) return;

        const folderDiv = document.createElement('div');
        folderDiv.className = 'mb-1';

        const headerBtn = document.createElement('button');
        headerBtn.className = 'w-full flex items-center justify-between px-3 py-2 rounded-md text-[11px] font-semibold text-textMuted hover:text-white transition-all text-left';
        
        const initialRotation = folder.isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
        const titleColor = folder.id === 'SilentHub' ? 'text-primary' : 'text-white';
        
        headerBtn.innerHTML = `
            <div class="flex items-center gap-2">
                <svg class="w-3 h-3 transition-transform duration-200" id="icon-${folder.id}" style="transform: ${initialRotation}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                <span class="${titleColor} uppercase tracking-[0.1em]">${folder.name}</span>
            </div>
        `;

        const contentDiv = document.createElement('div');
        contentDiv.className = `${folder.isOpen ? 'flex' : 'hidden'} flex-col gap-1 pl-3 mt-1 ml-1.5 border-l border-border overflow-hidden transition-all`;
        contentDiv.id = `content-${folder.id}`;

        headerBtn.onclick = () => {
            const isHidden = contentDiv.classList.contains('hidden');
            if(isHidden) {
                contentDiv.classList.remove('hidden'); contentDiv.classList.add('flex');
                document.getElementById(`icon-${folder.id}`).style.transform = 'rotate(90deg)';
            } else {
                contentDiv.classList.add('hidden'); contentDiv.classList.remove('flex');
                document.getElementById(`icon-${folder.id}`).style.transform = 'rotate(0deg)';
            }
        };

        folderGames.forEach(game => {
            const btn = document.createElement('button');
            btn.id = `nav-${game.id}`;
            btn.className = 'nav-item w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs text-textMuted hover:text-white hover:bg-surfaceHover transition-all text-left';
            btn.onclick = () => navigateTo('catalog', game);
            
            btn.innerHTML = `
                <span class="truncate">${game.title}</span>
                <span class="text-[9px] font-mono bg-surface border border-border px-1 rounded opacity-70 text-primaryLight">${game.scripts.length}</span>
            `;
            contentDiv.appendChild(btn);
            currentTotalScripts += game.scripts.length;
        });

        folderDiv.appendChild(headerBtn);
        folderDiv.appendChild(contentDiv);
        container.appendChild(folderDiv);
    });
}

function renderHomeDynamicContent() {
    const statsContainer = document.getElementById('home-stats-container');
    if (statsContainer) {
        const uniqueFolders = new Set(scriptDatabase.map(g => g.folder)).size;
        statsContainer.innerHTML = `
            <div class="border border-border/50 rounded-xl p-4 bg-surfaceHover/50 flex flex-col justify-center items-center text-center">
                <div class="text-[10px] text-textMuted uppercase tracking-widest mb-1">Carga Base</div>
                <div class="font-mono text-white font-bold text-xl">${currentTotalScripts}</div>
            </div>
            <div class="border border-border/50 rounded-xl p-4 bg-surfaceHover/50 flex flex-col justify-center items-center text-center">
                <div class="text-[10px] text-textMuted uppercase tracking-widest mb-1">Directorios</div>
                <div class="font-mono text-white font-bold text-xl">${uniqueFolders}</div>
            </div>
            <div class="border border-border/50 rounded-xl p-4 bg-surfaceHover/50 flex flex-col justify-center items-center text-center">
                <div class="text-[10px] text-textMuted uppercase tracking-widest mb-1">Latencia</div>
                <div class="font-mono text-white font-bold text-xl">14<span class="text-xs text-primary ml-1">ms</span></div>
            </div>
            <div class="border border-border/50 rounded-xl p-4 bg-surfaceHover/50 flex flex-col justify-center items-center text-center">
                <div class="text-[10px] text-textMuted uppercase tracking-widest mb-1">Red Nodos</div>
                <div class="font-mono text-green-400 font-bold text-xl flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> ONLINE
                </div>
            </div>
        `;
    }

    const featuredContainer = document.getElementById('home-featured-grid');
    if (featuredContainer) {
        featuredContainer.innerHTML = '';
        let featuredCount = 0;
        scriptDatabase.forEach(game => {
            if (featuredCount >= 4 || game.scripts.length === 0) return;
            const script = game.scripts[0]; 
            
            const card = document.createElement('div');
            card.className = 'spotlight-card p-4 border border-border cursor-pointer hover:border-primary/30 transition-colors group';
            card.onclick = () => navigateTo('catalog', game); 
            
            card.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <div class="text-[9px] text-primary font-mono uppercase truncate">${game.folder}</div>
                    <svg class="w-3.5 h-3.5 text-textMuted group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
                <h4 class="font-bold text-white text-sm mb-1 truncate">${script.title}</h4>
                <p class="text-xs text-textMuted font-mono truncate opacity-60">${game.title}</p>
            `;
            featuredContainer.appendChild(card);
            featuredCount++;
        });
    }

    const categoriesContainer = document.getElementById('home-categories-grid');
    if (categoriesContainer) {
        categoriesContainer.innerHTML = '';
        const folderOrder = [
            { name: "SilentHub", id: "SilentHub", desc: "Módulos Core" },
            { name: "Others", id: "Others", desc: "Repositorio Público" },
            { name: "Utilities", id: "Utilities", desc: "Herramientas" }
        ];

        folderOrder.forEach(folder => {
            let count = 0;
            scriptDatabase.filter(g => g.folder === folder.id).forEach(g => count += g.scripts.length);

            const card = document.createElement('div');
            card.className = 'spotlight-card p-4 border border-border flex flex-col justify-center items-center text-center';
            card.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-surfaceHover border border-border flex items-center justify-center text-textMuted mb-3">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h4 class="font-bold text-white text-xs uppercase tracking-wider mb-1">${folder.name}</h4>
                <div class="text-[10px] text-textMuted font-mono bg-background border border-border px-2 py-0.5 rounded">${count} indexados</div>
            `;
            categoriesContainer.appendChild(card);
        });
    }

    const changelogContainer = document.getElementById('home-changelog-list');
    if (changelogContainer) {
        changelogContainer.innerHTML = '';
        changelogDatabase.forEach((log, index) => {
            const isLatest = index === 0;
            const markerColor = isLatest ? 'bg-primary shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'bg-border';
            
            const logItem = document.createElement('div');
            logItem.className = 'relative flex items-start gap-4 md:gap-6 pl-4 md:pl-0';
            let changesHTML = log.changes.map(c => `<li class="mb-1 text-xs text-textMuted leading-relaxed">- ${c}</li>`).join('');

            logItem.innerHTML = `
                <div class="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-2 h-2 rounded-full ${markerColor} top-1 z-10"></div>
                <div class="w-full md:w-1/2 md:pr-8 md:text-right ${index % 2 !== 0 ? 'md:ml-auto md:pl-8 md:text-left' : ''}">
                    <div class="flex items-center gap-2 ${index % 2 !== 0 ? 'md:justify-start' : 'md:justify-end'} mb-1">
                        <span class="text-[10px] font-mono text-primary">${log.version}</span>
                        <span class="text-[9px] text-textMuted bg-surfaceHover px-1 rounded">${log.date}</span>
                    </div>
                    <ul class="list-none m-0 p-0 text-left ${index % 2 !== 0 ? 'md:text-left' : 'md:text-right'}">
                        ${changesHTML}
                    </ul>
                </div>
            `;
            changelogContainer.appendChild(logItem);
        });
    }

    const faqContainer = document.getElementById('home-faq-list');
    if (faqContainer) {
        faqContainer.innerHTML = '';
        faqDatabase.forEach((faq, idx) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'border-b border-border/50 last:border-0 pb-2';
            faqItem.innerHTML = `
                <button class="w-full flex items-center justify-between py-2 text-left group">
                    <span class="text-xs font-semibold text-white group-hover:text-primary transition-colors">${faq.q}</span>
                    <svg class="w-3.5 h-3.5 text-textMuted transition-transform duration-300" id="faq-icon-${idx}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div class="faq-content" id="faq-content-${idx}">
                    <p class="text-[11px] text-textMuted leading-relaxed pb-3">${faq.a}</p>
                </div>
            `;
            faqContainer.appendChild(faqItem);

            const btn = faqItem.querySelector('button');
            btn.onclick = () => {
                const content = document.getElementById(`faq-content-${idx}`);
                const icon = document.getElementById(`faq-icon-${idx}`);
                if(content.classList.contains('open')) {
                    content.classList.remove('open');
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    document.querySelectorAll('.faq-content').forEach(el => el.classList.remove('open'));
                    document.querySelectorAll('[id^="faq-icon-"]').forEach(el => el.style.transform = 'rotate(0deg)');
                    content.classList.add('open');
                    icon.style.transform = 'rotate(180deg)';
                }
            };
        });
    }
}

// Diseño Robusto de las Tarjetas
function renderScriptsGrid(scriptsArray, containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '';

    if (scriptsArray.length === 0) return;

    scriptsArray.forEach((script, idx) => {
        const safeCode = script.code.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
        const escapedForCopy = script.code.replace(/\\/g, '\\\\').replace(/"/g, '&quot;');
        
        const card = document.createElement('div');
        card.className = 'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 animate-slide-up';
        card.style.animationDelay = `${idx * 0.08}s`;

        card.innerHTML = `
            <div class="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none z-0"></div>
            <div class="relative z-10 flex items-center justify-between border-b border-border bg-white/[0.01] px-5 py-4 transition-colors group-hover:bg-white/[0.02]">
                <h3 class="font-bold text-white group-hover:text-primaryLight transition-colors truncate pr-4 text-sm">${script.title}</h3>
                <button onclick="copyToClipboard(this, \`${escapedForCopy}\`)" class="shrink-0 flex items-center justify-center h-8 w-8 rounded-full border border-border bg-surfaceHover text-textMuted transition-all hover:bg-primary hover:text-black hover:border-primary hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:scale-105" title="Copiar Script">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
            </div>
            <div class="relative z-10 p-5 flex-1 flex flex-col bg-transparent">
                <pre class="flex-1 w-full overflow-x-auto rounded-lg bg-[#050505] p-4 text-[11px] leading-relaxed text-textMuted font-mono custom-scrollbar border border-border shadow-inner group-hover:border-primary/20 transition-colors"><code>${safeCode}</code></pre>
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
                    results.push({...script, parent: game.title, folder: game.folder});
                }
            });
        });
        
        const queryDisplay = document.getElementById('search-query-display');
        if(queryDisplay) queryDisplay.innerText = query;
        
        navigateTo('search');
        document.getElementById('breadcrumb-path').innerText = `~/root/search?q=${query}`;
        
        const container = document.getElementById('search-results-grid');
        if(!container) return;
        container.innerHTML = '';
        
        results.forEach((script, idx) => {
            const escapedForCopy = script.code.replace(/\\/g, '\\\\').replace(/"/g, '&quot;');
            const card = document.createElement('div');
            card.className = 'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 animate-slide-up';
            card.style.animationDelay = `${idx * 0.08}s`;

            card.innerHTML = `
                <div class="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none z-0"></div>
                <div class="relative z-10 flex items-center justify-between border-b border-border bg-white/[0.01] px-5 py-4 transition-colors group-hover:bg-white/[0.02]">
                    <div class="overflow-hidden pr-4">
                        <div class="text-[9px] text-primary font-mono uppercase truncate mb-1">${script.folder} / ${script.parent}</div>
                        <h3 class="font-bold text-white group-hover:text-primaryLight transition-colors truncate text-sm">${script.title}</h3>
                    </div>
                    <button onclick="copyToClipboard(this, \`${escapedForCopy}\`)" class="shrink-0 flex items-center justify-center h-8 w-8 rounded-full border border-border bg-surfaceHover text-textMuted transition-all hover:bg-primary hover:text-black hover:border-primary hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:scale-105" title="Copiar Script">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                </div>
                <div class="relative z-10 p-5 flex-1 flex flex-col bg-transparent">
                    <pre class="flex-1 w-full overflow-x-auto rounded-lg bg-[#050505] p-4 text-[11px] leading-relaxed text-textMuted font-mono custom-scrollbar border border-border shadow-inner group-hover:border-primary/20 transition-colors"><code>${script.code.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}</code></pre>
                </div>
            `;
            container.appendChild(card);
        });
    } else {
        navigateTo('home');
    }
}

function copyToClipboard(btnElement, text) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHtml = btnElement.innerHTML;
        btnElement.innerHTML = `<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>`;
        btnElement.classList.add('bg-primary', 'text-black', 'border-primary', 'shadow-[0_0_15px_rgba(234,179,8,0.5)]', 'scale-110');
        btnElement.classList.remove('bg-surfaceHover', 'text-textMuted');

        const toast = document.getElementById('toast');
        if(toast) toast.classList.remove('translate-y-24', 'opacity-0');
        
        setTimeout(() => {
            btnElement.innerHTML = originalHtml;
            btnElement.classList.remove('bg-primary', 'text-black', 'border-primary', 'shadow-[0_0_15px_rgba(234,179,8,0.5)]', 'scale-110');
            btnElement.classList.add('bg-surfaceHover', 'text-textMuted');
            if(toast) toast.classList.add('translate-y-24', 'opacity-0');
        }, 2000);
    });
}

function initSpotlightEffect() {
    document.querySelectorAll('.spotlight-card').forEach(card => {
        const clone = card.cloneNode(true);
        card.parentNode.replaceChild(clone, card);
        clone.addEventListener('mousemove', e => {
            const rect = clone.getBoundingClientRect();
            clone.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            clone.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });
}

function setNetworkStatus(isOnline) {
    const container = document.getElementById('network-status-container');
    const dot = document.getElementById('network-status-dot');
    const text = document.getElementById('network-status-text');
    
    if (!container || !dot || !text) return;
    
    if (isOnline) {
        container.className = 'relative flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/40 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-colors duration-500 overflow-hidden';
        dot.className = 'w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse relative z-10 transition-colors duration-500';
        text.className = 'text-[9px] font-mono text-green-400 uppercase tracking-wider hidden sm:inline relative z-10 transition-colors duration-500';
        text.innerText = 'API: Online';
    } else {
        container.className = 'relative flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/40 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.15)] transition-colors duration-500 overflow-hidden';
        dot.className = 'w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse relative z-10 transition-colors duration-500';
        text.className = 'text-[9px] font-mono text-red-400 uppercase tracking-wider hidden sm:inline relative z-10 transition-colors duration-500';
        text.innerText = 'API: Offline';
    }
}
window.setNetworkStatus = setNetworkStatus;

function initTerminalSim() {
    const terminal = document.getElementById('terminal-logs');
    if (!terminal) return;
    
    terminal.innerHTML = ''; 
    
    const logs = [
        { type: 'info', msg: 'Iniciando conexión con Supabase Cluster...' },
        { type: 'success', msg: 'Conexión exitosa. Latencia: 14ms' },
        { type: 'info', msg: 'Sincronizando repositorios de GitHub...' },
        { type: 'success', msg: 'Repositorios sincronizados. Nodos detectados.' },
        { type: 'warn', msg: 'Buscando actualizaciones de ejecutores externos...' },
        { type: 'success', msg: 'Rutas de API estables.' },
        { type: 'info', msg: 'Esperando nuevas peticiones de usuario...' }
    ];

    let delay = 0;
    logs.forEach((log) => {
        setTimeout(() => {
            if(!document.getElementById('terminal-logs')) return;
            
            const div = document.createElement('div');
            div.className = 'log-entry';
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            
            let colorClass = log.type === 'success' ? 'log-success' : log.type === 'warn' ? 'log-warn' : 'log-info';
            let prefix = log.type === 'success' ? '[200 OK]' : log.type === 'warn' ? '[WARN]' : '[INFO]';
            
            div.innerHTML = `<span class="log-time">${timeStr}</span> <span class="${colorClass}">${prefix}</span> <span class="text-gray-300 ml-1">${log.msg}</span>`;
            terminal.appendChild(div);
            terminal.scrollTop = terminal.scrollHeight;
            
        }, delay);
        delay += Math.floor(Math.random() * 900) + 300; 
    });
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
    const heroSearchInput = document.getElementById('hero-search');
    
    if(searchInput) searchInput.addEventListener('input', handleSearch);
    if(heroSearchInput) {
        heroSearchInput.addEventListener('input', (e) => {
            if(searchInput) searchInput.value = e.target.value;
            handleSearch(e);
        });
    }

    const openBtn = document.getElementById('open-mobile-menu');
    const closeBtn = document.getElementById('close-mobile-menu');
    const overlay = document.getElementById('mobile-overlay');

    if(openBtn) openBtn.addEventListener('click', openMobileMenu);
    if(closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
    if(overlay) overlay.addEventListener('click', closeMobileMenu);
}

document.addEventListener('DOMContentLoaded', initSystem);