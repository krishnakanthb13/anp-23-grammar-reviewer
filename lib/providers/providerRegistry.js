import { PROVIDERS, DEFAULT_PROVIDER, DEFAULT_MODELS } from "../constants.js";
import { OpenAIProvider } from "./openaiProvider.js";
import { AnthropicProvider } from "./anthropicProvider.js";
import { GeminiProvider } from "./geminiProvider.js";
import { OpenRouterProvider } from "./openrouterProvider.js";
import { GroqProvider } from "./groqProvider.js";
import { DeepSeekProvider } from "./deepseekProvider.js";
import { MistralProvider } from "./mistralProvider.js";
import { OllamaProvider } from "./ollamaProvider.js";

/**
 * Safely parses a JSON string or returns a fallback value.
 * @param {string} str
 * @param {*} [fallback={}]
 * @returns {*}
 */
function safeParseJSON(str, fallback = {}) {
  if (!str || typeof str !== "string") return fallback;
  const trimmed = str.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return fallback;
  try {
    const parsed = JSON.parse(trimmed);
    return typeof parsed === "object" && parsed !== null ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Extracts provider configuration from Amplenote plugin settings.
 * Supports both JSON formatted objects and plain string settings within the existing table.
 * 
 * @param {object} app
 * @returns {{
 *   provider: string,
 *   apiKey: string,
 *   allKeys: Record<string, string>,
 *   allModels: Record<string, string>,
 *   customModel: string,
 *   customBaseUrl: string
 * }}
 */
export function getProviderConfig(app) {
  const settings = app?.settings || {};
  const selectedProvider = settings["AI Provider"] || DEFAULT_PROVIDER;

  const keys = {};
  const allModels = {};

  // 1. Parse model mappings from the existing "Custom AI Model" setting (JSON dictionary or plain string)
  const rawCustomModelSetting = settings["Custom AI Model"] || "";
  let parsedCustomModels = safeParseJSON(rawCustomModelSetting, null);
  if (!parsedCustomModels) {
    parsedCustomModels = {};
    if (typeof rawCustomModelSetting === "string" && rawCustomModelSetting.trim()) {
      parsedCustomModels[selectedProvider] = rawCustomModelSetting.trim();
    }
  }

  // 2. Iterate each provider and extract API key and model from existing setting fields
  for (const p of Object.values(PROVIDERS)) {
    const rawVal = settings[`${p} API Key`] || settings[`${p} Key`] || "";
    let extractedKey = "";
    let extractedModel = parsedCustomModels[p] || "";

    if (rawVal && typeof rawVal === "string") {
      const parsedObj = safeParseJSON(rawVal, null);
      if (parsedObj) {
        extractedKey = parsedObj.apiKey || parsedObj.key || "";
        if (parsedObj.model || parsedObj.customModel) {
          extractedModel = parsedObj.model || parsedObj.customModel;
        }
      } else {
        extractedKey = rawVal.trim();
      }
    }

    keys[p] = extractedKey;
    allModels[p] = extractedModel;
  }

  const customModel = allModels[selectedProvider] || "";
  const customBaseUrl = settings["Custom Base URL"] || (selectedProvider === PROVIDERS.OLLAMA ? (settings["Ollama Base URL"] || "http://localhost:11434/v1") : "");

  return {
    provider: selectedProvider,
    apiKey: keys[selectedProvider] || "",
    allKeys: keys,
    allModels,
    customModel,
    customBaseUrl
  };
}

/**
 * Instantiates the appropriate provider based on active config or overrides.
 * @param {object} options
 * @param {string} [options.provider]
 * @param {string} [options.apiKey]
 * @param {string} [options.baseUrl]
 * @param {string} [options.defaultModel]
 * @returns {import("./baseProvider.js").BaseProvider}
 */
export function createProviderInstance({ provider = DEFAULT_PROVIDER, apiKey = "", baseUrl = "", defaultModel = "" } = {}) {
  const finalModel = defaultModel || DEFAULT_MODELS[provider];

  switch (provider) {
    case PROVIDERS.DEEPSEEK:
      return new DeepSeekProvider({ apiKey, defaultModel: finalModel });
    case PROVIDERS.MISTRAL:
      return new MistralProvider({ apiKey, defaultModel: finalModel });
    case PROVIDERS.OLLAMA:
      return new OllamaProvider({ baseUrl: baseUrl || "http://localhost:11434/v1", defaultModel: finalModel });
    case PROVIDERS.GROQ:
      return new GroqProvider({ apiKey, defaultModel: finalModel });
    case PROVIDERS.GEMINI:
      return new GeminiProvider({ apiKey, defaultModel: finalModel });
    case PROVIDERS.ANTHROPIC:
      return new AnthropicProvider({ apiKey, defaultModel: finalModel });
    case PROVIDERS.OPENAI:
      return new OpenAIProvider({ apiKey, defaultModel: finalModel });
    case PROVIDERS.OPENROUTER:
    default:
      return new OpenRouterProvider({ apiKey, defaultModel: finalModel });
  }
}
