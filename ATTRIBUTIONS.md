# Attributions

This project is original work. Its skills, commands, templates, and docs are inspired by — and in places closely adapted from — the public projects listed below, but no upstream source code, prompt text, skill files, or large documentation blocks are vendored. All local content is written in original wording.

## Source registry

Inspiration sources are tracked in `registry/sources.json`, each with its verified license and import mode. Licenses were verified from upstream metadata during the 2026-06-06 local clone audit.

## Imported material

No upstream code or documentation is vendored. Vibe Coding OS adapts methodology, design patterns, and conventions into original local artifacts. Each source actively used for adaptation is listed below with its license and usage.

## obra/superpowers

- Name: `obra/superpowers`
- URL: https://github.com/obra/superpowers
- License: MIT, verified during the 2026-06-06 local clone audit
- What Vibe Coding OS uses it for: inspiration for composable skill methodology, mandatory workflow discipline, brainstorming, worktree isolation, planning, TDD, review exchange, branch finishing, verification, debugging, skill writing, and multi-harness packaging.
- Import mode: inspiration/adaptation only. Vibe Coding OS does not vendor upstream code, prompts, skill files, assets, tests, or documentation from this source.


## Future attribution process

When external ideas, code, docs, prompts, or tests are imported or closely adapted:

1. add the source to `registry/sources.json`;
2. verify and record the license;
3. describe the imported material here;
4. preserve upstream notices when required;
5. prefer summaries and normalized procedures over direct copying.

## mattpocock/skills

- Name: mattpocock/skills
- URL: https://github.com/mattpocock/skills
- License: MIT, verified from upstream `LICENSE` during the 2026-06-06 audit.
- Used for: engineering agent skills, alignment workflow, shared domain language, ADR practice, diagnosis loop, TDD loop, PRD/issue workflow, handoff, skill-writing inspiration, git guardrails, setup/pre-commit ideas, and architecture/prototype workflow inspiration.
- Import mode: inspiration/adaptation only.
- Vendored code: no.
- Notes: Local content is original Vibe Coding OS documentation and prompts. Future closer adaptation requires license and attribution review.

## supermemoryai/supermemory

- Name: `supermemoryai/supermemory`
- URL: https://github.com/supermemoryai/supermemory
- License: MIT, verified from upstream root `LICENSE` during the 2026-06-06 audit.
- Used for: agent memory architecture, memory lifecycle, retrieval, provider abstraction, and memory evaluation inspiration.
- Import mode: inspiration/adaptation only.
- Vendored code: no.
- Notes: Local content is original Vibe Coding OS documentation, skills, commands, templates, mappings, and adapter plans. No upstream source code, SDK, API client, dashboard, connectors, benchmark data, prompts, or large documentation text is vendored.

## thedotmack/claude-mem

- Name: `thedotmack/claude-mem`
- URL: https://github.com/thedotmack/claude-mem
- License: Apache-2.0, verified from upstream `LICENSE` during the 2026-06-06 audit.
- Used for: persistent context lifecycle, session capture, memory compression, progressive retrieval, privacy exclusion, observation citation, context injection, configuration, troubleshooting, and hook-based memory inspiration.
- Import mode: inspiration/adaptation only.
- Vendored code: no.
- Notes: Local content is original Vibe Coding OS documentation, skills, commands, templates, mappings, and adapter plans. No upstream hook scripts, worker service, installer, database schema, UI, prompts, docs, assets, or runtime dependencies are vendored.

## github/spec-kit

- Name: `github/spec-kit`
- URL: https://github.com/github/spec-kit
- License: MIT, verified from upstream root `LICENSE` during the 2026-06-06 audit.
- Used for: spec-driven development, project constitution/principles, the spec → plan → tasks → implement lifecycle, what-before-how discipline, acceptance criteria, dependency-aware and parallelizable task ordering, TDD task ordering, checkpoint validation, the implementation-readiness gate, brownfield iterative enhancement, and creative parallel exploration inspiration.
- Import mode: inspiration/adaptation only.
- Vendored code: no.
- Notes: Local content is original Vibe Coding OS documentation, skills, commands, templates, mappings, and reference docs. No upstream templates, prompts, CLI/`src` code, scripts, docs, tests, or assets are vendored. The Specify CLI is not a dependency and upstream command names are not required.

## yeachan-heo/oh-my-claudecode

- Name: `yeachan-heo/oh-my-claudecode`
- URL: https://github.com/yeachan-heo/oh-my-claudecode
- License: MIT, Copyright (c) 2025 Yeachan Heo. Verified from upstream root `LICENSE` during the 2026-06-07 audit.
- Used for: decision-context commit-trailer convention, context-budget audit heuristics, skill-from-session extraction, instinct extraction (design only), and agent role/model-tier routing inspiration.
- Import mode: inspiration/adaptation only.
- Vendored code: no.
- Notes: The upstream is a TypeScript runtime plugin (team/swarm engine, hook scripts, state manager). Vibe Coding OS adapts only prompt/convention patterns into original artifacts. No runtime engine, hook scripts, or compiled code is vendored.

## affaan-m/ECC

- Name: `affaan-m/ECC` (Everything Claude Code)
- URL: https://github.com/affaan-m/ECC
- License: MIT, Copyright (c) 2026 Affaan Mustafa. Verified from upstream root `LICENSE` during the 2026-06-07 audit.
- Used for: continuous-learning / instinct-extraction concept, context-budget audit heuristics, and fail-safe prompt-defense baseline inspiration.
- Import mode: inspiration/adaptation only.
- Vendored code: no.
- Notes: The upstream is a large cross-harness operator system (Node hook runtime, 251 skills / 63 agents). Vibe Coding OS adapts a small number of ideas in original wording at individual-developer scale. No upstream code, marketing/commercial framing, or structural import is included.

