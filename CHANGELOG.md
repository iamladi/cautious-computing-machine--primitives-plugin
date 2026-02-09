# Changelog

All notable changes to the Primitives Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.11.0] - 2026-02-09

### Changed

- **`/debug` command** — replaced free-text Initial Response with structured Interview Checkpoint
  - Uses AskUserQuestion with multiple-choice options for systematic symptom gathering
  - Analyzes error messages/stack traces first, then asks targeted follow-ups
  - Self-contained inline protocol (no sdlc-plugin dependency)
  - Loops until user says "done" with 1-4 questions per round

## [1.10.0] - 2026-02-09

### Added
- Swarm mode support for `/debug` command via `--swarm` flag
  - Parallel hypothesis testing with agent teams
  - Team prerequisites and fallback to standard workflow
  - Context injection for teammates with string literals
  - Evidence sharing protocol between teammates
  - Hypothesis attribution in synthesis
  - Resource cleanup protocol
  - 10-minute completion timeout with fallback handling

## [1.9.0] - 2026-02-07

### Added
- `prompt-as-onboarding` skill — system prompt generator using 8-section annotated template
- `principal-hierarchy-audit` skill — hierarchy compliance audit with RED/YELLOW/GREEN classification

### Changed
- Rewrote `commit.md` from step-by-step procedures to reasoning-based workflow (Constitution alignment)
- Rewrote `agent-ready-repo-setup` from constraint list to 8 reasoning-based principles with examples and adaptation guidance
- Restored authorization header redaction in Pino logging example

## [1.8.0] - 2026-01-25

### Added
- `agent-ready-repo-setup` skill for optimizing repositories for AI agent collaboration
  - Essential patterns for agent-friendly documentation (AGENTS.md, CLAUDE.md)
  - TypeScript strict mode configuration for better code generation
  - Vertical slice architecture guidance for improved agent navigation
  - Structured logging patterns with Pino (JSON output, redaction, correlation IDs)
  - Machine-parseable test output configuration (Vitest with JUnit XML)
  - Type-safe environment variables with Zod
  - Pre-commit hooks setup (Husky + lint-staged)
  - Claude Code hooks for automated quality enforcement
  - MCP integration patterns
  - Comprehensive checklist for new repository setup
  - Anti-patterns to avoid and verification steps

## [1.7.0] - 2026-01-25

### Added
- `worktree` skill for creating isolated git worktrees with automatic setup
  - Creates worktrees in hidden `.worktrees/` directory
  - Automatically ensures `.worktrees/` is gitignored
  - Executes INSTALL.md for dependency installation
  - Reads RUN.md for startup instructions (if present)
  - Reads FEEDBACK_LOOPS.md for verification tools (recommends creating if missing)
  - Verifies clean test baseline before development
  - Idempotent: safe to run multiple times
- `/worktree` command as wrapper for the worktree skill
  - Usage: `/worktree feat/new-feature` or `/worktree fix/bug-123`
  - Provides isolated workspace without polluting main checkout

## [1.6.2] - 2026-01-18

### Added
- `avoid-feature-creep` skill for preventing scope bloat in software projects
  - Decision framework with 5-point checklist for evaluating feature requests
  - Scope management rules (MVP definition, version control for scope, 48-hour rule)
  - Templates for saying no to stakeholders, executives, users, and AI agents
  - AI-specific guidelines for AI-powered product development
  - Backlog hygiene practices and monthly audit checklists
  - Recovery plan for already-bloated products
  - AI session discipline (start/mid/end checks, daily reviews)

## [1.6.1] - 2026-01-07

### Added
- `agent-native-architecture` skill imported from compound-engineering-plugin
  - Prompt-native philosophy for building AI agents where features are prompts, not code
  - 10 reference documents covering: architecture patterns, MCP tool design, system prompt design, self-modification, refactoring, dynamic context injection, action parity, shared workspace, testing, and mobile patterns

## [1.6.0] - 2026-01-06

### Removed
- Orchestration skill for parallel agent swarms - experimental feature removed

## [1.5.0] - 2026-01-05

### Added
- SDLC plugin integration in orchestration skill
- Available Tools Discovery section teaching orchestration to detect and use SDLC commands
- Phase protocols learned from SDLC commands:
  - Research Protocol (read-first-then-spawn, specialized agents, documentarian mindset)
  - Planning Protocol (ambiguity detection first, complexity decomposition)
  - Interview Protocol (round-by-round questioning, question quality rules)
  - Implementation Protocol (phase-based, feedback loops, immutable plans)
  - Review Protocol (parallel Codex + Gemini, P0-P3 priorities, consensus)
  - Verification Protocol (build → validate → health check sequence)
  - Submission Protocol (verify first, then commit + PR)
- SDLC Integration section in software-development.md domain reference
- Core Research Principles section in research.md domain reference

### Changed
- Orchestration skill now prefers SDLC commands when available, falls back to generic patterns
- Domain references updated to include SDLC plugin tooling

## [1.4.0] - 2026-01-05

### Added
- Auto-load instructions for orchestration skill
- Users can now configure CLAUDE.md to automatically invoke orchestration mode at session start

## [1.3.0] - 2025-12-23

### Added
- Version synchronization enforcement across package.json, plugin.json, and CHANGELOG.md
- New `validate-versions.ts` script to check version consistency
- New `release.ts` script for atomic version bumps across all 3 files
- New npm scripts: `validate:versions`, `release:patch`, `release:minor`, `release:major`

