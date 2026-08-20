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
var DEFAULT_PROVIDER = PROVIDERS.OPENROUTER;
var DEFAULT_MODELS = {
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
  { id: "midnight", name: "Midnight Slate", icon: "\u{1F30C}", type: "dark" },
  { id: "nord", name: "Nord Arctic", icon: "\u2744\uFE0F", type: "dark" },
  { id: "glass", name: "Glassmorphism", icon: "\u2728", type: "dark" },
  { id: "emerald", name: "Emerald Forest", icon: "\u{1F332}", type: "dark" },
  { id: "purple", name: "Cyber Violet", icon: "\u{1F49C}", type: "dark" },
  { id: "espresso", name: "Espresso Obsidian", icon: "\u2615", type: "dark" },
  { id: "dracula", name: "Dracula Neo", icon: "\u{1F9DB}", type: "dark" },
  { id: "light", name: "Clean Daylight", icon: "\u2600\uFE0F", type: "light" },
  { id: "sepia", name: "Sepia Parchment", icon: "\u{1F4DC}", type: "light" },
  { id: "sakura", name: "Sakura Blossom", icon: "\u{1F338}", type: "light" },
  { id: "matcha", name: "Matcha Latte", icon: "\u{1F375}", type: "light" },
  { id: "nord-light", name: "Nord Frost", icon: "\u{1F9CA}", type: "light" }
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
    id: "minimal_changes",
    name: "Minimal Changes (Preserve Voice)",
    description: "Fixes strictly objective errors and awkward phrasing while strictly preserving the author's wording.",
    instruction: "Change ONLY what materially improves grammatical correctness and readability. Strictly preserve the author's original words, voice, and sentence structure whenever possible. Do not rewrite or restyle unnecessarily."
  },
  {
    id: "teacher_editor",
    name: "Teacher & Coach (Clarity & Flow)",
    description: "Corrects errors and sharpens clarity, word choice, and rhythm like a senior editor.",
    instruction: "Act as a senior copyeditor and writing coach. Correct errors, eliminate redundancies, and refine awkward phrasing while preserving the author's authentic style."
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
    name: "Improve Flow & Rhythm",
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
    id: "academic_clarity",
    name: "Academic & Analytical",
    description: "Structures arguments rigorously with precise academic terminology.",
    instruction: "Elevate the prose to an academic and rigorous standard. Use precise terminology, structured reasoning, and objective phrasing."
  },
  {
    id: "add_humor",
    name: "Add Subtle Humor & Wit",
    description: "Injects lighthearted wit and clever analogies where appropriate.",
    instruction: "Inject subtle wit, clever analogies, or lighthearted humor to make the content engaging and delightful while preserving the core message."
  }
];
var RE_REVIEW_REASONS = [
  { id: "preserve_voice", label: "Too aggressive (Preserve my voice)", prompt: "The previous suggestion changed too much. Please make minimal changes, strictly preserving my original voice and phrasing while fixing only clear errors." },
  { id: "grammar_only", label: "Fix grammar & spelling only", prompt: "Fix strictly spelling, punctuation, and grammar mistakes only. Do not make stylistic or vocabulary changes." },
  { id: "more_concise", label: "Make more concise & punchy", prompt: "Make this punchier and more concise. Trim unnecessary words and filler phrases." },
  { id: "improve_clarity", label: "Improve clarity & transitions", prompt: "Focus on making the flow between ideas natural and clear. Enhance sentence transitions." },
  { id: "custom", label: "Custom instruction...", prompt: "" }
];

