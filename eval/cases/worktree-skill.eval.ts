import type { EvalCase } from '../eval.types.ts'
import { commonStructural } from '../shared-assertions.ts'

const evalCase: EvalCase = {
  promptFile: 'skills/worktree/SKILL.md',
  description: 'Worktree skill creates isolated development environments',
  structural: [
    ...commonStructural(),
    {
      name: 'mentions-idempotent',
      test: (content) => /idempoten/i.test(content)
    },
    {
      name: 'mentions-error-handling',
      test: (content) => /error/i.test(content)
    },
  ],
}

export default evalCase
