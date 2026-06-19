# SuperAgent Orchestration

## Purpose

Coordinate a supervising orchestrator agent that decomposes complex tasks, assigns bounded work to worker sub-agents, monitors progress through lifecycle states, aggregates results, and validates the integrated output. The orchestrator owns the task graph, the context window, and the final quality gate.

## When to use

Use when a single agent pass cannot hold the full context, when independent subtasks can run in parallel under supervision, when work spans multiple domains requiring specialized reviewers, or when risk demands structured oversight with an explicit lifecycle. Skip for small tasks that fit in one context window or when the overhead of supervision outweighs the parallelism benefit.

## Inputs

- Complex task or goal too large for a single agent pass.
- Decomposable subtask boundaries and inter-subtask dependencies.
- Worker role definitions (researcher, implementer, reviewer, tester).
- Lifecycle state template and monitoring criteria.
- Integration and validation commands owned by the orchestrator.

## Workflow

### 1. Decompose

Analyze the main task into bounded, independently verifiable subtasks. Identify which subtasks are parallelizable, which depend on others, and which form the critical path. Record the task graph with explicit dependency edges.

### 2. Assign

For each subtask, write a scoped brief that includes:
- the subtask goal and acceptance criteria;
- read-only vs write-allowed file zones;
- known constraints, non-goals, and patterns to follow;
- the worker's handoff contract (what to return, how to report status);
- the worker's lifecycle expectation (this subtask's state will be reported back).

Assign writers (implementers) and reviewers (verifiers) as separate roles to maintain independent lanes.

### 3. Monitor lifecycle states

Track each subtask through a shared lifecycle:
- **queued** — accepted but not started.
- **planning** — the worker has received the brief and is exploring.
- **executing** — the worker is actively implementing.
- **reviewing** — the worker's output is under review by a separate reviewer or the orchestrator.
- **merging** — reviewed output is being integrated into the main branch or artifact.
- **complete** — integration and validation are done; the orchestrator has accepted the result.

Record state transitions and flag subtasks that stall in any state beyond a reasonable threshold.

### 4. Aggregate

As workers complete their subtasks, the orchestrator collects:
- changed files and diffs;
- review notes and blocker logs;
- validation results for each subtask's gates;
- handoff summaries from each worker.

The orchestrator merges non-conflicting changes, resolves integration conflicts, and re-runs cross-subtask validation.

### 5. Validate integrated result

Run the full validation suite across all integrated changes — not just per-subtask gates. Confirm that:
- acceptance criteria for the full task are met;
- no subtask reverted another's changes;
- attribution and reference mappings are consistent;
- the final artifact passes the same checks a single-pass implementation would.

### 6. Retrospect

Record what worked and what didn't in the orchestration: Were subtask boundaries well-chosen? Did any worker need rescoping mid-flight? Was the lifecycle tracking useful, or did it add ceremony? Use the retrospective to tune future orchestration.

## Orchestration patterns

Beyond the basic decompose-assign-monitor-aggregate flow, the SuperAgent pattern supports several concrete orchestration topologies. Choose the pattern that matches your task's dependency structure.

### Fan-out / fan-in

Use when a question or task must be applied across many independent areas: scanning multiple docs for a pattern, auditing all API endpoints, or gathering research from different domains.

- **Fan-out:** Deploy identical briefs to N workers, each responsible for a distinct slice (file, module, domain area).
- **Fan-in:** The orchestrator collects all N results, deduplicates, resolves contradictions, and produces a single synthesis.
- **Best for:** Parallel research, multi-file audits, cross-module consistency checks.

### Pipeline

Use when work flows through ordered stages, each stage consuming the previous stage's output.

- **Stage 1:** Researcher gathers context and produces findings.
- **Stage 2:** Planner consumes findings and produces a task graph.
- **Stage 3:** Implementer executes tasks in dependency order.
- **Stage 4:** Reviewer validates the integrated output.
- **Best for:** Spec-driven development, research-to-code pipelines, stage-gated workflows where each phase depends on the previous.

