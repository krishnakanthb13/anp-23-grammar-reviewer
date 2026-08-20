# 🧑‍🏫 Amplenote Grammar & Style Reviewer Plugin

A modular, multi-AI grammar and style reviewer for Amplenote. Incrementally inspect, diff, accept/reject, and refine grammar, structure, tone, and conciseness suggestions across your notes with full audit logging, synchronized dual-pane scrolling, 100% full-width workspace, 6 dynamic themes, per-provider model memory, and persistent note state.

---

## ✨ Key Features

- **Direct 1-Click Fullscreen Launch & Note Memory**:
  - Immediately opens in full screen with zero intermediate prompts.
  - Automatically remembers and re-opens your **Last Reviewed Note** when launched from the App Menu.
- **100% Full-Width 2-Column Workbench**:
  - **Left Sidebar Inspector**: AI engine selector, model switcher (only saved providers), segmented granularity switcher (`Full Note`, `Paragraph`, `Sentence`), prompt presets, live progress tracker, and hotkeys.
  - **Expansive Main Canvas**: 100% screen width and viewport height dedicated to side-by-side note diffs and review controls.
- **Synchronized Dual-Pane Scrolling**:
  - Bidirectional proportional scroll synchronization between Original Text and AI Suggestion diff panes for long paragraphs and `Full Note` reviews.
- **Per-Provider Isolated Model Persistence**:
  - Model selections and `Custom Model Override...` entries are saved and remembered **independently per provider** via clean JSON formatting within existing settings, avoiding any table schema changes.
- **Multi-AI Provider Engine (August 2026 Lineup)**:
  1. **OpenRouter**: Free & Paid model pool (`openai/gpt-oss-120b:free`, `deepseek/deepseek-v4-flash:free`, `qwen/qwen3.6-27b:free`, Auto Router).
  2. **Google Gemini**: Fast `gemini-3.5-flash-lite`, `gemini-3.7-flash`, and deep `gemini-3.1-pro`.
  3. **Groq**: Ultra-fast 300+ tok/s inference on `openai/gpt-oss-120b` and `qwen/qwen3.6-27b`.
  4. **Mistral AI**: European frontier models (`mistral-small-latest`, `mistral-large-3`).
  5. **DeepSeek Direct**: `deepseek-v4-flash` (built-in thinking) and `deepseek-v4-pro`.
  6. **Ollama / Local AI**: Seamless support for Ollama Cloud (`deepseek-v4-flash:cloud`, `kimi-k3:cloud`, `gpt-oss:120b:cloud`) or local offline models.
  7. **OpenAI**: Flagship `gpt-5.6-luna`, `gpt-5.6-terra`, `gpt-5.6-sol`, and `gpt-5.4`.
  8. **Anthropic Claude**: Gold-standard copyediting via `claude-haiku-4-5-20251001`, `claude-sonnet-5`, and `claude-opus-4-8`.
- **Dynamic Model Selection & Custom Override**:
  - Select from pre-configured provider models or choose `⚙️ Custom Model Override...` to input any custom model ID or tag.
- **6 Dynamic Aesthetic Themes with 1-Click Smooth Cycler**:
  - 🌌 `Midnight Slate` (Default deep slate with electric blue accents)
  - ❄️ `Nord Arctic` (Crisp arctic slate with ice-blue highlights)
  - ✨ `Glassmorphism` (Modern frosted-glass translucency)
  - 🌲 `Emerald Forest` (Deep botanical green with mint glow)
  - 💜 `Cyber Violet` (Neon violet & indigo velvet)
  - ☀️ `Clean Daylight` (High-contrast bright paper theme for daytime editing)
- **Zero-Latency Client-Side Tabs**:
  - Instantaneous switching between `Reviewer`, `History Logs`, and `⚙️ Settings` without iframe tearing or white flash.
- **Masked API Key Security & Management**:
  - Displays masked key indicators with the last 4 digits visible (`🔒 Saved Key: ••••••••••••a8F9`).
  - Interactive `👁️ Show / Hide` toggle to preview raw keys while typing.
  - Dedicated `🗑️ Clear` button to safely wipe or replace saved keys.
- **Power Keyboard Shortcuts**:
  - `A`: Accept active suggestion
  - `R`: Reject suggestion / keep original
  - `N` / `→`: Navigate to Next item
  - `P` / `←`: Navigate to Previous item
  - `T`: Cycle themes on the fly
