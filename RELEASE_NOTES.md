# Release Notes: Amplenote Grammar & Style Reviewer

## v0.0.4 (2026-08-20)

### ⚡ Performance & Optimization
- **Linear-Time Diff Reconstruction**: Optimized token diff reconstruction in `diffEngine.js` from $O(k^2)$ `unshift` to $O(k)$ `push` + `reverse`, providing immediate performance gains on long document diffs.
- **CRLF Line-Ending Normalization**: Pre-normalized Windows `\r\n` line endings to `\n` in `tokenizer.js` to prevent carriage-return corruption and ensure consistent diffing across platforms.

### 🛡️ Hardening & Error Handling
- **Save Handler Validation**: Added explicit `noteUUID` existence checks and wrapped `app.replaceNoteContent` with descriptive error propagation in `saveHandler.js`.
- **Safe JSON Setting Parser**: Centralized `safeParseJSON` in `providerRegistry.js` and `parseCustomModelSetting` in `grammar-reviewer.js` for safe, fallback-resilient model dictionary parsing.
- **Import Integrity**: Imported `DEFAULT_MODELS` and `DEFAULT_PROVIDER` into `grammar-reviewer.js` to safeguard settings persistence and model fallback branches.

---

## v0.0.3 (2026-08-20)

### 🚀 New Features
- **Clean Side-by-Side Diff Checker**: Redesigned the diff engine to render clean, readable rewritten prose on the right pane with emerald green insertion highlights, and deleted words in soft red on the left pane.
- **Interactive Diff View Switcher**: Added a 0ms client-side segmented toggle (`✨ Clean Prose` vs `🔀 Inline Diff`) directly on the suggestion header.
- **Optional Audit Notes (Turned OFF by Default)**: By default, reviews commit directly to the source note without creating cluttering report notes, since Amplenote natively tracks revision history. An optional toggle in Settings, History, and Save confirmation allows creating `-reports/-grammar/*` notes on demand.
- **Amplenote Native Revision History Legend**: Added an informative card detailing Amplenote's built-in 10-minute save point version history accessible via `... (Note Options) > View revision history`.
- **Human-Readable Note Naming & Formatting**: Newly generated notes now have descriptive names (`Grammar Changes: <Title> (<Date>)` and `Grammar History: <Title> (<Date>)`), formatted summary metadata headers, and itemized breakdown tables.

### ⚡ Improvements
- **Sub-Word & Punctuation Precision**: Fine-grained tokenization in the diff engine preserves punctuation and hyphenated terms without awkward word chopping.
- **1-Click History Refresh**: Added `🔄 Refresh History` button to reload and discover archived review sessions on demand.

### 🐛 Bug Fixes
- **History Record Deduplication**: Prioritized dedicated history notes to eliminate duplicate rows from companion markdown change reports.
- **Isolated Cloud Endpoints**: Ensured custom base URLs are isolated to Ollama, preventing cloud providers (Mistral, Gemini, Groq, etc.) from attempting loopback localhost connections.

---

## v0.0.2 (2026-08-20)

### 🚀 New Features
- **100% Full-Width 2-Column Workbench Layout**: Replaced stacked horizontal top bars with a sleek Left Control Sidebar paired with an expansive, full-viewport note diff canvas.
- **Synchronized Dual-Pane Scrolling**: Bidirectional proportional scroll synchronization between original text and AI suggestion diff panes with jitter and loopback protection.
- **Direct AI Engine & Model Switcher (Reviewer Tab)**: Added quick provider and model dropdowns in the Reviewer sidebar filtered exclusively to providers where an API key or configuration is saved.
- **Per-Provider Model Memory (Zero Table Bloat)**: Saved custom models and selections are stored independently for each provider via clean JSON formatting within existing settings (`Custom AI Model`), avoiding any table schema changes.
- **Dynamic Model Selector & Custom Override Flow**: Dropdown includes `⚙️ Custom Model Override...` that dynamically reveals and focuses the custom model ID text field.
- **Direct 1-Click Fullscreen Launch**: Removed intermediate sidebar/fullscreen selection dialogs for instant 1-click workspace entry.
- **Smart Note Memory**: Remembers and automatically re-opens the last reviewed note when launched from the App Menu or clicked without an active note.
- **Default Full Note Granularity**: Defaults to reviewing the entire note in a unified pass with synchronized dual-pane scrolling.

