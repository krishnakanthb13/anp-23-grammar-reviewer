import { EMBED_STYLES } from "./styles.css.js";
import { renderSidebarPanel } from "./promptSelectorComponent.js";
import { renderDiffCard } from "./diffViewComponent.js";
import { escapeHtml } from "../engine/diffEngine.js";
import { PROVIDERS, PROVIDER_DOCS, THEMES, MODEL_CATALOG } from "../constants.js";

/**
 * Builds the complete dashboard HTML for renderEmbed.
 * 
 * @param {object} params
 * @param {object} params.session - Active ReviewSession
 * @param {object} params.config - Provider Config
 * @param {Array<object>} params.historyRecords - Past history logs
 * @param {string} [params.activeTab] - "review" | "history" | "settings"
 * @param {string} [params.activeTheme] - Theme name (e.g. "midnight", "nord", etc.)
 * @returns {string} Complete HTML string
 */
export function buildDashboardTemplate({ session, config, historyRecords = [], activeTab = "review", activeTheme = "midnight" }) {
  const metrics = session ? session.getMetrics() : { total: 0, reviewed: 0, accepted: 0, rejected: 0, percentComplete: 0 };
  const currentItem = session?.items?.[session.currentIndex] || null;
  const serializedSession = session ? JSON.stringify(session.toJSON()) : "null";

  return `
<!DOCTYPE html>
<html lang="en" data-theme="${escapeHtml(activeTheme)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Amplenote Grammar Reviewer</title>
  <style>
    ${EMBED_STYLES}
  </style>
</head>
<body>
  <div class="gr-container">
    
    <!-- Top Navigation Header -->
    <header class="gr-header">
      <div class="gr-title-group">
        <div class="gr-logo">🧑‍🏫</div>
        <div>
          <h1 class="gr-title">Grammar & Style Reviewer</h1>
          <div class="gr-subtitle" style="display: flex; align-items: center; gap: 8px; margin-top: 2px;">
            <span>Note: <strong>${escapeHtml(session?.noteTitle || "No Note Selected")}</strong></span>
            <button class="gr-btn btn-secondary" style="padding: 2px 8px; font-size: 11px;" onclick="sendAction('selectNote')">
              📂 ${session ? "Change Note" : "Select Note"}
            </button>
            ${session ? `
              <button class="gr-btn btn-danger" style="padding: 2px 8px; font-size: 11px;" title="Clear in-progress review and start fresh" onclick="confirmResetSession()">
                ✕ Reset
              </button>
            ` : ""}
          </div>
        </div>
      </div>

      <div class="gr-header-actions">
        <!-- 1-Click Smooth Theme Cycler -->
        <button class="gr-theme-btn" id="theme-cycler-btn" onclick="cycleTheme()" title="Click to cycle themes (or press T)">
          <span id="theme-icon">🎨</span>
          <span id="theme-name">Theme</span>
        </button>

        <!-- Instant Client-Side Nav Tabs -->
        <div class="gr-nav-tabs">
          <button id="tab-btn-review" class="gr-tab-btn ${activeTab === "review" ? "active" : ""}" onclick="switchTab('review')">Reviewer</button>
          <button id="tab-btn-history" class="gr-tab-btn ${activeTab === "history" ? "active" : ""}" onclick="switchTab('history')">History Logs (${historyRecords.length})</button>
          <button id="tab-btn-settings" class="gr-tab-btn ${activeTab === "settings" ? "active" : ""}" onclick="switchTab('settings')">⚙️ Settings</button>
        </div>
      </div>
    </header>

    <!-- Tab 1: Reviewer Workspace -->
    <div id="tab-view-review" class="gr-tab-view ${activeTab === "review" ? "active" : ""}">
      ${renderReviewWorkspace(session, config, metrics, currentItem)}
    </div>

    <!-- Tab 2: History Logs Workspace -->
    <div id="tab-view-history" class="gr-tab-view ${activeTab === "history" ? "active" : ""}">
      ${renderHistoryWorkspace(historyRecords)}
    </div>

    <!-- Tab 3: Settings Workspace -->
    <div id="tab-view-settings" class="gr-tab-view ${activeTab === "settings" ? "active" : ""}">
      ${renderSettingsWorkspace(config)}
    </div>

  </div>

  <script>
    const THEMES = ${JSON.stringify(THEMES)};
    const MODEL_CATALOG = ${JSON.stringify(MODEL_CATALOG)};
    const PROVIDER_DOCS = ${JSON.stringify(PROVIDER_DOCS)};
    const STORAGE_KEY = "ANP_GRAMMAR_REVIEWER_SESSION_STATE";
    const THEME_STORAGE_KEY = "ANP_GRAMMAR_REVIEWER_ACTIVE_THEME";
    const TAB_STORAGE_KEY = "ANP_GRAMMAR_REVIEWER_ACTIVE_TAB";
    const serverSession = ${serializedSession};

    // Instant Theme Initialization
    let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || "${escapeHtml(activeTheme)}";
    applyTheme(currentTheme);

    function applyTheme(themeId) {
      const matched = THEMES.find(t => t.id === themeId) || THEMES[0];
      currentTheme = matched.id;
      document.documentElement.setAttribute("data-theme", currentTheme);
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);

      const iconElem = document.getElementById("theme-icon");
      const nameElem = document.getElementById("theme-name");
      if (iconElem && nameElem) {
        iconElem.innerText = matched.icon;
        nameElem.innerText = matched.name;
      }
    }

    function cycleTheme() {
      const currentIndex = THEMES.findIndex(t => t.id === currentTheme);
      const nextIndex = (currentIndex + 1) % THEMES.length;
      applyTheme(THEMES[nextIndex].id);
    }

    // Instant 0ms Tab Switching
    function switchTab(tabId) {
      document.querySelectorAll(".gr-tab-view").forEach(el => el.classList.remove("active"));
      document.querySelectorAll(".gr-tab-btn").forEach(el => el.classList.remove("active"));

      const targetView = document.getElementById("tab-view-" + tabId);
      const targetBtn = document.getElementById("tab-btn-" + tabId);
      if (targetView) targetView.classList.add("active");
      if (targetBtn) targetBtn.classList.add("active");

      try {
        localStorage.setItem(TAB_STORAGE_KEY, tabId);
      } catch (e) {}
    }

    // Restore active tab if saved
    try {
      const savedTab = localStorage.getItem(TAB_STORAGE_KEY);
      if (savedTab && ["review", "history", "settings"].includes(savedTab)) {
        switchTab(savedTab);
      }
    } catch (e) {}

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;

      if (e.key === "t" || e.key === "T") {
        cycleTheme();
      } else if (e.key === "a" || e.key === "A") {
        const activeCard = document.querySelector(".gr-diff-card.active");
        if (activeCard) {
          const idx = parseInt(activeCard.getAttribute("data-index"), 10);
          if (!isNaN(idx)) sendAction("acceptItem", idx);
        }
      } else if (e.key === "r" || e.key === "R") {
        const activeCard = document.querySelector(".gr-diff-card.active");
        if (activeCard) {
          const idx = parseInt(activeCard.getAttribute("data-index"), 10);
          if (!isNaN(idx)) sendAction("rejectItem", idx);
        }
      } else if (e.key === "n" || e.key === "N" || e.key === "ArrowRight") {
        sendAction("nextItem");
      } else if (e.key === "p" || e.key === "P" || e.key === "ArrowLeft") {
        sendAction("prevItem");
      }
    });

    // Session Persistence
    if (serverSession) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverSession));
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }
    } else {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.noteUUID && parsed.items && parsed.items.length > 0) {
            sendAction("restoreSession", parsed);
          }
        }
      } catch (e) {
        console.warn("Could not load from localStorage:", e);
      }
    }

    async function sendAction(action, ...args) {
      if (typeof window.callAmplenotePlugin === "function") {
        try {
          return await window.callAmplenotePlugin(action, ...args);
        } catch (err) {
          console.error("[GrammarReviewer] callAmplenotePlugin failed:", err);
        }
      }
    }

    function confirmResetSession() {
      if (confirm("Reset current review session and clear in-progress changes?")) {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
        sendAction("clearSession");
      }
    }

    function promptManualEdit(index) {
      const currentText = document.getElementById("suggestion-pane-" + index)?.innerText || "";
      const edited = prompt("Edit suggestion manually:", currentText);
      if (edited !== null) {
        sendAction("manualEditItem", index, edited);
      }
    }

    // Synchronized Scrolling for Dual-Pane Diff View (Full Note & Paragraphs)
    function initScrollSync() {
      const activeCard = document.querySelector(".gr-diff-card.active");
      if (!activeCard) return;

      const idx = activeCard.getAttribute("data-index");
      const leftPane = document.getElementById("original-pane-" + idx);
      const rightPane = document.getElementById("suggestion-pane-" + idx);

      if (!leftPane || !rightPane) return;

      let isSyncingLeft = false;
      let isSyncingRight = false;

      leftPane.onscroll = () => {
        if (isSyncingLeft) {
          isSyncingLeft = false;
          return;
        }
        isSyncingRight = true;
        const maxLeft = leftPane.scrollHeight - leftPane.clientHeight;
        const maxRight = rightPane.scrollHeight - rightPane.clientHeight;
        if (maxLeft > 0 && maxRight > 0) {
          rightPane.scrollTop = (leftPane.scrollTop / maxLeft) * maxRight;
        } else {
          rightPane.scrollTop = leftPane.scrollTop;
        }
      };

      rightPane.onscroll = () => {
        if (isSyncingRight) {
          isSyncingRight = false;
          return;
        }
        isSyncingLeft = true;
        const maxLeft = leftPane.scrollHeight - leftPane.clientHeight;
        const maxRight = rightPane.scrollHeight - rightPane.clientHeight;
        if (maxLeft > 0 && maxRight > 0) {
          leftPane.scrollTop = (rightPane.scrollTop / maxRight) * maxLeft;
        } else {
          leftPane.scrollTop = rightPane.scrollTop;
        }
      };
    }

    // Initialize Scroll Sync on DOM Load
    initScrollSync();

    function promptCustomInstruction() {
      const custom = prompt("Enter your custom AI editing prompt/instruction:");
      if (custom && custom.trim().length > 0) {
        sendAction("setCustomPrompt", custom.trim());
      }
    }

    const ALL_SAVED_KEYS = ${JSON.stringify(config.allKeys || {})};
    const ALL_SAVED_MODELS = ${JSON.stringify(config.allModels || {})};

    function formatMaskedKey(key) {
      if (!key || key.trim().length === 0) return "";
      const trimmed = key.trim();
      if (trimmed.length <= 4) return "••••" + trimmed;
      const last4 = trimmed.slice(-4);
      return "••••••••••••••••" + last4;
    }

    function toggleApiKeyVisibility() {
      const input = document.getElementById("settings-api-key");
      const btn = document.getElementById("toggle-key-btn");
      if (input && btn) {
        if (input.type === "password") {
          input.type = "text";
          btn.innerText = "🙈 Hide";
        } else {
          input.type = "password";
          btn.innerText = "👁️ Show";
        }
      }
    }

    function clearActiveApiKey() {
      const providerInput = document.getElementById("settings-provider");
      const keyInput = document.getElementById("settings-api-key");
      const previewBanner = document.getElementById("key-preview-banner");
      const currentProvider = providerInput?.value;

      if (confirm("Delete / clear saved API key for " + currentProvider + "?")) {
        if (keyInput) {
          keyInput.value = "";
          keyInput.placeholder = "Enter new " + currentProvider + " API Key";
        }
        if (currentProvider && ALL_SAVED_KEYS[currentProvider]) {
          ALL_SAVED_KEYS[currentProvider] = "";
        }
        if (previewBanner) {
          previewBanner.innerHTML = '<span style="color: var(--accent-warning);">⚠️ No key saved — enter key below</span>';
        }
      }
    }

    // Instant Settings Provider Selection
    function selectProviderCard(providerKey) {
      const providerInput = document.getElementById("settings-provider");
      if (providerInput) providerInput.value = providerKey;

      const titleElem = document.getElementById("settings-provider-title");
      if (titleElem) titleElem.innerText = providerKey;

      // Update card active highlights
      document.querySelectorAll(".gr-provider-card").forEach(card => {
        card.classList.toggle("active", card.getAttribute("data-key") === providerKey);
      });

      const isOllama = providerKey.includes("Ollama");
      const apiKeyGroup = document.getElementById("settings-api-key-group");
      const baseUrlGroup = document.getElementById("settings-base-url-group");

      if (apiKeyGroup) apiKeyGroup.style.display = isOllama ? "none" : "flex";
      if (baseUrlGroup) baseUrlGroup.style.display = isOllama ? "flex" : "none";

      // Update API Key Doc Link and Label
      const keyLabel = document.getElementById("settings-api-key-label");
      const keyLink = document.getElementById("settings-doc-link");
      if (keyLabel) keyLabel.innerText = providerKey + " API Key";
      if (keyLink && PROVIDER_DOCS[providerKey]) keyLink.href = PROVIDER_DOCS[providerKey];

      // Update Key Input and Saved Preview Banner
      const keyInput = document.getElementById("settings-api-key");
      const previewBanner = document.getElementById("key-preview-banner");
      const savedKey = ALL_SAVED_KEYS[providerKey] || "";

      if (keyInput) {
        keyInput.value = savedKey;
        keyInput.type = "password";
      }
      const toggleBtn = document.getElementById("toggle-key-btn");
      if (toggleBtn) toggleBtn.innerText = "👁️ Show";

      if (previewBanner) {
        if (savedKey && savedKey.trim().length > 0) {
          previewBanner.innerHTML = '<span style="color: var(--accent-success); font-weight: 600;">🔒 Saved Key:</span> <code style="background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">' + formatMaskedKey(savedKey) + '</code>';
        } else {
          previewBanner.innerHTML = '<span style="color: var(--accent-warning);">⚠️ No key saved — enter key below</span>';
        }
      }

      // Update Model Dropdown options instantly based on THAT provider's saved model
      const modelSelect = document.getElementById("settings-model-select");
      const customGroup = document.getElementById("custom-model-input-group");
      const customInput = document.getElementById("settings-model");
      const activeCustom = ALL_SAVED_MODELS[providerKey] || "";

      if (customInput) {
        customInput.value = activeCustom;
      }

      if (modelSelect && MODEL_CATALOG[providerKey]) {
        const models = MODEL_CATALOG[providerKey];
        const isMatched = models.some(m => m.value === activeCustom);
        const isCustomOption = Boolean(activeCustom && !isMatched);

        modelSelect.innerHTML = '<option value="" ' + (!activeCustom ? 'selected' : '') + '>Default Recommended Model</option>' + 
          models.map(m => '<option value="' + m.value + '" ' + (m.value === activeCustom ? 'selected' : '') + '>' + m.label + ' (' + m.value + ')</option>').join("") +
          '<option value="__custom__" ' + (isCustomOption ? 'selected' : '') + '>⚙️ Custom Model Override...</option>';

        if (customGroup) {
          customGroup.style.display = isCustomOption ? "flex" : "none";
        }
      }
    }

    function onModelSelectChange() {
      const selectElem = document.getElementById("settings-model-select");
      const customGroup = document.getElementById("custom-model-input-group");
      const customInput = document.getElementById("settings-model");

      if (selectElem?.value === "__custom__") {
        if (customGroup) customGroup.style.display = "flex";
        if (customInput) {
          customInput.focus();
        }
      } else {
        if (customGroup) customGroup.style.display = "none";
      }
    }

    function saveSettingsForm() {
      const provider = document.getElementById("settings-provider")?.value;
      const apiKey = document.getElementById("settings-api-key")?.value;
      const modelSelect = document.getElementById("settings-model-select")?.value;
      const customInput = document.getElementById("settings-model")?.value;

      let customModel = "";
      if (modelSelect === "__custom__") {
        customModel = (customInput || "").trim();
      } else if (modelSelect) {
        customModel = modelSelect.trim();
      }

      if (provider) {
        ALL_SAVED_MODELS[provider] = customModel;
      }

      const customBaseUrl = document.getElementById("settings-base-url")?.value;

      sendAction("saveSettings", {
        provider,
        apiKey,
        customModel,
        customBaseUrl
      });
    }
  </script>
</body>
</html>
  `;
}

