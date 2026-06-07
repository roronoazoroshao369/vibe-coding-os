# Project Standards

> Use this file for project-specific coding, documentation, testing, and handoff standards that agents must read alongside `CONSTITUTION.md` and `CONTEXT.md`.

## Purpose

The constitution defines durable principles. This standards file defines the current conventions that make those principles executable in day-to-day work.

## How agents should use this file

1. Read `CONSTITUTION.md` for non-negotiable principles.
2. Read `CONTEXT.md` for shared vocabulary and domain assumptions.
3. Read this file before planning or implementing non-trivial work.
4. In specs and plans, cite any standard that constrains the solution.
5. When a standard conflicts with a spec, either revise the spec or record an explicit trade-off.

## Coding standards

- Prefer the smallest change that satisfies accepted behavior.
- Match local naming, formatting, file layout, error handling, and test style before adding new patterns.
- Do not introduce a new abstraction unless at least two current use cases need it or the accepted plan explicitly calls for it.
- Keep generated or adapted markdown in original wording; never paste large upstream prose.

## Documentation standards

- Commands live in `commands/vibe-*.md`.
- Skills live in `skills/<category>/<name>/SKILL.md`.
- Templates live in `templates/*.md`.
- Reference feature docs live in `references/features/*.md` and must map back to source notes and changelogs.
- Major workflow docs should include a concise `## Ghi chú tiếng Việt` section when useful for maintainers.

## Command authoring standards

- Each command file states purpose, when to use, required inputs, step-by-step behavior, outputs, stopping conditions, and a verification checklist.
- Every command ends with a `## Handoffs / next-step suggestion` section that names the most likely next command or skill for each outcome (success, blocked, needs-rework). This keeps multi-phase work flowing without guesswork.
- Keep handoff suggestions conditional ("if X → command Y"), not a fixed pipeline, so the agent still chooses the lightest useful next step.
- Add a `## Ghi chú tiếng Việt` note when the command guides a major workflow phase.

## Testing and validation standards

- Run `npm run validate` after structural, registry, reference, skill, command, or template changes.
- Run `npm run validate:references` after reference-layer changes.
- Report checks as passed, failed, or not run with a reason.
- Do not mark work complete when validation is unknown.

## Attribution standards

- Treat upstream repositories as inspiration unless a closer import has explicit approval.
- Update `ATTRIBUTIONS.md`, `references/index.json`, source changelogs, mappings, and the upstream control map when adapting a tracked idea.
- Do not vendor runtimes, installers, generated agent files, upstream command packs, or large documentation blocks.

## Maintenance

Revise this file when a repeated project convention becomes stable enough to guide future agents. Keep it concrete; move philosophy back to `CONSTITUTION.md` and volatile session facts to memory/handoff notes.

## Ghi chú tiếng Việt

`CONSTITUTION.md` là nguyên tắc cao nhất; `STANDARDS.md` là convention hiện hành để agent áp dụng khi spec/plan/implement. Khi đổi convention, cập nhật file này và chạy validation.