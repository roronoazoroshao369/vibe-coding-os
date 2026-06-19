---
description: "Run a lightweight critique pass that challenges an artifact against the original task before final delivery."
---

# vibe-critique-pass

## Purpose

Deliver a structured second look — from the same or a different agent — that checks the artifact for task fit, quality, and evidence gaps before the user or another reviewer sees it. Unlike a full red-team review, a critique pass is proportional to the artifact risk and keeps the feedback loop short.

## When to use

Use before delivering a non-trivial artifact, after a writer or implementer claims completion, when you want a lightweight second pass instead of a full red-team review, or when the agent producing the artifact wants to self-critique with a structured protocol.

## Required inputs

- Original task, spec, or acceptance criteria.
- Artifact or diff to critique.
- Author summary of what was done and why.
- Validation results or a statement of what checks were run.
- Known constraints, risks, and out-of-scope areas.

## Step-by-step workflow

1. **Restate the goal**: rephrase the intended outcome, acceptance criteria, and non-goals in one paragraph.
2. **Inspect directly**: read the artifact before trusting the author summary.
3. **Check task fit**: does the artifact satisfy all stated requirements? Are there invented requirements or scope drift?
4. **Check quality at proportional depth**: correctness, clarity, maintainability, user impact, safety, compatibility — how deeply you check depends on artifact risk.
5. **Check evidence**: do tests, validation, reasoning, or examples actually support the claimed result?
6. **Record findings** by severity with concrete evidence and a suggested fix.
7. **Decide**: can the writer apply small fixes, rerun verification, escalate, or proceed as-is?
8. **If fixes applied**: re-check the changed risk areas and update the verdict.

## Output format

Return the critique in this exact order:

- **Scope checked**: task, artifact, files, constraints reviewed.
- **Critical**: findings that block delivery. Use “None found” only after adversarial checks.
- **Important**: should-fix issues for quality, evidence, or maintainability.
- **Minor**: small non-blocking improvements.
- **Evidence**: validation reviewed, checks not run.
- **Verdict**: `Proceed`, `Proceed with reservations`, `Revise first`, or `Escalate/clarify`.

## Stop/ask-clarifying-question condition

Stop and ask when the original task is missing or ambiguous, the artifact cannot be inspected, validation status is unknown for a risky change, suspected private data appears in the artifact, licensing or attribution obligations are unclear, or the critique would edit files owned by another agent or team.

## Related skills/templates

- `skills/core/critique-pass-protocol/SKILL.md`
- `skills/core/adversarial-code-review/SKILL.md`
- `skills/agents/quality-council/SKILL.md`
- `templates/critique-pass-template.md`
