import {
  tokenizeContent,
  tokenizeParagraphs,
  tokenizeSentences,
  splitIntoSentences,
  isInspectableText
} from "../lib/engine/tokenizer.js";

describe("Markdown Tokenizer — Happy Path", () => {
  test("Tokenizes paragraphs while preserving codeblocks intact", () => {
    const markdown = `# Title

First paragraph of text.

\`\`\`javascript
const a = 1;
const b = 2;
\`\`\`

Second paragraph after codeblock.`;

    const paragraphs = tokenizeParagraphs(markdown);
    expect(paragraphs.length).toBeGreaterThan(2);

    const codeChunk = paragraphs.find(p => p.original.includes("const a = 1;"));
    expect(codeChunk).toBeDefined();
    expect(codeChunk.isInspectable).toBe(false);
  });

  test("Tokenizes sentences accurately without breaking abbreviations", () => {
    const text = "Dr. Smith went to Washington D.C. on business. He arrived at 9.30 a.m. and met with the committee.";
    const sentences = tokenizeSentences(text);

    expect(sentences.length).toBeGreaterThanOrEqual(1);
    expect(sentences[0].original).toContain("Dr. Smith");
  });

  test("Full note granularity returns single chunk", () => {
    const text = "Line 1\nLine 2\nLine 3";
    const chunks = tokenizeContent(text, "full");
    expect(chunks.length).toBe(1);
    expect(chunks[0].original).toBe(text);
    expect(chunks[0].type).toBe("full");
  });
});

describe("Markdown Tokenizer — Edge Cases", () => {
  test("Handles null, undefined, and empty string input", () => {
    expect(tokenizeContent(null)).toEqual([]);
    expect(tokenizeContent(undefined)).toEqual([]);
    expect(tokenizeContent("")).toEqual([]);
    expect(tokenizeParagraphs("")).toEqual([]);
  });

  test("Detects non-inspectable content like thematic breaks and whitespace", () => {
    expect(isInspectableText("---")).toBe(false);
    expect(isInspectableText("***")).toBe(false);
    expect(isInspectableText("   ")).toBe(false);
    expect(isInspectableText("a")).toBe(false); // <= 2 characters
    expect(isInspectableText("Real substantive text")).toBe(true);
  });

  test("Protects numbers with decimal points during sentence splitting", () => {
    const text = "The stock increased by 4.5% in Q3. Revenue was $12.8M.";
    const sentences = splitIntoSentences(text);
    expect(sentences.length).toBe(2);
    expect(sentences[0]).toContain("4.5%");
    expect(sentences[1]).toContain("$12.8M");
  });
});

describe("Markdown Tokenizer — Error Handling & Fallbacks", () => {
  test("Falls back to paragraph mode for unknown granularity mode", () => {
    const text = "First paragraph.\n\nSecond paragraph.";
    const chunks = tokenizeContent(text, "unknown_mode");
    expect(chunks.length).toBeGreaterThan(1);
  });
});

describe("Markdown Tokenizer — Regression Tests", () => {
  test("CRLF line endings (\\r\\n) are cleanly normalized without leaving carriage returns", () => {
    const crlfText = "Paragraph 1\r\n\r\nParagraph 2\r\n\r\n```js\r\nconst x = 1;\r\n```";
    const paragraphs = tokenizeParagraphs(crlfText);
    for (const p of paragraphs) {
      expect(p.original).not.toContain("\r");
    }
  });
});
