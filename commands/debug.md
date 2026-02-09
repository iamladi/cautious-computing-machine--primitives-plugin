---
description: Debug issues by investigating logs, database state, and git history
---

# Debug

You are tasked with helping debug issues during manual testing or implementation. This command allows you to investigate problems by examining logs, database state, and git history without editing files. Think of this as a way to bootstrap a debugging session without using the primary window's context.

Before you start initial response, read the `DEBUG.md` file in the repo root to get project-specific debugging information (log locations, database tools, etc.).

## Argument Parsing

The `$ARGUMENTS` input may contain both the debug context (plan/ticket file path or problem description) and optional mode flags. Extract the intent:
- Identify if `--swarm` flag is present (indicates user wants parallel team debugging)
- Separate the flag from the context itself
- The context is the remaining text after flag extraction

## Mode Selection

**If user requested swarm mode** (via `--swarm` flag): Execute the **Swarm Workflow** below.
**Otherwise**: Execute the **Standard Workflow** below.

---

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

---

## Swarm Workflow

An alternative approach using agent teams for debugging that benefits from parallel hypothesis testing. This works well when investigating multiple potential root causes that can be tested independently.

### Team Prerequisites and Fallback

Attempt to create the agent team using `TeamCreate` with a unique timestamped name: `debug-{YYYYMMDD-HHMMSS}` and description: "Debug: {issue summary}".

If team creation fails (tool unavailable or experimental features disabled), inform the user that swarm mode requires agent teams to be enabled (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings.json), then fall back to executing the Standard Workflow instead.

### Context Preparation

Before spawning teammates:
1. Read any provided context (plan or ticket file)
2. Read the `DEBUG.md` file in the repo root for project-specific debugging information
3. Get the user's problem description (what's wrong, when it started, error messages)
4. Form initial hypotheses (2-4 possibilities) based on symptoms
5. Summarize all context in the teammate spawn prompts so they start with shared understanding

### Shared Task List

Create tasks via `TaskCreate` for each hypothesis investigation. Each task represents testing one potential root cause:
- Task format: "Investigate hypothesis: {hypothesis description}"
- Create one task per hypothesis (max 4 tasks)
- If more than 4 hypotheses, group related ones together

These tasks provide structure for parallel hypothesis testing.

### Teammate Roles and Spawn Protocol

After forming hypotheses in Step 1, spawn teammates to investigate each hypothesis in parallel. Create 1 teammate per hypothesis (max 4; if >4 hypotheses, batch related ones).

Spawn each teammate via the `Task` tool with `team_name` parameter and `subagent_type: "general-purpose"`. Each teammate prompt MUST include as string literals (NOT references to conversation):

**Required Context in Each Spawn Prompt**:
- The user's problem description (exactly what's wrong, when it started, any error messages)
- The specific hypothesis this teammate is investigating
- Complete list of ALL hypotheses being tested by the team
- Relevant error messages or context from logs/database/git
- Project-specific debugging information from DEBUG.md

**Teammate Investigation Protocol**:

```
You are investigating one hypothesis as part of a debug team.

PROBLEM DESCRIPTION:
{literal copy of user's problem description}

YOUR HYPOTHESIS:
{specific hypothesis this teammate is testing}

ALL TEAM HYPOTHESES:
1. {hypothesis 1}
2. {hypothesis 2}
3. {hypothesis 3}
4. {hypothesis 4}

RELEVANT CONTEXT:
{error messages, log excerpts, database state, recent commits - as string literals}

PROJECT DEBUG INFO:
{relevant excerpts from DEBUG.md - log locations, database tools, etc.}

YOUR TASK:
Test your hypothesis by investigating logs, database state, git history, and file state. Use ONLY read-only tools (Read, Grep, Glob, Bash for non-destructive commands like git log, ps, ls, find).

CRITICAL CONSTRAINTS:
- DO NOT run git commit/push/add or any destructive commands
- DO NOT use AskUserQuestion (you can't interact with the user)
- DO NOT run build or test commands (may interfere with other teammates)
- Read files completely without limit/offset

EVIDENCE SHARING:
When you find evidence that contradicts another teammate's hypothesis, immediately share via SendMessage:
"My investigation of {your hypothesis} found evidence that contradicts {other hypothesis}: {evidence with file:line or log timestamp}"

COMPLETION:
When you've gathered sufficient evidence to confirm or eliminate your hypothesis:
1. Mark your task complete via TaskUpdate with your findings
2. Send "DEBUG COMPLETE" via SendMessage
3. Wait for shutdown_request

FINDINGS FORMAT:
- Hypothesis status: ✓ Confirmed / ✗ Eliminated / ⚠️ Uncertain
- Evidence for: {specific findings with file:line or timestamps}
- Evidence against: {contradicting findings}
- If eliminated: What this rules out
- If confirmed: Root cause explanation
```

