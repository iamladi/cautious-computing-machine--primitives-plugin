# Agent-Native Anti-Patterns

## The Core Anti-Pattern: Agent Executes Your Code

The most common mistake: writing workflow code and having the agent call it, instead of defining outcomes and letting the agent figure out HOW.

```typescript
// WRONG - You wrote the workflow, agent just executes it
tool("process_feedback", async ({ message }) => {
  const category = categorize(message);      // Your code
  const priority = calculatePriority(message); // Your code
  await store(message, category, priority);   // Your code
  if (priority > 3) await notify();           // Your code
});

// RIGHT - Agent figures out how to process feedback
tool("store_item", { key, value }, ...);  // Primitive
tool("send_message", { channel, content }, ...);  // Primitive
// Prompt says: "Rate importance 1-5 based on actionability, store feedback, notify if >= 4"
```

## Don't Artificially Limit Agent Capabilities

If a user could do it, the agent should be able to do it.

```typescript
// WRONG - limiting agent capabilities
tool("read_approved_files", { path }, async ({ path }) => {
  if (!ALLOWED_PATHS.includes(path)) throw new Error("Not allowed");
  return readFile(path);
});

// RIGHT - give full capability, use guardrails appropriately
tool("read_file", { path }, ...);  // Agent can read anything
// Use approval gates for writes, not artificial limits on reads
```

## Don't Encode Decisions in Tools

```typescript
// Wrong - tool decides format
tool("format_report", { format: z.enum(["markdown", "html", "pdf"]) }, ...)

// Right - agent decides format via prompt
tool("write_file", ...) // Agent chooses what to write
```

## Don't Over-Specify in Prompts

```markdown
// Wrong - micromanaging the HOW
When creating a summary, use exactly 3 bullet points,
each under 20 words, formatted with em-dashes...

// Right - define outcome, trust intelligence
Create clear, useful summaries. Use your judgment.
```

## Agent-Native Anti-Patterns

### Context Starvation

Agent doesn't know what resources exist in the app.
```
User: "Write something about Catherine the Great in my feed"
Agent: "What feed? I don't understand what system you're referring to."
```
Fix: Inject available resources, capabilities, and vocabulary into the system prompt at runtime.

### Orphan Features

UI action with no agent equivalent.
```swift
// UI has a "Publish to Feed" button
Button("Publish") { publishToFeed(insight) }
// But no agent tool exists to do the same thing
```
Fix: Add corresponding tool and document in system prompt for every UI action.

### Sandbox Isolation

Agent works in separate data space from user.
```
Documents/
├── user_files/        ← User's space
└── agent_output/      ← Agent's space (isolated)
```
Fix: Use shared workspace where both agent and user operate on the same files.

### Silent Actions

Agent changes state but UI doesn't update.
```typescript
// Agent writes to database
await db.insert("feed", content);
// But UI doesn't observe this table - user sees nothing
```
Fix: Use shared data stores with reactive binding, or file system observation.

### Capability Hiding

Users can't discover what agents can do.
```
User: "Help me with my reading"
Agent: "What would you like help with?"
// Agent doesn't mention it can publish to feed, research books, etc.
```
Fix: Include capability hints in agent responses or provide onboarding.

### Static Tool Mapping

Building individual tools for each API endpoint when you want the agent to have full access.
```typescript
// You built 50 tools for 50 HealthKit types
tool("read_steps", ...)
tool("read_heart_rate", ...)
tool("read_sleep", ...)
// When glucose tracking is added... code change required
// Agent can only access what you anticipated
```
Fix: Use Dynamic Capability Discovery - one `list_*` tool to discover what's available, one generic tool to access any type. See [mcp-tool-design.md](./mcp-tool-design.md). (Note: Static mapping is fine for constrained agents with intentionally limited scope.)

### Incomplete CRUD

Agent can create but not update or delete.
```typescript
// ❌ User: "Delete that journal entry"
// Agent: "I don't have a tool for that"
tool("create_journal_entry", ...)
// Missing: update_journal_entry, delete_journal_entry
```
Fix: Every entity needs full CRUD (Create, Read, Update, Delete). The CRUD Audit: for each entity, verify all four operations exist.
