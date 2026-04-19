---
name: autoresearch
description: "Autonomously optimize any Claude Code skill by running it repeatedly, scoring outputs against binary evals, mutating the prompt, and keeping improvements. Based on Karpathy's autoresearch methodology. Use when: optimize this skill, improve this skill, run autoresearch on, make this skill better, self-improve skill, benchmark skill, eval my skill, run evals on. Outputs: an improved SKILL.md, a results log, and a changelog of every mutation tried."
---

# Autoresearch for Skills

## Role

Adapt Karpathy's autoresearch methodology (autonomous experimentation loops) to Claude Code skills. Instead of optimizing ML training code, optimize skill prompts: run the target skill repeatedly against a fixed eval suite, mutate the prompt one change at a time, keep what improves the score, discard what doesn't.

Related rails: [karpathy-principles](../karpathy-principles/SKILL.md) collects the four Karpathy coding-with-AI principles this skill's methodology comes from.

Most skills work ~70% of the time. The remaining 30% is usually a handful of recurring failure patterns that one targeted mutation can fix. The point of this skill is to find and apply those mutations empirically, not to rewrite the whole prompt from guesswork.

## Priorities

Empirical improvement > Reproducibility > Simplicity > Runtime

## Effort

Run at `high` thinking effort. The core loop is hypothesis → mutation → score; each step benefits from careful reasoning about *which* failure pattern to target next, which is exactly what `high` effort is for.

## Scope

This skill mutates a working copy of the target skill, never the original. The original `SKILL.md` stays untouched throughout — the user can review, diff, and manually apply changes once autoresearch finishes.

---

## Context gathering

Confirm all of the following with the user before starting any experiments. Missing any field, ask — don't guess.

1. **Target skill** — exact path to the `SKILL.md` to optimize.
2. **Test inputs** — 3–5 prompts that cover the skill's actual use cases, chosen for variety. Narrow inputs encourage overfitting; varied inputs catch real failure modes.
3. **Eval criteria** — 3–6 binary yes/no checks defining a good output. See `references/eval-guide.md` for how to write evals that don't get gamed.
4. **Runs per experiment** — default 5. More runs reduce score noise; fewer runs cycle faster. 5 is the sweet spot for most skills.
5. **Run interval** — default every 2 minutes. Shorter cycles faster; longer cycles cost less.
6. **Budget cap** (optional) — max experiment cycles before stopping. Default: no cap (runs until user stops or ceiling hit).

Once confirmed, read the target skill in full — the `SKILL.md` and every file it references under `references/`. Identify its core job, process steps, output format, and any existing quality checks or anti-patterns. You can't improve a skill you haven't understood.

---

## Evals

Every eval is binary — pass or fail, no scales. Scales compound variability; yes/no is consistent across runs.

Format each eval as:

```
EVAL [number]: [Short name]
Question: [Yes/no question about the output]
Pass condition: [What "yes" looks like — specific enough to be reproducible]
Fail condition: [What triggers a "no"]
```

Good evals are specific (`"Are all words spelled correctly with no truncated sentences?"`), bad evals are vague (`"Is the text readable?"`) or gameable (`"Contains fewer than 200 words"` — will make the skill optimize for brevity at the expense of everything else).

Cap at 3–6 evals. More than that and the skill starts parroting eval criteria back instead of improving. See `references/eval-guide.md` for detailed examples.

**Max score** = (number of evals) × (runs per experiment). Example: 4 evals × 5 runs = 20.

---

## Output layout

Everything lives in `autoresearch-[skill-name]/` inside the skill's folder:

```
autoresearch-[skill-name]/
├── dashboard.html       # live browser dashboard (auto-refreshes every 10s)
├── results.json         # data file powering the dashboard
├── results.tsv          # score log, one row per experiment
├── changelog.md         # detailed mutation log
├── SKILL.md.baseline    # original skill snapshot — revert target
└── [user-chosen-name].md  # the mutating copy — all edits land here
```

The original `SKILL.md` is never modified. When the user asks what to name the mutating copy, default to `[original]-v2` or `[original]-optimized` but let the user pick.

### Dashboard

Generate `dashboard.html` as a single self-contained file: inline CSS and JavaScript, Chart.js loaded from CDN, auto-refreshes every 10 seconds by fetching `results.json`. Open it immediately (`open dashboard.html` on macOS) so the user sees progress live.

