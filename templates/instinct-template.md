---
title: Instinct Template
type: template
name: instinct-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:
  - template
status: stable
---

# Instinct Template

> Use this template to record a structured engineering instinct in `references/instincts/`. Each instinct should be a single, testable trigger-action rule with explicit scope and confidence.

---

## Instinct: [Short, memorable name]

**Slug:** `[kebab-case-name]`

**Created:** [YYYY-MM-DD]
**Last verified:** [YYYY-MM-DD]
**Expiry:** [YYYY-MM-DD]

### Trigger

When does this instinct fire? Be specific: name the file patterns, error strings, command outputs, project states, or agent observations that should trigger the action. Avoid vague triggers like "when things get complex."

```
Example:
Trigger: When a PR contains changes to both `db/migrate/` and `app/models/`
in the same commit.
```

### Action

What should the agent DO when the trigger fires? Be prescriptive: name the exact steps, commands, or checks. One instinct should produce one action sequence.

```
Example:
Action: Split into two commits — one for the migration schema, one for the
model changes. Run `rails db:migrate:redo` on the migration commit and
`bundle exec rspec spec/models/` on the model commit.
```

### Scope

**Applies to:**
- [ ] This project only
- [ ] Any project in [language/framework]
- [ ] All projects

**Explicitly does NOT apply to:**
- Projects where [condition]
- Task types: [e.g., prototyping, one-off scripts]

### Confidence

**Score:** [1—10]
**Label:** [Certain | High | Medium | Low | Speculative] (see rubric in instinct-extraction skill)

**Evidence:**
- File(s): [paths to relevant files]
- Command(s): [commands run that validated the pattern]
- Outcome: [what happened — e.g., "caught a silent data loss bug"]
- Source session: [session ID or agent name]

### Verification history

| Date | Verifier | Confidence after | Notes |
|------|----------|-----------------|-------|
| [YYYY-MM-DD] | [agent/user] | [score] | [re-verification result] |

### Related instincts

- [link to other instinct entries that complement or conflict]

### Placement recommendation

[ ] Keep in instinct store — continue using as advisory guidance
[ ] Promote to formal skill — pattern is broad and verified across projects
[ ] Archive — no longer relevant or superseded
[ ] Discard — too vague or narrow to be useful

---

## Ghi chú tiếng Việt

Template này ghi lại instinct kỹ thuật có cấu trúc: tên ngắn, trigger cụ thể (khi nào kích hoạt), action (làm gì), phạm vi (áp dụng/không áp dụng), điểm tin cậy 1-10 kèm nhãn, bằng chứng (file, lệnh, kết quả), lịch sử kiểm chứng, và khuyến nghị sắp xếp. Lưu file tại `references/instincts/<slug>.md`.
