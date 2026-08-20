import { getActiveSession, setActiveSession } from "../data/store.js";
import { createProviderInstance, getProviderConfig } from "../providers/providerRegistry.js";
import { buildReviewPrompt, getPromptPreset } from "../engine/promptPresets.js";
import { ReviewSession } from "../engine/reviewSession.js";

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

  const aiOutput = await provider.complete({
    prompt: userPrompt,
    systemPrompt,
    model: session.model
  });

  session.setSuggestion(targetIdx, aiOutput);
  return session;
}

/**
 * Runs review on all pending inspectable items in the session sequentially.
 * @param {object} app
 */
export async function handleReviewAll(app) {
  const session = getActiveSession();
  if (!session) return;

  for (let i = 0; i < session.items.length; i++) {
    const item = session.items[i];
    if (item.isInspectable && item.status === "pending") {
      try {
        await handleRunReview(app, i);
      } catch (err) {
        console.warn(`[GrammarReviewer] Error reviewing item #${i}:`, err);
      }
    }
  }
}

/**
 * Changes granularity mode (retokenizes original note content).
 * @param {object} app
 * @param {string} newMode - "full" | "paragraph" | "sentence"
 */
export function handleSetGranularity(app, newMode) {
  const session = getActiveSession();
  if (!session) return;

  const newSession = new ReviewSession({
    noteUUID: session.noteUUID,
    noteTitle: session.noteTitle,
    originalContent: session.originalContent,
    granularity: newMode,
    promptPresetId: session.promptPresetId,
    customPrompt: session.customPrompt,
    provider: session.provider,
    model: session.model
  });

  setActiveSession(newSession);
}
