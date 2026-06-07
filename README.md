# Vibe Coding OS

<p align="right">
  <a href="README.md">English</a> · <a href="README.vi.md">Tiếng Việt</a>
</p>

**Vibe Coding OS** is a Claude/Codex-friendly skill framework for one person who wants to move fast with AI coding assistants without giving up engineering discipline. It is markdown-first, dependency-light, and usable as plain instructions, prompts, and templates. It also includes an optional JSON-first runtime companion for local task, memory, checkpoint, team, session, daemon, MCP, tmux, and vector-memory workflows.

It is not a required wrapper, product, hosted service, or mandatory agent runtime. It is a normalized operating system for AI-assisted software work: reusable skills, command prompts, templates, registries, adapters, reference maps, and optional local runtime helpers that help a human and an AI assistant repeatedly turn intent into reliable code. Its specific aim is to raise the quality of vibe coding with Claude Code and similar agents by selectively studying, merging, and re-normalizing the best reusable workflow ideas from leading public skill, agent-workflow, and engineering-practice sources without blindly copying or vendoring them.

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

## What is included now

Current inventory: **90 skills**, **68 commands**, **38 templates**, **14 tracked inspiration sources**, and an optional runtime layer. The repository has moved beyond a small prompt pack into a full local operating system for AI-assisted engineering.

| Layer | What it contains | Pain it reduces |
| --- | --- | --- |
| Spec-driven workflow | Constitution, specify, plan, tasks, checkpoints, implementation-readiness gates | AI codes before understanding requirements |
| Adaptive flow | Tiny/small/medium/large/risky workflow tiers | Process is either too heavy for small tasks or too light for risky work |
| Real engineering skills | Grilling, PRD, ADRs, TDD, diagnosis, review, branch finishing | AI acts like a code generator instead of a disciplined engineer |
| Prompt discipline | Karpathy-style think/simplicity/surgical/goal-driven rules plus book-inspired coding principles | Overengineering, vague naming, fragile design, unreviewable code |
| Team-agent orchestration | Team architecture templates, role routing, handoffs, watchdogs, scaffold generation | Complex work cannot be split safely across agents |
| Memory layer | Session capture, summarization, privacy filtering, progressive retrieval, citations | Context is lost between sessions or unsafe to reuse |
| Reference intelligence | Source index, attribution policy, feature maps, update-impact maps, changelogs | Upstream ideas are copied blindly or become unmaintainable |
| Optional runtime | JSON stores, task/memory/checkpoint/team/session CLI, daemon, MCP server, vector search, tmux team runner, installer | Markdown-only workflows need inspectable state or local automation |

## Pain points solved

| Vibe-coding pain | Local answer |
| --- | --- |
| Requirements are vague | `clarify-before-code`, `what-before-how`, `vibe-specify`, acceptance criteria templates |
| AI jumps into code too soon | spec → plan → tasks gates, implementation-readiness checkpoint |
| AI overbuilds or rewrites too much | `anti-overengineering`, Karpathy engineering discipline, surgical-change checks |
| AI changes are hard to verify | goal-driven execution, TDD, verifier/reviewer split, `npm run validate` |
| Multi-step work loses progress | task-state tracking, runtime task store, handoff templates |
| Multi-agent work causes conflicts | team-agent orchestration, file ownership, handoff contracts, tmux runner |
| Context disappears after compaction/session end | memory/session capture, summarizer, observation citations, optional vector search |
| Legacy code changes are risky | characterization tests, seams, bug-fix lifecycle, brownfield spec enhancement |
| Production code is happy-path only | Release It! stability patterns, defensive programming, review checklists |
| Borrowed upstream ideas create license/attribution risk | reference index, source docs, ATTRIBUTIONS/NOTICE, validation scripts |


## Quick start by tool

Vibe Coding OS is markdown-first and dependency-light. Pick the path for your agent. In every case the goal is the same: make the agent read `CLAUDE.md` (or `AGENTS.md`), then pull in the specific `commands/*.md` and `skills/*/*/SKILL.md` files a task needs.

