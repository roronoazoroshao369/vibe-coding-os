# Checkpoint Validation

## Purpose

Validate that each workflow phase (constitution, spec, plan, tasks, implementation) is
sound before the next begins, providing an explicit implementation-readiness gate.

## When to use

Use at every phase boundary in spec-driven work, and especially before starting
implementation, to confirm the prior phase met its acceptance criteria.

## Inputs

The artifact produced by the current phase, its acceptance criteria, the project
constitution, and the checkpoint template.

## Workflow

1. Identify the current phase and its required exit criteria.
2. Check the artifact against the checklist for that phase (e.g., spec has observable
   acceptance criteria; plan has traceability; tasks have dependencies).
3. Record evidence: what was checked, the result, and any open issues.
4. If criteria fail, stop and return to the phase; do not advance.
5. If criteria pass, record the gate as cleared and proceed.
6. For the implementation gate, confirm the spec, plan, and tasks are all green before any
   code is written.

## Outputs

A completed checkpoint record (`templates/checkpoint-template.md`) marking the gate as
passed or failed, with evidence and follow-ups.

## Failure modes

- Phases advance without meeting exit criteria.
- The gate is performed but evidence is not recorded.
- Implementation starts before the readiness gate clears.
- Checks are subjective rather than tied to acceptance criteria.

## Verification checklist

- [ ] Exit criteria for the phase are explicit.
- [ ] Each criterion is checked with recorded evidence.
- [ ] Failures block advancement.
- [ ] The implementation-readiness gate is honored.

## Applied / Not Applied

- Applied: checkpoint validation between phases and the implementation-readiness gate from
  `github/spec-kit`.
- Not applied: upstream CLI checks or command names. Gates are documented local checklists
  composed with `npm run validate` / `npm run validate:references` where relevant.

## Ghi chú tiếng Việt

Kiểm tra từng pha đạt tiêu chí trước khi sang pha sau; cổng quan trọng nhất là
implementation-readiness (spec/plan/tasks đều đạt mới được code). Ghi bằng chứng, fail thì
quay lại. Liên kết: `skills/core/acceptance-criteria/SKILL.md`,
`skills/core/verification-before-completion/SKILL.md`, `templates/checkpoint-template.md`.
