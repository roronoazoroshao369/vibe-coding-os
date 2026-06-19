# Feature to Local Files

This map shows where each reference feature is implemented or documented locally.

## Superpowers-inspired workflow phases

- Feature source: `references/sources/obra-superpowers.md`
- Local files:
  - `docs/workflows/superpowers-inspired-workflow.md`
  - `skills/meta/using-vibe-coding-os/SKILL.md`
  - `commands/vibe-init.md`

## Brainstorming

- Local files:
  - `skills/core/brainstorming/SKILL.md`
  - `skills/core/clarify-before-code/SKILL.md`
  - `commands/vibe-brainstorm.md`

## Git worktree isolation

- Local files:
  - `skills/core/using-git-worktrees/SKILL.md`
  - `commands/vibe-worktree.md`

## Writing and executing plans

- Local files:
  - `skills/core/writing-plans/SKILL.md`
  - `skills/core/executing-plans/SKILL.md`
  - `skills/core/plan-driven-execution/SKILL.md`
  - `commands/vibe-write-plan.md`
  - `commands/vibe-execute-plan.md`
  - `commands/vibe-plan.md`
  - `templates/plan-template.md`

## Subagent-driven development

- Local files:
  - `skills/core/subagent-driven-development/SKILL.md`
  - `commands/vibe-subagents.md`
  - `skills/agents/architect-agent/SKILL.md`
  - `skills/agents/implementer-agent/SKILL.md`
  - `skills/agents/reviewer-agent/SKILL.md`
  - `skills/agents/tester-agent/SKILL.md`

## Systematic debugging

- Local files:
  - `skills/core/systematic-debugging/SKILL.md`
  - `commands/vibe-debug.md`

## Verification before completion

- Local files:
  - `skills/core/verification-before-completion/SKILL.md`
  - `skills/core/verification-before-done/SKILL.md`
  - `commands/vibe-verify.md`

## Skill writing

- Local files:
  - `skills/meta/writing-skills/SKILL.md`
  - `commands/vibe-write-skill.md`
  - `registry/skills.json`

### Skill-testing methodology depth (Batch 8)

- Feature source: `references/sources/obra-superpowers.md`
- Local files:
  - `skills/meta/writing-skills/SKILL.md` (When-to-use vs how-to-use discipline section, Token-budget guidance section consolidation)

## Spec-driven development

- Feature doc: `references/features/spec-driven-development.md`
- Local files:
  - `templates/spec-template.md`
  - `templates/plan-template.md`
  - `skills/core/spec-first-development/SKILL.md`
  - `commands/vibe-spec.md`

## Persistent memory

- Feature doc: `references/features/persistent-memory.md`
- Local files:
  - `skills/memory/project-memory/SKILL.md`
  - `skills/memory/session-summarizer/SKILL.md`
  - `skills/memory/context-retrieval/SKILL.md`
  - `skills/memory/privacy-filter/SKILL.md`
  - `templates/memory-template.md`
  - `templates/memory-redaction-checklist.md`
  - `docs/memory-conventions.md`
  - `commands/vibe-memory.md`

## Skill orchestration

- Feature doc: `references/features/skill-orchestration.md`
- Local files:
  - `registry/skills.json`
  - `skills/core/vibe-bootstrap/SKILL.md`
  - `skills/meta/using-vibe-coding-os/SKILL.md`
  - `commands/vibe-init.md`
  - `CLAUDE.md`

## Multi-agent workflow

- Feature doc: `references/features/multi-agent-workflow.md`
- Local files:
  - `skills/core/subagent-driven-development/SKILL.md`
  - `commands/vibe-subagents.md`
  - `skills/agents/architect-agent/SKILL.md`
  - `skills/agents/implementer-agent/SKILL.md`
  - `skills/agents/reviewer-agent/SKILL.md`
  - `skills/agents/tester-agent/SKILL.md`

## Anti-overengineering

- Feature doc: `references/features/anti-overengineering.md`
- Local files:
  - `skills/prompts/anti-overengineering/SKILL.md`
  - `skills/prompts/karpathy-guardrails/SKILL.md`
  - `AGENTS.md`

## TDD loop

- Feature doc: `references/features/tdd-loop.md`
- Local files:
  - `skills/core/test-driven-development/SKILL.md`
  - `commands/vibe-implement.md`
  - `templates/task-template.md`

