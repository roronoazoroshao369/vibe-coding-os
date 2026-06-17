# Vibe Coding OS

[![Validate Repository](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/validate.yml/badge.svg)](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/validate.yml)
[![Adapter Smoke Tests](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/smoke-test.yml/badge.svg)](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/smoke-test.yml)

**Bản phát hành hiện tại (v1.3.0):** validate:all 20/20 gates, 90 skills, 68 commands, 56 templates, 0 broken refs, 0 orphan commands/skills.

**Bắt đầu:** [Luồng công việc đầu tiên](docs/vi/FIRST-WORKFLOW.md) · [Quickstart](docs/QUICKSTART.md) · [Tutorial](docs/vi/TUTORIAL.vi.md) · [Ví dụ](examples/)

**Trạng thái dự án:** [Dashboard](docs/DASHBOARD.md) · [Roadmap](docs/ROADMAP-STATUS.md) · [Bảo mật](docs/SECURITY-MODEL.md) · [Release notes](docs/releases/v1.3.0.md)

## Có gì mới trong v1.3.0

- Runtime Contracts v2: schema chặt, multi-agent state contracts, và safety/traceability cơ bản.
- Migration dry-run engine: con đường an toàn hơn để nâng cấp runtime state lưu trữ với backup và rollback awareness.
- Schema event, approval, tool-contract, và migration cho provenance, capability declarations, và risk inspection.
- Paths validation backward-compatible v1→v2 cho runtime state hiện tại.
- 20/20 validation gates passes với full repository integrity checks.

<p align="right">
  <a href="README.md">English</a> · <a href="README.vi.md">Tiếng Việt</a>
</p>

**Vibe Coding OS** là framework skill thân thiện với Claude/Codex dành cho một người muốn dùng AI coding assistant thật nhanh nhưng vẫn giữ kỷ luật kỹ thuật. Repo là markdown-first, nhẹ dependency, và dùng được như instruction, prompt, template thuần. Ngoài ra còn có một runtime companion tùy chọn (JSON-first) cho task, memory, checkpoint, team, session, daemon, MCP, tmux, và vector-memory ở local.

Đây không phải wrapper bắt buộc, sản phẩm, dịch vụ hosted, hay agent runtime bắt buộc. Đây là một “hệ điều hành” chuẩn hóa cho công việc phần mềm có AI hỗ trợ: skill tái sử dụng, command prompt, template, registry, adapter, reference map, và runtime helper local tùy chọn giúp con người cùng AI assistant biến ý định thành code đáng tin cậy. Mục tiêu cụ thể là nâng chất lượng vibe coding với Claude Code và các agent tương tự bằng cách học có chọn lọc từ những nguồn workflow/skill/engineering-practice tốt, rồi tái chuẩn hóa vào repo này mà không copy/vendor bừa.

## Core vs Optional Runtime

**Core** là markdown-first và chạy với **zero runtime**: cài Claude Code plugin và dùng command `/vibe-*`, skill, template như instruction thuần. Không cần daemon, database, MCP server, hay tmux session.

**Runtime** hoàn toàn **tùy chọn (opt-in)**. Chỉ bật khi bạn muốn local JSON state cho task, memory, checkpoint, team, session, daemon workflow, MCP tool, hoặc tmux team runner.

Xem [INSTALL.md](INSTALL.md) cho hướng dẫn cài đặt đầy đủ, [docs/vi/TUTORIAL.vi.md](docs/vi/TUTORIAL.vi.md) cho hướng dẫn 15 phút từ zero đến workflow, và [docs/UPSTREAM_ADOPTION_POLICY.md](docs/UPSTREAM_ADOPTION_POLICY.md) cho chính sách adoption upstream.

## Vì sao repo này tồn tại

Coding agent hiện đại rất mạnh, nhưng dễ bị dùng sai khi yêu cầu mơ hồ, context cũ, hoặc assistant tuyên bố xong trước khi kiểm chứng. Vibe Coding OS làm rõ hành vi mong muốn:

- hỏi rõ phần chưa chắc trước khi code;
- đặc tả việc không trivial trước khi implement;
- lập kế hoạch theo bước nhỏ, dễ đảo ngược;
- viết test hoặc check để chứng minh thay đổi;
- review kết quả trước khi merge;
- lưu project memory hữu ích mà không leak dữ liệu riêng tư;
- giữ attribution sạch khi học từ hệ sinh thái AI coding.

## Triết lý

1. **Ý định của con người là tối thượng.** Assistant có thể đề xuất, nhưng không được tự bịa requirement hoặc âm thầm mở rộng scope.
2. **Thay đổi nhỏ, đúng, dễ review tốt hơn rewrite lớn.** Ưu tiên bước nhỏ nhất có ích và có thể kiểm chứng.
3. **Spec là công cụ suy nghĩ, không phải giấy tờ quan liêu.** Dùng vừa đủ cấu trúc để loại bỏ mơ hồ.
4. **Verification là một phần của “done”.** Không claim success nếu chưa có test, validation, hoặc limitation rõ ràng.
5. **Memory phải hữu ích, hiện hành, và an toàn.** Lưu quyết định/context bền vững, không lưu secret hoặc transcript thừa.
6. **Attribution là artifact hạng nhất.** Có thể lấy cảm hứng từ public work, nhưng nội dung import phải được tracking trước khi dùng.

## Workflow mặc định

Dùng vòng lặp này cho việc đáng kể:

```text
Intent → Spec → Plan → Implement → Test → Review → Memory → Merge
```

- **Intent:** ghi lại người dùng muốn gì và vì sao.
- **Spec:** định nghĩa behavior mong muốn, constraints, non-goals, và acceptance criteria.
- **Plan:** chia thay đổi thành task nhỏ và bước verification.
- **Implement:** sửa tập trung, đúng plan.
- **Test:** chạy check nhỏ có ý nghĩa trước, rồi validation rộng hơn.
- **Review:** xem diff về correctness, simplicity, security, maintainability.
- **Memory:** ghi lại quyết định, gotcha, follow-up bền vững.
- **Merge:** chỉ ship khi trạng thái verification rõ ràng.

## Hiện tại có gì

Inventory hiện tại: **90 skills**, **68 commands**, **56 templates**, **14 nguồn cảm hứng được track**, cùng một runtime layer tùy chọn. Repo đã vượt khỏi một bộ prompt nhỏ để trở thành một hệ điều hành local đầy đủ cho kỹ thuật phần mềm có AI hỗ trợ.

| Layer | Gồm gì | Giảm nỗi đau nào |
| --- | --- | --- |
| Spec-driven workflow | Constitution, specify, plan, tasks, checkpoint, cổng sẵn-sàng-triển-khai | AI code khi chưa hiểu yêu cầu |
| Adaptive flow | Tier tiny/small/medium/large/risky | Quy trình quá nặng cho việc nhỏ, hoặc quá nhẹ cho việc rủi ro |
| Real engineering skills | Grilling, PRD, ADR, TDD, diagnosis, review, finish branch | AI hành xử như máy sinh code thay vì kỹ sư có kỷ luật |
| Prompt discipline | Karpathy think/simplicity/surgical/goal-driven + nguyên lý từ sách coding | Overengineering, đặt tên mơ hồ, thiết kế dễ vỡ, code khó review |
| Team-agent orchestration | Template kiến trúc team, role routing, handoff, watchdog, scaffold | Việc phức tạp không chia an toàn cho nhiều agent |
| Memory layer | Session capture, summarization, lọc privacy, retrieval lũy tiến, citation | Mất context giữa các phiên hoặc lưu không an toàn |
| Reference intelligence | Source index, attribution, feature map, update-impact map, changelog | Idea upstream bị copy bừa hoặc không maintain được |
| Runtime tùy chọn | JSON store, CLI task/memory/checkpoint/team/session, daemon, MCP server, vector search, tmux team runner, installer | Workflow markdown cần state kiểm tra được hoặc tự động hóa local |

## Hướng dẫn sử dụng toàn diện

Phần này là bản đồ thực dụng để dùng toàn bộ repo. Nếu bạn mới bắt đầu: chọn adapter đúng tool → chọn workflow tier → gọi command phù hợp → attach skill liên quan → dùng template để tạo artifact → chạy validation.

