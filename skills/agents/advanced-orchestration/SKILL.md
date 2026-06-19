# Advanced Orchestration Agent

## Purpose

Orchestrate multi-team, multi-stage sprint workflows with checkpoint gates, lane assignment, council escalation, pause/resume, and quality-engine integration. Enables a single orchestrator to decompose a sprint into parallel lanes, assign team ownership, run state-check gates between stages, escalate deadlocked decisions to a quality council, and produce a verified sprint summary.

## When to use

Use Advanced Orchestration when the work exceeds a single team or sequential pipeline:

- **Multi-team sprints** — work spans two or more teams with distinct ownership (frontend, backend, infra, QA).
- **Lane-based parallel work** — independent streams of work that must be integrated at defined sync points.
- **High-risk cross-cutting changes** — any change where a checkpoint gate failure could cascade.
- **Council escalation needed** — a review or verification deadlock that requires a three-role council (writer, critic, verifier) to resolve.
- **Stop/resume workflows** — long-running orchestration that must survive agent restarts or context switches.

For single-team, sequential pipelines, use the standard orchestration workflow (`skills/core/orchestration-workflows/SKILL.md`) or `vibe-orchestrate` with a template.

## Inputs

- Sprint goal or epic description
- Acceptance criteria and non-goals
- Team roster: each team's name, ownership domain, lane assignment
- Available templates: `templates/orchestration-workflow.md`, schema `schemas/orchestration-workflow.json`
- Quality gate manifest (`templates/quality-gate-manifest.json`)
- Previous orchestration reports or handoff context
- Quality Engine profile selection (lean, standard, heavy)

## Workflow

### Phase 1 — Sprint setup

1. **Clarify sprint goal** and decompose into lanes (parallel workstreams).
2. **Assign team ownership** per lane: one team per lane, one orchestrator overall.
3. **Define checkpoint gates** between each lane stage (plan → implement → review → verify → integrate).
4. **Select quality profile** for each lane based on risk: lean (low), standard (medium), heavy (high/cross-cutting).
5. **Create the orchestration plan** using `templates/orchestration-workflow.md`.

### Phase 2 — Lane execution

For each lane, execute in stage order with checkpoint gates:

1. **Plan stage** — team architect produces task plan and file list.
   - Gate: plan coherence check (`validate-all --scope plan`).
2. **Implement stage** — team engineer produces code changes and tests.
   - Gate: `validate-all`, `secret-scan`, lane-specific quality packs.
3. **Review stage** — independent reviewer examines changes.
   - Gate: adversarial review, quality engine run (profile per risk).
4. **Verify stage** — independent tester runs verification suite.
   - Gate: `validate-all`, quality-engine, acceptance criteria check.
5. **Integrate stage** — orchestrator merges lane output, resolves conflicts.

### Phase 3 — Checkpoint gates

Each checkpoint gate records:

- **Status**: `pass`, `fail`, `warn`, or `blocked`.
- **Evidence**: command output, log excerpts, or report paths.
- **Decision**: `advance`, `block`, `request-rework`, or `escalate-to-council`.

If a required gate fails, the lane enters `blocked` state. The orchestrator may:
- Request rework and re-run the gate (resume).
- Skip the gate if it is non-required and the lane owner accepts risk.
- Escalate to council if the blocker is a judgment call, not a test failure.

### Phase 4 — Council escalation

When a checkpoint gate reaches an impasse (e.g., reviewer and engineer disagree on a design decision, or a verifier flags a blocking concern):

