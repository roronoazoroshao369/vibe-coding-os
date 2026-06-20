# 🚀 Persistent Agent Team Idea — Council Audit (3 Panels + Synthesis)

**Date:** 2026-06-20
**Status:** ✅ HOÀN TẤT — pushed `23bc92d`
**Verdict:** BUILD (unanimous, 3/3 panels)

---

## 📋 Bối cảnh

Bạn nêu ý tưởng:

> *"Repo có thể build những agent với chức năng và kiến thức khác nhau, họ có bộ skill cũng như tính cách và triết lý riêng. Mỗi agent có 1 bộ nhớ riêng và nó đi theo suốt đời (lưu cloud rồi build MCP để lấy dữ liệu). Đại khái là build hẳn 1 team agent để đi theo mình và làm việc cùng mình, họ tự improve, tự cải thiện, tự thông minh dần lên. Họ có nơi lưu trữ toàn bộ bộ nhớ của chính họ, giống như 1 con người 1 cá nhân thực thụ với tài năng và triết lý cũng như kiến thức riêng biệt, đồng hành cùng người dùng trong suốt quá trình làm việc từ dự án này đến dự án khác. Một đội ngũ chuyên gia."*

Câu hỏi của bạn:

1. Hội đồng hiểu ý tưởng chưa?
2. Có khả thi không?
3. Giải quyết được issue nào?
4. Còn issue nào chưa giải quyết được?

---

## 🎯 Câu trả lời ngắn (TL;DR)

**Có, khả thi — và là feature giá trị nhất, ít rủi ro nhất trong roadmap hiện tại.** Hội đồng 3 panels unanimous BUILD.

### Tóm tắt 1 câu
**"Coi LLM agents như nhân viên lâu năm, không phải throwaway function call."**

### Tóm tắt 3 điểm chính

1. **70% infrastructure đã có sẵn** — memory store, MCP server, hooks, agent templates, registry. Idea là **integrable, không phải greenfield**.

2. **Gap không ai lấp** — persistent identity + per-agent memory + cross-project portability + **curated** self-improvement + local-first. CrewAI/AutoGen/LangGraph/Mem0 đều không có đủ cả 5 trụ cột này.

3. **3 rủi ro critical collapse vào 1 quy tắc duy nhất** — *"không cho agent tự viết memory; mọi reflection phải là draft PR, user curate"*. Quy tắc này vô hiệu hóa memory poisoning, self-improvement loop gaming, và identity drift cùng lúc.

---

## 📚 Báo cáo chi tiết (4 files, 706 dòng)

Đã commit vào `23bc92d`:

| File | Dòng | Nội dung |
|---|---|---|
| `agent-team-idea-panel-A-product-vision.md` | 104 | Product/UX vision — 8 user stories, MVP vs defer, 10 UX risks |
| `agent-team-idea-panel-B-architecture.md` | 265 | Senior architect — 5-layer design, tech stack options, feasibility |
| `agent-team-idea-panel-C-competition-risks.md` | 114 | Competitive + risk analyst — CrewAI/AutoGen/Letta/Mem0 landscape |
| `agent-team-idea-COUNCIL-SYNTHESIS.md` | 222 | Cross-panel synthesis — verdict, MVP scope, top 10 actions |

**GitHub:** https://github.com/roronoazoroshao369/vibe-coding-os/tree/main/docs/reports/council

---

## 🧠 Hội đồng hiểu ý tưởng thế nào?

Hội đồng restate lại thế này:

> **Một cast agents chuyên gia có tên, có danh tính ổn định** — không phải anonymous prompts hay generic subagents. Mỗi agent có:
>
> - **Identity** — tên cố định, role, backstory (ví dụ: "Ada — systems architect, prefers DDD")
> - **Knowledge** — domain-specific skills, curated reference material, expertise project-agnostic
> - **Personality & philosophy** — voice, decision style, code aesthetics, trade-off bias
> - **Persistent memory** — sống qua sessions và repos (cloud-hosted trước, sau đó MCP server user tự sở hữu)
> - **Self-improvement loop** — agent *thông minh hơn* theo thời gian qua feedback, lessons, corrections
> - **Cross-project portability** — cùng "team" đi theo user vào bất kỳ repo nào

**Precedent gần nhất trong repo hiện tại:** `runtime/teams/team-store.mjs` (team *spec* với roles + orchestration), nhưng **session-scoped** — team compose per-task, không có tên, không memory, biến mất sau khi chạy xong.

**Idea này đẩy từ "ephemeral task team" → "permanent company of specialists".**

