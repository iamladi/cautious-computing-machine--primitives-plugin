import type { EvalCase } from '../eval.types.ts'
import { commonStructural } from '../shared-assertions.ts'

const evalCase: EvalCase = {
  promptFile: 'commands/debug.md',
  description: 'Debug command performs hypothesis-driven investigation',
  structural: [
    ...commonStructural(),
    {
      name: 'mentions-hypothesis',
      test: (content) => /hypothes/i.test(content)
    },
    {
      name: 'mentions-parallel-investigation',
      test: (content) => /parallel|concurrent|simultaneous/i.test(content)
    },
    {
      name: 'mentions-root-cause',
      test: (content) => /root cause/i.test(content)
    },
    {
      name: 'mentions-logs-and-git',
      test: (content) => /log/i.test(content) && /git/i.test(content)
    },
  ],
}

export default evalCase
