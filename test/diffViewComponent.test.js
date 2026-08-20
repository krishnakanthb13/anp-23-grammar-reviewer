import { renderDiffCard } from "../lib/ui/diffViewComponent.js";
import { computeWordDiff } from "../lib/engine/diffEngine.js";

describe("DiffViewComponent — Rendering", () => {
  test("Renders active diff card with side-by-side panes and action buttons", () => {
    const original = "Original sentence.";
    const suggestion = "Polished sentence.";
    const diff = computeWordDiff(original, suggestion);

    const mockItem = {
      id: 1,
      original,
      suggestion,
      type: "paragraph",
      status: "pending",
      diff
    };

    const html = renderDiffCard(mockItem, 0, 1);
    expect(html).toContain('class="gr-diff-card active"');
    expect(html).toContain("Item #1 of 1");
    expect(html).toContain("Original Draft");
    expect(html).toContain("AI Suggestion");
    expect(html).toContain("setDiffViewMode(0, 'clean')");
    expect(html).toContain("setDiffViewMode(0, 'inline')");
    expect(html).toContain("sendAction('acceptItem', 0)");
    expect(html).toContain("sendAction('rejectItem', 0)");
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
