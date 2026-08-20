import { jest } from "@jest/globals";
import { createProviderInstance } from "../lib/providers/providerRegistry.js";
import { PROVIDERS } from "../lib/constants.js";

describe("AI Provider Suite - Comprehensive Dummy API Tests for All 8 Providers", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test("1. OpenRouter Provider - Request Payload, Headers & Response Parsing", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "OpenRouter corrected text." } }]
      })
    });

    const provider = createProviderInstance({
      provider: PROVIDERS.OPENROUTER,
      apiKey: "sk-or-dummy-key"
    });

    const result = await provider.complete({
      prompt: "Review this text.",
      systemPrompt: "You are an editor."
    });

    expect(result).toBe("OpenRouter corrected text.");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://openrouter.ai/api/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Authorization": "Bearer sk-or-dummy-key",
          "Content-Type": "application/json"
        })
      })
    );
  });

  test("2. Google Gemini Provider - Contents Payload & Candidates Parsing", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: "Gemini corrected text." }]
            }
          }
        ]
      })
    });

    const provider = createProviderInstance({
      provider: PROVIDERS.GEMINI,
      apiKey: "dummy-gemini-key"
    });

    const result = await provider.complete({
      prompt: "Fix grammar here."
    });

    expect(result).toBe("Gemini corrected text.");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("generativelanguage.googleapis.com"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json"
        })
      })
    );
  });

  test("3. Groq Provider - Ultra-Fast OpenAI Format Request", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "Groq high-speed rewrite." } }]
      })
    });

    const provider = createProviderInstance({
      provider: PROVIDERS.GROQ,
      apiKey: "gsk-dummy-key"
    });

    const result = await provider.complete({
      prompt: "Polish draft."
    });

    expect(result).toBe("Groq high-speed rewrite.");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.groq.com/openai/v1/chat/completions",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Authorization": "Bearer gsk-dummy-key"
        })
      })
    );
  });

  test("4. Mistral AI Provider - European API Format", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "Mistral elegant prose." } }]
      })
    });

    const provider = createProviderInstance({
      provider: PROVIDERS.MISTRAL,
      apiKey: "mistral-dummy-key"
    });

    const result = await provider.complete({
      prompt: "Edit paragraph."
    });

    expect(result).toBe("Mistral elegant prose.");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.mistral.ai/v1/chat/completions",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Authorization": "Bearer mistral-dummy-key"
        })
      })
    );
  });

  test("5. DeepSeek Direct Provider - Direct API V3/V4 Format", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "DeepSeek precision edit." } }]
      })
    });

    const provider = createProviderInstance({
      provider: PROVIDERS.DEEPSEEK,
      apiKey: "sk-deepseek-dummy"
    });

    const result = await provider.complete({
      prompt: "Fix spelling."
    });

    expect(result).toBe("DeepSeek precision edit.");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.deepseek.com/chat/completions",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Authorization": "Bearer sk-deepseek-dummy"
        })
      })
    );
  });

  test("6. Ollama Local / Cloud Provider - Localhost Endpoint & Authorization", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "Ollama offline rewrite." } }]
      })
    });

    const provider = createProviderInstance({
      provider: PROVIDERS.OLLAMA,
      baseUrl: "http://localhost:11434/v1"
    });

    const result = await provider.complete({
      prompt: "Offline grammar pass."
    });

    expect(result).toBe("Ollama offline rewrite.");
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:11434/v1/chat/completions",
      expect.objectContaining({
        method: "POST"
      })
    );
  });

  test("7. OpenAI Provider - GPT-5.6 / GPT-4o Format", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "OpenAI GPT rewritten text." } }]
      })
    });

    const provider = createProviderInstance({
      provider: PROVIDERS.OPENAI,
      apiKey: "sk-openai-dummy"
    });

    const result = await provider.complete({
      prompt: "Improve readability."
    });

    expect(result).toBe("OpenAI GPT rewritten text.");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.openai.com/v1/chat/completions",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Authorization": "Bearer sk-openai-dummy"
        })
      })
    );
  });

  test("8. Anthropic Claude Provider - x-api-key Headers & Messages API", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ text: "Claude gold standard edit." }]
      })
    });

    const provider = createProviderInstance({
      provider: PROVIDERS.ANTHROPIC,
      apiKey: "sk-ant-dummy"
    });

    const result = await provider.complete({
      prompt: "Tone calibration."
    });

    expect(result).toBe("Claude gold standard edit.");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.anthropic.com/v1/messages",
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-api-key": "sk-ant-dummy",
          "anthropic-version": "2023-06-01"
        })
      })
    );
  });

  test("Error Handling - Throws descriptive error when provider API returns 401/500", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      text: async () => JSON.stringify({ error: { message: "Invalid API Key provided" } })
    });

    const provider = createProviderInstance({
      provider: PROVIDERS.OPENAI,
      apiKey: "invalid-key"
    });

    await expect(provider.complete({ prompt: "Hello" })).rejects.toThrow();
  });
});
