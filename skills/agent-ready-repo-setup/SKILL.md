---
name: agent-ready-repo-setup
description: |
  Set up repositories optimized for AI agent collaboration and autonomous coding.
  Use when starting a new project, making repo "agent-ready" or "AI-friendly",
  setting up CLAUDE.md/AGENTS.md, configuring structured logging, adding pre-commit
  hooks, or organizing code for agent navigation.
---

# Agent-Ready Repository Setup

## Priorities

```
Agent navigability > Type safety > Convention consistency
```

## Goal

Create repositories where AI agents can work autonomously with minimal guidance. Design choices optimize for agent collaboration: rapid navigation, self-verification, and debugging without visual inspection.

## Context / Trigger Conditions

Use this skill when:
- Starting a new project from scratch
- User mentions making a repo "agent-ready", "AI-friendly", or "optimized for Claude"
- Setting up documentation (CLAUDE.md, AGENTS.md, ARCHITECTURE.md)
- Configuring logging, testing, or CI/CD for a new project
- Refactoring a project to be more agent-navigable
- User asks about vertical slice architecture or feature organization

## Reasoning-Based Principles

### 1. Why Root Documentation Matters

**Principle**: Agents cannot scan files to infer conventions — provide explicit, executable reference at the root.

**What to document**: Tech stack with versions, build commands, code style, testing requirements.

**AGENTS.md over README.md**: README is explanatory; AGENTS.md is imperative and command-focused.

**Example**:
```markdown
## Build Commands
bun install && bun run build && bun run dev && bun test

## Code Style
- Use interfaces for object shapes
- Prefer explicit types on function parameters
- Write tests for all public APIs
```

**Adaptation**: New projects get full AGENTS.md; existing repos document current state and propose improvements separately.

### 2. Why Strict Type Systems Help Agents

**Principle**: Agents generate code without visual inspection — shift errors left to compile time for immediate tooling feedback.

**TypeScript strict mode** catches errors before runtime: `noUncheckedIndexedAccess` forces handling undefined, `exactOptionalPropertyTypes` prevents property bugs, `noImplicitOverride` catches inheritance mistakes.

**Why this helps agents**: `items[0].name` gets immediate `tsc` feedback requiring `items[0]?.name`, catching bugs without running code.

**Example** (TypeScript):
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

**Adaptation**: Enable from day one for new projects; use `mypy --strict` (Python) or JSDoc `@ts-check` (JavaScript); enable per-module for existing repos.

### 3. Why Architecture Affects Agent Navigation

**Principle**: Agents navigate via file paths and grep, building mental models from structure — vertical slices co-locate related code to reduce navigation.

**Layered** (MVC): `src/models/`, `controllers/`, `views/` separate by type

**Vertical slice**: `src/features/checkout/` contains api/, components/, hooks/, types.ts, tests/

**Why vertical slices help agents**: Co-location reduces navigation, clear feature boundaries, reduced context pollution, tests alongside implementation.

**When layered makes sense**: Libraries/frameworks where layers ARE product boundaries.

**Adaptation**: Default to vertical slices for new projects; add incrementally in existing layered codebases; architecture matters less in small projects (<10 files).

### 4. Why Structured Logging Helps Agents Debug

**Principle**: Agents diagnose failures from log history, not debuggers — emit machine-parseable JSON with context for post-hoc debugging.

**Critical patterns**: Log success AND failure, correlation IDs for tracing, structured context (`{ orderId, operation, status }`), automatic redaction.

**Example** (Pino for Node.js):
```typescript
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: ['*.password', '*.apiKey', '*.secret', 'req.headers.authorization'],
    censor: '[REDACTED]',
  },
});

async function processOrder(orderId: string) {
  const log = logger.child({ orderId, operation: 'processOrder' });
  log.info({ status: 'started' }, 'Processing order');

  try {
    const order = await db.orders.process(orderId);
    log.info({ status: 'completed', success: true }, 'Order processed');
    return order;
  } catch (error) {
    log.error({ status: 'failed', success: false, error: error.message }, 'Order failed');
    throw error;
  }
}
```

**Why this helps agents**: Grep by `orderId` for full execution timeline; structured fields enable programmatic filtering.

**Adaptation**: Set up from day one for new projects; migrate high-traffic paths first for existing; libraries expose events/hooks, not logs.

### 5. Why Machine-Parseable Test Output Matters

**Principle**: Agents verify work by parsing test results, not visually scanning terminal — emit JUnit XML, TAP, or JSON for programmatic parsing.

**Why JUnit XML**: Industry standard; agents extract pass/fail, failure messages, stack traces, test locations.

**Example** (Vitest):
```typescript
export default defineConfig({
  test: {
    reporters: ['verbose', 'junit'],
    outputFile: { junit: './test-results/junit.xml' },
    includeTaskLocation: true,  // Adds file:line to XML for agent navigation
  }
});
```

