# 🧠 Design Philosophy: Amplenote Grammar & Style Reviewer

## 1. Respect User Intent & Autonomy
AI editing should never be an opaque, destructive auto-replace. The Grammar Reviewer is built on the principle of **User-in-the-Loop Copyediting**:
- Every suggestion is presented as a clean visual diff with flexible viewing modes.
- The user retains total control to `Accept`, `Reject`, `Manually Edit`, `Undo`, or `Re-Review` every individual sentence or paragraph.
- Synchronized proportional scrolling links the original draft and the proposed changes in lockstep.
- No changes are committed to the note without explicit user confirmation.

## 2. Reversible Decisions & Non-Destructive Flow
Reviewing long prose involves fluid reconsiderations:
- **Instant Undo Stack**: Decisions to accept, reject, or modify suggestions must never be irrevocable traps. Users can tap `↩ Undo` or press `U` / `Ctrl+Z` to revert any item to its prior state without losing review momentum.
- **Concurrency & Stale Guards**: Overwriting work should never risk clobbering edits made outside the reviewer. Active notes are verified before final commit.

## 3. Structural & Markdown Fidelity
Grammar enhancement must never break formatting:
- **Paragraph Preservation**: Breaking text down into sentences for granular inspection must never join sentences blindly with newlines or destroy paragraph spacing. The document reconstruction engine faithfully honors parent paragraph bounds and list structures.
- **Intelligent Abbreviation Shielding**: Common abbreviations, titles, academic degrees, and numbers are protected to prevent improper sentence fragmentation.

## 4. Multi-Perspective Diff Inspection
Different edits demand different visual perspectives:
- **`✨ Clean Prose`**: Displays clean, flowing rewritten markdown with only the improved words highlighted in green, letting the user read the result naturally.
- **`🔀 Inline Diff`**: Traditional unified diff with inline `<del>` and `<ins>` highlights.
- **`👥 Side-by-Side`**: Dual synchronized original vs suggestion panes.
- **`📋 Changes Only`**: Filtered card list of distinct replacements, additions, and deletions for rapid audit.

## 5. Teacher & Coach Persona
AI should help users become better writers, not just replace their words:
- **Teacher's Insight**: Explanations accompany recommendations, clarifying why a change elevates readability, corrects grammar, or enhances clarity.
- **Guidance Presets**: Specialized presets like `Minimal Changes (Preserve Voice)` and `Teacher & Coach (Clarity & Flow)` tailor the AI's aggressiveness to the writer's goals.

## 6. Fast Focused Review & Spatial Clarity
Note editing requires generous visual real estate and rapid navigation:
- **Review Navigator**: Direct jumping to any item with live status badges (`✓`, `✕`, `✎`, `●`, `○`), plus skip-to-pending buttons (`⏮ Prev Pending` / `Next Pending ⏭`).
- **Floating Toast Indicator**: Live animated progress bar and floating toast notification banner keep long reviews transparent without shifting or bouncing the document layout.
- **100% Full-Width Workbench**: All controls reside in an ergonomic Left Control Sidebar (AI Engine ➔ Granularity ➔ Prompt Style ➔ Review Action ➔ Progress), allowing diffs to occupy the full viewport width.
- **Zero-Flicker Reactivity**: Tabs, themes, diff modes, provider dropdowns, active model selectors, prompt presets, and review cards update entirely within targeted client DOM elements with **0ms latency**, never forcing full iframe re-renders or white flashes.

## 7. Clean Notebook First (Leverage Native Platform Powers)
Avoid polluting the user's workspace with unnecessary files:
- **Amplenote Native Version History**: Amplenote already creates automatic save points every 10 minutes (`... > View revision history`).
- **Audit Notes Off by Default**: Because version history is natively preserved by Amplenote, generating separate `-reports/-grammar/*` notes is disabled by default to keep the notebook uncluttered, while remaining fully toggleable for power users.

## 8. Multi-AI Freedom & Model Agility
Users should never be locked into a single proprietary API:
- **Free-Tier Friendly**: Out-of-the-box support for OpenRouter's free pool, Gemini Flash, Groq's fast tier, and local offline Ollama models.
- **Frontier Quality**: Direct API key integration for Claude Sonnet 5, DeepSeek V4 Pro, and GPT-5.6.
## 9. Sandboxed-Safe UI Sovereignty
Amplenote embeds run in sandboxed iframes without `allow-modals`:
- **Zero Dead-Click Guarantee**: Standard web APIs like `window.prompt()` and `window.confirm()` fail silently in sandboxed environments. The plugin maintains sovereign in-DOM modal dialogs (`showAppPrompt`, `showAppConfirm`, `showAppChoice`) that work seamlessly across desktop, web, and mobile clients without platform friction.

## 10. Thematic Inclusivity & Ergonomic Controls
Writing and copyediting happen across diverse lighting conditions:
- **Balanced Light & Dark Themes**: Rather than dark-mode-only bias, 12 distinct palettes cater to daylight writing (Clean Daylight, Sepia Parchment, Sakura Blossom, Matcha Latte, Nord Frost) and nocturnal focus (Midnight Slate, Nord Arctic, Glassmorphism, Emerald Forest, Cyber Violet, Espresso Obsidian, Dracula Neo).
- **Categorized Style Guidance**: Grouping editing styles by intent (Correction & Polish, Conciseness & Style, Tone & Voice) lets writers quickly choose their desired editorial voice.

## 11. Integrity-First Asynchronous Resilience & Failure Transparency
Background and multi-item operations must maintain strict integrity:
- **Cooperative Cancellation**: When a user clicks `Stop Review`, running loops must immediately halt further background API requests rather than continuing invisibly in the background.
- **Transparent Failure Handling**: If an API provider rate-limits or throws an error on a specific paragraph, errors are never silently swallowed. The affected chunk is visibly marked with `⚠️ Review Failed` and an explicit `⚠️ Retry Review` action.
- **Destructive Action Protections**: Switching granularity or committing to notes with external modifications must prompt the user with clear decision summaries before discarding or overwriting data.




