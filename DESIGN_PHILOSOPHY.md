# 🧠 Design Philosophy: Amplenote Grammar & Style Reviewer

## 1. Respect User Intent & Autonomy
AI editing should never be an opaque, destructive auto-replace. The Grammar Reviewer is built on the principle of **User-in-the-Loop Copyediting**:
- Every suggestion is presented as a side-by-side visual diff.
- The user retains total control to `Accept`, `Reject`, `Manually Edit`, or `Re-Review` every individual sentence or paragraph.
- No changes are committed to the note without explicit user confirmation.

## 2. Multi-AI Freedom & Model Agility
Users should never be locked into a single proprietary API. We support 8 leading providers:
- **Free-Tier Friendly**: Out-of-the-box support for OpenRouter's free pool, Gemini Flash, Groq's fast tier, and local offline Ollama models.
- **Frontier Quality**: Direct API key integration for Claude Sonnet 5, DeepSeek V4 Pro, and GPT-5.6.
- **Model Agility**: A unified abstraction layer allows instant switching between providers and models with zero code modifications.

## 3. Zero-Flicker & Instant Reactivity
Amplenote plugins run inside embedded webviews where full-page reloads cause jarring white flashes and GPU rasterization lag:
- **Client-Side Views**: Tab navigation (`Reviewer`, `History`, `Settings`) and theme toggles are executed entirely within the client DOM with **0ms latency**.
- **Themed Design System**: 6 custom-crafted color themes with dynamic, theme-reactive scrollbars and sticky headers provide a desktop-class editing experience.

## 4. Local-First Session Resilience
Editing should survive accidental tab closures, page refreshes, and interruptions:
- Review sessions serialize seamlessly to `localStorage`.
- When reopened, the reviewer restores exact progress, active suggestions, and decision states.

## 5. Non-Destructive Auditability
Writing evolves across iterations:
- Every committed review writes a human-readable revision note (`-reports/-grammar/-changes`) with backlinks to the source note.
- Full JSON audit logs (`-reports/-grammar/-history`) preserve the complete session metrics for historical analysis.