### 1. Chọn đường vào theo môi trường

| Bạn dùng gì | File/đường vào chính | Cách dùng nhanh |
| --- | --- | --- |
| Claude Code plugin | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | Cài plugin, rồi gọi command dạng `/vibe-*` và để skill auto-trigger. |
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

## Nỗi đau đã giải quyết

| Nỗi đau khi vibe code | Lời giải local |
| --- | --- |
| Yêu cầu mơ hồ | `clarify-before-code`, `what-before-how`, `vibe-specify`, template acceptance criteria |
| AI lao vào code quá sớm | cổng spec → plan → tasks, checkpoint sẵn-sàng-triển-khai |
| AI làm dư / rewrite quá nhiều | `anti-overengineering`, kỷ luật Karpathy, check surgical-change |
| Khó kiểm chứng thay đổi của AI | goal-driven execution, TDD, tách verifier/reviewer, `npm run validate` |
| Việc nhiều bước bị mất tiến độ | task-state tracking, runtime task store, template handoff |
| Đa-agent gây xung đột | team-agent orchestration, sở hữu file, handoff contract, tmux runner |
| Context biến mất sau compaction/hết phiên | memory/session capture, summarizer, observation citation, vector search tùy chọn |
| Sửa legacy code rủi ro | characterization test, seam, bug-fix lifecycle, brownfield spec enhancement |
| Code production chỉ có happy-path | mẫu hình ổn định Release It!, defensive programming, checklist review |
| Idea upstream gây rủi ro license/attribution | reference index, source docs, ATTRIBUTIONS/NOTICE, script validation |

## Quick start theo từng tool

Vibe Coding OS là markdown-first và nhẹ dependency. Chọn đúng đường cho agent của bạn. Mọi trường hợp đều cùng một mục tiêu: cho agent đọc `CLAUDE.md` (hoặc `AGENTS.md`), rồi nạp đúng các file `commands/*.md` và `skills/*/*/SKILL.md` mà task cần.

### Claude Code — cài như plugin (khuyến nghị)

Vibe Coding OS đã có sẵn manifest plugin (`.claude-plugin/plugin.json`) và manifest marketplace (`.claude-plugin/marketplace.json`), nên cài như mọi plugin Claude Code khác. Trong Claude Code, gõ hai slash command **lần lượt** (không paste cả hai cùng lúc):

```text
/plugin marketplace add https://github.com/roronoazoroshao369/vibe-coding-os
```

Rồi:

```text
/plugin install vibe-coding-os
```

Marketplace dùng `source: "./"` nên plugin được cài thẳng từ repo marketplace đã clone, không cần clone lại từ GitHub và không cần SSH key.

Sau khi cài, skills tự kích hoạt theo trigger và commands sẵn dùng dạng `/vibe-*`. Quản lý bằng `/plugin list`, `/plugin disable vibe-coding-os`, `/plugin enable vibe-coding-os`, `/plugin update vibe-coding-os`.

<details>
<summary>Fallback script (nếu bản Claude Code chưa hỗ trợ slash command)</summary>

```bash
curl -fsSL https://raw.githubusercontent.com/roronoazoroshao369/vibe-coding-os/main/install.sh | bash
```

Sau đó khởi động lại Claude Code.

</details>

### Claude Code — thủ công (không dùng plugin)

```bash
# Cách A — trỏ Claude Code thẳng vào repo này và làm việc bên trong
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
claude          # CLAUDE.md tự nạp; skills/, commands/, templates/ sẵn sàng

# Cách B — dùng trong PROJECT của bạn
cd your-project
# copy CLAUDE.md của framework (hoặc nối vào file CLAUDE.md hiện có)
cp ~/vibe-coding-os/CLAUDE.md ./CLAUDE.md
# rồi tham chiếu skill/command theo path, ví dụ bảo Claude Code:
#   "Theo skills/core/spec-first-development/SKILL.md cho feature này"
```

