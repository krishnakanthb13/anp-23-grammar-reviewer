import { jest } from "@jest/globals";
import { ReviewSession } from "../lib/engine/reviewSession.js";
import { tokenizeContent } from "../lib/engine/tokenizer.js";
import { handleRunReview, handleReviewAll, cancelReviewAll, handleSetGranularity } from "../lib/features/reviewWorkflow.js";
import { handleSaveAndCommit } from "../lib/features/saveHandler.js";
import { setActiveSession, clearActiveSession, getActiveSession } from "../lib/data/store.js";
import { GRANULARITY_MODES } from "../lib/constants.js";

describe("Scenario Tests — Real-World Workflows (ANP-23 Integrity Suite)", () => {
  beforeEach(() => {
    clearActiveSession();
  });

  // Scenario A: Sentence preservation
  test("Scenario A: Preserves untouched sentences and exact paragraph structure when reviewing a middle sentence", () => {
    const rawMarkdown = "First sentence here. Second sentance here with typo. Third sentence is fine. Fourth sentence concludes.";
    const session = new ReviewSession({
      noteUUID: "note-scenario-a",
      noteTitle: "Sentence Test",
      originalContent: rawMarkdown,
      granularity: GRANULARITY_MODES.SENTENCE
    });

    expect(session.items.length).toBe(4);
    expect(session.items[0].original).toBe("First sentence here.");
    expect(session.items[1].original).toBe("Second sentance here with typo.");
    expect(session.items[2].original).toBe("Third sentence is fine.");
    expect(session.items[3].original).toBe("Fourth sentence concludes.");

    // Review only sentence 2 (index 1)
    session.setSuggestion(1, "Second sentence here with typo fixed.");
    session.accept(1);

    const reconstructed = session.getReconstructedContent();
    expect(reconstructed).toBe(
      "First sentence here. Second sentence here with typo fixed. Third sentence is fine. Fourth sentence concludes."
    );
  });

  // Scenario B: Complex Markdown preservation
  test("Scenario B: Preserves markdown structures (headers, bold, lists, quotes, and code blocks) byte-accurately", () => {
    const markdownDoc = `# Heading 1

This is a **bold** and *italic* paragraph with a [link](https://amplenote.com).

- List item 1
- List item 2

> A profound quote from an author.

\`\`\`javascript
const x = 42;
console.log(x);
\`\`\`

Final concluding paragraph.`;

    const session = new ReviewSession({
      noteUUID: "note-scenario-b",
      noteTitle: "Markdown Test",
      originalContent: markdownDoc,
      granularity: GRANULARITY_MODES.PARAGRAPH
    });

    // Review only the first paragraph (index 2 - after heading and separator)
    const paraItem = session.items.find(i => i.original.includes("bold"));
    expect(paraItem).toBeDefined();

    const paraIdx = session.items.indexOf(paraItem);
    session.setSuggestion(paraIdx, "This is an enhanced **bold** and *italic* paragraph with a [link](https://amplenote.com).");
    session.accept(paraIdx);

    const reconstructed = session.getReconstructedContent();
    expect(reconstructed).toContain("# Heading 1");
    expect(reconstructed).toContain("This is an enhanced **bold** and *italic* paragraph with a [link](https://amplenote.com).");
    expect(reconstructed).toContain("- List item 1\n- List item 2");
    expect(reconstructed).toContain("> A profound quote from an author.");
    expect(reconstructed).toContain("```javascript\nconst x = 42;\nconsole.log(x);\n```");
  });

  // Scenario C: Review All + Partial Failure
  test("Scenario C: Review All handles individual API failures gracefully and flags failed items", async () => {
    const content = "Paragraph one.\n\nParagraph two.\n\nParagraph three.\n\nParagraph four.";
    const session = new ReviewSession({
      noteUUID: "note-scenario-c",
      originalContent: content,
      granularity: GRANULARITY_MODES.PARAGRAPH
    });
    setActiveSession(session);

    let callCount = 0;
    const mockApp = {
      settings: { "AI Provider": "OpenRouter", "OpenRouter API Key": "mock-key" }
    };

    // Spy on ReviewSession to simulate failure on item 1 (the second inspectable item)
    const originalSetSuggestion = session.setSuggestion.bind(session);
    let inspectedCount = 0;

    session.setSuggestion = jest.fn((idx, sugg, meta) => {
      inspectedCount++;
      if (inspectedCount === 2) {
        session.items[idx].status = "error";
        throw new Error("Simulated 429 Rate Limit on item 2");
      }
      return originalSetSuggestion(idx, sugg, meta);
    });

    // Mock global fetch for provider
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify({ rewritten: "Polished paragraph.", category: "Grammar" }) } }]
        })
      })
    );

    const result = await handleReviewAll(mockApp);
    expect(result.failedCount).toBe(1);
    expect(result.reviewedCount).toBe(3);
    expect(result.failedIndices.length).toBe(1);

    const failedItem = session.items[result.failedIndices[0]];
    expect(failedItem.status).toBe("error");
  });

  // Scenario D: Review All Cancellation
  test("Scenario D: Cancelling Review All stops subsequent API calls immediately", async () => {
    const content = "Para 1.\n\nPara 2.\n\nPara 3.\n\nPara 4.\n\nPara 5.";
    const session = new ReviewSession({
      noteUUID: "note-scenario-d",
      originalContent: content,
      granularity: GRANULARITY_MODES.PARAGRAPH
    });
    setActiveSession(session);

    let reviewsExecuted = 0;
    global.fetch = jest.fn().mockImplementation(() => {
      reviewsExecuted++;
      if (reviewsExecuted === 2) {
        cancelReviewAll(); // Cancel after 2 items
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify({ rewritten: "Reviewed.", category: "Grammar" }) } }]
        })
      });
    });

    const mockApp = {
      settings: { "AI Provider": "OpenRouter", "OpenRouter API Key": "mock-key" }
    };

    const result = await handleReviewAll(mockApp);
    expect(result.cancelled).toBe(true);
    expect(result.reviewedCount).toBe(2);

    // Remaining items should stay pending
    const remainingPending = session.items.filter(i => i.isInspectable && i.status === "pending");
    expect(remainingPending.length).toBe(3);
  });

  // Scenario E: Stale Note Save Conflict
  test("Scenario E: Stale save guard blocks note overwrite when external edits exist and user declines", async () => {
    const session = new ReviewSession({
      noteUUID: "note-scenario-e",
      originalContent: "Original content when review opened."
    });
    session.setSuggestion(0, "Polished content ready to save.");
    session.accept(0);
    setActiveSession(session);

    const mockApp = {
      getNoteContent: jest.fn().mockResolvedValue("External modification made in another tab."),
      prompt: jest.fn().mockResolvedValue(false), // User declines
      replaceNoteContent: jest.fn()
    };

    const res = await handleSaveAndCommit(mockApp);
    expect(res.success).toBe(false);
    expect(res.cancelled).toBe(true);
    expect(mockApp.replaceNoteContent).not.toHaveBeenCalled();
  });

  // Scenario F: Granularity switching preserves original note baseline
  test("Scenario F: Switching granularity retokenizes original content without loss", () => {
    const originalText = "First paragraph here.\n\nSecond paragraph has two sentences. Like this one.";
    const session = new ReviewSession({
      noteUUID: "note-scenario-f",
      originalContent: originalText,
      granularity: GRANULARITY_MODES.PARAGRAPH
    });
    setActiveSession(session);

    expect(session.granularity).toBe(GRANULARITY_MODES.PARAGRAPH);
    const inspectableParas = session.items.filter(i => i.isInspectable);
    expect(inspectableParas.length).toBe(2);

    handleSetGranularity({}, GRANULARITY_MODES.SENTENCE);
    const newSession = getActiveSession();
    expect(newSession.granularity).toBe(GRANULARITY_MODES.SENTENCE);
    expect(newSession.originalContent).toBe(originalText);

    const inspectableSentences = newSession.items.filter(i => i.isInspectable);
    expect(inspectableSentences.length).toBe(3);
  });

  // Scenario G: Manual edit on pending item
  test("Scenario G: Manual edit on pending item transitions to modified without losing custom text", () => {
    const session = new ReviewSession({
      noteUUID: "note-scenario-g",
      originalContent: "Original draft sentence.",
      granularity: GRANULARITY_MODES.FULL
    });

    expect(session.items[0].status).toBe("pending");
    session.manualEdit(0, "My custom polished sentence.");

    expect(session.items[0].status).toBe("modified");
    expect(session.items[0].customEdit).toBe("My custom polished sentence.");
    expect(session.items[0].diff.hasChanges).toBe(true);

    const final = session.getReconstructedContent();
    expect(final).toBe("My custom polished sentence.");

    // Test undo reverts manual edit
    session.undo(0);
    expect(session.items[0].status).toBe("pending");
    expect(session.getReconstructedContent()).toBe("Original draft sentence.");
  });
});
