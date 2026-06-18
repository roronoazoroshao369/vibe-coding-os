# Skill: Quality Engine

## Purpose

Run a configurable quality engine that executes relevant quality gates on a task or repository and returns structured results, actionable recommendations, and a human-readable report.

## When to use

Use after implementation, before a PR or merge, during periodic quality audits, or when onboarding or reassessing a repository. Choose this skill when you need a coordinated pass across multiple quality gates instead of running individual checks manually.

## Inputs

- Task description and scope (what changed, what is affected)
- Model profile selection (`lean`, `standard`, or `heavy`)
- Repository path or working context
- Optional config path for project-specific settings
- Optional gate selection to force or exclude certain checks

## Workflow

1. Load configuration from the project config path if available, otherwise use the default quality engine defaults.
2. Determine the model profile and translate it into execution constraints, depth, and evidence expectations.
3. Select relevant gates based on task type, changed areas, and the chosen profile.
4. Execute the quality engine with the selected gates in a predictable order.
5. Capture pass, warn, and fail results with supporting evidence or remediation pointers.
6. Review failures and warnings, then group them into root causes and actionable fixes.
7. Generate a structured result set plus a markdown report with timing, summary, and recommendations.

## Outputs

- Structured results object with gate names, statuses, messages, and timing
- Markdown report summarizing findings, risk, and recommended next steps
- Ranked fix recommendations grouped by severity and confidence

## Failure modes

- Running a heavy profile on trivial work and wasting review bandwidth.
- Running a lean profile on high-risk changes and missing important signals.
- Skipping config and losing project-specific thresholds or exclusion rules.
- Mixing evidence from unrelated tasks or files.
- Treating warnings as blockers without reviewing confidence and impact.

## Verification checklist

- [ ] Config loaded successfully or defaults applied intentionally.
- [ ] Model profile selected and justified for the task size and risk.
- [ ] Gates selected match task type and scope.
- [ ] Each failing gate includes a reproducible observation or artifact.
- [ ] Recommendations are specific, prioritized, and actionable.
- [ ] Report is concise and distinguishes blockers from non-blocking warnings.

## Related skills

- `skills/core/quality-execution-contract/SKILL.md`
- `skills/core/adversarial-code-review/SKILL.md`
- `skills/core/adaptive-prompt-selection/SKILL.md`
