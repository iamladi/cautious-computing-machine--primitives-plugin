# Full PR Workflow Example

End-to-end workflow from issue to merged PR using primitives plugin commands.

## Scenario

GitHub issue #342 assigned to you: "feat: add export to CSV functionality"

## Complete Workflow

### Step 1: Generate branch from issue

```bash
/generate_branch feat 342 a8f3d91c "add csv export functionality"
```

**Output:**
```
✓ Switched to main
✓ Pulled latest changes
✓ Created and switched to branch

feat-342-a8f3d91c-add-csv-export
```

### Step 2: Prime your context

Before starting implementation, understand the codebase:

```bash
/prime
```

**Output:**
```
📂 Repository Structure:

src/
├── api/           # REST API endpoints
├── services/      # Business logic
├── utils/         # Helper functions
├── types/         # TypeScript types
└── exporters/     # 🎯 Export functionality (PDF, JSON)

tests/
├── unit/
└── integration/

Key patterns:
- Exporters implement IExporter interface
- Each format in separate file: pdf-exporter.ts, json-exporter.ts
- Tests use fixtures from tests/fixtures/sample-data.ts

Relevant for CSV export:
- Add: src/exporters/csv-exporter.ts
- Interface: src/types/exporter.ts
- Tests: tests/unit/exporters/csv-exporter.test.ts
```

### Step 3: Implement the feature

*...work on implementation...*

After implementing CSV export with tests and docs, you have:
- `src/exporters/csv-exporter.ts` (new)
- `src/exporters/index.ts` (modified)
- `src/types/exporter.ts` (modified)
- `tests/unit/exporters/csv-exporter.test.ts` (new)
- `tests/fixtures/csv-samples.ts` (new)
- `package.json` (modified - added csv library)
- `README.md` (modified)
- `docs/export-formats.md` (modified)

### Step 4: Smart commit

```bash
/commit "add CSV export functionality"
```

**Output:**
```
🔍 Analyzing changes...

Branch: feat-342-a8f3d91c-add-csv-export ✓
Changed: 8 files

📦 Batches:
  1. Core (3 files) - feat(export)
  2. Dependencies (1 file) - chore(deps)
  3. Tests (2 files) - test(export)
  4. Docs (2 files) - docs(export)

✅ Creating commits...

📝 feat(export): add CSV export functionality

   Implements CSV exporter with RFC 4180 compliance.
   Supports custom delimiters, headers, and escaping.

   Files: src/exporters/csv-exporter.ts, src/exporters/index.ts, src/types/exporter.ts
   ✓ b3c9e2a

📝 chore(deps): add csv-stringify library

   Add csv-stringify for robust CSV generation with proper escaping.

   Files: package.json
   ✓ c4d0f3b

📝 test(export): add CSV exporter tests

   Cover delimiter options, escaping, headers, and edge cases.

   Files: tests/unit/exporters/csv-exporter.test.ts, tests/fixtures/csv-samples.ts
   ✓ d5e1g4c

📝 docs(export): document CSV export format

   Add CSV export examples and configuration options.

   Files: README.md, docs/export-formats.md
   ✓ e6f2h5d

✨ Summary: 4 commits, 8 files changed

Next: git push -u origin feat-342-a8f3d91c-add-csv-export
```

### Step 5: Push and create PR

```bash
/pr 342
```

**Behind the scenes:**
```
🔍 Analyzing PR context...

✓ Fetching issue #342 details
✓ Analyzing commits
✓ Generating PR summary

Issue details:
  Type: feat
  Number: 342
  Title: add export to CSV functionality

Commits to include:
  b3c9e2a feat(export): add CSV export functionality
  c4d0f3b chore(deps): add csv-stringify library
  d5e1g4c test(export): add CSV exporter tests
  e6f2h5d docs(export): document CSV export format

Files changed (8):
  M package.json
  M src/exporters/index.ts
  M src/types/exporter.ts
  M README.md
  M docs/export-formats.md
  A src/exporters/csv-exporter.ts
  A tests/unit/exporters/csv-exporter.test.ts
  A tests/fixtures/csv-samples.ts

✓ Pushed to origin
✓ Creating PR...
```

