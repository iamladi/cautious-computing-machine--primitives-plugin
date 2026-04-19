# Changelog

All notable changes to the Primitives Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.14.1] - 2026-04-19

### Fixed
- `skills/karpathy-principles/SKILL.md` — replaced cross-plugin `../../../sdlc-plugin/...` relative links with prose names (`the` `interview` `skill (sdlc-plugin)`, `the` `tdd` `skill (sdlc-plugin)`). The relative paths resolved correctly only in a sibling-checkout workspace; in production install layout (`~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/`) plugins live in non-adjacent versioned directories and the links dangled. Convention doc already mandated prose-only cross-plugin references — the new skill now obeys its own rule. (Review finding: Codex P1 + Gemini P0, consensus.)
- `skills/karpathy-principles/SKILL.md` frontmatter `description` — narrowed trigger surface. Dropped negative-phrasing exclusions ("Not for scope-creep triage (use avoid-feature-creep)…") flagged by Gemini as an LLM-routing anti-pattern (the skill name in a "Not for X" clause often *increases* selection probability). Dropped competing-skill keywords ("scope-creep", "stress-tests", "AI-artifact cleanup"). Trigger now keyed only on explicit "the rails" / "the principles" / "Karpathy principles" / "Karpathy guidelines" / "how should I work in this repo" requests. (Review finding: Gemini P1, contradicted by Codex but resolved in favor of tighter description.)
- `skills/karpathy-principles/ATTRIBUTION.md` — hardened against upstream README mutation. Vendored the SPDX standard MIT license text in-band, added commit-pinned permalink to the upstream README declaration (`fb7a22c`, 2026-04-18), and added an in-body attribution line to `SKILL.md` so the artefact loaded at invocation time is self-attributing even if separated from `ATTRIBUTION.md`. (Review finding: Codex P2 + Gemini P3, consensus.)

### Added
- `skills/karpathy-principles/ROUTING-EVAL.md` — manual negative-routing test matrix (4 positive cases, 10 negative cases) called out in plan Phase 5 and surfaced as missing infrastructure by review (Gemini P2). The current `sdlc-plugin/eval/` framework is structural (file-content checks) and can't simulate LLM routing across a populated skill catalog, so cases ship as a markdown checklist for fresh-session manual runs until a routing-aware eval exists.

## [1.14.0] - 2026-04-19

### Added
- `skills/karpathy-principles/SKILL.md` (69L) — new skill collecting the four Karpathy coding-with-AI principles (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution) with cross-links to the local skills that enforce each. Trigger description narrowed to rails-loading phrases ("the rails", "surface assumptions", "simplicity first", "surgical changes", "define verifiable success") to avoid collision with `interview` / `avoid-feature-creep` / `de-slop`.
- `skills/karpathy-principles/ATTRIBUTION.md` — commit-pinned permalinks to upstream `multica-ai/andrej-karpathy-skills` (MIT, no `LICENSE` file in repo; declared MIT in upstream `README.md`).
- `references/skill-authoring-conventions.md` (197L) — workspace-local convention doc covering SKILL.md size guidance, frontmatter minimum, the `EXAMPLES.md` extraction convention, the `❌/✅` paired-block format (prose pairs allowed), and the "why this skill exists" preamble pattern. Referenced from `README.md` Contributing section and from `skills/karpathy-principles/SKILL.md`.
- `skills/de-slop/EXAMPLES.md` (97L) — extracted illustrative ❌/✅ code pairs for scan categories B (Redundant Comments), C (AI TODO), and D (Excessive Docstrings).
- `skills/avoid-feature-creep/EXAMPLES.md` (82L) — extracted templates: MVP Scope Document Template, Scope Decision Log table, Daily AI Check Template.
- `skills/agent-native-architecture/EXAMPLES.md` (234L) — extracted 11 anti-pattern walkthroughs as paired ❌/✅ blocks: cardinal sin, artificial limits, encoded decisions, over-specification, context starvation, orphan features, sandbox isolation, silent actions, capability hiding, static tool mapping, incomplete CRUD.

### Changed
- `skills/de-slop/SKILL.md` (308 → 263L) — extracted illustrative example pairs for categories B/C/D to `EXAMPLES.md`. Detection heuristics, Present Findings format, and Summary Report retained as normative workflow + required output. Added "why this skill exists" preamble naming Simplicity First. Plan target ≤220L was over-optimistic given strict FR-2 classification — required-output formats blocked further extraction.
- `skills/avoid-feature-creep/SKILL.md` (304 → 265L) — extracted three templates to `EXAMPLES.md`. Decision Framework, Saying-No scripts, Recovery playbook, Backlog Hygiene framework retained as normative workflow + required output. Plan target ≤140L was over-optimistic given how much of this skill is normative.
- `skills/agent-native-architecture/SKILL.md` (346 → 239L) — extracted entire `<anti_patterns>` section to `EXAMPLES.md`. Added "Shared Workspace" item to architecture_checklist before extraction (was only stated in the Sandbox Isolation Fix line). Other anti-patterns already had positive-rule equivalents in checklist or essential_principles.
- `skills/autoresearch/SKILL.md` — added "Related rails" cross-link to `karpathy-principles` near the existing Karpathy attribution.
- `README.md` — added `karpathy-principles` to the Skills section and a pointer to `references/skill-authoring-conventions.md` in Contributing.

