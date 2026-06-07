---
description: "Implement an accepted spec or plan with minimal edits, matching conventions and reporting verification results."
---

# vibe-implement

## Purpose

Implement the current plan with minimal, correct edits. Follow repository conventions, avoid unrelated churn, update tests or docs when needed, and record any assumptions discovered during implementation.

## When to use

Use this command when there is an accepted spec or concrete plan and the next step is to modify files. It is also appropriate for small, explicit fixes where the plan can be stated inline before editing.

## Required inputs

- Accepted spec, plan, or explicit user request that is narrow enough to implement safely.
- Applicable repository instructions and current git status.
- Target files or areas to change.
- Expected tests, validation commands, or review criteria.

## Step-by-step workflow

1. Reconfirm scope, assumptions, and files to touch before editing.
2. Inspect the existing implementation and neighboring conventions.
3. If upstream inspiration is relevant, check `references/index.json` and read the relevant source docs before adapting ideas in original language.
4. Make the smallest correct changes that satisfy the plan.
5. Update tests, docs, registries, templates, or attribution files when the implementation requires them.
6. Run targeted checks first, then broader validation such as `npm run validate` when appropriate.
7. Review the diff for unrelated churn, secrets, attribution issues, and acceptance criteria coverage.
8. Report changed files, assumptions, validation results, and any limitations.

## Output format

Return an implementation summary with:

- **Changes made**: grouped by file or feature.
- **Assumptions discovered**.
- **Verification**: commands run and results.
- **Follow-ups**: only if something remains intentionally out of scope or blocked.

## Verification expectation

Run the most relevant checks available. For repository structure, command, registry, or reference changes, run `npm run validate` unless an environment limitation prevents it. Never claim completion without reporting validation results or clearly stating why a check could not run.

## Stop/ask-clarifying-question condition

Stop and ask when the plan conflicts with repository reality, implementation would require broad rewrites not covered by the spec, there are unsafe uncommitted user changes, required inputs are missing, or a failed validation reveals an ambiguity that cannot be resolved locally.

## Related skills/templates

- `skills/agents/implementer-agent/SKILL.md`
- `skills/core/plan-driven-execution/SKILL.md`
- `skills/core/test-driven-development/SKILL.md`
- `skills/core/verification-before-done/SKILL.md`
- `skills/prompts/anti-overengineering/SKILL.md`
- `skills/prompts/karpathy-guardrails/SKILL.md`
