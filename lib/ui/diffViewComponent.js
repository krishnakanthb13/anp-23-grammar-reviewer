import { escapeHtml } from "../engine/diffEngine.js";

/**
 * Renders the diff card component for an individual item.
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
  const diffHtml = item.diff?.inlineHtml || escapeHtml(item.suggestion || item.original);

  return `
  <div class="gr-diff-card active" data-index="${index}">
    <div class="gr-diff-header">
      <div>
        <strong style="color: var(--text-primary);">Item #${index + 1} of ${total}</strong>
        <span style="color: var(--text-secondary); margin-left: 8px; font-size: 12px;">(${item.type})</span>
        <span style="color: var(--text-muted); font-size: 11px; margin-left: 6px;" title="Scrolling one side automatically scrolls the other">🔗 Sync Scroll</span>
      </div>
      <span class="gr-diff-badge ${badgeClass}">${statusLabel}</span>
    </div>

    <div class="gr-diff-body">
      <div class="gr-pane">
        <div class="gr-pane-title">Original Text</div>
        <div class="gr-pane-content" id="original-pane-${index}">${escapeHtml(item.original)}</div>
      </div>

      <div class="gr-pane">
        <div class="gr-pane-title">AI Suggestion (Diff View)</div>
        <div class="gr-pane-content" id="suggestion-pane-${index}">
          ${diffHtml}
        </div>
      </div>
    </div>

    <div class="gr-actions-footer">
      <div style="display: flex; gap: 8px;">
        <button class="gr-btn btn-success" onclick="sendAction('acceptItem', ${index})">✓ Accept</button>
        <button class="gr-btn btn-danger" onclick="sendAction('rejectItem', ${index})">✗ Reject</button>
        <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">✏️ Edit</button>
        <button class="gr-btn btn-secondary" onclick="sendAction('reReviewItem', ${index})">🔄 Re-Review</button>
      </div>

      <div style="display: flex; gap: 8px;">
        <button class="gr-btn btn-secondary" onclick="sendAction('prevItem')" ${index === 0 ? "disabled" : ""}>← Previous</button>
        <button class="gr-btn btn-secondary" onclick="sendAction('nextItem')" ${index >= total - 1 ? "disabled" : ""}>Next →</button>
      </div>
    </div>
  </div>
  `;
}
