# Reference: coleam00/context-engineering-intro

## Metadata

- Repo: https://github.com/coleam00/context-engineering-intro
- Owner: coleam00
- Name: context-engineering-intro
- Category: context-engineering
- Status: tracked
- Import mode: inspiration/adaptation
- License: MIT, Copyright (c) 2025 Cole Medin (verified from upstream `LICENSE` via raw GitHub during the 2026-06-07 audit)
- Last checked: 2026-06-07
- Last known commit: `unknown`

## Why this repo matters

`coleam00/context-engineering-intro` argues that the dominant cause of failed AI
implementations is insufficient context, not insufficient model capability. It frames
"context engineering" as a discipline broader than prompt wording: deliberately assembling
the specification, the patterns a codebase already uses, curated examples, the documentation
that settles decisions, and executable validation, then handing that whole package to the
implementer.

Its central artifact is a context-rich implementation blueprint that gathers research and
documentation, lays out a step-by-step plan, names the checks that must pass, and ends with a
self-assessed confidence score. Execution then loads that blueprint, plans, implements,
validates, and iterates until the checks are green.

Vibe Coding OS already had a thin implementation-brief template and a `vibe-brief` command.
The value here is sharper discipline: a research phase, a curated examples library with both
positive and negative patterns, explicit executable validation gates with an
iterate-until-green loop, and an honest confidence score that gates handoff. We adapt those
ideas into original local artifacts and do not adopt any PRP-runner tooling or upstream text.

## Key concepts

- Context engineering as a deliberate discipline, broader than prompt wording.
- A context-rich brief: spec + research + curated examples + doc links + validation + score.
- Research before writing: discover the repo's existing patterns first.
- An examples library of in-repo references, both positive (mimic) and negative (avoid).
- Per-project rules that every brief inherits rather than restates.
- Executable validation gates with an observable pass condition each.
- Iterate-until-green: fix root causes in code, never weaken the check.
- A 1-10 confidence self-score that gates whether the brief is ready to execute.

## Features to study

| Feature | Why it matters | Local equivalent | Status | Target local files | Maintenance notes |
| --- | --- | --- | --- | --- | --- |
| context-rich-brief | Bundles all context an executor needs into one artifact. | `templates/implementation-brief-template.md`, `skills/core/context-rich-implementation/SKILL.md` | implemented | `commands/vibe-brief.md`, `commands/vibe-brief-execute.md` | Keep markdown-first; never grow into a runner. |
| research-phase | Discovering repo patterns prevents off-style code. | `commands/vibe-brief.md` (research step) | implemented | `skills/core/context-rich-implementation/SKILL.md` | Cite real files/symbols, not generic advice. |
| examples-library | Curated prior art is the highest-leverage context. | `docs/workflows/context-engineering.md`, `examples/` | implemented | `templates/implementation-brief-template.md` | Reference in-repo paths; include negative examples. |
| project-rules | Standing conventions every brief inherits. | `CONSTITUTION.md`, `CLAUDE.md`, `AGENTS.md`, `CONTEXT.md` | implemented | `docs/workflows/context-engineering.md` | Reference rules, do not duplicate them. |
| validation-gates | Executable checks define "done" objectively. | `templates/implementation-brief-template.md` (gates), `skills/core/checkpoint-validation/SKILL.md` | implemented | `commands/vibe-brief-execute.md` | Each gate needs a command + observable pass condition. |
| iterate-until-green | Forces fixing root causes, not the check. | `commands/vibe-brief-execute.md` | implemented | `skills/core/context-rich-implementation/SKILL.md` | Never edit a check to pass. |
| confidence-score | Honest 1-10 gate on whether context is sufficient. | `templates/implementation-brief-template.md` (score) | implemented | `commands/vibe-brief.md` | Below 7 → gather missing context before handoff. |

## Applied to Vibe Coding OS

- Deepened context-rich implementation brief (research findings, examples to mimic/avoid,
  validation gates, confidence score).
- Research-before-writing discipline in `vibe-brief`.
- Examples-library and project-rules conventions documented for this repo.
- Explicit executable validation gates with an iterate-until-green loop.
- Confidence self-scoring that gates handoff to execution.
- A dedicated execution command (`vibe-brief-execute`) for load → plan → implement → validate.

## Not applied to Vibe Coding OS

- The PRP-runner or any command-runner tooling.
- Upstream prompt text, template text, or example content (no vendoring).
- A required directory layout or CLI; the discipline is markdown-first.
- Replacing the existing spec/plan/tasks flow; this composes with it.

## Local mapping

- `templates/implementation-brief-template.md`
- `commands/vibe-brief.md`, `commands/vibe-brief-execute.md`
- `skills/core/context-rich-implementation/SKILL.md`
- `docs/workflows/context-engineering.md`
- `references/features/context-engineering.md`

## Upstream structure notes

Observed during the audit (do not copy content): a README narrative explaining context
engineering, a project-rules file, an examples directory, and a blueprint/template plus
generate/execute command prompts. We treat these as structural inspiration only and keep the
Vibe Coding OS markdown-first, CLI-free layout.

## Integration strategy

1. Adapt ideas into original local artifacts; never vendor code, prompts, or example text.
2. Reuse and deepen the existing brief/command instead of adding parallel systems.
3. Keep validation gates as plain local commands composed with `npm run validate`.
4. Maintain validation parity: the new SKILL.md is registered, both commands are registered,
   and every `local_targets` path exists.

## Update watchlist

Inspect when upstream changes:

- the blueprint/brief structure or required sections;
- the research or documentation-gathering guidance;
- the examples-library or project-rules conventions;
- the validation-gate or iterate-until-green model;
- the confidence-scoring rubric;
- license, notice, or attribution metadata.

## Maintenance playbook

1. Re-audit the upstream README, rules file, examples, and command prompts.
2. Record findings in `references/changelogs/coleam00-context-engineering.md` with date and commit.
3. Update `references/index.json` (`last_checked`, `last_known_commit`, features, local_targets).
4. Apply `references/mappings/update-impact-map.md` rules to find local files to inspect.
5. Adapt ideas in original language; refresh skills/commands/templates/docs as needed.
6. Run `npm run validate:references` and `npm run validate`.

## Do not copy

Do not copy upstream prompts, templates, command text, README prose, or example files
without explicit license review and a recorded decision. Summarize ideas in original Vibe
Coding OS language and map them to local needs.

## Last audit notes

- 2026-06-07: Promoted from idea-level tracking to a full context-engineering integration.
  Deepened the implementation-brief template (research findings, positive/negative examples,
  validation gates, confidence score), added research/confidence phases to `vibe-brief`,
  created `vibe-brief-execute`, added the `context-rich-implementation` skill and the
  `context-engineering` workflow doc. No upstream content vendored; no PRP-runner adopted.

## Ghi chú tiếng Việt

`coleam00/context-engineering-intro` cho rằng AI thất bại chủ yếu vì THIẾU NGỮ CẢNH chứ
không phải thiếu năng lực. "Context engineering" là kỷ luật gom đủ ngữ cảnh: spec + nghiên
cứu + ví dụ tuyển chọn + link tài liệu + cổng kiểm thử + điểm tự tin, rồi giao trọn gói cho
người thực thi. Vibe Coding OS học ý tưởng: làm sâu brief (research, ví dụ nên bắt chước/cần
tránh, cổng kiểm thử, điểm tự tin), thêm bước nghiên cứu vào `vibe-brief`, thêm
`vibe-brief-execute`, skill `context-rich-implementation`, và doc `context-engineering`.
KHÔNG copy text/PRP-runner upstream; tất cả là markdown viết lại nguyên bản.
