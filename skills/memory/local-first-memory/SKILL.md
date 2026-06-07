# Skill: Local-first Memory

## Purpose

Choose the smallest local memory surface that preserves useful project context without introducing hosted storage, background daemons, or hidden data flows.

## When to use

Use when deciding where memory should live, whether an external provider is acceptable, or how to scope memory by project, worktree, session, or user opt-out.

## Inputs

- Memory goal and expected lifetime.
- Repository, worktree, branch, and session scope.
- Candidate storage location or provider.
- Privacy exclusions, retention needs, and user opt-out constraints.

## Workflow

1. Classify scope: session-only, worktree, project, global user, or external provider.
2. Prefer local project/worktree storage for repo facts; use session memory for transient coordination.
3. Apply opt-out rules before creating or loading memory; record the opt-out marker at the same scope it protects so future sessions do not re-enable it accidentally.
4. Keep project facts in project memory, worktree-specific facts in worktree/session memory, and never promote branch-only decisions to global memory without review.
5. Define retention: keep, expire, archive, or delete on branch cleanup.
6. If a provider is requested, require a local fallback and document what leaves the machine.
7. Record scope, retention, source, confidence, stale-risk, and opt-out labels.

## Outputs

- Storage/scoping decision.
- Local fallback plan when a provider is optional.
- Retention and opt-out notes.

## Failure modes

- Treating cloud memory as required.
- Mixing worktree-specific facts into global memory.
- Loading stale global notes into an unrelated project.
- Ignoring explicit opt-out or privacy constraints.

## Verification checklist

- [ ] Scope is explicit: session, worktree, project, user, or provider.
- [ ] Worktree-only facts are not leaking into project/global memory.
- [ ] Local-first behavior remains available.
- [ ] Opt-out marker and retention rules are documented at the protected scope.
- [ ] Provider use, if any, states exactly what data leaves local storage.

## Applied / Not Applied

Applied as original wording from claude-mem-inspired persistent-context design: project/worktree memory scoping and opt-out tracking recorded at the scope they protect. Not applied: hosted services, background daemons, SQLite/vector storage, installers, or copied upstream text.

## Ghi chú tiếng Việt

Ưu tiên bộ nhớ cục bộ theo phạm vi rõ ràng. Chỉ dùng nhà cung cấp ngoài khi người dùng muốn, có fallback cục bộ, và đã ghi rõ dữ liệu nào rời khỏi máy.
