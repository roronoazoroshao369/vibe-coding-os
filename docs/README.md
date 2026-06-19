# Documentation Map

> **Workflow contract first. Runtime optional. Human intent stays sovereign.**

Use this page as the navigation hub for Vibe Coding OS documentation.

---

## Start here

- [`FIRST-WORKFLOW.md`](FIRST-WORKFLOW.md) — complete one `spec → plan → implement → review → verify` workflow.
- [`QUICKSTART.md`](QUICKSTART.md) — tool-specific setup for Claude Code, Codex CLI, Cursor, and similar assistants.
- [`TUTORIAL.md`](TUTORIAL.md) — 15-minute zero-to-workflow walkthrough.
- [`../INSTALL.md`](../INSTALL.md) — installation options: plugin, clone, CLI, zero-runtime, optional runtime.
- [`../examples/`](../examples/) — complete example workflows.

---

## Core workflow contract

- [`workflows/core-vs-optional-runtime.md`](workflows/core-vs-optional-runtime.md) — the boundary between markdown-first core and opt-in runtime.
- [`quality-shield.md`](quality-shield.md) — Quality Shield canonical guide and deliverable audit.
- [`expert-mode.md`](expert-mode.md) — Expert Mode escalation guide for adversarial review, critique passes, quality packs, and multi-agent review.
- [`smart-adapt.md`](smart-adapt.md) — Smart Adapt guide for model-adaptive quality (v1.9).
- [`quality-engine-guide.md`](quality-engine-guide.md) — Quality Engine guide for orchestrated quality gates, reports, and fix recommendations (v2.0).
- [`model-aware-config-guide.md`](model-aware-config-guide.md) — Model-Aware Config guide for model-capability and task-risk based Quality Engine configuration (v2.1).
- [`quality-telemetry-guide.md`](quality-telemetry-guide.md) — Quality Telemetry guide for local event emission, session metrics, and trend reports (v2.2).
- [`specs/README.md`](specs/README.md) — spec-driven development docs.
- [`workflows/spec-driven-development.md`](workflows/spec-driven-development.md) — constitution → specify → plan → tasks → implement.
- [`workflows/real-engineering-skills-workflow.md`](workflows/real-engineering-skills-workflow.md) — practical engineering-agent workflow.
- [`workflows/superpowers-inspired-workflow.md`](workflows/superpowers-inspired-workflow.md) — composable skill methodology adaptation.
- [`skill-decision-guide.md`](skill-decision-guide.md) — map problems to skills.

---

## Installation and tool adapters

- [`../INSTALL.md`](../INSTALL.md) — full install guide.
- [`../adapters/compatibility-matrix.md`](../adapters/compatibility-matrix.md) — compatibility across agent tools.
- [`../adapters/claude-code/README.md`](../adapters/claude-code/README.md) — Claude Code usage.
- [`../adapters/codex/README.md`](../adapters/codex/README.md) — Codex CLI usage.
- [`../adapters/cursor/README.md`](../adapters/cursor/README.md) — Cursor usage.

---

## Skills, commands, and templates

- [`CONTRIBUTING-SKILLS.md`](CONTRIBUTING-SKILLS.md) — contribute skills, commands, and templates.
- [`SKILL-PACKS.md`](SKILL-PACKS.md) — curated skill packs.
- [`skill-packs/`](skill-packs/) — pack-specific docs.
- [`../skills/`](../skills/) — reusable operating procedures.
- [`../commands/`](../commands/) — reusable command prompts.
- [`../templates/`](../templates/) — templates for specs, plans, tasks, reviews, memory, team orchestration, hooks, and runtime configs.
  - **Specs:** [`spec-template.md`](../templates/spec-template.md), [`brownfield-spec-template.md`](../templates/brownfield-spec-template.md), [`hook-spec-template.md`](../templates/hook-spec-template.md)
  - **Planning:** [`plan-template.md`](../templates/plan-template.md), [`implementation-brief-template.md`](../templates/implementation-brief-template.md)
  - **Tasks:** [`tasks-template.md`](../templates/tasks-template.md), [`task-template.md`](../templates/task-template.md)
  - **ADR/architecture:** [`adr-template.md`](../templates/adr-template.md), [`architecture-review-template.md`](../templates/architecture-review-template.md)
  - **Review:** [`review-template.md`](../templates/review-template.md), [`spec-audit-template.md`](../templates/spec-audit-template.md), [`integrator-review-template.md`](../templates/integrator-review-template.md)
  - **Quality Shield:** [`quality-rubric.md`](../templates/quality-rubric.md), [`quality-contract.md`](../templates/quality-contract.md), [`code-context-pack-template.md`](../templates/code-context-pack-template.md), [`self-review-checklist.md`](../templates/self-review-checklist.md), [`quality-scorecard.md`](../templates/quality-scorecard.md), [`quality-scorecard-session.md`](../templates/quality-scorecard-session.md)
  - **Team orchestration:** [`team-spec-template.md`](../templates/team-spec-template.md), [`team-run-output-template.md`](../templates/team-run-output-template.md), [`team-spec-template.json`](../templates/team-spec-template.json), [`claude-subagent-role-architect.md`](../templates/claude-subagent-role-architect.md), [`claude-subagent-role-attribution-auditor.md`](../templates/claude-subagent-role-attribution-auditor.md), [`claude-subagent-role-implementer.md`](../templates/claude-subagent-role-implementer.md), [`claude-subagent-role-memory-summarizer.md`](../templates/claude-subagent-role-memory-summarizer.md), [`claude-subagent-role-reviewer.md`](../templates/claude-subagent-role-reviewer.md), [`claude-subagent-role-tester.md`](../templates/claude-subagent-role-tester.md)
  - **Memory:** [`memory-entry-template.md`](../templates/memory-entry-template.md), [`session-summary-template.md`](../templates/session-summary-template.md), [`memory-privacy-review-template.md`](../templates/memory-privacy-review-template.md), [`memory-retrieval-template.md`](../templates/memory-retrieval-template.md)
  - **Handoff/context:** [`handoff-template.md`](../templates/handoff-template.md), [`context-injection-template.md`](../templates/context-injection-template.md)
  - **Reference:** [`upstream-audit-template.md`](../templates/upstream-audit-template.md), [`reference-scorecard-template.md`](../templates/reference-scorecard-template.md)
  - **Diagnostics:** [`diagnosis-template.md`](../templates/diagnosis-template.md), [`prototype-report-template.md`](../templates/prototype-report-template.md)
  - **ROI/metrics:** [`roi-metrics-template.md`](../templates/roi-metrics-template.md)
  - **Runtime:** [`runtime-config-template.json`](../templates/runtime-config-template.json)

