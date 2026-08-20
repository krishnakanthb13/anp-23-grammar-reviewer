/**
 * Diff Engine for word-level and fine-grained text comparison.
 * Generates side-by-side highlighting (Left: Deletions, Right: Additions) and inline diffs.
 */

/**
 * Splits text into words, punctuation, and whitespace tokens for precision diffing.
 * @param {string} text
 * @returns {string[]}
 */
export function tokenizeWords(text) {
  if (!text) return [];
  // Tokenize words, punctuation marks, and whitespace runs separately
  return text.match(/[\w'-]+|[^\w\s]|\s+/g) || [];
}

/**
 * Computes Myers / LCS diff between two arrays of tokens.
 * @param {string[]} a
 * @param {string[]} b
 * @returns {Array<{ type: "equal" | "delete" | "insert", value: string }>}
 */
export function computeTokenDiff(a, b) {
  const n = a.length;
  const m = b.length;
  const matrix = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  const diff = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      diff.push({ type: "equal", value: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      diff.push({ type: "insert", value: b[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
      diff.push({ type: "delete", value: a[i - 1] });
      i--;
    }
  }

  diff.reverse();
  return diff;
}

/**
 * Compares two strings at the word level and produces aligned diff segments with stats.
 * 
 * @param {string} original
 * @param {string} suggested
 * @returns {{
 *   hasChanges: boolean,
 *   diff: Array<{ type: "equal" | "delete" | "insert", value: string }>,
 *   stats: { additions: number, deletions: number, totalOriginalWords: number, totalSuggestedWords: number },
 *   inlineHtml: string,
 *   originalHtml: string,
 *   suggestedHtml: string
 * }}
 */
export function computeWordDiff(original = "", suggested = "") {
  if (original === suggested) {
    const origWords = tokenizeWords(original);
    return {
      hasChanges: false,
      diff: origWords.map(w => ({ type: "equal", value: w })),
      stats: { additions: 0, deletions: 0, totalOriginalWords: origWords.length, totalSuggestedWords: origWords.length },
      inlineHtml: escapeHtml(original),
      originalHtml: escapeHtml(original),
      suggestedHtml: escapeHtml(suggested)
    };
  }

  const origTokens = tokenizeWords(original);
  const suggTokens = tokenizeWords(suggested);
  const diff = computeTokenDiff(origTokens, suggTokens);

  let additions = 0;
  let deletions = 0;
  let inlineHtml = "";
  let originalHtml = "";
  let suggestedHtml = "";

  for (const part of diff) {
    const escaped = escapeHtml(part.value);
    if (part.type === "equal") {
      inlineHtml += escaped;
      originalHtml += escaped;
      suggestedHtml += escaped;
    } else if (part.type === "delete") {
      deletions++;
      inlineHtml += `<del class="diff-del">${escaped}</del>`;
      originalHtml += `<span class="diff-del-highlight">${escaped}</span>`;
    } else if (part.type === "insert") {
      additions++;
      inlineHtml += `<ins class="diff-ins">${escaped}</ins>`;
      suggestedHtml += `<span class="diff-ins-highlight">${escaped}</span>`;
    }
  }

  const hasChanges = additions > 0 || deletions > 0;

  return {
    hasChanges,
    diff,
    stats: {
      additions,
      deletions,
      totalOriginalWords: origTokens.length,
      totalSuggestedWords: suggTokens.length
    },
    inlineHtml,
    originalHtml,
    suggestedHtml
  };
}

/**
 * Escapes HTML characters for safe rendering.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
