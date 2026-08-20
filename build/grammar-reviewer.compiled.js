(() => {
// anp-23-grammar-reviewer/lib/data/store.js
var memorySession = null;
function getActiveSession() {
  return memorySession;
}
function setActiveSession(session) {
  memorySession = session;
}
function clearActiveSession() {
  memorySession = null;
}

// anp-23-grammar-reviewer/lib/constants.js
var TAG_GRAMMAR_CHANGES = "-reports/-grammar/-changes";
var TAG_GRAMMAR_HISTORY = "-reports/-grammar/-history";
var GRANULARITY_MODES = {
  FULL: "full",
  PARAGRAPH: "paragraph",
  SENTENCE: "sentence"
};
var PROVIDERS = {
  OPENROUTER: "OpenRouter",
  GEMINI: "Gemini",
  GROQ: "Groq",
  MISTRAL: "Mistral",
  DEEPSEEK: "DeepSeek",
  OLLAMA: "Ollama (Local)",
  OPENAI: "OpenAI",
  ANTHROPIC: "Anthropic"
};
var DEFAULT_PROVIDER2 = PROVIDERS.OPENROUTER;
var DEFAULT_MODELS2 = {
  [PROVIDERS.OPENROUTER]: "openai/gpt-oss-120b:free",
  [PROVIDERS.GEMINI]: "gemini-3.5-flash-lite",
  [PROVIDERS.GROQ]: "openai/gpt-oss-120b",
  [PROVIDERS.MISTRAL]: "mistral-small-latest",
  [PROVIDERS.DEEPSEEK]: "deepseek-v4-flash",
  [PROVIDERS.OLLAMA]: "deepseek-v4-flash:cloud",
  [PROVIDERS.OPENAI]: "gpt-5.6-luna",
  [PROVIDERS.ANTHROPIC]: "claude-haiku-4-5-20251001"
};
var THEMES = [
  { id: "midnight", name: "Midnight Slate", icon: "\u{1F30C}" },
  { id: "nord", name: "Nord Arctic", icon: "\u2744\uFE0F" },
  { id: "glass", name: "Glassmorphism", icon: "\u2728" },
  { id: "emerald", name: "Emerald Forest", icon: "\u{1F332}" },
  { id: "purple", name: "Cyber Violet", icon: "\u{1F49C}" },
  { id: "light", name: "Clean Daylight", icon: "\u2600\uFE0F" }
];
var MODEL_CATALOG = {
  [PROVIDERS.OPENROUTER]: [
    { label: "Auto Router (Smart Auto-Select)", value: "openrouter/auto" },
    { label: "GPT-OSS 120B (Free - Top Open Reasoning)", value: "openai/gpt-oss-120b:free" },
    { label: "DeepSeek V4 Flash (Free - Deep Language Analysis)", value: "deepseek/deepseek-v4-flash:free" },
    { label: "Qwen3.6 27B (Free - Balanced & Sharp)", value: "qwen/qwen3.6-27b:free" },
    { label: "Claude Sonnet 5 (Gold Standard Copyediting)", value: "anthropic/claude-sonnet-5" },
    { label: "GPT-5.6 Terra (High Precision Writing)", value: "openai/gpt-5.6-terra" },
    { label: "GPT-5.6 Luna (Fast & Cost-Effective)", value: "openai/gpt-5.6-luna" },
    { label: "Gemini 3.7 Flash (Fast & Accurate)", value: "google/gemini-3.7-flash" }
  ],
  [PROVIDERS.GEMINI]: [
    { label: "Gemini 3.5 Flash-Lite (Recommended - Ultra Low Latency)", value: "gemini-3.5-flash-lite" },
    { label: "Gemini 3.7 Flash (Fast & High Precision)", value: "gemini-3.7-flash" },
    { label: "Gemini 2.5 Flash (Proven Reliable Free Tier)", value: "gemini-2.5-flash" },
    { label: "Gemini 3.1 Pro (In-Depth Literary Analysis)", value: "gemini-3.1-pro" }
  ],
  [PROVIDERS.GROQ]: [
    { label: "GPT-OSS 120B (Recommended - Fast Open Flagship)", value: "openai/gpt-oss-120b" },
    { label: "Qwen3.6 27B (Deep Language Analysis, 300+ tok/s)", value: "qwen/qwen3.6-27b" },
    { label: "GPT-OSS 20B (Ultra-Fast Response)", value: "openai/gpt-oss-20b" },
    { label: "MiniMax M2.7 (High Context & Flow)", value: "minimaxai/minimax-m2.7" }
  ],
  [PROVIDERS.MISTRAL]: [
    { label: "Mistral Small 4 (Recommended - Fast & Eloquent)", value: "mistral-small-latest" },
    { label: "Mistral Large 3 (Flagship - Exceptional Prose & Tone)", value: "mistral-large-latest" },
    { label: "Codestral (Markdown & Structured Formats)", value: "codestral-latest" },
    { label: "Ministral 3 8B (Compact & Lightweight)", value: "ministral-8b-latest" }
  ],
  [PROVIDERS.DEEPSEEK]: [
    { label: "DeepSeek V4 Flash (Recommended - Fast & Built-in Thinking)", value: "deepseek-v4-flash" },
    { label: "DeepSeek V4 Pro (Frontier MoE & Style)", value: "deepseek-v4-pro" }
  ],
  [PROVIDERS.OLLAMA]: [
    { label: "DeepSeek V4 Flash Cloud (Recommended - Fast 284B MoE)", value: "deepseek-v4-flash:cloud" },
    { label: "DeepSeek V4 Pro Cloud (Frontier MoE & Style)", value: "deepseek-v4-pro:cloud" },
    { label: "GPT-OSS 120B Cloud (Flagship Open Reasoning)", value: "gpt-oss:120b:cloud" },
    { label: "Kimi K3 Cloud (Native Multimodal Agentic)", value: "kimi-k3:cloud" },
    { label: "MiniMax M3 Cloud (Coding & Agentic Frontier)", value: "minimax-m3:cloud" },
    { label: "GLM-5.2 Cloud (Long-Horizon Tasks)", value: "glm-5.2:cloud" },
    { label: "Mistral Large 3 Cloud (Enterprise-Grade Prose)", value: "mistral-large-3:cloud" },
    { label: "Qwen3.6 27B (Local Offline Quality)", value: "qwen3.6:27b" },
    { label: "GPT-OSS 20B (Lightweight Local Offline)", value: "gpt-oss:20b" }
  ],
  [PROVIDERS.OPENAI]: [
    { label: "GPT-5.6 Luna (Recommended - Fast & Cost-Effective)", value: "gpt-5.6-luna" },
    { label: "GPT-5.6 Terra (Balanced Everyday Work)", value: "gpt-5.6-terra" },
    { label: "GPT-5.6 Sol (Flagship - Deep Structural Reasoning)", value: "gpt-5.6-sol" },
    { label: "GPT-5.4 (Previous-Gen Reasoning Flagship)", value: "gpt-5.4" }
  ],
  [PROVIDERS.ANTHROPIC]: [
    { label: "Claude Haiku 4.5 (Recommended - Fast & Crisp Editing)", value: "claude-haiku-4-5-20251001" },
    { label: "Claude Sonnet 5 (Premier Copyeditor)", value: "claude-sonnet-5" },
    { label: "Claude Opus 4.8 (Comprehensive Essay Analysis)", value: "claude-opus-4-8" },
    { label: "Claude Fable 5 (Deepest Reasoning, Top Tier)", value: "claude-fable-5" }
  ]
};
var PROVIDER_DOCS = {
  [PROVIDERS.OPENROUTER]: "https://openrouter.ai/keys",
  [PROVIDERS.GEMINI]: "https://aistudio.google.com/app/apikey",
  [PROVIDERS.GROQ]: "https://console.groq.com/keys",
  [PROVIDERS.MISTRAL]: "https://console.mistral.ai/api-keys",
  [PROVIDERS.DEEPSEEK]: "https://platform.deepseek.com/api_keys",
  [PROVIDERS.OLLAMA]: "https://ollama.com",
  [PROVIDERS.OPENAI]: "https://platform.openai.com/api-keys",
  [PROVIDERS.ANTHROPIC]: "https://console.anthropic.com/settings/keys"
};
var PREBUILT_PROMPTS = [
  {
    id: "grammar_spelling",
    name: "Fix Grammar & Spelling",
    description: "Corrects spelling, grammar, punctuation, and typographical mistakes while preserving tone.",
    instruction: "Carefully correct all spelling, punctuation, grammatical errors, and typos. Maintain the original meaning, voice, and markdown formatting exactly."
  },
  {
    id: "concise_shorten",
    name: "Shorten & Make Concise",
    description: "Removes filler words and redundancies to express ideas with maximum clarity.",
    instruction: "Make the writing concise, clear, and punchy. Eliminate filler phrases, redundancies, and unnecessary fluff without losing core information."
  },
  {
    id: "passive_voice",
    name: "Remove Passive Voice",
    description: "Converts passive voice sentences to direct, engaging active voice.",
    instruction: "Rewrite passive voice sentences into active voice. Make the subject perform the action to make the prose lively and direct."
  },
  {
    id: "omit_adverbs",
    name: "Omit Unnecessary Adverbs",
    description: "Replaces weak adverb-verb pairings with strong, precise verbs.",
    instruction: "Remove weak or redundant adverbs (e.g., 'very', 'extremely', 'really', 'quickly walked' -> 'strode'). Use stronger, more descriptive verbs and nouns."
  },
  {
    id: "improve_flow",
    name: "Improve Flow & Readability",
    description: "Enhances transitions, sentence rhythm, and overall paragraph structure.",
    instruction: "Enhance sentence variety, cadence, transitions, and paragraph flow. Ensure ideas transition logically and comfortably."
  },
  {
    id: "professional_tone",
    name: "Professional & Business",
    description: "Refines text into a polished, authoritative executive tone.",
    instruction: "Refine the text to sound polished, confident, professional, and business-ready. Avoid slang and overly colloquial idioms."
  },
  {
    id: "add_humor",
    name: "Add Subtle Humor & Wit",
    description: "Injects lighthearted wit and clever analogies where appropriate.",
    instruction: "Inject subtle wit, clever analogies, or lighthearted humor to make the content engaging and delightful while preserving the core message."
  },
  {
    id: "academic_clarity",
    name: "Academic & Analytical",
    description: "Structures arguments rigorously with precise academic terminology.",
    instruction: "Elevate the prose to an academic and rigorous standard. Use precise terminology, structured reasoning, and objective phrasing."
  }
];

// anp-23-grammar-reviewer/lib/engine/tokenizer.js
function tokenizeContent(text, mode = GRANULARITY_MODES.PARAGRAPH) {
  if (!text || typeof text !== "string") {
    return [];
  }
  if (mode === GRANULARITY_MODES.FULL) {
    return [
      {
        id: 1,
        original: text,
        type: "full",
        isInspectable: text.trim().length > 0
      }
    ];
  }
  if (mode === GRANULARITY_MODES.PARAGRAPH) {
    return tokenizeParagraphs(text);
  }
  if (mode === GRANULARITY_MODES.SENTENCE) {
    return tokenizeSentences(text);
  }
  return tokenizeParagraphs(text);
}
function tokenizeParagraphs(text) {
  const lines = text.split("\n");
  const paragraphs = [];
  let currentBuffer = [];
  let inCodeFence = false;
  let idCounter = 1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      inCodeFence = !inCodeFence;
      currentBuffer.push(line);
      continue;
    }
    if (inCodeFence) {
      currentBuffer.push(line);
      continue;
    }
    if (line.trim() === "") {
      if (currentBuffer.length > 0) {
        const chunkText = currentBuffer.join("\n");
        paragraphs.push({
          id: idCounter++,
          original: chunkText,
          type: "paragraph",
          isInspectable: isInspectableText(chunkText)
        });
        currentBuffer = [];
      }
      paragraphs.push({
        id: idCounter++,
        original: "",
        type: "separator",
        isInspectable: false
      });
    } else {
      currentBuffer.push(line);
    }
  }
  if (currentBuffer.length > 0) {
    const chunkText = currentBuffer.join("\n");
    paragraphs.push({
      id: idCounter++,
      original: chunkText,
      type: "paragraph",
      isInspectable: isInspectableText(chunkText)
    });
  }
  return paragraphs;
}
function tokenizeSentences(text) {
  const paragraphs = tokenizeParagraphs(text);
  const items = [];
  let idCounter = 1;
  for (const para of paragraphs) {
    if (!para.isInspectable || para.original.trim().startsWith("```") || para.original.trim().startsWith("#")) {
      items.push({
        ...para,
        id: idCounter++
      });
      continue;
    }
    const sentences = splitIntoSentences(para.original);
    for (const s of sentences) {
      items.push({
        id: idCounter++,
        original: s,
        type: "sentence",
        isInspectable: isInspectableText(s)
      });
    }
  }
  return items;
}
function splitIntoSentences(text) {
  const protectedText = text.replace(/\b(e\.g\.|i\.e\.|etc\.|mr\.|mrs\.|dr\.|vs\.|fig\.|no\.)/gi, (match) => match.replace(/\./g, "\xA7DOT\xA7")).replace(/(\d+)\.(\d+)/g, "$1\xA7DOT\xA7$2");
  const parts = protectedText.split(/([.!?]+(?:\s+|$))/g);
  const result = [];
  let current = "";
  for (let i = 0; i < parts.length; i++) {
    current += parts[i];
    if (i % 2 === 1 || i === parts.length - 1) {
      if (current.trim().length > 0) {
        result.push(current.replace(/§DOT§/g, "."));
        current = "";
      }
    }
  }
  if (current.trim().length > 0) {
    result.push(current.replace(/§DOT§/g, "."));
  }
  return result.length > 0 ? result : [text];
}
function isInspectableText(text) {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("```") && trimmed.endsWith("```")) return false;
  if (/^[-*_]{3,}$/.test(trimmed)) return false;
  return trimmed.length > 2;
}

