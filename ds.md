- Audit the code for bugs, edge cases, and integrity issues. And suggest quality and solid improvements. 
- In paragraph and sentence, ability to move forward or select a specific para or sentence at will. 
- Clean Prose, Inline Diff - add more styles of showing the diff. How GitHub shows, or other Text diff show. 
- When I click on Review Item, or All, make sure to show some kind of progress bar - like the latest a small bar on the top. 
- So that the users are aware something is happening, an API call is happening or some things happening, and I should wait. 
- Searching for similar UI and UX which will bring drastic change to the user in their experience when using the interface. 
- Also check if Accept, Reject, Edit, Re-Review are available only when they should. Check if they are configured properly. 
- Each option of Accept, Reject, Edit, Re-Review should have a clear objective. 
- Just think in a Teacher or Editor prospective, how they want to show or suggest or recommend they review to the User. 
- What additional features, or existing features aligned to a particular flow to help the user review their text using AI. 
- They should get the best out it, and feel very beneficial about the whole process that they took or underwent using this plugin.

---

I audited the uploaded `grammar-reviewer.compiled.js` specifically against your requested workflow: **AI review → understand suggestion → inspect diff → decide → edit/re-review → move through the document → commit**.

There is already a solid foundation here, but I would **not consider the current UX/state model finished**. The biggest opportunity is to turn it from a collection of review controls into a **guided editor/teacher-style review experience**.

## 1. Overall audit verdict

### Current strengths

* Three review granularities already exist: **Full Note / Paragraph / Sentence**. 
* There is already a review-progress metric and visual bar. 
* Dual-pane original vs AI suggestion is a good foundation. 
* Clean Prose / Inline Diff already exists. 
* Accept / Reject / Edit / Re-Review are all present. 
* Previous / Next navigation exists. 
* Keyboard navigation and shortcuts are already implemented. 
* Review All correctly processes only pending inspectable items sequentially. 
* Provider calls have timeout/error handling and explicit handling for authentication, rate limits and network errors. 
* The compiled JavaScript passes a syntax check.

So this isn't a case of "the plugin needs to be rebuilt." **The underlying architecture is usable.**

---

# 2. Critical integrity issue: Sentence mode can alter document structure

This is the biggest issue I found.

The tokenizer correctly splits sentences into individual items. 

But `getReconstructedContent()` reconstructs the document by simply joining items with `"\n"`. Your session model therefore treats each sentence as if it were a standalone line.

That means something like:

```text
This is sentence one. This is sentence two. This is sentence three.
```

can become:

```text
This is sentence one.
This is sentence two.
This is sentence three.
```

after reconstruction.

That is **not a safe review operation**.

It can also cause paragraph structure to change.

### Recommendation: do not reconstruct from rendered chunks

Each item needs positional information:

```text
startOffset
endOffset
parentParagraphId
parentSentenceId
originalRange
```

Then the final document should be reconstructed by **replacing the exact source ranges**, rather than joining review items.

Conceptually:

```text
Original document
      ↓
Tokenize + preserve source offsets
      ↓
Review individual ranges
      ↓
Accept/reject/edit individual ranges
      ↓
Patch original document by offsets
      ↓
Final document
```

This makes sentence review safe.

### Priority: 🔴 Critical

This is more important than any UI improvement because it affects **document integrity**.

---

# 3. Paragraph and sentence navigation needs a much better model

You already have Previous / Next and `currentIndex`. 

But that's still basically:

> "Move one array item forward/back."

What you asked for is much better:

> **"I want to move through the document deliberately, or jump directly to Paragraph 17 / Sentence 42."**

I strongly recommend adding a **Review Navigator**.

### Example

At the top of the review canvas:

```text
PARAGRAPH REVIEW

← Previous     Paragraph 7 of 24     Next →
                 Jump to ▾
```

Clicking `Jump to`:

```text
Paragraphs
────────────────
✓ Paragraph 1
✓ Paragraph 2
✓ Paragraph 3
• Paragraph 4   ← current
✓ Paragraph 5
○ Paragraph 6   ← pending
○ Paragraph 7
...
```

For sentence mode:

```text
Sentence 18 of 76
```

and a searchable selector:

```text
Jump to sentence...
```

### Even better

Use status indicators:

```text
✓ Accepted
✕ Rejected
✎ Edited
● AI suggestion ready
○ Not reviewed
⚠ Review failed
```

This makes the navigator itself a **review map**.

---

