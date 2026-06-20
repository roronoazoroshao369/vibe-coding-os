---
description: Refactor a prompt into the 7-section prompt-architecture template (Persona, Context, Constraints, Toolset, Output Schema, Examples, Anti-patterns).
---

# vibe-prompt-architect

## What this command does

Refactors a freeform prompt into the 7-section prompt-architecture template and emits a markdown diff. The Anti-patterns section is required and load-bearing — at least 3 concrete failure modes with corrective actions.

## When to use

Run when a prompt drifts in quality, when adding a new prompt to `prompts/`, or when migrating a hard-coded prompt into the skill layer. Use after adopting the `prompt-architecture` skill.

## Inputs

- The freeform prompt to refactor.
- The agent or skill that will invoke the prompt.
- The output schema the caller expects.
- Known failure modes (≥ 3) for the Anti-patterns section.

## Outputs

- A refactored prompt artifact with 7 sections in order.
- A markdown diff against the original prompt.
- A passing run under `verification-before-done` 5-axis framework.

## Steps

1. Run `npm run vibe-prompt-architect -- --input=path/to/prompt.md --output=path/to/refactored.md`.
2. Verify the 7 sections appear in order: Persona, Context, Constraints, Toolset, Output Schema, Examples, Anti-patterns.
3. Confirm the Anti-patterns section has ≥ 3 failure modes with corrective actions.
4. Run `npm run vibe-verify -- --prompt=path/to/refactored.md` to apply the 5-axis verification.
5. Commit the refactored prompt under `prompts/<name>/SKILL.md` with a Conventional Commits `refactor(prompts):` prefix.

## Failure modes

- Skipping the Anti-patterns section.
- Writing Constraints as prose instead of bullets.
- Output Schema without a worked example.
- Persona written as "helpful assistant" — no scope, no differentiation.

## Verification checklist

- [ ] All 7 sections present and in order.
- [ ] Persona states scope in one sentence.
- [ ] Context lists inputs and assumptions as bullets.
- [ ] Constraints distinguish hard limits from soft preferences.
- [ ] Toolset lists tool names, order, and guard rails.
- [ ] Output Schema includes a worked example.
- [ ] Examples has ≥ 1 positive and ≥ 1 negative example.
- [ ] Anti-patterns has ≥ 3 concrete failure modes with corrective actions.
- [ ] Prompt verified under `verification-before-done` 5-axis framework.
