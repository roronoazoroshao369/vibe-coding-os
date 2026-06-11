# README Comprehensive Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a practical, comprehensive usage guide to both English and Vietnamese READMEs so users can understand and use all major repo features.

**Architecture:** Add one new guide section near the top of each README, immediately after the inventory/layer table. Keep it as a practical use-case map rather than a raw duplicate of registries. Use tables and examples to cover commands, skills, templates, runtime, reference intelligence, adapters, team orchestration, validation, and recipes.

**Tech Stack:** Markdown docs only; validate with `npm run validate`.

---

### Task 1: Update Vietnamese README guide

**Files:**
- Modify: `/Users/deeptech/Documents/GitHub/vibe-coding-os/README.vi.md`

- [x] **Step 1: Insert a new `## Hướng dẫn sử dụng toàn diện` section after the `Hiện tại có gì` table**

Insert after the table ending with the runtime optional layer. Include these subsections:

```markdown
## Hướng dẫn sử dụng toàn diện

Phần này là bản đồ thực dụng để dùng toàn bộ repo. Nếu bạn mới bắt đầu, hãy dùng như sau: chọn adapter đúng tool → chọn workflow tier → gọi command phù hợp → attach skill liên quan → dùng template để tạo artifact → chạy validation.

### 1. Chọn đường vào theo môi trường

| Bạn dùng gì | File/đường vào chính | Cách dùng nhanh |
| --- | --- | --- |
| Claude Code plugin | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | Cài plugin, rồi gọi command dạng `/vibe-*` và skill auto-trigger. |
| Claude Code thủ công | `CLAUDE.md` | Làm việc trong repo này hoặc copy/nối `CLAUDE.md` vào project của bạn. |
| Codex CLI | `AGENTS.md`, `adapters/codex/README.md` | Copy `AGENTS.md`, paste prompt trong `commands/`, attach skill theo path. |
| Gemini CLI | `AGENTS.md` hoặc `GEMINI.md` | Copy instruction surface, rồi tham chiếu `commands/` và `skills/`. |
| Cursor / assistant khác | `adapters/cursor/README.md`, `adapters/compatibility-matrix.md` | Paste rule vào project rules, dùng command/skill/template như markdown thường. |
| Runtime local tùy chọn | `scripts/runtime-install.mjs`, `.mcp.json` | Bootstrap `.omc/runtime/`, dùng CLI hoặc MCP server local. |

### 2. Chọn workflow tier trước khi làm

| Tier | Khi dùng | Artifact tối thiểu |
| --- | --- | --- |
| Tiny | typo, chỉnh docs nhỏ, đổi tên rõ ràng | intent ngắn + check nhanh |
| Small | sửa nhỏ có rủi ro thấp | mini-spec hoặc checklist + validation |
| Medium | feature/bugfix có behavior | spec → plan → tasks → implement → verify |
| Large | nhiều module, nhiều agent, migration | PRD/spec, ADR nếu cần, plan chi tiết, handoff |
| Risky | auth, security, data loss, license, prod stability | spec chặt, TDD/checkpoint, reviewer độc lập, rollback |

Command hữu ích: `vibe-flow`, `vibe-triage`, `vibe-checkpoints`, `vibe-verify`.

### 3. Dùng command theo phase

| Việc cần làm | Command nên gọi | Output mong đợi |
| --- | --- | --- |
| Khởi động phiên | `vibe-init` | đọc instruction, registry, trạng thái repo |
| Làm rõ ý định | `vibe-brainstorm`, `vibe-grill-me`, `vibe-grill-with-docs` | câu hỏi, assumption, boundary |
| Viết spec | `vibe-spec`, `vibe-specify`, `vibe-brownfield-spec` | goals, non-goals, scenarios, acceptance criteria |
| Kiểm spec | `vibe-spec-audit`, `vibe-checklist` | lỗi mơ hồ, thiếu criteria, scope creep |
| Lập plan | `vibe-plan`, `vibe-plan-from-spec`, `vibe-write-plan` | bước implement, files, risk, checks |
| Chia task | `vibe-tasks`, `vibe-to-issues` | task có dependency, parallel marker, test-first order |
| Implement | `vibe-implement`, `vibe-implement-from-tasks`, `vibe-brief-execute` | patch nhỏ, đúng plan |
| Debug | `vibe-debug`, `vibe-diagnose`, `vibe-tdd` | repro, hypothesis, root cause, regression check |
| Review | `vibe-request-review`, `vibe-review`, `vibe-receive-review` | findings, fix/defer decision, validation lại |
| Memory/handoff | `vibe-memory`, `vibe-session-capture`, `vibe-session-summary`, `vibe-handoff` | memory an toàn, summary tiếp nối |
| Merge/finish | `vibe-merge`, `vibe-finish-branch`, `vibe-git-guardrails` | readiness report, checks, attribution status |
| Reference | `vibe-reference-audit`, `vibe-reference-update`, `vibe-reference-index`, `vibe-upstream-sync` | audit upstream, changelog, mappings |
| Team | `vibe-team`, `vibe-team-generate`, `vibe-subagents` | role plan, handoff, team scaffold |
| Runtime/memory | `vibe-memory-*`, runtime npm scripts | local state/search/checkpoint evidence |

### 4. Dùng skill theo vấn đề

| Vấn đề | Skill gợi ý |
| --- | --- |
| Không rõ user thật sự muốn gì | `clarify-before-code`, `what-before-how`, `grill-user-before-building` |
| Cần spec-first | `spec-first-development`, `acceptance-criteria`, `requirements-quality-checklist` |
| Existing system / legacy | `brownfield-spec-enhancement`, `working-with-legacy-code`, `bug-fix-lifecycle` |
| Debug khó | `disciplined-diagnosis`, `systematic-debugging`, `test-driven-development` |
| Tránh overengineering | `anti-overengineering`, `karpathy-engineering-discipline`, `software-design-philosophy` |
| Kiến trúc | `zoom-out-system-context`, `improve-codebase-architecture`, `architecture-decision-records` |
| Review/merge | `requesting-code-review`, `review-before-merge`, `finishing-a-development-branch` |
| Multi-agent | `subagent-driven-development`, `team-agent-orchestration`, `agent-handoff` |
| Memory/context | `session-capture`, `session-summarizer`, `progressive-memory-disclosure`, `privacy-filter` |
| Reference/upstream | `upstream-intelligence-loop`, `git-guardrails`, `project-constitution` |
| Viết skill mới | `write-reusable-skill`, `writing-skills`, `skillify-from-session` |

### 5. Dùng template để tạo artifact

| Artifact | Template |
| --- | --- |
| Spec | `templates/spec-template.md`, `templates/brownfield-spec-template.md` |
| Plan | `templates/plan-template.md`, `templates/implementation-brief-template.md` |
| Tasks | `templates/tasks-template.md`, `templates/task-template.md` |
| PRD | `templates/prd-template.md` |
| ADR/architecture | `templates/adr-template.md`, `templates/architecture-review-template.md` |
| Review | `templates/review-template.md`, `templates/spec-audit-template.md` |
| Debug | `templates/diagnosis-template.md`, `templates/prototype-report-template.md` |
| Memory | `templates/memory-entry-template.md`, `templates/session-summary-template.md`, `templates/memory-privacy-review-template.md` |
| Handoff/context | `templates/handoff-template.md`, `templates/context-injection-template.md` |
| Reference | `templates/upstream-audit-template.md`, `templates/reference-scorecard-template.md` |
| Team | `templates/team-spec-template.json`, `templates/team-architecture-template.md` |
| Runtime | `templates/runtime-config-template.json` |

### 6. Dùng runtime local tùy chọn

Runtime không bắt buộc. Dùng khi bạn muốn state có thể inspect được thay vì chỉ markdown.

```bash
npm run runtime:install
npm run runtime:init
npm run runtime:validate
```

| Nhu cầu | Script |
| --- | --- |
| Task state | `npm run runtime:task` |
| Memory local | `npm run runtime:memory` |
| Checkpoint evidence | `npm run runtime:checkpoint` |
| Team spec/state | `npm run runtime:team` |
| Session capture | `npm run runtime:session` |
| Daemon opt-in | `npm run runtime:daemon` |
| MCP stdio server | `npm run runtime:mcp` |
| Tmux team runner | `npm run runtime:team-run` |
| Full bootstrap | `npm run runtime:install` |

MCP server được khai báo trong `.mcp.json` và expose task, memory, checkpoint tools cho agent có hỗ trợ MCP.

### 7. Dùng Reference Intelligence Layer

Trước khi học từ upstream:

1. Đọc `references/index.json`.
2. Đọc source doc trong `references/sources/`.
3. Xem feature docs trong `references/features/`.
4. Xem mapping trong `references/mappings/`.
5. Nếu audit upstream mới, chạy clone/audit dưới `references/upstreams/` rồi cập nhật changelog.
6. Chạy `npm run validate:references`.

Script hữu ích:

```bash
npm run references:index
npm run references:clone
npm run references:report
npm run validate:references
```

Nguyên tắc: học pattern, viết lại bằng ngôn ngữ local, không vendor code/docs/prompt upstream nếu chưa review license và attribution.

### 8. Dùng team-agent orchestration

Team layer giúp chia việc phức tạp thành role rõ ràng:

| Role | Trách nhiệm |
| --- | --- |
| Architect | thiết kế hướng kỹ thuật tối giản |
| Implementer | sửa code theo plan |
| Tester | tìm và chạy check giá trị nhất |
| Reviewer | review correctness, simplicity, risk |
| Memory architect | giữ context/memory an toàn |

Luồng khuyến nghị: `vibe-team` để thiết kế team → `vibe-team-generate` để scaffold spec → `vibe-subagents` để giao việc → `vibe-request-review` / `vibe-verify` trước khi claim done.

### 9. Recipe nhanh

| Tình huống | Chuỗi dùng nhanh |
| --- | --- |
| Feature mới | `vibe-flow` → `vibe-specify` → `vibe-plan-from-spec` → `vibe-tasks` → `vibe-implement-from-tasks` → `vibe-verify` |
| Bug khó | `vibe-diagnose` → `vibe-tdd` → `vibe-implement` → `vibe-review` → `vibe-verify` |
| Refactor | `vibe-zoom-out` → `vibe-improve-architecture` → ADR nếu cần → `vibe-plan` → `vibe-review` |
| Legacy enhancement | `vibe-brownfield-spec` → characterization tests → `vibe-plan-from-spec` → `vibe-implement` |
| Multi-agent task | `vibe-team` → `vibe-subagents` → handoff → independent review → `vibe-verify` |
| Session dài | `vibe-session-capture` → `vibe-memory-privacy-check` → `vibe-session-summary` → `vibe-handoff` |
| Học upstream | `vibe-reference-audit` → `vibe-reference-update` → `vibe-reference-index` → `npm run validate:references` |
| Chuẩn bị merge | `vibe-review` → `vibe-merge` → `vibe-finish-branch` |

### 10. Validation bắt buộc khi sửa repo này

```bash
npm run validate
```

Nếu sửa reference layer, chạy thêm:

```bash
npm run validate:references
```

Nếu sửa runtime/state schema, chạy:

```bash
npm run runtime:validate
```
```