// anp-23-grammar-reviewer/lib/engine/tokenizer.js
function tokenizeContent(text, mode = GRANULARITY_MODES.PARAGRAPH) {
  if (!text || typeof text !== "string") {
    return [];
  }
  const normalized = text.replace(/\r\n/g, "\n");
  if (mode === GRANULARITY_MODES.FULL) {
    return [
      {
        id: 1,
        original: normalized,
        type: "full",
        isInspectable: normalized.trim().length > 0,
        parentParagraphId: 1,
        isLastInParagraph: true
      }
    ];
  }
  if (mode === GRANULARITY_MODES.SENTENCE) {
    return tokenizeSentences(normalized);
  }
  return tokenizeParagraphs(normalized);
}
function tokenizeParagraphs(text) {
  if (!text || typeof text !== "string") return [];
  const normalized = text.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
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
        const paraId = idCounter++;
        paragraphs.push({
          id: paraId,
          original: chunkText,
          type: "paragraph",
          isInspectable: isInspectableText(chunkText),
          parentParagraphId: paraId,
          isLastInParagraph: true
        });
        currentBuffer = [];
      }
      const sepId = idCounter++;
      paragraphs.push({
        id: sepId,
        original: "",
        type: "separator",
        isInspectable: false,
        parentParagraphId: sepId,
        isLastInParagraph: true
      });
    } else {
      currentBuffer.push(line);
    }
  }
  if (currentBuffer.length > 0) {
    const chunkText = currentBuffer.join("\n");
    const paraId = idCounter++;
    paragraphs.push({
      id: paraId,
      original: chunkText,
      type: "paragraph",
      isInspectable: isInspectableText(chunkText),
      parentParagraphId: paraId,
      isLastInParagraph: true
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
    for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
      const s = sentences[sIdx];
      const isLast = sIdx === sentences.length - 1;
      items.push({
        id: idCounter++,
        original: s,
        type: "sentence",
        isInspectable: isInspectableText(s),
        parentParagraphId: para.id,
        isLastInParagraph: isLast
      });
    }
  }
  return items;
}
var ABBREVIATIONS_PATTERN = /\b(e\.g\.|i\.e\.|etc\.|mr\.|mrs\.|ms\.|dr\.|prof\.|sr\.|jr\.|inc\.|ltd\.|co\.|corp\.|u\.s\.|u\.k\.|u\.n\.|e\.u\.|ph\.d\.|m\.d\.|b\.a\.|m\.a\.|b\.s\.|m\.s\.|vs\.|fig\.|no\.|dept\.|est\.|approx\.|jan\.|feb\.|mar\.|apr\.|jun\.|jul\.|aug\.|sep\.|sept\.|oct\.|nov\.|dec\.|al\.|st\.|ave\.|rd\.|blvd\.)/gi;
function splitIntoSentences(text) {
  if (!text || typeof text !== "string") return [];
  const protectedText = text.replace(ABBREVIATIONS_PATTERN, (match) => match.replace(/\./g, "\xA7DOT\xA7")).replace(/\b([A-Z])\./g, "$1\xA7DOT\xA7").replace(/(\d+)\.(\d+)/g, "$1\xA7DOT\xA7$2").replace(/(https?:\/\/[^\s]+)/g, (match) => match.replace(/\./g, "\xA7DOT\xA7"));
  const parts = protectedText.split(/([.!?]+["')\]}]*(?:\s+|$))/g);
  const result = [];
  let current = "";
  for (let i = 0; i < parts.length; i++) {
    current += parts[i];
    if (i % 2 === 1 || i === parts.length - 1) {
      if (current.trim().length > 0) {
        result.push(current.replace(/§DOT§/g, ".").trim());
        current = "";
      }
    }
  }
  if (current.trim().length > 0) {
    result.push(current.replace(/§DOT§/g, ".").trim());
  }
  return result.length > 0 ? result : [text.trim()];
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
  let start = 0;
  while (start < n && start < m && a[start] === b[start]) {
    start++;
  }
  let endA = n - 1;
  let endB = m - 1;
  while (endA >= start && endB >= start && a[endA] === b[endB]) {
    endA--;
    endB--;
  }
  const midA = a.slice(start, endA + 1);
  const midB = b.slice(start, endB + 1);
  const subDiff = [];
  if (midA.length > 0 && midB.length > 0) {
    const subN = midA.length;
    const subM = midB.length;
    const matrix = Array.from({ length: subN + 1 }, () => new Array(subM + 1).fill(0));
    for (let i2 = 1; i2 <= subN; i2++) {
      for (let j2 = 1; j2 <= subM; j2++) {
        if (midA[i2 - 1] === midB[j2 - 1]) {
          matrix[i2][j2] = matrix[i2 - 1][j2 - 1] + 1;
        } else {
          matrix[i2][j2] = Math.max(matrix[i2 - 1][j2], matrix[i2][j2 - 1]);
        }
      }
    }
    let i = subN;
    let j = subM;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && midA[i - 1] === midB[j - 1]) {
        subDiff.push({ type: "equal", value: midA[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
        subDiff.push({ type: "insert", value: midB[j - 1] });
        j--;
      } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
        subDiff.push({ type: "delete", value: midA[i - 1] });
        i--;
      }
    }
    subDiff.reverse();
  } else if (midA.length > 0) {
    for (const val of midA) subDiff.push({ type: "delete", value: val });
  } else if (midB.length > 0) {
    for (const val of midB) subDiff.push({ type: "insert", value: val });
  }
  const result = [];
  for (let i = 0; i < start; i++) {
    result.push({ type: "equal", value: a[i] });
  }
  for (const item of subDiff) {
    result.push(item);
  }
  for (let i = endA + 1; i < n; i++) {
    result.push({ type: "equal", value: a[i] });
  }
  return result;
}
function computeWordDiff(original = "", suggested = "") {
  if (original === suggested) {
    const origWords = tokenizeWords(original);
    return {
      hasChanges: false,
      diff: origWords.map((w) => ({ type: "equal", value: w })),
      stats: { additions: 0, deletions: 0, totalOriginalWords: origWords.length, totalSuggestedWords: origWords.length, changeCount: 0 },
      inlineHtml: escapeHtml(original),
      originalHtml: escapeHtml(original),
      suggestedHtml: escapeHtml(suggested),
      changesHtml: `<div class="gr-no-changes-msg">\u2713 No textual changes detected. Original wording preserved.</div>`,
      changesList: []
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
  const changesList = extractChangesList(diff);
  const changesHtml = renderChangesOnlyHtml(changesList);
  const hasChanges = additions > 0 || deletions > 0;
  return {
    hasChanges,
    diff,
    stats: {
      additions,
      deletions,
      totalOriginalWords: origTokens.length,
      totalSuggestedWords: suggTokens.length,
      changeCount: changesList.length
    },
    inlineHtml,
    originalHtml,
    suggestedHtml,
    changesHtml,
    changesList
  };
}
function extractChangesList(diff) {
  const changes = [];
  let i = 0;
  while (i < diff.length) {
    if (diff[i].type === "equal") {
      i++;
      continue;
    }
    let delBuffer = "";
    let insBuffer = "";
    while (i < diff.length && (diff[i].type === "delete" || diff[i].type === "insert")) {
      if (diff[i].type === "delete") {
        delBuffer += diff[i].value;
      } else if (diff[i].type === "insert") {
        insBuffer += diff[i].value;
      }
      i++;
    }
    const cleanDel = delBuffer.trim();
    const cleanIns = insBuffer.trim();
    if (cleanDel && cleanIns) {
      changes.push({ type: "replace", original: cleanDel, suggested: cleanIns });
    } else if (cleanDel) {
      changes.push({ type: "delete", original: cleanDel, suggested: "" });
    } else if (cleanIns) {
      changes.push({ type: "insert", original: "", suggested: cleanIns });
    }
  }
  return changes;
}
function renderChangesOnlyHtml(changesList) {
  if (!changesList || changesList.length === 0) {
    return `<div class="gr-no-changes-msg">\u2713 No textual modifications. Original text looks good!</div>`;
  }
  const itemsHtml = changesList.map((ch, idx) => {
    if (ch.type === "replace") {
      return `
        <div class="gr-change-row">
          <span class="gr-change-num">#${idx + 1}</span>
          <span class="gr-change-type badge-replace">Replace</span>
          <span class="gr-change-del">"${escapeHtml(ch.original)}"</span>
          <span class="gr-change-arrow">\u2192</span>
          <span class="gr-change-ins">"${escapeHtml(ch.suggested)}"</span>
        </div>
      `;
    } else if (ch.type === "delete") {
      return `
        <div class="gr-change-row">
          <span class="gr-change-num">#${idx + 1}</span>
          <span class="gr-change-type badge-delete">Removed</span>
          <span class="gr-change-del">"${escapeHtml(ch.original)}"</span>
        </div>
      `;
    } else {
      return `
        <div class="gr-change-row">
          <span class="gr-change-num">#${idx + 1}</span>
          <span class="gr-change-type badge-insert">Added</span>
          <span class="gr-change-ins">"${escapeHtml(ch.suggested)}"</span>
        </div>
      `;
    }
  }).join("");
  return `
    <div class="gr-changes-list-container">
      <div class="gr-changes-list-header">
        <strong>${changesList.length} Proposed Change${changesList.length === 1 ? "" : "s"}:</strong>
      </div>
      <div class="gr-changes-list-items">
        ${itemsHtml}
      </div>
    </div>
  `;
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
    noteTags = [],
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
    this.noteTags = Array.isArray(noteTags) ? noteTags : typeof noteTags === "string" ? noteTags.split(",").map((t) => t.trim()).filter(Boolean) : [];
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
  /**
   * Initializes the session items by tokenizing the original document content.
   */
  initializeItems() {
    const rawTokens = tokenizeContent(this.originalContent, this.granularity);
    this.items = rawTokens.map((token) => ({
      id: token.id,
      original: token.original,
      type: token.type,
      isInspectable: token.isInspectable,
      parentParagraphId: token.parentParagraphId || token.id,
      isLastInParagraph: token.isLastInParagraph !== void 0 ? token.isLastInParagraph : true,
      status: "pending",
      // "pending" | "suggestion_ready" | "accepted" | "rejected" | "modified" | "no_change" | "error"
      suggestion: token.original,
      diff: null,
      customEdit: null,
      reviewedAt: null,
      undoStack: [],
      explanation: "",
      category: "Grammar & Clarity",
      confidence: "high"
    }));
  }
  /**
   * Pushes current item snapshot to undo stack before mutating.
   * @param {object} item
   */
  pushUndo(item) {
    if (!item) return;
    if (!item.undoStack) item.undoStack = [];
    item.undoStack.push({
      status: item.status,
      suggestion: item.suggestion,
      customEdit: item.customEdit,
      diff: item.diff,
      reviewedAt: item.reviewedAt
    });
    if (item.undoStack.length > 10) item.undoStack.shift();
  }
  /**
   * Reverts the most recent status/content modification on the specified item.
   * @param {number} index
   * @returns {boolean}
   */
  undo(index) {
    const item = this.items[index];
    if (!item) return false;
    if (item.undoStack && item.undoStack.length > 0) {
      const prev = item.undoStack.pop();
      item.status = prev.status;
      item.suggestion = prev.suggestion;
      item.customEdit = prev.customEdit;
      item.diff = prev.diff;
      item.reviewedAt = prev.reviewedAt;
      return true;
    }
    if (item.status === "accepted" || item.status === "rejected" || item.status === "modified") {
      item.status = item.diff && item.diff.hasChanges ? "suggestion_ready" : "pending";
      item.customEdit = null;
      return true;
    }
    return false;
  }
  /**
   * Checks if an item can be undone.
   * @param {number} index
   * @returns {boolean}
   */
  canUndo(index) {
    const item = this.items[index];
    if (!item) return false;
    return item.undoStack && item.undoStack.length > 0 || ["accepted", "rejected", "modified"].includes(item.status);
  }
  /**
   * Sets AI suggestion for a specific item and calculates diff.
   * @param {number} index
   * @param {string} suggestion
   * @param {object} [metadata] - Optional AI explanation & category
   */
  setSuggestion(index, suggestion, metadata = {}) {
    if (!this.items[index]) return;
    const item = this.items[index];
    this.pushUndo(item);
    item.suggestion = suggestion;
    item.diff = computeWordDiff(item.original, suggestion);
    item.explanation = metadata.explanation || "";
    item.category = metadata.category || (item.diff.hasChanges ? "Grammar & Clarity" : "No Changes Needed");
    item.confidence = metadata.confidence || "high";
    if (!item.diff.hasChanges) {
      item.status = "accepted";
    } else {
      item.status = "suggestion_ready";
    }
  }
  /**
   * Accepts the suggestion for the specified item.
   * @param {number} index
   */
  accept(index) {
    if (this.items[index]) {
      this.pushUndo(this.items[index]);
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
      this.pushUndo(this.items[index]);
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
      this.pushUndo(this.items[index]);
      this.items[index].customEdit = customText;
      this.items[index].status = "modified";
      this.items[index].diff = computeWordDiff(this.items[index].original, customText);
      this.items[index].reviewedAt = Date.now();
    }
  }
  /**
   * Finds the next index of an item that is still pending or ready for review decision.
   * @param {number} [fromIndex]
   * @returns {number} Index of next pending item or -1
   */
  getNextPendingIndex(fromIndex = this.currentIndex) {
    for (let i = fromIndex + 1; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.isInspectable && (item.status === "pending" || item.status === "suggestion_ready")) {
        return i;
      }
    }
    for (let i = 0; i <= fromIndex; i++) {
      const item = this.items[i];
      if (item.isInspectable && (item.status === "pending" || item.status === "suggestion_ready")) {
        return i;
      }
    }
    return -1;
  }
  /**
   * Finds the previous index of an item that is still pending or ready for review decision.
   * @param {number} [fromIndex]
   * @returns {number} Index of previous pending item or -1
   */
  getPrevPendingIndex(fromIndex = this.currentIndex) {
    for (let i = fromIndex - 1; i >= 0; i--) {
      const item = this.items[i];
      if (item.isInspectable && (item.status === "pending" || item.status === "suggestion_ready")) {
        return i;
      }
    }
    for (let i = this.items.length - 1; i >= fromIndex; i--) {
      const item = this.items[i];
      if (item.isInspectable && (item.status === "pending" || item.status === "suggestion_ready")) {
        return i;
      }
    }
    return -1;
  }
  /**
   * Assembles the final markdown output based on accepted/rejected/modified states,
   * properly preserving paragraph spacing in sentence mode without introducing stray newlines.
   * @returns {string}
   */
  getReconstructedContent() {
    if (this.granularity === GRANULARITY_MODES.SENTENCE) {
      let result = "";
      let paraSentences = [];
      let currentParaId = null;
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        let itemText = item.original;
        if (item.status === "accepted") {
          itemText = item.suggestion;
        } else if (item.status === "modified" && item.customEdit !== null) {
          itemText = item.customEdit;
        }
        if (item.type === "separator") {
          if (paraSentences.length > 0) {
            result += (result ? "\n" : "") + paraSentences.join(" ");
            paraSentences = [];
          }
          result += "\n";
          currentParaId = null;
          continue;
        }
        const pId = item.parentParagraphId || item.id;
        if (currentParaId !== null && currentParaId !== pId) {
          if (paraSentences.length > 0) {
            result += (result ? "\n" : "") + paraSentences.join(" ");
            paraSentences = [];
          }
        }
        currentParaId = pId;
        if (itemText && itemText.trim().length > 0) {
          paraSentences.push(itemText.trim());
        }
        if (item.isLastInParagraph) {
          if (paraSentences.length > 0) {
            result += (result ? "\n" : "") + paraSentences.join(" ");
            paraSentences = [];
          }
          currentParaId = null;
        }
      }
      if (paraSentences.length > 0) {
        result += (result ? "\n" : "") + paraSentences.join(" ");
      }
      return result;
    }
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
   * @returns {{
   *   total: number,
   *   reviewed: number,
   *   accepted: number,
   *   rejected: number,
   *   pending: number,
   *   percentComplete: number,
   *   totalAdditions: number,
   *   totalDeletions: number
   * }}
   */
  getMetrics() {
    const inspectable = this.items.filter((i) => i.isInspectable);
    const total = inspectable.length;
    const reviewed = inspectable.filter((i) => i.status !== "pending" && i.status !== "suggestion_ready").length;
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
      noteTags: this.noteTags,
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
      noteTags: data.noteTags || [],
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
      defaultModel: config.defaultModel || DEFAULT_MODELS[PROVIDERS.GROQ]
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
      defaultModel: config.defaultModel || DEFAULT_MODELS[PROVIDERS.DEEPSEEK]
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
      defaultModel: config.defaultModel || DEFAULT_MODELS[PROVIDERS.MISTRAL]
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
function safeParseJSON(str, fallback = {}) {
  if (!str || typeof str !== "string") return fallback;
  const trimmed = str.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return fallback;
  try {
    const parsed = JSON.parse(trimmed);
    return typeof parsed === "object" && parsed !== null ? parsed : fallback;
  } catch {
    return fallback;
  }
}
function getProviderConfig(app) {
  const settings = app?.settings || {};
  const selectedProvider = settings["AI Provider"] || DEFAULT_PROVIDER;
  const keys = {};
  const allModels = {};
  const rawCustomModelSetting = settings["Custom AI Model"] || "";
  let parsedCustomModels = safeParseJSON(rawCustomModelSetting, null);
  if (!parsedCustomModels) {
    parsedCustomModels = {};
    if (typeof rawCustomModelSetting === "string" && rawCustomModelSetting.trim()) {
      parsedCustomModels[selectedProvider] = rawCustomModelSetting.trim();
    }
  }
  for (const p of Object.values(PROVIDERS)) {
    const rawVal = settings[`${p} API Key`] || settings[`${p} Key`] || "";
    let extractedKey = "";
    let extractedModel = parsedCustomModels[p] || "";
    if (rawVal && typeof rawVal === "string") {
      const parsedObj = safeParseJSON(rawVal, null);
      if (parsedObj) {
        extractedKey = parsedObj.apiKey || parsedObj.key || "";
        if (parsedObj.model || parsedObj.customModel) {
          extractedModel = parsedObj.model || parsedObj.customModel;
        }
      } else {
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
function createProviderInstance({ provider = DEFAULT_PROVIDER, apiKey = "", baseUrl = "", defaultModel = "" } = {}) {
  const finalModel = defaultModel || DEFAULT_MODELS[provider];
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
    let noteTags = [];
    try {
      noteContent = await app.getNoteContent({ uuid: noteUUID }) || "";
    } catch (fetchErr) {
      console.warn("[GrammarReviewer] getNoteContent error:", fetchErr);
    }
    try {
      if (typeof app.getNoteTags === "function") {
        noteTags = await app.getNoteTags({ uuid: noteUUID }) || [];
      }
    } catch (tagErr) {
      console.warn("[GrammarReviewer] getNoteTags error:", tagErr);
    }
    try {
      const noteHandle = await app.findNote({ uuid: noteUUID });
      if (noteHandle) {
        if (noteHandle.name && (noteTitle === "Untitled Note" || !noteTitle)) {
          noteTitle = noteHandle.name;
        }
        if ((!noteTags || noteTags.length === 0) && Array.isArray(noteHandle.tags)) {
          noteTags = noteHandle.tags;
        }
      }
    } catch (findErr) {
      console.warn("[GrammarReviewer] findNote error:", findErr);
    }
    const config = getProviderConfig(app);
    const session = new ReviewSession({
      noteUUID,
      noteTitle,
      noteTags,
      originalContent: noteContent,
      granularity: GRANULARITY_MODES.FULL,
      provider: config.provider,
      model: config.customModel || DEFAULT_MODELS[config.provider] || ""
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
var isReviewAllCancelled = false;
function cancelReviewAll() {
  isReviewAllCancelled = true;
}
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
  const prevStatus = item.status;
  item.status = "reviewing";
  try {
    const aiOutput = await provider.complete({
      prompt: userPrompt,
      systemPrompt,
      model: session.model
    });
    session.setSuggestion(targetIdx, aiOutput);
    return session;
  } catch (err) {
    item.status = prevStatus === "pending" ? "error" : prevStatus;
    throw err;
  }
}
async function handleReviewAll(app) {
  const session = getActiveSession();
  if (!session) return;
  isReviewAllCancelled = false;
  for (let i = 0; i < session.items.length; i++) {
    if (isReviewAllCancelled) {
      console.log("[GrammarReviewer] Review All was cancelled by user.");
      break;
    }
    const item = session.items[i];
    if (item.isInspectable && (item.status === "pending" || item.status === "error")) {
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
  if (session.granularity === newMode) return;
  const newSession = new ReviewSession({
    noteUUID: session.noteUUID,
    noteTitle: session.noteTitle,
    noteTags: session.noteTags || [],
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
  if (!Array.isArray(notes)) return [];
  const jsonRecords = [];
  const fallbackRecords = [];
  const knownTimestamps = /* @__PURE__ */ new Set();
  const knownSourceNoteTimestamps = /* @__PURE__ */ new Set();
  for (const note of notes) {
    if (!note || typeof note !== "object") continue;
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
    } else if (raw && (raw.includes("Grammar Review") || raw.includes("Grammar & Style") || raw.includes("Changes Report") || raw.includes("Grammar Changes"))) {
      const titleMatch = raw.match(/# (?:(?:📝|📜) )?(?:Grammar (?:& Style )?Review )?(?:Changes|Report)?(?:\s*:\s*|\s+)(.*)/i) || raw.match(/Source Note:\s*\[([^\]]+)\]/i);
      const uuidMatch = raw.match(/amplenote\.com\/notes\/([a-zA-Z0-9_-]+)/i);
      const dateMatch = raw.match(/\*\*Date:\*\*\s*(.*)/i) || raw.match(/\*\*Review Date:\*\*\s*(.*)/i) || raw.match(/Date:\s*(.*)/i);
      const changesMatch = raw.match(/(\d+)\s*(?:changes?|replacements?|items?)/i);
      const providerMatch = raw.match(/(?:\*\*)?Provider:(?:\*\*)?\s*([^\n\r*]+)/i) || raw.match(/AI Engine:\s*`([^`]+)`/i);
      const ts = parseInt(note.name, 10) || (dateMatch ? Math.floor(new Date(dateMatch[1]).getTime() / 1e3) : 0);
      fallbackRecords.push({
        noteUUID: note.uuid,
        noteName: note.name,
        timestamp: ts || Math.floor(Date.now() / 1e3),
        isoDate: dateMatch ? dateMatch[1].trim() : (/* @__PURE__ */ new Date()).toISOString(),
        sourceNote: {
          uuid: uuidMatch ? uuidMatch[1] : note.uuid,
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
  if (!noteUUID || typeof noteUUID !== "string") {
    throw new Error("Cannot save: Target note UUID is missing or invalid.");
  }
  if (typeof app.getNoteContent === "function") {
    try {
      const currentContent = await app.getNoteContent({ uuid: noteUUID });
      if (currentContent && session.originalContent && currentContent.replace(/\r\n/g, "\n").trim() !== session.originalContent.replace(/\r\n/g, "\n").trim()) {
        const proceed = await app.prompt("Warning: Note Modified Externally", {
          inputs: [
            {
              label: "The source note was modified outside the reviewer. Overwrite with reviewed version?",
              type: "checkbox",
              value: true
            }
          ]
        });
        const isConfirmed = typeof proceed === "object" ? Boolean(proceed["The source note was modified outside the reviewer. Overwrite with reviewed version?"] ?? proceed[0]) : Boolean(proceed);
        if (!isConfirmed) {
          return { success: false, cancelled: true };
        }
      }
    } catch (e) {
      console.warn("[GrammarReviewer] Stale note check skipped:", e);
    }
  }
  try {
    await app.replaceNoteContent({ uuid: noteUUID }, finalContent);
  } catch (err) {
    const message = err?.message || String(err);
    throw new Error(`Failed to update note (${noteUUID}): ${message}`);
  }
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
      } catch {
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
        } catch {
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
      } catch {
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
  --border-color: rgba(255, 255, 255, 0.12);
  --border-subtle: rgba(255, 255, 255, 0.07);
  --border-active: #88c0d0;
  --text-primary: #f8fafc;
  --text-secondary: #d8dee9;
  --text-muted: #a3b1c6;
  --accent-primary: #88c0d0;
  --accent-hover: #81a1c1;
  --accent-success: #a3be8c;
  --accent-success-bg: rgba(163, 190, 140, 0.2);
  --accent-danger: #e06c75;
  --accent-danger-bg: rgba(224, 108, 117, 0.2);
  --accent-warning: #ebcb8b;
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

/* Theme: Glassmorphism */
[data-theme="glass"] {
  --bg-primary: #0b1329;
  --bg-secondary: #16203a;
  --bg-card: #1e2c4f;
  --bg-card-hover: #293a62;
  --border-color: rgba(56, 189, 248, 0.18);
  --border-subtle: rgba(56, 189, 248, 0.09);
  --border-active: #38bdf8;
  --text-primary: #ffffff;
  --text-secondary: #e2e8f0;
  --text-muted: #94a3b8;
  --accent-primary: #38bdf8;
  --accent-hover: #0ea5e9;
  --accent-success: #34d399;
  --accent-success-bg: rgba(52, 211, 153, 0.22);
  --accent-danger: #fb7185;
  --accent-danger-bg: rgba(251, 113, 133, 0.22);
  --accent-warning: #facc15;
  --card-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
}

/* Theme: Emerald Forest */
[data-theme="emerald"] {
  --bg-primary: #061e16;
  --bg-secondary: #0b2e23;
  --bg-card: #124334;
  --bg-card-hover: #185442;
  --border-color: rgba(52, 211, 153, 0.18);
  --border-subtle: rgba(52, 211, 153, 0.09);
  --border-active: #10b981;
  --text-primary: #f0fdf4;
  --text-secondary: #bbf7d0;
  --text-muted: #86efac;
  --accent-primary: #34d399;
  --accent-hover: #10b981;
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
  --border-color: rgba(168, 85, 247, 0.22);
  --border-subtle: rgba(168, 85, 247, 0.11);
  --border-active: #c084fc;
  --text-primary: #ffffff;
  --text-secondary: #f3e8ff;
  --text-muted: #d8b4fe;
  --accent-primary: #c084fc;
  --accent-hover: #a855f7;
  --accent-success: #4ade80;
  --accent-success-bg: rgba(74, 222, 128, 0.2);
  --accent-danger: #fb7185;
  --accent-danger-bg: rgba(251, 113, 133, 0.2);
  --accent-warning: #fbbf24;
  --card-shadow: 0 4px 24px rgba(168, 85, 247, 0.2);
}

/* Theme: Espresso Obsidian (Dark) */
[data-theme="espresso"] {
  --bg-primary: #14100c;
  --bg-secondary: #1f1812;
  --bg-card: #2c221a;
  --bg-card-hover: #3b2e23;
  --border-color: rgba(245, 158, 11, 0.18);
  --border-subtle: rgba(245, 158, 11, 0.09);
  --border-active: #f59e0b;
  --text-primary: #fffbeb;
  --text-secondary: #e2cca9;
  --text-muted: #bfa07e;
  --accent-primary: #f59e0b;
  --accent-hover: #d97706;
  --accent-success: #34d399;
  --accent-success-bg: rgba(52, 211, 153, 0.2);
  --accent-danger: #f87171;
  --accent-danger-bg: rgba(248, 113, 113, 0.2);
  --accent-warning: #fbbf24;
  --card-shadow: 0 4px 24px rgba(0, 0, 0, 0.45);
}

/* Theme: Dracula Neo (Dark) */
[data-theme="dracula"] {
  --bg-primary: #1e1f29;
  --bg-secondary: #282a36;
  --bg-card: #343746;
  --bg-card-hover: #44475a;
  --border-color: rgba(189, 147, 249, 0.22);
  --border-subtle: rgba(189, 147, 249, 0.11);
  --border-active: #ff79c6;
  --text-primary: #ffffff;
  --text-secondary: #d8b4fe;
  --text-muted: #95a5c5;
  --accent-primary: #8be9fd;
  --accent-hover: #ff79c6;
  --accent-success: #50fa7b;
  --accent-success-bg: rgba(80, 250, 123, 0.2);
  --accent-danger: #ff5555;
  --accent-danger-bg: rgba(255, 85, 85, 0.2);
  --accent-warning: #f1fa8c;
  --card-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

/* Theme: Clean Daylight (Light Mode) */
[data-theme="light"] {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-card: #f1f5f9;
  --bg-card-hover: #e2e8f0;
  --border-color: #cbd5e1;
  --border-subtle: #e2e8f0;
  --border-active: #2563eb;
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-muted: #55657d;
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

/* Theme: Sepia Parchment (Light Mode) */
[data-theme="sepia"] {
  --bg-primary: #fbf7ee;
  --bg-secondary: #f4ede0;
  --bg-card: #eae1d0;
  --bg-card-hover: #dfd4c0;
  --border-color: #c9bca6;
  --border-subtle: #dbceb9;
  --border-active: #b45309;
  --text-primary: #2d2319;
  --text-secondary: #5f4b39;
  --text-muted: #785f49;
  --accent-primary: #b45309;
  --accent-hover: #92400e;
  --accent-success: #15803d;
  --accent-success-bg: rgba(21, 128, 61, 0.15);
  --accent-danger: #b91c1c;
  --accent-danger-bg: rgba(185, 28, 28, 0.12);
  --accent-warning: #b45309;
  --card-shadow: 0 2px 12px rgba(95, 75, 57, 0.08);
  --btn-shadow: 0 1px 3px rgba(95, 75, 57, 0.06);
}

/* Theme: Sakura Blossom (Light Mode) */
[data-theme="sakura"] {
  --bg-primary: #fff5f7;
  --bg-secondary: #ffedf2;
  --bg-card: #fde2e8;
  --bg-card-hover: #fbcad5;
  --border-color: #f4abbc;
  --border-subtle: #f9c2cf;
  --border-active: #e11d48;
  --text-primary: #37121c;
  --text-secondary: #6e2c3e;
  --text-muted: #8c3b52;
  --accent-primary: #e11d48;
  --accent-hover: #be123c;
  --accent-success: #059669;
  --accent-success-bg: rgba(5, 150, 105, 0.15);
  --accent-danger: #b91c1c;
  --accent-danger-bg: rgba(185, 28, 28, 0.12);
  --accent-warning: #b45309;
  --card-shadow: 0 2px 14px rgba(225, 29, 72, 0.08);
  --btn-shadow: 0 1px 3px rgba(225, 29, 72, 0.06);
}

/* Theme: Matcha Latte (Light Mode) */
[data-theme="matcha"] {
  --bg-primary: #f6f8f5;
  --bg-secondary: #edf2eb;
  --bg-card: #dce6d8;
  --bg-card-hover: #cddbc8;
  --border-color: #b8c9b1;
  --border-subtle: #cbd8c5;
  --border-active: #15803d;
  --text-primary: #17281c;
  --text-secondary: #2f4935;
  --text-muted: #4e6b54;
  --accent-primary: #15803d;
  --accent-hover: #166534;
  --accent-success: #15803d;
  --accent-success-bg: rgba(21, 128, 61, 0.15);
  --accent-danger: #b91c1c;
  --accent-danger-bg: rgba(185, 28, 28, 0.12);
  --accent-warning: #b45309;
  --card-shadow: 0 2px 12px rgba(23, 40, 28, 0.08);
  --btn-shadow: 0 1px 3px rgba(23, 40, 28, 0.06);
}

/* Theme: Nord Frost (Light Mode) */
[data-theme="nord-light"] {
  --bg-primary: #f4f6f9;
  --bg-secondary: #e9edf2;
  --bg-card: #dce3eb;
  --bg-card-hover: #cbd5e1;
  --border-color: #b3c2d4;
  --border-subtle: #cbd5e1;
  --border-active: #0284c7;
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-muted: #55657d;
  --accent-primary: #0284c7;
  --accent-hover: #0369a1;
  --accent-success: #059669;
  --accent-success-bg: rgba(5, 150, 105, 0.15);
  --accent-danger: #b91c1c;
  --accent-danger-bg: rgba(185, 28, 28, 0.12);
  --accent-warning: #b45309;
  --card-shadow: 0 2px 12px rgba(30, 41, 59, 0.08);
  --btn-shadow: 0 1px 3px rgba(30, 41, 59, 0.05);
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
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.gr-nav-bar-group {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.gr-jump-selector-container {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.gr-jump-label {
  font-size: 11.5px;
  color: var(--text-secondary);
  font-weight: 600;
}

.gr-jump-select {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-size: 11.5px;
  font-family: var(--font-sans);
  outline: none;
  max-width: 220px;
}
.gr-jump-select:focus {
  border-color: var(--border-active);
}

.gr-change-count-pill {
  background: rgba(59, 130, 246, 0.15);
  color: var(--accent-primary);
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.gr-diff-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  font-family: var(--font-sans);
}

.badge-pending { background: var(--bg-card-hover); color: var(--text-primary); border: 1px solid var(--border-color); }
.badge-suggestion_ready { background: rgba(59, 130, 246, 0.15); color: var(--accent-primary); border: 1px solid rgba(59, 130, 246, 0.3); }
.badge-accepted { background: var(--accent-success-bg); color: var(--accent-success); border: 1px solid rgba(16,185,129,0.3); }
.badge-rejected { background: var(--accent-danger-bg); color: var(--accent-danger); border: 1px solid rgba(239,68,68,0.3); }
.badge-modified { background: rgba(245, 158, 11, 0.2); color: var(--accent-warning); border: 1px solid rgba(245, 158, 11, 0.3); }
.badge-error { background: var(--accent-danger-bg); color: var(--accent-danger); border: 1px solid rgba(239,68,68,0.4); }

/* Diff Mode Bar */
.gr-diff-mode-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 8px;
}

.gr-diff-body {
  padding: 14px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.gr-panes-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  flex: 1;
}

@media (max-width: 768px) {
  .gr-panes-wrapper {
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
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  display: flex;
  justify-content: space-between;
}

.gr-pane-content {
  background: var(--bg-primary);
  padding: 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  font-size: 14px;
  font-family: var(--font-sans);
  color: var(--text-primary);
  white-space: pre-wrap;
  min-height: 380px;
  height: calc(100vh - 350px);
  max-height: 700px;
  overflow-y: auto;
  line-height: 1.75;
  letter-spacing: 0.01em;
}

/* Side-by-Side Dual Highlighting */
.diff-del-highlight {
  background: var(--accent-danger-bg);
  color: var(--accent-danger);
  text-decoration: line-through;
  padding: 1px 4px;
  border-radius: 3px;
  margin: 0 1px;
  font-weight: 500;
  border-bottom: 1px dashed rgba(239, 68, 68, 0.4);
}

.diff-ins-highlight {
  background: var(--accent-success-bg);
  color: var(--accent-success);
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
  color: var(--accent-danger);
  text-decoration: line-through;
  padding: 1px 4px;
  border-radius: 3px;
  margin: 0 1px;
}

.diff-ins {
  background: var(--accent-success-bg);
  color: var(--accent-success);
  text-decoration: none;
  padding: 1px 4px;
  border-radius: 3px;
  margin: 0 1px;
  font-weight: 600;
}

/* Changes Only Mode View */
.gr-changes-only-view {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 16px;
  min-height: 380px;
  height: calc(100vh - 350px);
  max-height: 700px;
  overflow-y: auto;
}

.gr-changes-list-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gr-changes-list-header {
  font-size: 13px;
  color: var(--text-primary);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border-color);
}

.gr-changes-list-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gr-change-row {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-card);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  font-size: 13px;
  flex-wrap: wrap;
}

.gr-change-num {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 700;
}

.gr-change-type {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
}

.badge-replace { background: rgba(59, 130, 246, 0.15); color: var(--accent-primary); }
.badge-delete { background: var(--accent-danger-bg); color: var(--accent-danger); }
.badge-insert { background: var(--accent-success-bg); color: var(--accent-success); }

.gr-change-del {
  color: var(--accent-danger);
  text-decoration: line-through;
  font-family: var(--font-sans);
}

.gr-change-arrow {
  color: var(--text-muted);
  font-weight: 700;
}

.gr-change-ins {
  color: var(--accent-success);
  font-weight: 600;
  font-family: var(--font-sans);
}

.gr-no-changes-msg {
  color: var(--accent-success);
  padding: 20px;
  text-align: center;
  font-size: 13.5px;
  font-weight: 600;
}

/* Teacher's Insight Box */
.gr-teacher-insight-box {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  margin: 0 16px 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.gr-teacher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.gr-category-badge {
  background: rgba(59, 130, 246, 0.15);
  color: var(--accent-primary);
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
}

.gr-confidence-badge {
  background: var(--accent-success-bg);
  color: var(--accent-success);
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
}

.gr-teacher-body {
  font-size: 12.5px;
  color: var(--text-primary);
  opacity: 0.92;
  line-height: 1.45;
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
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 11px;
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

/* Top Loading Operation Bar */
.gr-top-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9999;
  background: transparent;
  overflow: hidden;
  display: none;
}

.gr-top-loader.active {
  display: block;
  background: rgba(59, 130, 246, 0.2);
}

.gr-top-loader-bar {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981, #a855f7, #3b82f6);
  background-size: 200% 100%;
  animation: grProgressSlide 1.5s infinite linear;
}

@keyframes grProgressSlide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.gr-op-banner {
  position: fixed;
  top: 8px;
  left: 50%;
  transform: translateX(-50%) translateY(-120%);
  background: var(--bg-secondary);
  border: 1px solid var(--border-active);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  color: var(--text-primary);
  font-size: 12.5px;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: var(--radius-md);
  z-index: 9998;
  display: flex;
  align-items: center;
  gap: 16px;
  opacity: 0;
  pointer-events: none;
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}

.gr-op-banner.active {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
  pointer-events: auto;
}

/* Status Pills */
.gr-status-pill {
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.gr-status-pill.success { background: var(--accent-success-bg); color: var(--accent-success); border: 1px solid rgba(16,185,129,0.3); }
.gr-status-pill.danger { background: var(--accent-danger-bg); color: var(--accent-danger); border: 1px solid rgba(239,68,68,0.3); }
.gr-status-pill.modified { background: rgba(245, 158, 11, 0.2); color: var(--accent-warning); border: 1px solid rgba(245, 158, 11, 0.3); }

/* Buttons & Micro-interactions */
.gr-actions-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.15);
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 10px;
}

.gr-action-buttons-group {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.gr-nav-controls-group {
  display: flex;
  gap: 6px;
  align-items: center;
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

.gr-btn.btn-sm {
  padding: 5px 9px;
  font-size: 11px;
}

.btn-primary { background: var(--accent-primary); color: #fff; }
.btn-primary:hover { background: var(--accent-hover); }

.btn-success { background: var(--accent-success); color: #fff; }
.btn-success:hover { background: #059669; }

.btn-danger { background: var(--bg-card); color: var(--accent-danger); border-color: rgba(239,68,68,0.3); }
.btn-danger:hover { background: var(--accent-danger-bg); }

.btn-warning { background: rgba(245, 158, 11, 0.15); color: var(--accent-warning); border-color: rgba(245, 158, 11, 0.4); }
.btn-warning:hover { background: rgba(245, 158, 11, 0.25); }

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
  gap: 16px;
  box-shadow: var(--card-shadow);
}

.gr-form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.gr-form-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
}

.gr-form-help {
  font-size: 11.5px;
  color: var(--text-secondary);
  line-height: 1.45;
}

.gr-input::placeholder {
  color: var(--text-muted);
  opacity: 0.85;
}
/* Tag Pills */
.gr-tag-pill {
  display: inline-flex;
  align-items: center;
  padding: 1px 7px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: var(--bg-card);
  color: var(--accent-primary);
  border: 1px solid var(--border-color);
  line-height: 1.3;
}

/* Universal Sandboxed-Safe In-DOM Modal */
.gr-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.15s ease-out;
}
.gr-modal-box {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 540px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: max-width 0.22s cubic-bezier(0.16, 1, 0.3, 1), max-height 0.22s cubic-bezier(0.16, 1, 0.3, 1), width 0.22s cubic-bezier(0.16, 1, 0.3, 1), height 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  animation: modalSlideUp 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.gr-modal-box.gr-modal-large {
  max-width: 820px;
  max-height: 88vh;
}

/* Full Minus A Little Screen Enlarged View */
.gr-modal-box.enlarged {
  max-width: calc(100vw - 36px) !important;
  width: calc(100vw - 36px) !important;
  max-height: calc(100vh - 36px) !important;
  height: calc(100vh - 36px) !important;
  border-radius: var(--radius-sm);
}

@keyframes modalSlideUp {
  from { transform: translateY(20px) scale(0.97); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.gr-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 18px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
}

.gr-modal-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.gr-modal-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.gr-modal-enlarge-btn {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  padding: 5px 9px;
  border-radius: var(--radius-xs);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  line-height: 1;
}

.gr-modal-enlarge-btn:hover {
  color: var(--text-primary);
  background: var(--bg-card-hover);
  border-color: var(--border-active);
  transform: scale(1.05);
}

.gr-modal-close {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  padding: 5px 9px;
  border-radius: var(--radius-xs);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  line-height: 1;
}

.gr-modal-close:hover {
  color: var(--accent-danger);
  background: var(--bg-card-hover);
  border-color: var(--accent-danger);
}

.gr-modal-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.gr-modal-box.enlarged .gr-modal-body {
  height: 100%;
}

.gr-modal-box.enlarged #gr-modal-input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.gr-modal-message {
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.45;
  margin: 0;
}

.gr-modal-input {
  width: 100%;
  padding: 10px 12px;
  font-size: 13px;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-family: inherit;
  outline: none;
}

.gr-modal-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px var(--accent-hover);
}

.gr-modal-textarea {
  width: 100%;
  min-height: 160px;
  max-height: 60vh;
  padding: 12px 14px;
  font-size: 13.5px;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  resize: vertical;
  outline: none;
  line-height: 1.6;
  transition: border-color 0.15s ease;
}

.gr-modal-textarea:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px var(--accent-hover);
}

.gr-modal-box.enlarged .gr-modal-textarea {
  flex: 1;
  min-height: 380px;
  max-height: none;
  height: 100%;
  font-size: 14.5px;
  line-height: 1.65;
}
.gr-modal-radio-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 260px;
  overflow-y: auto;
}
.gr-modal-radio-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s;
}
.gr-modal-radio-item:hover, .gr-modal-radio-item.selected {
  border-color: var(--accent-primary);
  background: var(--bg-card-hover);
}
.gr-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 18px;
  background: rgba(0, 0, 0, 0.12);
  border-top: 1px solid var(--border-color);
}

.gr-sidebar-btn-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
  width: 100%;
}
.gr-sidebar-btn-row .gr-btn {
  width: 100%;
  min-height: 38px;
  font-size: 11.5px;
  font-weight: 600;
  padding: 8px 6px;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
}
`;

// anp-23-grammar-reviewer/lib/ui/promptSelectorComponent.js
function renderSidebarPanel(session, config, metrics) {
  const currentProvider = session?.provider || config.provider || PROVIDERS.OPENROUTER;
  const currentModel = session?.model || config.customModel || DEFAULT_MODELS[currentProvider] || "";
  const currentGranularity = session?.granularity || "paragraph";
  const currentPreset = session?.promptPresetId || "grammar_spelling";
  const currentItem = session?.items?.[session.currentIndex];
  const currentStatus = currentItem?.status || "pending";
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
  const matchedPreset = PREBUILT_PROMPTS.find((p) => p.id === currentPreset) || PREBUILT_PROMPTS[0];
  const currentPresetDesc = matchedPreset ? matchedPreset.description : "Refines grammar and prose.";
  const pendingCount = metrics.pending ?? 0;
  const reviewBtnLabel = getSidebarReviewBtnText(currentStatus);
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
          <select id="quick-provider-select" class="gr-select" style="width: 100%;" onchange="handleQuickProviderChange(this.value)">
            ${providerOptionsHtml}
          </select>
        </div>

        <div>
          <span class="gr-form-sublabel">Active Model</span>
          <select id="quick-model-select" class="gr-select" style="width: 100%;" onchange="handleQuickModelChange(this.value)">
            ${modelOptionsHtml}
          </select>
        </div>
      </div>
    </div>

    <!-- Section 2: Granularity Mode -->
    <div class="gr-sidebar-section">
      <div class="gr-sidebar-header">
        <span class="gr-section-title">GRANULARITY</span>
      </div>
      <div class="gr-segmented-control" id="granularity-segmented-control">
        <button id="granularity-btn-full" class="gr-segment-btn ${currentGranularity === "full" ? "active" : ""}" onclick="handleGranularityChange('full')">Full Note</button>
        <button id="granularity-btn-paragraph" class="gr-segment-btn ${currentGranularity === "paragraph" ? "active" : ""}" onclick="handleGranularityChange('paragraph')">Paragraph</button>
        <button id="granularity-btn-sentence" class="gr-segment-btn ${currentGranularity === "sentence" ? "active" : ""}" onclick="handleGranularityChange('sentence')">Sentence</button>
      </div>
    </div>

    <!-- Section 3: Prompt Style Presets (Ergonomic Dropdown) -->
    <div class="gr-sidebar-section">
      <div class="gr-sidebar-header">
        <span class="gr-section-title">PROMPT STYLE</span>
        <button class="gr-btn-link" onclick="openCustomPromptModal()">+ Custom</button>
      </div>

      <select id="preset-style-select" class="gr-select" style="width: 100%; font-weight: 500;" onchange="handlePresetSelectChange(this.value)">
        <optgroup label="Correction & Polish">
          <option value="grammar_spelling" ${currentPreset === "grammar_spelling" && !session?.customPrompt ? "selected" : ""}>Fix Grammar & Spelling</option>
          <option value="minimal_changes" ${currentPreset === "minimal_changes" && !session?.customPrompt ? "selected" : ""}>Minimal Changes (Preserve Voice)</option>
          <option value="teacher_editor" ${currentPreset === "teacher_editor" && !session?.customPrompt ? "selected" : ""}>Teacher & Coach (Clarity & Flow)</option>
        </optgroup>
        <optgroup label="Conciseness & Style">
          <option value="concise" ${currentPreset === "concise" && !session?.customPrompt ? "selected" : ""}>Shorten & Make Concise</option>
          <option value="passive_voice" ${currentPreset === "passive_voice" && !session?.customPrompt ? "selected" : ""}>Remove Passive Voice</option>
          <option value="adverbs" ${currentPreset === "adverbs" && !session?.customPrompt ? "selected" : ""}>Omit Unnecessary Adverbs</option>
          <option value="flow_readability" ${currentPreset === "flow_readability" && !session?.customPrompt ? "selected" : ""}>Improve Flow & Rhythm</option>
        </optgroup>
        <optgroup label="Tone & Voice">
          <option value="professional" ${currentPreset === "professional" && !session?.customPrompt ? "selected" : ""}>Professional & Business Tone</option>
          <option value="academic" ${currentPreset === "academic" && !session?.customPrompt ? "selected" : ""}>Academic & Analytical Tone</option>
          <option value="humorous" ${currentPreset === "humorous" && !session?.customPrompt ? "selected" : ""}>Add Subtle Humor & Wit</option>
        </optgroup>
        <optgroup label="Custom Guidance">
          <option value="__custom__" ${session?.customPrompt ? "selected" : ""}>\u2728 Custom Prompt Override...</option>
        </optgroup>
      </select>

      <div id="preset-description-badge" style="font-size: 11px; color: var(--text-secondary); line-height: 1.4; padding: 6px 10px; background: var(--bg-primary); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
        ${session?.customPrompt ? `\u{1F3AF} <em>Custom:</em> "${escapeHtml(session.customPrompt)}"` : `\u{1F4A1} ${escapeHtml(currentPresetDesc)}`}
      </div>

      <div id="custom-prompt-actions" style="display: ${session?.customPrompt ? "flex" : "none"}; gap: 8px; justify-content: flex-end;">
        <button class="gr-btn-link" style="font-size: 11px;" onclick="openCustomPromptModal()">\u270F\uFE0F Edit Prompt</button>
        <button class="gr-btn-link" style="color: var(--accent-danger); font-size: 11px;" onclick="handleClearCustomPrompt()">\u2715 Clear Custom</button>
      </div>
    </div>

    <!-- Section 4: AI Review Actions (Below Prompt Style) -->
    <div class="gr-sidebar-section" id="sidebar-review-btn-container">
      <div class="gr-sidebar-btn-row">
        <button class="gr-btn btn-primary" id="sidebar-run-review-btn" title="Review active chunk" onclick="sendAction('runReview')">
          ${reviewBtnLabel}
        </button>
        <button class="gr-btn btn-secondary" id="sidebar-review-all-btn" title="Review all pending chunks sequentially" onclick="sendAction('reviewAll')">
          \u26A1 All Pending ${pendingCount > 0 ? `(${pendingCount})` : ""}
        </button>
      </div>
    </div>

    <!-- Section 5: Review Progress & Queue -->
    <div class="gr-sidebar-section" id="sidebar-progress-container">
      <div class="gr-sidebar-header" style="margin-bottom: 6px;">
        <span class="gr-section-title">PROGRESS</span>
        <span style="font-size: 12px; font-weight: 700; color: var(--text-primary); font-family: var(--font-mono);">
          ${metrics.reviewed} / ${metrics.total} (${metrics.percentComplete}%)
        </span>
      </div>
      <div class="gr-progress-track">
        <div class="gr-progress-fill" style="width: ${metrics.percentComplete}%;"></div>
      </div>
      <div class="gr-metrics-row" style="margin-top: 6px; display: flex; justify-content: space-between; font-size: 11px;">
        <span style="color: var(--accent-success); font-weight: 600;">\u2713 ${metrics.accepted} Accepted</span>
        <span style="color: var(--accent-warning); font-weight: 600;">\u25CB ${pendingCount} Pending</span>
        <span style="color: var(--accent-danger); font-weight: 600;">\u2717 ${metrics.rejected} Rejected</span>
      </div>
    </div>

    <!-- Section 6: Keyboard Shortcuts Footer -->
    <div class="gr-sidebar-section" style="background: rgba(0, 0, 0, 0.18); padding: 10px 14px;">
      <div style="font-size: 11px; color: var(--text-secondary); display: flex; flex-wrap: wrap; gap: 8px 12px; justify-content: center; align-items: center;">
        <span><kbd>A</kbd> Accept</span>
        <span><kbd>R</kbd> Reject</span>
        <span><kbd>U</kbd> Undo</span>
        <span><kbd>N</kbd>/<kbd>P</kbd> Nav</span>
        <span><kbd>T</kbd> Theme</span>
      </div>
    </div>

  </aside>
  `;
}
function getSidebarReviewBtnText(status) {
  switch (status) {
    case "suggestion_ready":
      return "\u{1F504} Re-Review";
    case "accepted":
      return "\u2713 Re-Review";
    case "rejected":
      return "\u2715 Re-Review";
    case "modified":
      return "\u270E Re-Review";
    case "reviewing":
      return "\u26A1 Reviewing...";
    default:
      return "\u26A1 Review Item";
  }
}

// anp-23-grammar-reviewer/lib/ui/diffViewComponent.js
function renderDiffCard(item, index, total, session = null) {
  if (!item) {
    return `<div class="gr-empty-state">No item selected.</div>`;
  }
  const status = item.status || "pending";
  const badgeClass = `badge-${status}`;
  const statusLabel = getStatusDisplayLabel(status);
  const leftPaneHtml = item.diff?.originalHtml || escapeHtml(item.original);
  const suggestedCleanHtml = item.diff?.suggestedHtml || escapeHtml(item.suggestion || item.original);
  const inlineDiffHtml = item.diff?.inlineHtml || suggestedCleanHtml;
  const changesOnlyHtml = item.diff?.changesHtml || `<div class="gr-no-changes-msg">No changes.</div>`;
  const rawPlainHtml = escapeHtml(item.suggestion || item.original);
  const origWords = (item.original || "").trim().split(/\s+/).filter(Boolean).length;
  const suggWords = (item.suggestion || item.original || "").trim().split(/\s+/).filter(Boolean).length;
  const changeCount = item.diff?.stats?.changeCount ?? 0;
  const jumpOptionsHtml = (session?.items || []).map((it, idx) => {
    const isCur = idx === index;
    const itIcon = getItemStatusIcon(it.status);
    const snippet = (it.original || "").trim().substring(0, 32) || `Item #${idx + 1}`;
    return `<option value="${idx}" ${isCur ? "selected" : ""}>${itIcon} #${idx + 1}: ${escapeHtml(snippet)}...</option>`;
  }).join("");
  const prevPendingIdx = session ? session.getPrevPendingIndex(index) : -1;
  const nextPendingIdx = session ? session.getNextPendingIndex(index) : -1;
  const hasPendingItems = prevPendingIdx !== -1 || nextPendingIdx !== -1;
  const canUndo = session ? session.canUndo(index) : false;
  return `
  <div class="gr-diff-card active" data-index="${index}" data-status="${status}">
    
    <!-- Top Review Navigator Bar -->
    <div class="gr-diff-header">
      <div class="gr-nav-bar-group">
        <div style="display: flex; align-items: center; gap: 8px;">
          <strong style="color: var(--text-primary); font-size: 13.5px;">Item #${index + 1} of ${total}</strong>
          <span style="color: var(--text-secondary); font-size: 12px; text-transform: capitalize;">(${item.type})</span>
        </div>

        <!-- Jump to Item Selector -->
        <div class="gr-jump-selector-container">
          <label for="jump-item-select" class="gr-jump-label">Jump to:</label>
          <select id="jump-item-select" class="gr-jump-select" onchange="sendAction('jumpToItem', parseInt(this.value, 10))">
            ${jumpOptionsHtml}
          </select>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 8px;">
        ${item.diff?.hasChanges ? `<span class="gr-change-count-pill">${changeCount} change${changeCount === 1 ? "" : "s"}</span>` : ""}
        <span class="gr-diff-badge ${badgeClass}">${statusLabel}</span>
      </div>
    </div>

    <!-- Mode Switcher Tabs (Clean Prose, Inline Diff, Side-by-Side, Changes Only) -->
    <div class="gr-diff-mode-bar">
      <div class="gr-diff-view-switcher">
        <button class="gr-view-toggle-btn active" id="btn-view-clean-${index}" onclick="setDiffViewMode(${index}, 'clean')">\u2728 Clean Prose</button>
        <button class="gr-view-toggle-btn" id="btn-view-inline-${index}" onclick="setDiffViewMode(${index}, 'inline')">\u{1F500} Inline Diff</button>
        <button class="gr-view-toggle-btn" id="btn-view-side-${index}" onclick="setDiffViewMode(${index}, 'side')">\u{1F465} Side-by-Side</button>
        <button class="gr-view-toggle-btn" id="btn-view-changes-${index}" onclick="setDiffViewMode(${index}, 'changes')">\u{1F4CB} Changes Only (${changeCount})</button>
      </div>

      <div style="font-size: 11.5px; color: var(--text-muted); font-family: var(--font-mono); display: flex; gap: 12px;">
        <span>Original: <strong>${origWords}</strong>w</span>
        <span>Suggested: <strong>${suggWords}</strong>w</span>
      </div>
    </div>

    <!-- Main Diff Workspace -->
    <div class="gr-diff-body" id="diff-body-${index}">
      
      <!-- Dual Pane Container for Clean, Inline, Side-by-Side -->
      <div class="gr-panes-wrapper" id="panes-wrapper-${index}" style="grid-template-columns: 1fr;">
        <!-- Left Pane: Original Draft (Hidden in single-pane Clean and Inline modes) -->
        <div class="gr-pane" id="original-pane-wrapper-${index}" style="display: none;">
          <div class="gr-pane-title">
            <span>\u{1F4C4} Original Draft</span>
            <span style="font-weight: 500; font-size: 10.5px; font-family: var(--font-mono); color: var(--text-muted);">${origWords} words</span>
          </div>
          <div class="gr-pane-content" id="original-pane-${index}">${leftPaneHtml}</div>
        </div>

        <!-- Right Pane: Clean Prose / AI Suggestion / Unified Inline -->
        <div class="gr-pane" id="suggestion-pane-wrapper-${index}">
          <div class="gr-pane-title">
            <span id="suggestion-pane-label-${index}">\u2728 Clean Polished Prose (Final)</span>
            <span style="font-weight: 500; font-size: 10.5px; font-family: var(--font-mono); color: var(--text-muted);">${suggWords} words</span>
          </div>
          
          <div class="gr-pane-content" id="suggestion-pane-${index}" 
               data-clean="${escapeDataAttr(rawPlainHtml)}"
               data-inline="${escapeDataAttr(inlineDiffHtml)}"
               data-side="${escapeDataAttr(suggestedCleanHtml)}"
               data-changes="${escapeDataAttr(changesOnlyHtml)}"
               data-plain="${escapeDataAttr(rawPlainHtml)}">${rawPlainHtml}</div>
        </div>
      </div>

      <!-- Changes Only Dedicated View (Initially Hidden) -->
      <div class="gr-changes-only-view" id="changes-only-view-${index}" style="display: none;">
        ${changesOnlyHtml}
      </div>

    </div>

    <!-- Teacher's Insight / Explanation Box (Visible when suggestions are available) -->
    ${renderTeacherInsightCard(item, changeCount)}

    <!-- State-Aware Actions Footer -->
    <div class="gr-actions-footer">
      <div class="gr-action-buttons-group">
        ${renderStateAwareActionButtons(item, index, canUndo)}
      </div>

      <!-- Navigation Step Controls with Pending Skip Helpers -->
      <div class="gr-nav-controls-group">
        ${hasPendingItems ? `
          <button class="gr-btn btn-secondary btn-sm" title="Jump to previous unreviewed item" onclick="sendAction('jumpToItem', ${prevPendingIdx})" ${prevPendingIdx === -1 ? "disabled style='opacity: 0.4; cursor: not-allowed;'" : ""}>
            \u23EE Prev Pending
          </button>
        ` : ""}
        
        <button class="gr-btn btn-secondary" onclick="sendAction('prevItem')" ${index === 0 ? "disabled style='opacity: 0.5; cursor: not-allowed;'" : ""}>
          \u2190 Previous
        </button>
        <button class="gr-btn btn-secondary" onclick="sendAction('nextItem')" ${index >= total - 1 ? "disabled style='opacity: 0.5; cursor: not-allowed;'" : ""}>
          Next \u2192
        </button>

        ${hasPendingItems ? `
          <button class="gr-btn btn-secondary btn-sm" title="Jump to next unreviewed item" onclick="sendAction('jumpToItem', ${nextPendingIdx})" ${nextPendingIdx === -1 ? "disabled style='opacity: 0.4; cursor: not-allowed;'" : ""}>
            Next Pending \u23ED
          </button>
        ` : ""}
      </div>
    </div>

  </div>
  `;
}
function getStatusDisplayLabel(status) {
  switch (status) {
    case "accepted":
      return "\u2713 ACCEPTED";
    case "rejected":
      return "\u2717 REJECTED";
    case "modified":
      return "\u270E EDITED";
    case "suggestion_ready":
      return "\u25CF SUGGESTION READY";
    case "reviewing":
      return "\u23F3 REVIEWING...";
    case "error":
      return "\u26A0\uFE0F ERROR";
    default:
      return "\u25CB PENDING";
  }
}
function getItemStatusIcon(status) {
  switch (status) {
    case "accepted":
      return "\u2713";
    case "rejected":
      return "\u2715";
    case "modified":
      return "\u270E";
    case "suggestion_ready":
      return "\u25CF";
    case "error":
      return "\u26A0";
    default:
      return "\u25CB";
  }
}
function renderTeacherInsightCard(item, changeCount) {
  if (!item.diff || !item.diff.hasChanges) {
    return "";
  }
  const category = item.category || "Grammar, Punctuation & Clarity";
  const confidence = item.confidence || "High";
  const explanation = item.explanation || `Elevated readability and flow across ${changeCount} phrase${changeCount === 1 ? "" : "s"} while maintaining the original tone.`;
  return `
    <div class="gr-teacher-insight-box">
      <div class="gr-teacher-header">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 15px;">\u{1F9D1}\u200D\u{1F3EB}</span>
          <strong style="color: var(--text-primary); font-size: 12.5px;">Teacher's Insight</strong>
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
          <span class="gr-category-badge">${escapeHtml(category)}</span>
          <span class="gr-confidence-badge">${escapeHtml(confidence)} Confidence</span>
        </div>
      </div>
      <div class="gr-teacher-body">
        ${escapeHtml(explanation)}
      </div>
    </div>
  `;
}
function renderStateAwareActionButtons(item, index, canUndo) {
  const status = item.status || "pending";
  if (status === "pending") {
    return `
      <button class="gr-btn btn-primary" onclick="sendAction('runReview', ${index})">
        \u26A1 Review This Item
      </button>
      <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">
        \u270F\uFE0F Manual Edit
      </button>
    `;
  }
  if (status === "suggestion_ready") {
    return `
      <button class="gr-btn btn-success" onclick="sendAction('acceptItem', ${index})">
        \u2713 Accept <kbd style="margin-left: 4px; background: rgba(0,0,0,0.2); border: none; color: #fff;">A</kbd>
      </button>
      <button class="gr-btn btn-danger" onclick="sendAction('rejectItem', ${index})">
        \u2717 Reject <kbd style="margin-left: 4px; background: rgba(0,0,0,0.2); border: none; color: inherit;">R</kbd>
      </button>
      <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">
        \u270F\uFE0F Edit
      </button>
      <button class="gr-btn btn-secondary" onclick="openReReviewDialog(${index})">
        \u{1F504} Re-Review
      </button>
    `;
  }
  if (status === "accepted") {
    return `
      <span class="gr-status-pill success">\u2713 Accepted</span>
      ${canUndo ? `
        <button class="gr-btn btn-warning" onclick="sendAction('undoItem', ${index})" title="Revert decision">
          \u21A9 Undo
        </button>
      ` : ""}
      <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">
        \u270F\uFE0F Edit
      </button>
      <button class="gr-btn btn-secondary" onclick="openReReviewDialog(${index})">
        \u{1F504} Re-Review
      </button>
    `;
  }
  if (status === "rejected") {
    return `
      <span class="gr-status-pill danger">\u2717 Kept Original</span>
      ${canUndo ? `
        <button class="gr-btn btn-warning" onclick="sendAction('undoItem', ${index})" title="Restore AI suggestion">
          \u21A9 Undo
        </button>
      ` : ""}
      <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">
        \u270F\uFE0F Edit
      </button>
      <button class="gr-btn btn-secondary" onclick="openReReviewDialog(${index})">
        \u{1F504} Re-Review
      </button>
    `;
  }
  if (status === "modified") {
    return `
      <span class="gr-status-pill modified">\u270E Manually Edited</span>
      ${canUndo ? `
        <button class="gr-btn btn-warning" onclick="sendAction('undoItem', ${index})" title="Discard manual edit">
          \u21A9 Discard Edit
        </button>
      ` : ""}
      <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">
        \u270F\uFE0F Re-Edit
      </button>
      <button class="gr-btn btn-secondary" onclick="openReReviewDialog(${index})">
        \u{1F504} Re-Review
      </button>
    `;
  }
  return `
    <button class="gr-btn btn-primary" onclick="sendAction('runReview', ${index})">
      \u26A0\uFE0F Retry Review
    </button>
    <button class="gr-btn btn-secondary" onclick="promptManualEdit(${index})">
      \u270F\uFE0F Manual Edit
    </button>
  `;
}
function escapeDataAttr(htmlStr) {
  if (!htmlStr) return "";
  return encodeURIComponent(htmlStr);
}

// anp-23-grammar-reviewer/lib/ui/dashboardTemplate.js
function buildDashboardTemplate({ session, config, historyRecords = [], activeTab = "review", activeTheme = "midnight" }) {
  const metrics = session ? session.getMetrics() : { total: 0, reviewed: 0, accepted: 0, rejected: 0, percentComplete: 0, pending: 0 };
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
  
  <!-- Universal Sandboxed-Safe In-DOM Modal Dialog -->
  <div id="gr-modal-backdrop" class="gr-modal-backdrop" style="display: none;">
    <div class="gr-modal-box" id="gr-modal-box">
      <div class="gr-modal-header">
        <h3 id="gr-modal-title" class="gr-modal-title">Dialog</h3>
        <div class="gr-modal-header-actions">
          <button id="gr-modal-btn-enlarge" class="gr-modal-enlarge-btn" onclick="toggleModalEnlarge()" title="Enlarge window / Restore">\u26F6</button>
          <button class="gr-modal-close" onclick="closeAppModal()" title="Close">\u2715</button>
        </div>
      </div>
      <div id="gr-modal-body" class="gr-modal-body">
        <p id="gr-modal-message" class="gr-modal-message"></p>
        <div id="gr-modal-input-container"></div>
      </div>
      <div class="gr-modal-footer">
        <button id="gr-modal-btn-cancel" class="gr-btn btn-secondary" onclick="closeAppModal()">Cancel</button>
        <button id="gr-modal-btn-confirm" class="gr-btn btn-primary">Confirm</button>
      </div>
    </div>
  </div>

  <!-- Global Top Operation Progress Bar & Live Banner -->
  <div id="top-loader" class="gr-top-loader"><div class="gr-top-loader-bar"></div></div>
  <div id="op-banner" class="gr-op-banner">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>\u26A1</span>
      <span id="op-banner-text">AI is reviewing your writing...</span>
    </div>
    <button class="gr-btn btn-danger btn-sm" onclick="cancelActiveOperation()">Stop Review</button>
  </div>

  <div class="gr-container">
    
    <!-- Top Navigation Header -->
    <header class="gr-header">
      <div class="gr-title-group">
        <div class="gr-logo">\u{1F9D1}\u200D\u{1F3EB}</div>
        <div>
          <h1 class="gr-title">Grammar & Style Reviewer</h1>
          <div class="gr-subtitle" style="display: flex; align-items: center; gap: 8px; margin-top: 2px; flex-wrap: wrap;">
            <span>Note: <strong>${escapeHtml(session?.noteTitle || "No Note Selected")}</strong></span>
            ${session?.noteTags && session.noteTags.length > 0 ? `
              <div style="display: inline-flex; gap: 4px; align-items: center; flex-wrap: wrap;">
                ${session.noteTags.map((t) => `<span class="gr-tag-pill">#${escapeHtml(String(t).replace(/^#/, ""))}</span>`).join("")}
              </div>
            ` : ""}
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
    const RE_REVIEW_REASONS = ${JSON.stringify(RE_REVIEW_REASONS)};
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

    // Top Operation Loader state management
    function setTopLoading(isLoading, label = "AI is reviewing your note...") {
      const loader = document.getElementById("top-loader");
      const banner = document.getElementById("op-banner");
      const bannerText = document.getElementById("op-banner-text");

      if (loader) loader.classList.toggle("active", isLoading);
      if (banner) banner.classList.toggle("active", isLoading);
      if (bannerText && label) bannerText.innerText = label;
    }

    function cancelActiveOperation() {
      setTopLoading(false);
      sendAction("cancelReviewAll");
    }

    // ==========================================
    // Universal Sandboxed-Safe In-DOM Modal System
    // (Bypasses iframe sandboxing where window.prompt is ignored)
    // ==========================================
    let activeModalCallback = null;

    function toggleModalEnlarge() {
      const modalBox = document.getElementById("gr-modal-box");
      const btn = document.getElementById("gr-modal-btn-enlarge");
      if (!modalBox) return;
      const isEnlarged = modalBox.classList.toggle("enlarged");
      if (btn) {
        btn.innerHTML = isEnlarged ? "\u{1F5D7}" : "\u26F6";
        btn.title = isEnlarged ? "Restore original size" : "Enlarge window to full screen";
      }
    }

    function closeAppModal() {
      const backdrop = document.getElementById("gr-modal-backdrop");
      const modalBox = document.getElementById("gr-modal-box");
      const btn = document.getElementById("gr-modal-btn-enlarge");
      if (backdrop) backdrop.style.display = "none";
      if (modalBox) {
        modalBox.classList.remove("enlarged");
        modalBox.classList.remove("gr-modal-large");
      }
      if (btn) {
        btn.innerHTML = "\u26F6";
        btn.title = "Enlarge window / Restore";
      }
      activeModalCallback = null;
    }

    function showAppPrompt({ title = "Input", message = "", defaultValue = "", isTextarea = false, isLarge = false, allowEnlarge = true, placeholder = "", onConfirm }) {
      const backdrop = document.getElementById("gr-modal-backdrop");
      const modalBox = document.getElementById("gr-modal-box");
      const titleElem = document.getElementById("gr-modal-title");
      const msgElem = document.getElementById("gr-modal-message");
      const inputContainer = document.getElementById("gr-modal-input-container");
      const confirmBtn = document.getElementById("gr-modal-btn-confirm");
      const enlargeBtn = document.getElementById("gr-modal-btn-enlarge");

      if (!backdrop || !inputContainer) return;

      if (modalBox) {
        modalBox.classList.toggle("gr-modal-large", !!isLarge || !!isTextarea);
      }

      if (enlargeBtn) {
        enlargeBtn.style.display = (allowEnlarge || isTextarea) ? "inline-flex" : "none";
      }

      titleElem.innerText = title;
      msgElem.innerText = message;
      msgElem.style.display = message ? "block" : "none";

      const inputId = "gr-modal-active-input";
      if (isTextarea) {
        inputContainer.innerHTML = '<textarea id="' + inputId + '" class="gr-modal-textarea" placeholder="' + (placeholder || '') + '">' + (defaultValue || '') + '</textarea>';
      } else {
        inputContainer.innerHTML = '<input type="text" id="' + inputId + '" class="gr-modal-input" placeholder="' + (placeholder || '') + '" value="' + (defaultValue || '') + '">';
      }

      confirmBtn.className = "gr-btn btn-primary";
      confirmBtn.innerText = "Confirm";

      activeModalCallback = () => {
        const val = document.getElementById(inputId)?.value;
        closeAppModal();
        if (typeof onConfirm === "function") onConfirm(val);
      };

      confirmBtn.onclick = activeModalCallback;
      backdrop.style.display = "flex";

      setTimeout(() => {
        const el = document.getElementById(inputId);
        if (el) { el.focus(); if (el.select) el.select(); }
      }, 50);
    }

    function showAppConfirm({ title = "Confirm", message = "", confirmLabel = "Confirm", isDanger = false, onConfirm }) {
      const backdrop = document.getElementById("gr-modal-backdrop");
      const titleElem = document.getElementById("gr-modal-title");
      const msgElem = document.getElementById("gr-modal-message");
      const inputContainer = document.getElementById("gr-modal-input-container");
      const confirmBtn = document.getElementById("gr-modal-btn-confirm");

      if (!backdrop) return;

      titleElem.innerText = title;
      msgElem.innerText = message;
      msgElem.style.display = "block";
      if (inputContainer) inputContainer.innerHTML = "";

      confirmBtn.className = isDanger ? "gr-btn btn-danger" : "gr-btn btn-primary";
      confirmBtn.innerText = confirmLabel;

      activeModalCallback = () => {
        closeAppModal();
        if (typeof onConfirm === "function") onConfirm();
      };

      confirmBtn.onclick = activeModalCallback;
      backdrop.style.display = "flex";
    }

    function showAppChoice({ title = "Select Option", message = "", options = [], defaultSelected = "", onConfirm }) {
      const backdrop = document.getElementById("gr-modal-backdrop");
      const titleElem = document.getElementById("gr-modal-title");
      const msgElem = document.getElementById("gr-modal-message");
      const inputContainer = document.getElementById("gr-modal-input-container");
      const confirmBtn = document.getElementById("gr-modal-btn-confirm");

      if (!backdrop || !inputContainer) return;

      titleElem.innerText = title;
      msgElem.innerText = message;
      msgElem.style.display = message ? "block" : "none";

      const selectedVal = defaultSelected || (options[0] && options[0].id) || "";

      const optionsHtml = options.map((opt, i) => {
        const isSel = opt.id === selectedVal || (!selectedVal && i === 0);
        return '<label class="gr-modal-radio-item ' + (isSel ? 'selected' : '') + '" data-opt-id="' + opt.id + '" onclick="selectModalRadioOption(this.dataset.optId)">' +
          '<input type="radio" name="modal_choice" value="' + opt.id + '" ' + (isSel ? 'checked' : '') + ' style="margin-top: 3px;">' +
          '<div>' +
            '<div style="font-weight: 600; font-size: 12.5px; color: var(--text-primary);">' + (opt.label || opt.name) + '</div>' +
            (opt.desc ? '<div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">' + opt.desc + '</div>' : '') +
          '</div>' +
        '</label>';
      }).join("");

      inputContainer.innerHTML = '<div class="gr-modal-radio-list">' + optionsHtml + '</div>' +
        '<div id="modal-custom-subinput-area" style="margin-top: 8px; display: none;">' +
          '<input type="text" id="modal-custom-subinput" class="gr-modal-input" placeholder="Enter custom prompt guidance...">' +
        '</div>';


      confirmBtn.className = "gr-btn btn-primary";
      confirmBtn.innerText = "Select & Apply";

      activeModalCallback = () => {
        const checkedRadio = document.querySelector('input[name="modal_choice"]:checked');
        const choiceId = checkedRadio ? checkedRadio.value : selectedVal;
        const customSub = document.getElementById("modal-custom-subinput")?.value || "";
        closeAppModal();
        if (typeof onConfirm === "function") onConfirm(choiceId, customSub);
      };

      confirmBtn.onclick = activeModalCallback;
      backdrop.style.display = "flex";
    }

    function selectModalRadioOption(val) {
      document.querySelectorAll(".gr-modal-radio-item").forEach(el => {
        const input = el.querySelector("input");
        if (input) {
          const isMatch = input.value === val;
          input.checked = isMatch;
          el.classList.toggle("selected", isMatch);
        }
      });
      const subArea = document.getElementById("modal-custom-subinput-area");
      if (subArea) {
        subArea.style.display = val === "custom" ? "block" : "none";
        if (val === "custom") {
          document.getElementById("modal-custom-subinput")?.focus();
        }
      }
    }

    // Fast In-DOM Left Sidebar Handlers (Zero Screen Flash)
    function handleQuickProviderChange(provider) {
      const modelSelect = document.getElementById("quick-model-select");
      if (modelSelect && MODEL_CATALOG[provider]) {
        const catalog = MODEL_CATALOG[provider] || [];
        const savedModel = (ALL_SAVED_MODELS && ALL_SAVED_MODELS[provider]) || (catalog[0] && catalog[0].value) || "";
        modelSelect.innerHTML = catalog.map(m => {
          return '<option value="' + m.value + '" ' + (m.value === savedModel ? 'selected' : '') + '>' + m.label + '</option>';
        }).join("");
      }
      sendAction("setProvider", provider);
    }

    function handleQuickModelChange(model) {
      const provider = document.getElementById("quick-provider-select")?.value;
      if (provider && ALL_SAVED_MODELS) {
        ALL_SAVED_MODELS[provider] = model;
      }
      sendAction("setModel", model);
    }

    function handleGranularityChange(mode) {
      const activeBtn = document.querySelector(".gr-segment-btn.active");
      const currentMode = activeBtn?.id?.replace("granularity-btn-", "") || "";
      if (currentMode === mode) return;

      document.querySelectorAll(".gr-segmented-control .gr-segment-btn").forEach(btn => {
        btn.classList.toggle("active", btn.id === "granularity-btn-" + mode);
      });

      sendAction("setGranularity", mode);
    }

    const PRESET_DESCRIPTIONS = {
      "grammar_spelling": "Corrects grammatical errors, typos, spelling, and subject-verb agreement while preserving your exact phrasing.",
      "minimal_changes": "Only fixes objective spelling and grammar errors. Keeps your unique phrasing, cadence, and structure intact.",
      "teacher_editor": "Provides educational commentary, highlights specific clarity improvements, and explains why each change elevates the writing.",
      "concise": "Trims bloat, redundant phrases, and wordy constructions while preserving core meaning.",
      "passive_voice": "Converts passive constructions to clear, vigorous active voice.",
      "adverbs": "Removes unnecessary filler adverbs (very, really, definitely) to strengthen verbs.",
      "flow_readability": "Enhances transitions, sentence rhythm, and syntactic variety for smooth reading.",
      "professional": "Polishes language for business emails, executive summaries, and stakeholder memos.",
      "academic": "Refines prose for formal research papers, essays, and critical analysis.",
      "humorous": "Injects subtle wit, clever metaphors, and lively expressions without derailing context."
    };

    function handlePresetSelectChange(val) {
      const descBadge = document.getElementById("preset-description-badge");
      const customActions = document.getElementById("custom-prompt-actions");

      if (val === "__custom__") {
        openCustomPromptModal();
        return;
      }

      if (descBadge) {
        const desc = PRESET_DESCRIPTIONS[val] || "Refines grammar and prose.";
        descBadge.innerHTML = '\u{1F4A1} ' + desc;
      }
      if (customActions) {
        customActions.style.display = "none";
      }

      sendAction("setPreset", val);
    }

    function handleClearCustomPrompt() {
      const select = document.getElementById("preset-style-select");
      const descBadge = document.getElementById("preset-description-badge");
      const customActions = document.getElementById("custom-prompt-actions");

      if (select) select.value = "grammar_spelling";
      if (descBadge) {
        descBadge.innerHTML = '\u{1F4A1} ' + (PRESET_DESCRIPTIONS["grammar_spelling"] || "Refines grammar and prose.");
      }
      if (customActions) {
        customActions.style.display = "none";
      }

      sendAction("clearCustomPrompt");
    }

    // Modal-driven custom prompt editor
    function openCustomPromptModal() {
      const cur = serverSession?.customPrompt || "";
      showAppPrompt({
        title: "Custom AI Prompt / Instruction",
        message: "Provide specific guidance for how the AI should edit or polish your text (click \u26F6 to expand full-screen):",
        defaultValue: cur,
        isTextarea: true,
        isLarge: true,
        allowEnlarge: true,
        placeholder: "e.g. Make concise, preserve bullet points, use active voice, sound friendly...",
        onConfirm: (val) => {
          if (val && val.trim().length > 0) {
            const trimmed = val.trim();
            const select = document.getElementById("preset-style-select");
            const descBadge = document.getElementById("preset-description-badge");
            const customActions = document.getElementById("custom-prompt-actions");

            if (select) select.value = "__custom__";
            if (descBadge) {
              descBadge.innerHTML = '\u{1F3AF} <em>Custom:</em> "' + trimmed.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') + '"';
            }
            if (customActions) {
              customActions.style.display = "flex";
            }
            sendAction("setCustomPrompt", trimmed);
          } else {
            handleClearCustomPrompt();
          }
        }
      });
    }

    // Re-Review with in-DOM reason picker modal
    function openReReviewDialog(index) {
      showAppChoice({
        title: "Re-Review Item #" + (index + 1),
        message: "Why would you like to re-review this section?",
        options: RE_REVIEW_REASONS,
        defaultSelected: "too_aggressive",
        onConfirm: (choiceId, customSub) => {
          const selected = RE_REVIEW_REASONS.find(r => r.id === choiceId) || RE_REVIEW_REASONS[0];
          let instruction = selected.prompt;
          if (choiceId === "custom" && customSub && customSub.trim().length > 0) {
            instruction = customSub.trim();
          }
          setTopLoading(true, "Re-reviewing Item #" + (index + 1) + " (" + selected.label + ")...");
          sendAction("reReviewItem", index, instruction);
        }
      });
    }

    // 4 Diff View Modes (Clean Prose, Inline Diff, Side-by-Side, Changes Only)
    function setDiffViewMode(index, mode) {
      const panesWrapper = document.getElementById("panes-wrapper-" + index);
      const changesView = document.getElementById("changes-only-view-" + index);
      const originalPaneWrapper = document.getElementById("original-pane-wrapper-" + index);
      const suggestionPaneWrapper = document.getElementById("suggestion-pane-wrapper-" + index);
      const suggestionPane = document.getElementById("suggestion-pane-" + index);
      const suggestionLabel = document.getElementById("suggestion-pane-label-" + index);

      ["clean", "inline", "side", "changes"].forEach(m => {
        const btn = document.getElementById("btn-view-" + m + "-" + index);
        if (btn) btn.classList.toggle("active", m === mode);
      });

      if (mode === "changes") {
        if (panesWrapper) panesWrapper.style.display = "none";
        if (changesView) changesView.style.display = "block";
        return;
      }

      if (changesView) changesView.style.display = "none";
      if (!suggestionPane || !panesWrapper) return;

      const cleanHtml = decodeURIComponent(suggestionPane.getAttribute("data-clean") || "");
      const inlineHtml = decodeURIComponent(suggestionPane.getAttribute("data-inline") || "");
      const sideHtml = decodeURIComponent(suggestionPane.getAttribute("data-side") || "");

      if (mode === "clean") {
        // Mode 1: Clean Prose (100% full width, pure finalized prose)
        panesWrapper.style.display = "grid";
        panesWrapper.style.gridTemplateColumns = "1fr";
        if (originalPaneWrapper) originalPaneWrapper.style.display = "none";
        if (suggestionPaneWrapper) suggestionPaneWrapper.style.display = "flex";
        suggestionPane.innerHTML = cleanHtml;
        if (suggestionLabel) suggestionLabel.innerText = "\u2728 Clean Polished Prose (Final)";
      } else if (mode === "inline") {
        // Mode 2: Inline Diff (100% full width, unified track changes with <del> and <ins>)
        panesWrapper.style.display = "grid";
        panesWrapper.style.gridTemplateColumns = "1fr";
        if (originalPaneWrapper) originalPaneWrapper.style.display = "none";
        if (suggestionPaneWrapper) suggestionPaneWrapper.style.display = "flex";
        suggestionPane.innerHTML = inlineHtml;
        if (suggestionLabel) suggestionLabel.innerText = "\u{1F500} Unified Inline Diff (Track Changes)";
      } else if (mode === "side") {
        // Mode 3: Side-by-Side (Dual-pane comparison: Original vs AI Suggestion)
        panesWrapper.style.display = "grid";
        panesWrapper.style.gridTemplateColumns = "1fr 1fr";
        if (originalPaneWrapper) originalPaneWrapper.style.display = "flex";
        if (suggestionPaneWrapper) suggestionPaneWrapper.style.display = "flex";
        suggestionPane.innerHTML = sideHtml;
        if (suggestionLabel) suggestionLabel.innerText = "\u2728 AI Suggestion (Highlighted)";
      }
    }

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

    // Keyboard Shortcuts (A Accept, R Reject, U Undo, N/P Nav, T Theme)
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
      } else if (e.key === "u" || e.key === "U" || (e.ctrlKey && e.key === "z")) {
        const activeCard = document.querySelector(".gr-diff-card.active");
        if (activeCard) {
          const idx = parseInt(activeCard.getAttribute("data-index"), 10);
          if (!isNaN(idx)) sendAction("undoItem", idx);
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
      if (action === "runReview" || action === "reviewAll") {
        setTopLoading(true, action === "reviewAll" ? "Sequential AI Review of all pending chunks in progress..." : "AI Review in progress...");
      }

      if (typeof window.callAmplenotePlugin === "function") {
        try {
          const res = await window.callAmplenotePlugin(action, ...args);
          setTopLoading(false);
          if (res && res.workspaceHtml) {
            const reviewContainer = document.getElementById("tab-view-review");
            if (reviewContainer) {
              const mainCanvas = document.getElementById("main-canvas-container");
              const progressContainer = document.getElementById("sidebar-progress-container");
              const reviewBtnContainer = document.getElementById("sidebar-review-btn-container");
              const curGranularity = document.getElementById("granularity-segmented-control");

              const temp = document.createElement("div");
              temp.innerHTML = res.workspaceHtml;
              const newCanvas = temp.querySelector("#main-canvas-container");
              const newProgress = temp.querySelector("#sidebar-progress-container");
              const newReviewBtn = temp.querySelector("#sidebar-review-btn-container");
              const newGranularity = temp.querySelector("#granularity-segmented-control");

              if (mainCanvas && newCanvas) {
                mainCanvas.innerHTML = newCanvas.innerHTML;
                if (progressContainer && newProgress) {
                  progressContainer.innerHTML = newProgress.innerHTML;
                }
                if (reviewBtnContainer && newReviewBtn) {
                  reviewBtnContainer.innerHTML = newReviewBtn.innerHTML;
                }
                if (curGranularity && newGranularity) {
                  curGranularity.innerHTML = newGranularity.innerHTML;
                }
              } else {
                reviewContainer.innerHTML = res.workspaceHtml;
              }
              initScrollSync();
              syncAuditCheckboxes();
            }
          }
          if (res && res.session) {
            serverSession = res.session;
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(res.session));
            } catch (e) {}
          }
          return res;
        } catch (err) {
          setTopLoading(false);
          console.error("[GrammarReviewer] callAmplenotePlugin failed:", err);
        }
      }
    }

    function confirmResetSession() {
      showAppConfirm({
        title: "Reset Review Session?",
        message: "Are you sure you want to reset the current review session and clear in-progress changes? This will restore the original note baseline.",
        confirmLabel: "Yes, Reset",
        isDanger: true,
        onConfirm: () => {
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch (e) {}
          sendAction("clearSession");
        }
      });
    }

    function promptManualEdit(index) {
      const currentText = document.getElementById("suggestion-pane-" + index)?.innerText || "";
      showAppPrompt({
        title: "Manual Edit (Item #" + (index + 1) + ")",
        message: "Directly edit the rewritten text (click \u26F6 to expand full-screen):",
        defaultValue: currentText,
        isTextarea: true,
        isLarge: true,
        allowEnlarge: true,
        onConfirm: (edited) => {
          if (edited !== null && edited !== undefined) {
            sendAction("manualEditItem", index, edited);
          }
        }
      });
    }

    // Synchronized Scrolling for Dual-Pane Diff View
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

    // Initialize Scroll Sync
    initScrollSync();

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

      showAppConfirm({
        title: "Clear Saved API Key?",
        message: "Delete and clear the saved API key for " + currentProvider + "?",
        confirmLabel: "Delete Key",
        isDanger: true,
        onConfirm: () => {
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
      });
    }


    // Instant Settings Provider Selection
    function selectProviderCard(providerKey) {
      const providerInput = document.getElementById("settings-provider");
      if (providerInput) providerInput.value = providerKey;

      const titleElem = document.getElementById("settings-provider-title");
      if (titleElem) titleElem.innerText = providerKey;

      document.querySelectorAll(".gr-provider-card").forEach(card => {
        card.classList.toggle("active", card.getAttribute("data-key") === providerKey);
      });

      const isOllama = providerKey.includes("Ollama");
      const apiKeyGroup = document.getElementById("settings-api-key-group");
      const baseUrlGroup = document.getElementById("settings-base-url-group");

      if (apiKeyGroup) apiKeyGroup.style.display = isOllama ? "none" : "flex";
      if (baseUrlGroup) baseUrlGroup.style.display = isOllama ? "flex" : "none";

      const keyLabel = document.getElementById("settings-api-key-label");
      const keyLink = document.getElementById("settings-doc-link");
      if (keyLabel) keyLabel.innerText = providerKey + " API Key";
      if (keyLink && PROVIDER_DOCS[providerKey]) keyLink.href = PROVIDER_DOCS[providerKey];

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

      <main class="gr-main-canvas" id="main-canvas-container">
        ${renderDiffCard(currentItem, session.currentIndex, session.items.length, session)}

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; flex-wrap: wrap; gap: 10px;">
          <div style="font-size: 12px; color: var(--text-secondary);">
            \u{1F4A1} <strong>Shortcuts:</strong> <code>A</code> Accept \xB7 <code>R</code> Reject \xB7 <code>U</code> Undo \xB7 <code>N/P</code> Nav \xB7 <code>T</code> Theme
          </div>
          <button class="gr-btn btn-save" onclick="handleSaveButtonClick()">
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

        <div class="gr-form-group" id="settings-api-key-group" style="display: ${activeProvider.includes("Ollama") ? "none" : "flex"}; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <label class="gr-form-label" id="settings-api-key-label" for="settings-api-key">${escapeHtml(activeProvider)} API Key</label>
            <a id="settings-doc-link" href="${docUrl}" target="_blank" style="font-size: 12px; color: var(--accent-primary); text-decoration: none; font-weight: 600;">Get API Key \u2197</a>
          </div>

          <div id="key-preview-banner" style="font-size: 12px; padding: 8px 12px; background: var(--bg-card); border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; width: 100%;">
            ${currentKey && currentKey.trim().length > 0 ? `
              <div><span style="color: var(--accent-success); font-weight: 600;">\u{1F512} Saved Key:</span> <code style="background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022${escapeHtml(currentKey.slice(-4))}</code></div>
            ` : `
              <span style="color: var(--accent-warning); font-weight: 500;">\u26A0\uFE0F No key saved \u2014 enter key below</span>
            `}
          </div>

          <div style="display: flex; gap: 8px; align-items: center; width: 100%;">
            <input type="password" id="settings-api-key" class="gr-input" style="flex: 1; min-width: 0; padding: 8px 12px;" placeholder="Paste new or updated API Key" value="${escapeHtml(currentKey)}">
            <button type="button" id="toggle-key-btn" class="gr-btn btn-secondary" style="padding: 8px 14px; font-size: 12px; white-space: nowrap;" onclick="toggleApiKeyVisibility()">
              \u{1F441}\uFE0F Show
            </button>
            <button type="button" class="gr-btn btn-danger" style="padding: 8px 14px; font-size: 12px; white-space: nowrap;" title="Clear and delete saved key" onclick="clearActiveApiKey()">
              \u{1F5D1}\uFE0F Clear
            </button>
          </div>
          <span class="gr-form-help">Keys are securely stored in your Amplenote plugin settings.</span>
        </div>

        <div id="settings-base-url-group" class="gr-form-group" style="display: ${activeProvider.includes("Ollama") ? "flex" : "none"}; flex-direction: column; gap: 8px;">
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

        <div id="custom-model-input-group" class="gr-form-group" style="display: ${isCustomModelActive ? "flex" : "none"}; flex-direction: column; gap: 8px;">
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
function parseCustomModelSetting(rawSetting) {
  if (!rawSetting || typeof rawSetting !== "string") return {};
  const trimmed = rawSetting.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}
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
      let requiresReRender = false;
      switch (action) {
        case "selectNote":
          await launchReviewer(app, null, true);
          break;
        case "restoreSession": {
          if (args[1]) {
            const restored = ReviewSession.fromJSON(args[1]);
            if (restored) {
              setActiveSession(restored);
            }
          }
          break;
        }
        case "clearSession":
          clearActiveSession();
          requiresReRender = true;
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
              const modelMap = parseCustomModelSetting(app.settings?.["Custom AI Model"]);
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
            const savedModels = parseCustomModelSetting(app.settings?.["Custom AI Model"]);
            const savedModelForNewProvider = savedModels[newProvider] || DEFAULT_MODELS[newProvider] || "";
            if (session) {
              session.provider = newProvider;
              session.model = savedModelForNewProvider;
            }
            if (typeof app.setSetting === "function") {
              await app.setSetting("AI Provider", newProvider);
            }
          }
          requiresReRender = false;
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
              const modelMap = parseCustomModelSetting(app.settings?.["Custom AI Model"]);
              modelMap[curProvider] = newModel.trim();
              await app.setSetting("Custom AI Model", JSON.stringify(modelMap));
            }
          }
          requiresReRender = false;
          break;
        }
        case "setPreset":
          if (session) {
            session.promptPresetId = args[1];
            session.customPrompt = "";
          }
          requiresReRender = false;
          break;
        case "setCustomPrompt":
          if (session) {
            session.customPrompt = args[1];
          }
          requiresReRender = false;
          break;
        case "clearCustomPrompt":
          if (session) {
            session.customPrompt = "";
          }
          requiresReRender = false;
          break;
        case "runReview":
          await handleRunReview(app, typeof args[1] === "number" ? args[1] : -1, args[2] || "");
          break;
        case "reviewAll":
          await handleReviewAll(app);
          break;
        case "cancelReviewAll":
          cancelReviewAll();
          requiresReRender = false;
          break;
        case "jumpToItem": {
          const target = parseInt(args[1], 10);
          if (session && !isNaN(target) && target >= 0 && target < session.items.length) {
            session.currentIndex = target;
          }
          break;
        }
        case "undoItem": {
          const target = typeof args[1] === "number" ? args[1] : session?.currentIndex;
          if (session && target !== void 0) {
            session.undo(target);
          }
          break;
        }
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
          await handleRunReview(app, args[1], args[2] || "");
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
      const activeSession = getActiveSession();
      if (activeSession) {
        const config = getProviderConfig(app);
        const metrics = activeSession.getMetrics();
        const currentItem = activeSession.items[activeSession.currentIndex] || null;
        return {
          success: true,
          session: activeSession.toJSON(),
          workspaceHtml: renderReviewWorkspace(activeSession, config, metrics, currentItem)
        };
      }
      return { success: true };
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