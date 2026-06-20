# Council Synthesis — Persistent Agent Team Idea

**Date:** 2026-06-20
**Council:** Panel A (Product Vision), Panel B (Architecture), Panel C (Competition & Risk)
**Subject:** User idea: "Build a team of AI agents with persistent identity + knowledge + personality + philosophy + self-improving memory. Each agent like a real specialist following the user across projects. Memory initially in cloud, then build MCP to retrieve."
**Adjacent reports:**
- `agent-team-idea-panel-A-product-vision.md` — user stories, MVP scope, UX risks
- `agent-team-idea-panel-B-architecture.md` — 5-layer design, tech stack options, feasibility
- `agent-team-idea-panel-C-competition-risks.md` — CrewAI/AutoGen/Letta/Mem0 landscape, risks

---

## 1. Restatement (1 sentence)

Treat LLM agents like **long-term employees**, not throwaway function calls — a named, persistent cast of specialist agents (Architect / Implementer / Reviewer / Tester / Security) with stable identity, voice, principles, and curatable memory that follows the user across repos, improves via user-reviewed reflection (not autonomous write), and is exposed to the model through MCP tools namespaced per-agent.

---

## 2. Council Verdict

| Panel | Verdict | Confidence |
|---|---|---|
| **A — Product Vision** | **BUILD** — but MVP must ship 3 seeded agents or users bounce on day 1 | High |
| **B — Architecture** | **BUILD** — 70% of primitives already exist, rest is additive, ADR-0002 boundary is respected | High |
| **C — Competition & Risk** | **BUILD (hybrid)** — clear gap nobody fills, three critical risks collapse into ONE rule: never auto-write, user curates | High |

**Unanimous verdict: BUILD.** The competitive gap is real, the existing primitives cover ~70% of the work, and the risks are *all* neutralized by one architectural rule (user-curated reflection, no autonomous write).

**Net honest framing:** highest-value, lowest-regret feature in the current roadmap **if and only if** user-curation discipline and the ADR-0002 boundary are non-negotiable.

---

## 3. What pain points does this solve (cross-panel synthesis)

| Pain point | Today | With agent team |
|---|---|---|
| "LLM forgot my preferences" | Re-paste coding style every prompt | Persistent user-style memory per agent |
| "Generic suggestions for everything" | Same tone for security, perf, UX | Role-specialised agents |
| "I have to re-onboard AI on every repo" | Start from zero each session | Cross-project memory follows user |
| "Security agent is only as paranoid as I push it" | One-shot vibe-coded review | Persistent "paranoid" agent whose principles are versioned |
| "I keep repeating the same bug pattern" | No regression memory | "QA" agent that remembers your mistakes |
| "LLMs are mercenaries, not colleagues" | Each session is anonymous | Named specialists with backstories you can `@mention` |
| "I can't inspect what the AI 'learned'" | Black-box memory | Markdown files + git-versioned principles, user-editable |
| "Want specialist per project phase" | Manual prompt engineering | Pre-tuned personas (Architect / Implementer / Reviewer / Tester) |

**What it does NOT solve (explicit non-claims):**
- Does NOT make the model "smarter" in the parameter-update sense — self-improvement is prompt/document-level evolution only.
- Does NOT replace the existing `runtime/teams/team-store.mjs` — that solves *orchestration* (who runs when); agents solve *identity* (who am I over time). Orthogonal axes.
- Does NOT replace skills — agents *bundle* skills; skills remain the atomic unit.

---

## 4. The gap nobody fills (from Panel C)

| Capability | CrewAI | AutoGen | LangGraph | OpenAI Swarm | Letta | Mem0 | Anthropic Memory | **This idea** |
|---|---|---|---|---|---|---|---|---|
| Persistent identity (cross-session) | ❌ | ❌ | partial | ❌ | ✅ | ❌ | ❌ | ✅ |
| Per-agent memory | ❌ | ❌ | partial | ❌ | ✅ | ❌ | ❌ | ✅ |
| Cross-project portability | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Personality as versioned contract | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Curated** self-improvement (user approves writes) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Local-first + optional cloud | ❌ | ❌ | ❌ | ❌ | partial | ❌ | ❌ | ✅ |
| Markdown-first, ADR-disciplined | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

