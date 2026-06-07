# Reference: revfactory/harness

## Metadata

- Repo: https://github.com/revfactory/harness
- Owner: revfactory
- Name: harness
- Category: agent-team-orchestration
- Status: tracked
- Import mode: inspiration
- License: Apache-2.0, Copyright 2025 robin. Verified from provided upstream facts during the 2026-06-07 audit.
- Last checked: 2026-06-07
- Last known commit: unknown

## Why this repo matters

Harness is tracked for team-architecture ideas that can be expressed as portable markdown: domain analysis before team design, reusable team patterns, generated role briefs, progressive disclosure, and validation by dry run plus with-skill/without-skill comparison.

## Key concepts

- Six team patterns: Pipeline, Fan-out/Fan-in, Expert Pool, Producer-Reviewer, Supervisor, and Hierarchical Delegation.
- Phase workflow: Domain Analysis → Team Architecture Design → Agent Definition Generation → Skill Generation → Integration & Orchestration → Validation & Testing.
- Progressive disclosure for agent context.
- Validation with dry-run reasoning and with-vs-without-skill comparison.
- Output directories such as `.claude/agents` and `.claude/skills` are inspiration only; Vibe Coding OS does not generate or vendor them.

## Local mapping

- `skills/core/team-agent-orchestration/SKILL.md`
- `commands/vibe-team.md`
- `templates/team-architecture-template.md`
- `docs/workflows/team-agent-orchestration.md`
- `references/features/team-agent-orchestration.md`

## Update watchlist

Future audits should inspect upstream changes to team pattern taxonomy, validation methods, progressive disclosure, generated artifact boundaries, and license/notice data before any closer adaptation.

## Do not copy

Do not vendor upstream code, generated agent definitions, skill outputs, docs, prompts, templates, or runtime behavior. Summarize ideas in original Vibe Coding OS language only.

## Last audit notes

- Initial integration uses provided upstream facts only.
- Local content is original markdown guidance; no upstream text/code/runtime is copied.