## Review before merge

- Feature doc: `references/features/review-before-merge.md`
- Local files:
  - `skills/core/requesting-code-review/SKILL.md`
  - `skills/core/receiving-code-review/SKILL.md`
  - `skills/core/review-before-merge/SKILL.md`
  - `commands/vibe-request-review.md`
  - `commands/vibe-receive-review.md`
  - `commands/vibe-review.md`
  - `commands/vibe-merge.md`
  - `templates/review-template.md`

### Two-axis spec-compliance enhancement (Batch 8)

- Feature source: `references/sources/mattpocock-skills.md`
- Local files:
  - `commands/vibe-request-review.md` (`--spec-compliance` flag)
  - `skills/agents/reviewer-agent/SKILL.md` (Spec compliance coverage section)

### Review depth levels and agent communication protocols (Batch 8)

- Feature source: `references/sources/yeachan-heo-oh-my-claudecode.md`
- Local files:
  - `skills/agents/reviewer-agent/SKILL.md` (Review depth levels: quick/standard/deep)
  - `skills/agents/implementer-agent/SKILL.md` (Communication protocol with reviewer)
  - `skills/agents/architect-agent/SKILL.md` (Escalation guidance)
  - `skills/agents/tester-agent/SKILL.md` (Test-strategy guidance, coverage expectations)
  - `docs/workflows/team-agent-orchestration.md` (Role-transition protocols)

## Finishing a development branch

- Local files:
  - `skills/core/finishing-a-development-branch/SKILL.md`
  - `commands/vibe-finish-branch.md`
  - `commands/vibe-merge.md`

## Upstream intelligence

- Feature doc: `references/upstream-audit-workflow.md`
- Local files:
  - `skills/core/upstream-intelligence-loop/SKILL.md`
  - `commands/vibe-upstream-sync.md`
  - `templates/upstream-audit-template.md`
  - `scripts/clone-upstreams.mjs`
  - `references/upstreams/README.md`


## mattpocock/skills features

### setup-per-repo-agent-config

- Skill: `skills/meta/setup-project-agent-skills/SKILL.md`
- Command: `commands/vibe-setup-skills.md`
- Feature doc: `references/features/agent-alignment.md`

### grill-me

- Skill: `skills/core/grill-user-before-building/SKILL.md`
- Command: `commands/vibe-grill-me.md`
- Feature doc: `references/features/agent-alignment.md`

### grill-with-docs

- Skill: `skills/core/grill-with-docs/SKILL.md`
- Command: `commands/vibe-grill-with-docs.md`
- Feature doc: `references/features/agent-alignment.md`

### shared-domain-language

- Skill: `skills/core/shared-domain-language/SKILL.md`
- Command: `commands/vibe-grill-with-docs.md`
- Feature doc: `references/features/shared-domain-language.md`

### architecture-decision-records

- Skill: `skills/core/architecture-decision-records/SKILL.md`
- Command: `commands/vibe-grill-with-docs.md`
- Feature doc: `references/features/architecture-decision-records.md`

### diagnose

- Skill: `skills/core/disciplined-diagnosis/SKILL.md`
- Command: `commands/vibe-diagnose.md`
- Feature doc: `references/features/diagnosis-loop.md`

### tdd

- Skill: `skills/core/test-driven-development/SKILL.md`
- Command: `commands/vibe-tdd.md`
- Feature doc: `references/features/diagnosis-loop.md`

### to-prd

- Skill: `skills/core/prd-from-context/SKILL.md`
- Command: `commands/vibe-to-prd.md`
- Feature doc: `references/features/prd-from-context.md`

### to-issues

- Skill: `skills/core/issue-slicing/SKILL.md`
- Command: `commands/vibe-to-issues.md`
- Feature doc: `references/features/issue-slicing.md`

### triage

- Skill: `skills/core/triage-workflow/SKILL.md`
- Command: `commands/vibe-triage.md`
- Feature doc: `references/features/triage-workflow.md`

### improve-codebase-architecture

- Skill: `skills/core/improve-codebase-architecture/SKILL.md`
- Command: `commands/vibe-improve-architecture.md`
- Feature doc: `references/features/architecture-improvement.md`

### zoom-out

