# Quickstart — Hướng dẫn nhanh

> Hoàn thành setup trong dưới 10 phút. Sau khi setup, chạy [luồng đầu tiên](FIRST-WORKFLOW.md) để thấy framework hoạt động. Xem thêm [adapter hub](../adapters/README.md) để chọn tool.

---

## Bước 1: Clone và kiểm tra

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os.git
cd vibe-coding-os
npm install
npm run validate:all
```

Mục tiêu hiện tại: `npm run validate:all` PASS theo bộ gate hiện tại từ source-of-truth.

---

## Bước 2: Chọn adapter

Xem đầy đủ tại [docs/adapters/README.md](../adapters/README.md), gồm Claude Code, Codex, Cursor và Gemini.

### Claude Code

```bash
cp CLAUDE.md ./CLAUDE.md  # hoặc copy adapters/claude-code/README.md
```

Sau đó mở Claude Code trong repo và chạy prompt từ [docs/vi/FIRST-WORKFLOW.md](FIRST-WORKFLOW.md). Chi tiết: [Claude Code adapter](../../adapters/claude-code/README.md).

### Codex CLI

Codex dùng `AGENTS.md` làm instruction file chính (đã có sẵn trong repo root):

```bash
cp AGENTS.md ./AGENTS.md
```

Sau đó chạy Codex CLI trong repo. Chi tiết: [Codex adapter](../../adapters/codex/README.md).

### Cursor

```bash
cp -r adapters/cursor/rules/ .cursor/rules/  # hoặc paste .cursorrules
```

Sau đó mở Cursor trong repo. Chi tiết: [Cursor adapter](../../adapters/cursor/README.md).

---

## Bước 3: Chạy validate

```bash
npm run validate:all
```

Nếu `npm run validate:all` PASS, framework đã sẵn sàng.

---

## Bước 4: Chạy workflow đầu tiên

Xem [docs/vi/FIRST-WORKFLOW.md](FIRST-WORKFLOW.md) để chạy spec → plan → implement → verify.

---

## Cài đặt tùy chọn

Nếu muốn dùng runtime local:

```bash
npm run runtime:init
npm run runtime:validate
```

Runtime là optional. Bạn có thể dùng toàn bộ framework mà không cần runtime.

---

## Cần giúp?

- [Docs hub](../README.md)
- [Luồng đầu tiên](FIRST-WORKFLOW.md)
- [ROADMAP-STATUS](../ROADMAP-STATUS.md)
