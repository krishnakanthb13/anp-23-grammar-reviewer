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

  const matchedPreset = PREBUILT_PROMPTS.find(p => p.id === currentPreset) || PREBUILT_PROMPTS[0];
  const currentPresetDesc = matchedPreset ? matchedPreset.description : "Refines grammar and prose.";

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
          <select id="quick-provider-select" class="gr-select" style="width: 100%;" onchange="handleQuickProviderChange(this.value)">
            ${providerOptionsHtml}
          </select>
        </div>

        <div>
          <span class="gr-form-sublabel">Active Model</span>
          <select id="quick-model-select" class="gr-select" style="width: 100%;" onchange="handleQuickModelChange(this.value)">
            ${modelOptionsHtml}
          </select>
        </div>
      </div>

      <div class="gr-sidebar-btn-row">
        <button class="gr-btn btn-primary" title="Review active chunk" onclick="sendAction('runReview')">
          ${reviewBtnLabel}
        </button>
        <button class="gr-btn btn-secondary" title="Review all pending chunks sequentially" onclick="sendAction('reviewAll')">
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
        <button id="granularity-btn-full" class="gr-segment-btn ${currentGranularity === "full" ? "active" : ""}" onclick="handleGranularityChange('full')">Full Note</button>
        <button id="granularity-btn-paragraph" class="gr-segment-btn ${currentGranularity === "paragraph" ? "active" : ""}" onclick="handleGranularityChange('paragraph')">Paragraph</button>
        <button id="granularity-btn-sentence" class="gr-segment-btn ${currentGranularity === "sentence" ? "active" : ""}" onclick="handleGranularityChange('sentence')">Sentence</button>
      </div>
    </div>

    <!-- Section 3: Prompt Style Presets (Ergonomic Dropdown) -->
    <div class="gr-sidebar-section">
      <div class="gr-sidebar-header">
        <span class="gr-section-title">PROMPT STYLE</span>
        <button class="gr-btn-link" onclick="openCustomPromptModal()">+ Custom</button>
      </div>

      <select id="preset-style-select" class="gr-select" style="width: 100%; font-weight: 500;" onchange="handlePresetSelectChange(this.value)">
        <optgroup label="Correction & Polish">
          <option value="grammar_spelling" ${currentPreset === "grammar_spelling" && !session?.customPrompt ? "selected" : ""}>Fix Grammar & Spelling</option>
          <option value="minimal_changes" ${currentPreset === "minimal_changes" && !session?.customPrompt ? "selected" : ""}>Minimal Changes (Preserve Voice)</option>
          <option value="teacher_editor" ${currentPreset === "teacher_editor" && !session?.customPrompt ? "selected" : ""}>Teacher & Coach (Clarity & Flow)</option>
        </optgroup>
        <optgroup label="Conciseness & Style">
          <option value="concise" ${currentPreset === "concise" && !session?.customPrompt ? "selected" : ""}>Shorten & Make Concise</option>
          <option value="passive_voice" ${currentPreset === "passive_voice" && !session?.customPrompt ? "selected" : ""}>Remove Passive Voice</option>
          <option value="adverbs" ${currentPreset === "adverbs" && !session?.customPrompt ? "selected" : ""}>Omit Unnecessary Adverbs</option>
          <option value="flow_readability" ${currentPreset === "flow_readability" && !session?.customPrompt ? "selected" : ""}>Improve Flow & Rhythm</option>
        </optgroup>
        <optgroup label="Tone & Voice">
          <option value="professional" ${currentPreset === "professional" && !session?.customPrompt ? "selected" : ""}>Professional & Business Tone</option>
          <option value="academic" ${currentPreset === "academic" && !session?.customPrompt ? "selected" : ""}>Academic & Analytical Tone</option>
          <option value="humorous" ${currentPreset === "humorous" && !session?.customPrompt ? "selected" : ""}>Add Subtle Humor & Wit</option>
        </optgroup>
        <optgroup label="Custom Guidance">
          <option value="__custom__" ${session?.customPrompt ? "selected" : ""}>✨ Custom Prompt Override...</option>
        </optgroup>
      </select>

      <div id="preset-description-badge" style="font-size: 11px; color: var(--text-secondary); line-height: 1.4; padding: 6px 10px; background: var(--bg-primary); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
        ${session?.customPrompt ? `🎯 <em>Custom:</em> "${escapeHtml(session.customPrompt)}"` : `💡 ${escapeHtml(currentPresetDesc)}`}
      </div>

      <div id="custom-prompt-actions" style="display: ${session?.customPrompt ? 'flex' : 'none'}; gap: 8px; justify-content: flex-end;">
        <button class="gr-btn-link" style="font-size: 11px;" onclick="openCustomPromptModal()">✏️ Edit Prompt</button>
        <button class="gr-btn-link" style="color: var(--accent-danger); font-size: 11px;" onclick="handleClearCustomPrompt()">✕ Clear Custom</button>
      </div>
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
    case "suggestion_ready":
      return "🔄 Re-Review";
    case "accepted":
      return "✓ Re-Review";
    case "rejected":
      return "✕ Re-Review";
    case "modified":
      return "✎ Re-Review";
    case "reviewing":
      return "⚡ Reviewing...";
    default:
      return "⚡ Review Item";
  }
}
