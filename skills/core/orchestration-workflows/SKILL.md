# Skill: Orchestration Workflows

## Purpose

Define and execute multi-stage development workflows with quality gates at each stage, so complex work moves through explicit plan, implement, review, verify, and handoff checkpoints instead of a single unstructured pass.

## When to use

Use this skill for complex features, security-sensitive changes, multi-agent coordination, high-risk refactors, release preparation, or any task where a simple single-pass workflow is insufficient. Prefer it when several agents or roles must coordinate around artifacts and gating evidence.

## Inputs

- Workflow definition: a JSON workflow file conforming to `schemas/orchestration-workflow.json`.
- Task context: requirements, acceptance criteria, constraints, and relevant repository context.
- Agent assignments: named roles for stages such as architect, engineer, reviewer, tester, debugger, or orchestrator.
- Quality config: gate manifest, quality engine settings, validation expectations, and any project-specific overrides.

## Outputs

- Ordered stage results with pass, fail, blocked, or skipped status.
- Gate results per stage with required-for-advance decisions.
- Stage artifacts such as plans, code changes, reviews, verification reports, and handoff summaries.
- Final orchestration report under `docs/reports/orchestration/`.

## Workflow

1. Select a workflow template from `templates/workflow-*.json` or create a custom workflow definition.
2. Customize stages for the task: stage IDs, roles, inputs, outputs, timeouts, retry policy, and gate references.
3. Assign agents to each stage and confirm each agent understands its expected inputs and outputs.
4. Execute stages sequentially using `scripts/orchestrate-workflow.mjs --workflow <path>` or the `vibe-orchestrate` command.
5. Enforce gates at each stage. Required gates block advancement when they fail; advisory or warning gates produce evidence and risk notes.
6. Generate a final summary report with stage outcomes, blockers, gate evidence, and handoff notes.
7. Handoff to the next agent, reviewer, or maintainer with the report and all required artifacts.

## Failure modes

- Workflow template does not match task risk, causing either under-gating or excessive ceremony.
- Stage outputs are not produced, leaving downstream agents without enough context.
- Required gates are marked advisory or optional and real blockers are missed.
- Gate failures are bypassed without documented risk acceptance.
- Agent role ownership is ambiguous and work stalls between stages.
- Reports are generated but not reviewed before merge or handoff.

## Verification checklist

- [ ] Workflow file exists and matches `schemas/orchestration-workflow.json`.
- [ ] Each stage has a clear owner role, expected inputs, and expected outputs.
- [ ] Required gates are appropriate for the stage and task risk.
- [ ] Blocking gate failures stop advancement and include remediation guidance.
- [ ] Optional stages are intentionally marked and safe to skip.
- [ ] Final report is written to `docs/reports/orchestration/` and included in the handoff.
