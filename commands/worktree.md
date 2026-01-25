---
description: Create an isolated git worktree with automatic setup for feature development
---

# Create Git Worktree

Create an isolated worktree in `.worktrees/` directory with automatic dependency installation and test baseline verification.

## Usage

```
/worktree <branch-name>
```

**Examples:**
- `/worktree feat/new-feature` - Create worktree for new feature
- `/worktree fix/bug-123` - Create worktree for bug fix

## What It Does

1. Ensures `.worktrees/` is in `.gitignore`
2. Creates worktree at `.worktrees/<branch-name>`
3. Installs dependencies (reads INSTALL.md)
4. Notes startup instructions (reads RUN.md if present)
5. Identifies feedback tools (reads FEEDBACK_LOOPS.md if present)
6. Runs test suite to verify clean baseline

## Instructions

Parse the branch name from arguments:
- `$ARGUMENTS` contains the branch name
- If empty, ask user: "What branch name should I use for the worktree?"

Invoke the worktree skill:
```
Skill(primitives:worktree, args: "$ARGUMENTS")
```

## Error Handling

- No branch name: Prompt user for input
- Not a git repo: Error with guidance
- Worktree exists: Report and skip to verification
- Setup fails: Report issues but continue

## Output

Report the worktree location and setup status. Include next steps for the user to start development.