// anp-23-grammar-reviewer/lib/engine/diffEngine.js
function tokenizeWords(text) {
  if (!text) return [];
  return text.match(/[\w'-]+|[^\w\s]|\s+/g) || [];
}
function computeTokenDiff(a, b) {
  const n = a.length;
  const m = b.length;
  const matrix = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i2 = 1; i2 <= n; i2++) {
    for (let j2 = 1; j2 <= m; j2++) {
      if (a[i2 - 1] === b[j2 - 1]) {
        matrix[i2][j2] = matrix[i2 - 1][j2 - 1] + 1;
      } else {
        matrix[i2][j2] = Math.max(matrix[i2 - 1][j2], matrix[i2][j2 - 1]);
      }
    }
  }
  const diff = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      diff.unshift({ type: "equal", value: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      diff.unshift({ type: "insert", value: b[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
      diff.unshift({ type: "delete", value: a[i - 1] });
      i--;
    }
  }
  return diff;
}
function computeWordDiff(original = "", suggested = "") {
  if (original === suggested) {
    const origWords = tokenizeWords(original);
    return {
      hasChanges: false,
      diff: origWords.map((w) => ({ type: "equal", value: w })),
      stats: { additions: 0, deletions: 0, totalOriginalWords: origWords.length, totalSuggestedWords: origWords.length },
      inlineHtml: escapeHtml(original),
      originalHtml: escapeHtml(original),
      suggestedHtml: escapeHtml(suggested)
    };
  }
  const origTokens = tokenizeWords(original);
  const suggTokens = tokenizeWords(suggested);
  const diff = computeTokenDiff(origTokens, suggTokens);
  let additions = 0;
  let deletions = 0;
  let inlineHtml = "";
  let originalHtml = "";
  let suggestedHtml = "";
  for (const part of diff) {
    const escaped = escapeHtml(part.value);
    if (part.type === "equal") {
      inlineHtml += escaped;
      originalHtml += escaped;
      suggestedHtml += escaped;
    } else if (part.type === "delete") {
      deletions++;
      inlineHtml += `<del class="diff-del">${escaped}</del>`;
      originalHtml += `<span class="diff-del-highlight">${escaped}</span>`;
    } else if (part.type === "insert") {
      additions++;
      inlineHtml += `<ins class="diff-ins">${escaped}</ins>`;
      suggestedHtml += `<span class="diff-ins-highlight">${escaped}</span>`;
    }
  }
  const hasChanges = additions > 0 || deletions > 0;
  return {
    hasChanges,
    diff,
    stats: {
      additions,
      deletions,
      totalOriginalWords: origTokens.length,
      totalSuggestedWords: suggTokens.length
    },
    inlineHtml,
    originalHtml,
    suggestedHtml
  };
}
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// anp-23-grammar-reviewer/lib/engine/reviewSession.js
var ReviewSession = class _ReviewSession {
  constructor({
    noteUUID = "",
    noteTitle = "Untitled Note",
    originalContent = "",
    granularity = GRANULARITY_MODES.FULL,
    promptPresetId = "grammar_spelling",
    customPrompt = "",
    provider = "OpenRouter",
    model = ""
  } = {}) {
    this.sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    this.noteUUID = noteUUID;
    this.noteTitle = noteTitle;
    this.originalContent = originalContent;
    this.granularity = granularity;
    this.promptPresetId = promptPresetId;
    this.customPrompt = customPrompt;
    this.provider = provider;
    this.model = model;
    this.startedAt = Date.now();
    this.iteration = 1;
    this.currentIndex = 0;
    this.items = [];
    this.history = [];
    this.initializeItems();
  }
  initializeItems() {
    const rawTokens = tokenizeContent(this.originalContent, this.granularity);
    this.items = rawTokens.map((token) => ({
      id: token.id,
      original: token.original,
      type: token.type,
      isInspectable: token.isInspectable,
      status: "pending",
      // "pending" | "accepted" | "rejected" | "modified"
      suggestion: token.original,
      diff: null,
      customEdit: null,
      reviewedAt: null
    }));
  }
  /**
   * Sets AI suggestion for a specific item and calculates diff.
   * @param {number} index
   * @param {string} suggestion
   */
  setSuggestion(index, suggestion) {
    if (!this.items[index]) return;
    const item = this.items[index];
    item.suggestion = suggestion;
    item.diff = computeWordDiff(item.original, suggestion);
    if (!item.diff.hasChanges) {
      item.status = "accepted";
    }
  }
  /**
   * Accepts the suggestion for the specified item.
   * @param {number} index
   */
  accept(index) {
    if (this.items[index]) {
      this.items[index].status = "accepted";
      this.items[index].reviewedAt = Date.now();
    }
  }
  /**
   * Rejects the suggestion and keeps the original text.
   * @param {number} index
   */
  reject(index) {
    if (this.items[index]) {
      this.items[index].status = "rejected";
      this.items[index].reviewedAt = Date.now();
    }
  }
  /**
   * Manually modifies the text for this item.
   * @param {number} index
   * @param {string} customText
   */
  manualEdit(index, customText) {
    if (this.items[index]) {
      this.items[index].customEdit = customText;
      this.items[index].status = "modified";
      this.items[index].diff = computeWordDiff(this.items[index].original, customText);
      this.items[index].reviewedAt = Date.now();
    }
  }
  /**
   * Assembles the final markdown output based on accepted/rejected/modified states.
   * @returns {string}
   */
  getReconstructedContent() {
    return this.items.map((item) => {
      if (item.status === "accepted") {
        return item.suggestion;
      } else if (item.status === "modified" && item.customEdit !== null) {
        return item.customEdit;
      }
      return item.original;
    }).join("\n");
  }
  /**
   * Returns summary metrics for the review session.
   */
  getMetrics() {
    const inspectable = this.items.filter((i) => i.isInspectable);
    const total = inspectable.length;
    const reviewed = inspectable.filter((i) => i.status !== "pending").length;
    const accepted = inspectable.filter((i) => i.status === "accepted" || i.status === "modified").length;
    const rejected = inspectable.filter((i) => i.status === "rejected").length;
    let totalAdditions = 0;
    let totalDeletions = 0;
    for (const item of this.items) {
      if (item.diff?.stats) {
        totalAdditions += item.diff.stats.additions;
        totalDeletions += item.diff.stats.deletions;
      }
    }
    return {
      total,
      reviewed,
      accepted,
      rejected,
      pending: total - reviewed,
      percentComplete: total > 0 ? Math.round(reviewed / total * 100) : 100,
      totalAdditions,
      totalDeletions
    };
  }
  /**
   * Serializes the entire session state to a plain JSON-safe object.
   */
  toJSON() {
    return {
      sessionId: this.sessionId,
      noteUUID: this.noteUUID,
      noteTitle: this.noteTitle,
      originalContent: this.originalContent,
      granularity: this.granularity,
      promptPresetId: this.promptPresetId,
      customPrompt: this.customPrompt,
      provider: this.provider,
      model: this.model,
      startedAt: this.startedAt,
      iteration: this.iteration,
      currentIndex: this.currentIndex,
      items: this.items
    };
  }
  /**
   * Restores a ReviewSession instance from serialized JSON.
   * @param {object} data
   * @returns {ReviewSession}
   */
  static fromJSON(data) {
    if (!data) return null;
    const session = new _ReviewSession({
      noteUUID: data.noteUUID,
      noteTitle: data.noteTitle,
      originalContent: data.originalContent,
      granularity: data.granularity,
      promptPresetId: data.promptPresetId,
      customPrompt: data.customPrompt,
      provider: data.provider,
      model: data.model
    });
    session.sessionId = data.sessionId || session.sessionId;
    session.startedAt = data.startedAt || session.startedAt;
    session.iteration = data.iteration || 1;
    session.currentIndex = typeof data.currentIndex === "number" ? data.currentIndex : 0;
    if (Array.isArray(data.items) && data.items.length > 0) {
      session.items = data.items;
    }
    return session;
  }
};

// anp-23-grammar-reviewer/lib/providers/baseProvider.js
var BaseProvider = class {
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
    this.timeoutMs = config.timeoutMs || 45e3;
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
        throw new Error(`Request timed out after ${Math.round(this.timeoutMs / 1e3)}s.`);
      }
      if (err instanceof TypeError && (err.message.includes("Failed to fetch") || err.message.includes("NetworkError") || err.message.includes("CORS"))) {
        if (url.includes("localhost") || url.includes("127.0.0.1")) {
          throw new Error(
            `Localhost Connection Blocked by Browser CORS Policy.

To allow Amplenote to connect to your local Ollama:
1. Windows: Set environment variable OLLAMA_ORIGINS="*" and restart Ollama.
2. Mac/Linux: Run 'OLLAMA_ORIGINS="*" ollama serve'.
3. Or use OpenRouter, Google Gemini, or Groq free tiers in Settings.`
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
};

// anp-23-grammar-reviewer/lib/providers/openaiProvider.js
var OpenAIProvider = class extends BaseProvider {
  constructor(config = {}) {
    super({
      ...config,
      baseUrl: config.baseUrl || "https://api.openai.com/v1",
      defaultModel: config.defaultModel || DEFAULT_MODELS2[PROVIDERS.OPENAI]
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
      temperature
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
    if (output === void 0 || output === null) {
      throw new Error("OpenAI returned an empty response.");
    }
    return output.trim();
  }
};

// anp-23-grammar-reviewer/lib/providers/anthropicProvider.js
var AnthropicProvider = class extends BaseProvider {
  constructor(config = {}) {
    super({
      ...config,
      baseUrl: config.baseUrl || "https://api.anthropic.com/v1",
      defaultModel: config.defaultModel || DEFAULT_MODELS2[PROVIDERS.ANTHROPIC]
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
    const contentBlock = data.content?.find((b) => b.type === "text");
    const output = contentBlock ? contentBlock.text : data.content?.[0]?.text || "";
    if (!output) {
      throw new Error("Anthropic returned an empty response.");
    }
    return output.trim();
  }
};

// anp-23-grammar-reviewer/lib/providers/geminiProvider.js
var GeminiProvider = class extends BaseProvider {
  constructor(config = {}) {
    super({
      ...config,
      baseUrl: config.baseUrl || "https://generativelanguage.googleapis.com/v1beta",
      defaultModel: config.defaultModel || DEFAULT_MODELS2[PROVIDERS.GEMINI]
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
        temperature
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
    const textPart = candidate?.content?.parts?.find((p) => p.text !== void 0);
    const output = textPart?.text || candidate?.content?.parts?.[0]?.text;
    if (!output) {
      throw new Error("Google Gemini returned an empty response.");
    }
    return output.trim();
  }
};

// anp-23-grammar-reviewer/lib/providers/openrouterProvider.js
var OpenRouterProvider = class extends BaseProvider {
  constructor(config = {}) {
    super({
      ...config,
      baseUrl: config.baseUrl || "https://openrouter.ai/api/v1",
      defaultModel: config.defaultModel || DEFAULT_MODELS2[PROVIDERS.OPENROUTER]
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
    if (output === void 0 || output === null) {
      throw new Error("OpenRouter returned an empty response.");
    }
    return output.trim();
  }
};

// anp-23-grammar-reviewer/lib/providers/groqProvider.js
var GroqProvider = class extends BaseProvider {
  constructor(config = {}) {
    super({
      ...config,
      baseUrl: config.baseUrl || "https://api.groq.com/openai/v1",
      defaultModel: config.defaultModel || DEFAULT_MODELS2[PROVIDERS.GROQ]
    });
  }
  async complete({ prompt, systemPrompt, model, temperature = 0.3 }) {
    if (!this.apiKey) {
      throw new Error("Groq API key is missing. Please configure it in plugin settings.");
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
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });
    const output = data.choices?.[0]?.message?.content;
    if (output === void 0 || output === null) {
      throw new Error("Groq returned an empty response.");
    }
    return output.trim();
  }
};

// anp-23-grammar-reviewer/lib/providers/deepseekProvider.js
var DeepSeekProvider = class extends BaseProvider {
  constructor(config = {}) {
    super({
      ...config,
      baseUrl: config.baseUrl || "https://api.deepseek.com",
      defaultModel: config.defaultModel || DEFAULT_MODELS2[PROVIDERS.DEEPSEEK]
    });
  }
  async complete({ prompt, systemPrompt, model, temperature = 0.3 }) {
    if (!this.apiKey) {
      throw new Error("DeepSeek API key is missing. Please configure it in plugin settings.");
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
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });
    const output = data.choices?.[0]?.message?.content;
    if (output === void 0 || output === null) {
      throw new Error("DeepSeek returned an empty response.");
    }
    return output.trim();
  }
};

// anp-23-grammar-reviewer/lib/providers/mistralProvider.js
var MistralProvider = class extends BaseProvider {
  constructor(config = {}) {
    super({
      ...config,
      baseUrl: config.baseUrl || "https://api.mistral.ai/v1",
      defaultModel: config.defaultModel || DEFAULT_MODELS2[PROVIDERS.MISTRAL]
    });
  }
  async complete({ prompt, systemPrompt, model, temperature = 0.3 }) {
    if (!this.apiKey) {
      throw new Error("Mistral API key is missing. Please configure it in plugin settings.");
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
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });
    const output = data.choices?.[0]?.message?.content;
    if (output === void 0 || output === null) {
      throw new Error("Mistral returned an empty response.");
    }
    return output.trim();
  }
};

// anp-23-grammar-reviewer/lib/providers/ollamaProvider.js
var OllamaProvider = class extends BaseProvider {
  constructor(config = {}) {
    super({
      ...config,
      baseUrl: config.baseUrl || "http://localhost:11434/v1",
      defaultModel: config.defaultModel || DEFAULT_MODELS2[PROVIDERS.OLLAMA]
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
      temperature
    };
    const headers = {
      "Content-Type": "application/json"
    };
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }
    const data = await this.sendRequest(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });
    const output = data.choices?.[0]?.message?.content;
    if (output === void 0 || output === null) {
      throw new Error("Local Ollama endpoint returned an empty response. Ensure Ollama is running (`ollama serve`).");
    }
    return output.trim();
  }
};

// anp-23-grammar-reviewer/lib/providers/providerRegistry.js
function getProviderConfig(app) {
  const settings = app?.settings || {};
  const selectedProvider = settings["AI Provider"] || DEFAULT_PROVIDER2;
  const keys = {};
  const allModels = {};
  let rawCustomModelSetting = settings["Custom AI Model"] || "";
  let parsedCustomModels = {};
  if (rawCustomModelSetting && typeof rawCustomModelSetting === "string") {
    try {
      if (rawCustomModelSetting.trim().startsWith("{")) {
        const parsed = JSON.parse(rawCustomModelSetting);
        if (typeof parsed === "object" && parsed !== null) {
          parsedCustomModels = parsed;
        }
      } else {
        parsedCustomModels[selectedProvider] = rawCustomModelSetting.trim();
      }
    } catch (e) {
      parsedCustomModels[selectedProvider] = rawCustomModelSetting.trim();
    }
  }
  for (const p of Object.values(PROVIDERS)) {
    const rawVal = settings[`${p} API Key`] || settings[`${p} Key`] || "";
    let extractedKey = "";
    let extractedModel = parsedCustomModels[p] || "";
    if (rawVal && typeof rawVal === "string") {
      try {
        if (rawVal.trim().startsWith("{")) {
          const parsed = JSON.parse(rawVal);
          if (typeof parsed === "object" && parsed !== null) {
            extractedKey = parsed.apiKey || parsed.key || "";
            if (parsed.model || parsed.customModel) {
              extractedModel = parsed.model || parsed.customModel;
            }
          }
        } else {
          extractedKey = rawVal.trim();
        }
      } catch (e) {
        extractedKey = rawVal.trim();
      }
    }
    keys[p] = extractedKey;
    allModels[p] = extractedModel;
  }
  const customModel = allModels[selectedProvider] || "";
  const customBaseUrl = settings["Custom Base URL"] || (selectedProvider === PROVIDERS.OLLAMA ? settings["Ollama Base URL"] || "http://localhost:11434/v1" : "");
  return {
    provider: selectedProvider,
    apiKey: keys[selectedProvider] || "",
    allKeys: keys,
    allModels,
    customModel,
    customBaseUrl
  };
}
function createProviderInstance({ provider = DEFAULT_PROVIDER2, apiKey = "", baseUrl = "", defaultModel = "" } = {}) {
  const finalModel = defaultModel || DEFAULT_MODELS2[provider];
  switch (provider) {
    case PROVIDERS.DEEPSEEK:
      return new DeepSeekProvider({ apiKey, defaultModel: finalModel });
    case PROVIDERS.MISTRAL:
      return new MistralProvider({ apiKey, defaultModel: finalModel });
    case PROVIDERS.OLLAMA:
      return new OllamaProvider({ baseUrl: baseUrl || "http://localhost:11434/v1", defaultModel: finalModel });
    case PROVIDERS.GROQ:
      return new GroqProvider({ apiKey, defaultModel: finalModel });
    case PROVIDERS.GEMINI:
      return new GeminiProvider({ apiKey, defaultModel: finalModel });
    case PROVIDERS.ANTHROPIC:
      return new AnthropicProvider({ apiKey, defaultModel: finalModel });
    case PROVIDERS.OPENAI:
      return new OpenAIProvider({ apiKey, defaultModel: finalModel });
    case PROVIDERS.OPENROUTER:
    default:
      return new OpenRouterProvider({ apiKey, defaultModel: finalModel });
  }
}

// anp-23-grammar-reviewer/lib/features/launcher.js
async function launchReviewer(app, targetNoteUUID, forcePrompt = false) {
  try {
    let noteUUID = targetNoteUUID || app.context?.noteUUID;
    let noteTitle = "Untitled Note";
    if (!noteUUID && !forcePrompt) {
      noteUUID = app.settings?.["Last Opened Note UUID"] || null;
    }
    if (!noteUUID || forcePrompt) {
      const selected = await app.prompt("Select note for Grammar Review:", {
        inputs: [
          {
            label: "Search Note",
            type: "note"
          }
        ]
      });
      if (!selected) return;
      if (typeof selected === "object" && selected !== null) {
        noteUUID = selected.uuid;
        if (selected.name) {
          noteTitle = selected.name;
        }
      } else if (typeof selected === "string") {
        noteUUID = selected;
      }
    }
    if (!noteUUID) {
      await app.alert("No note was selected.");
      return;
    }
    if (typeof app.setSetting === "function") {
      try {
        await app.setSetting("Last Opened Note UUID", noteUUID);
      } catch (saveErr) {
        console.warn("[GrammarReviewer] Could not save Last Opened Note UUID:", saveErr);
      }
    }
    let noteContent = "";
    try {
      noteContent = await app.getNoteContent({ uuid: noteUUID }) || "";
    } catch (fetchErr) {
      console.warn("[GrammarReviewer] getNoteContent error:", fetchErr);
    }
    if (noteTitle === "Untitled Note") {
      try {
        const noteHandle = await app.findNote({ uuid: noteUUID });
        if (noteHandle && noteHandle.name) {
          noteTitle = noteHandle.name;
        }
      } catch (findErr) {
        console.warn("[GrammarReviewer] findNote error:", findErr);
      }
    }
    const config = getProviderConfig(app);
    const session = new ReviewSession({
      noteUUID,
      noteTitle,
      originalContent: noteContent,
      granularity: GRANULARITY_MODES.FULL,
      provider: config.provider,
      model: config.customModel || DEFAULT_MODELS2[config.provider] || ""
    });
    setActiveSession(session);
    await app.openEmbed();
  } catch (err) {
    console.error("[GrammarReviewer] Error in launchReviewer:", err);
    const errorMsg = err?.message || (typeof err === "string" ? err : JSON.stringify(err)) || "Unknown error occurred";
    await app.alert(`Failed to launch Grammar Reviewer: ${errorMsg}`);
  }
}

// anp-23-grammar-reviewer/lib/engine/promptPresets.js
function buildReviewPrompt({ instruction, targetText, context = "", granularity = "paragraph" }) {
  const systemPrompt = `You are a master copyeditor and high-school writing teacher.
Your job is to rewrite and improve the user's provided markdown text according to the specific editing instruction.

STRICT EDITING RULES:
1. Return ONLY the rewritten text. Do NOT include any intro, outro, preamble, conversational remarks, or markdown backticks enclosing the entire response.
2. Preserve all Markdown formatting (headers #, bold **, italics *, links [], task lists [ ], bullets -) unless the edit explicitly targets that structure.
3. If no improvements are necessary, return the exact original text verbatim.
4. Maintain the author's core ideas, tone, and factual content while fulfilling the instruction.`;
  const userPrompt = `Editing Instruction:
${instruction}

Text to review (${granularity}):
"""
${targetText}
"""

Rewritten version:`;
  return { systemPrompt, userPrompt };
}
function getPromptPreset(id) {
  const found = PREBUILT_PROMPTS.find((p) => p.id === id);
  return found || PREBUILT_PROMPTS[0];
}

// anp-23-grammar-reviewer/lib/features/reviewWorkflow.js
async function handleRunReview(app, itemIndex = -1, promptOverride = "") {
  const session = getActiveSession();
  if (!session) {
    throw new Error("No active review session found.");
  }
  const targetIdx = itemIndex >= 0 ? itemIndex : session.currentIndex;
  const item = session.items[targetIdx];
  if (!item) {
    throw new Error(`Item at index ${targetIdx} does not exist.`);
  }
  const config = getProviderConfig(app);
  const targetProvider = session.provider || config.provider;
  const apiKey = config.allKeys[targetProvider] || config.apiKey;
  const provider = createProviderInstance({
    provider: targetProvider,
    apiKey,
    baseUrl: targetProvider === "Ollama (Local)" ? config.customBaseUrl : void 0,
    defaultModel: session.model || config.customModel
  });
  const preset = getPromptPreset(session.promptPresetId);
  const instruction = promptOverride || session.customPrompt || preset.instruction;
  const { systemPrompt, userPrompt } = buildReviewPrompt({
    instruction,
    targetText: item.original,
    context: session.noteTitle,
    granularity: session.granularity
  });
  const aiOutput = await provider.complete({
    prompt: userPrompt,
    systemPrompt,
    model: session.model
  });
  session.setSuggestion(targetIdx, aiOutput);
  return session;
}
async function handleReviewAll(app) {
  const session = getActiveSession();
  if (!session) return;
  for (let i = 0; i < session.items.length; i++) {
    const item = session.items[i];
    if (item.isInspectable && item.status === "pending") {
      try {
        await handleRunReview(app, i);
      } catch (err) {
        console.warn(`[GrammarReviewer] Error reviewing item #${i}:`, err);
      }
    }
  }
}
function handleSetGranularity(app, newMode) {
  const session = getActiveSession();
  if (!session) return;
  const newSession = new ReviewSession({
    noteUUID: session.noteUUID,
    noteTitle: session.noteTitle,
    originalContent: session.originalContent,
    granularity: newMode,
    promptPresetId: session.promptPresetId,
    customPrompt: session.customPrompt,
    provider: session.provider,
    model: session.model
  });
  setActiveSession(newSession);
}

// anp-23-grammar-reviewer/lib/data/reportGenerator.js
function generateChangesReport({ session, sourceNoteTitle, sourceNoteUUID, finalContent }) {
  const now = /* @__PURE__ */ new Date();
  const dateStr = now.toISOString().replace("T", " ").substring(0, 16);
  const fullDateStr = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
  const metrics = session.getMetrics();
  const titleName = sourceNoteTitle || "Untitled Note";
  const sourceLink = sourceNoteUUID ? `[${titleName}](https://www.amplenote.com/notes/${sourceNoteUUID})` : titleName;
  const promptName = session.customPrompt ? `Custom: "${session.customPrompt}"` : `Preset: ${session.promptPresetId.replace(/_/g, " ")}`;
  const md = `# \u{1F4DD} Grammar Review Changes: ${titleName}

> **Source Note:** ${sourceLink}  
> **Review Date:** ${fullDateStr}  
> **AI Engine:** \`${session.provider}\` \xB7 Model: \`${session.model || "default"}\`  
> **Granularity:** \`${session.granularity.toUpperCase()}\` \xB7 **Style:** *${promptName}*  
> **Diff Summary:** \`+${metrics.totalAdditions} words added\`, \`-${metrics.totalDeletions} words removed\` (Accepted: **${metrics.accepted}**, Rejected: **${metrics.rejected}**)

---

## \u{1F4CA} Summary of Changes

${generateItemChangesTable(session.items)}

---

## \u{1F4C4} Complete Revised Document

${finalContent}

---

## \u{1F4DC} Original Document Snapshot

<details>
<summary>Click to view original text before review</summary>

\`\`\`markdown
${session.originalContent}
\`\`\`

</details>

---
*Generated automatically by Amplenote Grammar & Style Reviewer Plugin*
`;
  return {
    name: `Grammar Changes: ${titleName} (${dateStr})`,
    tags: [TAG_GRAMMAR_CHANGES],
    content: md
  };
}
function generateItemChangesTable(items) {
  const inspectableItems = items.filter((i) => i.isInspectable);
  if (inspectableItems.length === 0) {
    return "*No inspectable items in this review pass.*";
  }
  const changeBlocks = inspectableItems.map((item, idx) => {
    let statusBadge = "\u274C Kept Original";
    let appliedText = item.original;
    if (item.status === "accepted") {
      statusBadge = "\u2705 Accepted";
      appliedText = item.suggestion || item.original;
    } else if (item.status === "modified") {
      statusBadge = "\u270F\uFE0F Manually Edited";
      appliedText = item.customEdit || item.suggestion || item.original;
    }
    return `### Item #${idx + 1} (${statusBadge} \xB7 *${item.type}*)
- **Original Draft:**  
  ${item.original}
- **Applied Output:**  
  ${appliedText}
`;
  }).join("\n");
  return changeBlocks;
}

// anp-23-grammar-reviewer/lib/data/historyManager.js
function generateHistoryRecord({ session, sourceNoteTitle, sourceNoteUUID, finalContent }) {
  const now = /* @__PURE__ */ new Date();
  const timestamp = Math.floor(now.getTime() / 1e3);
  const dateStr = now.toISOString().replace("T", " ").substring(0, 16);
  const fullDateStr = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
  const metrics = session.getMetrics();
  const titleName = sourceNoteTitle || "Untitled Note";
  const sourceLink = sourceNoteUUID ? `[${titleName}](https://www.amplenote.com/notes/${sourceNoteUUID})` : titleName;
  const record = {
    schemaVersion: 1,
    timestamp,
    isoDate: now.toISOString(),
    sourceNote: {
      uuid: sourceNoteUUID,
      title: titleName
    },
    session: {
      id: session.sessionId,
      provider: session.provider,
      model: session.model,
      granularity: session.granularity,
      promptPresetId: session.promptPresetId,
      customPrompt: session.customPrompt,
      iteration: session.iteration,
      metrics: session.getMetrics()
    },
    items: session.items.map((item) => ({
      id: item.id,
      original: item.original,
      type: item.type,
      status: item.status,
      suggestion: item.suggestion,
      customEdit: item.customEdit,
      diffStats: item.diff?.stats || null
    })),
    originalContent: session.originalContent,
    finalContent
  };
  const markdownContent = `# \u{1F4DC} Grammar Review History: ${titleName}

> **Source Note:** ${sourceLink}  
> **Timestamp:** ${fullDateStr}  
> **AI Engine:** \`${session.provider}\` \xB7 Model: \`${session.model || "default"}\`  
> **Changes:** **${metrics.accepted}** accepted, **${metrics.rejected}** rejected (out of ${metrics.total} items)

---

## \u{1F4BE} Audit Log Payload

\`\`\`json
${JSON.stringify(record, null, 2)}
\`\`\`
`;
  return {
    name: `Grammar History: ${titleName} (${dateStr})`,
    tags: [TAG_GRAMMAR_HISTORY],
    content: markdownContent
  };
}
function parseHistoryNotes(notes = []) {
  const jsonRecords = [];
  const fallbackRecords = [];
  const knownTimestamps = /* @__PURE__ */ new Set();
  const knownSourceNoteTimestamps = /* @__PURE__ */ new Set();
  for (const note of notes) {
    const raw = note.body || note.content || "";
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1]);
        const ts = parsed.timestamp || parseInt(note.name, 10) || 0;
        const key = `${parsed.sourceNote?.uuid || ""}_${Math.floor(ts / 60)}`;
        knownTimestamps.add(ts);
        knownSourceNoteTimestamps.add(key);
        jsonRecords.push({
          noteUUID: note.uuid,
          noteName: note.name,
          ...parsed,
          timestamp: ts
        });
      } catch (err) {
        console.warn("[GrammarReviewer] Could not parse history record for note:", note.uuid, err);
      }
    } else if (raw && (raw.includes("Grammar Review") || raw.includes("Grammar & Style") || raw.includes("Changes Report"))) {
      const titleMatch = raw.match(/# (?:Grammar Review )?(?:Changes )?Report:?\s*(.*)/i) || raw.match(/Source Note:\s*\[([^\]]+)\]/i);
      const dateMatch = raw.match(/\*\*Date:\*\*\s*(.*)/i) || raw.match(/Date:\s*(.*)/i);
      const changesMatch = raw.match(/(\d+)\s*(?:changes?|replacements?|items?)/i);
      const providerMatch = raw.match(/Provider:\s*([^\n\r]+)/i);
      const ts = parseInt(note.name, 10) || (dateMatch ? Math.floor(new Date(dateMatch[1]).getTime() / 1e3) : 0);
      fallbackRecords.push({
        noteUUID: note.uuid,
        noteName: note.name,
        timestamp: ts || Math.floor(Date.now() / 1e3),
        isoDate: dateMatch ? dateMatch[1].trim() : (/* @__PURE__ */ new Date()).toISOString(),
        sourceNote: {
          uuid: note.uuid,
          title: titleMatch ? titleMatch[1].trim() : note.name || "Grammar Review"
        },
        session: {
          provider: providerMatch ? providerMatch[1].trim() : "AI Review",
          granularity: "review",
          metrics: { accepted: changesMatch ? parseInt(changesMatch[1], 10) : 1 }
        }
      });
    }
  }
  const finalRecords = [...jsonRecords];
  for (const fb of fallbackRecords) {
    const key = `${fb.sourceNote?.uuid || ""}_${Math.floor(fb.timestamp / 60)}`;
    if (!knownTimestamps.has(fb.timestamp) && !knownSourceNoteTimestamps.has(key)) {
      finalRecords.push(fb);
    }
  }
  return finalRecords.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

// anp-23-grammar-reviewer/lib/features/saveHandler.js
async function handleSaveAndCommit(app, createAuditNotes = false) {
  const session = getActiveSession();
  if (!session) {
    throw new Error("No active review session to save.");
  }
  const finalContent = session.getReconstructedContent();
  const noteUUID = session.noteUUID;
  await app.replaceNoteContent({ uuid: noteUUID }, finalContent);
  let changesNoteUUID = null;
  let historyNoteUUID = null;
  if (createAuditNotes) {
    try {
      const changesReport = generateChangesReport({
        session,
        sourceNoteTitle: session.noteTitle,
        sourceNoteUUID: session.noteUUID,
        finalContent
      });
      changesNoteUUID = await app.createNote(changesReport.name, changesReport.tags);
      if (changesNoteUUID) {
        await app.insertNoteContent({ uuid: changesNoteUUID }, changesReport.content);
      }
    } catch (e) {
      console.warn("[GrammarReviewer] Could not create changes report note:", e);
    }
    try {
      const historyRecord = generateHistoryRecord({
        session,
        sourceNoteTitle: session.noteTitle,
        sourceNoteUUID: session.noteUUID,
        finalContent
      });
      historyNoteUUID = await app.createNote(historyRecord.name, historyRecord.tags);
      if (historyNoteUUID) {
        await app.insertNoteContent({ uuid: historyNoteUUID }, historyRecord.content);
      }
    } catch (e) {
      console.warn("[GrammarReviewer] Could not create history note:", e);
    }
  }
  return {
    success: true,
    changesNoteUUID,
    historyNoteUUID
  };
}

// anp-23-grammar-reviewer/lib/features/historyViewer.js
async function loadHistoryRecords(app) {
  try {
    const noteMap = /* @__PURE__ */ new Map();
    const historyQueries = [
      { tag: TAG_GRAMMAR_HISTORY },
      { tag: "reports/grammar/history" },
      { query: "tag:-reports/-grammar/-history" },
      { query: "tag:reports/grammar/history" },
      { query: "Grammar Review History Record" }
    ];
    for (const q of historyQueries) {
      try {
        const found = await app.filterNotes(q);
        if (Array.isArray(found)) {
          for (const n of found) {
            if (n && n.uuid && !noteMap.has(n.uuid)) {
              noteMap.set(n.uuid, n);
            }
          }
        }
      } catch (e) {
      }
    }
    if (noteMap.size === 0) {
      const fallbackQueries = [
        { tag: TAG_GRAMMAR_CHANGES },
        { tag: "reports/grammar/changes" },
        { query: "tag:-reports/-grammar/-changes" },
        { query: "tag:reports/grammar/changes" }
      ];
      for (const q of fallbackQueries) {
        try {
          const found = await app.filterNotes(q);
          if (Array.isArray(found)) {
            for (const n of found) {
              if (n && n.uuid && !noteMap.has(n.uuid)) {
                noteMap.set(n.uuid, n);
              }
            }
          }
        } catch (e) {
        }
      }
    }
    if (noteMap.size === 0) {
      return [];
    }
    const populatedNotes = [];
    const notesArray = Array.from(noteMap.values()).slice(0, 40);
    for (const n of notesArray) {
      try {
        const body = await app.getNoteContent({ uuid: n.uuid });
        populatedNotes.push({
          uuid: n.uuid,
          name: n.name,
          body
        });
      } catch (err) {
        populatedNotes.push({
          uuid: n.uuid,
          name: n.name,
          body: ""
        });
      }
    }
    return parseHistoryNotes(populatedNotes);
  } catch (err) {
    console.error("[GrammarReviewer] Error loading history records:", err);
    return [];
  }
}

// anp-23-grammar-reviewer/lib/ui/styles.css.js
var EMBED_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  /* Default Midnight Theme */
  --bg-primary: #0b0f19;
  --bg-secondary: #131b2e;
  --bg-card: #182238;
  --bg-card-hover: #222f4d;
  --border-color: rgba(255, 255, 255, 0.08);
  --border-subtle: rgba(255, 255, 255, 0.05);
  --border-active: #3b82f6;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --accent-primary: #3b82f6;
  --accent-hover: #2563eb;
  --accent-success: #10b981;
  --accent-success-bg: rgba(16, 185, 129, 0.15);
  --accent-danger: #ef4444;
  --accent-danger-bg: rgba(239, 68, 68, 0.15);
  --accent-warning: #f59e0b;
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
  --btn-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Theme: Nord Arctic */
[data-theme="nord"] {
  --bg-primary: #242933;
  --bg-secondary: #2e3440;
  --bg-card: #3b4252;
  --bg-card-hover: #434c5e;
  --border-color: rgba(255, 255, 255, 0.1);
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-active: #88c0d0;
  --text-primary: #eceff4;
  --text-secondary: #d8dee9;
  --text-muted: #9aa8be;
  --accent-primary: #88c0d0;
  --accent-hover: #81a1c1;
  --accent-success: #a3be8c;
  --accent-success-bg: rgba(163, 190, 140, 0.2);
  --accent-danger: #bf616a;
  --accent-danger-bg: rgba(191, 97, 106, 0.2);
  --accent-warning: #ebcb8b;
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

/* Theme: Glassmorphism */
[data-theme="glass"] {
  --bg-primary: #0b1329;
  --bg-secondary: #16203a;
  --bg-card: #1e2c4f;
  --bg-card-hover: #293a62;
  --border-color: rgba(56, 189, 248, 0.15);
  --border-subtle: rgba(56, 189, 248, 0.08);
  --border-active: #38bdf8;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --accent-primary: #38bdf8;
  --accent-hover: #0ea5e9;
  --accent-success: #34d399;
  --accent-success-bg: rgba(52, 211, 153, 0.2);
  --accent-danger: #fb7185;
  --accent-danger-bg: rgba(251, 113, 133, 0.2);
  --accent-warning: #facc15;
  --card-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
}

/* Theme: Emerald Forest */
[data-theme="emerald"] {
  --bg-primary: #061e16;
  --bg-secondary: #0b2e23;
  --bg-card: #124334;
  --bg-card-hover: #185442;
  --border-color: rgba(52, 211, 153, 0.15);
  --border-subtle: rgba(52, 211, 153, 0.08);
  --border-active: #10b981;
  --text-primary: #ecfdf5;
  --text-secondary: #a7f3d0;
  --text-muted: #6ee7b7;
  --accent-primary: #10b981;
  --accent-hover: #059669;
  --accent-success: #34d399;
  --accent-success-bg: rgba(52, 211, 153, 0.25);
  --accent-danger: #f87171;
  --accent-danger-bg: rgba(248, 113, 113, 0.2);
  --accent-warning: #fbbf24;
  --card-shadow: 0 4px 20px rgba(6, 30, 22, 0.4);
}

/* Theme: Cyber Violet */
[data-theme="purple"] {
  --bg-primary: #100a1c;
  --bg-secondary: #1a102f;
  --bg-card: #271947;
  --bg-card-hover: #352260;
  --border-color: rgba(168, 85, 247, 0.2);
  --border-subtle: rgba(168, 85, 247, 0.1);
  --border-active: #a855f7;
  --text-primary: #faf5ff;
  --text-secondary: #e9d5ff;
  --text-muted: #c084fc;
  --accent-primary: #a855f7;
  --accent-hover: #9333ea;
  --accent-success: #4ade80;
  --accent-success-bg: rgba(74, 222, 128, 0.2);
  --accent-danger: #f43f5e;
  --accent-danger-bg: rgba(244, 63, 94, 0.2);
  --accent-warning: #fbbf24;
  --card-shadow: 0 4px 24px rgba(168, 85, 247, 0.2);
}

/* Theme: Clean Daylight (Light Mode) */
[data-theme="light"] {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-card: #f1f5f9;
  --bg-card-hover: #e2e8f0;
  --border-color: #e2e8f0;
  --border-subtle: #f1f5f9;
  --border-active: #2563eb;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;
  --accent-primary: #2563eb;
  --accent-hover: #1d4ed8;
  --accent-success: #059669;
  --accent-success-bg: rgba(5, 150, 105, 0.15);
  --accent-danger: #dc2626;
  --accent-danger-bg: rgba(220, 38, 38, 0.12);
  --accent-warning: #d97706;
  --card-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  --btn-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  scrollbar-width: thin;
  scrollbar-color: var(--accent-primary) var(--bg-primary);
}

html {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.5;
  min-height: 100%;
  width: 100%;
  padding: 14px 18px 48px 18px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Themed Scrollbars */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-primary);
}
::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
}

/* 100% Full Width Container */
.gr-container {
  width: 100%;
  max-width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 100%;
}

/* Top Navigation Header Bar */
.gr-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-secondary);
  padding: 10px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: var(--card-shadow);
  gap: 12px;
  flex-wrap: wrap;
}

.gr-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gr-logo {
  font-size: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 5px 9px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.gr-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.gr-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.gr-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.gr-nav-tabs {
  display: flex;
  gap: 2px;
  background: var(--bg-primary);
  padding: 3px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.gr-tab-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: var(--radius-xs);
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-sans);
  transition: all 0.15s ease;
}

.gr-tab-btn:hover {
  color: var(--text-primary);
}

.gr-tab-btn.active {
  background: var(--accent-primary);
  color: #ffffff;
  box-shadow: var(--btn-shadow);
}

/* Theme Cycler Button */
.gr-theme-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-sans);
  transition: all 0.15s ease;
}

.gr-theme-btn:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-active);
  transform: translateY(-1px);
}

/* Tab Views Container */
.gr-tab-view {
  display: none;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.gr-tab-view.active {
  display: flex;
}

/* Workbench Full-Width 2-Column Grid */
.gr-workbench {
  display: grid;
  grid-template-columns: 290px 1fr;
  gap: 16px;
  width: 100%;
  align-items: stretch;
}

@media (max-width: 920px) {
  .gr-workbench {
    grid-template-columns: 1fr;
  }
}

/* Left Inspector Sidebar */
.gr-sidebar {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
}

.gr-sidebar-section {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.gr-sidebar-section:last-child {
  border-bottom: none;
}

.gr-sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gr-section-title {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.gr-btn-link {
  background: transparent;
  border: none;
  color: var(--accent-primary);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-family: var(--font-sans);
}
.gr-btn-link:hover {
  text-decoration: underline;
}

.gr-form-sublabel {
  font-size: 10px;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 3px;
  display: block;
}

/* Segmented Control */
.gr-segmented-control {
  display: flex;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 3px;
  gap: 3px;
}

.gr-segment-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 7px 6px;
  border-radius: var(--radius-xs);
  font-size: 11.5px;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}
.gr-segment-btn:hover {
  color: var(--text-primary);
}
.gr-segment-btn.active {
  background: var(--accent-primary);
  color: #ffffff;
  box-shadow: var(--btn-shadow);
}

/* Presets List */
.gr-preset-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.gr-preset-item {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-left: 3px solid transparent;
  color: var(--text-secondary);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-sans);
  text-align: left;
  cursor: pointer;
  white-space: normal;
  line-height: 1.35;
  transition: all 0.15s ease;
}
.gr-preset-item:hover {
  border-color: var(--border-active);
  color: var(--text-primary);
  background: var(--bg-card-hover);
  transform: translateX(2px);
}
.gr-preset-item.active {
  background: var(--bg-card);
  border-color: var(--border-active);
  border-left: 3px solid var(--accent-primary);
  color: var(--text-primary);
  font-weight: 600;
}

.gr-custom-prompt-box {
  margin-top: 8px;
  font-size: 11px;
  color: var(--accent-primary);
  background: var(--bg-primary);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

/* Progress Track */
.gr-progress-track {
  width: 100%;
  height: 6px;
  background: var(--bg-primary);
  border-radius: 999px;
  overflow: hidden;
}

.gr-progress-fill {
  height: 100%;
  background: var(--accent-primary);
  transition: width 0.3s ease;
}

.gr-metrics-row {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 11px;
}

/* Keyboard KBD styling */
kbd {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  color: var(--text-primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Main Canvas */
.gr-main-canvas {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

/* Diff Review Card */
.gr-diff-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  flex: 1;
}

.gr-diff-card.active {
  border-color: var(--border-active);
}

.gr-diff-header {
  background: rgba(0, 0, 0, 0.15);
  padding: 12px 18px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gr-diff-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  font-family: var(--font-sans);
}

.badge-pending { background: #475569; color: #f8fafc; }
.badge-accepted { background: var(--accent-success-bg); color: var(--accent-success); border: 1px solid rgba(16,185,129,0.3); }
.badge-rejected { background: var(--accent-danger-bg); color: var(--accent-danger); border: 1px solid rgba(239,68,68,0.3); }
.badge-modified { background: rgba(245, 158, 11, 0.2); color: var(--accent-warning); }

.gr-diff-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px 18px;
  flex: 1;
}

@media (max-width: 768px) {
  .gr-diff-body {
    grid-template-columns: 1fr;
  }
}

.gr-pane {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.gr-pane-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  display: flex;
  justify-content: space-between;
}

.gr-pane-content {
  background: var(--bg-primary);
  padding: 18px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  font-size: 14px;
  font-family: var(--font-sans);
  white-space: pre-wrap;
  min-height: 440px;
  height: calc(100vh - 290px);
  max-height: 750px;
  overflow-y: auto;
  line-height: 1.75;
  letter-spacing: 0.01em;
}

/* Side-by-Side Dual Highlighting */
.diff-del-highlight {
  background: var(--accent-danger-bg);
  color: #f87171;
  text-decoration: line-through;
  padding: 1px 4px;
  border-radius: 3px;
  margin: 0 1px;
  font-weight: 500;
  border-bottom: 1px dashed rgba(239, 68, 68, 0.4);
}

.diff-ins-highlight {
  background: var(--accent-success-bg);
  color: #34d399;
  text-decoration: none;
  padding: 1px 4px;
  border-radius: 3px;
  margin: 0 1px;
  font-weight: 600;
  border-bottom: 1px solid rgba(16, 185, 129, 0.4);
}

/* Inline Diff Highlighting */
.diff-del {
  background: var(--accent-danger-bg);
  color: #f87171;
  text-decoration: line-through;
  padding: 1px 4px;
  border-radius: 3px;
  margin: 0 1px;
}

.diff-ins {
  background: var(--accent-success-bg);
  color: #34d399;
  text-decoration: none;
  padding: 1px 4px;
  border-radius: 3px;
  margin: 0 1px;
  font-weight: 600;
}

/* Diff View Switcher Pills */
.gr-diff-view-switcher {
  display: inline-flex;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xs);
  padding: 2px;
  gap: 2px;
}

.gr-view-toggle-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 2px 7px;
  border-radius: 3px;
  font-size: 10.5px;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all 0.15s ease;
}

.gr-view-toggle-btn:hover {
  color: var(--text-primary);
}

.gr-view-toggle-btn.active {
  background: var(--accent-primary);
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Buttons & Micro-interactions */
.gr-actions-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  background: rgba(0, 0, 0, 0.15);
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 10px;
}

.gr-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  border: 1px solid transparent;
  box-shadow: var(--btn-shadow);
  transition: all 0.15s ease;
}
.gr-btn:hover {
  transform: translateY(-1px);
}
.gr-btn:active {
  transform: translateY(0);
}

.btn-primary { background: var(--accent-primary); color: #fff; }
.btn-primary:hover { background: var(--accent-hover); }

.btn-success { background: var(--accent-success); color: #fff; }
.btn-success:hover { background: #059669; }

.btn-danger { background: var(--bg-card); color: var(--accent-danger); border-color: rgba(239,68,68,0.3); }
.btn-danger:hover { background: var(--accent-danger-bg); }

.btn-secondary { background: var(--bg-card); color: var(--text-primary); border-color: var(--border-color); }
.btn-secondary:hover { background: var(--bg-card-hover); border-color: var(--border-active); }

.btn-save {
  background: var(--accent-success);
  color: #fff;
  font-size: 13.5px;
  padding: 11px 24px;
  border-radius: var(--radius-sm);
  font-weight: 700;
}
.btn-save:hover {
  background: #059669;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.gr-select, .gr-input {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-family: var(--font-sans);
  outline: none;
  transition: border-color 0.15s ease;
}
.gr-select:focus, .gr-input:focus {
  border-color: var(--border-active);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* History Table */
.gr-history-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.gr-history-table th, .gr-history-table td {
  padding: 11px 14px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
}

.gr-history-table th {
  background: rgba(0,0,0,0.2);
  color: var(--text-secondary);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 11px;
}

.gr-history-table tr:hover {
  background: var(--bg-card-hover);
}

/* Empty State */
.gr-empty-state {
  text-align: center;
  padding: 50px 20px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-color);
  color: var(--text-secondary);
}

/* Settings View Elements */
.gr-settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 768px) {
  .gr-settings-grid {
    grid-template-columns: 1fr;
  }
}
.gr-provider-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 14px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.15s ease;
}
.gr-provider-card:hover {
  border-color: var(--border-active);
  background: var(--bg-card-hover);
  transform: translateY(-1px);
}
.gr-provider-card.active {
  border-color: var(--accent-primary);
  background: var(--bg-card-hover);
  box-shadow: 0 0 0 2px var(--border-active);
}
.gr-provider-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.gr-provider-title {
  font-weight: 700;
  font-size: 13.5px;
  color: var(--text-primary);
}
.gr-badge-free {
  background: var(--accent-success-bg);
  color: var(--accent-success);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
}
.gr-badge-paid {
  background: rgba(148, 163, 184, 0.15);
  color: #cbd5e1;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}
.gr-settings-form {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: var(--card-shadow);
}
.gr-form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.gr-form-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}
.gr-form-help {
  font-size: 11px;
  color: var(--text-secondary);
}
`;

// anp-23-grammar-reviewer/lib/ui/promptSelectorComponent.js
function renderSidebarPanel(session, config, metrics) {
  const currentProvider = session?.provider || config.provider || PROVIDERS.OPENROUTER;
  const currentModel = session?.model || config.customModel || DEFAULT_MODELS2[currentProvider] || "";
  const currentGranularity = session?.granularity || "full";
  const currentPreset = session?.promptPresetId || "grammar_spelling";
  const savedProviders = Object.values(PROVIDERS).filter((p) => {
    if (p === PROVIDERS.OLLAMA) return true;
    const key = config?.allKeys?.[p];
    return Boolean(key && key.trim().length > 0) || p === currentProvider;
  });
  const providerOptionsHtml = savedProviders.map((p) => {
    return `<option value="${escapeHtml(p)}" ${p === currentProvider ? "selected" : ""}>\u{1F916} ${escapeHtml(p)}</option>`;
  }).join("");
  const catalog = MODEL_CATALOG[currentProvider] || [];
  const isCustomModel = catalog.length > 0 && !catalog.some((m) => m.value === currentModel) && Boolean(currentModel);
  const modelOptionsHtml = catalog.map((m) => {
    return `<option value="${escapeHtml(m.value)}" ${m.value === currentModel ? "selected" : ""}>${escapeHtml(m.label)}</option>`;
  }).join("") + (isCustomModel ? `<option value="${escapeHtml(currentModel)}" selected>Custom: ${escapeHtml(currentModel)}</option>` : "");
  const presetButtons = PREBUILT_PROMPTS.map((preset) => {
    const isActive = preset.id === currentPreset && !session?.customPrompt;
    return `
      <button class="gr-preset-item ${isActive ? "active" : ""}" 
              title="${preset.description}" 
              onclick="sendAction('setPreset', '${preset.id}')">
        ${preset.name}
      </button>
    `;
  }).join("");
  return `
  <aside class="gr-sidebar">
    
    <!-- Section 1: AI Engine & Model Selector -->
    <div class="gr-sidebar-section">
      <div class="gr-sidebar-header">
        <span class="gr-section-title">AI ENGINE</span>
        <button class="gr-btn-link" onclick="switchTab('settings')">\u2699\uFE0F Settings</button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 6px;">
        <div>
          <span class="gr-form-sublabel">Saved Provider</span>
          <select id="quick-provider-select" class="gr-select" style="width: 100%;" onchange="sendAction('setProvider', this.value)">
            ${providerOptionsHtml}
          </select>
        </div>

        <div>
          <span class="gr-form-sublabel">Active Model</span>
          <select id="quick-model-select" class="gr-select" style="width: 100%;" onchange="sendAction('setModel', this.value)">
            ${modelOptionsHtml}
          </select>
        </div>
      </div>

      <div class="gr-sidebar-btn-row" style="display: flex; gap: 8px; margin-top: 4px;">
        <button class="gr-btn btn-primary" style="flex: 1; justify-content: center;" onclick="sendAction('runReview')">
          \u26A1 Review Item
        </button>
        <button class="gr-btn btn-secondary" style="padding: 8px 12px;" title="Review all pending chunks sequentially" onclick="sendAction('reviewAll')">
          \u26A1 All
        </button>
      </div>
    </div>

    <!-- Section 2: Granularity Mode -->
    <div class="gr-sidebar-section">
      <div class="gr-sidebar-header">
        <span class="gr-section-title">GRANULARITY</span>
      </div>
      <div class="gr-segmented-control">
        <button class="gr-segment-btn ${currentGranularity === "full" ? "active" : ""}" onclick="sendAction('setGranularity', 'full')">Full Note</button>
        <button class="gr-segment-btn ${currentGranularity === "paragraph" ? "active" : ""}" onclick="sendAction('setGranularity', 'paragraph')">Paragraph</button>
        <button class="gr-segment-btn ${currentGranularity === "sentence" ? "active" : ""}" onclick="sendAction('setGranularity', 'sentence')">Sentence</button>
      </div>
    </div>

    <!-- Section 3: Prompt Style Presets -->
    <div class="gr-sidebar-section">
      <div class="gr-sidebar-header">
        <span class="gr-section-title">PROMPT STYLE</span>
        <button class="gr-btn-link" onclick="promptCustomInstruction()">+ Custom</button>
      </div>
      <div class="gr-preset-list">
        ${presetButtons}
      </div>
      ${session?.customPrompt ? `
        <div class="gr-custom-prompt-box">
          <div style="font-weight: 700; color: var(--text-primary);">Custom Prompt:</div>
          <div style="font-style: italic; margin: 3px 0 5px 0; line-height: 1.35;">"${escapeHtml(session.customPrompt)}"</div>
          <button class="gr-btn-link" style="color: var(--accent-danger);" onclick="sendAction('clearCustomPrompt')">\u2715 Clear custom</button>
        </div>
      ` : ""}
    </div>

    <!-- Section 4: Review Progress -->
    <div class="gr-sidebar-section">
      <div class="gr-sidebar-header" style="margin-bottom: 6px;">
        <span class="gr-section-title">PROGRESS</span>
        <span style="font-size: 12px; font-weight: 700; color: var(--text-primary); font-family: var(--font-mono);">
          ${metrics.reviewed} / ${metrics.total} (${metrics.percentComplete}%)
        </span>
      </div>
      <div class="gr-progress-track">
        <div class="gr-progress-fill" style="width: ${metrics.percentComplete}%;"></div>
      </div>
      <div class="gr-metrics-row">
        <span style="color: var(--accent-success); font-weight: 600;">\u2713 ${metrics.accepted} Accepted</span>
        <span style="color: var(--accent-danger); font-weight: 600;">\u2717 ${metrics.rejected} Rejected</span>
      </div>
    </div>

    <!-- Section 5: Keyboard Shortcuts Footer -->
    <div class="gr-sidebar-section" style="background: rgba(0, 0, 0, 0.18); padding: 10px 14px;">
      <div style="font-size: 11px; color: var(--text-secondary); display: flex; flex-wrap: wrap; gap: 8px 12px; justify-content: center; align-items: center;">
        <span><kbd>A</kbd> Accept</span>
        <span><kbd>R</kbd> Reject</span>
        <span><kbd>N</kbd>/<kbd>P</kbd> Nav</span>
        <span><kbd>T</kbd> Theme</span>
      </div>
    </div>

  </aside>
  `;
}

// anp-23-grammar-reviewer/lib/ui/diffViewComponent.js
function renderDiffCard(item, index, total) {
  if (!item) {
    return `<div class="gr-empty-state">No item selected.</div>`;
  }
  const badgeClass = `badge-${item.status || "pending"}`;
  const statusLabel = (item.status || "pending").toUpperCase();
  const leftPaneHtml = item.diff?.originalHtml || escapeHtml(item.original);
  const suggestedCleanHtml = item.diff?.suggestedHtml || escapeHtml(item.suggestion || item.original);
  const inlineDiffHtml = item.diff?.inlineHtml || suggestedCleanHtml;
  const rawPlainHtml = escapeHtml(item.suggestion || item.original);
  const origWords = (item.original || "").trim().split(/\s+/).filter(Boolean).length;
  const suggWords = (item.suggestion || item.original || "").trim().split(/\s+/).filter(Boolean).length;
  return `
  <div class="gr-diff-card active" data-index="${index}">
    <div class="gr-diff-header">
      <div style="display: flex; align-items: center; gap: 8px;">
        <strong style="color: var(--text-primary); font-size: 13.5px;">Item #${index + 1} of ${total}</strong>
        <span style="color: var(--text-secondary); font-size: 12px; text-transform: capitalize;">(${item.type})</span>
        <span style="color: var(--text-muted); font-size: 11px; display: inline-flex; align-items: center; gap: 4px;" title="Bidirectional scroll synchronization active">
          \u{1F517} Sync Scroll
        </span>
      </div>
      <span class="gr-diff-badge ${badgeClass}">${statusLabel}</span>
    </div>

    <div class="gr-diff-body">
      <!-- Left Pane: Original Draft -->
      <div class="gr-pane">
        <div class="gr-pane-title">
          <span>\u{1F4C4} Original Draft</span>
          <span style="font-weight: 500; font-size: 10.5px; font-family: var(--font-mono); color: var(--text-muted);">${origWords} words</span>
        </div>
        <div class="gr-pane-content" id="original-pane-${index}">${leftPaneHtml}</div>
      </div>

      <!-- Right Pane: AI Suggestion with View Switcher -->
      <div class="gr-pane">
        <div class="gr-pane-title">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>\u2728 AI Suggestion</span>
            <div class="gr-diff-view-switcher">
              <button class="gr-view-toggle-btn active" id="btn-view-clean-${index}" onclick="setDiffViewMode(${index}, 'clean')">Clean Prose</button>
              <button class="gr-view-toggle-btn" id="btn-view-inline-${index}" onclick="setDiffViewMode(${index}, 'inline')">Inline Diff</button>
            </div>
          </div>
          <span style="font-weight: 500; font-size: 10.5px; font-family: var(--font-mono); color: var(--text-muted);">${suggWords} words</span>
        </div>
        
        <!-- Pre-encoded diff content payloads for 0ms client-side mode switching -->
        <div class="gr-pane-content" id="suggestion-pane-${index}" 
             data-clean="${escapeDataAttr(suggestedCleanHtml)}"
             data-inline="${escapeDataAttr(inlineDiffHtml)}"
             data-plain="${escapeDataAttr(rawPlainHtml)}">${suggestedCleanHtml}</div>
      </div>
    </div>

    <div class="gr-actions-footer">
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <button class="gr-btn btn-success" onclick="sendAction('acceptItem', ${index})">
          \u2713 Accept <kbd style="margin-left: 4px; background: rgba(0,0,0,0.2); border: none; color: #fff;">A</kbd>
        </button>
        <button class="gr-btn btn-danger" onclick="sendAction('rejectItem', ${index})">
          \u2717 Reject <kbd style="margin-left: 4px; background: rgba(0,0,0,0.2); border: none; color: inherit;">R</kbd>
        </button>
        <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">
          \u270F\uFE0F Edit
        </button>
        <button class="gr-btn btn-secondary" onclick="sendAction('reReviewItem', ${index})">
          \u{1F504} Re-Review
        </button>
      </div>

      <div style="display: flex; gap: 8px; align-items: center;">
        <button class="gr-btn btn-secondary" onclick="sendAction('prevItem')" ${index === 0 ? "disabled style='opacity: 0.5; cursor: not-allowed;'" : ""}>
          \u2190 Previous
        </button>
        <button class="gr-btn btn-secondary" onclick="sendAction('nextItem')" ${index >= total - 1 ? "disabled style='opacity: 0.5; cursor: not-allowed;'" : ""}>
          Next \u2192
        </button>
      </div>
    </div>
  </div>
  `;
}
function escapeDataAttr(htmlStr) {
  if (!htmlStr) return "";
  return encodeURIComponent(htmlStr);
}

// anp-23-grammar-reviewer/lib/ui/dashboardTemplate.js
function buildDashboardTemplate({ session, config, historyRecords = [], activeTab = "review", activeTheme = "midnight" }) {
  const metrics = session ? session.getMetrics() : { total: 0, reviewed: 0, accepted: 0, rejected: 0, percentComplete: 0 };
  const currentItem = session?.items?.[session.currentIndex] || null;
  const serializedSession = session ? JSON.stringify(session.toJSON()) : "null";
  return `
<!DOCTYPE html>
<html lang="en" data-theme="${escapeHtml(activeTheme)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Amplenote Grammar Reviewer</title>
  <style>
    ${EMBED_STYLES}
  </style>
</head>
<body>
  <div class="gr-container">
    
    <!-- Top Navigation Header -->
    <header class="gr-header">
      <div class="gr-title-group">
        <div class="gr-logo">\u{1F9D1}\u200D\u{1F3EB}</div>
        <div>
          <h1 class="gr-title">Grammar & Style Reviewer</h1>
          <div class="gr-subtitle" style="display: flex; align-items: center; gap: 8px; margin-top: 2px;">
            <span>Note: <strong>${escapeHtml(session?.noteTitle || "No Note Selected")}</strong></span>
            <button class="gr-btn btn-secondary" style="padding: 2px 8px; font-size: 11px;" onclick="sendAction('selectNote')">
              \u{1F4C2} ${session ? "Change Note" : "Select Note"}
            </button>
            ${session ? `
              <button class="gr-btn btn-danger" style="padding: 2px 8px; font-size: 11px;" title="Clear in-progress review and start fresh" onclick="confirmResetSession()">
                \u2715 Reset
              </button>
            ` : ""}
          </div>
        </div>
      </div>

      <div class="gr-header-actions">
        <!-- 1-Click Smooth Theme Cycler -->
        <button class="gr-theme-btn" id="theme-cycler-btn" onclick="cycleTheme()" title="Click to cycle themes (or press T)">
          <span id="theme-icon">\u{1F3A8}</span>
          <span id="theme-name">Theme</span>
        </button>

        <!-- Instant Client-Side Nav Tabs -->
        <div class="gr-nav-tabs">
          <button id="tab-btn-review" class="gr-tab-btn ${activeTab === "review" ? "active" : ""}" onclick="switchTab('review')">Reviewer</button>
          <button id="tab-btn-history" class="gr-tab-btn ${activeTab === "history" ? "active" : ""}" onclick="switchTab('history')">History Logs (${historyRecords.length})</button>
          <button id="tab-btn-settings" class="gr-tab-btn ${activeTab === "settings" ? "active" : ""}" onclick="switchTab('settings')">\u2699\uFE0F Settings</button>
        </div>
      </div>
    </header>

    <!-- Tab 1: Reviewer Workspace -->
    <div id="tab-view-review" class="gr-tab-view ${activeTab === "review" ? "active" : ""}">
      ${renderReviewWorkspace(session, config, metrics, currentItem)}
    </div>

    <!-- Tab 2: History Logs Workspace -->
    <div id="tab-view-history" class="gr-tab-view ${activeTab === "history" ? "active" : ""}">
      ${renderHistoryWorkspace(historyRecords)}
    </div>

    <!-- Tab 3: Settings Workspace -->
    <div id="tab-view-settings" class="gr-tab-view ${activeTab === "settings" ? "active" : ""}">
      ${renderSettingsWorkspace(config)}
    </div>

  </div>

  <script>
    const THEMES = ${JSON.stringify(THEMES)};
    const MODEL_CATALOG = ${JSON.stringify(MODEL_CATALOG)};
    const PROVIDER_DOCS = ${JSON.stringify(PROVIDER_DOCS)};
    const STORAGE_KEY = "ANP_GRAMMAR_REVIEWER_SESSION_STATE";
    const THEME_STORAGE_KEY = "ANP_GRAMMAR_REVIEWER_ACTIVE_THEME";
    const TAB_STORAGE_KEY = "ANP_GRAMMAR_REVIEWER_ACTIVE_TAB";
    const serverSession = ${serializedSession};

    // Instant Theme Initialization
    let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || "${escapeHtml(activeTheme)}";
    applyTheme(currentTheme);

    function applyTheme(themeId) {
      const matched = THEMES.find(t => t.id === themeId) || THEMES[0];
      currentTheme = matched.id;
      document.documentElement.setAttribute("data-theme", currentTheme);
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);

      const iconElem = document.getElementById("theme-icon");
      const nameElem = document.getElementById("theme-name");
      if (iconElem && nameElem) {
        iconElem.innerText = matched.icon;
        nameElem.innerText = matched.name;
      }
    }

    function cycleTheme() {
      const currentIndex = THEMES.findIndex(t => t.id === currentTheme);
      const nextIndex = (currentIndex + 1) % THEMES.length;
      applyTheme(THEMES[nextIndex].id);
    }

    // Instant 0ms Tab Switching
    function switchTab(tabId) {
      document.querySelectorAll(".gr-tab-view").forEach(el => el.classList.remove("active"));
      document.querySelectorAll(".gr-tab-btn").forEach(el => el.classList.remove("active"));

      const targetView = document.getElementById("tab-view-" + tabId);
      const targetBtn = document.getElementById("tab-btn-" + tabId);
      if (targetView) targetView.classList.add("active");
      if (targetBtn) targetBtn.classList.add("active");

      try {
        localStorage.setItem(TAB_STORAGE_KEY, tabId);
      } catch (e) {}
    }

    // Restore active tab if saved
    try {
      const savedTab = localStorage.getItem(TAB_STORAGE_KEY);
      if (savedTab && ["review", "history", "settings"].includes(savedTab)) {
        switchTab(savedTab);
      }
    } catch (e) {}

    // Audit Report Notes Setting (Off by default)
    const AUDIT_STORAGE_KEY = "ANP_GRAMMAR_CREATE_AUDIT_NOTES";

    function isAuditNotesEnabled() {
      try {
        return localStorage.getItem(AUDIT_STORAGE_KEY) === "true";
      } catch (e) {
        return false;
      }
    }

    function toggleAuditNotesSetting(checked) {
      try {
        localStorage.setItem(AUDIT_STORAGE_KEY, checked ? "true" : "false");
      } catch (e) {}
      syncAuditCheckboxes(checked);
    }

    function syncAuditCheckboxes(val) {
      const enabled = val !== undefined ? val : isAuditNotesEnabled();
      const historyToggle = document.getElementById("history-audit-toggle");
      const settingsToggle = document.getElementById("settings-audit-toggle");
      if (historyToggle) historyToggle.checked = enabled;
      if (settingsToggle) settingsToggle.checked = enabled;
    }

    function handleSaveButtonClick() {
      sendAction("saveAndCommit", isAuditNotesEnabled());
    }

    // Initialize audit checkbox state
    syncAuditCheckboxes();

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;

      if (e.key === "t" || e.key === "T") {
        cycleTheme();
      } else if (e.key === "a" || e.key === "A") {
        const activeCard = document.querySelector(".gr-diff-card.active");
        if (activeCard) {
          const idx = parseInt(activeCard.getAttribute("data-index"), 10);
          if (!isNaN(idx)) sendAction("acceptItem", idx);
        }
      } else if (e.key === "r" || e.key === "R") {
        const activeCard = document.querySelector(".gr-diff-card.active");
        if (activeCard) {
          const idx = parseInt(activeCard.getAttribute("data-index"), 10);
          if (!isNaN(idx)) sendAction("rejectItem", idx);
        }
      } else if (e.key === "n" || e.key === "N" || e.key === "ArrowRight") {
        sendAction("nextItem");
      } else if (e.key === "p" || e.key === "P" || e.key === "ArrowLeft") {
        sendAction("prevItem");
      }
    });

    // Session Persistence
    if (serverSession) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverSession));
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }
    } else {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.noteUUID && parsed.items && parsed.items.length > 0) {
            sendAction("restoreSession", parsed);
          }
        }
      } catch (e) {
        console.warn("Could not load from localStorage:", e);
      }
    }

    async function sendAction(action, ...args) {
      if (typeof window.callAmplenotePlugin === "function") {
        try {
          return await window.callAmplenotePlugin(action, ...args);
        } catch (err) {
          console.error("[GrammarReviewer] callAmplenotePlugin failed:", err);
        }
      }
    }

    function confirmResetSession() {
      if (confirm("Reset current review session and clear in-progress changes?")) {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
        sendAction("clearSession");
      }
    }

    function promptManualEdit(index) {
      const currentText = document.getElementById("suggestion-pane-" + index)?.innerText || "";
      const edited = prompt("Edit suggestion manually:", currentText);
      if (edited !== null) {
        sendAction("manualEditItem", index, edited);
      }
    }

    function setDiffViewMode(index, mode) {
      const pane = document.getElementById("suggestion-pane-" + index);
      if (!pane) return;

      const cleanHtml = decodeURIComponent(pane.getAttribute("data-clean") || "");
      const inlineHtml = decodeURIComponent(pane.getAttribute("data-inline") || "");

      if (mode === "inline") {
        pane.innerHTML = inlineHtml;
      } else {
        pane.innerHTML = cleanHtml;
      }

      const btnClean = document.getElementById("btn-view-clean-" + index);
      const btnInline = document.getElementById("btn-view-inline-" + index);

      if (btnClean) btnClean.classList.toggle("active", mode === "clean");
      if (btnInline) btnInline.classList.toggle("active", mode === "inline");
    }

    // Synchronized Scrolling for Dual-Pane Diff View (Full Note & Paragraphs)
    function initScrollSync() {
      const activeCard = document.querySelector(".gr-diff-card.active");
      if (!activeCard) return;

      const idx = activeCard.getAttribute("data-index");
      const leftPane = document.getElementById("original-pane-" + idx);
      const rightPane = document.getElementById("suggestion-pane-" + idx);

      if (!leftPane || !rightPane) return;

      let isSyncingLeft = false;
      let isSyncingRight = false;

      leftPane.onscroll = () => {
        if (isSyncingLeft) {
          isSyncingLeft = false;
          return;
        }
        isSyncingRight = true;
        const maxLeft = leftPane.scrollHeight - leftPane.clientHeight;
        const maxRight = rightPane.scrollHeight - rightPane.clientHeight;
        if (maxLeft > 0 && maxRight > 0) {
          rightPane.scrollTop = (leftPane.scrollTop / maxLeft) * maxRight;
        } else {
          rightPane.scrollTop = leftPane.scrollTop;
        }
      };

      rightPane.onscroll = () => {
        if (isSyncingRight) {
          isSyncingRight = false;
          return;
        }
        isSyncingLeft = true;
        const maxLeft = leftPane.scrollHeight - leftPane.clientHeight;
        const maxRight = rightPane.scrollHeight - rightPane.clientHeight;
        if (maxLeft > 0 && maxRight > 0) {
          leftPane.scrollTop = (rightPane.scrollTop / maxRight) * maxLeft;
        } else {
          leftPane.scrollTop = rightPane.scrollTop;
        }
      };
    }

    // Initialize Scroll Sync on DOM Load
    initScrollSync();

    function promptCustomInstruction() {
      const custom = prompt("Enter your custom AI editing prompt/instruction:");
      if (custom && custom.trim().length > 0) {
        sendAction("setCustomPrompt", custom.trim());
      }
    }

    const ALL_SAVED_KEYS = ${JSON.stringify(config.allKeys || {})};
    const ALL_SAVED_MODELS = ${JSON.stringify(config.allModels || {})};

    function formatMaskedKey(key) {
      if (!key || key.trim().length === 0) return "";
      const trimmed = key.trim();
      if (trimmed.length <= 4) return "\u2022\u2022\u2022\u2022" + trimmed;
      const last4 = trimmed.slice(-4);
      return "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" + last4;
    }

    function toggleApiKeyVisibility() {
      const input = document.getElementById("settings-api-key");
      const btn = document.getElementById("toggle-key-btn");
      if (input && btn) {
        if (input.type === "password") {
          input.type = "text";
          btn.innerText = "\u{1F648} Hide";
        } else {
          input.type = "password";
          btn.innerText = "\u{1F441}\uFE0F Show";
        }
      }
    }

    function clearActiveApiKey() {
      const providerInput = document.getElementById("settings-provider");
      const keyInput = document.getElementById("settings-api-key");
      const previewBanner = document.getElementById("key-preview-banner");
      const currentProvider = providerInput?.value;

      if (confirm("Delete / clear saved API key for " + currentProvider + "?")) {
        if (keyInput) {
          keyInput.value = "";
          keyInput.placeholder = "Enter new " + currentProvider + " API Key";
        }
        if (currentProvider && ALL_SAVED_KEYS[currentProvider]) {
          ALL_SAVED_KEYS[currentProvider] = "";
        }
        if (previewBanner) {
          previewBanner.innerHTML = '<span style="color: var(--accent-warning);">\u26A0\uFE0F No key saved \u2014 enter key below</span>';
        }
      }
    }

    // Instant Settings Provider Selection
    function selectProviderCard(providerKey) {
      const providerInput = document.getElementById("settings-provider");
      if (providerInput) providerInput.value = providerKey;

      const titleElem = document.getElementById("settings-provider-title");
      if (titleElem) titleElem.innerText = providerKey;

      // Update card active highlights
      document.querySelectorAll(".gr-provider-card").forEach(card => {
        card.classList.toggle("active", card.getAttribute("data-key") === providerKey);
      });

      const isOllama = providerKey.includes("Ollama");
      const apiKeyGroup = document.getElementById("settings-api-key-group");
      const baseUrlGroup = document.getElementById("settings-base-url-group");

      if (apiKeyGroup) apiKeyGroup.style.display = isOllama ? "none" : "flex";
      if (baseUrlGroup) baseUrlGroup.style.display = isOllama ? "flex" : "none";

      // Update API Key Doc Link and Label
      const keyLabel = document.getElementById("settings-api-key-label");
      const keyLink = document.getElementById("settings-doc-link");
      if (keyLabel) keyLabel.innerText = providerKey + " API Key";
      if (keyLink && PROVIDER_DOCS[providerKey]) keyLink.href = PROVIDER_DOCS[providerKey];

      // Update Key Input and Saved Preview Banner
      const keyInput = document.getElementById("settings-api-key");
      const previewBanner = document.getElementById("key-preview-banner");
      const savedKey = ALL_SAVED_KEYS[providerKey] || "";

      if (keyInput) {
        keyInput.value = savedKey;
        keyInput.type = "password";
      }
      const toggleBtn = document.getElementById("toggle-key-btn");
      if (toggleBtn) toggleBtn.innerText = "\u{1F441}\uFE0F Show";

      if (previewBanner) {
        if (savedKey && savedKey.trim().length > 0) {
          previewBanner.innerHTML = '<span style="color: var(--accent-success); font-weight: 600;">\u{1F512} Saved Key:</span> <code style="background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">' + formatMaskedKey(savedKey) + '</code>';
        } else {
          previewBanner.innerHTML = '<span style="color: var(--accent-warning);">\u26A0\uFE0F No key saved \u2014 enter key below</span>';
        }
      }

      // Update Model Dropdown options instantly based on THAT provider's saved model
      const modelSelect = document.getElementById("settings-model-select");
      const customGroup = document.getElementById("custom-model-input-group");
      const customInput = document.getElementById("settings-model");
      const activeCustom = ALL_SAVED_MODELS[providerKey] || "";

      if (customInput) {
        customInput.value = activeCustom;
      }

      if (modelSelect && MODEL_CATALOG[providerKey]) {
        const models = MODEL_CATALOG[providerKey];
        const isMatched = models.some(m => m.value === activeCustom);
        const isCustomOption = Boolean(activeCustom && !isMatched);

        modelSelect.innerHTML = '<option value="" ' + (!activeCustom ? 'selected' : '') + '>Default Recommended Model</option>' + 
          models.map(m => '<option value="' + m.value + '" ' + (m.value === activeCustom ? 'selected' : '') + '>' + m.label + ' (' + m.value + ')</option>').join("") +
          '<option value="__custom__" ' + (isCustomOption ? 'selected' : '') + '>\u2699\uFE0F Custom Model Override...</option>';

        if (customGroup) {
          customGroup.style.display = isCustomOption ? "flex" : "none";
        }
      }
    }

    function onModelSelectChange() {
      const selectElem = document.getElementById("settings-model-select");
      const customGroup = document.getElementById("custom-model-input-group");
      const customInput = document.getElementById("settings-model");

      if (selectElem?.value === "__custom__") {
        if (customGroup) customGroup.style.display = "flex";
        if (customInput) {
          customInput.focus();
        }
      } else {
        if (customGroup) customGroup.style.display = "none";
      }
    }

    function saveSettingsForm() {
      const provider = document.getElementById("settings-provider")?.value;
      const apiKey = document.getElementById("settings-api-key")?.value;
      const modelSelect = document.getElementById("settings-model-select")?.value;
      const customInput = document.getElementById("settings-model")?.value;

      let customModel = "";
      if (modelSelect === "__custom__") {
        customModel = (customInput || "").trim();
      } else if (modelSelect) {
        customModel = modelSelect.trim();
      }

      if (provider) {
        ALL_SAVED_MODELS[provider] = customModel;
      }

      const customBaseUrl = document.getElementById("settings-base-url")?.value;

      sendAction("saveSettings", {
        provider,
        apiKey,
        customModel,
        customBaseUrl
      });
    }
  </script>
