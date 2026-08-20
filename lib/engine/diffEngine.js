/**
 * Diff Engine for word-level and fine-grained text comparison.
 * Generates Clean Prose, Inline Diff, Side-by-Side Diff, and Changes Only representations.
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
 * Computes Myers / LCS diff between two arrays of tokens with common prefix/suffix trimming.
 * @param {string[]} a
 * @param {string[]} b
 * @returns {Array<{ type: "equal" | "delete" | "insert", value: string }>}
 */
export function computeTokenDiff(a, b) {
  const n = a.length;
  const m = b.length;

  // Optimize common prefix
  let start = 0;
  while (start < n && start < m && a[start] === b[start]) {
    start++;
  }

  // Optimize common suffix
  let endA = n - 1;
  let endB = m - 1;
  while (endA >= start && endB >= start && a[endA] === b[endB]) {
    endA--;
    endB--;
  }

  const midA = a.slice(start, endA + 1);
  const midB = b.slice(start, endB + 1);

  const subDiff = [];
  if (midA.length > 0 && midB.length > 0) {
    const subN = midA.length;
    const subM = midB.length;
    const matrix = Array.from({ length: subN + 1 }, () => new Array(subM + 1).fill(0));

    for (let i = 1; i <= subN; i++) {
      for (let j = 1; j <= subM; j++) {
        if (midA[i - 1] === midB[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1] + 1;
        } else {
          matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
        }
      }
    }

    let i = subN;
    let j = subM;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && midA[i - 1] === midB[j - 1]) {
        subDiff.push({ type: "equal", value: midA[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
        subDiff.push({ type: "insert", value: midB[j - 1] });
        j--;
      } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
        subDiff.push({ type: "delete", value: midA[i - 1] });
        i--;
      }
    }
    subDiff.reverse();
  } else if (midA.length > 0) {
    for (const val of midA) subDiff.push({ type: "delete", value: val });
  } else if (midB.length > 0) {
    for (const val of midB) subDiff.push({ type: "insert", value: val });
  }

  const result = [];
  for (let i = 0; i < start; i++) {
    result.push({ type: "equal", value: a[i] });
  }
  for (const item of subDiff) {
    result.push(item);
  }
  for (let i = endA + 1; i < n; i++) {
    result.push({ type: "equal", value: a[i] });
  }

  return result;
}

/**
 * Compares two strings at the word level and produces aligned diff segments with stats and changes breakdown.
 * 
 * @param {string} original
 * @param {string} suggested
 * @returns {{
 *   hasChanges: boolean,
 *   diff: Array<{ type: "equal" | "delete" | "insert", value: string }>,
 *   stats: { additions: number, deletions: number, totalOriginalWords: number, totalSuggestedWords: number, changeCount: number },
 *   inlineHtml: string,
 *   originalHtml: string,
 *   suggestedHtml: string,
 *   changesHtml: string,
 *   changesList: Array<{ type: string, original: string, suggested: string }>
 * }}
 */
export function computeWordDiff(original = "", suggested = "") {
  if (original === suggested) {
    const origWords = tokenizeWords(original);
    return {
      hasChanges: false,
      diff: origWords.map(w => ({ type: "equal", value: w })),
      stats: { additions: 0, deletions: 0, totalOriginalWords: origWords.length, totalSuggestedWords: origWords.length, changeCount: 0 },
      inlineHtml: escapeHtml(original),
      originalHtml: escapeHtml(original),
      suggestedHtml: escapeHtml(suggested),
      changesHtml: `<div class="gr-no-changes-msg">✓ No textual changes detected. Original wording preserved.</div>`,
      changesList: []
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

  const changesList = extractChangesList(diff);
  const changesHtml = renderChangesOnlyHtml(changesList);
  const hasChanges = additions > 0 || deletions > 0;

  return {
    hasChanges,
    diff,
    stats: {
      additions,
      deletions,
      totalOriginalWords: origTokens.length,
      totalSuggestedWords: suggTokens.length,
      changeCount: changesList.length
    },
    inlineHtml,
    originalHtml,
    suggestedHtml,
    changesHtml,
    changesList
  };
}

/**
 * Groups consecutive deletions and insertions into coherent change pairs (e.g. "old word" -> "new word").
 * @param {Array<{ type: string, value: string }>} diff
 * @returns {Array<{ type: "replace" | "delete" | "insert", original: string, suggested: string }>}
 */
export function extractChangesList(diff) {
  const changes = [];
  let i = 0;

  while (i < diff.length) {
    if (diff[i].type === "equal") {
      i++;
      continue;
    }

    let delBuffer = "";
    let insBuffer = "";

    while (i < diff.length && (diff[i].type === "delete" || diff[i].type === "insert")) {
      if (diff[i].type === "delete") {
        delBuffer += diff[i].value;
      } else if (diff[i].type === "insert") {
        insBuffer += diff[i].value;
      }
      i++;
    }

    const cleanDel = delBuffer.trim();
    const cleanIns = insBuffer.trim();

    if (cleanDel && cleanIns) {
      changes.push({ type: "replace", original: cleanDel, suggested: cleanIns });
    } else if (cleanDel) {
      changes.push({ type: "delete", original: cleanDel, suggested: "" });
    } else if (cleanIns) {
      changes.push({ type: "insert", original: "", suggested: cleanIns });
    }
  }

  return changes;
}

/**
 * Renders the HTML representation for "Changes Only" mode.
 * @param {Array<{ type: string, original: string, suggested: string }>} changesList
 * @returns {string}
 */
export function renderChangesOnlyHtml(changesList) {
  if (!changesList || changesList.length === 0) {
    return `<div class="gr-no-changes-msg">✓ No textual modifications. Original text looks good!</div>`;
  }

  const itemsHtml = changesList.map((ch, idx) => {
    if (ch.type === "replace") {
      return `
        <div class="gr-change-row">
          <span class="gr-change-num">#${idx + 1}</span>
          <span class="gr-change-type badge-replace">Replace</span>
          <span class="gr-change-del">"${escapeHtml(ch.original)}"</span>
          <span class="gr-change-arrow">→</span>
          <span class="gr-change-ins">"${escapeHtml(ch.suggested)}"</span>
        </div>
      `;
    } else if (ch.type === "delete") {
      return `
        <div class="gr-change-row">
          <span class="gr-change-num">#${idx + 1}</span>
          <span class="gr-change-type badge-delete">Removed</span>
          <span class="gr-change-del">"${escapeHtml(ch.original)}"</span>
        </div>
      `;
    } else {
      return `
        <div class="gr-change-row">
          <span class="gr-change-num">#${idx + 1}</span>
          <span class="gr-change-type badge-insert">Added</span>
          <span class="gr-change-ins">"${escapeHtml(ch.suggested)}"</span>
        </div>
      `;
    }
  }).join("");

  return `
    <div class="gr-changes-list-container">
      <div class="gr-changes-list-header">
        <strong>${changesList.length} Proposed Change${changesList.length === 1 ? "" : "s"}:</strong>
      </div>
      <div class="gr-changes-list-items">
        ${itemsHtml}
      </div>
    </div>
  `;
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

