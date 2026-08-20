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
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const dateStr = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";
  const metrics = session.getMetrics();

  const sourceLink = sourceNoteUUID
    ? `[${sourceNoteTitle || "Source Note"}](https://www.amplenote.com/notes/${sourceNoteUUID})`
    : (sourceNoteTitle || "Untitled Note");

  const md = `# Grammar Review Changes Log — ${timestamp}

> **Source Note:** ${sourceLink}  
> **Review Date:** ${dateStr}  
> **AI Provider / Model:** \`${session.provider}\` / \`${session.model || "default"}\`  
> **Granularity Mode:** \`${session.granularity}\`  
> **Prompt Applied:** ${session.customPrompt ? `*Custom Prompt:* "${session.customPrompt}"` : `*Preset:* ${session.promptPresetId}`}  
> **Diff Summary:** \`+${metrics.totalAdditions} words added\`, \`-${metrics.totalDeletions} words removed\` (Reviewed: ${metrics.reviewed}/${metrics.total}, Accepted: ${metrics.accepted}, Rejected: ${metrics.rejected})

---

## 📝 Final Reviewed Content

${finalContent}

---

## 🔄 Review Iteration History

### Initial Content
\`\`\`markdown
${session.originalContent}
\`\`\`

### Iteration ${session.iteration || 1} Review Details
- **Timestamp:** ${dateStr}
- **Accepted Improvements:** ${metrics.accepted}
- **Rejected/Kept Original:** ${metrics.rejected}

${generateItemChangesList(session.items)}

---
*Generated automatically by Amplenote Grammar Reviewer Plugin*
`;

  return {
    name: timestamp,
    tags: [TAG_GRAMMAR_CHANGES],
    content: md
  };
}

/**
 * Generates markdown list of changes made item by item.
 * @param {Array} items
 * @returns {string}
 */
function generateItemChangesList(items) {
  const changedItems = items.filter(i => i.isInspectable && i.diff && i.diff.hasChanges);
  if (changedItems.length === 0) {
    return "*No specific sentence/paragraph changes were applied.*";
  }

  return changedItems.map((item, idx) => {
    const statusIcon = item.status === "accepted" ? "✅ Accepted" : (item.status === "modified" ? "✏️ Modified" : "❌ Rejected");
    return `#### Change #${idx + 1} (${statusIcon})
- **Original:** ${item.original}
- **Suggested / Applied:** ${item.status === "modified" ? item.customEdit : item.suggestion}
`;
  }).join("\n");
}
