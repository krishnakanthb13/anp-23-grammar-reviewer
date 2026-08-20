/**
 * @file grammar-reviewer.js
 * @description Main entry point for the Amplenote Grammar & Style Reviewer Plugin.
 * Provides noteOption and appOption dashboard launchers, embed event dispatchers (onEmbedCall),
 * and full-screen reactive review interface rendering (renderEmbed).
 */

import { getActiveSession, setActiveSession, clearActiveSession } from "./lib/data/store.js";
import { ReviewSession } from "./lib/engine/reviewSession.js";
import { getProviderConfig, createProviderInstance } from "./lib/providers/providerRegistry.js";
import { launchReviewer } from "./lib/features/launcher.js";
import { handleRunReview, handleReviewAll, handleSetGranularity, cancelReviewAll } from "./lib/features/reviewWorkflow.js";
import { handleSaveAndCommit } from "./lib/features/saveHandler.js";
import { loadHistoryRecords } from "./lib/features/historyViewer.js";
import { buildDashboardTemplate, renderReviewWorkspace } from "./lib/ui/dashboardTemplate.js";
import { DEFAULT_MODELS, DEFAULT_PROVIDER, PROVIDERS } from "./lib/constants.js";
import { getUsageStats, resetUsage, recordUsage } from "./lib/data/usageTracker.js";

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

  // Handle all client-side UI actions triggered via window.callAmplenotePlugin
  async onEmbedCall(app, ...args) {
    const action = args[0];
    const session = getActiveSession();
    let requiresReRender = false;

    try {
      switch (action) {
        case "testProviderConnection": {
          const testPayload = args[1] || {};
          const testProv = testPayload.provider || DEFAULT_PROVIDER;
          const testKey = (testPayload.apiKey !== undefined && testPayload.apiKey !== null)
            ? testPayload.apiKey
            : (app.settings?.[`${testProv} API Key`] || "");
          const testBaseUrl = testPayload.baseUrl || (testProv === PROVIDERS.OLLAMA ? (app.settings?.["Ollama Base URL"] || "http://localhost:11434/v1") : "");
          const testModel = (testPayload.model && testPayload.model.trim().length > 0)
            ? testPayload.model.trim()
            : DEFAULT_MODELS[testProv];

          if (testProv !== PROVIDERS.OLLAMA && (!testKey || !testKey.trim())) {
            return { ok: false, error: `No API key provided for ${testProv}. Please enter an API key to test.` };
          }

          try {
            const providerInstance = createProviderInstance({
              provider: testProv,
              apiKey: testKey ? testKey.trim() : "",
              baseUrl: testBaseUrl ? testBaseUrl.trim() : "",
              defaultModel: testModel
            });

            const t0 = Date.now();
            const response = await providerInstance.complete({
              prompt: "Reply with the single word: OK",
              systemPrompt: "You are an API diagnostic health checker. Reply only with OK.",
              model: testModel
            });

            const latencyMs = Date.now() - t0;
            try {
              await recordUsage(app, testProv, true);
            } catch (uErr) {
              console.warn("[GrammarReviewer] Could not record usage for test:", uErr);
            }

            return {
              ok: true,
              latencyMs,
              provider: testProv,
              model: testModel,
              sample: (typeof response === "string" ? response : JSON.stringify(response)).slice(0, 40)
            };
          } catch (err) {
            console.warn("[GrammarReviewer] testProviderConnection failed:", err);
            try {
              await recordUsage(app, testProv, false);
            } catch (uErr) {
              console.warn("[GrammarReviewer] Could not record failed usage for test:", uErr);
            }
            return {
              ok: false,
              provider: testProv,
              error: err?.message || String(err)
            };
          }
        }
        case "selectNote":
          await launchReviewer(app, null, true);
          break;

        case "restoreSession": {
          if (args[1]) {
            const restored = ReviewSession.fromJSON(args[1]);
            if (restored) {
              setActiveSession(restored);
            }
          }
          break;
        }

        case "clearSession":
          clearActiveSession();
          requiresReRender = true;
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
          requiresReRender = false;
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
          requiresReRender = false;
          break;
        }

        case "setPreset":
          if (session) {
            session.promptPresetId = args[1];
            session.customPrompt = "";
          }
          requiresReRender = false;
          break;

        case "setCustomPrompt":
          if (session) {
            session.customPrompt = args[1];
          }
          requiresReRender = false;
          break;

        case "clearCustomPrompt":
          if (session) {
            session.customPrompt = "";
          }
          requiresReRender = false;
          break;

        case "runReview":
          await handleRunReview(app, typeof args[1] === "number" ? args[1] : -1, args[2] || "");
          break;

        case "reviewAll": {
          const res = await handleReviewAll(app);
          if (res && res.failedCount > 0) {
            await app.alert(`Review All completed: ${res.reviewedCount} chunks reviewed, ${res.failedCount} item(s) failed.`);
          }
          break;
        }

        case "cancelReviewAll":
          cancelReviewAll();
          requiresReRender = false;
          break;

        case "jumpToItem": {
          const target = parseInt(args[1], 10);
          if (session && !isNaN(target) && target >= 0 && target < session.items.length) {
            session.currentIndex = target;
          }
          break;
        }

        case "undoItem": {
          const target = typeof args[1] === "number" ? args[1] : session?.currentIndex;
          if (session && target !== undefined) {
            session.undo(target);
          }
          break;
        }

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
          await handleRunReview(app, args[1], args[2] || "");
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
            const shouldCreateNotes = Boolean(args[1]);
            try {
              const res = await handleSaveAndCommit(app, shouldCreateNotes);
              if (res && res.cancelled) {
                return { success: false, cancelled: true, message: "Save cancelled: Source note was modified externally." };
              }
              if (res && res.success) {
                if (typeof app.alert === "function") {
                  try {
                    await app.alert(shouldCreateNotes && res.changesNoteUUID
                      ? `Changes successfully saved to note!\n\nCompanion report created: ${res.changesNoteUUID}`
                      : `Changes successfully saved to ${session.noteTitle || "note"}!`);
                  } catch {}
                }
                return {
                  success: true,
                  noteUUID: session.noteUUID,
                  noteTitle: session.noteTitle,
                  changesNoteUUID: res.changesNoteUUID,
                  historyNoteUUID: res.historyNoteUUID
                };
              }
            } catch (err) {
              console.error("[GrammarReviewer] saveAndCommit failed:", err);
              if (typeof app.alert === "function") {
                try {
                  await app.alert(`Failed to save note: ${err?.message || err}`);
                } catch {}
              }
              return { success: false, error: err?.message || String(err) };
            }
          }
          break;

        case "openNote":
          {
            const targetUUID = args[1] || session?.noteUUID;
            if (targetUUID) {
              try {
                if (typeof app.openNote === "function") {
                  await app.openNote(targetUUID);
                } else if (typeof app.navigate === "function") {
                  await app.navigate(`https://www.amplenote.com/notes/${targetUUID}`);
                }
              } catch (e) {
                console.warn("[GrammarReviewer] openNote error:", e);
              }
            }
          }
          requiresReRender = false;
          break;

        case "resetUsage": {
          const mode = args[1] || "today";
          await resetUsage(app, mode);
          if (app.context && typeof app.context.renderEmbed === "function") {
            await app.context.renderEmbed();
          } else if (typeof app.renderEmbed === "function") {
            await app.renderEmbed();
          }
          requiresReRender = false;
          break;
        }


        default:
          console.warn("[GrammarReviewer] Unhandled action:", action);
      }

      // Only re-render full embed on explicit tab changes or session resets
      if (requiresReRender) {
        if (app.context && typeof app.context.renderEmbed === "function") {
          await app.context.renderEmbed();
        } else if (typeof app.renderEmbed === "function") {
          await app.renderEmbed();
        }
      }

      const activeSession = getActiveSession();
      if (activeSession) {
        const config = getProviderConfig(app);
        const metrics = activeSession.getMetrics();
        const currentItem = activeSession.items[activeSession.currentIndex] || null;
        return {
          success: true,
          session: activeSession.toJSON(),
          workspaceHtml: renderReviewWorkspace(activeSession, config, metrics, currentItem)
        };
      }

      return { success: true };
    } catch (err) {
      console.error("[GrammarReviewer] Error processing onEmbedCall:", err);
      const errorMsg = err?.message || (typeof err === "string" ? err : JSON.stringify(err)) || "Unknown error";
      await app.alert(`Reviewer Error: ${errorMsg}`);
      return { success: false, error: errorMsg };
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
    const usageStats = getUsageStats(app);
    let historyRecords = [];

    if (activeTabState === "history") {
      historyRecords = await loadHistoryRecords(app);
    }

    return buildDashboardTemplate({
      session,
      config,
      historyRecords,
      activeTab: activeTabState,
      usageStats
    });
  }
};

export default plugin;
