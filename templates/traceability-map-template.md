# Traceability Map Template

> Copy this into a plan, an issue tracker, or a `docs/` note when one piece of work spans a spec, multiple issues, and isolated branches/worktrees. Markdown only — no `gh` automation, MCP server, or GitHub-as-database is implied.

## Purpose

Keep a single, source-of-truth link between an accepted spec, the issues sliced from it, and the branches or worktrees where each issue is implemented, so progress and ownership stay clear without runtime tooling.

## Header

- Spec: `<path or link to accepted spec>`
- Plan: `<path or link to plan>`
- Owner: `<person or agent>`
- Status: `planning | in-progress | review | done`
- Last updated: `<date>`

## Traceability table

| Issue ID | Slice (vertical behavior) | Spec criteria covered | Branch / worktree | Status | Verification |
| --- | --- | --- | --- | --- | --- |
| `<id>` | `<one user-visible slice>` | `<criteria IDs from spec>` | `<branch or .git worktree path>` | `todo / ready / in-progress / blocked / done` | `<command + result or not-run reason>` |

## Rules

- Every issue traces back to at least one observable spec acceptance criterion; flag any issue that does not.
- Every spec criterion is covered by at least one issue before implementation is called complete; list uncovered criteria explicitly.
- One branch or worktree per independently mergeable issue; record exclusive-file conflicts in the status cell.
- Update the status column when an issue changes state, and update dependent issues at the same time.
- Mark an issue `done` only with a passed verification command or an explicit not-run reason.

## Coverage check

- [ ] Every issue links to a spec criterion.
- [ ] Every spec criterion links to at least one issue.
- [ ] Every in-progress issue names its branch/worktree and owner.
- [ ] No two active issues edit the same exclusive file without a recorded plan.
- [ ] Done issues carry verification evidence.

## Out of scope

- This template does not require GitHub, `gh`, an issue-sync script, or any MCP/runtime engine.
- It does not replace `templates/tasks-template.md`; use it when work crosses issue and branch boundaries and needs end-to-end traceability.

## Ghi chú tiếng Việt

Dùng bảng truy vết này khi một việc trải dài qua spec → nhiều issue → nhiều nhánh/worktree. Mỗi issue phải nối ngược về tiêu chí spec; mỗi tiêu chí phải có issue phủ; mỗi issue đang làm phải ghi nhánh/worktree và chủ sở hữu. Chỉ markdown, không cần `gh`, MCP, hay runtime.