### Supervisor with reviewer

Use when work is high-risk and benefits from independent oversight by a separate lane.

- **Worker lane:** Implementers execute subtasks in parallel or sequence.
- **Supervisor lane:** An independent reviewer (or review council) examines each worker's output, flags issues, and sends back for rework.
- The orchestrator mediates between lanes, ensuring no worker self-approves.
- **Best for:** Security-sensitive changes, production deployments, multi-domain integrations where one domain cannot self-verify.

### Producer-consumer

Use when work items are produced asynchronously and processed by a consumer pool.

- **Producers:** Write bounded outputs (diffs, findings, artifacts) to a shared queue (a markdown log or issue tracker).
- **Consumers:** Pick up completed items, validate them, resolve conflicts, and integrate.
- The orchestrator monitors queue depth and producer/consumer health.
- **Best for:** Large-scale refactoring, migration projects where many files change independently, batch documentation updates.

### Choosing a pattern

| Task structure | Recommended pattern |
|---|---|
| Independent parallel work on distinct files/domains | Fan-out / fan-in |
| Ordered phases, each consuming prior output | Pipeline |
| High-risk work needing separate verification | Supervisor with reviewer |
| Async production and consumption of work items | Producer-consumer |
| Complex tasks with a mix of patterns | Composite (nest patterns: pipeline with fan-out stages) |

## Outputs

- Task graph with dependencies and lifecycle states.
- Per-subtask briefs and handoff summaries.
- Integrated artifact with cross-subtask validation results.
- Orchestration retrospective notes.

## Failure modes

- Decomposing too finely, creating coordination overhead that exceeds the parallelism benefit.
- Assigning overlapping write zones, forcing integration conflicts.
- Trusting worker output without independent review (reviewer lane is mandatory for write subtasks).
- Letting the orchestrator become a bottleneck — state checks should be light, not blocking.
- Tracking lifecycle states without acting on stalls or failures.
- Skipping cross-subtask integration validation, assuming per-subtask gates are sufficient.
- Adding orchestrator runtime features (daemon, scheduler, mailbox) that violate the no-runtime constraint.

## Verification checklist

- [ ] Task graph records subtask boundaries, dependencies, and parallel lanes.
- [ ] Each subtask has a scoped brief with read/write zones and handoff contract.
- [ ] Lifecycle states are defined and tracked (queued → planning → executing → reviewing → merging → complete).
- [ ] Reviewer lanes are independent from implementer lanes.
- [ ] Cross-subtask integration validation runs after all subtasks complete.
- [ ] Orchestration retrospective is recorded for future tuning.

## Related skills

- `skills/core/subagent-driven-development/SKILL.md` — base subagent delegation pattern that SuperAgent orchestration extends with explicit lifecycle and supervision.
- `skills/core/team-agent-orchestration/SKILL.md` — team-level orchestration with roles, handoffs, and verification lanes.
- `skills/core/sandboxed-execution/SKILL.md` — worker scoping and isolation discipline that complements orchestration.
- `skills/core/context-rich-implementation/SKILL.md` — context-rich brief pattern used for worker assignment.
- `commands/vibe-superagent.md` — command entry point for SuperAgent orchestration.
- `docs/workflows/team-agent-orchestration.md` — team orchestration workflow that SuperAgent orchestration can wrap for large tasks.

## Ghi chú tiếng Việt

Dùng orchestrator-agent cho tác vụ phức tạp: phân rã thành subtask nhỏ, giao việc kèm brief + phạm vi đọc/ghi, theo dõi vòng đời (queued → planning → executing → reviewing → merging → complete), tổng hợp kết quả, chạy kiểm thử tổng thể. Người điều phối (orchestrator) giữ task graph, context window, và quality gate cuối cùng. Không tạo runtime/daemon; tất cả là hướng dẫn markdown.
