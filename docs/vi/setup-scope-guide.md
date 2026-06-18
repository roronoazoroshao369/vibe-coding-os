# Hướng dẫn phạm vi cài đặt — Setup Scope Guide

Vibe Coding OS có thể dùng theo nhiều phạm vi khác nhau. Chọn đúng scope giúp tránh hai lỗi phổ biến:

- Cài quá rộng khi chỉ cần thử nhanh.
- Copy thủ công vào quá nhiều repo khi nên dùng plugin/global setup.

## Luồng chọn nhanh

- **Bạn dùng Claude Code và muốn setup một lần cho nhiều repo?**
  - Chọn **Global — plugin Claude Code**.
- **Bạn muốn instruction sống trong từng repo để dễ review/version control?**
  - Chọn **Per-repo — copy adapter/instruction**.
- **Bạn chỉ muốn thử nhanh, hoặc dùng tool không hỗ trợ plugin?**
  - Chọn **Manual — paste prompt/skill khi cần**.
- **Bạn cần CLI, validate scripts, hoặc runtime local?**
  - Clone repo trước (Local checkout), sau đó dùng CLI hoặc chọn scope phù hợp.

## Các loại scope

### 1. Global — plugin Claude Code

**Phù hợp:** người dùng Claude Code muốn `/vibe-*` commands và skills luôn sẵn trong nhiều repo.

**Cách hoạt động:** plugin đăng ký trong Claude Code settings; không cần copy file vào từng project.

```text
/plugin marketplace add https://github.com/roronoazoroshao369/vibe-coding-os
/plugin install vibe-coding-os
```

Fallback qua shell:

```bash
curl -fsSL https://raw.githubusercontent.com/roronoazoroshao369/vibe-coding-os/main/install.sh | bash
```

**Ưu điểm:** setup một lần, ít drift giữa repo, nhanh nhất cho Claude Code.

**Nhược điểm:** scope nằm trong config Claude Code; nếu team muốn review instruction trong từng repo, cần thêm per-repo docs/rules.

### 2. Per-repo — copy adapter/instruction vào target project

**Phù hợp:** team muốn instruction sống cùng codebase, review qua PR, và có thể khác theo từng project.

Ví dụ:

```bash
# Codex CLI
cp ~/vibe-coding-os/AGENTS.md ./AGENTS.md

# Gemini CLI
cp ~/vibe-coding-os/AGENTS.md ./GEMINI.md

# Claude Code per repo
cp ~/vibe-coding-os/CLAUDE.md ./CLAUDE.md
```

Cursor/other assistants: paste `CLAUDE.md` hoặc adapter rules vào project rules.

**Ưu điểm:** rõ ràng, reviewable, reproducible per project.

**Nhược điểm:** phải lặp lại mỗi repo; cần cập nhật khi framework thay đổi guidance.

### 3. Manual — paste/attach chỉ phần cần dùng

**Phù hợp:** thử nhanh, one-off tasks, hoặc assistant không đọc file project ổn định.

Cách dùng:

1. Giữ一份 local clone của Vibe Coding OS.
2. Paste prompt từ `commands/` cho phase hiện tại.
3. Đính kèm nội dung `skills/*/SKILL.md` khi cần.
4. Yêu cầu assistant theo workflow trong target project.

**Ưu điểm:** không cài gì, không đổi file project.

**Nhược điểm:** ít tự động hơn; dễ quên skill/command; phải paste lại.

### 4. Local checkout / CLI — cho maintainer hoặc power-user

**Phù hợp:** maintainer, contributor, và người dùng muốn `vibe` CLI, validation scripts, hoặc optional runtime.

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
npm link
npm run validate
```

Sau đó trong target project:

```bash
cd ~/your-project
vibe init claude   # hoặc: codex, cursor, generic
vibe doctor --project .
```

**Lưu ý scope:** `npm link` giúp CLI khả dụng toàn cục trên máy, nhưng instruction trong project vẫn thường là **per-repo** trừ khi dùng plugin Claude Code.

## Đường dẫn khuyến nghị

- **Người mới dùng Claude Code:** dùng **Global plugin**, sau đó chạy workflow đầu tiên.
- **Team có shared rules trong repo:** dùng **Per-repo adapter copy** để thay đổi visible trong PR.
- **Dùng Codex/Gemini/Cursor:** bắt đầu với **Per-repo adapter copy**; dùng **Manual** để thử nhanh.
- **Maintainer framework:** dùng **Local checkout / CLI**, sau đó chọn plugin hoặc per-repo adapters cho target projects.
- **Runtime user:** bắt đầu với **Local checkout / CLI**. Runtime là optional.

## English quick notes

- **Global** = set up once, use across repos. Best for Claude Code plugin.
- **Per-repo** = each repo has its own instruction file. Best for teams and PR review.
- **Manual** = no install; paste only the prompts/skills you need. Best for quick trials.
- **Runtime** is optional. Core framework is markdown-first and works without daemon/database/MCP.

## Related docs

- [`../../INSTALL.md`](../../INSTALL.md) — full install paths.
- [`../QUICKSTART.md`](../QUICKSTART.md) — 10-minute setup.
- [`../FIRST-WORKFLOW.md`](../FIRST-WORKFLOW.md) — first workflow after setup.
- [`../adapter-install-snippets.md`](../adapter-install-snippets.md) — adapter snippets.