- Skill: `skills/core/zoom-out-system-context/SKILL.md`
- Command: `commands/vibe-zoom-out.md`
- Feature doc: `references/features/architecture-improvement.md`

### prototype

- Skill: `skills/core/prototype-before-commitment/SKILL.md`
- Command: `commands/vibe-prototype.md`
- Feature doc: `references/features/architecture-improvement.md`

### caveman

- Skill: `skills/prompts/compressed-technical-communication/SKILL.md`
- Command: `commands/vibe-caveman.md`
- Feature doc: `references/features/compressed-technical-communication.md`

### handoff

- Skill: `skills/memory/agent-handoff/SKILL.md`
- Command: `commands/vibe-handoff.md`
- Feature doc: `references/features/agent-handoff.md`

### write-a-skill

- Skill: `skills/meta/write-reusable-skill/SKILL.md`
- Command: `commands/vibe-write-skill.md`
- Feature doc: `references/features/agent-alignment.md`

### git-guardrails

- Skill: `skills/core/git-guardrails/SKILL.md`
- Command: `commands/vibe-git-guardrails.md`
- Feature doc: `references/features/git-guardrails.md`

### setup-pre-commit

- Skill: `skills/core/setup-pre-commit-quality-gates/SKILL.md`
- Command: `commands/vibe-setup-pre-commit.md`
- Feature doc: `references/features/git-guardrails.md`

## antigravity-awesome-skills-inspired patterns (sickn33/antigravity-awesome-skills)

### Skill Composability at Scale

- Feature source: `references/sources/sickn33-antigravity-awesome-skills.md`
- Local files:
  - `skills/meta/skill-catalog/SKILL.md`
  - `registry/skill-categories.json`
  - `references/features/skill-composability.md`
  - `skills/meta/writing-skills/SKILL.md` (composability/discoverability section)
  - `skills/meta/using-vibe-coding-os/SKILL.md` (skill discovery workflow)
  - `registry/skills.json` (tags, bundle, platforms fields)

### Multi-Platform Skill Adapters

- Feature source: `references/sources/sickn33-antigravity-awesome-skills.md`
- Local files:
  - `skills/meta/multi-platform-skill-guide/SKILL.md`
  - `adapters/claude-code/README.md` (skill format convention section)
  - `adapters/codex/README.md` (skill format convention section)
  - `adapters/cursor/README.md` (skill format convention section)
  - `adapters/gemini/README.md` (skill format convention section)
  - `adapters/compatibility-matrix.md` (skill support column)

### Plugin Bundle System

- Feature source: `references/sources/sickn33-antigravity-awesome-skills.md`
- Local files:
  - `registry/bundles.json`
  - `skills/meta/plugin-bundle-system/SKILL.md`
  - `references/features/plugin-bundle-system.md`
  - `skills/meta/using-vibe-coding-os/SKILL.md` (bundle activation workflow)
  - `commands/vibe-init.md` (--bundle option)

### SKILL.md Format Standards Enhancement

- Feature source: `references/sources/sickn33-antigravity-awesome-skills.md`
- Local files:
  - `skills/meta/writing-skills/SKILL.md` (deepened: frontmatter, failure-modes, composability, token-budget)
  - `commands/vibe-write-skill.md` (validation prompts for format requirements)

### Ghi chú tiếng Việt

Bốn feature từ `sickn33/antigravity-awesome-skills` được chuyển thành local files: catalog skill, hướng dẫn đa nền tảng, hệ thống bundle plugin, và chuẩn format SKILL.md. Tất cả đều là original adaptation, không copy upstream.

## Crash-proof planning (othmanadi/planning-with-files inspiration)

| Feature | Local files to inspect | Notes |
| --- | --- | --- |
| persistent-plan-format | `skills/core/crash-proof-planning/SKILL.md`, `templates/crash-proof-plan-template.md` | YAML frontmatter with plan-id, status, checkpoint, recovery-count |
| completion-markers | `skills/core/crash-proof-planning/SKILL.md` | Bracket markers `[ ]`/`[~]`/`[x]`/`[!]`/`[-]` that survive re-read |
| checkpoint-system | `skills/core/crash-proof-planning/SKILL.md`, `templates/crash-proof-plan-template.md` | Named checkpoint block recording last known-good state |
| recovery-workflow | `commands/vibe-session-catchup.md`, `skills/core/crash-proof-planning/SKILL.md` | Locate plan → parse frontmatter → scan markers → check workspace → report |
| recovery-attempt-tracking | `commands/vibe-session-catchup.md` | Recovery-count in frontmatter, incremented each recovery run |
| crash-scenario-taxonomy | `skills/core/crash-proof-planning/SKILL.md` | Covers timeout, handoff, partial completion, git, multi-agent conflict |

