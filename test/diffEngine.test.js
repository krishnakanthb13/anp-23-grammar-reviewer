import { computeWordDiff, tokenizeWords, computeTokenDiff, escapeHtml } from "../lib/engine/diffEngine.js";

describe("Diff Engine — Happy Path", () => {
  test("Detects word additions and deletions accurately", () => {
    const original = "The quick brown fox jumps over the dog.";
    const suggested = "The fast brown fox leaps over the lazy dog.";

    const result = computeWordDiff(original, suggested);
    expect(result.hasChanges).toBe(true);
    expect(result.stats.additions).toBeGreaterThan(0);
    expect(result.stats.deletions).toBeGreaterThan(0);
    expect(result.inlineHtml).toContain("<ins class=\"diff-ins\">");
    expect(result.inlineHtml).toContain("<del class=\"diff-del\">");
    expect(result.originalHtml).toContain("<span class=\"diff-del-highlight\">");
    expect(result.suggestedHtml).toContain("<span class=\"diff-ins-highlight\">");
  });

  test("Tokenizes punctuation and whitespace runs separately", () => {
    const tokens = tokenizeWords("Hello, world! 123-test.");
    expect(tokens).toContain("Hello");
    expect(tokens).toContain(",");
    expect(tokens).toContain(" ");
    expect(tokens).toContain("world");
    expect(tokens).toContain("!");
  });

  test("Produces correct token diff for simple insertion", () => {
    const diff = computeTokenDiff(["a", "b"], ["a", "x", "b"]);
    expect(diff.some(d => d.type === "insert" && d.value === "x")).toBe(true);
    expect(diff.filter(d => d.type === "equal").length).toBe(2);
  });
});

describe("Diff Engine — Edge Cases", () => {
  test("Handles identical text with no changes", () => {
    const text = "Exact same sentence.";
    const result = computeWordDiff(text, text);
    expect(result.hasChanges).toBe(false);
    expect(result.stats.additions).toBe(0);
    expect(result.stats.deletions).toBe(0);
    expect(result.diff.every(d => d.type === "equal")).toBe(true);
  });

  test("Handles empty strings gracefully", () => {
    const result = computeWordDiff("", "");
    expect(result.hasChanges).toBe(false);
    expect(result.stats.additions).toBe(0);
    expect(result.stats.deletions).toBe(0);
    expect(result.inlineHtml).toBe("");
  });

  test("Handles insertion from empty original text", () => {
    const result = computeWordDiff("", "Brand new text");
    expect(result.hasChanges).toBe(true);
    expect(result.stats.additions).toBeGreaterThan(0);
    expect(result.stats.deletions).toBe(0);
  });

  test("Handles complete deletion to empty suggested text", () => {
    const result = computeWordDiff("Original text deleted", "");
    expect(result.hasChanges).toBe(true);
    expect(result.stats.additions).toBe(0);
    expect(result.stats.deletions).toBeGreaterThan(0);
  });

  test("TokenizeWords handles null and undefined safely", () => {
    expect(tokenizeWords(null)).toEqual([]);
    expect(tokenizeWords(undefined)).toEqual([]);
    expect(tokenizeWords("")).toEqual([]);
  });
});

describe("Diff Engine — Error Handling & Sanitization", () => {
  test("Escapes dangerous HTML characters to prevent XSS", () => {
    const raw = "<script>alert('xss & attack')</script> \"quoted\"";
    const escaped = escapeHtml(raw);
    expect(escaped).not.toContain("<script>");
    expect(escaped).toContain("&lt;script&gt;");
    expect(escaped).toContain("&amp;");
    expect(escaped).toContain("&quot;");
    expect(escaped).toContain("&#039;");
  });

  test("escapeHtml handles empty and null input without throwing", () => {
    expect(escapeHtml("")).toBe("");
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });
});

describe("Diff Engine — Changes Only Mode & List Extraction", () => {
  test("Extracts paired changes and renders Changes Only HTML correctly", () => {
    const original = "She go to school.";
    const suggested = "She goes to school.";
    const result = computeWordDiff(original, suggested);

    expect(result.changesList.length).toBe(1);
    expect(result.changesList[0]).toEqual({
      type: "replace",
      original: "go",
      suggested: "goes"
    });
    expect(result.changesHtml).toContain("badge-replace");
    expect(result.changesHtml).toContain("go");
    expect(result.changesHtml).toContain("goes");
  });
});

