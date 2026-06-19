---
description: "Orchestrate a multi-team sprint: plan lanes, assign ownership, run checkpoint gates, escalate to council, and summarize."
arguments:
  --workflow <path>: "Workflow definition or filled orchestration template to execute or inspect."
  --template <path>: "Use a fillable markdown workflow template, default templates/orchestration-workflow.md."
  --list-templates: "Show available workflow templates."
  --plan: "Create an orchestration plan from the requested sprint goal."
  --assign-lanes: "Assign teams/owners to planned lanes."
  --run-gates: "Run checkpoint gates and block advancement when required gates fail."
  --resume <checkpoint-id>: "Resume from a previously recorded checkpoint snapshot."
  --summary: "Produce or refresh the final orchestration summary."
  --dry-run: "Show planned lanes, stages, and gates without executing gates."
  --output-json: "Emit JSON workflow results when using the script runner."
---

# vibe-orchestrate

## Purpose

Coordinate a multi-team sprint through lane planning, ownership assignment, checkpoint gates, council escalation, stop/resume, and final summarization.

Use this command as the entrypoint for Advanced Orchestration (`skills/agents/advanced-orchestration/SKILL.md`) and the canonical guide (`docs/advanced-orchestration.md`).

## When to use

Use `vibe-orchestrate` when work needs more than a single implementation pass:

- Multiple teams or agents need separate lanes.
- Work can run in parallel but must fan in at checkpoint gates.
- Required gates must block advancement until fixed or escalated.
- A reviewer/implementer/verifier dispute needs council escalation.
- The sprint may need to stop and resume across sessions.

For simple sequential workflows, use an existing JSON workflow template such as `templates/workflow-simple-feature.json`.

## Required inputs

- Sprint goal or workflow file.
- Acceptance criteria and non-goals.
- Team roster or available agent roles.
- Lane candidates and dependency constraints.
- Gate policy: required gates, optional gates, Quality Engine profile.
- Rollback expectations and residual-risk tolerance.

## Usage

```bash
# List JSON workflow templates
vibe-orchestrate --list-templates

# Dry-run a standard stage-gated workflow
vibe-orchestrate --workflow templates/workflow-simple-feature.json --dry-run

# Plan a multi-team sprint from the markdown template
vibe-orchestrate --plan --template templates/orchestration-workflow.md

# Assign lanes and run checkpoint gates
vibe-orchestrate --workflow path/to/filled-orchestration.md --assign-lanes --run-gates

# Resume a paused lane from a checkpoint snapshot
vibe-orchestrate --workflow path/to/filled-orchestration.md --resume checkpoint-backend-verify-001

# Produce final summary
vibe-orchestrate --workflow path/to/filled-orchestration.md --summary
```

## Workflow

### 1. Plan

1. Restate the sprint goal, acceptance criteria, and non-goals.
2. Split work into lanes with clear boundaries and dependency notes.
3. For each lane, define stages: plan, implement, review, verify, integrate.
4. Select a Quality Engine profile per lane: `lean`, `standard`, or `heavy`.
5. Create or fill `templates/orchestration-workflow.md`.

### 2. Assign lanes

For each lane, record:

- Team/owner.
- Write scope and forbidden scope.
- Inputs and expected outputs.
- Required checkpoint gates.
- Cross-lane dependencies.
- Rollback criteria.

Rules:

- One lane owner per lane.
- Shared files have one explicit owner or serialized edit order.
- Review and verification lanes must be independent from authoring.

### 3. Run checkpoint gates

At every stage boundary, evaluate checkpoint gates:

- `pass` — lane may advance.
- `warn` — lane may advance only if residual risk is recorded.
- `fail` — lane must rework before advancing.
- `blocked` — lane requires orchestrator or council decision.

Recommended gates:

- `validate-all` for repository-level validation.
- `quality-engine` with risk-appropriate profile.
- `secret-scan` for any code or config change.
- Domain quality packs for API, auth, DB migration, frontend state, async job, or CI/CD changes.
- Traceability and markdown link validation for documentation/registry changes.

### 4. Escalate to council when needed

Escalate when a checkpoint cannot be resolved by normal rework:

- Implementer disagrees with reviewer on a blocking finding.
- Verifier cannot confirm safety or correctness from available evidence.
- A required gate is inconclusive because evidence conflicts.
- Cross-lane integration requires a trade-off outside a single lane's ownership.

Council protocol:

1. Assemble distinct `writer`, `critic`, and `verifier` roles.
2. Use `skills/agents/quality-council/SKILL.md`.
3. Preserve writer response, critic findings, verifier decision, and residual risk.
4. Return one verdict: `Release`, `Release with reservations`, `Request revision`, or `Escalate`.
5. Orchestrator records the verdict in the checkpoint log.

### 5. Stop / Resume

Stop at a checkpoint when work is blocked, context is expiring, or human input is needed.

A checkpoint snapshot must include:

- Sprint ID and lane ID.
- Current stage and gate status.
- Artifacts produced so far.
- Commands run and evidence locations.
- Open blockers and next action.
- Council notes if escalation occurred.

To resume:

1. Load the latest checkpoint snapshot.
2. Confirm no lane owner or artifact scope changed unexpectedly.
3. Re-run stale gates if code or docs changed since the snapshot.
4. Continue from the first incomplete gate.

### 6. Summarize

Final summary must include:

- Sprint goal and result.
- Lane-by-lane status.
- Gate pass/fail/warn/skip counts.
- Council escalations and decisions.
- Rollback notes and residual risks.
- Validation commands run and not run.
- Follow-up tasks and owners.

## Outputs

- Filled orchestration workflow from `templates/orchestration-workflow.md`.
- Lane assignment map.
- Checkpoint gate log.
- Council escalation notes.
- Stop/resume snapshots.
- Final sprint summary or report under `docs/reports/orchestration/`.

## Implementation note

For JSON workflow definitions, use the dependency-free runner:

```bash
node scripts/orchestrate-workflow.mjs --workflow <path> [--dry-run] [--output-json]
```

For markdown multi-team sprint plans, follow the command workflow above and fill `templates/orchestration-workflow.md`. The markdown template is the human-readable sprint contract; the JSON schema remains the structured runner contract.

## Validation checklist

- [ ] Sprint goal, acceptance criteria, and non-goals are stated.
- [ ] Lanes have owners, scopes, dependencies, outputs, and rollback criteria.
- [ ] Required checkpoint gates are explicit and have evidence.
- [ ] Failed gates block advancement unless council verdict allows release with reservations.
- [ ] Council roles are independent when escalation is used.
- [ ] Stop/resume snapshot exists for any paused lane.
- [ ] Summary includes checks run, checks skipped, residual risks, and follow-up owners.
