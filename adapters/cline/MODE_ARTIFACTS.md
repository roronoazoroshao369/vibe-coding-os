# Cline Mode Artifacts

> Drop-in rules for Cline's three modes: architect, ask, code. Each file is
> scoped to one mode's scope of work. Save as `.clinerules-architect`,
> `.clinerules-ask`, and `.clinerules-code` in the workspace root.

## `.clinerules-architect` — spec & plan mode

```
# Vibe Coding OS — Cline Architect Mode
# Source: https://github.com/roronoazoroshao369/vibe-coding-os (v2.12.0)

You operate in architect mode. Your scope is producing specs, plans, and
designs — NOT implementation. Implementation belongs to `.clinerules-code`.

## Spec rule

Before any plan, paste `commands/vibe-spec.md` and produce a spec with:
- Problem statement (one paragraph).
- Acceptance criteria (numbered, each falsifiable).
- Out-of-scope list.

## Plan rule

After spec approval, paste `commands/vibe-plan.md` and produce a step-by-step
plan with file paths, validation commands, and a rollback strategy.

## Design rule

For non-trivial designs (new module, new API, new data model), produce a
design doc under `docs/designs/<date>-<name>.md` with:
- Context (why this design exists).
- Alternatives considered (≥ 2).
- Trade-offs (what we give up).
- Migration plan (how to roll out).

## Failure modes to avoid

- Writing code in architect mode — switch to code mode for that.
- Producing a spec without acceptance criteria.
- Producing a plan without file paths.
- Producing a design without alternatives.

## Verification checklist

- [ ] Every spec has numbered acceptance criteria.
- [ ] Every plan lists file paths and validation commands.
- [ ] Every design lists ≥ 2 alternatives.
- [ ] No implementation files were edited in this turn.
```

## `.clinerules-ask` — Q&A mode

```
# Vibe Coding OS — Cline Ask Mode
# Source: https://github.com/roronoazoroshao369/vibe-coding-os (v2.12.0)

You operate in ask mode. Your scope is answering questions, reviewing code,
and explaining — NOT writing new code. New code belongs to code mode.

## Answer rule

Every answer must cite a source (file:line for code, URL for docs, commit
SHA for git history). No unsourced claims.

## Review rule

When asked to review a diff, paste `commands/vibe-review.md` and produce a
markdown table with one row per finding (file, lines, finding, severity,
suggested fix).

## Explain rule

When asked to explain code, walk the call graph in order: entry point →
helper → sink. Cite each function by file:line.

## Failure modes to avoid

- Writing new code in ask mode — defer to code mode.
- Citing memory instead of file/line.
- Producing prose-only review (must be a table).

## Verification checklist

- [ ] Every claim cites a source.
- [ ] Every review is a markdown table.
- [ ] No new files were created in this turn.
```

## `.clinerules-code` — implementation mode

```
# Vibe Coding OS — Cline Code Mode
# Source: https://github.com/roronoazoroshao369/vibe-coding-os (v2.12.0)

You operate in code mode. Your scope is implementing what an approved spec
and plan specify — NOT designing or spec'ing. Spec work belongs to architect
mode.

## Plan-driven rule

Implement only what the plan specifies. If a new requirement emerges during
implementation, stop and request the user switch to architect mode to update
the spec + plan.

## TDD rule

Write the failing test first (red), implement the smallest change to pass
(green), then refactor. Do not skip red.

## Validation rule

Run `npm run validate:all` after any structural change (new skill, new
command, new template, new validator). Require exit 0 before declaring done.

## Provenance rule

Every commit must carry the four trailers:
  AI-Generated: <yes|no|partial>
  Human-Edited: <yes|no>
  Tested-By: <ci|human|n/a>
  Human-Reviewed: <yes|no|self>

## Failure modes to avoid

- Implementing without an approved plan.
- Skipping the failing test step.
- Declaring done before `npm run validate:all` exits 0.
- Committing without provenance trailers.

## Verification checklist

- [ ] Plan is approved and present.
- [ ] Test was written first and failed (red).
- [ ] Implementation passes the test (green).
- [ ] `npm run validate:all` exits 0.
- [ ] Commit carries all 4 provenance trailers.
```

## Customization

- Append project-specific rules after the Vibe section in each mode file.
- Override the "scope" if your project has a non-standard mode split.
- Always keep the Vibe section at the top so the framework rules apply first.
