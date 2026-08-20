import { TAG_GRAMMAR_HISTORY } from "../constants.js";
import { parseHistoryNotes } from "../data/historyManager.js";

/**
 * Loads and returns all past grammar review history logs.
 * @param {object} app
 * @returns {Promise<Array<object>>}
 */
export async function loadHistoryRecords(app) {
  try {
    const notes = await app.filterNotes({ tag: TAG_GRAMMAR_HISTORY });
    if (!notes || notes.length === 0) {
      return [];
    }

    // Fetch content of each note
    const populatedNotes = [];
    for (const n of notes.slice(0, 30)) { // limit to 30 most recent
      const body = await app.getNoteContent({ uuid: n.uuid });
      populatedNotes.push({
        uuid: n.uuid,
        name: n.name,
        body
      });
    }

    return parseHistoryNotes(populatedNotes);
  } catch (err) {
    console.error("[GrammarReviewer] Error loading history records:", err);
    return [];
  }
}
