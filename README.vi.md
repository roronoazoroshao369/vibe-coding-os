# Vibe Coding OS

[![Validate Repository](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/validate.yml/badge.svg)](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/validate.yml)

> **Workflow contract first. Runtime optional. Human intent stays sovereign.**

### Vì sao điều này quan trọng

AI coding assistants có thể tạo code rất nhanh — nhưng tốc độ thiếu cấu trúc dễ dẫn tới scope creep, quên edge cases và output khó bảo trì. Vibe Coding OS thêm một lớp kỷ luật nhẹ bên trên: workflow spec-driven, verification gates và engineering practices để giữ human intent sovereign trong khi vẫn ship ở tốc độ AI.

Vibe Coding OS là framework markdown-first, thân thiện với Claude/Codex, cho một người muốn đi nhanh với AI coding assistants mà không đánh đổi engineering discipline: spec → plan → implement → verify → remember.

Nó không cố trở thành wrapper, product, hosted service, runtime hay task manager bắt buộc. Core product là bộ contract portable gồm skills, commands, templates, docs, adapters và validation.

> **Về tên gọi:** “Vibe coding” thường chỉ kiểu code nhanh, thiếu cấu trúc với AI. Vibe Coding OS là phần đối trọng có kỷ luật — spec-first, verification-gated và nghiêm túc về engineering. Vẫn nhanh, nhưng có guardrails.

**English:** [README.md](README.md)

---

## Trạng thái hiện tại

**Bản phát hành hiện tại (v2.16.1):** validate:all 38/38 gates PASS · **148 skills** · **120 commands** · **110 templates** · **22 tracked sources** · 9 adapters

**Mới nhất:** v2.16.1 — Tier 1 — Close "Shipped but Unwired" Gaps — T1-T7 fixes: injection scan, MCP SDK, branch cleanup, spec unify, dead code wire, count sync, full test suite + live Claude Code test. 38/38 gates. <!-- injection-allow:* -->

**v2.5.0 trước đó:** Advanced Orchestration — workflow nhiều stage có gate, schema orchestration, runner, templates feature/bugfix/security audit và roadmap hoàn tất 100% đến v2.5.

**CTA đầu tiên:** Nếu bạn mới bắt đầu, hãy chạy ngay [Luồng đầu tiên](docs/vi/FIRST-WORKFLOW.md) để hoàn tất một vòng `spec → plan → verify` trước khi đọc runtime hay tooling cho maintainer.

**Bắt đầu:** [Luồng đầu tiên](docs/vi/FIRST-WORKFLOW.md) · [Quickstart](docs/vi/QUICKSTART.md) · [Adapter hub](docs/adapters/README.md) · [Docs hub](docs/README.md)

## Có gì mới trong v2.16.0

**Wave A — Security (3-layer Defense in Depth, ADR 0003):**
- **`security/defense/`** — Injection counters (97.37% coverage), 19 OWASP-mapped patterns, canary corpus with 43 payloads
- **`security/redact/`** — 3-mode redactor (postTool / postSession / postPublish), 60/60 tests pass, allowlist for placeholders
- **`security/README.md`** — Canonical guide for the 3-layer defense
- **`skills/core/sandbox-marker/SKILL.md`** — Convention for marking skills that load external/untrusted content
- **3 new validation gates**: `validate:security-regression`, `validate:redact`, `validate:sandbox-marker`

**Wave B — Engineering:**
- **`skills/core/skill-content-search/`** — Search across 541 files (skills, commands, templates, docs) with regex + case flags
- **`skills/core/docs-author/`** — 5-section convention (Purpose → When to use → Workflow → Outputs → Failure modes)
- **`skills/core/test-fixture-library/`** — Declarative JSON fixtures in `tests/fixtures/` with validator + generator
- **`skills/core/skill-deps-graph/`** — Visualize skill dependency graph (JSON, Mermaid, stats)
- **`skills/core/deprecate-skill/`** — Proper deprecation workflow (mark → log → notice → sunset)

**Wave C — Adoption:**
- **`docs/comparison.md`** — vs LangChain / Semantic Kernel / Cursor / Copilot
- **`skills/core/install-skill/`** + `commands/vibe-install.md` — `node scripts/install-skill.mjs <name>` with --list/--dry-run/--force/--target
- **`docs/FAQ.md`** — 10 Q&A pairs with Schema.org FAQPage JSON-LD for SEO
- **`.github/discussion-templates/`** — Q&A, Show-and-tell, Feature-request templates
- **`docs/show-hn-kit.md`** — Copy-paste HN post + image suggestions + Twitter/LinkedIn variants

