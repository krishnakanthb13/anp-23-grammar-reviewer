# Release Notes: Amplenote Grammar & Style Reviewer

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
