import { tokenizeContent } from "./tokenizer.js";
import { computeWordDiff } from "./diffEngine.js";
import { GRANULARITY_MODES } from "../constants.js";

/**
 * Creates and manages a grammar review session for a note.
 */
export class ReviewSession {
  constructor({
    noteUUID = "",
    noteTitle = "Untitled Note",
    noteTags = [],
    originalContent = "",
    granularity = GRANULARITY_MODES.FULL,
    promptPresetId = "grammar_spelling",
    customPrompt = "",
    provider = "OpenRouter",
    model = ""
  } = {}) {
    this.sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    this.noteUUID = noteUUID;
    this.noteTitle = noteTitle;
    this.noteTags = Array.isArray(noteTags) ? noteTags : (typeof noteTags === "string" ? noteTags.split(",").map(t => t.trim()).filter(Boolean) : []);
    this.originalContent = originalContent;
    this.granularity = granularity;
    this.promptPresetId = promptPresetId;
    this.customPrompt = customPrompt;
    this.provider = provider;
    this.model = model;
    this.startedAt = Date.now();
    this.iteration = 1;
    this.currentIndex = 0;

    this.items = [];
    this.history = []; // Snapshots of iterations
    this.initializeItems();
  }

  /**
   * Initializes the session items by tokenizing the original document content.
   */
  initializeItems() {
    const rawTokens = tokenizeContent(this.originalContent, this.granularity);
    this.items = rawTokens.map(token => ({
      id: token.id,
      original: token.original,
      type: token.type,
      isInspectable: token.isInspectable,
      parentParagraphId: token.parentParagraphId || token.id,
      isLastInParagraph: token.isLastInParagraph !== undefined ? token.isLastInParagraph : true,
      status: "pending", // "pending" | "suggestion_ready" | "accepted" | "rejected" | "modified" | "no_change" | "error"
      suggestion: token.original,
      diff: null,
      customEdit: null,
      reviewedAt: null,
      undoStack: [],
      explanation: "",
      category: "Grammar & Clarity",
      confidence: "high"
    }));
  }

  /**
   * Pushes current item snapshot to undo stack before mutating.
   * @param {object} item
   */
  pushUndo(item) {
    if (!item) return;
    if (!item.undoStack) item.undoStack = [];
    item.undoStack.push({
      status: item.status,
      suggestion: item.suggestion,
      customEdit: item.customEdit,
      diff: item.diff,
      reviewedAt: item.reviewedAt
    });
    if (item.undoStack.length > 10) item.undoStack.shift();
  }

  /**
   * Reverts the most recent status/content modification on the specified item.
   * @param {number} index
   * @returns {boolean}
   */
  undo(index) {
    const item = this.items[index];
    if (!item) return false;

    if (item.undoStack && item.undoStack.length > 0) {
      const prev = item.undoStack.pop();
      item.status = prev.status;
      item.suggestion = prev.suggestion;
      item.customEdit = prev.customEdit;
      item.diff = prev.diff;
      item.reviewedAt = prev.reviewedAt;
      return true;
    }

    // Default fallback if no stack entry: revert to suggestion_ready or pending
    if (item.status === "accepted" || item.status === "rejected" || item.status === "modified") {
      item.status = (item.diff && item.diff.hasChanges) ? "suggestion_ready" : "pending";
      item.customEdit = null;
      return true;
    }

    return false;
  }

  /**
   * Checks if an item can be undone.
   * @param {number} index
   * @returns {boolean}
   */
  canUndo(index) {
    const item = this.items[index];
    if (!item) return false;
    return (item.undoStack && item.undoStack.length > 0) ||
           ["accepted", "rejected", "modified"].includes(item.status);
  }

  /**
   * Sets AI suggestion for a specific item and calculates diff.
   * @param {number} index
   * @param {string} suggestion
   * @param {object} [metadata] - Optional AI explanation & category
   */
  setSuggestion(index, suggestion, metadata = {}) {
    if (!this.items[index]) return;
    const item = this.items[index];
    this.pushUndo(item);
    item.suggestion = suggestion;
    item.diff = computeWordDiff(item.original, suggestion);
    item.explanation = metadata.explanation || "";
    item.category = metadata.category || (item.diff.hasChanges ? "Grammar & Clarity" : "No Changes Needed");
    item.confidence = metadata.confidence || "high";

    if (!item.diff.hasChanges) {
      item.status = "accepted"; // No changes needed
    } else {
      item.status = "suggestion_ready";
    }
  }

  /**
   * Accepts the suggestion for the specified item.
   * @param {number} index
   */
  accept(index) {
    if (this.items[index]) {
      this.pushUndo(this.items[index]);
      this.items[index].status = "accepted";
      this.items[index].reviewedAt = Date.now();
    }
  }

  /**
   * Rejects the suggestion and keeps the original text.
   * @param {number} index
   */
  reject(index) {
    if (this.items[index]) {
      this.pushUndo(this.items[index]);
      this.items[index].status = "rejected";
      this.items[index].reviewedAt = Date.now();
    }
  }

  /**
   * Manually modifies the text for this item.
   * @param {number} index
   * @param {string} customText
   */
  manualEdit(index, customText) {
    if (this.items[index]) {
      this.pushUndo(this.items[index]);
      this.items[index].customEdit = customText;
      this.items[index].status = "modified";
      this.items[index].diff = computeWordDiff(this.items[index].original, customText);
      this.items[index].reviewedAt = Date.now();
    }
  }

