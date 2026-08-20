import { buildReviewPrompt, getPromptPreset } from "../lib/engine/promptPresets.js";
import { PREBUILT_PROMPTS } from "../lib/constants.js";

describe("Prompt Presets — Happy Path", () => {
  test("Builds standard system and user prompt with instruction", () => {
    const { systemPrompt, userPrompt } = buildReviewPrompt({
      instruction: "Correct grammar and spelling.",
      targetText: "Some text with a errer.",
      context: "My Essay",
      granularity: "paragraph"
    });

    expect(systemPrompt).toContain("You are a master copyeditor");
    expect(systemPrompt).toContain("STRICT EDITING RULES");
    expect(userPrompt).toContain("Editing Instruction:");
    expect(userPrompt).toContain("Correct grammar and spelling.");
    expect(userPrompt).toContain("Some text with a errer.");
  });

  test("Retrieves existing prompt preset by ID", () => {
    const preset = getPromptPreset("concise_shorten");
    expect(preset).toBeDefined();
    expect(preset.name).toContain("Shorten & Make Concise");
    expect(preset.instruction).toContain("concise");
  });

  test("Falls back to grammar_spelling for unknown preset ID", () => {
    const preset = getPromptPreset("non_existent_id");
    expect(preset).toBe(PREBUILT_PROMPTS[0]);
  });
});
