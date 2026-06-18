# Skill: Quality Execution Contract

## Purpose

Force explicit intent declaration before any code edit. The contract makes the agent
think before coding, prevents scope creep, and ensures verification is planned — not
an afterthought.

## When to use

Apply to **every non-trivial coding task**: bug fixes, feature work, refactors, or
config changes that go beyond a one-line typo fix. If the task touches more than one
file or changes observable behavior, complete this contract first.

## Inputs

Task description, acceptance criteria, repository context, risk level, and file
inventory.

## Workflow

1. Fill in the contract template (`templates/quality-contract.md`) completely.
2. Declare the goal, acceptance criteria, and explicit non-goals.
3. Assess risk tier honestly — tiny means one-line; risky means data or API impact.
4. List files to inspect, files likely to change, and files explicitly NOT touched.
5. Identify new dependencies or public API changes with justification.
6. Gather context: inspect existing patterns, find similar implementations, locate
   relevant tests.
7. Write the test plan with exact commands and manual fallback steps.
8. Sign the four commitments.
9. Only after the contract is complete, proceed with the edit.
10. Run verification per the test plan before claiming done.

## Outputs

A completed Quality Execution Contract with explicit goal, acceptance criteria, risk
tier, scope boundaries, context evidence, test plan, and signed commitments.

## The contract (inline)

```markdown
## Understanding
- Goal:
- Acceptance criteria:
- Non-goals:

## Risk Assessment
- Risk tier: (tiny/small/medium/large/risky)
- Files to inspect:
- Files likely to change:
- Files NOT to touch:
- New dependencies? (none / list and justify)
- Public API changes? (no / describe and justify)

## Context Gathered
- Existing patterns inspected:
- Similar implementations found:
- Tests relevant:

## Test Plan
- Test command(s) to run:
- Manual verification if tests unavailable:

## Commitment
- I will make the smallest correct change
- I will run verification before claiming done
- I will not refactor unrelated code
- I will report honestly if verification could not run
```

## Failure modes

- Skipping the contract for "obvious" one-file changes that still alter behavior.
- Filling in the contract after coding — the value is in the pre-coding thinking.
- Claiming done without running the test plan.
- Leaving "Files NOT to touch" empty and then touching extras.
- Understating the risk tier to avoid writing a thorough plan.

## Verification checklist

- [ ] Contract filled in before any edits.
- [ ] Risk tier matches actual complexity.
- [ ] Test plan has runnable commands.
- [ ] Commitments are honest (no "N/A" for verification).
- [ ] Verification evidence collected after edits complete.

## Related skills

- `skills/core/verification-before-completion/SKILL.md` — evidence bar for completion claims.
- `skills/core/goal-driven-execution/SKILL.md` — turns an imperative into a verifiable goal.
- `skills/core/checkpoint-validation/SKILL.md` — phase gate validation pattern.
