import { escapeHtml } from "../engine/diffEngine.js";

/**
 * Renders the state-aware review card with 4 diff view modes (Clean Prose, Inline Diff, Side-by-Side, Changes Only),
 * Teacher's Insights, Review Navigator jump selector, and reversible Undo controls.
 * 
 * @param {object} item - Session item
 * @param {number} index - Item index
 * @param {number} total - Total items count
 * @param {object} session - Entire session for navigator status map
 * @returns {string} HTML string
 */
export function renderDiffCard(item, index, total, session = null) {
  if (!item) {
    return `<div class="gr-empty-state">No item selected.</div>`;
  }

  const status = item.status || "pending";
  const badgeClass = `badge-${status}`;
  const statusLabel = getStatusDisplayLabel(status);

  // Diff HTML representations
  const leftPaneHtml = item.diff?.originalHtml || escapeHtml(item.original);
  const suggestedCleanHtml = item.diff?.suggestedHtml || escapeHtml(item.suggestion || item.original);
  const inlineDiffHtml = item.diff?.inlineHtml || suggestedCleanHtml;
  const changesOnlyHtml = item.diff?.changesHtml || `<div class="gr-no-changes-msg">No changes.</div>`;
  const rawPlainHtml = escapeHtml(item.suggestion || item.original);

  const origWords = (item.original || "").trim().split(/\s+/).filter(Boolean).length;
  const suggWords = (item.suggestion || item.original || "").trim().split(/\s+/).filter(Boolean).length;
  const changeCount = item.diff?.stats?.changeCount ?? 0;

  // Jump to item options for the Review Navigator
  const jumpOptionsHtml = (session?.items || []).map((it, idx) => {
    const isCur = idx === index;
    const itIcon = getItemStatusIcon(it.status);
    const snippet = (it.original || "").trim().substring(0, 32) || `Item #${idx + 1}`;
    return `<option value="${idx}" ${isCur ? "selected" : ""}>${itIcon} #${idx + 1}: ${escapeHtml(snippet)}...</option>`;
  }).join("");

  const prevPendingIdx = session ? session.getPrevPendingIndex(index) : -1;
  const nextPendingIdx = session ? session.getNextPendingIndex(index) : -1;
  const hasPendingItems = prevPendingIdx !== -1 || nextPendingIdx !== -1;

  const canUndo = session ? session.canUndo(index) : false;

  return `
  <div class="gr-diff-card active" data-index="${index}" data-status="${status}">
    
    <!-- Top Review Navigator Bar -->
    <div class="gr-diff-header">
      <div class="gr-nav-bar-group">
        <div style="display: flex; align-items: center; gap: 8px;">
          <strong style="color: var(--text-primary); font-size: 13.5px;">Item #${index + 1} of ${total}</strong>
          <span style="color: var(--text-secondary); font-size: 12px; text-transform: capitalize;">(${item.type})</span>
        </div>

        <!-- Jump to Item Selector -->
        <div class="gr-jump-selector-container">
          <label for="jump-item-select" class="gr-jump-label">Jump to:</label>
          <select id="jump-item-select" class="gr-jump-select" onchange="sendAction('jumpToItem', parseInt(this.value, 10))">
            ${jumpOptionsHtml}
          </select>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 8px;">
        ${item.diff?.hasChanges ? `<span class="gr-change-count-pill">${changeCount} change${changeCount === 1 ? "" : "s"}</span>` : ""}
        <span class="gr-diff-badge ${badgeClass}">${statusLabel}</span>
      </div>
    </div>

    <!-- Mode Switcher Tabs (Clean Prose, Inline Diff, Side-by-Side, Changes Only) -->
    <div class="gr-diff-mode-bar">
      <div class="gr-diff-view-switcher">
        <button class="gr-view-toggle-btn active" id="btn-view-clean-${index}" onclick="setDiffViewMode(${index}, 'clean')">✨ Clean Prose</button>
        <button class="gr-view-toggle-btn" id="btn-view-inline-${index}" onclick="setDiffViewMode(${index}, 'inline')">🔀 Inline Diff</button>
        <button class="gr-view-toggle-btn" id="btn-view-side-${index}" onclick="setDiffViewMode(${index}, 'side')">👥 Side-by-Side</button>
        <button class="gr-view-toggle-btn" id="btn-view-changes-${index}" onclick="setDiffViewMode(${index}, 'changes')">📋 Changes Only (${changeCount})</button>
      </div>

      <div style="font-size: 11.5px; color: var(--text-muted); font-family: var(--font-mono); display: flex; gap: 12px;">
        <span>Original: <strong>${origWords}</strong>w</span>
        <span>Suggested: <strong>${suggWords}</strong>w</span>
      </div>
    </div>

    <!-- Main Diff Workspace -->
    <div class="gr-diff-body" id="diff-body-${index}">
      
      <!-- Dual Pane Container for Clean, Inline, Side-by-Side -->
      <div class="gr-panes-wrapper" id="panes-wrapper-${index}" style="grid-template-columns: 1fr;">
        <!-- Left Pane: Original Draft (Hidden in single-pane Clean and Inline modes) -->
        <div class="gr-pane" id="original-pane-wrapper-${index}" style="display: none;">
          <div class="gr-pane-title">
            <span>📄 Original Draft</span>
            <span style="font-weight: 500; font-size: 10.5px; font-family: var(--font-mono); color: var(--text-muted);">${origWords} words</span>
          </div>
          <div class="gr-pane-content" id="original-pane-${index}">${leftPaneHtml}</div>
        </div>

        <!-- Right Pane: Clean Prose / AI Suggestion / Unified Inline -->
        <div class="gr-pane" id="suggestion-pane-wrapper-${index}">
          <div class="gr-pane-title">
            <span id="suggestion-pane-label-${index}">✨ Clean Polished Prose (Final)</span>
            <span style="font-weight: 500; font-size: 10.5px; font-family: var(--font-mono); color: var(--text-muted);">${suggWords} words</span>
          </div>
          
          <div class="gr-pane-content" id="suggestion-pane-${index}" 
               data-clean="${escapeDataAttr(rawPlainHtml)}"
               data-inline="${escapeDataAttr(inlineDiffHtml)}"
               data-side="${escapeDataAttr(suggestedCleanHtml)}"
               data-changes="${escapeDataAttr(changesOnlyHtml)}"
               data-plain="${escapeDataAttr(rawPlainHtml)}">${rawPlainHtml}</div>
        </div>
      </div>

      <!-- Changes Only Dedicated View (Initially Hidden) -->
      <div class="gr-changes-only-view" id="changes-only-view-${index}" style="display: none;">
        ${changesOnlyHtml}
      </div>

    </div>

    <!-- Teacher's Insight / Explanation Box (Visible when suggestions are available) -->
    ${renderTeacherInsightCard(item, changeCount)}

    <!-- State-Aware Actions Footer -->
    <div class="gr-actions-footer">
      <div class="gr-action-buttons-group">
        ${renderStateAwareActionButtons(item, index, canUndo)}
      </div>

      <!-- Navigation Step Controls with Pending Skip Helpers -->
      <div class="gr-nav-controls-group">
        ${hasPendingItems ? `
          <button class="gr-btn btn-secondary btn-sm" title="Jump to previous unreviewed item" onclick="sendAction('jumpToItem', ${prevPendingIdx})" ${prevPendingIdx === -1 ? "disabled style='opacity: 0.4; cursor: not-allowed;'" : ""}>
            ⏮ Prev Pending
          </button>
        ` : ""}
        
        <button class="gr-btn btn-secondary" onclick="sendAction('prevItem')" ${index === 0 ? "disabled style='opacity: 0.5; cursor: not-allowed;'" : ""}>
          ← Previous
        </button>
        <button class="gr-btn btn-secondary" onclick="sendAction('nextItem')" ${index >= total - 1 ? "disabled style='opacity: 0.5; cursor: not-allowed;'" : ""}>
          Next →
        </button>

        ${hasPendingItems ? `
          <button class="gr-btn btn-secondary btn-sm" title="Jump to next unreviewed item" onclick="sendAction('jumpToItem', ${nextPendingIdx})" ${nextPendingIdx === -1 ? "disabled style='opacity: 0.4; cursor: not-allowed;'" : ""}>
            Next Pending ⏭
          </button>
        ` : ""}
      </div>
    </div>

  </div>
  `;
}