### ⚡ Improvements
- **Immediate Reviewer Reflection**: Saving a new provider or custom model in Settings instantly updates `session.provider` and `session.model` in the active Reviewer workbench without requiring a note reload.
- **Clean Sidebar Spacing & Multi-line Presets**: Cleanly padded sidebar sections (`14px 16px`) with word-wrapping preset buttons and comfortable vertical spacing.

### 🐛 Bug Fixes
- **Custom Model Duplicate Text**: Fixed duplicate helper text and extra closing `<div>` tag in the custom model override group.
- **Localhost CORS / Loopback Error Guidance**: Added automatic detection and clear troubleshooting instructions for `OLLAMA_ORIGINS="*"` when connecting to local Ollama instances.

---

## v0.0.1 (2026-08-20)

### 🚀 New Features
- **Multi-AI Provider Integration**: Full support for 8 AI providers including OpenRouter, Google Gemini, Groq, Mistral AI, DeepSeek Direct, Ollama (Cloud & Local), OpenAI, and Anthropic Claude.
- **6 Dynamic Aesthetic Themes & 1-Click Cycler**: Built-in switchable themes (`Midnight Slate`, `Nord Arctic`, `Glassmorphism`, `Emerald Forest`, `Cyber Violet`, and `Clean Daylight`) with hotkey `T` toggle and matching theme-reactive scrollbars.
- **In-Embed Note Selection & Reset**: Added `📂 Select Note` / `📂 Change Note` modal picker and `✕ Reset` button to switch or clear active review sessions on the fly.
- **Masked Key Security & Management**: Settings workspace now displays masked key previews (`🔒 Saved Key: ••••••••••••a8F9`), `👁️ Show / Hide` plaintext toggles, and `🗑️ Clear` button to safely manage keys.
- **Power Keyboard Shortcuts**: Rapid copyediting using `A` (Accept), `R` (Reject), `N`/`→` (Next), `P`/`←` (Prev), and `T` (Theme).
- **Dual-Stream Audit Logging**: Automatic generation of human-readable `-reports/-grammar/-changes` notes and machine-readable `-reports/-grammar/-history` audit entries.

### ⚡ Improvements
- **Zero-Latency Client-Side Tabs**: Tabs (`Reviewer`, `History Logs`, `⚙️ Settings`) now mount simultaneously and switch in 0ms with zero host iframe re-renders.
- **Smooth Themed Scrollbars**: Fluid, pill-shaped scrollbars powered by CSS variables (`var(--accent-primary) var(--bg-primary)`) that adapt instantly to every theme.
- **Updated August 2026 Model Catalog**: Defaulted and updated models across all 8 providers (e.g. `gemini-3.5-flash-lite`, `deepseek-v4-flash`, `gpt-oss-120b`, `claude-haiku-4-5-20251001`, `gpt-5.6-luna`, and Ollama `:cloud` tags).
- **Sticky Navigation Header**: Header stays pinned to the top with subtle translucency during long document reviews.

### 🐛 Bug Fixes
- **Host Bridge Dispatching**: Fixed iframe click failures and `TypeError: Cannot read properties of null (reading 'name'/'tags')` by migrating from raw `postMessage` to Amplenote's official `window.callAmplenotePlugin` bridge.
- **Launcher URL Navigation**: Removed extraneous `app.navigate` call that triggered service worker network errors.
- **Settings Layout & Base URL Visibility**: Base URL input is now cleanly hidden for cloud providers and displayed exclusively for local Ollama configurations.

### 📚 Documentation
- Added comprehensive `README.md` with complete installation metadata tables and user guide.
- Added architectural breakdown in `CODE_DOCUMENTATION.md` with Mermaid component diagrams.
- Created `DESIGN_PHILOSOPHY.md` detailing user-in-the-loop and local-first design tenets.
- Added GPL-3.0 `LICENSE` file.

### 🏗️ Infrastructure & Maintenance
- Created 16 unit tests in Jest covering tokenizers, diff engines, report generators, and all 8 provider adapters.
- Added standalone `liveProviderTester.js` diagnostic tool to test simulated and live API endpoints.
- Single-file ESBuild bundling configured at `build/grammar-reviewer.compiled.js`.