  /**
   * Finds the next index of an item that is still pending or ready for review decision.
   * @param {number} [fromIndex]
   * @returns {number} Index of next pending item or -1
   */
  getNextPendingIndex(fromIndex = this.currentIndex) {
    for (let i = fromIndex + 1; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.isInspectable && (item.status === "pending" || item.status === "suggestion_ready")) {
        return i;
      }
    }
    // Wrap around from beginning if not found after fromIndex
    for (let i = 0; i <= fromIndex; i++) {
      const item = this.items[i];
      if (item.isInspectable && (item.status === "pending" || item.status === "suggestion_ready")) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Finds the previous index of an item that is still pending or ready for review decision.
   * @param {number} [fromIndex]
   * @returns {number} Index of previous pending item or -1
   */
  getPrevPendingIndex(fromIndex = this.currentIndex) {
    for (let i = fromIndex - 1; i >= 0; i--) {
      const item = this.items[i];
      if (item.isInspectable && (item.status === "pending" || item.status === "suggestion_ready")) {
        return i;
      }
    }
    for (let i = this.items.length - 1; i >= fromIndex; i--) {
      const item = this.items[i];
      if (item.isInspectable && (item.status === "pending" || item.status === "suggestion_ready")) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Assembles the final markdown output based on accepted/rejected/modified states,
   * properly preserving paragraph spacing in sentence mode without introducing stray newlines.
   * @returns {string}
   */
  getReconstructedContent() {
    if (this.granularity === GRANULARITY_MODES.SENTENCE) {
      let result = "";
      let paraSentences = [];
      let currentParaId = null;

      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        let itemText = item.original;
        if (item.status === "accepted") {
          itemText = item.suggestion;
        } else if (item.status === "modified" && item.customEdit !== null) {
          itemText = item.customEdit;
        }

        if (item.type === "separator") {
          if (paraSentences.length > 0) {
            result += (result ? "\n" : "") + paraSentences.join(" ");
            paraSentences = [];
          }
          result += "\n";
          currentParaId = null;
          continue;
        }

        const pId = item.parentParagraphId || item.id;
        if (currentParaId !== null && currentParaId !== pId) {
          if (paraSentences.length > 0) {
            result += (result ? "\n" : "") + paraSentences.join(" ");
            paraSentences = [];
          }
        }

        currentParaId = pId;
        if (itemText && itemText.trim().length > 0) {
          paraSentences.push(itemText.trim());
        }

        if (item.isLastInParagraph) {
          if (paraSentences.length > 0) {
            result += (result ? "\n" : "") + paraSentences.join(" ");
            paraSentences = [];
          }
          currentParaId = null;
        }
      }

      if (paraSentences.length > 0) {
        result += (result ? "\n" : "") + paraSentences.join(" ");
      }

      return result;
    }

    // Full note and paragraph granularity
    return this.items.map(item => {
      if (item.status === "accepted") {
        return item.suggestion;
      } else if (item.status === "modified" && item.customEdit !== null) {
        return item.customEdit;
      }
      return item.original;
    }).join("\n");
  }

  /**
   * Returns summary metrics for the review session.
   * @returns {{
   *   total: number,
   *   reviewed: number,
   *   accepted: number,
   *   rejected: number,
   *   pending: number,
   *   percentComplete: number,
   *   totalAdditions: number,
   *   totalDeletions: number
   * }}
   */
  getMetrics() {
    const inspectable = this.items.filter(i => i.isInspectable);
    const total = inspectable.length;
    const reviewed = inspectable.filter(i => i.status !== "pending" && i.status !== "suggestion_ready").length;
    const accepted = inspectable.filter(i => i.status === "accepted" || i.status === "modified").length;
    const rejected = inspectable.filter(i => i.status === "rejected").length;

    let totalAdditions = 0;
    let totalDeletions = 0;

    for (const item of this.items) {
      if (item.diff?.stats) {
        totalAdditions += item.diff.stats.additions;
        totalDeletions += item.diff.stats.deletions;
      }
    }

    return {
      total,
      reviewed,
      accepted,
      rejected,
      pending: total - reviewed,
      percentComplete: total > 0 ? Math.round((reviewed / total) * 100) : 100,
      totalAdditions,
      totalDeletions
    };
  }

  /**
   * Serializes the entire session state to a plain JSON-safe object.
   */
  toJSON() {
    return {
      sessionId: this.sessionId,
      noteUUID: this.noteUUID,
      noteTitle: this.noteTitle,
      noteTags: this.noteTags,
      originalContent: this.originalContent,
      granularity: this.granularity,
      promptPresetId: this.promptPresetId,
      customPrompt: this.customPrompt,
      provider: this.provider,
      model: this.model,
      startedAt: this.startedAt,
      iteration: this.iteration,
      currentIndex: this.currentIndex,
      items: this.items
    };
  }

  /**
   * Restores a ReviewSession instance from serialized JSON.
   * @param {object} data
   * @returns {ReviewSession}
   */
  static fromJSON(data) {
    if (!data) return null;
    const session = new ReviewSession({
      noteUUID: data.noteUUID,
      noteTitle: data.noteTitle,
      noteTags: data.noteTags || [],
      originalContent: data.originalContent,
      granularity: data.granularity,
      promptPresetId: data.promptPresetId,
      customPrompt: data.customPrompt,
      provider: data.provider,
      model: data.model
    });

    session.sessionId = data.sessionId || session.sessionId;
    session.startedAt = data.startedAt || session.startedAt;
    session.iteration = data.iteration || 1;
    session.currentIndex = typeof data.currentIndex === "number" ? data.currentIndex : 0;
    if (Array.isArray(data.items) && data.items.length > 0) {
      session.items = data.items;
    }
    return session;
  }
}