### Completion Protocol

Wait for all teammates to signal completion by sending "DEBUG COMPLETE" messages. Timeout: 10 minutes from teammate spawn time.

**If timeout occurs**: Proceed with available findings and note which teammates timed out in the debug report.

**Fallback behavior**: If a teammate fails or gets stuck (repeated similar messages, no progress), you have three options:
1. Note the failure and proceed with other teammates' findings
2. Spawn a replacement teammate with clearer scoped instructions
3. Handle that hypothesis investigation yourself

Choose based on how critical that hypothesis is to identifying the root cause.

### Synthesis

As team lead, integrate teammate findings into a coherent debug report. Your job is to map findings to hypothesis outcomes, not mechanically merge outputs.

**Hypothesis Attribution**: Mark which teammate(s) tested each hypothesis: `[Teammate 1]`, `[Teammate 2]`, etc. Mark independently confirmed findings `[Consensus]`.

**Output Format**: Use the same Debug Report structure as Step 3 of Standard Workflow:
- What's Wrong
- Hypotheses Tested (with teammate attribution and evidence for/against each)
- Evidence Collected (preserve all file:line refs and timestamps from teammates)
- Root Cause (based on confirmed hypotheses)
- The Fix (same structure as standard workflow)

**Cross-hypothesis Evidence**: When one teammate's findings eliminate another hypothesis, highlight this in the report: "Evidence from log investigation contradicted the database state hypothesis, eliminating it as a root cause."

### Resource Cleanup

After completing synthesis (whether successful or failed), always clean up team resources.

Send shutdown requests to all teammates via `SendMessage` with `type: "shutdown_request"`, wait briefly for confirmations, then call `TeamDelete` to remove the team and its task list.

If cleanup itself fails, inform the user: "Team cleanup incomplete. You may need to check for lingering team resources."

Execute cleanup regardless of synthesis outcome—even if earlier steps errored or teammates timed out, cleanup must run before ending.

---

## Standard Workflow

The default debugging approach uses specialized subagents to investigate different aspects of the issue in parallel.

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

3. **Form Initial Hypotheses** (2-4 possibilities):
   - Based on symptoms, what could cause this?
   - List hypotheses from most to least likely
   - Note what evidence would confirm/eliminate each

### Step 2: Investigate to Test Hypotheses

Spawn parallel investigations targeting your hypotheses:

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

### Hypotheses Tested

**Hypothesis 1**: [Most likely cause]
- Evidence for: [Supporting findings]
- Evidence against: [Contradicting findings]
- **Status**: ✓ Confirmed / ✗ Eliminated / ⚠️ Uncertain

**Hypothesis 2**: [Alternative cause]
- Evidence for: [Supporting findings]
- Evidence against: [Contradicting findings]
- **Status**: ✓ Confirmed / ✗ Eliminated / ⚠️ Uncertain

[More hypotheses as needed...]

### Evidence Collected

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
[Confirmed explanation based on hypothesis testing]

### The Fix

1. **Immediate Action**:
   ```bash
   [Specific command or code change]
   ```
   Why this works: [Brief explanation]

2. **Prevent Recurrence**:
   - [Test to add]
   - [Code improvement]
   - [Documentation update]

3. **If That Doesn't Work**:
   - Hypothesis was wrong, try: [Alternative approaches]
   - [Check project-specific commands in DEBUG.md]

### Can't Access?
Some issues might be outside my reach:
- Browser console errors (F12 in browser)
- System-level issues
- [Other project-specific limitations]

Would you like me to investigate something specific further?
```

## Important Notes

- **Think like a senior dev** - Form hypotheses first, then gather evidence to test them
- **Test multiple hypotheses** - Don't fixate on one cause; consider 2-4 possibilities
- **Systematic elimination** - Mark each hypothesis as confirmed/eliminated with evidence
- **Focus on manual testing scenarios** - This is for debugging during implementation
- **Always require problem description** - Can't debug without knowing what's wrong
- **Read files completely** - No limit/offset when reading context
- **Check DEBUG.md for specifics** - Project-specific log locations, database tools, etc.
- **Guide back to user** - Some issues (browser console, system internals) are outside reach
- **No file editing** - Pure investigation only
- **Document the reasoning** - Show your hypothesis testing process, not just the answer

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

Remember: This command helps you debug systematically like a senior developer—form hypotheses, test them with evidence, eliminate possibilities, and find the root cause. All without burning your primary window's context. Perfect for when you hit an issue during manual testing.