## Có gì mới trong v2.12.0

Engineering Discipline Pack — inspired by addyosmani/agent-skills (MIT, 63.4k★):

- **5 skills mới**:
  - `skills/core/doubt-driven-development/` — CLS-DAR protocol (Claim, Locate, Scrutinize, Doubt, Adjudicate, Record) với Loading Constraints chống persona recursion
  - `skills/core/observability-design/` — questions-before-signals workflow, metric/log/trace trade-off table, SLO envelope
  - `skills/core/deprecation-migration/` — Compulsory vs Advisory classification, 5 pre-deprecation questions, sunset timeline
  - `skills/core/threat-model-driven-security/` — STRIDE 6-letter lens trên (boundary, asset, adversary) tuples, abuse cases đi kèm use cases
  - `skills/core/vertical-slicing/` — 5-step increment cycle: Implement→Test→Verify→Commit→Next, slice theo outcome không theo layer
- **7 commands mới**: `vibe-doubt`, `vibe-observability`, `vibe-deprecate`, `vibe-migrate`, `vibe-threat-model`, `vibe-slice`, `vibe-perf-budget`
- **6 templates mới**: `doubt-log`, `observability-plan-template`, `deprecation-notice-template`, `threat-model-template`, `slice-spec-template`, `performance-budget-template`
- **2 architectural artifacts mới**: `plugins/manifest.json` (plugin metadata), `plugins/marketplace.json` (discovery index)
- **3 skills enhanced**: `quality-engine` (CWV targets + MEASURE→GUARD loop), `grill-user-before-building` (95% confidence stop), `verification-before-done` (5-axis runtime verification)
- **Orchestration guide enhanced**: 6 anti-patterns (persona-calls-persona, deep trees, single-agent-all-perspectives, summarize-for-handoff, sequential-when-parallel, mid-slice commits) + Loading Constraints table
- **Validator enhanced**: `scripts/validate-schemas.mjs` soft-warn sections khuyến nghị (`## Common rationalizations`, `## Red flags`, `## Verification checklist`) mà không phá existing skills
- **Manifests regenerated**: `commands/manifest.json` (108 commands), `templates/manifest.json` (92 templates)
- **Inspiration sources**: 20 → 21 (addyosmani/agent-skills tracked)
- **Tổng**: 38/38 gates PASS, 136 skills, 108 commands, 92 templates

## Có gì mới trong v2.10.x

Guard Bypass Protocol + Cipher Detection:

- **Option A**: Cipher attack detection catalog (8 cipher types × defense patterns)
- **Option B**: Scanner patterns + red-team scan report template
- **Option C**: Test runner + 24/24 functional tests PASS

Release Pipeline & Plugin Polish:

- **Pipeline release tự động**: `release-prepare.yml` + `release-publish.yml` — release 2 giai đoạn (PR → publish khi merge)
- **Claude Code plugin polish**: plugin.json sync v2.9.0, marketplace metadata cập nhật
- **5 MCP command tools**: `vibe.spec`, `vibe.plan`, `vibe.review`, `vibe.memory`, `vibe.merge`
- **CLAUDE.md tối ưu**: 149→50 dòng (giảm 67%) với progressive disclosure
- **Memory compression**: skill + command + template mới cho transformation observations thành durable facts
- **Context injection**: SKILL.md mới cho scoped, citation-backed, privacy-filtered context bundles
- **Acceptance criteria quality pack**: 4 cấp AC (basic/verified/gated/audited) với reuse patterns
- **Agent alignment workflow**: `vibe-align` command orchestrate grill-user, grill-with-docs, shared-domain-language
- **Anti-overengineering**: `vibe-anti-overengineer` command + review template
- **Dashboard time-series**: bảng trend 7 ngày embedded trong DASHBOARD.md
- **CI trend persistence**: GitHub Action lưu gate pass/fail qua các CI runs
- **CHANGELOG backfilled**: v1.6.0→v2.9.0 entries đã được bổ sung

## Có gì mới trong v2.8.0

Adapter Expansion — từ 4 lên 8 adapters:

- **4 adapters mới**: Cline, Continue.dev, Aider, Windsurf
- **Cline**: `.clinerules`, mode-specific rules, MCP native, skills directory
- **Continue.dev**: AGENTS.md per-directory, slash commands, config.example.json
- **Aider**: CONVENTIONS.md, architect/editor mode, lint integration
- **Windsurf**: `.windsurfrules`, Cascade agent, Flows, Deep Context
- **Compatibility matrix** mở rộng 8 tools + docs hub + install snippets
- **Runtime không đổi:** v2.8.0 tuân thủ ADR 0002.

