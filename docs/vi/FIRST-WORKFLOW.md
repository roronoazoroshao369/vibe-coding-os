# Luồng Công Việc Đầu Tiên

> Từ con số 0 đến vòng lặp spec→plan→implement→verify hoàn chỉnh trong chưa đầy 15 phút.

## Yêu Cầu

| Yêu cầu | Tối thiểu |
|---------|-----------|
| Node.js | 18+ |
| Git | phiên bản bất kỳ |
| Trợ lý AI coding | Claude Code, Codex, Cursor, hoặc Gemini (chọn một) |

Không cần `npm install` cho framework. Chỉ cần Node và Git.

## Bước 1 — Clone và Link

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
npm link
```

Sau khi `npm link`, lệnh `vibe` có sẵn trên toàn hệ thống.

## Bước 2 — Kiểm Tra Sức Khoẻ

```bash
vibe doctor
```

Tất cả các kiểm tra phải xanh. Nếu thiếu gì, chạy `npm install` trong thư mục vibe-coding-os.

## Bước 3 — Chọn Công Cụ

Chọn adapter phù hợp với trợ lý coding của bạn:

```bash
# Dành cho Claude Code
vibe init claude-code

# Dành cho Cursor
vibe init cursor

# Dành cho Codex
vibe init codex

# Dành cho Gemini
vibe init gemini
```

Lệnh này copy file hướng dẫn phù hợp vào thư mục hiện tại của bạn.

## Bước 4 — Chạy Validation

```bash
npm run validate:all
```

Tất cả 19 cổng kiểm tra phải xanh. Điều này xác nhận framework khoẻ mạnh trước khi bạn bắt đầu xây dựng.

## Bước 5 — Luồng Công Việc Đầu Tiên

### 5a. Bắt Đầu với Spec

Mở dự án của bạn trong trợ lý AI coding. Nói với nó:

```
Hãy định nghĩa một feature spec cho ứng dụng đếm đơn giản (counter):
tăng, giảm, và reset. Bao gồm goals, non-goals, và tiêu chí chấp nhận.
Chưa implement — chỉ spec thôi.
```

Lưu kết quả vào `docs/specs/counter-app.md`.

### 5b. Tạo Plan

```
Dựa trên spec tại docs/specs/counter-app.md, hãy tạo implementation plan.
Liệt kê các file cần tạo, các bước thực hiện, và lệnh kiểm tra.
```

Lưu kết quả vào `docs/plans/counter-app.md`.

### 5c. Implement

```
Hãy implement plan từ docs/plans/counter-app.md.
Tạo từng file một và kiểm tra từng bước.
```

### 5d. Review

```
Hãy review implementation so với spec.
Liệt kê bug, thiếu sót, hoặc vấn đề bảo mật.
Chỉ report — không sửa.
```

### 5e. Kiểm Tra

Chạy test hoặc validation mà trợ lý của bạn đã tạo. Sau đó chạy:

```bash
npm run validate
```

## Bước 6 — Các Bước Tiếp Theo

| Bước tiếp theo | Lệnh hoặc link |
|----------------|----------------|
| Xem các lệnh có sẵn | `vibe list-commands` |
| Duyệt skills | `vibe list-skills` |
| Xem tất cả templates | `vibe templates` |
| Xem thống kê repo | `vibe stats` |
| Đọc tutorial đầy đủ | [docs/TUTORIAL.md](../TUTORIAL.md) |
| Đọc quickstart cho tool của bạn | [QUICKSTART.md](../QUICKSTART.md) |
| Xem tài liệu adapter | [adapters/](../../adapters/) |

## Mẹo

- **Bắt đầu nhỏ.** Một feature một file là luồng công việc đầu tiên tốt nhất.
- **Đừng bỏ qua spec.** Một spec 3 dòng còn tốt hơn nhảy thẳng vào code.
- **Một skill mỗi lần.** Dán lệnh, rồi gắn kèm một skill nếu cần.
- **Validate thường xuyên.** `npm run validate` phát hiện lỗi cấu trúc sớm.
- **Lưu quyết định vào file.** Lịch sử chat mất đi; file tồn tại mãi.

## Tóm Tắt Luồng Công Việc

```
Clone → npm link → vibe doctor → vibe init <tool> → validate:all
    → Spec → Plan → Implement → Review → Verify → Xong
```

Xem [ROADMAP-STATUS.md](../ROADMAP-STATUS.md) cho roadmap dự án và [SECURITY-MODEL.md](../SECURITY-MODEL.md) để biết framework xử lý bảo mật thế nào.
