# Upstream Control Map — Bạn dùng repo nào, merge gì, ở file nào, maintain ra sao

> Mục đích: một bảng điều khiển duy nhất để bạn biết (1) repo gốc nào đang được dùng, (2) tính năng nào đã merge vào Vibe Coding OS, (3) code/doc của nó nằm ở file nào, (4) "index" theo dõi nằm đâu, và (5) khi upstream cập nhật thì kiểm soát & maintain thế nào.
>
> Cập nhật: 2026-06-07. Nguyên tắc: **inspiration-only, KHÔNG vendor code** (xem `CONSTITUTION.md`, `CLAUDE.md`).

---

## 0. Đọc gì trước (3 file điều khiển gốc)

| Câu hỏi của bạn | Đọc file này |
|---|---|
| Tôi đang track repo nào? License? Đã merge hay chỉ inspiration? | `registry/sources.json` (máy đọc) + `ATTRIBUTIONS.md` (người đọc) |
| Repo X gợi ý feature gì, map tới file local nào, watch path nào? | `references/index.json` (index máy đọc) + `references/sources/<id>.md` (ghi chú người đọc) |
| Feature Y đã merge ở đâu, đối chiếu gap còn thiếu gì? | `references/merge-feature-gap-map.md` (bản đồ merge đầy đủ) + `references/features/<feature>.md` |
| Khi upstream đổi, file local nào bị ảnh hưởng? | `references/mappings/update-impact-map.md` + `references/mappings/source-to-local-skills.md` |

**"Index" của hệ thống = `references/index.json`.** Đây là file máy-đọc liệt kê mỗi repo: `id`, `url`, `license`, `status`, `import_mode`, `features[]`, `local_targets[]` (chính xác file local nào được tạo cảm hứng từ nó), `watch_paths`, `last_checked`, `last_known_commit`.

---

## 1. Bảng điều khiển: Repo gốc → đã merge gì → file local

