# Council Panel B — Technical Architecture Evaluation
**Idea:** Persistent agent team with identity + knowledge + personality + philosophy + self-improving memory in the cloud, accessed via MCP. Each agent follows the user across projects.
**Panelist role:** Senior Technical Architect
**Date:** 2026-06-20
**Repo baseline:** `vibe-coding-os` v2.13.0 (config), skills/core at v2.16.0

---

## 0. What already exists in the repo (ground truth)

Before designing, I inventoried what we have today — almost every primitive the idea needs is already partially built. The proposal is therefore **integrable, not greenfield**.

| Layer | Existing asset | Location | Reusability |
|---|---|---|---|
| Hook wiring | PreToolUse/PostToolUse/UserPromptSubmit/SessionStart/Stop/SessionEnd hooks; default-deny + audit trail | `.claude/settings.json` | High — already trusted, schema `v1` |
| MCP server | 6 tools: `task.list/next/update`, `memory.search/ingest`, `checkpoint.create`; approval-gate + tool-contract | `runtime/mcp/server.mjs` | High — opt-in runtime, exactly the right shape |
| Memory store | JSON file, atomic writes, schema-enforced, `redactText` on ingest | `runtime/memory/memory-store.mjs` | High |
| Vector index | Offline FNV-1a bag-of-words cosine search, opt-in external provider | `runtime/memory/vector-store.mjs` | Medium — works for semantic-ish retrieval, replace later |
| Teams | Team spec import (`teams.json`), tmux-runner for parallel sessions | `runtime/teams/*` | Medium — designed for *temporary* teams, not persistent identity |
| Memory skills | 15 skills: architecture, ingestion, retrieval, compression, evaluation, provider-adapter | `skills/memory/*` | High — taxonomy already follows "lifecycle roles" |
| Skills index | 88 skills in `skills/core/`, lifecycle-grouped | `skills/core/INDEX.md` | Medium |
| Council pattern | Prior panels (engineering, security, adoption) | `docs/reports/council/` | High — this report slots in |

**Critical constraint from ADR-0002 (referenced in CLAUDE.md): runtime is opt-in and frozen-scope.** Anything Cloud-backed is by definition **outside** the frozen runtime — it must live in Core (skills + commands) or in an external adapter, never inside `runtime/`.

---

## 1. Architecture Overview — proposed layered design

Five layers, each maps to existing repo seams:

```
┌────────────────────────────────────────────────────────────────────┐
│ L5. Orchestrator — user picks agent ("Hire Senior Reviewer")       │
│     claude-code session  ──►  loads agent bundle  ──►  MCP queries │
├────────────────────────────────────────────────────────────────────┤
│ L4. Agent Bundle — per-agent "personality contract"                 │
│     agents/<id>/{system.md, skills.json, principles.md, self.md}    │
├────────────────────────────────────────────────────────────────────┤
│ L3. MCP Server (extended) — per-agent namespaced tools/resources   │
│     agent://<id>/context  · agent.<id>.recall  · agent.<id>.reflect │
├────────────────────────────────────────────────────────────────────┤
│ L2. Memory Layer — cloud-backed, local-cached                       │
│     Cloud: Supabase/Neon (Postgres + pgvector)  OR  GitHub-backed   │
│     Local: runtime/memory/* JSON (cache + offline fallback)         │
├────────────────────────────────────────────────────────────────────┤
│ L1. Identity & Provenance — agent registry + signed ownership      │
│     registry/agents.json + .claude-plugin/agent-<id>/ + audit log  │
└────────────────────────────────────────────────────────────────────┘
```

**Boundary discipline (mirrors ADR-0002):** L1 + L2 + L3 are *adapters/extensions* — they import from `runtime/` but do not modify it. L4 + L5 are pure data + prompt — `agents/<id>/*.md` files, no code.

---

## 2. Component Breakdown

### 2.1 Agent Identity

**Three distinct sub-concerns, three distinct files** (modeled on existing `teams/team-store.mjs` pattern):

1. **Static identity** → `agents/<agent-id>/system.md` — system-prompt section that defines role, voice, principles. Loaded into context like `CLAUDE.md` is today.
2. **Behavioral contract** → `agents/<agent-id>/principles.md` — durable opinions ("never vendor upstream code without attribution", "always run `npm run validate` before merge"). Subset of the project constitution, agent-specific.
3. **Mutable state** → `agents/<agent-id>/self.md` (frontmatter section + body) — `last_active`, `confidence`, `pending_questions`, `lessons_learned`. Updated by reflection step.

