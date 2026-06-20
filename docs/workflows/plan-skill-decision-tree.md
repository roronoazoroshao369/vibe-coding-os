# Plan-Skill Decision Tree

> Multiple `plan-*` skills overlap in purpose. Use this tree to pick the right one for the task at hand. If two fit, pick the more specific one — the broader skill is the parent, not a substitute.

## The 6 plan-family skills

| Skill | Purpose | When to use |
| ----- | ------- | ----------- |
| `skills/core/brainstorming/SKILL.md` | Generate options before committing to one | New feature, open problem, multiple valid approaches, user wants to explore before deciding |
| `skills/core/spec-first-development/SKILL.md` | Write the spec before any code | Greenfield, contract must be locked before implementation, multiple stakeholders need to agree |
| `skills/core/brownfield-spec-enhancement/SKILL.md` | Extend an existing spec for an existing codebase | Adding a feature to code that already has a spec or contract; the change is small but the spec is the source of truth |
| `skills/core/writing-plans/SKILL.md` | Turn a chosen direction into an executable implementation plan | Direction is chosen, spec is agreed, ready to commit to a step-by-step plan with checkpoints |
| `skills/core/plan-driven-execution/SKILL.md` | Execute a written plan, checkpoint by checkpoint | Plan exists and is approved; this is the "do it" phase |
| `skills/core/executing-plans/SKILL.md` | Resume or recover a paused plan in-flight | Plan was started, paused, or needs to be picked up after context loss |

Plus 2 planning-support skills (used together with any of the above):

- `skills/core/crash-proof-planning/SKILL.md` — for plans that must survive session loss / model crash (checkpoint state externally).
- `skills/core/task-breakdown-from-plan/SKILL.md` — for breaking a written plan into concrete, atomic tasks tracked in the issue tracker.

## The decision tree

```
1. Do you have a clear problem statement and a chosen direction?
   │
   ├─ NO  → `brainstorming` first. Generate 2-4 options. Pick one.
   │        After picking: continue to step 2.
   │
   └─ YES → continue to step 2.

2. Is the project greenfield (no existing code, no existing spec)?
   │
   ├─ YES → `spec-first-development`. Write the spec before any code.
   │        After spec is approved: continue to step 3.
   │
   └─ NO (existing codebase, possibly existing spec) → continue to step 3.

3. Are you adding to an existing spec, or extending an existing contract?
   │
   ├─ YES → `brownfield-spec-enhancement`. Update the spec, get approval, then plan.
   │
   └─ NO (spec is already correct, or no spec is needed) → continue to step 4.

4. Is the plan written yet?
   │
   ├─ NO  → `writing-plans`. Produce a step-by-step plan with checkpoints.
   │        Continue to step 5.
   │
   └─ YES → continue to step 5.

5. Are you executing the plan now?
   │
   ├─ NO (planning is done; you're reviewing, handing off, or pausing)
   │     → STOP. Plan is complete. Do not execute without explicit go-ahead.
   │
   └─ YES → continue to step 6.

6. Is this a fresh execution or a resumption?
   │
   ├─ FRESH (plan exists, no work has started)
   │     → `plan-driven-execution`. Execute checkpoint by checkpoint.
   │
   └─ RESUMPTION (work was started, paused, lost context, crashed)
         → `executing-plans`. Read the plan, find the last checkpoint, resume.
         If the plan must survive future crashes: `crash-proof-planning` for state persistence.

7. (Optional, parallel to any of the above)
   Does the plan need to be broken into tracked tasks for the issue tracker?
   │
   └─ YES → `task-breakdown-from-plan`. Run after `writing-plans` approves the plan.
```

## Anti-patterns (planning mistakes to avoid)

- **Using `writing-plans` for brainstorming.** `writing-plans` requires a chosen direction; brainstorming is for choosing.
- **Using `spec-first-development` for a brownfield change.** Brownfield changes have an existing spec; use `brownfield-spec-enhancement` instead, or the spec work will rewrite what already exists.
- **Skipping the plan and going straight to `plan-driven-execution`.** "Execute the plan" without a plan is implementation without alignment; the plan family is sequential for a reason.
- **Using `plan-driven-execution` after a crash.** Use `executing-plans` to recover state, then `plan-driven-execution` for the remaining checkpoints.
- **Running two plan-* skills in parallel for the same task.** They overlap; pick one. If you think two apply, you have not decided the phase yet — re-read step 1.

## Cross-references

- `skills/core/writing-plans/SKILL.md` — has a `## Choose instead` section pointing here for cross-skill disambiguation.
- `skills/core/plan-driven-execution/SKILL.md` — has a `## Choose instead` section pointing here.
- `skills/core/brainstorming/SKILL.md` — has a `## Choose instead` section pointing here.
- `skills/core/spec-first-development/SKILL.md` — has a `## Choose instead` section pointing here.

## Verification checklist

- [ ] The skill you picked matches the phase of work (steps 1-7 above).
- [ ] If two skills seem to fit, the more specific one was picked.
- [ ] The `## Choose instead` section of the picked skill lists the alternatives you considered.
- [ ] No two plan-* skills ran in parallel for the same task.