function renderReviewWorkspace(session, config, metrics, currentItem) {
  if (!session) {
    return `
      <div class="gr-empty-state">
        <div style="font-size: 48px; margin-bottom: 12px;">📂</div>
        <h2 style="color: var(--text-primary); font-size: 18px;">No Active Note Selected</h2>
        <p style="margin-top: 6px; font-size: 13px; color: var(--text-secondary);">Select a note to inspect and review its grammar, style, and structure.</p>
        <button class="gr-btn btn-primary" style="margin-top: 18px; padding: 10px 24px; font-size: 13px;" onclick="sendAction('selectNote')">
          📂 Select Note to Review
        </button>
      </div>
    `;
  }

  return `
    <div class="gr-workbench">
      ${renderSidebarPanel(session, config, metrics)}

      <main class="gr-main-canvas">
        ${renderDiffCard(currentItem, session.currentIndex, session.items.length)}

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; flex-wrap: wrap; gap: 10px;">
          <div style="font-size: 12px; color: var(--text-secondary);">
            💡 <strong>Shortcuts:</strong> <code>A</code> Accept · <code>R</code> Reject · <code>N/P</code> Next/Prev · <code>T</code> Theme
          </div>
          <button class="gr-btn btn-save" style="padding: 10px 24px; font-size: 13px;" onclick="sendAction('saveAndCommit')">
            💾 Save & Commit Rewrites to Note
          </button>
        </div>
      </main>
    </div>
  `;
}

