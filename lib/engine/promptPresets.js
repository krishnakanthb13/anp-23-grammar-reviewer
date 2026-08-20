import { PREBUILT_PROMPTS } from "../constants.js";

/**
 * Builds standard system and user prompts for grammar and style review.
 * 
 * @param {object} options
 * @param {string} options.instruction - The specific guidance or preset instruction.
 * @param {string} options.targetText - The chunk or full note text to review.
 * @param {string} [options.context] - Optional surrounding context or document title.
 * @param {string} [options.granularity] - "full" | "paragraph" | "sentence"
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
export function buildReviewPrompt({ instruction, targetText, context = "", granularity = "paragraph" }) {
  const systemPrompt = `You are a master copyeditor and high-school writing teacher.
Your job is to rewrite and improve the user's provided markdown text according to the specific editing instruction.

STRICT EDITING RULES:
1. Return ONLY the rewritten text. Do NOT include any intro, outro, preamble, conversational remarks, or markdown backticks enclosing the entire response.
2. Preserve all Markdown formatting (headers #, bold **, italics *, links [], task lists [ ], bullets -) unless the edit explicitly targets that structure.
3. If no improvements are necessary, return the exact original text verbatim.
4. Maintain the author's core ideas, tone, and factual content while fulfilling the instruction.`;

  const userPrompt = `Editing Instruction:
${instruction}

Text to review (${granularity}):
"""
${targetText}
"""

Rewritten version:`;

  return { systemPrompt, userPrompt };
}

/**
 * Retrieves a preset prompt by ID or returns the default grammar prompt.
 * @param {string} id
 */
export function getPromptPreset(id) {
  const found = PREBUILT_PROMPTS.find(p => p.id === id);
  return found || PREBUILT_PROMPTS[0];
}
