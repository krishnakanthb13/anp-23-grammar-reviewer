import { EMBED_STYLES } from "./styles.css.js";
import { renderSidebarPanel } from "./promptSelectorComponent.js";
import { renderDiffCard } from "./diffViewComponent.js";
import { escapeHtml } from "../engine/diffEngine.js";
import { PROVIDERS, PROVIDER_DOCS, THEMES, MODEL_CATALOG, RE_REVIEW_REASONS } from "../constants.js";

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
function safeJsonEmbed(obj) {
  if (obj === null || obj === undefined) return "null";
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function buildDashboardTemplate({ session, config, historyRecords = [], activeTab = "review", activeTheme = "midnight", usageStats = null }) {
  const metrics = session ? session.getMetrics() : { total: 0, reviewed: 0, accepted: 0, rejected: 0, percentComplete: 0, pending: 0 };
  const currentItem = session?.items?.[session.currentIndex] || null;
  const serializedSession = safeJsonEmbed(session ? session.toJSON() : null);

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
  
  <!-- Universal Sandboxed-Safe In-DOM Modal Dialog -->
  <div id="gr-modal-backdrop" class="gr-modal-backdrop" style="display: none;">
    <div class="gr-modal-box" id="gr-modal-box">
      <div class="gr-modal-header">
        <h3 id="gr-modal-title" class="gr-modal-title">Dialog</h3>
        <div class="gr-modal-header-actions">
          <button id="gr-modal-btn-enlarge" class="gr-modal-enlarge-btn" onclick="toggleModalEnlarge()" title="Enlarge window / Restore">⛶</button>
          <button class="gr-modal-close" onclick="closeAppModal()" title="Close">✕</button>
        </div>
      </div>
      <div class="gr-modal-body">
        <p id="gr-modal-message" class="gr-modal-message"></p>
        <div id="gr-modal-input-container"></div>
      </div>
      <div class="gr-modal-footer">
        <button class="gr-btn btn-secondary" onclick="closeAppModal()">Cancel</button>
        <button id="gr-modal-btn-confirm" class="gr-btn btn-primary">Confirm</button>
      </div>
    </div>
  </div>

  <!-- Top Progress Loading Bar -->
  <div id="top-loader" class="gr-top-loader"><div class="gr-top-loader-bar"></div></div>

  <!-- Global Operation Notification Banner -->
  <div id="op-banner" class="gr-op-banner">
    <div class="gr-op-banner-left">
      <div class="gr-op-banner-spinner"></div>
      <div class="gr-op-banner-info">
        <span id="op-banner-text" class="gr-op-banner-text">AI is reviewing your note...</span>
        <span id="op-banner-subtext" class="gr-op-banner-subtext">Polishing prose & generating insights...</span>
      </div>
    </div>
    <button class="gr-op-banner-cancel" onclick="cancelActiveOperation()" title="Stop ongoing review">✕ Stop</button>
  </div>


  <div class="gr-container">
    
    <!-- Top Navigation Header -->
    <header class="gr-header">
      <div class="gr-title-group">
        <div class="gr-logo">🧑‍🏫</div>
        <div>
          <h1 class="gr-title">Grammar & Style Reviewer</h1>
          <div class="gr-subtitle">
            <button class="gr-note-link-btn" onclick="handleOpenNote()" title="Click to open this note in Amplenote (↗)">
              <span>📝</span>
              <strong>${escapeHtml(session?.noteTitle || "No Note Selected")}</strong>
              <span style="font-size: 11px; opacity: 0.75;">↗</span>
            </button>
            ${session?.noteTags && session.noteTags.length > 0 ? `
              <div style="display: inline-flex; gap: 4px; align-items: center; flex-wrap: wrap;">
                ${session.noteTags.map(t => `<span class="gr-tag-pill">#${escapeHtml(String(t).replace(/^#/, ''))}</span>`).join("")}
              </div>
            ` : ""}
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
        <!-- Open Note Button -->
        <button class="gr-btn btn-secondary" onclick="handleOpenNote()" title="Open and view note in Amplenote (↗)" ${!session ? "disabled" : ""}>
          <span>↗</span>
          <span class="gr-hide-mobile">Open Note</span>
        </button>

        <!-- 1-Click Smooth Theme Cycler -->
        <button class="gr-theme-btn" id="theme-cycler-btn" onclick="cycleTheme()" title="Click to cycle themes (or press T)">
          <span id="theme-icon">🌌</span>
          <span id="theme-name">Midnight Slate</span>
        </button>

        <!-- Instant Client-Side Nav Tabs -->
        <div class="gr-nav-tabs">
          <button id="tab-btn-review" class="gr-tab-btn ${activeTab === "review" ? "active" : ""}" onclick="switchTab('review')">Reviewer</button>
          <button id="tab-btn-history" class="gr-tab-btn ${activeTab === "history" ? "active" : ""}" onclick="switchTab('history')">History Logs (${historyRecords.length})</button>
          <button id="tab-btn-settings" class="gr-tab-btn ${activeTab === "settings" ? "active" : ""}" onclick="switchTab('settings')">⚙️ Settings</button>
        </div>
      </div>
    </header>



    <!-- Tab 1: Review Workspace -->
    <div id="tab-view-review" class="gr-tab-view ${activeTab === "review" ? "active" : ""}">
      ${renderReviewWorkspace(session, config, metrics, currentItem)}
    </div>

    <!-- Tab 2: History Workspace -->
    <div id="tab-view-history" class="gr-tab-view ${activeTab === "history" ? "active" : ""}">
      ${renderHistoryWorkspace(historyRecords)}
    </div>

    <!-- Tab 3: Settings Workspace -->
    <div id="tab-view-settings" class="gr-tab-view ${activeTab === "settings" ? "active" : ""}">
      ${renderSettingsWorkspace(config, usageStats)}
    </div>

  </div>

  <script>
    const THEMES = ${safeJsonEmbed(THEMES)};
    const MODEL_CATALOG = ${safeJsonEmbed(MODEL_CATALOG)};
    const PROVIDER_DOCS = ${safeJsonEmbed(PROVIDER_DOCS)};
    const RE_REVIEW_REASONS = ${safeJsonEmbed(RE_REVIEW_REASONS)};
    const STORAGE_KEY = "ANP_GRAMMAR_REVIEWER_SESSION_STATE";
    const THEME_STORAGE_KEY = "ANP_GRAMMAR_REVIEWER_ACTIVE_THEME";
    const TAB_STORAGE_KEY = "ANP_GRAMMAR_REVIEWER_ACTIVE_TAB";
    let serverSession = ${serializedSession};

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

    // Top Operation Loader state management
    function setTopLoading(isLoading, label = "AI is reviewing your note...", subtext = "") {
      const loader = document.getElementById("top-loader");
      const banner = document.getElementById("op-banner");
      const bannerText = document.getElementById("op-banner-text");
      const bannerSubtext = document.getElementById("op-banner-subtext");

      if (loader) loader.classList.toggle("active", isLoading);
      if (banner) banner.classList.toggle("active", isLoading);
      if (bannerText && label) bannerText.innerText = label;
      if (bannerSubtext) {
        bannerSubtext.innerText = subtext || (isLoading ? "Polishing prose & generating insights..." : "");
        bannerSubtext.style.display = bannerSubtext.innerText ? "block" : "none";
      }
    }

    function cancelActiveOperation() {
      const bannerText = document.getElementById("op-banner-text");
      const bannerSubtext = document.getElementById("op-banner-subtext");
      if (bannerText) bannerText.innerText = "Stopping review...";
      if (bannerSubtext) bannerSubtext.innerText = "Halting AI requests...";
      setTopLoading(false);
      sendAction("cancelReviewAll");
    }

    // ==========================================
    // Universal Sandboxed-Safe In-DOM Modal System
    // (Bypasses iframe sandboxing where window.prompt is ignored)
    // ==========================================
    let activeModalCallback = null;

    function toggleModalEnlarge() {
      const modalBox = document.getElementById("gr-modal-box");
      const btn = document.getElementById("gr-modal-btn-enlarge");
      if (!modalBox) return;
      const isEnlarged = modalBox.classList.toggle("enlarged");
      if (btn) {
        btn.innerHTML = isEnlarged ? "🗗" : "⛶";
        btn.title = isEnlarged ? "Restore original size" : "Enlarge window to full screen";
      }
    }

    function closeAppModal() {
      const backdrop = document.getElementById("gr-modal-backdrop");
      const modalBox = document.getElementById("gr-modal-box");
      const btn = document.getElementById("gr-modal-btn-enlarge");
      if (backdrop) backdrop.style.display = "none";
      if (modalBox) {
        modalBox.classList.remove("enlarged");
        modalBox.classList.remove("gr-modal-large");
      }
      if (btn) {
        btn.innerHTML = "⛶";
        btn.title = "Enlarge window / Restore";
      }
      activeModalCallback = null;
    }

    function showAppPrompt({ title = "Input", message = "", defaultValue = "", isTextarea = false, isLarge = false, allowEnlarge = true, placeholder = "", onConfirm }) {
      const backdrop = document.getElementById("gr-modal-backdrop");
      const modalBox = document.getElementById("gr-modal-box");
      const titleElem = document.getElementById("gr-modal-title");
      const msgElem = document.getElementById("gr-modal-message");
      const inputContainer = document.getElementById("gr-modal-input-container");
      const confirmBtn = document.getElementById("gr-modal-btn-confirm");
      const enlargeBtn = document.getElementById("gr-modal-btn-enlarge");

      if (!backdrop || !inputContainer) return;

      if (modalBox) {
        modalBox.classList.toggle("gr-modal-large", !!isLarge || !!isTextarea);
      }

      if (enlargeBtn) {
        enlargeBtn.style.display = (allowEnlarge || isTextarea) ? "inline-flex" : "none";
      }

      titleElem.innerText = title;
      msgElem.innerText = message;
      msgElem.style.display = message ? "block" : "none";

      const inputId = "gr-modal-active-input";
      if (isTextarea) {
        inputContainer.innerHTML = '<textarea id="' + inputId + '" class="gr-modal-textarea" placeholder="' + (placeholder || '') + '">' + (defaultValue || '') + '</textarea>';
      } else {
        inputContainer.innerHTML = '<input type="text" id="' + inputId + '" class="gr-modal-input" placeholder="' + (placeholder || '') + '" value="' + (defaultValue || '') + '">';
      }

      confirmBtn.className = "gr-btn btn-primary";
      confirmBtn.innerText = "Confirm";

      activeModalCallback = () => {
        const val = document.getElementById(inputId)?.value;
        closeAppModal();
        if (typeof onConfirm === "function") onConfirm(val);
      };

      confirmBtn.onclick = activeModalCallback;
      backdrop.style.display = "flex";

      setTimeout(() => {
        const el = document.getElementById(inputId);
        if (el) { el.focus(); if (el.select) el.select(); }
      }, 50);
    }

    function showAppConfirm({ title = "Confirm", message = "", confirmLabel = "Confirm", isDanger = false, onConfirm }) {
      const backdrop = document.getElementById("gr-modal-backdrop");
      const titleElem = document.getElementById("gr-modal-title");
      const msgElem = document.getElementById("gr-modal-message");
      const inputContainer = document.getElementById("gr-modal-input-container");
      const confirmBtn = document.getElementById("gr-modal-btn-confirm");

      if (!backdrop) return;

      titleElem.innerText = title;
      msgElem.innerHTML = message;
      msgElem.style.display = "block";
      if (inputContainer) inputContainer.innerHTML = "";

      confirmBtn.className = isDanger ? "gr-btn btn-danger" : "gr-btn btn-primary";
      confirmBtn.innerText = confirmLabel;

      activeModalCallback = () => {
        closeAppModal();
        if (typeof onConfirm === "function") onConfirm();
      };

      confirmBtn.onclick = activeModalCallback;
      backdrop.style.display = "flex";
    }

    function showAppChoice({ title = "Select Option", message = "", options = [], defaultSelected = "", onConfirm }) {
      const backdrop = document.getElementById("gr-modal-backdrop");
      const titleElem = document.getElementById("gr-modal-title");
      const msgElem = document.getElementById("gr-modal-message");
      const inputContainer = document.getElementById("gr-modal-input-container");
      const confirmBtn = document.getElementById("gr-modal-btn-confirm");

      if (!backdrop || !inputContainer) return;

      titleElem.innerText = title;
      msgElem.innerText = message;
      msgElem.style.display = message ? "block" : "none";

      const selectedVal = defaultSelected || (options[0] && options[0].id) || "";

      const optionsHtml = options.map((opt, i) => {
        const isSel = opt.id === selectedVal || (!selectedVal && i === 0);
        return '<label class="gr-modal-radio-item ' + (isSel ? 'selected' : '') + '" data-opt-id="' + opt.id + '" onclick="selectModalRadioOption(this.dataset.optId)">' +
          '<input type="radio" name="modal_choice" value="' + opt.id + '" ' + (isSel ? 'checked' : '') + ' style="margin-top: 3px;">' +
          '<div>' +
            '<div style="font-weight: 600; font-size: 12.5px; color: var(--text-primary);">' + (opt.label || opt.name) + '</div>' +
            (opt.desc ? '<div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">' + opt.desc + '</div>' : '') +
          '</div>' +
        '</label>';
      }).join("");

      inputContainer.innerHTML = '<div class="gr-modal-radio-list">' + optionsHtml + '</div>' +
        '<div id="modal-custom-subinput-area" style="margin-top: 8px; display: none;">' +
          '<input type="text" id="modal-custom-subinput" class="gr-modal-input" placeholder="Enter custom prompt guidance...">' +
        '</div>';


      confirmBtn.className = "gr-btn btn-primary";
      confirmBtn.innerText = "Select & Apply";

      activeModalCallback = () => {
        const checkedRadio = document.querySelector('input[name="modal_choice"]:checked');
        const choiceId = checkedRadio ? checkedRadio.value : selectedVal;
        const customSub = document.getElementById("modal-custom-subinput")?.value || "";
        closeAppModal();
        if (typeof onConfirm === "function") onConfirm(choiceId, customSub);
      };

      confirmBtn.onclick = activeModalCallback;
      backdrop.style.display = "flex";
    }

    function selectModalRadioOption(val) {
      document.querySelectorAll(".gr-modal-radio-item").forEach(el => {
        const input = el.querySelector("input");
        if (input) {
          const isMatch = input.value === val;
          input.checked = isMatch;
          el.classList.toggle("selected", isMatch);
        }
      });
      const subArea = document.getElementById("modal-custom-subinput-area");
      if (subArea) {
        subArea.style.display = val === "custom" ? "block" : "none";
        if (val === "custom") {
          document.getElementById("modal-custom-subinput")?.focus();
        }
      }
    }

    // Fast In-DOM Left Sidebar Handlers (Zero Screen Flash)
    function handleQuickProviderChange(provider) {
      const modelSelect = document.getElementById("quick-model-select");
      if (modelSelect && MODEL_CATALOG[provider]) {
        const catalog = MODEL_CATALOG[provider] || [];
        const savedModel = (ALL_SAVED_MODELS && ALL_SAVED_MODELS[provider]) || (catalog[0] && catalog[0].value) || "";
        modelSelect.innerHTML = catalog.map(m => {
          return '<option value="' + m.value + '" ' + (m.value === savedModel ? 'selected' : '') + '>' + m.label + '</option>';
        }).join("");
      }
      sendAction("setProvider", provider);
    }

    function handleQuickModelChange(model) {
      const provider = document.getElementById("quick-provider-select")?.value;
      if (provider && ALL_SAVED_MODELS) {
        ALL_SAVED_MODELS[provider] = model;
      }
      sendAction("setModel", model);
    }

    function handleGranularityChange(mode) {
      const activeBtn = document.querySelector(".gr-segment-btn.active");
      const currentMode = activeBtn?.id?.replace("granularity-btn-", "") || "";
      if (currentMode === mode) return;

      const hasDecidedWork = serverSession && serverSession.items && serverSession.items.some(i => i.status === "accepted" || i.status === "modified" || i.status === "rejected");
      if (hasDecidedWork) {
        const accepted = serverSession.items.filter(i => i.status === "accepted").length;
        const rejected = serverSession.items.filter(i => i.status === "rejected").length;
        const modified = serverSession.items.filter(i => i.status === "modified").length;
        showAppConfirm({
          title: "Change Review Granularity?",
          message: "Changing granularity will rebuild review chunks and reset progress.<br><br>Current progress:<br>• " + accepted + " accepted<br>• " + rejected + " rejected<br>• " + modified + " edited<br><br>Proceed and start new review?",
          confirmLabel: "Start New Review",
          isDanger: true,
          onConfirm: () => {
            document.querySelectorAll(".gr-segmented-control .gr-segment-btn").forEach(btn => {
              btn.classList.toggle("active", btn.id === "granularity-btn-" + mode);
            });
            sendAction("setGranularity", mode);
          }
        });
        return;
      }

      document.querySelectorAll(".gr-segmented-control .gr-segment-btn").forEach(btn => {
        btn.classList.toggle("active", btn.id === "granularity-btn-" + mode);
      });

      sendAction("setGranularity", mode);
    }

    const PRESET_DESCRIPTIONS = {
      "grammar_spelling": "Corrects grammatical errors, typos, spelling, and subject-verb agreement while preserving your exact phrasing.",
      "minimal_changes": "Only fixes objective spelling and grammar errors. Keeps your unique phrasing, cadence, and structure intact.",
      "teacher_editor": "Provides educational commentary, highlights specific clarity improvements, and explains why each change elevates the writing.",
      "concise": "Trims bloat, redundant phrases, and wordy constructions while preserving core meaning.",
      "passive_voice": "Converts passive constructions to clear, vigorous active voice.",
      "adverbs": "Removes unnecessary filler adverbs (very, really, definitely) to strengthen verbs.",
      "flow_readability": "Enhances transitions, sentence rhythm, and syntactic variety for smooth reading.",
      "professional": "Polishes language for business emails, executive summaries, and stakeholder memos.",
      "academic": "Refines prose for formal research papers, essays, and critical analysis.",
      "humorous": "Injects subtle wit, clever metaphors, and lively expressions without derailing context."
    };

    function handlePresetSelectChange(val) {
      const descBadge = document.getElementById("preset-description-badge");
      const customActions = document.getElementById("custom-prompt-actions");

      if (val === "__custom__") {
        openCustomPromptModal();
        return;
      }

      if (serverSession) {
        serverSession.promptPresetId = val;
        serverSession.customPrompt = "";
      }

      if (descBadge) {
        const desc = PRESET_DESCRIPTIONS[val] || "Refines grammar and prose.";
        descBadge.innerHTML = '💡 ' + desc;
      }
      if (customActions) {
        customActions.style.display = "none";
      }

      sendAction("setPreset", val);
    }

    function handleClearCustomPrompt() {
      const select = document.getElementById("preset-style-select");
      const descBadge = document.getElementById("preset-description-badge");
      const customActions = document.getElementById("custom-prompt-actions");

      if (serverSession) {
        serverSession.promptPresetId = "grammar_spelling";
        serverSession.customPrompt = "";
      }

      if (select) select.value = "grammar_spelling";
      if (descBadge) {
        descBadge.innerHTML = '💡 ' + (PRESET_DESCRIPTIONS["grammar_spelling"] || "Refines grammar and prose.");
      }
      if (customActions) {
        customActions.style.display = "none";
      }

      sendAction("clearCustomPrompt");
    }

    // Modal-driven custom prompt editor
    function openCustomPromptModal() {
      const cur = serverSession?.customPrompt || "";
      showAppPrompt({
        title: "Custom AI Prompt / Instruction",
        message: "Provide specific guidance for how the AI should edit or polish your text (click ⛶ to expand full-screen):",
        defaultValue: cur,
        isTextarea: true,
        isLarge: true,
        allowEnlarge: true,
        placeholder: "e.g. Make concise, preserve bullet points, use active voice, sound friendly...",
        onConfirm: (customText) => {
          const trimmed = (customText || "").trim();
          if (trimmed.length > 0) {
            const select = document.getElementById("preset-style-select");
            const descBadge = document.getElementById("preset-description-badge");
            const customActions = document.getElementById("custom-prompt-actions");

            if (serverSession) {
              serverSession.customPrompt = trimmed;
            }
            if (select) select.value = "__custom__";
            if (descBadge) {
              descBadge.innerHTML = '🎯 <em>Custom:</em> "' + trimmed.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') + '"';
            }
            if (customActions) {
              customActions.style.display = "flex";
            }
            sendAction("setCustomPrompt", trimmed);
          } else {
            handleClearCustomPrompt();
          }
        }
      });
    }

    // Re-Review with in-DOM reason picker modal
    function openReReviewDialog(index) {
      const presetSelect = document.getElementById("preset-style-select");
      let activePresetLabel = "Active Prompt Style";
      if (presetSelect && presetSelect.selectedOptions && presetSelect.selectedOptions[0]) {
        activePresetLabel = presetSelect.selectedOptions[0].text;
      } else if (serverSession?.customPrompt) {
        activePresetLabel = "Custom Prompt";
      }

      const dialogOptions = [
        { id: "active_preset", label: "Apply Current Prompt Style (" + activePresetLabel + ")", prompt: "" },
        ...RE_REVIEW_REASONS
      ];

      showAppChoice({
        title: "Re-Review Item #" + (index + 1),
        message: "Select guidance for re-reviewing this section:",
        options: dialogOptions,
        defaultSelected: "active_preset",
        onConfirm: (choiceId, customSub) => {
          let instruction = "";
          if (choiceId === "custom" && customSub && customSub.trim().length > 0) {
            instruction = customSub.trim();
          } else if (choiceId !== "active_preset") {
            const selected = RE_REVIEW_REASONS.find(r => r.id === choiceId);
            if (selected) instruction = selected.prompt;
          }
          setTopLoading(true, "Re-reviewing Item #" + (index + 1) + "...");
          sendAction("reReviewItem", index, instruction);
        }
      });
    }

    const DIFF_VIEW_STORAGE_KEY = "ANP_GRAMMAR_DIFF_VIEW_MODE";
    let activeDiffMode = localStorage.getItem(DIFF_VIEW_STORAGE_KEY) || "clean";

    // 4 Diff View Modes (Clean Prose, Inline Diff, Side-by-Side, Changes Only)
    function setDiffViewMode(index, mode) {
      if (mode) {
        activeDiffMode = mode;
        try {
          localStorage.setItem(DIFF_VIEW_STORAGE_KEY, mode);
        } catch (e) {}
      } else {
        mode = activeDiffMode;
      }

      const panesWrapper = document.getElementById("panes-wrapper-" + index);
      const changesView = document.getElementById("changes-only-view-" + index);
      const originalPaneWrapper = document.getElementById("original-pane-wrapper-" + index);
      const suggestionPaneWrapper = document.getElementById("suggestion-pane-wrapper-" + index);
      const suggestionPane = document.getElementById("suggestion-pane-" + index);
      const suggestionLabel = document.getElementById("suggestion-pane-label-" + index);

      ["clean", "inline", "side", "changes"].forEach(m => {
        const btn = document.getElementById("btn-view-" + m + "-" + index);
        if (btn) btn.classList.toggle("active", m === mode);
      });

      if (mode === "changes") {
        if (panesWrapper) panesWrapper.style.display = "none";
        if (changesView) changesView.style.display = "block";
        return;
      }

      if (changesView) changesView.style.display = "none";
      if (!suggestionPane || !panesWrapper) return;

      const cleanHtml = decodeURIComponent(suggestionPane.getAttribute("data-clean") || "");
      const inlineHtml = decodeURIComponent(suggestionPane.getAttribute("data-inline") || "");
      const sideHtml = decodeURIComponent(suggestionPane.getAttribute("data-side") || "");

      if (mode === "clean") {
        // Mode 1: Clean Prose (100% full width, pure finalized prose)
        panesWrapper.style.display = "grid";
        panesWrapper.style.gridTemplateColumns = "1fr";
        if (originalPaneWrapper) originalPaneWrapper.style.display = "none";
        if (suggestionPaneWrapper) suggestionPaneWrapper.style.display = "flex";
        suggestionPane.innerHTML = cleanHtml;
        if (suggestionLabel) suggestionLabel.innerText = "✨ Clean Polished Prose (Final)";
      } else if (mode === "inline") {
        // Mode 2: Inline Diff (100% full width, unified track changes with <del> and <ins>)
        panesWrapper.style.display = "grid";
        panesWrapper.style.gridTemplateColumns = "1fr";
        if (originalPaneWrapper) originalPaneWrapper.style.display = "none";
        if (suggestionPaneWrapper) suggestionPaneWrapper.style.display = "flex";
        suggestionPane.innerHTML = inlineHtml;
        if (suggestionLabel) suggestionLabel.innerText = "🔀 Unified Inline Diff (Track Changes)";
      } else if (mode === "side") {
        // Mode 3: Side-by-Side (Dual-pane comparison: Original vs AI Suggestion)
        panesWrapper.style.display = "grid";
        panesWrapper.style.gridTemplateColumns = "1fr 1fr";
        if (originalPaneWrapper) originalPaneWrapper.style.display = "flex";
        if (suggestionPaneWrapper) suggestionPaneWrapper.style.display = "flex";
        suggestionPane.innerHTML = sideHtml;
        if (suggestionLabel) suggestionLabel.innerText = "✨ AI Suggestion (Highlighted)";
      }
    }

    // Audit Report Notes Setting (Off by default)
    const AUDIT_STORAGE_KEY = "ANP_GRAMMAR_CREATE_AUDIT_NOTES";

    function isAuditNotesEnabled() {
      try {
        return localStorage.getItem(AUDIT_STORAGE_KEY) === "true";
      } catch (e) {
        return false;
      }
    }

    function toggleAuditNotesSetting(checked) {
      try {
        localStorage.setItem(AUDIT_STORAGE_KEY, checked ? "true" : "false");
      } catch (e) {}
      syncAuditCheckboxes(checked);
    }

    function syncAuditCheckboxes(val) {
      const enabled = val !== undefined ? val : isAuditNotesEnabled();
      const historyToggle = document.getElementById("history-audit-toggle");
      const settingsToggle = document.getElementById("settings-audit-toggle");
      if (historyToggle) historyToggle.checked = enabled;
      if (settingsToggle) settingsToggle.checked = enabled;
    }

    async function handleSaveButtonClick() {
      setTopLoading(true, "Saving changes to note...", "Updating note content in Amplenote");
      const res = await sendAction("saveAndCommit", isAuditNotesEnabled());
      setTopLoading(false);
      if (res && res.success) {
        showAppConfirm({
          title: "Changes Saved Successfully!",
          message: "All accepted and modified prose rewrites have been saved to <strong>" + (serverSession?.noteTitle || "your note") + "</strong>.<br><br>Would you like to open and view the note in Amplenote now?",
          confirmLabel: "Open Note in Amplenote ↗",
          onConfirm: () => {
            handleOpenNote();
          }
        });
      } else if (res && res.cancelled) {
        showAppConfirm({
          title: "Save Cancelled",
          message: "The note was modified externally. Save was cancelled to prevent accidental overwrites.",
          confirmLabel: "OK"
        });
      }
    }

    function handleOpenNote() {
      if (serverSession && serverSession.noteUUID) {
        sendAction("openNote", serverSession.noteUUID);
      }
    }

    // Initialize audit checkbox state
    syncAuditCheckboxes();


    // Keyboard Shortcuts (A Accept, R Reject, U Undo, N/P Nav, T Theme)
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
      } else if (e.key === "u" || e.key === "U" || (e.ctrlKey && e.key === "z")) {
        const activeCard = document.querySelector(".gr-diff-card.active");
        if (activeCard) {
          const idx = parseInt(activeCard.getAttribute("data-index"), 10);
          if (!isNaN(idx)) sendAction("undoItem", idx);
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
      if (action === "runReview" || action === "reviewAll") {
        setTopLoading(true, action === "reviewAll" ? "Sequential AI Review of all pending chunks in progress..." : "AI Review in progress...");
      }

      if (typeof window.callAmplenotePlugin === "function") {
        try {
          const res = await window.callAmplenotePlugin(action, ...args);
          setTopLoading(false);
          if (res && res.workspaceHtml) {
            const reviewContainer = document.getElementById("tab-view-review");
            if (reviewContainer) {
              const mainCanvas = document.getElementById("main-canvas-container");
              const progressContainer = document.getElementById("sidebar-progress-container");
              const reviewBtnContainer = document.getElementById("sidebar-review-btn-container");
              const curGranularity = document.getElementById("granularity-segmented-control");

              const temp = document.createElement("div");
              temp.innerHTML = res.workspaceHtml;
              const newCanvas = temp.querySelector("#main-canvas-container");
              const newProgress = temp.querySelector("#sidebar-progress-container");
              const newReviewBtn = temp.querySelector("#sidebar-review-btn-container");
              const newGranularity = temp.querySelector("#granularity-segmented-control");

              if (mainCanvas && newCanvas) {
                mainCanvas.innerHTML = newCanvas.innerHTML;
                if (progressContainer && newProgress) {
                  progressContainer.innerHTML = newProgress.innerHTML;
                }
                if (reviewBtnContainer && newReviewBtn) {
                  reviewBtnContainer.innerHTML = newReviewBtn.innerHTML;
                }
                if (curGranularity && newGranularity) {
                  curGranularity.innerHTML = newGranularity.innerHTML;
                }
              } else {
                reviewContainer.innerHTML = res.workspaceHtml;
              }
              initScrollSync();
              syncAuditCheckboxes();
            }
          }
          if (res && res.session) {
            serverSession = res.session;
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(res.session));
            } catch (e) {}
          }
          return res;
        } catch (err) {
          setTopLoading(false);
          console.error("[GrammarReviewer] callAmplenotePlugin failed:", err);
        }
      }
    }

    function confirmResetSession() {
      showAppConfirm({
        title: "Reset Review Session?",
        message: "Are you sure you want to reset the current review session and clear in-progress changes? This will restore the original note baseline.",
        confirmLabel: "Yes, Reset",
        isDanger: true,
        onConfirm: () => {
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch (e) {}
          sendAction("clearSession");
        }
      });
    }

    function promptManualEdit(index) {
      const currentText = document.getElementById("suggestion-pane-" + index)?.innerText || "";
      showAppPrompt({
        title: "Manual Edit (Item #" + (index + 1) + ")",
        message: "Directly edit the rewritten text (click ⛶ to expand full-screen):",
        defaultValue: currentText,
        isTextarea: true,
        isLarge: true,
        allowEnlarge: true,
        onConfirm: (edited) => {
          if (edited !== null && edited !== undefined) {
            sendAction("manualEditItem", index, edited);
          }
        }
      });
    }

    // Synchronized Scrolling for Dual-Pane Diff View
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

    // Initialize Scroll Sync
    initScrollSync();

    const ALL_SAVED_KEYS = ${safeJsonEmbed(config.allKeys || {})};
    const ALL_SAVED_MODELS = ${safeJsonEmbed(config.allModels || {})};


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

      showAppConfirm({
        title: "Clear Saved API Key?",
        message: "Delete and clear the saved API key for " + currentProvider + "?",
        confirmLabel: "Delete Key",
        isDanger: true,
        onConfirm: () => {
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
          const slug = currentProvider?.toLowerCase().replace(/[^a-z0-9]/g, "-");
          const dot = document.getElementById("provider-dot-" + slug);
          if (dot) {
            dot.className = "gr-provider-dot dot-missing";
            dot.title = "No API key configured";
          }
          const valBadge = document.getElementById("provider-val-badge-" + slug);
          if (valBadge) valBadge.style.display = "none";
          const banner = document.getElementById("api-test-status-banner");
          if (banner) banner.style.display = "none";
        }
      });
    }

    function escapeHtml(str) {
      if (str === null || str === undefined) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    let activeTestAbortController = null;

    function cancelActiveProviderTest() {
      if (activeTestAbortController) {
        activeTestAbortController.abort();
        activeTestAbortController = null;
      }
      const banner = document.getElementById("api-test-status-banner");
      if (banner) {
        banner.style.display = "flex";
        banner.style.background = "var(--bg-card)";
        banner.style.border = "1px solid var(--border-color)";
        banner.style.color = "var(--text-secondary)";
        banner.innerHTML = '<span>🛑</span><span>API Test was cancelled.</span>';
      }
      const testBtn = document.getElementById("test-api-btn");
      const testOllamaBtn = document.getElementById("test-ollama-btn");
      if (testBtn) {
        testBtn.disabled = false;
        testBtn.innerHTML = '<span>⚡</span><span>Test API</span>';
      }
      if (testOllamaBtn) {
        testOllamaBtn.disabled = false;
        testOllamaBtn.innerHTML = '<span>⚡</span><span>Test Ollama</span>';
      }
    }

    function onApiKeyInput() {
      const providerInput = document.getElementById("settings-provider");
      const keyInput = document.getElementById("settings-api-key");
      const curProv = providerInput?.value || DEFAULT_PROVIDER;
      const curKey = keyInput?.value || "";
      ALL_SAVED_KEYS[curProv] = curKey;

      const slug = curProv.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const dot = document.getElementById("provider-dot-" + slug);
      if (dot) {
        if (curKey.trim().length > 0) {
          dot.className = "gr-provider-dot dot-configured";
          dot.title = "API Key is configured";
        } else {
          dot.className = "gr-provider-dot dot-missing";
          dot.title = "No API key configured";
        }
      }
      const banner = document.getElementById("api-test-status-banner");
      if (banner) banner.style.display = "none";
    }

    async function testActiveProviderConnection() {
      const provider = document.getElementById("settings-provider")?.value || DEFAULT_PROVIDER;
      const apiKey = document.getElementById("settings-api-key")?.value || "";
      const modelSelect = document.getElementById("settings-model-select")?.value;
      const customInput = document.getElementById("settings-model")?.value;
      const baseUrl = document.getElementById("settings-base-url")?.value || "";

      let model = "";
      if (modelSelect === "__custom__") {
        model = (customInput || "").trim();
      } else if (modelSelect) {
        model = modelSelect.trim();
      }

      const testBtn = document.getElementById("test-api-btn");
      const testOllamaBtn = document.getElementById("test-ollama-btn");
      const banner = document.getElementById("api-test-status-banner");
      const slug = provider.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const valBadge = document.getElementById("provider-val-badge-" + slug);
      const dot = document.getElementById("provider-dot-" + slug);

      if (testBtn) {
        testBtn.disabled = true;
        testBtn.innerHTML = '<span>⏳</span><span>Testing...</span>';
      }
      if (testOllamaBtn) {
        testOllamaBtn.disabled = true;
        testOllamaBtn.innerHTML = '<span>⏳</span><span>Testing...</span>';
      }
      if (banner) {
        banner.style.display = "flex";
        banner.style.background = "var(--bg-card)";
        banner.style.border = "1px solid var(--border-color)";
        banner.style.color = "var(--text-primary)";
        banner.innerHTML = '<div style="display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 10px;">' +
          '<div style="display: flex; align-items: center; gap: 8px;"><span>⏳</span><span>Testing connection to <strong>' + escapeHtml(provider) + '</strong> (max 30s)...</span></div>' +
          '<button type="button" class="gr-btn btn-danger" style="padding: 4px 10px; font-size: 11px; white-space: nowrap;" onclick="cancelActiveProviderTest()">🛑 Cancel</button>' +
          '</div>';
      }

      activeTestAbortController = new AbortController();
      const signal = activeTestAbortController.signal;

      const timeoutPromise = new Promise((_, reject) => {
        const timer = setTimeout(() => {
          reject(new Error("Connection timed out after 30 seconds. Please check your network or API endpoint."));
        }, 30000);
        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new Error("Test was cancelled by user."));
        });
      });

      try {
        const res = await Promise.race([
          sendAction("testProviderConnection", {
            provider,
            apiKey,
            model,
            baseUrl
          }),
          timeoutPromise
        ]);

        if (res && res.ok) {
          if (banner) {
            banner.style.display = "flex";
            banner.style.background = "rgba(16, 185, 129, 0.12)";
            banner.style.border = "1px solid rgba(16, 185, 129, 0.35)";
            banner.style.color = "var(--accent-success)";
            banner.innerHTML = '<span>✅</span><span><strong>Connection Verified!</strong> Response received in <strong>' + res.latencyMs + 'ms</strong> via <code>' + escapeHtml(res.model || "default") + '</code>.</span>';
          }
          if (valBadge) {
            valBadge.style.display = "inline-flex";
            valBadge.innerText = "⚡ Validated (" + res.latencyMs + "ms)";
          }
          if (dot) {
            dot.className = "gr-provider-dot dot-configured";
            dot.title = "API Key is configured & verified (" + res.latencyMs + "ms)";
          }
        } else {
          const errMsg = res?.error || "Unknown connection error";
          if (banner) {
            banner.style.display = "flex";
            banner.style.background = "rgba(239, 68, 68, 0.12)";
            banner.style.border = "1px solid rgba(239, 68, 68, 0.35)";
            banner.style.color = "var(--accent-danger)";
            banner.innerHTML = '<span>❌</span><span><strong>Connection Failed:</strong> ' + escapeHtml(errMsg) + '</span>';
          }
          if (valBadge) {
            valBadge.style.display = "none";
          }
        }
      } catch (err) {
        if (banner) {
          banner.style.display = "flex";
          const isCancel = err?.message?.includes("cancelled");
          banner.style.background = isCancel ? "var(--bg-card)" : "rgba(239, 68, 68, 0.12)";
          banner.style.border = isCancel ? "1px solid var(--border-color)" : "1px solid rgba(239, 68, 68, 0.35)";
          banner.style.color = isCancel ? "var(--text-secondary)" : "var(--accent-danger)";
          banner.innerHTML = '<span>' + (isCancel ? '🛑' : '❌') + '</span><span><strong>' + (isCancel ? 'Test Cancelled' : 'Connection Error') + ':</strong> ' + escapeHtml(err?.message || String(err)) + '</span>';
        }
      } finally {
        activeTestAbortController = null;
        if (testBtn) {
          testBtn.disabled = false;
          testBtn.innerHTML = '<span>⚡</span><span>Test API</span>';
        }
        if (testOllamaBtn) {
          testOllamaBtn.disabled = false;
          testOllamaBtn.innerHTML = '<span>⚡</span><span>Test Ollama</span>';
        }
      }
    }

    // Instant Settings Provider Selection
    function selectProviderCard(providerKey) {
      const banner = document.getElementById("api-test-status-banner");
      if (banner) banner.style.display = "none";
      const providerInput = document.getElementById("settings-provider");
      if (providerInput) providerInput.value = providerKey;

      const titleElem = document.getElementById("settings-provider-title");
      if (titleElem) titleElem.innerText = providerKey;

      document.querySelectorAll(".gr-provider-card").forEach(card => {
        card.classList.toggle("active", card.getAttribute("data-key") === providerKey);
      });

      const isOllama = providerKey.includes("Ollama");
      const apiKeyGroup = document.getElementById("settings-api-key-group");
      const baseUrlGroup = document.getElementById("settings-base-url-group");

      if (apiKeyGroup) apiKeyGroup.style.display = isOllama ? "none" : "flex";
      if (baseUrlGroup) baseUrlGroup.style.display = isOllama ? "flex" : "none";

      const keyLabel = document.getElementById("settings-api-key-label");
      const keyLink = document.getElementById("settings-doc-link");
      if (keyLabel) keyLabel.innerText = providerKey + " API Key";
      if (keyLink && PROVIDER_DOCS[providerKey]) keyLink.href = PROVIDER_DOCS[providerKey];

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

    function handleResetUsage(mode) {
      const isToday = mode === "today";
      showAppConfirm({
        title: isToday ? "Reset Today's AI Usage?" : "Reset All AI Usage Statistics?",
        message: isToday 
          ? "Are you sure you want to reset today's request counters to 0 across all providers?"
          : "Are you sure you want to completely erase ALL lifetime and daily AI usage statistics?",
        confirmLabel: isToday ? "Reset Today" : "Reset All",
        isDanger: !isToday,
        onConfirm: () => {
          sendAction("resetUsage", mode);
        }
      });
    }
  </script>
</body>
</html>
  `;
}

export function renderReviewWorkspace(session, config, metrics, currentItem) {
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

      <main class="gr-main-canvas" id="main-canvas-container">
        ${renderDiffCard(currentItem, session.currentIndex, session.items.length, session)}

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; flex-wrap: wrap; gap: 10px;">
          <div style="font-size: 12px; color: var(--text-secondary);">
            💡 <strong>Shortcuts:</strong> <code>A</code> Accept · <code>R</code> Reject · <code>U</code> Undo · <code>N/P</code> Nav · <code>T</code> Theme
          </div>
          <button class="gr-btn btn-save" onclick="handleSaveButtonClick()">
            💾 Save & Commit Rewrites to Note
          </button>
        </div>
      </main>
    </div>
  `;
}

function renderHistoryWorkspace(historyRecords) {
  const legendHtml = `
    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px 18px; margin-bottom: 14px; display: flex; gap: 12px; align-items: flex-start;">
      <div style="font-size: 24px; line-height: 1;">💡</div>
      <div style="flex: 1;">
        <div style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 3px;">Amplenote Native Version History & Note Archiving</div>
        <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 8px;">
          Amplenote automatically records save points for every note every 10 minutes. You can view or restore previous versions anytime by opening any note, clicking the <strong><code>...</code> (Note Options)</strong> menu in the top right corner, and selecting <strong><code>View revision history</code></strong>.
        </p>
        <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-primary); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); flex-wrap: wrap; gap: 8px;">
          <label style="font-size: 12px; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="history-audit-toggle" onchange="toggleAuditNotesSetting(this.checked)">
            <span>Generate extra audit report notes (<code>-reports/-grammar/*</code>) on save</span>
          </label>
          <span style="font-size: 11px; color: var(--accent-success); font-weight: 700;">(Turned OFF by default)</span>
        </div>
      </div>
    </div>
  `;

  if (!historyRecords || historyRecords.length === 0) {
    return `
      ${legendHtml}
      <div class="gr-empty-state">
        <div style="font-size: 48px; margin-bottom: 12px;">📜</div>
        <h2 style="color: var(--text-primary); font-size: 16px; font-weight: 700;">No Past Review History Found</h2>
        <p style="margin-top: 6px; font-size: 13px; color: var(--text-secondary); max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.5;">
          When audit logging is enabled, iteration snapshots and logs are archived with tag <code>-reports/-grammar/-history</code>.
        </p>
        <div style="margin-top: 18px; display: flex; gap: 10px; justify-content: center;">
          <button class="gr-btn btn-secondary" onclick="sendAction('refreshHistory')">
            🔄 Refresh History
          </button>
          <button class="gr-btn btn-primary" onclick="switchTab('review')">
            ⚡ Back to Reviewer
          </button>
        </div>
      </div>
    `;
  }

  const rows = historyRecords.map(rec => {
    const cleanDate = (rec.isoDate || "").replace(/[*_#]/g, "").trim();
    const dateStr = cleanDate ? cleanDate.replace("T", " ").substring(0, 16) : String(rec.timestamp);
    const cleanTitle = (rec.sourceNote?.title || "Untitled Note").replace(/[*_#]/g, "").trim();
    const changesCount = rec.session?.metrics?.accepted || 0;
    return `
      <tr>
        <td><strong>${dateStr}</strong></td>
        <td>${escapeHtml(cleanTitle)}</td>
        <td><span class="gr-diff-badge badge-accepted">${rec.session?.provider || "AI"} (${rec.session?.granularity || "mode"})</span></td>
        <td>${changesCount} changes applied</td>
        <td>
          <button class="gr-btn btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="sendAction('openNote', '${rec.sourceNote?.uuid || ""}')">Open Note</button>
        </td>
      </tr>
    `;
  }).join("");

  return `
    ${legendHtml}
    <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 16px; border: 1px solid var(--border-color); box-shadow: var(--card-shadow); overflow-x: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h2 style="font-size: 15px; color: var(--text-primary); margin: 0;">Past Grammar Review Iterations</h2>
        <button class="gr-btn btn-secondary" style="padding: 4px 10px; font-size: 11.5px;" onclick="sendAction('refreshHistory')">
          🔄 Refresh History
        </button>
      </div>
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

function renderSettingsWorkspace(config, usageStats = null) {
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

  const cardsHtml = providersInfo.map(p => {
    const isSelected = p.key === activeProvider;
    const badgeClass = p.isFree ? "gr-badge-free" : "gr-badge-paid";
    const hasKey = p.key === PROVIDERS.OLLAMA ? true : Boolean(config.allKeys?.[p.key] && config.allKeys[p.key].trim().length > 0);
    const pSlug = p.key.toLowerCase().replace(/[^a-z0-9]/g, "-");
    return `
      <div class="gr-provider-card ${isSelected ? "active" : ""}" data-key="${escapeHtml(p.key)}" onclick="selectProviderCard('${escapeHtml(p.key)}')">
        <div class="gr-provider-card-header">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="gr-provider-title">${escapeHtml(p.title)}</span>
            <span id="provider-dot-${pSlug}" class="gr-provider-dot ${hasKey ? "dot-configured" : "dot-missing"}" title="${hasKey ? "API Key is configured" : "No API key configured"}"></span>
          </div>
          <div style="display: flex; align-items: center; gap: 4px;">
            <span id="provider-val-badge-${pSlug}" class="gr-badge-validated" style="display: none;">⚡ Validated</span>
            <span class="${badgeClass}">${escapeHtml(p.badge)}</span>
          </div>
        </div>
        <p style="font-size: 11.5px; color: var(--text-secondary); line-height: 1.35;">${escapeHtml(p.desc)}</p>
      </div>
    `;
  }).join("");

  const activeSavedModel = config.allModels?.[activeProvider] || "";
  const isCustomModelActive = catalog.length > 0 && !catalog.some(m => m.value === activeSavedModel) && Boolean(activeSavedModel);

  const modelOptionsHtml = catalog.map(m => {
    const isSelected = m.value === activeSavedModel;
    return `<option value="${escapeHtml(m.value)}" ${isSelected ? "selected" : ""}>${escapeHtml(m.label)}</option>`;
  }).join("") + `<option value="__custom__" ${isCustomModelActive ? "selected" : ""}>⚙️ Custom Model Override...</option>`;

  // Calculate usage stats metrics
  const todaySuccess = usageStats?.today?.success || 0;
  const todayFailed = usageStats?.today?.failed || 0;
  const todayTotal = todaySuccess + todayFailed;

  const lifeSuccess = usageStats?.lifetime?.success || 0;
  const lifeFailed = usageStats?.lifetime?.failed || 0;
  const lifeTotal = lifeSuccess + lifeFailed;

  const currentDate = usageStats?.date || new Date().toISOString().slice(0, 10);

  const PROVIDER_LIMIT_LABELS = {
    [PROVIDERS.OPENROUTER]: "50 req/day (Free tier)",
    [PROVIDERS.GROQ]: "1,000 req/day (Free tier)",
    [PROVIDERS.GEMINI]: "Dynamic / AI Studio",
    [PROVIDERS.MISTRAL]: "Dynamic / Free tier",
    [PROVIDERS.OLLAMA]: "Unlimited / Local or Cloud",
    [PROVIDERS.DEEPSEEK]: "Pay-as-you-go",
    [PROVIDERS.OPENAI]: "Pay-as-you-go",
    [PROVIDERS.ANTHROPIC]: "Pay-as-you-go"
  };

  const providerRows = Object.values(PROVIDERS).map(p => {
    const pUsage = usageStats?.providers?.[p] || { today: { success: 0, failed: 0 }, lifetime: { success: 0, failed: 0 } };
    const pTodaySuccess = pUsage.today?.success || 0;
    const pTodayFailed = pUsage.today?.failed || 0;
    const pTodayTotal = pTodaySuccess + pTodayFailed;

    const pLifeSuccess = pUsage.lifetime?.success || 0;
    const pLifeFailed = pUsage.lifetime?.failed || 0;
    const pLifeTotal = pLifeSuccess + pLifeFailed;

    const limitLabel = PROVIDER_LIMIT_LABELS[p] || "Dynamic";
    const isCurrentActive = p === activeProvider;

    return `
      <tr style="border-bottom: 1px solid var(--border-color); ${isCurrentActive ? "background: rgba(59, 130, 246, 0.08);" : ""}">
        <td style="padding: 7px 10px; font-weight: ${isCurrentActive ? "600" : "400"}; color: ${isCurrentActive ? "var(--accent-primary)" : "var(--text-primary)"};">
          ${escapeHtml(p)} ${isCurrentActive ? '<span style="font-size: 10px; font-weight: 700; opacity: 0.85;">(ACTIVE)</span>' : ""}
        </td>
        <td style="padding: 7px 10px; color: var(--text-secondary);">${escapeHtml(limitLabel)}</td>
        <td style="padding: 7px 10px;">
          <strong>${pTodayTotal}</strong> 
          <span style="color: var(--accent-success); font-size: 11px;">(${pTodaySuccess} ok</span>${pTodayFailed > 0 ? `<span style="color: var(--accent-danger); font-size: 11px;">, ${pTodayFailed} err</span>` : ""}<span style="color: var(--accent-success); font-size: 11px;">)</span>
        </td>
        <td style="padding: 7px 10px;">
          <strong>${pLifeTotal}</strong> 
          <span style="color: var(--accent-success); font-size: 11px;">(${pLifeSuccess} ok</span>${pLifeFailed > 0 ? `<span style="color: var(--accent-danger); font-size: 11px;">, ${pLifeFailed} err</span>` : ""}<span style="color: var(--accent-success); font-size: 11px;">)</span>
        </td>
      </tr>
    `;
  }).join("");

  return `
    <div style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
      
      <!-- AI Usage Statistics & Provider Breakdown (Top Section) -->
      <div>
        <h2 style="font-size: 15px; margin-bottom: 10px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
          <span>📊</span>
          <span>AI Usage Statistics & Provider Quotas</span>
        </h2>
        <details id="settings-usage-collapsible" style="background: var(--bg-card); border-radius: var(--radius-sm); border: 1px solid var(--border-color); overflow: hidden;">
          <summary style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;">
            <span style="display: flex; align-items: center; gap: 8px;">
              <span>📈</span>
              <span>Daily & Lifetime Telemetry Breakdown</span>
            </span>
            <span style="font-size: 11px; font-weight: 500; color: var(--text-secondary); background: var(--bg-surface); padding: 2px 8px; border-radius: 12px; border: 1px solid var(--border-color);">
              Today: ${todayTotal} reqs (${todaySuccess} ok / ${todayFailed} err)
            </span>
          </summary>

          <div style="padding: 14px; border-top: 1px solid var(--border-color); font-size: 12px; display: flex; flex-direction: column; gap: 14px;">
            
            <!-- Overview Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
              <div style="background: var(--bg-surface); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <div style="font-size: 10.5px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Today's Requests</div>
                <div style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin-top: 2px;">${todayTotal}</div>
                <div style="font-size: 11px; color: var(--accent-success); margin-top: 2px;">${todaySuccess} ok${todayFailed > 0 ? `<span style="color: var(--accent-danger);">, ${todayFailed} err</span>` : ""}</div>
              </div>

              <div style="background: var(--bg-surface); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <div style="font-size: 10.5px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Lifetime Requests</div>
                <div style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin-top: 2px;">${lifeTotal}</div>
                <div style="font-size: 11px; color: var(--accent-success); margin-top: 2px;">${lifeSuccess} ok${lifeFailed > 0 ? `<span style="color: var(--accent-danger);">, ${lifeFailed} err</span>` : ""}</div>
              </div>

              <div style="background: var(--bg-surface); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <div style="font-size: 10.5px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Tracking Date</div>
                <div style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-top: 4px;">${escapeHtml(currentDate)}</div>
                <div style="font-size: 10.5px; color: var(--text-secondary); margin-top: 2px;">Daily count resets at 00:00</div>
              </div>
            </div>

            <!-- Provider Table -->
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; text-align: left;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-secondary);">
                    <th style="padding: 6px 10px;">Provider</th>
                    <th style="padding: 6px 10px;">Known Limit Reference</th>
                    <th style="padding: 6px 10px;">Today (Total & Ok)</th>
                    <th style="padding: 6px 10px;">Lifetime (Total & Ok)</th>
                  </tr>
                </thead>
                <tbody>
                  ${providerRows}
                </tbody>
              </table>
            </div>

            <!-- Explanatory note -->
            <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.45; background: rgba(0,0,0,0.12); padding: 8px 10px; border-radius: 4px;">
              💡 <strong>Free Quota Info:</strong> OpenRouter provides ~50 free requests/day; Groq provides up to 1,000 req/day. Gemini and Mistral limits vary dynamically by model & tier. Usage is stored safely in your Amplenote plugin settings.
            </div>

            <!-- Reset Actions -->
            <div style="display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap;">
              <button type="button" class="gr-btn btn-secondary" style="padding: 6px 12px; font-size: 11.5px;" onclick="handleResetUsage('today')" title="Reset today's request counters to zero">
                🔄 Reset Today's Stats
              </button>
              <button type="button" class="gr-btn btn-danger" style="padding: 6px 12px; font-size: 11.5px;" onclick="handleResetUsage('all')" title="Reset all lifetime and daily usage statistics">
                🗑️ Reset All Statistics
              </button>
            </div>

          </div>
        </details>
      </div>

      <!-- Providers Grid -->
      <div>
        <h2 style="font-size: 15px; margin-bottom: 10px; color: var(--text-primary);">Select AI Provider</h2>
        <div class="gr-settings-grid">
          ${cardsHtml}
        </div>
      </div>

      <!-- Config Form -->
      <div class="gr-settings-form">
        <input type="hidden" id="settings-provider" value="${escapeHtml(activeProvider)}">

        <div class="gr-form-group" id="settings-api-key-group" style="display: ${activeProvider.includes("Ollama") ? "none" : "flex"}; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <label class="gr-form-label" id="settings-api-key-label" for="settings-api-key">${escapeHtml(activeProvider)} API Key</label>
            <a id="settings-doc-link" href="${docUrl}" target="_blank" style="font-size: 12px; color: var(--accent-primary); text-decoration: none; font-weight: 600;">Get API Key ↗</a>
          </div>

          <div id="key-preview-banner" style="font-size: 12px; padding: 8px 12px; background: var(--bg-card); border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; width: 100%;">
            ${currentKey && currentKey.trim().length > 0 ? `
              <div><span style="color: var(--accent-success); font-weight: 600;">🔒 Saved Key:</span> <code style="background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">••••••••••••••••${escapeHtml(currentKey.slice(-4))}</code></div>
            ` : `
              <span style="color: var(--accent-warning); font-weight: 500;">⚠️ No key saved — enter key below</span>
            `}
          </div>

          <div style="display: flex; gap: 8px; align-items: center; width: 100%;">
            <input type="password" id="settings-api-key" class="gr-input" style="flex: 1; min-width: 0; padding: 8px 12px;" placeholder="Paste new or updated API Key" value="${escapeHtml(currentKey)}" oninput="onApiKeyInput()">
            <button type="button" id="toggle-key-btn" class="gr-btn btn-secondary" style="padding: 8px 14px; font-size: 12px; white-space: nowrap;" onclick="toggleApiKeyVisibility()">
              👁️ Show
            </button>
            <button type="button" id="test-api-btn" class="gr-btn btn-secondary" style="padding: 8px 14px; font-size: 12px; white-space: nowrap; display: flex; align-items: center; gap: 4px;" onclick="testActiveProviderConnection()" title="Test API key validity and ping latency">
              <span>⚡</span>
              <span>Test API</span>
            </button>
            <button type="button" class="gr-btn btn-danger" style="padding: 8px 14px; font-size: 12px; white-space: nowrap;" title="Clear and delete saved key" onclick="clearActiveApiKey()">
              🗑️ Clear
            </button>
          </div>
          <span class="gr-form-help">Keys are securely stored in your Amplenote plugin settings.</span>
          <div id="api-test-status-banner" style="display: none; font-size: 12px; padding: 10px 12px; border-radius: var(--radius-sm); align-items: center; gap: 8px; line-height: 1.45;"></div>
        </div>

        <div id="settings-base-url-group" class="gr-form-group" style="display: ${activeProvider.includes("Ollama") ? "flex" : "none"}; flex-direction: column; gap: 8px;">
          <label class="gr-form-label" for="settings-base-url">Local Ollama Base URL</label>
          <div style="display: flex; gap: 8px; align-items: center; width: 100%;">
            <input type="text" id="settings-base-url" class="gr-input" style="flex: 1; min-width: 0; padding: 8px 12px;" placeholder="http://localhost:11434/v1" value="${escapeHtml(config.customBaseUrl || "http://localhost:11434/v1")}">
            <button type="button" id="test-ollama-btn" class="gr-btn btn-secondary" style="padding: 8px 14px; font-size: 12px; white-space: nowrap; display: flex; align-items: center; gap: 4px;" onclick="testActiveProviderConnection()" title="Test Ollama connection and ping latency">
              <span>⚡</span>
              <span>Test Ollama</span>
            </button>
          </div>
          <span class="gr-form-help">Ensure Ollama is running with <code>OLLAMA_ORIGINS="*"</code> to allow web browser connection.</span>
        </div>

        <div class="gr-form-group">
          <label class="gr-form-label" for="settings-model-select">Active Model for Provider</label>
          <select id="settings-model-select" class="gr-select" style="width: 100%; padding: 8px 12px;" onchange="onModelSelectChange()">
            <option value="" ${!activeSavedModel ? "selected" : ""}>Default Recommended Model</option>
            ${modelOptionsHtml}
          </select>
        </div>

        <div id="custom-model-input-group" class="gr-form-group" style="display: ${isCustomModelActive ? "flex" : "none"}; flex-direction: column; gap: 8px;">
          <label class="gr-form-label" for="settings-model">Enter Custom Model ID</label>
          <input type="text" id="settings-model" class="gr-input" style="width: 100%; padding: 8px 12px;" placeholder="e.g. llama3.2:1b, mistral-nemo, gpt-4-turbo" value="${escapeHtml(activeSavedModel)}">
          <span class="gr-form-help">Type the exact model tag or endpoint ID you wish to use.</span>
        </div>

        <!-- Audit Reports Setting (Off by default) -->
        <div class="gr-form-group" style="margin-top: 6px; padding-top: 12px; border-top: 1px solid var(--border-color);">
          <label class="gr-form-label" style="display: flex; align-items: center; justify-content: space-between;">
            <span>Audit & Change Reports Creation</span>
            <span style="font-size: 10.5px; color: var(--accent-success); font-weight: 700;">OFF BY DEFAULT</span>
          </label>
          <div style="background: var(--bg-card); padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <label style="font-size: 12px; color: var(--text-primary); font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="settings-audit-toggle" onchange="toggleAuditNotesSetting(this.checked)">
              <span>Generate extra change reports and history notes (<code>-reports/-grammar/*</code>) on save</span>
            </label>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px; line-height: 1.45;">
              Amplenote natively preserves version history automatically via <strong>Note Options > View revision history</strong>. Keep this unchecked to prevent extra notes from cluttering your notes list.
            </div>
          </div>
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