/**
 * Returns user-friendly status badge label.
 * @param {string} status
 * @returns {string}
 */
function getStatusDisplayLabel(status) {
  switch (status) {
    case "accepted": return "✓ ACCEPTED";
    case "rejected": return "✗ REJECTED";
    case "modified": return "✎ EDITED";
    case "suggestion_ready": return "● SUGGESTION READY";
    case "reviewing": return "⏳ REVIEWING...";
    case "error": return "⚠️ ERROR";
    default: return "○ PENDING";
  }
}

/**
 * Returns unicode icon representing item state for Jump To selector.
 * @param {string} status
 * @returns {string}
 */
function getItemStatusIcon(status) {
  switch (status) {
    case "accepted": return "✓";
    case "rejected": return "✕";
    case "modified": return "✎";
    case "suggestion_ready": return "●";
    case "error": return "⚠";
    default: return "○";
  }
}

/**
 * Renders teacher insight / explanation card for the current review item.
 * @param {object} item
 * @param {number} changeCount
 * @returns {string}
 */
function renderTeacherInsightCard(item, changeCount) {
  if (!item.diff || !item.diff.hasChanges) {
    return "";
  }

  const category = item.category || "Grammar, Punctuation & Clarity";
  const confidence = item.confidence || "High";
  const explanation = item.explanation || `Elevated readability and flow across ${changeCount} phrase${changeCount === 1 ? "" : "s"} while maintaining the original tone.`;

  return `
    <div class="gr-teacher-insight-box">
      <div class="gr-teacher-header">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 15px;">🧑‍🏫</span>
          <strong style="color: var(--text-primary); font-size: 12.5px;">Teacher's Insight</strong>
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
          <span class="gr-category-badge">${escapeHtml(category)}</span>
          <span class="gr-confidence-badge">${escapeHtml(confidence)} Confidence</span>
        </div>
      </div>
      <div class="gr-teacher-body">
        ${escapeHtml(explanation)}
      </div>
    </div>
  `;
}