Trong phiên, kích hoạt một phase bằng cách gọi tên command hoặc skill: `vibe-spec`, `vibe-plan`, `vibe-implement`, `vibe-review`, hoặc "dùng `skills/prompts/pragmatic-programmer/SKILL.md`". Chạy `npm run validate` sau khi sửa cấu trúc. Xem đầy đủ tại [`adapters/claude-code/README.md`](adapters/claude-code/README.md).

### Codex CLI

```bash
git clone https://github.com/<owner>/vibe-coding-os ~/vibe-coding-os
cd your-project
cp ~/vibe-coding-os/AGENTS.md ./AGENTS.md   # Codex đọc AGENTS.md làm instruction surface
```

Paste một command prompt từ `commands/` (ví dụ `vibe-spec.md`, `vibe-review.md`) ở đầu task, và attach các `skills/*/*/SKILL.md` liên quan. Xem [`adapters/codex/README.md`](adapters/codex/README.md).

### Gemini CLI

```bash
git clone https://github.com/<owner>/vibe-coding-os ~/vibe-coding-os
cd your-project
cp ~/vibe-coding-os/AGENTS.md ./GEMINI.md   # hoặc paste nội dung CLAUDE.md vào file context của Gemini
```

Gemini CLI nạp context instruction lúc khởi động phiên; trỏ nó vào file đã copy và tham chiếu `commands/` cùng `skills/` theo path khi cần.

### Cursor / assistant khác

```bash
git clone https://github.com/<owner>/vibe-coding-os ~/vibe-coding-os
```

Paste nội dung `CLAUDE.md` vào project rules (ví dụ `.cursorrules` hoặc system prompt của chat), rồi paste từng prompt `commands/*.md` theo phase và attach `skills/*/*/SKILL.md` khi task cần. Xem [`adapters/cursor/README.md`](adapters/cursor/README.md) và [bảng tương thích adapter](adapters/compatibility-matrix.md).

### Runtime tùy chọn (mọi tool)

Framework chạy không cần runtime. Nếu muốn JSON state local cho task, memory, checkpoint, team, session — cộng daemon, MCP server, vector search, và tmux team runner tùy chọn:

```bash
node scripts/runtime-install.mjs            # cài đặt idempotent dưới .omc/runtime/
node scripts/runtime-install.mjs --dry-run  # xem trước, không ghi
node scripts/runtime-install.mjs --mcp      # đăng ký luôn MCP server vào .mcp.json
```

Hoàn toàn opt-in, không bao giờ tự khởi động, và degrade nhẹ nhàng nếu thiếu dependency tùy chọn.

## Validation và cách dùng thủ công

Repo này cố ý nhẹ dependency. Để kiểm tra cấu trúc framework:

```bash
npm run validate
```

Các cách dùng thủ công:

1. Copy instruction phù hợp từ `CLAUDE.md` hoặc `AGENTS.md` vào môi trường agent.
2. Invoke hoặc paste command prompt trong `commands/`, ví dụ `vibe-spec.md` hoặc `vibe-review.md`.
3. Attach một hoặc nhiều skill từ `skills/` khi cần hành vi cụ thể.
4. Dùng template trong `templates/` để tạo spec, plan, task, review, và memory note.
5. Xem luồng hoàn chỉnh trong `examples/`, bắt đầu với [feature workflow](examples/feature-workflow/README.md), [bugfix workflow](examples/bugfix-workflow/README.md), hoặc [React/Next.js booking workflow](examples/react-nextjs-booking-workflow/README.md).

## Tài liệu tiếng Việt

Bản README này là trang vào tiếng Việt có thể xem trực tiếp trên GitHub qua [`README.vi.md`](README.vi.md). Bộ tài liệu onboarding và reference tiếng Việt đầy đủ nằm trong [`docs/vi/`](docs/vi/index.md):

- [`docs/vi/index.md`](docs/vi/index.md) — overview, quick start, feature index, và glossary.
- [`docs/vi/skills-and-commands.md`](docs/vi/skills-and-commands.md) — bảng tra cứu command, skill, skill combo, và cách chọn workflow primitive.
- [`docs/vi/folders-and-workflows.md`](docs/vi/folders-and-workflows.md) — map thư mục và workflow phổ biến.
- [`docs/vi/strategy-and-roadmap.md`](docs/vi/strategy-and-roadmap.md) — status review, goal chiến lược, metrics, và roadmap.

