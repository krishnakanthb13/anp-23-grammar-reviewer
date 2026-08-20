import { PROVIDERS, DEFAULT_PROVIDER, DEFAULT_MODELS, PROVIDER_DOCS } from "../constants.js";
import { OpenAIProvider } from "./openaiProvider.js";
import { AnthropicProvider } from "./anthropicProvider.js";
import { GeminiProvider } from "./geminiProvider.js";
import { OpenRouterProvider } from "./openrouterProvider.js";
import { GroqProvider } from "./groqProvider.js";
import { DeepSeekProvider } from "./deepseekProvider.js";
import { MistralProvider } from "./mistralProvider.js";
import { OllamaProvider } from "./ollamaProvider.js";

/**
 * Extracts provider configuration from Amplenote plugin settings.
 * Supports both JSON formatted objects and plain string settings within the existing table.
 * 
 * @param {object} app
 * @returns {object}
 */
export function getProviderConfig(app) {
  const settings = app?.settings || {};
  const selectedProvider = settings["AI Provider"] || DEFAULT_PROVIDER;

  const keys = {};
  const allModels = {};

  // 1. Parse model mappings from the existing "Custom AI Model" setting (JSON dictionary or plain string)
  let rawCustomModelSetting = settings["Custom AI Model"] || "";
  let parsedCustomModels = {};
  if (rawCustomModelSetting && typeof rawCustomModelSetting === "string") {
    try {
      if (rawCustomModelSetting.trim().startsWith("{")) {
        const parsed = JSON.parse(rawCustomModelSetting);
        if (typeof parsed === "object" && parsed !== null) {
          parsedCustomModels = parsed;
        }
      } else {
        parsedCustomModels[selectedProvider] = rawCustomModelSetting.trim();
      }
    } catch (e) {
      parsedCustomModels[selectedProvider] = rawCustomModelSetting.trim();
    }
  }

  // 2. Iterate each provider and extract API key and model from existing setting fields
  for (const p of Object.values(PROVIDERS)) {
    const rawVal = settings[`${p} API Key`] || settings[`${p} Key`] || "";
    let extractedKey = "";
    let extractedModel = parsedCustomModels[p] || "";

    if (rawVal && typeof rawVal === "string") {
      try {
        if (rawVal.trim().startsWith("{")) {
          const parsed = JSON.parse(rawVal);
          if (typeof parsed === "object" && parsed !== null) {
            extractedKey = parsed.apiKey || parsed.key || "";
            if (parsed.model || parsed.customModel) {
              extractedModel = parsed.model || parsed.customModel;
            }
          }
        } else {
          extractedKey = rawVal.trim();
        }
      } catch (e) {
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
