# Panel A — Product Vision: Persistent AI Agent Team

**Council member:** Product/UX Visionary
**Date:** 2026-06-20
**Subject:** "Team of AI agents with persistent identity, knowledge, personality, philosophy, self-improving memory — like real expert team members accompanying the user across projects."

---

## 1. Concept Restatement

The user wants a **named, persistent cast of specialist AI agents** — not anonymous prompts or generic subagents. Each agent has:

- **Identity** — stable name, role, backstory (e.g. "Ada — systems architect, prefers DDD")
- **Knowledge** — domain-specific skills, curated reference material, project-agnostic expertise
- **Personality & philosophy** — voice, decision style, code aesthetics, trade-off bias
- **Persistent memory** — survives across sessions and repos (initially cloud-hosted, later an MCP server the user owns)
- **Self-improvement loop** — the agent gets *smarter* over time from feedback, lessons, corrections
- **Cross-project portability** — the same "team" follows the user into any repo

In one sentence: **treat LLM agents like long-term employees, not throwaway function calls.**

The closest existing precedent in vibe-coding-os is `runtime/teams/team-store.mjs` (a team *spec* with roles + orchestration pattern), but it is **session-scoped** — a team is composed per-task, has no name, no memory, and disappears after the run. The idea pushes from "ephemeral task team" to "permanent company of specialists."

---

## 2. User Stories

1. **As a solo developer, I want a named "reviewer" agent that remembers my coding style** so that PR feedback is consistent across repos, not re-explained every session.
2. **As a tech lead, I want a roster I can `@mention` (e.g. `@ada design the schema`)** so that I pick the right specialist instead of hoping the LLM picks well.
3. **As a learner, I want agents that remember what I already know** so that explanations don't re-teach basics and skip ahead when I'm ready.
4. **As a multi-project user, I want my agents to follow me from `vibe-coding-os` to `my-saas-app`** so that I don't re-onboard them every time.
5. **As someone shipping a product, I want a "security" agent whose philosophy is paranoid** so that it consistently raises red flags even when I push to ship fast.
6. **As a team-of-one, I want a "QA" agent that learns from past bugs I shipped** so that regression patterns I keep repeating get caught earlier.
7. **As a power user, I want to inspect and edit an agent's memory** so that I can correct wrong lessons it learned.
8. **As a privacy-conscious user, I want to know where my agent's memory lives** so I can decide cloud vs local vs hybrid.

---

## 3. Pain Points Solved (vs current single-agent model)

| Current pain | Today's behavior | Agent-team fix |
|---|---|---|
| "LLM forgot my preferences" | Re-paste coding style every prompt | Persistent user-style memory per agent |
| "Generic suggestions" | Same tone for security, perf, UX | Role-specialised agents with bias |
| "Re-explaining project context" | Long CLAUDE.md dumps every session | Agent has its own compressed project log |
| "Wrong specialist picked" | One model, hoping it role-plays well | User explicitly names an agent |
| "Lessons evaporate" | `lessons-learned-db` is project-scoped | Agents carry lessons across projects |
| "Personality is bland" | Output style set globally in CLAUDE.md | Per-agent voice + philosophy |
| "Self-improvement is invisible" | No feedback loop at agent level | Each agent has its own memory + reflection cycle |

The current `runtime/teams/team-store.mjs` solves **orchestration** (who runs when). This idea solves **identity** (who am I over time) — the missing axis.

---

## 4. MVP Scope vs Future

### MVP (ship in v1 of "Agent Teams" feature)
- **Agent manifest** — a YAML/JSON file per agent (`agents/ada.yaml`): name, role, philosophy, skills refs, memory adapter, voice prompt
- **3 starter agents** out of the box: e.g. Architect, Implementer, Reviewer (matching existing `skills/agents/`)
- **Local-first memory** — file-backed store under `runtime/memory/agents/<name>/` (leveraging existing `skills/memory/local-first-memory/`)
- **MCP memory server** — single MCP tool `agent_memory(agent, query, write)` reading from local store, optional cloud sync later
- **Cross-project loading** — `agents/` directory at user-home level (~/.vibe/agents/) auto-loaded when entering any repo
- **Self-improvement**: post-session reflection hook that writes 1–3 lessons per agent per session, user approves before commit

