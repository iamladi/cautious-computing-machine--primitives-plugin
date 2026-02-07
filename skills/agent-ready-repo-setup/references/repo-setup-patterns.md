# Agent-Ready Repository Setup Patterns

## Root-Level Documentation Template

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

## TypeScript Strict Configuration

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

## Vertical Slice Architecture

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

## Structured Logging (Pino)

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

## Machine-Parseable Test Output

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

## Type-Safe Environment Variables

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

## Pre-commit Hooks

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

## Claude Code Hooks (Optional)

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

## MCP Integration

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

## Setup Checklist

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

## Anti-Patterns

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
