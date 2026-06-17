# Vibe Coding OS — Hướng dẫn 15 Phút

> Từ con số 0 đến workflow đầu tiên chỉ trong 15 phút.

Hướng dẫn này dẫn bạn qua toàn bộ pipeline của Vibe Coding OS — từ clone repo đến tạo spec, plan, task, chạy validation, và review công việc. Bạn sẽ dùng CLI có sẵn trong framework và kết thúc với một vòng lặp workflow hoàn chỉnh.

## Dành Cho Ai

- **Lập trình viên solo** muốn dùng AI coding assistant mà vẫn giữ kỷ luật kỹ thuật.
- **Kỹ sư đang đánh giá Vibe Coding OS** cần cảm nhận thực tế đầu tiên.
- **Người đóng góp (contributor)** cần hiểu workflow trước khi gửi PR.
- Bất kỳ ai quen với terminal, Git, và `npm`. Không cần dependency nào khác.

> Chưa biết gì về dự án? Bắt đầu với [QUICKSTART.md](../QUICKSTART.md) để setup theo tool, rồi quay lại đây để trải nghiệm workflow đầy đủ.

## Yêu Cầu

| Yêu cầu | Phiên bản tối thiểu |
|----------|---------------------|
| Node.js | 18+ |
| Git | bản gần đây |
| npm | đi kèm với Node |
| AI coding assistant (không bắt buộc) | Claude Code, Codex CLI, Cursor hoặc tương tự |

> Framework **chạy markdown-first** — bạn có thể dùng nó như instruction thuần mà không cần runtime. CLI và runtime tùy chọn giúp trải nghiệm tốt hơn nhưng không bắt buộc.

## Bước 1 — Clone & Cài đặt (2 phút)

```bash
# Clone repo
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os

# Cài npm (xác nhận Node chạy được)
npm install

# Link CLI để gõ `vibe` ở mọi nơi
npm link
```

Sau khi link, bạn có hai cách dùng CLI:

```bash
# Cách A — global (sau npm link)
vibe doctor

# Cách B — không cần link
node scripts/vibe-cli.mjs doctor
```

## Bước 2 — Kiểm tra Sức khỏe với `vibe doctor` (1 phút)

```bash
vibe doctor
```

Bạn sẽ thấy tất cả các mục đều PASS:

```
🩺 Vibe Coding OS — Doctor

Checking repository structure...
  ✅ package.json found
  ✅ AGENTS.md found
  ✅ CHANGELOG.md found
  ✅ docs/ directory found
  ✅ skills/ directory found
  ✅ commands/ directory found
  ✅ templates/ directory found
  ✅ scripts/ directory found
  ✅ registry/ directory found
  ✅ references/ directory found

Checking validation scripts...
  ✅ scripts/validate-repo.mjs
  ✅ scripts/validate-references.mjs
  ✅ scripts/validate-traceability.mjs
  ✅ scripts/validate-injection.mjs

All checks passed! ✅
```

> **Mẹo:** Chạy `vibe doctor` đầu mỗi phiên làm việc và sau khi pull code mới.

## Bước 3 — Chạy Validation Đầy đủ (2 phút)

```bash
npm run validate:all
```

Lệnh này chạy cổng validation toàn diện: cấu trúc repo, reference, traceability, quét injection, phát hiện secret, redaction memory, smoke test adapter, và smoke test CLI. Tất cả đều phải xanh.

Kiểm tra nhanh cấu trúc có thể dùng:

```bash
npm run validate
```

## Bước 4 — Tạo Spec (2 phút)

Workflow của Vibe Coding OS là: **Intent → Spec → Plan → Implement → Test → Review → Memory → Merge**.

Hãy đi qua nó với một ví dụ nho nhỏ: thêm flag `--version` cho CLI.

```bash
vibe spec add-version-flag --copy
```

Lệnh này tạo file mẫu spec tại `docs/specs/add-version-flag.md`. Mở nó ra và điền:

- **Mục tiêu:** Hiện phiên bản framework khi gõ `vibe --version`.
- **Ngoài phạm vi:** Không thêm dependency mới; không sửa quy trình build.
- **Tiêu chí chấp nhận:**
  1. `vibe --version` in ra phiên bản từ `package.json`.
  2. `vibe -v` hoạt động như alias ngắn.
  3. Các lệnh hiện tại không bị ảnh hưởng.
  4. `npm run validate` vẫn PASS.

## Bước 5 — Tạo Plan (2 phút)

Sau khi spec xong:

```bash
vibe plan add-version-flag --copy
```

Tạo file `docs/plans/add-version-flag.md`. Điền vào:

- **File cần sửa:** `scripts/vibe-cli.mjs`
- **Các bước:**
  1. Đọc version từ `package.json` khi khởi động.
  2. Thêm flag `--version` và `-v` vào bộ xử lý tham số.
  3. In version và thoát.
- **Kiểm chứng:** `vibe --version` in ra đúng version string; `npm run validate` PASS.

## Bước 6 — Chia Task (1 phút)

```bash
vibe task add-version-flag --copy
```

Tạo file `docs/tasks/add-version-flag.md`. Thêm task có thứ tự:

1. **Task 1** — Import `readFileSync` và đọc version từ `package.json`. *(không phụ thuộc)*
2. **Task 2** — Thêm xử lý `--version` / `-v`. *(phụ thuộc Task 1)*
3. **Task 3** — Chạy `vibe --version` và kiểm tra output. *(phụ thuộc Task 2)*
4. **Task 4** — Chạy `npm run validate` để xác nhận không regression. *(phụ thuộc Task 3)*

