---
name: multi-repo-learning
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Multi-Repository Learning

> Export, exchange, and import portable coding lessons across repositories without requiring a hosted service or daemon.

## Purpose

Enable teams to share sanitized, portable lessons across repositories so prevention rules, fix patterns, and root-cause insights discovered in one project are safely reusable in another. This skill provides the workflows and tools for exporting local lessons, importing cross-repo exchange batches, and maintaining privacy throughout.

## When to use

- You discovered a valuable pattern or fix in one project and want to reuse it in another.
- A teammate maintains a related repo and could benefit from your team's lessons learned.
- You want to audit your local lesson DB for quality, expiry, or sensitive content before sharing.
- You received a lesson exchange batch from another repo and need to review and import it safely.

## Inputs

- Source lesson entry or lesson database, commonly based on `templates/lesson-entry-template.md`.
- Target repository context: stack, domain, runtime constraints, and relevant quality packs.
- Privacy level for sharing: `public`, `internal`, `private`, or `redacted`.
- Optional exchange file matching `schemas/lesson-exchange-schema.json`.
- Optional golden example candidate using `templates/golden-example-entry.md`.

## Workflow

1. **Check quality** — run `npm run lesson:check` or `node scripts/lesson-exchange.mjs --export --dry-run` to validate export readiness.
2. **Redact before sharing** — remove secrets, customer data, proprietary endpoints, raw logs, and repo-specific names unless they are intentionally public.
3. **Export** — run `npm run lesson:export` or `node scripts/lesson-exchange.mjs --export --output docs/lessons/exchange-export.json`.
4. **Review exchange batch** — inspect `lesson_id`, `source_repo`, `area`, `severity`, `root_cause`, `fix_pattern`, `prevention_rule`, `tags`, and `privacy_level`.
5. **Import safely** — run `npm run lesson:import -- --input <file>` or `node scripts/lesson-exchange.mjs --import --input <file>`.
6. **Promote when useful** — convert high-signal imported lessons into golden examples using `templates/golden-example-entry.md`.
7. **Inject prevention** — reference imported lessons in Smart Adapt / Model-Aware Config before future tasks.

## Outputs

- Portable exchange JSON file validated by `schemas/lesson-exchange-schema.json`.
- Imported lesson markdown at `docs/lessons/imported-lessons.md`.
- Optional golden example entry for future prompt injection.
- Updated prevention rule or quality checklist for the receiving repo.

## Failure modes

- **Sensitive data leakage:** exchange file contains raw logs, tokens, customer names, or private URLs. Stop and redact before export/import.
- **Over-specific lesson:** fix pattern only applies to one repo's internals. Generalize the root cause and prevention rule.
- **Schema mismatch:** imported JSON does not match `schemas/lesson-exchange-schema.json`. Fix the batch before use.
- **Duplicate lesson:** receiving repo already has the same prevention rule. Merge or cross-link instead of duplicating.
- **Low-signal lesson:** lesson lacks a concrete root cause, fix pattern, or prevention rule. Keep it local until clarified.

## Verification checklist

- [ ] Exchange JSON validates against `schemas/lesson-exchange-schema.json`.
- [ ] No secrets, raw logs, customer data, private URLs, or real credentials are present.
- [ ] Lesson includes root cause, fix pattern, prevention rule, and tags.
- [ ] Receiving repo context was checked before promotion.
- [ ] Imported lesson links to relevant quality pack, Smart Adapt, or Model-Aware Config workflow.
- [ ] Golden example promotion includes before/after pattern and a prevention prompt.

## Related assets

- Command: `commands/vibe-lesson-exchange.md`
- Schema: `schemas/lesson-exchange-schema.json`
- Sample: `templates/lesson-exchange-sample.json`
- Guide: `docs/multi-repo-learning.md`
- Examples: `examples/multi-repo-learning/README.md`

## Notes

Multi-repo learning is markdown-first and repository-local. It does not require a hosted service, daemon, telemetry upload, or runtime expansion.
