# Orchestration Guide

Advanced orchestration defines multi-stage workflows for development work that needs more structure than a single implementation pass. A workflow declares stages, agent roles, inputs, outputs, triggers, and quality gates that must pass before the pipeline advances.

Related entry points: `commands/vibe-orchestrate.md`, `skills/core/orchestration-workflows/SKILL.md`, and workflow templates such as `templates/workflow-simple-feature.json`, `templates/workflow-bugfix.json`, and `templates/workflow-security-audit.json`.

## When to use it

Use orchestration for:

- Complex features that need planning, implementation, review, verification, and handoff.
- Security-sensitive changes where gates must block unsafe advancement.
- Multi-agent work where architects, engineers, reviewers, testers, and orchestrators coordinate.
- Bugfixes that need explicit root-cause analysis and verification.
- Release or compliance tasks where a report is required.

For small single-file changes, the normal quality workflow may be enough.

## Quick start: simple feature

Preview the default feature pipeline:

```bash
node scripts/orchestrate-workflow.mjs \
  --workflow templates/workflow-simple-feature.json \
  --dry-run
```

Run it with JSON output:

```bash
node scripts/orchestrate-workflow.mjs \
  --workflow templates/workflow-simple-feature.json \
  --output-json
```

The runner writes a markdown report to:

```text
docs/reports/orchestration/<workflowId>-<timestamp>.md
```

## Available templates

- `templates/workflow-simple-feature.json`: plan → implement → review → verify → handoff.
- `templates/workflow-bugfix.json`: analyze → fix → review → verify.
- `templates/workflow-security-audit.json`: scan → analyze → remediate → verify → report.

## Custom workflow creation

Create a JSON file matching `schemas/orchestration-workflow.json`.

Required top-level fields:

- `workflowId`: stable lowercase identifier.
- `name`: human-readable workflow name.
- `stages`: ordered array of stage definitions.
- `metadata`: version, author, creation time, and tags.

Each stage declares:

- `stageId` and `name`.
- `type`: `plan`, `implement`, `review`, `verify`, or `handoff`.
- `agentRole`: the role responsible for the stage.
- `inputs` and `outputs`: artifacts exchanged between stages.
- `gates`: quality checks enforced for that stage.
- Optional `timeout` and `retryPolicy`.

## Gate enforcement

A gate reference contains:

- `gateId`: gate from `templates/quality-gate-manifest.json` or a built-in runner alias.
- `level`: `critical`, `warning`, or `advisory`.
- `requiredForAdvance`: whether failure blocks the next stage.

If a required gate fails, the stage is marked `blocked` and downstream stages do not run. Non-required gates still appear in the report so reviewers can assess residual risk.

Built-in aliases:

- `validate-all`: runs `npm run validate --silent`.
- `quality-engine`: runs `node scripts/quality-engine.mjs --profile=standard --output-json`.

## Multi-agent coordination

Treat `agentRole` as the contract for who owns a stage. The planner produces inputs for the implementer, the implementer produces evidence for review, the reviewer records risks, the tester verifies, and the orchestrator performs handoff.

Keep artifacts small and explicit. Prefer `task-plan.md`, `root-cause.md`, `review-notes.md`, `verification-report.md`, and `summary.md` style outputs so later agents can continue without guessing.

## Quality engine and telemetry integration

Workflow gates reuse the quality gate manifest and can invoke the quality engine through the `quality-engine` gate alias. Quality engine results are captured in stage gate output and summarized in the orchestration report.

If project telemetry is enabled in quality configuration, quality-engine executions can feed the normal quality telemetry pipeline. Orchestration reports remain local markdown artifacts under `docs/reports/orchestration/`.

## Recommended practice

- Start with a template, then customize only what the task requires.
- Make high-risk and security gates required for advancement.
- Use `--dry-run` before first execution to confirm planned stages and commands.
- Review the final report before merge, release, or handoff.
