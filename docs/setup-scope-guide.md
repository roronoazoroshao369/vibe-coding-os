# Setup Scope Guide — Chọn phạm vi cài đặt

Vibe Coding OS có thể dùng theo nhiều phạm vi khác nhau. Chọn đúng scope giúp bạn tránh hai lỗi phổ biến: cài quá rộng khi chỉ cần thử nhanh, hoặc copy thủ công vào quá nhiều repo khi nên dùng plugin/global setup.

## Quick decision flow / Luồng chọn nhanh

- **Bạn dùng Claude Code và muốn setup một lần cho nhiều repo?**
  - Chọn **Global — Claude Code plugin**.
- **Bạn muốn mỗi repo tự chứa instruction file để dễ review/version control?**
  - Chọn **Per-repo adapter copy**.
- **Bạn chỉ muốn thử nhanh, dùng tool không hỗ trợ plugin, hoặc không muốn ghi file vào repo?**
  - Chọn **Manual / paste-by-prompt**.
- **Bạn là maintainer hoặc muốn dùng `vibe` CLI/runtime từ checkout local?**
  - Chọn **Local checkout**, rồi dùng global CLI hoặc copy adapter theo từng repo.

## Scope labels

### 1. Global — Claude Code plugin (recommended for Claude Code)

**Best for:** người dùng Claude Code muốn `/vibe-*` commands và skills luôn sẵn trong nhiều repositories.

**How it works:** plugin được đăng ký trong Claude Code settings, không copy file vào từng project.

```text
/plugin marketplace add https://github.com/roronoazoroshao369/vibe-coding-os
/plugin install vibe-coding-os
```

Shell fallback:

```bash
curl -fsSL https://raw.githubusercontent.com/roronoazoroshao369/vibe-coding-os/main/install.sh | bash
```

**Pros:** setup một lần, ít drift giữa repo, nhanh nhất cho Claude Code.

**Trade-offs:** scope nằm trong Claude Code config; nếu team muốn review instruction trong từng repo, cần thêm per-repo docs/rules.

### 2. Per-repo — adapter/instruction file copied into target project

**Best for:** team muốn instruction sống cùng codebase, được review qua PR, và có thể khác nhau theo từng project.

Examples:

```bash
# Codex CLI
cp ~/vibe-coding-os/AGENTS.md ./AGENTS.md

# Gemini CLI
cp ~/vibe-coding-os/AGENTS.md ./GEMINI.md

# Claude Code manual per repo
cp ~/vibe-coding-os/CLAUDE.md ./CLAUDE.md
```

Cursor/other assistants: paste `CLAUDE.md` or adapter rules into project rules (for example `.cursor/rules/` or equivalent).

**Pros:** explicit, reviewable, reproducible per project.

**Trade-offs:** repeat for each repo; update copied files when framework guidance changes.

### 3. Manual — paste/attach only what you need

**Best for:** thử nhanh, one-off tasks, locked-down repos, or assistants that cannot load project files reliably.

Use it like this:

1. Keep a local clone of Vibe Coding OS.
2. Paste a command prompt from `commands/` for the current phase.
3. Attach or paste relevant `skills/*/SKILL.md` content when needed.
4. Ask the assistant to follow the workflow in your target project.

**Pros:** no install, no project file changes, very portable.

**Trade-offs:** less automatic; easier to forget a skill/command; repeated copy-paste.

### 4. Local checkout / CLI — maintainer or power-user path

**Best for:** maintainers, contributors, and users who want the `vibe` CLI, validation scripts, or optional runtime.

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
npm link
npm run validate
```

Then in your target project:

```bash
cd ~/your-project
vibe init claude   # or: codex, cursor, generic
vibe doctor --project .
```

**Scope note:** `npm link` makes the CLI available globally on your machine, but project instructions are still usually **per repo** unless you use the Claude Code plugin.

## Recommended paths

- **New Claude Code user:** use **Global plugin**, then run your first workflow.
- **Team repo with shared rules:** use **Per-repo adapter copy** so changes are visible in PRs.
- **Codex/Gemini/Cursor user:** start with **Per-repo adapter copy**; use **Manual** for quick experiments.
- **Framework maintainer:** use **Local checkout / CLI**, then choose plugin or per-repo adapters for target projects.
- **Runtime user:** start with **Local checkout / CLI**. Runtime is optional and should be initialized only when you need local task/memory/checkpoint/team/session state.

## Vietnamese quick notes / Ghi nhớ nhanh

- **Global** = cài một lần, dùng nhiều repo. Phù hợp nhất với Claude Code plugin.
- **Per-repo** = mỗi repo có file hướng dẫn riêng. Phù hợp cho team và review qua PR.
- **Manual** = không cài gì, paste đúng prompt/skill khi cần. Phù hợp thử nhanh.
- **Runtime** không bắt buộc. Core framework là markdown-first và dùng được không cần daemon/database/MCP.

## Related docs

- [`../INSTALL.md`](../INSTALL.md) — full install paths.
- [`QUICKSTART.md`](QUICKSTART.md) — 10-minute setup.
- [`FIRST-WORKFLOW.md`](FIRST-WORKFLOW.md) — first real workflow after setup.
- [`adapter-install-snippets.md`](adapter-install-snippets.md) — adapter-specific snippets.
