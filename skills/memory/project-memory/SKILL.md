# Project Memory

## Purpose

Maintain durable project context that future sessions can trust.

## When to use

Use when decisions, conventions, commands, or architecture facts should persist.

## Inputs

Decision, context, source, date, confidence, sensitivity level.

## Workflow

1. Capture only durable information.
2. Separate facts from assumptions.
3. Record why the decision matters.
4. Redact sensitive details.
5. Mark stale items for later review.

## Outputs

A concise memory entry with source, confidence, and safety status.

## Failure modes

- Saving secrets.
- Saving noisy transcripts.
- Failing to update obsolete memory.

## Verification checklist

- [ ] Entry is durable.
- [ ] No sensitive data is included.
- [ ] Source and confidence are clear.
- [ ] Staleness risk is noted.

Related mattpocock-inspired skills: `skills/core/shared-domain-language/SKILL.md`, `skills/core/architecture-decision-records/SKILL.md`, and `skills/memory/agent-handoff/SKILL.md`.