# 4. Add "Previous / Next pending", not just Previous / Next

This would be a major usability improvement.

Current navigation simply increments/decrements the array index. 

Instead provide:

* Previous
* Next
* Previous Pending
* Next Pending
* Jump to...
* First Unreviewed
* Last Unreviewed

For example:

```text
← Previous       Next →
   ↳ Pending     Pending ↲
```

A teacher/editor generally doesn't want to repeatedly step through already-finished material.

---

# 5. Accept / Reject / Edit / Re-Review are currently too permissive

This is exactly one of the areas you asked me to check.

Currently all four buttons are rendered regardless of item state. 

That should change.

## Recommended state machine

### State 1 — Pending

No AI suggestion yet.

Available:

```text
⚡ Review
```

Not available:

```text
Accept
Reject
Edit
Re-Review
```

---

### State 2 — Suggestion ready

AI has returned a suggestion.

Available:

```text
✓ Accept
✕ Reject
✎ Edit
↻ Re-Review
```

---

### State 3 — Accepted

Available:

```text
↩ Undo
✎ Edit
↻ Re-Review
```

Maybe:

```text
✓ Accepted
```

as a disabled/status indicator.

**Do not show Accept again.**

---

### State 4 — Rejected

Available:

```text
↻ Re-Review
✎ Edit
↶ Restore Suggestion
```

No reason to show:

```text
Reject
```

again.

---

### State 5 — Manually Edited

Available:

```text
✓ Accept Edit
✕ Discard Edit
↻ Re-Review
```

This distinction is important.

Right now `manualEdit()` immediately marks the item as `"modified"`. 

I'd separate:

```text
editing
edited
accepted
rejected
```

rather than treating the act of editing as the final decision.

---

# 6. Give every action one crystal-clear meaning

This is particularly important for the "teacher/editor" experience.

### Accept

> **Use the AI suggestion exactly as shown.**

### Reject

> **Keep my original wording.**

### Edit

> **I want to make my own version.**

### Re-Review

> **The current suggestion isn't right; ask AI to reconsider the original text.**

But I'd make Re-Review even more powerful.

Instead of silently calling the same prompt again, show:

```text
Why are you re-reviewing?

○ AI suggestion is incorrect
○ Too much rewriting
○ Too little rewriting
○ Wrong tone
○ Preserve my voice
○ Try a different approach
○ Custom instruction
```

Then the second AI pass becomes meaningfully different.

---

# 7. "Review Item" should become state-aware

Currently the sidebar always presents:

> ⚡ Review Item

and:

> ⚡ All 

I'd make it dynamic.

### Pending

```text
⚡ Review This
```

### Already reviewed

```text
↻ Re-Review
```

### No changes necessary

```text
✓ No Changes Needed
```

### API failure

```text
⚠ Retry Review
```

That immediately communicates what the system expects the user to do.

---

# 8. Your current progress bar is not the progress indicator you actually need

This is an important distinction.

You already have:

```text
PROGRESS
12 / 40 (30%)
██████░░░░░░
```

But that's **review completion progress**, not **operation progress**. 

When the user clicks Review Item, they need something like:

```text
────────────────────────────────────────
✨ Reviewing paragraph 12 of 40...
   Asking AI to analyze your writing
────────────────────────────────────────
```

And for All:

```text
────────────────────────────────────────
✨ Reviewing 12 / 40
   Paragraph 12 of 40
   AI analysis in progress...
██████████░░░░░░░░░░░░ 30%
────────────────────────────────────────
```

### This is currently missing at the architecture level.

`handleReviewAll()` waits for each API call and only eventually returns. 

The UI therefore can't naturally communicate:

> "I'm currently doing something."

## Recommended implementation

Add transient session state:

```js
session.operation = {
  active: true,
  type: "review-all",
  current: 12,
  total: 40,
  label: "Reviewing paragraph 12 of 40",
  startedAt: Date.now()
}
```

Then:

```text
Top thin progress bar
```

should be visible while the operation runs.

### Very important UX distinction

Use **two progress systems**:

**Document progress**

```text
Reviewed: 12 / 40
```

**Operation progress**

```text
Reviewing paragraph 12 / 40...
```

They represent completely different things.

---

# 9. Review All needs live progress updates

This is one of the highest-value improvements.

Instead of:

```text
Click All
↓
wait
↓
everything suddenly appears
```

do:

```text
Click All

↓
Reviewing 1/24
↓
Reviewing 2/24
↓
Reviewing 3/24
...
↓
24/24
```

