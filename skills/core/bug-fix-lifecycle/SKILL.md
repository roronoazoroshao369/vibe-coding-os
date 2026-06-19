# Skill: Bug Fix Lifecycle

## Purpose

Drive a bug from report to confirmed resolution through five TDD-anchored phases: **Assess → RED (failing test) → GREEN (fix) → REFACTOR (regression) → Verify**. The defining move is that every fix is gated behind a test that fails for the right reason first, so a bug can never be silently declared fixed.

## When to use

Use when a concrete defect has been reported and you intend to fix it, not merely investigate it. Choose this over `skills/core/disciplined-diagnosis` (hypothesis-ranking when the cause is unknown) once you have committed to repairing the behavior and want a regression-proof trail. If the cause is still a mystery, run disciplined-diagnosis first, then enter this lifecycle.

## Inputs

Bug report or symptom, expected versus actual behavior, reproduction steps or a stack trace, suspected code paths, the project's test framework and runner commands, and any environment constraints.

## Workflow

### Phase 1 — Assess & Reproduce (Triage)

1. **Restate the symptom** in one or two sentences: what happens, what should happen, under which conditions.
2. **Root-cause analysis**: locate suspected code paths from the evidence (symbols, error strings, stack traces, logs). List candidates with brief justification; do not exceed what the evidence supports.
3. **Reproduce the defect** locally when practical; capture the exact command and observed output. If reproduction is impossible, mark it explicitly and record what evidence is missing rather than guessing.
4. **State a root-cause hypothesis** with a confidence level and name the smallest behavior slice that must change.

### Phase 2 — Write the Failing Test (RED)

1. **Write one targeted test** that encodes the correct behavior and currently fails because of the bug.
2. **Confirm red** — run only that test and verify it fails for the right reason (the failure must match the reported symptom, not a typo or setup error). **Do not proceed to fix until you have seen RED.**
3. Keep the test minimal and behavior-focused; assert the observable outcome, not internal implementation detail. If the framework genuinely cannot express the case, record why and fall back to a documented manual reproduction.

### Phase 3 — Fix Until Green (GREEN)

1. **Apply the smallest production-code change** that makes the failing test pass. Fix the root cause, never patch the test to accommodate broken behavior.
2. **Confirm green** — re-run the new test until it passes.
3. Stay within the files the assessment implicated; if new evidence forces a wider change, note the scope expansion explicitly.

### Phase 4 — Refactor & Regression (REFACTOR)

1. **Clean up** incidental complexity introduced during the fix: rename variables, extract helpers, remove debug prints, simplify conditionals. Do not refactor unrelated code.
2. **Run the surrounding test suite** and any lint or type checks for the touched modules to confirm nothing regressed.
3. Remove only orphans your own change created.

### Phase 5 — Verify Against Acceptance Criteria

1. **Confirm the original symptom no longer reproduces** using the same steps from Phase 1.
2. **Run all relevant acceptance criteria** — not just the new test, but any behavioral scenarios the bug touched.
3. **Record the verdict**: `verified` (once-failing test passes + original symptom gone), `partial` (main fix works but edge cases remain), or `failed` (fix did not resolve the root cause).

## Examples

### Example 1: Null pointer in user lookup

- **Symptom**: GET `/users/999` crashes with `TypeError: Cannot read properties of null`. Expected: 404 response.
- **Root cause**: Controller assumes `userRepo.findById()` never returns null.
- **RED**: Write test `returns 404 when user not found` → confirms 500 becomes the desired 404.
- **GREEN**: Add null guard in controller → test passes.
- **REFACTOR**: Extract null-check into a shared `findOrNotFound` helper; run full user endpoint suite → all green.
- **Verify**: Curl `/users/999` → 404. Acceptance criteria pass.

### Example 2: Off-by-one in pagination

- **Symptom**: Page 2 of search results shows items 11–20 instead of 11–19 when there are 19 total. Expected: 11–19.
- **Root cause**: `page * pageSize` as offset; should be `(page - 1) * pageSize`.
- **RED**: Write test `last page returns correct remaining count`.
- **GREEN**: Fix offset calculation.
- **REFACTOR**: Move offset logic to a single helper; run pagination suite → all green.
- **Verify**: Manual curl with 19 items → page 2 shows 9 items. Acceptance criteria pass.

## Outputs

- A reproduction note (or stated limitation).
- One regression test observed failing (**RED**) then passing (**GREEN**).
- A minimal root-cause fix with any refactoring kept separate.
- Recorded verification commands with results.
- A resolution verdict: `verified` / `partial` / `failed`.

## Related skills and commands

- `skills/core/disciplined-diagnosis/SKILL.md` — hypothesis-driven debugging when the cause is unknown.
- `commands/vibe-diagnose.md` — evidence-based diagnosis loop.
- `commands/vibe-bugfix.md` — TDD-anchored bug fix command entrypoint.
- `templates/bugfix-template.md` — structured template for recording a bug fix.

## Failure modes

- Editing production code before a failing test exists (skipping RED).
- A test that passes immediately (never observed red) — it proves nothing about the bug.
- Patching the test instead of the defect to force green.
- Declaring `verified` without re-running the reproduction.
- Expanding scope into adjacent refactors mid-fix.
- Doing refactor before GREEN — always fix first, then clean up.
- Skipping regression checks and breaking unrelated behavior.

## Verification checklist

- [ ] Reproduction is documented or its impossibility is justified.
- [ ] A test was observed failing for the right reason before any fix (**RED confirmed**).
- [ ] The fix targets root cause and keeps the diff minimal.
- [ ] The once-failing test now passes (**GREEN confirmed**).
- [ ] Refactoring was done after GREEN, not before.
- [ ] Broader test suite / lint / type checks pass (no regression).
- [ ] The original symptom no longer reproduces.
- [ ] The verdict (`verified` / `partial` / `failed`) is honest about what was actually exercised.

## Ghi chú tiếng Việt

Vòng đời sửa lỗi gồm 5 pha TDD: Đánh giá & Tái hiện → Viết test đỏ (RED) → Sửa đến xanh (GREEN) → Tái cấu trúc & kiểm tra hồi quy (REFACTOR) → Xác minh tiêu chí chấp nhận. Điểm khác biệt: phải thấy test đỏ đúng lý do trước khi sửa code, để không bao giờ tuyên bố "đã sửa" mà chưa có bằng chứng. Khác `disciplined-diagnosis` (xếp hạng giả thuyết khi chưa rõ nguyên nhân). Lấy cảm hứng từ tiện ích `bug` của `github/spec-kit` (MIT), viết lại nguyên gốc, không sao chép văn bản upstream.
