/**
 * Base AI Provider Abstract Class
 */
export class BaseProvider {
  /**
   * @param {object} config
   * @param {string} [config.apiKey]
   * @param {string} [config.baseUrl]
   * @param {string} [config.defaultModel]
   * @param {number} [config.timeoutMs]
   */
  constructor(config = {}) {
    this.apiKey = config.apiKey || "";
    this.baseUrl = config.baseUrl || "";
    this.defaultModel = config.defaultModel || "";
    this.timeoutMs = config.timeoutMs || 45000;
  }

  /**
   * Executes a fetch request with timeout and error extraction.
   * @param {string} url
   * @param {RequestInit} options
   * @returns {Promise<any>}
   */
  async sendRequest(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      if (!res.ok) {
        let errorDetails = "";
        try {
          const jsonErr = await res.json();
          errorDetails = jsonErr.error?.message || jsonErr.message || JSON.stringify(jsonErr);
        } catch {
          errorDetails = await res.text();
        }

        if (res.status === 401 || res.status === 403) {
          throw new Error(`Authentication failed (${res.status}): Please verify your API key in Plugin Settings. Details: ${errorDetails}`);
        } else if (res.status === 429) {
          throw new Error(`Rate limit exceeded (${res.status}): Please wait a moment or check your account quota. Details: ${errorDetails}`);
        } else {
          throw new Error(`Provider API Error (${res.status}): ${errorDetails}`);
        }
      }

      return await res.json();
    } catch (err) {
      if (err.name === "AbortError") {
        throw new Error(`Request timed out after ${Math.round(this.timeoutMs / 1000)}s.`);
      }
      if (err instanceof TypeError && (err.message.includes("Failed to fetch") || err.message.includes("NetworkError") || err.message.includes("CORS"))) {
        if (url.includes("localhost") || url.includes("127.0.0.1")) {
          throw new Error(
            `Localhost Connection Blocked by Browser CORS Policy.\n\n` +
            `To allow Amplenote to connect to your local Ollama:\n` +
            `1. Windows: Set environment variable OLLAMA_ORIGINS="*" and restart Ollama.\n` +
            `2. Mac/Linux: Run 'OLLAMA_ORIGINS="*" ollama serve'.\n` +
            `3. Or use OpenRouter, Google Gemini, or Groq free tiers in Settings.`
          );
        }
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Standard completion interface to be implemented by providers.
   * @param {object} params
   * @param {string} params.prompt
   * @param {string} [params.systemPrompt]
   * @param {string} [params.model]
   * @param {number} [params.temperature]
   * @returns {Promise<string>}
   */
  async complete(params) {
    throw new Error(`Method 'complete' must be implemented by ${this.constructor.name}`);
  }
}