## Policy-based context control (yvgude/lean-ctx inspiration)

| Feature | Local files to inspect | Notes |
| --- | --- | --- |
| policy-based-context-control | `skills/core/context-policy/SKILL.md`, `templates/context-policy-template.md` | Rule-based DLP for agent context |
| allow-block-flag-rules | `skills/core/context-policy/SKILL.md`, `templates/context-policy-template.md` | Three-action system: allow, block, flag |
| severity-levels | `skills/core/context-policy/SKILL.md` | error/warn/info with behavior mapping |
| default-modes | `skills/core/context-policy/SKILL.md`, `templates/context-policy-template.md` | restrictive vs permissive |
| sensitive-content-patterns | `skills/core/context-policy/SKILL.md` | File path and content pattern matching |
| scope-declaration | `skills/core/context-policy/SKILL.md`, `templates/context-policy-template.md` | project, directory, task, session scopes |

## supermemoryai/supermemory update impact rules

- If upstream changes memory API, inspect `adapters/memory/README.md`, `adapters/memory/supermemory-adapter-plan.md`, `templates/memory-provider-adapter-template.md`, `skills/memory/memory-provider-adapter/SKILL.md`, and `references/features/memory-provider-adapter.md`.
- If upstream adds new integrations, inspect `adapters/memory/supermemory-adapter-plan.md`, `commands/vibe-memory-provider-plan.md`, `registry/sources.json`, and `references/mappings/feature-to-local-files.md`.
- If upstream changes privacy/security model, inspect `skills/memory/privacy-filter/SKILL.md`, `docs/workflows/privacy-safe-memory.md`, `templates/memory-privacy-review-template.md`, and `NOTICE.md`.
- If upstream adds memory benchmarks/evals, inspect `skills/memory/memory-evaluation/SKILL.md`, `references/features/memory-evaluation.md`, `templates/memory-evaluation-template.md`, and `commands/vibe-memory-audit.md`.
- If upstream changes retrieval/search behavior, inspect `skills/memory/memory-search/SKILL.md`, `docs/workflows/memory-retrieval-before-work.md`, `commands/vibe-memory-retrieve.md`, and `commands/vibe-memory-search.md`.
- If upstream adds local/self-hosting patterns, inspect `skills/memory/local-first-memory/SKILL.md`, `adapters/memory/local-memory-adapter.md`, `docs/workflows/memory-provider-adapter.md`, and `references/features/local-first-memory.md`.
- If upstream changes docs or examples, inspect `references/sources/supermemoryai-supermemory.md`, `references/changelogs/supermemoryai-supermemory.md`, `references/mappings/source-to-local-skills.md`, and `references/mappings/update-impact-map.md` before adapting any idea.

### supermemoryai/supermemory feature mapping

- `agent-memory-contract`: `references/features/agent-memory-engine.md`, `skills/memory/memory-architecture/SKILL.md`, `docs/workflows/memory-lifecycle.md`.
- `memory-ingestion-workflow`: `references/features/memory-ingestion.md`, `skills/memory/memory-ingestion/SKILL.md`, `commands/vibe-memory-ingest.md`, `templates/memory-entry-template.md`.
- `memory-retrieval-workflow`: `references/features/memory-retrieval.md`, `skills/memory/memory-retrieval/SKILL.md`, `skills/memory/memory-search/SKILL.md`, `commands/vibe-memory-retrieve.md`, `templates/memory-retrieval-report-template.md`.
- `memory-search-interface`: `references/features/memory-search.md`, `skills/memory/memory-search/SKILL.md`, `commands/vibe-memory-search.md`.
- `memory-privacy-rules`: `references/features/memory-privacy.md`, `skills/memory/privacy-filter/SKILL.md`, `commands/vibe-memory-privacy-check.md`, `templates/memory-privacy-review-template.md`.
- `memory-evaluation-checklist`: `references/features/memory-evaluation.md`, `skills/memory/memory-evaluation/SKILL.md`, `templates/memory-evaluation-template.md`.
- `memory-provider-abstraction`: `references/features/memory-provider-adapter.md`, `skills/memory/memory-provider-adapter/SKILL.md`, `adapters/memory/README.md`.
- `local-first-memory-fallback`: `references/features/local-first-memory.md`, `skills/memory/local-first-memory/SKILL.md`, `adapters/memory/local-memory-adapter.md`.

