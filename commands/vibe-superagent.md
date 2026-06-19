---
description: "Orchestrate a SuperAgent harness: decompose, assign, monitor lifecycle, aggregate, and validate integrated output."
---

# vibe-superagent

## Purpose

Act as the orchestrator agent for a complex task that exceeds a single context window or benefits from parallel, supervised sub-agents. Decompose the task, assign scoped briefs, track lifecycle states, aggregate results, and validate the integrated artifact.

## When to use

Use when the task is large enough that one agent pass cannot hold full context, when independent subtasks can run in parallel with separate review, or when structured orchestration reduces risk. Consider `vibe-team` for team-scale work with multiple roles; use `vibe-superagent` when one orchestrator directly manages workers with a shared lifecycle. Skip for tasks that fit in one context window or when the parallelism benefit is smaller than the orchestration overhead.

## Required inputs

- Task description, goal, and acceptance criteria.
- Known file boundaries and read/write constraints.
- Available worker roles and their capabilities.
- Validation gates for the final integrated artifact.

## Step-by-step behavior

### 1. Analyze and decompose

Read the full task. Identify subtask boundaries based on:
- file ownership — subtasks should own disjoint file sets where possible;
- domain separation — research, implementation, testing, review;
- dependency order — some subtasks must complete before others can start.

Produce a task graph with dependency edges, parallel groups, and estimated lifecycle state duration for each subtask.

### 2. Write per-subtask briefs

For each subtask, produce a brief containing:
- subtask ID and goal;
- acceptance criteria specific to this subtask;
- read-only file zones (files the worker may inspect);
- write-allowed file zones (files the worker may modify);
- side-effect declaration: what files, processes, or external systems this subtask touches;
- constraints, non-goals, patterns to follow;
- handoff contract: output format, validation commands to run, status to report.

### 3. Assign and launch

Dispatch each brief to the appropriate worker. Record the initial lifecycle state (queued → planning). Instruct the worker that file ownership is exclusive within their write zone and they must not edit outside it.

### 4. Monitor lifecycle

Track each subtask through:
- queued → planning (worker acked the brief)
- planning → executing (worker started implementation)
- executing → reviewing (worker submitted output; reviewer or orchestrator inspects)
- reviewing → merging (output accepted; integration begins)
- merging → complete (integration validated)

If any subtask stalls in a state for too long, intervene: rescope, reassign, or adjust the task graph.

### 5. Aggregate and integrate

Collect all completed subtask outputs. Reconcile file changes — no two subtasks should have modified the same file in conflicting ways. Run the integration validation suite across the merged artifact.

### 6. Run final validation

Execute full validation gates (lint, type check, tests, `npm run validate`) on the integrated result. Every gate must pass. If a gate fails, diagnose which subtask caused it and loop back to reviewing/merging for that subtask.

### 7. Report

Output:
- **Task graph**: the decomposition with lifecycle states.
- **Changes by subtask**: files touched, review decisions.
- **Validation results**: each gate, its status, and any iteration.
- **Orchestration notes**: what worked, what didn't, rescoping decisions.

## Outputs

- Decomposition task graph with lifecycle states.
- Per-subtask briefs and handoff summaries.
- Merged artifact with integration validation results.
- Orchestration retrospective notes.

## Stopping conditions

Stop and ask when subtask boundaries cannot be made disjoint, when dependency edges create a cycle, when no worker is available for a required role, or when integration conflicts cannot be resolved by the orchestrator alone.

## Verification checklist

- [ ] Task decomposition is complete with dependency edges and parallel lanes.
- [ ] Each subtask brief includes read/write zones, side-effect declaration, and handoff contract.
- [ ] Lifecycle states are tracked for all subtasks.
- [ ] A reviewer lane exists for every write subtask.
- [ ] Integration validation runs across the merged artifact.
- [ ] Final gates pass on the integrated result.

## Related skills/commands

- `skills/core/superagent-orchestration/SKILL.md` — skill that defines the orchestrator pattern.
- `skills/core/subagent-driven-development/SKILL.md` — base subagent delegation pattern.
- `skills/core/sandboxed-execution/SKILL.md` — worker scope isolation for safe delegation.
- `skills/core/team-agent-orchestration/SKILL.md` — team-level orchestration for larger efforts.
- `skills/core/context-rich-implementation/SKILL.md` — context-rich briefs for worker assignment.
- `commands/vibe-team.md` — team orchestration for multi-role work.
- `commands/vibe-subagents.md` — lightweight subagent delegation without lifecycle tracking.

## Handoffs / next-step suggestion

- Task graph is built but no workers assigned → brief each subtask and dispatch.
- Subtasks are executing → monitor lifecycle states; prepare integration step.
- All subtasks complete → run integration validation and report.
- Integration validation fails → diagnose the failing subtask and loop back.
- Everything green → record orchestration retrospective and close.

## Ghi chú tiếng Việt

Dùng lệnh này để điều phối SuperAgent: phân tích task lớn, chia subtask, viết brief cho từng worker, theo dõi vòng đời (queued → planning → executing → reviewing → merging → complete), tổng hợp, và kiểm thử tích hợp. Không chạy runtime hay daemon; chỉ dùng markdown guidance và orchestration kỷ luật.
