---
name: ask-oracle
description: This skill should be used when solving hard questions, complex architectural problems, or debugging issues that benefit from GPT-5 Pro or GPT-5.1 thinking models with large file context. Use when standard Claude analysis needs deeper reasoning or extended context windows.
---

# Ask Oracle

## Role

Delegate hard problems to the Oracle CLI (`bunx @steipete/oracle`), which runs GPT-5 Pro or GPT-5.1 with a large-context window (~196k tokens). Use when standard Claude analysis would under-serve the problem — deep debugging across 100k+ LOC, architectural trade-offs that need whole-system context, performance or security reviews where the bug lives in interactions between files, not in any single file.

If the question is answerable with what's already in the conversation, answer directly. Oracle has a real cost (both tokens and wall-clock wait), so reach for it when the extra context genuinely changes the answer.

## Priorities

Context coverage > Cost awareness > Fast turnaround

## What Oracle provides

- **GPT-5 Pro** (default): advanced reasoning for difficult problems.
- **GPT-5.1**: experimental model with a different reasoning posture.
- **File context**: attach directories or individual files, up to ~196k tokens total.
- **Background sessions**: long-running, resumable — the terminal can close without losing work.
- **Token reporting**: `--files-report` shows per-file token costs before committing budget.

## Workflow

### Gather context

Pick files and directories that meaningfully change the answer. For every file you attach, ask whether removing it would degrade the response — if no, drop it.

Usually include:
- Architecture anchors — README, package.json, main entry points.
- Directly relevant source directories.
- Config that shapes behavior — tsconfig, build config.
- Tests that illuminate the problem.
- Error logs or reproduction scripts.

Skip across every attachment set: `node_modules/`, build artifacts (`dist/`, `build/`), vendored code, binaries. These eat token budget for zero signal.

### Pick model and preview

Default to GPT-5 Pro. Reach for GPT-5.1 when a problem has stalled on GPT-5 Pro and you want a different reasoning posture.

Preview before executing — `--preview` validates the run without calling the API, and `--files-report` shows per-file token costs so you can see where the budget goes. Running both together is the safe default:

```bash
bunx @steipete/oracle --prompt "Your question" --file src/ docs/ --files-report --preview
```

If the total exceeds ~196k tokens, trim the least-relevant files, narrow directories to specific subpaths, exclude generated code, or tighten the question to need less context. Getting under budget matters — Oracle rejects oversized requests rather than truncating silently.

### Execute

Drop `--preview` to actually call the model. Set a memorable slug so you can reattach later:

```bash
bunx @steipete/oracle --prompt "Your question" --file src/ docs/ --slug "my-problem"
```

Oracle runs as a background session. The terminal can close.

### Monitor and resume

```bash
bunx @steipete/oracle status                    # list recent sessions (24h)
bunx @steipete/oracle session <slug or id>      # reattach
```

## Key Options

| Option | Purpose | Example |
|--------|---------|---------|
| `--prompt` | The question to ask | `--prompt "Why does this auth flow fail?"` |
| `--file` | Attach files/dirs (repeatable) | `--file src/ docs/ --file error.log` |
| `--slug` | Human-memorable session name | `--slug "perf-optimization-review"` |
| `--model` | Which model to use | `--model gpt-5.1` (default: gpt-5-pro) |
| `--engine` | api or browser | `--engine api` (default: auto-detect) |
| `--files-report` | Show token per file | Helps optimize context |
| `--preview` | Validate without calling API | Test before spending tokens |
| `--dry-run` | Show token estimates only | Safer than preview |
| `--heartbeat` | Progress updates (seconds) | `--heartbeat 30` (default) |

## Common Patterns

### Hard Debugging Question
```bash
bunx @steipete/oracle \
  --prompt "Why does this auth flow fail on mobile? Trace through the code flow." \
  --file src/auth/ src/api/ docs/AUTH.md \
  --slug "mobile-auth-debug" \
  --files-report \
  --preview
```

