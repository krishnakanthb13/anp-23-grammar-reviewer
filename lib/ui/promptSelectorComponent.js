import { PREBUILT_PROMPTS, PROVIDERS, MODEL_CATALOG, PROVIDER_DOCS } from "../constants.js";

/**
 * Renders the top toolbar with granularity switcher, prompt chips, and AI provider selector.
 * 
 * @param {object} session
 * @param {object} config
 * @returns {string} HTML string
 */
export function renderToolbar(session, config) {
  const currentProvider = session?.provider || config.provider || PROVIDERS.OPENROUTER;
  const currentGranularity = session?.granularity || "paragraph";
  const currentPreset = session?.promptPresetId || "grammar_spelling";
  const models = MODEL_CATALOG[currentProvider] || [];

  const providerOptions = Object.values(PROVIDERS).map(p => {
    return `<option value="${p}" ${p === currentProvider ? "selected" : ""}>${p}</option>`;
  }).join("");

  const modelOptions = models.map(m => {
    return `<option value="${m.value}" ${m.value === session?.model ? "selected" : ""}>${m.label}</option>`;
  }).join("");

  const promptChips = PREBUILT_PROMPTS.map(preset => {
    const isActive = preset.id === currentPreset && !session?.customPrompt;
    return `
      <button class="gr-chip ${isActive ? "active" : ""}" 
              title="${preset.description}" 
              onclick="sendAction('setPreset', '${preset.id}')">
        ${preset.name}
      </button>
    `;
  }).join("");

  return `
  <div class="gr-toolbar">
    <div class="gr-control-group">
      <span class="gr-label">Granularity:</span>
      <select class="gr-select" onchange="sendAction('setGranularity', this.value)">
        <option value="full" ${currentGranularity === "full" ? "selected" : ""}>Full Note</option>
        <option value="paragraph" ${currentGranularity === "paragraph" ? "selected" : ""}>Paragraph</option>
        <option value="sentence" ${currentGranularity === "sentence" ? "selected" : ""}>Sentence</option>
      </select>
    </div>

    <div class="gr-control-group">
      <span class="gr-label">AI Provider:</span>
      <select class="gr-select" onchange="sendAction('setProvider', this.value)">
        ${providerOptions}
      </select>

      <span class="gr-label" style="margin-left: 8px;">Model:</span>
      <select class="gr-select" onchange="sendAction('setModel', this.value)">
        ${modelOptions}
      </select>
    </div>

    <div class="gr-control-group">
      <button class="gr-btn btn-primary" onclick="sendAction('runReview')">⚡ Run Review</button>
      <button class="gr-btn btn-secondary" onclick="sendAction('reviewAll')">⚡ Review All</button>
      <button class="gr-btn btn-secondary" title="Configure API Keys & Providers" onclick="sendAction('setTab', 'settings')">⚙️</button>
    </div>
  </div>

  <div style="background: var(--bg-secondary); padding: 12px 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="gr-label">Prompt Style Presets:</span>
      <a href="#" style="font-size: 12px; color: #60a5fa; text-decoration: none;" onclick="promptCustomInstruction()">+ Custom Instruction</a>
    </div>
    <div class="gr-preset-chips">
      ${promptChips}
    </div>
    ${session?.customPrompt ? `
      <div style="margin-top: 8px; font-size: 12px; color: #93c5fd; background: rgba(59, 130, 246, 0.1); padding: 6px 10px; border-radius: 4px;">
        <strong>Active Custom Prompt:</strong> "${session.customPrompt}"
        <a href="#" style="color: #ef4444; margin-left: 8px; text-decoration: none;" onclick="sendAction('clearCustomPrompt')">✕ Clear</a>
      </div>
    ` : ""}
  </div>
  `;
}
