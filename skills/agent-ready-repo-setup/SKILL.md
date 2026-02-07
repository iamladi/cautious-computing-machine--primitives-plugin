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

Create repositories where AI agents can work autonomously with minimal guidance. The design choices optimize for agent collaboration patterns: rapid navigation, self-verification, and debugging without visual inspection.

## Problem

AI coding agents face unique challenges compared to human developers. They cannot visually scan a directory tree or quickly skim file contents. They work from textual descriptions and must navigate deliberately through file operations. They generate code they cannot visually inspect for correctness. They need structured, parseable feedback to verify their own work.

Without repository design optimized for these constraints, agents waste context on navigation, generate lower-quality code, struggle to debug, and require excessive human guidance.

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

**Agent constraint**: Agents must understand a codebase's conventions before making changes. Unlike humans, they cannot quickly scan multiple files to infer patterns.

**Design principle**: Provide explicit, executable reference at the root level.

**What to document**:
- **Tech stack with versions**: Agents need precise version info to avoid API mismatches. "Next.js" is ambiguous; "Next.js 15.2.1" is actionable.
- **Build commands**: Agents execute commands without a mental model of the toolchain. `bun run build` vs `npm run build` matters.
- **Code style conventions**: Explicit rules like "use interfaces for object shapes" prevent style inconsistency that accumulates across agent sessions.
- **Testing requirements**: "All tests must pass before commit" tells agents when to run tests and how to verify success.

**Why AGENTS.md/CLAUDE.md over README.md**: README targets humans (explanatory, marketing-focused). AGENTS.md targets agents (imperative, command-focused). Lead with "run this" instead of "this project is..."

**Example pattern**:
```markdown
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
```

**Adaptation judgment**:
- New TypeScript projects: Create full AGENTS.md with strict conventions
- Existing repos with established patterns: Document what exists; propose improvements separately
- Non-TypeScript projects: Adapt structure (e.g., Python projects document type hints with mypy, not TypeScript strict mode)

### 2. Why Strict Type Systems Help Agents

**Agent constraint**: Agents generate code without visually inspecting it. Type errors that humans catch by looking are invisible to agents until runtime or compile time.

**Design principle**: Shift errors left to compile time where agents can detect them through tooling feedback.

**TypeScript strict mode** catches entire classes of errors before code runs:
- `noUncheckedIndexedAccess`: Forces agents to handle undefined when accessing arrays/objects by index
- `exactOptionalPropertyTypes`: Prevents subtle bugs from `undefined` vs missing properties
- `noImplicitOverride`: Catches inheritance mistakes in class hierarchies

**Why this matters for agents**: An agent that writes `items[0].name` without checking if `items[0]` exists will produce runtime errors. With `noUncheckedIndexedAccess`, TypeScript forces `items[0]?.name` or explicit length checks. The agent gets immediate feedback from `tsc` without needing to run the code.

**Research evidence**: Studies show agents produce 25% fewer bugs with strict typing compared to permissive configurations. Type signatures act as executable documentation.

**Example configuration** (TypeScript):
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

**Adaptation judgment**:
- TypeScript projects: Enable strict mode from day one
- JavaScript projects: Consider migrating to TypeScript, or use JSDoc with `@ts-check` for gradual typing
- Python projects: Use `mypy --strict` for equivalent benefits
- Existing repos with loose typing: Incrementally enable stricter checks per module rather than all at once

### 3. Why Architecture Affects Agent Navigation

**Agent constraint**: Agents navigate codebases through file paths and grep operations. They build mental models from file structure, not visual IDE layouts.

**Two competing patterns**:

**Layered architecture** (traditional MVC):
```
src/
├── models/
│   ├── User.ts
│   ├── Order.ts
│   └── Product.ts
├── controllers/
│   ├── UserController.ts
│   ├── OrderController.ts
│   └── ProductController.ts
└── views/
    ├── UserView.tsx
    ├── OrderView.tsx
    └── ProductView.tsx
```

**Vertical slice architecture** (feature-based):
```
src/
├── features/
│   ├── checkout/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── tests/
│   └── products/
│       ├── api/
│       └── components/
```

**Why vertical slices help agents**:
1. **Co-location reduces navigation**: To modify checkout flow, agent reads from `features/checkout/` instead of jumping between `models/Order.ts`, `controllers/OrderController.ts`, `views/OrderView.tsx`
2. **Clear feature boundaries**: Agent can reason "this change affects checkout" and stay within that directory
3. **Reduced context pollution**: Agent doesn't need to understand the entire `models/` directory to work on checkout
4. **Easier testing**: Test files live alongside implementation, not in separate `__tests__/` tree

**When layered architecture makes sense**: Libraries and frameworks where architectural layers ARE the product boundaries (e.g., Express middleware, React component libraries).

