import { getActiveSession } from "../data/store.js";
import { generateChangesReport } from "../data/reportGenerator.js";
import { generateHistoryRecord } from "../data/historyManager.js";

/**
 * Handles the complete save workflow:
 * 1. Overwrites target note with reviewed markdown.
 * 2. Optionally creates human-readable and machine-readable audit notes (off by default).
 * 
 * @param {object} app
 * @param {boolean} [createAuditNotes=false] - Whether to generate extra audit notes
 * @returns {Promise<{ success: boolean, changesNoteUUID: string | null, historyNoteUUID: string | null }>}
 */
export async function handleSaveAndCommit(app, createAuditNotes = false) {
  const session = getActiveSession();
  if (!session) {
    throw new Error("No active review session to save.");
  }

  const finalContent = session.getReconstructedContent();
  const noteUUID = session.noteUUID;

  // 1. Primary Save: Rewrite the source note directly
  await app.replaceNoteContent({ uuid: noteUUID }, finalContent);

  let changesNoteUUID = null;
  let historyNoteUUID = null;

  // 2. Only generate companion audit notes if explicitly enabled
  if (createAuditNotes) {
    try {
      const changesReport = generateChangesReport({
        session,
        sourceNoteTitle: session.noteTitle,
        sourceNoteUUID: session.noteUUID,
        finalContent
      });

      changesNoteUUID = await app.createNote(changesReport.name, changesReport.tags);
      if (changesNoteUUID) {
        await app.insertNoteContent({ uuid: changesNoteUUID }, changesReport.content);
      }
    } catch (e) {
      console.warn("[GrammarReviewer] Could not create changes report note:", e);
    }

    try {
      const historyRecord = generateHistoryRecord({
        session,
        sourceNoteTitle: session.noteTitle,
        sourceNoteUUID: session.noteUUID,
        finalContent
      });

      historyNoteUUID = await app.createNote(historyRecord.name, historyRecord.tags);
      if (historyNoteUUID) {
        await app.insertNoteContent({ uuid: historyNoteUUID }, historyRecord.content);
      }
    } catch (e) {
      console.warn("[GrammarReviewer] Could not create history note:", e);
    }
  }

  return {
    success: true,
    changesNoteUUID,
    historyNoteUUID
  };
}