- [x] **Step 2: Check Vietnamese README manually for duplicate headings and broken flow**

Expected: New section appears before Quick start and points users to existing sections instead of replacing them.

### Task 2: Update English README guide

**Files:**
- Modify: `/Users/deeptech/Documents/GitHub/vibe-coding-os/README.md`

- [x] **Step 1: Insert matching `## Comprehensive usage guide` section after the `What is included now` table**

Use the same structure translated to English: entry points, workflow tiers, commands by phase, skills by problem, templates by artifact, optional runtime, reference intelligence, team orchestration, recipes, validation.

- [x] **Step 2: Check English README manually for consistency with Vietnamese version**

Expected: Same practical content, English wording, no contradictory install instructions.

### Task 3: Validate docs

**Files:**
- Validate only; no file modifications expected.

- [x] **Step 1: Run repository validation**

Run: `npm run validate`
Expected: PASS, including repo structure and references validation.

- [x] **Step 2: Review git diff**

Run: `git diff -- README.md README.vi.md docs/superpowers/plans/2026-06-08-readme-comprehensive-guide.md`
Expected: Only README guide additions and this plan.

- [x] **Step 3: Report validation evidence**

Report exact commands run and whether they passed or failed.

---

## Self-review

- Spec coverage: Covers approved design: README.vi.md + README.md, use-case guide, commands, skills, templates, runtime, references, adapters, team, validation, recipes.
- Placeholder scan: No TBD/TODO placeholders. Implementation content is explicit markdown.
- Scope check: Documentation-only, no runtime/code behavior changes.