### Architectural Review
```bash
bunx @steipete/oracle \
  --prompt "Review the state management architecture. What are risks and improvements?" \
  --file src/store/ src/components/ README.md \
  --slug "state-arch-review"
```

### Performance Analysis
```bash
bunx @steipete/oracle \
  --prompt "Where are the performance bottlenecks in this renderer?" \
  --file src/renderer/ performance-logs.txt \
  --slug "renderer-perf" \
  --files-report
```

### Security Review
```bash
bunx @steipete/oracle \
  --prompt "Identify security concerns in the authentication and API layers." \
  --file src/auth/ src/api/ src/middleware/ \
  --slug "security-audit"
```

## Practices that actually help

- **Preview before executing.** `--preview` and `--files-report` together cost nothing and show the token budget. Running blind means you only find out about overage after Oracle has already rejected the request.
- **Ask focused questions.** "Review everything" produces diffuse answers. "Why does the mobile auth flow fail on iOS 17?" produces a trace. Specificity in the prompt → specificity in the response.
- **Anchor the question in context.** "We're building X in domain Y. Problem is Z." A few sentences of setup beats a longer prompt with no framing.
- **Attach architecture docs alongside source.** READMEs and design docs let Oracle match the question to the system's intent, not just its code.
- **Use memorable slugs.** Reattaching to `auth-flow-debug` is easier than hunting through `status` for a hash.
- **Keep individual files under 1MB.** Oracle rejects anything larger — plan accordingly. Large logs should be pre-filtered to the relevant slice.

## Examples

### Example 1: Complex Bug Investigation
```bash
bunx @steipete/oracle \
  --prompt "This form submission intermittently fails with 'network timeout'. Walk through the request/response cycle, check timeout configs, and trace where it might stall." \
  --file src/components/Form.tsx src/api/client.ts src/hooks/useSubmit.ts \
  --files-report \
  --preview
```

### Example 2: Design Review with Alternatives
```bash
bunx @steipete/oracle \
  --prompt "We're using redux for state management in a 50k LOC codebase. Is this still optimal? What are 2-3 alternatives worth considering?" \
  --file src/store/ docs/ARCHITECTURE.md package.json \
  --slug "state-mgmt-design"
```

### Example 3: Resume Previous Session
```bash
# Earlier you ran:
bunx @steipete/oracle --prompt "..." --slug "my-problem"

# Now attach to it:
bunx @steipete/oracle session my-problem
```

## Edge Cases & Troubleshooting

**Files too large (>1MB):**
- Exclude vendored code, logs, or split context
- Focus on key files only

**Token budget exceeded (~196k):**
- Show `--files-report` to see cost per file
- Reduce number of files or directories
- Ask more specific question to require less context

**Session doesn't exist:**
- Check spelling of slug/ID
- Run `bunx @steipete/oracle status` to list recent sessions
- Create new session if needed

**OPENAI_API_KEY not set:**
- Oracle falls back to browser engine
- Use `--engine browser` explicitly if preferred
- Set API key to use API engine for background sessions

**Preview shows too many tokens:**
- Exclude directories with large generated files
- Keep only most relevant source files
- Split into multiple focused queries

## Implementation Notes

- Oracle CLI is installed via `bunx @steipete/oracle` (no local install needed)
- Sessions run in background; terminal close doesn't stop them
- Responses stream via heartbeat (default 30s intervals)
- Use `--slug` for easier session management in team workflows
- Token budget is per-request (~196k combined), not per session

## When not to reach for Oracle

Skip Oracle when:
- The question is answerable in seconds from what's already in conversation.
- The relevant context is under ~10k tokens — no need to pay the large-context premium.
- You need the answer immediately — background sessions trade latency for depth.
- There's no code context to attach; at that point Claude with plain reasoning is a better fit.

Reach for Oracle only when the large context window or the extra reasoning depth genuinely changes the answer quality.
