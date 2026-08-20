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
    let noteUUID = targetNoteUUID || null;
    let noteTitle = "Untitled Note";

    // When launching from Apps menu or changing notes, prompt user to select a note
    if (!noteUUID || forcePrompt) {
      const selected = await app.prompt("Select note for Grammar Review (or Cancel to open Settings/Usage):", {
        inputs: [
          {
            label: "Search Note",
            type: "note"
          }
        ]
      });

      if (selected) {
        if (Array.isArray(selected)) {
          const item = selected[0];
          if (item && typeof item === "object") {
            noteUUID = item.uuid || item.value || item.id || null;
            if (item.name || item.label) noteTitle = item.name || item.label;
          } else if (typeof item === "string") {
            noteUUID = item;
          }
        } else if (typeof selected === "object" && selected !== null) {
          noteUUID = selected.uuid || selected.value || selected.id || null;
          if (selected.name || selected.label) {
            noteTitle = selected.name || selected.label;
          }
        } else if (typeof selected === "string") {
          noteUUID = selected.trim();
        }
      } else {
        noteUUID = null;
      }
    }

    if (noteUUID) {
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
    } else {
      setActiveSession(null);
    }

    // Open embed in sidebar
    if (typeof app.openEmbed === "function") {
      await app.openEmbed();
    }

    // Navigate to full-screen plugin page
    const pluginUUID = app.context?.pluginUUID || app.pluginUUID;
    if (pluginUUID && typeof app.navigate === "function") {
      await app.navigate(`https://www.amplenote.com/notes/plugins/${pluginUUID}`);
    }
  } catch (err) {
    console.error("[GrammarReviewer] Error in launchReviewer:", err);
    const errorMsg = err?.message || (typeof err === "string" ? err : JSON.stringify(err)) || "Unknown error occurred";
    await app.alert(`Failed to launch Grammar Reviewer: ${errorMsg}`);
  }
}
