# Onboarding Template for Reasoning-Based System Prompts

This template guides the creation of system prompts structured as onboarding documents. Each section shapes how the AI reasons about its role, not just what rules it follows.

---

## Section 1: Identity

**Purpose**: Establishes who the AI is and what context it operates in. This helps the model understand its role without rigid constraints.

**Why this matters**: Models perform better when they understand their operating environment. Instead of "you are a chatbot," describe the actual context: are they embedded in a product? Supporting specific users? Operating with specific constraints?

**Example (good)**:
```
You are an AI assistant embedded in Acme Corp's developer portal. You help backend engineers debug API integration issues, understand authentication flows, and navigate our internal microservices architecture.

Your responses are read by experienced developers who value precision over hand-holding. They're debugging production issues under time pressure.
```

**Example (bad)**:
```
You are a helpful AI assistant. Be friendly and answer questions.
```

**Common mistakes**:
- Too generic ("you are an AI assistant")
- Missing context about who uses this and why
- Confusing identity with rules ("you must never...")

**How much detail**: 2-4 sentences that set the stage. Answer: Who am I? What's my context? Who am I helping?

---

## Section 2: Goals

**Purpose**: Defines success criteria so the model can evaluate its own output. Goals are judgment criteria, not checklists.

**Why this matters**: Instead of "always do X," explain what good looks like. The model can then reason about whether its response meets that standard.

**Example (good)**:
```
Success means:
- The developer can immediately act on your response (no ambiguity)
- You've identified root cause, not just symptoms
- Code examples are minimal and directly applicable
- You've anticipated the next question and addressed it preemptively
```

**Example (bad)**:
```
- Answer all questions
- Be helpful
- Use proper formatting
```

**Common mistakes**:
- Vague goals ("be helpful")
- Process-focused instead of outcome-focused
- Too many goals (>5 makes them meaningless)

**How much detail**: 3-5 concrete success criteria. Each should be something the model can evaluate about its own response.

---

## Section 3: Core Behaviors

**Purpose**: Always-applicable behaviors that shape every interaction, regardless of specific task.

**Why this matters**: These are the personality traits and interaction patterns that should persist. They're not rules ("never apologize"), they're patterns ("when you're uncertain, say so directly").

**Example (good)**:
```
In every interaction:
- State uncertainty clearly rather than hedging with "might" or "possibly"
- When debugging, show your reasoning process (what you checked, what you ruled out)
- Prefer concrete examples over abstract explanations
- If a request is ambiguous, ask clarifying questions before answering
```

**Example (bad)**:
```
- Always be polite
- Never use technical jargon
- Respond within 3 sentences
```

**Common mistakes**:
- Confusing behaviors with rules (rules are rigid, behaviors are adaptive)
- Tone guidance disguised as behavior ("be friendly" belongs in Tone section)
- Behaviors that conflict with each other

**How much detail**: 4-6 patterns that should show up in every response. Each describes HOW to approach interactions, not WHAT to do.

---

## Section 4: Feature Sections

**Purpose**: Specific capabilities described with judgment criteria, not step-by-step procedures.

**Why this matters**: When the prompt needs to handle distinct capabilities (e.g., code review vs. code generation), each feature gets its own section with reasoning guidance.

**Example (good)**:
```
### Code Review

When reviewing code, focus on:
- Impact: Flag issues that affect correctness, security, or maintainability. Skip style nitpicks unless they obscure intent.
- Reasoning: Explain WHY something is problematic, not just WHAT is wrong.
- Alternatives: If you flag an issue, suggest a concrete fix.

Good review: "This auth check happens after the database query, so users can trigger expensive operations before auth fails. Move the auth check to line 12 (before the query)."

Bad review: "Consider adding error handling."
```

**Example (bad)**:
```
### Code Review

1. Check for errors
2. Verify syntax
3. Suggest improvements
4. Be thorough
```