1. **Orchestrator assembles a council** from three separate agents/roles:
   - **Writer** (the lane's engineer or original author).
   - **Critic** (the agent or reviewer who raised the concern).
   - **Verifier** (a neutral third agent who inspects the chain).
2. Council follows the **Quality Council Agent** protocol (`skills/agents/quality-council/SKILL.md`).
3. Council produces a verdict: `Release`, `Release with reservations`, `Request revision`, or `Escalate`.
4. Orchestrator records the verdict in the lane checkpoint log and acts on it.

### Phase 5 — Stop / Resume

The orchestrator may pause a lane at any checkpoint gate:

- **Stop**: record the lane state (stage, gate results, artifacts, open items) in a checkpoint snapshot.
- **Resume**: load the snapshot, confirm the lane is still at the same stage, re-run the gate that was in progress, and continue.
- Stop/resume is supported across agent sessions using `templates/orchestration-workflow.md` with the `checkpointSnapshot` section.

### Phase 6 — Sprint summary

After all lanes pass their final gates:

1. Aggregate lane summaries into a single sprint report.
2. Include: lane goals, gates passed/failed/skipped, council escalations, checkpoint log, rollback notes.
3. Produce `docs/reports/orchestration/<sprintId>-<timestamp>.md`.
4. Handoff with context for the next sprint or integration phase.

## Outputs

- **Sprint orchestration plan** — lanes, teams, gates, timelines (fillable `templates/orchestration-workflow.md`).
- **Lane checkpoint logs** — per-stage gate status, evidence, decisions.
- **Council escalation records** — writer/critic/verifier chain and verdict.
- **Stop/resume snapshots** — lane state at pause point.
- **Sprint summary report** — aggregated results for the whole sprint.
- **Traceability** — all artifacts linked via `docs/advanced-orchestration.md`.

## Failure modes

- **Lane dependency mismatch** — one lane blocks another because shared interfaces were not agreed in the plan stage.
  - *Mitigation*: define cross-lane contracts in the plan stage before any implementation begins.
- **Orchestrator becomes bottleneck** — all decisions route through one agent.
  - *Mitigation*: delegate lane-level gate decisions to team leads; escalate only judgment calls.
- **Council deadlock** — writer, critic, and verifier cannot agree.
  - *Mitigation*: verifier has final gate decision; if still deadlocked, escalate to human task owner.
- **Checkpoint gate skipped without compensating rigor** — a non-required gate is skipped and risk surfaces later.
  - *Mitigation*: gate skip must be recorded with rationale and residual risk; the summary reports all skips.
- **Stop/resume loses state** — checkpoint snapshot is incomplete or stale.
  - *Mitigation*: snapshot includes stageId, gate results, artifact hashes, and open items list.
- **Council roles share context** — independence is broken when writer and critic run in the same session.
  - *Mitigation*: enforce separate agent sessions or distinct subagent invocations.
- **Rollback plan not defined** — a failed lane cannot be rolled back without cascading to other lanes.
  - *Mitigation*: each lane defines rollback criteria in the orchestration plan before implementation.

## Verification checklist

- [ ] Sprint goal is decomposed into concrete, non-overlapping lanes.
- [ ] Each lane has a designated team/owner, quality profile, and gate list.
- [ ] Checkpoint gates are defined between every stage with required/optional flags.
- [ ] Council escalation path is documented and available for each lane.
- [ ] Stop/resume snapshots include stageId, gate results, artifact state, and open items.
- [ ] Rollback plan exists for each lane before implementation begins.
- [ ] All gates are run (pass, fail, skip) and recorded in the checkpoint log.
- [ ] Council verdicts are preserved in the sprint summary.
- [ ] Sprint summary reports gates passed, failed, skipped, council escalations, and residual risk.
- [ ] Traceability from sprint goal to lane artifacts to gates is intact.

## Multi-team ownership model

| Role | Responsibility |
|------|---------------|
| **Orchestrator** | Owns the sprint plan, lane assignments, checkpoint gates, council escalation, stop/resume, and final summary. One orchestrator per sprint. |
| **Team Lead** | Owns one lane: produces lane plan, gates, artifacts, and checkpoint evidence. Reports gate status to orchestrator. |
| **Team Members** | Execute stages within the lane (architect, engineer, reviewer, tester). Operate under the team lead's coordination. |
| **Quality Council** | Resolves escalated gate deadlocks via writer-critic-verifier chain. Verdicts are binding for the lane. |

## Related assets

- Skill: `skills/core/orchestration-workflows/SKILL.md` — basic stage-gated workflows
- Command: `commands/vibe-orchestrate.md` — orchestration CLI entrypoint
- Template: `templates/orchestration-workflow.md` — fillable orchestration plan
- Schema: `schemas/orchestration-workflow.json` — workflow JSON schema
- Council: `skills/agents/quality-council/SKILL.md` — three-role council protocol
- Guide: `docs/advanced-orchestration.md` — canonical v2.5 guide
- Layer docs: `docs/quality-shield.md`, `docs/expert-mode.md`, `docs/smart-adapt.md`, `docs/quality-engine-guide.md`, `docs/quality-telemetry-guide.md`, `docs/model-aware-config-guide.md`, `docs/cicd-integration.md`

## Ghi chú tiếng Việt

Advanced Orchestration Agent điều phối nhiều team, nhiều lane song song với checkpoint gates, council escalation, và stop/resume. Sprint được chia thành các lane độc lập, mỗi lane có team lead riêng. Cổng checkpoint giữa các stage ghi nhận pass/fail/blocked. Khi bế tắc, triệu tập Quality Council (writer-critic-verifier) để phân xử. Hỗ trợ tạm dừng và tiếp tục lane qua checkpoint snapshot. Báo cáo sprint tổng hợp kết quả tất cả lane.
