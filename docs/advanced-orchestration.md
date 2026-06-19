# Advanced Orchestration (v2.5)

Advanced Orchestration is the v2.5 quality discipline layer that enables multi-team, multi-lane sprint workflows with checkpoint gates, council escalation, stop/resume, and full traceability. It layers on top of all previous quality layers to handle the most complex orchestration scenarios.

## Layer stack

```
Quality Shield (v1.7) — universal baseline: intent, context, smallest diff, self-review, scorecard
    ↑
Expert Mode (v1.8) — escalation paths: adversarial review, critique pass, quality packs, writer-critic, council
    ↑
Smart Adapt (v1.9) — adaptive layer: model weakness memory, adaptive prompt selection, lessons learned DB
    ↑
Quality Engine (v2.0) — structured runner: gate selection, profiles, execution, reporting
    ↑
Model-Aware Config (v2.1) — model × risk gate tailoring
    ↑
Quality Telemetry (v2.2) — capture, aggregate, trend quality signals
    ↑
Multi-Repo Learning (v2.3) — cross-repo lesson exchange and golden-promotion
    ↑
CI/CD Integration (v2.4) — GitHub Actions workflows, PR gates, scorecard sessions, artifact archiving
    ↑
Advanced Orchestration (v2.5) — multi-team, multi-lane, checkpoint gates, council escalation, stop/resume
```

Advanced Orchestration does **not** replace any previous layer. It coordinates across them.

## When to use Advanced Orchestration

Use Advanced Orchestration instead of the standard stage-gated pipeline when:

- **Multiple teams** need coordinated parallel workstreams.
- **Lane fan-in** at defined integration points is required.
- **Checkpoint gates** must block or escalate before the next stage.
- **Council escalation** is available for deadlocked decisions.
- **Stop/resume** across agent sessions is needed.
- **Sprint-level summary** with rollback planning is expected.

For single-team sequential work, use `templates/workflow-simple-feature.json` with `vibe-orchestrate` or the standard orchestration skill (`skills/core/orchestration-workflows/SKILL.md`).

## Components

### 1. Advanced Orchestration Agent Skill

**Location:** `skills/agents/advanced-orchestration/SKILL.md`

The orchestrator agent skill defines the phased workflow: sprint setup, lane execution, checkpoint gates, council escalation, stop/resume, and sprint summary. It includes:

- **Purpose and when to use** — criteria for selecting advanced orchestration.
- **Inputs and outputs** — what the orchestrator needs and produces.
- **Workflow phases** — detailed step-by-step orchestration method.
- **Failure modes** — known pitfalls with mitigations.
- **Verification checklist** — what must be true for the orchestration to be complete.
- **Multi-team ownership model** — orchestrator, team leads, members, and council roles.

### 2. Orchestrate Command

**Location:** `commands/vibe-orchestrate.md`

The command entrypoint for orchestrating multi-team sprints. Supports:

- `--plan` — create an orchestration plan from a sprint goal.
- `--assign-lanes` — assign teams and owners to lanes.
- `--run-gates` — execute checkpoint gates per lane stage.
- `--resume <checkpoint-id>` — resume from a stored snapshot.
- `--summary` — produce final sprint summary.
- `--dry-run` — inspect planned lanes and gates without execution.

### 3. Orchestration Workflow Template

**Location:** `templates/orchestration-workflow.md`

A fillable markdown template that serves as the sprint contract. Sections:

- Sprint identity and acceptance criteria.
- Lane definitions with owners, scopes, dependencies, and quality profiles.
- Checkpoint gates with required/optional flags and pass conditions.
- Cross-lane contracts for shared interfaces.
- Checkpoint log for recording gate results.
- Council escalation notes with writer/critic/verifier verdicts.
- Checkpoint snapshot for stop/resume.
- Rollback plan per lane.
- Sprint summary with aggregate metrics.
- Handoff section for session continuation.

### 4. JSON Workflow Schema

**Location:** `schemas/orchestration-workflow.json`

The JSON schema that defines the structured contract for workflow JSON definitions. Used by `scripts/orchestrate-workflow.mjs` for standard stage-gated pipelines.

## Council escalation

When a checkpoint gate produces a judgment deadlock (not a clear test failure), the orchestrator may escalate to a quality council.

The council follows the three-role pattern from `skills/agents/quality-council/SKILL.md`:

1. **Writer** — the lane engineer or author who produced the artifact under dispute.
2. **Critic** — the reviewer or agent who raised the concern.
3. **Verifier** — a neutral third agent who inspects the writer-critic exchange.

