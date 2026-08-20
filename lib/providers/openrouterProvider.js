import { BaseProvider } from "./baseProvider.js";
import { DEFAULT_MODELS, PROVIDERS } from "../constants.js";

export class OpenRouterProvider extends BaseProvider {
  constructor(config = {}) {
    super({
      ...config,
      baseUrl: config.baseUrl || "https://openrouter.ai/api/v1",
      defaultModel: config.defaultModel || DEFAULT_MODELS[PROVIDERS.OPENROUTER]
    });
  }

  async complete({ prompt, systemPrompt, model, temperature = 0.3 }) {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key is missing. Please configure it in plugin settings (Free keys available at openrouter.ai).");
    }

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
      temperature
    };

    const data = await this.sendRequest(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        "HTTP-Referer": "https://amplenote.com",
        "X-Title": "Amplenote Grammar Reviewer"
      },
      body: JSON.stringify(payload)
    });

    const output = data.choices?.[0]?.message?.content;
    if (output === undefined || output === null) {
      throw new Error("OpenRouter returned an empty response.");
    }

    return output.trim();
  }
}