### Claude Code — install as a plugin (recommended)

Vibe Coding OS ships a Claude Code plugin manifest (`.claude-plugin/plugin.json`) and a marketplace manifest (`.claude-plugin/marketplace.json`), so it installs like any other plugin — all 90 skills and 68 commands load automatically, no manual file copying.

```bash
# 1. Add this repo as a marketplace
claude plugin marketplace add roronoazoroshao369/vibe-coding-os

# 2. Install the plugin
claude plugin install vibe-coding-os@vibe-coding-os-marketplace

# 3. (Optional) inspect what it ships before/after install
claude plugin details vibe-coding-os
```

After install, skills auto-activate by trigger and commands are available as `/vibe-*`. Use `claude plugin list`, `claude plugin disable/enable vibe-coding-os`, and `claude plugin update vibe-coding-os` to manage it.

### Claude Code — manual (no plugin)

```bash
# Option A — point Claude Code at this repo and work inside it
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
claude          # CLAUDE.md auto-loads; skills/, commands/, templates/ are ready

# Option B — use it inside YOUR project
cd your-project
# copy the framework's CLAUDE.md (or append it to your existing one)
cp ~/vibe-coding-os/CLAUDE.md ./CLAUDE.md
# then reference skills/commands by path, e.g. ask Claude Code:
#   "Follow skills/core/spec-first-development/SKILL.md for this feature"
```

In a session, trigger a phase by naming a command or skill: `vibe-spec`, `vibe-plan`, `vibe-implement`, `vibe-review`, or "use `skills/prompts/pragmatic-programmer/SKILL.md`". Run `npm run validate` after structural edits. See [`adapters/claude-code/README.md`](adapters/claude-code/README.md) for the full workflow.

### Codex CLI

```bash
git clone https://github.com/<owner>/vibe-coding-os ~/vibe-coding-os
cd your-project
cp ~/vibe-coding-os/AGENTS.md ./AGENTS.md   # Codex reads AGENTS.md as its instruction surface
```

Paste a command prompt from `commands/` (for example `vibe-spec.md`, `vibe-review.md`) at the start of a task, and attach the relevant `skills/*/*/SKILL.md`. See [`adapters/codex/README.md`](adapters/codex/README.md).

### Gemini CLI

```bash
git clone https://github.com/<owner>/vibe-coding-os ~/vibe-coding-os
cd your-project
cp ~/vibe-coding-os/AGENTS.md ./GEMINI.md   # or paste CLAUDE.md content into your Gemini context file
```

Gemini CLI loads instruction context at session start; point it at the copied file and reference `commands/` and `skills/` by path as needed.

### Cursor / other assistants

```bash
git clone https://github.com/<owner>/vibe-coding-os ~/vibe-coding-os
```

Paste the contents of `CLAUDE.md` into your project rules (e.g. `.cursorrules` or the chat system prompt), then paste individual `commands/*.md` prompts per phase and attach `skills/*/*/SKILL.md` when a task needs that procedure. See [`adapters/cursor/README.md`](adapters/cursor/README.md) and the [adapter compatibility matrix](adapters/compatibility-matrix.md).

### Optional runtime (any tool)

The framework works with zero runtime. If you want local JSON state for tasks, memory, checkpoints, teams, and sessions:

```bash
node scripts/runtime-install.mjs            # idempotent setup under .omc/runtime/
node scripts/runtime-install.mjs --dry-run  # preview, no writes
node scripts/runtime-install.mjs --mcp      # also register the MCP server in .mcp.json
```

