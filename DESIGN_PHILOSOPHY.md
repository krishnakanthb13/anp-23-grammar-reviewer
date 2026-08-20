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
- **Top Operation Indicator**: Live animated progress bar and cancellation banner keep long reviews transparent.
- **100% Full-Width Workbench**: All controls reside in a compact Left Control Sidebar, allowing diffs to occupy the full viewport width.
- **Zero-Flicker Reactivity**: Tabs, themes, and diff modes switch entirely within the client DOM with **0ms latency**.

## 7. Clean Notebook First (Leverage Native Platform Powers)
Avoid polluting the user's workspace with unnecessary files:
- **Amplenote Native Version History**: Amplenote already creates automatic save points every 10 minutes (`... > View revision history`).
- **Audit Notes Off by Default**: Because version history is natively preserved by Amplenote, generating separate `-reports/-grammar/*` notes is disabled by default to keep the notebook uncluttered, while remaining fully toggleable for power users.

## 8. Multi-AI Freedom & Model Agility
Users should never be locked into a single proprietary API:
- **Free-Tier Friendly**: Out-of-the-box support for OpenRouter's free pool, Gemini Flash, Groq's fast tier, and local offline Ollama models.
- **Frontier Quality**: Direct API key integration for Claude Sonnet 5, DeepSeek V4 Pro, and GPT-5.6.
- **Per-Provider Model Memory (Zero Schema Pollution)**: Custom models and selections are stored independently for each provider via clean JSON formatting within existing settings.

