import { buildReviewPrompt, getPromptPreset, parseAiResponse } from "../lib/engine/promptPresets.js";
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
    expect(systemPrompt).toContain("OUTPUT FORMAT REQUIREMENTS");
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

  test("Parses valid structured JSON AI response", () => {
    const jsonOutput = JSON.stringify({
      rewritten: "She goes to the market.",
      category: "Grammar & Spelling",
      confidence: "high",
      explanation: "Corrected subject-verb agreement from 'go' to 'goes'."
    });

    const parsed = parseAiResponse(jsonOutput, "She go to the market.");
    expect(parsed.rewritten).toBe("She goes to the market.");
    expect(parsed.category).toBe("Grammar & Spelling");
    expect(parsed.confidence).toBe("high");
    expect(parsed.explanation).toContain("subject-verb agreement");
  });

  test("Parses markdown-fenced JSON AI response", () => {
    const fencedJson = "```json\n" + JSON.stringify({
      rewritten: "They are ready.",
      category: "Clarity & Flow",
      confidence: "medium",
      explanation: "Improved sentence flow."
    }) + "\n```";

    const parsed = parseAiResponse(fencedJson, "They is ready.");
    expect(parsed.rewritten).toBe("They are ready.");
    expect(parsed.category).toBe("Clarity & Flow");
  });

  test("Parses python triple-quoted and unescaped multiline JSON AI responses", () => {
    const rawAiOutput = `{
  "rewritten": """
Furthermore, another important aspect to consider is the setting of clear priorities. If everything is treated as an urgent emergency, then nothing is truly prioritized in the grand scheme of things. To illustrate this point, the Eisenhower Matrix can be used to categorize tasks into four distinct quadrants:
""",
  "category": "Grammar & Spelling",
  "confidence": "high",
  "explanation": "Changed 'like' to 'as' for grammatical correctness in comparisons, as 'treated as' is the standard phrase when describing how something is regarded or managed."
}`;

    const parsed = parseAiResponse(rawAiOutput, "Original text");
    expect(parsed.rewritten).toContain("Furthermore, another important aspect to consider");
    expect(parsed.rewritten).toContain("four distinct quadrants:");
    expect(parsed.rewritten).not.toContain('"""');
    expect(parsed.rewritten).not.toContain('"rewritten"');
    expect(parsed.category).toBe("Grammar & Spelling");
    expect(parsed.confidence).toBe("high");
    expect(parsed.explanation).toContain("Changed 'like' to 'as'");
  });

  test("Gracefully falls back when model returns plain text instead of JSON", () => {
    const plainText = "Here is the improved sentence with better clarity.";
    const parsed = parseAiResponse(plainText, "Original text.");
    expect(parsed.rewritten).toBe("Here is the improved sentence with better clarity.");
    expect(parsed.category).toBe("Grammar & Clarity");
    expect(parsed.confidence).toBe("high");
  });
});


