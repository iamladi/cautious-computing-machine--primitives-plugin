# Changelog

All notable changes to the Primitives Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