---

## Optional runtime

The runtime is an opt-in companion for local JSON state. It is not required for the core workflow.

- [`RUNTIME-GUIDE.md`](RUNTIME-GUIDE.md) — getting started with runtime.
- [`workflows/optional-runtime-architecture.md`](workflows/optional-runtime-architecture.md) — architecture and boundaries.
- [`workflows/runtime-install.md`](workflows/runtime-install.md) — runtime installer.
- [`workflows/runtime-daemon.md`](workflows/runtime-daemon.md) — opt-in daemon.
- [`workflows/runtime-mcp-server.md`](workflows/runtime-mcp-server.md) — MCP server.
- [`workflows/runtime-vector-memory.md`](workflows/runtime-vector-memory.md) — vector memory.
- [`workflows/runtime-team-runner.md`](workflows/runtime-team-runner.md) — tmux team runner.

---

## Trust, validation, and security

- [`DASHBOARD.md`](DASHBOARD.md) — project health, inventory, validation status.
- [`SECURITY-MODEL.md`](SECURITY-MODEL.md) — trust boundaries and threat model.
- [`support-matrix.md`](support-matrix.md) — support and compatibility matrix.
- [`release-checklist.md`](release-checklist.md) — release validation checklist.
- [`RELEASE-PACKAGING.md`](RELEASE-PACKAGING.md) — release tagging and packaging workflow.
- [`UPSTREAM_ADOPTION_POLICY.md`](UPSTREAM_ADOPTION_POLICY.md) — how upstream ideas are studied safely.
- [`eval-scenarios.md`](eval-scenarios.md) — behavioral evaluation scenarios.

---

## Reference intelligence

- [`../references/`](../references/) — source docs, mappings, feature maps, and audit changelogs.
- [`../references/index.json`](../references/index.json) — source index.
- [`../references/upstream-audit-workflow.md`](../references/upstream-audit-workflow.md) — repeatable upstream audit loop.
- [`../ATTRIBUTIONS.md`](../ATTRIBUTIONS.md) — attribution register.
- [`../NOTICE.md`](../NOTICE.md) — notice and licensing policy.

---

## Vietnamese / Tiếng Việt

- [`vi/index.md`](vi/index.md) — tổng quan, quick start, feature index, glossary tiếng Việt.
- [`vi/FIRST-WORKFLOW.md`](vi/FIRST-WORKFLOW.md) — workflow đầu tiên bằng tiếng Việt.
- [`vi/TUTORIAL.vi.md`](vi/TUTORIAL.vi.md) — tutorial 15 phút.
- [`vi/skills-and-commands.md`](vi/skills-and-commands.md) — commands, skills, agent roles, memory skills, guardrails, combo recipes.
- [`vi/folders-and-workflows.md`](vi/folders-and-workflows.md) — map thư mục và workflow thường dùng.
- [`vi/strategy-and-roadmap.md`](vi/strategy-and-roadmap.md) — status review, metrics, roadmap.

---

## Maintainers and contributors

- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — contribution guide.
- [`CONTRIBUTING-SKILLS.md`](CONTRIBUTING-SKILLS.md) — skill/command/template contribution workflow.
- [`ROADMAP-STATUS.md`](ROADMAP-STATUS.md) — version progress and roadmap status.
- [`releases/`](releases/) — per-version release notes.
- [`reports/`](reports/) — generated and historical reports.
- [`../CHANGELOG.md`](../CHANGELOG.md) — version history.

---

## Command location rule

When a doc says to run framework validation (`npm run validate`, `npm run validate:all`, `npm link`), run it in the **Vibe Coding OS repo**.

When a doc says to initialize or work on your app (`vibe init <tool>`, `vibe doctor --project .`, app tests/lint/typecheck), run it in the **target project**.
