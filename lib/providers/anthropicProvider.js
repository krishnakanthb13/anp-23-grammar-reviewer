import { BaseProvider } from "./baseProvider.js";
import { DEFAULT_MODELS, PROVIDERS } from "../constants.js";

export class AnthropicProvider extends BaseProvider {
  constructor(config = {}) {
    super({
      ...config,
      baseUrl: config.baseUrl || "https://api.anthropic.com/v1",
      defaultModel: config.defaultModel || DEFAULT_MODELS[PROVIDERS.ANTHROPIC]
    });
  }

  async complete({ prompt, systemPrompt, model, temperature = 0.3 }) {
    if (!this.apiKey) {
      throw new Error("Anthropic API key is missing. Please configure it in plugin settings.");
    }

    const targetModel = model || this.defaultModel;
    const url = `${this.baseUrl.replace(/\/+$/, "")}/messages`;

    const payload = {
      model: targetModel,
      max_tokens: 4096,
      temperature,
      messages: [{ role: "user", content: prompt }]
    };

    if (systemPrompt) {
      payload.system = systemPrompt;
    }

    const data = await this.sendRequest(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify(payload)
    });

    const contentBlock = data.content?.find(b => b.type === "text");
    const output = contentBlock ? contentBlock.text : (data.content?.[0]?.text || "");

    if (!output) {
      throw new Error("Anthropic returned an empty response.");
    }

    return output.trim();
  }
}
