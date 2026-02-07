import type { EvalCase } from '../eval.types.ts'

const evalCase: EvalCase = {
  promptFile: 'commands/commit.md',
  description: 'Commit command follows conventional commit format (stays procedural)',
  structural: [
    {
      name: 'mentions-conventional-commits',
      test: (content) => /conventional|feat|fix|refactor/i.test(content)
    },
    {
      name: 'mentions-safety-checks',
      test: (content) => /main|master|branch.*check|safety/i.test(content)
    },
    {
      name: 'mentions-logical-batching',
      test: (content) => /batch|group|atomic/i.test(content)
    },
    {
      name: 'no-important-stacking',
      test: (content) => {
        const lines = content.split('\n')
        for (let i = 0; i < lines.length - 3; i++) {
          const window = lines.slice(i, i + 3).join('\n')
          const matches = window.match(/\b(IMPORTANT|CRITICAL)\b/g)
          if (matches && matches.length >= 2) return false
        }
        return true
      }
    },
  ],
}

export default evalCase
