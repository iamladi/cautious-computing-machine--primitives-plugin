---
name: agent-ready-repo-setup
description: |
  Set up repositories optimized for AI agent collaboration and autonomous coding.
  Use when starting a new project, making repo "agent-ready" or "AI-friendly",
  setting up CLAUDE.md/AGENTS.md, configuring structured logging, adding pre-commit hooks,
  or organizing code for agent navigation.
---

# Agent-Ready Repository Setup

## Priorities
Agent navigability > Type safety > Convention consistency

## Goal
Configure a repository for optimal AI agent collaboration: documentation, TypeScript strict mode, vertical slice architecture, structured logging, machine-parseable tests, and CI/CD.

## Constraints
- AGENTS.md or CLAUDE.md at root is the highest-impact file — lead with commands, not explanations
- TypeScript strict mode with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
- Vertical slice architecture (organize by feature, not by layer)
- Structured logging (Pino) with JSON output, correlation IDs, redaction, success AND failure
- Machine-parseable test output (JUnit XML)
- Type-safe environment variables (Zod schema, fail-fast at startup)
- Pre-commit hooks (Husky + lint-staged)
- Load detailed setup patterns and templates from reference

## Output
Report each setup step completed. Run verification checks. List any items that need manual attention.

## References
Load setup patterns and templates:
- `Glob(pattern: "**/primitives/**/references/repo-setup-patterns.md", path: "~/.claude/plugins")` → Read result