</body>
</html>
  `;
}
function renderReviewWorkspace(session, config, metrics, currentItem) {
  if (!session) {
    return `
      <div class="gr-empty-state">
        <div style="font-size: 48px; margin-bottom: 12px;">\u{1F4C2}</div>
        <h2 style="color: var(--text-primary); font-size: 18px;">No Active Note Selected</h2>
        <p style="margin-top: 6px; font-size: 13px; color: var(--text-secondary);">Select a note to inspect and review its grammar, style, and structure.</p>
        <button class="gr-btn btn-primary" style="margin-top: 18px; padding: 10px 24px; font-size: 13px;" onclick="sendAction('selectNote')">
          \u{1F4C2} Select Note to Review
        </button>
      </div>
    `;
  }
  return `
    <div class="gr-workbench">
      ${renderSidebarPanel(session, config, metrics)}

      <main class="gr-main-canvas">
        ${renderDiffCard(currentItem, session.currentIndex, session.items.length)}

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; flex-wrap: wrap; gap: 10px;">
          <div style="font-size: 12px; color: var(--text-secondary);">
            \u{1F4A1} <strong>Shortcuts:</strong> <code>A</code> Accept \xB7 <code>R</code> Reject \xB7 <code>N/P</code> Next/Prev \xB7 <code>T</code> Theme
          </div>
          <button class="gr-btn btn-save" style="padding: 10px 24px; font-size: 13px;" onclick="handleSaveButtonClick()">
            \u{1F4BE} Save & Commit Rewrites to Note
          </button>
        </div>
      </main>
    </div>
  `;
}
function renderHistoryWorkspace(historyRecords) {
  const legendHtml = `
    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px 18px; margin-bottom: 14px; display: flex; gap: 12px; align-items: flex-start;">
      <div style="font-size: 24px; line-height: 1;">\u{1F4A1}</div>
      <div style="flex: 1;">
        <div style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 3px;">Amplenote Native Version History & Note Archiving</div>
        <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 8px;">
          Amplenote automatically records save points for every note every 10 minutes. You can view or restore previous versions anytime by opening any note, clicking the <strong><code>...</code> (Note Options)</strong> menu in the top right corner, and selecting <strong><code>View revision history</code></strong>.
        </p>
        <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-primary); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); flex-wrap: wrap; gap: 8px;">
          <label style="font-size: 12px; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="history-audit-toggle" onchange="toggleAuditNotesSetting(this.checked)">
            <span>Generate extra audit report notes (<code>-reports/-grammar/*</code>) on save</span>
          </label>
          <span style="font-size: 11px; color: var(--accent-success); font-weight: 700;">(Turned OFF by default)</span>
        </div>
      </div>
    </div>
  `;
  if (!historyRecords || historyRecords.length === 0) {
    return `
      ${legendHtml}
      <div class="gr-empty-state">
        <div style="font-size: 48px; margin-bottom: 12px;">\u{1F4DC}</div>
        <h2 style="color: var(--text-primary); font-size: 16px; font-weight: 700;">No Past Review History Found</h2>
        <p style="margin-top: 6px; font-size: 13px; color: var(--text-secondary); max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.5;">
          When audit logging is enabled, iteration snapshots and logs are archived with tag <code>-reports/-grammar/-history</code>.
        </p>
        <div style="margin-top: 18px; display: flex; gap: 10px; justify-content: center;">
          <button class="gr-btn btn-secondary" onclick="sendAction('refreshHistory')">
            \u{1F504} Refresh History
          </button>
          <button class="gr-btn btn-primary" onclick="switchTab('review')">
            \u26A1 Back to Reviewer
          </button>
        </div>
      </div>
    `;
  }
  const rows = historyRecords.map((rec) => {
    const cleanDate = (rec.isoDate || "").replace(/[*_#]/g, "").trim();
    const dateStr = cleanDate ? cleanDate.replace("T", " ").substring(0, 16) : String(rec.timestamp);
    const cleanTitle = (rec.sourceNote?.title || "Untitled Note").replace(/[*_#]/g, "").trim();
    const changesCount = rec.session?.metrics?.accepted || 0;
    return `
      <tr>
        <td><strong>${dateStr}</strong></td>
        <td>${escapeHtml(cleanTitle)}</td>
        <td><span class="gr-diff-badge badge-accepted">${rec.session?.provider || "AI"} (${rec.session?.granularity || "mode"})</span></td>
        <td>${changesCount} changes applied</td>
        <td>
          <button class="gr-btn btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="sendAction('openNote', '${rec.sourceNote?.uuid || ""}')">Open Note</button>
        </td>
      </tr>
    `;
  }).join("");
  return `
    ${legendHtml}
    <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 16px; border: 1px solid var(--border-color); box-shadow: var(--card-shadow); overflow-x: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h2 style="font-size: 15px; color: var(--text-primary); margin: 0;">Past Grammar Review Iterations</h2>
        <button class="gr-btn btn-secondary" style="padding: 4px 10px; font-size: 11.5px;" onclick="sendAction('refreshHistory')">
          \u{1F504} Refresh History
        </button>
      </div>
      <table class="gr-history-table">
        <thead>
          <tr>
            <th>Date / Timestamp</th>
            <th>Source Note</th>
            <th>Provider / Mode</th>
            <th>Modifications</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}
function renderSettingsWorkspace(config) {
  const activeProvider = config.provider || PROVIDERS.OPENROUTER;
  const currentKey = config.apiKey || config.allKeys?.[activeProvider] || "";
  const docUrl = PROVIDER_DOCS[activeProvider] || "https://openrouter.ai/keys";
  const catalog = MODEL_CATALOG[activeProvider] || [];
  const providersInfo = [
    { key: PROVIDERS.OPENROUTER, title: "OpenRouter", badge: "GPT-OSS 120B (Free)", isFree: true, desc: "Auto Router (openrouter/auto), free pool (GPT-OSS 120B, DeepSeek V4 Flash, Qwen3.6)." },
    { key: PROVIDERS.GEMINI, title: "Google Gemini", badge: "Gemini 3.5 Flash-Lite", isFree: true, desc: "Fast Gemini 3.5 Flash-Lite, Gemini 3.7 Flash, and Gemini 3.1 Pro." },
    { key: PROVIDERS.GROQ, title: "Groq", badge: "300+ tok/s Ultra-Fast", isFree: true, desc: "Near-instantaneous inference on GPT-OSS 120B, Qwen3.6 27B & GPT-OSS 20B." },
    { key: PROVIDERS.MISTRAL, title: "Mistral AI", badge: "Mistral Small 4 & Large 3", isFree: true, desc: "European frontier models (Mistral Small 4, Large 3, Codestral)." },
    { key: PROVIDERS.OLLAMA, title: "Ollama (Cloud & Local)", badge: "DeepSeek V4 Flash Cloud", isFree: true, desc: "DeepSeek V4 Flash/Pro Cloud, Kimi K3, MiniMax M3, or local offline." },
    { key: PROVIDERS.DEEPSEEK, title: "DeepSeek Direct", badge: "DeepSeek V4 Flash", isFree: false, desc: "Frontier DeepSeek V4 Flash with built-in thinking & V4 Pro." },
    { key: PROVIDERS.OPENAI, title: "OpenAI", badge: "GPT-5.6 Luna & Terra", isFree: false, desc: "Current generation GPT-5.6 Luna, Terra, Sol & GPT-5.4." },
    { key: PROVIDERS.ANTHROPIC, title: "Anthropic Claude", badge: "Claude Haiku 4.5 & Sonnet 5", isFree: false, desc: "Crisp copyediting via Claude Haiku 4.5, Sonnet 5 & Opus 4.8." }
  ];
  const cardsHtml = providersInfo.map((p) => {
    const isSelected = p.key === activeProvider;
    const badgeClass = p.isFree ? "gr-badge-free" : "gr-badge-paid";
    return `
      <div class="gr-provider-card ${isSelected ? "active" : ""}" data-key="${escapeHtml(p.key)}" onclick="selectProviderCard('${escapeHtml(p.key)}')">
        <div class="gr-provider-card-header">
          <span class="gr-provider-title">${escapeHtml(p.title)}</span>
          <span class="${badgeClass}">${escapeHtml(p.badge)}</span>
        </div>
        <p style="font-size: 11.5px; color: var(--text-secondary); line-height: 1.35;">${escapeHtml(p.desc)}</p>
      </div>
    `;
  }).join("");
  const activeSavedModel = config.allModels?.[activeProvider] || "";
  const isCustomModelActive = catalog.length > 0 && !catalog.some((m) => m.value === activeSavedModel) && Boolean(activeSavedModel);
  const modelOptionsHtml = catalog.map((m) => {
    const isSelected = m.value === activeSavedModel;
    return `<option value="${escapeHtml(m.value)}" ${isSelected ? "selected" : ""}>${escapeHtml(m.label)}</option>`;
  }).join("") + `<option value="__custom__" ${isCustomModelActive ? "selected" : ""}>\u2699\uFE0F Custom Model Override...</option>`;
  return `
    <div style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
      
      <!-- Providers Grid -->
      <div>
        <h2 style="font-size: 15px; margin-bottom: 10px; color: var(--text-primary);">Select AI Provider</h2>
        <div class="gr-settings-grid">
          ${cardsHtml}
        </div>
      </div>

      <!-- Config Form -->
      <div class="gr-settings-form">
        <input type="hidden" id="settings-provider" value="${escapeHtml(activeProvider)}">

        <div class="gr-form-group" id="settings-api-key-group" style="display: ${activeProvider.includes("Ollama") ? "none" : "flex"};">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label class="gr-form-label" id="settings-api-key-label" for="settings-api-key">${escapeHtml(activeProvider)} API Key</label>
            <a id="settings-doc-link" href="${docUrl}" target="_blank" style="font-size: 12px; color: var(--accent-primary); text-decoration: none; font-weight: 600;">Get API Key \u2197</a>
          </div>

          <div id="key-preview-banner" style="font-size: 12px; padding: 6px 10px; background: var(--bg-card); border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
            ${currentKey && currentKey.trim().length > 0 ? `
              <div><span style="color: var(--accent-success); font-weight: 600;">\u{1F512} Saved Key:</span> <code style="background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022${escapeHtml(currentKey.slice(-4))}</code></div>
            ` : `
              <span style="color: var(--accent-warning);">\u26A0\uFE0F No key saved \u2014 enter key below</span>
            `}
          </div>

          <div style="display: flex; gap: 8px; align-items: center;">
            <input type="password" id="settings-api-key" class="gr-input" style="flex: 1; padding: 8px 12px;" placeholder="Paste new or updated API Key" value="${escapeHtml(currentKey)}">
            <button type="button" id="toggle-key-btn" class="gr-btn btn-secondary" style="padding: 8px 12px; font-size: 12px; white-space: nowrap;" onclick="toggleApiKeyVisibility()">
              \u{1F441}\uFE0F Show
            </button>
            <button type="button" class="gr-btn btn-danger" style="padding: 8px 12px; font-size: 12px; white-space: nowrap;" title="Clear and delete saved key" onclick="clearActiveApiKey()">
              \u{1F5D1}\uFE0F Clear
            </button>
          </div>
          <span class="gr-form-help">Keys are securely stored in your Amplenote plugin settings.</span>
        </div>

        <div id="settings-base-url-group" class="gr-form-group" style="display: ${activeProvider.includes("Ollama") ? "flex" : "none"};">
          <label class="gr-form-label" for="settings-base-url">Local Ollama Base URL</label>
          <input type="text" id="settings-base-url" class="gr-input" style="width: 100%; padding: 8px 12px;" placeholder="http://localhost:11434/v1" value="${escapeHtml(config.customBaseUrl || "http://localhost:11434/v1")}">
          <span class="gr-form-help">Ensure Ollama is running with <code>OLLAMA_ORIGINS="*"</code> to allow web browser connection.</span>
        </div>

        <div class="gr-form-group">
          <label class="gr-form-label" for="settings-model-select">Active Model for Provider</label>
          <select id="settings-model-select" class="gr-select" style="width: 100%; padding: 8px 12px;" onchange="onModelSelectChange()">
            <option value="" ${!activeSavedModel ? "selected" : ""}>Default Recommended Model</option>
            ${modelOptionsHtml}
          </select>
        </div>

        <div id="custom-model-input-group" class="gr-form-group" style="display: ${isCustomModelActive ? "flex" : "none"};">
          <label class="gr-form-label" for="settings-model">Enter Custom Model ID</label>
          <input type="text" id="settings-model" class="gr-input" style="width: 100%; padding: 8px 12px;" placeholder="e.g. llama3.2:1b, mistral-nemo, gpt-4-turbo" value="${escapeHtml(activeSavedModel)}">
          <span class="gr-form-help">Type the exact model tag or endpoint ID you wish to use.</span>
        </div>

        <!-- Audit Reports Setting (Off by default) -->
        <div class="gr-form-group" style="margin-top: 6px; padding-top: 12px; border-top: 1px solid var(--border-color);">
          <label class="gr-form-label" style="display: flex; align-items: center; justify-content: space-between;">
            <span>Audit & Change Reports Creation</span>
            <span style="font-size: 10.5px; color: var(--accent-success); font-weight: 700;">OFF BY DEFAULT</span>
          </label>
          <div style="background: var(--bg-card); padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <label style="font-size: 12px; color: var(--text-primary); font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="settings-audit-toggle" onchange="toggleAuditNotesSetting(this.checked)">
              <span>Generate extra change reports and history notes (<code>-reports/-grammar/*</code>) on save</span>
            </label>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px; line-height: 1.45;">
              Amplenote natively preserves version history automatically via <strong>Note Options > View revision history</strong>. Keep this unchecked to prevent extra notes from cluttering your notes list.
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px;">
          <button class="gr-btn btn-save" onclick="saveSettingsForm()">
            \u{1F4BE} Save Settings
          </button>
        </div>
      </div>

    </div>
  `;
}

// anp-23-grammar-reviewer/grammar-reviewer.js
var activeTabState = "review";
var plugin = {
  // App-level action: launches Grammar Reviewer across notes
  appOption: {
    "Open Dashboard": async function(app) {
      await launchReviewer(app);
    }
  },
  // Note-level action: reviews the active note directly
  noteOption: {
    "Open Dashboard": async function(app, noteUUID) {
      await launchReviewer(app, noteUUID);
    }
  },
  /**
   * Dispatches events from the embed iframe UI.
   * @param {object} app
   * @param  {...any} args
   */
  async onEmbedCall(app, ...args) {
    const action = args[0];
    const session = getActiveSession();
    try {
      let requiresReRender = true;
      switch (action) {
        case "selectNote":
          await launchReviewer(app, null, true);
          requiresReRender = false;
          break;
        case "restoreSession": {
          if (args[1]) {
            const restored = ReviewSession.fromJSON(args[1]);
            if (restored) {
              setActiveSession(restored);
            }
          }
          requiresReRender = false;
          break;
        }
        case "clearSession":
          clearActiveSession();
          break;
        case "refreshHistory":
          activeTabState = "history";
          requiresReRender = true;
          break;
        case "setTab":
          activeTabState = args[1] || "review";
          requiresReRender = false;
          break;
        case "setTheme":
          requiresReRender = false;
          break;
        case "switchSettingsProvider":
          requiresReRender = false;
          break;
        case "saveSettings": {
          const settingsPayload = args[1] || {};
          const targetProvider = settingsPayload.provider;
          const apiKey = settingsPayload.apiKey;
          const customModel = settingsPayload.customModel;
          if (typeof app.setSetting === "function") {
            if (targetProvider) {
              await app.setSetting("AI Provider", targetProvider);
              if (apiKey !== void 0) {
                await app.setSetting(`${targetProvider} API Key`, apiKey.trim());
              }
            }
            if (targetProvider && customModel !== void 0) {
              let modelMap = {};
              try {
                const rawModelSetting = app.settings?.["Custom AI Model"];
                if (rawModelSetting && rawModelSetting.trim().startsWith("{")) {
                  modelMap = JSON.parse(rawModelSetting);
                }
              } catch (e) {
              }
              modelMap[targetProvider] = customModel.trim();
              await app.setSetting("Custom AI Model", JSON.stringify(modelMap));
            }
            if (settingsPayload.customBaseUrl !== void 0) {
              await app.setSetting("Custom Base URL", settingsPayload.customBaseUrl.trim());
              if (targetProvider === "Ollama (Local)") {
                await app.setSetting("Ollama Base URL", settingsPayload.customBaseUrl.trim());
              }
            }
          }
          if (session && targetProvider) {
            session.provider = targetProvider;
            session.model = customModel && customModel.trim().length > 0 ? customModel.trim() : DEFAULT_MODELS[targetProvider] || "";
          }
          await app.alert("Settings saved successfully!");
          activeTabState = "review";
          break;
        }
        case "setGranularity":
          handleSetGranularity(app, args[1]);
          break;
        case "setProvider": {
          const newProvider = args[1];
          if (newProvider) {
            let savedModelForNewProvider = DEFAULT_MODELS[newProvider] || "";
            try {
              const rawModelSetting = app.settings?.["Custom AI Model"];
              if (rawModelSetting && rawModelSetting.trim().startsWith("{")) {
                const parsed = JSON.parse(rawModelSetting);
                if (parsed[newProvider]) {
                  savedModelForNewProvider = parsed[newProvider];
                }
              }
            } catch (e) {
            }
            if (session) {
              session.provider = newProvider;
              session.model = savedModelForNewProvider;
            }
            if (typeof app.setSetting === "function") {
              await app.setSetting("AI Provider", newProvider);
            }
          }
          break;
        }
        case "setModel": {
          const newModel = args[1];
          const curProvider = session?.provider || app.settings?.["AI Provider"] || DEFAULT_PROVIDER;
          if (newModel) {
            if (session) {
              session.model = newModel;
            }
            if (typeof app.setSetting === "function") {
              let modelMap = {};
              try {
                const rawModelSetting = app.settings?.["Custom AI Model"];
                if (rawModelSetting && rawModelSetting.trim().startsWith("{")) {
                  modelMap = JSON.parse(rawModelSetting);
                }
              } catch (e) {
              }
              modelMap[curProvider] = newModel.trim();
              await app.setSetting("Custom AI Model", JSON.stringify(modelMap));
            }
          }
          break;
        }
        case "setPreset":
          if (session) {
            session.promptPresetId = args[1];
            session.customPrompt = "";
          }
          break;
        case "setCustomPrompt":
          if (session) {
            session.customPrompt = args[1];
          }
          break;
        case "clearCustomPrompt":
          if (session) {
            session.customPrompt = "";
          }
          break;
        case "runReview":
          await handleRunReview(app);
          break;
        case "reviewAll":
          await handleReviewAll(app);
          break;
        case "acceptItem":
          if (session) {
            session.accept(args[1]);
            if (session.currentIndex < session.items.length - 1) {
              session.currentIndex++;
            }
          }
          break;
        case "rejectItem":
          if (session) {
            session.reject(args[1]);
            if (session.currentIndex < session.items.length - 1) {
              session.currentIndex++;
            }
          }
          break;
        case "manualEditItem":
          if (session) {
            session.manualEdit(args[1], args[2]);
          }
          break;
        case "reReviewItem":
          await handleRunReview(app, args[1]);
          break;
        case "nextItem":
          if (session && session.currentIndex < session.items.length - 1) {
            session.currentIndex++;
          }
          break;
        case "prevItem":
          if (session && session.currentIndex > 0) {
            session.currentIndex--;
          }
          break;
        case "saveAndCommit":
          if (session) {
            const auditEnabled = Boolean(args[1]);
            const confirmSave = await app.prompt("Commit Grammar Review Rewrites?", {
              inputs: [
                {
                  label: "Also create extra changes & history report notes (-reports/-grammar/*)? (Optional \u2014 Amplenote natively captures note revision history)",
                  type: "checkbox",
                  value: auditEnabled
                }
              ]
            });
            if (confirmSave !== null && confirmSave !== false) {
              const shouldCreateNotes = typeof confirmSave === "object" ? Boolean(confirmSave["Also create extra changes & history report notes (-reports/-grammar/*)? (Optional \u2014 Amplenote natively captures note revision history)"] ?? confirmSave[0]) : Boolean(confirmSave);
              const res = await handleSaveAndCommit(app, shouldCreateNotes);
              if (shouldCreateNotes && res.changesNoteUUID) {
                await app.alert(`Changes saved to source note!

Audit report created: ${res.changesNoteUUID}`);
              } else {
                await app.alert("Changes successfully saved to source note!");
              }
            }
          }
          break;
        case "openNote":
          if (args[1]) {
            await app.navigate(`https://www.amplenote.com/notes/${args[1]}`);
          }
          requiresReRender = false;
          break;
        default:
          console.warn("[GrammarReviewer] Unhandled action:", action);
      }
      if (requiresReRender) {
        if (app.context && typeof app.context.renderEmbed === "function") {
          await app.context.renderEmbed();
        } else if (typeof app.renderEmbed === "function") {
          await app.renderEmbed();
        }
      }
    } catch (err) {
      console.error("[GrammarReviewer] Error processing onEmbedCall:", err);
      const errorMsg = err?.message || (typeof err === "string" ? err : JSON.stringify(err)) || "Unknown error";
      await app.alert(`Reviewer Error: ${errorMsg}`);
    }
  },
  /**
   * Renders the interactive embed UI.
   * @param {object} app
   * @returns {Promise<string>}
   */
  async renderEmbed(app) {
    const session = getActiveSession();
    const config = getProviderConfig(app);
    let historyRecords = [];
    if (activeTabState === "history") {
      historyRecords = await loadHistoryRecords(app);
    }
    return buildDashboardTemplate({
      session,
      config,
      historyRecords,
      activeTab: activeTabState
    });
  }
};
var grammar_reviewer_default = plugin;


return grammar_reviewer_default;
})()