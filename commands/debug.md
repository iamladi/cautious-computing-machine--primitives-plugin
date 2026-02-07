---
description: Debug issues by investigating logs, database state, and git history
---

# Debug

## Priorities
Root cause accuracy > Hypothesis breadth > Speed

## Goal
Investigate a reported issue using logs, database state, and git history. Identify root cause through hypothesis-driven debugging. Read-only — no file editing.

## Constraints
- Read `DEBUG.md` in repo root first for project-specific debug info (log locations, database tools)
- If invoked with a plan/ticket file, read it for context on what's being implemented/tested
- If invoked without parameters, ask user: what went wrong, what they were doing, when it last worked
- Form 2-4 hypotheses ranked by likelihood before investigating
- Spawn parallel investigation tasks: logs, database/backend state, git/file state
- Mark each hypothesis as confirmed/eliminated/uncertain with evidence
- Present findings as a structured debug report: what's wrong, hypotheses tested, evidence, root cause, fix, prevention
- Guide user to browser console or system tools for issues outside agent reach
- Do not edit files — investigation only

## Output
Structured debug report with: root cause statement, evidence from logs/database/git, recommended fix with specific commands, prevention steps, and alternative approaches if fix doesn't work.
