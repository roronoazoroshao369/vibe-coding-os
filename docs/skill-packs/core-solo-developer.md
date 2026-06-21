# Core Solo Developer Pack

> Giảm context overload — chỉ load skills cần thiết cho developer 1 người.

## Khi Nào Dùng Pack Này

- Bạn là solo developer, không có team
- Muốn workflow đủ kỷ luật nhưng không quá phức tạp
- Bắt đầu với Vibe Coding OS lần đầu

## Skills Trong Pack

| # | Skill | Path | Khi Dùng |
|---|-------|------|----------|
| 1 | Brainstorming | `skills/core/brainstorming/SKILL.md` | Bắt đầu bất kỳ task nào — clarify ý định |
| 2 | Grill User Before Building | `skills/core/grill-user-before-building/SKILL.md` | Request mơ hồ — cần hỏi rõ trước khi code |
| 3 | Spec First Development | `skills/core/spec-first-development/SKILL.md` | Feature mới — cần spec trước implement |
| 4 | What Before How | `skills/core/what-before-how/SKILL.md` | Luôn nhớ: định nghĩa "cái gì" trước "làm thế nào" |
| 5 | Writing Plans | `skills/core/writing-plans/SKILL.md` | Chia task nhỏ, có verification steps |
| 6 | Test Driven Development | `skills/core/test-driven-development/SKILL.md` | Viết test trước khi viết code |
| 7 | Executing Plans | `skills/core/executing-plans/SKILL.md` | Triển khai theo plan đã có |
| 8 | Requesting Code Review | `skills/core/requesting-code-review/SKILL.md` | Chuẩn bị review cho code |
| 9 | Verification Before Done | `skills/core/verification-before-completion/SKILL.md` | Kiểm tra trước khi claim "xong" |
| 10 | Finishing Development Branch | `skills/core/finishing-a-development-branch/SKILL.md` | Merge-ready checklist |

## Commands对应

| Phase | Command |
|-------|---------|
| Bắt đầu | `vibe-brainstorm` |
| Làm rõ | `vibe-grill-me` |
| Spec | `vibe-spec` |
| Plan | `vibe-plan-from-spec` |
| Implement | `vibe-implement` |
| Review | `vibe-request-review` |
| Verify | `vibe-verify` |
| Finish | `vibe-finish-branch` |

## Ví Dụ Workflow

```
User: "Thêm feature đăng nhập bằng Google"
    ↓ vibe-brainstorm (brainstorming skill)
    ↓ vibe-grill-me (grill-user skill)
    ↓ vibe-spec (spec-first skill)
    ↓ vibe-plan-from-spec (writing-plans skill)
    ↓ vibe-implement (executing-plans skill)
    ↓ vibe-tdd (TDD skill)
    ↓ vibe-request-review (review skill)
    ↓ vibe-verify (verification skill)
    ↓ vibe-finish-branch (finishing skill)
```

## Cách Kích Hoạt

```bash
# Trong Claude Code, load pack bằng cách gọi skill theo phase:
# Không cần load tất cả — chỉ load skill cho phase hiện tại

# Hoặc reference file này trong AGENTS.md/CLAUDE.md:
# "Dùng skills from docs/skill-packs/core-solo-developer.md"
```
