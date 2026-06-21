---
name: quality-execution-contract
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
  - quality
status: stable
---

# Skill: Quality Execution Contract

> Five-step copy-paste workflow for making safe, verified changes to an existing codebase. Prevents scope creep, hallucination, and untested changes.

## Purpose

Force explicit intent declaration before any code edit. The contract makes the agent
think before coding, prevents scope creep, and ensures verification is planned — not
an afterthought.

## When to use

Apply to **every non-trivial coding task**: bug fixes, feature work, refactors, or
config changes that go beyond a one-line typo fix. If the task touches more than one
file or changes observable behavior, complete this contract first.
Also use when:
- Bug fixes with unclear root cause
- Feature additions where safety matters more than speed
- Any change touching production-adjacent code
- When the user explicitly asks to **protect quality** or **avoid breaking things**
- During code review before merging

## Inputs

Task description, acceptance criteria, repository context, risk level, and file
inventory.

## Workflow

Follow the five-step quality workflow:

1. **Create a Contract** — Write a one-paragraph quality execution contract: goal, acceptance criteria, risk tier, files to touch/not touch.
   - Fill in the contract template (`templates/quality-contract.md`) completely.
   - Declare the goal, acceptance criteria, and explicit non-goals.
   - Assess risk tier honestly — tiny means one-line; risky means data or API impact.
   - List files to inspect, files likely to change, and files explicitly NOT touched.
   - Identify new dependencies or public API changes with justification.
   - Gather context: inspect existing patterns, find similar implementations, locate relevant tests.
   - Write the test plan with exact commands and manual fallback steps.
   - Sign the four commitments.
   - Only after the contract is complete, proceed with the edit.

2. **Right-Size Context** — Build a minimal context pack: only the files and lines relevant to the change.
   - Use `skills/core/code-context-pack/SKILL.md` for the context-pack protocol.

3. **Smallest Safe Diff** — Apply the smallest diff that satisfies the contract. No refactoring, no scope creep.

4. **Self-Review Against Criteria** — Re-read the contract and verify every acceptance criterion. Check for edge cases, side effects, regressions.

5. **Write the Scorecard** — Use `templates/quality-scorecard.md` to produce the verification scorecard. Run verification per the test plan before claiming done.

## Outputs

- A completed **Quality Execution Contract** with explicit goal, acceptance criteria, risk tier, scope boundaries, context evidence, test plan, and signed commitments.
- A **Context Pack** with only the relevant files/code (use `templates/code-context-pack-template.md`)
- The **Smallest Safe Diff** that satisfies the contract
- A **Self-Review** confirming every acceptance criterion is met
- A **Scorecard** documenting verification results (use `templates/quality-scorecard.md`)

## Key terms

- **Contract**: Binding agreement between AI and user about what will/won't be changed.
- **Scorecard**: Audit trail showing which acceptance criteria passed and which (if any) failed.
- **Quality Diff**: Side-by-side comparison of the generated diff against expected behavior.

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

- **No contract written**: Changes proceed without agreement on scope → scope creep, regressions.
- Skipping the contract for "obvious" one-file changes that still alter behavior.
- Filling in the contract after coding — the value is in the pre-coding thinking.
- **Context pack too large**: AI suffers context window pressure → misses details, hallucinates.
- **Diff exceeds contract scope**: Refactoring or cleanup sneaks in → untested changes, risk.
- **Skipped self-review**: Acceptance criteria not checked → bugs reach production.
- **No scorecard**: No audit trail → hard to verify or roll back.
- Claiming done without running the test plan.
- Leaving "Files NOT to touch" empty and then touching extras.
- Understating the risk tier to avoid writing a thorough plan.

## Verification checklist

- [ ] Contract written before any code change
- [ ] Contract filled in before any edits.
- [ ] Contract lists files NOT to touch
- [ ] Risk tier matches actual complexity.
- [ ] Test plan has runnable commands.
- [ ] Commitment statements are honest (no "N/A" for verification).
- [ ] Context pack contains only relevant lines
- [ ] Diff changes nothing outside contract scope
- [ ] Every acceptance criterion checked
- [ ] Scorecard created for every change
- [ ] Verification evidence collected after edits complete.

## Related skills

- `skills/core/verification-before-done/SKILL.md` — evidence bar for completion claims.
- `skills/core/goal-driven-execution/SKILL.md` — turns an imperative into a verifiable goal.
- `skills/core/code-context-pack/SKILL.md` — context pack protocol.
- `skills/core/checkpoint-validation/SKILL.md` — phase gate validation pattern.
