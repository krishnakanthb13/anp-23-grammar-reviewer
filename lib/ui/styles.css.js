/**
 * Embedded CSS styles - High Performance, Zero Lag, Theme-Reactive for Grammar Reviewer UI
 */
export const EMBED_STYLES = `
:root {
  /* Default Midnight Theme */
  --bg-primary: #0b0f19;
  --bg-secondary: #131b2e;
  --bg-card: #1a233a;
  --bg-card-hover: #222f4d;
  --border-color: #273553;
  --border-active: #3b82f6;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --accent-primary: #3b82f6;
  --accent-hover: #2563eb;
  --accent-success: #10b981;
  --accent-success-bg: rgba(16, 185, 129, 0.18);
  --accent-danger: #ef4444;
  --accent-danger-bg: rgba(239, 68, 68, 0.18);
  --accent-warning: #f59e0b;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", Helvetica, Arial, sans-serif;
  --card-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

/* Theme: Nord Arctic */
[data-theme="nord"] {
  --bg-primary: #242933;
  --bg-secondary: #2e3440;
  --bg-card: #3b4252;
  --bg-card-hover: #434c5e;
  --border-color: #4c566a;
  --border-active: #88c0d0;
  --text-primary: #eceff4;
  --text-secondary: #d8dee9;
  --text-muted: #e5e9f0;
  --accent-primary: #88c0d0;
  --accent-hover: #81a1c1;
  --accent-success: #a3be8c;
  --accent-success-bg: rgba(163, 190, 140, 0.2);
  --accent-danger: #bf616a;
  --accent-danger-bg: rgba(191, 97, 106, 0.2);
  --accent-warning: #ebcb8b;
  --card-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

/* Theme: Glassmorphism */
[data-theme="glass"] {
  --bg-primary: #0b1329;
  --bg-secondary: #16203a;
  --bg-card: #1f2d4e;
  --bg-card-hover: #293a62;
  --border-color: #2b3d68;
  --border-active: #38bdf8;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --accent-primary: #38bdf8;
  --accent-hover: #0ea5e9;
  --accent-success: #34d399;
  --accent-success-bg: rgba(52, 211, 153, 0.2);
  --accent-danger: #fb7185;
  --accent-danger-bg: rgba(251, 113, 133, 0.2);
  --accent-warning: #facc15;
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* Theme: Emerald Forest */
[data-theme="emerald"] {
  --bg-primary: #061e16;
  --bg-secondary: #0b2e23;
  --bg-card: #124334;
  --bg-card-hover: #185442;
  --border-color: #1b5e4a;
  --border-active: #10b981;
  --text-primary: #ecfdf5;
  --text-secondary: #a7f3d0;
  --text-muted: #6ee7b7;
  --accent-primary: #10b981;
  --accent-hover: #059669;
  --accent-success: #34d399;
  --accent-success-bg: rgba(52, 211, 153, 0.25);
  --accent-danger: #f87171;
  --accent-danger-bg: rgba(248, 113, 113, 0.2);
  --accent-warning: #fbbf24;
  --card-shadow: 0 4px 16px rgba(6, 30, 22, 0.4);
}

/* Theme: Cyber Violet */
[data-theme="purple"] {
  --bg-primary: #100a1c;
  --bg-secondary: #1a102f;
  --bg-card: #271947;
  --bg-card-hover: #352260;
  --border-color: #442b7a;
  --border-active: #a855f7;
  --text-primary: #faf5ff;
  --text-secondary: #e9d5ff;
  --text-muted: #c084fc;
  --accent-primary: #a855f7;
  --accent-hover: #9333ea;
  --accent-success: #4ade80;
  --accent-success-bg: rgba(74, 222, 128, 0.2);
  --accent-danger: #f43f5e;
  --accent-danger-bg: rgba(244, 63, 94, 0.2);
  --accent-warning: #fbbf24;
  --card-shadow: 0 4px 18px rgba(168, 85, 247, 0.15);
}

/* Theme: Clean Daylight (Light Mode) */
[data-theme="light"] {
  --bg-primary: #f1f5f9;
  --bg-secondary: #ffffff;
  --bg-card: #f8fafc;
  --bg-card-hover: #e2e8f0;
  --border-color: #cbd5e1;
  --border-active: #2563eb;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;
  --accent-primary: #2563eb;
  --accent-hover: #1d4ed8;
  --accent-success: #059669;
  --accent-success-bg: rgba(5, 150, 105, 0.15);
  --accent-danger: #dc2626;
  --accent-danger-bg: rgba(220, 38, 38, 0.12);
  --accent-warning: #d97706;
  --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  scrollbar-width: thin;
  scrollbar-color: var(--accent-primary) var(--bg-primary);
}

html {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100%;
  padding: 16px 20px 80px 20px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

/* Themed Scrollbars */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-primary);
}
::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
}

.gr-container {
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100%;
}

/* Header Bar */
.gr-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-secondary);
  padding: 12px 18px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: var(--card-shadow);
  gap: 12px;
  flex-wrap: wrap;
}

.gr-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gr-logo {
  font-size: 22px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 6px 10px;
  border-radius: var(--radius-sm);
}

.gr-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}

.gr-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
}

.gr-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.gr-nav-tabs {
  display: flex;
  gap: 4px;
  background: var(--bg-primary);
  padding: 3px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.gr-tab-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 7px 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.gr-tab-btn:hover {
  color: var(--text-primary);
}

.gr-tab-btn.active {
  background: var(--accent-primary);
  color: #ffffff;
}

/* Theme Cycle Button */
.gr-theme-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 7px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.gr-theme-btn:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-active);
}

/* Tab Views Container */
.gr-tab-view {
  display: none;
  flex-direction: column;
  gap: 16px;
}
.gr-tab-view.active {
  display: flex;
}

/* Control Toolbar */
.gr-toolbar {
  background: var(--bg-secondary);
  padding: 14px 18px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--card-shadow);
}

.gr-control-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.gr-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.gr-select, .gr-input {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 7px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  outline: none;
}

.gr-select:focus, .gr-input:focus {
  border-color: var(--border-active);
}

/* Prompt Preset Chips */
.gr-preset-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.gr-chip {
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.gr-chip:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
  border-color: var(--border-active);
}

.gr-chip.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: #ffffff;
  font-weight: 700;
}

/* Progress Track */
.gr-progress-card {
  background: var(--bg-secondary);
  padding: 12px 18px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: var(--card-shadow);
}

.gr-progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
}

.gr-progress-track {
  width: 100%;
  height: 6px;
  background: var(--bg-primary);
  border-radius: 3px;
  overflow: hidden;
}

.gr-progress-fill {
  height: 100%;
  background: var(--accent-primary);
}

/* Diff Review Card */
.gr-review-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gr-diff-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

.gr-diff-card.active {
  border-color: var(--border-active);
}

.gr-diff-header {
  background: rgba(0, 0, 0, 0.15);
  padding: 12px 18px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gr-diff-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.badge-pending { background: #475569; color: #cbd5e1; }
.badge-accepted { background: var(--accent-success-bg); color: var(--accent-success); border: 1px solid rgba(16,185,129,0.3); }
.badge-rejected { background: var(--accent-danger-bg); color: var(--accent-danger); border: 1px solid rgba(239,68,68,0.3); }
.badge-modified { background: rgba(245, 158, 11, 0.2); color: var(--accent-warning); }

.gr-diff-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 18px;
}

@media (max-width: 768px) {
  .gr-diff-body {
    grid-template-columns: 1fr;
  }
}

.gr-pane {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gr-pane-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.gr-pane-content {
  background: var(--bg-primary);
  padding: 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  font-size: 14px;
  white-space: pre-wrap;
  min-height: 120px;
  max-height: 440px;
  overflow-y: auto;
  line-height: 1.7;
}

/* Diff Highlighting */
.diff-del {
  background: var(--accent-danger-bg);
  color: #fca5a5;
  text-decoration: line-through;
  padding: 2px 4px;
  border-radius: 3px;
  margin: 0 1px;
}

.diff-ins {
  background: var(--accent-success-bg);
  color: #6ee7b7;
  text-decoration: none;
  padding: 2px 4px;
  border-radius: 3px;
  margin: 0 1px;
  font-weight: 600;
}

/* Buttons & Actions */
.gr-actions-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: rgba(0, 0, 0, 0.1);
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 10px;
}

.gr-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn-primary { background: var(--accent-primary); color: #fff; }
.btn-primary:hover { background: var(--accent-hover); }

.btn-success { background: var(--accent-success); color: #fff; }
.btn-success:hover { background: #059669; }

.btn-danger { background: var(--bg-card); color: var(--accent-danger); border-color: rgba(239,68,68,0.4); }
.btn-danger:hover { background: var(--accent-danger-bg); }

.btn-secondary { background: var(--bg-card); color: var(--text-primary); border-color: var(--border-color); }
.btn-secondary:hover { background: var(--bg-card-hover); border-color: var(--border-active); }

.btn-save {
  background: var(--accent-success);
  color: #fff;
  font-size: 13px;
  padding: 10px 22px;
  border-radius: var(--radius-sm);
}

.btn-save:hover {
  background: #059669;
}

/* History Table */
.gr-history-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.gr-history-table th, .gr-history-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  font-size: 13px;
}

.gr-history-table th {
  background: rgba(0,0,0,0.2);
  color: var(--text-secondary);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 11px;
}

.gr-history-table tr:hover {
  background: var(--bg-card-hover);
}

/* Empty State */
.gr-empty-state {
  text-align: center;
  padding: 50px 20px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-color);
  color: var(--text-secondary);
}

/* Settings View Elements */
.gr-settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 768px) {
  .gr-settings-grid {
    grid-template-columns: 1fr;
  }
}
.gr-provider-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 14px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.gr-provider-card:hover {
  border-color: var(--border-active);
  background: var(--bg-card-hover);
}
.gr-provider-card.active {
  border-color: var(--accent-primary);
  background: var(--bg-card-hover);
  box-shadow: 0 0 0 2px var(--border-active);
}
.gr-provider-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.gr-provider-title {
  font-weight: 700;
  font-size: 13px;
  color: var(--text-primary);
}
.gr-badge-free {
  background: var(--accent-success-bg);
  color: var(--accent-success);
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 4px;
  font-weight: 700;
}
.gr-badge-paid {
  background: rgba(148, 163, 184, 0.15);
  color: #cbd5e1;
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 4px;
  font-weight: 600;
}
.gr-settings-form {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: var(--card-shadow);
}
.gr-form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.gr-form-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.gr-form-help {
  font-size: 12px;
  color: var(--text-secondary);
}
`;
