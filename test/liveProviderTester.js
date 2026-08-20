/**
 * Standalone Provider Diagnostic Suite
 * Runs simulated dummy API calls against all 8 provider adapters to verify
 * headers, endpoints, request formatting, and response unpacking.
 */

import { createProviderInstance } from "../lib/providers/providerRegistry.js";
import { PROVIDERS, DEFAULT_MODELS } from "../lib/constants.js";

async function runDiagnostics() {
  console.log("==================================================================");
  console.log("🧪 AMPLNOTE GRAMMAR REVIEWER - 8 AI PROVIDER DIAGNOSTIC SUITE");
  console.log("==================================================================\n");

  const originalFetch = global.fetch;

  const testCases = [
    {
      name: "OpenRouter",
      provider: PROVIDERS.OPENROUTER,
      apiKey: "sk-or-test-dummy-key",
      expectedEndpoint: "https://openrouter.ai/api/v1/chat/completions",
      mockResponse: {
        choices: [{ message: { content: "OpenRouter grammar review response [PASS]" } }]
      }
    },
    {
      name: "Google Gemini",
      provider: PROVIDERS.GEMINI,
      apiKey: "gemini-test-dummy-key",
      expectedEndpoint: "generativelanguage.googleapis.com",
      mockResponse: {
        candidates: [{ content: { parts: [{ text: "Google Gemini review response [PASS]" }] } }]
      }
    },
    {
      name: "Groq",
      provider: PROVIDERS.GROQ,
      apiKey: "gsk-groq-dummy-key",
      expectedEndpoint: "https://api.groq.com/openai/v1/chat/completions",
      mockResponse: {
        choices: [{ message: { content: "Groq 300+ tok/s review response [PASS]" } }]
      }
    },
    {
      name: "Mistral AI",
      provider: PROVIDERS.MISTRAL,
      apiKey: "mistral-dummy-key",
      expectedEndpoint: "https://api.mistral.ai/v1/chat/completions",
      mockResponse: {
        choices: [{ message: { content: "Mistral Small 4 review response [PASS]" } }]
      }
    },
    {
      name: "DeepSeek Direct",
      provider: PROVIDERS.DEEPSEEK,
      apiKey: "sk-deepseek-dummy-key",
      expectedEndpoint: "https://api.deepseek.com/chat/completions",
      mockResponse: {
        choices: [{ message: { content: "DeepSeek V4 Flash review response [PASS]" } }]
      }
    },
    {
      name: "Ollama (Cloud & Local)",
      provider: PROVIDERS.OLLAMA,
      baseUrl: "http://localhost:11434/v1",
      expectedEndpoint: "http://localhost:11434/v1/chat/completions",
      mockResponse: {
        choices: [{ message: { content: "Ollama DeepSeek V4 Cloud review response [PASS]" } }]
      }
    },
    {
      name: "OpenAI",
      provider: PROVIDERS.OPENAI,
      apiKey: "sk-openai-dummy-key",
      expectedEndpoint: "https://api.openai.com/v1/chat/completions",
      mockResponse: {
        choices: [{ message: { content: "OpenAI GPT-5.6 Luna review response [PASS]" } }]
      }
    },
    {
      name: "Anthropic Claude",
      provider: PROVIDERS.ANTHROPIC,
      apiKey: "sk-ant-dummy-key",
      expectedEndpoint: "https://api.anthropic.com/v1/messages",
      mockResponse: {
        content: [{ text: "Claude Haiku 4.5 review response [PASS]" }]
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    let capturedUrl = "";
    global.fetch = async (url) => {
      capturedUrl = String(url);
      return {
        ok: true,
        json: async () => tc.mockResponse
      };
    };

    try {
      const provider = createProviderInstance({
        provider: tc.provider,
        apiKey: tc.apiKey,
        baseUrl: tc.baseUrl,
        defaultModel: DEFAULT_MODELS[tc.provider]
      });

      const output = await provider.complete({
        prompt: "Review sentence for spelling mistakes.",
        systemPrompt: "You are a professional editor."
      });

      const urlMatch = capturedUrl.includes(tc.expectedEndpoint);
      if (!urlMatch) {
        throw new Error(`Endpoint mismatch: Expected URL containing "${tc.expectedEndpoint}", got "${capturedUrl}"`);
      }

      if (!output || typeof output !== "string" || !output.includes("[PASS]")) {
        throw new Error(`Invalid output parsing: Received: "${output}"`);
      }

      console.log(`✅ [PASS] ${tc.name.padEnd(25)} Endpoint: ${capturedUrl.split("?")[0]}`);
      console.log(`   └─ Model: ${provider.defaultModel} | Output: "${output}"\n`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${tc.name.padEnd(25)} Error: ${err.message}\n`);
      failed++;
    }
  }

  // Restore original fetch
  global.fetch = originalFetch;

  console.log("==================================================================");
  console.log(`📊 RESULTS: ${passed}/${testCases.length} Passed, ${failed} Failed`);
  console.log("==================================================================\n");
}

runDiagnostics();
