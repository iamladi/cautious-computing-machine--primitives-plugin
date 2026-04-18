---
name: worktree
description: Create an isolated git worktree for feature development with automatic setup. Use when starting work on a new feature branch to get a clean, fully-configured workspace without polluting your main checkout.
---

# Git Worktree Skill

Create an isolated worktree under `.worktrees/`, install dependencies, and verify a test baseline. The point is to give the user a fresh, fully-configured workspace without polluting the main checkout — which matters when running multiple parallel feature branches or when the main checkout has in-progress changes you don't want to disturb.

## Input

`$ARGUMENTS` is the branch name (e.g. `feat/my-feature`, `fix/bug-123`). If missing, prompt the user — guessing a branch name is worse than asking.

## Workflow

### Validate the environment

```bash
# Check git version supports worktrees (2.5+)
git --version

# Verify we're in a git repository
git rev-parse --git-dir
```

If not in a git repo, stop with error: "Not a git repository. Run this from a project root."

### Ensure `.worktrees/` is gitignored

Check if `.worktrees/` is in `.gitignore`:

```bash
# Check if .worktrees is already ignored
grep -q "^\.worktrees" .gitignore 2>/dev/null && echo "already-ignored" || echo "needs-adding"
```

**If not ignored:**
1. Append `.worktrees/` to `.gitignore`
2. Stage and commit the change:
```bash
echo ".worktrees/" >> .gitignore
git add .gitignore
git commit -m "chore: add .worktrees to gitignore"
```

Report: `".worktrees/" added to .gitignore and committed`

### Check for an existing worktree

```bash
# List existing worktrees
git worktree list

# Check if target worktree already exists
ls -d .worktrees/$BRANCH_NAME 2>/dev/null && echo "exists" || echo "new"
```

**If worktree exists:**
- Report: "Worktree already exists at .worktrees/$BRANCH_NAME"
- Skip creation, proceed to verification steps (Step 6)

### Create the worktree

```bash
# Create the worktree with a new branch
git worktree add .worktrees/$BRANCH_NAME -b $BRANCH_NAME

# Or if branch already exists:
git worktree add .worktrees/$BRANCH_NAME $BRANCH_NAME
```

Handle errors:
- If branch exists but not as worktree: use existing branch
- If path exists but not registered: `git worktree prune` then retry

Report: "Created worktree at .worktrees/$BRANCH_NAME"

### Run the setup files

Change into the worktree and run whatever project-level setup the repo defines. The order matters — install deps first so subsequent steps have a working environment.

```bash
cd .worktrees/$BRANCH_NAME
```

#### INSTALL.md (required)

Check for `INSTALL.md`:
```bash
ls INSTALL.md 2>/dev/null && echo "found" || echo "missing"
```

**If found:**
- Read INSTALL.md
- Follow installation instructions (typically `bun install`, `npm install`, etc.)
- Report each step executed

**If missing:**
- Warning: "No INSTALL.md found. Attempting common install commands..."
- Try in order:
  1. `bun install` (if bun.lockb exists)
  2. `npm install` (if package-lock.json exists)
  3. `yarn install` (if yarn.lock exists)
- If none work, report: "Could not auto-detect package manager. Manual setup may be required."

#### RUN.md (optional)

Check for `RUN.md`:
```bash
ls RUN.md 2>/dev/null && echo "found" || echo "missing"
```

**If found:**
- Read RUN.md
- Note startup instructions (don't auto-run services unless explicitly requested)
- Report: "RUN.md found. See instructions for starting dev environment."

**If missing:**
- No action needed
- Report: "No RUN.md found (optional)"

#### FEEDBACK_LOOPS.md (optional, recommended)

Check for `FEEDBACK_LOOPS.md`:
```bash
ls FEEDBACK_LOOPS.md 2>/dev/null && echo "found" || echo "missing"
```

**If found:**
- Read FEEDBACK_LOOPS.md
- Note available feedback tools (test commands, linters, etc.)
- Report: "FEEDBACK_LOOPS.md found. Feedback tools available for verification."

**If missing:**
- Report: "No FEEDBACK_LOOPS.md found. Consider creating one for consistent verification."
- Suggest creating FEEDBACK_LOOPS.md with common checks:
  ```
  Suggested FEEDBACK_LOOPS.md structure:
  - Test command (e.g., bun test)
  - Type checking (e.g., tsc --noEmit)
  - Linting (e.g., eslint .)
  - Build verification (e.g., bun run build)
  ```

### Verify the test baseline

Run the test suite once before handing the workspace to the user. The reason this matters is diagnostic: if a test fails later, they need to know whether they introduced the failure or inherited it.

```bash
# Detect and run tests
if [ -f "package.json" ]; then
  # Try common test commands
  bun test 2>/dev/null || npm test 2>/dev/null || yarn test 2>/dev/null || echo "no-tests"
fi
```

**If tests pass:**
- Report: "Test baseline verified. All tests passing."

**If tests fail:**
- Warning: "Test baseline has failures. Review before starting development."
- List failing tests
- Ask: "Proceed anyway? (Tests may have been failing before your changes)"

**If no tests:**
- Note: "No test suite detected."

### Final report

```
Worktree Setup Complete

Location: .worktrees/$BRANCH_NAME
Branch: $BRANCH_NAME

Setup Status:
  .gitignore: [Updated/Already configured]
  Dependencies: [Installed/Failed/Manual required]
  RUN.md: [Found/Not present]
  FEEDBACK_LOOPS.md: [Found/Not present (recommended)]
  Test Baseline: [Passing/Failing/No tests]

Next Steps:
  1. cd .worktrees/$BRANCH_NAME
  2. Start development (see RUN.md if present)
  3. Run tests frequently to catch regressions

To remove worktree when done:
  git worktree remove .worktrees/$BRANCH_NAME
```

## Idempotency

This skill is safe to run multiple times:
- Detects existing worktrees and skips creation
- .gitignore check is additive
- Setup files can be re-executed
- Test baseline always runs for verification

## Error handling

| Error | Action | Why |
|-------|--------|-----|
| Not a git repo | Stop with clear error | Nothing to branch from — pointless to continue |
| Git version < 2.5 | Stop with upgrade instructions | Worktrees are a 2.5+ feature |
| Branch already exists (not as a worktree) | Reuse the branch, attach it to a new worktree path | User probably wants to continue prior work |
| Worktree path exists but stale | `git worktree prune`, then retry | Stale registrations block `git worktree add` |
| INSTALL.md fails | Report the error, continue to the test step | Partial setup beats no setup — the user can finish install manually |
| Tests fail | Warn, but allow proceeding | Failures may predate the user's work; they need to decide |

## Integration with SDLC

When invoked from `/sdlc:implement` or similar workflows:
- Return the worktree path for subsequent operations
- Report setup status for workflow awareness
- Any warnings should be propagated to parent workflow

## Example Usage

**Manual invocation:**
```
/worktree feat/new-feature
```

**Skill invocation:**
```
Skill(primitives:worktree, args: "feat/new-feature")
```

**Expected output:**
```
Creating worktree for feat/new-feature...

[1/6] Checking .gitignore... already configured
[2/6] Creating worktree... done
[3/6] Installing dependencies... bun install complete (1.2s)
[4/6] Checking RUN.md... found
[5/6] Checking FEEDBACK_LOOPS.md... found
[6/6] Running test baseline... 42 tests passed

Worktree ready at .worktrees/feat/new-feature
```
