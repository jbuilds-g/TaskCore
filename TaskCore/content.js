// TaskCore | Content Script v1.1.0
// Protocol: Terminal Stealth + Auto-Unlock + Session Reminder

// 1. SYNCHRONOUS SHIELD
const shieldStyle = document.createElement('style');
shieldStyle.id = 'taskcore-shield';
shieldStyle.textContent = 'html { visibility: hidden !important; }';
document.documentElement.appendChild(shieldStyle);

let globalPinHash = null;

// 2. CRYPTO UTILS
async function hashPIN(pin) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// 3. CORE LOGIC
function checkLockStatus() {
    const currentDomain = window.location.hostname.replace(/^www\./, '');
    
    chrome.storage.local.get(['lockedDomains', 'globalPinHash'], (res) => {
        globalPinHash = res.globalPinHash;
        const domains = res.lockedDomains || [];
        
        const isBlocked = domains.some(d => currentDomain === d || currentDomain.endsWith('.' + d));
        const hasSession = sessionStorage.getItem('taskcore_access_granted') === 'true';

        if (isBlocked && !hasSession) {
            renderTerminalLock();
        } else {
            unlockPage();
        }
    });
}

function unlockPage() {
    if (shieldStyle.parentNode) shieldStyle.parentNode.removeChild(shieldStyle);
    const existingLock = document.getElementById('terminal-lock-screen');
    if (existingLock) existingLock.remove();
}

// 4. TERMINAL RENDERER
function renderTerminalLock() {
    if (document.getElementById('terminal-lock-screen')) return;

    const overlay = document.createElement('div');
    overlay.id = 'terminal-lock-screen';
    
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: #050505; color: #00ff00; display: flex; flex-direction: column;
        align-items: center; justify-content: center; z-index: 2147483647;
        font-family: 'Courier New', Courier, monospace; letter-spacing: -0.5px;
        visibility: visible !important; opacity: 1 !important; user-select: none;
    `;

    overlay.innerHTML = `
        <div style="width: 340px; max-width: 90vw;">
            <div style="margin-bottom: 20px; border-bottom: 1px solid #004400; padding-bottom: 10px;">
                <span style="opacity: 0.7;">root@taskcore:~#</span> ./guard_process
            </div>
            
            <div style="font-size: 14px; margin-bottom: 30px; line-height: 1.6;">
                <span style="color: #ff3333;">[ERROR]</span> ACCESS DENIED.<br>
                <span style="color: #00ff00;">[INFO]</span> TARGET: ${window.location.hostname}<br>
                <span style="color: #00ff00;">[INFO]</span> AUTH_REQUIRED...
            </div>

            <div style="display: flex; align-items: center; background: #001100; padding: 12px; border: 1px solid #004400;">
                <span style="margin-right: 10px;">></span>
                <input type="password" id="term-input" autofocus autocomplete="off" 
                    style="background: transparent; border: none; color: #00ff00; font-family: inherit; font-size: 16px; outline: none; width: 100%; letter-spacing: 3px;">
                <div id="cursor" style="width: 10px; height: 18px; background: #00ff00; opacity: 1;"></div>
            </div>
            
            <div id="status-line" style="margin-top: 12px; font-size: 12px; height: 14px; color: #005500;">AWAITING INPUT</div>
            
            <div style="margin-top: 40px; font-size: 10px; color: #444; text-align: center; font-family: sans-serif; letter-spacing: 0;">
                [REMINDER] Close tab after session to re-engage guard.
            </div>
        </div>
        <style>
            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            #cursor { animation: blink 1s step-end infinite; }
        </style>
    `;

    document.documentElement.appendChild(overlay);

    const input = overlay.querySelector('#term-input');
    const status = overlay.querySelector('#status-line');

    input.addEventListener('input', async () => {
        const val = input.value;
        status.textContent = "HASHING...";
        
        const hash = await hashPIN(val);
        if (hash === globalPinHash) {
            status.textContent = "ACCESS GRANTED.";
            status.style.color = "#00ff00";
            sessionStorage.setItem('taskcore_access_granted', 'true');
            setTimeout(unlockPage, 150); 
        } else {
            status.textContent = "INVALID HASH.";
        }
    });

    document.addEventListener('click', () => input.focus());
    setTimeout(() => input.focus(), 50);
}

// 5. NAVIGATION OBSERVER
let lastUrl = location.href;
new MutationObserver(() => {
    if (location.href !== lastUrl) { lastUrl = location.href; checkLockStatus(); }
}).observe(document, {subtree: true, childList: true});

checkLockStatus();