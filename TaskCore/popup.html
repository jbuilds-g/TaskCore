<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        /* Modern Dark Theme */
        :root { --bg: #121212; --surface: #1e1e1e; --text: #e0e0e0; --text-muted: #888; --accent: #bb86fc; --border: #333; --danger: #cf6679; }
        body { width: 320px; padding: 16px; margin: 0; font-family: -apple-system, system-ui, sans-serif; background: var(--bg); color: var(--text); }
        
        /* HEADER (Secret Trigger) */
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
        h2 { margin: 0; font-size: 16px; font-weight: 600; cursor: pointer; user-select: none; -webkit-user-select: none; letter-spacing: 0.5px; }
        
        /* FALSE FRONT (To-Do List 2.0) */
        #new-task { width: 100%; box-sizing: border-box; padding: 10px; background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: 6px; margin-bottom: 12px; font-size: 14px; outline: none; }
        #new-task:focus { border-color: var(--accent); }
        
        ul { list-style: none; padding: 0; margin: 0; max-height: 250px; overflow-y: auto; }
        li { display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--surface); font-size: 13px; group; }
        .task-checkbox { margin-right: 10px; accent-color: var(--accent); cursor: pointer; width: 16px; height: 16px; }
        .task-text { flex-grow: 1; outline: none; transition: color 0.2s; }
        .task-text.completed { text-decoration: line-through; color: var(--text-muted); }
        .btn-delete-task { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 16px; padding: 0 4px; }
        .btn-delete-task:hover { color: var(--danger); }
        
        /* ADMIN PANEL (Hidden) */
        #admin-panel { display: none; background: var(--surface); border: 1px solid var(--border); padding: 14px; border-radius: 8px; margin-top: 12px; }
        .admin-title { font-size: 11px; font-weight: bold; color: var(--accent); text-transform: uppercase; margin-bottom: 12px; letter-spacing: 1px; }
        
        .btn { display: block; width: 100%; padding: 10px; margin-bottom: 8px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: opacity 0.2s; }
        .btn-lock { background: var(--accent); color: #000; }
        .btn-reset { background: transparent; border: 1px solid var(--border); color: var(--text); }
        .btn:hover { opacity: 0.8; }

        /* Blocked Domains List */
        .section-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin: 12px 0 6px 0; }
        .domain-item { display: flex; justify-content: space-between; align-items: center; font-size: 12px; background: var(--bg); padding: 6px 8px; border-radius: 4px; margin-bottom: 4px; border: 1px solid var(--border); font-family: monospace; }
        .btn-unlock { background: none; border: none; color: var(--danger); cursor: pointer; font-size: 10px; text-transform: uppercase; font-weight: bold; }
        
        /* PIN Prompt Overlay */
        #pin-prompt { display: none; margin-top: 10px; padding: 10px; background: var(--bg); border: 1px solid var(--danger); border-radius: 6px; }
        #unlock-pin-input { width: 100%; box-sizing: border-box; padding: 8px; margin-bottom: 8px; background: #000; border: 1px solid var(--border); color: #fff; text-align: center; letter-spacing: 2px; border-radius: 4px; outline: none; }
        
        .info-text { font-size: 11px; text-align: center; margin-top: 8px; min-height: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h2 id="stealth-brand">TaskCore</h2>
        <span style="font-size: 11px; color: var(--text-muted);">v1.1.0</span>
    </div>

    <div id="todo-view">
        <input type="text" id="new-task" placeholder="Press Enter to add task...">
        <ul id="task-list"></ul>
    </div>

    <div id="admin-panel">
        <div class="admin-title">System Protocol</div>
        
        <div style="font-family: monospace; font-size: 11px; margin-bottom: 12px; color: var(--text-muted); word-break: break-all;">
            Target: <span id="current-url" style="color: var(--text);">Loading...</span>
        </div>
        
        <button id="btn-lock" class="btn btn-lock">Lock Current Target</button>
        
        <div class="section-label">Active Protocols</div>
        <div id="blocked-list"></div>

        <div id="pin-prompt">
            <div style="font-size: 10px; color: var(--danger); margin-bottom: 6px; text-align: center;">AUTH REQUIRED TO UNBLOCK</div>
            <input type="password" id="unlock-pin-input" placeholder="MASTER PIN">
            <button id="btn-confirm-unlock" class="btn" style="background: var(--danger); color: #fff; margin-bottom: 0;">Verify & Remove</button>
        </div>

        <button id="btn-reset" class="btn btn-reset" style="margin-top: 16px;">Wipe Master PIN</button>
        <div id="msg" class="info-text"></div>
    </div>

    <script src="popup.js"></script>
</body>
</html>