## Có gì mới trong v2.7.0

AI Testing Suite — automated quality infrastructure:

- **Property-based testing**: schema + runner (`npm run test:property`)
- **Benchmark harness**: per-gate timing + trends (`npm run benchmark:gates`)
- **Test generator**: auto-generate tests (`npm run test:generate`)
- **Quality trend dashboard**: time-series từ telemetry (`npm run dashboard:trend`)
- **PR quality comment**: GitHub Actions auto-post quality summary
- **Runtime không đổi:** v2.7.0 tuân thủ ADR 0002.

## Có gì mới trong v2.6.0

Full Reference Implementation — implement toàn bộ 20 reference sources, loop 10 batches đến 100% done:

- **20 source references** xử lý: Deer-Flow, Code-Review-Graph, Antigravity, Best-Practice 58k★, Supermemory, ECC, CCPM, BMAD, Agent-OS, planning-with-files, lean-ctx + 9 deep sources
- **43 files mới, 70 files sửa**, +2,312 lines
- **SuperAgent orchestration** — orchestrator→worker lifecycle, sandboxed execution, research→code pipeline
- **Code intelligence review** — call graph + dep map, incremental delta review, MCP patterns
- **Plugin bundle system** — bundles.json, skill categories, multi-platform adapter guide
- **Proficiency path** — 4-level (Basics→Prompt→Agentic→Orchestration) với maturity badges
- **Memory depth** — 5-phase ingestion lifecycle, 6-phase retrieval workflow, provider interface
- **7-state task machine** — proposed→approved→in-progress→review→done|blocked|abandoned
- **Crash-proof planning** — YAML frontmatter, bracket markers, recovery workflow
- **Context policy/DLP** — allow/block/flag ingress/egress rules
- **20 local branches cũ** đã cleanup
- **Runtime không đổi:** v2.6.0 tuân thủ ADR 0002; không yêu cầu daemon hay hosted service.

## Có gì mới trong v2.5.0

Advanced Orchestration thêm workflow nhiều stage có quality gates cho feature phức tạp, bugfix, security audit và multi-agent delivery. v2.5.0 cũng đánh dấu roadmap hoàn tất 100% đến v2.5.

- **Schema orchestration:** `schemas/orchestration-workflow.json` định nghĩa stages, roles, inputs, outputs, triggers, retry policy và gate references.
- **Workflow runner:** `scripts/orchestrate-workflow.mjs` chạy workflow với `--workflow`, `--dry-run`, `--output-json`.
- **Workflow templates:** `templates/workflow-simple-feature.json`, `templates/workflow-bugfix.json`, `templates/workflow-security-audit.json`.
- **Skill mới:** `skills/core/orchestration-workflows/SKILL.md` hướng dẫn workflow có stage gates.
- **Command mới:** `commands/vibe-orchestrate.md` là command entry point cho orchestration.
- **Guide chính:** `docs/orchestration-guide.md` giải thích usage, failure modes, reports và quality-gate integration.
- **Registry sync:** orchestration skill và `vibe-orchestrate` đã đăng ký trong `registry/skills.json` và `registry/prompts.json`.
- **Runtime không đổi:** v2.5.0 tuân thủ ADR 0002; không yêu cầu daemon hay hosted service.

## Có gì mới trong v2.3.0

Multi-Repository Learning cho phép xuất bài học lập trình (lessons learned) thành định dạng có thể trao đổi giữa các repository — xuất từ kho này, kiểm tra, và nhập vào kho khác một cách an toàn.

- **Skill mới:** `skills/core/multi-repo-learning/SKILL.md` hướng dẫn xuất, kiểm tra và nhập lesson exchange batches.
- **Command mới:** `commands/vibe-lesson-exchange.md` cung cấp giao diện export, check và import.
- **Guide chính:** `docs/multi-repo-learning.md` giải thích luồng làm việc: quality check, export, safety review, dry-run và import.
- **Schema:** `schemas/lesson-exchange-format.json` định nghĩa định dạng portable cho single lessons và exchange batches.
- **Package scripts:** `lesson:export`, `lesson:import`, `lesson:check` đã sẵn sàng.
- **Registry sync:** multi-repo-learning skill và vibe-lesson-exchange command đã đăng ký trong `registry/skills.json` và `registry/prompts.json`.
- **Runtime không đổi:** v2.3.0 tuân thủ ADR 0002; không yêu cầu daemon hay hosted service.

