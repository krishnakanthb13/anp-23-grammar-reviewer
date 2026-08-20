# 🧑‍🏫 Code Documentation: Amplenote Grammar & Style Reviewer

## 1. Architecture Overview

The **Grammar & Style Reviewer** is built with a modular, decoupled architecture adhering to ESM patterns, local session persistence, and zero-latency client-side view management.

```mermaid
graph TD
    Entry[grammar-reviewer.js / onEmbedCall] --> Launcher[launcher.js]
    Entry --> ReviewWorkflow[reviewWorkflow.js]
    Entry --> CommitManager[commitManager.js]
    
    Launcher --> NoteMemory[Last Note Setting & Storage]
    Launcher --> DirectEmbed[app.openEmbed Direct Fullscreen]
    
    ReviewWorkflow --> Session[ReviewSession.js]
    ReviewWorkflow --> PromptPresets[promptPresets.js]
    ReviewWorkflow --> ProviderRegistry[providerRegistry.js]
    
    ProviderRegistry --> PerProviderModelMap[JSON Model Mapping in Custom AI Model]
    ProviderRegistry --> BaseProvider[baseProvider.js]
    BaseProvider --> OpenRouter[openrouterProvider.js]
    BaseProvider --> Gemini[geminiProvider.js]
    BaseProvider --> Groq[groqProvider.js]
    BaseProvider --> Mistral[mistralProvider.js]
    BaseProvider --> DeepSeek[deepseekProvider.js]
    BaseProvider --> Ollama[ollamaProvider.js]
    BaseProvider --> OpenAI[openaiProvider.js]
    BaseProvider --> Anthropic[anthropicProvider.js]
    
    Session --> Tokenizer[tokenizer.js]
    Session --> DiffEngine[diffEngine.js]
    
    Entry --> Dashboard[dashboardTemplate.js]
    Dashboard --> SidebarPanel[promptSelectorComponent.js]
    Dashboard --> DiffCard[diffViewComponent.js]
    Dashboard --> Styles[styles.css.js]
    
    CommitManager --> ReportGen[reportGenerator.js]
    CommitManager --> HistoryMgr[historyManager.js]
```

---

## 2. Core Modules

### `lib/engine/`
- **`reviewSession.js`**: State container managing the active document, tokenized items, current index, accepted/rejected states, metrics, and JSON serialization (`toJSON()` / `fromJSON()`) for `localStorage` persistence. Defaults to `Full Note` mode.
- **`tokenizer.js`**: Breaks Markdown text into inspectable units (`full`, `paragraph`, `sentence`) while preserving empty lines, markdown code fences, headers, and bullet structures.
- **`diffEngine.js`**: Calculates word-level diffs, generating insertion (`<ins>`) and deletion (`<del>`) HTML spans with safety escaping.
- **`promptPresets.js`**: Pre-configured system and user prompts for tone, conciseness, flow, humor, and grammar corrections.

### `lib/features/`
- **`launcher.js`**: Direct 1-click fullscreen launcher that automatically resolves and remembers the `Last Opened Note UUID` across sessions.
- **`reviewWorkflow.js`**: AI completion runner and granularity mode token re-synchronization.
- **`saveHandler.js`**: Applies accepted changes back to the source note and writes dual-stream audit notes.
- **`historyViewer.js`**: Queries and parses historical review logs tagged `-reports/-grammar/-history`.

### `lib/providers/`
- **`baseProvider.js`**: Abstract base class enforcing standard `complete({ prompt, systemPrompt, model })` signature with localhost/CORS error extraction.
- **`providerRegistry.js`**: Factory instantiating adapters for **OpenRouter, Gemini, Groq, Mistral, DeepSeek, Ollama, OpenAI, and Anthropic**. Extracts per-provider keys and model maps (JSON dictionary) without requiring extra setting rows.

### `lib/ui/`
- **`dashboardTemplate.js`**: Renders the complete HTML shell with embedded client-side routing (`Reviewer`, `History Logs`, `Settings`), keyboard shortcuts, dynamic theme switcher, masked API key controls, and synchronized dual-pane scroll locks.
- **`styles.css.js`**: High-performance CSS engine providing a 100% full-width 2-column workbench layout (`.gr-workbench`), 6 complete themes (`midnight`, `nord`, `glass`, `emerald`, `purple`, `light`), fluid scrollbars, sticky navigation headers, and responsive diff panes.
- **`promptSelectorComponent.js`**: Left sidebar control panel rendering active AI engine & model badge/dropdown (filtered to saved providers), granularity segmented pills, prompt presets list, and live progress metrics.
- **`diffViewComponent.js`**: Dual-pane side-by-side original vs AI suggestion diff with synchronized scrolling IDs and inline manual editing.

---

## 3. Communication & State Flow

1. **Host Bridge**: All embed user interactions invoke Amplenote's official `window.callAmplenotePlugin(action, ...args)` bridge.
2. **Per-Provider Model Persistence**:
   - `app.settings["Custom AI Model"]` stores a clean JSON dictionary `{ [provider]: model }` allowing independent model memory per provider without modifying the note settings table schema.
3. **Synchronized Dual-Pane Scrolling**:
   - Left and right diff panes (`#original-pane-X` and `#suggestion-pane-X`) bind proportional `onscroll` handlers with loopback flags (`isSyncingLeft` / `isSyncingRight`) to prevent event loops.
4. **Session Persistence**: Sessions automatically synchronize to client `localStorage` under `ANP_GRAMMAR_REVIEWER_SESSION_STATE` and restore smoothly if the embed is reopened.

---

## 4. Test Suite

- [`test/tokenizer.test.js`](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/amplenote_stg_plugins/anp-23-grammar-reviewer/test/tokenizer.test.js): Tokenization across full, paragraph, and sentence modes.
- [`test/diffEngine.test.js`](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/amplenote_stg_plugins/anp-23-grammar-reviewer/test/diffEngine.test.js): Word-level diff accuracy, whitespace normalization, and HTML escaping.
- [`test/reportGenerator.test.js`](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/amplenote_stg_plugins/anp-23-grammar-reviewer/test/reportGenerator.test.js): Report formatting and session serialization.
- [`test/providers.test.js`](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/amplenote_stg_plugins/anp-23-grammar-reviewer/test/providers.test.js): Mock fetch validation across all 8 provider adapters.
- [`test/liveProviderTester.js`](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/amplenote_stg_plugins/anp-23-grammar-reviewer/test/liveProviderTester.js): Standalone simulated and live provider diagnostic runner.
