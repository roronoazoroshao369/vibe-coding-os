---
description: "Run an adversarial red-team code review focused on correctness, safety, tests, compatibility, and minimal diff."
---

# vibe-red-team-review

## Purpose

Run a skeptical code review that tries to disprove readiness. Do not provide a polite rubber-stamp review; approval must be backed by evidence from the task, diff, and validation.

## When to use

Use before merge or release, after a complex implementation, when a patch touches risky behavior, when test coverage is uncertain, or when a normal review may be too gentle.

## Required inputs

- Original task, spec, or acceptance criteria.
- Current diff or branch to review.
- Test and validation results, including failures or checks not run.
- Compatibility, security/safety, and scope constraints.

## Step-by-step workflow

1. Read the original task and identify required behavior, non-goals, and risk areas.
2. Inspect the diff and changed files directly; do not rely on the author summary.
3. Check correctness, edge cases, failure modes, data handling, and regression risk.
4. Check security/safety, privacy, permissions, dangerous defaults, and dependency risk.
5. Check tests and validation for meaningful coverage of changed behavior.
6. Check compatibility and migration impact across supported environments.
7. Check whether the diff is minimal or includes unrelated churn.
8. Write actionable findings with severity and evidence.
9. Give a verdict based on blockers, residual risk, and verification evidence.

## Output format

Return the review in this exact order:

- **Critical**: release-blocking or must-fix issues. Use “None found” only after adversarial checks.
- **Important**: should-fix issues involving tests, edge cases, compatibility, maintainability, or scope.
- **Minor**: small non-blocking improvements.
- **Verdict**: `Request changes`, `Approve with reservations`, or `Approve`, including verification observed and residual risk.

## Stop/ask-clarifying-question condition

Stop and ask when the task scope is missing, the diff cannot be inspected, validation status is unknown for a risky patch, suspected private data appears, or licensing/attribution obligations are unclear.

## Related skills/templates

- `skills/core/adversarial-code-review/SKILL.md`
- `skills/agents/reviewer-agent/SKILL.md`
- `templates/review-template.md`
