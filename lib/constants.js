/**
 * Constants and Configuration for Amplenote Grammar Reviewer Plugin
 */

export const PLUGIN_NAME = "Grammar Reviewer";
export const PLUGIN_VERSION = "1.0.0";

// Amplenote Note Tags for History and Changes
export const TAG_GRAMMAR_CHANGES = "-reports/-grammar/-changes";
export const TAG_GRAMMAR_HISTORY = "-reports/-grammar/-history";

// Review Granularity Modes
export const GRANULARITY_MODES = {
  FULL: "full",
  PARAGRAPH: "paragraph",
  SENTENCE: "sentence"
};

// Supported AI Providers
export const PROVIDERS = {
  OPENROUTER: "OpenRouter",
  GEMINI: "Gemini",
  GROQ: "Groq",
  MISTRAL: "Mistral",
  DEEPSEEK: "DeepSeek",
  OLLAMA: "Ollama (Local)",
  OPENAI: "OpenAI",
  ANTHROPIC: "Anthropic"
};

export const DEFAULT_PROVIDER = PROVIDERS.OPENROUTER;

// Default Models per Provider (Optimized for Grammar, Polish & Structure)
export const DEFAULT_MODELS = {
  [PROVIDERS.OPENROUTER]: "openai/gpt-oss-120b:free",
  [PROVIDERS.GEMINI]: "gemini-3.5-flash-lite",
  [PROVIDERS.GROQ]: "openai/gpt-oss-120b",
  [PROVIDERS.MISTRAL]: "mistral-small-latest",
  [PROVIDERS.DEEPSEEK]: "deepseek-v4-flash",
  [PROVIDERS.OLLAMA]: "deepseek-v4-flash:cloud",
  [PROVIDERS.OPENAI]: "gpt-5.6-luna",
  [PROVIDERS.ANTHROPIC]: "claude-haiku-4-5-20251001"
};

// Supported Themes (Diverse Light & Dark Palettes)
export const THEMES = [
  { id: "midnight", name: "Midnight Slate", icon: "🌌", type: "dark" },
  { id: "nord", name: "Nord Arctic", icon: "❄️", type: "dark" },
  { id: "glass", name: "Glassmorphism", icon: "✨", type: "dark" },
  { id: "emerald", name: "Emerald Forest", icon: "🌲", type: "dark" },
  { id: "purple", name: "Cyber Violet", icon: "💜", type: "dark" },
  { id: "espresso", name: "Espresso Obsidian", icon: "☕", type: "dark" },
  { id: "dracula", name: "Dracula Neo", icon: "🧛", type: "dark" },
  { id: "light", name: "Clean Daylight", icon: "☀️", type: "light" },
  { id: "sepia", name: "Sepia Parchment", icon: "📜", type: "light" },
  { id: "sakura", name: "Sakura Blossom", icon: "🌸", type: "light" },
  { id: "matcha", name: "Matcha Latte", icon: "🍵", type: "light" },
  { id: "nord-light", name: "Nord Frost", icon: "🧊", type: "light" }
];

// Available Model Catalog per Provider
export const MODEL_CATALOG = {
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

// API Documentation / Sign-up URLs
export const PROVIDER_DOCS = {
  [PROVIDERS.OPENROUTER]: "https://openrouter.ai/keys",
  [PROVIDERS.GEMINI]: "https://aistudio.google.com/app/apikey",
  [PROVIDERS.GROQ]: "https://console.groq.com/keys",
  [PROVIDERS.MISTRAL]: "https://console.mistral.ai/api-keys",
  [PROVIDERS.DEEPSEEK]: "https://platform.deepseek.com/api_keys",
  [PROVIDERS.OLLAMA]: "https://ollama.com",
  [PROVIDERS.OPENAI]: "https://platform.openai.com/api-keys",
  [PROVIDERS.ANTHROPIC]: "https://console.anthropic.com/settings/keys"
};

// Standard Pre-built Prompts
export const PREBUILT_PROMPTS = [
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

// Re-Review Reasons
export const RE_REVIEW_REASONS = [
  { id: "preserve_voice", label: "Too aggressive (Preserve my voice)", prompt: "The previous suggestion changed too much. Please make minimal changes, strictly preserving my original voice and phrasing while fixing only clear errors." },
  { id: "grammar_only", label: "Fix grammar & spelling only", prompt: "Fix strictly spelling, punctuation, and grammar mistakes only. Do not make stylistic or vocabulary changes." },
  { id: "more_concise", label: "Make more concise & punchy", prompt: "Make this punchier and more concise. Trim unnecessary words and filler phrases." },
  { id: "improve_clarity", label: "Improve clarity & transitions", prompt: "Focus on making the flow between ideas natural and clear. Enhance sentence transitions." },
  { id: "custom", label: "Custom instruction...", prompt: "" }
];

