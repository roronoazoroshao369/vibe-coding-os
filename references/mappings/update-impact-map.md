# Update Impact Map

Use this document to decide which local files to inspect when a tracked reference changes.

## Decision process

1. Identify the source id in `references/index.json`.
2. Read the source doc and changelog.
3. Review the source's `features` and `local_targets` arrays.
4. Read the matching feature docs under `references/features/` and mapping docs under `references/mappings/`.
5. Inspect local targets before editing.
6. Update only files that benefit from the upstream change.
7. Record audit findings in the source changelog.
8. Run `npm run validate:references` and then `npm run validate` when broader repo structure changed.

## Common update paths

- Superpowers-style workflow changes affect `docs/workflows/superpowers-inspired-workflow.md`, `skills/meta/using-vibe-coding-os/SKILL.md`, `README.md`, `AGENTS.md`, and `CLAUDE.md`.
- Brainstorming or clarification changes affect `skills/core/brainstorming/SKILL.md`, `skills/core/clarify-before-code/SKILL.md`, and `commands/vibe-brainstorm.md`.
- Git isolation changes affect `skills/core/using-git-worktrees/SKILL.md` and `commands/vibe-worktree.md`.
- Spec or planning ideas usually affect `templates/spec-template.md`, `templates/plan-template.md`, `skills/core/spec-first-development/SKILL.md`, `skills/core/writing-plans/SKILL.md`, `skills/core/executing-plans/SKILL.md`, `skills/core/plan-driven-execution/SKILL.md`, and planning commands.
- Memory ideas usually affect `skills/memory/*`, `templates/memory-template.md`, and `commands/vibe-memory.md`.
- Skill orchestration ideas usually affect `registry/skills.json`, `skills/core/vibe-bootstrap/SKILL.md`, `skills/meta/using-vibe-coding-os/SKILL.md`, `CLAUDE.md`, and `AGENTS.md`.
- Multi-agent ideas usually affect `skills/core/subagent-driven-development/SKILL.md`, `skills/agents/*`, `commands/vibe-subagents.md`, and adapter docs.
- Testing ideas usually affect `skills/core/test-driven-development/SKILL.md`, command prompts, and task templates.
- Review ideas usually affect `skills/core/requesting-code-review/SKILL.md`, `skills/core/receiving-code-review/SKILL.md`, `skills/core/review-before-merge/SKILL.md`, `skills/core/verification-before-done/SKILL.md`, and `templates/review-template.md`.
- Debugging ideas usually affect `skills/core/systematic-debugging/SKILL.md` and `commands/vibe-debug.md`.
- Branch-finishing ideas usually affect `skills/core/finishing-a-development-branch/SKILL.md`, `commands/vibe-finish-branch.md`, and `commands/vibe-merge.md`.
- Skill-writing ideas usually affect `skills/meta/writing-skills/SKILL.md`, `commands/vibe-write-skill.md`, and skill registry/documentation coverage.
- Upstream audit process ideas usually affect `skills/core/upstream-intelligence-loop/SKILL.md`, `commands/vibe-upstream-sync.md`, `templates/upstream-audit-template.md`, and `references/upstream-audit-workflow.md`.

## Safety rules

- If the upstream change is mostly implementation-specific, do not import it unless Vibe Coding OS has a matching local need.
- If the license is not verified, treat the source as inspiration only.
- If a local target no longer exists, update `references/index.json` before validation can pass.
- If an upstream idea creates scope creep, record it as a possible future investigation instead of changing the kernel.
- Never stage `references/upstreams/` clone contents.

## mattpocock/skills update impact rules

### If upstream adds a new skill

Inspect `references/sources/mattpocock-skills.md`, `registry/skills.json`, `registry/prompts.json`, relevant `references/features/*.md`, and decide whether a local skill/command/template is needed.

### If upstream changes setup flow

Inspect `skills/meta/setup-project-agent-skills/SKILL.md`, `commands/vibe-setup-skills.md`, `CONTEXT.md`, `AGENTS.md`, `CLAUDE.md`, and registry files.

### If upstream changes TDD/diagnosis guidance

Inspect `skills/core/test-driven-development/SKILL.md`, `skills/core/disciplined-diagnosis/SKILL.md`, `commands/vibe-tdd.md`, `commands/vibe-diagnose.md`, `templates/diagnosis-template.md`, and `docs/workflows/debug-diagnose-tdd.md`.

### If upstream changes domain language/ADR guidance

Inspect `skills/core/shared-domain-language/SKILL.md`, `skills/core/architecture-decision-records/SKILL.md`, `CONTEXT.md`, `docs/adr/README.md`, `templates/project-context-template.md`, `templates/adr-template.md`, and `docs/workflows/domain-language-and-adrs.md`.

### If upstream changes architecture guidance

Inspect `skills/core/zoom-out-system-context/SKILL.md`, `skills/core/improve-codebase-architecture/SKILL.md`, `skills/core/prototype-before-commitment/SKILL.md`, architecture templates, and `docs/workflows/architecture-improvement-loop.md`.

