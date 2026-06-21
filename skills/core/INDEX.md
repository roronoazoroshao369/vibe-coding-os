---
name: skills-core-index
version: 1.0.0
introduced_in: v2.16.0
last_reviewed: 2026-06-21
category: meta
tags:
  - index
  - navigation
status: stable
---

# Skills Index — `skills/core/`

The `skills/core/` directory contains **88 reusable skills** organized by lifecycle stage.
This index groups them by purpose to help you find the right skill quickly.

> **Count**: 88 skills in 8 lifecycle groups. Use `node scripts/skill-content-search.mjs <keyword>` to find by capability.

---

## Plan & Specify (19 skills)

- **acceptance-criteria** — Write observable, testable acceptance criteria that connect intent to verification, so
- **architecture-decision-records** — Capture important technical decisions, tradeoffs, and consequences in small ADRs.
- **brainstorming** — Explore intent, constraints, options, and open questions before committing to a design or code path.
- **brownfield-spec-enhancement** — Apply spec discipline to existing systems: capture current behavior, define desired
- **clarify-before-code** — Prevent wasted implementation by resolving ambiguity before edits.
- **code-context-pack** — Assemble a focused context pack before writing code so the agent works from
- **context-policy** — Control what context enters and leaves the agent's working window through policy-based rules
- **context-rich-implementation** — Assemble enough verified context before coding that an executor can finish a task in one pass
- **crash-proof-planning** — Ensure plans survive context resets, agent handoffs, and session interruptions by using a
- **executing-plans** — Carry out an accepted plan in small, reversible steps while keeping status, tests, and scope visible.
- **improve-codebase-architecture** — Improve architecture deliberately by finding high-leverage seams, simplifying concepts, and preserving behavior.
- **plan-driven-execution** — Convert a spec or task into small ordered implementation steps.
- **plan-from-spec** — Translate an agreed specification into a concrete, verifiable implementation plan that
- **prd-from-context** — Turn existing conversation and repository context into a concise PRD without inventing new requirements.
- **prompt-architecture** — Provide a structural recipe for authoring multi-section prompts (Persona, Context, Constraints, Toolset, Output Schema, 
- **spec-first-development** — Turn intent into a compact specification before non-trivial code changes.
- **task-breakdown-from-plan** — Decompose an implementation plan into small, reviewable, independently grabbable tasks
- **writing-plans** — Turn an approved spec or clear request into an executable, reviewable plan with file targets, risks, and checks.
- **zoom-out-system-context** — Pause local edits and explain the broader system, seams, risks, and options before architecture-sensitive work.

## Build & Implement (10 skills)

- **adaptive-flow** — Pick the lightest useful version of the `Intent → Spec → Plan → Implement → Test → Review →
- **adaptive-prompt-selection** — Automatically classify a task into a type (feature, bugfix, refactor, security, migration) and select the most relevant 
- **claude-code-hooks-pack** — Provide a declarative pattern for authoring `.claude/settings.json` hooks (`PreToolUse`, `PostToolUse`, `UserPromptSubmi
- **creative-parallel-exploration** — Explore multiple candidate approaches to a problem in parallel, compare them against
- **grill-user-before-building** — Interview the user until goals, constraints, risks, and acceptance criteria are explicit before implementation.
- **orchestration-workflows** — Define and execute multi-stage development workflows with quality gates at each stage, so complex work moves through exp
- **subagent-driven-development** — Use separate agent passes or delegated workers for bounded subtasks without losing ownership of integration, review, and
- **superagent-orchestration** — Coordinate a supervising orchestrator agent that decomposes complex tasks, assigns bounded work to worker sub-agents, mo
- **team-agent-orchestration** — Design and coordinate a temporary agent team for large or risky work without turning Vibe Coding OS into a runtime. Use 
- **triage-workflow** — Classify incoming issues or tasks into clear next states with evidence and next action.

## Test & Review (17 skills)

- **adversarial-code-review** — Run a red-team review of a code change that actively looks for ways the patch can be wrong, unsafe, insufficiently teste
- **checkpoint-validation** — Validate that each workflow phase (constitution, spec, plan, tasks, implementation) is
- **code-intelligence-review** — Produce a structure-aware code review by first building a lightweight code intelligence map — scope, call graph, data an
- **critique-pass-protocol** — Run a lightweight critic pass before final delivery. The pass challenges an artifact, summary, patch, or plan against th
- **incremental-review** — Re-review code efficiently after iterative changes by capturing a baseline of the previous review state and analysing on
- **quality-engine** — Run a configurable quality engine that executes relevant quality gates on a task or repository and returns structured re
- **quality-execution-contract** — Force explicit intent declaration before any code edit. The contract makes the agent
- **quality-shield** — Provide a disciplined, repeatable process for making safe changes to existing code. The workflow ensures every productio
- **quality-telemetry** — Collect local-first quality telemetry from quality engine runs, sessions, and reviews to support trend analysis, model c
- **receiving-code-review** — Turn review feedback into a prioritized response plan, fix real issues, and preserve explicit decisions for deferred ite
- **requesting-code-review** — Package a change for useful review by making scope, intent, diff, risks, and verification evidence easy to inspect.
- **requirements-quality-checklist** — Validate the quality of written requirements before implementation — treat the spec as
- **review-before-merge** — Catch correctness, maintainability, security, and attribution issues before merge by reviewing the change along two inde
- **secure-coding-checklist** — Provide an OWASP-mapped three-layer checklist (input validation at trust boundary, output encoding at sink boundary, ide
- **self-review-before-response** — Audit your own diff like a strict reviewer before claiming a task is done.
- **setup-pre-commit-quality-gates** — Define lightweight pre-commit or pre-merge checks that catch common mistakes without adding brittle dependencies.
- **test-driven-development** — Use a red-green-refactor loop for behavior changes and bug fixes.

## Debug & Fix (4 skills)

- **bug-fix-lifecycle** — Drive a bug from report to confirmed resolution through five TDD-anchored phases: **Assess → RED (failing test) → GREEN 
- **disciplined-diagnosis** — Debug by reproducing, isolating, hypothesizing, testing, and documenting evidence before patching.
- **systematic-debugging** — Diagnose failures by forming hypotheses, collecting evidence, and changing one meaningful variable at a time.
- **test-fixture-library** — Centralize test data as JSON files in `tests/fixtures/` so security and validation tests share input corpora, can be reg

## Deploy & Operate (4 skills)

- **cicd-integration** — Automate quality verification in CI/CD pipelines so every pull request runs `validate:all`, emits quality telemetry, and
- **git-guardrails** — Protect repository history and user work by treating destructive git operations as high-risk.
- **prototype-before-commitment** — Build or describe a throwaway experiment to reduce uncertainty before committing to architecture or UI direction. The ki
- **using-git-worktrees** — Isolate risky or parallel work so multiple branches can be developed, tested, or reviewed without corrupting the main ch

## Maintain & Evolve (5 skills)

- **deprecate-skill** — Provide a safe, auditable, append-only workflow for retiring skills. Deprecation is not deletion — it is the visible, ti
- **deprecation-migration** — Manage the lifecycle of deprecating skills, commands, templates, registry entries, or any Vibe Coding OS artifact — dist
- **docs-author** — The five-section structure (Purpose, When to use, Workflow, Outputs, Failure modes) is the **minimum viable structure** 
- **grill-with-docs** — Align with the user while updating durable project context, domain language, and ADR candidates.
- **safe-refactor** — Provide a 5-phase protocol for refactoring existing code without breaking behavior. Covers the full lifecycle: **charact

## Meta (Skills & Process) (11 skills)

- **doubt-driven-development** — Challenge in-progress decisions before they harden into code, surfacing uncertainty, anti-rationalizations, and loading-
- **external-skill** — Example skill demonstrating the `isolated` sandbox-marker level. Use as a template when authoring third-party or marketp
- **goal-driven-execution** — Turn an imperative instruction ("fix the bug", "make it faster", "add the export
- **install-skill** — Pick a skill from the curated registry and copy it into your project (or any target directory) so you can use it without
- **lessons-learned-db** — Create and use a structured record of coding mistakes and fixes so agents can learn from local project history. The less
- **model-weakness-memory** — Track known failure patterns for different model types and auto-inject relevant checks before tasks. This skill builds a
- **multi-repo-learning** — Enable teams to share sanitized, portable lessons across repositories so prevention rules, fix patterns, and root-cause 
- **skill-content-search** — Quickly locate the right skill, command, template, or doc when the repo has grown past the point where you can remember 
- **skill-deps-graph** — Map how skills reference each other so you can identify orphan skills (no incoming refs), find foundational skills (most
- **task-state-tracking** — Keep task lists executable by tracking each task's current state, dependencies, and next
- **writing-skills** — Provide a structural recipe for authoring new skills in the `skills/` tree. The recipe enforces section contracts (Purpo

## Other / Cross-cutting (18 skills)

- **dependency-aware-task-ordering** — Order tasks by their real dependencies and identify which tasks can safely run in
- **finishing-a-development-branch** — Close a branch cleanly with verified status, review readiness, attribution hygiene, memory notes, and clear next actions
- **guard-bypass-protocol** — Autonomous adversarial prompt engineering agent that iteratively attempts to bypass AI model guardrails, safety filters,
- **issue-slicing** — Break a PRD or plan into small vertical issues that independent agents can grab safely.
- **model-aware-config** — Select model-aware quality packs and checks by combining the current `model_id`, the task type, stack/domain signals, th
- **observability-design** — Design instrumentation **before shipping a feature** by starting from the questions on-call will ask, then deriving the 
- **project-constitution** — Define a short, durable set of governing principles that constrain every later phase of
- **red-team-bypass** — Document the patterns and counter-measures for adversarial prompt injection, jailbreak attempts, and model evasion techn
- **sandbox-marker** — Mark skills, commands, or templates that load external or untrusted content so reviewers can audit the trust level at a 
- **sandboxed-execution** — Define explicit work-scoping boundaries for sub-agents or delegated passes so each worker operates within a declared san
- **shared-domain-language** — Keep a small, durable vocabulary that makes humans, agents, docs, and code use the same domain terms — including an expl
- **threat-model-driven-security** — Design security **before building** by mapping trust boundaries, applying the STRIDE 6-letter lens, and writing abuse ca
- **upstream-intelligence-loop** — Turn high-signal public AI-coding repositories into maintainable local improvements without vendoring upstream code, pro
- **verification-before-completion** — Make completion claims only after relevant checks, review, and limitations are explicit.
- **verification-before-done** — Ensure completion claims are backed by evidence.
- **vertical-slicing** — Build features as **complete vertical slices** through every layer of the stack (DB → API → UI → tests) rather than hori
- **vibe-bootstrap** — Start a new Vibe Coding OS session with the right context, workflow, and safety rails.
- **what-before-how** — Keep the discipline of agreeing on user-visible behavior and acceptance criteria (the

---

## How to use this index

1. **Find a skill by stage**: scroll to the section that matches your current task.
2. **Find by capability**: use `node scripts/skill-content-search.mjs <keyword>`.
3. **Find by dependency**: use the skill-deps-graph skill to see how skills connect.

## Why 88 skills?

Vibe Coding OS is a **meta-framework**: each skill is a reusable pattern for a specific
quality or workflow concern. The breadth reflects the variety of failure modes AI agents
encounter — not duplication. If you find skills that overlap, propose a merge via a PR
that updates this index.

## Maintenance

This index is auto-generated from SKILL.md frontmatter and Purpose sections.
Re-generate with `node scripts/generate-skills-index.mjs` (see v2.16.0).