Ideally each completed item changes in the navigator:

```text
✓ 1
✓ 2
✓ 3
● 4  ← currently processing
○ 5
○ 6
```

That would dramatically improve perceived reliability.

---

# 10. Add a global top loading bar

Your idea here is excellent.

I'd make it extremely subtle.

Something like:

```text
┌───────────────────────────────────────────────┐
│ Grammar Reviewer                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ ← operation bar
└───────────────────────────────────────────────┘
```

For indeterminate operations:

```text
━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

For Review All:

```text
████████████████░░░░░░░░░░  12 / 20
```

And underneath:

> Reviewing paragraph 12 · GPT-5.6 Luna · ~3s

The user should **never wonder whether the plugin is frozen**.

---

# 11. Diff system: good foundation, but it should become much richer

You currently have only:

* Clean Prose
* Inline Diff

and both are generated from the same token diff. 

I'd expand this to **four modes**.

## Mode 1 — Clean Prose

```text
The revised paragraph appears naturally.
```

Best for:

> "How does the finished writing feel?"

---

## Mode 2 — Inline Diff

```text
The <del>old</del> <ins>new</ins> sentence...
```

Best for:

> "What exactly changed?"

---

## Mode 3 — Side-by-Side Diff

GitHub/code-review style:

```text
ORIGINAL                         SUGGESTED
────────────────────            ────────────────────
The project was                 The project was
very successful.                highly successful.
      ──────                        +++++++++
```

This is probably the most useful mode for serious editing.

---

## Mode 4 — Changes Only

Show only actual modifications:

```text
Removed
────────
very

Added
────────
highly
```

or:

```text
very → highly
```

This becomes extremely useful for grammar corrections.

---

# 12. Add "Why this change?" — this is the teacher feature

This is probably the **single biggest feature I would add**.

Don't just show:

> AI changed X → Y.

Show:

```text
Why?

"very successful" → "highly successful"

Reason:
"Highly" is more precise in formal writing and
works better with "successful".

Category:
Word choice

Confidence:
High
```

For grammar:

```text
Why?

"She go" → "She goes"

Reason:
The subject "She" requires the third-person singular
verb form "goes".

Category:
Grammar · Subject–verb agreement
```

That changes the product from:

> AI rewriting tool

into:

> **AI writing teacher/editor.**

Your system prompt already explicitly frames the model as a "master copyeditor and high-school writing teacher." 

The UI should actually take advantage of that.

---

# 13. Don't ask AI only for a rewritten string

This is another architectural improvement.

Currently the prompt explicitly asks the model to:

> Return ONLY the rewritten text. 

That's convenient for the current implementation, but it prevents the UI from knowing **why** something changed.

I'd move toward structured output:

```json
{
  "suggestion": "...",
  "changes": [
    {
      "type": "grammar",
      "original": "She go",
      "replacement": "She goes",
      "reason": "Subject-verb agreement",
      "confidence": "high"
    }
  ],
  "summary": "Corrected subject-verb agreement.",
  "preservesVoice": true
}
```

Then your UI can build much richer experiences.

---

# 14. Introduce change categories

Every AI suggestion should ideally be classified.

For example:

```text
Grammar
Spelling
Punctuation
Clarity
Word Choice
Redundancy
Tone
Flow
Structure
Readability
Consistency
```

Then the reviewer can say:

```text
3 Grammar
2 Clarity
1 Word Choice
```

This is much more informative than:

```text
+7 -5 words
```

Your current metrics focus mainly on additions/deletions and accept/reject counts. 

---

# 15. Add a "Teacher Summary" after a review

Once the user finishes a paragraph or the entire note:

```text
┌──────────────────────────────────────┐
│ ✨ Teacher's Summary                 │
│                                      │
│ Your writing is already clear, but   │
│ these patterns appeared repeatedly: │
│                                      │
│ • 4 unnecessary filler phrases      │
│ • 3 punctuation issues               │
│ • 2 passive constructions            │
│ • 1 unclear transition               │
│                                      │
│ Biggest improvement opportunity:     │
│ sentence flow between paragraphs.    │
└──────────────────────────────────────┘
```

This makes the user's time spent reviewing **educationally valuable**, rather than simply producing a rewritten document.

---

# 16. Add "Review Style" vs "Rewrite Style"

Your presets are currently things like:

* Grammar & Spelling
* Concise
* Passive Voice
* Adverbs
* Flow
* Professional
* Humor
* Academic. 

I'd split the experience conceptually into:

### Correct

> Fix things that are objectively wrong.

### Improve

> Make the writing better.

### Teach

> Explain what could be improved and why.

### Transform

> Change style/tone deliberately.

This prevents a user from accidentally treating a stylistic preference as a grammatical error.

---

# 17. Add "Minimal Changes" as a core review mode

For a grammar reviewer, I'd make this one of the primary choices:

```text
Review intensity

