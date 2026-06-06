# Vibe Coding OS

<p align="right">
  <a href="README.md">English</a> · <a href="README.vi.md">Tiếng Việt</a>
</p>

**Vibe Coding OS** is a Claude/Codex-friendly skill framework for one person who wants to move fast with AI coding assistants without giving up engineering discipline.

It is not a wrapper, product, or agent runtime. It is a normalized operating system for AI-assisted software work: reusable skills, command prompts, templates, and registries that help a human and an AI assistant repeatedly turn intent into reliable code. Its specific aim is to raise the quality of vibe coding with Claude Code and similar agents by selectively studying, merging, and re-normalizing the best reusable workflow ideas from leading public skill and agent-workflow repositories without blindly copying or vendoring them.

## Why this exists

Modern coding agents are powerful, but they are easiest to misuse when the task is vague, the context is stale, or success is declared before verification. Vibe Coding OS makes the desired behavior explicit:

- clarify uncertainty before coding;
- specify non-trivial work before implementation;
- plan in small reversible steps;
- write tests or checks that prove the change;
- review the result before merge;
- preserve useful project memory without leaking private data;
- keep attribution clean when learning from the wider AI coding ecosystem.

## Philosophy

1. **Human intent stays sovereign.** The assistant may propose, but it must not invent requirements or silently expand scope.
2. **Small correct changes beat grand rewrites.** Prefer the smallest useful step that can be reviewed and verified.
3. **Specs are thinking tools, not bureaucracy.** Use just enough structure to remove ambiguity.
4. **Verification is part of done.** Never claim success without tests, validation, or an explicit limitation.
5. **Memory should be useful, current, and safe.** Store durable decisions and context, not secrets or irrelevant transcripts.
6. **Attribution is a first-class artifact.** Ideas may be inspired by public work, but imported content must be tracked before it is used.

## Default workflow

Use this loop for substantial work:

```text
Intent → Spec → Plan → Implement → Test → Review → Memory → Merge
```

- **Intent:** capture what the human wants and why.
- **Spec:** define desired behavior, constraints, non-goals, and acceptance criteria.
- **Plan:** break the change into reviewable tasks and verification steps.
- **Implement:** make focused edits that match the plan.
- **Test:** run the smallest meaningful checks first, then broader validation.
- **Review:** inspect the diff for correctness, simplicity, security, and maintainability.
- **Memory:** record durable decisions, gotchas, and follow-ups.
- **Merge:** ship only after verification status is clear.


## Superpowers-style methodology adaptation

