---
description: Install dependencies and guide the user with missing parts
---

# Install

## Priorities
Correctness (deps resolve) > Completeness (all tools present) > Speed

## Goal
Install project dependencies and verify the development environment is ready.

## Constraints
- Verify `git` CLI and `gh` CLI are available; prompt user to install if missing
- Read `INSTALL.md` in repo root and follow its instructions; if absent, analyze repo and suggest creating one

## Output
Bullet-point summary: work done, missing/incomplete configurations, next steps.
