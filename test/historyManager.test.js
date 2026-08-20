import { generateHistoryRecord, parseHistoryNotes } from "../lib/data/historyManager.js";
import { ReviewSession } from "../lib/engine/reviewSession.js";

describe("History Manager — Happy Path", () => {
  test("Generates structured JSON history note with markdown summary", () => {
    const session = new ReviewSession({
      noteUUID: "source-123",
      noteTitle: "Article Draft",
      originalContent: "Original prose.",
      provider: "OpenRouter",
      model: "openai/gpt-oss-120b:free"
    });

    session.setSuggestion(0, "Polished prose.");
    session.accept(0);

    const record = generateHistoryRecord({
      session,
      sourceNoteTitle: "Article Draft",
      sourceNoteUUID: "source-123",
      finalContent: "Polished prose."
    });

    expect(record.name).toContain("Grammar History: Article Draft");
    expect(record.tags).toContain("-reports/-grammar/-history");
    expect(record.content).toContain("```json");
    expect(record.content).toContain('"schemaVersion": 1');
    expect(record.content).toContain('"provider": "OpenRouter"');
  });

  test("Parses JSON embedded history notes accurately", () => {
    const mockNote = {
      uuid: "hist-note-1",
      name: "Grammar History: Test (2026-08-20 12:00)",
      body: `# Title\n\`\`\`json\n{\n  "timestamp": 1755691200,\n  "sourceNote": { "uuid": "orig-1", "title": "Original" },\n  "session": { "provider": "Groq", "metrics": { "accepted": 3 } }\n}\n\`\`\``
    };

    const parsed = parseHistoryNotes([mockNote]);
    expect(parsed.length).toBe(1);
    expect(parsed[0].sourceNote.uuid).toBe("orig-1");
    expect(parsed[0].session.provider).toBe("Groq");
    expect(parsed[0].session.metrics.accepted).toBe(3);
  });
});

describe("History Manager — Edge Cases & Fallbacks", () => {
  test("Handles fallback to human-readable markdown reports when JSON is absent", () => {
    const legacyReportNote = {
      uuid: "legacy-1",
      name: "Grammar Changes: Legacy Note (2026-08-20)",
      body: `# Grammar Review Changes: Legacy Note\n**Date:** 2026-08-20 10:00 UTC\n**Provider:** OpenAI\nDiff: 4 changes applied`
    };

    const parsed = parseHistoryNotes([legacyReportNote]);
    expect(parsed.length).toBe(1);
    expect(parsed[0].sourceNote.title).toBe("Legacy Note");
    expect(parsed[0].session.provider).toBe("OpenAI");
  });

  test("Deduplicates fallback records if JSON record for same note and timestamp exists", () => {
    const sessionTime = Math.floor(new Date("2026-08-20 10:00 UTC").getTime() / 1000);
    const jsonNote = {
      uuid: "hist-1",
      name: "Grammar History: Note (2026-08-20)",
      body: `\`\`\`json\n{\n  "timestamp": ${sessionTime},\n  "sourceNote": { "uuid": "same-uuid", "title": "Note" }\n}\n\`\`\``
    };

    const duplicateFallbackNote = {
      uuid: "changes-1",
      name: "Grammar Changes: Note (2026-08-20)",
      body: `# 📝 Grammar Changes: Note\n**Review Date:** 2026-08-20 10:00 UTC\nSource Note: [Note](https://amplenote.com/notes/same-uuid)`
    };

    const parsed = parseHistoryNotes([jsonNote, duplicateFallbackNote]);
    expect(parsed.length).toBe(1);
  });

  test("Returns empty array when notes list is empty or invalid", () => {
    expect(parseHistoryNotes([])).toEqual([]);
    expect(parseHistoryNotes(null)).toEqual([]);
    expect(parseHistoryNotes(undefined)).toEqual([]);
  });
});
