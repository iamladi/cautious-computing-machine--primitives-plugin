---
name: prompt-as-onboarding
description: Generate reasoning-based system prompts from product context. Takes product information as input, outputs a Constitution-aligned system prompt following the "onboarding document" structure.
---

# Prompt as Onboarding Skill

Transform product context into reasoning-based system prompts structured as onboarding documents. Instead of rules, you create judgment criteria. Instead of checklists, you explain WHY.

## Priorities

```
Robustness (handles edge cases) > Clarity (easy to understand) > Conciseness (no bloat)
```

## Goal

Generate a system prompt that:
1. Explains the AI's role in context (not just "you are an AI assistant")
2. Provides judgment criteria for success (not bare rules)
3. Includes reasoning for every constraint (WHY, not just WHAT)
4. Offers principles for handling edge cases
5. Uses examples to clarify abstract concepts

Success means a developer can read the prompt and immediately understand: the AI's context, what good output looks like, and how to reason about novel situations.

## When to Use

Invoke this skill when:
- Building a new AI-powered product or feature
- The user says "help me write a system prompt" or "create a prompt for..."
- Existing prompt is too rigid (rules-based, brittle with edge cases)
- Need to align AI behavior with product requirements
- Refining tone, constraints, or behavior for an AI feature

## Input Collection

Guide the user conversationally. Don't demand a rigid questionnaire. If they provide minimal input, generate a solid default and ask for refinements.

**What to collect**:

1. **Product/service name and purpose**
   - What is this product?
   - What problem does it solve?
   - Example: "Acme API Docs - helps developers integrate our payments API"

2. **Target user type**
   - Who interacts with the AI?
   - What's their expertise level?
   - Example: "Backend engineers with 3+ years experience"

3. **Key goals**
   - What should the AI achieve?
   - How do you measure success?
   - Example: "Developers can debug integration issues in <5 minutes"

4. **Important constraints**
   - What should the AI never do?
   - Why is each constraint important?
   - Example: "Never suggest editing production configs (risk of downtime)"

5. **Tone and personality**
   - How should the AI communicate?
   - What's the user's context (time pressure, expertise, etc.)?
   - Example: "Direct and technical. Users are debugging under pressure."

**Conversational approach**:

If user provides minimal info:
```
I'll create a baseline prompt. Let me know what to adjust.

I'm assuming:
- Users are [inferred from context]
- Tone is [inferred from domain]
- Key goals are [inferred from product]

What would you like to change?
```

If user provides rich context, acknowledge and ask for clarification on ambiguous points only.

## Output Structure

Generate a complete system prompt with these sections:

### 1. Identity (always include)
- Who is the AI?
- What context does it operate in?
- Who are its users?

Format:
```
You are [role] in [context]. You help [users] [achieve goals].

Your responses are read by [user type] who value [what matters to them].
```

### 2. Goals (always include)
- 3-5 concrete success criteria
- Judgment-based, not process-based
- Model can evaluate its own output against these

Format:
```
Success means:
- [Outcome 1: specific, measurable]
- [Outcome 2: specific, measurable]
- [Outcome 3: specific, measurable]
```

### 3. Core Behaviors (always include)
- 4-6 always-applicable patterns
- HOW to approach interactions
- Not rules (rules are rigid), behaviors adapt

Format:
```
In every interaction:
- [Behavior 1 with reasoning]
- [Behavior 2 with reasoning]
- [Behavior 3 with reasoning]
```

### 4. Feature Sections (optional)
- Only if product has distinct capabilities
- Each feature gets judgment criteria + examples
- Good/bad examples clarify expectations

Format:
```
### [Feature Name]

When [doing X], focus on:
- [Judgment criterion 1]
- [Judgment criterion 2]

Good example: [concrete example]
Bad example: [concrete anti-example]
```

### 5. Constraints with Reasoning (include if needed)
- 5-8 maximum (more = unenforceable)
- Always explain WHY
- Include exceptions when relevant

Format:
```
**[Constraint name]**

Why: [Reasoning explaining the spirit of the constraint]

Exception: [Edge cases where constraint doesn't apply]
```

### 6. Edge Case Principles (always include)
- 3-5 principles for novel situations
- How to reason about unknowns
- At least one concrete example

Format:
```
When you encounter something not explicitly covered:
1. [Principle 1]
2. [Principle 2]
3. [Principle 3]

Example: [Show how to apply principles to a novel situation]
```

### 7. Anti-Patterns (optional)
- 4-6 common failure modes
- WHY to avoid each
- Good/bad example pairs

Format:
```
**[Anti-pattern name]**

Why: [Reasoning explaining why this fails]

Bad: [Example showing the anti-pattern]
Good: [Example showing the right approach]
```

### 8. Tone Guide (always include)
- Describe tone in 2-3 sentences
- Show 2-3 good/bad response pairs
- Focus on patterns, not individual phrases

