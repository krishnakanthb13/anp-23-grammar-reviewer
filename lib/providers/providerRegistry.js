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
 * @param {object} app
 * @returns {object}
 */
export function getProviderConfig(app) {
  const settings = app?.settings || {};
  const selectedProvider = settings["AI Provider"] || DEFAULT_PROVIDER;

  const keys = {
    [PROVIDERS.OPENROUTER]: settings["OpenRouter API Key"] || settings["OpenRouter Key"] || "",
    [PROVIDERS.GEMINI]: settings["Gemini API Key"] || settings["Google API Key"] || "",
    [PROVIDERS.GROQ]: settings["Groq API Key"] || settings["Groq Key"] || "",
    [PROVIDERS.MISTRAL]: settings["Mistral API Key"] || settings["Mistral Key"] || "",
    [PROVIDERS.DEEPSEEK]: settings["DeepSeek API Key"] || settings["DeepSeek Key"] || "",
    [PROVIDERS.OLLAMA]: settings["Ollama API Key"] || "",
    [PROVIDERS.OPENAI]: settings["OpenAI API Key"] || settings["OpenAI Key"] || "",
    [PROVIDERS.ANTHROPIC]: settings["Anthropic API Key"] || settings["Anthropic Key"] || ""
  };

  const customModel = settings["Custom AI Model"] || "";
  const customBaseUrl = settings["Custom Base URL"] || (selectedProvider === PROVIDERS.OLLAMA ? (settings["Ollama Base URL"] || "http://localhost:11434/v1") : "");

  return {
    provider: selectedProvider,
    apiKey: keys[selectedProvider] || "",
    allKeys: keys,
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
      return new DeepSeekProvider({ apiKey, baseUrl, defaultModel: finalModel });
    case PROVIDERS.MISTRAL:
      return new MistralProvider({ apiKey, baseUrl, defaultModel: finalModel });
    case PROVIDERS.OLLAMA:
      return new OllamaProvider({ apiKey, baseUrl: baseUrl || "http://localhost:11434/v1", defaultModel: finalModel });
    case PROVIDERS.OPENAI:
      return new OpenAIProvider({ apiKey, baseUrl, defaultModel: finalModel });
    case PROVIDERS.ANTHROPIC:
      return new AnthropicProvider({ apiKey, baseUrl, defaultModel: finalModel });
    case PROVIDERS.GEMINI:
      return new GeminiProvider({ apiKey, baseUrl, defaultModel: finalModel });
    case PROVIDERS.GROQ:
      return new GroqProvider({ apiKey, baseUrl, defaultModel: finalModel });
    case PROVIDERS.OPENROUTER:
    default:
      return new OpenRouterProvider({ apiKey, baseUrl, defaultModel: finalModel });
  }
}

/**
 * Validates whether the configured provider has an API key ready.
 * @param {object} app
 * @param {string} [targetProvider]
 * @returns {{ isValid: boolean, provider: string, keyDocUrl: string }}
 */
export function checkProviderReadiness(app, targetProvider) {
  const config = getProviderConfig(app);
  const provider = targetProvider || config.provider;

  // Ollama does not require an external API key
  if (provider === PROVIDERS.OLLAMA) {
    return {
      isValid: true,
      provider,
      keyDocUrl: PROVIDER_DOCS[provider] || "https://ollama.com"
    };
  }

  const key = config.allKeys[provider];

  return {
    isValid: Boolean(key && key.trim().length > 0),
    provider,
    keyDocUrl: PROVIDER_DOCS[provider] || "https://openrouter.ai/keys"
  };
}