## Tài liệu bổ sung

Các hướng dẫn và reference mới:

- [`docs/QUICKSTART.md`](docs/QUICKSTART.md) — quickstart 10 phút cho Claude Code, Codex CLI, Cursor.
- [`docs/TUTORIAL.md`](docs/TUTORIAL.md) — hướng dẫn 15 phút từ zero đến workflow (English).
- [`docs/vi/TUTORIAL.vi.md`](docs/vi/TUTORIAL.vi.md) — hướng dẫn 15 phút từ zero đến workflow (Tiếng Việt).
- [`docs/RUNTIME-GUIDE.md`](docs/RUNTIME-GUIDE.md) — hướng dẫn bắt đầu với runtime layer tùy chọn.
- [`docs/DASHBOARD.md`](docs/DASHBOARD.md) — dashboard sức khỏe dự án, inventory, và tóm tắt validation.
- [`docs/ROADMAP-STATUS.md`](docs/ROADMAP-STATUS.md) — trạng thái version và tiến độ release.
- [`docs/RELEASE-PACKAGING.md`](docs/RELEASE-PACKAGING.md) — hướng dẫn tag release, changelog, và đóng gói.
- [`docs/releases/v1.0.0.md`](docs/releases/v1.0.0.md) — release notes cho bản phát hành v1.0.0.
- [`docs/releases/v1.1.0.md`](docs/releases/v1.1.0.md) — release notes cho bản phát hành v1.1.0.
- [`docs/v1.0-release-plan.md`](docs/v1.0-release-plan.md) — kế hoạch release v1.0.
- [`docs/skill-decision-guide.md`](docs/skill-decision-guide.md) — bảng tra cứu skill theo vấn đề.
- [`docs/eval-scenarios.md`](docs/eval-scenarios.md) — kịch bản đánh giá behavioral cho framework.
- [`docs/skill-packs/`](docs/skill-packs/) — curated skill packs (Solo Developer, Memory Safe, Multi-Agent).
- [`CHANGELOG.md`](CHANGELOG.md) — lịch sử version theo Keep a Changelog.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — hướng dẫn contribute skill, command, template, reference.

## Skill system

Skill là một operating procedure portable được lưu trong file `SKILL.md`. Mỗi skill dùng cùng cấu trúc:

- Title
- Purpose
- When to use
- Inputs
- Workflow
- Outputs
- Failure modes
- Verification checklist

Registry `registry/skills.json` liệt kê skill local, path, category, và description. Skill được thiết kế để compose với nhau. Ví dụ, một feature khó có thể kết hợp:

- `clarify-before-code`
- `spec-first-development`
- `plan-driven-execution`
- `test-driven-development`
- `verification-before-done`
- `session-summarizer`

## Command system

Command trong `commands/` là prompt ngắn, tái sử dụng. Chúng được thiết kế để paste vào Claude Code, Codex, Cursor, hoặc assistant khác nhằm kích hoạt một phase workflow có kỷ luật.

Command set ban đầu bao gồm:

- initialization
- specification
- planning
- implementation
- review
- memory updates
- merge readiness
- repository diagnostics

Registry `registry/prompts.json` tracking các command prompt này.

## Adapters

Adapters mô tả cách dùng framework trong từng môi trường. Bắt đầu với [adapter compatibility matrix](adapters/compatibility-matrix.md) khi cần chọn setup theo tool:

- `adapters/claude-code/`
- `adapters/codex/`
- `adapters/cursor/`

Các adapter bắt đầu nhẹ và sẽ cụ thể hơn khi pattern sử dụng ổn định.

## Reference Intelligence Layer

Vibe Coding OS tracking upstream inspiration qua Reference Intelligence Layer trong `references/`. Layer này kết hợp source docs, feature maps, local file mappings, audit changelogs, và `references/index.json` để agent tương lai biết nên học gì mà không copy/vendor nội dung bên ngoài.

Trước khi adapt ý tưởng upstream: đọc source entry, xem feature/mapping docs liên quan, cập nhật changelog local khi audit upstream, và ghi attribution decision rõ ràng. Có thể chạy validation reference bằng `npm run validate:references`; validation chính cũng bao gồm bước này.

