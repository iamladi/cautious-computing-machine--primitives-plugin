# Check Environment Variable Keys

This skill allows you to verify which environment variable keys are present in .env files WITHOUT exposing their values.

## Usage

When invoked, check for environment variable keys in the following files (in order of precedence):
- `.env.local` (local overrides, gitignored)
- `.env` (if it exists, usually gitignored)
- `.env.example` (template file, committed)
- `.env.sample` (alternative template name)

## How to Check

Use this command to extract only the keys (not values) from env files:

```bash
for file in .env.local .env .env.example .env.sample; do
  if [ -f "$file" ]; then
    echo "=== Keys in $file ==="
    grep -v '^#' "$file" | grep -v '^[[:space:]]*$' | grep '=' | cut -d'=' -f1 | sort
    echo ""
  fi
done
```

## What This Shows

- ✓ Which environment variables are **defined** (key exists)
- ✓ Comparison between local and example files to find missing keys
- ✗ **NEVER** shows the actual values (for security)

## Verification Logic

If a key exists in the file, assume:
1. The value is set (even if empty string)
2. The value is correctly configured
3. No need to prompt user for the value

## Common Checks

After running the command, you can:
- Verify all keys from .env.example are present in .env.local
- Identify missing environment variables
- Confirm required keys are configured without exposing secrets

## Example Output

```
=== Keys in .env.local ===
DATABASE_URL
NEXT_PUBLIC_API_URL
SECRET_KEY

=== Keys in .env.example ===
DATABASE_URL
NEXT_PUBLIC_API_URL
SECRET_KEY
OPTIONAL_FEATURE_FLAG
```

This shows that OPTIONAL_FEATURE_FLAG is in the example but not set locally.
