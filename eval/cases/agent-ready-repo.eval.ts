import type { EvalCase } from '../eval.types.ts'
import { commonStructural } from '../shared-assertions.ts'

const evalCase: EvalCase = {
  promptFile: 'skills/agent-ready-repo-setup/SKILL.md',
  description: 'Agent-ready repo setup covers TypeScript strict and vertical slices',
  structural: [
    ...commonStructural(),
    {
      name: 'mentions-typescript-strict',
      test: (content) => /typescript.*strict|strict.*mode/i.test(content)
    },
    {
      name: 'mentions-vertical-slices',
      test: (content) => /vertical.*slice/i.test(content)
    },
    {
      name: 'mentions-agents-md',
      test: (content) => /AGENTS\.md|CLAUDE\.md/i.test(content)
    },
  ],
}

export default evalCase
