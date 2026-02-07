---
name: check-env-keys
description: Verify which environment variable keys are present in .env files or shell environment without exposing their values. Use when you need to check env configuration or compare keys between .env files.
---

# Check Environment Variable Keys

## Priorities
Security (never expose values) > Completeness (check all locations) > Convenience

## Goal
Verify which environment variable keys are present across .env files and shell environment. Report only key existence, never values.

## Constraints
- NEVER expose actual values — only check key names via `cut -d'=' -f1`
- NEVER use `env | grep` or raw `printenv` without key filtering
- Check locations: `.env.local`, `.env`, `.env.example`, `.env.sample`, shell environment
- A variable is "configured" if it exists in ANY location (file or shell)
- Compare against `.env.example` or `.env.sample` to find missing keys
- Shell environment serves as fallback — variables exported in `~/.bashrc`/`~/.zshrc` count
- Load exact bash commands from reference file — do not regenerate them (security-critical)

## Output
List of keys per file. Missing keys report (present in example/sample but absent from local AND shell). Never show values.

## References
Load environment check commands (REQUIRED — do not regenerate):
- `Glob(pattern: "**/primitives/**/references/env-check-commands.md", path: "~/.claude/plugins")` → Read result
