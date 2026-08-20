import { escapeHtml } from "../engine/diffEngine.js";

/**
 * Renders the elevated dual-pane diff card component with side-by-side clean prose diffing
 * and multi-mode view toggling (Clean Prose vs Inline Diff).
 * 
 * @param {object} item - Session item
 * @param {number} index - Item index
 * @param {number} total - Total items count
 * @returns {string} HTML string
 */
export function renderDiffCard(item, index, total) {
  if (!item) {
    return `<div class="gr-empty-state">No item selected.</div>`;
  }

  const badgeClass = `badge-${item.status || "pending"}`;
  const statusLabel = (item.status || "pending").toUpperCase();

  // Left pane: Original text with deletions highlighted
  const leftPaneHtml = item.diff?.originalHtml || escapeHtml(item.original);

  // Right pane: Clean suggested text with insertions highlighted
  const suggestedCleanHtml = item.diff?.suggestedHtml || escapeHtml(item.suggestion || item.original);
  const inlineDiffHtml = item.diff?.inlineHtml || suggestedCleanHtml;
  const rawPlainHtml = escapeHtml(item.suggestion || item.original);

  const origWords = (item.original || "").trim().split(/\s+/).filter(Boolean).length;
  const suggWords = (item.suggestion || item.original || "").trim().split(/\s+/).filter(Boolean).length;

  return `
  <div class="gr-diff-card active" data-index="${index}">
    <div class="gr-diff-header">
      <div style="display: flex; align-items: center; gap: 8px;">
        <strong style="color: var(--text-primary); font-size: 13.5px;">Item #${index + 1} of ${total}</strong>
        <span style="color: var(--text-secondary); font-size: 12px; text-transform: capitalize;">(${item.type})</span>
        <span style="color: var(--text-muted); font-size: 11px; display: inline-flex; align-items: center; gap: 4px;" title="Bidirectional scroll synchronization active">
          🔗 Sync Scroll
        </span>
      </div>
      <span class="gr-diff-badge ${badgeClass}">${statusLabel}</span>
    </div>

    <div class="gr-diff-body">
      <!-- Left Pane: Original Draft -->
      <div class="gr-pane">
        <div class="gr-pane-title">
          <span>📄 Original Draft</span>
          <span style="font-weight: 500; font-size: 10.5px; font-family: var(--font-mono); color: var(--text-muted);">${origWords} words</span>
        </div>
        <div class="gr-pane-content" id="original-pane-${index}">${leftPaneHtml}</div>
      </div>

      <!-- Right Pane: AI Suggestion with View Switcher -->
      <div class="gr-pane">
        <div class="gr-pane-title">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>✨ AI Suggestion</span>
            <div class="gr-diff-view-switcher">
              <button class="gr-view-toggle-btn active" id="btn-view-clean-${index}" onclick="setDiffViewMode(${index}, 'clean')">Clean Prose</button>
              <button class="gr-view-toggle-btn" id="btn-view-inline-${index}" onclick="setDiffViewMode(${index}, 'inline')">Inline Diff</button>
            </div>
          </div>
          <span style="font-weight: 500; font-size: 10.5px; font-family: var(--font-mono); color: var(--text-muted);">${suggWords} words</span>
        </div>
        
        <!-- Pre-encoded diff content payloads for 0ms client-side mode switching -->
        <div class="gr-pane-content" id="suggestion-pane-${index}" 
             data-clean="${escapeDataAttr(suggestedCleanHtml)}"
             data-inline="${escapeDataAttr(inlineDiffHtml)}"
             data-plain="${escapeDataAttr(rawPlainHtml)}">${suggestedCleanHtml}</div>
      </div>
    </div>

    <div class="gr-actions-footer">
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <button class="gr-btn btn-success" onclick="sendAction('acceptItem', ${index})">
          ✓ Accept <kbd style="margin-left: 4px; background: rgba(0,0,0,0.2); border: none; color: #fff;">A</kbd>
        </button>
        <button class="gr-btn btn-danger" onclick="sendAction('rejectItem', ${index})">
          ✗ Reject <kbd style="margin-left: 4px; background: rgba(0,0,0,0.2); border: none; color: inherit;">R</kbd>
        </button>
        <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">
          ✏️ Edit
        </button>
        <button class="gr-btn btn-secondary" onclick="sendAction('reReviewItem', ${index})">
          🔄 Re-Review
        </button>
      </div>

      <div style="display: flex; gap: 8px; align-items: center;">
        <button class="gr-btn btn-secondary" onclick="sendAction('prevItem')" ${index === 0 ? "disabled style='opacity: 0.5; cursor: not-allowed;'" : ""}>
          ← Previous
        </button>
        <button class="gr-btn btn-secondary" onclick="sendAction('nextItem')" ${index >= total - 1 ? "disabled style='opacity: 0.5; cursor: not-allowed;'" : ""}>
          Next →
        </button>
      </div>
    </div>
  </div>
  `;
}

function escapeDataAttr(htmlStr) {
  if (!htmlStr) return "";
  return encodeURIComponent(htmlStr);
}
