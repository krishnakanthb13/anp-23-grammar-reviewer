- on a final note, free ai providers have a limit, check the web and tell me so that I can update it,
- also tell me how to define those limits and is it possible to track the number of requests sent totally in the settings?
- give me steps or guidance or all data so that I can proceed implementing it.

1. create a amplenote setting to store it as it will be safe
2. inside setting page it is
3. is active provider required? can we just have a section on the top or bottom, and keep it collapsable, let them see it on demand, give some info as well. and yes reset todays, all stats is a nice touch

---

Absolutely. Here is the **full high-level progression from the start of this ANP-23 Grammar Reviewer thread**, including the audit, UX redesign, implementation, hardening, documentation, and the final AI-usage discussion.

## 1. Initial audit & product/UX requirements

We started by auditing the Grammar Reviewer for:

* Bugs and edge cases.
* Data/integrity risks.
* Review-flow problems.
* UX quality and usability.
* Availability/configuration of **Accept, Reject, Edit, Re-Review**.
* Whether each action had a clear objective.
* How a **Teacher / Editor** would ideally guide a user through reviewing text.
* Additional AI-assisted review features that would make the process feel genuinely useful.

The central product goal became:

> Make AI review feel like a guided editorial/teaching workflow, rather than simply "AI rewrites my text."

---

# 2. Paragraph/sentence navigation

Implemented finer-grained review navigation.

### Added:

* Paragraph-preserving sentence reconstruction.
* Sentence-level review without destroying the original paragraph structure.
* Tracking of:

  * `parentParagraphId`
  * `isLastInParagraph`
* Improved reconstruction of reviewed content.
* Preservation of Markdown structures and lists.
* Better sentence splitting.

### Sentence tokenizer improvements

Expanded protection against incorrect sentence splitting for:

* Honorifics.
* Titles.
* Academic degrees.
* Time units.
* Decimal numbers.
* URLs.
* Other abbreviation cases.

This prevented things such as:

```text
Dr. Smith
3.14
example.com
```

from being incorrectly treated as sentence boundaries.

---

# 3. Review Navigator / Jump To

Added a dedicated review-navigation toolbar.

### Added:

* **Jump To** selector.
* Status indicators for review items:

  * ✓ Accepted
  * ✕ Rejected
  * ✎ Edited
  * ● Ready
  * ○ Pending
* **Prev Pending**
* **Next Pending**

This allows users to move directly between items rather than being forced through the document sequentially.

---

# 4. Multiple Diff View modes

The original Clean Prose / Inline Diff experience was expanded into **four modes**:

### 1. Clean Prose

Readable revised text with changes highlighted.

### 2. Inline Diff

GitHub-style in-place comparison using:

* `<del>`
* `<ins>`

### 3. Side-by-Side

Original and revised versions displayed in separate panes.

### 4. Changes Only

Only the actual modifications are shown:

* Replacements.
* Additions.
* Deletions.
* Change counts.

The selected diff mode was also made persistent through:

```text
ANP_GRAMMAR_DIFF_VIEW_MODE
```

---

# 5. Teacher / Editor Insights

Introduced **Teacher's Insight**.

AI was changed to provide structured information such as:

```text
rewritten
category
confidence
explanation
```

Categories include things such as:

* Grammar.
* Punctuation.
* Clarity.
* Word choice.

The explanation gives the user an educational reason for the suggested change rather than simply saying:

> "Here's a better sentence."

AI response parsing was also made resilient to:

* JSON responses.
* Markdown code fences.
* Plain-text fallback.

---

# 6. Review actions were clarified

The review workflow was strengthened around the four major actions:

### Accept

Use the AI recommendation as presented.

### Reject

Keep the original text.

### Edit

Manually modify the AI suggestion.

### Re-Review

Ask the AI to reconsider the item.

The goal was to make each action represent a distinct editorial decision instead of having ambiguous buttons.

---

# 7. Manual-edit workflow was expanded

Manual editing received explicit reversible semantics.

Added:

* **✓ Accept Edit**
* **↩ Discard Edit**
* **✏️ Re-Edit**
* **🔄 Review My Edit**

This makes the user's own modification part of the review lifecycle instead of treating it as an uncontrolled special case.

---

# 8. Re-Review became reason-guided

Instead of simply sending an item back to the AI, Re-Review now allows the user to specify why.

Presets included:

* Too aggressive — preserve voice.
* Grammar only.
* More concise.
* Improve clarity.
* Custom prompt.

This makes Re-Review an actual editorial instruction.

---

# 9. Undo support

Added reversible decision handling.

Implemented:

```text
session.undo(index)
session.canUndo(index)
```

and an:

> ↩ Undo

action.

Keyboard support was also added for Undo.

---

# 10. Review-operation progress/loading feedback

Added the requested **top loading/progress indicator**.

The purpose was to make it obvious that:

* An API request is happening.
* Review All is processing.
* The user should wait.
* The interface hasn't frozen.

Also added:

> **Stop Review**

for Review All.

---

