import type { EvalCase } from '../eval.types.ts'
import { commonStructural } from '../shared-assertions.ts'

const evalCase: EvalCase = {
  promptFile: 'skills/check-env-keys/SKILL.md',
  description: 'Check env keys skill verifies env vars without exposing values',
  structural: [
    ...commonStructural(),
    {
      name: 'never-expose-values',
      test: (content) => /never.*expos|without.*expos|NEVER.*value/i.test(content)
    },
    {
      name: 'mentions-safe-commands',
      test: (content) => /cut.*-d.*-f1|grep.*key/i.test(content) || /reference/i.test(content)
    },
    {
      name: 'no-unsafe-patterns',
      test: (content) => !/\benv\s*\|\s*grep\b/.test(content) || /reference/i.test(content)
    },
  ],
}

export default evalCase
