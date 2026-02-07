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
      name: 'mentions-safe-commands-or-reference-loading',
      test: (content) => /cut.*-d.*-f1/i.test(content) || /env-check-commands\.md/i.test(content)
    },
    {
      name: 'no-unsafe-patterns-in-code-blocks',
      test: (content) => {
        // Extract code blocks and check for unsafe patterns there (not in constraint text)
        const codeBlocks = content.match(/```[\s\S]*?```/g) || []
        return !codeBlocks.some(block => /\benv\s*\|\s*grep\b/.test(block))
      }
    },
  ],
}

export default evalCase
