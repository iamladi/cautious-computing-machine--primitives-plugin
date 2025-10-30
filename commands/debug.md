---
description: Debug issues by investigating logs, database state, and git history
---

# Debug

You are tasked with helping debug issues during manual testing or implementation. This command allows you to investigate problems by examining logs, database state, and git history without editing files. Think of this as a way to bootstrap a debugging session without using the primary window's context.

Before you start initial response, read the `DEBUG.md` file in the repo root to get project-specific debugging information (log locations, database tools, etc.).

## Initial Response

When invoked WITH a plan/ticket file:
```
I'll help debug issues with [file name]. Let me understand the current state.

What specific problem are you encountering?
- What were you trying to test/implement?
- What went wrong?
- Any error messages?

I'll investigate the logs, database, and git state to help figure out what's happening.
```

When invoked WITHOUT parameters:
```
I'll help debug your current issue.

Please describe what's going wrong:
- What are you working on?
- What specific problem occurred?
- When did it last work?

I can investigate logs, database state, and recent changes to help identify the issue.
```

## Process Steps

### Step 1: Understand the Problem

After the user describes the issue:

1. **Read any provided context** (plan or ticket file):
   - Understand what they're implementing/testing
   - Note which phase or step they're on
   - Identify expected vs actual behavior

2. **Quick state check**:
   - Current git branch and recent commits
   - Any uncommitted changes
   - When the issue started occurring

### Step 2: Investigate the Issue

Spawn parallel investigations for efficiency:

**Task 1 - Check Logs**:
- Find and analyze the most recent logs for errors
- Search for errors, warnings, or issues around the problem timeframe
- Look for stack traces or repeated errors
- Return: Key errors/warnings with timestamps

**Task 2 - Database/Backend State**:
- Use project-specific debug queries (see DEBUG.md)
- Check recent data and current state
- Inspect specific documents if you have IDs from logs
- Look for stuck states, missing relations, or data anomalies
- Return: Relevant database findings with document IDs and timestamps

**Task 3 - Git and File State**:
- Check git status and current branch
- Look at recent commits
- Check uncommitted changes
- Verify expected files exist
- Look for any file permission issues
- Return: Git state and any file issues

### Step 3: Present Findings

Based on the investigation, present a focused debug report:

```markdown
## Debug Report

### What's Wrong
[Clear statement of the issue based on evidence]

### Evidence Found

**From Logs**:
- [Error/warning with timestamp]
- [Pattern or repeated issue]

**From Database/Backend**:
- [Finding from database]
- [Relevant state or data]

**From Git/Files**:
- [Recent changes that might be related]
- [File state issues]

### Root Cause
[Most likely explanation based on evidence]

### Next Steps

1. **Try This First**:
   ```bash
   [Specific command or action]
   ```

2. **If That Doesn't Work**:
   - [Alternative approaches]
   - [Check project-specific commands in DEBUG.md]

### Can't Access?
Some issues might be outside my reach:
- Browser console errors (F12 in browser)
- System-level issues
- [Other project-specific limitations]

Would you like me to investigate something specific further?
```

## Important Notes

- **Focus on manual testing scenarios** - This is for debugging during implementation
- **Always require problem description** - Can't debug without knowing what's wrong
- **Read files completely** - No limit/offset when reading context
- **Check DEBUG.md for specifics** - Project-specific log locations, database tools, etc.
- **Guide back to user** - Some issues (browser console, system internals) are outside reach
- **No file editing** - Pure investigation only

## Generic Quick Reference

**Git State**:
```bash
git status
git log --oneline -10
git diff
```

**File Investigation**:
```bash
# Find recent files
find . -type f -mtime -1

# Check permissions
ls -la [file]
```

**Process Management**:
```bash
# Check running processes
ps aux | grep [process-name]
```

**See DEBUG.md in repo root for project-specific commands and tools.**

Remember: This command helps you investigate without burning the primary window's context. Perfect for when you hit an issue during manual testing and need to dig into logs, database, or git state.
