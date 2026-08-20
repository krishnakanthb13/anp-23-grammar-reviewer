import { PREBUILT_PROMPTS } from "../constants.js";

/**
 * Builds standard system and user prompts for grammar and style review,
 * requesting structured JSON output with explanations, categories, and confidence.
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
Your job is to rewrite and improve the user's provided markdown text according to the specific editing instruction, and provide educational commentary explaining your edits.

OUTPUT FORMAT REQUIREMENTS:
You MUST respond with a valid JSON object matching this exact schema:
{
  "rewritten": "The complete rewritten markdown text",
  "category": "Grammar & Spelling | Clarity & Flow | Tone & Style | Conciseness | Punctuation",
  "confidence": "high | medium | low",
  "explanation": "A concise 1-2 sentence educational explanation of the improvements made"
}

STRICT EDITING RULES:
1. Preserve all Markdown formatting (headers #, bold **, italics *, links [], task lists [ ], bullets -) unless the edit explicitly targets that structure.
2. If no improvements are necessary, return the exact original text in "rewritten", "No Changes Needed" in "category", and explain why the text is already effective.
3. Maintain the author's core ideas, tone, and factual content while fulfilling the instruction.
4. Output valid JSON ONLY. Use standard JSON double quotes (not python triple quotes). Escape any quotes or newlines inside strings.`;

  const userPrompt = `Editing Instruction:
${instruction}

Context: ${context || "Standard Note"}
Granularity: ${granularity}

Text to review:
<<<INPUT_TEXT_START>>>
${targetText}
<<<INPUT_TEXT_END>>>`;

  return { systemPrompt, userPrompt };
}

/**
 * Robust parser for AI responses, handling structured JSON output, markdown-fenced JSON,
 * python triple-quote strings, or falling back gracefully to plain text output.
 * 
 * @param {string} rawOutput
 * @param {string} [originalText=""]
 * @returns {{ rewritten: string, category: string, confidence: string, explanation: string }}
 */
export function parseAiResponse(rawOutput, originalText = "") {
  if (!rawOutput || typeof rawOutput !== "string") {
    return {
      rewritten: originalText,
      category: "No Changes Needed",
      confidence: "high",
      explanation: "No response received from AI provider."
    };
  }

  const trimmed = rawOutput.trim();

  // 1. Try extracting JSON from markdown code fence ```json ... ``` or ``` ... ```
  const jsonFenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const potentialJson = jsonFenceMatch ? jsonFenceMatch[1].trim() : trimmed;

  // 2. Direct JSON.parse attempt
  if (potentialJson.startsWith("{") && potentialJson.endsWith("}")) {
    try {
      const parsed = JSON.parse(potentialJson);
      const rewritten = typeof parsed.rewritten === "string"
        ? parsed.rewritten
        : (typeof parsed.suggestion === "string" ? parsed.suggestion : (typeof parsed.revised_text === "string" ? parsed.revised_text : ""));

      if (rewritten !== undefined && rewritten !== null) {
        return {
          rewritten: cleanAiText(rewritten),
          category: parsed.category || "Grammar & Clarity",
          confidence: (parsed.confidence || "high").toLowerCase(),
          explanation: parsed.explanation || (parsed.summary || "")
        };
      }
    } catch {
      // JSON parse failed (e.g. unescaped newlines or triple quotes), proceed to fallback field extraction
    }
  }

  // 3. Robust Extraction: Extract JSON keys even if JSON contains unescaped newlines or python triple quotes """..."""
  if (potentialJson.includes('"rewritten"') || potentialJson.includes('"suggestion"') || potentialJson.includes('"revised_text"') || potentialJson.includes('"output"')) {
    const rewrittenVal = extractQuotedField(potentialJson, ["rewritten", "revised_text", "revisedText", "suggestion", "improved", "output", "text"]);
    if (rewrittenVal !== null && rewrittenVal.length > 0) {
      const categoryVal = extractQuotedField(potentialJson, ["category"]) || "Grammar & Clarity";
      const confidenceVal = (extractQuotedField(potentialJson, ["confidence"]) || "high").toLowerCase();
      const explanationVal = extractQuotedField(potentialJson, ["explanation", "reason", "rationale", "summary"]) || "";

      return {
        rewritten: cleanAiText(rewrittenVal),
        category: categoryVal,
        confidence: confidenceVal,
        explanation: explanationVal
      };
    }
  }

  // 4. Plain Text Fallback: Clean response of accidental code fences or prefixes
  const cleaned = cleanAiText(trimmed);

  return {
    rewritten: cleaned,
    category: "Grammar & Clarity",
    confidence: "high",
    explanation: ""
  };
}

/**
 * Robustly extracts a quoted field value matching any opening delimiter (""", ''', ", ', `)
 * and its exact matching closing delimiter.
 * 
 * @param {string} source
 * @param {Array<string>} fieldNames
 * @returns {string|null}
 */
function extractQuotedField(source, fieldNames) {
  const pattern = new RegExp(`"(?:${fieldNames.join("|")})"\\s*:\\s*("""|'''|"|'|\`)`, "i");
  const match = source.match(pattern);
  if (!match) return null;

  const quote = match[1];
  const startIdx = match.index + match[0].length;
  const endIdx = source.indexOf(quote, startIdx);
  if (endIdx === -1) {
    return source.slice(startIdx).replace(/[\s\r\n}]+$/, "").trim();
  }
  return source.slice(startIdx, endIdx).trim();
}

/**
 * Strips surrounding quotes or fences from plain-text AI output.
 * @param {string} text
 * @returns {string}
 */
function cleanAiText(text) {
  let cleaned = text.trim();
  // Strip leading/trailing single backtick block if entire string is wrapped
  if (cleaned.startsWith("```") && cleaned.endsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim();
  }
  // Strip Rewritten version: prefix if present
  cleaned = cleaned.replace(/^(?:Rewritten version|Revised text|Output):\s*/i, "").trim();
  return cleaned;
}

/**
 * Retrieves a preset prompt by ID or returns the default grammar prompt.
 * @param {string} id
 */
export function getPromptPreset(id) {
  const found = PREBUILT_PROMPTS.find(p => p.id === id);
  return found || PREBUILT_PROMPTS[0];
}

