# Panel C — Competitive Landscape + Risk Analysis

**Council member:** Competitive & Risk Analyst
**Date:** 2026-06-20
**Subject:** Persistent AI agent team (identity + memory + personality + self-improvement) across projects
**Adjacent panels:** Panel A (vision) · Panel B (architecture)

---

## 1. Competitive Landscape

### 1.1 Multi-agent frameworks

| Framework | Ephemeral or persistent? | Native memory? | Self-improve loop? | Cost model | Lock-in | vibe-coding-os fit |
|---|---|---|---|---|---|---|
| **CrewAI** | Ephemeral crews, recomposed per run | No (external adapters) | No | Per-LLM token | Low (model-agnostic) | Reuse role/principles concept |
| **AutoGen (Microsoft)** | Ephemeral group chat, per-task | No built-in (relies on context) | No | Per-LLM token | Medium (Azure-flavoured) | Reuse conversational handoff pattern |
| **LangGraph** | Stateful graph, can persist state | Optional (checkpointer) | User-defined | Per-LLM token + infra | Low | Closest analogue to our L5 orchestrator |
| **OpenAI Swarm** | Ephemeral handoffs | No | No | Per-LLM token | High (OpenAI-only) | Lightweight, but shallow — reject as foundation |
| **Anthropic sub-agents** | Per-task tool invocation | No cross-session memory | No | Per-LLM token | High (Claude-only) | Mirrors our `runtime/teams/team-store.mjs`; not identity |
| **Letta (ex-memGPT)** | **Persistent** (stateful server) | **Yes — first-class** | Partial (sleep-time reflection) | Self-hosted infra | Medium | Closest competitor to our proposal |
| **AG2 / Open Interpreter** | Ephemeral | No | No | Per-LLM token | Low | Niche, ignore |

### 1.2 Memory systems

| System | Architecture | Self-improve? | Cross-agent? | Identity-aware? | Cost | Fit |
|---|---|---|---|---|---|---|
| **Mem0** | Extraction + retrieval layer over LLM | Auto-extract, no curation | Shared store | No (per-user, not per-agent) | SaaS or self-host | **High** — adopt as memory adapter |
| **Letta / MemGPT** | Virtual context paging, archival + recall | Sleep-time consolidation | Per-agent | **Yes** (agent = core unit) | Self-host infra | **High** — direct analogue to our vision |
| **Zep** | Temporal knowledge graph | No | Shared | No | SaaS | Medium — graph fits "lessons over time" |
| **Anthropic Memory (Claude API)** | Native, opaque, cross-session | No user control | No | No (global per user) | Bundled | **Avoid as primary** — vendor lock-in, no per-agent scoping |
| **Local JSON + FNV-1a (our `runtime/memory/vector-store.mjs`)** | Offline, deterministic | No (manual) | Yes (scoped by `agent_id`) | Yes (via field) | Free | **Reuse** — extend, do not replace |

### 1.3 What no competitor offers (the gap)

- **Persistent identity + persistent memory + cross-project portability + curated (not auto) self-improvement** — none of the above stacks ship all four together.
- **Local-first with optional cloud sync** — Mem0/Letta are cloud-or-self-host, not local-first with cloud opt-in.
- **Personality/philosophy as first-class contract** — all frameworks treat persona as prompt dressing, not a versioned artifact.
- **User-in-the-loop reflection** — Mem0/Letta auto-write; nobody surfaces drafts for approval before commit.
- **Markdown-first, ADR-disciplined, runtime-frozen integration** — unique to vibe-coding-os (ADR-0002 boundary).

---

## 2. Risks

### 2.1 Critical (block ship if unmitigated)

| Risk | Likelihood | Impact | Mitigation (cite existing assets) |
|---|---|---|---|
| **Memory poisoning** — one bad lesson propagates across all sessions & projects | High | Critical | Memory writes require `agent_id` + `origin_session` + `confidence` (`runtime/memory/memory-store.mjs` `assertKnownFields`); user-approval gate before commit (Panel A §5.10) |
| **Self-improvement loop gaming** — reward hacking, sycophancy, alignment drift | High | Critical | **Never auto-write.** Reflection outputs a *draft* lesson; user curates before commit (Panel A §5.10). Reuse `skills/memory/session-capture/` to require every lesson cite its source |
| **Identity drift** — agent's principles silently mutate | Medium | Critical | Per-agent `principles.md` is git-versioned, separate from mutable `self.md` (Panel B §2.1); consistency check: re-extract principles monthly, diff vs signed baseline |

### 2.2 High (must address before MVP)