- **Pre-built Prompt Presets & Custom Instructions**:
  - Fix Grammar & Spelling
  - Shorten & Make Concise
  - Remove Passive Voice
  - Omit Unnecessary Adverbs
  - Improve Flow & Readability
  - Professional & Business Tone
  - Add Subtle Humor & Wit
  - Academic & Analytical Tone
  - *Custom user prompts supported.*
- **Safe Write-back & Dual-Stream Audit Trail**:
  - Primary rewrite with confirmation modal.
  - Human-readable iteration note tagged `-reports/-grammar/-changes` with source backlinks.
  - Machine-readable JSON audit history tagged `-reports/-grammar/-history`, viewable anytime via the plugin's built-in history viewer.

---

## ⚡ Quick Start & Installation

1. **Create a Plugin Note**: Create a new note in Amplenote named `Grammar Reviewer Plugin`.
2. **Setup Metadata Table**: At the top of the note, insert a table:

| Field | Value |
| :--- | :--- |
| `name` | Grammar Reviewer |
| `icon` | `school` |
| `description` | AI-powered grammar and style reviewer. Incrementally diff, review, accept/reject, or refine suggestions with 8 AI providers and audit logging. |
| `instructions` | Select 'Open Dashboard' from Note Options on any note, or choose 'Open Dashboard' from the Apps menu. Configure your preferred AI provider in Plugin Settings (Free tier options available via OpenRouter, Gemini, Groq, Mistral, and Ollama). |
| `setting` | `AI Provider` |
| `setting` | `OpenRouter API Key` |
| `setting` | `Gemini API Key` |
| `setting` | `Groq API Key` |
| `setting` | `Mistral API Key` |
| `setting` | `DeepSeek API Key` |
| `setting` | `OpenAI API Key` |
| `setting` | `Anthropic API Key` |
| `setting` | `Ollama Base URL` |
| `setting` | `Custom AI Model` |
| `setting` | `Custom Base URL` |

> [!NOTE]
> No new settings rows are needed! The plugin automatically manages per-provider model overrides and key preferences within these standard settings.

3. **Insert Code Block**: Below the table, create a Javascript code block (```` ```javascript ````).
4. **Paste Compiled Code**: Copy the bundle from [`build/grammar-reviewer.compiled.js`](https://github.com/krishnakanthb13/amplenote_stg_plugins/blob/main/anp-23-grammar-reviewer/build/grammar-reviewer.compiled.js) and paste it inside the code block.
5. **Activate**: Go to **Account Settings** -> **Plugins**, and select the note you just created.

---

## 📖 User Guide: How to Use

1. **Configure Provider & Keys**:
   - Open the plugin embed and click **⚙️ Settings**.
   - Select your provider card and paste your key ([OpenRouter](https://openrouter.ai/keys), [Google Gemini](https://aistudio.google.com/app/apikey), [Groq](https://console.groq.com/keys), [Mistral](https://console.mistral.ai/api-keys), [DeepSeek](https://platform.deepseek.com), [OpenAI](https://platform.openai.com), [Anthropic](https://console.anthropic.com), or run [Ollama](https://ollama.com) locally).
   - *Note for Ollama users*: Set environment variable `OLLAMA_ORIGINS="*"` before starting Ollama to allow web browser connections.
   - Select your preferred model or choose `⚙️ Custom Model Override...` and click **💾 Save Settings**.
2. **Launch Review**:
   - Open any note and choose **Note Options > Open Dashboard** (opens directly in full screen).
3. **Step Through Suggestions**:
   - `[✓ Accept]` (`A`): Adopts the proposed AI improvement.
   - `[✗ Reject]` (`R`): Keeps your original text.
   - `[✏️ Edit]`: Manually edits the suggestion inline.
   - `[🔄 Re-Review]`: Runs a new prompt on that specific chunk.
4. **Save & Commit**: Click **💾 Save & Commit Rewrites to Note** to update your source note and generate audit logs (`-reports/-grammar/-changes` & `-reports/-grammar/-history`).

---

## 🛠️ Development & Testing

```bash
# Run complete test suite (16 tests across all engines)
$env:NODE_OPTIONS="--experimental-vm-modules"; npx jest anp-23-grammar-reviewer

# Run standalone 8-AI provider diagnostic simulation
node anp-23-grammar-reviewer/test/liveProviderTester.js

# Build production bundle
node esbuild.js 23
```
Output bundle: `anp-23-grammar-reviewer/build/grammar-reviewer.compiled.js`

---

## 📄 License

GNU General Public License v3.0 (GPL-3.0)  
Copyright (C) 2026 Krishna Kanth B