| # | Upstream repo | License | Trạng thái | Đã merge feature gì (đợt này) | File local chính | Source note |
|---|---|---|---|---|---|---|
| 1 | [obra/superpowers](https://github.com/obra/superpowers) | MIT | adapted | Skill-testing playbook (RED-GREEN-REFACTOR) + Claude Search Optimization | `skills/meta/writing-skills/SKILL.md` | `references/sources/obra-superpowers.md` |
| 2 | [github/spec-kit](https://github.com/github/spec-kit) | MIT | adapted | `/checklist` (unit tests for English), `/analyze` (cross-artifact gate), clarify encode-back, bug-fix lifecycle | `skills/core/requirements-quality-checklist/`, `commands/vibe-checklist.md`, `commands/vibe-analyze.md`, `templates/requirements-checklist-template.md`, `skills/core/bug-fix-lifecycle/`, `skills/core/clarify-before-code/` | `references/sources/github-spec-kit.md` |
| 3 | [mattpocock/skills](https://github.com/mattpocock/skills) | MIT | adapted | Two-axis review (Standards vs Spec), prototype LOGIC/UI routing, glossary `_Avoid` | `skills/core/review-before-merge/`, `skills/core/prototype-before-commitment/`, `skills/core/shared-domain-language/` | `references/sources/mattpocock-skills.md` |
| 4 | [supermemoryai/supermemory](https://github.com/supermemoryai/supermemory) | MIT | inspiration | Graph relationship typing + isLatest, Memory-vs-RAG, MemScore triple, hybrid search tuning | `skills/memory/memory-architecture/`, `skills/memory/memory-evaluation/`, `skills/memory/memory-search/`, `references/features/memory-vs-rag.md` | `references/sources/supermemoryai-supermemory.md` |
| 5 | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | Apache-2.0 | inspiration | Project/worktree scoping, periodic digest, env-sanitizer checklist, hook event taxonomy | `skills/memory/local-first-memory/`, `skills/memory/session-summarizer/`, `skills/memory/privacy-filter/`, `adapters/hooks/memory-hooks-contract.md` | `references/sources/thedotmack-claude-mem.md` |
| 6 | [yeachan-heo/oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) | MIT | adapted | Commit decision-trailers, context-budget audit, skillify-from-session, instinct-extraction, agent role routing | `skills/core/git-guardrails/`, `skills/meta/context-budget/`, `skills/meta/skillify-from-session/`, `skills/meta/instinct-extraction/`, `skills/agents/*` | `references/sources/yeachan-heo-oh-my-claudecode.md` |
| 7 | [affaan-m/ECC](https://github.com/affaan-m/ECC) | MIT | adapted | Continuous-learning/instinct concept, context-budget heuristics | `skills/meta/instinct-extraction/`, `skills/meta/context-budget/` | `references/sources/affaan-m-ecc.md` |
| 8 | [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | ⚠️ MIT-declared-incomplete | inspiration (re-write only) | 4 engineering-discipline principles: Think-Before-Coding, Simplicity-First, Surgical-Changes, Goal-Driven-Execution (viết lại nguyên bản, KHÔNG copy) | `skills/prompts/karpathy-engineering-discipline/`, `skills/prompts/anti-overengineering/`, `skills/core/goal-driven-execution/`, `skills/core/verification-before-completion/` | `references/sources/multica-ai-andrej-karpathy-skills.md` |

> ⚠️ **Repo #8 (multica-ai)**: khai MIT trong metadata nhưng KHÔNG có file LICENSE + copyright line → grant không đầy đủ. Đã xử lý inspiration-only re-write. KHÔNG vendor cho tới khi upstream bổ sung license đầy đủ.

### Đợt 2 — Adaptive flow + gap-only (2026-06-07)

Chỉ lấy phần **không trùng** với các feature đã có. Tất cả là inspiration, KHÔNG vendor runtime/CLI/MCP/installer.

| # | Upstream repo | License | Trạng thái | Đã merge feature gì (gap-only) | File local chính |
|---|---|---|---|---|---|
| 9 | [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | MIT | inspiration | Scale-adaptive planning depth → tier rubric | `skills/core/adaptive-flow/`, `docs/workflows/adaptive-flow.md` |
| 10 | [buildermethods/agent-os](https://github.com/buildermethods/agent-os) | MIT | inspiration | Task-proportional/standards-aware flow selection | `skills/core/adaptive-flow/`, `commands/vibe-flow.md` |
| 11 | [coleam00/context-engineering-intro](https://github.com/coleam00/context-engineering-intro) | MIT (Cole Medin 2025, verified) | adapted | Context-rich implementation brief + research/examples/validation-gates + confidence score | `templates/implementation-brief-template.md`, `commands/vibe-brief.md`, `commands/vibe-brief-execute.md`, `skills/core/context-rich-implementation/SKILL.md`, `docs/workflows/context-engineering.md` |
| 12 | [eyaltoledano/claude-task-master](https://github.com/eyaltoledano/claude-task-master) | MIT + Commons Clause | inspiration | Task status convention + next-task selection | `skills/core/task-state-tracking/`, `templates/tasks-template.md` |
| 13 | [automazeio/ccpm](https://github.com/automazeio/ccpm) | MIT | inspiration | Source-of-truth task tracking (markdown only) | `skills/core/task-state-tracking/` |

> **ADAPTED (2026-06-07):** BMAD / Agent OS standards + mission/roadmap concepts are now local markdown only: `STANDARDS.md`, `ROADMAP.md`.
> **SKIP (vi phạm non-goal):** task-master MCP/CLI/tasks.json engine; CCPM `/pm` runtime + GitHub-as-DB; BMAD/Agent OS installer + runtime; mọi text/template/code upstream.

---

## 2. "Code index nằm ở file nào?" — bản đồ file theo loại

| Loại | Vị trí | Vai trò |
|---|---|---|
| **Source index (máy đọc)** | `references/index.json` | Mỗi repo: features + `local_targets[]` + watch_paths + commit cuối được audit |
| **Source registry (máy đọc)** | `registry/sources.json` | license + status + import_mode + policy |
| **Skill registry** | `registry/skills.json` | Mọi skill (name/path/category/description) — 79 skills |
| **Prompt registry** | `registry/prompts.json` | Mọi command (65) |
| **Bản ghi người đọc** | `references/sources/<id>.md` | Vì sao quan trọng, học gì, mapping, watchlist |
| **Mô tả feature** | `references/features/<feature>.md` | Feature xuyên-repo (memory-vs-rag, spec-driven...) |
| **Mapping ảnh hưởng** | `references/mappings/update-impact-map.md` | Upstream đổi X → kiểm tra file local nào |
| **Mapping nguồn→skill** | `references/mappings/source-to-local-skills.md` | Repo → skill local |
| **Mapping feature→file** | `references/mappings/feature-to-local-files.md` | Feature → toàn bộ file liên quan |
| **Changelog audit local** | `references/changelogs/<id>.md` | Ghi nhận mỗi lần audit upstream (KHÔNG phải changelog upstream) |
| **Clone workspace (gitignore)** | `references/upstreams/<id>/` | Bản clone tạm để audit; chỉ README được commit |
| **Bản đồ merge đợt này** | `references/merge-feature-gap-map.md` | 8 repo: feature mạnh + đã có/chưa + tier ưu tiên |

Validator kiểm tra tính nhất quán: `scripts/validate-repo.mjs` (skills/commands/templates + đối chiếu registry) và `scripts/validate-references.mjs` (index ↔ registry, mọi `local_target` tồn tại).

---

## 3. Quy trình maintain khi repo gốc có update mới

Khi một upstream repo ra bản mới, làm theo 6 bước (chi tiết trong `references/upstream-audit-workflow.md` và `references/maintenance-cadence.md`):

```text
1. CLONE   → npm run references:clone   (kéo bản mới nhất vào references/upstreams/, đã gitignore)
2. AUDIT   → mở references/sources/<id>.md + references/index.json; so commit mới với `last_known_commit`
3. IMPACT  → tra references/mappings/update-impact-map.md: thay đổi này chạm tới feature nào → file local nào
4. DECIDE  → có lợi cho framework local không? Nếu không, chỉ ghi changelog và bỏ qua (đừng đổi theo upstream một cách máy móc)
5. ADAPT   → nếu merge: viết lại nguyên bản vào file local, cập nhật ATTRIBUTIONS.md nếu adapt sát, ghi references/changelogs/<id>.md
6. VERIFY  → npm run validate:references  (và npm run validate khi đổi cấu trúc)
```

**Câu lệnh nhanh để kiểm tra "repo nào cần audit":**
```bash
npm run references:report     # sinh báo cáo cập nhật (so last_checked vs hiện tại)
npm run references:clone      # kéo bản mới các upstream để audit
npm run validate:references   # đảm bảo index/mapping/registry còn nhất quán
```

**Để cập nhật commit đã audit:** sửa `last_checked` và `last_known_commit` của repo đó trong `references/index.json`, rồi ghi 1 dòng vào `references/changelogs/<id>.md`.

---

## 4. Nguyên tắc kiểm soát (để bạn không mất control)

- **Không vendor code.** Mọi thứ merge là viết lại nguyên bản. Vì vậy upstream update KHÔNG tự động phá code của bạn — bạn chủ động chọn adapt.
- **`import_mode` cho biết mức độ ràng buộc:** `none` (chỉ theo dõi) → `inspiration` (lấy ý tưởng) → `adapted` (viết lại sát) → `vendored` (copy — repo này không dùng).
- **`local_targets[]` trong index.json là sợi dây liên kết:** nếu xóa/đổi tên một skill, phải cập nhật index (validator sẽ báo lỗi nếu lệch — đã được test trong đợt merge này).
- **License gate:** repo license `unknown`/incomplete (như multica-ai) chỉ được inspiration-only, không vendor.

---

## Ghi chú tiếng Việt

File này là bảng điều khiển trung tâm. Khi cần biết "tôi dùng repo nào / merge gì / ở file nào / maintain sao", đọc theo thứ tự: bảng mục 1 → index `references/index.json` → quy trình maintain mục 3. Khi upstream update: `clone → audit → impact → decide → adapt → verify`, và luôn cập nhật `last_known_commit` + changelog để giữ kiểm soát.

### Đợt 3 — Team-agent orchestration (2026-06-07)

| # | Upstream repo | License | Trạng thái | Đã merge feature gì (gap-only) | File local chính |
|---|---|---|---|---|---|
| 14 | [yeachan-heo/oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) | MIT | inspiration/adapted | Staged team flow, role routing, task/message coordination, handoff/watchdog/worktree/dynamic-scaling concepts | `skills/core/team-agent-orchestration/`, `commands/vibe-team.md` |
| 15 | [revfactory/harness](https://github.com/revfactory/harness) | Apache-2.0 | inspiration | Six team patterns, domain-analysis-first team architecture, progressive disclosure, dry-run and with-vs-without validation | `templates/team-architecture-template.md`, `docs/workflows/team-agent-orchestration.md` |

> **SKIP:** upstream orchestration runtimes, tmux/session/mailbox layers, hook daemons, generated `.claude/agents` / `.claude/skills`, installers, code, prompts, and docs. Local result is original markdown only.

### Đợt 4 — Portable feature cherry-pick (2026-06-07)

| # | Upstream repo | License | Trạng thái | Đã merge feature gì (gap-only) | File local chính |
|---|---|---|---|---|---|
| 16 | [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | MIT | inspiration | Product mission/roadmap + standards-aware planning convention | `ROADMAP.md`, `STANDARDS.md` |
| 17 | [buildermethods/agent-os](https://github.com/buildermethods/agent-os) | MIT | inspiration | Project standards doc separated from constitution | `STANDARDS.md` |
| 18 | [automazeio/ccpm](https://github.com/automazeio/ccpm) | MIT | inspiration | Optional spec → issue → worktree traceability (markdown only) | `templates/traceability-map-template.md` |
| 19 | [eyaltoledano/claude-task-master](https://github.com/eyaltoledano/claude-task-master) | MIT + Commons Clause | inspiration | Task-state traceability convention; no runtime | `templates/traceability-map-template.md`, `skills/core/task-state-tracking/` |

> **SKIPPED as duplicates:** claude-mem periodic digest, hook taxonomy/env sanitizer, and supermemory MemScore were already present in existing memory artifacts. **SKIPPED as runtime:** all CLI/MCP/installer/database/GitHub automation.

### Đợt 5 — Optional runtime-heavy synthesis (adapted MVP, 2026-06-07)

User chủ động yêu cầu một runtime companion. Quyết định kiến trúc (xem `docs/adr/0001-optional-runtime-layer.md`): **JSON-first, opt-in, một-lần CLI, KHÔNG daemon mặc định**. Markdown vẫn là nền tảng. Đây là synthesis **viết mới hoàn toàn (original code)** lấy cảm hứng từ các repo dưới — KHÔNG copy CLI/runtime/DB/installer upstream.

| # | Upstream repo | License | Trạng thái | Ý tưởng synthesis (adapted, code gốc) | File local chính |
|---|---|---|---|---|---|
| 20 | [eyaltoledano/claude-task-master](https://github.com/eyaltoledano/claude-task-master) | MIT + Commons Clause | inspiration | Task status convention + dependency-aware next-task selection → local JSON store | `runtime/tasks/task-store.mjs`, `scripts/runtime-task.mjs` |
| 21 | [automazeio/ccpm](https://github.com/automazeio/ccpm) | MIT | inspiration | Source-of-truth task state engine (no GitHub-as-DB) → local JSON | `runtime/tasks/task-store.mjs` |
| 22 | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | Apache-2.0 | inspiration | Local-first memory + session records + env/secret redaction (no Bun worker/installer) | `runtime/memory/*.mjs`, `runtime/sessions/session-store.mjs`, `runtime/core/privacy.mjs` |
| 23 | [supermemoryai/supermemory](https://github.com/supermemoryai/supermemory) | MIT | inspiration | Memory ingest/search APIs with source metadata (no vector DB) → local JSON | `runtime/memory/memory-store.mjs`, `runtime/memory/retrieval.mjs` |
| 24 | [github/spec-kit](https://github.com/github/spec-kit) | MIT | inspiration | Checkpoint/readiness gate as recorded runtime evidence | `runtime/checkpoints/checkpoint-engine.mjs`, `scripts/runtime-checkpoint.mjs` |
| 25 | [yeachan-heo/oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) + [revfactory/harness](https://github.com/revfactory/harness) | MIT / Apache-2.0 | inspiration | Team-spec import/scaffold into inspectable state (NO live spawn/tmux/mailbox) | `runtime/teams/team-store.mjs`, `scripts/runtime-team.mjs` |

> **Foundation (original):** `runtime/core/*.mjs` (ids, atomic JSON fs-store, lock files, events.jsonl, schemaVersion validation, privacy redaction), `templates/runtime-config-template.json`.
> **MVP commands:** `runtime:init|validate|task|memory|checkpoint|team|session` trong `package.json`.
> **SKIP (vẫn giữ non-goal):** daemon mặc định, SQLite/vector/GitHub-sync/tmux runner (để dành adapter opt-in về sau), và mọi code/template/CLI upstream.
> Docs: `docs/adr/0001-optional-runtime-layer.md`, `docs/workflows/optional-runtime-architecture.md`.