It is fully opt-in, never auto-starts, and degrades gracefully if optional dependencies are absent. See the [Runtime](#runtime) section below.

## Superpowers-style methodology adaptation

Vibe Coding OS tracks [`obra/superpowers`](https://github.com/obra/superpowers) as an MIT-licensed inspiration source and adapts its composable-skill methodology into this repository's own local skill system. The local integration focuses on brainstorming before coding, spec/design approval for non-trivial work, isolated branches or worktrees, detailed plans, TDD, subagent-friendly task boundaries, review exchange, verification before completion, branch-finishing rituals, systematic debugging, skill-writing guidance, and multi-harness portability.

The adapted workflow is documented in [`docs/workflows/superpowers-inspired-workflow.md`](docs/workflows/superpowers-inspired-workflow.md). The reference audit and mapping live in `references/sources/obra-superpowers.md`, `references/changelogs/obra-superpowers.md`, and `references/mappings/`. No upstream code, skill files, or large documentation blocks are vendored.


## Persistent Context Layer

Vibe Coding OS includes a persistent context layer inspired by `thedotmack/claude-mem`, adapted as local skills, commands, workflows, templates, and adapter contracts rather than as a runtime dependency. The layer helps agents capture session observations, compress noisy work into concise summaries, search memory progressively, inject only relevant context, cite observation IDs or source artifacts, and exclude secrets before anything is stored or reused.

Applied locally:

- session capture lifecycle via `skills/memory/session-capture/SKILL.md` and `commands/vibe-session-capture.md`;
- compression and handoff via `skills/memory/session-summarizer/SKILL.md`, `commands/vibe-session-summary.md`, and `docs/workflows/session-summary-and-handoff.md`;
- context injection and progressive retrieval via `skills/memory/progressive-memory-disclosure/SKILL.md`, and `docs/workflows/progressive-memory-retrieval.md`;
- observation citations and privacy exclusion via `skills/memory/observation-citations/SKILL.md`, `skills/memory/privacy-filter/SKILL.md`, and the related templates;
- optional hook/adapter planning via `adapters/hooks/memory-hooks-contract.md` and `adapters/memory/claude-mem-adapter-plan.md`.

Not applied locally: no copied hook scripts, Bun worker service, SQLite/Chroma stack, local web viewer clone, installer clone, background daemon, OpenClaw gateway, beta/endless mode, or hard dependency on `claude-mem`.

**Ghi chú tiếng Việt:** Lớp Persistent Context giúp agent tiếp tục công việc giữa các phiên bằng bộ nhớ ngắn gọn, có trích dẫn và đã lọc bí mật. Không lưu token, mật khẩu, khóa riêng tư, dữ liệu cá nhân không cần thiết, hoặc transcript thô nhạy cảm.

## Spec-Driven Development Layer

Vibe Coding OS includes a spec-driven development layer inspired by [`github/spec-kit`](https://github.com/github/spec-kit) (MIT), adapted into local skills, commands, templates, and docs. It makes specifications the central, testable artifact that drives planning, tasks, and implementation. This layer is inspiration/adaptation only: no upstream templates, prompts, or CLI are vendored, and the Specify CLI is not required.

The lifecycle is:

```text
Constitution → Specify → Plan → Tasks → Implement
```

with a checkpoint between phases and an implementation-readiness gate before any code.

Applied locally:

- a project constitution of short, testable principles (`CONSTITUTION.md`, `skills/core/project-constitution/SKILL.md`, `commands/vibe-constitution.md`);
- what-before-how specs with observable acceptance criteria (`skills/core/spec-first-development/SKILL.md`, `skills/core/what-before-how/SKILL.md`, `skills/core/acceptance-criteria/SKILL.md`, `commands/vibe-specify.md`);
- plan-from-spec with separated technical context (`skills/core/plan-from-spec/SKILL.md`, `commands/vibe-plan-from-spec.md`);
- dependency-aware, parallelizable, test-first task breakdown (`skills/core/task-breakdown-from-plan/SKILL.md`, `skills/core/dependency-aware-task-ordering/SKILL.md`, `commands/vibe-tasks.md`);
- checkpoint validation and an implementation-readiness gate (`skills/core/checkpoint-validation/SKILL.md`, `commands/vibe-checkpoints.md`, `commands/vibe-implement-from-tasks.md`);
- brownfield enhancement and creative parallel exploration (`skills/core/brownfield-spec-enhancement/SKILL.md`, `skills/core/creative-parallel-exploration/SKILL.md`).

Not applied: the Specify CLI as a dependency, upstream command names as mandatory, copied templates, an agent installer, a full extension/preset runtime, or language-specific project generators.

Canonical docs: `docs/specs/README.md`, `docs/workflows/spec-driven-development.md`, `references/sources/github-spec-kit.md`, and `references/mappings/`.

**Ghi chú tiếng Việt:** Lớp spec-driven biến đặc tả thành tài liệu trung tâm: constitution → specify → plan → tasks → implement, làm rõ "cái gì" trước "làm thế nào", có checkpoint và cổng sẵn sàng triển khai. Học ý tưởng từ `github/spec-kit`, không copy template/CLI và không bắt buộc Specify CLI.

## Validation and manual usage

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

### Complete in the current kernel

- Normalized repository structure with core, memory, meta, prompt, and agent skills.
- 68 reusable command prompts and 38 templates.
- Dynamic structural validation plus reference-layer validation.
- Source, attribution, feature, and impact registries without vendoring upstream code.
- Adapter quick starts for Claude Code, Codex CLI, Gemini CLI, Cursor, and other assistants.
- Optional JSON-first runtime with task, memory, checkpoint, team, session, daemon, MCP, vector, tmux-runner, and installer entry points.

### Near-term

- Expand complete example workflows across more project types.
- Add a repeatable reference intake scorecard for deciding which upstream ideas are worth adapting.
- Add stronger schema validation for registry semantics beyond path existence.
- Add redaction tests and memory-quality evaluation fixtures.
- Add dashboard or lightweight viewer for `.omc/runtime/` state.

### Later

- Add curated skill packs for common stacks.
- Add compatibility tests for major agent tools.
- Add richer IDE/editor snippets for quick command and skill insertion.
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

## Runtime

The optional runtime layer stores local JSON state for tasks, memory, checkpoints, teams, sessions, events, vector memory, daemon state, MCP integration, and tmux team execution under `.omc/runtime/`. It is markdown-first, entirely opt-in, and never auto-starts.

Available npm scripts:

```text
runtime:init       initialise .omc/runtime/
runtime:validate   validate runtime collections
runtime:task       manage local task state
runtime:memory     ingest/search local memory
runtime:checkpoint record readiness/checkpoint evidence
runtime:team       import/scaffold team specs
runtime:session    capture session records
runtime:daemon     run the opt-in watch daemon
runtime:mcp        start the stdio MCP server
runtime:team-run   launch the opt-in tmux team runner
runtime:install    bootstrap runtime config and optional MCP registration
```

Bootstrap a clone with the installer:

```bash
node scripts/runtime-install.mjs            # idempotent setup
node scripts/runtime-install.mjs --dry-run  # preview steps, no writes
node scripts/runtime-install.mjs --force    # overwrite config & collections
node scripts/runtime-install.mjs --mcp      # also register MCP server in .mcp.json (merges, never clobbers)
```

The installer creates `.omc/runtime/`, writes config from `templates/runtime-config-template.json`, initialises empty collections, and prints next steps. No global or system installs are performed. Runtime components degrade gracefully when optional dependencies are absent. See [`docs/workflows/runtime-install.md`](docs/workflows/runtime-install.md), [`docs/workflows/runtime-daemon.md`](docs/workflows/runtime-daemon.md), [`docs/workflows/runtime-mcp-server.md`](docs/workflows/runtime-mcp-server.md), [`docs/workflows/runtime-vector-memory.md`](docs/workflows/runtime-vector-memory.md), [`docs/workflows/runtime-team-runner.md`](docs/workflows/runtime-team-runner.md), and [`docs/workflows/optional-runtime-architecture.md`](docs/workflows/optional-runtime-architecture.md).
