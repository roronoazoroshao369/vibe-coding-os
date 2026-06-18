# Hướng dẫn Adapter cho Claude Code

Dùng khi công cụ hỗ trợ lập trình của bạn là Claude Code.

Liên quan: [hướng dẫn phạm vi cài đặt](../setup-scope-guide.md), [workflow đầu tiên](../FIRST-WORKFLOW.md).

## Cài đặt nhanh: file trong dự án

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
npm link

cd ~/du-an-cua-ban
vibe init claude-code
vibe doctor --project .
```

## Lệnh cần gõ?

Cài đặt vào dự án (khuyến khích):

```bash
cd ~/du-an-cua-ban
vibe init claude-code
```

Cài đặt thủ công thay thế:

```bash
cd ~/du-an-cua-ban
cp ~/vibe-coding-os/CLAUDE.md ./CLAUDE.md
```

Cài đặt plugin toàn cục (nếu muốn một lần cho nhiều repo):

```text
/plugin marketplace add https://github.com/roronoazoroshao369/vibe-coding-os
/plugin install vibe-coding-os
```

## File nào được tạo?

Cài đặt vào dự án tạo ra:

```text
CLAUDE.md
```

Claude Code đọc file này từ gốc dự án làm hướng dẫn riêng cho dự án.

## Cách mở tool?

Từ thư mục dự án:

```bash
cd ~/du-an-cua-ban
claude
```

Hoặc mở dự án trong Claude Code như bạn vẫn thường làm.

## Prompt đầu tiên cần paste

```text
Đọc CLAUDE.md và thực hiện theo Vibe Coding OS workflow. Bắt đầu với spec cho tính năng: <mô tả thay đổi nhỏ của bạn>. Bao gồm mục tiêu, ngoài mục tiêu, ràng buộc, trường hợp biên, và tiêu chí chấp nhận. Chưa được implement.
```

Nếu dùng plugin, bạn có thể bắt đầu với lệnh dạng command:

```text
/vibe-spec <mô tả thay đổi nhỏ của bạn>
```

## Cách kiểm tra đã cài đặt thành công

Hỏi Claude Code:

```text
Bạn đã tải hướng dẫn dự án nào? Xác nhận xem bạn có thể thấy CLAUDE.md hay Vibe Coding OS plugin commands, rồi liệt kê bước workflow đầu tiên.
```

Tín hiệu mong đợi:

- Nó nhắc đến Vibe Coding OS.
- Nó biết vòng lặp spec → plan → implement → review → verify.
- Nó có thể truy cập `/vibe-*` commands nếu dùng plugin, hoặc `CLAUDE.md` nếu cài vào dự án.

Kiểm tra qua CLI:

```bash
cd ~/du-an-cua-ban
vibe doctor --project .
```

## Các lỗi thường gặp

- **`CLAUDE.md` ở thư mục sai:** chạy setup từ gốc dự án, không phải từ `~/vibe-coding-os`.
- **Claude Code đang mở sẵn:** khởi động lại Claude Code hoặc tải lại dự án sau khi tạo `CLAUDE.md`.
- **Plugin đã cài nhưng lệnh bị thiếu:** kiểm tra lại URL marketplace, rồi cài lại với `/plugin install vibe-coding-os`.
- **Xung đột giữa plugin và file dự án:** giữ các ràng buộc riêng dự án trong `CLAUDE.md`; giữ hành vi workflow chung trong plugin.
- **Lệnh `vibe` không tìm thấy:** chạy `npm link` từ `~/vibe-coding-os`, hoặc dùng lệnh `cp` thủ công.

## So sánh plugin và cài đặt vào dự án

- **Plugin:** phù hợp nhất khi bạn dùng Claude Code trên nhiều repository. Lệnh và skill khả dụng toàn cục trong Claude Code.
- **Cài đặt vào dự án (`CLAUDE.md`):** phù hợp khi team muốn hướng dẫn được version control và review trong mỗi repository.
- **Cả hai:** chấp nhận được khi `CLAUDE.md` chỉ thêm các ràng buộc riêng dự án và không trùng lặp hướng dẫn workflow chung.
