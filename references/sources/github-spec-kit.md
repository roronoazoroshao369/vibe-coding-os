# Reference: github/spec-kit

## Metadata

- Repo: https://github.com/github/spec-kit
- Owner: github
- Name: spec-kit
- Category: spec-driven-development
- Status: tracked
- Import mode: inspiration/adaptation
- License: MIT (verified during the 2026-06-06 local clone audit)
- Last checked: 2026-06-06
- Last known commit: `7106858c4e636098815fffa23f6c6b99eb0e156b`

## Why this repo matters

`github/spec-kit` is a toolkit for Spec-Driven Development. Its central claim is that
specifications should be the durable, executable artifact that drives implementation,
not a throwaway document. It organizes work into ordered phases — constitution
(principles), specify (what/why), plan (how), tasks (decomposition), and implement —
and pushes a "what before how" discipline so behavior is agreed before technology is
chosen.

Vibe Coding OS already has spec-first and plan-driven skills. The value here is not a
new framework but sharper discipline: an explicit project constitution, an
implementation-readiness gate, dependency-aware and parallelizable task ordering,
TDD-first task sequencing, and checkpoint validation between phases. We adapt those
ideas into original local skills, commands, templates, and docs without adopting the
Specify CLI, upstream command names, or upstream template text.

## Key concepts

- Specification as the primary, central artifact.
- Phase ordering: constitution → specify → plan → tasks → implement.
- "What before how": user-visible behavior and acceptance criteria precede technical choices.
- Acceptance criteria, non-goals, and user scenarios as required spec content.
- Technical context captured separately from the behavioral spec.
- Tasks carry dependencies and parallel markers; tests are ordered before implementation.
- Checkpoints validate that one phase is sound before the next begins.
- Brownfield iterative enhancement for existing systems.
- Creative parallel exploration of multiple candidate approaches.
- Extension/preset and agent-integration patterns for packaging the workflow.

## Features to study

| Feature | Why it matters | Local equivalent | Status | Target local files | Maintenance notes |
| --- | --- | --- | --- | --- | --- |
| constitution | Durable project principles constrain every later phase. | `skills/core/project-constitution/SKILL.md`, `CONSTITUTION.md`, `templates/constitution-template.md` | implemented | `CONSTITUTION.md`, `commands/vibe-constitution.md` | Keep principles short and testable; do not copy upstream wording. |
| specify | A central, testable spec is the source of truth. | `skills/core/spec-first-development/SKILL.md`, `templates/spec-template.md` | implemented | `commands/vibe-specify.md`, `templates/spec-template.md` | Cross-link with existing `vibe-spec`; avoid duplicate spec templates. |
| plan | Plans translate the what into a verifiable how. | `skills/core/plan-from-spec/SKILL.md`, `skills/core/plan-driven-execution/SKILL.md` | implemented | `commands/vibe-plan-from-spec.md`, `templates/plan-template.md` | Reuse existing plan template; add spec-traceability fields. |
| tasks | Decomposition into reviewable, grabbable tasks. | `skills/core/task-breakdown-from-plan/SKILL.md`, `skills/core/issue-slicing/SKILL.md` | implemented | `commands/vibe-tasks.md`, `templates/tasks-template.md` | Avoid duplicating issue-slicing; this is plan→tasks, not idea→issues. |
| implement | Implementation runs only after a readiness gate. | `skills/core/checkpoint-validation/SKILL.md`, `skills/core/plan-driven-execution/SKILL.md` | implemented | `commands/vibe-implement-from-tasks.md` | Gate is the key idea; do not require the Specify CLI. |
| what-before-how | Prevents premature technology lock-in. | `skills/core/spec-first-development/SKILL.md` (merged from what-before-how in v2.17) | implemented | `references/features/what-before-how.md` | Cross-link from spec and plan skills. |
| acceptance-criteria | Connects intent to verification. | `skills/core/acceptance-criteria/SKILL.md` | implemented | `references/features/acceptance-criteria.md` | Criteria must be observable; reuse in checkpoints. |
| non-goals | Keeps scope reviewable. | `templates/spec-template.md`, `templates/constitution-template.md` | implemented | `templates/spec-audit-template.md` | Already present in local spec template; reinforce in audit. |
| user-scenarios | Grounds the spec in real usage. | `templates/spec-template.md` | partial | `skills/core/spec-first-development/SKILL.md` | Add scenario prompts to spec skill; keep compact. |
| technical-context | Separates how from what. | `skills/core/plan-from-spec/SKILL.md`, `templates/plan-template.md` | implemented | `commands/vibe-plan-from-spec.md` | Capture stack/constraints in plan, not in the behavioral spec. |
| task-dependencies | Correct ordering avoids rework. | `skills/core/dependency-aware-task-ordering/SKILL.md` | implemented | `references/features/dependency-aware-tasks.md`, `templates/tasks-template.md` | Encode `depends-on` per task. |
| parallel-tasks | Identifies safe concurrency. | `skills/core/dependency-aware-task-ordering/SKILL.md` | implemented | `templates/tasks-template.md` | Use a clear parallel marker; do not copy upstream `[P]` syntax verbatim. |
| tdd-ordering | Tests precede implementation tasks. | `skills/core/test-driven-development/SKILL.md`, `skills/core/task-breakdown-from-plan/SKILL.md` | implemented | `references/features/tdd-loop.md` | Sequence test tasks before their implementation tasks. |
| checkpoint-validation | Each phase is validated before the next. | `skills/core/checkpoint-validation/SKILL.md` | implemented | `templates/checkpoint-template.md`, `commands/vibe-checkpoints.md` | Define entry/exit gates per phase. |
| brownfield-enhancement | Spec discipline for existing systems. | `skills/core/brownfield-spec-enhancement/SKILL.md` | implemented | `templates/brownfield-spec-template.md`, `commands/vibe-brownfield-spec.md` | Capture current vs desired behavior and migration risk. |
| creative-exploration | Compare candidate approaches before committing. | `skills/core/brainstorming/SKILL.md` | implemented | `templates/parallel-exploration-template.md`, `commands/vibe-parallel-explore.md` | Time-box exploration; record a decision. |
| extensions-and-presets | Package workflow variants. | `skills/meta/write-reusable-skill/SKILL.md` | not-applied (design only) | `references/features/workflow-extensions-and-presets.md` | Documented as design guidance; no runtime preset engine. |
| agent-integrations | Wire the workflow into assistants. | `AGENTS.md`, `CLAUDE.md` | partial | `docs/workflows/spec-driven-development.md` | Use existing agent instruction files; no installer. |

