# 🧑‍🏫 Amplenote Grammar & Style Reviewer Plugin

A modular, multi-AI grammar and style reviewer for Amplenote. Incrementally inspect, diff, accept/reject, and refine grammar, structure, tone, and conciseness suggestions across your notes with clean side-by-side readable diffs, synchronized dual-pane scrolling, 100% full-width workspace, 12 dynamic themes, zero-flicker client sidebar reactivity, per-provider model memory, and optional audit logging (turned off by default).

---

## ✨ Key Features

- **4 Interactive Diff View Modes**:
  - `✨ Clean Prose`: Displays clean, revised readable text with improved words highlighted in soft emerald green.
  - `🔀 Inline Diff`: Traditional unified diff with inline `<del>` and `<ins>` highlights.
  - `👥 Side-by-Side`: Dual-pane side-by-side comparison with original strikethroughs and suggestion insertions.
  - `📋 Changes Only`: Filtered list of distinct modifications ("old" → "new", additions, removals) with change numbers and type badges.
- **Zero-Flicker Client-Side Left Sidebar & Canvas Reactivity**:
  - Provider changes, model selection, prompt style switching, and custom instructions update instantaneously in the DOM with 0ms latency without triggering full-screen iframe re-renders.
  - Review runs, item navigation, accept/reject, and undo perform targeted in-place DOM updates on the main canvas and progress bar, keeping the left sidebar permanently mounted with zero flicker or scroll jumping.
- **Floating Toast Operation Indicator & 1-Click Cancellation**:
  - Floating fixed top pill (`.gr-op-banner`) and slim progress bar that notify the user during AI reviews without shifting or bouncing the document layout.
  - 1-click **Stop Review** cancellation for `Review All`.
- **Review Navigator & Direct Item Jumping**:
  - Direct Jump-to selector with live status icons (`✓ Accepted`, `✕ Rejected`, `✎ Edited`, `● Ready`, `○ Pending`).
  - `⏮ Prev Pending` and `Next Pending ⏭` buttons to skip already reviewed chunks and jump directly to pending items.
- **Teacher's Insight & Educational Explanations**:
  - In-depth Teacher's Insight card explaining the grammar, clarity, conciseness, and stylistic rationale behind suggestions.
  - Category tags (Grammar, Punctuation, Word Choice, Clarity) and confidence indicators.
- **Reversible Decision Undo**:
  - One-click `↩ Undo` on accepted, rejected, or manually edited items to revert decisions without losing progress.
  - Power shortcut `U` or `Ctrl+Z`.
- **Paragraph-Preserving Sentence Reconstruction**:
  - Safe sentence tokenizer and reconstruction engine that preserves paragraph boundaries and multi-line markdown formatting without inserting stray newlines.
- **Stale Note Overwrite Guard**:
  - Automatically verifies if the note was changed externally during the review session before saving.
- **Optional Audit Notes & Clean Notebook Default**:
  - **Turned OFF by default**: Directly writes accepted rewrites to your source note without creating cluttering report notes.
  - **Amplenote Native Version History**: Integrates with Amplenote's built-in 10-minute save point version history (`... > View revision history`).
  - **Optional Audit Logging**: Users can enable `-reports/-grammar/*` archive notes in Settings or History if dedicated iteration snapshots are desired.
- **100% Full-Width 2-Column Workbench**:
  - **Left Sidebar Inspector (Natural Top-to-Bottom Flow)**: AI engine selector ➔ segmented granularity switcher (`Full Note`, `Paragraph`, `Sentence`) ➔ categorized prompt style presets ➔ review action buttons (`Review Chunk` & `⚡ All Pending`) ➔ live progress tracker ➔ hotkeys.
  - **Expansive Main Canvas**: 100% screen width and viewport height dedicated to side-by-side note diffs and review controls.
- **Synchronized Dual-Pane Scrolling**:
  - Bidirectional proportional scroll synchronization between Original Text and AI Suggestion diff panes for long paragraphs and `Full Note` reviews.
- **Per-Provider Isolated Model Persistence**:
  - Model selections and `Custom Model Override...` entries are saved and remembered **independently per provider** via clean JSON formatting within existing settings, avoiding table schema changes.
