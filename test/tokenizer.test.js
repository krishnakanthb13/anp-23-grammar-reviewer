import { tokenizeContent, tokenizeParagraphs, tokenizeSentences } from "../lib/engine/tokenizer.js";

describe("Markdown Tokenizer", () => {
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
  });
});