## Applied to Vibe Coding OS

- project-constitution (principles file + skill + template)
- spec-first-development (sharpened, cross-linked to spec-kit ideas)
- what-before-how discipline
- plan-from-spec with separated technical context
- task-breakdown-from-plan
- acceptance-criteria as required, observable spec content
- dependency-aware task ordering with parallel markers
- TDD task ordering (tests sequenced before implementation)
- checkpoint validation between phases
- implementation-readiness gate
- brownfield iterative enhancement
- creative parallel exploration
- spec template quality (non-goals, assumptions, scenarios, verification gates)

## Not applied to Vibe Coding OS

- full Specify CLI as a hard dependency
- upstream command names (`/specify`, `/plan`, `/tasks`, etc.) as mandatory
- copying upstream templates or prompt text verbatim
- agent installer / bootstrap scripts
- full extension/preset runtime engine
- language-specific generated project scaffolding
- replacing the existing PRD-from-context docs and workflow entirely

## Local mapping

- `CONSTITUTION.md`
- `templates/constitution-template.md`, `templates/spec-template.md`, `templates/plan-template.md`, `templates/tasks-template.md`, `templates/checkpoint-template.md`, `templates/brownfield-spec-template.md`, `templates/parallel-exploration-template.md`, `templates/spec-audit-template.md`
- `skills/core/project-constitution/SKILL.md`, `skills/core/spec-first-development/SKILL.md`, `skills/core/plan-from-spec/SKILL.md`, `skills/core/task-breakdown-from-plan/SKILL.md`, `skills/core/acceptance-criteria/SKILL.md`, `skills/core/dependency-aware-task-ordering/SKILL.md`, `skills/core/checkpoint-validation/SKILL.md`, `skills/core/brownfield-spec-enhancement/SKILL.md`, `skills/core/brainstorming/SKILL.md`
- `skills/meta/write-reusable-skill/SKILL.md`, `skills/meta/write-reusable-skill/SKILL.md`
- `commands/vibe-constitution.md`, `commands/vibe-specify.md`, `commands/vibe-plan-from-spec.md`, `commands/vibe-tasks.md`, `commands/vibe-implement-from-tasks.md`, `commands/vibe-checkpoints.md`, `commands/vibe-brownfield-spec.md`, `commands/vibe-parallel-explore.md`, `commands/vibe-spec-audit.md`
- `docs/specs/README.md`, `docs/workflows/spec-driven-development.md`, `docs/workflows/constitution-to-spec-to-plan.md`, `docs/workflows/spec-to-tasks-to-implementation.md`, `docs/workflows/brownfield-spec-enhancement.md`, `docs/workflows/brainstorming.md`
- `references/features/spec-driven-development.md`, `references/features/project-constitution.md`, `references/features/what-before-how.md`, `references/features/spec-to-plan-to-tasks.md`, `references/features/acceptance-criteria.md`, `references/features/dependency-aware-tasks.md`, `references/features/checkpoint-validation.md`, `references/features/brownfield-enhancement.md`, `references/features/brainstorming.md`, `references/features/workflow-extensions-and-presets.md`

