---
name: git-guardrails
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Git Guardrails

## Purpose

Protect repository history and user work by treating destructive git operations as high-risk.

## When to use

Use before branch cleanup, rebases, resets, force pushes, or when an agent may run git commands.

## Inputs

Current branch, status, user intent, remote policy, uncommitted changes, and risky command under consideration.

## Workflow

1. Inspect `git status` before risky operations.
2. Never delete or overwrite user work without explicit instruction.
3. Prefer reversible commands and commits.
4. Document risks before destructive operations.
5. Run validation before commit/PR handoff.

## Outputs

Guardrail checklist, safe command plan, commit readiness notes, and blocked-command rationale when needed.

## Failure modes

Running reset/clean/force-push casually, committing unrelated changes, or ignoring untracked files.

## Verification checklist

Status was inspected; destructive commands avoided or justified; commit only includes intended files; validation status is recorded.

## Decision-context commit trailers (convention)

Preserve the reasoning behind a change inside the commit message itself, so future readers see *why* the code is shaped this way without re-running the investigation. This is a pure message convention: no tooling, no runtime, no enforcement engine.

Structure a non-trivial commit as a conventional subject line, an optional body, then structured trailers at the end:

- `Constraint:` an active constraint that shaped the decision.
- `Rejected:` an alternative considered, with `| reason` for why it was dropped.
- `Directive:` a warning or instruction for whoever modifies this code next.
- `Confidence:` `high` | `medium` | `low` — how sure you are the change is correct.
- `Scope-risk:` `narrow` | `moderate` | `broad` — blast radius if the change is wrong.
- `Not-tested:` an edge case or scenario the change does not cover.

Rules:

- Include a trailer only when it carries real signal. Skip all trailers for trivial commits (typos, formatting, comment tweaks).
- One fact per trailer line; repeat a key (e.g. two `Constraint:` lines) rather than packing several into one.
- Keep trailers at the very end of the message, after any prose body, so they parse cleanly.
- Trailers record decisions, not a changelog — describe constraints and trade-offs, not the diff.

Example:

```
fix(session): refresh tokens inline instead of dropping the session

Auth service returns inconsistent status codes on expiry, so the
interceptor now catches all 4xx and refreshes before retrying once.

Constraint: Auth service has no token-introspection endpoint
Rejected: Background timer refresh | races with concurrent requests
Confidence: high
Scope-risk: narrow
Directive: 4xx catch is intentionally broad — verify upstream before narrowing
Not-tested: cold-start latency above 500ms
```

## Verification checklist (commit trailers)

Trailers are used only when they add signal; trivial commits skip them; each line holds one fact; `Confidence`/`Scope-risk` use the allowed values; trailers sit at the end of the message.

## Provenance trailers (enforced by `validate-provenance`)

Distinct from the decision-context trailers above: those are optional, skipped on trivial commits, and carry no tooling. The provenance trailers below are **required on every non-merge commit** and are checked by `scripts/validate-provenance.mjs` (`npm run validate:provenance`), which fails the gate if any are missing or carry a value outside the allowed set.

Add all four to the end of every commit message:

- `AI-Generated:` `yes` | `no` | `partial` — was the diff written by an AI agent.
- `Human-Edited:` `yes` | `no` — did a human modify the AI output before committing.
- `Tested-By:` `human` | `ai` | `ci` | `none` — who/what exercised the change.
- `Human-Reviewed:` `yes` | `no` — did a human read the diff before it landed.

Keys match case-insensitively; values are compared lowercased; the last occurrence of a key wins.

**Self-attested, not verified.** The gate proves the declaration *exists* and is well-formed — it cannot tell whether AI actually wrote the code, whether a human truly reviewed it, or whether the named tests ran. A pass means "the author declared provenance", not "provenance is correct". The value is accountability hygiene: a deliberate, machine-checkable claim on every commit, not ground truth.

**Scope.** The gate checks commits on `main..HEAD` (override the base with `PROVENANCE_BASE`), so it matches a PR's commit range and runs cleanly in CI or a pre-commit hook. Merge commits are skipped; on the base branch the range is empty and the gate passes with nothing to check. A missing base ref (e.g. a shallow CI clone) is a skip, not a failure.

Example:

```
Add rate limiter to the public API

AI-Generated: partial
Human-Edited: yes
Tested-By: ci
Human-Reviewed: yes
```

## Verification checklist (provenance trailers)

Every non-merge commit on the branch carries all four keys; each value is in its allowed set; the claim reflects what actually happened (the gate cannot check this — the author must be honest); `npm run validate:provenance` exits 0 before opening a PR.

## Ghi chú tiếng Việt

Kỹ năng này bảo vệ git history và thay đổi của user. Dùng cho mọi thao tác nguy hiểm. Quy ước trailer commit (`Constraint:`/`Rejected:`/`Directive:`/`Confidence:`/`Scope-risk:`/`Not-tested:`) lưu lại lý do quyết định ngay trong commit message — chỉ là quy ước viết, không cần runtime; bỏ qua với commit nhỏ. File liên quan: `commands/vibe-git-guardrails.md`.

Ngoài ra, trailer **provenance** (`AI-Generated:`/`Human-Edited:`/`Tested-By:`/`Human-Reviewed:`) là **bắt buộc trên mọi commit non-merge** và được `scripts/validate-provenance.mjs` (`npm run validate:provenance`) kiểm: thiếu key hoặc value sai enum → fail. Gate chỉ chứng minh khai báo *tồn tại* và đúng định dạng, **không xác minh** AI có thật sự viết code, human có thật sự review, hay test có thật sự chạy — pass nghĩa là "tác giả đã khai báo provenance", không phải "provenance đúng". Phạm vi: commit trên `main..HEAD` (đổi base bằng `PROVENANCE_BASE`); merge commit được bỏ qua; base ref thiếu thì skip chứ không fail.

## Nguồn cảm hứng / Inspiration

Convention adapted as original wording from `yeachan-heo/oh-my-claudecode` (MIT, Yeachan Heo) commit-protocol trailers. Inspiration only — no upstream text copied.
