---
name: check-env-keys
description: Verify which environment variable keys are present in .env files or shell environment without exposing their values. Use when you need to check env configuration or compare keys between .env files.
---

# Check Environment Variable Keys

Verify which environment variable keys are configured without exposing their values. The whole point of this skill is that the actual secret values never enter the conversation — only the key names do.

## Scope

Check for keys across every configuration source, not just one file:

- File-based: `.env.local` (local overrides, gitignored), `.env` (if present, usually gitignored), `.env.example` (template, committed), `.env.sample` (alternative template name).
- Shell environment: exported variables in the current session, variables loaded from `~/.bashrc` / `~/.zshrc`, and system-level variables.

A key counts as configured if it's present in any one of those locations. An env var set via `~/.zshrc` is just as valid as one in `.env.local`.

## How to Check

### Step 1: List all keys

Extract keys (names only, never values) from every env file:

```bash
for file in .env.local .env .env.example .env.sample; do if [ -f "$file" ]; then echo "=== Keys in $file ==="; grep -v '^#' "$file" | grep -v '^[[:space:]]*$' | grep '=' | cut -d'=' -f1 | sort; echo ""; fi; done
```

### Step 2: Check for missing keys (with shell fallback)

Find keys present in the sample/example template but missing from both `.env.local` *and* the shell environment. A key set in `~/.zshrc` shouldn't count as missing, so check both sources before reporting.

```bash
sample_file=""; if [ -f ".env.sample" ]; then sample_file=".env.sample"; elif [ -f ".env.example" ]; then sample_file=".env.example"; fi; local_file=""; if [ -f ".env.local" ]; then local_file=".env.local"; elif [ -f ".env" ]; then local_file=".env"; fi; if [ -n "$sample_file" ]; then sample_keys=$(grep -v '^#' "$sample_file" | grep -v '^[[:space:]]*$' | grep '=' | cut -d'=' -f1 | sort); local_keys=""; if [ -n "$local_file" ]; then local_keys=$(grep -v '^#' "$local_file" | grep -v '^[[:space:]]*$' | grep '=' | cut -d'=' -f1 | sort); fi; missing=""; for key in $sample_keys; do if [ -n "$local_keys" ] && echo "$local_keys" | grep -q "^$key$"; then continue; fi; if printenv "$key" >/dev/null 2>&1; then continue; fi; missing="$missing\n  - $key"; done; if [ -n "$missing" ]; then echo "⚠️ Missing from .env.local and shell environment (present in $sample_file):"; echo -e "$missing"; else echo "✓ All required environment variables are configured (either in .env.local or shell environment)"; fi; else echo "No .env.sample or .env.example file found"; fi
```

`printenv "$key"` checks existence without printing the value, which is the invariant for this whole skill — never surface the actual secret.

## What gets shown

- Which env vars are defined (by key name).
- Which template keys are missing across every configured source.

What never gets shown: the actual values. That's the security boundary; treat it as absolute.

## Verification logic

A key is "configured" if it exists in `.env.local`, `.env`, or the shell environment. In that case, trust that the value is set correctly — don't prompt the user for it, and don't try to read it.

The verification only checks for key existence. Never print, log, or pass actual values to Claude.

## Common Checks

After running the commands, you can:
- Verify all keys from .env.example/.env.sample are present in .env.local OR shell environment
- Identify truly missing environment variables (not in file AND not in shell)
- Confirm required keys are configured without exposing secrets
- Understand which variables are set globally (shell) vs locally (file)

## Example Output

### Step 1 Output (List keys)
```
=== Keys in .env.local ===
DATABASE_URL
NEXT_PUBLIC_API_URL

=== Keys in .env.sample ===
ANTHROPIC_API_KEY
DATABASE_URL
NEXT_PUBLIC_API_URL
OPENAI_API_KEY
```

### Step 2 Output (Check missing keys)

**Scenario A**: All variables configured
```
✓ All required environment variables are configured (either in .env.local or shell environment)
```

**Scenario B**: Some variables missing from both .env.local and shell
```
⚠️ Missing from .env.local and shell environment (present in .env.sample):
  - ANTHROPIC_API_KEY
  - SOME_OTHER_KEY
```

**Note**: If `OPENAI_API_KEY` was in .env.sample but not reported as missing, it means it's set in the shell environment (e.g., exported in `~/.zshrc`).
