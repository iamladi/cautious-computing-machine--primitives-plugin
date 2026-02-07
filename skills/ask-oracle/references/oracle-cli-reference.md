# Oracle CLI Reference

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

## Best Practices

1. **Always preview first**: Use `--preview` or `--files-report` to inspect tokens before committing budget
2. **Use memorable slugs**: Makes it easier to resume and reference later
3. **Ask focused questions**: More specific = better reasoning. Avoid "review everything"
4. **Provide context in prompt**: "We're building X in domain Y, and problem is Z"
5. **Attach key architecture docs**: READMEs, design docs help oracle understand intent
6. **Keep files under 1MB**: Automatic rejection, so plan accordingly
7. **Use browser engine for API-less runs**: Falls back to browser if no OPENAI_API_KEY set
8. **Check token budget**: ~196k tokens max per request (files + prompt)

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
