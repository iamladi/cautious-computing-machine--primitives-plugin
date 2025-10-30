# Smart Commit Workflow Example

This example shows how `/commit` automatically batches changes and creates well-organized commits.

## Scenario

You've just finished implementing YAML extraction feature with tests and documentation. You have:
- 3 implementation files changed
- 3 new test files
- 2 documentation files updated
- 1 dependency added to package.json

## Workflow

### Step 1: Invoke the command

```bash
/commit
```

### Step 2: Automatic analysis

```
🔍 Analyzing changes...

Branch: main ⚠️
Changed: 9 files

⚠️ Never commit directly to main!
Creating feature branch based on changes...

✓ Created and switched to: feat/yaml-extraction-mode
```

### Step 3: Intelligent batching

```
📦 Detected 4 logical batches:

  1. Core implementation (3 files)
     - src/modes/yaml.ts
     - src/client.ts
     - src/types.ts
     Type: feat(yaml)

  2. Dependencies (1 file)
     - package.json
     Type: chore(deps)

  3. Tests (3 files)
     - tests/yaml.test.ts
     - tests/fixtures/yaml-samples.ts
     - tests/__snapshots__/yaml.test.ts.snap
     Type: test(yaml)

  4. Documentation (2 files)
     - README.md
     - docs/yaml-mode.md
     Type: docs(yaml)
```

### Step 4: Atomic commits created

```
✅ Creating commits...

📝 feat(yaml): add MD_YAML mode for YAML extraction

   Implements new YAML extraction mode with frontmatter support.
   Handles both single and multi-document YAML streams.

   Files: src/modes/yaml.ts, src/client.ts, src/types.ts
   ✓ a3c4e5f

📝 chore(deps): add yaml parsing library

   Add js-yaml for YAML parsing support in MD_YAML mode.

   Files: package.json
   ✓ b4d5f6a

📝 test(yaml): add comprehensive YAML mode tests

   Cover single/multi-document YAML, frontmatter, error cases.

   Files: tests/yaml.test.ts, tests/fixtures/yaml-samples.ts, tests/__snapshots__/yaml.test.ts.snap
   ✓ c5e6g7b

📝 docs(yaml): document MD_YAML mode usage

   Add usage examples and API reference for YAML extraction.

   Files: README.md, docs/yaml-mode.md
   ✓ d6f7h8c
```

### Step 5: Summary and next steps

```
✨ Summary: 4 commits, 9 files changed

📊 Git status:
   feat/yaml-extraction-mode is 4 commits ahead of main
   All changes committed

Next steps:
  git push -u origin feat/yaml-extraction-mode
  /pr <issue_number>  # Create pull request
```

## What Just Happened?

1. **Branch protection**: Detected main branch, created feature branch automatically
2. **Smart batching**: Grouped related files by purpose (implementation, tests, docs, deps)
3. **Conventional commits**: Each commit follows `type(scope): description` format
4. **Atomic commits**: Each commit is focused and could be reverted independently
5. **Proper sequencing**: Dependencies before tests, implementation before docs
6. **No `git add .`**: Files explicitly added per batch for safety

## Advanced: Handling Pre-commit Hooks

If pre-commit hooks fail:

```
📝 feat(yaml): add MD_YAML mode for YAML extraction

   ✗ Pre-commit hook failed:

   - Linting errors in src/modes/yaml.ts:34
   - Missing semicolon

   Attempting to fix...

   ✓ Fixed linting issues
   ✓ Re-running commit...
   ✓ a3c4e5f
```

## When to Use `/commit` vs Manual Commits

**Use `/commit` when:**
- Multiple files changed across different concerns
- Want conventional commit format enforced
- Need automatic batching logic
- Working on feature branches

**Use manual commits when:**
- Single file, single purpose change
- Need very specific commit message control
- Already have your own commit workflow
