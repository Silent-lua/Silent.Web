/**
 * ==========================================================================
 * SilentHub Enterprise - Core Logic & Staggered Animations
 * ==========================================================================
 */

const scriptDatabase = [
    {
        id: "silenthub-oficial",
        title: "Scripts Exclusivos",
        folder: "SilentHub",
        scripts: [
            { title: "Universal Script", code: 'loadstring(game:HttpGet("https://silenthub-web.vercel.app/Scripts/SilentHub/Universal.lua"))()' }
        ]
    },
    {
        id: "others-cybercode",
        title: "CyberCode",
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

let currentTotalScripts = 0;

function initSystem() {
    renderSidebar();
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

    if (viewId === 'dashboard') initTerminalSim();

    closeMobileMenu();
    setTimeout(initSpotlightEffect, 50);
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

    let delayIndex = 0;

    folderOrder.forEach((folder) => {
        const folderGames = scriptDatabase.filter(g => g.folder === folder.id);
        if (folderGames.length === 0) return;

        const folderDiv = document.createElement('div');
        folderDiv.className = 'mb-1 animate-slide-up';
        folderDiv.style.animationDelay = `${delayIndex * 0.05}s`;
        delayIndex++;

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

function renderScriptsGrid(scriptsArray, containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '';

    if (scriptsArray.length === 0) return;

    scriptsArray.forEach((script, idx) => {
        const safeCode = script.code.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
        const escapedForCopy = script.code.replace(/\\/g, '\\\\').replace(/"/g, '&quot;');
        
        const card = document.createElement('div');
        card.className = 'spotlight-card flex flex-col h-full animate-slide-up';
        card.style.animationDelay = `${idx * 0.08}s`; // Efecto Cascada

        card.innerHTML = `
            <div class="flex items-center justify-between p-3 border-b border-border bg-surface">
                <h3 class="font-medium text-white text-xs truncate pr-2">${script.title}</h3>
                <button onclick="copyToClipboard(this, \`${escapedForCopy}\`)" class="shrink-0 p-1.5 rounded hover:bg-primary/10 text-textMuted hover:text-primary transition-colors">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
            </div>
            <div class="p-3 bg-black flex-1 relative overflow-hidden">
                <pre class="code-block text-textMuted overflow-x-auto custom-scrollbar pb-1 text-[11px]"><code>${safeCode}</code></pre>
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
            card.className = 'spotlight-card flex flex-col h-full animate-slide-up';
            card.style.animationDelay = `${idx * 0.08}s`;

            card.innerHTML = `
                <div class="flex items-center justify-between p-3 border-b border-border bg-surface">
                    <div class="overflow-hidden pr-2">
                        <div class="text-[9px] text-primary font-mono uppercase truncate">${script.folder} / ${script.parent}</div>
                        <h3 class="font-medium text-white text-xs truncate">${script.title}</h3>
                    </div>
                    <button onclick="copyToClipboard(this, \`${escapedForCopy}\`)" class="shrink-0 p-1.5 rounded hover:bg-primary/10 text-textMuted hover:text-primary transition-colors">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                </div>
                <div class="p-3 bg-black flex-1 relative overflow-hidden">
                    <pre class="code-block text-textMuted overflow-x-auto custom-scrollbar pb-1 text-[11px]"><code>${script.code.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}</code></pre>
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
        // SVG Checkmark
        btnElement.innerHTML = `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>`;
        btnElement.classList.add('text-primary');
        btnElement.classList.remove('text-textMuted');

        const toast = document.getElementById('toast');
        if(toast) toast.classList.remove('translate-y-20', 'opacity-0');
        
        setTimeout(() => {
            btnElement.innerHTML = originalHtml;
            btnElement.classList.remove('text-primary');
            btnElement.classList.add('text-textMuted');
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
            clone.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            clone.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });
}

function initTerminalSim() {
    const terminal = document.getElementById('terminal-logs');
    if (!terminal) return;
    terminal.innerHTML = '';
    
    const logs = [
        { type: 'info', msg: 'Resolviendo punteros DNS hacia Vercel Edge...' },
        { type: 'success', msg: 'Handshake TLS 1.3 establecido.' },
        { type: 'info', msg: 'Verificando firmas SHA-256 en repositorios...' },
        { type: 'success', msg: 'Integridad criptográfica validada.' },
        { type: 'warn', msg: 'Aguardando handshake de ejecutores LUA...' },
        { type: 'success', msg: 'Túnel de memoria [READY]. Esperando inyección.' }
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
            let prefix = log.type === 'success' ? '[OK]' : log.type === 'warn' ? '[WARN]' : '[SYS]';
            
            div.innerHTML = `<span class="log-time">${timeStr}</span> <span class="${colorClass}">${prefix}</span> <span class="text-gray-400 ml-1">${log.msg}</span>`;
            terminal.appendChild(div);
            terminal.scrollTop = terminal.scrollHeight;
        }, delay);
        delay += Math.floor(Math.random() * 800) + 200; 
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
    if(searchInput) searchInput.addEventListener('input', handleSearch);

    const openBtn = document.getElementById('open-mobile-menu');
    const closeBtn = document.getElementById('close-mobile-menu');
    const overlay = document.getElementById('mobile-overlay');

    if(openBtn) openBtn.addEventListener('click', openMobileMenu);
    if(closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
    if(overlay) overlay.addEventListener('click', closeMobileMenu);
}

document.addEventListener('DOMContentLoaded', initSystem);