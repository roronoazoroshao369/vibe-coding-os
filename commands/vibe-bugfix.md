---
description: "Fix bugs with TDD-anchored lifecycle: assess → failing test → fix → verify"
---

# vibe-bugfix

## Purpose

Fix a reported bug using a TDD-anchored lifecycle: assess the symptom and root cause, write a failing test (RED), apply the minimal fix (GREEN), refactor and run regression checks (REFACTOR), then verify against acceptance criteria.

## When to use

Use when a concrete defect has been identified and you intend to fix it. Prefer this over `vibe-diagnose` or `vibe-debug` when you have enough evidence to commit to a root-cause hypothesis and want a regression-proof trail from RED to GREEN. If the cause is unknown, run `vibe-diagnose` first.

## Usage

```
vibe-bugfix [--issue <ref>] [--file <path>] [--strict]
```

### Options

- `--issue <ref>` — Reference to an issue, ticket, or bug report (e.g. `BUG-42` or `#123`). Used in the template and test name.
- `--file <path>` — Path to the suspected source file with the defect.
- `--strict` — Fail if any pre-flight check fails (no test framework found, no reproduction possible, etc.).

## Required inputs

- Symptom description and expected behavior.
- Reproduction steps or failing scenario.
- Suspected root cause or code path.
- Project's test framework and runner command.
- Acceptance criteria for the fix.

## Step-by-step behavior

### 1. Analyze symptom and root cause

1. Restate the symptom clearly: what happens vs what should happen.
2. Examine error messages, stack traces, logs, or recent changes.
3. Trace the code path from symptom to suspected root cause.
4. State a root-cause hypothesis with confidence level.

### 2. Reproduce the defect

1. Run the exact steps or command that triggers the bug.
2. Capture the failing output as evidence.
3. If reproduction is impossible, document what evidence is missing and assess whether to proceed.

### 3. Write failing test (RED)

1. Write one targeted test that encodes the correct behavior and fails because of the bug.
2. Use `--issue` and `--file` hints to name the test descriptively.
3. Run only that test and confirm it is RED for the right reason.
4. **Do not edit production code until RED is confirmed.**

### 4. Apply fix (GREEN)

1. Apply the smallest production-code change that makes the failing test pass.
2. Run the test until it is GREEN.
3. Do not refactor unrelated code at this stage.

### 5. Refactor and regression (REFACTOR)

1. Clean up incidental complexity introduced during the fix.
2. Run the surrounding test suite and any lint/type checks to confirm no regressions.

### 6. Verify

1. Re-run the original reproduction steps and confirm the symptom is gone.
2. Run all relevant acceptance criteria.
3. Output the verdict: `verified` / `partial` / `failed`.

## Outputs

- Reproduction evidence (command + observed output).
- One test observed RED → GREEN with execution logs.
- Minimal production-code diff.
- Regression check results (surrounding suite + lint/type).
- Resolution verdict and recorded bug-fix entry.

## Stopping conditions

- No test framework is available and `--strict` is set → stop and request setup.
- Reproduction is impossible and missing critical evidence → stop and request more data.
- Same test passes immediately (always green) → the test does not cover the bug; revise it.
- Fix requires changes beyond the suspected files without explicit scope expansion.

## Related skills and commands

- `skills/core/bug-fix-lifecycle/SKILL.md` — the full skill definition.
- `commands/vibe-diagnose.md` — evidence-based diagnosis when the cause is unknown.
- `commands/vibe-tdd.md` — generic red-green-refactor for new behavior.
- `templates/bugfix-template.md` — structured template for recording a bug fix.

## Verification checklist

- [ ] Symptom and expected behavior recorded.
- [ ] Root-cause hypothesis stated with confidence.
- [ ] Reproduction steps documented (or limitation noted).
- [ ] Failing test written and observed RED.
- [ ] Fix applied and test is GREEN.
- [ ] Regression checks pass.
- [ ] Original symptom no longer reproduces.
- [ ] Verdict recorded: `verified` / `partial` / `failed`.

## Ghi chú tiếng Việt

Sửa lỗi theo TDD lifecycle: phân tích nguyên nhân → tái hiện lỗi → viết test đỏ → sửa đến xanh → tái cấu trúc → xác minh. Dùng `--issue` để gắn với ticket. Không sửa code production trước khi thấy test đỏ.