**Adaptation judgment**:
- New projects: Default to vertical slices unless you're building infrastructure
- Existing layered codebases: Don't rewrite. Add vertical slices incrementally for new features. Document the hybrid pattern in AGENTS.md
- Small projects (<10 files): Architecture matters less; clarity of naming matters more

### 4. Why Structured Logging Helps Agents Debug

**Agent constraint**: Agents cannot attach debuggers or insert `console.log` and re-run code while observing output. They must diagnose failures from log history.

**Design principle**: Emit machine-parseable logs with sufficient context for post-hoc debugging.

**What "structured" means**: JSON output instead of free-form strings. Agents can parse JSON reliably; free-form text requires fragile regex.

**Critical logging patterns**:
1. **Success AND failure logging**: Agents need to know what worked, not just what failed. "Order processed successfully" confirms the happy path.
2. **Correlation IDs**: When debugging multi-step flows, agents need to trace a single request across multiple log entries.
3. **Structured context**: Instead of `"Processing order 123"`, log `{ orderId: "123", operation: "processOrder", status: "started" }`
4. **Automatic redaction**: Agents might log sensitive data unintentionally. Auto-redaction prevents credential leakage.

**Example** (Pino for Node.js):
```typescript
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: ['*.password', '*.apiKey', '*.secret'],
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

**Why this helps agents**: When an agent receives an error report, it can grep logs for `orderId: "123"` and see the full execution timeline. Structured fields like `success: true/false` enable programmatic filtering.

**Tool examples**: Pino (Node.js), structlog (Python), slog (Go). Choose based on ecosystem, not specific tool requirements.

**Adaptation judgment**:
- New projects: Set up structured logging from day one
- Existing projects with console.log: Gradually migrate high-traffic paths first
- Libraries: Avoid logging directly; expose structured events/hooks for consumers to log

### 5. Why Machine-Parseable Test Output Matters

**Agent constraint**: Agents verify their work by running tests and parsing results. They cannot visually scan terminal output for red/green indicators.

**Design principle**: Emit test results in a format agents can parse programmatically (JUnit XML, TAP, JSON).

**Why JUnit XML**: Industry standard supported by all CI systems. Agents can reliably extract:
- Which tests passed/failed
- Failure messages and stack traces
- Test locations (file + line number for debugging)

**Example configuration** (Vitest):
```typescript
export default defineConfig({
  test: {
    reporters: ['verbose', 'junit'],
    outputFile: { junit: './test-results/junit.xml' },
    includeTaskLocation: true,  // Adds file:line to XML for agent navigation
  }
});
```

**Why verbose + junit**: `verbose` for human-readable terminal output, `junit` for agent parsing.

**White-box testing pattern**: Export internal functions for agent debugging.

```typescript
// production code
function parseToken(token: string) { /* ... */ }
function validateSignature(sig: string) { /* ... */ }

export function authenticate(token: string) {
  const parsed = parseToken(token);
  validateSignature(parsed.signature);
  return parsed;
}

