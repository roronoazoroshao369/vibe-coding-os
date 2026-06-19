# Workflow: Agent Alignment

## Purpose

Provide a structured pre-work alignment flow that sequences existing Vibe Coding OS skills
into a coherent check before any coding begins. Ensures the agent and user share the same
understanding of intent, constraints, domain language, and architectural decisions.

## When to use

Use this workflow before non-trivial implementation when:
- The task is ambiguous or underspecified.
- It involves domain-specific terminology that could be misinterpreted.
- It affects architecture, long-lived data structures, or public APIs.
- It spans multiple components or services.
- A new agent or session is picking up work from a previous context.

Skip alignment entirely for trivial tasks (typo fixes, one-line changes, obvious edits
already covered by a spec).

## Step-by-step workflow

### Phase 1 — Clarify intent (grill-user-before-building)

1. Restate the user's goal in plain language.
2. Ask the minimum set of high-leverage questions:
   - What is the desired outcome?
   - What does success look like?
   - What are the constraints (technical, business, time)?
   - What are the non-goals?
   - What are the edge cases?
3. Record assumptions that remain.
4. Stop when the goal is clear enough for a spec or plan.

**Decision point:** If the task is trivial, stop here and proceed directly to
implementation. No further alignment needed.

### Phase 2 — Update durable context (grill-with-docs)

1. Read `CONTEXT.md` and existing ADRs.
2. Identify decisions that affect durable project knowledge.
3. Separate facts from assumptions from decisions.
4. Propose updates to `CONTEXT.md` or ADR notes only when the change is durable.
5. Hand off to terminology alignment.

**Decision point:** If no durable context is affected, skip to Phase 3.
If this is a new project without `CONTEXT.md`, create one during this phase.

### Phase 3 — Align on domain terms (shared-domain-language)

1. Inventory important terms from the conversation and codebase.
2. Prefer existing local names unless they actively mislead.
3. Define each term by behavior and boundaries.
4. Add `_Avoid:_` synonym lists to prevent naming drift.
5. Record ambiguities in the flagged-ambiguities log.
6. Update the `CONTEXT.md` glossary.

**Decision point:** If the task involves no new terminology, confirm that existing
terms suffice and move on. If terminology is deeply contested, spend an extra
round resolving before continuing.

### Phase 4 — Record ADR candidates (project-constitution + ADR workflow)

1. Review architecture or design decisions surfaced in Phases 1–3.
2. For each decision, draft an ADR candidate:
   - **Context:** what prompted the decision.
   - **Decision:** what was chosen.
   - **Consequences:** tradeoffs and follow-up work.
3. Check alignment with `CONSTITUTION.md` principles.
4. Flag conflicts between new decisions and existing principles.

**Decision point:** If no new architectural decisions are needed, confirm "none" and
move on. If a new decision conflicts with the constitution, resolve the conflict
before proceeding (update the constitution or revise the decision).

### Phase 5 — Confirm alignment

1. Fill in `templates/agent-alignment-template.md` with all gathered information.
2. Present the alignment summary to the user.
3. Wait for explicit confirmation before proceeding.
4. If the user revises, loop back to the relevant phase.

## Complexity-based routing

| Task complexity | Phases to run | Rationale |
|----------------|---------------|-----------|
| **Trivial** (typo, config tweak, obvious fix) | Skip entirely | Alignment overhead exceeds value |
| **Simple** (clear scope, few files, no domain terms) | Phase 1 only | Just clarify intent |
| **Moderate** (some ambiguity, domain terms, minor decisions) | Phases 1–3 | Need intent + terms |
| **Complex** (architecture, multiple components, new domain concepts) | Phases 1–5 | Full alignment flow |
| **Critical** (security, data migration, breaking API changes) | Phases 1–5 + deepen Phase 4 | Extra ADR rigor |

## Integration with spec-first development

This workflow is the **pre-phase** of the spec-first development workflow. It produces
the alignment summary that feeds directly into:

1. `vibe-constitution` — confirm or update governing principles
2. `vibe-specify` — write the spec (using alignment summary as input)
3. `vibe-plan-from-spec` — turn spec into plan
4. `vibe-tasks` — decompose into ordered tasks
5. `vibe-implement-from-tasks` — execute

The alignment summary should be referenced in the spec's "Intent" and "Constraints"
sections. Domain terms from Phase 3 should appear in the spec's glossary. ADR candidates
from Phase 4 should be captured in the spec's "Deferred technical decisions" or "Open
questions" as appropriate.

## Inputs

- User task description (required)
- Existing specs, PRDs, or docs path (optional)
- `CONTEXT.md` (read if present)
- `CONSTITUTION.md` (read if present)
- ADR index (read if present)

## Outputs

- Alignment summary (using `templates/agent-alignment-template.md`)
- Proposed `CONTEXT.md` updates (glossary, context entries)
- ADR candidates (or confirmation of none)
- Recommendation for next workflow step

## Related skills

- `skills/core/grill-user-before-building/SKILL.md`
- `skills/core/grill-with-docs/SKILL.md`
- `skills/core/shared-domain-language/SKILL.md`
- `skills/core/project-constitution/SKILL.md`

## Related commands

- `commands/vibe-align.md` — the command entry point
- `commands/vibe-grill-me.md`
- `commands/vibe-grill-with-docs.md`
- `commands/vibe-constitution.md`
- `commands/vibe-specify.md`
- `commands/vibe-analyze.md`

## Related templates

- `templates/agent-alignment-template.md`

## Ghi chú tiếng Việt

Workflow tổng hợp năm kỹ năng hiện có (grill-user, grill-with-docs, shared-domain-language,
project-constitution) thành luồng xác nhận trước khi code. Phân cấp theo độ phức tạp task:
đơn giản bỏ qua, trung bình 1–3 giai đoạn, phức tạp đầy đủ 5 giai đoạn. Kết nối trực
tiếp với workflow spec-first development. Không tạo kỹ năng mới — chỉ sắp xếp lại kỹ năng
có sẵn.
