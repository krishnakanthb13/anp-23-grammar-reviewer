# Security Audit — Amplenote Grammar & Style Reviewer

**Date**: 2026-08-20  
**Auditor**: Antigravity Agent  
**Plugin ID**: `anp-23`  
**Version**: `0.0.4`  

---

## Summary

| Severity | Count |
|---|---|
| 🔴 **Critical** | 0 |
| 🟡 **Warning**  | 0 |
| 🟢 **Passed**   | 8 |

---

## Audit Findings & Verification

### 🔴 Critical
*None found.*

### 🟡 Warning
*None found.*

### 🟢 Passed

1. **Zero Hardcoded Secrets**:
   - Comprehensive regex scanning found no hardcoded API keys, tokens, or plaintext credentials.
   - All AI provider credentials are dynamically read from Amplenote plugin settings (`app.settings`) and passed strictly per-request in runtime headers.

2. **No Dynamic Code Execution (`eval` / `new Function`)**:
   - Source code contains zero calls to `eval()`, `new Function()`, `document.write()`, or `setTimeout(string)`.

3. **Injection & XSS Protection**:
   - All text rendered into HTML templates (note titles, diff segments, tokens, presets, and model values) is escaped via [`escapeHtml()`](lib/engine/diffEngine.js) before insertion.
   - Diff attributes in DOM elements (`data-clean`, `data-inline`, `data-plain`) are encoded via `encodeURIComponent` to prevent attribute injection.

4. **Masked Key Display & UI Security**:
   - Settings UI masks sensitive API keys (`••••••••••••••••a8F9`) and defaults to `type="password"`. Plaintext keys are never displayed in logs or reports.

5. **Client-Side Data Isolation**:
   - Session states stored in browser `localStorage` (`ANP_GRAMMAR_REVIEWER_SESSION_STATE`) only contain transient document diff tokens and active settings.

6. **Network & Host Bridge Safety**:
   - All host interactions utilize Amplenote's official, authenticated `window.callAmplenotePlugin` bridge.
   - Base URLs for cloud providers (OpenRouter, Gemini, Groq, Mistral, DeepSeek, OpenAI, Anthropic) are pinned to standard HTTPS endpoints. Local Ollama endpoints are explicitly isolated to user-configured base URLs with CORS warning detection.

7. **Runtime Error Hardening**:
   - All `app.*` API calls and external `fetch` network calls are wrapped in defensive `try/catch` blocks with explicit error messaging and timeout guards via `AbortController`.

8. **Zero Runtime External Dependencies**:
   - The compiled production bundle (`build/grammar-reviewer.compiled.js`) has zero runtime NPM package dependencies, minimizing supply chain exposure.

---

## Reporting Vulnerabilities

If you discover a security vulnerability within this plugin, please submit an issue or security advisory through the repository issue tracker.
