# Primitives Plugin for Claude Code

Essential building blocks for Claude Code workflows. This plugin provides fundamental slash commands and skills that streamline common development tasks like commits, debugging, PRs, and environment setup.

## Installation

```bash
# Install from GitHub
/plugin install iamladi/cautious-computing-machine--primitives-plugin

# Or from your local marketplace
/plugins marketplace add iamladi/cautious-computing-machine
/plugin install primitives
```

## Why This Plugin?

Primitives bundles time-saving workflows for repetitive dev tasks:

- **Smart commits** following conventional commit standards with automatic batching
- **Instant debugging** context without burning your main window
- **Git workflow automation** for branches and PRs
- **Environment setup** with health checks and missing config detection
- **Context priming** to quickly understand codebases
- **Hard problem solving** with GPT-5 Pro/5.1 for architectural and complex debugging tasks

## Slash Commands

### `/commit` - Smart Commit Specialist

Creates well-organized, atomic commits following conventional commit standards. Automatically batches changes by type and scope.

**Features:**
- Prevents commits to main/master (creates branch if needed)
- Batches related changes intelligently
- Follows conventional commit format (`type(scope): description`)
- Never uses `git add .` - adds files explicitly
- Handles pre-commit hooks gracefully

**Usage:**
```bash
/commit                    # Analyze and commit all changes
/commit "add yaml support" # Use description to inform messages
```

**Output example:**
```
feat(yaml): add MD_YAML mode for YAML extraction
test(yaml): add tests for MD_YAML mode
docs(yaml): document MD_YAML usage

✨ Summary: 3 commits, 8 files changed
```

### `/debug` - Debugging Assistant

Investigates issues by examining logs, database state, and git history without editing files. Perfect for debugging during manual testing without using your primary window's context.

**Parallel Investigation:**
- Task 1: Check logs for errors/warnings
- Task 2: Analyze database/backend state
- Task 3: Review git and file state

**Usage:**
```bash
/debug                     # Start debugging session
```

**Requires:** `DEBUG.md` in repo root for project-specific debug info (log locations, database tools, etc.)

### `/install` - Dependency Installation

Verifies tooling (git, gh CLI) and guides through dependency installation with health checks.

**Usage:**
```bash
/install
```

**Checks:**
- Git CLI availability
- GitHub CLI (gh) availability and configuration
- Reads `INSTALL.md` for project-specific setup
- Reports missing/incomplete configurations

### `/prime` - Context Window Primer

Quickly understands and summarizes codebase structure for efficient context loading.

**Usage:**
```bash
/prime
```

**Workflow:**
1. Runs `git ls-files` to see structure
2. Reads README.md
3. Summarizes codebase understanding

### `/start` - Dev Environment Starter

Starts development environment based on project documentation.

**Usage:**
```bash
/start
```

**Features:**
- Reads `/RUN.md` for project-specific start instructions
- If no RUN.md exists, analyzes repo and suggests creating one

### `/tools` - Built-in Tools List

Lists all core, built-in non-MCP development tools available in Claude Code.

**Usage:**
```bash
/tools
```

**Output:** Bullet list with TypeScript function syntax showing parameters.

## Skills

### `ask-oracle` - GPT-5 Pro/5.1 Problem Solver

Leverage the Oracle CLI to tap into GPT-5 Pro or GPT-5.1 for hard problems requiring deep reasoning and large codebase context.

**When to use:**
- Complex architectural decisions needing full project context
- Hard debugging across large codebases (100k+ LOC)
- Performance optimization analysis
- Security reviews with comprehensive code inspection
- Situations where standard Claude analysis feels insufficient

**Key features:**
- GPT-5 Pro (default) or GPT-5.1 reasoning models
- File/directory attachment up to ~196k tokens
- Token budget inspection before API calls
- Long-running background sessions with resume capability
- Progress tracking and session management

**Example usage:**
```bash
# Preview files and token cost before calling API
bunx @steipete/oracle --prompt "Why does this auth fail on mobile?" \
  --file src/auth/ src/api/ --files-report --preview

# Execute with memorable session slug
bunx @steipete/oracle --prompt "Review state management architecture" \
  --file src/store/ --slug "state-arch-review"

# Resume existing session
bunx @steipete/oracle session state-arch-review
```

### `check-env-keys` - Environment Variable Checker

Verifies which environment variable keys are present WITHOUT exposing their values. Security-first approach to env validation.

**Checks files in order:**
1. `.env.local` (local overrides)
2. `.env` (if exists)
3. `.env.example` (template)
4. `.env.sample` (alternative template)

**Shows:**
- ✓ Which keys are defined
- ✓ Missing keys (comparing local vs example)
- ✗ **Never** shows actual values

**Usage:**
Invoked automatically when skill is needed, or manually:
```bash
# The skill uses this safe command internally
for file in .env.local .env .env.example .env.sample; do
  [ -f "$file" ] && grep '=' "$file" | cut -d'=' -f1 | sort
done
```

## Examples

Real-world usage examples to get you started:

- **[Commit Workflow](examples/commit-workflow.md)** - See how `/commit` intelligently batches changes into atomic commits
- **[Debug Session](examples/debug-session.md)** - Walk through investigating production issues with `/debug`
- **[Full PR Workflow](examples/full-pr-workflow.md)** - Complete flow from issue to merged PR
- **[Setup New Project](examples/setup-new-project.md)** - Get up and running on a new codebase in minutes
- **[Environment Validation](examples/env-validation.md)** - Safely validate configs without exposing secrets

## Project Structure

```
primitives-plugin/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata
├── commands/
│   ├── commit.md            # Smart commit specialist
│   ├── debug.md             # Debugging assistant
│   ├── install.md           # Dependency installer
│   ├── prime.md             # Context primer
│   ├── start.md             # Dev environment starter
│   └── tools.md             # Tools lister
├── skills/
│   ├── ask-oracle/
│   │   └── SKILL.md         # GPT-5 Pro/5.1 problem solver
│   ├── check-env-keys/
│   │   └── SKILL.md         # Env variable checker
│   └── de-slop/
│       └── SKILL.md         # AI artifact remover
├── examples/
│   ├── commit-workflow.md   # Smart commit example
│   ├── debug-session.md     # Debugging example
│   ├── full-pr-workflow.md  # Complete PR workflow
│   ├── setup-new-project.md # Project setup example
│   └── env-validation.md    # Environment validation
└── README.md
```

## Contributing

Contributions welcome! This plugin follows these principles:

1. **Commands should be atomic** - Do one thing well
2. **Security first** - Never expose secrets or credentials
3. **Project-aware** - Read project-specific docs (DEBUG.md, INSTALL.md, RUN.md, etc.)
4. **Clear outputs** - Structured reports with actionable next steps
5. **No destructive defaults** - Always verify before dangerous operations

## Requirements

- Claude Code (public beta or later)
- Git CLI
- GitHub CLI (`gh`) for PR-related commands

## License

MIT License - see plugin.json for details

## Author

Ladislav Martincik - [GitHub](https://github.com/iamladi)

## Version

1.0.0
