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
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const record = {
    schemaVersion: 1,
    timestamp: parseInt(timestamp, 10),
    isoDate: new Date().toISOString(),
    sourceNote: {
      uuid: sourceNoteUUID,
      title: sourceNoteTitle
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

  // Wrapped in a markdown code fence for clean note storage
  const markdownContent = `# Grammar Review History Record (${timestamp})

\`\`\`json
${JSON.stringify(record, null, 2)}
\`\`\`
`;

  return {
    name: timestamp,
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
  const records = [];

  for (const note of notes) {
    const raw = note.body || note.content || "";
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1]);
        records.push({
          noteUUID: note.uuid,
          noteName: note.name,
          ...parsed
        });
      } catch (err) {
        console.warn("[GrammarReviewer] Could not parse history record for note:", note.uuid, err);
      }
    }
  }

  // Sort newest first
  return records.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}
