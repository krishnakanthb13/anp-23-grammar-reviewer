# 🧠 Design Philosophy: Amplenote Grammar & Style Reviewer

## 1. Respect User Intent & Autonomy
AI editing should never be an opaque, destructive auto-replace. The Grammar Reviewer is built on the principle of **User-in-the-Loop Copyediting**:
- Every suggestion is presented as a clean side-by-side visual diff.
- The user retains total control to `Accept`, `Reject`, `Manually Edit`, or `Re-Review` every individual sentence or paragraph.
- Synchronized proportional scrolling links the original draft and the proposed changes in lockstep.
- No changes are committed to the note without explicit user confirmation.

## 2. Clean Prose Over Visual Clutter
Reading rewritten drafts should feel effortless:
- **Clean Prose View**: The AI Suggestion pane displays clean, flowing rewritten markdown with only the improved words highlighted in green, rather than cluttering the prose with interleaved deletions.
- **On-Demand Inline Inspection**: Users can toggle between clean prose and inline `- old` `+ new` diffs with 0ms latency.

## 3. Clean Notebook First (Leverage Native Platform Powers)
Avoid polluting the user's workspace with unnecessary files:
- **Amplenote Native Version History**: Amplenote already creates automatic save points every 10 minutes (`... > View revision history`).
- **Audit Notes Off by Default**: Because version history is natively preserved by Amplenote, generating separate `-reports/-grammar/*` notes is disabled by default to keep the notebook uncluttered, while remaining fully toggleable for power users.

## 4. Frictionless Entry & Seamless Note Memory
Opening a tool should be instantaneous and predictable:
- **Direct 1-Click Fullscreen**: Zero intermediate dialogs or view choices when opening.
- **Smart Note Memory**: The plugin remembers the last note you worked on, eliminating redundant note searches.

## 5. Spatial Clarity via 100% Full-Width Workbench
Note editing requires generous visual canvas real estate:
- **Distraction-Free Diff Canvas**: All configuration controls are neatly arranged in a compact **Left Control Sidebar**, allowing the side-by-side text diffs to occupy 100% of the main editing canvas.
- **Zero-Flicker & Instant Reactivity**: Tab navigation and theme toggles execute entirely within the client DOM with **0ms latency**.

## 6. Multi-AI Freedom & Model Agility
Users should never be locked into a single proprietary API:
- **Free-Tier Friendly**: Out-of-the-box support for OpenRouter's free pool, Gemini Flash, Groq's fast tier, and local offline Ollama models.
- **Frontier Quality**: Direct API key integration for Claude Sonnet 5, DeepSeek V4 Pro, and GPT-5.6.
- **Per-Provider Model Memory (Zero Schema Pollution)**: Custom models and selections are stored independently for each provider via clean JSON formatting within existing settings.
