// TaskCore | Popup Logic v1.0.0

// --- CRYPTO UTILS ---
async function hashPIN(pin) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- TODO LIST 2.0 (CRUD Logic) ---
const taskInput = document.getElementById('new-task');
const taskList = document.getElementById('task-list');

function loadTasks() {
    chrome.storage.local.get(['tc_tasks'], (res) => {
        const tasks = res.tc_tasks || [];
        taskList.innerHTML = tasks.map((t, index) => `
            <li data-index="${index}">
                <input type="checkbox" class="task-checkbox" ${t.done ? 'checked' : ''}>
                <span class="task-text ${t.done ? 'completed' : ''}" contenteditable="true">${t.text}</span>
                <button class="btn-delete-task">×</button>
            </li>
        `).join('');
    });
}

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && taskInput.value.trim()) {
        chrome.storage.local.get(['tc_tasks'], (res) => {
            const tasks = res.tc_tasks || [];
            tasks.push({ text: taskInput.value.trim(), done: false });
            chrome.storage.local.set({tc_tasks: tasks}, () => { 
                taskInput.value = ''; 
                loadTasks(); 
            });
        });
    }
});

taskList.addEventListener('input', (e) => {
    if (e.target.classList.contains('task-text')) {
        const index = e.target.parentElement.dataset.index;
        chrome.storage.local.get(['tc_tasks'], (res) => {
            const tasks = res.tc_tasks || [];
            tasks[index].text = e.target.innerText;
            chrome.storage.local.set({tc_tasks: tasks});
        });
    }
});

taskList.addEventListener('change', (e) => {
    if (e.target.classList.contains('task-checkbox')) {
        const index = e.target.parentElement.dataset.index;
        chrome.storage.local.get(['tc_tasks'], (res) => {
            const tasks = res.tc_tasks || [];
            tasks[index].done = e.target.checked;
            chrome.storage.local.set({tc_tasks: tasks}, loadTasks);
        });
    }
});

taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete-task')) {
        const index = e.target.parentElement.dataset.index;
        chrome.storage.local.get(['tc_tasks'], (res) => {
            const tasks = res.tc_tasks || [];
            tasks.splice(index, 1);
            chrome.storage.local.set({tc_tasks: tasks}, loadTasks);
        });
    }
});

loadTasks();

// --- SECRET ADMIN PANEL TRIGGER ---
const headerContainer = document.querySelector('.header');
const adminPanel = document.getElementById('admin-panel');
let clickCount = 0;
let clickTimer = null;

headerContainer.addEventListener('click', () => {
    clickCount++;
    
    if (clickTimer) clearTimeout(clickTimer);
    
    clickTimer = setTimeout(() => {
        clickCount = 0;
    }, 1500);

    if (clickCount === 3) {
        clearTimeout(clickTimer);
        clickCount = 0;
        
        const isHidden = adminPanel.style.display === 'none' || adminPanel.style.display === '';
        adminPanel.style.display = isHidden ? 'block' : 'none';
        
        if (isHidden) initAdmin();
    }
});

// --- ADMIN & SECURITY LOGIC ---
let pendingUnlockDomain = null;

function initAdmin() {
    chrome.storage.local.get(['globalPinHash'], (res) => {
        if (!res.globalPinHash) {
            // STATE: NO PIN SET
            document.getElementById('admin-setup').style.display = 'block';
            document.getElementById('admin-controls').style.display = 'none';
            document.getElementById('setup-pin-input').focus();
        } else {
            // STATE: PIN EXISTS
            document.getElementById('admin-setup').style.display = 'none';
            document.getElementById('admin-controls').style.display = 'block';
            renderBlockedList();
            bindControls();
        }
    });
}

// Bind Initial Setup Action
document.getElementById('btn-save-pin').addEventListener('click', async () => {
    const pin = document.getElementById('setup-pin-input').value;
    if (!pin) {
        showMessage("PIN CANNOT BE EMPTY", "var(--danger)");
        return;
    }
    const hash = await hashPIN(pin);
    chrome.storage.local.set({ globalPinHash: hash }, () => {
        document.getElementById('setup-pin-input').value = '';
        showMessage("SYSTEM INITIALIZED", "var(--accent)");
        initAdmin(); // Re-run to switch to controls view
    });
});

let controlsBound = false; // Prevent double-binding events
function bindControls() {
    if (controlsBound) return;
    controlsBound = true;

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (!tabs[0]) return;
        try {
            const rawUrl = new URL(tabs[0].url).hostname;
            const url = rawUrl.replace(/^www\./, '');
            document.getElementById('current-url').textContent = url;
        
            document.getElementById('btn-lock').onclick = () => {
                chrome.storage.local.get(['lockedDomains'], (res) => {
                    const list = res.lockedDomains || [];
                    if (!list.includes(url)) {
                        list.push(url);
                        chrome.storage.local.set({lockedDomains: list}, () => {
                            showMessage("TARGET LOCKED.", "var(--danger)");
                            renderBlockedList();
                            setTimeout(() => chrome.tabs.reload(tabs[0].id), 800);
                        });
                    } else {
                        showMessage("ALREADY LOCKED.");
                    }
                });
            };
        } catch (e) {
            document.getElementById('current-url').textContent = "System Page";
        }

        document.getElementById('btn-reset').onclick = () => {
            chrome.storage.local.remove(['globalPinHash'], () => {
                showMessage("PIN WIPED.", "var(--accent)");
                initAdmin(); // Switch back to setup view immediately
            });
        };
    });
}

function renderBlockedList() {
    chrome.storage.local.get(['lockedDomains'], (res) => {
        const list = res.lockedDomains || [];
        const listEl = document.getElementById('blocked-list');
        
        if (list.length === 0) {
            listEl.innerHTML = '<div style="font-size:10px; color:#666;">No active protocols.</div>';
            return;
        }

        listEl.innerHTML = list.map(domain => `
            <div class="domain-item">
                <span>${domain}</span>
                <button class="btn-unlock" data-domain="${domain}">UNBLOCK</button>
            </div>
        `).join('');

        document.querySelectorAll('.btn-unlock').forEach(btn => {
            btn.addEventListener('click', (e) => {
                pendingUnlockDomain = e.target.dataset.domain;
                document.getElementById('pin-prompt').style.display = 'block';
                document.getElementById('unlock-pin-input').focus();
            });
        });
    });
}

document.getElementById('btn-confirm-unlock').addEventListener('click', async () => {
    const pinInput = document.getElementById('unlock-pin-input');
    const inputHash = await hashPIN(pinInput.value);
    
    chrome.storage.local.get(['globalPinHash', 'lockedDomains'], (res) => {
        if (inputHash === res.globalPinHash) {
            let list = res.lockedDomains || [];
            list = list.filter(d => d !== pendingUnlockDomain);
            chrome.storage.local.set({lockedDomains: list}, () => {
                showMessage(`${pendingUnlockDomain} UNBLOCKED.`, "var(--accent)");
                document.getElementById('pin-prompt').style.display = 'none';
                pinInput.value = '';
                pendingUnlockDomain = null;
                renderBlockedList();
            });
        } else {
            showMessage("AUTH FAILED.", "var(--danger)");
            pinInput.value = '';
            pinInput.focus();
        }
    });
});

function showMessage(text, color = "var(--text-muted)") {
    const msg = document.getElementById('msg');
    msg.textContent = text;
    msg.style.color = color;
    setTimeout(() => msg.textContent = '', 3000);
}