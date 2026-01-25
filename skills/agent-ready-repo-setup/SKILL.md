---
name: agent-ready-repo-setup
description: |
  Set up repositories optimized for AI agent collaboration and autonomous coding.
  Use when: (1) starting a new project, (2) user asks to make repo "agent-ready" or
  "AI-friendly", (3) setting up CLAUDE.md/AGENTS.md, (4) configuring structured logging,
  (5) adding pre-commit hooks for code quality, (6) organizing code for agent navigation.
  Covers TypeScript strict mode, vertical slice architecture, Pino logging, Vitest
  configuration, feedback loops, and MCP integration.
author: HAL (synthesized from deep research)
version: 1.0.0
date: 2026-01-25
tags: [repository, setup, ai-agents, claude-code, typescript, architecture]
---

# Agent-Ready Repository Setup

## Problem

AI coding agents work dramatically better in well-structured repositories. Without proper
setup, agents guess incorrectly, generate low-quality code, can't debug effectively, and
waste context on navigation. This skill provides the essential patterns for repositories
that maximize agent productivity.

## Context / Trigger Conditions

Use this skill when:
- Starting a new project from scratch
- User mentions making a repo "agent-ready", "AI-friendly", or "optimized for Claude"
- Setting up documentation (CLAUDE.md, AGENTS.md, ARCHITECTURE.md)
- Configuring logging, testing, or CI/CD for a new project
- Refactoring a project to be more agent-navigable
- User asks about vertical slice architecture or feature organization

## Solution

### 1. Root-Level Documentation

Create these essential files:

**AGENTS.md or CLAUDE.md** (the most critical file):
```markdown
# Project Name

## Tech Stack
- Runtime: Bun 1.x
- Language: TypeScript (strict mode)
- Framework: [e.g., Next.js 15]
- Testing: Vitest
- Logging: Pino

## Build Commands
```bash
bun install
bun run build
bun run dev
bun test
```

## Code Style
- Use interfaces for object shapes
- Prefer explicit types on function parameters
- Write tests for all public APIs
- Use discriminated unions for complex state

## Testing
Run `bun test`. All tests must pass before commit.

## Commit Guidelines
Conventional commits: `type: description`
Types: feat, fix, docs, refactor, test, chore

## Security
- Never log sensitive data
- All API keys in environment variables
- Use Zod for runtime validation
```

**Key principle**: Lead with commands, not explanations. Be concrete with paths, tools, versions.

### 2. TypeScript Strict Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Why**: Agents work 25% better with strict typing. Type signatures serve as documentation.

### 3. Vertical Slice Architecture

Organize by feature, not by layer:

```
src/
├── features/
│   ├── checkout/           # Self-contained feature
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── tests/
│   └── products/
├── shared/                 # Cross-feature utilities
└── lib/                    # External integrations
```

**Why**: Agents navigate better when related code is co-located. Layered architecture forces cross-file navigation that wastes context.

### 4. Structured Logging (Pino)

```typescript
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: ['*.password', '*.apiKey', '*.secret', 'req.headers.authorization'],
    censor: '[REDACTED]',
  },
});

// Always log both success AND failure
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

**Key patterns**:
- JSON output for machine parsing
- Correlation IDs for request tracing
- Automatic redaction for secrets
- Success AND failure logging (agents need both)

### 5. Machine-Parseable Test Output

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    reporters: ['verbose', 'junit'],
    outputFile: { junit: './test-results/junit.xml' },
    includeTaskLocation: true,  // For agent debugging
  }
});
```

**White-box testing for agent introspection**:
```typescript
// Expose internals for debugging
export const __test__ = {
  _parseToken: parseToken,
  _validateSignature: validateSignature,
};
```

### 6. Type-Safe Environment Variables

```typescript
// env.ts
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().min(1000).max(65535),
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  API_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);  // Fail fast at startup
```

### 7. Pre-commit Hooks

```json
// package.json
{
  "scripts": { "prepare": "husky install" },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### 8. Claude Code Hooks (Optional)

`.claude/settings.json`:
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.file_path' | { read f; if echo \"$f\" | grep -q '.env'; then exit 2; fi; }"
      }]
    }],
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.file_path' | { read f; if echo \"$f\" | grep -q '\\.ts$'; then bunx prettier --write \"$f\"; fi; }"
      }]
    }]
  }
}
```

### 9. MCP Integration

`.mcp.json`:
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

## Checklist

### Documentation
- [ ] AGENTS.md or CLAUDE.md at root
- [ ] ARCHITECTURE.md with directory structure
- [ ] README.md with quick start
- [ ] .env.example with all required variables

### Type System
- [ ] TypeScript with strict mode
- [ ] Zod for runtime validation
- [ ] Explicit types on function parameters
- [ ] Discriminated unions for complex state

### Testing
- [ ] Vitest or Jest configured
- [ ] JUnit XML output for CI
- [ ] Test fixtures with cleanup
- [ ] `__test__` exports for white-box testing

### Logging
- [ ] Pino or structured logger
- [ ] Correlation IDs for requests
- [ ] Redaction for sensitive fields
- [ ] Success AND failure logging

### SDLC
- [ ] Pre-commit hooks (Husky + lint-staged)
- [ ] GitHub Actions CI workflow
- [ ] Conventional commits configured
- [ ] Issue and PR templates

### Structure
- [ ] Vertical slice architecture
- [ ] Clear feature boundaries
- [ ] Consistent naming conventions
- [ ] Co-located tests

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Deep layering | Forces cross-file navigation | Use vertical slices |
| Missing types | Agents guess incorrectly | Enable strict TypeScript |
| Scattered features | Hard to understand scope | Co-locate related code |
| Only error logging | Agents can't see success | Log success AND failure |
| Context pollution | Long conversations lose intent | Fresh starts, session recaps |

## Verification

After setup, verify:
1. `bun run typecheck` passes with no errors
2. `bun test` produces JUnit XML output
3. Logs appear in JSON format with structured fields
4. Pre-commit hooks run on staged files
5. AGENTS.md contains concrete commands, not explanations

## Notes

- **Vertical slice > layered architecture**: Research shows agents navigate vertical slices dramatically better
- **AGENTS.md is critical**: Over 20,000 repos have adopted this standard; it's the single highest-impact file
- **62% of AI-generated code has flaws**: Without strict typing and testing, quality drops significantly
- **MCP is the standard**: Model Context Protocol is now the de facto standard for agent tool integration

## References

- [AGENTS.md Official Site](https://agents.md/)
- [How to write a great agents.md - GitHub Blog](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [Claude Code Best Practices - Anthropic](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Testing Pyramid for AI Agents - Block Engineering](https://engineering.block.xyz/blog/testing-pyramid-for-ai-agents)
- [Context Engineering - Spotify Engineering](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2)
- [Pino Logger Guide](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/)