Council verdicts:

| Verdict | Meaning |
|---------|---------|
| Release | Artifact is acceptable; lane may advance. |
| Release with reservations | Lane advances with documented residual risk. |
| Request revision | Lane must rework before advancing. |
| Escalate | Council cannot decide; refer to human task owner. |

Council notes are preserved in the orchestration template's escalation section and the final sprint summary.

## Checkpoint gates

A checkpoint gate is a quality check enforced at a stage boundary. Each gate records:

- **Gate ID** — reference from `templates/quality-gate-manifest.json` or a custom gate.
- **Level** — `critical`, `warning`, or `advisory`.
- **Required for advance** — whether failure blocks the next stage.
- **Status** — `pass`, `fail`, `warn`, `skip`, `blocked`.
- **Evidence** — command output, log path, or report reference.
- **Decision** — `advance`, `block`, `request-rework`, or `escalate-to-council`.

Checkpoint gates may reuse any gate from the Quality Engine (`scripts/quality-engine.mjs`) or validation scripts (`npm run validate:*`).

## Stop / resume

A lane may be paused at any checkpoint gate by recording a checkpoint snapshot.

The snapshot must contain:

- Sprint ID and lane ID.
- Paused stage and last completed gate.
- Artifact hashes or paths for changed files.
- Incomplete gates list.
- Open blockers and next action.
- Any council escalation cross-references.

On resume, the orchestrator:

1. Loads the snapshot.
2. Confirms the lane state is unchanged.
3. Re-runs stale gates if artifacts changed.
4. Continues from the first incomplete gate.

## Multi-team ownership

| Role | Responsibility |
|------|---------------|
| **Orchestrator** | Sprint plan, lane assignments, checkpoint gates, council escalation, stop/resume, final summary. One per sprint. |
| **Team Lead** | Lane ownership: produces lane plan, gate evidence, artifacts. Reports to orchestrator. |
| **Team Members** | Execute stages within a lane (architect, engineer, reviewer, tester). |
| **Quality Council** | Resolves gate deadlocks via writer-critic-verifier chain. Verdicts are binding. |

## Linking to previous layers

Advanced Orchestration builds on every previous layer:

| Layer | Version | Link | How it connects |
|-------|---------|------|-----------------|
| Quality Shield | v1.7 | [`docs/quality-shield.md`](quality-shield.md) | Universal baseline — intent, context, self-review, scorecard. Used in every lane's review and verify gates. |
| Expert Mode | v1.8 | [`docs/expert-mode.md`](expert-mode.md) | Adversarial review, critique pass, quality packs. Used for high-risk lane gates and council escalation. |
| Smart Adapt | v1.9 | [`docs/smart-adapt.md`](smart-adapt.md) | Model weakness memory, adaptive prompt selection, lessons learned. Used for pre-flight gate injection per lane. |
| Quality Engine | v2.0 | [`docs/quality-engine-guide.md`](quality-engine-guide.md) | Structured gate runner. Used as the primary gate execution mechanism with per-lane profile selection. |
| Model-Aware Config | v2.1 | [`docs/model-aware-config-guide.md`](model-aware-config-guide.md) | Gate selection from model capability × task risk. Used for adaptive profiling per lane. |
| Quality Telemetry | v2.2 | [`docs/quality-telemetry-guide.md`](quality-telemetry-guide.md) | Capture, aggregate, trend quality signals. Used to inform gate tuning and profile selection. |
| Multi-Repo Learning | v2.3 | [`docs/multi-repo-learning.md`](multi-repo-learning.md) | Cross-repo lesson exchange. Used for importing prevention rules from other projects. |
| CI/CD Integration | v2.4 | [`docs/cicd-integration.md`](cicd-integration.md) | GitHub Actions workflows, PR gates, artifact archiving. Used for automated gate runs in CI. |

### Referenced skills and assets

- Orchestrator skill: [`skills/agents/advanced-orchestration/SKILL.md`](../skills/agents/advanced-orchestration/SKILL.md)
- Quality council skill: [`skills/agents/quality-council/SKILL.md`](../skills/agents/quality-council/SKILL.md)
- Standard orchestration skill: [`skills/core/orchestration-workflows/SKILL.md`](../skills/core/orchestration-workflows/SKILL.md)
- Orchestrate command: [`commands/vibe-orchestrate.md`](../commands/vibe-orchestrate.md)
- Orchestration template: [`templates/orchestration-workflow.md`](../templates/orchestration-workflow.md)
- Orchestration JSON schema: [`schemas/orchestration-workflow.json`](../schemas/orchestration-workflow.json)
- Quality gate manifest: [`templates/quality-gate-manifest.json`](../templates/quality-gate-manifest.json)
- Orchestration runner script: [`scripts/orchestrate-workflow.mjs`](../scripts/orchestrate-workflow.mjs)
- Workflow JSON templates: `templates/workflow-simple-feature.json`, `templates/workflow-bugfix.json`, `templates/workflow-security-audit.json`

