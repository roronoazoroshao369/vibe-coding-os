# Folders và Workflows — Hướng dẫn tiếng Việt

Tài liệu này giải thích từng thư mục/file chính làm gì và workflow nào nên dùng trong các tình huống thường gặp.

## 1. Map thư mục

| Path | Vai trò | Ai đọc/sửa? | Khi nào dùng? |
| --- | --- | --- | --- |
| `README.md` | Tổng quan tiếng Anh, philosophy, workflow, roadmap | Human/agent | Bắt đầu repo hoặc cần định vị framework |
| `CLAUDE.md` | Instruction chính cho Claude Code | Claude Code user/agent | Setup Claude Code hoặc prime session |
| `AGENTS.md` | Instruction chính cho Codex/coding agents | Codex/agent | Setup agent, biết conventions và validation expectations |
| `commands/` | Prompt tái sử dụng theo workflow phase | Human/agent | Khi muốn kích hoạt spec/plan/review/memory/doctor/reference workflow |
| `skills/` | SOP cho hành vi agent | Agent/human | Khi task cần guardrail hoặc role cụ thể |
| `templates/` | Mẫu artifact reviewable | Human/agent | Khi tạo spec, plan, task, review, memory, audit |
| `examples/` | Workflow mẫu end-to-end | Người mới/agent | Học cách nối command + skill + template |
| `adapters/` | Hướng dẫn theo tool | Người setup | Claude Code, Codex, Cursor |
| `registry/` | Registry JSON cho skills/prompts/agents/sources | Automation/maintainer/agent | Validate, discover artifact, tránh drift |
| `references/` | Reference Intelligence Layer | Maintainer/agent | Audit upstream, mapping inspiration, attribution/license hygiene |
| `scripts/` | Validation/reference helper scripts | Maintainer/CI/agent | `npm run validate`, clone/index/report references |
| `docs/` | Tài liệu bổ sung | Human/agent | Memory conventions, docs tiếng Việt, future guides |

## 2. Workflow feature

Dùng khi thêm feature mới hoặc thay đổi behavior đáng kể.

1. `vibe-init`: inspect instructions, git status, registries, context.
2. `vibe-spec`: viết intent, goals, non-goals, constraints, expected behavior, acceptance criteria.
3. `vibe-plan`: chia task thành bước nhỏ, xác định files, risks, verification.
4. `vibe-implement`: sửa file theo plan, tránh unrelated churn.
5. Test/validate: chạy targeted checks trước, sau đó broader validation nếu cần.
6. `vibe-review`: review diff, blockers, missing tests, security, attribution.
7. `vibe-memory`: ghi durable decisions/gotchas/follow-ups nếu hữu ích.
8. `vibe-merge`: kiểm merge readiness.

## 3. Workflow bugfix

Dùng khi sửa lỗi hoặc regression.

1. Reproduce lỗi hoặc ghi rõ vì sao không reproduce được.
2. Tìm minimal failing case/test nếu có thể.
3. Dùng `vibe-spec` nhẹ nếu bug có scope/rủi ro lớn.
4. Dùng `vibe-plan` để giới hạn files và expected fix.
5. Implement minimal correction.
6. Chạy regression test/targeted check.
7. Review diff để chắc không introduce behavior ngoài scope.
8. Ghi memory nếu có gotcha hoặc command hữu ích cho tương lai.

## 4. Workflow repo health

Dùng khi onboarding, trước release/merge, sau khi sửa cấu trúc repo, hoặc khi validation fail.

1. Chạy `vibe-doctor` để yêu cầu agent inspect required files, registries, skills, commands, templates, package scripts, reference metadata.
2. Chạy `npm run validate` cho full repo validation.
3. Nếu chỉ sửa `references/`, chạy `npm run validate:references`.
4. Nếu validation fail, fix blocker trước khi mở rộng scope.
5. Report pass/fail/limitation rõ ràng.

## 5. Workflow reference/upstream

Dùng khi muốn học từ public upstream repos hoặc cập nhật Reference Intelligence Layer.

1. Đọc `references/index.json` trước.
2. Đọc source doc liên quan trong `references/sources/`.
3. Đọc feature/mapping docs trong `references/features/` và `references/mappings/`.
4. Nếu cần audit thực tế, dùng `npm run references:clone` để clone vào `references/upstreams/` nhưng không stage/commit upstream source tree.
5. Ghi audit/changelog bằng `templates/upstream-audit-template.md` hoặc reference docs hiện có.
6. Chỉ adapt ý tưởng nếu fit cao, license/attribution sạch, và không copy large content.
7. Chạy `npm run validate:references` hoặc `npm run validate`.

## 6. Workflow memory

Dùng khi có thông tin bền vững giúp session sau ra quyết định tốt hơn.

Nên lưu:

- quyết định kiến trúc;
- constraints dài hạn;
- commands/checks đã chạy thành công;
- gotchas;
- follow-ups có giá trị.

Không lưu:

- secrets, passwords, credentials;
- API/OAuth/session/bearer/CI/registry tokens;
- private keys;
- unnecessary personal data;
- raw transcripts/logs/stack traces dài.

Luôn dùng `privacy-filter` hoặc `templates/memory-redaction-checklist.md` trước khi commit memory/example/docs có nguồn từ chat/log.

## 7. Workflow merge readiness

Trước khi merge hoặc tạo PR, kiểm:

- Diff đúng scope chưa?
- Acceptance criteria có được map sang evidence chưa?
- Tests/checks đã chạy chưa?
- Có validation relevant chưa?
- Có secret/private data không?
- Có external material nào cần attribution/license không?
- Có follow-up nào là blocker không?

Nếu check critical fail, không claim done. Nếu check không chạy được do environment limitation, ghi rõ limitation.