## multica-ai/andrej-karpathy-skills

- Name: `multica-ai/andrej-karpathy-skills`
- URL: https://github.com/multica-ai/andrej-karpathy-skills
- License: MIT **declared in metadata only** (`.claude-plugin/plugin.json`, README) by author `forrestchang` during the 2026-06-07 audit. No standalone `LICENSE` file and no copyright line are present upstream, so the MIT grant is incomplete/unverifiable.
- Used for: idea-level inspiration for four engineering-discipline principles — "Think Before Coding", "Simplicity First", "Surgical Changes", and "Goal-Driven Execution" (rewriting imperative instructions into verifiable goals with per-step checks). All attributed to Karpathy's public commentary.
- Import mode: **inspiration-only re-write**. Because the license grant is incomplete, no upstream text is copied; the related local skills are written entirely in original wording.
- Vendored code: no.
- Notes: Treated as inspiration-only until upstream adds a complete license + copyright notice. Local targets: `skills/prompts/karpathy-engineering-discipline` (Think Before Coding + Surgical Changes), `skills/prompts/anti-overengineering` (Simplicity First), `skills/core/goal-driven-execution` (Goal-Driven Execution), and `skills/core/verification-before-completion` (its evidence bar). The existing `karpathy-guardrails` skill is a distinct, separately-authored artifact.

## bmad-code-org/BMAD-METHOD

- Name: `bmad-code-org/BMAD-METHOD`
- URL: https://github.com/bmad-code-org/BMAD-METHOD
- License: MIT, Copyright (c) 2025 BMad Code, LLC. Verified from upstream `LICENSE` via raw GitHub during the 2026-06-07 audit.
- Used for: idea-level inspiration for product/PRD/UX depth and scale-adaptive planning that informs the adaptive-flow tiers.
- Import mode: inspiration/adaptation only.
- Vendored code: no.
- Notes: The upstream is an npm-installed agent runtime (`.bmad-core`, web bundles, expansion packs, slash-command orchestrator). Only conceptual patterns are adapted into original local artifacts; no installer, runtime, bundles, prompts, or docs are vendored.

## buildermethods/agent-os

- Name: `buildermethods/agent-os`
- URL: https://github.com/buildermethods/agent-os
- License: MIT, Copyright (c) 2025 CasJam Media LLC (Builder Methods). Verified from upstream `LICENSE` via raw GitHub during the 2026-06-07 audit.
- Used for: idea-level inspiration for standards-aware, task-proportional workflow selection feeding the adaptive-flow rubric.
- Import mode: inspiration/adaptation only.
- Vendored code: no.
- Notes: No installer scripts, base/project install flows, or upstream templates are vendored.

## coleam00/context-engineering-intro

- Name: `coleam00/context-engineering-intro`
- URL: https://github.com/coleam00/context-engineering-intro
- License: MIT, Copyright (c) 2025 Cole Medin. Verified from upstream `LICENSE` via raw GitHub during the 2026-06-07 audit.
- Used for: idea-level inspiration for the implementation brief / context bundle (spec + curated examples + doc links + executable validation gates) and validation-loop framing.
- Import mode: inspiration/adaptation only (no upstream text copied).
- Vendored code: no.
- Notes: Adapted as an original markdown template/command over existing artifacts. No PRP-runner tooling or upstream prose is copied. Future closer adaptation still requires normal attribution review.

## eyaltoledano/claude-task-master

- Name: `eyaltoledano/claude-task-master`
- URL: https://github.com/eyaltoledano/claude-task-master
- License: MIT plus Commons Clause condition, Copyright (c) 2025 Eyal Toledano, Ralph Khreish. Verified from upstream `LICENSE` via raw GitHub during the 2026-06-07 audit.
- Used for: idea-level inspiration for a markdown task-status convention, dependency-aware next-task selection, and (where the optional runtime exists) a local JSON task-store shape.
- Import mode: inspiration/adaptation only.
- Vendored code: no.
- Notes: No MCP server, CLI engine, upstream `tasks.json` runtime, AI-model config, or upstream code is vendored. Any local files such as `runtime/tasks/task-store.mjs` or `scripts/runtime-task.mjs`, when present, are original Vibe Coding OS runtime code inspired by the task-status/next-task concept, not copied or ported from upstream. Planned runtime targets remain aspirational until implemented.

## automazeio/ccpm

- Name: `automazeio/ccpm`
- URL: https://github.com/automazeio/ccpm
- License: MIT, Copyright (c) 2025 Ran Aroussi. Verified from upstream `LICENSE` via raw GitHub during the 2026-06-07 audit.
- Used for: idea-level inspiration for source-of-truth task tracking and optional spec → issue → worktree traceability.
- Import mode: inspiration/adaptation only.
- Vendored code: no.
- Notes: No `/pm` runtime, `gh` issue-sync scripting, bash command library, or GitHub-as-database engine is vendored. Only conceptual tracking patterns are adapted.

## revfactory/harness

- Name: `revfactory/harness`
- URL: https://github.com/revfactory/harness
- License: Apache-2.0, Copyright 2025 robin. Verified from provided upstream facts during the 2026-06-07 audit.
- Used for: idea-level inspiration for team-agent orchestration patterns, domain-analysis-first team design, progressive disclosure, generated-role brief structure, dry-run validation, and with-team vs without-team comparison.
- Import mode: inspiration/adaptation only.
- Vendored code: no.
- Notes: No upstream runtime, generated `.claude/agents`, generated `.claude/skills`, code, prompts, templates, docs, or installer behavior is vendored. Local artifacts are original markdown guidance.
