---
description: Debug issues by investigating logs, database state, and git history
---

# Debug

## Role

Help the user debug a problem during manual testing or implementation. Investigate logs, database state, git history, and file state using read-only tools. No edits — this command bootstraps a debugging session without burning the primary window's context.

## Priorities

Root cause (confirmed by evidence) > Coverage (multiple hypotheses tested) > Speed

## Scope

Form hypotheses first, then gather evidence to confirm or eliminate each. Don't fixate on one cause; 2–4 candidates is the sweet spot. Every finding ties back to a `file:line` reference or a log timestamp — evidence over vibes.

This command investigates. It doesn't edit files, run builds, or execute tests. Suggest fixes in the report; let the user apply them.

Read the project's `DEBUG.md` in the repo root first — it carries project-specific log locations, database tools, and known failure modes.

## Routing

Standard flow is the default: investigate sequentially with read-only subagents. Pass `--swarm` when you have 2–4 independent hypotheses that benefit from parallel testing by separate teammates (e.g., one checking logs, one querying the DB, one reading git history, each owning a distinct hypothesis). Strip `--swarm` from the args; the remainder is the problem description context.

If swarm mode is requested but `TeamCreate` isn't available:
```
Swarm mode requires agent teams. Set CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 in settings.json or environment.
Falling back to standard workflow.
```
Then continue without the team.

## Interview checkpoint (both modes)

Run the interview protocol before investigating:
- `Glob(pattern: "**/sdlc/**/skills/interview/SKILL.md", path: "~/.claude/plugins")`

Use `AskUserQuestion` with multiple-choice options to move fast. Anchor on: what was happening, what went wrong, when it last worked, exact error messages, reproduction steps. Skip anything answerable by reading the error output the user already pasted. Loop 1–4 questions per round until the user says "done".

Footer: `Reply format: 1a 2b or defaults`

---

## Standard workflow

### Form hypotheses

After the user describes the issue:

1. Read any context they mentioned (plan, ticket, error output) completely — no `limit`/`offset`.
2. Quick state check: current branch, recent commits, uncommitted changes, when the issue started.
3. List 2–4 candidate root causes, most likely first. For each, note what evidence would confirm or eliminate it.

### Investigate

Spawn parallel investigations targeting those hypotheses. Each returns evidence with `file:line` or timestamp:

- **Logs** — recent errors and warnings around the failure window, stack traces, repeated patterns.
- **Database / backend state** — use project-specific queries from `DEBUG.md`; inspect documents referenced by log IDs; look for stuck states, missing relations, data anomalies.
- **Git / file state** — status, recent commits, uncommitted changes, expected files present, permission issues.

Match the investigation depth to the failure's severity; don't fan out further than the hypotheses justify.

### Report

Present a focused debug report:

```markdown
## Debug Report

### What's Wrong
[Clear statement of the issue based on evidence]

### Hypotheses Tested

**Hypothesis 1**: [Most likely cause]
- Evidence for: [Supporting findings with file:line or timestamp]
- Evidence against: [Contradicting findings]
- Status: Confirmed / Eliminated / Uncertain

**Hypothesis 2**: [Alternative cause]
- (same structure)

### Evidence Collected

**From Logs**: [Errors/warnings with timestamps]
**From Database/Backend**: [State findings]
**From Git/Files**: [Recent changes or file issues]

### Root Cause
[Confirmed explanation based on hypothesis testing]

### The Fix

1. **Immediate action**
   ```bash
   [Specific command or code change]
   ```
   Why this works: [Brief explanation]

2. **Prevent recurrence**
   - [Test to add / code improvement / doc update]

3. **If that doesn't work**
   - Hypothesis was wrong, try: [Alternative approaches]
   - [Project-specific commands from DEBUG.md]

### Out of reach
Anything outside the debugger's access (browser console errors, system-level issues, etc.) — flag it and suggest where the user should look.
```

---

## Swarm workflow

Parallelize hypothesis testing when the hypotheses are genuinely independent — investigating them serially would waste time, and the findings from one don't change what another teammate should look for.

