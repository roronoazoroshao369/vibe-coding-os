---
title: Templates
type: template
name: README
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:

status: stable
---

# Templates

Templates are copy-paste artifact shapes for Vibe Coding OS workflows. They help users produce consistent specs, plans, tasks, ADRs, reviews, handoffs, memory entries, team specs, quality reports, and configuration examples.

## What this layer is

- Markdown and JSON starter files under `templates/`.
- Concrete output formats used by commands and skills.
- A consistency layer for reviewable work products.
- Markdown-first unless a JSON schema/example is explicitly needed.

## When to use it

Use a template when you need to create or standardize an artifact, for example:

- `spec-template.md` for expected behavior and acceptance criteria.
- `plan-template.md` for implementation approach and validation.
- `tasks-template.md` for ordered implementation tasks.
- `adr-template.md` for important design decisions.
- `review-template.md` for structured review findings.
- Quality Shield templates: `quality-rubric.md`, `quality-contract.md`, `code-context-pack-template.md`, `self-review-checklist.md`, `quality-scorecard.md`, and `quality-scorecard-session.md`.
- `handoff-template.md` or `session-summary-template.md` for continuity.
- JSON templates for workflow, quality, team, or config examples.

Use a skill to learn the method. Use a command to drive the workflow.

For how these templates fit together, see the Quality Shield guide: [`docs/quality-shield.md`](../docs/quality-shield.md).

## How to pick a good template

1. Choose by artifact, not by preference: spec, plan, task list, ADR, review, memory, handoff, team, quality, or config.
2. Prefer the smallest template that captures the required decision or evidence.
3. Use markdown for human-readable workflow artifacts.
4. Use JSON only when the artifact is meant to be machine-readable or an example config.
5. Keep placeholders obvious and replace them before final handoff.
6. Check related commands or skills if you are unsure how to fill a section.

## Common anti-patterns

- Filling a template with vague text just to satisfy process.
- Keeping unused placeholder sections in final artifacts.
- Using an ADR for minor implementation details.
- Putting secrets, tokens, private keys, or sensitive raw logs into memory/handoff templates.
- Creating a new template when an existing one needs only a small improvement.
- Copying upstream templates without license review and attribution.

## Validation commands

Run from the Vibe Coding OS repo:

```bash
npm run validate:repo
npm run validate:traceability
npm run validate:secrets
npm run validate
```

For JSON templates, also run the broad validation before release:

```bash
npm run validate:all
```

## How to add a new template

1. Confirm the artifact is reusable and not already covered.
2. Create `templates/<artifact-name>-template.md` for human-readable artifacts, or `.json` for machine-readable examples.
3. Include clear placeholders, short usage notes, and any safety warnings.
4. Link the template from related commands or skills when it is part of a workflow.
5. If it is based on external inspiration, update attribution/source records as required.
6. Run validation:

```bash
npm run validate:secrets
npm run validate:traceability
npm run validate
```