○ Proofread
● Minimal changes
○ Improve clarity
○ Rewrite
```

**Minimal changes** should tell AI:

> Change only what materially improves correctness, clarity, or readability. Preserve the author's wording whenever possible.

This directly addresses the biggest fear users have with AI editing:

> "I asked it to fix my writing, and it rewrote me."

---

# 18. Add "Preserve My Voice"

Another excellent control:

```text
☑ Preserve my voice
☑ Preserve meaning
☑ Preserve formatting
☐ Make stronger stylistic changes
```

The prompt already says to preserve tone, meaning and formatting. 

Make that promise visible to the user.

---

# 19. Re-Review should compare iterations

You already have `iteration` in the session model. 

Use it.

Instead of replacing the previous suggestion:

```text
Suggestion 1
```

then:

```text
Suggestion 2
```

show:

```text
AI Suggestion · Version 2

Compared with previous suggestion:

+ More concise
+ Preserves original tone
- Still changes sentence structure
```

Potentially:

```text
Version 1
Version 2
Original
```

This gives Re-Review a real purpose.

---

# 20. Add "Undo" to decisions

The current Accept/Reject model changes status directly. 

For a review application, decisions should be reversible.

After Accept:

```text
✓ Accepted   Undo
```

After Reject:

```text
✕ Rejected   Undo
```

And preferably:

```text
Ctrl/Cmd + Z
```

for review decisions.

You already have a `history` property in `ReviewSession`, but it isn't being used as a proper decision history. 

That's an opportunity.

---

# 21. The review should become a guided workflow

I would redesign the experience around this sequence:

```text
1. UNDERSTAND
       ↓
2. REVIEW
       ↓
3. INSPECT
       ↓
4. DECIDE
       ↓
5. REFINE
       ↓
6. LEARN
       ↓
7. COMMIT
```

### Step 1 — Understand

Show:

```text
Paragraph 8 of 24

Original:
...

AI found:
• 2 grammar issues
• 1 clarity issue
```

### Step 2 — Inspect

```text
Clean | Inline | Side-by-side | Changes
```

### Step 3 — Decide

```text
Accept
Reject
Edit
```

### Step 4 — Refine

```text
Re-Review
```

### Step 5 — Learn

```text
Why did AI suggest this?
```

### Step 6 — Commit

```text
Save changes to note
```

This is the **teacher/editor mental model** you were asking for.

---

# 22. Add a "Review Queue"

Instead of making the user navigate blindly:

```text
REVIEW QUEUE

⚠ 3 items need attention
────────────────────
P12 · Clarity
P17 · Grammar
P23 · Word choice
```

Click one → go directly there.

This is much better than forcing users to review all 40 paragraphs sequentially.

---

# 23. Add "Review only what needs attention"

Once the AI has completed the initial pass:

```text
All     24
Needs Review     7
Accepted         10
Rejected          4
No Changes        3
```

Then:

```text
Review 7 Issues
```

That turns a 24-item task into a focused 7-item task.

---

# 24. Important technical issue: full-note diff scalability

The diff implementation constructs a full `n × m` matrix. 

That's classic LCS-style dynamic programming.

For a large full note:

```text
1000 tokens × 1100 tokens
```

means roughly:

```text
1.1 million matrix cells
```

and larger notes grow quadratically.

Since **Full Note is actually the initial launcher mode**, this matters. 

### Recommendation

Use:

* Myers diff for general text
* or a bounded/optimized diff implementation
* and preferably paragraph/sentence granularity internally

For very large content:

```text
Full Note
    ↓
Structural segmentation
    ↓
Paragraph-level AI review
    ↓