// expose internals for testing
export const __test__ = {
  _parseToken: parseToken,
  _validateSignature: validateSignature,
};
```

**Why this helps agents**: When `authenticate()` fails, agent can write targeted tests for `__test__._parseToken()` to isolate the failure. Humans use debuggers; agents use white-box exports.

**Adaptation judgment**:
- New projects: Configure machine-parseable output from day one
- Existing projects: Add reporters alongside existing ones (doesn't break human workflow)
- Any test framework: Most support JUnit XML (pytest, Jest, Go testing, RSpec)

### 6. Why Runtime Validation Helps Agents

**Agent constraint**: Agents trust data shapes they cannot visually verify. Type systems help at compile time, but external data (APIs, user input, env vars) needs runtime validation.

**Design principle**: Fail fast at startup with clear error messages, not at runtime with cryptic failures.

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

**Why this helps agents**: If agent forgets to set `DATABASE_URL`, it gets immediate feedback: "Expected string, received undefined at DATABASE_URL". Compare to runtime error: "Connection failed: getaddrinfo ENOTFOUND undefined".

**Pattern generalizes**: Validate API responses, user input, file uploads. Explicit validation = clear failure modes.

**Tool examples**: Zod (TypeScript), Pydantic (Python), joi (JavaScript). Choose based on ecosystem.

**Adaptation judgment**:
- New projects: Validate environment variables at startup
- Existing projects: Add validation incrementally, starting with critical paths
- Consider validation overhead: Don't validate every internal function call, focus on boundaries (external input, env vars, API responses)

### 7. Why Pre-commit Hooks Help Agents

**Agent constraint**: Agents might commit code with formatting inconsistencies, linting errors, or test failures if they don't receive immediate feedback.

**Design principle**: Automate quality checks that run before commits reach version control.

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

**Why this helps agents**: Agent writes code, runs `git commit`, hooks auto-format and lint, commit includes fixes. Agent doesn't need to remember to run prettier/eslint separately.

**Trade-off**: Hooks slow down commits. Balance automation against friction.

**Adaptation judgment**:
- New projects: Set up hooks from day one
- Existing projects: Introduce incrementally (start with formatting, add linting later)
- Agent-specific consideration: Claude Code supports hooks in `.claude/settings.json` for pre/post tool use validation

### 8. Why MCP Integration Extends Agent Capabilities

**Agent constraint**: Agents have limited built-in tools (Read, Write, Edit, Bash, Grep, Glob). External integrations require custom tooling.

**Design principle**: Use Model Context Protocol (MCP) to standardize external tool integration.

**Example use cases**:
- **Context7**: Up-to-date library documentation (agents don't have post-training docs)
- **Perplexity**: Web research for current information
- **Database tools**: Query/inspect databases without raw SQL in prompts
- **API clients**: Interact with external APIs through structured MCP servers

**Example configuration** (`.mcp.json`):
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

**Why this helps agents**: Instead of asking "what's the API for React Query v5?", agent queries Context7 MCP server and gets current documentation.

**Adaptation judgment**:
- New projects: Add MCP servers for critical integrations (docs, databases)
- Existing projects: Integrate when agents repeatedly struggle with specific information gaps
- Don't over-engineer: Only add MCP servers that provide clear value

## Implementation Approach

### For New Projects

Start with highest-impact items:
1. **AGENTS.md/CLAUDE.md**: Single highest-impact file. Spend time making it concrete and command-focused.
2. **Strict typing**: Enable from day one (easier than retrofitting)
3. **Structured logging**: Set up logger utility before writing business logic
4. **Test output format**: Configure in test runner setup
5. **Pre-commit hooks**: Add after initial code is working

### For Existing Projects

Incremental adoption:
1. **Document first**: Write AGENTS.md describing current state, then propose improvements
2. **Add typing gradually**: Enable strict mode per-file or per-module
3. **Migrate logging**: Start with high-traffic paths, expand over time
4. **Respect existing conventions**: If the team uses different tools (Winston instead of Pino), document those. Don't force tool changes without user agreement.

### For Non-TypeScript Projects

Principles generalize:
- **Python**: mypy strict mode, Pydantic validation, structlog, pytest with JUnit XML
- **Go**: Strict compilation (enabled by default), structured logging with slog, table-driven tests
- **Ruby**: Sorbet for typing, structured logging with semantic_logger, RSpec with JUnit formatter

## Verification

After setup, verify:
1. **Type checking passes**: `bun run typecheck` (or equivalent) runs clean
2. **Tests produce parseable output**: Confirm JUnit XML or equivalent exists
3. **Logs are structured**: Run a test operation, verify JSON output with required fields
4. **Pre-commit hooks work**: Make a deliberate formatting error, attempt commit, verify auto-fix
5. **Documentation is actionable**: Ask someone unfamiliar with the project to follow AGENTS.md commands

## Anti-Patterns to Avoid

| Anti-Pattern | Why It Hurts Agents | Reasoning-Based Alternative |
|--------------|---------------------|----------------------------|
| Deep layered architecture | Forces cross-file navigation that wastes context | Vertical slices co-locate related code for simpler navigation |
| Missing/loose types | Agents guess incorrectly about data shapes | Strict typing catches errors at compile time when agents can't visually inspect |
| Scattered features | Hard to understand scope and boundaries | Feature-based organization makes boundaries explicit |
| Only error logging | Agents can't verify success | Log both success and failure with structured fields |
| Free-form log strings | Agents can't reliably parse | Structured JSON with correlation IDs for programmatic filtering |
| Manual pre-commit checks | Agents forget to run them | Automated hooks enforce consistency |

## Edge Cases and Adaptations

**Existing repo with established conventions**: Don't force rewrites. Document current patterns in AGENTS.md, propose improvements separately.

**Non-TypeScript projects**: Adapt principles (strict typing → mypy/sorbet, Pino → structlog/slog).

**Small projects (<10 files)**: Architecture matters less. Focus on documentation and type safety.

**Libraries vs applications**: Libraries need different patterns (no logging, more white-box testing, broader type constraints).

**Team disagreement on tools**: Document what exists. Agents work with Pino or Winston equally well if configuration is clear.

## Notes

- **Vertical slice architecture**: Research shows agents navigate feature-based organization dramatically better than layered architecture
- **AGENTS.md adoption**: Over 20,000 repositories now use this pattern; it's the single highest-impact documentation file
- **Agent-generated code quality**: Studies show 62% of AI-generated code has flaws without strict typing and testing
- **MCP standardization**: Model Context Protocol is now the de facto standard for agent tool integration

## References

- [AGENTS.md Official Site](https://agents.md/)
- [How to write a great agents.md - GitHub Blog](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [Claude Code Best Practices - Anthropic](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Testing Pyramid for AI Agents - Block Engineering](https://engineering.block.xyz/blog/testing-pyramid-for-ai-agents)
- [Context Engineering - Spotify Engineering](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2)
- [Pino Logger Guide](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/)