## Có gì mới trong v2.2.0

Quality Telemetry & Analytics giúp chất lượng có thể đo lường được ở cấp độ local — phát quality events từ engine runs, tổng hợp session metrics và tạo trend reports để cải tiến liên tục.

- **Skill mới:** `skills/core/quality-telemetry/SKILL.md` hướng dẫn thu thập quality telemetry local.
- **Command mới:** `commands/vibe-quality-telemetry.md` cung cấp emit, metrics và trend-report CLI.
- **Guide chính:** `docs/quality-telemetry-guide.md` giải thích event schema, emit workflow, session aggregation, trend reporting và privacy patterns.
- **Package scripts:** `quality:emit-event`, `quality:session-metrics`, `quality:trend-report` đã sẵn sàng.
- **Registry sync:** quality-telemetry skill và command đã đăng ký trong `registry/skills.json` và `registry/prompts.json`.
- **Runtime không đổi:** v2.2.0 tuân thủ ADR 0002; không yêu cầu daemon hay hosted service.

## Có gì mới trong v2.1.0

- **Model-aware gate selection:** chọn profile/gates dựa trên capability của model và risk của task.
- **Skill + command:** `skills/core/model-aware-config/SKILL.md` và `commands/vibe-model-config.md` hướng dẫn workflow.
- **Guide chính:** `docs/model-aware-config-guide.md` mô tả input, profile, ví dụ và tích hợp Quality Engine.
- **Registry sync:** Model-Aware Config skill/command đã có trong `registry/skills.json` và `registry/prompts.json`.
- **Không mở runtime:** v2.1.0 tiếp tục tuân thủ ADR 0002; không yêu cầu daemon hay hosted service.

---

## Vibe Coding OS làm gì?

- Biến ý tưởng mơ hồ thành spec rõ ràng.
- Chia việc thành plan nhỏ, review được.
- Điều phối AI coding agents qua skills/commands/templates.
- Ép bằng chứng trước khi claim “done”.
- Giữ memory, handoff và retrospective có cấu trúc.
- Chạy validation để phát hiện docs drift, broken refs, orphan artifacts, schema issues và security leaks.

---

## Không làm gì?

- Không bắt buộc daemon/database/runtime.
- Không thay thế Cursor, Claude Code, Codex hay GitHub.
- Không khuyến khích “vibe code rồi tin đại”.
- Không coi runtime là product center.
- Không thêm runtime features nếu có thể giải quyết bằng markdown core.

---

## Ba đường onboarding: User, Maintainer, Optional Runtime

- **User path (mặc định):** Dùng core markdown-first với **zero runtime**. Cài Claude Code plugin, copy adapter files cho Codex/Cursor/Gemini, hoặc dùng skills/commands/templates như prompt và instructions bình thường. Không cần `npm install`, daemon, database, MCP server hay tmux.
- **Maintainer/contributor path:** Clone repo khi bạn muốn sửa skills, commands, templates, docs, adapters, registries hoặc validation scripts. Chỉ đường này mới cần `npm install` và các lệnh validation để bảo trì repo.
- **Optional runtime path:** Chỉ bật runtime khi bạn thật sự cần local JSON state cho task, checkpoint, memory, team/session, MCP wrapper hoặc tmux team runner.

Xem ranh giới chi tiết tại [Runtime Boundary](docs/workflows/core-vs-optional-runtime.md).

---

## Core vs Optional Runtime

### Core markdown layer

Đây là sản phẩm chính:

- `skills/` — quy trình thao tác reusable.
- `commands/` — prompt-command surface cho AI coding tools.
- `templates/` — specs, plans, review, feedback, handoff.
- `docs/` — contract, onboarding, governance, roadmap.
- `adapters/` — Claude Code, Codex, Cursor, Gemini, OpenCode, Qwen.
- `adapters/claude-code/` — plugin/manual usage cho Claude Code.
- `adapters/codex/` — instruction surface cho Codex CLI.
- `adapters/cursor/` — project rules workflow cho Cursor.
- `adapters/gemini/` — instruction surface cho Gemini CLI.
- `adapters/hooks/` — optional hook contracts.
- `adapters/memory/` — optional memory adapter plans.
- `scripts/` — validation, reporting, smoke tests.

### Optional runtime layer

Runtime chỉ là companion local-first:

- task/checkpoint/memory/team/session JSON state;
- event store and audit helpers;
- MCP wrapper;
- tmux team runner;
- runtime behavior tests.