## Upstream structure notes

Observed during the local clone audit (do not copy content):

- A root README plus a `spec-driven.md` narrative describing the methodology.
- A `templates/` directory holding spec, plan, and tasks scaffolds and command prompts.
- A `src/` Python package implementing the Specify CLI and bootstrap logic.
- A `scripts/` directory and `pyproject.toml` for packaging/distribution.
- Per-assistant integration assets for wiring slash commands into agents.

We treat these as structural inspiration only; Vibe Coding OS keeps its markdown-first,
CLI-free, multi-harness layout.

## Integration strategy

1. Adapt ideas into original local skills/commands/templates/docs; never vendor code or text.
2. Reuse existing local artifacts (spec/plan templates, plan-driven execution, issue-slicing) and add only the missing discipline (constitution, readiness gate, dependency/parallel ordering, checkpoints, brownfield, exploration).
3. Keep the Specify CLI and upstream command names out of the required path; map ideas onto `vibe-*` commands.
4. Maintain validation parity: every new SKILL.md is registered, every command is registered, and every `local_targets` path exists.

## Update watchlist

Inspect when upstream changes:

- spec phase model or new phases;
- template structure for spec/plan/tasks;
- task planning, dependency, or parallel-marker semantics;
- TDD or checkpoint validation behavior;
- constitution/principles model;
- extension/preset model;
- brownfield workflow;
- installation/CLI behavior or agent integration assets;
- license, notice, or attribution metadata.

## Maintenance playbook

1. Re-audit upstream README, `spec-driven.md`, `templates/`, `src/`, `scripts/`, `pyproject.toml`.
2. Record findings in `references/changelogs/github-spec-kit.md` with date and commit.
3. Update `references/index.json` (`last_checked`, `last_known_commit`, features, local_targets).
4. Apply `references/mappings/update-impact-map.md` rules to find local files to inspect.
5. Adapt ideas in original language; refresh skills/commands/templates/docs as needed.
6. Run `npm run validate:references` and `npm run validate`.

## Do not copy

Do not copy upstream prompts, templates, command text, CLI code, scripts, docs, tests,
or assets without explicit license review and a recorded decision. Summarize ideas in
original Vibe Coding OS language and map them to local needs.

## Last audit notes

- 2026-06-06: Promoted from baseline-tracked to a full spec-driven-development
  integration. Adapted constitution, what-before-how, plan-from-spec, task breakdown,
  dependency/parallel ordering, TDD ordering, checkpoint validation, readiness gate,
  brownfield enhancement, and creative parallel exploration into original local
  artifacts. No upstream content vendored; Specify CLI not required.

## Ghi chú tiếng Việt

`github/spec-kit` là bộ công cụ cho phát triển hướng đặc tả (spec-driven). Ý tưởng cốt
lõi: đặc tả là tài liệu trung tâm, đi qua các pha constitution → specify → plan → tasks →
implement, và phải làm rõ "cái gì" trước "làm thế nào". Vibe Coding OS chỉ học ý tưởng:
thêm hiến chương dự án, cổng sẵn-sàng-triển-khai, sắp xếp task theo phụ thuộc và song
song, ưu tiên test trước, và checkpoint giữa các pha. Không copy template/CLI upstream,
không bắt buộc Specify CLI, và luôn diễn đạt lại bằng ngôn ngữ local.
