# Debug Session Example

This example shows how `/debug` helps investigate issues during development without burning your main context window.

## Scenario

You're manually testing a new authentication feature. Users report they can't log in after password reset. You need to investigate logs, database state, and recent changes.

## Workflow

### Step 1: Invoke debug command

```bash
/debug
```

### Step 2: Describe the problem

```
I'll help debug your current issue.

Please describe what's going wrong:
- What are you working on?
- What specific problem occurred?
- When did it last work?
```

**Your response:**
```
Working on password reset feature (task-567-password-reset branch).
Users can request reset, receive email, but get "Invalid token"
error when submitting new password. Last worked yesterday before
I added token expiration logic.
```

### Step 3: Parallel investigation

```
🔍 Understanding the problem...

✓ Read task file: .tasks/task-567-password-reset.md
✓ Context: Implementing password reset with token expiration
✓ Phase: Testing new token validation logic

🔎 Launching parallel investigations...
```

**Task 1 - Checking Logs:**
```
📋 LOG ANALYSIS

Found 12 errors in logs/api.log (last 30 minutes):

[2025-10-30 14:23:45] ERROR TokenValidator: Token verification failed
  token_age: 45 seconds
  expected_max_age: 900 seconds
  reason: token_expired
  user_id: usr_abc123

[2025-10-30 14:24:12] ERROR AuthService: Invalid reset token
  token_format: valid
  signature: verified
  expiration_check: FAILED

Pattern detected: All failures occur immediately after token generation
Token age: 10-120 seconds (well within 15min expiration)
```

**Task 2 - Database State:**
```
🗄️ DATABASE ANALYSIS

Query: SELECT * FROM password_reset_tokens
       WHERE created_at > NOW() - INTERVAL '1 hour'
       ORDER BY created_at DESC LIMIT 5;

Recent tokens:
┌──────────────┬─────────────┬─────────────────────┬────────────┐
│ token_id     │ user_id     │ created_at          │ expires_at │
├──────────────┼─────────────┼─────────────────────┼────────────┤
│ tkn_xyz789   │ usr_abc123  │ 2025-10-30 14:23:45 │ NULL       │
│ tkn_def456   │ usr_xyz890  │ 2025-10-30 14:20:12 │ NULL       │
│ tkn_ghi012   │ usr_def234  │ 2025-10-30 14:15:33 │ NULL       │
└──────────────┴─────────────┴─────────────────────┴────────────┘

⚠️ ISSUE FOUND: expires_at column is NULL for all recent tokens!

Query: DESCRIBE password_reset_tokens;
  - expires_at: TIMESTAMP, nullable: true, default: NULL

Schema was updated but default value not set.
```

**Task 3 - Git & File State:**
```
🔧 GIT ANALYSIS

Current branch: task-567-password-reset
Recent commits (since branching from main):

a1b2c3d (HEAD) feat: add token expiration validation
e4f5g6h feat: add expires_at column to reset tokens
i7j8k9l feat: implement password reset flow

Changed files in commit a1b2c3d:
  M src/auth/token-validator.ts
  M tests/auth/token-validator.test.ts

Git diff analysis:

  // token-validator.ts:45
  + if (token.expiresAt < Date.now()) {
  +   throw new TokenExpiredError('Token has expired');
  + }

  ⚠️ Code assumes expiresAt is always set, but database has NULL values!
```

### Step 4: Debug Report

```
## Debug Report

### What's Wrong

Password reset tokens are immediately failing validation because the
`expires_at` column is NULL in the database, but the validation code
expects it to always have a value.

### Evidence Found

**From Logs**:
- 12 token validation failures in 30 minutes
- All failing with "token_expired" reason
- Token ages: 10-120 seconds (well within limit)
- Pattern: 100% failure rate after recent deployment

**From Database**:
- All recent password_reset_tokens have `expires_at = NULL`
- Column exists but has no default value
- Migration added column but didn't backfill or set default

**From Git/Files**:
- Commit a1b2c3d added expiration validation
- Code does: `if (token.expiresAt < Date.now())`
- JavaScript comparison: `NULL < Date.now()` evaluates to false
- But throws error anyway because null check is missing

### Root Cause

**Two-part issue:**

1. **Migration incomplete**: Added `expires_at` column without default value
   - File: migrations/xxx_add_token_expiration.sql
   - Missing: `DEFAULT (NOW() + INTERVAL '15 minutes')`

2. **Code assumes non-null**: Validation logic doesn't handle NULL
   - File: src/auth/token-validator.ts:45
   - Missing: null check before comparison

### Next Steps

1. **Fix the migration** (immediate fix):
   ```sql
   -- Add default to existing column
   ALTER TABLE password_reset_tokens
   ALTER COLUMN expires_at
   SET DEFAULT (NOW() + INTERVAL '15 minutes');

   -- Backfill existing NULL values
   UPDATE password_reset_tokens
   SET expires_at = created_at + INTERVAL '15 minutes'
   WHERE expires_at IS NULL;
   ```

2. **Fix the validation code** (prevent future issues):
   ```typescript
   // src/auth/token-validator.ts:45
   if (!token.expiresAt) {
     throw new TokenInvalidError('Token missing expiration');
   }

   if (token.expiresAt < Date.now()) {
     throw new TokenExpiredError('Token has expired');
   }
   ```

3. **Add test coverage**:
   ```typescript
   // tests/auth/token-validator.test.ts
   it('should reject tokens with null expiration', () => {
     const token = { ...validToken, expiresAt: null };
     expect(() => validator.validate(token))
       .toThrow(TokenInvalidError);
   });
   ```

### Can't Access?

Some checks are outside my reach:
- Browser console errors (open F12 in browser)
- Email delivery logs (check email service dashboard)
- Network requests (use browser DevTools Network tab)

Would you like me to investigate the migration files or validation logic further?
```

## What Happened?

1. **Understood context**: Read task file to understand what you're working on
2. **Parallel investigation**: Spawned 3 concurrent tasks for efficiency
3. **Evidence-based analysis**: Found issues in logs, database, and code
4. **Root cause identification**: Connected the dots between symptoms
5. **Actionable fixes**: Provided specific SQL and code fixes
6. **Test coverage**: Suggested preventing regression

## When to Use `/debug`

**Use `/debug` when:**
- Hit an issue during manual testing
- Need to investigate logs/database without editing files
- Want to preserve main window context for implementation
- Need structured investigation of error state

**Don't use when:**
- Issue is obvious from code review
- Need to actually fix the code (do that in main window)
- Problem is in browser console (check DevTools directly)

## Required: DEBUG.md File

Create `DEBUG.md` in your repo root:

```markdown
# Project-Specific Debug Info

## Log Locations
- API logs: `logs/api.log`
- Worker logs: `logs/worker.log`
- Database logs: `logs/postgres.log`

## Database Access
```bash
# Connect to local DB
psql postgresql://localhost/myapp_dev

# Quick queries
SELECT * FROM password_reset_tokens WHERE created_at > NOW() - INTERVAL '1 hour';
SELECT * FROM users WHERE id = 'usr_abc123';
```

## Common Debug Commands
```bash
# Check running processes
ps aux | grep node

# View recent logs
tail -f logs/api.log

# Database health
docker ps | grep postgres
```

## Service Endpoints
- API: http://localhost:3000
- Admin: http://localhost:3001
- Metrics: http://localhost:9090/metrics
```
