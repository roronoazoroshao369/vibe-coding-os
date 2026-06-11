# Adoption Classification

This map records, for each tracked upstream source, which feature was considered, the adoption class assigned to it, the local target, the current status, and notes. It complements `references/merge-feature-gap-map.md` and the source docs under `references/sources/`.

Adoption classes are defined in [`docs/UPSTREAM_ADOPTION_POLICY.md`](../../docs/UPSTREAM_ADOPTION_POLICY.md): `adapt-skill`, `adapt-command`, `adapt-template`, `adapt-doc`, `adapt-rule`, `adapter-only`, `runtime-local`, `reject-runtime`, `inspiration-only`, `blocked-license`.

Status values: `adapted` (original local content exists), `planned` (mapped but not yet written), `rejected` (deliberately not adopted), `blocked-license` (cannot adapt closely until license/notice is resolved).

## Classification table

| Source | Feature | Adoption class | Local target | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| obra/superpowers | Mandatory workflow discipline (brainstorm → plan → test → review → verify) | adapt-skill | `skills/core/*` | adapted | MIT verified; original wording. |
| obra/superpowers | Skill-authoring methodology (format, triggers, failure modes) | adapt-skill | `skills/meta/writing-skills/SKILL.md` | planned | Tier 1 #1; rewrite thin stub. |
| obra/superpowers | Visual companion WebSocket server / graph renderer / test runners | reject-runtime | — | rejected | Executable runtime; out of markdown-first scope. |
| github/spec-kit | Constitution → specify → plan → tasks → implement phase ordering | adapt-skill | `skills/core/project-constitution`, `skills/core/spec-first-development`, `skills/core/plan-from-spec` | adapted | MIT verified; no upstream template/CLI text. |
| github/spec-kit | `/checklist` requirements-quality gate ("unit tests for English") | adapt-skill | `skills/core/requirements-quality-checklist`, `commands/vibe-checklist.md` | planned | Tier 1 #2; novel, zero overlap. |
| github/spec-kit | `/analyze` cross-artifact consistency gate | adapt-command | `commands/vibe-analyze.md` | planned | Tier 1 #3. |
| github/spec-kit | Specify CLI + Python scripts + presets engine | reject-runtime | — | rejected | Runtime/CLI plumbing; CLI not required. |
| mattpocock/skills | Two-axis review (Standards vs Spec, parallel subagents) | adapt-skill | `skills/core/review-before-merge/SKILL.md` | planned | Tier 1 #5; MIT verified. |
| mattpocock/skills | Engineering-agent skills (grill, ADRs, diagnosis, handoff, guardrails) | adapt-skill | `skills/core/*`, `skills/meta/*` | adapted | MIT verified; original wording. |
| mattpocock/skills | CONTEXT glossary `_Avoid:` synonyms + ambiguity log | adapt-template | `skills/core/shared-domain-language/SKILL.md` | planned | Tier 2 #17; format polish. |
| mattpocock/skills | Personal/in-progress skills (teach, writing, shoehorn, obsidian) | inspiration-only | — | rejected | Not coding-OS-aligned. |
| supermemoryai/supermemory | Graph relationship typing + Memory-vs-RAG + MemScore metric | adapt-skill | `skills/memory/memory-architecture`, `skills/memory/memory-evaluation` | planned | Tier 1 #6; fold into existing skills. |
| supermemoryai/supermemory | Hosted product surface (Next.js dashboard, SDKs, embedding pipelines) | reject-runtime | — | rejected | Hosted infra; adapter-only at most, later. |
| thedotmack/claude-mem | Project/worktree memory scoping + opt-out tracking | adapt-skill | `skills/memory/*` | planned | Tier 1 #7; Apache-2.0, NOTICE rules if code copied. |
| thedotmack/claude-mem | Hook event contract taxonomy + privacy env-sanitizer | adapt-doc | `adapters/hooks/memory-hooks-contract.md`, `skills/memory/privacy-filter/SKILL.md` | planned | Tier 2 #15; design-portable, scripts not. |
| thedotmack/claude-mem | Bun worker + SQLite + Chroma vector search + MCP server + installers | reject-runtime | — | rejected | Full daemon stack. |
| affaan-m/ECC | Context-budget audit heuristics (file size, frontmatter, dup detection) | adapt-skill | `skills/meta/context-budget` | planned | Tier 1 #8; keeps framework lean. |
| affaan-m/ECC | Continuous-learning / instinct extraction | adapt-skill | `skills/meta/*` | planned | Tier 2 #11; design-only, enforcement is runtime. |
| affaan-m/ECC | Structural scale (251 skills / 63 agents / 79 commands) | inspiration-only | — | rejected | Cherry-pick ideas only; never structural import. Marketing claims not credible. |
| yeachan-heo/oh-my-claudecode | Commit protocol with decision-context git trailers | adapt-rule | `skills/core/git-guardrails/SKILL.md` | planned | Tier 1 #4; MIT verified. |
| yeachan-heo/oh-my-claudecode | Agent role catalog patterns (model-tier routing, separate verifier lane) | adapt-skill | `skills/agents/*` | adapted | Adapt prose only. |
| yeachan-heo/oh-my-claudecode | skillify — extract skill from conversation | adapt-command | `skills/meta/*` | planned | Tier 2 #12. |
| yeachan-heo/oh-my-claudecode | Team/swarm orchestration engine (`src/team/*`, tmux, mailboxes) | reject-runtime | — | rejected | Pure runtime; only portable team patterns adapted. |
| yeachan-heo/oh-my-claudecode | ralph/ultrawork/autopilot/self-improve loop engines | reject-runtime | — | rejected | Loops the markdown core cannot enforce. |
| revfactory/harness | Six team patterns + domain-analysis-first team design | adapt-skill | `skills/core/team-agent-orchestration/SKILL.md` | adapted | Apache-2.0; markdown-only, no generated artifacts. |
| multica-ai/andrej-karpathy-skills | Four engineering-discipline principles (Think/Simplicity/Surgical/Goal-Driven) | inspiration-only | `skills/prompts/karpathy-engineering-discipline`, `skills/prompts/anti-overengineering`, `skills/core/goal-driven-execution` | blocked-license | MIT declared in metadata only; no LICENSE file/notice → grant incomplete. Re-write from first principles; do NOT vendor text or structure. |
| coleam00/context-engineering-intro | Context-rich implementation brief + validation gates + confidence score | adapt-skill | `skills/core/context-rich-implementation/SKILL.md` | adapted | MIT verified; no PRP-runner tooling. |
| bmad-code-org/BMAD-METHOD | Product mission/roadmap + standards-aware planning | adapt-rule | `STANDARDS.md`, `ROADMAP.md` | adapted | MIT verified. |
| buildermethods/agent-os | Project standards + task-proportional conventions | adapt-rule | `STANDARDS.md`, `ROADMAP.md` | adapted | MIT verified. |
| eyaltoledano/claude-task-master | Markdown task state + next-task selection + traceability | adapt-template | `skills/core/task-state-tracking/SKILL.md`, `templates/traceability-map-template.md` | adapted | MIT+Commons-Clause; markdown-only, no CLI. |
| automazeio/ccpm | Spec → issue → worktree traceability | adapt-template | `templates/traceability-map-template.md`, `skills/core/task-state-tracking/SKILL.md` | adapted | MIT verified. |

## License flags to clear before closer adaptation

- `multica-ai/andrej-karpathy-skills`: MIT declared in `.claude-plugin/plugin.json` and README only; no standalone `LICENSE` file and no copyright line. Classified `blocked-license`. Keep inspiration-only and re-write any adopted idea in original local language until a valid grant is confirmed.
- Confirm `affaan-m/ECC`, `yeachan-heo/oh-my-claudecode`, and `multica-ai/andrej-karpathy-skills` are present in `ATTRIBUTIONS.md`/`NOTICE.md` before any closer adaptation, per `references/merge-feature-gap-map.md`.

## Maintenance

When a feature moves from `planned` to `adapted`, update this table, the matching `references/sources/*.md`, the changelog, and feature mappings, then run `npm run validate:references`.

## Ghi chú tiếng Việt

Bảng này phân loại từng tính năng upstream theo lớp adoption (skill/command/template/doc/rule/adapter/runtime/reject/inspiration/blocked-license). `multica-ai` bị gắn `blocked-license` vì chỉ khai báo MIT trong metadata, không có file LICENSE — chỉ học ý tưởng, không vendor. Runtime/engine upstream bị `reject-runtime`.
