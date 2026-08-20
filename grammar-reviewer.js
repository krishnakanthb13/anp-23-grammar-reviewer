import { getActiveSession, setActiveSession, clearActiveSession } from "./lib/data/store.js";
import { ReviewSession } from "./lib/engine/reviewSession.js";
import { getProviderConfig } from "./lib/providers/providerRegistry.js";
import { launchReviewer } from "./lib/features/launcher.js";
import { handleRunReview, handleReviewAll, handleSetGranularity } from "./lib/features/reviewWorkflow.js";
import { handleSaveAndCommit } from "./lib/features/saveHandler.js";
import { loadHistoryRecords } from "./lib/features/historyViewer.js";
import { buildDashboardTemplate } from "./lib/ui/dashboardTemplate.js";
import { DEFAULT_MODELS, DEFAULT_PROVIDER } from "./lib/constants.js";

let activeTabState = "review";

/**
 * Safely parses the custom AI model setting JSON dictionary.
 * @param {string} [rawSetting]
 * @returns {Record<string, string>}
 */
function parseCustomModelSetting(rawSetting) {
  if (!rawSetting || typeof rawSetting !== "string") return {};
  const trimmed = rawSetting.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

const plugin = {
  // App-level action: launches Grammar Reviewer across notes
  appOption: {
    "Open Dashboard": async function(app) {
      await launchReviewer(app);
    }
  },

  // Note-level action: reviews the active note directly
  noteOption: {
    "Open Dashboard": async function(app, noteUUID) {
      await launchReviewer(app, noteUUID);
    }
  },

  /**
   * Dispatches events from the embed iframe UI.
   * @param {object} app
   * @param  {...any} args
   */
  async onEmbedCall(app, ...args) {
    const action = args[0];
    const session = getActiveSession();

    try {
      let requiresReRender = true;

      switch (action) {
        case "selectNote":
          await launchReviewer(app, null, true);
          requiresReRender = false;
          break;

        case "restoreSession": {
          if (args[1]) {
            const restored = ReviewSession.fromJSON(args[1]);
            if (restored) {
              setActiveSession(restored);
            }
          }
          requiresReRender = false;
          break;
        }

        case "clearSession":
          clearActiveSession();
          break;

        case "refreshHistory":
          activeTabState = "history";
          requiresReRender = true;
          break;

        case "setTab":
          activeTabState = args[1] || "review";
          requiresReRender = false;
          break;

        case "setTheme":
          requiresReRender = false;
          break;

        case "switchSettingsProvider":
          requiresReRender = false;
          break;

        case "saveSettings": {
          const settingsPayload = args[1] || {};
          const targetProvider = settingsPayload.provider;
          const apiKey = settingsPayload.apiKey;
          const customModel = settingsPayload.customModel;

          if (typeof app.setSetting === "function") {
            if (targetProvider) {
              await app.setSetting("AI Provider", targetProvider);
              if (apiKey !== undefined) {
                await app.setSetting(`${targetProvider} API Key`, apiKey.trim());
              }
            }

            // Persist model selection per-provider into existing Custom AI Model setting as JSON
            if (targetProvider && customModel !== undefined) {
              const modelMap = parseCustomModelSetting(app.settings?.["Custom AI Model"]);
              modelMap[targetProvider] = customModel.trim();
              await app.setSetting("Custom AI Model", JSON.stringify(modelMap));
            }

            if (settingsPayload.customBaseUrl !== undefined) {
              await app.setSetting("Custom Base URL", settingsPayload.customBaseUrl.trim());
              if (targetProvider === "Ollama (Local)") {
                await app.setSetting("Ollama Base URL", settingsPayload.customBaseUrl.trim());
              }
            }
          }

          if (session && targetProvider) {
            session.provider = targetProvider;
            session.model = (customModel && customModel.trim().length > 0)
              ? customModel.trim()
              : (DEFAULT_MODELS[targetProvider] || "");
          }

          await app.alert("Settings saved successfully!");
          activeTabState = "review";
          break;
        }

        case "setGranularity":
          handleSetGranularity(app, args[1]);
          break;

        case "setProvider": {
          const newProvider = args[1];
          if (newProvider) {
            const savedModels = parseCustomModelSetting(app.settings?.["Custom AI Model"]);
            const savedModelForNewProvider = savedModels[newProvider] || DEFAULT_MODELS[newProvider] || "";

            if (session) {
              session.provider = newProvider;
              session.model = savedModelForNewProvider;
            }
            if (typeof app.setSetting === "function") {
              await app.setSetting("AI Provider", newProvider);
            }
          }
          break;
        }

        case "setModel": {
          const newModel = args[1];
          const curProvider = session?.provider || app.settings?.["AI Provider"] || DEFAULT_PROVIDER;
          if (newModel) {
            if (session) {
              session.model = newModel;
            }
            if (typeof app.setSetting === "function") {
              const modelMap = parseCustomModelSetting(app.settings?.["Custom AI Model"]);
              modelMap[curProvider] = newModel.trim();
              await app.setSetting("Custom AI Model", JSON.stringify(modelMap));
            }
          }
          break;
        }

        case "setPreset":
          if (session) {
            session.promptPresetId = args[1];
            session.customPrompt = "";
          }
          break;

        case "setCustomPrompt":
          if (session) {
            session.customPrompt = args[1];
          }
          break;

        case "clearCustomPrompt":
          if (session) {
            session.customPrompt = "";
          }
          break;

        case "runReview":
          await handleRunReview(app);
          break;

        case "reviewAll":
          await handleReviewAll(app);
          break;

        case "acceptItem":
          if (session) {
            session.accept(args[1]);
            if (session.currentIndex < session.items.length - 1) {
              session.currentIndex++;
            }
          }
          break;

        case "rejectItem":
          if (session) {
            session.reject(args[1]);
            if (session.currentIndex < session.items.length - 1) {
              session.currentIndex++;
            }
          }
          break;

        case "manualEditItem":
          if (session) {
            session.manualEdit(args[1], args[2]);
          }
          break;

        case "reReviewItem":
          await handleRunReview(app, args[1]);
          break;

        case "nextItem":
          if (session && session.currentIndex < session.items.length - 1) {
            session.currentIndex++;
          }
          break;

        case "prevItem":
          if (session && session.currentIndex > 0) {
            session.currentIndex--;
          }
          break;

        case "saveAndCommit":
          if (session) {
            const auditEnabled = Boolean(args[1]);
            const confirmSave = await app.prompt("Commit Grammar Review Rewrites?", {
              inputs: [
                {
                  label: "Also create extra changes & history report notes (-reports/-grammar/*)? (Optional — Amplenote natively captures note revision history)",
                  type: "checkbox",
                  value: auditEnabled
                }
              ]
            });

            if (confirmSave !== null && confirmSave !== false) {
              const shouldCreateNotes = typeof confirmSave === "object"
                ? Boolean(confirmSave["Also create extra changes & history report notes (-reports/-grammar/*)? (Optional — Amplenote natively captures note revision history)"] ?? confirmSave[0])
                : Boolean(confirmSave);

              const res = await handleSaveAndCommit(app, shouldCreateNotes);
              if (shouldCreateNotes && res.changesNoteUUID) {
                await app.alert(`Changes saved to source note!\n\nAudit report created: ${res.changesNoteUUID}`);
              } else {
                await app.alert("Changes successfully saved to source note!");
              }
            }
          }
          break;

        case "openNote":
          if (args[1]) {
            await app.navigate(`https://www.amplenote.com/notes/${args[1]}`);
          }
          requiresReRender = false;
          break;

        default:
          console.warn("[GrammarReviewer] Unhandled action:", action);
      }

      // Only re-render embed when session state has actually mutated
      if (requiresReRender) {
        if (app.context && typeof app.context.renderEmbed === "function") {
          await app.context.renderEmbed();
        } else if (typeof app.renderEmbed === "function") {
          await app.renderEmbed();
        }
      }
    } catch (err) {
      console.error("[GrammarReviewer] Error processing onEmbedCall:", err);
      const errorMsg = err?.message || (typeof err === "string" ? err : JSON.stringify(err)) || "Unknown error";
      await app.alert(`Reviewer Error: ${errorMsg}`);
    }
  },

  /**
   * Renders the interactive embed UI.
   * @param {object} app
   * @returns {Promise<string>}
   */
  async renderEmbed(app) {
    const session = getActiveSession();
    const config = getProviderConfig(app);
    let historyRecords = [];

    if (activeTabState === "history") {
      historyRecords = await loadHistoryRecords(app);
    }

    return buildDashboardTemplate({
      session,
      config,
      historyRecords,
      activeTab: activeTabState
    });
  }
};

export default plugin;
