import { jest } from "@jest/globals";
import { handleSaveAndCommit } from "../lib/features/saveHandler.js";
import { setActiveSession, clearActiveSession } from "../lib/data/store.js";
import { ReviewSession } from "../lib/engine/reviewSession.js";

describe("Save Handler — Happy Path", () => {
  beforeEach(() => {
    clearActiveSession();
  });

  test("Directly overwrites source note with reconstructed content", async () => {
    const session = new ReviewSession({
      noteUUID: "target-note-uuid",
      noteTitle: "Important Note",
      originalContent: "Original content."
    });

    session.setSuggestion(0, "Polished content.");
    session.accept(0);
    setActiveSession(session);

    const mockApp = {
      replaceNoteContent: jest.fn().mockResolvedValue(true),
      createNote: jest.fn(),
      insertNoteContent: jest.fn()
    };

    const res = await handleSaveAndCommit(mockApp, false);
    expect(res.success).toBe(true);
    expect(mockApp.replaceNoteContent).toHaveBeenCalledWith(
      { uuid: "target-note-uuid" },
      "Polished content."
    );
    expect(mockApp.createNote).not.toHaveBeenCalled();
  });

  test("Creates companion audit notes when explicitly enabled", async () => {
    const session = new ReviewSession({
      noteUUID: "target-note-uuid",
      noteTitle: "Audit Note Test",
      originalContent: "Original line."
    });

    session.setSuggestion(0, "Revised line.");
    session.accept(0);
    setActiveSession(session);

    const mockApp = {
      replaceNoteContent: jest.fn().mockResolvedValue(true),
      createNote: jest.fn()
        .mockResolvedValueOnce("changes-uuid-1")
        .mockResolvedValueOnce("history-uuid-2"),
      insertNoteContent: jest.fn().mockResolvedValue(true)
    };

    const res = await handleSaveAndCommit(mockApp, true);
    expect(res.success).toBe(true);
    expect(res.changesNoteUUID).toBe("changes-uuid-1");
    expect(res.historyNoteUUID).toBe("history-uuid-2");
    expect(mockApp.createNote).toHaveBeenCalledTimes(2);
    expect(mockApp.insertNoteContent).toHaveBeenCalledTimes(2);
  });
});

describe("Save Handler — Error Handling & Validation", () => {
  beforeEach(() => {
    clearActiveSession();
  });

  test("Throws error when no active review session exists", async () => {
    const mockApp = { replaceNoteContent: jest.fn() };
    await expect(handleSaveAndCommit(mockApp)).rejects.toThrow(
      "No active review session to save."
    );
  });

  test("Throws error when target note UUID is missing or empty", async () => {
    const session = new ReviewSession({
      noteUUID: "",
      originalContent: "Draft."
    });
    setActiveSession(session);

    const mockApp = { replaceNoteContent: jest.fn() };
    await expect(handleSaveAndCommit(mockApp)).rejects.toThrow(
      "Target note UUID is missing or invalid."
    );
  });

  test("Propagates API failure message if replaceNoteContent fails", async () => {
    const session = new ReviewSession({
      noteUUID: "uuid-fail",
      originalContent: "Draft."
    });
    setActiveSession(session);

    const mockApp = {
      replaceNoteContent: jest.fn().mockRejectedValue(new Error("Network timeout"))
    };

    await expect(handleSaveAndCommit(mockApp)).rejects.toThrow(
      "Failed to update note (uuid-fail): Network timeout"
    );
  });

  test("Aborts save when external note modification is detected and user declines overwrite", async () => {
    const session = new ReviewSession({
      noteUUID: "target-note-uuid",
      originalContent: "Original content baseline."
    });
    session.setSuggestion(0, "Polished content.");
    session.accept(0);
    setActiveSession(session);

    const mockApp = {
      getNoteContent: jest.fn().mockResolvedValue("Someone edited this externally!"),
      prompt: jest.fn().mockResolvedValue(false), // User declines overwrite
      replaceNoteContent: jest.fn()
    };

    const res = await handleSaveAndCommit(mockApp);
    expect(res.success).toBe(false);
    expect(res.cancelled).toBe(true);
    expect(mockApp.replaceNoteContent).not.toHaveBeenCalled();
  });

  test("Proceeds with save when external note modification is detected and user confirms overwrite", async () => {
    const session = new ReviewSession({
      noteUUID: "target-note-uuid",
      originalContent: "Original content baseline."
    });
    session.setSuggestion(0, "Polished content.");
    session.accept(0);
    setActiveSession(session);

    const mockApp = {
      getNoteContent: jest.fn().mockResolvedValue("Someone edited this externally!"),
      prompt: jest.fn().mockResolvedValue(true), // User confirms overwrite
      replaceNoteContent: jest.fn().mockResolvedValue(true)
    };

    const res = await handleSaveAndCommit(mockApp);
    expect(res.success).toBe(true);
    expect(mockApp.replaceNoteContent).toHaveBeenCalledWith(
      { uuid: "target-note-uuid" },
      "Polished content."
    );
  });
});

