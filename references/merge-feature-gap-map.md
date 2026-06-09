# Merge Feature Gap Map — 8 Upstream Repos → Vibe Coding OS

> Goal: merge the strongest features of 8 upstream repos into one convenient Vibe Coding OS.
> Method: full-repo agent audit (8 parallel agents read real cloned code under `references/upstreams/`), license verification, and gap cross-check against current vibe-os.
> Date: 2026-06-07.

## The one constraint that shapes everything

**Vibe Coding OS is a docs / prompts / skills framework, NOT a runtime.** It has no agent engine, no hooks daemon, no storage layer. Most of the "power" in these upstreams lives in runtime code (team orchestration engines, Bun workers, SQLite + vector search, Node hook runtimes). That code **cannot be merged as docs**. What is mergeable is the *prompt-portable layer*: skills, command prompts, templates, conventions, and design patterns.

So "merge the strong features" realistically means: **adapt the strong portable patterns into original vibe-os skills/commands/templates**, not vendor engines.

## License status (verified from actual clones)

| Repo | License | Holder | Vendor-safe? | Attribution present? |
|---|---|---|---|---|
| obra/superpowers | MIT | Jesse Vincent 2025 | Yes (w/ notice) | Yes |
| github/spec-kit | MIT | GitHub, Inc. | Yes (w/ notice) | Yes |
| mattpocock/skills | MIT | Matt Pocock 2026 | Yes (w/ notice) | Yes |
| supermemoryai/supermemory | MIT | supermemory 2025 | Yes (w/ notice) | Yes |
| thedotmack/claude-mem | Apache-2.0 | Alex Newman 2026 | Yes (LICENSE+NOTICE+changed-file marks required if any code copied) | Yes |
| affaan-m/ECC | MIT | Affaan Mustafa 2026 | Yes (w/ notice) | ❌ MISSING from ATTRIBUTIONS.md |
| yeachan-heo/oh-my-claudecode | MIT | Yeachan Heo 2025 | Yes (w/ notice) | ❌ MISSING from ATTRIBUTIONS.md |
| multica-ai/andrej-karpathy-skills | ⚠️ MIT *declared in metadata only — no LICENSE file, no copyright line* | "forrestchang" (no full name/year) | ⚠️ NO — incomplete grant; vendoring unsafe | ❌ MISSING from ATTRIBUTIONS.md |

**Two headline license flags:**
1. `multica-ai/andrej-karpathy-skills` declares MIT in `plugin.json`/README but ships **no LICENSE file and no copyright notice**. A valid MIT grant needs both. → Treat as **inspiration-only re-write**, do NOT vendor verbatim.
2. 3 repos (ECC, yeachan-heo, multica-ai) are **absent from ATTRIBUTIONS.md** — must be added before adapting anything from them.

---

## Ranked merge candidates (high value, prompt-portable, low effort first)

### Tier 1 — Strong, portable, low-effort (do these first)

