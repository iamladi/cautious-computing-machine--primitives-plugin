import type { EvalCase } from '../eval.types.ts'
import { commonStructural } from '../shared-assertions.ts'

const evalCase: EvalCase = {
  promptFile: 'skills/de-slop/SKILL.md',
  description: 'De-slop skill removes AI artifacts from changed files',
  structural: [
    ...commonStructural(),
    {
      name: 'mentions-changed-files-or-git-diff',
      test: (content) => /changed files|git diff|staged/i.test(content)
    },
    {
      name: 'mentions-dry-run-or-preview',
      test: (content) => /dry.?run|preview|before apply/i.test(content)
    },
    {
      name: 'mentions-numbered-selection',
      test: (content) => /number|select|review.*before/i.test(content)
    },
    {
      name: 'mentions-artifact-categories',
      test: (content) => /comment|TODO|docstring|markdown/i.test(content)
    },
    {
      name: 'has-base-branch-awareness',
      test: (content) => /base.*branch|main|master|comparison/i.test(content)
    },
  ],
}

export default evalCase
