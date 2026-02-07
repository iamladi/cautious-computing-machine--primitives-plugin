---
description: Create an isolated git worktree with automatic setup for feature development
---

# Create Git Worktree

## Priorities
Idempotency > Setup completeness > Speed

## Goal
Create an isolated worktree in `.worktrees/` with automatic dependency installation and test baseline verification.

## Constraints
- Parse branch name from `$ARGUMENTS`; if empty, ask user for branch name
- Delegate to the worktree skill: `Skill(primitives:worktree, args: "$ARGUMENTS")`
- Not a git repo → error with guidance
- Worktree already exists → report and skip to verification

## Output
Report worktree location, setup status, and next steps for development.
