import type { EvalCase } from '../eval.types.ts'
import { commonStructural } from '../shared-assertions.ts'

const evalCase: EvalCase = {
  promptFile: 'skills/agent-native-architecture/SKILL.md',
  description: 'Agent-native architecture routes to correct reference files',
  structural: [
    ...commonStructural(),
    {
      name: 'has-routing-table',
      test: (content) => /routing|route.*reference|Response.*Action/i.test(content)
    },
    {
      name: 'references-existing-files',
      test: (content) => /architecture-patterns\.md/.test(content) &&
                          /mcp-tool-design\.md/.test(content)
    },
    {
      name: 'mentions-prompt-native-principles',
      test: (content) => /prompt.native|features are prompts/i.test(content)
    },
    {
      name: 'has-anti-patterns-reference',
      test: (content) => /anti.?pattern/i.test(content)
    },
  ],
}

export default evalCase