### Nice-to-have (defer)
- Cloud sync (Drive/Notion/S3) — start local, build sync only after local is solid
- Agent-vs-agent debate orchestration — complex, niche, separate ADR
- Personality editor UI — text-only YAML is fine v1
- Agent marketplace / sharing — privacy + licensing rabbit hole
- Auto-generated agents from a description — quality is unproven

### Explicitly NOT in scope
- Replacing `runtime/teams/team-store.mjs` (orchestration) — orthogonal axis
- Multi-tenant / team-of-teams — needs multi-user thinking, defer to v3
- Voice cloning / TTS — drift from "expert team member" core

---

## 5. UX Risks

These are where users will *actually* get stuck. Brutally honest list:

1. **Cold start is empty.** New agent = zero memory = no demonstrable benefit. Users will judge on day 1 and bounce. *Mitigation: ship 3 agents with 20+ seeded lessons each.*
2. **Memory is invisible.** If an agent silently "remembers" the wrong thing, the user will trust it less, not more. *Mitigation: every agent action must cite which memory entry drove it (existing `skills/memory/observation-citations/`).*
3. **Personality fatigue.** "Quirky voice" is fun for 5 minutes, annoying by Tuesday. *Mitigation: agents default to professional; personality is a power-user knob.*
4. **Identity drift.** After 200 lessons, did "Ada the architect" become "Ada the generalist"? No telemetry to detect this. *Mitigation: per-agent memory health dashboard + "consistency" check.*
5. **Cloud-memory privacy trap.** The user said "stored in cloud initially." A team of agents with persistent memory is a privacy nightmare if it leaks. *Mitigation: ship local-first; cloud is opt-in per agent with redaction by default.*
6. **Cross-project pollution.** An agent that learned "user hates TypeScript" in project A will push that bias into project B. *Mitigation: memory is scoped `global | project | branch` and user controls.*
7. **Cost surprise.** Per-agent per-session retrieval + reflection = compounding token cost. *Mitigation: hard budget per agent per session, surfaced to user.*
8. **Composition with existing skills.** Today skills are *called*. Agents would *own* skills. Conflict surface. *Mitigation: ADR before implementation — define agent-as-skill-bundle vs agent-as-persona wrapper.*
9. **Cold-start of cross-project loading** — when user opens a new repo, what context does the agent get? Re-onboarding problem reappears.
10. **"Self-improving" is a hype word.** Concrete: reflection hook writes to memory store, user curates. Without user curation, the agent accumulates noise, not signal.

---

## 6. Top Recommendations

1. **Build on what exists.** Reuse `skills/agents/*`, `skills/memory/*`, and `runtime/teams/team-store.mjs` — don't fork them. The manifest is a new file type; memory is a new adapter; the rest stays.
2. **Ship 3 agents with seeded memory on day 1.** Empty agents = dead on arrival.
3. **Local-first memory, cloud optional.** Reverses privacy risk; respects the user's "MCP server I own" instinct.
4. **Citations on every agent action.** Memory without citation is folklore.
5. **One ADR, one feature flag.** Do not let "agent teams" leak into the runtime core (ADR-0002 freezes it). New feature lives in `plugins/agent-teams/` opt-in.
6. **User-curated reflection, not auto-write.** Self-improvement with user-in-the-loop > autonomous drift.
7. **Measure:** before/after task completion time, user-reported "had to re-explain" count, memory-store size. Without metrics the feature is vibes.
8. **Defer everything multi-user / cloud-sync / marketplace** until local-first is loved.