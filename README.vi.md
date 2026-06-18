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

**Bản phát hành hiện tại (v1.5.0):** validate:all 23/23 gates PASS · **112 skills** · **87 commands** · **79 templates** · 14 tracked sources

**Bắt đầu:** [Luồng đầu tiên](docs/vi/FIRST-WORKFLOW.md) · [Quickstart](docs/vi/QUICKSTART.md) · [Docs hub](docs/README.md)

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

## Core vs Optional Runtime

### Core markdown layer

Đây là sản phẩm chính:

- `skills/` — quy trình thao tác reusable.
- `commands/` — prompt-command surface cho AI coding tools.
- `templates/` — specs, plans, review, feedback, handoff.
- `docs/` — contract, onboarding, governance, roadmap.
- `adapters/` — Claude Code, Codex, Cursor, Gemini, OpenCode, Qwen.
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

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os.git
cd vibe-coding-os
npm install
npm run validate:all
```

Nếu bạn chỉ muốn dùng workflow markdown, không cần runtime setup.

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

- `adapters/claude-code/` — Claude Code
- `adapters/codex/` — Codex CLI
- `adapters/cursor/` — Cursor rules workflow

Xem thêm: [Compatibility Matrix](adapters/compatibility-matrix.md)

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

Mục tiêu release: **21/21 PASS**.

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
- [Roadmap Status](docs/ROADMAP-STATUS.md)
- [Support Matrix](docs/support-matrix.md)
- [Governance](docs/governance.md)
- [Runtime Boundary](docs/workflows/core-vs-optional-runtime.md)
- [ADR 0001 — Optional Runtime Layer](docs/adr/0001-optional-runtime-layer.md)
- [ADR 0002 — Runtime Scope Freeze](docs/adr/0002-runtime-scope-freeze.md)

---

## Release hiện tại: v1.5.0

Điểm chính:

- Runtime scope freeze chính thức.
- README.vi.md được diet để giảm onboarding overload.
- Roadmap cập nhật v1.4.1 → v1.5.0.
- Config hardening: normalize risk level, validate tool lists.
- MCP approval scoped theo args hash.
- Negative TTL bị reject ở public task lease APIs.
- Thêm Vietnamese Quickstart và adoption feedback template.

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
