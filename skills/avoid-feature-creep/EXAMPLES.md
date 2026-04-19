# avoid-feature-creep — Templates

Templates referenced from [`SKILL.md`](./SKILL.md). The skill's normative
workflow (Decision Framework, Saying-No scripts, Recovery playbook,
Backlog Hygiene) lives in `SKILL.md`; this file holds the reusable
artefacts the skill instructs you to produce.

---

## MVP Scope Document Template

Used by Scope Management Rule 1 (*Define and Defend Your MVP*). Fill this
in before starting work; reference it whenever a new feature is proposed.

```markdown
## MVP Scope Document Template

### Core Problem
[One sentence describing the user problem]

### Success Criteria
[How we know we've solved it]

### In Scope (v1)
- Feature A: [brief description]
- Feature B: [brief description]

### Explicitly Out of Scope
- Feature X: Deferred to v2
- Feature Y: Will not build unless [condition]
- Feature Z: Not our problem to solve

### Non-Negotiables
- Ship by [date]
- Budget: [hours/dollars]
- Core user: [specific persona]
```

---

## Scope Decision Log

Used by the *Stakeholder Management* sub-section of AI Session Discipline.
One source of truth for every scope decision, including those driven by
AI agents (Claude, Cursor, etc.) so they get the same scrutiny as human
stakeholders.

```markdown
## Scope Decision Log

| Date       | Request           | Source        | Decision     | Rationale                    | Trade-off                    |
|------------|-------------------|---------------|--------------|------------------------------|------------------------------|
| 2025-01-15 | Add export to PDF | PM            | Deferred v2  | Not core to MVP              | Would delay launch 2 weeks   |
| 2025-01-16 | Dark mode         | User feedback | Approved     | User research shows demand   | Removed social sharing       |
| 2025-01-17 | Add caching layer | Claude        | Deferred     | Premature optimization       | Stay focused on core feature |
| 2025-01-17 | Refactor to hooks | Cursor        | Rejected     | Works fine as is             | Technical scope creep        |
```

---

## Daily AI Check Template

Used by the *Daily AI Check* point in AI Session Discipline. Run at the end
of each day working with AI assistants.

```markdown
1. Features completed today: [list]
2. Scope additions today: [list]
3. Was each addition validated? [yes/no]
4. Tomorrow's focus: [single item]
```

---

## Attribution

The ❌/✅ paired-block convention used elsewhere in this workspace is
borrowed from
[`multica-ai/andrej-karpathy-skills`](https://github.com/multica-ai/andrej-karpathy-skills)
(MIT). See [`../karpathy-principles/ATTRIBUTION.md`](../karpathy-principles/ATTRIBUTION.md).
This file holds plain templates rather than ❌/✅ pairs — the templates
themselves are the artefact, not contrastive examples.
