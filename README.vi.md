# Vibe Coding OS

<p align="right">
  <a href="README.md">English</a> · <a href="README.vi.md">Tiếng Việt</a>
</p>

**Vibe Coding OS** là framework skill thân thiện với Claude/Codex dành cho một người muốn dùng AI coding assistant thật nhanh nhưng vẫn giữ kỷ luật kỹ thuật.

Đây không phải wrapper, sản phẩm, hay agent runtime. Đây là một “hệ điều hành” chuẩn hóa cho công việc phần mềm có AI hỗ trợ: skill tái sử dụng, command prompt, template, registry, và quy ước giúp con người cùng AI assistant biến ý định thành code đáng tin cậy. Mục tiêu cụ thể là nâng chất lượng vibe coding với Claude Code và các agent tương tự bằng cách học có chọn lọc từ những workflow public tốt, rồi tái chuẩn hóa vào repo này mà không copy/vendor bừa.

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

## Quick start theo từng tool

Vibe Coding OS là markdown-first và nhẹ dependency. Chọn đúng đường cho agent của bạn. Mọi trường hợp đều cùng một mục tiêu: cho agent đọc `CLAUDE.md` (hoặc `AGENTS.md`), rồi nạp đúng các file `commands/*.md` và `skills/*/*/SKILL.md` mà task cần.

### Claude Code

```bash
# Cách A — trỏ Claude Code thẳng vào repo này và làm việc bên trong
git clone https://github.com/<owner>/vibe-coding-os ~/vibe-coding-os
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

Framework chạy không cần runtime. Nếu muốn JSON state local cho task, memory, checkpoint, team, session:

```bash
node scripts/runtime-install.mjs            # cài đặt idempotent dưới .omc/runtime/
node scripts/runtime-install.mjs --dry-run  # xem trước, không ghi
node scripts/runtime-install.mjs --mcp      # đăng ký luôn MCP server vào .mcp.json
```

Hoàn toàn opt-in, không bao giờ tự khởi động, và degrade nhẹ nhàng nếu thiếu dependency tùy chọn.

## Cách dùng nhanh

Repo này cố ý nhẹ dependency. Để kiểm tra cấu trúc framework:

```bash
npm run validate
```

Các cách dùng thủ công:

1. Copy instruction phù hợp từ `CLAUDE.md` hoặc `AGENTS.md` vào môi trường agent.
2. Invoke hoặc paste command prompt trong `commands/`, ví dụ `vibe-spec.md` hoặc `vibe-review.md`.
3. Attach một hoặc nhiều skill từ `skills/` khi cần hành vi cụ thể.
4. Dùng template trong `templates/` để tạo spec, plan, task, review, và memory note.
5. Xem luồng hoàn chỉnh trong `examples/`, bắt đầu với [feature workflow](examples/feature-workflow/README.md) hoặc [bugfix workflow](examples/bugfix-workflow/README.md).

## Tài liệu tiếng Việt

Bản README này là trang vào tiếng Việt có thể xem trực tiếp trên GitHub qua [`README.vi.md`](README.vi.md). Bộ tài liệu onboarding và reference tiếng Việt đầy đủ nằm trong [`docs/vi/`](docs/vi/index.md):

- [`docs/vi/index.md`](docs/vi/index.md) — overview, quick start, feature index, và glossary.
- [`docs/vi/skills-and-commands.md`](docs/vi/skills-and-commands.md) — bảng tra cứu command, skill, skill combo, và cách chọn workflow primitive.
- [`docs/vi/folders-and-workflows.md`](docs/vi/folders-and-workflows.md) — map thư mục và workflow phổ biến.
- [`docs/vi/strategy-and-roadmap.md`](docs/vi/strategy-and-roadmap.md) — status review, goal chiến lược, metrics, và roadmap.

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

Các adapter hiện còn nhẹ ở v0.1 và sẽ cụ thể hơn khi pattern sử dụng ổn định.

## Reference Intelligence Layer

Vibe Coding OS tracking upstream inspiration qua Reference Intelligence Layer trong `references/`. Layer này kết hợp source docs, feature maps, local file mappings, audit changelogs, và `references/index.json` để agent tương lai biết nên học gì mà không copy/vendor nội dung bên ngoài.

Trước khi adapt ý tưởng upstream: đọc source entry, xem feature/mapping docs liên quan, cập nhật changelog local khi audit upstream, và ghi attribution decision rõ ràng. Có thể chạy validation reference bằng `npm run validate:references`; validation chính cũng bao gồm bước này.

## Roadmap

### v0.1 kernel

- Chuẩn hóa cấu trúc repository.
- Cung cấp core, memory, prompt, và agent skills.
- Cung cấp command prompt và template tái sử dụng.
- Thêm structural validation.
- Thêm source và attribution registry mà không vendor external code.

### Gần hạn

- Mở rộng example workflow hoàn chỉnh cho nhiều loại project hơn.
- Thêm reference intake scorecard để quyết định upstream idea nào đáng adapt.
- Tăng schema validation cho registry.
- Thêm process review khi import external idea.
- Thêm project memory convention và redaction test.
- Thêm adapter-specific install snippet.

### Sau đó

- Thêm CLI helper tùy chọn.
- Thêm compatibility test cho các agent tool chính.
- Thêm curated skill pack cho stack phổ biến.
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
