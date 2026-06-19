# Vibe Coding OS Proficiency Path

## Purpose

Define a four-level progression from casual Vibe Coding OS user to expert orchestrator. Each level builds on the previous one, adding new capabilities, deeper automation discipline, and greater team-scale orchestration skill.

## How to use

- Read the full path once to understand the progression.
- Determine your current level using `commands/vibe-proficiency.md` or by reviewing the criteria below.
- Focus on mastering your current level before advancing.
- Reference this document when designing onboarding plans or training materials.

---

## Level 1: Vibe Basics

### Description

You can use Vibe Coding OS to complete small, independent coding tasks with AI assistance. You understand the repository layout and can run basic commands.

### Markers

- Can read and follow `CLAUDE.md` and `AGENTS.md` instructions.
- Knows where skills, commands, and templates live.
- Can run `vibe-init` to orient a new session.
- Uses basic commands: `vibe-spec`, `vibe-implement`, `vibe-review`.
- Understands the concept of skill loading and command execution.
- Can create a simple pull request with one focused change.

### What you can do

- Complete a bounded coding task with clear requirements in a single agent pass.
- Follow the skill-discovery loop in `skills/meta/using-vibe-coding-os/SKILL.md`.
- Use templates for specs, plans, and reviews.
- Self-review your diff before submission.

### Typical failure modes at this level

- Skipping spec/plan for work that needs it.
- Loading too many skills at once, causing context overload.
- Not running validation before claiming completion.
- Copying upstream content without attribution checks.

---

## Level 2: Prompt Engineering with Skills

### Description

You write and compose skills effectively. You understand skill design, composability, and the RED-GREEN-REFACTOR testing loop. You can craft targeted instructions that shape agent behavior predictably.

### Markers

- Has written at least three original skills using `vibe-write-skill`.
- Understands the composability sections (Works with, Conflicts with, Depends on).
- Can design a skill that survives stacked pressure testing.
- Uses skill bundles from `registry/bundles.json` for domain work.
- Can run the full RED-GREEN-REFACTOR loop from `skills/meta/writing-skills/SKILL.md`.
- Knows the maturity-level convention and can assess a skill's stability.

### What you can do

- Write a skill that corrects a specific agent behavior failure observed in the wild.
- Test a skill under time pressure, sunk cost, and authority rationalizations.
- Compose three or more skills into a coherent workflow without loading contradictory guidance.
- Audit existing skills for token budget, keyword coverage, and format compliance.
- Design skills that work across multiple agent harnesses (portable skills).

### Typical failure modes at this level

- Writing skills without first observing the failure they should prevent.
- Padding skills with guidance for hypothetical cases instead of observed failures.
- Creating duplicate skills instead of aligning aliases.
- Letting frequently-loaded skills bloat the context token budget.
- Copying upstream skill text instead of writing original procedure.

---

## Level 3: Agentic Engineering with Full Workflow

### Description

You practice disciplined agentic engineering: spec-driven development, TDD, checkpoint gates, and subagent delegation. You treat AI-assisted development as engineered craft, not prompting luck.

### Markers

- Uses the full spec-driven lifecycle: constitution → specify → plan → tasks → implement.
- Runs checkpoint validation before implementation begins (`vibe-checkpoints`).
- Practices TDD or equivalent test-first discipline for behavior changes.
- Delegates bounded subtasks to subagents with clear sandbox scoping.
- Uses the SuperAgent orchestrator pattern for multi-subtask work.
- Integrates subagent output with deliberate review and cross-task validation.

### What you can do

- Decompose a complex task into a task graph with dependencies and parallel lanes.
- Write scoped subagent briefs with read-only zones, write zones, and forbidden zones.
- Track lifecycle states (queued → planning → executing → reviewing → merging → complete).
- Integrate output from multiple subagents and resolve cross-task conflicts.
- Apply the SuperAgent pattern: decompose, assign, monitor, aggregate, validate.
- Run the full validation suite across integrated changes, not just per-subtask gates.
- Retrospect orchestration quality and tune future decomposition.

### Typical failure modes at this level

- Decomposing too finely, creating coordination overhead that exceeds parallelism gains.
- Assigning overlapping write zones that force integration conflicts.
- Trusting subagent output without independent review.
- Letting the orchestrator become a blocking bottleneck.
- Skipping cross-subtask integration validation.
- Adding runtime features (daemon, scheduler) that violate the no-runtime constraint.

---

## Level 4: Orchestration with Multi-Agent Teams

### Description

You design and conduct multi-agent teams for large, risky, or cross-domain work. You choose the right orchestration pattern for each situation: fan-out/fan-in, pipeline, supervisor-with-reviewer, producer-consumer, or hierarchical delegation.

### Markers

- Can design a team architecture with clear roles, handoffs, and verification lanes.
- Uses progressive disclosure: gives each worker only the context they need.
- Applies adaptive flow to decide when ceremony is justified vs. when to keep it light.
- Runs dry-run validation before spawning agents to confirm task boundaries.
- Conducts a with-vs-without comparison: did the team lower risk or only add ceremony?
- Uses the full hook pattern taxonomy for lifecycle automation.
- Can combine SuperAgent orchestration with team-agent patterns for very large tasks.

### What you can do

- Choose the right orchestration pattern from: fan-out/fan-in, pipeline, supervisor-with-reviewer, producer-consumer, hierarchical delegation.
- Design a cross-domain team with specialized agents (researcher, implementer, reviewer, tester).
- Run a quality council with independent writer, critic, and verifier roles.
- Apply hook patterns (pre/post command hooks, session lifecycle hooks, workflow phase hooks, verification hooks) for automation without runtime engines.
- Conduct orchestration retrospectives and tune patterns for future work.
- Mentor Level 1–3 users on proper skill and workflow usage.

### Typical failure modes at this level

- Using a team when the task fits in one context window.
- Creating roles that duplicate each other and generate noise.
- Reviewers approving from the same context as the author.
- Handoffs that omit validation status.
- Documenting runtime features as if Vibe Coding OS can enforce them.
- Over-engineering orchestration for simple, well-understood tasks.

---

## Progression rules

1. **Do not skip levels.** Each level's discipline is prerequisite for the next. Jumping to Level 4 without Level 2's skill-writing discipline or Level 3's checkpoint discipline produces unreliable output.
2. **Level regression is normal.** Returning to a lower-level workflow for a simple task is not failure — it is proportional tool choice.
3. **Assessment is self-directed.** Use `commands/vibe-proficiency.md` to assess your current level honestly. Re-assess after significant new experience.
4. **Teach what you learn.** Level 3 and 4 practitioners should mentor lower-level users through reviews, skill audits, and orchestration retrospectives.
5. **Reference this path in session planning.** When starting a new task, reference this proficiency path to choose the right workflow depth.

## Related resources

- `skills/meta/using-vibe-coding-os/SKILL.md` — skill selection and bundle activation, annotated with level-appropriate guidance.
- `CLAUDE.md` — repo-level instructions, now includes proficiency-level awareness.
- `commands/vibe-proficiency.md` — entry command for determining current proficiency level.
- `skills/meta/writing-skills/SKILL.md` — maturity-level guidelines for skill authors.
- `skills/core/superagent-orchestration/SKILL.md` — expanded orchestration patterns for Level 3 and Level 4.
- `docs/workflows/hook-patterns.md` — general hook pattern taxonomy for Level 4 lifecycle automation.