## Bước 7 — Ghi Memory (1 phút)

Trước khi kết thúc phiên làm việc (hoặc trong lúc làm), ghi lại những gì bạn đã quyết định:

```bash
vibe memory session-notes --copy
```

Tạo file ghi chú trong `docs/memory/`. Điền vào:

- **Quyết định:** Dùng `package.json` làm nguồn version (single source of truth).
- **Vấn đề gặp:** Chưa có.
- **Việc tiếp theo:** Cân nhắc thêm output `--help` kèm version.

## Bước 8 — Chạy Báo cáo Đánh giá (2 phút)

```bash
npm run eval:report
```

Lệnh này chạy đánh giá toàn diện: repo validation, quét secret, redaction memory, và smoke test adapter. Báo cáo được lưu vào `docs/reports/evaluation-report.md`.

```
════════════════════════════════════════════════════════
  Vibe Coding OS — Evaluation Report
════════════════════════════════════════════════════════

  1. Repo Validation .............. PASS ✅
  2. Secret Scanning .............. PASS ✅
  3. Memory Redaction (30/30) ..... PASS ✅
  4. Adapter Smoke Tests .......... PASS ✅

  Result: 4/4 checks passed ✅
════════════════════════════════════════════════════════
```

## Bước 9 — Review & Checklist Trước Merge (2 phút)

Trước khi merge, xem checklist này (theo [core workflow contract](../core-workflow-contract.md)):

- [ ] **Intent đã thỏa mãn** — `vibe --version` làm đúng như spec.
- [ ] **Spec đạt** — tất cả tiêu chí chấp nhận đều PASS.
- [ ] **Plan đã thực thi** — tất cả bước đã hoàn thành.
- [ ] **Test PASS** — `npm run validate` thoát với mã 0.
- [ ] **Review xong** — diff đã được kiểm tra correctness, simplicity, security.
- [ ] **Memory đã ghi** — quyết định và follow-up đã lưu.
- [ ] **Sẵn sàng merge** — không còn blocker.
- [ ] **Attribution sạch** — không có nội dung chưa cấp phép.

```bash
# Validation cuối
npm run validate

# Nếu tất cả OK, commit
git add -A
git commit -m "feat: add --version flag to CLI"
```

## Bước 10 — Tiếp Theo Là Gì

Bạn đã hoàn thành vòng lặp workflow đầy đủ. Đây là các hướng tiếp theo:

| Chủ đề | Xem ở đâu |
|--------|-----------|
| Setup theo tool cụ thể | [QUICKSTART.md](../QUICKSTART.md) — Claude Code, Codex, Cursor |
| Runtime (JSON state, MCP, tmux) | [RUNTIME-GUIDE.md](../RUNTIME-GUIDE.md) |
| Ví dụ workflow hoàn chỉnh | [`examples/`](../../examples/) — feature, bugfix, legacy, refactor, multi-agent |
| Tất cả lệnh CLI | [`examples/cli-workflows/README.md`](../../examples/cli-workflows/README.md) |
| Hướng dẫn chọn skill | [skill-decision-guide.md](../skill-decision-guide.md) |
| Tài liệu tiếng Việt khác | [`docs/vi/index.md`](index.md) |
| Đóng góp | [CONTRIBUTING.md](../../CONTRIBUTING.md) |

## Khắc phục Sự cố

| Vấn đề | Giải pháp |
|--------|-----------|
| Không tìm thấy lệnh `vibe` | Chạy lại `npm link`, hoặc dùng `node scripts/vibe-cli.mjs <command>` |
| `npm run validate` báo lỗi | Kiểm tra file có đủ không — chạy `vibe doctor` trước |
| Lỗi phiên bản Node.js | Nâng cấp lên Node 18+: `nvm install 18` hoặc tải từ nodejs.org |
| `vibe doctor` báo thiếu file | Chạy `git status` để xem file nào bị xóa; `git checkout -- .` để phục hồi |
| Template không được tạo | Đảm bảo bạn chạy lệnh từ thư mục gốc của repo (`~/vibe-coding-os`) |
| Eval report bị lỗi | Đọc chi tiết trong `docs/reports/evaluation-report.md` |
| Template spec/plan/task để trống | Bạn cần tự điền nội dung — template chỉ là điểm khởi đầu, không tự sinh code |
| Runtime install lỗi | Kiểm tra Node.js 18+; runtime là tùy chọn, có thể bỏ qua |

## Tham khảo Nhanh

| Lệnh | Mục đích | Khi nào dùng |
|------|----------|--------------|
| `vibe doctor` | Kiểm tra sức khỏe repo | Đầu mỗi phiên |
| `vibe spec <tên> --copy` | Tạo spec mẫu | Trước khi làm việc không trivial |
| `vibe plan <tên> --copy` | Tạo plan mẫu | Sau khi spec được duyệt |
| `vibe task <tên> --copy` | Chia task | Sau khi plan viết xong |
| `vibe memory session-notes --copy` | Ghi chú phiên làm việc | Cuối phiên |
| `vibe templates` | Xem danh sách template | Khi bắt đầu loại task mới |
| `npm run validate` | Kiểm tra cấu trúc | Sau khi sửa cấu trúc |
| `npm run validate:all` | Cổng validation đầy đủ | Trước release hoặc thay đổi lớn |
| `npm run eval:report` | Đánh giá toàn diện | Trước release |

---

*Bạn vừa hoàn thành workflow của Vibe Coding OS. Framework được thiết kế nhẹ nhàng — dùng bao nhiêu tùy theo nhu cầu của task.*
