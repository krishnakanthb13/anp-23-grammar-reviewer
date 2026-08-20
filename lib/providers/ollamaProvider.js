import { BaseProvider } from "./baseProvider.js";
import { DEFAULT_MODELS, PROVIDERS } from "../constants.js";

export class OllamaProvider extends BaseProvider {
  constructor(config = {}) {
    super({
      ...config,
      baseUrl: config.baseUrl || "http://localhost:11434/v1",
      defaultModel: config.defaultModel || DEFAULT_MODELS[PROVIDERS.OLLAMA]
    });
  }

  async complete({ prompt, systemPrompt, model, temperature = 0.3 }) {
    const targetModel = model || this.defaultModel;
    const url = `${this.baseUrl.replace(/\/+$/, "")}/chat/completions`;

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const payload = {
      model: targetModel,
      messages,
      temperature,
      max_tokens: 4096
    };

    const headers = {
      "Content-Type": "application/json"
    };

    // Optional local auth token if set
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    const data = await this.sendRequest(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    const output = data.choices?.[0]?.message?.content;
    if (output === undefined || output === null) {
      throw new Error("Local Ollama endpoint returned an empty response. Ensure Ollama is running (`ollama serve`).");
    }

    return output.trim();
  }
}