### Changed
- CI workflow now triggers on all pushes (removed paths filter) to catch version mismatches
- `validate-plugin.ts` now checks version synchronization before other validations

### Fixed
- Version mismatch between plugin.json (was 1.1.0) and package.json/CHANGELOG (was 1.2.0)

## [1.2.0] - 2025-11-16

### Added
- New `ask-oracle` skill for leveraging GPT-5 Pro / GPT-5.1 reasoning on hard problems
  - Useful for complex architectural decisions with large codebase context
  - File attachment and token budget inspection capabilities
  - Session management for long-running analyses
  - Comprehensive workflow guidance for effective oracle usage
  - Examples for debugging, design reviews, and performance analysis

## [1.1.0] - 2025-10-31

### Added
- Hypothesis-driven debugging methodology to `/debug` command
- "Form Initial Hypotheses" step requiring 2-4 possibilities before investigation
- Structured hypothesis testing in debug reports with evidence tracking
- Hypothesis status markers (✓ Confirmed / ✗ Eliminated / ⚠️ Uncertain)
- "The Fix" section with immediate action, prevention, and alternatives
- Senior developer mindset notes: hypothesis formation, systematic elimination

### Changed
- Renamed "Investigate the Issue" to "Investigate to Test Hypotheses"
- Renamed "Next Steps" to "The Fix" with more actionable structure
- Enhanced debug report format to show hypothesis testing process
- Updated documentation to emphasize evidence-based debugging approach

### Removed
- `/pr` command - Moved to `github-plugin` as `/create-pr` for better organization
  - GitHub-related functionality now consolidated in dedicated github-plugin
  - Use `/create-pr` from github-plugin instead

## [1.0.2] - 2025-10-30

### Fixed
- Fixed bash parsing error in `check-env-keys` skill (multi-line to single-line conversion)
- Added shell environment variable checking to avoid false positives for globally exported vars
- Improved skill to check both .env files AND shell environment (e.g., `~/.zshrc` exports)
- Enhanced security: validates key existence without exposing actual values

## [1.0.1] - 2025-10-30

### Fixed
- Updated validation script to match official Claude Code schema (removed engines field support)

### Added
- GitHub Actions workflow for automated plugin schema validation
- Validation script using Zod for schema enforcement with proper field validation
- CI/CD pipeline to validate plugin.json on PRs and pushes
- .gitignore for node_modules and bun.lockb
- Support for optional fields: commands, agents, hooks, mcpServers

## [1.0.0] - 2025-10-30

### Added

#### Slash Commands
- `/commit` - Smart commit specialist with automatic batching following conventional commit standards
  - Prevents commits to main/master branches
  - Intelligently batches changes by type (feat, test, docs, chore)
  - Follows conventional commit format
  - Explicit file staging (never uses `git add .`)
  - Handles pre-commit hooks gracefully
- `/debug` - Debugging assistant for investigating issues during development
  - Parallel investigation of logs, database state, and git history
  - Structured debug reports with root cause analysis
  - Project-aware (reads DEBUG.md for project-specific info)
  - Preserves main window context
- `/generate_branch` - Semantic git branch name generator
  - Format: `<issue_class>-<issue_number>-<adw_id>-<concise_name>`
  - Switches to main, pulls latest, creates new branch
  - Enforces concise, consistent naming
- `/install` - Dependency installation with health checks
  - Verifies git and GitHub CLI availability
  - Reads INSTALL.md for project-specific setup
  - Reports missing/incomplete configurations
  - Guides setup completion
- `/pr` - Automated GitHub pull request creation
  - Generates properly formatted PR titles and descriptions
  - Includes commit summary and file changes
  - Links to implementation plans (optional)
  - Auto-references issues
- `/prime` - Context window primer for quick codebase understanding
  - Lists repository structure
  - Reads and summarizes README
  - Identifies patterns and entry points
- `/start` - Development environment starter
  - Reads RUN.md for project-specific instructions
  - Starts services in background
  - Provides service URLs and health status
- `/tools` - Lists all core built-in development tools
  - Displays in TypeScript function syntax
  - Shows available parameters

#### Skills
- `check-env-keys` - Environment variable validation without exposing secrets
  - Checks .env.local, .env, .env.example, .env.sample
  - Shows only variable names, never values
  - Compares local vs example files
  - Identifies missing configurations
  - Security-first approach

#### Documentation
- Comprehensive README with installation, usage, and examples
- 5 real-world usage examples:
  - Commit workflow example
  - Debug session walkthrough
  - Full PR workflow (issue to merge)
  - New project setup guide
  - Environment validation example
- Plugin metadata (plugin.json)
- This changelog

#### Project Structure
- Commands in `commands/` directory
- Skills in `skills/` directory with SKILL.md format
- Examples in `examples/` directory
- Plugin configuration in `.claude-plugin/`

### Philosophy

This release establishes core principles:
- **Atomic commands** - Each does one thing well
- **Security first** - Never expose secrets or credentials
- **Project-aware** - Reads project-specific docs (DEBUG.md, INSTALL.md, RUN.md)
- **Clear outputs** - Structured reports with actionable next steps
- **No destructive defaults** - Always verify before dangerous operations

[1.0.0]: https://github.com/iamladi/primitives-plugin/releases/tag/v1.0.0