Vibe Coding OS tracks [`obra/superpowers`](https://github.com/obra/superpowers) as an MIT-licensed inspiration source and adapts its composable-skill methodology into this repository's own local skill system. The local integration focuses on brainstorming before coding, spec/design approval for non-trivial work, isolated branches or worktrees, detailed plans, TDD, subagent-friendly task boundaries, review exchange, verification before completion, branch-finishing rituals, systematic debugging, skill-writing guidance, and multi-harness portability.

The adapted workflow is documented in [`docs/workflows/superpowers-inspired-workflow.md`](docs/workflows/superpowers-inspired-workflow.md). The reference audit and mapping live in `references/sources/obra-superpowers.md`, `references/changelogs/obra-superpowers.md`, and `references/mappings/`. No upstream code, skill files, or large documentation blocks are vendored.


## Persistent Context Layer

Vibe Coding OS includes a persistent context layer inspired by `thedotmack/claude-mem`, adapted as local skills, commands, workflows, templates, and adapter contracts rather than as a runtime dependency. The layer helps agents capture session observations, compress noisy work into concise summaries, search memory progressively, inject only relevant context, cite observation IDs or source artifacts, and exclude secrets before anything is stored or reused.

Applied locally:

- session capture lifecycle via `skills/memory/session-capture/SKILL.md` and `commands/vibe-session-capture.md`;
- compression and handoff via `skills/memory/session-compression/SKILL.md`, `commands/vibe-session-summary.md`, and `docs/workflows/session-summary-and-handoff.md`;
- context injection and progressive retrieval via `skills/memory/context-injection/SKILL.md`, `skills/memory/progressive-memory-disclosure/SKILL.md`, and `docs/workflows/progressive-memory-retrieval.md`;
- observation citations and privacy exclusion via `skills/memory/observation-citations/SKILL.md`, `skills/memory/privacy-exclusion/SKILL.md`, and the related templates;
- optional hook/adapter planning via `adapters/hooks/memory-hooks-contract.md` and `adapters/memory/claude-mem-adapter-plan.md`.

Not applied locally: no copied hook scripts, Bun worker service, SQLite/Chroma stack, local web viewer clone, installer clone, background daemon, OpenClaw gateway, beta/endless mode, or hard dependency on `claude-mem`.

**Ghi chú tiếng Việt:** Lớp Persistent Context giúp agent tiếp tục công việc giữa các phiên bằng bộ nhớ ngắn gọn, có trích dẫn và đã lọc bí mật. Không lưu token, mật khẩu, khóa riêng tư, dữ liệu cá nhân không cần thiết, hoặc transcript thô nhạy cảm.

## Installation and manual usage

This repository is intentionally dependency-light. To validate the framework structure:

```bash
npm run validate
```

Manual usage options:

1. Copy the relevant `CLAUDE.md` or `AGENTS.md` instructions into your agent environment.
2. Invoke a command prompt from `commands/` such as `vibe-spec.md` or `vibe-review.md`.
3. Attach one or more skills from `skills/` when you want a specific behavior.
4. Use templates from `templates/` to create specs, plans, tasks, reviews, and memory notes.
5. Walk through complete examples in `examples/`, starting with the [feature workflow](examples/feature-workflow/README.md) or [bugfix workflow](examples/bugfix-workflow/README.md).

## Vietnamese documentation

Vietnamese onboarding and reference docs are available under [`docs/vi/`](docs/vi/index.md):

- [`docs/vi/index.md`](docs/vi/index.md) — overview, quick start, feature index, and glossary.
- [`docs/vi/skills-and-commands.md`](docs/vi/skills-and-commands.md) — Vietnamese reference for commands, skills, and skill combos.
- [`docs/vi/folders-and-workflows.md`](docs/vi/folders-and-workflows.md) — repository map and common workflows.
- [`docs/vi/strategy-and-roadmap.md`](docs/vi/strategy-and-roadmap.md) — status review, strategic goal, metrics, and future roadmap.

## Skill system

A skill is a portable operating procedure stored as `SKILL.md`. Every skill uses the same sections:

- Title
- Purpose
- When to use
- Inputs
- Workflow
- Outputs
- Failure modes
- Verification checklist

The registry at `registry/skills.json` lists the local skills, paths, categories, and descriptions. Skills are designed to be composable. For example, a difficult feature might combine:

- `clarify-before-code`
- `spec-first-development`
- `plan-driven-execution`
- `test-driven-development`
- `verification-before-done`
- `session-summarizer`

## Command system

Commands in `commands/` are short reusable prompts. They are meant to be pasted into Claude Code, Codex, Cursor, or another assistant to trigger a disciplined workflow phase.

The initial command set covers:

- initialization
- specification
- planning
- implementation
- review
- memory updates
- merge readiness
- repository diagnostics

The registry at `registry/prompts.json` tracks these command prompts.

## Adapters

Adapters document how to use the framework in specific environments. Start with the [adapter compatibility matrix](adapters/compatibility-matrix.md) when choosing setup details across tools:

- `adapters/claude-code/`
- `adapters/codex/`
- `adapters/cursor/`

They are intentionally lightweight in v0.1 and will become more concrete as usage patterns stabilize.

## Reference Intelligence Layer

Vibe Coding OS tracks upstream inspirations through a markdown-first Reference Intelligence Layer in `references/`. The layer combines source docs, feature maps, local file mappings, audit changelogs, and `references/index.json` so future agents can understand what to study without copying or vendoring external content.

Use it before adapting upstream ideas: read the source entry, inspect the linked feature and mapping docs, update the local changelog when auditing upstream, and keep attribution decisions explicit. Reference validation is available with `npm run validate:references`, and the main validation script includes it.

For hands-on audits, `npm run references:clone` creates or updates shallow ignored working copies under `references/upstreams/<owner>-<repo>`. With no flags, the command processes every source; `npm run references:clone -- --all` makes that explicit. To refresh one source, pass either its source id or owner/repo name, for example `npm run references:clone -- --source obra-superpowers` or `npm run references:clone -- --source github/spec-kit`. The clone command retries transient network failures, continues processing remaining sources after a failure, prints a final `cloned` / `updated` / `failed` / `skipped` summary with local paths, and exits non-zero if any source failed. Treat those clones as disposable research material only; durable local knowledge belongs in `references/changelogs/`, source docs, feature mappings, skills, commands, templates, and attribution files. The detailed loop lives in `references/upstream-audit-workflow.md`.

## Roadmap

### v0.1 kernel

- Establish the normalized repository structure.
- Provide core, memory, prompt, and agent skills.
- Provide reusable command prompts and templates.
- Add structural validation.
- Add source and attribution registries without vendoring external code.

### Near-term

- Expand examples of complete workflows across more project types.
- Add a repeatable reference intake scorecard for deciding which upstream ideas are worth adapting.
- Add stronger schema validation for registries.
- Add import review process for external ideas.
- Add project memory conventions and redaction tests.
- Add adapter-specific install snippets.

### Later

- Add optional CLI helpers.
- Add compatibility tests for major agent tools.
- Add curated skill packs for common stacks.
- Add governance rules for external contributions and source intake.

## Attribution and license policy

Vibe Coding OS is original content. It is inspired by patterns in the wider AI coding workflow community, including repositories listed in `registry/sources.json`, but it does not vendor their code or documentation.

Before importing external material:

1. verify the source license;
2. record the source in `registry/sources.json`;
3. document the imported idea or artifact in `ATTRIBUTIONS.md`;
4. preserve notices required by the upstream license;
5. prefer adaptation and normalization over copying.

See `NOTICE.md` and `ATTRIBUTIONS.md` for the current policy and placeholders.

## Real Engineering Skills Layer

Vibe Coding OS adapts practical engineering-agent ideas from [`mattpocock/skills`](https://github.com/mattpocock/skills) into its own local skill system. This layer is inspiration/adaptation only: no upstream code, prompts, or large documentation blocks are vendored. It strengthens the default workflow with:

- grilling before building so the assistant does not invent requirements;
- shared domain language in `CONTEXT.md`;
- ADRs for important technical decisions;
- TDD and disciplined diagnosis loops;
- PRD creation from conversation context and issue slicing for independently grabbable work;
- zoom-out and architecture-improvement workflows;
- handoff documents for agent/session continuity;
- git guardrails and quality gates before finishing work.

Canonical local docs: `references/sources/mattpocock-skills.md`, `docs/workflows/real-engineering-skills-workflow.md`, `references/mappings/source-to-local-skills.md`, and `references/mappings/update-impact-map.md`.

### Ghi chú tiếng Việt

Layer này giúp maintainer Việt Nam dùng AI như kỹ sư thật: hỏi rõ trước khi làm, giữ glossary/context, ghi ADR, dùng TDD/debug có bằng chứng, chia issue nhỏ, handoff rõ, và chạy validation. Khi upstream `mattpocock/skills` thay đổi, hãy audit reference doc/changelog/mapping trước rồi mới sửa skill/command/template local. Không chép nội dung upstream.