| # | Feature | From | Maps to vibe-os | Why |
|---|---|---|---|---|
| 1 | **Skill-testing methodology + Claude Search Optimization** (RED-GREEN-REFACTOR for skills, pressure scenarios, "description = when-to-use not workflow", token budgets) | superpowers | Rewrite thin `skills/meta/writing-skills` (42-line stub) into a real playbook | Biggest content gap; pure docs; improves every future skill |
| 2 | **`/checklist` — "unit tests for English"** (validate requirements quality: completeness/clarity/coverage/edge-cases) | spec-kit | New `skills/core/requirements-quality-checklist` + template + `commands/vibe-checklist.md` | Genuinely novel, zero overlap, pure prompt |
| 3 | **`/analyze` — cross-artifact consistency gate** (spec ↔ plan ↔ tasks alignment before implement) | spec-kit | Extend `vibe-spec-audit` or add `commands/vibe-analyze.md` | Fills gap between single-artifact audit and checkpoint |
| 4 | **Commit protocol with decision-context git trailers** (Constraint/Rejected/Directive/Confidence/Scope-risk) | yeachan-heo | Augment `skills/core/git-guardrails` | Self-contained convention, zero runtime, clean win |
| 5 | **Two-axis review (Standards vs Spec, parallel subagents)** | mattpocock | Upgrade `skills/core/review-before-merge` | review-before-merge is currently single-axis |
| 6 | **Graph relationship typing (Updates/Extends/Derives + isLatest)** + **Memory-vs-RAG** + **MemScore triple metric** | supermemory | Enrich `memory-architecture`, `memory-evaluation`; new `memory-vs-rag` ref doc | Concrete schemas/metrics; fold into EXISTING memory skills (don't add new) |
| 7 | **Project/worktree memory scoping + opt-out tracking** | claude-mem | Fold into existing memory skill | vibe-os 22 memory skills lack clean scoping policy |
| 8 | **Context-budget audit heuristics** (files >400 lines, frontmatter >30 words, dup-copy detection) | ECC | New small `skills/meta/context-budget` | Directly keeps the framework lean (relevant given dup problem) |

### Tier 2 — Medium value, prompt-portable, more effort

| # | Feature | From | Maps to | Notes |
|---|---|---|---|---|
| 9 | **`/clarify` encode-answers-back-into-spec discipline** (≤5 questions, write into artifact) | spec-kit | Sharpen `clarify-before-code`/`grill-user-before-building` | Tighten existing skills, don't duplicate |
| 10 | **Command `handoffs` frontmatter** (each command suggests next step + seed prompt) | spec-kit | Convention across `vibe-specify`/`vibe-plan`/`vibe-tasks` | Lightweight UX chaining |
| 11 | **Continuous-learning / instinct extraction** (distill reusable patterns from sessions, confidence-scored) | ECC | `skills/meta` + `learner`-style workflow | Strong idea; design-only (enforcement is runtime) |
| 12 | **skillify — extract skill from current conversation** | yeachan-heo | Complement `skills/meta` authoring skills | Capture-from-session angle |
| 13 | **Agent role catalog patterns** (model-tier routing, critic/verifier as separate lane, no self-approval) | yeachan-heo | Enrich the 4 `skills/agents/*` | Adapt prose only |
| 14 | **Prototype LOGIC/UI branch routing** (route by question type: state-model vs look) | mattpocock | Upgrade `prototype-before-commitment` | Richer than current single-doc |
| 15 | **Hook event contract taxonomy + privacy env-sanitizer checklist** | claude-mem | Enrich `adapters/hooks/memory-hooks-contract.md`, `privacy-exclusion` | Design-portable; scripts are not |
| 16 | **Bug-fix lifecycle trio (assess → failing test → fix)** | spec-kit `bug` ext | New TDD-anchored bug command | Distinct from existing diagnosis skills |
| 17 | **CONTEXT glossary `_Avoid:` synonyms + flagged-ambiguities log** | mattpocock | Enhance `shared-domain-language` | Format polish |
| 18 | **Karpathy: 4 engineering-discipline principles** (Think-Before-Coding, Simplicity-First, Surgical-Changes, Goal-Driven-Execution) | multica-ai ⚠️ | Original re-write only (license unsafe) | Think+Surgical in `karpathy-engineering-discipline`, Simplicity in `anti-overengineering`, Goal-Driven in new `skills/core/goal-driven-execution` backed by `verification-before-completion` |
| 19 | **Periodic memory digest (timeline-report / weekly-digest)** | claude-mem | New small memory workflow | vibe-os lacks "summarize memory over a period" |

### Tier 3 — Study only / DO NOT MERGE (runtime, scope creep, or out of domain)

- **Team/swarm orchestration engine** (yeachan-heo `src/team/*` ~70 files; tmux, worktrees, mailboxes) — pure runtime; merging it turns vibe-os into a runtime against its philosophy.
- **ralph/ultrawork/autopilot/self-improve loop engines** (yeachan-heo) — SKILL prose describes loops vibe-os can't enforce; risks shipping aspirational non-functional skills.
- **Bun worker + SQLite + Chroma vector search + MCP server + installers** (claude-mem) — full daemon stack.
- **supermemory product surface** (Next.js dashboard, SDKs, connectors, embedding pipelines) — hosted infra.
- **spec-kit Specify CLI + Python scripts + integrations registry + presets engine** — runtime/CLI plumbing.
- **ECC at structural scale** (251 skills / 63 agents / 79 commands) — cherry-pick 3-4 ideas only; never structural import.
- **affaan-m/ECC as a whole** — same problem domain but far larger/commercialized; relevance is idea-level only. Marketing claims (e.g. "182K stars") not credible.
- **mattpocock personal/in-progress/misc skills** (teach, writing, shoehorn, obsidian) — not coding-OS-aligned.
- **superpowers Visual Companion WebSocket server, graph renderer, test runners** — executable code.

---

## Pre-work that must happen regardless (hygiene)

These came up across multiple agents and from the prior repo review:

1. **Fix attribution gaps** — add ECC, yeachan-heo, multica-ai to `ATTRIBUTIONS.md`/`NOTICE.md` (or downgrade their index.json local_targets if no real adaptation).
2. **Resolve multica-ai license** — update `registry/sources.json` note to "MIT declared in metadata only; no LICENSE file/notice — vendoring unsafe"; keep inspiration-only.
3. **De-duplicate the 22 memory skills first** — many are near-identical boilerplate (8 supermemory-derived skills byte-identical except title line). Folding new memory ideas (Tier 1 #6, #7) into EXISTING skills only works if the existing set is cleaned up first.
4. **Fix validator before adding content** — `scripts/validate-repo.mjs` uses a hardcoded list (checks ~56/41/20) while disk has 76/61/34; ~20 skills + 20 commands + 14 templates are unverified. Adding more without fixing this widens the blind spot.
   - **Correction / Status update (2026-06-09):** validator claim above is stale. `npm run validate` now passes and discovers skills/commands/templates dynamically (90 skills, 68 commands, 38 templates). Registry is in sync: skills 90, prompts 68, agents 5, sources 14. Attribution-gap items for ECC, yeachan-heo, and multica-ai remain valid TODOs unless separately fixed.
5. **Refresh stale reference docs** — `affaan-m-ecc.md` mislabels license as unverified and misses the strongest features (continuous-learning, context-budget).

---

## Recommended build sequence

1. **Hygiene gate** (validator dynamic scan + attribution fixes + multica-ai license note + memory dedup). Non-negotiable prerequisite.
2. **Tier 1** (8 high-value portable wins) — biggest convenience-per-effort.
3. **Tier 2** as capacity allows.
4. **Tier 3** stays `candidate_inspiration` in the Reference Intelligence Layer — documented, never vendored.

Each merged item must: (a) be original wording, (b) add an attribution entry, (c) update the relevant `references/features/*.md` and changelog, (d) pass `npm run validate:references`.
