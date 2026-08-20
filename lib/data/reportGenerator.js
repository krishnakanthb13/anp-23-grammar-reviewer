import { TAG_GRAMMAR_CHANGES } from "../constants.js";

/**
 * Generates human-readable Markdown for the Changes iteration report note.
 * 
 * @param {object} params
 * @param {object} params.session - The ReviewSession instance
 * @param {string} params.sourceNoteTitle
 * @param {string} params.sourceNoteUUID
 * @param {string} params.finalContent
 * @returns {{ name: string, tags: string[], content: string }}
 */
export function generateChangesReport({ session, sourceNoteTitle, sourceNoteUUID, finalContent }) {
  const now = new Date();
  const dateStr = now.toISOString().replace("T", " ").substring(0, 16);
  const fullDateStr = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
  const metrics = session.getMetrics();
  const titleName = sourceNoteTitle || "Untitled Note";

  const sourceLink = sourceNoteUUID
    ? `[${titleName}](https://www.amplenote.com/notes/${sourceNoteUUID})`
    : titleName;

  const promptName = session.customPrompt
    ? `Custom: "${session.customPrompt}"`
    : `Preset: ${session.promptPresetId.replace(/_/g, " ")}`;

  const md = `# 📝 Grammar Review Changes: ${titleName}

> **Source Note:** ${sourceLink}  
> **Review Date:** ${fullDateStr}  
> **AI Engine:** \`${session.provider}\` · Model: \`${session.model || "default"}\`  
> **Granularity:** \`${session.granularity.toUpperCase()}\` · **Style:** *${promptName}*  
> **Diff Summary:** \`+${metrics.totalAdditions} words added\`, \`-${metrics.totalDeletions} words removed\` (Accepted: **${metrics.accepted}**, Rejected: **${metrics.rejected}**)

---

## 📊 Summary of Changes

${generateItemChangesTable(session.items)}

---

## 📄 Complete Revised Document

${finalContent}

---

## 📜 Original Document Snapshot

<details>
<summary>Click to view original text before review</summary>

\`\`\`markdown
${session.originalContent}
\`\`\`

</details>

---
*Generated automatically by Amplenote Grammar & Style Reviewer Plugin*
`;

  return {
    name: `Grammar Changes: ${titleName} (${dateStr})`,
    tags: [TAG_GRAMMAR_CHANGES],
    content: md
  };
}

/**
 * Generates an itemized markdown list of changes made.
 * @param {Array} items
 * @returns {string}
 */
function generateItemChangesTable(items) {
  const inspectableItems = items.filter(i => i.isInspectable);
  if (inspectableItems.length === 0) {
    return "*No inspectable items in this review pass.*";
  }

  const changeBlocks = inspectableItems.map((item, idx) => {
    let statusBadge = "❌ Kept Original";
    let appliedText = item.original;

    if (item.status === "accepted") {
      statusBadge = "✅ Accepted";
      appliedText = item.suggestion || item.original;
    } else if (item.status === "modified") {
      statusBadge = "✏️ Manually Edited";
      appliedText = item.customEdit || item.suggestion || item.original;
    }

    return `### Item #${idx + 1} (${statusBadge} · *${item.type}*)
- **Original Draft:**  
  ${item.original}
- **Applied Output:**  
  ${appliedText}
`;
  }).join("\n");

  return changeBlocks;
}