### Team setup

Create the team with `TeamCreate`: name `debug-{YYYYMMDD-HHMMSS}`, description `Debug: {issue summary}`. Register a shared task per hypothesis via `TaskCreate` — format `Investigate hypothesis: {description}`. Cap at 4 tasks; batch related hypotheses together if there are more.

### Teammate dispatch

Spawn one teammate per hypothesis via `Task` with `team_name` and `subagent_type: "general-purpose"`. Teammates can't see this conversation — embed everything they need as literal text.

<example name="Teammate spawn prompt">
You are investigating one hypothesis as part of a debug team.

PROBLEM DESCRIPTION:
{literal copy of user's problem — what's wrong, when it started, any error messages}

YOUR HYPOTHESIS:
{specific hypothesis this teammate tests}

ALL TEAM HYPOTHESES:
1. {hypothesis 1}
2. {hypothesis 2}
3. {hypothesis 3}
4. {hypothesis 4}

RELEVANT CONTEXT:
{error messages, log excerpts, DB state, recent commits — as literal text, not references}

PROJECT DEBUG INFO:
{relevant excerpts from DEBUG.md}

Your job is to confirm, eliminate, or flag your hypothesis as uncertain — backed by evidence. Investigate logs, DB state, git history, and file state with read-only tools (Read, Grep, Glob, Bash for `git log`, `ps`, `ls`). Read files completely, no limit/offset.

Constraints:
- Read-only. Don't modify the codebase, commit, or run build/test commands — other teammates are investigating concurrently and edits would cause interference.
- Communicate via `SendMessage` only — `AskUserQuestion` isn't available in team context. If blocked, send `BLOCKED: {reason}` to the lead.
- If you find evidence that contradicts another teammate's hypothesis, share it immediately via `SendMessage`: `"My investigation of {your hypothesis} found evidence that contradicts {other hypothesis}: {evidence with file:line or timestamp}"`. Cross-pollination is the whole point of running in parallel.

When you've gathered enough evidence to confirm, eliminate, or mark your hypothesis uncertain:
1. `TaskUpdate` your shared task complete with the findings.
2. `SendMessage` `DEBUG COMPLETE` to the lead.
3. Wait for `shutdown_request`.

Report status (confirmed / eliminated / uncertain) with supporting `file:line` or timestamp references. If eliminated, explain what this rules out; if confirmed, explain the root cause. Match report depth to the complexity of the finding.
</example>

### Convergence

Wait for all teammates to send `DEBUG COMPLETE`, up to 10 minutes per teammate from spawn. On timeout, proceed with available findings and note which teammates timed out in the report. If a teammate gets stuck (repeated identical messages, no progress): note the failure and proceed, respawn with tighter scope, or handle that hypothesis yourself — pick based on how critical it is to the root cause.

### Synthesis

Integrate teammate findings into a coherent debug report — not a mechanical merge. Use the same format as the standard workflow, with attribution:
- `[Teammate 1]`, `[Teammate 2]` for single-teammate findings
- `[Consensus]` for independently confirmed findings
- Highlight cross-hypothesis eliminations: "Evidence from log investigation contradicted the database state hypothesis, eliminating it."

### Cleanup invariant

**The team must be deleted before the command returns, regardless of whether synthesis succeeded.** Skipping leaks team slots and orphans the shared task list.

1. `SendMessage` `type: "shutdown_request"` to each teammate.
2. Wait briefly for shutdown confirmations.
3. `TeamDelete`.

If cleanup itself errors, tell the user `"Team cleanup incomplete. You may need to check for lingering team resources."` and continue with the report.

---

## Generic quick reference

```bash
# Git state
git status
git log --oneline -10
git diff

# File investigation
find . -type f -mtime -1   # files changed in last day
ls -la [file]              # permissions / ownership

# Processes
ps aux | grep [process-name]
```

Project-specific commands live in `DEBUG.md` at the repo root. When the generic reference and `DEBUG.md` disagree, `DEBUG.md` wins.
