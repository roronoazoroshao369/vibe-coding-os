# Vibe Coding OS

[![Validate Repository](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/validate.yml/badge.svg)](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/validate.yml)

> **Workflow contract first. Runtime optional. Human intent stays sovereign.**

**English:** [README.md](README.md)

Vibe Coding OS là framework markdown-first giúp con người và coding agent biến intent thành phần mềm đã được kiểm chứng. Nó cung cấp một workflow contract portable cho Claude Code, Codex, Cursor, Gemini, Cline, Continue, Aider, Windsurf, MCP và các agent harness tương tự: viết spec trước, lập plan rõ, implement từng bước nhỏ, verify trung thực, rồi lưu memory an toàn.

Nó không phải wrapper bắt buộc, hosted service, product platform hay runtime bắt buộc. Runtime chỉ là lớp local tùy chọn cho task state, memory, checkpoints, team/session, daemon, MCP và tmux runner khi bạn thật sự cần.

## Trạng thái hiện tại

**Bản phát hành hiện tại (v2.18.0):** validate:all **16/16 gates PASS** · **112 skills** · **115 commands** · **107 templates** · **22 tracked sources** · **9 adapters**.

**Mới nhất:** v2.18.0 — Surface Simplification. Release này tập trung vào Core 10 golden path, living roadmap hygiene, privacy coverage, maintainer sustainability và source-of-truth sync. Lịch sử đầy đủ nằm trong [`CHANGELOG.md`](CHANGELOG.md).

**Chính sách count:** số command public lấy từ `commands/manifest.json`; file compatibility cũ có thể còn trên disk nhưng không tính vào headline inventory. Count release-facing và số gate lấy từ [`scripts/repo-metadata.mjs`](scripts/repo-metadata.mjs), chạy bằng `npm run count:all`.

---

## Bắt đầu ở đây

| Nếu bạn mới dùng | Bạn cần |
|---|---|
| [**Core 10**](docs/CORE-10.md) | 10 capability dùng nhiều nhất trong công việc hằng ngày |
| [Luồng đầu tiên](docs/vi/FIRST-WORKFLOW.md) | Chạy một vòng `spec → plan → verify` hoàn chỉnh |
| [Quickstart](docs/vi/QUICKSTART.md) | Setup nhanh Claude Code, Codex, Cursor hoặc Gemini |
| [Adapter hub](docs/adapters/README.md) | Hướng dẫn theo từng tool |
| [Install guide](INSTALL.md) | Plugin, clone, CLI và zero-runtime |
| [Docs tiếng Việt](docs/vi/index.md) | Onboarding và glossary tiếng Việt |

## Workflow mặc định

```text
Intent → Spec → Plan → Implement → Test → Review → Memory → Merge
```

- **Intent** — ghi rõ người dùng muốn gì và vì sao.
- **Spec** — định nghĩa behavior, constraint, non-goal và acceptance criteria.
- **Plan** — chia việc thành bước nhỏ, có thể review.
- **Implement** — sửa tập trung theo plan.
- **Test** — chạy check nhỏ nhất có ý nghĩa trước, rồi validation rộng hơn.
- **Review** — kiểm tra correctness, simplicity, security và maintainability.
- **Memory** — lưu quyết định bền vững, không lưu secret.
- **Merge** — chỉ ship khi trạng thái verification rõ ràng.

## Các bề mặt chính

| Surface | Mục đích |
|---|---|
| `skills/` | Kỷ luật engineering và workflow agent có thể tái dùng |
| `commands/` | Prompt dạng slash-command như `/vibe-spec`, `/vibe-plan`, `/vibe-review` |
| `templates/` | Spec, plan, task, ADR, review, memory, runbook, scorecard |
| `registry/` | Metadata discovery cho skills, commands, templates và sources |
| `adapters/` | Setup cho Claude Code, Codex, Cursor, Gemini, Cline, Continue, Aider, Windsurf và MCP |
| `runtime/` | Local JSON helpers tùy chọn cho state/team/session/MCP |
| `references/` | Reference intelligence và attribution mapping |

## Runtime tùy chọn

```bash
npm run runtime:install
npm run runtime:init
npm run runtime:validate
```

Dùng runtime khi cần task state, memory, checkpoints, team orchestration, session capture, daemon workflow, MCP tools hoặc tmux team execution. Nếu không cần, chỉ dùng markdown skills/commands/templates là đủ. Xem [`docs/RUNTIME-GUIDE.md`](docs/RUNTIME-GUIDE.md).

## Validation

```bash
npm run validate
npm run validate:all
npm run count:all
npm run dashboard:check
```

`validate:all` hiện có docs/source-of-truth sync gate để bắt lệch giữa README, README.vi, ROADMAP, ROADMAP-STATUS, DASHBOARD và command manifest trước khi merge.

## Roadmap và plan

- [`ROADMAP.md`](ROADMAP.md) — mission, principles, active roadmap và recent releases.
- [`docs/ROADMAP-STATUS.md`](docs/ROADMAP-STATUS.md) — status summary đến v2.18.0 và active roadmap.
- [`docs/plans/2026-06-23-long-term-quality-roadmap-v2.19-to-v3.0.md`](docs/plans/2026-06-23-long-term-quality-roadmap-v2.19-to-v3.0.md) — long-term quality roadmap canonical.
- [`CHANGELOG.md`](CHANGELOG.md) — toàn bộ lịch sử release.

## Triết lý

1. **Human intent stays sovereign.** Assistant có thể đề xuất nhưng không được âm thầm mở rộng scope.
2. **Small correct changes beat grand rewrites.** Ưu tiên bước nhỏ, review được, rollback được.
3. **Spec là công cụ suy nghĩ.** Không phải bureaucracy.
4. **Verification là một phần của done.** Không claim thành công khi chưa có evidence hoặc limitation rõ.
5. **Memory phải hữu ích, mới và an toàn.** Lưu quyết định bền vững, không lưu secret.
6. **Attribution là artifact hạng nhất.** Ý tưởng bên ngoài phải được track, rewrite và map trước khi dùng.

## Đóng góp

Đọc [`CONTRIBUTING.md`](CONTRIBUTING.md), [`MAINTAINERS.md`](MAINTAINERS.md) và [`docs/CONTRIBUTING-SKILLS.md`](docs/CONTRIBUTING-SKILLS.md). Trước khi merge thay đổi structural/docs, chạy `npm run validate:all` và sửa mọi source-of-truth drift.

## License và attribution

Xem [`NOTICE.md`](NOTICE.md), [`ATTRIBUTIONS.md`](ATTRIBUTIONS.md) và [`LICENSE`](LICENSE).
