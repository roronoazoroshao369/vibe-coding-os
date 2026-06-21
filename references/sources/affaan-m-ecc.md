# Reference: affaan-m/ECC

## Metadata

- Repo: https://github.com/affaan-m/ECC
- Owner: affaan-m
- Name: ECC
- Category: coding-workflow
- Status: tracked
- Import mode: inspiration
- License: MIT (verified from upstream LICENSE)
- Last checked: 2026-06-19
- Last known commit: unknown

## Why this repo matters

It is tracked as a reference for disciplined AI coding loops. Vibe Coding OS should study how coding guidance can connect planning, implementation, testing, and review while remaining lightweight for an individual developer.

## Key concepts

- End-to-end execution loops.
- Practical guardrails for coding agents.
- Ways to keep implementation tied to intent and checks.

## Features to study

| Feature | Why it matters | Local equivalent | Status |
| --- | --- | --- | --- |
| Spec Driven Development | Helps evaluate whether the local workflow covers an important reusable behavior. | skills/core/spec-first-development/SKILL.md, skills/core/test-driven-development/SKILL.md, commands/vibe-spec.md | Tracked for study, not copied. |
| TDD Loop | Helps evaluate whether the local workflow covers an important reusable behavior. | skills/core/spec-first-development/SKILL.md, skills/core/test-driven-development/SKILL.md, commands/vibe-spec.md | Tracked for study, not copied. |
| Review Before Merge | Helps evaluate whether the local workflow covers an important reusable behavior. | skills/core/spec-first-development/SKILL.md, skills/core/test-driven-development/SKILL.md, commands/vibe-spec.md | Tracked for study, not copied. |
| Continuous Learning / Instinct Extraction | Helps the agent improve across sessions by extracting trigger-action rules with confidence scores. | skills/meta/context-budget/SKILL.md, commands/vibe-instinct.md, templates/instinct-template.md | Enhanced from existing local version. |
| Context Budget Audit | Keep framework docs lean with token-estimation heuristics and duplicate detection. | skills/meta/context-budget/SKILL.md | Enhanced from existing local version. |

## Local mapping

The current local targets connected to this source are:

- `skills/core/spec-first-development/SKILL.md`
- `skills/core/test-driven-development/SKILL.md`
- `commands/vibe-spec.md`
- `commands/vibe-implement.md`
- `skills/meta/context-budget/SKILL.md`
- `skills/meta/context-budget/SKILL.md`
- `commands/vibe-instinct.md`
- `templates/instinct-template.md`
- `references/features/continuous-learning.md`

## Update watchlist

When this upstream repo changes, future agents should inspect:

- changes to workflow structure, command naming, and agent-facing instructions;
- new patterns that reduce ambiguity, improve verification, or improve memory hygiene;
- removed or deprecated concepts that indicate a local idea may need re-evaluation;
- license, notice, or attribution changes before any closer adaptation;
- examples that reveal user experience gaps without copying their text.

## Do not copy

Future agents must not copy large chunks, prompts, docs, examples, tests, or vendor code from this repository without license review and an explicit local decision. Summarize ideas in original language and map them to Vibe Coding OS needs.

## Last audit notes

- Initial reference file created.
- 2026-06-19: Added continuous-learning/instinct-extraction (B6.1) and context-budget audit heuristics (B6.2). Enhanced instinct-extraction skill with two-phase loop, confidence rubric, instinct lifecycle. Enhanced context-budget skill with token-estimation formulas, duplicate detection patterns, and heuristic cost model. Created vibe-instinct command, instinct-template, and continuous-learning feature doc.
