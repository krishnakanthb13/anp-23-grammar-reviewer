import { TAG_GRAMMAR_HISTORY, TAG_GRAMMAR_CHANGES } from "../constants.js";
import { parseHistoryNotes } from "../data/historyManager.js";

/**
 * Loads and returns all past grammar review history logs across tag query variants.
 * Prioritizes dedicated history logs and falls back to changes reports only if no history notes exist.
 * 
 * @param {object} app
 * @returns {Promise<Array<object>>}
 */
export async function loadHistoryRecords(app) {
  try {
    const noteMap = new Map();

    const historyQueries = [
      { tag: TAG_GRAMMAR_HISTORY },
      { tag: "reports/grammar/history" },
      { query: "tag:-reports/-grammar/-history" },
      { query: "tag:reports/grammar/history" },
      { query: "Grammar Review History Record" }
    ];

    for (const q of historyQueries) {
      try {
        const found = await app.filterNotes(q);
        if (Array.isArray(found)) {
          for (const n of found) {
            if (n && n.uuid && !noteMap.has(n.uuid)) {
              noteMap.set(n.uuid, n);
            }
          }
        }
      } catch (e) {
        // Continue with next filter query
      }
    }

    // Only if zero history notes were found, fallback to changes reports
    if (noteMap.size === 0) {
      const fallbackQueries = [
        { tag: TAG_GRAMMAR_CHANGES },
        { tag: "reports/grammar/changes" },
        { query: "tag:-reports/-grammar/-changes" },
        { query: "tag:reports/grammar/changes" }
      ];

      for (const q of fallbackQueries) {
        try {
          const found = await app.filterNotes(q);
          if (Array.isArray(found)) {
            for (const n of found) {
              if (n && n.uuid && !noteMap.has(n.uuid)) {
                noteMap.set(n.uuid, n);
              }
            }
          }
        } catch (e) {
          // Continue
        }
      }
    }

    if (noteMap.size === 0) {
      return [];
    }

    // Fetch content of each note (up to 40 most recent)
    const populatedNotes = [];
    const notesArray = Array.from(noteMap.values()).slice(0, 40);

    for (const n of notesArray) {
      try {
        const body = await app.getNoteContent({ uuid: n.uuid });
        populatedNotes.push({
          uuid: n.uuid,
          name: n.name,
          body
        });
      } catch (err) {
        populatedNotes.push({
          uuid: n.uuid,
          name: n.name,
          body: ""
        });
      }
    }

    return parseHistoryNotes(populatedNotes);
  } catch (err) {
    console.error("[GrammarReviewer] Error loading history records:", err);
    return [];
  }
}