function renderHistoryWorkspace(historyRecords) {
  if (!historyRecords || historyRecords.length === 0) {
    return `
      <div class="gr-empty-state">
        <div style="font-size: 48px; margin-bottom: 12px;">📜</div>
        <h2 style="color: var(--text-primary); font-size: 18px;">No Past Review History Found</h2>
        <p style="margin-top: 6px; font-size: 13px; color: var(--text-secondary);">When you commit reviews, iteration history is automatically archived with tag <code>-reports/-grammar/-history</code>.</p>
      </div>
    `;
  }

  const rows = historyRecords.map(rec => {
    const dateStr = rec.isoDate ? rec.isoDate.replace("T", " ").substring(0, 16) : String(rec.timestamp);
    const changesCount = rec.session?.metrics?.accepted || 0;
    return `
      <tr>
        <td><strong>${dateStr}</strong></td>
        <td>${escapeHtml(rec.sourceNote?.title || "Untitled Note")}</td>
        <td><span class="gr-diff-badge badge-accepted">${rec.session?.provider || "AI"} (${rec.session?.granularity || "mode"})</span></td>
        <td>${changesCount} changes applied</td>
        <td>
          <button class="gr-btn btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="sendAction('openNote', '${rec.sourceNote?.uuid || ""}')">Open Note</button>
        </td>
      </tr>
    `;
  }).join("");

  return `
    <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 16px; border: 1px solid var(--border-color); box-shadow: var(--card-shadow); overflow-x: auto;">
      <h2 style="font-size: 15px; margin-bottom: 14px; color: var(--text-primary);">Past Grammar Review Iterations</h2>
      <table class="gr-history-table">
        <thead>
          <tr>
            <th>Date / Timestamp</th>
            <th>Source Note</th>
            <th>Provider / Mode</th>
            <th>Modifications</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

function renderSettingsWorkspace(config) {
  const activeProvider = config.provider || PROVIDERS.OPENROUTER;
  const currentKey = config.apiKey || config.allKeys?.[activeProvider] || "";
  const docUrl = PROVIDER_DOCS[activeProvider] || "https://openrouter.ai/keys";
  const catalog = MODEL_CATALOG[activeProvider] || [];

  const providersInfo = [
    { key: PROVIDERS.OPENROUTER, title: "OpenRouter", badge: "GPT-OSS 120B (Free)", isFree: true, desc: "Auto Router (openrouter/auto), free pool (GPT-OSS 120B, DeepSeek V4 Flash, Qwen3.6)." },
    { key: PROVIDERS.GEMINI, title: "Google Gemini", badge: "Gemini 3.5 Flash-Lite", isFree: true, desc: "Fast Gemini 3.5 Flash-Lite, Gemini 3.7 Flash, and Gemini 3.1 Pro." },
    { key: PROVIDERS.GROQ, title: "Groq", badge: "300+ tok/s Ultra-Fast", isFree: true, desc: "Near-instantaneous inference on GPT-OSS 120B, Qwen3.6 27B & GPT-OSS 20B." },
    { key: PROVIDERS.MISTRAL, title: "Mistral AI", badge: "Mistral Small 4 & Large 3", isFree: true, desc: "European frontier models (Mistral Small 4, Large 3, Codestral)." },
    { key: PROVIDERS.OLLAMA, title: "Ollama (Cloud & Local)", badge: "DeepSeek V4 Flash Cloud", isFree: true, desc: "DeepSeek V4 Flash/Pro Cloud, Kimi K3, MiniMax M3, or local offline." },
    { key: PROVIDERS.DEEPSEEK, title: "DeepSeek Direct", badge: "DeepSeek V4 Flash", isFree: false, desc: "Frontier DeepSeek V4 Flash with built-in thinking & V4 Pro." },
    { key: PROVIDERS.OPENAI, title: "OpenAI", badge: "GPT-5.6 Luna & Terra", isFree: false, desc: "Current generation GPT-5.6 Luna, Terra, Sol & GPT-5.4." },
    { key: PROVIDERS.ANTHROPIC, title: "Anthropic Claude", badge: "Claude Haiku 4.5 & Sonnet 5", isFree: false, desc: "Crisp copyediting via Claude Haiku 4.5, Sonnet 5 & Opus 4.8." }
  ];

  const providerCards = providersInfo.map(p => {
    const isSelected = p.key === activeProvider;
    return `
      <div class="gr-provider-card ${isSelected ? "active" : ""}" data-key="${p.key}" onclick="selectProviderCard('${p.key}')">
        <div class="gr-provider-card-header">
          <span class="gr-provider-title">${p.title}</span>
          <span class="${p.isFree ? "gr-badge-free" : "gr-badge-paid"}">${p.badge}</span>
        </div>
        <p style="font-size: 12px; color: var(--text-secondary);">${p.desc}</p>
      </div>
    `;
  }).join("");

  const activeSavedModel = (config.allModels && config.allModels[activeProvider]) || config.customModel || "";
  const isMatchedModel = catalog.some(m => m.value === activeSavedModel);
  const isCustomModelActive = Boolean(activeSavedModel && !isMatchedModel);

  const modelOptionsHtml = catalog.map(m => {
    return `<option value="${m.value}" ${m.value === activeSavedModel ? "selected" : ""}>${m.label} (${m.value})</option>`;
  }).join("") + `<option value="__custom__" ${isCustomModelActive ? "selected" : ""}>⚙️ Custom Model Override...</option>`;

  return `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      
      <div>
        <h2 style="font-size: 16px; color: var(--text-primary); margin-bottom: 4px;">Select AI Provider</h2>
        <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">Choose from free-tier providers or configure your direct API keys.</p>
        <div class="gr-settings-grid">
          ${providerCards}
        </div>
      </div>

      <div class="gr-settings-form">
        <h3 style="font-size: 14px; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
          Configure: <strong id="settings-provider-title">${activeProvider}</strong>
        </h3>

        <input type="hidden" id="settings-provider" value="${activeProvider}">

        <div id="settings-api-key-group" class="gr-form-group" style="display: ${activeProvider.includes("Ollama") ? "none" : "flex"};">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label class="gr-form-label" id="settings-api-key-label" for="settings-api-key">${activeProvider} API Key</label>
            <a id="settings-doc-link" href="${docUrl}" target="_blank" style="font-size: 12px; color: var(--accent-primary); text-decoration: none; font-weight: 600;">Get API Key ↗</a>
          </div>

          <div id="key-preview-banner" style="font-size: 12px; padding: 6px 10px; background: var(--bg-card); border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
            ${currentKey && currentKey.trim().length > 0 ? `
              <div><span style="color: var(--accent-success); font-weight: 600;">🔒 Saved Key:</span> <code style="background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">••••••••••••••••${escapeHtml(currentKey.slice(-4))}</code></div>
            ` : `
              <span style="color: var(--accent-warning);">⚠️ No key saved — enter key below</span>
            `}
          </div>

          <div style="display: flex; gap: 8px; align-items: center;">
            <input type="password" id="settings-api-key" class="gr-input" style="flex: 1; padding: 8px 12px;" placeholder="Paste new or updated API Key" value="${escapeHtml(currentKey)}">
            <button type="button" id="toggle-key-btn" class="gr-btn btn-secondary" style="padding: 8px 12px; font-size: 12px; white-space: nowrap;" onclick="toggleApiKeyVisibility()">
              👁️ Show
            </button>
            <button type="button" class="gr-btn btn-danger" style="padding: 8px 12px; font-size: 12px; white-space: nowrap;" title="Clear and delete saved key" onclick="clearActiveApiKey()">
              🗑️ Clear
            </button>
          </div>
          <span class="gr-form-help">Keys are securely stored in your Amplenote plugin settings.</span>
        </div>

        <div id="settings-base-url-group" class="gr-form-group" style="display: ${activeProvider.includes("Ollama") ? "flex" : "none"};">
          <label class="gr-form-label" for="settings-base-url">Local Ollama Base URL</label>
          <input type="text" id="settings-base-url" class="gr-input" style="width: 100%; padding: 8px 12px;" placeholder="http://localhost:11434/v1" value="${escapeHtml(config.customBaseUrl || "http://localhost:11434/v1")}">
          <span class="gr-form-help">Ensure Ollama is running with <code>OLLAMA_ORIGINS="*"</code> to allow web browser connection.</span>
        </div>

        <div class="gr-form-group">
          <label class="gr-form-label" for="settings-model-select">Active Model for Provider</label>
          <select id="settings-model-select" class="gr-select" style="width: 100%; padding: 8px 12px;" onchange="onModelSelectChange()">
            <option value="" ${!activeSavedModel ? "selected" : ""}>Default Recommended Model</option>
            ${modelOptionsHtml}
          </select>
        </div>

        <div id="custom-model-input-group" class="gr-form-group" style="display: ${isCustomModelActive ? "flex" : "none"};">
          <label class="gr-form-label" for="settings-model">Enter Custom Model ID</label>
          <input type="text" id="settings-model" class="gr-input" style="width: 100%; padding: 8px 12px;" placeholder="e.g. llama3.2:1b, mistral-nemo, gpt-4-turbo" value="${escapeHtml(activeSavedModel)}">
          <span class="gr-form-help">Type the exact model tag or endpoint ID you wish to use.</span>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px;">
          <button class="gr-btn btn-save" onclick="saveSettingsForm()">
            💾 Save Settings
          </button>
        </div>
      </div>

    </div>
  `;
}