It should show: score progression line chart (experiment # on X, pass rate % on Y), one colored bar per experiment (green = keep, red = discard, blue = baseline), a table of all experiments with score and description, per-eval breakdown of which evals pass most/least across runs, and a status line (`Running experiment N…` / `Idle` / `Done`). Styling: soft colors, white background, clean sans-serif.

### results.json (dashboard source)

```json
{
  "skill_name": "[name]",
  "status": "running",
  "current_experiment": 3,
  "baseline_score": 70.0,
  "best_score": 90.0,
  "experiments": [
    {
      "id": 0,
      "score": 14,
      "max_score": 20,
      "pass_rate": 70.0,
      "status": "baseline",
      "description": "original skill — no changes"
    }
  ],
  "eval_breakdown": [
    {"name": "Text legibility", "pass_count": 8, "total": 10},
    {"name": "Pastel colors", "pass_count": 9, "total": 10}
  ]
}
```

Update `results.json` after every experiment so the dashboard stays current. On termination, set `status: "complete"`.

### results.tsv

Tab-separated, one row per experiment:

```
experiment	score	max_score	pass_rate	status	description
0	14	20	70.0%	baseline	original skill — no changes
1	16	20	80.0%	keep	added explicit instruction to avoid numbering in diagrams
2	16	20	80.0%	discard	tried enforcing left-to-right layout — no improvement
```

---

## Baseline

Before mutating anything, measure the starting point. This is experiment #0.

1. Ask the user for the mutating-copy filename (`"What should I call the optimized version?"`).
2. Create the working directory `autoresearch-[skill-name]/`.
3. Copy the original `SKILL.md` to the working directory twice: once as `[user-chosen-name].md` (the file you mutate) and once as `SKILL.md.baseline` (the revert target).
4. Initialize `results.tsv` with the header row, `results.json` with baseline scaffolding, and `dashboard.html`. Open the dashboard.
5. Run the skill `N` times using the test inputs — for every test input, a full run of `[user-chosen-name].md`. Score every output against every eval.
6. Record the baseline in both `results.tsv` and `results.json`.

If baseline is already ≥ 90%, confirm with the user whether to proceed — the skill may not need optimization.

---

## Experiment loop

Once started, run autonomously. The loop is: analyze failures → form one hypothesis → mutate → run → score → keep or discard → log → repeat.

### Per iteration

1. **Analyze failures.** Read the actual outputs that failed. Look at which evals are failing most across every run. Identify the pattern — formatting issue? Missing instruction? Ambiguous directive?

2. **Form one hypothesis.** Pick exactly one change to try this round. Changing five things at once means you can't attribute the score delta to any of them.

   Mutations that usually help:
   - Add a specific instruction that addresses the most common failure.
   - Reword an ambiguous instruction more explicitly.
   - Add an anti-pattern for a recurring mistake.
   - Move a buried instruction higher (priority ≈ position).
   - Add a worked example of the correct behavior.
   - Remove an instruction that's causing the skill to over-optimize in one dimension at the expense of another.

   Mutations that usually don't:
   - Rewriting the skill from scratch.
   - Adding 10 new rules at once.
   - Making the skill longer without a specific reason.
   - Vague additions like "make it better" or "be more creative."

3. **Apply the change.** Edit `[user-chosen-name].md` only. The original `SKILL.md` stays untouched.

4. **Run the experiment.** Execute the mutated skill `N` times with the same test inputs used for baseline.

5. **Score every output against every eval.** Compute the total score across all runs.

6. **Keep or discard.**
   - Score improved → keep. This is the new baseline for `[user-chosen-name].md`.
   - Score unchanged → discard (revert). The change added complexity without improvement.
   - Score worse → discard (revert).

7. **Log.** Append a row to `results.tsv`, update `results.json`, and append a detailed entry to `changelog.md` (see format below).

### Termination criteria

The loop runs autonomously because the user is often away from the computer. It terminates when any of the following are true:

- The user manually stops it.
- The budget cap (if set) is reached.
- The skill hits ≥ 95% pass rate for 3 consecutive experiments — at that point, further mutations mostly churn without moving the score.

These are the only reasons to stop. Asking the user mid-loop "should I continue?" defeats the point of running autonomously — the user chose autoresearch precisely to avoid that interruption.

If you run out of mutation ideas before termination: re-read the failing outputs for patterns you missed, combine two previous near-miss mutations into one test, try a completely different approach to the same failure, or try removing things instead of adding. Simplification that holds the score is itself a win.

### Changelog entry format

After every experiment (kept or discarded):

```markdown
## Experiment [N] — [keep/discard]

**Score:** [X]/[max] ([percent]%)
**Change:** [One sentence describing the mutation]
**Reasoning:** [Why this change was expected to help]
**Result:** [What actually happened — which evals improved or declined]
**Failing outputs:** [Brief description of what still fails, if anything]
```

The changelog is the most valuable artifact of an autoresearch run. It's a research log a future model (or a smarter future version of the same model) can pick up and continue from.

---

## Delivery

When the loop terminates, present:

1. Score summary: baseline → final, percent improvement.
2. Experiments run, and kept-vs-discarded counts.
3. Top 3 changes that helped most (from the changelog).
4. Remaining failure patterns, if any.
5. Path to the improved `[user-chosen-name].md` (in the working directory — the original `SKILL.md` is untouched).
6. Paths to `results.tsv` and `changelog.md` for reference.

Don't offer to overwrite the original skill. Don't copy the working file over `SKILL.md`. The whole point is that the original stays safe — the user decides whether and how to apply the improvements.

---

## Example — optimizing a diagram-generator skill

Context confirmed:
- Target: `~/.claude/skills/diagram-generator/SKILL.md`
- Test inputs: "OAuth flow diagram", "CI/CD pipeline", "microservices architecture", "user onboarding funnel", "database schema relationships"
- Evals: (1) All text legible and spelled correctly? (2) Uses only pastel/soft colors? (3) Linear left-to-right or top-to-bottom layout? (4) Free of numbers and ordinals?
- Runs per experiment: 10
- Max score: 40

Experiment 0 (baseline): 32/40 (80%). Common failures: 3 diagrams had numbered steps, 2 had bright red, 3 had illegible small text.

Experiment 1 — **keep** (35/40, 87.5%). Change: added an anti-pattern for step numbers, ordinals, and numerical ordering. Numbering failures dropped from 3 to 1.

Experiment 2 — **discard** (34/40, 85%). Change: added minimum 14px font requirement. Legibility ticked up by 1 but color compliance dropped by 2. Reverted.

Experiment 3 — **keep** (37/40, 92.5%). Change: replaced vague "pastel colors" with specific hex codes. Color eval went 8/10 → 10/10.

Experiment 4 — **discard** (37/40, 92.5%). Change: added anti-pattern for specific bright colors. No change — the hex codes already solved the color problem. Reverted to keep the skill simpler.

Experiment 5 — **keep** (39/40, 97.5%). Change: added a worked example showing a correct diagram. Hit 39/40. One remaining failure: complex diagram with overlapping labels. Diminishing returns — terminated.

Final: baseline 32/40 (80%) → final 39/40 (97.5%). 5 experiments, 3 kept, 2 discarded. Top changes: specific hex codes, explicit anti-numbering rule, worked example. Remaining issue: very complex diagrams occasionally overlap labels (1/40 failure rate).

---

## Success criteria

A good autoresearch run:

- Started with a baseline — nothing changed before measuring the starting point.
- Used binary evals only — no scales, no vibes, no "rate this 1–10".
- Changed one thing at a time, so each score delta is attributable.
- Kept a complete log — every experiment recorded, kept or discarded, with reasoning.
- Improved the score measurably from baseline to final.
- Didn't overfit — the skill got better at its actual job, not just at the specific test inputs.
- Ran autonomously from start to termination, without pausing to ask the user between experiments.

If the skill "passes" every eval but output quality hasn't actually improved, the evals are gamed — not the skill. Go back to eval design and write better ones.

---

## How this connects to other skills

Feeds in: any existing skill that needs optimization; user-supplied eval criteria (or help writing them via `references/eval-guide.md`).

Feeds out: the improved skill copy (user decides whether to adopt it); the changelog (portable — a future model can pick up and continue optimizing); the eval suite (reusable whenever the skill is edited).
