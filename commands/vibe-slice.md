---
description: "Slice a feature into vertical, end-to-end increments."
---

# Command: Vibe Slice

## When to use

Invoke when planning a feature that touches multiple architectural layers, when the team is tempted to build layer-by-layer, when feedback cycles are slow because nothing is demoable until the end, or when the user asks for vertical slices explicitly.

## Required inputs

- Feature spec or user story
- Architectural layers list (DB, API, UI, async, etc.)
- Acceptance criteria
- Test strategy
- Demo environment

## Step-by-step behavior

1. Map all vertical paths through the stack (data source → service → API → UI).
2. Slice the feature into end-to-end increments (DB+API+UI per slice if applicable). NEVER slice by layer or by file.
3. For each slice, run the 5-step cycle: Implement → Test → Verify → Commit → Next.
4. Sequence slices by VALUE (highest-value path first), not by layer.
5. Stub layers outside the current slice; track stubs for replacement.
6. Ensure each slice is independently rollback-able.
7. Demo each slice to the user after commit.
8. Use `templates/slice-spec-template.md` for each slice.

## Outputs

- Series of committed, independently-verifiable slices
- Each slice: impl + test + manual verify + atomic commit
- `templates/slice-spec-template.md` for each slice
- Demoable state after every slice

## Stopping conditions

Stop when: (a) all slices are implemented, tested, verified, committed, (b) each slice was demoable at commit time, (c) all stubs replaced with real implementations, (d) feature acceptance criteria met end-to-end.

## Verification checklist

- [ ] Slicing by outcome (not by layer or file)
- [ ] Each slice is end-to-end
- [ ] Each slice has integration/e2e test
- [ ] Each slice has manual verification
- [ ] Each slice committed atomically
- [ ] Each slice independently rollback-able
- [ ] Each slice demoable
- [ ] Stubs tracked for replacement
- [ ] Slices sequenced by value

## Anti-patterns to avoid

- Slicing by layer (DB-only, API-only)
- Slicing by file (per-component PRs)
- Skipping Test step
- Skipping Verify step
- Mid-slice commits
- Stubbing too much (permanent debt)
- "Backend first, UI later"
- "We'll demo when the whole feature is done"

## Related skills

- `skills/core/vertical-slicing/SKILL.md` — full vertical-slice doctrine
- `skills/core/task-breakdown-from-plan/SKILL.md` — file/layer decomposition (different lens)
- `skills/core/writing-plans/SKILL.md` — plan-level decomposition
- `templates/slice-spec-template.md` — per-slice acceptance template
