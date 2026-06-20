---
title: Orchestration Workflow Template
type: template
name: orchestration-workflow
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:

status: stable
---

# Orchestration Workflow Template

> Fill this template to define and execute a multi-team sprint orchestration.
> See `docs/advanced-orchestration.md` for the canonical guide and
> `skills/agents/advanced-orchestration/SKILL.md` for the orchestrator agent skill.

---

## 1. Sprint Identity

| Field | Value |
|-------|-------|
| Sprint ID | `[sprint-identifier]` |
| Sprint goal | `[one-line goal statement]` |
| Epic / parent | `[link to epic or parent spec]` |
| Orchestrator | `[orchestrator agent or human]` |
| Version | `[orchestration plan version]` |
| Created | `[ISO 8601 timestamp]` |
| Updated | `[ISO 8601 timestamp]` |

## 2. Acceptance Criteria

- [ ] `[criterion 1]`
- [ ] `[criterion 2]`
- [ ] `[criterion 3]`

## 3. Non-Goals

- `[non-goal 1]`
- `[non-goal 2]`

## 4. Lane Definitions

### Lane [lane-id-1]

| Attribute | Value |
|-----------|-------|
| Name | `[lane name]` |
| Owner | `[team or agent owner]` |
| Domain | `[frontend / backend / infra / docs / QA / ...]` |
| Quality profile | `[lean / standard / heavy]` |
| Dependencies | `[lane IDs this lane depends on]` |
| Stage order | `[plan → implement → review → verify → integrate]` |

**Inputs:** `[artifacts this lane consumes]`

**Outputs:** `[artifacts this lane produces]`

**Write scope:** `[files or modules the lane may modify]`

**Forbidden scope:** `[files or modules the lane must not modify]`

**Rollback criteria:** `[what triggers a rollback for this lane]`

**Council escalation allowed:** `[yes / no]`

### Lane [lane-id-2]

_(repeat the above block for each lane)_

---

## 5. Checkpoint Gates

Define gates per lane. Mark each gate as `required` (blocks advancement) or `optional` (warning only).

### Lane [lane-id-1] gates

| Stage | Gate ID | Level | Required? | Pass condition |
|-------|---------|-------|-----------|----------------|
| Plan | `[gate-id]` | `critical / warning / advisory` | `yes / no` | `[what constitutes pass]` |
| Implement | `[gate-id]` | `critical / warning / advisory` | `yes / no` | `[what constitutes pass]` |
| Review | `[gate-id]` | `critical / warning / advisory` | `yes / no` | `[what constitutes pass]` |
| Verify | `[gate-id]` | `critical / warning / advisory` | `yes / no` | `[what constitutes pass]` |
| Integrate | `[gate-id]` | `critical / warning / advisory` | `yes / no` | `[what constitutes pass]` |

### Lane [lane-id-2] gates

_(repeat for each lane)_

---

## 6. Cross-Lane Contracts

Describe shared interfaces, APIs, data contracts, or schema changes that multiple lanes touch.

| Contract | Owner Lane | Consumer Lane(s) | Interface Document |
|----------|------------|------------------|--------------------|
| `[contract name]` | `[lane-id]` | `[lane-id(s)]` | `[link to interface doc or spec]` |
| `[contract name]` | `[lane-id]` | `[lane-id(s)]` | `[link to interface doc or spec]` |

---

## 7. Checkpoint Log

Update this log as gates are run.

| Timestamp | Lane | Stage | Gate ID | Status | Evidence | Decision |
|-----------|------|-------|---------|--------|----------|----------|
| `[ISO 8601]` | `[lane-id]` | `[plan]` | `[gate-id]` | `[pass/fail/warn/blocked]` | `[command output or report path]` | `[advance/block/rework/escalate]` |
| `[ISO 8601]` | `[lane-id]` | `[implement]` | `[gate-id]` | `[pass/fail/warn/blocked]` | `[command output or report path]` | `[advance/block/rework/escalate]` |

---

## 8. Council Escalation Notes

Used when a checkpoint gate is escalated via `skills/agents/quality-council/SKILL.md`.

### Escalation [ID]

| Field | Value |
|-------|-------|
| Date | `[ISO 8601]` |
| Lane | `[lane-id]` |
| Stage | `[stage where escalation occurred]` |
| Issue | `[one-line summary of the deadlock]` |
| Writer | `[agent or role]` |
| Critic | `[agent or role]` |
| Verifier | `[agent or role]` |
| Writer response | `[fix applied or deliberate deferral]` |
| Critic findings | `[severity-ranked findings]` |
| Verifier decision | `[Release / Release with reservations / Request revision / Escalate]` |
| Verdict rationale | `[why this verdict is appropriate]` |
| Residual risk | `[any unremediated risk after council]` |

### Escalation [ID]

_(repeat as needed)_

---

## 9. Checkpoint Snapshot (Stop / Resume)

Fill this when pausing a lane. Used to resume later.

| Field | Value |
|-------|-------|
| Snapshot ID | `[unique-snapshot-id]` |
| Sprint ID | `[sprint-identifier]` |
| Lane ID | `[lane-id]` |
| Paused at stage | `[plan / implement / review / verify / integrate]` |
| Last gate completed | `[gate-id]` |
| Incomplete gates | `[list of gates not yet passed]` |
| Artifacts produced | `[list of artifact paths or hashes]` |
| Open blockers | `[items blocking advancement]` |
| Next action | `[what the lane should do on resume]` |
| Council notes | `[any escalated items cross-referenced]` |
| Snapshot taken | `[ISO 8601]` |

---

## 10. Rollback Plan

| Lane | Rollback Trigger | Rollback Action | Rollback Owner |
|------|------------------|-----------------|----------------|
| `[lane-id]` | `[what triggers rollback]` | `[revert commands or steps]` | `[team or agent]` |
| `[lane-id]` | `[what triggers rollback]` | `[revert commands or steps]` | `[team or agent]` |

---

## 11. Sprint Summary

Fill after all lanes complete or stop.

| Metric | Value |
|--------|-------|
| Sprint ID | `[sprint-identifier]` |
| Goal achieved? | `[yes / partial / no]` |
| Lanes planned | `[count]` |
| Lanes passed | `[count]` |
| Lanes failed / blocked | `[count]` |
| Gates total | `[count]` |
| Gates passed | `[count]` |
| Gates failed / blocked | `[count]` |
| Gates skipped | `[count]` |
| Council escalations | `[count]` |
| Stop/resume events | `[count]` |
| Residual risks | `[list risks]` |
| Follow-up tasks | `[task descriptions with owners]` |

**Validation commands run:**

- `validate-all`: `[pass / fail / not run]`
- `quality-engine`: `[pass / fail / not run]`
- `validate:traceability`: `[pass / fail / not run]`
- `validate:markdown-links`: `[pass / fail / not run]`
- `validate:secrets`: `[pass / fail / not run]`

---

## 12. Handoff

Use for continued orchestration in a new agent session.

- **Context:** `[sprint goal, lane status, next actions]`
- **Files touched:** `[all files modified across all lanes]`
- **Decisions:** `[key decisions and rationale]`
- **Risks:** `[residual risks and deferrals]`
- **Verification:** `[highest-level validation summary]`

---

*Template version 2.5.0 — Advanced Orchestration*
