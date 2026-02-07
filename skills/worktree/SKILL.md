---
name: worktree
description: Create an isolated git worktree for feature development with automatic setup. Use when starting work on a new feature branch to get a clean, fully-configured workspace without polluting your main checkout.
---

# Git Worktree

## Priorities
Idempotency (safe to re-run) > Setup completeness > Speed

## Goal
Create an isolated worktree in `.worktrees/` with automatic dependency installation and test baseline verification.

## Constraints
- Expect branch name in `$ARGUMENTS`; if empty, prompt user
- Must be in a git repository (git 2.5+)
- Ensure `.worktrees/` is in `.gitignore` (add and commit if missing)
- If worktree already exists, skip creation and proceed to verification
- Execute setup files in order: INSTALL.md → RUN.md (note, don't auto-run) → FEEDBACK_LOOPS.md (note available tools)
- Run test suite to establish clean baseline; warn if tests fail but allow proceeding
- Safe to run multiple times (idempotent)
- Load detailed procedure and error handling from reference

## Output
Worktree setup report: location, branch, setup status (dependencies, RUN.md, FEEDBACK_LOOPS.md, test baseline), next steps, and removal command.

## References
Load worktree procedure:
- `Glob(pattern: "**/primitives/**/references/worktree-procedure.md", path: "~/.claude/plugins")` → Read result