Từ **v1.5.0**, runtime scope được freeze bởi [ADR 0002](docs/adr/0002-runtime-scope-freeze.md). Runtime chỉ nhận bug fix, safety hardening, compatibility, test và docs.

---

## Cài đặt nhanh

### User path — dùng workflow, không cần npm

Người dùng bình thường không cần clone để chạy validation hay `npm install`. Chọn adapter phù hợp rồi bắt đầu bằng [Luồng đầu tiên](docs/vi/FIRST-WORKFLOW.md):

- Claude Code: cài plugin theo [Quickstart](docs/vi/QUICKSTART.md).
- Codex/Cursor/Gemini: dùng [adapter hub](docs/adapters/README.md) và copy instruction file tương ứng.
- Markdown-only: mở `skills/`, `commands/`, `templates/` và dùng như prompt/instructions.

### Maintainer/contributor path — cần npm để validate repo

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os.git
cd vibe-coding-os
npm install
npm run validate:all
```

Nếu bạn chỉ muốn dùng workflow markdown, không cần runtime setup và cũng không cần `npm install`.

---

## Workflow cơ bản

1. **Spec** — mô tả intent, constraints, acceptance criteria.
2. **Plan** — chia thành task nhỏ, review được.
3. **Implement** — dùng adapter/AI coding tool phù hợp.
4. **Verify** — chạy tests, validation, checklist.
5. **Remember** — ghi lại decision, pitfalls, reusable skill/template.

Docs liên quan:

- [First Workflow](docs/vi/FIRST-WORKFLOW.md)
- [Core Workflow Contract](docs/core-workflow-contract.md)
- [Docs Map](docs/README.md)

---

## Dùng với AI coding tools

Adapter docs:

- [Adapter hub](docs/adapters/README.md) — chọn tool và setup nhanh
- [Claude Code](docs/adapters/claude-code.md), [Codex](docs/adapters/codex.md), [Cursor](docs/adapters/cursor.md), [Gemini](docs/adapters/gemini.md)

Layer READMEs: [skills](skills/README.md), [commands](commands/README.md), [templates](templates/README.md), [registry](registry/README.md).

---

## Validation gates

Lệnh chính:

```bash
npm run validate:all
```

Gate này kiểm tra:

- schemas;
- registries;
- links;
- secrets;
- bilingual sync;
- dashboard sync;
- traceability;
- runtime behavior tests;
- adapter smoke tests.

Mục tiêu release: **38/38 PASS**.

---

## Khi nào dùng runtime?

Dùng runtime nếu bạn cần:

- task state local có lease/claim;
- checkpoint evidence;
- runtime event audit;
- MCP tool wrapper;
- tmux team runner.

Không dùng runtime nếu bạn chỉ cần workflow contract, specs, prompts, templates, hay Cursor/Claude/Codex instructions.

---

## Tài liệu quan trọng

- [Docs Hub](docs/README.md)
- [Smart Adapt](docs/smart-adapt.md)
- [Quality Engine](docs/quality-engine-guide.md)
- [Model-Aware Config](docs/model-aware-config-guide.md)
- [Quality Telemetry](docs/quality-telemetry-guide.md)
- [Roadmap Status](docs/ROADMAP-STATUS.md)
- [Support Matrix](docs/support-matrix.md)
- [Governance](docs/governance.md)
- [Runtime Boundary](docs/workflows/core-vs-optional-runtime.md)
- [ADR 0001 — Optional Runtime Layer](docs/adr/0001-optional-runtime-layer.md)
- [ADR 0002 — Runtime Scope Freeze](docs/adr/0002-runtime-scope-freeze.md)

---

## Release hiện tại: v2.3.0

Điểm chính:

- Multi-Repository Learning xuất, kiểm tra và nhập lesson exchange batches giữa các repository.
- `vibe-lesson-exchange` giúp dùng exporter/importer/checker trong workflow có review rõ ràng.
- README, roadmap, dashboard và release metadata được sync với 38/38 validation gates.
- Runtime scope vẫn freeze theo ADR 0002; không thêm runtime feature bắt buộc.

---

## Contribute

Ưu tiên contribution cho core markdown surface:

- skills mới;
- commands tốt hơn;
- templates rõ hơn;
- docs onboarding;
- examples thực tế;
- validation/reporting;
- adapter compatibility.

Runtime expansion cần ADR exception theo [ADR 0002](docs/adr/0002-runtime-scope-freeze.md).

---

## License

MIT