**The two columns nobody else fills:** curated (user-in-the-loop) self-improvement, and markdown-first/ADR-disciplined. Both are *earned* advantages of vibe-coding-os's existing posture.

---

## 5. The three critical risks — collapse into ONE rule

| Critical risk | One-line mitigation |
|---|---|
| Memory poisoning — bad lesson propagates | `agent_id` + `origin_session` + `confidence` required; user-approval gate before write |
| Self-improvement loop gaming (sycophancy, reward hack, alignment drift) | **Never auto-write.** Reflection produces a *draft*; user curates |
| Identity drift — principles silently mutate | `principles.md` is git-versioned, separate from mutable `self.md`; monthly consistency check |

**The rule:** *No reflection output becomes persistent memory without explicit user approval, surfaced as a reviewable artifact (markdown diff or PR).*

This single rule neutralizes the dangerous three. If the user later pushes for "fully autonomous reflection," the right answer is **ship a stripped MVP without self-improvement — never ship autonomous writes.**

---

## 6. Architecture — recommended MVP (from Panel B)

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

**ADR-0002 boundary is preserved:** cloud is an *adapter* that lives outside `runtime/`. Local-first is default; cloud is opt-in per agent.

**Tech-stack decisions for MVP:**

| Layer | MVP choice | Why |
|---|---|---|
| Memory storage | **Extend existing `runtime/memory/*` (JSON + FNV-1a)** | Already shipped, schema-enforced, redaction built in. Defer Postgres+pgvector to v1.0 |
| MCP server | **Extend `runtime/mcp/server.mjs`** | Already opt-in, approval-gated. Add per-agent tool namespacing (`agent.<id>.recall`, `agent.<id>.reflect`, `agent.<id>.cite`) |
| Orchestration | **Sequential, user-as-orchestrator** | Honest to model, every decision reviewable, fits existing audit trail. Reject LangGraph/CrewAI for persistent agents |
| Cloud adapter | **Mem0** (model-agnostic, optional) | Only external dep worth adopting. Defer to v1.0 |

---

## 7. MVP scope vs deferred (cross-panel consensus)

### MVP (v0 — ship first, 4–6 weeks)

1. **Agent manifest format** — `agents/<id>/{system.md, principles.md, self.md, skills.json}`
2. **3 seeded starter agents** — Architect / Implementer / Reviewer, each with ≥20 curated lessons
3. **Extend MCP server** — `agent.<id>.recall`, `agent.<id>.reflect`, `agent.<id>.cite` (namespaced, approval-gated)
4. **New SessionStart hook** — `session-start-agent-bind.mjs` to load agent bundle
5. **New Stop hook** — `stop-agent-self-review.mjs` that drafts lesson, queues for user approval
6. **Command `vibe-hire <agent-id>`** — switches session to that agent
7. **Memory scope controller** — `global | project | branch` resolution at write time
8. **ADR-0005 (new)** — agent-vs-skill composition contract
9. **Memory health dashboard** — size, drift score, last-curated, pending-drafts count

### v1.0 (defer — 2–3 months)

- Cloud memory sync daemon (Postgres + pgvector, Supabase/Neon)
- `vibe-agent-review <agent-id>` periodic reflection PR generator
- Cross-project memory consolidation (`vibe-agent-sync`)
- Cost budget surfaced per agent per session

### v2.0 (defer — long term)

- Agent-to-agent explicit handoff (still sequential, but inbox-style)
- Multi-tenant / shared agent marketplace
- Auto-generated agents from skill cluster
- Multi-machine sync with conflict resolution

### Hard NO (build never)

- Autonomous memory writes (no user approval)
- Auto-mutation of `principles.md`
- Agent-to-agent write access (read/cite only)
- Cloud-only memory (local-first is the default, forever)

---

## 8. Composition conflict — must be resolved BEFORE code

Existing skills are **called** by agents. Agents would **own** skills. This is a contract decision that must land in ADR-0005 before any code ships.

**Two viable patterns:**

