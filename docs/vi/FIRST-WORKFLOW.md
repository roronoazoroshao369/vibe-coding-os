# Luồng Công Việc Đầu Tiên

> Từ con số 0 đến vòng lặp spec→plan→implement→verify hoàn chỉnh trong 10 phút.

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

## Bước 6 — Luồng Công Việc Đầu Tiên Trong 10 Phút

Tạo thư mục để lưu spec và plan:

```bash
mkdir -p docs/specs docs/plans
```

Mở project trong AI coding assistant. Dán đúng prompt này trước:

```text
Use Vibe Coding OS.
Goal: build a simple counter app with increment, decrement, and reset.
Follow this loop: Spec → Plan → Implement → Review → Verify.
First, create the feature spec only. Include goals, non-goals, constraints, edge cases, and acceptance criteria. Do not implement yet.
```

Sau đó đi theo vòng lặp sau:

### 6a. Bắt Đầu Với Spec

Bạn có thể dùng prompt tiếng Anh để AI tool hiểu nhất quán, hoặc dùng bản tiếng Việt ngay dưới.

```text
Define a feature spec for a simple counter app with increment, decrement, and reset.
Include goals, non-goals, and acceptance criteria. Do not implement yet.
```

```text
Hãy định nghĩa spec cho một app counter đơn giản có increment, decrement, và reset.
Bao gồm goals, non-goals, và acceptance criteria. Chưa implement.
```

Lưu output vào `docs/specs/counter-app.md`.

### 6b. Tạo Plan

```text
Based on the spec at docs/specs/counter-app.md, create an implementation plan.
List the files to create, the steps to take, and the verification commands.
```

```text
Dựa trên spec tại docs/specs/counter-app.md, hãy tạo implementation plan.
Liệt kê file cần tạo, các bước thực hiện, và lệnh verification.
```

Lưu output vào `docs/plans/counter-app.md`.

### 6c. Implement

```text
Implement the plan from docs/plans/counter-app.md.
Create the files one at a time and verify each step.
```

```text
Implement plan từ docs/plans/counter-app.md.
Tạo từng file một và verify sau mỗi bước.
```

### 6d. Review

```text
Review the implementation against the spec.
List any bugs, missing features, or security concerns.
Do not make changes — just report.
```

```text
Review implementation so với spec.
Liệt kê bug, feature còn thiếu, hoặc vấn đề bảo mật.
Không chỉnh sửa code — chỉ báo cáo.
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
| Xem tài liệu adapter | [docs/adapters/README.md](../adapters/README.md) |
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
