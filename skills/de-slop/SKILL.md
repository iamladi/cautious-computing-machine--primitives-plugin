---
name: de-slop
description: Remove AI-generated artifacts and unnecessary code before committing. Scans changed files for redundant comments, AI TODOs, excessive docstrings, and unnecessary markdown files. Git-only, no GitHub required.
---

# De-Slop

## Priorities
Precision (only flag real slop) > Coverage (catch all categories) > Speed

## Goal
Scan changed files for AI-generated artifacts (redundant comments, AI TODOs, excessive docstrings, unnecessary markdown, mock-heavy tests, fake data) and remove them. Git-only, no GitHub PRs.

## Constraints
- Determine comparison base: use `$ARGUMENTS` as base branch, default to main/master
- Only scan git-tracked changed files (staged + unstaged vs base branch)
- Never modify files not changed in current working tree
- Dry-run first: present numbered list of findings with ±3 lines of context
- Wait for user selection before modifying anything (numbers, ranges, "all", "none")
- "all" applies only to action items (delete/remove/simplify), never to flags (review-needed)
- Preserve comments that explain WHY; remove comments that restate WHAT
- AI TODOs (vague, no assignee, no issue) → remove. Real TODOs (specific, with ticket/date) → keep
- Never delete: README.md, CONTRIBUTING.md, CHANGELOG.md, docs/** directory, test files (only flag)
- Confirm before: deleting >5 files, removing >50 lines total, user says "all" with >10 items
- Show before/after for every edit
- Load slop pattern catalog from reference for detection rules

## Output
Per-file diff showing removals. Summary: files scanned, artifacts removed by category, files cleaned vs skipped. Flagged items for manual review listed separately.

## References
Load slop pattern catalog:
- `Glob(pattern: "**/primitives/**/references/slop-patterns.md", path: "~/.claude/plugins")` → Read result
