---
name: karpathy-principles
description: >-
  Loads the four Karpathy coding-with-AI rails — Think Before Coding,
  Simplicity First, Surgical Changes, Goal-Driven Execution — with pointers
  to the local skills that enforce each. Use when the user asks for "the
  rails", "the principles", "how should I work in this repo", or names a
  phrase like "surface assumptions", "simplicity first", "surgical changes",
  or "define verifiable success". Not for scope-creep triage (use
  avoid-feature-creep), plan stress-tests (use interview), or AI-artifact
  cleanup (use de-slop).
---

# Karpathy Principles

Four rails for coding with AI in this workspace. One rule and one local
enforcement pointer per principle.

If you only remember one thing: **define what success looks like before you
write code, then change the smallest thing that gets you there**.

## 1. Think Before Coding

Surface assumptions before acting. Read the relevant files first; state the
assumption out loud; if it could be wrong in a way that matters, ask rather
than guess.

Enforcement: [`sdlc:interview`](../../../sdlc-plugin/skills/interview/SKILL.md)
walks a plan's decision tree; [`primitives:debug`](../../commands/debug.md)
requires hypotheses before investigation.

## 2. Simplicity First

Pick the smallest design that solves the stated problem. Three similar lines
beats a premature abstraction. Don't add error handling for scenarios that
can't happen, don't refactor surrounding code in a bug-fix PR, and don't
build for hypothetical future requirements.

Enforcement: [`primitives:de-slop`](../de-slop/SKILL.md) removes
overproduction after the fact; [`primitives:avoid-feature-creep`](../avoid-feature-creep/SKILL.md)
prevents it during planning.

## 3. Surgical Changes

Change only what the task requires. Touching unrelated code in the same diff
makes review harder, makes rollback wider, and turns a focused patch into a
refactor. Stage the task's files only and resist "while I'm in here"
cleanups.

Enforcement: [`primitives:commit`](../../commands/commit.md) batches by
intent; [`primitives:worktree`](../worktree/SKILL.md) isolates work so
unrelated changes can't accumulate.

## 4. Goal-Driven Execution

Define verifiable success before writing code. A task without a test, a
check, or a definition of done has no stopping condition. Write the test
first when the change is testable; when it isn't, name the observable
outcome and how you'll check it.

Enforcement: [`sdlc:tdd`](../../../sdlc-plugin/skills/tdd/SKILL.md) enforces
the test-first cycle when `tdd: strict` is set.

## See also

- [`references/skill-authoring-conventions.md`](../../references/skill-authoring-conventions.md)
  — file layout, ❌/✅ pair format, preamble pattern.
- [`ATTRIBUTION.md`](./ATTRIBUTION.md) — MIT attribution and commit-pinned
  permalinks for the upstream `multica-ai/andrej-karpathy-skills` source.