| Risk | Mitigation |
|---|---|
| **Agent-to-agent injection** — poisoned agent attacks peers via shared context | Default `agent_id` isolation; cross-agent memory access is explicit opt-in, scoped to `read \| cite`, never `write` (Panel B §2.1 boundary) |
| **Privacy / cross-project pollution** | Memory scope is `global \| project \| branch`, user controls default per agent (Panel A §5.6); redaction on ingest via existing `redactText` (`runtime/memory/memory-store.mjs`) |
| **Cost surprise** — N agents × per-session retrieval × reflection | Hard token budget per agent per session, surfaced; reflection frequency capped (e.g. weekly, not per-session) |
| **Vendor lock-in to Claude API** | Agent bundles are pure markdown + JSON; only the *inference* call is model-bound. Use Mem0 (model-agnostic) as memory layer; local fallback to FNV-1a store (Panel B §2.2) |

### 2.3 Medium (track, fix post-MVP)

| Risk | Mitigation |
|---|---|
| **Personality fatigue** | Default to professional; personality is power-user YAML knob (Panel A §5.3) |
| **Cold-start emptiness** | Ship 3 agents with ≥20 seeded lessons each (Panel A §6.2) |
| **Memory bloat over years** | Periodic compression via `skills/memory/memory-compression/`; user reviews deltas |
| **Composition conflict with existing skills** | ADR before implementation: agent-as-skill-bundle vs agent-as-persona-wrapper (Panel A §5.8) |

---

## 3. Reusable existing pieces

| Capability | Existing file | Reuse as |
|---|---|---|
| Memory store with schema enforcement | `runtime/memory/memory-store.mjs` | Base — extend with `agent_id` required field |
| Offline vector index | `runtime/memory/vector-store.mjs` | Default retrieval backend (no external dep) |
| MCP server with approval gate | `runtime/mcp/server.mjs` | Add per-agent namespaced tools (`agent.<id>.recall`, `agent.<id>.reflect`) |
| Hook system | `.claude/settings.json` (PreToolUse/PostToolUse/SessionStart/Stop) | Wire `session-start-agent-bind.mjs`; reuse Stop hook for reflection trigger |
| Team spec | `runtime/teams/team-store.mjs` | **Do not replace** — orthogonal axis (Panel A §4) |
| 15 memory skills | `skills/memory/*` | Reuse ingestion/retrieval/compression/evaluation taxonomy |
| Agent templates | `templates/claude-subagent-role-*.md` (5 files) | Seed content for starter agents (architect, implementer, reviewer, tester, memory-summarizer, attribution-auditor) |
| Agent registry | `registry/agents.json` | Extend schema with `cloud_memory_enabled`, `mcp_namespace` |
| Council/ADR process | `docs/adr/0002-runtime-scope-freeze.md` | Hard boundary — cloud adapter lives outside `runtime/` |
| Observation citations | `skills/memory/session-capture/` | Mandatory on every memory write |

---

## 4. What must be built from scratch

1. **Agent manifest format** — `agents/<id>/{system.md, principles.md, self.md, skills.json}` (Panel B §2.1)
2. **Per-agent MCP tool namespacing** — `agent.<id>.recall | reflect | cite` resources
3. **Reflection hook** — Stop-hook that drafts lesson, queues for user approval (not auto-commit)
4. **Memory scope controller** — `global | project | branch` resolution at write time
5. **3 seeded starter agents** — Architect / Implementer / Reviewer, each with ≥20 vetted lessons
6. **Memory health dashboard** — size, drift score, last-curated, pending-drafts count
7. **ADR for agent-vs-skill composition** — must resolve before any code

---

## 5. Recommendation

**Build now — Hybrid approach, scoped to MVP from Panel A §4.**

1. **Reuse, do not replace.** Mem0 is the only external dep worth adopting (model-agnostic memory layer). Letta is closest in vision but heavier than we need; defer. Reject OpenAI Swarm, Anthropic Memory (lock-in). Build on our existing `runtime/memory/*` + MCP server.
2. **Hard architectural boundary.** Cloud adapter lives outside `runtime/` per ADR-0002. Local-first default; cloud is opt-in per agent.
3. **User-curated self-improvement only.** This single rule neutralizes the three critical risks (poisoning, gaming, drift). If the user pushes for "fully autonomous reflection," ship a stripped MVP without self-improvement — never ship autonomous writes.
4. **Ship with seeded agents.** Empty agents = dead feature. Three agents with 20+ curated lessons each is the difference between "novelty" and "I can't go back to anonymous prompts."
5. **Defer to v2:** cloud sync, marketplace, agent-vs-agent debate, auto-generated agents, multi-tenant.
6. **Stop conditions:** if reflection drafts exceed 5/week per agent without user curation → simplify; if memory store > 50MB per agent → compression required; if any principle drift detected → freeze agent, require manual reset.

**Verdict:** Highest-value, lowest-regret feature in the current roadmap *if and only if* user-curation and ADR-0002 boundary discipline are non-negotiable. The competitive gap is real and the existing primitives cover ~70% of the build.
