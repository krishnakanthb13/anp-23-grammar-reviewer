import { GRANULARITY_MODES } from "../constants.js";

/**
 * Tokenizes markdown text based on selected granularity while respecting formatting boundaries.
 * 
 * @param {string} text - Raw note markdown content.
 * @param {string} mode - "full" | "paragraph" | "sentence"
 * @returns {Array<{ id: number, original: string, type: string, isInspectable: boolean }>}
 */
export function tokenizeContent(text, mode = GRANULARITY_MODES.PARAGRAPH) {
  if (!text || typeof text !== "string") {
    return [];
  }

  if (mode === GRANULARITY_MODES.FULL) {
    return [
      {
        id: 1,
        original: text,
        type: "full",
        isInspectable: text.trim().length > 0
      }
    ];
  }

  if (mode === GRANULARITY_MODES.PARAGRAPH) {
    return tokenizeParagraphs(text);
  }

  if (mode === GRANULARITY_MODES.SENTENCE) {
    return tokenizeSentences(text);
  }

  return tokenizeParagraphs(text);
}

/**
 * Splits text into paragraphs, preserving code blocks, blockquotes, and tables intact.
 * @param {string} text
 */
export function tokenizeParagraphs(text) {
  const lines = text.split("\n");
  const paragraphs = [];
  let currentBuffer = [];
  let inCodeFence = false;
  let idCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      inCodeFence = !inCodeFence;
      currentBuffer.push(line);
      continue;
    }

    if (inCodeFence) {
      currentBuffer.push(line);
      continue;
    }

    // Blank line indicates paragraph separator
    if (line.trim() === "") {
      if (currentBuffer.length > 0) {
        const chunkText = currentBuffer.join("\n");
        paragraphs.push({
          id: idCounter++,
          original: chunkText,
          type: "paragraph",
          isInspectable: isInspectableText(chunkText)
        });
        currentBuffer = [];
      }
      // Blank separator preserved as non-inspectable whitespace chunk
      paragraphs.push({
        id: idCounter++,
        original: "",
        type: "separator",
        isInspectable: false
      });
    } else {
      currentBuffer.push(line);
    }
  }

  if (currentBuffer.length > 0) {
    const chunkText = currentBuffer.join("\n");
    paragraphs.push({
      id: idCounter++,
      original: chunkText,
      type: "paragraph",
      isInspectable: isInspectableText(chunkText)
    });
  }

  return paragraphs;
}

/**
 * Splits text into sentences, preserving Markdown headers, lists, code fences, and abbreviations.
 * @param {string} text
 */
export function tokenizeSentences(text) {
  const paragraphs = tokenizeParagraphs(text);
  const items = [];
  let idCounter = 1;

  for (const para of paragraphs) {
    if (!para.isInspectable || para.original.trim().startsWith("```") || para.original.trim().startsWith("#")) {
      items.push({
        ...para,
        id: idCounter++
      });
      continue;
    }

    const sentences = splitIntoSentences(para.original);
    for (const s of sentences) {
      items.push({
        id: idCounter++,
        original: s,
        type: "sentence",
        isInspectable: isInspectableText(s)
      });
    }
  }

  return items;
}

/**
 * Robust sentence splitter that protects abbreviations, decimals, and URLs.
 * @param {string} text
 * @returns {string[]}
 */
export function splitIntoSentences(text) {
  // Protect common abbreviations and numbers
  const protectedText = text
    .replace(/\b(e\.g\.|i\.e\.|etc\.|mr\.|mrs\.|dr\.|vs\.|fig\.|no\.)/gi, (match) => match.replace(/\./g, "§DOT§"))
    .replace(/(\d+)\.(\d+)/g, "$1§DOT§$2");

  // Regex splits on punctuation (. ! ?) followed by whitespace or EOF
  const parts = protectedText.split(/([.!?]+(?:\s+|$))/g);
  const result = [];
  let current = "";

  for (let i = 0; i < parts.length; i++) {
    current += parts[i];
    if (i % 2 === 1 || i === parts.length - 1) {
      if (current.trim().length > 0) {
        // Restore protected dots
        result.push(current.replace(/§DOT§/g, "."));
        current = "";
      }
    }
  }

  if (current.trim().length > 0) {
    result.push(current.replace(/§DOT§/g, "."));
  }

  return result.length > 0 ? result : [text];
}

/**
 * Determines if text contains substantive prose for review.
 * @param {string} text
 * @returns {boolean}
 */
export function isInspectableText(text) {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("```") && trimmed.endsWith("```")) return false; // Skip pure code fences
  if (/^[-*_]{3,}$/.test(trimmed)) return false; // Skip thematic breaks
  return trimmed.length > 2;
}
