---
name: agent-native-architecture
description: Build AI agents using prompt-native architecture where features are defined in prompts, not code. Use for creating autonomous agents, designing MCP servers, implementing self-modifying systems, or adopting the "trust the agent's intelligence" philosophy.
---

# Agent-Native Architecture

## Priorities
Capability parity (agent = user) > Prompt-native design > Code minimalism

## Goal
Guide users in building prompt-native agent systems where features are prompts defining outcomes, tools are primitives enabling capability, and agents figure out HOW to achieve goals.

## Constraints
- Present intake menu first, wait for user response before proceeding
- Route to the correct reference file based on user's topic selection
- After reading a reference, apply those patterns to the user's specific context
- Use the architecture checklist when designing new systems

## Foundational Principles

**Features are prompts**: Each feature defines an outcome + tools. The agent decides HOW.

**Tools provide capability, not behavior**: Primitives (read, write, store, call API) — not workflow functions.

**Development lifecycle**: Start in prompt → iterate rapidly → graduate to code when stable.

**Self-modification** (advanced): Agents that evolve their own code/prompts. Requires approval gates, auto-commit before changes, health checks after, build verification.

**When NOT prompt-native**: High-frequency ops, deterministic requirements, cost-prohibitive scenarios.

## Intake

What aspect of agent-native architecture do you need help with?

1. **Design architecture** — Plan a new prompt-native agent system
2. **Create MCP tools** — Build primitive tools following the philosophy
3. **Write system prompts** — Define agent behavior in prompts
4. **Self-modification** — Enable agents to safely evolve themselves
5. **Review/refactor** — Make existing code more prompt-native
6. **Context injection** — Inject runtime app state into agent prompts
7. **Action parity** — Ensure agents can do everything users can do
8. **Shared workspace** — Set up agents and users in the same data space
9. **Testing** — Test agent-native apps for capability and parity
10. **Mobile patterns** — Handle background execution, permissions, cost
11. **API integration** — Connect to external APIs (HealthKit, HomeKit, GraphQL)
12. **Anti-patterns** — Learn what NOT to do

**Wait for response before proceeding.**

## Routing

| Response | Action |
|----------|--------|
| 1, "design", "architecture", "plan" | Read [architecture-patterns.md](./references/architecture-patterns.md), then apply Architecture Checklist |
| 2, "tool", "mcp", "primitive" | Read [mcp-tool-design.md](./references/mcp-tool-design.md) |
| 3, "prompt", "system prompt", "behavior" | Read [system-prompt-design.md](./references/system-prompt-design.md) |
| 4, "self-modify", "evolve", "git" | Read [self-modification.md](./references/self-modification.md) |
| 5, "review", "refactor", "existing" | Read [refactoring-to-prompt-native.md](./references/refactoring-to-prompt-native.md) |
| 6, "context", "inject", "runtime", "dynamic" | Read [dynamic-context-injection.md](./references/dynamic-context-injection.md) |
| 7, "parity", "ui action", "capability map" | Read [action-parity-discipline.md](./references/action-parity-discipline.md) |
| 8, "workspace", "shared", "files", "filesystem" | Read [shared-workspace-architecture.md](./references/shared-workspace-architecture.md) |
| 9, "test", "testing", "verify", "validate" | Read [agent-native-testing.md](./references/agent-native-testing.md) |
| 10, "mobile", "ios", "android", "background" | Read [mobile-patterns.md](./references/mobile-patterns.md) |
| 11, "api", "healthkit", "homekit", "graphql", "external" | Read [mcp-tool-design.md](./references/mcp-tool-design.md) (Dynamic Capability Discovery section) |
| 12, "anti-pattern", "mistake", "wrong" | Read [anti-patterns.md](./references/anti-patterns.md) |

**After reading the reference, apply those patterns to the user's specific context.**

## Architecture Checklist

When designing an agent-native system, verify before implementation:

### Tool Design
- [ ] Dynamic vs Static: External APIs where agent should have full access → Dynamic Capability Discovery
- [ ] CRUD Completeness: Every entity has create, read, update, AND delete
- [ ] Primitives not Workflows: Tools enable capability, don't encode business logic
- [ ] API as Validator: Use `z.string()` inputs when the API validates, not `z.enum()`

### Action Parity
- [ ] Capability Map: Every UI action has a corresponding agent tool
- [ ] Edit/Delete: If UI can edit or delete, agent must too
- [ ] The Write Test: "Write something to [app location]" must work for all locations

### UI Integration
- [ ] Agent → UI: Define how agent changes reflect in UI
- [ ] No Silent Actions: Agent writes trigger UI updates immediately
- [ ] Capability Discovery: Users can learn what agent can do

### Context Injection
- [ ] Available Resources: System prompt includes what exists
- [ ] Available Capabilities: System prompt documents what agent can do
- [ ] Dynamic Context: Context refreshes for long sessions

### Mobile (if applicable)
- [ ] Background Execution: Checkpoint/resume for iOS app suspension
- [ ] Permissions: Just-in-time permission requests in tools
- [ ] Cost Awareness: Model tier selection

## Quick Start

Build a prompt-native agent in three steps:

**Step 1: Define primitive tools**
```typescript
const tools = [
  tool("read_file", "Read any file", { path: z.string() }, ...),
  tool("write_file", "Write any file", { path: z.string(), content: z.string() }, ...),
  tool("list_files", "List directory", { path: z.string() }, ...),
];
```

**Step 2: Write behavior in the system prompt**
```markdown
## Your Responsibilities
When asked to organize content, you should:
1. Read existing files to understand the structure
2. Analyze what organization makes sense
3. Create appropriate pages using write_file
4. Use your judgment about layout and formatting
```

**Step 3: Let the agent work**
```typescript
query({
  prompt: userMessage,
  options: { systemPrompt, mcpServers: { files: fileServer }, permissionMode: "acceptEdits" }
});
```

## Success Criteria

**Core**: Agent figures out HOW; features are prompts; tools are primitives; behavior changes via prose.

**Tools**: Dynamic Capability Discovery for external APIs; full CRUD; API validates inputs.

**Agent-Native**: Dynamic context in system prompt; action parity with UI; shared workspace; immediate UI reflection; capability discovery.

## Output
Specific architectural guidance, code examples, and checklist results applied to the user's context. Reference the appropriate reference file for deep details.

## References
All references in `references/`:
- [architecture-patterns.md](./references/architecture-patterns.md)
- [mcp-tool-design.md](./references/mcp-tool-design.md)
- [system-prompt-design.md](./references/system-prompt-design.md)
- [self-modification.md](./references/self-modification.md)
- [refactoring-to-prompt-native.md](./references/refactoring-to-prompt-native.md)
- [dynamic-context-injection.md](./references/dynamic-context-injection.md)
- [action-parity-discipline.md](./references/action-parity-discipline.md)
- [shared-workspace-architecture.md](./references/shared-workspace-architecture.md)
- [agent-native-testing.md](./references/agent-native-testing.md)
- [mobile-patterns.md](./references/mobile-patterns.md)
- [anti-patterns.md](./references/anti-patterns.md)
