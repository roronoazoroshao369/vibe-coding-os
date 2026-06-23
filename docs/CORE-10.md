---
title: "Core 10 — start here"
version: "2.18.0"
last_reviewed: 2026-06-23
category: onboarding
status: stable
---

# Core 10 — the 10 things you actually use daily

Vibe Coding OS ships 115 skills, 113 commands, and 107 templates. **You do not
need most of them to be productive.** This is the golden path: ten capabilities
that cover ~90% of real work. Everything else is *advanced/optional* — reach for
it only when a specific need arises.

> New here? Read this page, run the [First Workflow](FIRST-WORKFLOW.md) once, then
> come back for the advanced surface.

## The loop these support

```text
Intent → Spec → Plan → Implement → Test → Review → Memory → Merge
```

## The Core 10

| # | Use it to… | Command | Skill |
|---|---|---|---|
| 1 | Turn a vague idea into a clear spec | `/vibe-spec` | `skills/core/spec-first-development` |
| 2 | Ask the right questions before coding | `/vibe-grill-me` | `skills/core/grill-user-before-building` |
| 3 | Break a spec into an ordered plan | `/vibe-plan` | `skills/core/plan-from-spec` |
| 4 | Split a plan into reviewable tasks | `/vibe-tasks` | `skills/core/task-breakdown-from-plan` |
| 5 | Implement against the plan, small steps | `/vibe-implement` | `skills/core/plan-driven-execution` |
| 6 | Write tests first for risky logic | `/vibe-tdd` | `skills/core/test-driven-development` |
| 7 | Review a diff before merge | `/vibe-review` | `skills/core/review-before-merge` |
| 8 | Prove it works before claiming done | `/vibe-verify` | `skills/core/verification-before-done` |
| 9 | Diagnose a bug methodically | `/vibe-debug` | `skills/core/systematic-debugging` |
| 10 | Record durable decisions (no secrets) | `/vibe-memory` | `skills/memory/project-memory` |

## When to leave the Core 10

| You need… | Look at |
|---|---|
| Multi-agent / parallel work | `skills/core/team-agent-orchestration`, `docs/orchestration-guide.md` |
| Security review of risky code | `skills/core/secure-coding-checklist`, `skills/core/threat-model-driven-security` |
| Existing/legacy codebase | `skills/core/brownfield-spec-enhancement` |
| Adapt prompts to model/risk | `docs/smart-adapt.md` |
| Quality gates & telemetry | `docs/quality-engine-guide.md`, `docs/quality-telemetry-guide.md` |
| Everything, grouped by lifecycle | `skills/core/INDEX.md` |

## Ghi chú tiếng Việt

Repo có rất nhiều skill/command, nhưng bạn **không cần học hết**. Mười mục ở trên
phủ ~90% công việc thực tế theo vòng lặp `Spec → Plan → Implement → Test → Review
→ Memory → Merge`. Phần còn lại là *nâng cao/tùy chọn* — chỉ dùng khi có nhu cầu
cụ thể. Người mới nên đọc trang này, chạy [First Workflow](FIRST-WORKFLOW.md) một
lần, rồi mới khám phá phần nâng cao.
