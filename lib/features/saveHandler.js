import { getActiveSession } from "../data/store.js";
import { generateChangesReport } from "../data/reportGenerator.js";
import { generateHistoryRecord } from "../data/historyManager.js";

/**
 * Handles the complete save workflow:
 * 1. Checks for concurrent modifications if source note changed since review started.
 * 2. Overwrites target note with reviewed markdown.
 * 3. Optionally creates human-readable and machine-readable audit notes (off by default).
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

  if (!noteUUID || typeof noteUUID !== "string") {
    throw new Error("Cannot save: Target note UUID is missing or invalid.");
  }

  // 1. Guard against stale note overwriting if getNoteContent and app.prompt are available
  if (typeof app.getNoteContent === "function") {
    try {
      const currentContent = await app.getNoteContent({ uuid: noteUUID });
      if (currentContent && session.originalContent) {
        const normCurrent = currentContent.replace(/\r\n/g, "\n").trim();
        const normOriginal = session.originalContent.replace(/\r\n/g, "\n").trim();
        if (normCurrent !== normOriginal && typeof app.prompt === "function") {
          try {
            const proceed = await app.prompt("Warning: Note Modified Externally", {
              inputs: [
                {
                  label: "The source note was modified outside the reviewer. Overwrite with reviewed version?",
                  type: "checkbox",
                  value: true
                }
              ]
            });
            if (proceed !== null && proceed !== undefined) {
              const isConfirmed = typeof proceed === "object" ? Boolean(proceed["The source note was modified outside the reviewer. Overwrite with reviewed version?"] ?? proceed[0]) : Boolean(proceed);
              if (!isConfirmed) {
                return { success: false, cancelled: true };
              }
            }
          } catch {
            // Prompt unavailable in sandboxed embed -> proceed with direct user save
          }
        }
      }
    } catch (e) {
      console.warn("[GrammarReviewer] Stale note check skipped:", e);
    }
  }

  // 2. Primary Save: Rewrite the source note directly
  try {
    await app.replaceNoteContent({ uuid: noteUUID }, finalContent);
  } catch (err) {
    const message = err?.message || String(err);
    throw new Error(`Failed to update note (${noteUUID}): ${message}`);
  }


  let changesNoteUUID = null;
  let historyNoteUUID = null;

  // 3. Only generate companion audit notes if explicitly enabled
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

