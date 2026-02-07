import type { EvalCase } from '../eval.types.ts'
import { commonStructural } from '../shared-assertions.ts'

const evalCase: EvalCase = {
  promptFile: 'skills/avoid-feature-creep/SKILL.md',
  description: 'Avoid feature creep skill enforces scope boundaries',
  structural: [
    ...commonStructural(),
    {
      name: 'mentions-decision-framework',
      test: (content) => /decision|framework|checklist/i.test(content)
    },
    {
      name: 'mentions-scope-boundaries',
      test: (content) => /scope|boundary|MVP/i.test(content)
    },
  ],
}

export default evalCase