---

## ✅ Khả thi không?

**Có. 3 panels unanimous.**

### Khả thi dễ (vài tuần)

- `agents/<id>/{system.md, principles.md, self.md, skills.json}` — markdown thuần, mirror `skills/<skill>/SKILL.md`
- Extend `runtime/mcp/server.mjs` với 4 tools + 5 resources — additive change, không schema break
- New SessionStart hook `session-start-agent-bind.mjs` — sibling của hooks hiện có
- Command `vibe-hire <agent-id>` — file mới trong `commands/`

### Khả thi trung bình (1–2 tháng)

- Cloud memory sync daemon — cần Node service mỏng, retry, conflict resolution
- Cross-project reflection consolidation — non-trivial LLM-as-judge logic
- Agent registry UI (CLI minimum)

### Khả thi khó (3+ tháng)

- Cross-machine agent portability thật sự (auth + sync + conflict resolution)
- Anti-memory-poisoning (agent học bad habits từ project A, propagate sang project B)
- Cost model (nếu mỗi cloud memory pull add 2–5K tokens, sessions thường có 10–20 pulls → context đầy)

### Không khả thi (với current model class)

- Model *thực sự học* theo nghĩa update parameters. Self-improvement ở đây là prompt/document-level evolution, không phải weight learning. **Phải nói thẳng điều này.**

---

## 🎯 Giải quyết được issue nào?

| Pain point | Today | With agent team |
|---|---|---|
| "LLM quên preferences của tôi" | Re-paste coding style mỗi prompt | Persistent user-style memory per agent |
| "Generic suggestions cho mọi thứ" | Same tone cho security, perf, UX | Role-specialised agents |
| "Phải re-onboard AI mỗi repo" | Start from zero each session | Cross-project memory follows user |
| "Security agent chỉ paranoid khi tôi push" | One-shot vibe-coded review | Persistent "paranoid" agent, principles versioned |
| "Tôi lặp lại cùng bug pattern" | No regression memory | "QA" agent nhớ mistakes của bạn |
| "LLMs là mercenaries, không phải colleagues" | Each session anonymous | Named specialists có backstories, `@mention` được |
| "Không inspect được AI 'học' gì" | Black-box memory | Markdown files + git-versioned principles, user-editable |
| "Cần specialist per project phase" | Manual prompt engineering | Pre-tuned personas (Architect / Implementer / Reviewer / Tester) |

---

## 🔥 Gap không ai lấp

So sánh với market hiện tại:

| Capability | CrewAI | AutoGen | LangGraph | Letta | Mem0 | **This idea** |
|---|---|---|---|---|---|---|
| Persistent identity (cross-session) | ❌ | ❌ | partial | ✅ | ❌ | ✅ |
| Per-agent memory | ❌ | ❌ | partial | ✅ | ❌ | ✅ |
| Cross-project portability | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Personality as versioned contract | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Curated** self-improvement (user approves writes) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Local-first + optional cloud | ❌ | ❌ | ❌ | partial | ❌ | ✅ |
| Markdown-first, ADR-disciplined | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

**Hai cột không ai có:** curated (user-in-the-loop) self-improvement, và markdown-first/ADR-disciplined. Cả hai là *earned advantages* của vibe-coding-os posture hiện tại.

---

## ⚠️ Rủi ro critical — 3 collapse vào 1 quy tắc

| Critical risk | Mitigation 1 dòng |
|---|---|
| **Memory poisoning** — bad lesson propagates | `agent_id` + `origin_session` + `confidence` required; user-approval gate trước khi write |
| **Self-improvement loop gaming** (sycophancy, reward hack, alignment drift) | **Never auto-write.** Reflection → *draft*; user curate |
| **Identity drift** — principles silently mutate | `principles.md` git-versioned, tách khỏi mutable `self.md`; monthly consistency check |

**Quy tắc vàng:** *"Không reflection output nào trở thành persistent memory mà không có explicit user approval, surfaced as reviewable artifact (markdown diff hoặc PR)."*

Quy tắc này vô hiệu hóa dangerous three. Nếu sau này bạn push "fully autonomous reflection" — câu trả lời đúng là **ship MVP stripped không có self-improvement — never ship autonomous writes**.

---

## 🏗️ Kiến trúc đề xuất (5 layers)

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

**ADR-0002 boundary được bảo vệ:** cloud là *adapter* sống ngoài `runtime/`. Local-first là default; cloud opt-in per agent.

### Tech-stack choices cho MVP

