import { generateChangesReport } from "../lib/data/reportGenerator.js";
import { ReviewSession } from "../lib/engine/reviewSession.js";

describe("Report and History Generator", () => {
  test("Creates human-readable changes log with proper tag and backlink", () => {
    const session = new ReviewSession({
      noteUUID: "test-uuid-123",
      noteTitle: "My Draft Note",
      originalContent: "Original paragraph."
    });

    session.setSuggestion(0, "Improved paragraph.");
    session.accept(0);

    const report = generateChangesReport({
      session,
      sourceNoteTitle: "My Draft Note",
      sourceNoteUUID: "test-uuid-123",
      finalContent: "Improved paragraph."
    });

    expect(report.tags).toContain("-reports/-grammar/-changes");
    expect(report.content).toContain("My Draft Note");
    expect(report.content).toContain("https://www.amplenote.com/notes/test-uuid-123");
    expect(report.content).toContain("Improved paragraph.");
  });

  test("Serializes and restores ReviewSession accurately for persistent storage", () => {
    const session = new ReviewSession({
      noteUUID: "persistent-note-99",
      noteTitle: "Persistent Test",
      originalContent: "First line.\n\nSecond line.",
      provider: "Mistral",
      model: "mistral-small-latest"
    });

    session.setSuggestion(0, "First polished line.");
    session.accept(0);

    const json = session.toJSON();
    const restored = ReviewSession.fromJSON(json);

    expect(restored.noteUUID).toBe("persistent-note-99");
    expect(restored.provider).toBe("Mistral");
    expect(restored.items.length).toBe(session.items.length);
    expect(restored.items[0].status).toBe("accepted");
    expect(restored.items[0].suggestion).toBe("First polished line.");
  });
});
