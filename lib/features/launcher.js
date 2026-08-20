import { ReviewSession } from "../engine/reviewSession.js";
import { setActiveSession } from "../data/store.js";
import { GRANULARITY_MODES } from "../constants.js";
import { getProviderConfig } from "../providers/providerRegistry.js";

/**
 * Launches the Grammar Reviewer in Fullscreen or Sidebar mode.
 * 
 * @param {object} app - Amplenote app plugin context
 * @param {string} [targetNoteUUID] - Optional explicit note UUID
 */
export async function launchReviewer(app, targetNoteUUID) {
  try {
    let noteUUID = targetNoteUUID || app.context?.noteUUID;
    let noteTitle = "Untitled Note";

    // If no active note is present (e.g. launched from App menu), prompt user to pick one
    if (!noteUUID) {
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

    // Safely load note content and note metadata
    let noteContent = "";
    try {
      noteContent = (await app.getNoteContent({ uuid: noteUUID })) || "";
    } catch (fetchErr) {
      console.warn("[GrammarReviewer] getNoteContent error:", fetchErr);
    }

    if (noteTitle === "Untitled Note") {
      try {
        const noteHandle = await app.findNote({ uuid: noteUUID });
        if (noteHandle && noteHandle.name) {
          noteTitle = noteHandle.name;
        }
      } catch (findErr) {
        console.warn("[GrammarReviewer] findNote error:", findErr);
      }
    }

    const config = getProviderConfig(app);

    // Initialize or replace active review session
    const session = new ReviewSession({
      noteUUID,
      noteTitle,
      originalContent: noteContent,
      granularity: GRANULARITY_MODES.PARAGRAPH,
      provider: config.provider,
      model: config.customModel
    });

    setActiveSession(session);

    // Prompt user for workspace view mode
    const lastChoice = app.settings?.["Last Embed View"] || "fullscreen";
    const choiceResult = await app.prompt("Choose Reviewer Workspace View:", {
      inputs: [
        {
          label: "Launch Target",
          type: "select",
          options: [
            { label: "Fullscreen Tab (Dedicated Workspace)", value: "fullscreen" },
            { label: "Peek Viewer (Sidebar)", value: "sidebar" }
          ],
          value: lastChoice
        }
      ]
    });

    if (!choiceResult) return; // User canceled dialog
    const target = Array.isArray(choiceResult) ? choiceResult[0] : choiceResult;

    if (typeof app.setSetting === "function") {
      try {
        await app.setSetting("Last Embed View", target);
      } catch (setErr) {
        console.warn("[GrammarReviewer] setSetting error:", setErr);
      }
    }

    if (target === "fullscreen") {
      await app.openEmbed();
    } else {
      await app.openSidebarEmbed(1);
    }
  } catch (err) {
    console.error("[GrammarReviewer] Error in launchReviewer:", err);
    const errorMsg = err?.message || (typeof err === "string" ? err : JSON.stringify(err)) || "Unknown error occurred";
    await app.alert(`Failed to launch Grammar Reviewer: ${errorMsg}`);
  }
}
