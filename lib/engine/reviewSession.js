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
      status: "pending", // "pending" | "accepted" | "rejected" | "modified"
      suggestion: token.original,
      diff: null,
      customEdit: null,
      reviewedAt: null
    }));
  }

  /**
   * Sets AI suggestion for a specific item and calculates diff.
   * @param {number} index
   * @param {string} suggestion
   */
  setSuggestion(index, suggestion) {
    if (!this.items[index]) return;
    const item = this.items[index];
    item.suggestion = suggestion;
    item.diff = computeWordDiff(item.original, suggestion);
    if (!item.diff.hasChanges) {
      item.status = "accepted"; // No changes needed
    }
  }

  /**
   * Accepts the suggestion for the specified item.
   * @param {number} index
   */
  accept(index) {
    if (this.items[index]) {
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
      this.items[index].customEdit = customText;
      this.items[index].status = "modified";
      this.items[index].diff = computeWordDiff(this.items[index].original, customText);
      this.items[index].reviewedAt = Date.now();
    }
  }

  /**
   * Assembles the final markdown output based on accepted/rejected/modified states.
   * @returns {string}
   */
  getReconstructedContent() {
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
    const reviewed = inspectable.filter(i => i.status !== "pending").length;
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