**White-box testing pattern**:
```typescript
function parseToken(token: string) { /* ... */ }
function validateSignature(sig: string) { /* ... */ }

export function authenticate(token: string) {
  const parsed = parseToken(token);
  validateSignature(parsed.signature);
  return parsed;
}

export const __test__ = {
  _parseToken: parseToken,
  _validateSignature: validateSignature,
};
```

**Why this helps agents**: When `authenticate()` fails, write targeted tests for `__test__._parseToken()` to isolate failure.

**Adaptation**: Configure from day one for new projects; add reporters alongside existing ones (most frameworks support JUnit XML).

### 6. Why Runtime Validation Helps Agents

**Principle**: Agents trust data shapes they cannot verify — fail fast at startup with clear errors, not at runtime with cryptic failures.

**Example** (Zod for environment variables):
```typescript
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().min(1000).max(65535),
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  API_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);  // Crash immediately if invalid
```

**Why this helps agents**: Missing `DATABASE_URL` produces clear "Expected string, received undefined" instead of cryptic runtime errors.

**Adaptation**: Validate env vars at startup for new projects; add incrementally for critical paths in existing.

### 7. Why Pre-commit Hooks Help Agents

**Principle**: Agents might commit formatting/linting errors without feedback — automate quality checks before commits reach version control.

**Example** (Husky + lint-staged):
```json
{
  "scripts": { "prepare": "husky install" },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

**Why this helps agents**: Agent runs `git commit`, hooks auto-fix formatting/linting errors.

**Adaptation**: Set up from day one for new projects; introduce incrementally for existing.

### 8. Why MCP Integration Extends Agent Capabilities

**Principle**: Agents have limited built-in tools — use Model Context Protocol (MCP) to standardize external integrations (docs, databases, APIs, web research).

**Example** (`.mcp.json`):
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["@upstash/context7-mcp@latest"]
    }
  }
}
```

**Why this helps agents**: Query Context7 for current API docs instead of guessing from training data.

**Adaptation**: Add for critical integrations (docs, databases) in new projects; integrate when agents struggle with information gaps in existing.

## Implementation Approach

### For New Projects

Start with highest-impact items:
1. **AGENTS.md/CLAUDE.md**: Highest-impact file. Make it concrete and command-focused.
2. **Strict typing**: Enable from day one
3. **Structured logging**: Set up logger utility before business logic
4. **Test output format**: Configure in test runner setup
5. **Pre-commit hooks**: Add after initial code works

### For Existing Projects

Incremental adoption: Document current state in AGENTS.md, then propose improvements. Add typing per-file/module. Migrate logging starting with high-traffic paths. Respect existing tools (Winston vs Pino) — document, don't force changes.

### For Non-TypeScript Projects

**Python**: mypy strict mode, Pydantic, structlog, pytest with JUnit XML
**Go**: Strict compilation (default), slog, table-driven tests
**Ruby**: Sorbet, semantic_logger, RSpec with JUnit formatter

## Verification

After setup, verify:
1. **Type checking passes**: `bun run typecheck` runs clean
2. **Tests produce parseable output**: Confirm JUnit XML exists
3. **Logs are structured**: Run test operation, verify JSON output
4. **Pre-commit hooks work**: Make formatting error, attempt commit, verify auto-fix

## Anti-Patterns to Avoid

| Anti-Pattern | Reasoning-Based Alternative |
|--------------|----------------------------|
| Deep layered architecture | Vertical slices co-locate related code |
| Missing/loose types | Strict typing catches errors at compile time |
| Only error logging | Log success and failure with structured fields |
| Free-form log strings | Structured JSON with correlation IDs |
| Manual pre-commit checks | Automated hooks enforce consistency |

## Edge Cases and Adaptations

**Existing conventions**: Document current patterns in AGENTS.md, propose improvements separately.

**Non-TypeScript projects**: Adapt principles (strict typing → mypy/sorbet, Pino → structlog/slog).

**Small projects (<10 files)**: Focus on documentation and type safety over architecture.

**Libraries vs applications**: Different patterns (no logging, more white-box testing, broader type constraints).

**Tool disagreement**: Document what exists; agents work with any tool if configuration is clear.

## Notes

- **Vertical slice architecture**: Agents navigate feature-based organization significantly better than layered architecture
- **AGENTS.md adoption**: Widely adopted as the highest-impact documentation file for agent collaboration
- **Agent-generated code quality**: Strict typing and testing substantially improve code quality
- **MCP standardization**: Model Context Protocol is the de facto standard for agent tool integration

## References

- [AGENTS.md Official Site](https://agents.md/)
- [How to write a great agents.md - GitHub Blog](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [Claude Code Best Practices - Anthropic](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Testing Pyramid for AI Agents - Block Engineering](https://engineering.block.xyz/blog/testing-pyramid-for-ai-agents)
- [Context Engineering - Spotify Engineering](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2)
- [Pino Logger Guide](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/)
