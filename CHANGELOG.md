# Changelog

All notable changes to the Primitives Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
