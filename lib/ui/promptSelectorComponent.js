import { PREBUILT_PROMPTS, PROVIDERS, DEFAULT_MODELS, MODEL_CATALOG } from "../constants.js";
import { escapeHtml } from "../engine/diffEngine.js";

/**
 * Renders the sleek left sidebar control panel for the Reviewer workbench.
 * 
 * @param {object} session
 * @param {object} config
 * @param {object} metrics
 * @returns {string} HTML string
 */
export function renderSidebarPanel(session, config, metrics) {
  const currentProvider = session?.provider || config.provider || PROVIDERS.OPENROUTER;
  const currentModel = session?.model || config.customModel || DEFAULT_MODELS[currentProvider] || "";
  const currentGranularity = session?.granularity || "full";
  const currentPreset = session?.promptPresetId || "grammar_spelling";

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

  return `
  <aside class="gr-sidebar">
    
    <!-- Section 1: AI Engine & Model Selector (Only Saved Providers) -->
    <div class="gr-sidebar-section">
      <div class="gr-sidebar-header">
        <span class="gr-section-title">AI ENGINE</span>
        <button class="gr-btn-link" onclick="switchTab('settings')">⚙️ Settings</button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 6px;">
        <div>
          <label style="font-size: 10px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 2px; display: block;">Saved Provider</label>
          <select id="quick-provider-select" class="gr-select" style="width: 100%; font-size: 11px; padding: 6px 8px;" onchange="sendAction('setProvider', this.value)">
            ${providerOptionsHtml}
          </select>
        </div>

        <div>
          <label style="font-size: 10px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 2px; display: block;">Model</label>
          <select id="quick-model-select" class="gr-select" style="width: 100%; font-size: 11px; padding: 6px 8px;" onchange="sendAction('setModel', this.value)">
            ${modelOptionsHtml}
          </select>
        </div>
      </div>

      <div class="gr-sidebar-btn-row" style="margin-top: 4px;">
        <button class="gr-btn btn-primary" onclick="sendAction('runReview')">
          ⚡ Review Item
        </button>
        <button class="gr-btn btn-secondary" title="Review all pending chunks sequentially" onclick="sendAction('reviewAll')">
          ⚡ All
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
          <div style="font-weight: 700;">Custom Prompt:</div>
          <div style="font-style: italic; margin: 3px 0 5px 0; line-height: 1.35;">"${escapeHtml(session.customPrompt)}"</div>
          <button class="gr-btn-link" style="color: var(--accent-danger);" onclick="sendAction('clearCustomPrompt')">✕ Clear custom</button>
        </div>
      ` : ""}
    </div>

    <!-- Section 4: Review Progress -->
    <div class="gr-sidebar-section">
      <div class="gr-sidebar-header" style="margin-bottom: 6px;">
        <span class="gr-section-title">PROGRESS</span>
        <span style="font-size: 12px; font-weight: 700; color: var(--text-primary);">
          ${metrics.reviewed} / ${metrics.total} (${metrics.percentComplete}%)
        </span>
      </div>
      <div class="gr-progress-track">
        <div class="gr-progress-fill" style="width: ${metrics.percentComplete}%;"></div>
      </div>
      <div class="gr-metrics-row">
        <span style="color: var(--accent-success); font-weight: 600;">✓ Accepted: ${metrics.accepted}</span>
        <span style="color: var(--accent-danger); font-weight: 600;">✗ Rejected: ${metrics.rejected}</span>
      </div>
    </div>

    <!-- Section 5: Keyboard Shortcuts Footer -->
    <div class="gr-sidebar-section" style="background: rgba(0,0,0,0.15); padding: 8px 12px;">
      <div style="font-size: 11px; color: var(--text-secondary); display: flex; flex-wrap: wrap; gap: 6px 12px; justify-content: center;">
        <span><code>A</code> Accept</span>
        <span><code>R</code> Reject</span>
        <span><code>N</code>/<code>P</code> Nav</span>
        <span><code>T</code> Theme</span>
      </div>
    </div>

  </aside>
  `;
}
