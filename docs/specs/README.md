# Specs in Vibe Coding OS

This document explains how specifications are created, stored, and maintained in a project
that uses Vibe Coding OS. It adapts spec-driven ideas from `github/spec-kit` without
copying upstream templates or requiring the Specify CLI.

## What a spec is

A spec is a compact, testable description of desired behavior — the "what" — independent of
implementation. It captures intent, goals, non-goals, user scenarios, edge cases,
assumptions, and observable acceptance criteria. Technical decisions (the "how") belong in
the plan, not the spec.

## The spec-driven lifecycle

```text
Constitution → Specify → Plan → Tasks → Implement
```

Each phase is gated by a checkpoint; implementation only begins after the
implementation-readiness gate clears. See `docs/workflows/spec-driven-development.md`.

## Where specs live

- Spec, plan, tasks, checkpoint, and exploration artifacts are markdown files created from
  the templates in `templates/`.
- A project may keep its specs under a `specs/` directory (one folder per feature) or
  alongside the relevant module — choose one convention and keep it consistent.
- Reference and audit artifacts for spec quality live with the spec or in a project-chosen
  location; the audit format is `templates/spec-audit-template.md`.

## Templates

- `templates/spec-template.md` — the behavioral spec.
- `templates/plan-template.md` — the plan with separated technical context.
- `templates/tasks-template.md` — ordered tasks with dependencies and parallel markers.
- `templates/checkpoint-template.md` — phase gates and the readiness gate.
- `templates/brownfield-spec-template.md` — spec discipline for existing systems.
- `templates/parallel-exploration-template.md` — compare candidate approaches.
- `templates/spec-audit-template.md` — audit spec quality.
- `templates/constitution-template.md` — project principles.

## Maintaining specs

- Update the spec when behavior changes; do not let the implementation drift from it
  silently.
- Re-run `vibe-spec-audit` periodically to catch missing sections or weak criteria.
- Keep acceptance criteria observable; remove criteria that cannot be verified.
- Record durable decisions as ADRs (`docs/adr/`) and link them from the spec.

## Related skills and commands

- Skills: `skills/core/spec-first-development` (includes what-before-how discipline),
  `skills/core/plan-from-spec`, `skills/core/task-breakdown-from-plan`,
  `skills/core/checkpoint-validation`, `skills/core/brownfield-spec-enhancement`,
  `skills/core/brainstorming`, `skills/core/project-constitution`.
- Commands: `commands/vibe-spec.md`, `commands/vibe-plan-from-spec.md`,
  `commands/vibe-tasks.md`, `commands/vibe-implement-from-tasks.md`,
  `commands/vibe-checkpoints.md`, `commands/vibe-brownfield-spec.md`,
  `commands/vibe-flow.md`, `commands/vibe-spec-audit.md`,
  `commands/vibe-constitution.md`.

## Ghi chú tiếng Việt

Spec là mô tả hành vi mong muốn (what), ngắn gọn và kiểm chứng được, tách khỏi cách triển
khai (how — thuộc về plan). Vòng đời: constitution → specify → plan → tasks → implement,
mỗi pha có checkpoint, chỉ code sau cổng sẵn sàng. Dùng template trong `templates/`, chọn
một quy ước lưu spec và giữ nhất quán, audit định kỳ, và giữ tiêu chí chấp nhận quan sát
được. Học ý tưởng từ `github/spec-kit`, không copy template/CLI.
