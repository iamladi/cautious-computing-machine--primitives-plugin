import type { StructuralAssertion } from './eval.types.ts'

// Structural assertions every prompt should pass
export function commonStructural(): StructuralAssertion[] {
  return [
    {
      name: 'has-priorities-section',
      test: (content) => /^## Priorities/m.test(content)
    },
    {
      name: 'no-important-stacking',
      test: (content) => {
        // No two IMPORTANT/CRITICAL within 3 lines of each other
        const lines = content.split('\n')
        for (let i = 0; i < lines.length - 3; i++) {
          const window = lines.slice(i, i + 3).join('\n')
          const matches = window.match(/\b(IMPORTANT|CRITICAL)\b/g)
          if (matches && matches.length >= 2) return false
        }
        return true
      }
    },
    {
      name: 'no-casual-language',
      test: (content) => !/(smart cookie|handy dandy|I believe in you|ultrathink|THE CARDINAL SIN)/i.test(content)
    },
  ]
}
