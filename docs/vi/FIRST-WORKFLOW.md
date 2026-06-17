# Luồng Công Việc Đầu Tiên

> Từ con số 0 đến vòng lặp spec→plan→implement→verify hoàn chỉnh trong chưa đầy 15 phút.

## Yêu Cầu

| Yêu cầu | Tối thiểu |
|---------|-----------|
| Node.js | 18+ |
| Git | phiên bản gần đây |
| AI coding assistant | Claude Code, Codex, Cursor, hoặc Gemini (chọn một) |

Framework khá nhẹ dependency. Bạn chỉ cần Node và Git để bắt đầu.

## Bước 1 — Clone và Link Framework

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
npm link
```

Sau `npm link`, lệnh `vibe` sẽ có sẵn toàn cục. Đây là bước setup một lần.

## Bước 2 — Validate Framework

```bash
vibe doctor
```

Bạn nên thấy tất cả checks pass. Nếu thiếu gì đó, chạy `npm install` trong `~/vibe-coding-os`.

Sau đó chạy bộ validation của framework:

```bash
npm run validate:all
```

> **Lưu ý:** `npm run validate:all` validate chính framework này (20 gates). Nó khác với test của app/project của bạn.

## Bước 3 — Chuyển Sang Project Thật Của Bạn

Bây giờ chuyển vào project nơi bạn sẽ build feature:

```bash
cd ~/your-project
```

Nếu chưa có project, tạo một project nhỏ:

```bash
mkdir ~/my-first-vibe-app && cd ~/my-first-vibe-app
npm init -y
```

## Bước 4 — Khởi Tạo Adapter Cho Tool Của Bạn

Chọn adapter khớp với AI coding assistant bạn dùng:

```bash
# Claude Code users
vibe init claude-code

# Cursor users
vibe init cursor

# Codex users
vibe init codex

# Gemini users
vibe init gemini
```

Lệnh này copy instruction file phù hợp (`CLAUDE.md`, `AGENTS.md`, `.cursorrules`, hoặc `GEMINI.md`) vào thư mục project thật của bạn.

## Bước 5 — Kiểm Tra Project Đã Sẵn Sàng

```bash
vibe doctor --project .
```

Lệnh này xác nhận project thật đã có instruction file mà AI assistant cần.

## Bước 6 — Luồng Công Việc Đầu Tiên

Tạo thư mục để lưu spec và plan:

```bash
mkdir -p docs/specs docs/plans
```

Mở project trong AI coding assistant và đi theo vòng lặp sau:

### 6a. Bắt Đầu Với Spec

```
Define a feature spec for a simple counter app with increment, decrement, and reset.
Include goals, non-goals, and acceptance criteria. Do not implement yet.
```

Lưu output vào `docs/specs/counter-app.md`.

### 6b. Tạo Plan

```
Based on the spec at docs/specs/counter-app.md, create an implementation plan.
List the files to create, the steps to take, and the verification commands.
```

Lưu output vào `docs/plans/counter-app.md`.

### 6c. Implement

```
Implement the plan from docs/plans/counter-app.md.
Create the files one at a time and verify each step.
```

### 6d. Review

```
Review the implementation against the spec.
List any bugs, missing features, or security concerns.
Do not make changes — just report.
```

### 6e. Verify

Chạy test/validation bình thường của project bạn:

```bash
npm test        # hoặc: npm run lint, npm run typecheck
```

Sau đó kiểm tra lại project readiness:

```bash
vibe doctor --project .
```

## Bước 7 — Làm Gì Tiếp Theo

| Bước tiếp theo | Lệnh hoặc link |
|----------------|----------------|
| Xem các lệnh có sẵn | `vibe list-commands` |
| Duyệt skills | `vibe list-skills` |
| Xem tất cả templates | `vibe templates` |
| Xem thống kê repo | `vibe stats` |
| Đọc tutorial đầy đủ | [docs/TUTORIAL.md](../TUTORIAL.md) |
| Đọc quickstart cho tool của bạn | [QUICKSTART.md](../QUICKSTART.md) |
| Xem tài liệu adapter | [adapters/](../../adapters/) |
| Ví dụ React/Next.js thực tế | [examples/react-nextjs-booking-workflow/](../../examples/react-nextjs-booking-workflow/) |

## Mẹo

- **Bắt đầu nhỏ.** Một feature một file là luồng công việc đầu tiên tốt nhất.
- **Đừng bỏ qua spec.** Một spec 3 dòng còn tốt hơn nhảy thẳng vào code.
- **Một skill mỗi lần.** Dán lệnh, rồi gắn kèm một skill nếu cần.
- **Validate framework, rồi validate app.** Đây là 2 bước khác nhau, đều quan trọng.
- **Lưu quyết định vào file.** Lịch sử chat mất đi; file tồn tại mãi.

## Tóm Tắt Luồng Công Việc

```
Clone → npm link → vibe doctor → validate:all (trong framework)
    → cd ~/your-project → vibe init <tool> → vibe doctor --project .
    → Spec → Plan → Implement → Review → Verify → Xong
```

Muốn xem ví dụ chi tiết hơn? Hãy thử [React/Next.js booking workflow](../../examples/react-nextjs-booking-workflow/README.md).

Xem [ROADMAP-STATUS.md](../ROADMAP-STATUS.md) cho roadmap dự án và [SECURITY-MODEL.md](../SECURITY-MODEL.md) để biết framework xử lý bảo mật thế nào.