### If upstream changes handoff guidance

Inspect `skills/memory/agent-handoff/SKILL.md`, `commands/vibe-handoff.md`, `templates/handoff-template.md`, and `skills/memory/project-memory/SKILL.md`.

### If upstream changes guardrail/hook behavior

Inspect `skills/core/git-guardrails/SKILL.md`, `skills/core/setup-pre-commit-quality-gates/SKILL.md`, `commands/vibe-git-guardrails.md`, `commands/vibe-setup-pre-commit.md`, and validation scripts.

### If upstream changes install or plugin packaging

Inspect `skills/meta/setup-project-agent-skills/SKILL.md`, `registry/skills.json`, `registry/prompts.json`, `registry/sources.json`, `references/index.json`, `scripts/validate-repo.mjs`, and `scripts/validate-references.mjs`.

## Ghi chú tiếng Việt

Impact map này là checklist khi upstream đổi. Đừng sửa tùy hứng: xác định loại thay đổi, đọc file local tương ứng, cập nhật changelog và chạy validation.

## supermemoryai/supermemory update impact rules

- If upstream changes memory API, inspect `adapters/memory/README.md`, `adapters/memory/supermemory-adapter-plan.md`, `templates/memory-provider-adapter-template.md`, `skills/memory/memory-provider-adapter/SKILL.md`, and `references/features/memory-provider-adapter.md`.
- If upstream adds new integrations, inspect `adapters/memory/supermemory-adapter-plan.md`, `commands/vibe-memory-provider-plan.md`, `registry/sources.json`, and `references/mappings/feature-to-local-files.md`.
- If upstream changes privacy/security model, inspect `skills/memory/memory-privacy/SKILL.md`, `skills/memory/privacy-filter/SKILL.md`, `docs/workflows/privacy-safe-memory.md`, `templates/memory-privacy-review-template.md`, and `NOTICE.md`.
- If upstream adds memory benchmarks/evals, inspect `skills/memory/memory-evaluation/SKILL.md`, `references/features/memory-evaluation.md`, `templates/memory-evaluation-template.md`, and `commands/vibe-memory-audit.md`.
- If upstream changes retrieval/search behavior, inspect `skills/memory/memory-retrieval/SKILL.md`, `skills/memory/memory-search/SKILL.md`, `docs/workflows/memory-retrieval-before-work.md`, `commands/vibe-memory-retrieve.md`, and `commands/vibe-memory-search.md`.
- If upstream adds local/self-hosting patterns, inspect `skills/memory/local-first-memory/SKILL.md`, `adapters/memory/local-memory-adapter.md`, `docs/workflows/memory-provider-adapter.md`, and `references/features/local-first-memory.md`.
- If upstream changes docs or examples, inspect `references/sources/supermemoryai-supermemory.md`, `references/changelogs/supermemoryai-supermemory.md`, `references/mappings/source-to-local-skills.md`, and `references/mappings/update-impact-map.md` before adapting any idea.

## thedotmack/claude-mem update impact rules

### If upstream changes lifecycle hooks

Inspect `references/sources/thedotmack-claude-mem.md`, `references/features/session-capture.md`, `references/features/hook-based-memory.md`, `skills/memory/session-capture/SKILL.md`, `skills/memory/hook-based-memory/SKILL.md`, `adapters/hooks/memory-hooks-contract.md`, `adapters/memory/claude-mem-adapter-plan.md`, and `docs/workflows/persistent-context-lifecycle.md`. Do not copy hook scripts.

### If upstream changes memory compression

Inspect `references/features/memory-compression.md`, `skills/memory/session-compression/SKILL.md`, `skills/memory/session-summarizer/SKILL.md`, `commands/vibe-session-summary.md`, `templates/session-summary-template.md`, and `docs/workflows/session-summary-and-handoff.md`. Preserve citations and privacy labels.

### If upstream changes search/progressive disclosure

Inspect `references/features/progressive-disclosure.md`, `references/features/memory-search.md`, `skills/memory/progressive-memory-disclosure/SKILL.md`, `skills/memory/memory-search/SKILL.md`, `skills/memory/memory-retrieval/SKILL.md`, `commands/vibe-memory-progressive-search.md`, `commands/vibe-memory-search.md`, `commands/vibe-memory-retrieve.md`, and `templates/progressive-memory-search-template.md`.

### If upstream changes privacy tags

Inspect `references/features/privacy-exclusion.md`, `references/features/memory-privacy.md`, `skills/memory/privacy-exclusion/SKILL.md`, `skills/memory/privacy-filter/SKILL.md`, `skills/memory/memory-privacy/SKILL.md`, `commands/vibe-memory-privacy-check.md`, `templates/privacy-exclusion-template.md`, `templates/memory-privacy-review-template.md`, `AGENTS.md`, `CLAUDE.md`, and `NOTICE.md`.

### If upstream changes context injection

