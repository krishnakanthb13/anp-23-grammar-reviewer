/**
 * Elevated Design System - Modern Typography, Polish & Micro-interactions
 */
export const EMBED_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  /* Default Midnight Theme */
  --bg-primary: #0b0f19;
  --bg-secondary: #131b2e;
  --bg-card: #182238;
  --bg-card-hover: #222f4d;
  --border-color: rgba(255, 255, 255, 0.08);
  --border-subtle: rgba(255, 255, 255, 0.05);
  --border-active: #3b82f6;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --accent-primary: #3b82f6;
  --accent-hover: #2563eb;
  --accent-success: #10b981;
  --accent-success-bg: rgba(16, 185, 129, 0.15);
  --accent-danger: #ef4444;
  --accent-danger-bg: rgba(239, 68, 68, 0.15);
  --accent-warning: #f59e0b;
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
  --btn-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Theme: Nord Arctic */
[data-theme="nord"] {
  --bg-primary: #242933;
  --bg-secondary: #2e3440;
  --bg-card: #3b4252;
  --bg-card-hover: #434c5e;
  --border-color: rgba(255, 255, 255, 0.1);
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-active: #88c0d0;
  --text-primary: #eceff4;
  --text-secondary: #d8dee9;
  --text-muted: #9aa8be;
  --accent-primary: #88c0d0;
  --accent-hover: #81a1c1;
  --accent-success: #a3be8c;
  --accent-success-bg: rgba(163, 190, 140, 0.2);
  --accent-danger: #bf616a;
  --accent-danger-bg: rgba(191, 97, 106, 0.2);
  --accent-warning: #ebcb8b;
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

/* Theme: Glassmorphism */
[data-theme="glass"] {
  --bg-primary: #0b1329;
  --bg-secondary: #16203a;
  --bg-card: #1e2c4f;
  --bg-card-hover: #293a62;
  --border-color: rgba(56, 189, 248, 0.15);
  --border-subtle: rgba(56, 189, 248, 0.08);
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
  --card-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
}

/* Theme: Emerald Forest */
[data-theme="emerald"] {
  --bg-primary: #061e16;
  --bg-secondary: #0b2e23;
  --bg-card: #124334;
  --bg-card-hover: #185442;
  --border-color: rgba(52, 211, 153, 0.15);
  --border-subtle: rgba(52, 211, 153, 0.08);
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
  --card-shadow: 0 4px 20px rgba(6, 30, 22, 0.4);
}

/* Theme: Cyber Violet */
[data-theme="purple"] {
  --bg-primary: #100a1c;
  --bg-secondary: #1a102f;
  --bg-card: #271947;
  --bg-card-hover: #352260;
  --border-color: rgba(168, 85, 247, 0.2);
  --border-subtle: rgba(168, 85, 247, 0.1);
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
  --card-shadow: 0 4px 24px rgba(168, 85, 247, 0.2);
}

/* Theme: Clean Daylight (Light Mode) */
[data-theme="light"] {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-card: #f1f5f9;
  --bg-card-hover: #e2e8f0;
  --border-color: #e2e8f0;
  --border-subtle: #f1f5f9;
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
  --card-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  --btn-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
  font-family: var(--font-sans);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.5;
  min-height: 100%;
  width: 100%;
  padding: 14px 18px 48px 18px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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

/* 100% Full Width Container */
.gr-container {
  width: 100%;
  max-width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 100%;
}

/* Top Navigation Header Bar */
.gr-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-secondary);
  padding: 10px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: var(--card-shadow);
  gap: 12px;
  flex-wrap: wrap;
}

.gr-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gr-logo {
  font-size: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 5px 9px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.gr-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.gr-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.gr-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.gr-nav-tabs {
  display: flex;
  gap: 2px;
  background: var(--bg-primary);
  padding: 3px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.gr-tab-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: var(--radius-xs);
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-sans);
  transition: all 0.15s ease;
}

.gr-tab-btn:hover {
  color: var(--text-primary);
}

