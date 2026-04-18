---
description: Create an isolated git worktree with automatic setup for feature development
---

# Create Git Worktree

Create an isolated worktree under `.worktrees/` with automatic dependency installation and a test baseline check. Thin wrapper around the `primitives:worktree` skill — delegates to the skill for the actual work.

## Usage

```
/worktree <branch-name>
```

Examples:
- `/worktree feat/new-feature`
- `/worktree fix/bug-123`

## Behavior

Parse the branch name from `$ARGUMENTS`. If empty, ask the user: `"What branch name should I use for the worktree?"` — no sensible default exists, guessing a branch name is worse than asking.

Invoke the skill and pass the name through:

```
Skill(primitives:worktree, args: "$ARGUMENTS")
```

Trust the skill's output. If it reports setup failed (e.g., install command erred), surface the error — don't silently succeed.

## Error modes

- **No branch name** — prompt before invoking the skill.
- **Not a git repo** — skill reports; surface the guidance.
- **Worktree already exists** — skill skips creation and runs verification; that's the right behavior.
- **Setup partially fails** — skill continues; surface what failed so the user can finish manually.
