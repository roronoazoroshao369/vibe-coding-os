# Reference: mattpocock/skills

## Metadata

- Repo: https://github.com/mattpocock/skills
- Owner: mattpocock
- Name: skills
- Category: engineering-skills
- Status: tracked
- Import mode: inspiration
- License: MIT according to the GitHub repository metadata checked on 2026-06-05
- Last checked: 2026-06-05
- Last known commit: unknown

## Why this repo matters

It is tracked as a reference for small, composable Claude Code engineering skills. Vibe Coding OS should study how focused skills can improve diagnosis, planning critique, issue shaping, TDD, codebase architecture, and delivery discipline while keeping the human in control.

## Key concepts

- Small engineering workflows that are easy to adapt.
- Per-repository setup for issue tracker, labels, and domain documentation.
- Diagnosis, TDD, architecture improvement, PRD, and issue-shaping loops.
- Plan critique and domain-documentation feedback before implementation.

## Features to study

| Feature | Why it matters | Local equivalent | Status |
| --- | --- | --- | --- |
| Skill Orchestration | Helps evaluate how local skills should stay small, composable, and explicit. | skills/core/vibe-bootstrap/SKILL.md, registry/skills.json, commands/vibe-init.md | Tracked for study, not copied. |
| Spec Driven Development | Helps compare PRD, issue-shaping, and plan critique loops against local spec templates. | skills/core/spec-first-development/SKILL.md, commands/vibe-spec.md, templates/spec-template.md | Tracked for study, not copied. |
| TDD Loop | Helps compare red-green-refactor and regression-test discipline with local testing guidance. | skills/core/test-driven-development/SKILL.md, commands/vibe-implement.md, templates/task-template.md | Tracked for study, not copied. |
| Review Before Merge | Helps compare plan challenge, diagnosis, and final review discipline. | skills/core/review-before-merge/SKILL.md, commands/vibe-review.md | Tracked for study, not copied. |
| Anti Overengineering | Helps evaluate whether local guidance keeps workflows proportional and human-controlled. | skills/prompts/anti-overengineering/SKILL.md, skills/core/clarify-before-code/SKILL.md | Tracked for study, not copied. |

## Local mapping

The current local targets connected to this source are:

- `skills/core/clarify-before-code/SKILL.md`
- `skills/core/spec-first-development/SKILL.md`
- `skills/core/test-driven-development/SKILL.md`
- `skills/core/review-before-merge/SKILL.md`
- `skills/prompts/anti-overengineering/SKILL.md`
- `commands/vibe-spec.md`
- `commands/vibe-implement.md`
- `commands/vibe-review.md`

## Update watchlist

When this upstream repo changes, future agents should inspect:

- new or changed engineering skills that improve diagnosis, TDD, issue shaping, or plan critique;
- setup conventions for per-repo context and domain documentation;
- patterns that make skills more composable without turning them into a rigid runtime;
- license, notice, or attribution changes before any closer adaptation;
- examples that reveal workflow gaps without copying their text.

## Do not copy

Future agents must not copy large chunks, prompts, docs, examples, tests, or vendor code from this repository without license review and an explicit local decision. Summarize ideas in original language and map them to Vibe Coding OS needs.

## Last audit notes

- Initial reference file created after verifying the repository exists and is described as a Claude Code engineering skills repository.
- GitHub metadata indicated an MIT license at the time of tracking.