.gr-tab-btn.active {
  background: var(--accent-primary);
  color: #ffffff;
  box-shadow: var(--btn-shadow);
}

/* Theme Cycler Button */
.gr-theme-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-sans);
  transition: all 0.15s ease;
}

.gr-theme-btn:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-active);
  transform: translateY(-1px);
}

/* Tab Views Container */
.gr-tab-view {
  display: none;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.gr-tab-view.active {
  display: flex;
}

/* Workbench Full-Width 2-Column Grid */
.gr-workbench {
  display: grid;
  grid-template-columns: 290px 1fr;
  gap: 16px;
  width: 100%;
  align-items: stretch;
}

@media (max-width: 920px) {
  .gr-workbench {
    grid-template-columns: 1fr;
  }
}

/* Left Inspector Sidebar */
.gr-sidebar {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
}

.gr-sidebar-section {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.gr-sidebar-section:last-child {
  border-bottom: none;
}

.gr-sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gr-section-title {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.gr-btn-link {
  background: transparent;
  border: none;
  color: var(--accent-primary);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-family: var(--font-sans);
}
.gr-btn-link:hover {
  text-decoration: underline;
}

.gr-form-sublabel {
  font-size: 10px;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 3px;
  display: block;
}

/* Segmented Control */
.gr-segmented-control {
  display: flex;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 3px;
  gap: 3px;
}

.gr-segment-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 7px 6px;
  border-radius: var(--radius-xs);
  font-size: 11.5px;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}
.gr-segment-btn:hover {
  color: var(--text-primary);
}
.gr-segment-btn.active {
  background: var(--accent-primary);
  color: #ffffff;
  box-shadow: var(--btn-shadow);
}

/* Presets List */
.gr-preset-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.gr-preset-item {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-left: 3px solid transparent;
  color: var(--text-secondary);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-sans);
  text-align: left;
  cursor: pointer;
  white-space: normal;
  line-height: 1.35;
  transition: all 0.15s ease;
}
.gr-preset-item:hover {
  border-color: var(--border-active);
  color: var(--text-primary);
  background: var(--bg-card-hover);
  transform: translateX(2px);
}
.gr-preset-item.active {
  background: var(--bg-card);
  border-color: var(--border-active);
  border-left: 3px solid var(--accent-primary);
  color: var(--text-primary);
  font-weight: 600;
}

.gr-custom-prompt-box {
  margin-top: 8px;
  font-size: 11px;
  color: var(--accent-primary);
  background: var(--bg-primary);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

/* Progress Track */
.gr-progress-track {
  width: 100%;
  height: 6px;
  background: var(--bg-primary);
  border-radius: 999px;
  overflow: hidden;
}

.gr-progress-fill {
  height: 100%;
  background: var(--accent-primary);
  transition: width 0.3s ease;
}

.gr-metrics-row {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 11px;
}

/* Keyboard KBD styling */
kbd {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  color: var(--text-primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Main Canvas */
.gr-main-canvas {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

/* Diff Review Card */
.gr-diff-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  flex: 1;
}

.gr-diff-card.active {
  border-color: var(--border-active);
}

.gr-diff-header {
  background: rgba(0, 0, 0, 0.15);
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.gr-nav-bar-group {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.gr-jump-selector-container {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.gr-jump-label {
  font-size: 11.5px;
  color: var(--text-secondary);
  font-weight: 600;
}

.gr-jump-select {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-size: 11.5px;
  font-family: var(--font-sans);
  outline: none;
  max-width: 220px;
}
.gr-jump-select:focus {
  border-color: var(--border-active);
}

.gr-change-count-pill {
  background: rgba(59, 130, 246, 0.15);
  color: var(--accent-primary);
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.gr-diff-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  font-family: var(--font-sans);
}

.badge-pending { background: #475569; color: #f8fafc; }
.badge-suggestion_ready { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); }
.badge-accepted { background: var(--accent-success-bg); color: var(--accent-success); border: 1px solid rgba(16,185,129,0.3); }
.badge-rejected { background: var(--accent-danger-bg); color: var(--accent-danger); border: 1px solid rgba(239,68,68,0.3); }
.badge-modified { background: rgba(245, 158, 11, 0.2); color: var(--accent-warning); border: 1px solid rgba(245, 158, 11, 0.3); }
.badge-error { background: var(--accent-danger-bg); color: var(--accent-danger); border: 1px solid rgba(239,68,68,0.4); }

/* Diff Mode Bar */
.gr-diff-mode-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 8px;
}

.gr-diff-body {
  padding: 14px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.gr-panes-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  flex: 1;
}

@media (max-width: 768px) {
  .gr-panes-wrapper {
    grid-template-columns: 1fr;
  }
}

.gr-pane {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.gr-pane-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  display: flex;
  justify-content: space-between;
}

.gr-pane-content {
  background: var(--bg-primary);
  padding: 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  font-size: 14px;
  font-family: var(--font-sans);
  white-space: pre-wrap;
  min-height: 380px;
  height: calc(100vh - 350px);
  max-height: 700px;
  overflow-y: auto;
  line-height: 1.75;
  letter-spacing: 0.01em;
}

/* Side-by-Side Dual Highlighting */
.diff-del-highlight {
  background: var(--accent-danger-bg);
  color: #f87171;
  text-decoration: line-through;
  padding: 1px 4px;
  border-radius: 3px;
  margin: 0 1px;
  font-weight: 500;
  border-bottom: 1px dashed rgba(239, 68, 68, 0.4);
}

.diff-ins-highlight {
  background: var(--accent-success-bg);
  color: #34d399;
  text-decoration: none;
  padding: 1px 4px;
  border-radius: 3px;
  margin: 0 1px;
  font-weight: 600;
  border-bottom: 1px solid rgba(16, 185, 129, 0.4);
}

/* Inline Diff Highlighting */
.diff-del {
  background: var(--accent-danger-bg);
  color: #f87171;
  text-decoration: line-through;
  padding: 1px 4px;
  border-radius: 3px;
  margin: 0 1px;
}

.diff-ins {
  background: var(--accent-success-bg);
  color: #34d399;
  text-decoration: none;
  padding: 1px 4px;
  border-radius: 3px;
  margin: 0 1px;
  font-weight: 600;
}

/* Changes Only Mode View */
.gr-changes-only-view {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 16px;
  min-height: 380px;
  height: calc(100vh - 350px);
  max-height: 700px;
  overflow-y: auto;
}

.gr-changes-list-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gr-changes-list-header {
  font-size: 13px;
  color: var(--text-primary);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border-color);
}

.gr-changes-list-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gr-change-row {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-card);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  font-size: 13px;
  flex-wrap: wrap;
}

.gr-change-num {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 700;
}

.gr-change-type {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
}

.badge-replace { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
.badge-delete { background: var(--accent-danger-bg); color: #f87171; }
.badge-insert { background: var(--accent-success-bg); color: #34d399; }

.gr-change-del {
  color: #f87171;
  text-decoration: line-through;
  font-family: var(--font-sans);
}

.gr-change-arrow {
  color: var(--text-muted);
  font-weight: 700;
}

.gr-change-ins {
  color: #34d399;
  font-weight: 600;
  font-family: var(--font-sans);
}

.gr-no-changes-msg {
  color: var(--accent-success);
  padding: 20px;
  text-align: center;
  font-size: 13.5px;
  font-weight: 600;
}

/* Teacher's Insight Box */
.gr-teacher-insight-box {
  background: rgba(59, 130, 246, 0.06);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  margin: 0 16px 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.gr-teacher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.gr-category-badge {
  background: rgba(59, 130, 246, 0.15);
  color: var(--accent-primary);
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
}

.gr-confidence-badge {
  background: var(--accent-success-bg);
  color: var(--accent-success);
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
}

.gr-teacher-body {
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.45;
}

/* Diff View Switcher Pills */
.gr-diff-view-switcher {
  display: inline-flex;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xs);
  padding: 2px;
  gap: 2px;
}

.gr-view-toggle-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all 0.15s ease;
}

.gr-view-toggle-btn:hover {
  color: var(--text-primary);
}

.gr-view-toggle-btn.active {
  background: var(--accent-primary);
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Top Loading Operation Bar */
.gr-top-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9999;
  background: transparent;
  overflow: hidden;
  display: none;
}

.gr-top-loader.active {
  display: block;
  background: rgba(59, 130, 246, 0.2);
}

.gr-top-loader-bar {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981, #a855f7, #3b82f6);
  background-size: 200% 100%;
  animation: grProgressSlide 1.5s infinite linear;
}

@keyframes grProgressSlide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.gr-op-banner {
  background: rgba(59, 130, 246, 0.12);
  border-bottom: 1px solid rgba(59, 130, 246, 0.25);
  color: var(--text-primary);
  font-size: 12px;
  padding: 6px 16px;
  display: none;
  align-items: center;
  justify-content: space-between;
}

.gr-op-banner.active {
  display: flex;
}

/* Status Pills */
.gr-status-pill {
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.gr-status-pill.success { background: var(--accent-success-bg); color: var(--accent-success); border: 1px solid rgba(16,185,129,0.3); }
.gr-status-pill.danger { background: var(--accent-danger-bg); color: var(--accent-danger); border: 1px solid rgba(239,68,68,0.3); }
.gr-status-pill.modified { background: rgba(245, 158, 11, 0.2); color: var(--accent-warning); border: 1px solid rgba(245, 158, 11, 0.3); }

/* Buttons & Micro-interactions */
.gr-actions-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.15);
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 10px;
}

.gr-action-buttons-group {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.gr-nav-controls-group {
  display: flex;
  gap: 6px;
  align-items: center;
}

.gr-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  border: 1px solid transparent;
  box-shadow: var(--btn-shadow);
  transition: all 0.15s ease;
}
.gr-btn:hover {
  transform: translateY(-1px);
}
.gr-btn:active {
  transform: translateY(0);
}

.gr-btn.btn-sm {
  padding: 5px 9px;
  font-size: 11px;
}

.btn-primary { background: var(--accent-primary); color: #fff; }
.btn-primary:hover { background: var(--accent-hover); }

.btn-success { background: var(--accent-success); color: #fff; }
.btn-success:hover { background: #059669; }

.btn-danger { background: var(--bg-card); color: var(--accent-danger); border-color: rgba(239,68,68,0.3); }
.btn-danger:hover { background: var(--accent-danger-bg); }

.btn-warning { background: rgba(245, 158, 11, 0.15); color: var(--accent-warning); border-color: rgba(245, 158, 11, 0.4); }
.btn-warning:hover { background: rgba(245, 158, 11, 0.25); }

.btn-secondary { background: var(--bg-card); color: var(--text-primary); border-color: var(--border-color); }
.btn-secondary:hover { background: var(--bg-card-hover); border-color: var(--border-active); }

.btn-save {
  background: var(--accent-success);
  color: #fff;
  font-size: 13.5px;
  padding: 11px 24px;
  border-radius: var(--radius-sm);
  font-weight: 700;
}
.btn-save:hover {
  background: #059669;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.gr-select, .gr-input {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-family: var(--font-sans);
  outline: none;
  transition: border-color 0.15s ease;
}
.gr-select:focus, .gr-input:focus {
  border-color: var(--border-active);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
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
  padding: 11px 14px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
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
  transition: all 0.15s ease;
}
.gr-provider-card:hover {
  border-color: var(--border-active);
  background: var(--bg-card-hover);
  transform: translateY(-1px);
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
  font-size: 13.5px;
  color: var(--text-primary);
}
.gr-badge-free {
  background: var(--accent-success-bg);
  color: var(--accent-success);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
}
.gr-badge-paid {
  background: rgba(148, 163, 184, 0.15);
  color: #cbd5e1;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}
.gr-settings-form {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 18px;
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
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}
.gr-form-help {
  font-size: 11px;
  color: var(--text-secondary);
}
`;

