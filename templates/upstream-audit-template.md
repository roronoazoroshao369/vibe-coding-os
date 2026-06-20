---
title: Upstream Audit: <source-id>
type: template
name: upstream-audit-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:
  - template
status: stable
---

# Upstream Audit: <source-id>

## Baseline

- Source: `<owner>/<repo>`
- URL: <url>
- Local clone: `references/upstreams/<owner>-<repo>`
- Commit: `<hash>`
- Commit date: <date>
- License status: <verified/unknown/requires-review>

## What changed upstream

- <Summarize upstream changes in original language. Do not copy release notes or docs.>

## Reusable principles

- <Principle 1>
- <Principle 2>

## Reference scorecard

Use `references/reference-scorecard.md` for rating guidance.

| Criterion | Rating | Evidence | Notes |
| --- | --- | --- | --- |
| Feature overlap with Vibe Coding OS | <low/medium/high/unknown> | <files, docs, commits, mappings> | <short rationale> |
| Activity/recent commit status | <low/medium/high/unknown> | <commit hash/date, release, issue/PR signal> | <short rationale> |
| License clarity | <low/medium/high/unknown> | <license files, metadata, attribution notes> | <short rationale> |
| Documentation quality | <low/medium/high/unknown> | <README, docs, examples, changelog> | <short rationale> |
| Skill/command/template relevance | <low/medium/high/unknown> | <candidate local skills, commands, templates> | <short rationale> |
| Memory/privacy risk | <low/medium/high/unknown> | <storage, retention, examples, privacy controls> | <risk and mitigation> |
| Multi-agent relevance | <low/medium/high/unknown> | <handoff, roles, review, verification evidence> | <short rationale> |
| Copy/licensing risk | <low/medium/high/unknown> | <copying required, license compatibility, attribution plan> | <risk and mitigation> |
| Maintenance cost | <low/medium/high/unknown> | <files touched, validation burden, sync complexity> | <short rationale> |
| Recommended action | <adopt/adapt/defer/ignore> | <decision evidence> | <next step> |

## Impacted local files

- `<local-file>` — <why this file may change>

## Decisions

- Adopt: <ideas to adapt now>
- Defer: <ideas to revisit later>
- Ignore: <ideas that do not fit Vibe Coding OS>

## Validation

- `<command>` — <result>