### Cross-plugin

- `sdlc-plugin/skills/tdd/SKILL.md` — receives a parallel "why this skill exists" preamble naming Goal-Driven Execution (karpathy-principles principle 4). Tracked in the sdlc-plugin CHANGELOG; mentioned here only as the cross-plugin half of FR-4.

### Rationale

Three coordinated tracks: (a) publish one canonical principles skill in this plugin so future Claude Code sessions can load the four rails in ~70 lines instead of reading every workflow skill in full; (b) extract illustrative content from three sprawling SKILL.md files into sibling `EXAMPLES.md` files so the prompt loaded at invocation time stays scannable; (c) cross-link the new skill from `de-slop` and `tdd` (cross-plugin) so the procedural skills feel earned rather than imposed. Source: `research/research-karpathy-skills-learnings.md`. Plan: `plans/karpathy-skills-improvements.md`.

## [1.13.0] - 2026-04-18

### Changed
- `commands/debug.md` rewritten for Opus 4.7 (326 → 175 lines). Stripped `CRITICAL: Route Selection` caps wall and "WORKING CONSTRAINTS" rule-list in favor of reasoned prose; collapsed `Step 1–3` scaffolding into role + hypothesis loop + single cleanup invariant; dropped "think like a senior dev" compensation.
- `skills/autoresearch/SKILL.md` rewritten for Opus 4.7 (new skill, aligned with the 4.7 principles doc before first release). `Step 1–7` numbered scaffolding replaced with a goal + explicit termination criteria; `Do NOT skip` / `Never stop` / `NEVER STOP` rule-barks replaced with reasoned justification for autonomous runs; `CRITICAL` / `RED` / `YELLOW` caps inlined as severity reasoning; scope made explicit for eval fan-out.
- `skills/ask-oracle/SKILL.md` surgical pass: `Step 1–6` numbered workflow flattened into prose, preview/execute flow clarified, "Best Practices" rule-list rewritten with inline reasoning, "When NOT to Use" bullet-list reframed.
- `skills/worktree/SKILL.md` surgical pass: `Step 1–7` labels replaced with action names; error-handling table gained a `Why` column explaining each recovery choice.
- `skills/principal-hierarchy-audit/SKILL.md` surgical pass: numbered-workflow labels reframed as action names; Detection Patterns rule-list rewritten with inline reasoning so readers can extend the pattern library from first principles rather than keyword-matching.
- `skills/check-env-keys/SKILL.md` surgical pass: scope stated explicitly (check every source before reporting missing), prose tightened.
- `skills/avoid-feature-creep/SKILL.md` surgical pass: compensation phrase softened in the AI-agent-directed template.
- `commands/worktree.md` rewritten (49 → 34 lines) as a clean wrapper around `primitives:worktree` skill with explicit trust-the-tool framing.

### Rationale

Opus 4.7 is more literal, reasons more and earlier, and trends toward fewer tool calls than 4.5/4.6. Scaffolding that nudged earlier models ("think step by step", caps-walls, numbered mandatory sequences) now produces over-triggering or suppressed reasoning on 4.7. Canonical principles captured in `sdlc-plugin/OPUS_4_7_PROMPTING.md`; two of that document's reference templates (`skills/de-slop` and `skills/prompt-as-onboarding`) already live in this plugin. This release aligns the rest.

## [1.12.0] - 2026-02-28

### Changed

- **`de-slop` skill** — integrated `desloppify` CLI as primary workflow
  - Runs `uvx desloppify scan` for quantitative "strict score" before/after
  - Uses `uvx desloppify next` iterative fix loop: directed file-by-file fixes with resolve commands
  - Follows agent instructions from desloppify output verbatim (no augmentation)
  - LLM-based pattern detection retained as fallback when desloppify unavailable
  - Uses `uvx` (UV toolchain) throughout — no pip

### Changed (sdlc-plugin)

- **`/implement` command** — added non-blocking de-slop gate after change walkthrough
  - Runs `uvx desloppify scan --path .` and reports strict score
  - Offers "Fix now or later?" when issues found
  - Skips silently if desloppify unavailable

## [1.11.1] - 2026-02-10

### Fixed

- **`/debug --swarm` routing** — replaced advisory "Argument Parsing" + "Mode Selection" sections with imperative "CRITICAL: Route Selection" gate that forces immediate branching before any workflow steps execute
  - Moved Interview Checkpoint into each workflow independently (was floating between gate and workflows, causing LLM to skip routing)
  - Reordered document: Swarm Workflow now appears before Standard Workflow to prevent top-to-bottom execution bias

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
