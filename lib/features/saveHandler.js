import { getActiveSession } from "../data/store.js";
import { generateChangesReport } from "../data/reportGenerator.js";
import { generateHistoryRecord } from "../data/historyManager.js";

/**
 * Handles the complete save workflow:
 * 1. Overwrites target note with reviewed markdown.
 * 2. Creates the human-readable changes report note.
 * 3. Creates the machine history record note.
 * 
 * @param {object} app
 * @returns {Promise<{ success: boolean, changesNoteUUID: string, historyNoteUUID: string }>}
 */
export async function handleSaveAndCommit(app) {
  const session = getActiveSession();
  if (!session) {
    throw new Error("No active review session to save.");
  }

  const finalContent = session.getReconstructedContent();
  const noteUUID = session.noteUUID;

  // 1. Primary Save: Rewrite the source note
  await app.replaceNoteContent({ uuid: noteUUID }, finalContent);

  // 2. Generate and save human-readable changes log note
  const changesReport = generateChangesReport({
    session,
    sourceNoteTitle: session.noteTitle,
    sourceNoteUUID: session.noteUUID,
    finalContent
  });

  const changesNoteUUID = await app.createNote(changesReport.name, changesReport.tags);
  if (changesNoteUUID) {
    await app.insertNoteContent({ uuid: changesNoteUUID }, changesReport.content);
  }

  // 3. Generate and save machine-readable history note
  const historyRecord = generateHistoryRecord({
    session,
    sourceNoteTitle: session.noteTitle,
    sourceNoteUUID: session.noteUUID,
    finalContent
  });

  const historyNoteUUID = await app.createNote(historyRecord.name, historyRecord.tags);
  if (historyNoteUUID) {
    await app.insertNoteContent({ uuid: historyNoteUUID }, historyRecord.content);
  }

  return {
    success: true,
    changesNoteUUID,
    historyNoteUUID
  };
}
