# Environment Variable Validation Example

Shows how the `check-env-keys` skill validates environment configuration without exposing secrets.

## Scenario

You're onboarding a new project and need to verify all required environment variables are configured, but you don't want to expose sensitive values in logs or screenshots.

## The Problem with Traditional Approaches

### ❌ Unsafe: Checking with `cat`

```bash
cat .env.local
```

**Output exposes secrets:**
```
DATABASE_URL=postgresql://user:password123@localhost/db
JWT_SECRET=super_secret_key_here
SMTP_PASS=my_email_password
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

🚨 **Dangerous**: Secrets visible in terminal, logs, screen shares, screenshots

### ❌ Unsafe: Manual inspection

Reading the file manually risks:
- Accidentally copying secrets to clipboard
- Exposing secrets in screen recordings
- Leaking secrets in bug reports

## ✅ Safe Approach: `check-env-keys` Skill

The skill extracts **only the keys** (variable names), never the values.

### Automatic Invocation

The skill is automatically invoked during `/install` when checking environment setup:

```bash
/install
```

**Relevant output:**
```
4. Checking environment configuration
   ⚠️ Missing .env.local file

   Using skill: check-env-keys

   === Keys in .env.example ===
   DATABASE_URL
   JWT_SECRET
   REDIS_URL
   SMTP_HOST
   SMTP_PORT
   SMTP_USER
   SMTP_PASS
   AWS_REGION
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY

   === Keys in .env.local ===
   (file not found)
```

### Manual Usage

You can also invoke the skill manually by using its internal command:

```bash
for file in .env.local .env .env.example .env.sample; do
  if [ -f "$file" ]; then
    echo "=== Keys in $file ==="
    grep -v '^#' "$file" | grep -v '^[[:space:]]*$' | grep '=' | cut -d'=' -f1 | sort
    echo ""
  fi
done
```

## Real-World Scenarios

### Scenario 1: Missing Configuration

**Situation:** Just cloned the repo, haven't created `.env.local` yet

**Output:**
```
=== Keys in .env.example ===
AWS_ACCESS_KEY_ID
AWS_REGION
AWS_SECRET_ACCESS_KEY
DATABASE_URL
JWT_SECRET
REDIS_URL
SMTP_HOST
SMTP_PASS
SMTP_PORT
SMTP_USER

=== Keys in .env.local ===
(file not found)

❌ Missing .env.local
📋 Next step: cp .env.example .env.local
```

**What it tells you:**
- `.env.example` has 10 required keys
- `.env.local` doesn't exist yet
- Need to create it

**Action:** Create the file and configure it
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### Scenario 2: Incomplete Configuration

**Situation:** Created `.env.local` but forgot some variables

**Output:**
```
=== Keys in .env.example ===
AWS_ACCESS_KEY_ID
AWS_REGION
AWS_SECRET_ACCESS_KEY
DATABASE_URL
JWT_SECRET
REDIS_URL
SMTP_HOST
SMTP_PASS
SMTP_PORT
SMTP_USER

=== Keys in .env.local ===
DATABASE_URL
JWT_SECRET
REDIS_URL

⚠️ Missing keys in .env.local:
  - AWS_ACCESS_KEY_ID (optional)
  - AWS_REGION (optional)
  - AWS_SECRET_ACCESS_KEY (optional)
  - SMTP_HOST (required)
  - SMTP_PASS (required)
  - SMTP_PORT (required)
  - SMTP_USER (required)

📋 Next steps:
  1. Add required SMTP configuration
  2. Optionally add AWS credentials for S3 features
```

**What it tells you:**
- 3 keys configured: DATABASE_URL, JWT_SECRET, REDIS_URL
- 7 keys missing: 4 SMTP keys (required), 3 AWS keys (optional)
- Need to add SMTP configuration

**Action:** Add missing variables
```bash
# Edit .env.local and add:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Scenario 3: Complete Configuration

**Situation:** All variables configured properly

**Output:**
```
=== Keys in .env.example ===
AWS_ACCESS_KEY_ID
AWS_REGION
AWS_SECRET_ACCESS_KEY
DATABASE_URL
JWT_SECRET
REDIS_URL
SMTP_HOST
SMTP_PASS
SMTP_PORT
SMTP_USER

=== Keys in .env.local ===
AWS_ACCESS_KEY_ID
AWS_REGION
AWS_SECRET_ACCESS_KEY
DATABASE_URL
JWT_SECRET
REDIS_URL
SMTP_HOST
SMTP_PASS
SMTP_PORT
SMTP_USER

✅ All required keys present
✅ Configuration complete
```

**What it tells you:**
- All 10 keys from example are in local file
- Environment is fully configured
- Ready to run the application

### Scenario 4: Extra Variables (Advanced)

**Situation:** Local file has additional keys not in example

**Output:**
```
=== Keys in .env.example ===
DATABASE_URL
JWT_SECRET
REDIS_URL

=== Keys in .env.local ===
DATABASE_URL
DEBUG_MODE
JWT_SECRET
LOG_LEVEL
REDIS_URL

ℹ️ Extra keys in .env.local (not in example):
  - DEBUG_MODE
  - LOG_LEVEL

✅ All required keys present
ℹ️ 2 additional local configurations found
```