**Output:**
```
https://github.com/yourorg/yourrepo/pull/156
```

### Step 6: View the generated PR

**Title:**
```
feat: #342 - add export to CSV functionality
```

**Body:**
```markdown
## Summary

Implements CSV export functionality for data export feature. Users can now
export data in CSV format with configurable delimiters and headers.

Closes #342

## Implementation

### Added
- CSV exporter implementing `IExporter` interface
- Support for RFC 4180 compliant CSV generation
- Configurable delimiters, headers, and escaping
- Comprehensive test coverage

### Dependencies
- Added `csv-stringify` for robust CSV generation

## Changes

### Core Implementation
- `src/exporters/csv-exporter.ts` - New CSV exporter class
- `src/exporters/index.ts` - Export CSV exporter
- `src/types/exporter.ts` - Add CSV options types

### Tests
- `tests/unit/exporters/csv-exporter.test.ts` - Full test suite
- `tests/fixtures/csv-samples.ts` - Test fixtures

### Documentation
- `README.md` - Add CSV export examples
- `docs/export-formats.md` - Document CSV format options

### Dependencies
- `package.json` - Add csv-stringify

## Checklist

- [x] Implementation follows existing exporter patterns
- [x] Comprehensive unit tests added
- [x] Documentation updated
- [x] No breaking changes
- [x] Dependencies properly documented

## Testing

```typescript
const exporter = new CsvExporter();
const csv = await exporter.export(data, {
  delimiter: ',',
  headers: true,
  escape: true
});
```

## Files Changed (8)

```
 M package.json
 M src/exporters/index.ts
 M src/types/exporter.ts
 M README.md
 M docs/export-formats.md
 A src/exporters/csv-exporter.ts
 A tests/unit/exporters/csv-exporter.test.ts
 A tests/fixtures/csv-samples.ts
```
```

## Complete Timeline

```
Issue #342 created
    ↓
/generate_branch feat 342 a8f3d91c "add csv export functionality"
    ↓ (branch: feat-342-a8f3d91c-add-csv-export)
/prime
    ↓ (understand codebase structure)
Implementation work
    ↓ (8 files changed)
/commit "add CSV export functionality"
    ↓ (4 atomic commits)
/pr 342
    ↓
PR #156 created
    ↓
Code review
    ↓
Merge to main
    ↓
Issue #342 closed ✓
```

## Benefits of This Workflow

1. **Semantic branch names**: `feat-342-a8f3d91c-add-csv-export` clearly shows purpose
2. **Context priming**: Understood codebase before coding
3. **Atomic commits**: Each commit is focused and revertable
4. **Convention following**: All commits follow `type(scope): description`
5. **Rich PR context**: PR automatically includes all relevant info
6. **Traceable**: Issue number in branch name, commits, and PR

## Time Saved

**Manual workflow:** ~15 minutes
- Thinking of branch name: 2 min
- Creating commits: 5 min (thinking of messages)
- Crafting PR description: 5 min
- Formatting and linking: 3 min

**With primitives:** ~30 seconds
- `/generate_branch` + `/commit` + `/pr`: 30 sec

**Saved: ~14.5 minutes per feature**

## Variations

### With Implementation Plan

If you have a plan file:

```bash
/pr 342 .tasks/feature-342-csv-export.md
```

PR will include link to the plan:

```markdown
## Implementation Plan

See [implementation plan](.tasks/feature-342-csv-export.md) for detailed approach.
```

### Debugging During Implementation

If you hit issues while implementing:

```bash
/debug
```

Investigate without losing your main window context, then continue.

### Setup New Project

First time on a new codebase:

```bash
/install    # Verify tooling and deps
/prime      # Understand structure
/start      # Start dev environment
```

Then begin feature work.