| Pattern | Description | Trade-off |
|---|---|---|
| **A. Agent-as-skill-bundle** | An agent = `{system.md + skills.json + principles.md + self.md}`. Agent bundles skills the way skills bundle scripts. Skills remain atomic. | Clean, composable, but two layers of "meta" (skills-in-skill, agent-of-skill) |
| **B. Agent-as-persona-wrapper** | An agent = thin wrapper that *loads* a curated set of skills via existing skill-loading mechanism. Agent is just a persona + memory pointer. | Reuses existing skill loader, but agent ↔ skill boundary is fuzzy |

**Recommendation:** Pattern A. Agent-as-skill-bundle makes the composition explicit and versioned. Pattern B is cheaper to ship but creates the kind of implicit coupling that has bitten us before.

---

## 9. UX risks (from Panel A — call out for product owner)

1. **Cold-start emptiness** — empty agents = dead on arrival. *Mitigation: ship ≥20 seeded lessons per starter agent.*
2. **"Self-improving" hype trap** — without user curation, agent accumulates noise. *Mitigation: every reflection is a draft PR, not an auto-commit.*
3. **Personality fatigue** — quirky voice is fun for 5 minutes, annoying by Tuesday. *Mitigation: agents default professional; personality is power-user knob.*
4. **Identity drift** — after 200 lessons, "Ada the architect" becomes "Ada the generalist" silently. *Mitigation: per-agent `principles.md` consistency check monthly.*
5. **Cross-project pollution** — agent that learned "user hates TypeScript" in project A pushes that bias into project B. *Mitigation: memory scope is `global | project | branch`, user controls default.*
6. **Privacy** — agent memory = user behavior log. *Mitigation: ship local-first, cloud is opt-in per agent, redaction on ingest via existing `redactText`.*
7. **Cost surprise** — N agents × per-session retrieval × reflection. *Mitigation: hard token budget per agent per session, surfaced.*
8. **Composition with existing skills** — today skills are *called*; agents would *own* skills. *Mitigation: ADR-0005 before code.*

---

## 10. Top 10 follow-up actions (priority order)

| # | Action | Owner | Effort |
|---|---|---|---|
| 1 | **User decision: green-light MVP scope?** | User | Now |
| 2 | Draft ADR-0005 (agent-vs-skill composition contract, Pattern A) | Panel B lead | S |
| 3 | Design agent manifest schema (YAML + JSON Schema) | Panel B lead | S |
| 4 | Write 3 starter agent bundles (Architect, Implementer, Reviewer) — ≥20 lessons each | Panel A + community | M |
| 5 | Extend `runtime/mcp/server.mjs` — 3 namespaced tools, approval-gated | Panel B | S |
| 6 | Implement `session-start-agent-bind.mjs` hook | Panel B | S |
| 7 | Implement `stop-agent-self-review.mjs` (draft-only, user-approval-gated) | Panel B | M |
| 8 | Memory scope controller (`global \| project \| branch`) | Panel B | M |
| 9 | `vibe-hire <agent-id>` command | Panel A | S |
| 10 | Memory health dashboard + drift score | Panel C | M |

---

## 11. The one-question decision needed

> **"Is MVP scope (Section 7) the right v0, or do you want to start smaller (just the manifest + 1 agent as a proof) or larger (include cloud memory in v0)?"**

Three reasonable answers:

- **A. Ship MVP as defined** — 4–6 weeks, 9 work items, validated end-to-end. (Recommended.)
- **B. Proof-of-concept first** — 1–2 weeks, just `agents/architect/{system,principles,self}.md` + 1 MCP tool + 1 hook. Validate UX before scaling.
- **C. Full cloud stack in v0** — include Postgres+pgvector + cross-project sync. 2–3 months. Skips the local-first guarantee.

**Council's pick: A.** PoC risks underinvesting; full cloud risks ADR-0002 violation and burns trust on day 1.

---

## 12. Closing note

This idea has unusually strong convergence across panels because **the repo's existing posture (markdown-first, ADR-disciplined, runtime-frozen, opinionated quality) is the differentiator.** Most of the multi-agent market is racing toward autonomous agents; vibe-coding-os can ship a *curated* agent team — slower, more disciplined, more trustworthy — and that is the gap.

The single risk that breaks everything is "let the agent write its own memory." The single rule that prevents that is "every reflection is a draft, user curates." Hold that line and the rest is implementation.

**Verdict: BUILD. With discipline. Local-first, user-curated, ADR-disciplined.**
