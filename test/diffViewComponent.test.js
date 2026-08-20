import { renderDiffCard } from "../lib/ui/diffViewComponent.js";
import { computeWordDiff } from "../lib/engine/diffEngine.js";

describe("DiffViewComponent — Rendering & State-Aware Actions", () => {
  test("Renders suggestion_ready card with Accept, Reject, Edit, and Re-Review buttons", () => {
    const original = "Original sentence.";
    const suggestion = "Polished sentence.";
    const diff = computeWordDiff(original, suggestion);

    const mockItem = {
      id: 1,
      original,
      suggestion,
      type: "paragraph",
      status: "suggestion_ready",
      diff
    };

    const html = renderDiffCard(mockItem, 0, 1);
    expect(html).toContain('class="gr-diff-card active"');
    expect(html).toContain("Item #1 of 1");
    expect(html).toContain("Original Draft");
    expect(html).toContain("AI Suggestion");
    expect(html).toContain("setDiffViewMode(0, 'clean')");
    expect(html).toContain("setDiffViewMode(0, 'inline')");
    expect(html).toContain("setDiffViewMode(0, 'side')");
    expect(html).toContain("setDiffViewMode(0, 'changes')");
    expect(html).toContain("sendAction('acceptItem', 0)");
    expect(html).toContain("sendAction('rejectItem', 0)");
    expect(html).toContain("openReReviewDialog(0)");
    expect(html).toContain("Teacher's Insight");
  });

  test("Renders pending item with Review This Item button", () => {
    const mockItem = {
      id: 1,
      original: "Unreviewed sentence.",
      suggestion: "Unreviewed sentence.",
      type: "paragraph",
      status: "pending",
      diff: null
    };

    const html = renderDiffCard(mockItem, 0, 1);
    expect(html).toContain("⚡ Review This Item");
    expect(html).toContain("✏️ Manual Edit");
    expect(html).not.toContain("sendAction('acceptItem', 0)");
  });

  test("Renders accepted item with Undo control", () => {
    const mockItem = {
      id: 1,
      original: "Draft",
      suggestion: "Polished",
      type: "sentence",
      status: "accepted",
      diff: computeWordDiff("Draft", "Polished")
    };

    const mockSession = {
      items: [mockItem],
      canUndo: () => true,
      getPrevPendingIndex: () => -1,
      getNextPendingIndex: () => -1
    };

    const html = renderDiffCard(mockItem, 0, 1, mockSession);
    expect(html).toContain("✓ Accepted");
    expect(html).toContain("sendAction('undoItem', 0)");
  });

  test("Renders empty state when item is null or undefined", () => {
    const html = renderDiffCard(null, 0, 0);
    expect(html).toContain("gr-empty-state");
    expect(html).toContain("No item selected.");
  });

  test("Disables Next and Previous buttons appropriately at boundaries", () => {
    const mockItem = {
      id: 1,
      original: "Text",
      suggestion: "Text",
      type: "sentence",
      status: "accepted"
    };

    // Item 0 of 1: Both previous and next should be disabled
    const html = renderDiffCard(mockItem, 0, 1);
    expect(html).toContain("disabled style='opacity: 0.5; cursor: not-allowed;'");
  });
});

