# Skills và Commands — Reference tiếng Việt

Tài liệu này giúp chọn đúng command và skill cho từng tình huống.

## 1. Cách hiểu nhanh

- **Command**: prompt theo pha workflow, nằm trong `commands/` và được đăng ký ở `registry/prompts.json`.
- **Skill**: SOP/operating procedure cho agent, nằm trong `skills/**/SKILL.md` và được đăng ký ở `registry/skills.json`.
- **Template**: artifact để ghi lại spec/plan/task/review/memory/audit, nằm trong `templates/`.
- **Registry**: JSON machine-readable để agent/validation biết artifact nào tồn tại và path ở đâu.

## 2. Command catalog

| Command | Khi dùng | Đầu ra mong muốn | Template/skill liên quan |
| --- | --- | --- | --- |
| `vibe-init` | Bắt đầu session, đổi repo/branch, thiếu context | Session brief, current status, next workflow step | `vibe-bootstrap`, `context-retrieval` |
| `vibe-spec` | Task không trivial, feature mới, behavior chưa rõ | Spec có goals, non-goals, constraints, acceptance criteria | `spec-template.md`, `spec-first-development` |
| `vibe-plan` | Đã có spec hoặc task rõ, cần chia việc | Ordered plan, target files, risks, verification | `plan-template.md`, `plan-driven-execution` |
| `vibe-implement` | Đã có plan/scope rõ và cần sửa file | Patch nhỏ, đúng scope, kèm checks | `implementer-agent`, `test-driven-development` |
| `vibe-review` | Sau khi có diff hoặc trước PR | Blockers, suggestions, verification reviewed | `review-template.md`, `review-before-merge` |
| `vibe-memory` | Cuối session hoặc sau quyết định quan trọng | Memory/handoff đã privacy-filter | `memory-template.md`, `session-summarizer`, `privacy-filter` |
| `vibe-merge` | Trước khi merge/ship | Merge readiness report | `verification-before-done`, `review-before-merge` |
| `vibe-doctor` | Onboarding, validation fail, nghi registry drift | Repo health diagnostic | `npm run validate` |
| `vibe-reference-add` | Thêm upstream source vào reference layer | Source metadata, docs, registry updates | `upstream-audit-template.md` |
| `vibe-reference-audit` | Audit source đã track | Audit notes, changelog update | `upstream-intelligence-loop` |
| `vibe-reference-index` | Rebuild/check reference index | Updated/validated index | `npm run references:index` |
| `vibe-reference-update` | Adapt local files sau audit | Local changes có attribution/validation | `reference-scorecard-template.md` |
| `vibe-upstream-sync` | Audit + update reference metadata + adapt high-fit ideas | Sync report, changelog, validation | Reference Intelligence Layer |

## 3. Core skills

| Skill | Dùng khi nào | Output chính |
| --- | --- | --- |
| `vibe-bootstrap` | Khởi động session cần hiểu repo/instructions/status | Context summary, next step, relevant skills/commands |
| `clarify-before-code` | Request mơ hồ, thiếu constraints/acceptance criteria | Câu hỏi ngắn hoặc assumptions rõ ràng |
| `spec-first-development` | Thay đổi non-trivial cần đặc tả trước | Spec compact, reviewable |
| `plan-driven-execution` | Cần chia spec/task thành bước nhỏ | Plan có tasks, files, risks, checks, rollback |
| `test-driven-development` | Behavior change, bugfix, regression risk | Test/check trước hoặc cùng lúc với fix |
| `verification-before-done` | Trước khi nói “xong” | Evidence pass/fail/limitation rõ ràng |
| `review-before-merge` | Trước merge hoặc handoff | Review theo correctness, security, attribution, tests |
| `upstream-intelligence-loop` | Muốn học ý tưởng từ repo upstream | Audit/adaptation có license và attribution guardrails |

## 4. Agent role skills

| Skill | Vai trò | Khi nên gọi |
| --- | --- | --- |
| `architect-agent` | Thiết kế approach, trade-offs, boundaries | Feature nhiều component hoặc cần quyết định kiến trúc |
| `implementer-agent` | Sửa file theo plan và conventions | Khi scope đã rõ và cần patch cụ thể |
| `reviewer-agent` | Review diff/blockers/readiness | Sau khi có patch hoặc trước merge |
| `tester-agent` | Chọn và chạy test/check giá trị nhất | Bugfix, risky change, validation strategy |

## 5. Memory skills

| Skill | Dùng để làm gì? |
| --- | --- |
| `context-retrieval` | Tìm context repo liên quan trước planning/debugging/review |
| `privacy-filter` | Chặn secrets/tokens/keys/private data/log sensitive trước memory/examples/commit |
| `project-memory` | Lưu durable decisions/context có source/confidence/staleness |
| `session-summarizer` | Nén session thành handoff summary: goal, changes, commands, blockers, follow-ups |

## 6. Prompt guardrail skills

| Skill | Guardrail |
| --- | --- |
| `anti-overengineering` | Giữ solution đơn giản, local, proportional; tránh speculative features |
| `ask-when-confused` | Làm uncertainty visible thay vì đoán mò |
| `karpathy-guardrails` | Iteration nhỏ, empirical signal, tránh tinkering vô tận |

## 7. Skill combo recipes

| Tình huống | Combo khuyến nghị |
| --- | --- |
| Feature mới | `clarify-before-code` → `spec-first-development` → `plan-driven-execution` → `test-driven-development` → `verification-before-done` → `review-before-merge` |
| Bugfix | `context-retrieval` → `clarify-before-code` → `test-driven-development` → `verification-before-done` → `review-before-merge` |
| Refactor | `spec-first-development` nhẹ → `plan-driven-execution` → `test-driven-development` → `review-before-merge` |
| Docs/localization | `context-retrieval` → `anti-overengineering` → `verification-before-done` |
| Repo health | `vibe-bootstrap` → `vibe-doctor` → `verification-before-done` |
| Reference audit | `upstream-intelligence-loop` → `privacy-filter` → `verification-before-done` |
| Session dài | `context-retrieval` → `session-summarizer` → `project-memory` → `privacy-filter` |