**Common mistakes**:
- Step-by-step instructions (rigid, doesn't adapt to context)
- Missing examples of good vs. bad
- No guidance on tradeoffs (when to prioritize what)

**How much detail**: For each feature, provide: judgment criteria (what matters), examples (good/bad), and tradeoffs (when to prioritize different aspects).

---

## Section 5: Constraints with Reasoning

**Purpose**: Boundaries explained with WHY, not just WHAT. Helps the model understand the spirit of the constraint.

**Why this matters**: "Never do X" is brittle. "Don't do X because Y" lets the model reason about edge cases you didn't anticipate.

**Example (good)**:
```
**Don't auto-execute destructive commands** (git reset --hard, rm -rf, DROP TABLE, etc.)

Why: Users trust the AI to be cautious. Destructive actions can't be undone, and auto-execution removes the safety net of human review. Instead, show the command and ask for confirmation.

Exception: In sandbox environments clearly marked as such, auto-execution is safe.
```

**Example (bad)**:
```
Never execute:
- git reset --hard
- rm -rf
- DROP TABLE
```

**Common mistakes**:
- Bare "never" rules without reasoning
- Missing exceptions (every constraint has edge cases)
- Too many constraints (>8 makes them unenforceable)

**How much detail**: For each constraint, state: what's restricted, why it's restricted, and exceptions (if any). Keep constraints to 5-8 maximum.

---

## Section 6: Edge Case Principles

**Purpose**: How to handle situations the prompt doesn't explicitly cover.

**Why this matters**: You can't anticipate every edge case. Instead, provide reasoning principles the model can apply to novel situations.

**Example (good)**:
```
When you encounter something not explicitly covered:
1. Identify the underlying goal (what's the user trying to achieve?)
2. Consider risk (is this action reversible? What's the blast radius?)
3. Default to transparency (explain what you're uncertain about)
4. Ask for clarification if the path forward is ambiguous

Example: User asks "optimize this database." You don't have optimization procedures defined. Apply principles: Goal = improve performance. Risk = schema changes are dangerous. Transparency = "I can suggest index optimizations (low risk) or schema redesign (high risk). Which direction?"
```

**Example (bad)**:
```
If something isn't covered, ask the user what to do.
```

**Common mistakes**:
- No principles (just "ask the user")
- Principles that contradict core behaviors
- Too abstract (model can't apply them)

**How much detail**: 3-5 principles with at least one concrete example showing how to apply them.

---

## Section 7: Anti-Patterns

**Purpose**: What NOT to do, with reasoning so the model understands the spirit.

**Why this matters**: Sometimes it's clearer to say what to avoid. But bare "never" rules are brittle—explain WHY to avoid.

**Example (good)**:
```
**Don't assume user intent**

Why: "Fix this code" could mean fix bugs, improve performance, refactor for clarity, or fix style issues. Each requires different changes. Asking clarifying questions saves time.

Bad: *User says "fix this." AI rewrites entire function without asking what's broken.*

Good: *"Fix" could mean several things. Are you seeing an error, or looking to improve performance/readability?"*
```

**Example (bad)**:
```
Never:
- Assume intent
- Make changes without asking
- Be verbose
```

**Common mistakes**:
- Bare "never" lists without reasoning
- Anti-patterns that conflict with core behaviors
- No examples showing the anti-pattern in action

**How much detail**: 4-6 anti-patterns, each with: what to avoid, why to avoid it, and a good/bad example.

---

## Section 8: Tone Guide

**Purpose**: How to communicate, with examples showing good and bad responses.

**Why this matters**: Tone is hard to describe abstractly ("be professional"). Examples make it concrete.

**Example (good)**:
```
**Tone: Direct and technical, skip the niceties**

Users are experienced developers debugging under time pressure. They value speed over friendliness.

Good response:
"The auth token expired. Regenerate with: `curl -X POST /api/token`"

Bad response:
"I'd be happy to help! It looks like your authentication token may have expired. You might want to try regenerating it. Here's how you could do that: ..."

Key patterns:
- Lead with the answer, not preamble
- No "I'd be happy to help" or "great question!"
- Technical precision over conversational warmth
- When uncertain, say "I'm not sure" not "I think maybe possibly"
```

**Example (bad)**:
```
Be professional but friendly. Use clear language.
```

**Common mistakes**:
- Describing tone abstractly without examples
- Examples that don't match the description
- Tone guidance that conflicts with core behaviors

**How much detail**: Describe the tone (2-3 sentences), then show 2-3 good/bad example pairs. Focus on patterns, not individual phrases.

---

## Usage Notes

**When to use each section**:
- Identity: Always include (sets the stage)
- Goals: Always include (defines success)
- Core Behaviors: Always include (shapes all interactions)
- Feature Sections: Only if there are distinct capabilities (code review vs. generation, etc.)
- Constraints: Include if there are hard boundaries (destructive actions, secrets, etc.)
- Edge Case Principles: Always include (handles novel situations)
- Anti-Patterns: Optional (use if there are common failure modes to avoid)
- Tone Guide: Always include (examples make tone concrete)

**How to customize**:
- Start with Identity, Goals, Core Behaviors (the foundation)
- Add Constraints only if needed (fewer is better)
- Use Feature Sections if capabilities are distinct
- Always include Edge Case Principles (handles unknowns)
- Add Anti-Patterns if there are common mistakes
- Finish with Tone Guide (examples clarify everything)

**Reasoning-based, not rule-based**:
- Explain WHY for every constraint
- Provide judgment criteria, not checklists
- Show examples (especially good/bad pairs)
- Allow the model to reason about edge cases

**Final check**:
- Can the model evaluate its own output against the goals?
- Are constraints explained with reasoning?
- Do examples clarify abstract descriptions?
- Are there principles for handling novel situations?
