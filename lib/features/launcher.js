import { ReviewSession } from "../engine/reviewSession.js";
import { setActiveSession } from "../data/store.js";
import { GRANULARITY_MODES, DEFAULT_MODELS } from "../constants.js";
import { getProviderConfig } from "../providers/providerRegistry.js";

/**
 * Directly launches the Grammar Reviewer in Fullscreen mode, remembering the last opened note.
 * 
 * @param {object} app - Amplenote app plugin context
 * @param {string} [targetNoteUUID] - Optional explicit note UUID
 * @param {boolean} [forcePrompt=false] - If true, always prompt note selector
 */
export async function launchReviewer(app, targetNoteUUID, forcePrompt = false) {
  try {
    let noteUUID = targetNoteUUID || app.context?.noteUUID;
    let noteTitle = "Untitled Note";

    // If not in a specific note context and not forcing a prompt, check last opened note
    if (!noteUUID && !forcePrompt) {
      noteUUID = app.settings?.["Last Opened Note UUID"] || null;
    }

    // If still no note UUID (or user requested to change note), prompt user to pick one
    if (!noteUUID || forcePrompt) {
      const selected = await app.prompt("Select note for Grammar Review:", {
        inputs: [
          {
            label: "Search Note",
            type: "note"
          }
        ]
      });

      if (!selected) return; // User canceled dialog

      if (typeof selected === "object" && selected !== null) {
        noteUUID = selected.uuid;
        if (selected.name) {
          noteTitle = selected.name;
        }
      } else if (typeof selected === "string") {
        noteUUID = selected;
      }
    }

    if (!noteUUID) {
      await app.alert("No note was selected.");
      return;
    }

    // Remember the last opened note UUID for future app launches
    if (typeof app.setSetting === "function") {
      try {
        await app.setSetting("Last Opened Note UUID", noteUUID);
      } catch (saveErr) {
        console.warn("[GrammarReviewer] Could not save Last Opened Note UUID:", saveErr);
      }
    }

    // Safely load note content and note metadata
    let noteContent = "";
    let noteTags = [];
    try {
      noteContent = (await app.getNoteContent({ uuid: noteUUID })) || "";
    } catch (fetchErr) {
      console.warn("[GrammarReviewer] getNoteContent error:", fetchErr);
    }

    try {
      if (typeof app.getNoteTags === "function") {
        noteTags = (await app.getNoteTags({ uuid: noteUUID })) || [];
      }
    } catch (tagErr) {
      console.warn("[GrammarReviewer] getNoteTags error:", tagErr);
    }

    try {
      const noteHandle = await app.findNote({ uuid: noteUUID });
      if (noteHandle) {
        if (noteHandle.name && (noteTitle === "Untitled Note" || !noteTitle)) {
          noteTitle = noteHandle.name;
        }
        if ((!noteTags || noteTags.length === 0) && Array.isArray(noteHandle.tags)) {
          noteTags = noteHandle.tags;
        }
      }
    } catch (findErr) {
      console.warn("[GrammarReviewer] findNote error:", findErr);
    }

    const config = getProviderConfig(app);

    // Initialize or replace active review session
    const session = new ReviewSession({
      noteUUID,
      noteTitle,
      noteTags,
      originalContent: noteContent,
      granularity: GRANULARITY_MODES.FULL,
      provider: config.provider,
      model: config.customModel || DEFAULT_MODELS[config.provider] || ""
    });

    setActiveSession(session);

    // Directly open in fullscreen without prompting
    await app.openEmbed();
  } catch (err) {
    console.error("[GrammarReviewer] Error in launchReviewer:", err);
    const errorMsg = err?.message || (typeof err === "string" ? err : JSON.stringify(err)) || "Unknown error occurred";
    await app.alert(`Failed to launch Grammar Reviewer: ${errorMsg}`);
  }
}