## thedotmack/claude-mem persistent context features

| Feature | Local files to inspect | Notes |
| --- | --- | --- |
| session-capture-lifecycle | `references/features/session-capture.md`, `skills/memory/session-capture/SKILL.md`, `commands/vibe-session-capture.md`, `templates/session-observation-template.md`, `docs/workflows/privacy-safe-session-capture.md` | Capture durable observations only after privacy exclusion. |
| memory-compression | `references/features/memory-compression.md`, `skills/memory/session-summarizer/SKILL.md`, `commands/vibe-session-summary.md`, `templates/session-summary-template.md`, `docs/workflows/session-summary-and-handoff.md` | Preserve citations, uncertainty, validation status, and follow-ups. |
| context-injection-policy | `references/features/context-injection.md`, `skills/memory/progressive-memory-disclosure/SKILL.md`, `commands/vibe-context-inject.md`, `templates/context-injection-template.md`, `docs/workflows/persistent-context-lifecycle.md` | Inject only relevant, safe, scoped memory. |
| progressive-disclosure-retrieval | `references/features/progressive-disclosure.md`, `skills/memory/progressive-memory-disclosure/SKILL.md`, `commands/vibe-memory-progressive-search.md`, `templates/progressive-memory-search-template.md`, `docs/workflows/progressive-memory-retrieval.md` | Search/index first, fetch details only by relevance. |
| memory-search-workflow | `skills/memory/memory-search/SKILL.md`, `commands/vibe-memory-search.md`, `commands/vibe-memory-retrieve.md`, `commands/vibe-memory-progressive-search.md` | Compose with existing Supermemory-inspired search docs. |
| privacy-exclusion-rules | `references/features/privacy-exclusion.md`, `skills/memory/privacy-filter/SKILL.md`, `templates/privacy-exclusion-template.md`, `docs/workflows/privacy-safe-session-capture.md` | Secrets and high-risk data are excluded, not merely tagged. |
| observation-id-citations | `references/features/observation-citations.md`, `skills/memory/observation-citations/SKILL.md`, `commands/vibe-memory-cite.md`, `templates/session-observation-template.md` | Cite memory entries when relying on remembered claims. |
| hook-based-agent-memory | `references/features/hook-based-memory.md`, `skills/memory/hook-based-memory/SKILL.md`, `adapters/hooks/memory-hooks-contract.md`, `adapters/memory/claude-mem-adapter-plan.md` | Contract only; no upstream scripts or daemon. |
| memory-configuration-policy | `skills/memory/memory-configuration/SKILL.md`, `commands/vibe-memory-config.md`, `templates/memory-config-template.md`, `CLAUDE.md`, `AGENTS.md` | Keep defaults local-first and privacy-safe. |
| lifecycle-event-flow | `docs/workflows/persistent-context-lifecycle.md` (## Lifecycle event flow) | Maps six lifecycle events to hook taxonomy points; added Batch 8. |

## Ghi chú tiếng Việt

Bảng này nối từng tính năng bộ nhớ với file local cần kiểm tra. Khi sửa một tính năng, hãy cập nhật reference, mapping, changelog và chạy validation.

## Spec-driven development (github/spec-kit inspiration)

| Feature | Local files to inspect | Notes |
| --- | --- | --- |
| project-constitution | `references/features/project-constitution.md`, `skills/core/project-constitution/SKILL.md`, `commands/vibe-constitution.md`, `templates/constitution-template.md`, `CONSTITUTION.md` | Principles must be short and testable. |
| spec-first-development | `references/features/spec-driven-development.md`, `skills/core/spec-first-development/SKILL.md`, `commands/vibe-specify.md`, `templates/spec-template.md`, `docs/specs/README.md` | Reuse existing spec template; add scenarios. |
| user-scenarios-depth | `skills/core/spec-first-development/SKILL.md` (## Scenario pattern taxonomy, ## Scenario validation checklist), `templates/spec-template.md` (## Per-scenario validation criteria) | Added Batch 8: scenario pattern taxonomy, validation checklist, per-scenario criteria. |
| what-before-how | `references/features/what-before-how.md`, `skills/core/what-before-how/SKILL.md`, `commands/vibe-specify.md` | Behavior + acceptance criteria precede tech choices. |
| spec-to-plan-to-tasks | `references/features/spec-to-plan-to-tasks.md`, `skills/core/plan-from-spec/SKILL.md`, `skills/core/task-breakdown-from-plan/SKILL.md`, `commands/vibe-plan-from-spec.md`, `commands/vibe-tasks.md`, `templates/plan-template.md`, `templates/tasks-template.md` | Keep technical context in the plan, not the spec. |
| acceptance-criteria | `references/features/acceptance-criteria.md`, `skills/core/acceptance-criteria/SKILL.md`, `templates/spec-template.md`, `templates/checkpoint-template.md` | Criteria must be observable and verifiable. |
| dependency-aware-tasks | `references/features/dependency-aware-tasks.md`, `skills/core/dependency-aware-task-ordering/SKILL.md`, `templates/tasks-template.md` | Encode depends-on and parallel markers; tests first. |
| checkpoint-validation | `references/features/checkpoint-validation.md`, `skills/core/checkpoint-validation/SKILL.md`, `commands/vibe-checkpoints.md`, `commands/vibe-implement-from-tasks.md`, `templates/checkpoint-template.md` | Gate each phase before the next. |
| brownfield-enhancement | `references/features/brownfield-enhancement.md`, `skills/core/brownfield-spec-enhancement/SKILL.md`, `commands/vibe-brownfield-spec.md`, `templates/brownfield-spec-template.md` | Capture current vs desired behavior + migration risk. |
| creative-parallel-exploration | `references/features/creative-parallel-exploration.md`, `skills/core/creative-parallel-exploration/SKILL.md`, `commands/vibe-parallel-explore.md`, `templates/parallel-exploration-template.md` | Time-box exploration; record a decision. |
| workflow-extensions-and-presets | `references/features/workflow-extensions-and-presets.md`, `skills/meta/workflow-extension-design/SKILL.md` | Design guidance only; no runtime engine. |
| spec-template-quality | `skills/meta/spec-template-design/SKILL.md`, `commands/vibe-spec-audit.md`, `templates/spec-audit-template.md` | Audit spec quality against required sections. |

### Ghi chú tiếng Việt

Bảng spec-driven nối từng tính năng (hiến chương, spec, plan, tasks, checkpoint, brownfield, khám phá) với file local cần đọc khi `spec-kit` thay đổi hoặc khi sửa một tính năng.

## Continuous learning and instinct extraction

- Feature doc: `references/features/continuous-learning.md`
- Feature source: `references/sources/affaan-m-ecc.md`
- Local files:
  - `skills/meta/instinct-extraction/SKILL.md`
  - `commands/vibe-instinct.md`
  - `templates/instinct-template.md`
  - `references/instincts/`

## Context budget audit heuristics

- Feature doc: `skills/meta/context-budget/SKILL.md`
- Feature source: `references/sources/affaan-m-ecc.md`
- Local files:
  - `skills/meta/context-budget/SKILL.md`
  - `commands/vibe-context-audit.md`

## Team-agent orchestration

- Feature doc: `references/features/team-agent-orchestration.md`
- Local files:
  - `skills/core/team-agent-orchestration/SKILL.md`
  - `commands/vibe-team.md`
  - `templates/team-architecture-template.md`
  - `docs/workflows/team-agent-orchestration.md`
  - `skills/core/subagent-driven-development/SKILL.md`
  - `references/features/multi-agent-workflow.md`
- Reference sources:
  - `references/sources/yeachan-heo-oh-my-claudecode.md`
  - `references/sources/revfactory-harness.md`

## Context engineering (coleam00/context-engineering-intro inspiration)

- Feature doc: `references/features/context-engineering.md`
- Reference source: `references/sources/coleam00-context-engineering.md`

| Feature | Local files to inspect | Notes |
| --- | --- | --- |
| context-rich-brief | `templates/implementation-brief-template.md`, `skills/core/context-rich-implementation/SKILL.md`, `commands/vibe-brief.md`, `commands/vibe-brief-execute.md` | Bundle spec + research + examples + gates + score; markdown-first. |
| research-phase | `commands/vibe-brief.md`, `skills/core/context-rich-implementation/SKILL.md` | Discover repo patterns before writing; cite real files. |
| examples-library | `docs/workflows/context-engineering.md`, `templates/implementation-brief-template.md`, `examples/` | Reference in-repo paths; include positive and negative examples. |
| project-rules | `docs/workflows/context-engineering.md`, `CONSTITUTION.md`, `CLAUDE.md`, `AGENTS.md`, `CONTEXT.md` | Reference standing rules, do not duplicate them. |
| validation-gates | `templates/implementation-brief-template.md`, `commands/vibe-brief-execute.md`, `skills/core/checkpoint-validation/SKILL.md` | Executable, ordered, observable pass conditions. |
| iterate-until-green | `commands/vibe-brief-execute.md`, `skills/core/context-rich-implementation/SKILL.md` | Fix root causes in code; never weaken a check. |
| confidence-score | `templates/implementation-brief-template.md`, `commands/vibe-brief.md` | 1-10 self-score; below 7 blocks handoff until context gathered. |

## Project standards and roadmap

- Feature docs: `references/features/project-standards-and-roadmap.md`
- Local files:
  - `STANDARDS.md`
  - `ROADMAP.md`
  - `CONSTITUTION.md`
  - `CONTEXT.md`
- Source docs:
  - `references/sources/bmad-code-org-bmad-method.md`
  - `references/sources/buildermethods-agent-os.md`

### Standards-aware planning rubric depth (Batch 7)

- Feature source: `references/sources/bmad-code-org-bmad-method.md`, `references/sources/buildermethods-agent-os.md`
- Local files:
  - `skills/core/adaptive-flow/SKILL.md` (## Standards-mandated steps section)
  - `docs/workflows/adaptive-flow.md` (## Standards-flow mapping section)
  - `STANDARDS.md` (flow-requirement metadata per section)
  - `references/mappings/source-to-local-skills.md` (BMAD-METHOD/agent-os merge note)

### BMAD-METHOD / agent-os merge note (Batch 7)

- Feature source: `references/sources/bmad-code-org-bmad-method.md`, `references/sources/buildermethods-agent-os.md`
- Local files:
  - `references/sources/bmad-code-org-bmad-method.md` (## Merge note)
  - `references/sources/buildermethods-agent-os.md` (## Merge note)
  - `references/index.json` (cross-reference notes on both entries)
  - `references/mappings/source-to-local-skills.md` (### BMAD-METHOD / agent-os merge note)

## Spec issue worktree traceability

- Feature doc: `references/features/spec-issue-worktree-traceability.md`
- Local files:
  - `templates/traceability-map-template.md`
  - `skills/core/task-state-tracking/SKILL.md`
  - `templates/tasks-template.md`
  - `commands/vibe-tasks.md`
  - `commands/vibe-worktree.md`
- Source docs:
  - `references/sources/automazeio-ccpm.md`
  - `references/sources/eyaltoledano-claude-task-master.md`

### Task-state machine depth (Batch 7)

- Feature source: `references/sources/automazeio-ccpm.md`, `references/sources/eyaltoledano-claude-task-master.md`
- Local files:
  - `skills/core/task-state-tracking/SKILL.md` (## State machine, ## DONE criteria per state, ## Merge-conflict handling, ## Rollback rules)
  - `templates/tasks-template.md` (status badge convention, state-transition log)
  - `commands/vibe-tasks.md` (`--status` and `--transition` options)

## Deer-Flow-inspired patterns

### SuperAgent harness orchestration

- Feature source: `references/sources/bytedance-deer-flow.md`
- Feature doc: `references/features/sandboxed-execution.md`, `references/features/research-to-code-pipeline.md`
- Local files:
  - `skills/core/superagent-orchestration/SKILL.md`
  - `commands/vibe-superagent.md`
  - `skills/core/subagent-driven-development/SKILL.md`

### Sandboxed execution

- Feature doc: `references/features/sandboxed-execution.md`
- Local files:
  - `skills/core/sandboxed-execution/SKILL.md`
  - `templates/sandbox-scope-template.md`
  - `skills/core/subagent-driven-development/SKILL.md`

### Research-to-code pipeline

- Feature doc: `references/features/research-to-code-pipeline.md`
- Local files:
  - `docs/workflows/research-to-code-pipeline.md`
  - `templates/research-findings-template.md`
  - `skills/core/context-rich-implementation/SKILL.md`
  - `commands/vibe-brief.md`
  - `commands/vibe-brief-execute.md`

### Structured memory in agent harness

- Feature doc: `skills/memory/memory-architecture/SKILL.md`
- Local files:
  - `skills/memory/memory-architecture/SKILL.md`
  - `docs/workflows/memory-lifecycle.md`

## Code-review-graph-inspired patterns (tirth8205/code-review-graph)

- Feature source: `references/sources/tirth8205-code-review-graph.md`
- Feature doc: `references/features/code-intelligence-review.md`

### Code Intelligence Graph

- Local files:
  - `skills/core/code-intelligence-review/SKILL.md`
  - `templates/code-intelligence-review-template.md`
  - `commands/vibe-review-intelligence.md`
  - `references/features/code-intelligence-review.md`

### Incremental Review

- Local files:
  - `skills/core/incremental-review/SKILL.md`
  - `templates/incremental-review-template.md`
  - `commands/vibe-request-review.md` (--incremental option)

### Dependency Graph for Review Context

- Local files:
  - `templates/code-intelligence-review-template.md` (Dependency Graph section)
  - `skills/core/code-intelligence-review/SKILL.md` (Step 2: Enumerate dependencies)

### MCP-Native Code Intelligence Tools

- Local files:
  - `adapters/mcp/code-intelligence-tool-pattern.md`
  - `docs/workflows/core-vs-optional-runtime.md` (MCP adapter rule)

| Command handoff convention

## shanraisshan/claude-code-best-practice-inspired patterns (feature implementation B4)

### Structured Learning Path

- Feature source: `references/sources/shanraisshan-claude-code-best-practice.md`
- Local files:
  - `docs/proficiency-path.md` — Four-level proficiency path (Vibe Basics → Prompt Engineering → Agentic Engineering → Orchestration)
  - `commands/vibe-proficiency.md` — Self-assessment command for proficiency level
  - `skills/meta/using-vibe-coding-os/SKILL.md` — Level-appropriate guidance added
  - `CLAUDE.md` — Proficiency-level awareness added

### Maturity Badge System

- Feature source: `references/sources/shanraisshan-claude-code-best-practice.md`
- Local files:
  - `registry/skills.json` — "maturity" field added to 10+ key entries (stable/beta/experimental/draft)
  - `registry/prompts.json` — "maturity" field added to all command entries
  - `skills/meta/writing-skills/SKILL.md` — Maturity-level guidelines section added

### Expanded Orchestration Patterns

- Feature source: `references/sources/shanraisshan-claude-code-best-practice.md`
- Local files:
  - `skills/core/superagent-orchestration/SKILL.md` — Added fan-out/fan-in, pipeline, supervisor-with-reviewer, producer-consumer patterns with decision table
  - `skills/core/subagent-driven-development/SKILL.md` — Added error-handling patterns for subagent failures
  - `docs/workflows/team-agent-orchestration.md` — Reference to new orchestration patterns

### General Hook Patterns

- Feature source: `references/sources/shanraisshan-claude-code-best-practice.md`
- Local files:
  - `docs/workflows/hook-patterns.md` — General hook pattern taxonomy (command, session, workflow, verification hooks)
  - `adapters/hooks/memory-hooks-contract.md` — Generalized with lifecycle event taxonomy referencing general patterns
  - `skills/memory/hook-based-memory/SKILL.md` — Reference to general hook architecture
  - `references/features/hook-patterns.md` — Pattern taxonomy rationale and design decisions

## Command handoff convention

|- Local files:
  - `STANDARDS.md`
  - `commands/vibe-brief.md`
  - `commands/vibe-specify.md`
  - `commands/vibe-plan.md`
  - `commands/vibe-tasks.md`
|- Note: new convention is centralized in `STANDARDS.md`; commands can be updated incrementally.
