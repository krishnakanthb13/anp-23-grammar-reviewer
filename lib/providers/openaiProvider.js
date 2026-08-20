import { BaseProvider } from "./baseProvider.js";
import { DEFAULT_MODELS, PROVIDERS } from "../constants.js";

export class OpenAIProvider extends BaseProvider {
  constructor(config = {}) {
    super({
      ...config,
      baseUrl: config.baseUrl || "https://api.openai.com/v1",
      defaultModel: config.defaultModel || DEFAULT_MODELS[PROVIDERS.OPENAI]
    });
  }

  async complete({ prompt, systemPrompt, model, temperature = 0.3 }) {
    if (!this.apiKey) {
      throw new Error("OpenAI API key is missing. Please configure it in plugin settings.");
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
      temperature,
      max_tokens: 4096
    };

    const data = await this.sendRequest(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const output = data.choices?.[0]?.message?.content;
    if (output === undefined || output === null) {
      throw new Error("OpenAI returned an empty response.");
    }

    return output.trim();
  }
}