/**
 * Renders strictly state-aware action buttons based on item status.
 * @param {object} item
 * @param {number} index
 * @param {boolean} canUndo
 * @returns {string}
 */
function renderStateAwareActionButtons(item, index, canUndo) {
  const status = item.status || "pending";

  if (status === "pending") {
    return `
      <button class="gr-btn btn-primary" onclick="sendAction('runReview', ${index})">
        ⚡ Review This Item
      </button>
      <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">
        ✏️ Manual Edit
      </button>
    `;
  }

  if (status === "suggestion_ready") {
    return `
      <button class="gr-btn btn-success" onclick="sendAction('acceptItem', ${index})">
        ✓ Accept <kbd style="margin-left: 4px; background: rgba(0,0,0,0.2); border: none; color: #fff;">A</kbd>
      </button>
      <button class="gr-btn btn-danger" onclick="sendAction('rejectItem', ${index})">
        ✗ Reject <kbd style="margin-left: 4px; background: rgba(0,0,0,0.2); border: none; color: inherit;">R</kbd>
      </button>
      <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">
        ✏️ Edit
      </button>
      <button class="gr-btn btn-secondary" onclick="openReReviewDialog(${index})">
        🔄 Re-Review
      </button>
    `;
  }

  if (status === "accepted") {
    return `
      <span class="gr-status-pill success">✓ Accepted</span>
      ${canUndo ? `
        <button class="gr-btn btn-warning" onclick="sendAction('undoItem', ${index})" title="Revert decision">
          ↩ Undo
        </button>
      ` : ""}
      <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">
        ✏️ Edit
      </button>
      <button class="gr-btn btn-secondary" onclick="openReReviewDialog(${index})">
        🔄 Re-Review
      </button>
    `;
  }

  if (status === "rejected") {
    return `
      <span class="gr-status-pill danger">✗ Kept Original</span>
      ${canUndo ? `
        <button class="gr-btn btn-warning" onclick="sendAction('undoItem', ${index})" title="Restore AI suggestion">
          ↩ Undo
        </button>
      ` : ""}
      <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">
        ✏️ Edit
      </button>
      <button class="gr-btn btn-secondary" onclick="openReReviewDialog(${index})">
        🔄 Re-Review
      </button>
    `;
  }

  if (status === "modified") {
    return `
      <span class="gr-status-pill modified">✎ Manually Edited</span>
      <button class="gr-btn btn-success" onclick="sendAction('acceptItem', ${index})" title="Accept this manual edit as final">
        ✓ Accept Edit
      </button>
      ${canUndo ? `
        <button class="gr-btn btn-warning" onclick="sendAction('undoItem', ${index})" title="Discard manual edit">
          ↩ Discard Edit
        </button>
      ` : ""}
      <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">
        ✏️ Re-Edit
      </button>
      <button class="gr-btn btn-secondary" onclick="openReReviewDialog(${index})">
        🔄 Review My Edit
      </button>
    `;
  }

  // Error state
  if (status === "error") {
    return `
      <span class="gr-status-pill danger">⚠️ Review Failed</span>
      <button class="gr-btn btn-primary" onclick="sendAction('runReview', ${index})">
        ⚠️ Retry Review
      </button>
      <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">
        ✏️ Manual Edit
      </button>
    `;
  }

  // Fallback
  return `
    <button class="gr-btn btn-primary" onclick="sendAction('runReview', ${index})">
      ⚡ Review This Item
    </button>
    <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">
      ✏️ Manual Edit
    </button>
  `;
}

/**
 * URI encodes HTML string for safe data attribute payload.
 * @param {string} htmlStr
 * @returns {string}
 */
function escapeDataAttr(htmlStr) {
  if (!htmlStr) return "";
  return encodeURIComponent(htmlStr);
}