- **Multi-AI Provider Engine (August 2026 Lineup)**:
  1. **OpenRouter**: Free & Paid model pool (`openai/gpt-oss-120b:free`, `deepseek/deepseek-v4-flash:free`, `qwen/qwen3.6-27b:free`, Auto Router).
  2. **Google Gemini**: Fast `gemini-3.5-flash-lite`, `gemini-3.7-flash`, and deep `gemini-3.1-pro`.
  3. **Groq**: Ultra-fast 300+ tok/s inference on `openai/gpt-oss-120b` and `qwen/qwen3.6-27b`.
  4. **Mistral AI**: European frontier models (`mistral-small-latest`, `mistral-large-3`).
  5. **DeepSeek Direct**: `deepseek-v4-flash` (built-in thinking) and `deepseek-v4-pro`.
  6. **Ollama / Local AI**: Seamless support for Ollama Cloud (`deepseek-v4-flash:cloud`, `kimi-k3:cloud`, `gpt-oss:120b:cloud`) or local offline models.
  7. **OpenAI**: Flagship `gpt-5.6-luna`, `gpt-5.6-terra`, `gpt-5.6-sol`, and `gpt-5.4`.
  8. **Anthropic Claude**: Gold-standard copyediting via `claude-haiku-4-5-20251001`, `claude-sonnet-5`, and `claude-opus-4-8`.
- **12 Dynamic Aesthetic Themes (Balanced Light & Dark)**:
  - *Light Modes*:
    - ☀️ `Clean Daylight` (Modern crisp daylight palette)
    - 📜 `Sepia Parchment` (Warm editorial paper & terracotta)
    - 🌸 `Sakura Blossom` (Soft rose blush & deep crimson)
    - 🍵 `Matcha Latte` (Soothing green tea slate & forest accents)
    - 🧊 `Nord Frost` (Arctic ice blue & navy slate)
  - *Dark Modes*:
    - 🌌 `Midnight Slate` (Default deep slate with electric blue accents)
    - ❄️ `Nord Arctic` (Crisp arctic slate with ice-blue highlights)
    - ✨ `Glassmorphism` (Modern frosted-glass translucency)
    - 🌲 `Emerald Forest` (Deep botanical green with mint glow)
    - 💜 `Cyber Violet` (Neon violet & indigo velvet)
    - ☕ `Espresso Obsidian` (Warm dark roasted espresso & amber)
    - 🧛 `Dracula Neo` (Vampire dark slate with magenta & cyan)
- **Assigned Note Tags in Header**:
  - Automatically queries and displays note tags as clean pill badges (e.g. `#work #draft`) next to the note title in the header subtitle.
- **Categorized Prompt Style Dropdown**:
  - Replaced cluttered button stacks with a stylish `<select>` dropdown organized into clear categories:
    - *Correction & Polish*: Fix Grammar & Spelling, Minimal Changes, Teacher & Coach.
    - *Conciseness & Style*: Shorten & Make Concise, Remove Passive Voice, Omit Adverbs, Improve Flow & Rhythm.
    - *Tone & Voice*: Professional & Business, Academic & Analytical, Add Subtle Humor.
    - *Custom Guidance*: Custom Prompt Override.
  - Live style guidance description badge directly below the selector.
- **Sandboxed-Safe In-DOM Modal Dialog Architecture**:
  - Bypasses iframe sandboxing restrictions (`Ignored call to 'prompt()'`) with responsive in-DOM modal dialogs for `+ Custom Prompt`, `Manual Edit`, `Re-Review Reasons`, `Reset Session`, and `Delete API Key`.
- **Power Keyboard Shortcuts**:
  - `A`: Accept active suggestion
  - `R`: Reject suggestion / keep original
  - `U`: Undo last decision
  - `N` / `→`: Navigate to Next item
  - `P` / `←`: Navigate to Previous item
  - `T`: Cycle themes on the fly

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
4. **Save & Commit**: Click **💾 Save & Commit Rewrites to Note** to update your source note.

---

## 🛠️ Development & Testing

```bash
# Run complete test suite (79 unit and workflow scenario tests across 11 test suites)
$env:NODE_OPTIONS="--experimental-vm-modules"; npx jest anp-23-grammar-reviewer/test

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