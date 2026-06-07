# Skill: Bug Fix Lifecycle

## Purpose

Drive a bug from report to confirmed resolution through three disciplined phases anchored on a failing test: Assess & Reproduce, Write the Failing Test, then Fix Until Green. The defining move is that the fix is gated behind a test that fails for the right reason first, so a bug can never be silently declared fixed.

## When to use

Use when a concrete defect has been reported and you intend to fix it, not merely investigate it. Choose this over `skills/core/systematic-debugging` (hypothesis-ranking when the cause is unknown) and `skills/core/triage-workflow` (deciding whether and when to act) once you have committed to repairing the behavior and want a regression-proof trail. If the cause is still a mystery, run systematic debugging first, then enter this lifecycle.

## Inputs

Bug report or symptom, expected versus actual behavior, reproduction steps or a stack trace, suspected code paths, the project's test framework and runner commands, and any environment constraints.

## Workflow

### Phase 1 — Assess & Reproduce

1. Restate the symptom in one or two sentences: what happens, what should happen, under which conditions.
2. Reproduce the defect locally when practical; capture the exact command and observed output. If reproduction is impossible, mark it explicitly and record what evidence is missing rather than guessing.
3. Locate suspected code paths from the evidence (symbols, error strings, routes). List candidates with brief justification; do not exceed what the evidence supports.
4. State a root-cause hypothesis with a confidence level and name the smallest behavior slice that must change.

### Phase 2 — Write the Failing Test

1. Write or update one targeted test that encodes the correct behavior and currently fails because of the bug.
2. Run only that test and confirm it is red for the right reason — the failure must match the reported symptom, not a typo or setup error.
3. Keep the test minimal and behavior-focused; assert the observable outcome, not internal implementation detail. If the framework genuinely cannot express the case, record why and fall back to a documented manual reproduction.

### Phase 3 — Fix Until Green

1. Apply the smallest production-code change that makes the failing test pass. Fix the root cause, never patch the test to accommodate broken behavior.
2. Re-run the new test until it is green, then run the surrounding suite and any lint or type checks for the touched modules to confirm nothing regressed.
3. Stay within the files the assessment implicated; if new evidence forces a wider change, note the scope expansion. Remove only orphans your own change created.
4. Summarize the root cause, the change, and verification status; mark a fix `verified` only if the once-failing test now passes and the original symptom no longer reproduces. Otherwise report `partial` or `failed`.

## Outputs

A reproduction note (or stated limitation), one regression test observed failing then passing, a minimal root-cause fix, recorded verification commands with results, and a resolution verdict (verified / partial / failed).

## Failure modes

- Editing production code before a failing test exists.
- A test that passes immediately (never observed red) — it proves nothing about the bug.
- Patching the test instead of the defect to force green.
- Declaring `verified` without re-running the reproduction.
- Expanding scope into adjacent refactors mid-fix.

## Verification checklist

- [ ] Reproduction is documented or its impossibility is justified.
- [ ] A test was observed failing for the right reason before any fix.
- [ ] The fix targets root cause and keeps the diff minimal.
- [ ] The once-failing test now passes and broader checks were run.
- [ ] The verdict (verified / partial / failed) is honest about what was actually exercised.

## Ghi chú tiếng Việt

Vòng đời sửa lỗi gồm 3 pha neo vào một test thất bại: Đánh giá & Tái hiện → Viết test FAIL → Sửa đến khi xanh. Điểm khác biệt: phải thấy test đỏ đúng lý do trước khi sửa code, để không bao giờ tuyên bố "đã sửa" mà chưa có bằng chứng. Khác `systematic-debugging` (xếp hạng giả thuyết khi chưa rõ nguyên nhân) và `triage-workflow` (quyết định có nên xử lý không). Lấy cảm hứng từ tiện ích `bug` của `github/spec-kit` (MIT), viết lại nguyên gốc, không sao chép văn bản upstream.
