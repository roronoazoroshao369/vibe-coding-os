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

**Bản phát hành hiện tại (v2.0.0):** validate:all 26/26 gates PASS · **114 skills** · **88 commands** · **81 templates** · 14 tracked sources

**Mới:** v2.0.0 Quality Engine — thêm runner điều phối quality gates, profile lean/heavy, báo cáo markdown/JSON và đề xuất sửa lỗi có mục tiêu. Runtime không đổi.

**CTA đầu tiên:** Nếu bạn mới bắt đầu, hãy chạy ngay [Luồng đầu tiên](docs/vi/FIRST-WORKFLOW.md) để hoàn tất một vòng `spec → plan → verify` trước khi đọc runtime hay tooling cho maintainer.

**Bắt đầu:** [Luồng đầu tiên](docs/vi/FIRST-WORKFLOW.md) · [Quickstart](docs/vi/QUICKSTART.md) · [Adapter hub](docs/adapters/README.md) · [Docs hub](docs/README.md)

## Có gì mới trong v2.0.0

- **Quality Engine:** `scripts/quality-engine.mjs` chạy quality gates theo profile, ghi timing và xuất JSON có cấu trúc.
- **Báo cáo:** `scripts/quality-engine-report.mjs` tạo markdown/structured report để làm bằng chứng review và release.
- **Skill + command:** `skills/core/quality-engine/SKILL.md` và `commands/vibe-quality-engine.md` hướng dẫn workflow.
- **Guide chính:** `docs/quality-engine-guide.md` mô tả profile, config, reporting và cách áp dụng.
- **Registry sync:** Quality Engine skill/command đã có trong `registry/skills.json` và `registry/prompts.json`.
- **Không mở runtime:** v2.0.0 tiếp tục tuân thủ ADR 0002; không yêu cầu daemon hay hosted service.

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

Mục tiêu release: **26/26 PASS**.

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
- [Roadmap Status](docs/ROADMAP-STATUS.md)
- [Support Matrix](docs/support-matrix.md)
- [Governance](docs/governance.md)
- [Runtime Boundary](docs/workflows/core-vs-optional-runtime.md)
- [ADR 0001 — Optional Runtime Layer](docs/adr/0001-optional-runtime-layer.md)
- [ADR 0002 — Runtime Scope Freeze](docs/adr/0002-runtime-scope-freeze.md)

---

## Release hiện tại: v2.0.0

Điểm chính:

- Quality Engine điều phối quality gates bằng profile lean/heavy và structured output.
- Báo cáo Quality Engine hỗ trợ evidence cho review/release và đề xuất sửa lỗi.
- README, roadmap, dashboard và release metadata được sync với 26/26 validation gates.
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
