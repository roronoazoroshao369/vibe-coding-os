---
description: "Run phase-boundary validation and the implementation-readiness gate with recorded evidence."
---

# vibe-checkpoints

## Purpose

Run phase-boundary validation and the implementation-readiness gate, recording evidence
that a phase met its exit criteria before the next begins.

## When to use

Use at every phase boundary in spec-driven work, and always before starting implementation.

## Required inputs

- The artifact produced by the current phase.
- Its acceptance/exit criteria and the project constitution.
- `templates/checkpoint-template.md`.

## Step-by-step behavior

1. Identify the current phase and its exit criteria.
2. Check the artifact against the phase checklist (spec, plan, tasks, or implementation).
3. Record evidence: what was checked, the result, and any open issues.
4. If a criterion fails, mark the gate failed and return to the phase.
5. If all pass, mark the gate cleared and allow advancement.
6. For the implementation gate, confirm spec, plan, and tasks are all green.

## Outputs

A checkpoint record marking the gate passed or failed, with evidence and follow-ups.

## Stopping conditions

Stop advancement when any exit criterion fails, when evidence cannot be produced, or when
the readiness gate is not clear before implementation.

## Verification checklist

- [ ] Exit criteria for the phase are explicit.
- [ ] Each criterion is checked with recorded evidence.
- [ ] Failures block advancement.
- [ ] The implementation-readiness gate is honored.

## Related skills/templates

- `skills/core/checkpoint-validation/SKILL.md`, `skills/core/acceptance-criteria/SKILL.md`
- `templates/checkpoint-template.md`

## Ghi chú tiếng Việt

Chạy kiểm tra tại ranh giới pha và cổng sẵn sàng triển khai; ghi bằng chứng, fail thì quay
lại pha. Cổng quan trọng nhất: spec/plan/tasks đều đạt mới được code. Học ý tưởng từ
`spec-kit`, dùng checklist local.
