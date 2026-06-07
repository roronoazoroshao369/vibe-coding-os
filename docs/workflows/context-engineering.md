# Context Engineering Workflow

> Markdown-first guidance, no runtime. Adapted as original wording from
> `coleam00/context-engineering-intro` (MIT, Copyright (c) 2025 Cole Medin), used as
> idea-level inspiration only. No PRP-runner tooling or upstream prompt/template text is
> copied.

## Why this exists

Most failed AI implementations fail for lack of context, not lack of capability. Context
engineering is the discipline of giving the executor everything it needs — the spec, the
patterns this repo already uses, curated examples, the few docs that settle decisions, and
executable checks — so the work succeeds in one pass instead of drifting. This is broader
than prompt wording: it is about the whole package of information handed to the implementer.

In Vibe Coding OS this discipline lives in three places that work together:

- A **context-rich brief** — `templates/implementation-brief-template.md`, generated via
  `commands/vibe-brief.md` and executed via `commands/vibe-brief-execute.md`.
- An **examples library** — a small, curated set of in-repo references to mimic and avoid.
- **Project rules** — the durable per-project conventions an executor must honor, already
  captured in `CONSTITUTION.md`, `CLAUDE.md`, `AGENTS.md`, and `CONTEXT.md`.

## The loop

```text
Research → Gather docs → Curate examples → Write brief → Confidence (1-10)
        → Load → Plan → Implement → Run validation gates → Iterate until green → Complete
```

The first line is generation (`vibe-brief`); the second is execution
(`vibe-brief-execute`). The brief is the contract between them.

## Examples library convention

Curated examples are the highest-leverage context: an executor copies what it can see. This
repo already ships an `examples/` area (for instance `examples/feature-workflow/` and
`examples/bugfix-workflow/`). Treat it as the examples library and follow these rules:

- Reference real in-repo files by path; do not paste large external snippets.
- For each example say whether it is **positive** (mimic this) or **negative** (avoid this),
  and give a one-line reason. Negative examples matter as much as positive ones.
- Prefer the closest prior art to the task at hand — same layer, same conventions.
- If no example exists for a needed pattern, say so in the brief and define the new pattern
  deliberately rather than inventing one mid-implementation.
- Keep the library small and current; stale examples teach the wrong thing.

## Project rules convention

Project rules are the standing constraints every brief inherits, so they do not have to be
restated each time:

- `CONSTITUTION.md` — non-negotiable principles, goals, and non-goals.
- `CLAUDE.md` / `AGENTS.md` — how agents should behave in this repo.
- `CONTEXT.md` — shared domain language and architectural context.

A brief should *reference* the relevant rules, not duplicate them. If a task needs a rule
that does not exist yet, add it to the appropriate file rather than burying it in one brief.

## Validation gates and iterate-until-green

A brief is only trustworthy if "done" is defined by checks a machine can run. Each gate is an
ordered, executable command with an observable pass condition (lint → type/build → targeted
tests → `npm run validate` when structure or registries change). The executor runs them in
order and, on failure, fixes the root cause in the implementation and re-runs the full list —
never editing a check to pass. Work stops only when all gates are green or a gate exposes an
ambiguity that belongs back in the spec or plan.

## Confidence score

Before handing a brief to an executor, self-score 1-10 how confident you are that the brief
holds enough context for a one-pass, validation-green implementation. A score below 7 is a
signal to gather what is missing — an unread file, an undocumented dependency, a missing
example, an unresolved open question — before any code is written.

## Related artifacts

- `templates/implementation-brief-template.md`
- `commands/vibe-brief.md`, `commands/vibe-brief-execute.md`
- `skills/core/context-rich-implementation/SKILL.md`
- `skills/core/checkpoint-validation/SKILL.md`, `skills/core/verification-before-done/SKILL.md`
- `references/features/context-engineering.md`

## Ghi chú tiếng Việt

Context engineering = kỷ luật trao đủ ngữ cảnh cho executor (spec, pattern repo, ví dụ tuyển
chọn, tài liệu cần thiết, cổng kiểm thử chạy được) để làm một lần là xanh. Ba trụ cột: brief
giàu ngữ cảnh, thư viện ví dụ (`examples/`, ghi rõ nên bắt chước / cần tránh), và project
rules (`CONSTITUTION.md`, `CLAUDE.md`, `AGENTS.md`, `CONTEXT.md` — chỉ tham chiếu, không lặp
lại). Vòng lặp: nghiên cứu → gom tài liệu → tuyển ví dụ → viết brief → chấm tự tin → nạp →
lập kế hoạch → code → chạy cổng kiểm thử → lặp đến khi xanh → hoàn tất. Tất cả là markdown,
không có runtime/CLI/PRP-runner.
