import { TAG_GRAMMAR_HISTORY } from "../constants.js";

/**
 * Generates machine-readable JSON history note data.
 * 
 * @param {object} params
 * @param {object} params.session - The ReviewSession instance
 * @param {string} params.sourceNoteTitle
 * @param {string} params.sourceNoteUUID
 * @param {string} params.finalContent
 * @returns {{ name: string, tags: string[], content: string }}
 */
export function generateHistoryRecord({ session, sourceNoteTitle, sourceNoteUUID, finalContent }) {
  const now = new Date();
  const timestamp = Math.floor(now.getTime() / 1000);
  const dateStr = now.toISOString().replace("T", " ").substring(0, 16);
  const fullDateStr = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
  const metrics = session.getMetrics();
  const titleName = sourceNoteTitle || "Untitled Note";

  const sourceLink = sourceNoteUUID
    ? `[${titleName}](https://www.amplenote.com/notes/${sourceNoteUUID})`
    : titleName;

  const record = {
    schemaVersion: 1,
    timestamp,
    isoDate: now.toISOString(),
    sourceNote: {
      uuid: sourceNoteUUID,
      title: titleName
    },
    session: {
      id: session.sessionId,
      provider: session.provider,
      model: session.model,
      granularity: session.granularity,
      promptPresetId: session.promptPresetId,
      customPrompt: session.customPrompt,
      iteration: session.iteration,
      metrics: session.getMetrics()
    },
    items: session.items.map(item => ({
      id: item.id,
      original: item.original,
      type: item.type,
      status: item.status,
      suggestion: item.suggestion,
      customEdit: item.customEdit,
      diffStats: item.diff?.stats || null
    })),
    originalContent: session.originalContent,
    finalContent
  };

  const markdownContent = `# 📜 Grammar Review History: ${titleName}

> **Source Note:** ${sourceLink}  
> **Timestamp:** ${fullDateStr}  
> **AI Engine:** \`${session.provider}\` · Model: \`${session.model || "default"}\`  
> **Changes:** **${metrics.accepted}** accepted, **${metrics.rejected}** rejected (out of ${metrics.total} items)

---

## 💾 Audit Log Payload

\`\`\`json
${JSON.stringify(record, null, 2)}
\`\`\`
`;

  return {
    name: `Grammar History: ${titleName} (${dateStr})`,
    tags: [TAG_GRAMMAR_HISTORY],
    content: markdownContent
  };
}

/**
 * Parses history records from Amplenote notes tagged with -reports/-grammar/-history.
 * @param {Array<{ uuid: string, name: string, body?: string, content?: string }>} notes
 * @returns {Array<object>}
 */
export function parseHistoryNotes(notes = []) {
  if (!Array.isArray(notes)) return [];

  const jsonRecords = [];
  const fallbackRecords = [];
  const knownTimestamps = new Set();
  const knownSourceNoteTimestamps = new Set();

  for (const note of notes) {
    if (!note || typeof note !== "object") continue;
    const raw = note.body || note.content || "";
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1]);
        const ts = parsed.timestamp || parseInt(note.name, 10) || 0;
        const key = `${parsed.sourceNote?.uuid || ""}_${Math.floor(ts / 60)}`;
        knownTimestamps.add(ts);
        knownSourceNoteTimestamps.add(key);

        jsonRecords.push({
          noteUUID: note.uuid,
          noteName: note.name,
          ...parsed,
          timestamp: ts
        });
      } catch (err) {
        console.warn("[GrammarReviewer] Could not parse history record for note:", note.uuid, err);
      }
    } else if (raw && (raw.includes("Grammar Review") || raw.includes("Grammar & Style") || raw.includes("Changes Report") || raw.includes("Grammar Changes"))) {
      // Fallback parser for standalone human-readable markdown revision report notes
      const titleMatch = raw.match(/# (?:(?:📝|📜) )?(?:Grammar (?:& Style )?Review )?(?:Changes|Report)?(?:\s*:\s*|\s+)(.*)/i) ||
                         raw.match(/Source Note:\s*\[([^\]]+)\]/i);
      const uuidMatch = raw.match(/amplenote\.com\/notes\/([a-zA-Z0-9_-]+)/i);
      const dateMatch = raw.match(/\*\*Date:\*\*\s*(.*)/i) || raw.match(/\*\*Review Date:\*\*\s*(.*)/i) || raw.match(/Date:\s*(.*)/i);
      const changesMatch = raw.match(/(\d+)\s*(?:changes?|replacements?|items?)/i);
      const providerMatch = raw.match(/(?:\*\*)?Provider:(?:\*\*)?\s*([^\n\r*]+)/i) || raw.match(/AI Engine:\s*`([^`]+)`/i);
      const ts = parseInt(note.name, 10) || (dateMatch ? Math.floor(new Date(dateMatch[1]).getTime() / 1000) : 0);

      fallbackRecords.push({
        noteUUID: note.uuid,
        noteName: note.name,
        timestamp: ts || Math.floor(Date.now() / 1000),
        isoDate: dateMatch ? dateMatch[1].trim() : new Date().toISOString(),
        sourceNote: {
          uuid: uuidMatch ? uuidMatch[1] : note.uuid,
          title: titleMatch ? titleMatch[1].trim() : (note.name || "Grammar Review")
        },
        session: {
          provider: providerMatch ? providerMatch[1].trim() : "AI Review",
          granularity: "review",
          metrics: { accepted: changesMatch ? parseInt(changesMatch[1], 10) : 1 }
        }
      });
    }
  }

  // If JSON records exist, only include fallback records that do not belong to the same session/timestamp
  const finalRecords = [...jsonRecords];
  for (const fb of fallbackRecords) {
    const key = `${fb.sourceNote?.uuid || ""}_${Math.floor(fb.timestamp / 60)}`;
    if (!knownTimestamps.has(fb.timestamp) && !knownSourceNoteTimestamps.has(key)) {
      finalRecords.push(fb);
    }
  }

  // Sort newest first
  return finalRecords.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}
