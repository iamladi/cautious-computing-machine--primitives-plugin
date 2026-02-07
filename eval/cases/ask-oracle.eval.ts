import type { EvalCase } from '../eval.types.ts'
import { commonStructural } from '../shared-assertions.ts'

const evalCase: EvalCase = {
  promptFile: 'skills/ask-oracle/SKILL.md',
  description: 'Ask Oracle skill delegates to GPT-5 Pro for hard problems',
  structural: [
    ...commonStructural(),
    {
      name: 'mentions-preview-tokens',
      test: (content) => /preview|token|budget/i.test(content)
    },
    {
      name: 'mentions-model-selection',
      test: (content) => /GPT-5|model/i.test(content)
    },
    {
      name: 'mentions-background-session',
      test: (content) => /background|session|resume/i.test(content)
    },
  ],
}

export default evalCase
