# Quickstart — Hướng dẫn nhanh

> Hoàn thành setup trong dưới 10 phút. Sau khi setup, chạy [luồng đầu tiên](FIRST-WORKFLOW.md) để thấy framework hoạt động.

---

## Bước 1: Clone và kiểm tra

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os.git
cd vibe-coding-os
npm install
npm run validate:all
```

Mục tiêu: 20/20 PASS.

---

## Bước 2: Chọn adapter

### Claude Code

```bash
cp adapters/claude-code/skills.md docs/  # hoặc paste nội dung vào CLAUDE.md
```

Sau đó mở Claude Code trong repo và chạy prompt từ docs/FIRST-WORKFLOW.md.

### Codex CLI

```bash
cp adapters/codex/AGENTS.md ./AGENTS.md
```

Sau đó chạy Codex CLI trong repo.

### Cursor

```bash
cp adapters/cursor/rules.md .cursor/rules/  # hoặc paste .cursorrules
```

Sau đó mở Cursor trong repo.

---

## Bước 3: Chạy validate

```bash
npm run validate:all
```

Nếu 20/20 PASS, framework đã sẵn sàng.

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