## Orchestration flow diagram

```
Sprint Goal
    │
    ▼
┌─────────────────────────────┐
│  1. Sprint Setup            │
│     - Decompose into lanes  │
│     - Assign team owners     │
│     - Define gates          │
│     - Select QA profiles    │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  2. Lane Execution          │◄──── Lane 1 ──── Lane 2 ──── Lane N
│     Plan → Implement →      │
│     Review → Verify →       │
│     Integrate               │
│     (with checkpoint gates) │
└──────────┬──────────────────┘
           │
           ├── Gate pass ──────► Advance to next stage
           ├── Gate fail ──────► Request rework → re-run gate
           └── Gate blocked ──► Council escalation
                                  │
                                  ▼
                           ┌──────────────┐
                           │  3. Council   │
                           │  Writer/Critic│
                           │  /Verifier    │
                           └──────┬───────┘
                                  │
                       ┌──────────┼──────────┐
                       ▼          ▼          ▼
                  Release   Request rev.  Escalate
                                  │
                                  ▼
                           (human task owner)
           │
           ▼
┌─────────────────────────────┐
│  4. Stop / Resume           │
│     Checkpoint snapshot     │
│     Re-run stale gates      │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  5. Sprint Summary          │
│     Aggregate lane results  │
│     Council notes           │
│     Residual risks          │
│     Handoff                 │
└─────────────────────────────┘
```

## Verification checklist

- [ ] Sprint goal is decomposed into lanes with clear ownership.
- [ ] Each lane has a quality profile and gates defined.
- [ ] Checkpoint gates record status, evidence, and decision.
- [ ] Council escalation path is documented and accessible.
- [ ] Stop/resume snapshots capture full lane state.
- [ ] Rollback plan exists per lane before implementation.
- [ ] Final summary includes all gates, escalations, risks, and follow-ups.
- [ ] Traceability: all linked artifacts resolve to existing files.
- [ ] Markdown links validate with `npm run validate:markdown-links`.
- [ ] Inventory traceability validates with `npm run validate:traceability`.

## See also

- [`docs/quality-shield.md`](quality-shield.md) — Quality Shield v1.7 baseline
- [`docs/expert-mode.md`](expert-mode.md) — Expert Mode v1.8 escalation
- [`docs/smart-adapt.md`](smart-adapt.md) — Smart Adapt v1.9 adaptive layer
- [`docs/quality-engine-guide.md`](quality-engine-guide.md) — Quality Engine v2.0
- [`docs/model-aware-config-guide.md`](model-aware-config-guide.md) — Model-Aware Config v2.1
- [`docs/quality-telemetry-guide.md`](quality-telemetry-guide.md) — Quality Telemetry v2.2
- [`docs/multi-repo-learning.md`](multi-repo-learning.md) — Multi-Repo Learning v2.3
- [`docs/cicd-integration.md`](cicd-integration.md) — CI/CD Integration v2.4
- [`docs/orchestration-guide.md`](orchestration-guide.md) — Standard orchestration basics
- [`docs/workflows/team-agent-orchestration.md`](workflows/team-agent-orchestration.md) — Team-agent portable patterns
- [`docs/quality-guard-integration.md`](quality-guard-integration.md) — Quality guard integration

## Ghi chú tiếng Việt

Advanced Orchestration (v2.5) là lớp điều phối nâng cao cho phép nhiều team làm việc song song với checkpoint gates, hội đồng tư vấn (council), tạm dừng/tiếp tục (stop/resume), và báo cáo tổng kết sprint. Dựa trên tất cả lớp trước: Quality Shield (v1.7), Expert Mode (v1.8), Smart Adapt (v1.9), Quality Engine (v2.0), Model-Aware Config (v2.1), Quality Telemetry (v2.2), Multi-Repo Learning (v2.3), và CI/CD Integration (v2.4). Mỗi lane có team lead riêng, gates riêng, và có thể triệu tập council khi bế tắc.
