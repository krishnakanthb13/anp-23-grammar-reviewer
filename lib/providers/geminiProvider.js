import { BaseProvider } from "./baseProvider.js";
import { DEFAULT_MODELS, PROVIDERS } from "../constants.js";

export class GeminiProvider extends BaseProvider {
  constructor(config = {}) {
    super({
      ...config,
      baseUrl: config.baseUrl || "https://generativelanguage.googleapis.com/v1beta",
      defaultModel: config.defaultModel || DEFAULT_MODELS[PROVIDERS.GEMINI]
    });
  }

  async complete({ prompt, systemPrompt, model, temperature = 0.3 }) {
    if (!this.apiKey) {
      throw new Error("Gemini API key is missing. Please configure it in plugin settings.");
    }

    const targetModel = model || this.defaultModel;
    const url = `${this.baseUrl.replace(/\/+$/, "")}/models/${encodeURIComponent(targetModel)}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: 4096
      }
    };

    if (systemPrompt) {
      payload.systemInstruction = {
        parts: [{ text: systemPrompt }]
      };
    }

    const data = await this.sendRequest(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const candidate = data.candidates?.[0];
    const textPart = candidate?.content?.parts?.find(p => p.text !== undefined);
    const output = textPart?.text || candidate?.content?.parts?.[0]?.text;

    if (!output) {
      throw new Error("Google Gemini returned an empty response.");
    }

    return output.trim();
  }
}