Paragraph-level diff
```

rather than creating one enormous diff matrix.

### Priority: 🔴 High

---

# 25. Sentence tokenizer needs strengthening

The current splitter protects only a small set of abbreviations:

```text
e.g.
i.e.
etc.
mr.
mrs.
dr.
vs.
fig.
no.
```

and decimals. 

That will miss many real-world cases:

```text
Prof.
Inc.
Ltd.
U.S.
U.K.
Ph.D.
Jan.
approx.
...
```

It can also struggle with:

```text
"Really?" she asked.
```

and punctuation inside quotes/brackets.

### Better approach

Use `Intl.Segmenter` when available:

```js
new Intl.Segmenter(locale, {
  granularity: "sentence"
})
```

with a fallback tokenizer.

Also preserve exact source offsets.

---

# 26. Markdown integrity needs stronger protection

The prompt tells AI to preserve Markdown. 

But that's only an instruction to the model.

The system should additionally protect:

* links
* images
* code blocks
* inline code
* tables
* task lists
* HTML
* escaped characters
* footnotes
* headings

For example, don't send:

```markdown
[OpenAI](https://...)
```

as arbitrary prose and simply hope the model preserves it.

Use placeholders:

```text
[[LINK_001]]
```

then restore them after AI processing.

---

# 27. Another major UX improvement: don't make the user infer what happened

After every AI response, give a tiny summary:

```text
✓ Review complete

2 changes suggested
1 grammar
1 clarity

No meaning changes detected.
```

For no-change:

```text
✓ Looks good

AI found no meaningful changes.
```

For failure:

```text
⚠ Review couldn't complete

The AI request failed.
Your original text is untouched.

[Retry]
```

This is much better than a generic error alert.

---

# 28. Make API activity explicit

When reviewing:

```text
✨ AI is reviewing...
```

When waiting:

```text
Waiting for provider response...
```

When processing:

```text
Comparing original and suggestion...
```

When done:

```text
✓ Review ready
```

This creates a sense of a **real workflow** rather than a button mysteriously changing the UI.

---

# 29. Add cancellation

For Review All:

```text
Reviewing 18 / 42

[Pause] [Stop]
```

At minimum:

```text
Stop Review
```

should be available.

Otherwise a user who accidentally presses All may be committed to dozens of API requests.

This also becomes important for cost/rate-limit control.

---

# 30. Review All should probably not automatically review everything blindly

I'd make it:

```text
Review All Pending
```

but give the user:

```text
24 items pending

Estimated:
~24 AI requests

[Review All]   [Cancel]
```

Then the operation is explicit.

Potentially:

```text
☑ Skip headings
☑ Skip very short items
☑ Skip code
☑ Only review paragraphs > 20 characters
```

---

# 31. Save/Commit should have a final safety checkpoint

Before replacing the actual note content, show:

```text
Ready to save

24 items reviewed
17 accepted
4 edited
3 rejected

Changes:
+32 words
-41 words

[Review Changes]     [Save to Note]
```

Then:

```text
✓ Saved successfully
```

Your actual commit currently calls `replaceNoteContent()` directly after confirmation. 

The underlying save is reasonable, but the UX should make the final consequence very explicit.

---

# 32. One subtle but important issue: source note may change during review

You capture the original note content when the session starts. 

If the user or another process changes the note while the review is underway, the plugin can eventually replace the note with the review's reconstructed version based on **stale source content**.

That's a classic lost-update problem.

### Before save

Fetch the current note again and compare it with the session's `originalContent`.

If different:

```text
⚠ The note changed while you were reviewing.

Your review was based on an earlier version.

[Compare Versions]
[Reload]
[Save Anyway]
```

### Priority: 🔴 High

---

# 33. Recommended UI structure

I'd restructure the main reviewer around this:

```text
┌─────────────────────────────────────────────────────────────┐
│ Grammar Reviewer                          ● AI Working...   │
│ My Note                                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                             │
│ REVIEW NAVIGATOR                                            │
│ Paragraph 12 of 24       [Jump to ▾]      [Needs Review 7] │
│ ← Previous   Next →                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ORIGINAL                         SUGGESTION                  │
│                                                             │
│ The original paragraph...       The improved paragraph...   │
│                                                             │
│                                  [Clean] [Inline] [Side]     │
│                                  [Changes]                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ ✨ 2 suggestions                                            │
│                                                             │
│ Grammar · High confidence                                   │
│ "She go" → "She goes"                                      │
│ Why? Subject–verb agreement.                               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [✓ Accept] [✕ Reject] [✎ Edit] [↻ Re-Review]              │
│                                                             │
│                     [Previous] [Next]                      │
└─────────────────────────────────────────────────────────────┘
```

And a compact left/right navigation panel for the document.

---

# 34. Recommended status model

I would formalize it as:

```text
pending
reviewing
suggestion_ready
accepted
rejected
editing
edited
re_reviewing
no_change
error
```

Rather than overloading:

```text
pending
accepted
rejected
modified
```

This makes the UI logic dramatically safer.

---

# 35. Recommended action matrix

| State            | Review | Accept | Reject | Edit | Re-Review | Undo |
| ---------------- | -----: | -----: | -----: | ---: | --------: | ---: |
| Pending          |      ✅ |      ❌ |      ❌ |    ❌ |         ❌ |    ❌ |
| Reviewing        |      ⏳ |      ❌ |      ❌ |    ❌ |         ❌ |    ❌ |
| Suggestion ready |      ↻ |      ✅ |      ✅ |    ✅ |         ✅ |    ❌ |
| Accepted         |      ↻ |      ❌ |      ❌ |    ✅ |         ✅ |    ✅ |
| Rejected         |      ↻ |      ❌ |      ❌ |    ✅ |         ✅ |    ✅ |
| Editing          |      ❌ |      ✅ |      ❌ |    ⏳ |         ❌ |    ❌ |
| Edited           |      ↻ |      ❌ |      ❌ |    ✅ |         ✅ |    ✅ |
| No change        |      ↻ |      ❌ |      ❌ |    ❌ |         ↻ |    ❌ |
| Error            |  Retry |      ❌ |      ❌ |    ❌ |     Retry |    ❌ |

This should be **enforced in the state layer**, not merely hidden in the UI.

---

# 36. The biggest product opportunity

Right now the plugin is essentially:

> **AI suggests → user accepts/rejects.**

I would evolve it into:

> **AI explains → user evaluates → user learns → user decides.**

That's a much more compelling experience.

The user should finish a session feeling:

> "Not only is my writing better — I understand why it was better."

That is where the teacher/editor positioning becomes genuinely differentiated.

---

# 37. Priority roadmap

I would implement this in this order.

### 🔴 Phase 1 — Integrity & correctness

1. **Fix sentence-mode reconstruction**
2. Preserve exact source offsets
3. Protect Markdown structures
4. Fix action/state validation
5. Prevent stale-note overwrite
6. Improve large-text diff algorithm
7. Strengthen sentence segmentation

### 🟠 Phase 2 — Review interaction

8. State-aware Accept / Reject / Edit / Re-Review
9. Dynamic Review / Re-Review button
10. Jump-to Paragraph/Sentence
11. Previous/Next Pending
12. Review Queue
13. Undo decisions
14. Review All cancellation

### 🟡 Phase 3 — Activity feedback

15. Global top loading bar
16. Operation progress
17. Live Review All progress
18. "AI is working..." states
19. Retry/error states
20. Estimated requests / progress

### 🟢 Phase 4 — Best-in-class diff

21. Clean Prose
22. Inline Diff
23. Side-by-Side / GitHub-style
24. Changes Only
25. Change categories
26. Better alignment/synchronized scrolling

### 🔵 Phase 5 — Teacher/editor intelligence

27. "Why this change?"
28. Confidence
29. Grammar/clarity/tone categories
30. Teacher summary
31. Writing-pattern summary
32. Minimal-change mode
33. Preserve-my-voice mode
34. Re-review reason
35. Iteration comparison

---

## My strongest recommendation

**Don't implement these as a collection of disconnected UI additions.**

The next version should have a single underlying concept:

> ### **Review State + Review Queue + Review Explanation**

Everything else should hang off those three.

That would let the plugin behave intelligently:

```text
             ┌── Review
             │
Pending ─────┤
             │
             └── Skip

Suggestion Ready
      │
      ├── Accept ────────→ Accepted
      ├── Reject ────────→ Rejected
      ├── Edit ──────────→ Edited
      └── Re-Review ─────→ New Suggestion
                                │
                                ↓
                           Explanation
```

And the UI continuously tells the user:

```text
Where am I?
What is happening?
What changed?
Why did it change?
What are my choices?
What have I already reviewed?
What should I look at next?
What will happen if I click this?
```

**That is the drastic UX improvement you're looking for.**

The current code already has enough of the necessary pieces — granularity, progress, diffing, navigation, statuses, history, providers and review actions — to evolve into this without throwing the whole plugin away.  

The **first implementation pass I would make is the integrity/state layer**, especially sentence reconstruction and action availability. Once those are correct, the loading/progress/navigation/diff/teacher UX can be built on top without creating another round of architectural problems.