**What it tells you:**
- All required keys present
- Local file has 2 extra keys for local development
- This is normal and OK

## Security Benefits

### What the Skill Shows ✓

```
DATABASE_URL  ✓ Present
JWT_SECRET    ✓ Present
SMTP_PASS     ✓ Present
```

### What the Skill Hides ✗

```
DATABASE_URL=postgresql://... ✗ HIDDEN
JWT_SECRET=abc123...          ✗ HIDDEN
SMTP_PASS=password...         ✗ HIDDEN
```

### Safe for:
- ✓ Screen recordings
- ✓ Screenshots
- ✓ Bug reports
- ✓ Documentation
- ✓ Team meetings
- ✓ CI/CD logs
- ✓ Pair programming

### Prevents:
- ✗ Secret leakage in logs
- ✗ Accidental exposure in screen shares
- ✗ Secrets in version control (via screenshots)
- ✗ Copy-paste mistakes

## How It Works

### The Command Breakdown

```bash
for file in .env.local .env .env.example .env.sample; do
  if [ -f "$file" ]; then
    echo "=== Keys in $file ==="
    grep -v '^#' "$file" |           # Remove comments
    grep -v '^[[:space:]]*$' |       # Remove empty lines
    grep '=' |                        # Only lines with =
    cut -d'=' -f1 |                   # Extract text before =
    sort                              # Sort alphabetically
    echo ""
  fi
done
```

**Step by step:**

1. **Loop through files**: `.env.local`, `.env`, `.env.example`, `.env.sample`
2. **Check existence**: `if [ -f "$file" ]`
3. **Extract keys only**: `cut -d'=' -f1` (split on `=`, take first part)
4. **Filter out**: Comments (`#`), empty lines, non-variable lines
5. **Sort**: Alphabetically for easy comparison
6. **Never show**: Anything after the `=` sign

### Example File

**Input file (`.env.local`):**
```bash
# Database configuration
DATABASE_URL=postgresql://user:pass123@localhost/db
# Leave empty for default
DATABASE_POOL_SIZE=

# Auth
JWT_SECRET=super_secret_key_here
JWT_EXPIRY=7d

# Redis
REDIS_URL=redis://localhost:6379
```

**Skill output (keys only):**
```
DATABASE_POOL_SIZE
DATABASE_URL
JWT_EXPIRY
JWT_SECRET
REDIS_URL
```

**Notice:**
- ✓ All variable names extracted
- ✓ Even empty values shown as "present"
- ✓ Comments removed
- ✓ Sorted alphabetically
- ✗ No secrets visible
- ✗ No values shown

## Best Practices

### 1. Use for Validation, Not Configuration

```bash
# ❌ Don't use skill output to set values
check-env-keys  # Shows: JWT_SECRET
# Then manually edit .env.local

# ✓ Use to verify after configuring
# Edit .env.local first
check-env-keys  # Verify all keys present
```

### 2. Assume Present = Configured

If a key exists, assume it's properly configured:

```
JWT_SECRET  ✓ Present
```

**Interpretation:**
- ✓ Key exists in file
- ✓ Has a value (even if empty string)
- ✓ Don't ask user for the value
- ✓ Proceed with assumption it's correct

### 3. Template First, Then Configure

```bash
# Step 1: Copy template
cp .env.example .env.local

# Step 2: Verify structure
check-env-keys
# See what needs configuring

# Step 3: Edit values
# Edit .env.local (values stay secret)

# Step 4: Verify completeness
check-env-keys
# Confirm all keys present
```

### 4. Never Echo Values

```bash
# ❌ NEVER DO THIS
echo "JWT_SECRET=$JWT_SECRET"
cat .env.local

# ✓ ALWAYS USE SKILL
check-env-keys
```

## Integration with Other Commands

### During `/install`

```bash
/install
```

Automatically runs `check-env-keys` to:
- Compare `.env.example` vs `.env.local`
- Identify missing configurations
- Report in safe, key-only format

### During `/debug`

```bash
/debug
```

Can use skill to:
- Verify environment configuration
- Check if missing vars causing issues
- Compare expected vs actual config
- Never expose secrets in debug logs

## Files Checked (in order)

1. **`.env.local`** - Local overrides, gitignored (highest priority)
2. **`.env`** - Environment file, usually gitignored
3. **`.env.example`** - Template file, committed to git
4. **`.env.sample`** - Alternative template name

**Typical setup:**
```
.env.example   ✓ Committed (template)
.env.local     ✗ Gitignored (your secrets)
.env           ✗ Gitignored (alternative)
```

## Summary

The `check-env-keys` skill provides:

✓ **Security**: Never exposes secret values
✓ **Validation**: Confirms all required keys present
✓ **Comparison**: Shows differences between template and local
✓ **Guidance**: Clear next steps when configs missing
✓ **Safe sharing**: Output safe for screenshots, recordings, documentation

Use it whenever you need to verify environment configuration without risking secret exposure.
