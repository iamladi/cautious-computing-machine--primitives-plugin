# agent-native-architecture — Examples

Anti-pattern ❌/✅ pairs for the principles, checklist, and routing in
[`SKILL.md`](./SKILL.md). Each pair illustrates a positive rule already
stated in `SKILL.md`; this file is the depth material.

---

## The Cardinal Sin — Agent executes your code instead of figuring things out

Stated as the positive rule *Tools Provide Capability, Not Behavior* in
`SKILL.md`. The most common mistake: writing workflow code and having the
agent call it, instead of defining outcomes and letting the agent figure
out HOW.

❌ **Wrong** — you wrote the workflow, agent just executes it.

```typescript
tool("process_feedback", async ({ message }) => {
  const category = categorize(message);        // Your code
  const priority = calculatePriority(message); // Your code
  await store(message, category, priority);    // Your code
  if (priority > 3) await notify();            // Your code
});
```

✅ **Right** — agent figures out how to process feedback.

```typescript
tool("store_item", { key, value }, ...);          // Primitive
tool("send_message", { channel, content }, ...);  // Primitive
// Prompt: "Rate importance 1–5 based on actionability, store feedback,
// notify if >= 4"
```

---

## Don't artificially limit agent capabilities

Stated as the positive rule *Whatever the user can do, the agent can do*
in `SKILL.md`.

❌ **Wrong** — limiting agent capabilities at the tool layer.

```typescript
tool("read_approved_files", { path }, async ({ path }) => {
  if (!ALLOWED_PATHS.includes(path)) throw new Error("Not allowed");
  return readFile(path);
});
```

✅ **Right** — give full capability; use approval gates for writes, not
artificial limits on reads.

```typescript
tool("read_file", { path }, ...);  // Agent can read anything
```

---

## Don't encode decisions in tools

The tool exposes capability; the prompt picks the form.

❌ **Wrong** — tool decides format.

```typescript
tool("format_report", { format: z.enum(["markdown", "html", "pdf"]) }, ...)
```

✅ **Right** — agent decides format via prompt.

```typescript
tool("write_file", ...) // Agent chooses what to write
```

---

## Don't over-specify in prompts

Define the outcome; let the agent pick the HOW.

❌ **Wrong** — micromanaging the HOW.

```markdown
When creating a summary, use exactly 3 bullet points,
each under 20 words, formatted with em-dashes...
```

✅ **Right** — define outcome, trust the agent's judgment.

```markdown
Create clear, useful summaries. Use your judgment.
```

---

## Context Starvation

Stated as the positive rule *Available Resources / Available Capabilities
in the system prompt* in the Architecture Checklist.

❌ **Wrong** — agent doesn't know what resources exist.

```
User: "Write something about Catherine the Great in my feed"
Agent: "What feed? I don't understand what system you're referring to."
```

✅ **Right.** Inject available resources, capabilities, and vocabulary
into the system prompt at runtime.

---

## Orphan Features

Stated as the positive rule *Capability Map: every UI action has a
corresponding agent tool* in the Architecture Checklist.

❌ **Wrong** — UI action with no agent equivalent.

```swift
// UI has a "Publish to Feed" button
Button("Publish") { publishToFeed(insight) }
// But no agent tool exists to do the same thing
```

✅ **Right.** Add a corresponding tool and document it in the system
prompt for every UI action.

---

## Sandbox Isolation

Stated as the positive rule *Shared Workspace* in the Architecture
Checklist.

❌ **Wrong** — agent works in a separate data space from the user.

```
Documents/
├── user_files/        ← User's space
└── agent_output/      ← Agent's space (isolated)
```

✅ **Right.** Use a shared workspace where both agent and user operate
on the same files.

---

## Silent Actions

Stated as the positive rule *No Silent Actions: agent writes should
trigger UI updates immediately* in the Architecture Checklist.

❌ **Wrong** — agent changes state but UI doesn't update.

```typescript
// Agent writes to database
await db.insert("feed", content);
// But UI doesn't observe this table — user sees nothing
```

✅ **Right.** Use shared data stores with reactive binding, or
file-system observation.

---

## Capability Hiding

Stated as the positive rule *Capability Discovery: users can learn what
the agent can do* in the Architecture Checklist.

❌ **Wrong** — users can't discover what agents can do.

```
User: "Help me with my reading"
Agent: "What would you like help with?"
// Agent doesn't mention it can publish to feed, research books, etc.
```

✅ **Right.** Include capability hints in agent responses or provide
onboarding.

---

## Static Tool Mapping (for agent-native apps)

Stated as the positive rule *Dynamic vs Static* in the Architecture
Checklist. Static mapping is fine for constrained agents with
intentionally limited scope.

❌ **Wrong** — building individual tools per API endpoint when you want
the agent to have full access.

```typescript
// You built 50 tools for 50 HealthKit types
tool("read_steps", ...)
tool("read_heart_rate", ...)
tool("read_sleep", ...)
// When glucose tracking is added… code change required.
// Agent can only access what you anticipated.
```

✅ **Right.** Use Dynamic Capability Discovery — one `list_*` tool to
discover what's available, one generic tool to access any type. See
[`references/mcp-tool-design.md`](./references/mcp-tool-design.md).

---

## Incomplete CRUD

Stated as the positive rule *CRUD Completeness: every entity has create,
read, update, AND delete tools* in the Architecture Checklist.

❌ **Wrong** — agent can create but not update or delete.

```typescript
// User: "Delete that journal entry"
// Agent: "I don't have a tool for that"
tool("create_journal_entry", ...)
// Missing: update_journal_entry, delete_journal_entry
```

✅ **Right.** For each entity, verify all four operations exist (the
CRUD Audit).

---

## Attribution

The ❌/✅ paired-block convention is borrowed from
[`multica-ai/andrej-karpathy-skills`](https://github.com/multica-ai/andrej-karpathy-skills)
(MIT). See [`../karpathy-principles/ATTRIBUTION.md`](../karpathy-principles/ATTRIBUTION.md).
