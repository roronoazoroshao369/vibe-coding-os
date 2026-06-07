# Reference: multica-ai/andrej-karpathy-skills

## Metadata

- Repo: https://github.com/multica-ai/andrej-karpathy-skills
- Owner: multica-ai
- Name: andrej-karpathy-skills
- Category: prompt-guardrails
- Status: tracked
- Import mode: inspiration (re-write only)
- License: MIT declared in metadata only (`.claude-plugin/plugin.json`, README) by author `forrestchang`; no standalone LICENSE file and no copyright line → grant incomplete/unverifiable
- Last checked: 2026-06-07
- Last known commit: 2c606141936f1eeef17fa3043a72095b4765b9c2

## Why this repo matters

It is tracked as a reference for practical AI coding guardrails and empirical iteration. Vibe Coding OS should study how to encourage fast experiments, simple solutions, and evidence-based iteration without copying prompt text.

## Key concepts

- Four engineering-discipline principles: Think Before Coding, Simplicity First
  (anti-overengineering), Surgical Changes, and Goal-Driven Execution.
- Goal-Driven Execution: rewrite an imperative instruction into a verifiable goal with an
  explicit success condition and plan steps that each carry a verify check, so an agent can
  loop and self-correct independently (e.g. "fix the bug" → "write a reproduction test, then
  make it pass").
- Anti-overengineering language.
- Guardrails that preserve production-quality thinking during prototyping.

## Features to study

| Feature | Why it matters | Local equivalent | Status |
| --- | --- | --- | --- |
| Think Before Coding | Settles intent and assumptions before editing. | skills/prompts/karpathy-engineering-discipline/SKILL.md | Re-written in original wording. |
| Simplicity First | Keeps solutions proportional to the request. | skills/prompts/anti-overengineering/SKILL.md | Re-written in original wording. |
| Surgical Changes | Keeps diffs minimal and traceable to the request. | skills/prompts/karpathy-engineering-discipline/SKILL.md | Re-written in original wording. |
| Goal-Driven Execution | Turns imperatives into verifiable goals with per-step checks for independent looping. | skills/core/goal-driven-execution/SKILL.md, skills/core/verification-before-completion/SKILL.md | Re-written in original wording. |

## Local mapping

The current local targets connected to this source are:

- `skills/prompts/karpathy-engineering-discipline/SKILL.md` (Think Before Coding + Surgical Changes)
- `skills/prompts/anti-overengineering/SKILL.md` (Simplicity First)
- `skills/core/goal-driven-execution/SKILL.md` (Goal-Driven Execution)
- `skills/core/verification-before-completion/SKILL.md` (evidence bar behind goal-driven)
- `skills/prompts/karpathy-guardrails/SKILL.md` (distinct, separately-authored ML-iteration skill)
- `commands/vibe-implement.md`

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
- 2026-06-07: Recorded that MIT is declared in metadata only (author `forrestchang`) with no
  LICENSE file or copyright line, so the source stays inspiration-only re-write. Mapped all
  four engineering-discipline principles to local skills, adding
  `skills/core/goal-driven-execution/SKILL.md` for Goal-Driven Execution. No upstream text
  copied.
