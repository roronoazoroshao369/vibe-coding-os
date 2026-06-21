---
description: "Explicit alignment check: grill, align on domain terms, record ADRs, and confirm intent before coding."
---

# vibe-align

## Purpose

Run a structured pre-work alignment flow that sequences existing skills into a coherent
check before any coding begins. This is a meta-workflow command — it orchestrates
`grill-user-before-building` (Phase 2 docs-aware subsumes the former `grill-with-docs`), and
`project-constitution` rather than replacing them.

## When to use

Use before non-trivial implementation when the task is ambiguous, involves domain-specific
terminology, affects architecture, or spans multiple components. Skip for trivial edits,
typo fixes, or tasks already fully specced.

## Required inputs

- **Task description:** what the user wants to accomplish.
- **Optional docs path:** path to existing specs, PRDs, or CONTEXT.md if available.
- **Existing ADRs / CONTEXT.md:** read if present in the repo.

## Step-by-step workflow

### Step 1 — Grill the user (`grill-user-before-building`)

1. Restate the goal in your own words.
2. Ask the smallest set of high-leverage questions to remove implementation ambiguity.
3. Probe edge cases, non-goals, rollout, and verification.
4. Record assumptions that remain explicit instead of hidden.
5. Output: clarified intent and open questions.

### Step 2 — Grill with docs (`grill-with-docs`)

1. Read `CONTEXT.md` and ADR index if present.
2. Identify decisions that will affect durable project knowledge.
3. Separate facts, assumptions, and decisions.
4. Propose updates to context or ADR notes only when durable.
5. Output: proposed context updates and ADR candidates.

### Step 3 — Record ADR candidates (`project-constitution` + ADR workflow)

1. Review any architecture or design decisions surfaced in steps 1–3.
2. For each decision, write a brief ADR candidate: context, decision, consequences.
3. Check alignment with existing `CONSTITUTION.md` principles.
4. Flag conflicts between new decisions and existing principles.
5. Output: ADR candidates ready for review, or confirmation no new ADRs needed.

### Step 4 — Confirm alignment

1. Produce an alignment summary using `templates/agent-alignment-template.md`.
2. Present the summary to the user for confirmation.
3. Only proceed to spec/plan/implementation once the user confirms the alignment.
4. If the user rejects or revises, loop back to the relevant earlier step.

## Decision points

| Condition | Action |
|-----------|--------|
| Task is trivial (typo, one-line fix, obvious change) | Skip alignment entirely — go directly to implementation |
| Task is moderately complex | Run steps 1–2, skip step 3 (no new ADRs) |
| Task is complex or architecture-affecting | Run all 4 steps |
| Existing `CONSTITUTION.md` exists | Reference it in step 3 to check for conflicts |

## Outputs

A filled-in `templates/agent-alignment-template.md` containing:
- Clarified intent
- Confirmed constraints
- Domain terms defined
- ADRs identified (or "none")
- Non-goals documented
- Ready-for-next-step recommendation (spec, plan, or implementation)

## Integration with spec-first development

This command is the **pre-phase** of the spec-first development workflow (`docs/workflows/spec-driven-development.md`). It slots in *before* the constitution check:

1. **vibe-align** ← this command (clarify intent, terms, decisions)
2. **vibe-constitution** — confirm or update governing principles
3. **vibe-spec** — write the spec
4. **vibe-plan-from-spec** — turn spec into plan
5. **vibe-tasks** — decompose into ordered tasks
6. **vibe-implement-from-tasks** — execute

For complex tasks, `vibe-align` may trigger a constitution update in step 4.
For simple tasks, skip directly to `vibe-spec`.

## Stopping conditions

- Stop and ask when alignment cannot be reached after 3 rounds of questioning.
- Stop when the user requests to proceed with explicit assumptions (document them).
- Stop when an ADR candidate conflicts with the constitution and no priority is clear.

## Verification checklist

- [ ] Intent is restated and confirmed by the user.
- [ ] Constraints are named (technical, business, time).
- [ ] ADR candidates document tradeoffs (or "none needed" is confirmed).
- [ ] Non-goals are explicit.
- [ ] Alignment summary uses the template.
- [ ] User has confirmed the alignment summary.

## Related skills

- `skills/core/grill-user-before-building/SKILL.md`
- `skills/core/grill-user-before-building/SKILL.md` (Phase 2 docs-aware, subsumes former `grill-with-docs`)
- `skills/core/project-constitution/SKILL.md`

## Related commands

- `commands/vibe-grill-me.md`
- `commands/vibe-grill-with-docs.md` (docs-aware phase)
- `commands/vibe-constitution.md`
- `commands/vibe-specify.md`

## Related templates

- `templates/agent-alignment-template.md`

## Related workflows

- `docs/workflows/spec-driven-development.md`
- `docs/workflows/domain-language-and-adrs.md`

## Ghi chú tiếng Việt

Lệnh meta-workflow tổng hợp grill-user (Phase 2 docs-aware) → ngôn ngữ chung → ADR → xác nhận
trước khi code. Dùng cho task phức tạp, bỏ qua cho task đơn giản. Đầu ra dùng template
`agent-alignment-template.md`. Kết nối với workflow spec-first development.

## Applied / Not applied

- Applied: sequencing of existing skills into a coherent pre-work flow, decision-point
  logic for task complexity, alignment template, integration with spec-first development.
- Not applied: new interview techniques (reuses existing grill skills), new ADR format (reuses existing conventions).
