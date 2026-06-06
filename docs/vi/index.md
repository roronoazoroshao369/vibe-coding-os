# Vibe Coding OS — Tài liệu tiếng Việt

Đây là entrypoint tiếng Việt cho Vibe Coding OS. Mục tiêu của tài liệu này là giúp người dùng Việt hiểu nhanh repo đang có gì, từng feature/thư mục dùng để làm gì, chọn command/skill nào, và nên phát triển framework theo hướng nào.

## 1. Vibe Coding OS là gì?

Vibe Coding OS là một framework workflow/skills/prompts/templates cho AI-assisted coding. Nó giúp bạn dùng Claude Code, Codex, Cursor hoặc coding agent tương tự theo cách nhanh nhưng có kỷ luật kỹ thuật.

Vibe Coding OS **không phải**:

- wrapper chạy thay Claude/Codex/Cursor;
- agent runtime;
- sản phẩm SaaS;
- bộ prompt copy-paste rời rạc không có validation.

Vibe Coding OS **là** lớp vận hành giúp agent và con người cùng đi qua một vòng làm việc rõ ràng: hiểu intent, viết spec khi cần, lập plan nhỏ, implement tập trung, test/validate, review, ghi memory an toàn, rồi mới merge.

## 2. Vì sao cần framework này?

AI coding agent rất mạnh, nhưng dễ bị dùng sai khi:

- yêu cầu ban đầu mơ hồ;
- context trong repo đã stale;
- agent code trước khi hiểu acceptance criteria;
- agent nói “done” nhưng chưa test;
- memory lưu nhầm secret, token hoặc transcript dài;
- lấy ý tưởng upstream nhưng thiếu license/attribution review.

Vibe Coding OS đưa các guardrail này thành artifact trong repo để lần sau agent có thể tái sử dụng thay vì dựa vào trí nhớ tạm thời của một session.

## 3. Workflow mặc định

```text
Intent → Spec → Plan → Implement → Test → Review → Memory → Merge
```

| Pha | Mục đích | Artifact/thư mục liên quan |
| --- | --- | --- |
| Intent | Làm rõ người dùng muốn gì và vì sao | `commands/vibe-init.md`, `skills/core/clarify-before-code/` |
| Spec | Ghi goals, non-goals, expected behavior, acceptance criteria | `commands/vibe-spec.md`, `templates/spec-template.md` |
| Plan | Chia việc thành bước nhỏ, có file target, risks, checks | `commands/vibe-plan.md`, `templates/plan-template.md` |
| Implement | Sửa đúng scope, nhỏ, reviewable | `commands/vibe-implement.md`, `skills/agents/implementer-agent/` |
| Test | Chạy checks chứng minh thay đổi | `skills/core/test-driven-development/`, `skills/core/verification-before-done/` |
| Review | Kiểm correctness, maintainability, security, attribution | `commands/vibe-review.md`, `templates/review-template.md` |
| Memory | Lưu quyết định/gotcha/follow-up bền vững, không lưu secret | `commands/vibe-memory.md`, `templates/memory-template.md` |
| Merge | Kiểm merge readiness trước khi ship | `commands/vibe-merge.md`, `skills/core/review-before-merge/` |

Task nhỏ có thể dùng phiên bản nhẹ của loop, nhưng task nhiều file/rủi ro nên đi đủ Spec → Plan → Test → Review.

## 4. Index tài liệu tiếng Việt

- [`skills-and-commands.md`](skills-and-commands.md) — bảng tra cứu command, skill, skill combo, và cách chọn đúng workflow primitive.
- [`folders-and-workflows.md`](folders-and-workflows.md) — map thư mục, folder dùng để làm gì, workflow feature/bugfix/repo health/reference/memory.
- [`strategy-and-roadmap.md`](strategy-and-roadmap.md) — status review, goal chiến lược, metrics, roadmap hoàn thiện framework/app trong tương lai.

## 5. Bắt đầu nhanh trong 10 phút

1. Đọc `README.md` để hiểu triết lý tổng quan.
2. Chọn adapter theo tool:
   - Claude Code: đọc `CLAUDE.md` và `adapters/claude-code/README.md`.
   - Codex hoặc coding agent đọc `AGENTS.md`: dùng `adapters/codex/README.md`.
   - Cursor: đọc `adapters/cursor/README.md`.
3. Chạy hoặc yêu cầu agent dùng `commands/vibe-init.md` để inspect instruction, repo status, registries và next workflow step.
4. Với feature/bugfix đáng kể, đi theo thứ tự:
   - `vibe-spec`
   - `vibe-plan`
   - `vibe-implement`
   - `vibe-review`
   - `vibe-memory`
   - `vibe-merge`
5. Khi sửa command, skill, template, registry, reference hoặc script validation, chạy `npm run validate`.
6. Khi chỉ sửa Reference Intelligence Layer, chạy `npm run validate:references`.

## 6. Các feature chính làm gì?

| Feature | Dùng để làm gì? | File/thư mục chính |
| --- | --- | --- |
| Discipline-first workflow | Ép agent đi từ intent/spec/plan đến test/review thay vì code bừa | `README.md`, `CLAUDE.md`, `AGENTS.md` |
| Command system | Prompt ngắn theo từng pha workflow, paste/invoke trong assistant | `commands/`, `registry/prompts.json` |
| Skill system | SOP portable cho hành vi cụ thể của agent | `skills/`, `registry/skills.json` |
| Templates | Mẫu artifact reviewable: spec, plan, task, review, memory, audit | `templates/` |
| Adapters | Cách dùng framework trong Claude Code, Codex, Cursor | `adapters/` |
| Examples | Luồng mẫu feature/bugfix end-to-end | `examples/` |
| Memory conventions | Quy tắc lưu tri thức bền vững, chống leak secrets/private data | `docs/memory-conventions.md`, `skills/memory/` |
| Reference Intelligence Layer | Học upstream có kiểm soát, không vendor/copy bừa | `references/`, `registry/sources.json` |
| Validation | Kiểm repo structure, registry coverage, reference metadata | `scripts/`, `package.json` |

## 7. Quy tắc an toàn quan trọng

- Không invent requirements. Nếu mơ hồ, hỏi hoặc ghi assumption rõ ràng.
- Không claim success nếu chưa có test/check hoặc limitation rõ ràng.
- Không lưu secrets, tokens, private keys, unnecessary personal data, hoặc raw transcript dài vào memory/docs/examples.
- Không copy/vendor upstream content nếu chưa review license và attribution.
- Ưu tiên thay đổi nhỏ, đúng scope, dễ review.

## 8. Glossary Anh–Việt

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
