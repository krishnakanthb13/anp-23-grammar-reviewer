import { getActiveSession, setActiveSession } from "../data/store.js";
import { createProviderInstance, getProviderConfig } from "../providers/providerRegistry.js";
import { buildReviewPrompt, getPromptPreset, parseAiResponse } from "../engine/promptPresets.js";
import { ReviewSession } from "../engine/reviewSession.js";

let isReviewAllCancelled = false;

/**
 * Cancels any ongoing Review All batch process.
 */
export function cancelReviewAll() {
  isReviewAllCancelled = true;
}

/**
 * Returns whether review all is currently cancelled.
 * @returns {boolean}
 */
export function getIsReviewAllCancelled() {
  return isReviewAllCancelled;
}

/**
 * Executes AI review on a single item or batches all items.
 * 
 * @param {object} app
 * @param {number} [itemIndex] - Specific item index or -1 for current item
 * @param {string} [promptOverride] - Custom prompt if re-reviewing
 */
export async function handleRunReview(app, itemIndex = -1, promptOverride = "") {
  const session = getActiveSession();
  if (!session) {
    throw new Error("No active review session found.");
  }

  const targetIdx = itemIndex >= 0 ? itemIndex : session.currentIndex;
  const item = session.items[targetIdx];
  if (!item) {
    throw new Error(`Item at index ${targetIdx} does not exist.`);
  }

  const config = getProviderConfig(app);
  const targetProvider = session.provider || config.provider;
  const apiKey = config.allKeys[targetProvider] || config.apiKey;

  const provider = createProviderInstance({
    provider: targetProvider,
    apiKey,
    baseUrl: targetProvider === "Ollama (Local)" ? config.customBaseUrl : undefined,
    defaultModel: session.model || config.customModel
  });

  const preset = getPromptPreset(session.promptPresetId);
  const instruction = promptOverride || session.customPrompt || preset.instruction;

  const { systemPrompt, userPrompt } = buildReviewPrompt({
    instruction,
    targetText: item.original,
    context: session.noteTitle,
    granularity: session.granularity
  });

  const prevStatus = item.status;
  item.status = "reviewing";

  try {
    const aiOutput = await provider.complete({
      prompt: userPrompt,
      systemPrompt,
      model: session.model
    });

    const parsed = parseAiResponse(aiOutput, item.original);
    session.setSuggestion(targetIdx, parsed.rewritten, {
      category: parsed.category,
      confidence: parsed.confidence,
      explanation: parsed.explanation
    });

    return session;
  } catch (err) {
    item.status = prevStatus === "pending" ? "error" : prevStatus;
    throw err;
  }
}

/**
 * Runs review on all pending inspectable items in the session sequentially with cancellation support.
 * @param {object} app
 * @returns {Promise<{ reviewedCount: number, failedCount: number, failedIndices: number[], cancelled: boolean }>}
 */
export async function handleReviewAll(app) {
  const session = getActiveSession();
  if (!session) {
    return { reviewedCount: 0, failedCount: 0, failedIndices: [], cancelled: false };
  }

  isReviewAllCancelled = false;
  let reviewedCount = 0;
  let failedCount = 0;
  const failedIndices = [];

  for (let i = 0; i < session.items.length; i++) {
    if (isReviewAllCancelled) {
      console.log("[GrammarReviewer] Review All was cancelled by user.");
      break;
    }

    const item = session.items[i];
    if (item.isInspectable && (item.status === "pending" || item.status === "error")) {
      try {
        await handleRunReview(app, i);
        reviewedCount++;
      } catch (err) {
        failedCount++;
        failedIndices.push(i);
        console.warn(`[GrammarReviewer] Error reviewing item #${i}:`, err);
      }
    }
  }

  return {
    reviewedCount,
    failedCount,
    failedIndices,
    cancelled: isReviewAllCancelled
  };
}

/**
 * Changes granularity mode (retokenizes original note content).
 * @param {object} app
 * @param {string} newMode - "full" | "paragraph" | "sentence"
 */
export function handleSetGranularity(app, newMode) {
  const session = getActiveSession();
  if (!session) return;
  if (session.granularity === newMode) return;

  const newSession = new ReviewSession({
    noteUUID: session.noteUUID,
    noteTitle: session.noteTitle,
    noteTags: session.noteTags || [],
    originalContent: session.originalContent,
    granularity: newMode,
    promptPresetId: session.promptPresetId,
    customPrompt: session.customPrompt,
    provider: session.provider,
    model: session.model
  });

  setActiveSession(newSession);
}


