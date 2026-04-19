# karpathy-principles — Routing Eval

Negative-routing test matrix. The new skill's frontmatter `description`
must NOT hijack invocations that belong to existing skills. These cases
were called out in the implementation plan's Phase 5 and in the post-
implementation review.

The current eval framework (`sdlc-plugin/eval/`) is structural — it
checks file contents, not LLM routing decisions across a populated
skill catalog. Until a routing-aware eval exists, run these manually
in a fresh Claude Code session.

## How to run

1. Open a fresh Claude Code session (`/clear` is not enough — start
   a new session so the skill catalog is freshly loaded).
2. Issue each prompt below.
3. Watch which skill (if any) Claude invokes. Either the
   `Skill(...)` tool call appears, or no skill loads.
4. Record pass/fail in the result column.

## Positive cases (`karpathy-principles` MUST be invoked)

| # | Prompt | Expected skill | Pass/Fail |
|---|--------|----------------|-----------|
| P1 | "Show me the rails for working in this repo" | `karpathy-principles` | |
| P2 | "What are the Karpathy principles?" | `karpathy-principles` | |
| P3 | "Load the Karpathy guidelines" | `karpathy-principles` | |
| P4 | "How should I work in this repo?" | `karpathy-principles` | |

## Negative cases (`karpathy-principles` must NOT be invoked)

These prompts target existing skills. The new skill must not hijack them.

| # | Prompt | Expected skill | Must not invoke | Pass/Fail |
|---|--------|----------------|-----------------|-----------|
| N1 | "Stress-test my plan" | `interview` (sdlc) | `karpathy-principles` | |
| N2 | "Grill me on this design" | `interview` (sdlc) | `karpathy-principles` | |
| N3 | "Help me avoid scope creep on this feature" | `avoid-feature-creep` | `karpathy-principles` | |
| N4 | "What's my MVP scope here?" | `avoid-feature-creep` | `karpathy-principles` | |
| N5 | "Clean up slop before commit" | `de-slop` | `karpathy-principles` | |
| N6 | "Remove AI artifacts from this branch" | `de-slop` | `karpathy-principles` | |
| N7 | "Write a test first" | `tdd` (sdlc, if `tdd: strict`) or normal flow | `karpathy-principles` | |
| N8 | "Apply simplicity first to this function" | none / normal flow | `karpathy-principles` | |
| N9 | "Make a surgical change to fix this bug" | none / normal flow | `karpathy-principles` | |
| N10 | "Write a function to parse CSV" | none | `karpathy-principles` | |

Note on N8 / N9: the principle names are deliberately *not* triggers in
the current description — only "the rails" / "the principles" /
"Karpathy principles" / "Karpathy guidelines" / "how should I work in
this repo" should fire the skill. If N8 or N9 invoke
`karpathy-principles`, the description is too broad and needs further
narrowing.

## Failure modes and remediation

- **Positive case fails (skill not invoked):** description is too
  narrow or trigger phrasing doesn't match user vocabulary. Widen
  the description's example phrases.
- **Negative case fails (wrong skill hijacked):** description leaks
  competing skill's vocabulary, OR negative phrasing ("Not for X")
  is being read as positive association. Remove the offending
  keyword or the entire negative clause.
- **Both fail:** description mentions multiple skills' vocabulary;
  rewrite around the unique purpose of `karpathy-principles` (a
  single reference page that loads the four rails together).

## History

- 2026-04-19 — initial matrix added during post-implementation review
  fixes. Skill description tightened in the same change to drop the
  "Not for scope-creep triage…" negative clause flagged by review as
  an LLM-routing anti-pattern.
