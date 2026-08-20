import { GRANULARITY_MODES } from "../constants.js";

/**
 * Tokenizes markdown text based on selected granularity while respecting formatting boundaries.
 * 
 * @param {string} text - Raw note markdown content.
 * @param {string} mode - "full" | "paragraph" | "sentence"
 * @returns {Array<{ id: number, original: string, type: string, isInspectable: boolean, parentParagraphId?: number, isLastInParagraph?: boolean }>}
 */
export function tokenizeContent(text, mode = GRANULARITY_MODES.PARAGRAPH) {
  if (!text || typeof text !== "string") {
    return [];
  }

  const normalized = text.replace(/\r\n/g, "\n");

  if (mode === GRANULARITY_MODES.FULL) {
    return [
      {
        id: 1,
        original: normalized,
        type: "full",
        isInspectable: normalized.trim().length > 0,
        parentParagraphId: 1,
        isLastInParagraph: true
      }
    ];
  }

  if (mode === GRANULARITY_MODES.SENTENCE) {
    return tokenizeSentences(normalized);
  }

  return tokenizeParagraphs(normalized);
}

/**
 * Splits text into paragraphs, preserving code blocks, blockquotes, and tables intact.
 * @param {string} text
 * @returns {Array<{ id: number, original: string, type: string, isInspectable: boolean, parentParagraphId: number, isLastInParagraph: boolean }>}
 */
export function tokenizeParagraphs(text) {
  if (!text || typeof text !== "string") return [];
  const normalized = text.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
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
        const paraId = idCounter++;
        paragraphs.push({
          id: paraId,
          original: chunkText,
          type: "paragraph",
          isInspectable: isInspectableText(chunkText),
          parentParagraphId: paraId,
          isLastInParagraph: true
        });
        currentBuffer = [];
      }
      // Blank separator preserved as non-inspectable whitespace chunk
      const sepId = idCounter++;
      paragraphs.push({
        id: sepId,
        original: "",
        type: "separator",
        isInspectable: false,
        parentParagraphId: sepId,
        isLastInParagraph: true
      });
    } else {
      currentBuffer.push(line);
    }
  }

  if (currentBuffer.length > 0) {
    const chunkText = currentBuffer.join("\n");
    const paraId = idCounter++;
    paragraphs.push({
      id: paraId,
      original: chunkText,
      type: "paragraph",
      isInspectable: isInspectableText(chunkText),
      parentParagraphId: paraId,
      isLastInParagraph: true
    });
  }

  return paragraphs;
}

/**
 * Splits text into sentences, preserving Markdown headers, lists, code fences, and abbreviations,
 * while maintaining parent paragraph identifiers so reconstructed content does not mutate structure.
 * @param {string} text
 * @returns {Array<{ id: number, original: string, type: string, isInspectable: boolean, parentParagraphId: number, isLastInParagraph: boolean }>}
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
    for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
      const s = sentences[sIdx];
      const isLast = sIdx === sentences.length - 1;
      items.push({
        id: idCounter++,
        original: s,
        type: "sentence",
        isInspectable: isInspectableText(s),
        parentParagraphId: para.id,
        isLastInParagraph: isLast
      });
    }
  }

  return items;
}

/**
 * Comprehensive list of abbreviations protected from false sentence breaks.
 */
const ABBREVIATIONS_PATTERN = /\b(e\.g\.|i\.e\.|etc\.|mr\.|mrs\.|ms\.|dr\.|prof\.|sr\.|jr\.|inc\.|ltd\.|co\.|corp\.|u\.s\.|u\.k\.|u\.n\.|e\.u\.|ph\.d\.|m\.d\.|b\.a\.|m\.a\.|b\.s\.|m\.s\.|vs\.|fig\.|no\.|dept\.|est\.|approx\.|jan\.|feb\.|mar\.|apr\.|jun\.|jul\.|aug\.|sep\.|sept\.|oct\.|nov\.|dec\.|al\.|st\.|ave\.|rd\.|blvd\.)/gi;

/**
 * Robust sentence splitter that protects abbreviations, decimals, URLs, and quotes.
 * @param {string} text
 * @returns {string[]}
 */
export function splitIntoSentences(text) {
  if (!text || typeof text !== "string") return [];

  // Protect common abbreviations, initials, decimals, and URLs
  const protectedText = text
    .replace(ABBREVIATIONS_PATTERN, (match) => match.replace(/\./g, "§DOT§"))
    .replace(/\b([A-Z])\./g, "$1§DOT§") // Single capital initial (e.g. John F. Kennedy)
    .replace(/(\d+)\.(\d+)/g, "$1§DOT§$2") // Decimals (e.g. 3.14)
    .replace(/(https?:\/\/[^\s]+)/g, (match) => match.replace(/\./g, "§DOT§")); // URLs

  // Regex splits on terminal punctuation (. ! ?) followed by whitespace or quote + whitespace or EOF
  const parts = protectedText.split(/([.!?]+["')\]}]*(?:\s+|$))/g);
  const result = [];
  let current = "";

  for (let i = 0; i < parts.length; i++) {
    current += parts[i];
    if (i % 2 === 1 || i === parts.length - 1) {
      if (current.trim().length > 0) {
        // Restore protected dots and trim excessive trailing break whitespace while keeping token clean
        result.push(current.replace(/§DOT§/g, ".").trim());
        current = "";
      }
    }
  }

  if (current.trim().length > 0) {
    result.push(current.replace(/§DOT§/g, ".").trim());
  }

  return result.length > 0 ? result : [text.trim()];
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
