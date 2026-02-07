---
name: ask-oracle
description: Leverage GPT-5 Pro or GPT-5.1 for hard problems that benefit from extended reasoning and large code context. Use when standard Claude analysis needs deeper reasoning or extended context windows.
---

# Ask Oracle

## Priorities
Question specificity > Context relevance > Token efficiency

## Goal
Delegate hard problems to Oracle CLI (`bunx @steipete/oracle`) for deep reasoning with large file context (up to ~196k tokens).

## Constraints
- Only invoke for genuinely hard/complex problems that benefit from more context or deeper reasoning; simple questions → answer directly
- Always preview first (`--preview` or `--files-report`) to inspect token usage before committing budget
- Use memorable `--slug` names for easy session management
- Exclude: node_modules, build artifacts, vendored code, binary files
- Keep files under 1MB (automatic rejection above)
- GPT-5 Pro is the default model; use `--model gpt-5.1` for experimental approach
- Sessions run in background — terminal close doesn't stop them
- Provide context in the prompt: "We're building X in domain Y, problem is Z"
- Load CLI reference for options, examples, and troubleshooting from reference

## Output
Oracle CLI command ready to run. Include `--preview` for first attempt. If session is running, provide the session attach command.

## References
Load Oracle CLI reference:
- `Glob(pattern: "**/primitives/**/references/oracle-cli-reference.md", path: "~/.claude/plugins")` → Read result
