import { ReviewSession } from "../lib/engine/reviewSession.js";

describe("ReviewSession — Happy Path", () => {
  test("Initializes items from text and computes review metrics", () => {
    const session = new ReviewSession({
      noteUUID: "uuid-123",
      noteTitle: "Test Document",
      originalContent: "First sentence here.\n\nSecond sentence here.",
      granularity: "paragraph",
      provider: "OpenRouter",
      model: "openai/gpt-oss-120b:free"
    });

    expect(session.items.length).toBeGreaterThan(0);
    const metrics = session.getMetrics();
    expect(metrics.total).toBe(2);
    expect(metrics.reviewed).toBe(0);
    expect(metrics.pending).toBe(2);
    expect(metrics.percentComplete).toBe(0);
  });

  test("Accepts suggestions and tracks updated metrics", () => {
    const session = new ReviewSession({
      noteUUID: "uuid-123",
      noteTitle: "Test Document",
      originalContent: "First sentence.\n\nSecond sentence.",
      granularity: "paragraph"
    });

    session.setSuggestion(0, "First improved sentence.");
    session.accept(0);

    const metrics = session.getMetrics();
    expect(metrics.accepted).toBe(1);
    expect(metrics.reviewed).toBe(1);
    expect(metrics.percentComplete).toBe(50);
  });

  test("Rejects suggestions and keeps original text", () => {
    const session = new ReviewSession({
      noteUUID: "uuid-123",
      noteTitle: "Test Document",
      originalContent: "Original paragraph."
    });

    session.setSuggestion(0, "Proposed rewrite.");
    session.reject(0);

    expect(session.items[0].status).toBe("rejected");
    const content = session.getReconstructedContent();
    expect(content).toBe("Original paragraph.");
  });

  test("Supports manual custom edits", () => {
    const session = new ReviewSession({
      noteUUID: "uuid-123",
      noteTitle: "Test Document",
      originalContent: "Original text."
    });

    session.manualEdit(0, "Manually crafted text.");
    expect(session.items[0].status).toBe("modified");
    expect(session.items[0].customEdit).toBe("Manually crafted text.");
    expect(session.getReconstructedContent()).toBe("Manually crafted text.");
  });

  test("Preserves paragraph structure during sentence-mode reconstruction", () => {
    const original = "This is sentence one. This is sentence two.\n\nThis is paragraph two.";
    const session = new ReviewSession({
      noteUUID: "uuid-123",
      noteTitle: "Sentence Test",
      originalContent: original,
      granularity: "sentence"
    });

    expect(session.items.length).toBeGreaterThan(2);

    // Accept sentence 1 edit
    session.setSuggestion(0, "This is improved sentence one.");
    session.accept(0);

    const reconstructed = session.getReconstructedContent();
    // Sentence one and two must be in the same paragraph joined by space, not split across newlines!
    expect(reconstructed).toContain("This is improved sentence one. This is sentence two.");
    expect(reconstructed).toContain("\n\nThis is paragraph two.");
  });

  test("Supports reversible Undo of decisions", () => {
    const session = new ReviewSession({
      noteUUID: "uuid-123",
      originalContent: "Original sentence."
    });

    session.setSuggestion(0, "Suggested sentence.");
    expect(session.items[0].status).toBe("suggestion_ready");

    session.accept(0);
    expect(session.items[0].status).toBe("accepted");
    expect(session.canUndo(0)).toBe(true);

    const undone = session.undo(0);
    expect(undone).toBe(true);
    expect(session.items[0].status).toBe("suggestion_ready");
  });

  test("Finds next and previous pending items accurately", () => {
    const session = new ReviewSession({
      noteUUID: "uuid-123",
      originalContent: "Para 1.\n\nPara 2.\n\nPara 3.",
      granularity: "paragraph"
    });

    // Item 0 is Para 1, Item 1 is separator (not inspectable), Item 2 is Para 2, Item 3 is separator, Item 4 is Para 3
    expect(session.getNextPendingIndex(0)).toBe(2);
    session.accept(2); // Para 2 accepted
    expect(session.getNextPendingIndex(0)).toBe(4); // Skips to Para 3
    expect(session.getPrevPendingIndex(4)).toBe(0); // Skips backward to Para 1
  });
});


describe("ReviewSession — Edge Cases & Serialization", () => {
  test("Serializes and deserializes session state accurately", () => {
    const session = new ReviewSession({
      noteUUID: "note-persist-456",
      noteTitle: "Persistent Session",
      originalContent: "Paragraph 1\n\nParagraph 2",
      provider: "Gemini",
      model: "gemini-3.5-flash-lite"
    });

    session.setSuggestion(0, "Polished paragraph 1");
    session.accept(0);
    session.currentIndex = 1;

    const serialized = session.toJSON();
    const restored = ReviewSession.fromJSON(serialized);

    expect(restored.sessionId).toBe(session.sessionId);
    expect(restored.noteUUID).toBe("note-persist-456");
    expect(restored.provider).toBe("Gemini");
    expect(restored.model).toBe("gemini-3.5-flash-lite");
    expect(restored.currentIndex).toBe(1);
    expect(restored.items[0].status).toBe("accepted");
  });

  test("Handles fromJSON with null or empty input gracefully", () => {
    expect(ReviewSession.fromJSON(null)).toBeNull();
    expect(ReviewSession.fromJSON(undefined)).toBeNull();
  });

  test("Calculates total additions and deletions in metrics", () => {
    const session = new ReviewSession({
      noteUUID: "uuid-123",
      originalContent: "Short sentence."
    });

    session.setSuggestion(0, "A substantially longer and more detailed sentence.");
    const metrics = session.getMetrics();
    expect(metrics.totalAdditions).toBeGreaterThan(0);
  });
});

describe("ReviewSession — Error Handling", () => {
  test("Safely handles out-of-bounds item index calls without throwing", () => {
    const session = new ReviewSession({
      noteUUID: "uuid-123",
      originalContent: "Single item."
    });

    expect(() => session.setSuggestion(999, "No item here")).not.toThrow();
    expect(() => session.accept(999)).not.toThrow();
    expect(() => session.reject(999)).not.toThrow();
    expect(() => session.manualEdit(999, "No edit")).not.toThrow();
    expect(() => session.undo(999)).not.toThrow();
  });
});

