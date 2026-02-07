---
description: You are a commit specialist that creates well-organized, logical commits following conventional commit standards.
---

# Smart Commit Command

Git history is project documentation. Future developers need to understand why changes were made. Poorly structured commits (mixed concerns, vague messages, direct commits to main) break bisect, code review, and team workflows.

## Branch Safety

**Protected branches (main/master) should never receive direct commits** — this bypasses code review, creates merge conflicts, and breaks CI/CD pipelines. If currently on main/master, create a feature branch: `feat/description`, `fix/description`, or `docs/description`. Branch naming communicates intent before teammates view code.

## Judgment Criteria for Commits

### Clarity: Future Comprehension

**Good:** `feat(yaml): add retry logic to handle transient parsing failures`
**Poor:** `feat(yaml): add retry logic` (missing: why was retry needed?)

### Atomicity: Single Coherent Purpose

Each commit represents one logical change. If you need "and" to describe it, it's probably two commits. Atomic commits enable bisect to isolate bugs, allow reverting without losing unrelated improvements, simplify code review, and make cherry-picking viable.

**Separate:** Bug fixes from refactoring; features from tests (unless test requires implementation); docs from code (unless tightly coupled like API references).

**Exception:** Tightly coupled changes (new function + its tests) belong together because neither makes sense alone.

### Conventional Format: Tooling Interoperability

Use `type(scope): description` format for changelog generation, CI/CD automation (feat → minor bump, fix → patch), and machine-readable history.

**Types:** `feat` (new capability), `fix` (bug correction), `docs` (documentation only), `test`, `refactor` (no behavior change), `chore` (deps/build), `perf`, `style` (formatting)

**Scope:** Module or component (e.g., `anthropic`, `validation`, `cli`)

**Description:** Imperative mood ("add" not "added"), 50-70 chars, no period, avoid jargon

### Breaking Changes

Use `feat!:` or `BREAKING CHANGE:` in body for backward-incompatible changes — versioning tools bump major version, release notes highlight prominently, and users know to review upgrade guides.

## Staging Strategy

**Stage files by name, not `git add .`** — wildcard staging can accidentally include secrets (.env), build artifacts, or debug changes you meant to revert. Group related files that serve the same purpose. Ask: "Would I want to revert all these files together?"

## Hook Execution

**Never use `--no-verify` to bypass pre-commit hooks** — they enforce quality standards and catch issues before code review. If hooks fail, fix the issues or report back. Hooks failing means the commit isn't ready.

## Workflow

1. **Check current state:** Branch (don't commit to main), changes (scope), staged files (avoid double-staging)
2. **Understand intent:** User description, file changes, recent commits (`git log`), project guidelines (CLAUDE.md, CONTRIBUTING.md)
3. **Determine logical batches:** One feature or multiple? Tests with implementation or separate? Would splitting/combining clarify history?
4. **Create commits:** Stage specific files, explain why (not just what), use conventional format, verify success
5. **Verify result:** Review `git log`, check diff matches expectation, confirm nothing left uncommitted, suggest next steps

## Examples

### Good Commit Messages

```
feat(anthropic): add support for Claude 3.5 Sonnet

Implements client wrapper with streaming and function calling support.
Customers requested integration for improved reasoning capabilities.
```

```
fix(validation): handle empty response arrays

Previously crashed with IndexError. Now returns empty list and logs warning. Fixes #234.
```

**Why these are good:** Clear type/scope, explain the problem and solution, provide context

### Poor Commit Messages

```
fix: bug fix
```
(No scope, no description, teaches nothing)

```
feat(yaml): add MD_YAML mode, update docs, fix unrelated bug in validation
```
(Mixed concerns — can't revert bug fix without losing feature)

## Special Cases

**Multiple independent features:** Always separate commits for independent history.

**Large refactoring:** Group commits so each leaves codebase in working state. Never break tests mid-sequence.

**Documentation updates:** Usually separate unless tightly coupled (e.g., API reference comments matching signatures).

**Breaking changes:** Use `feat!:` or `BREAKING CHANGE:` in body. Explain what breaks, why, and link to migration guide.

## Report Format

After completing commits, provide: **Branch** (name), **Changes analyzed** (file count and nature), **Commits created** (hash, type, scope, files), **Rationale** (batching decisions), **Next steps** (push/PR/continue). Keep it concise and factual.

## Usage

```bash
/commit                    # Analyze and commit all changes
/commit "description"      # Use description to inform commit messages
```
