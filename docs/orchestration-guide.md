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

## Anti-patterns to avoid

These anti-patterns come from observed failures in multi-agent orchestration. Inspired by `addyosmani/agent-skills` `references/orchestration-patterns.md` (MIT, verified 2026-06-20), adapted into Vibe Coding OS with original wording.

### A. Persona-calls-persona (subagent tree)

**Anti-pattern:** A persona's prompt or tool set instructs it to spawn another persona as a subagent to "consult on" or "delegate to".

**Why it fails:** Subagent spawning creates tree-shaped orchestration that is hard to reason about, hard to log, and often produces context loss between layers. The parent persona's context budget gets consumed by the subagent's overhead, and the subagent's output may not align with the parent's intent.

**Avoid by:** Keep orchestration in the orchestrator layer. A persona's `skills:` frontmatter should be leaf skills, not other personas. If a persona needs input from another domain, surface the question in the orchestrator, not via subagent delegation.

### B. Deep persona trees

**Anti-pattern:** Nested persona chains (persona → sub-persona → sub-sub-persona) more than 2 levels deep.

**Why it fails:** Each level adds context loss, latency, and coordination overhead. Errors compound across levels; the root cause is hard to identify.

**Avoid by:** Cap persona depth at 2 (orchestrator → specialist). If a specialist needs another specialist, route back through the orchestrator.

### C. Single-agent doing all perspectives

**Anti-pattern:** One agent tries to be planner + implementer + reviewer + tester + handoff.

**Why it fails:** Conflict of interest — the agent rationalizes its own work, skips its own critique, and produces less rigorous output. The "second pair of eyes" benefit of multi-agent is lost.

**Avoid by:** Use distinct agent roles with disjoint tool sets. Reviewer cannot edit code; implementer cannot mark done without reviewer sign-off.

### D. Orchestrator losing nuance to summarize-for-handoff

**Anti-pattern:** The orchestrator compresses all upstream output into a 1-paragraph "everything's good" summary before passing to the next stage.

**Why it fails:** Detail is lost. The downstream agent (or human) cannot make informed decisions from a "looks good" message. Critical risks get buried.

**Avoid by:** Pass upstream artifacts (review notes, verification reports, root cause) as-is. The orchestrator adds structure (gates, status) but does not summarize-away evidence.

### E. Sequential when parallel would help

**Anti-pattern:** Running independent stages sequentially (plan → review → implement → test) when plan+review could happen in parallel, or when independent test suites could run concurrently.

**Why it fails:** Wastes wall-clock time; feedback loops slow down by N× the serial latency.

**Avoid by:** Identify independent stages. Use `parallel: true` (or fan-out) for independent reviews/tests/implementations. Keep dependent stages sequential (a stage that consumes the previous stage's output).

### F. Mid-slice commits in a vertical slice workflow

**Anti-pattern:** A vertical slice (see `skills/core/vertical-slicing`) is split across multiple commits, with the working tree left mid-slice.

**Why it fails:** The slice is no longer atomic. Rollback is partial. Reviewers see incomplete work.

**Avoid by:** Commit the slice as a single atomic unit (impl + test + verify + spec). Do not commit mid-slice.

## Loading constraints (anti-pattern catalog)

| Anti-pattern | Why it fails | Avoid by |
| --- | --- | --- |
| Adding `doubt-driven-development` to a persona that spawns other personas | Doubt recurses; context budget blown | Invoke doubt at orchestration layer only |
| Using `grill-user-before-building` in CI/loop | No dialogue partner | Use `verification-before-done` instead |
| Using `vibe-deprecate` without a replacement | Users stranded | Always pair with a replacement or sunset path |
| Using `vibe-threat-model` after implementation | Misses design flaws | Threat model during design |
| Using `vibe-slice` with layer-only slices | Un-demoable code | Slice by outcome, not by layer |
| Using `vibe-observability` after the feature ships | Post-incident instrumentation misses the failure mode | Design questions before signals |
