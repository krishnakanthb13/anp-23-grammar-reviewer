import { PREBUILT_PROMPTS, PROVIDERS, DEFAULT_MODELS, MODEL_CATALOG } from "../constants.js";
import { escapeHtml } from "../engine/diffEngine.js";

/**
 * Renders the elevated left sidebar control panel with refined typography and micro-interactions.
 * 
 * @param {object} session
 * @param {object} config
 * @param {object} metrics
 * @returns {string} HTML string
 */
export function renderSidebarPanel(session, config, metrics) {
  const currentProvider = session?.provider || config.provider || PROVIDERS.OPENROUTER;
  const currentModel = session?.model || config.customModel || DEFAULT_MODELS[currentProvider] || "";
  const currentGranularity = session?.granularity || "paragraph";
  const currentPreset = session?.promptPresetId || "grammar_spelling";

  const currentItem = session?.items?.[session.currentIndex];
  const currentStatus = currentItem?.status || "pending";

  // Filter only providers that have a saved API key, are local Ollama, or is the current active provider
  const savedProviders = Object.values(PROVIDERS).filter(p => {
    if (p === PROVIDERS.OLLAMA) return true;
    const key = config?.allKeys?.[p];
    return Boolean(key && key.trim().length > 0) || p === currentProvider;
  });

  const providerOptionsHtml = savedProviders.map(p => {
    return `<option value="${escapeHtml(p)}" ${p === currentProvider ? "selected" : ""}>🤖 ${escapeHtml(p)}</option>`;
  }).join("");

  const catalog = MODEL_CATALOG[currentProvider] || [];
  const isCustomModel = catalog.length > 0 && !catalog.some(m => m.value === currentModel) && Boolean(currentModel);

  const modelOptionsHtml = catalog.map(m => {
    return `<option value="${escapeHtml(m.value)}" ${m.value === currentModel ? "selected" : ""}>${escapeHtml(m.label)}</option>`;
  }).join("") + (isCustomModel ? `<option value="${escapeHtml(currentModel)}" selected>Custom: ${escapeHtml(currentModel)}</option>` : "");

  const presetButtons = PREBUILT_PROMPTS.map(preset => {
    const isActive = preset.id === currentPreset && !session?.customPrompt;
    return `
      <button class="gr-preset-item ${isActive ? "active" : ""}" 
              title="${preset.description}" 
              onclick="sendAction('setPreset', '${preset.id}')">
        ${preset.name}
      </button>
    `;
  }).join("");

  const pendingCount = metrics.pending ?? 0;
  const reviewBtnLabel = getSidebarReviewBtnText(currentStatus);

  return `
  <aside class="gr-sidebar">
    
    <!-- Section 1: AI Engine & Model Selector -->
    <div class="gr-sidebar-section">
      <div class="gr-sidebar-header">
        <span class="gr-section-title">AI ENGINE</span>
        <button class="gr-btn-link" onclick="switchTab('settings')">⚙️ Settings</button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 6px;">
        <div>
          <span class="gr-form-sublabel">Saved Provider</span>
          <select id="quick-provider-select" class="gr-select" style="width: 100%;" onchange="sendAction('setProvider', this.value)">
            ${providerOptionsHtml}
          </select>
        </div>

        <div>
          <span class="gr-form-sublabel">Active Model</span>
          <select id="quick-model-select" class="gr-select" style="width: 100%;" onchange="sendAction('setModel', this.value)">
            ${modelOptionsHtml}
          </select>
        </div>
      </div>

      <div class="gr-sidebar-btn-row" style="display: flex; gap: 8px; margin-top: 6px;">
        <button class="gr-btn btn-primary" style="flex: 1; justify-content: center;" onclick="sendAction('runReview')">
          ${reviewBtnLabel}
        </button>
        <button class="gr-btn btn-secondary" style="padding: 8px 12px; white-space: nowrap;" title="Review all pending chunks sequentially" onclick="sendAction('reviewAll')">
          ⚡ All Pending ${pendingCount > 0 ? `(${pendingCount})` : ""}
        </button>
      </div>
    </div>

    <!-- Section 2: Granularity Mode -->
    <div class="gr-sidebar-section">
      <div class="gr-sidebar-header">
        <span class="gr-section-title">GRANULARITY</span>
      </div>
      <div class="gr-segmented-control">
        <button class="gr-segment-btn ${currentGranularity === "full" ? "active" : ""}" onclick="sendAction('setGranularity', 'full')">Full Note</button>
        <button class="gr-segment-btn ${currentGranularity === "paragraph" ? "active" : ""}" onclick="sendAction('setGranularity', 'paragraph')">Paragraph</button>
        <button class="gr-segment-btn ${currentGranularity === "sentence" ? "active" : ""}" onclick="sendAction('setGranularity', 'sentence')">Sentence</button>
      </div>
    </div>

    <!-- Section 3: Prompt Style Presets -->
    <div class="gr-sidebar-section">
      <div class="gr-sidebar-header">
        <span class="gr-section-title">PROMPT STYLE</span>
        <button class="gr-btn-link" onclick="promptCustomInstruction()">+ Custom</button>
      </div>
      <div class="gr-preset-list">
        ${presetButtons}
      </div>
      ${session?.customPrompt ? `
        <div class="gr-custom-prompt-box">
          <div style="font-weight: 700; color: var(--text-primary);">Custom Prompt:</div>
          <div style="font-style: italic; margin: 3px 0 5px 0; line-height: 1.35;">"${escapeHtml(session.customPrompt)}"</div>
          <button class="gr-btn-link" style="color: var(--accent-danger);" onclick="sendAction('clearCustomPrompt')">✕ Clear custom</button>
        </div>
      ` : ""}
    </div>

    <!-- Section 4: Review Progress & Queue -->
    <div class="gr-sidebar-section">
      <div class="gr-sidebar-header" style="margin-bottom: 6px;">
        <span class="gr-section-title">PROGRESS</span>
        <span style="font-size: 12px; font-weight: 700; color: var(--text-primary); font-family: var(--font-mono);">
          ${metrics.reviewed} / ${metrics.total} (${metrics.percentComplete}%)
        </span>
      </div>
      <div class="gr-progress-track">
        <div class="gr-progress-fill" style="width: ${metrics.percentComplete}%;"></div>
      </div>
      <div class="gr-metrics-row" style="margin-top: 6px; display: flex; justify-content: space-between; font-size: 11px;">
        <span style="color: var(--accent-success); font-weight: 600;">✓ ${metrics.accepted} Accepted</span>
        <span style="color: var(--accent-warning); font-weight: 600;">○ ${pendingCount} Pending</span>
        <span style="color: var(--accent-danger); font-weight: 600;">✗ ${metrics.rejected} Rejected</span>
      </div>
    </div>

    <!-- Section 5: Keyboard Shortcuts Footer -->
    <div class="gr-sidebar-section" style="background: rgba(0, 0, 0, 0.18); padding: 10px 14px;">
      <div style="font-size: 11px; color: var(--text-secondary); display: flex; flex-wrap: wrap; gap: 8px 12px; justify-content: center; align-items: center;">
        <span><kbd>A</kbd> Accept</span>
        <span><kbd>R</kbd> Reject</span>
        <span><kbd>U</kbd> Undo</span>
        <span><kbd>N</kbd>/<kbd>P</kbd> Nav</span>
        <span><kbd>T</kbd> Theme</span>
      </div>
    </div>

  </aside>
  `;
}

function getSidebarReviewBtnText(status) {
  switch (status) {
    case "pending": return "⚡ Review Item";
    case "suggestion_ready": return "🔄 Re-Review Item";
    case "accepted": return "🔄 Re-Review";
    case "rejected": return "🔄 Re-Review";
    case "modified": return "🔄 Re-Review";
    default: return "⚡ Review Item";
  }
}