## Roadmap

### Đã hoàn thành trong kernel hiện tại

- Cấu trúc repo chuẩn hóa với skill core, memory, meta, prompt, agent.
- 68 command prompt và 54 template tái sử dụng.
- Validation cấu trúc động cộng validation cho reference layer.
- Registry source, attribution, feature, impact mà không vendor code upstream.
- Quick start adapter cho Claude Code, Codex CLI, Gemini CLI, Cursor, và assistant khác.
- Runtime JSON-first tùy chọn với task, memory, checkpoint, team, session, daemon, MCP, vector, tmux-runner, installer.

### Gần hạn

- Mở rộng example workflow hoàn chỉnh cho nhiều loại project hơn.
- Thêm reference intake scorecard để quyết định upstream idea nào đáng adapt.
- Tăng schema validation cho ngữ nghĩa registry (vượt mức kiểm tra path tồn tại).
- Thêm redaction test và fixture đánh giá chất lượng memory.
- Thêm dashboard/viewer nhẹ cho state `.omc/runtime/`.

### Sau đó

- Thêm curated skill pack cho stack phổ biến.
- Thêm compatibility test cho các agent tool chính.
- Thêm snippet IDE/editor để chèn nhanh command và skill.
- Thêm governance rule cho external contribution và source intake.

## Attribution và license policy

Vibe Coding OS là nội dung gốc. Repo lấy cảm hứng từ pattern trong cộng đồng AI coding workflow rộng hơn, gồm các repository được liệt kê ở `registry/sources.json`, nhưng không vendor code hoặc documentation của họ.

Trước khi import external material:

1. kiểm tra license của source;
2. ghi source vào `registry/sources.json`;
3. document idea hoặc artifact được import trong `ATTRIBUTIONS.md`;
4. giữ notices mà upstream license yêu cầu;
5. ưu tiên adaptation và normalization thay vì copy.

Xem `NOTICE.md` và `ATTRIBUTIONS.md` để biết policy hiện tại và placeholder.

## Real Engineering Skills Layer

Vibe Coding OS adapt các ý tưởng engineering-agent thực dụng từ [`mattpocock/skills`](https://github.com/mattpocock/skills) vào skill system local. Layer này chỉ là inspiration/adaptation: không vendor upstream code, prompt, hoặc documentation block lớn. Nó tăng cường workflow mặc định bằng cách:

- grill trước khi build để assistant không invent requirement;
- dùng shared domain language trong `CONTEXT.md`;
- ghi ADR cho quyết định kỹ thuật quan trọng;
- dùng TDD và diagnosis loop có bằng chứng;
- tạo PRD từ conversation context và slice issue nhỏ, độc lập;
- dùng zoom-out và architecture-improvement workflow;
- tạo handoff document để giữ continuity giữa agent/session;
- dùng git guardrails và quality gate trước khi finish work.

Tài liệu canonical local: `references/sources/mattpocock-skills.md`, `docs/workflows/real-engineering-skills-workflow.md`, `references/mappings/source-to-local-skills.md`, và `references/mappings/update-impact-map.md`.

## Glossary Anh–Việt ngắn

| Thuật ngữ | Nghĩa tiếng Việt |
| --- | --- |
| Intent | Ý định/yêu cầu ban đầu của người dùng |
| Spec | Đặc tả ngắn: goals, non-goals, behavior, acceptance criteria |
| Plan | Kế hoạch thực thi theo bước nhỏ, có risks/checks |
| Acceptance criteria | Tiêu chí chấp nhận để biết task đã xong hay chưa |
| Verification | Bằng chứng kiểm chứng: test/check/lint/validation/manual evidence |
| Memory | Tri thức bền vững của project dùng cho session sau |
| Attribution | Ghi nhận nguồn/license khi import hoặc closely adapt external material |
| Vendoring | Đưa nguyên code/docs/prompt của bên ngoài vào repo local |
| Upstream audit | Kiểm tra nguồn upstream để học pattern phù hợp mà không copy bừa |
| Staleness | Trạng thái cũ/mới của memory hoặc reference cần review lại |
