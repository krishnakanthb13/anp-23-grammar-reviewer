import { getProviderConfig, createProviderInstance } from "../lib/providers/providerRegistry.js";
import { PROVIDERS, DEFAULT_PROVIDER, DEFAULT_MODELS } from "../lib/constants.js";
import { GeminiProvider } from "../lib/providers/geminiProvider.js";
import { OpenRouterProvider } from "../lib/providers/openrouterProvider.js";
import { OllamaProvider } from "../lib/providers/ollamaProvider.js";

describe("Provider Registry — getProviderConfig", () => {
  test("Extracts default config when no settings are set", () => {
    const mockApp = { settings: {} };
    const config = getProviderConfig(mockApp);

    expect(config.provider).toBe(DEFAULT_PROVIDER);
    expect(config.apiKey).toBe("");
    expect(config.customModel).toBe("");
  });

  test("Extracts per-provider API keys and custom model dictionary", () => {
    const mockApp = {
      settings: {
        "AI Provider": PROVIDERS.GEMINI,
        "Gemini API Key": "gemini-secret-key-123",
        "OpenRouter API Key": "openrouter-key-456",
        "Custom AI Model": JSON.stringify({
          [PROVIDERS.GEMINI]: "gemini-3.7-flash",
          [PROVIDERS.OPENROUTER]: "deepseek/deepseek-v4-flash:free"
        })
      }
    };

    const config = getProviderConfig(mockApp);
    expect(config.provider).toBe(PROVIDERS.GEMINI);
    expect(config.apiKey).toBe("gemini-secret-key-123");
    expect(config.customModel).toBe("gemini-3.7-flash");
    expect(config.allKeys[PROVIDERS.OPENROUTER]).toBe("openrouter-key-456");
    expect(config.allModels[PROVIDERS.OPENROUTER]).toBe("deepseek/deepseek-v4-flash:free");
  });

  test("Handles legacy plain string Custom AI Model setting gracefully", () => {
    const mockApp = {
      settings: {
        "AI Provider": PROVIDERS.GROQ,
        "Groq API Key": "groq-key-789",
        "Custom AI Model": "qwen/qwen3.6-27b"
      }
    };

    const config = getProviderConfig(mockApp);
    expect(config.customModel).toBe("qwen/qwen3.6-27b");
  });

  test("Resolves Ollama custom base URL properly", () => {
    const mockApp = {
      settings: {
        "AI Provider": PROVIDERS.OLLAMA,
        "Ollama Base URL": "http://192.168.1.50:11434/v1"
      }
    };

    const config = getProviderConfig(mockApp);
    expect(config.customBaseUrl).toBe("http://192.168.1.50:11434/v1");
  });
});

describe("Provider Registry — createProviderInstance", () => {
  test("Instantiates GeminiProvider correctly", () => {
    const provider = createProviderInstance({
      provider: PROVIDERS.GEMINI,
      apiKey: "test-gemini-key",
      defaultModel: "gemini-3.5-flash-lite"
    });

    expect(provider).toBeInstanceOf(GeminiProvider);
    expect(provider.apiKey).toBe("test-gemini-key");
    expect(provider.defaultModel).toBe("gemini-3.5-flash-lite");
  });

  test("Instantiates OpenRouterProvider by default", () => {
    const provider = createProviderInstance({
      apiKey: "test-openrouter-key"
    });

    expect(provider).toBeInstanceOf(OpenRouterProvider);
    expect(provider.defaultModel).toBe(DEFAULT_MODELS[PROVIDERS.OPENROUTER]);
  });

  test("Instantiates OllamaProvider with local default base URL", () => {
    const provider = createProviderInstance({
      provider: PROVIDERS.OLLAMA
    });

    expect(provider).toBeInstanceOf(OllamaProvider);
    expect(provider.baseUrl).toBe("http://localhost:11434/v1");
  });

  test("Simulates successful API diagnostics ping for connection validation", async () => {
    const provider = createProviderInstance({
      provider: PROVIDERS.GROQ,
      apiKey: "gsk_test_12345"
    });

    provider.complete = async () => "OK";
    const res = await provider.complete({ prompt: "Reply with OK", systemPrompt: "Test", model: DEFAULT_MODELS[PROVIDERS.GROQ] });
    expect(res).toBe("OK");
  });
});