Inspect `references/features/context-injection.md`, `skills/memory/context-injection/SKILL.md`, `skills/memory/context-retrieval/SKILL.md`, `commands/vibe-context-inject.md`, `templates/context-injection-template.md`, `docs/workflows/persistent-context-lifecycle.md`, and `CLAUDE.md`.

### If upstream changes plugin packaging

Inspect `adapters/hooks/memory-hooks-contract.md`, `adapters/memory/claude-mem-adapter-plan.md`, `registry/sources.json`, `references/index.json`, `references/sources/thedotmack-claude-mem.md`, and validation scripts. Keep packaging optional.

### If upstream adds new harness support

Inspect `adapters/claude-code/README.md`, `adapters/codex/README.md`, `adapters/cursor/README.md`, `adapters/compatibility-matrix.md`, `adapters/hooks/memory-hooks-contract.md`, `skills/memory/hook-based-memory/SKILL.md`, `AGENTS.md`, and `CLAUDE.md`.

### If upstream changes database/search architecture

Inspect `references/features/progressive-disclosure.md`, `references/features/memory-search.md`, `references/features/local-first-memory.md`, `skills/memory/memory-provider-adapter/SKILL.md`, `skills/memory/local-first-memory/SKILL.md`, `adapters/memory/README.md`, `adapters/memory/local-memory-adapter.md`, and `adapters/memory/claude-mem-adapter-plan.md`. Do not add SQLite, Chroma, daemons, or hosted providers without a new approved spec.

## Ghi chú tiếng Việt

Nếu upstream đổi, dùng các rule trên để biết file nào cần đọc trước. Chỉ học ý tưởng, không copy mã/kiến trúc, và luôn cập nhật changelog cùng validation.

## github/spec-kit update impact rules

### If upstream changes the spec phase model

Inspect `references/sources/github-spec-kit.md`, `references/features/spec-driven-development.md`, `references/features/spec-to-plan-to-tasks.md`, `skills/core/spec-first-development/SKILL.md`, `skills/core/plan-from-spec/SKILL.md`, `skills/core/task-breakdown-from-plan/SKILL.md`, `commands/vibe-specify.md`, `commands/vibe-plan-from-spec.md`, `commands/vibe-tasks.md`, `docs/workflows/spec-driven-development.md`, and `docs/specs/README.md`. Do not adopt new phase names blindly.

### If upstream changes constitution/principles

Inspect `references/features/project-constitution.md`, `skills/core/project-constitution/SKILL.md`, `commands/vibe-constitution.md`, `templates/constitution-template.md`, `CONSTITUTION.md`, and `docs/workflows/constitution-to-spec-to-plan.md`. Keep local principles original and testable.

### If upstream changes plan/task templates

Inspect `templates/plan-template.md`, `templates/tasks-template.md`, `references/features/dependency-aware-tasks.md`, `skills/core/dependency-aware-task-ordering/SKILL.md`, `skills/core/task-breakdown-from-plan/SKILL.md`, `skills/meta/spec-template-design/SKILL.md`, and `commands/vibe-spec-audit.md`. Do not copy template text; adapt structure only.

### If upstream changes TDD or checkpoint behavior

Inspect `references/features/checkpoint-validation.md`, `references/features/tdd-loop.md`, `skills/core/checkpoint-validation/SKILL.md`, `skills/core/test-driven-development/SKILL.md`, `commands/vibe-checkpoints.md`, `commands/vibe-implement-from-tasks.md`, `templates/checkpoint-template.md`, and `docs/workflows/spec-to-tasks-to-implementation.md`. Keep the readiness gate explicit.

### If upstream adds agent integrations

Inspect `AGENTS.md`, `CLAUDE.md`, `docs/workflows/spec-driven-development.md`, `adapters/claude-code/README.md`, and `references/sources/github-spec-kit.md`. Use existing agent instruction files; do not add an installer.

### If upstream changes the extension/preset model

Inspect `references/features/workflow-extensions-and-presets.md`, `skills/meta/workflow-extension-design/SKILL.md`, and `references/sources/github-spec-kit.md`. Keep this as design guidance unless a new approved spec adds a runtime.

### If upstream changes brownfield workflows

Inspect `references/features/brownfield-enhancement.md`, `skills/core/brownfield-spec-enhancement/SKILL.md`, `commands/vibe-brownfield-spec.md`, `templates/brownfield-spec-template.md`, and `docs/workflows/brownfield-spec-enhancement.md`.

### If upstream changes installation/CLI behavior

Inspect `references/sources/github-spec-kit.md`, `references/changelogs/github-spec-kit.md`, `registry/sources.json`, `references/index.json`, `ATTRIBUTIONS.md`, and `NOTICE.md`. The Specify CLI must remain optional; never make it a hard dependency.

### Ghi chú tiếng Việt

Khi `spec-kit` thay đổi, dùng các rule trên để biết file local cần đọc trước. Specify CLI luôn là tùy chọn, không bao giờ thành phụ thuộc bắt buộc, và không copy template/CLI upstream.
