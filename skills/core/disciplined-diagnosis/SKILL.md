# Skill: Disciplined Diagnosis

## Purpose

Debug by reproducing, isolating, hypothesizing, testing, and documenting evidence before patching.

## When to use

Use for bugs, flaky tests, regressions, performance surprises, or any symptom without a proven cause.

## Inputs

Symptom, expected behavior, reproduction steps, logs, recent changes, affected files, and available checks.

## Workflow

1. Reproduce or define why reproduction is blocked.
2. Capture observed vs expected behavior.
3. Generate ranked hypotheses.
4. Test the cheapest hypothesis first.
5. Patch only after evidence points to a cause.
6. Add or update a regression check when feasible.

## Outputs

Diagnosis notes, root cause or best-supported hypothesis, patch plan, regression test, and verification results.

## Failure modes

Shotgun fixes, changing multiple variables at once, ignoring failed hypotheses, or claiming a cause without evidence.

## Verification checklist

A reproduction exists or limitation is stated; hypotheses are tracked; fix is minimal; regression check proves the bug.

## Ghi chú tiếng Việt

Đây là vòng debug có kỷ luật: tái hiện lỗi, lập giả thuyết, kiểm chứng, rồi mới sửa. Liên kết với `commands/vibe-diagnose.md` và `templates/diagnosis-template.md`. Khi upstream thay đổi phần diagnose, cập nhật checklist chứ không chép nội dung.