# 11. Real Review All cancellation

Cancellation was upgraded from UI-only behavior to actual workflow cancellation.

Implemented:

* `cancelActiveOperation()`
* Cancellation checks inside the Review All loop.
* Immediate prevention of additional background requests after cancellation.
* Partial-failure tracking/reporting.

So:

```text
Review All
   ↓
Item 1
Item 2
Item 3
   ↓
STOP
   ↓
No more API calls
```

rather than simply hiding the loading indicator while requests continue.

---

# 12. Save integrity / stale-note protection

Added a **stale note overwrite guard**.

Immediately before saving, the plugin re-reads the current note content.

If the note has changed externally during the review:

```text
Review started
      ↓
User edits note elsewhere
      ↓
Review completes
      ↓
Plugin tries to save
      ↓
Detect external modification
      ↓
Protect against accidental overwrite
```

This was one of the most important integrity fixes.

---

# 13. Granularity-switch protection

Changing between review granularities while decisions already exist was made safer.

For example:

```text
Sentence
    ↓
Paragraph
```

when the session already contains:

* Accepted items.
* Rejected items.
* Modified items.

now produces a confirmation rather than silently invalidating existing decisions.

---

# 14. Prompt system improvements

The large collection of preset prompt buttons was redesigned into a dropdown.

Grouped into:

### Correction & Polish

* Fix Grammar & Spelling.
* Minimal Changes / Preserve Voice.
* Teacher & Coach / Clarity & Flow.

### Conciseness & Style

* Shorten & Make Concise.
* Remove Passive Voice.
* Omit Unnecessary Adverbs.
* Improve Flow & Rhythm.

### Tone & Voice

* Professional & Business Tone.
* Academic & Analytical Tone.
* Add Subtle Humor & Wit.

### Custom Guidance

* Custom Prompt Override.

Also added a live description of the selected style.

---

# 15. New review presets

Added:

### Minimal Changes — Preserve Voice

Designed to make the AI less intrusive.

### Teacher & Coach — Clarity & Flow

Designed to make the AI more educational and explanatory.

---

# 16. Sandbox-safe modal system

A major technical issue was discovered:

Amplenote embeds run inside a sandbox where native:

```js
prompt()
confirm()
alert()
```

could be blocked.

This caused dead interactions.

Replaced them with an in-DOM modal architecture:

* `showAppPrompt()`
* `showAppConfirm()`
* `showAppChoice()`

This fixed:

* Custom Prompt.
* Manual Edit.
* Reset Session.
* Delete API Key.
* Re-Review reason selection.

No native prompt/confirm/alert dependency remains in the embed.

---

# 17. Sidebar layout improvements

Fixed button wrapping in the sidebar.

The review controls were changed to a two-column layout with:

* Consistent button heights.
* Minimum touch targets.
* No unwanted text wrapping.
* Better spacing.

---

# 18. Note tags in the header

The active note's assigned tags were retrieved and displayed beside the note title.

For example:

```text
My Article   #writing  #draft
```

This gives the review screen more context about the note being worked on.

---

# 19. Expanded visual themes

Expanded the theme system to **12 curated themes**.

Light themes included:

* Clean Daylight.
* Sepia Parchment.
* Sakura Blossom.
* Matcha Latte.
* Nord Frost.

Dark themes included:

* Midnight Slate.
* Nord Arctic.
* Glassmorphism.
* Emerald Forest.
* Cyber Violet.
* Espresso Obsidian.
* Dracula Neo.

---

# 20. Markdown/code-fence integrity

Identified a potential Markdown corruption problem where user content could itself contain long sequences of backticks.

Added:

```text
getSafeMarkdownFence()
```

which dynamically creates a Markdown code fence longer than any backtick sequence contained in the user content.

This was applied to report/history generation.

---

# 21. Documentation cleanup

Updated:

* `README.md`
* `CODE_DOCUMENTATION.md`
* `DESIGN_PHILOSOPHY.md`
* `RELEASE_NOTES.md`
* `ds.md`

Removed machine-specific/local references such as:

```text
file:///...
C:\Users\...
```

and replaced them with portable relative references.

---

# 22. Comprehensive scenario/integration testing

Added end-to-end scenario coverage for the risky workflows.

Scenarios included:

* Sentence preservation.
* Markdown structure preservation.
* Partial API failure.
* Mid-stream cancellation.
* Stale-note overwrite protection.
* Granularity switching.
* Manual-edit workflow.

This expanded the test coverage from the earlier **66 tests** to:

> **78/78 passing**

across:

> **11/11 test suites**

---

# 23. Static verification

Ran ESLint against the project.

Result:

> **0 errors**
>
> **0 warnings**

---

# 24. Production bundle verification

Ran:

```text
node esbuild.js 23
```

and successfully generated:

```text
anp-23-grammar-reviewer/build/grammar-reviewer.compiled.js
```

So the source implementation was also verified through the actual production bundling process.

---

# 25. Final AI-provider/quota discussion

