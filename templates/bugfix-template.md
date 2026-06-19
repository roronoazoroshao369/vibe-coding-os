---
name: bugfix-record
description: "Record a bug fix with symptom, root cause, fix, test evidence, and regression results"
fields:
  - symptom
  - expected_behavior
  - reproduction_steps
  - root_cause
  - fix_description
  - test_evidence_red
  - test_evidence_green
  - regression_results
  - verdict
---

# Bug Fix Record

> Use this template to record each TDD-anchored bug fix. Fill in every section. Redact secrets and sensitive data before saving.
> Vietnamese: Dùng template này để ghi lại mỗi lần sửa lỗi theo TDD lifecycle. Điền đầy đủ. Luôn redact secrets/dữ liệu nhạy cảm trước khi lưu.

## Metadata

- **Issue ref**: `{issue_ref}`
- **Date**: {date}
- **Fixed by**: {author}
- **Files changed**: {files_changed}

## Symptom

{observed_behavior}
*What actually happens (error message, crash, wrong output, etc.)*

## Expected behavior

{expected_behavior}
*What should happen instead*

## Reproduction

### Steps

```
{reproduction_command_or_steps}
```

### Actual output

```
{actual_output}
```

### Expected output

```
{expected_output}
```

### Reproduction status

- [x] Reproduced locally
- [ ] Cannot reproduce (explain: {why_not})

## Root cause analysis

### Suspected code path

{code_path_description}

### Root cause

{root_cause_statement}

### Hypothesis confidence

- [ ] High (direct evidence)
- [ ] Medium (strong circumstantial evidence)
- [ ] Low (best guess, needs more investigation)

## Fix

### Description

{fix_description}
*What was changed and why*

### Diff summary

```
{diff_summary_or_command}
```

### Changed files

- `{file_path}` — {change_description}

## Test evidence

### Failing test (RED)

**Test name**: `{test_name}`

**Command**: `{test_command}`

**RED output**:

```
{red_output}
```

### Passing test (GREEN)

**Command**: `{test_command}`

**GREEN output**:

```
{green_output}
```

### Test quality

- [ ] Test is minimal and behavior-focused
- [ ] Test was observed RED before any production code change
- [ ] Test encodes the correct behavior for this bug

## Regression results

### Surrounding test suite

**Command**: `{regression_command}`

**Result**: `{regression_result}`

- [x] All tests pass / [ ] Some tests fail (see notes)

### Lint/type checks

**Command**: `{lint_command}`

**Result**: `{lint_result}`

## Verification

### Original symptom re-check

**Command**: `{verify_command}`

**Result**: `{verify_result}`

### Acceptance criteria

- [ ] Symptom no longer reproduces
- [ ] All acceptance criteria pass
- [ ] Edge cases documented (if any)

## Verdict

- [x] **Verified** — fix resolves the bug, test is GREEN, regression passes
- [ ] **Partial** — main case fixed but edge cases remain
- [ ] **Failed** — fix did not resolve the root cause

## Lessons learned

{lessons_learned}
*What could prevent this bug in the future? Better tests? Type checks? Validation?*