| Layer | MVP choice | Why |
|---|---|---|
| Memory storage | **Extend `runtime/memory/*` (JSON + FNV-1a)** | Đã ship, schema-enforced, redaction built-in |
| MCP server | **Extend `runtime/mcp/server.mjs`** | Đã opt-in, approval-gated. Add per-agent tool namespacing |
| Orchestration | **Sequential, user-as-orchestrator** | Honest to model, every decision reviewable |
| Cloud adapter | **Mem0** (model-agnostic, optional) | External dep duy nhất đáng adopt. Defer v1.0 |

---

## 📋 MVP scope (4–6 tuần, 9 items)

1. **Agent manifest format** — `agents/<id>/{system.md, principles.md, self.md, skills.json}`
2. **3 seeded starter agents** — Architect / Implementer / Reviewer, mỗi agent ≥20 curated lessons
3. **Extend MCP server** — `agent.<id>.recall`, `agent.<id>.reflect`, `agent.<id>.cite` (namespaced, approval-gated)
4. **New SessionStart hook** — `session-start-agent-bind.mjs` load agent bundle
5. **New Stop hook** — `stop-agent-self-review.mjs` draft lesson, queue cho user approval
6. **Command `vibe-hire <agent-id>`** — switch session sang agent đó
7. **Memory scope controller** — `global | project | branch` resolution at write time
8. **ADR-0005 (new)** — agent-vs-skill composition contract
9. **Memory health dashboard** — size, drift score, last-curated, pending-drafts count

### Deferred (v1.0, 2–3 tháng)
- Cloud memory sync daemon (Postgres + pgvector)
- `vibe-agent-review <agent-id>` periodic reflection PR generator
- Cross-project memory consolidation (`vibe-agent-sync`)

### Hard NO (build never)
- Autonomous memory writes (no user approval)
- Auto-mutation of `principles.md`
- Agent-to-agent write access (read/cite only)
- Cloud-only memory (local-first forever)

---

## ❓ Câu hỏi cần bạn quyết

Hội đồng unanimous BUILD, nhưng cần bạn quyết scope:

**A. Ship MVP as defined** — 4–6 tuần, 9 items, validate end-to-end. **(Recommended)**

**B. Proof-of-concept first** — 1–2 tuần, chỉ `agents/architect/{system,principles,self}.md` + 1 MCP tool + 1 hook. Validate UX trước khi scale.

**C. Full cloud stack trong v0** — include Postgres+pgvector + cross-project sync. 2–3 tháng. Bỏ qua local-first guarantee.

---

## 🚀 Next step

Nếu bạn chọn **A** (recommended), hội đồng đề xuất thứ tự triển khai:

1. ADR-0005 (agent-vs-skill composition contract) — pattern A: agent-as-skill-bundle
2. Agent manifest schema (YAML + JSON Schema)
3. 3 starter agent bundles — Architect, Implementer, Reviewer (≥20 lessons each)
4. Extend MCP server (3 namespaced tools)
5. `session-start-agent-bind.mjs` hook
6. `stop-agent-self-review.mjs` (draft-only, user-approval-gated)
7. Memory scope controller
8. `vibe-hire <agent-id>` command
9. Memory health dashboard + drift score

Loop đến khi xong, không dừng giữa chừng.

---

## 📁 Files committed (đã push lên GitHub)

```
23bc92d feat(council): persistent agent team idea — 3-panel audit + synthesis
 4 files changed, 706 insertions(+)
   docs/reports/council/agent-team-idea-COUNCIL-SYNTHESIS.md          (222 lines)
   docs/reports/council/agent-team-idea-panel-A-product-vision.md     (104 lines)
   docs/reports/council/agent-team-idea-panel-B-architecture.md       (265 lines)
   docs/reports/council/agent-team-idea-panel-C-competition-risks.md  (114 lines)
```

**Trên GitHub:**
- Synthesis: `/docs/reports/council/agent-team-idea-COUNCIL-SYNTHESIS.md`
- Panel A: `/docs/reports/council/agent-team-idea-panel-A-product-vision.md`
- Panel B: `/docs/reports/council/agent-team-idea-panel-B-architecture.md`
- Panel C: `/docs/reports/council/agent-team-idea-panel-C-competition-risks.md`

---

**Verdict cuối:** BUILD. With discipline. Local-first, user-curated, ADR-disciplined.

Quy tắc duy nhất phá vỡ mọi thứ: "let the agent write its own memory". Quy tắc duy nhất ngăn chặn: "every reflection is a draft, user curates". **Hold that line and the rest is implementation.**
