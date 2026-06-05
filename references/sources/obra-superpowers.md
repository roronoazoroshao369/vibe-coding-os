# Reference: obra/superpowers

## Metadata

- Repo: https://github.com/obra/superpowers
- Owner: obra
- Name: superpowers
- Category: skill-system
- Status: tracked
- Import mode: inspiration
- License: not verified
- Last checked: not checked
- Last known commit: unknown

## Why this repo matters

It is tracked as a reference for skill packaging, agent-facing ergonomics, and composable workflows. Vibe Coding OS should learn from the idea of reusable operating procedures while keeping its own normalized skill format and attribution rules.

## Key concepts

- Composable skill boundaries and discovery.
- Agent instructions that are explicit enough to execute without hidden state.
- Workflow primitives that can be combined without turning into a framework dependency.

## Features to study

| Feature | Why it matters | Local equivalent | Status |
| --- | --- | --- | --- |
| Skill Orchestration | Helps evaluate whether the local workflow covers an important reusable behavior. | skills/core/vibe-bootstrap/SKILL.md, skills/core/plan-driven-execution/SKILL.md, skills/core/review-before-merge/SKILL.md | Tracked for study, not copied. |
| Anti Overengineering | Helps evaluate whether the local workflow covers an important reusable behavior. | skills/core/vibe-bootstrap/SKILL.md, skills/core/plan-driven-execution/SKILL.md, skills/core/review-before-merge/SKILL.md | Tracked for study, not copied. |
| Review Before Merge | Helps evaluate whether the local workflow covers an important reusable behavior. | skills/core/vibe-bootstrap/SKILL.md, skills/core/plan-driven-execution/SKILL.md, skills/core/review-before-merge/SKILL.md | Tracked for study, not copied. |

## Local mapping

The current local targets connected to this source are:

- `skills/core/vibe-bootstrap/SKILL.md`
- `skills/core/plan-driven-execution/SKILL.md`
- `skills/core/review-before-merge/SKILL.md`
- `commands/vibe-init.md`
- `commands/vibe-review.md`

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