After the main implementation was complete, we looked at the operational issue of **free AI provider limits**.

The main conclusions were:

* OpenRouter's free-plan quota should be represented as a configurable daily limit.
* Groq limits are model/account dependent.
* Gemini limits are model/project/tier dependent.
* Mistral limits are dynamic.
* Cohere has trial/free limits that should be configurable.
* We should **not hard-code uncertain provider limits** as permanent truths.

---

# 26. AI Usage & Limits feature was scoped

We then deliberately simplified the original idea.

Instead of building a complicated usage system with:

* 1,000-event request ledgers.
* Token accounting.
* Audio dimensions.
* Complex quota APIs.
* Provider-specific rate-limit parsers.

we settled on a lightweight system.

### Store:

```js
{
  date: "2026-08-20",

  today: {
    success: 14,
    failed: 2
  },

  lifetime: {
    success: 128,
    failed: 4
  },

  providers: {
    OpenRouter: {
      today: { success: 12, failed: 1 },
      lifetime: { success: 100, failed: 3 }
    }
  }
}
```

---

# 27. Amplenote setting for usage data

You decided that usage should be stored as an **Amplenote setting**, rather than introducing another storage mechanism.

This gives the plugin persistent usage data without creating another complicated persistence layer.

---

# 28. Provider-wise usage tracking

We decided to track usage separately for each provider.

So the user can eventually see:

```text
OpenRouter     12 ✓   1 ✕
Groq            2 ✓   0 ✕
Gemini          5 ✓   0 ✕
```

while also having:

```text
Today
14 requests

Lifetime
128 requests
```

---

# 29. Usage UI location was finalized

You decided:

> **Inside the existing Settings page.**

No new:

```text
AI Usage
```

tab.

No new navigation.

---

# 30. Usage section design was finalized

You then made an important UX refinement:

### Don't show "Active Provider"

There is no need for:

```text
Active: OpenRouter
```

because the usage system is provider-wide.

Instead, use a collapsible:

```text
▶ 📊 AI Usage & Limits
   14 today · 128 lifetime
```

When expanded:

```text
▼ 📊 AI Usage & Limits
```

with:

* Today's requests.
* Success/failure counts.
* Lifetime requests.
* Provider breakdown.
* Configured daily limit.
* Usage progress.
* Reset Today's Count.
* Reset All Statistics.
* Brief explanatory information.

---

# 31. Daily limit behavior was finalized

Provider limits should be:

* Configurable.
* Used for warnings.
* **Not hard-blocking by default.**

Example:

```text
14 / 50
██████░░░░░░░░
```

and warnings at higher percentages.

The user should still be able to make a request even when the locally configured limit is reached because the plugin cannot necessarily know the provider's true account-wide usage.

---

# 32. Request-count semantics were clarified

A request means:

> **An actual AI API attempt.**

Therefore:

```text
Review Item       → +1
Review All × 10   → +10
Re-Review         → +1
Review My Edit    → +1
429               → +1 request + failed
500               → +1 request + failed
```

But:

```text
Accept
Reject
Edit
Undo
Diff switching
Navigation
```

do **not** count as API requests.

---

# 33. Final architecture direction

The final lightweight architecture became:

```text
constants.js
    ↓
DEFAULT_PROVIDER_LIMITS

usageTracker.js
    ↓
persistent usage + rollover + reset

reviewWorkflow.js
    ↓
record API attempts/results

dashboardTemplate.js
    ↓
collapsible AI Usage & Limits
```

No over-engineered quota subsystem.

---

# 34. Overall final state

So, from the beginning, ANP-23 evolved through roughly this progression:

```text
AUDIT
  ↓
Find bugs / integrity issues
  ↓
Improve review navigation
  ↓
Improve diff presentation
  ↓
Add Teacher/Editor guidance
  ↓
Clarify Accept / Reject / Edit / Re-Review
  ↓
Make Re-Review reason-driven
  ↓
Add Undo
  ↓
Add progress/loading feedback
  ↓
Make cancellation real
  ↓
Protect saves from stale notes
  ↓
Protect granularity changes
  ↓
Fix sandbox modal problems
  ↓
Improve prompts / presets
  ↓
Improve themes / visual UX
  ↓
Preserve Markdown safely
  ↓
Add integration/scenario tests
  ↓
Clean documentation
  ↓
Run ESLint
  ↓
Run 78-test suite
  ↓
Build production bundle
  ↓
Audit AI-provider limits
  ↓
Design lightweight AI Usage & Limits
  ↓
Provider-wise tracking
  ↓
Amplenote setting persistence
  ↓
Collapsible Settings UI
  ↓
Daily/lifetime statistics
  ↓
Reset controls
  ↓
Configurable soft limits
```

### Final verification reached before the usage work

**11/11 suites passing**
**78/78 tests passing**
**0 ESLint errors/warnings**
**Production bundle successfully generated**

So the main ANP-23 audit/UX hardening phase was effectively completed, and the **AI Usage & Limits** work was the final operational enhancement we subsequently scoped.
