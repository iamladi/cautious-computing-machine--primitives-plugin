import type { EvalCase } from '../eval.types.ts'

// install.md — will get priorities after rewrite
const installEval: EvalCase = {
  promptFile: 'commands/install.md',
  description: 'Install command reads INSTALL.md and sets up dependencies',
  structural: [
    {
      name: 'mentions-install-md',
      test: (content) => /INSTALL\.md/i.test(content)
    },
    {
      name: 'mentions-git-or-gh',
      test: (content) => /git|gh/i.test(content)
    },
  ],
}

// prime.md — will get priorities after rewrite
const primeEval: EvalCase = {
  promptFile: 'commands/prime.md',
  description: 'Prime command reads README and summarizes codebase',
  structural: [
    {
      name: 'mentions-readme',
      test: (content) => /README/i.test(content)
    },
    {
      name: 'mentions-summarize',
      test: (content) => /summarize|understand/i.test(content)
    },
  ],
}

// start.md — no change, no priorities assertion
const startEval: EvalCase = {
  promptFile: 'commands/start.md',
  description: 'Start command reads RUN.md to start dev environment',
  structural: [
    {
      name: 'mentions-run-md',
      test: (content) => /RUN\.md/i.test(content)
    },
  ],
}

// tools.md — no change, no priorities assertion
const toolsEval: EvalCase = {
  promptFile: 'commands/tools.md',
  description: 'Tools command lists built-in tools',
  structural: [
    {
      name: 'mentions-tools-or-list',
      test: (content) => /tool|list/i.test(content)
    },
  ],
}

// worktree.md (command, not skill)
const worktreeCommandEval: EvalCase = {
  promptFile: 'commands/worktree.md',
  description: 'Worktree command delegates to worktree skill',
  structural: [
    {
      name: 'delegates-to-skill',
      test: (content) => /skill|Skill.*worktree|primitives:worktree/i.test(content)
    },
  ],
}

export const cases = [installEval, primeEval, startEval, toolsEval, worktreeCommandEval]
