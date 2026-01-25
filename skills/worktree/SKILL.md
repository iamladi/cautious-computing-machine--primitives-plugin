---
name: worktree
description: Create an isolated git worktree for feature development with automatic setup. Use when starting work on a new feature branch to get a clean, fully-configured workspace without polluting your main checkout.
---

# Git Worktree Skill

Create isolated worktrees in `.worktrees/` directory with automatic project setup and test baseline verification.

## When to Use

- Starting work on a new feature that needs isolation from main checkout
- Need a clean workspace without affecting current working directory
- Want automatic dependency installation and environment setup
- Part of SDLC workflow that requires isolated implementation context

## Arguments

The skill expects a branch name argument:
- `$ARGUMENTS` - Branch name for the worktree (e.g., `feat/my-feature`, `fix/bug-123`)

If no branch name provided, prompt the user to specify one.

## Workflow

### Step 1: Validate Environment

```bash
# Check git version supports worktrees (2.5+)
git --version

# Verify we're in a git repository
git rev-parse --git-dir
```

If not in a git repo, stop with error: "Not a git repository. Run this from a project root."

### Step 2: Ensure .worktrees/ is Gitignored

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

### Step 3: Check for Existing Worktree

```bash
# List existing worktrees
git worktree list

# Check if target worktree already exists
ls -d .worktrees/$BRANCH_NAME 2>/dev/null && echo "exists" || echo "new"
```

**If worktree exists:**
- Report: "Worktree already exists at .worktrees/$BRANCH_NAME"
- Skip creation, proceed to verification steps (Step 6)

### Step 4: Create Worktree

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

### Step 5: Execute Setup Files

Change to worktree directory and execute setup files in order:

```bash
cd .worktrees/$BRANCH_NAME
```

#### 5a. INSTALL.md (Required)

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

#### 5b. RUN.md (Optional)

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

#### 5c. FEEDBACK_LOOPS.md (Optional but Recommended)

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

### Step 6: Verify Test Baseline

Run test suite to establish clean baseline:

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

### Step 7: Final Report

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

## Error Handling

| Error | Action |
|-------|--------|
| Not a git repo | Stop with clear error |
| Git version < 2.5 | Stop with upgrade instructions |
| Branch already exists (not worktree) | Use existing branch |
| Worktree path exists but stale | Prune and retry |
| INSTALL.md fails | Report error, continue to tests |
| Tests fail | Warn but allow proceeding |

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
