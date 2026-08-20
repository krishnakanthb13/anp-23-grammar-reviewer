import { computeWordDiff, tokenizeWords } from "../lib/engine/diffEngine.js";

describe("Diff Engine", () => {
  test("Detects word additions and deletions", () => {
    const original = "The quick brown fox jumps over the dog.";
    const suggested = "The fast brown fox leaps over the lazy dog.";

    const result = computeWordDiff(original, suggested);
    expect(result.hasChanges).toBe(true);
    expect(result.stats.additions).toBeGreaterThan(0);
    expect(result.stats.deletions).toBeGreaterThan(0);
    expect(result.inlineHtml).toContain("<ins class=\"diff-ins\">");
    expect(result.inlineHtml).toContain("<del class=\"diff-del\">");
  });

  test("Handles identical text with no changes", () => {
    const text = "Exact same sentence.";
    const result = computeWordDiff(text, text);
    expect(result.hasChanges).toBe(false);
    expect(result.stats.additions).toBe(0);
    expect(result.stats.deletions).toBe(0);
  });
});