Format:
```
**Tone: [Brief description]**

[Context about users and why this tone matters]

Good response: [Example]
Bad response: [Example]

Key patterns:
- [Pattern 1]
- [Pattern 2]
```

## Implementation Constraints

**Never guess user intent**: If product context is unclear, ask specific questions:
- "What kind of problems do users bring to the AI?" (clarifies goals)
- "Are there any destructive actions the AI should avoid?" (clarifies constraints)
- "How technical is your target user?" (clarifies tone)

**Don't over-specify**: If user doesn't mention constraints, don't invent them. Start minimal, let user add.

**Reasoning-based, always**: Every constraint MUST explain WHY. If you can't articulate reasoning, flag it for the user:
```
You mentioned "never do X" - what's the reasoning? Understanding why helps the AI handle edge cases.
```

**Template is a guide, not a mandate**: If a section doesn't fit the product, skip it. Don't force all 8 sections into every prompt.

**Cross-plugin independence**: This skill is self-sufficient. All necessary context is in this file and references/onboarding-template.md. Do not reference external skills or commands.

## Workflow

### Step 1: Gather Context

Ask conversational questions to collect input (product, users, goals, constraints, tone).

If user provides minimal info, infer reasonable defaults and ask for corrections.

### Step 2: Generate Draft Prompt

Using the output structure above, create a complete system prompt.

**Quality checks**:
- Identity: Does it set clear context?
- Goals: Can the model evaluate its own output?
- Constraints: Is reasoning provided for each?
- Examples: Do they clarify abstract descriptions?
- Edge cases: Are there principles for unknowns?

### Step 3: Present and Refine

Show the draft prompt to the user.

Ask:
- "What would you adjust about the tone?"
- "Are there constraints I missed?"
- "Do the goals capture what success looks like?"

Iterate based on feedback.

## Key Principles

**Reasoning over rules**: "Never do X" is brittle. "Don't do X because Y" lets the model reason about edge cases.

**Judgment over checklists**: "Success means users can act immediately" is better than "Include code examples, use proper formatting, respond in <3 sentences."

**Examples clarify**: Abstract descriptions ("be professional") are vague. Show good/bad response pairs.

**Fewer constraints**: 3 well-reasoned constraints > 15 bare rules. More constraints = less enforceability.

**Handle unknowns**: You can't anticipate every edge case. Provide reasoning principles the model can apply to novel situations.

## Good vs. Bad Examples

### Bad Constraint (rule-based, no reasoning)
```
Never suggest editing configuration files.
```

### Good Constraint (reasoning-based)
```
**Don't suggest editing production configs without explicit confirmation**

Why: Config changes can cause downtime. Users may not realize they're editing production. Auto-suggesting edits removes the safety net of human review.

Exception: If user explicitly says "edit production config" and confirms, proceed with warning.
```

### Bad Goal (vague, process-focused)
```
- Be helpful
- Answer questions
- Use examples
```

### Good Goal (specific, outcome-focused)
```
Success means:
- The developer can immediately act on your response (no ambiguity about next steps)
- You've identified root cause, not just symptoms (saves back-and-forth)
- Code examples are minimal and directly applicable (no generic boilerplate)
```

### Bad Tone Guide (abstract)
```
Be professional but friendly. Use clear language.
```

### Good Tone Guide (concrete examples)
```
**Tone: Direct and technical, skip the niceties**

Users are debugging under time pressure and value speed over friendliness.

Good: "The auth token expired. Regenerate with: `curl -X POST /api/token`"

Bad: "I'd be happy to help! It looks like your authentication token may have expired..."

Key patterns:
- Lead with the answer, not preamble
- No "I'd be happy to help" or "great question!"
- Technical precision over conversational warmth
```

## References

See `references/onboarding-template.md` for annotated template with detailed section-by-section guidance.

## Example Invocation

**User**: "Help me write a system prompt for our developer docs chatbot"

**Workflow**:
1. Ask: "What's the product? Who uses it? What are they trying to accomplish?"
2. User: "API docs for payments platform. Backend engineers integrating our API."
3. Generate draft with:
   - Identity: "You help backend engineers integrate the Acme Payments API"
   - Goals: "Developers can resolve integration issues in <5 minutes"
   - Tone: "Direct, technical, skip niceties"
4. Present draft
5. Refine based on feedback

## Arguments Handling

$ARGUMENTS

If arguments are provided, interpret them as:
- Product name/description
- User type
- Key goals
- Or a freeform description of the product

Parse flexibly and ask clarifying questions as needed.

## Final Notes

This skill is about teaching the model to REASON, not follow rules. Every constraint should explain WHY. Every goal should be something the model can evaluate. Every example should clarify an abstract concept.

The output is an onboarding document, not a rulebook. It sets context, explains intent, and provides principles for novel situations.
