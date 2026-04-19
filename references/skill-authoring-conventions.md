# Skill Authoring Conventions

Conventions for writing `SKILL.md` files in this workspace. The aim is
scannable skills that load only what the agent needs at invocation time, with
deeper material kept beside the skill but not in the main prompt.

For full background on why these conventions exist, see the in-repo research
note `research/research-karpathy-skills-learnings.md` (local only — not vended
with the plugin). This file stands alone; the research note is optional reading.

---

## File layout

A skill lives at `skills/<name>/` and may contain:

```
skills/<name>/
├── SKILL.md          # required — the prompt loaded at invocation time
├── EXAMPLES.md       # optional — illustrative ❌/✅ pairs
├── ATTRIBUTION.md    # optional — when content derives from external source
└── references/       # optional — depth material loaded on demand
    └── <topic>.md
```

The `Skill` tool loads only `SKILL.md` by default. Sibling files (`EXAMPLES.md`,
files under `references/`) are read on demand with the `Read` tool when the
agent decides it needs them. Keep `SKILL.md` lean enough that loading it is
cheap; push depth to siblings.

---

## SKILL.md shape

### Frontmatter (required)

```yaml
---
name: skill-name              # lowercase, hyphenated, ≤ 64 chars
description: >-               # triggers invocation; ≤ 1024 chars
  One paragraph that names the user phrases that should fire this skill.
  Be concrete. Vague descriptions cause wrong-skill invocations.
---
```

The plugin validator (`scripts/validate-plugin.ts`) enforces these. Optional
frontmatter fields (`model`, `allowed-tools`, `argument-hint`) follow the
Claude Code skill schema.

### Body sections (typical order)

1. One-paragraph intent statement — what the skill does and when.
2. **"Why this skill exists" preamble** (recommended) — name the underlying
   principle the skill enforces and link to the principle source. Three
   sentences max. See *Preamble pattern* below.
3. Workflow / procedure — what the agent must do, in agent voice.
4. Required output format, if the skill must produce something specific.
5. Safety rules — invariants the agent must not violate.
6. Pointer line to `EXAMPLES.md`, if examples were extracted.

### Size guidance

- **Soft cap: ~250 lines.** Past this, `SKILL.md` becomes hard to scan and the
  agent over-loads context on invocation.
- **Hard justification: > 300 lines.** If a skill needs to exceed 300 lines,
  the author should be able to point at every section and say *this is
  required at invocation time*. Anything optional belongs in `EXAMPLES.md` or
  `references/`.

These are guidance, not gates. Some skills (full domain runbooks) legitimately
need more; the discipline is to know why, not to hit a number.

---

## When to extract `EXAMPLES.md`

Extract when both are true:

1. The block is **illustrative** — it shows a concrete case rather than
   defining what the agent must do.
2. Removing it from `SKILL.md` would not change the agent's ability to execute
   the skill correctly from `SKILL.md` alone.

Classification helps: walk every block and label it one of

| Label                | Belongs in    | Why                                              |
|----------------------|---------------|--------------------------------------------------|
| `normative workflow` | `SKILL.md`    | Defines what the agent MUST do.                  |
| `required output`    | `SKILL.md`    | Defines a format the agent MUST produce.         |
| `illustrative example` | `EXAMPLES.md` | Shows a case; the rule it illustrates is named in `SKILL.md`. |

If a rule appears *only* inside an example block, restate it as a positive
rule in `SKILL.md` before moving the example out.

When extracting, leave a top-of-file pointer in `SKILL.md`:

```markdown
See [EXAMPLES.md](./EXAMPLES.md) for ❌/✅ pairs illustrating each rule below.
```

---

## ❌/✅ pair format

Use emoji markers so pairs are visually scannable:

````markdown
### Redundant comments

❌ **Wrong**

```python
# Create user
user = User()
```

✅ **Right**

```python
user = User()  # cached for retry; see #1234
```

Why: the wrong example restates what the next line obviously does. The right
example explains a non-obvious *why* that won't be visible from the code.
````

Rules for the format:

- Pair `❌` with `✅`. Never use one without the other — a "what not to do"
  without a "what to do instead" leaves the agent guessing.
- Keep both sides of the pair the same shape (both code, both prose) so the
  diff is the change being illustrated, not the medium.
- **Prose-only pairs are allowed** when the example isn't naturally code
  (e.g. an architectural anti-pattern, a UX flow). Use the same `❌ / ✅`
  markers around the prose blocks.
- One sentence of *why* per pair. The reader should understand the principle,
  not just memorize the surface form.

---

## Preamble pattern

A "why this skill exists" preamble names the underlying principle and links
to the canonical source. It earns the reader's trust before the procedure
starts:

```markdown
> **Why this skill exists.** This skill enforces *Simplicity First* —
> [karpathy-principles](../karpathy-principles/SKILL.md), principle 2 —
> applied after the fact. AI assistants tend to over-produce; this skill
> removes the overproduction before it ships.
```

Keep it to three sentences or fewer. The preamble is not the place to teach
the principle; that's what the linked source is for.

---

## When NOT to add an `EXAMPLES.md`

- The skill has no examples worth pairing — adding an empty `EXAMPLES.md`
  wastes a file.
- Every example is also normative (it defines what the agent must do). In
  that case, keep them in `SKILL.md`.
- The skill is small (< 100 lines) and the examples are integral to the
  workflow.

---

## Cross-references

Skills can reference each other and reference docs. Use relative paths from
the skill directory:

```markdown
See [karpathy-principles](../karpathy-principles/SKILL.md).
See [eval-guide](./references/eval-guide.md).
```

Cross-plugin references (e.g. from a `primitives-plugin` skill to an
`sdlc-plugin` skill) should use the skill name in prose rather than a hard
path, because plugin install paths vary across machines.

---

## Validation

`bun run validate` in the plugin root runs:

- Plugin manifest schema check (`.claude-plugin/plugin.json`).
- Per-skill frontmatter check (every `SKILL.md` must parse and meet the
  schema above).
- README ↔ commands consistency (commands only, not skills).

`bun run validate:versions` checks the three-way sync between `package.json`,
`.claude-plugin/plugin.json`, and the latest `CHANGELOG.md` header. New
skills are additive — bump the **minor** version when adding one.
