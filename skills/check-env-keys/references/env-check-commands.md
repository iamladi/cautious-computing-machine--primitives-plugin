# Environment Variable Check Commands

**REQUIRED READING**: These commands must be used verbatim. Do not regenerate or modify them.
They are designed to check key existence WITHOUT exposing secret values.

## List All Environment Variable Keys

```bash
for file in .env.local .env .env.example .env.sample; do if [ -f "$file" ]; then echo "=== Keys in $file ==="; grep -v '^#' "$file" | grep -v '^[[:space:]]*$' | grep '=' | cut -d'=' -f1 | sort; echo ""; fi; done
```

## Check for Missing Keys (with Shell Fallback)

```bash
sample_file=""; if [ -f ".env.sample" ]; then sample_file=".env.sample"; elif [ -f ".env.example" ]; then sample_file=".env.example"; fi; local_file=""; if [ -f ".env.local" ]; then local_file=".env.local"; elif [ -f ".env" ]; then local_file=".env"; fi; if [ -n "$sample_file" ]; then sample_keys=$(grep -v '^#' "$sample_file" | grep -v '^[[:space:]]*$' | grep '=' | cut -d'=' -f1 | sort); local_keys=""; if [ -n "$local_file" ]; then local_keys=$(grep -v '^#' "$local_file" | grep -v '^[[:space:]]*$' | grep '=' | cut -d'=' -f1 | sort); fi; missing=""; for key in $sample_keys; do if [ -n "$local_keys" ] && echo "$local_keys" | grep -q "^$key$"; then continue; fi; if printenv "$key" >/dev/null 2>&1; then continue; fi; missing="$missing\n  - $key"; done; if [ -n "$missing" ]; then echo "⚠️ Missing from .env.local and shell environment (present in $sample_file):"; echo -e "$missing"; else echo "✓ All required environment variables are configured (either in .env.local or shell environment)"; fi; else echo "No .env.sample or .env.example file found"; fi
```

## What These Commands Check

- Key existence only — never exposes actual values
- Locations checked: `.env.local`, `.env`, `.env.example`, `.env.sample`
- Shell environment fallback via `printenv` (checks existence, not value)
- Variables considered "configured" if found in ANY location

## Security Constraints

- NEVER use `env | grep` or raw `printenv` without key filtering
- NEVER pipe env output to logs or display
- Only check key names via `cut -d'=' -f1`