**Distinction mechanism:** Every MCP tool call and every memory record carries an `agent_id` field. The system prompt for the active agent is prepended at SessionStart (new hook: `session-start-agent-bind.mjs`). Cross-agent confusion is impossible if `agent_id` is required on every memory write (the runtime's `Enforcement` already supports this — see `assertKnownFields` in `memory-store.mjs`).

**Registry:** `registry/agents.json` — same shape as `registry/skills.json` (already in repo). Fields: `id`, `display_name`, `domain`, `cloud_memory_enabled`, `mcp_namespace`, `last_synced`, `version`.

### 2.2 Memory Layer

**Two-tier, cloud-of-truth with local cache.** This is the same pattern as `runtime/memory/vector-store.mjs` already uses (offline by default, opt-in external provider) — extend it.

| Tier | Where | What | Sync |
|---|---|---|---|
| **Working** | In-context (system prompt + tool results) | Last 5–10K tokens, current task | Live |
| **Project cache** | `runtime/memory/memory.json` (existing) | Last 90 days, project-scoped | Bidirectional, debounced |
| **Cloud of record** | Cloud Postgres / GitHub / S3 (user choice) | All-time, cross-project, agent-tagged | Push on Stop, pull on SessionStart |
| **Embeddings** | `runtime/memory/indexes/memory-vectors.json` (local) + cloud pgvector | Semantic recall | Rebuild on demand |

**Storage options for cloud layer (compared in §3):** all three preserve the "local-first, opt-in cloud" principle already in `vector-store.mjs:resolveProviderOptions`.

**Privacy:** keep `redactText` (already in `runtime/core/privacy.mjs`) as the gate. Anything reaching cloud must pass the same redaction. Add a per-agent `sensitivity` ceiling: e.g., `Senior Reviewer` can ingest redacted diffs but not raw secrets; `Personal Coach` agent can ingest reflections but not code.

### 2.3 MCP Server (extended)

The current `runtime/mcp/server.mjs` exposes 6 tools at the project level. Extend with **per-agent namespacing** without changing the existing surface:

**New resources (read-only context):**
- `agent://<id>/system` — full system prompt section
- `agent://<id>/principles` — durable opinions
- `agent://<id>/recent` — last N memories, newest first
- `agent://<id>/related?query=…` — semantic recall result set
- `agents://registry` — list of available agents

**New tools (write, approval-gated like existing `memory.ingest`):**
- `agent.<id>.recall({query, limit})` → ranked memory hits
- `agent.<id>.reflect({lesson, confidence, tags})` → writes to self.md + memory
- `agent.<id>.learn({principle, evidence})` → proposes addition to principles.md (requires human review gate)
- `agent.cross.handoff({from, to, summary})` → inter-agent message

**Risk contract:** all new tools reuse the existing `defaultContracts` + `approval-gate` plumbing in `runtime/core/`. No new security model needed.

### 2.4 Orchestration

**Explicit recommendation: one-agent-at-a-time, with cross-agent handoff via MCP.** Not multi-thread, not CrewAI-style fan-out.

**Why not multi-agent threads:**
- Current `.claude/settings.json` `default_deny` + `untrusted_hooks_blocked` is **single-session security model**. Multi-agent threads break audit trail linearity.
- The `tmux-runner.mjs` exists for parallel work but is documented as "temporary teams" (per `teams/team-store.mjs`). Persistent identity needs the opposite of temporary.
- Cost: each parallel thread burns tokens, no shared context window = duplicate retrieval.

**Why one-at-a-time with handoff works:**
- User invokes `claude --agent senior-reviewer` (or future `vibe-hire senior-reviewer` command).
- Agent loads its bundle + recalls cloud memories via MCP.
- When done, writes a structured handoff note to `agents/<to-id>/inbox.md`.
- User (or the next agent) picks up the inbox on next SessionStart.

This is **the "specialist follows the user" idea, faithfully interpreted** — the user is the orchestrator, the agents are sequential consultants, not parallel peers. CrewAI/Autogen would be wrong here because they erode ownership of decisions.

### 2.5 Self-Improvement Loop

Three escalating mechanisms, each independently deployable:

**Mechanism A — Reactive (zero infra):** existing `Stop` hook (`stop-session-snapshot.mjs`) writes to `docs/sessions/<timestamp>.md`. Add a **second Stop hook** `stop-agent-self-review.mjs` that prompts the agent (next session): "Given what you learned this session, should any of these be promoted to durable memory or principles?" — agent answers via MCP `agent.<id>.reflect`. This is the lowest-risk entry point.

**Mechanism B — Periodic review (cron / user-triggered):** add command `vibe-agent-review <agent-id>`. Pulls last N reflections, asks agent to consolidate: "Three recent reflections contradict your principle X. Resolve." Output is a **PR** to `agents/<id>/principles.md` — human reviews. This is the GitHub-native path: improvements are reviewable, attributable, reversible.

**Mechanism C — Cross-project learning:** a `vibe-agent-sync` command pulls reflections from cloud memory across all projects an agent has touched, surfaces patterns. Highest value, highest risk — must default OFF.

**What self-improvement must NOT do:** auto-mutate `principles.md`. The architectural-decision-records skill (already in `skills/core/`) explicitly treats principle changes as reviewable artifacts. Auto-mutation violates that.

---

## 3. Tech Stack Options

### Memory storage — 3 options

| Option | Strengths | Weaknesses | Fit |
|---|---|---|---|
| **A. Anthropic Messages API + project-scoped caching** | Zero infra, hosted by model vendor, native prompt caching | Vendor lock-in, no cross-project portability, no semantic recall of past sessions, cost scales with conversation length | **MVP** — works today with `claude --agent` + a flag |
| **B. Self-hosted Postgres + pgvector on Supabase/Neon/Railway** | Real semantic recall, portable, cheap ($0–25/mo), row-level `agent_id` partition, easy RLS for per-user privacy | Need a thin sync daemon, schema migrations, embeddings pipeline | **V1.0** — the right long-term home |
| **C. GitHub-backed (markdown files in private repo, or `gh-pages` JSON)** | Free, version-controlled, PR-reviewable, attribution-clean (already the repo's model) | No real semantic search, slow at scale (>10K memories), no offline → online sync (online is the source) | **Reject** for the *memory* layer; **keep** for *principles.md* and *self.md* (they're text, version-controlled is correct) |

### MCP server — 3 options

| Option | Strengths | Weaknesses | Fit |
|---|---|---|---|
| **A. Extend existing `runtime/mcp/server.mjs`** | Already opt-in, already approval-gated, already uses `@modelcontextprotocol/sdk` lazily; zero new dependency; preserves ADR-0002 boundary | Per-agent namespacing inflates tool count (8 agents × 4 tools = 32); discoverability gets worse | **MVP** — add namespacing, document tool prefix convention |
| **B. Separate per-agent MCP servers (8 stdio processes)** | Clean isolation, one agent's memory is not addressable by another without explicit handoff | Process overhead, harder to debug, doesn't compose | **Reject** for MVP; consider for paranoid mode |
| **C. Remote MCP server (SSE/HTTP) shared across machines** | Single source of truth, multi-device, real cloud | Needs auth, TLS, rate limiting — a whole new subsystem | **V2** — only after cloud memory lands |

### Orchestration — 3 options

| Option | Strengths | Weaknesses | Fit |
|---|---|---|---|
| **A. Sequential, user-as-orchestrator (current pattern extended)** | Honest to the model, every decision is reviewable, no thread-safety bugs, fits existing audit trail | User must consciously hand off; can feel slow | **MVP — recommended** |
| **B. LangGraph / AutoGen-style stateful graph** | Strong for workflows that genuinely need state machines (e.g., TDD loops) | Heavy dependency, fights the local-first model, obscures the audit trail | **Reject** — wrong layer |
| **C. CrewAI role-based crew** | Good for parallel exploration of design options | Token cost 5–10×, agent identity gets muddied in shared context | **Reject for persistent agents**; the existing `parallel-exploration` command already covers the use case |

---

## 4. Feasibility Assessment

**Easy (weeks):**
- Agent bundle files (`agents/<id>/*.md`) — pure markdown, mirrors `skills/<skill>/SKILL.md` pattern exactly.
- Extend `runtime/mcp/server.mjs` with 4 new tools + 5 new resources — additive change, no schema break.
- New SessionStart hook `session-start-agent-bind.mjs` — sibling of existing hooks.
- `vibe-hire <agent-id>` command — new file in `commands/`, references `agents/<id>/system.md`.

**Medium (1–2 months):**
- Cloud memory sync daemon — needs a thin Node service, retries, conflict resolution.
- Cross-project reflection consolidation — requires non-trivial LLM-as-judge logic, need eval suite.
- Agent registry UI (CLI at minimum).

**Hard (3+ months):**
- True cross-machine agent portability (auth + sync + conflict resolution).
- Anti-memory-poisoning: an agent learning bad habits from one project and propagating them to another. Needs a per-principle confidence score with provenance.
- Cost model: if each cloud memory pull adds 2–5K tokens to context, and a typical session does 10–20 pulls, context window fills up. Need retrieval ranking + hard token budget.

**Impossible (with current model class):**
- A model that genuinely *learns* in the parameter-update sense. Self-improvement here is **prompt-and-document-level** evolution, not weight-level. The user's word "self-improving" should be read as "the agent's working definition of itself evolves" — that's achievable. "The agent gets smarter over time" is not, and the architecture must be honest about this.

---

## 5. Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Identity confusion** — agent A writes memory tagged as agent B | Med | High | Make `agent_id` a required, non-overridable field on every write; enforce in `Enforcement.assertKnownFields` (already the pattern). |
| **Memory poisoning** — adversarial content ingested via reflection | Med | High | `redactText` on ingest (exists); add a `sensitivity` ceiling per agent; cross-agent writes require explicit human approval. |
| **Context window pollution** — too many memories pulled, drowns the actual task | High | Med | Token budget per recall call (e.g., max 4K tokens of memories); rank by relevance + recency; never inject full memory content, always summarized. |
| **Vendor lock-in** to Anthropic memory API | High (if option A) | Med | Storage layer is abstracted behind `vector-store.mjs:resolveProviderOptions`-style adapter; can swap providers without code changes to agents. |
| **Cost runaway** — cloud memory + embeddings + retrieval at scale | Med | Med | Per-agent token budget; local-first by default; cloud sync is opt-in per agent. |
| **Latency** — MCP round-trip on every recall adds 100–500ms | Med | Low | Local cache of last-N memories; only fetch from cloud if cache miss + confidence threshold. |
| **Drift** — `principles.md` accumulates contradictions over time | High | Med | Periodic review (Mechanism B) generates a PR; human gate; reject auto-merge. |
| **Audit trail fragmentation** — agent actions split across projects | Low | High | Tag every event in `runtime/core/event-store.mjs` with `agent_id` + `project_id`; surface in existing audit dashboard. |
| **"Self-improving" hype mismatch** — user expects model-level learning, gets prompt-level evolution | Med | Med | Be explicit in agent docs; reframe as "the agent's working definition of itself evolves with your review." |

---

## 6. Recommended MVP Architecture

**Goal:** prove the "specialist follows the user across projects" idea in 4–6 weeks, on top of existing infrastructure, with zero changes to `runtime/` core.

### Components (in order of delivery)

1. **`agents/` directory + 2 example agents** (`senior-reviewer`, `personal-coach`)
   - `agents/<id>/system.md` — role, voice, scope
   - `agents/<id>/principles.md` — 5–10 durable opinions, cross-project
   - `agents/<id>/self.md` — frontmatter state + body notes
   - Convention: same shape as `skills/<skill>/SKILL.md` (Purpose/When/Workflow/etc.)
2. **`registry/agents.json`** — list agents, with `cloud_memory_enabled: false` default
3. **Extend `runtime/mcp/server.mjs`** with:
   - Resources: `agent://<id>/system|principles|recent`, `agents://registry`
   - Tools: `agent.<id>.recall`, `agent.<id>.reflect`, `agent.<id>.learn`, `agent.cross.handoff`
   - All wrapped in existing `withApprovalGate` + `assertToolAllowed`
4. **New hook** `session-start-agent-bind.mjs` — prepends `agents/<id>/system.md` to context if `--agent <id>` flag is set
5. **New command** `vibe-hire <agent-id>` — wraps the bind + memory recall into one prompt
6. **New Stop hook** `stop-agent-self-review.mjs` — asks the agent to write a reflection via MCP on session end
7. **Documentation**: `docs/agents/README.md` — how to author an agent, principles of self-improvement honesty, what "follows the user across projects" actually means (cloud sync is V1.1, not MVP)

### Explicitly NOT in MVP

- Cloud sync (use local `runtime/memory/memory.json` for MVP)
- Multi-agent threads
- Auto-mutation of principles
- Per-agent MCP server processes
- External embedding provider (the existing FNV-1a local embedder is good enough to prove recall quality)

### Success criteria for MVP

- [ ] `vibe-hire senior-reviewer` loads a cross-project context that references work done in a *different* repo by the same user in a previous session
- [ ] Reflection written at end of session A is recalled as relevant in session B (in a different repo)
- [ ] Principles changes go through a PR, not silent mutation
- [ ] All agent memory writes are auditable in the existing `docs/security/session-audit/` trail
- [ ] No code added to `runtime/core/` — ADR-0002 boundary preserved

### When to graduate MVP → V1.0

Triggered by: (a) > 5 active agents, (b) > 1000 memories per agent, OR (c) user wants true cross-device access. At that point introduce Supabase/Neon as the cloud of record and the sync daemon.

---

## 7. Honest Limitations

The proposal's marketing — "each agent like a real specialist following the user across projects" — is achievable, but the "real specialist" framing is a metaphor. What we can deliver:

✅ Persistent prompt + memory + principles across projects
✅ Cross-project recall via MCP
✅ Human-reviewable evolution of the agent's working definition
✅ Audit trail consistent with existing security posture

What we cannot deliver (and should not pretend to):

❌ The agent getting *smarter* in any measurable, model-weights sense
❌ True autonomous self-improvement (every principle change needs a human)
❌ Continuous memory without a sync boundary (network/privacy/audit constraints)
❌ Multiple agents reasoning together in one context window (one-at-a-time is a feature, not a limitation)

The architecture above is honest about the boundary. That's what makes it shippable.

---

**Status:** Architecture recommended. See Panel A (vibe-coder) and Panel C (quality-engineer) for adjacent evaluations before final council synthesis.
