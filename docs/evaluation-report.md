# Evaluation Report Runner

The evaluation report runner aggregates all validation and test commands into a single unified report. It is the entry point for verifying repository integrity, security, memory safety, and adapter readiness.

## What the Report Covers

The report runs four checks:

| Check | Command | What It Does |
|---|---|---|
| Repo Validation | `npm run validate` | Runs repo structure validation, reference validation, traceability checks, and injection detection |
| Secret Scanning | `node scripts/validate-secrets.mjs` | Scans git staged diff for secrets (API keys, tokens, credentials) |
| Memory Redaction | `node scripts/verify-memory-redaction.mjs` | Verifies the memory redaction function correctly hides sensitive patterns while preserving safe content |
| Adapter Smoke Tests | `node scripts/smoke-test-adapters.mjs` | Checks all adapter directories for expected files and well-formed content |

## How to Run It

```bash
npm run eval:report
```

Or directly:

```bash
node scripts/evaluation-report.mjs
```

The script produces:
- A console summary (stdout) with pass/fail status for each check
- A detailed Markdown report written to `docs/reports/evaluation-report.md`

## How to Interpret Results

A passing report looks like:

```
=== Vibe Coding OS Evaluation Report ===
Date: 2026-06-16

✅ Repo Validation: PASS (341 narrative files, 0 broken refs)
✅ Secret Scanning: PASS (0 secrets found)
✅ Memory Redaction: PASS (30/30 tests)
✅ Adapter Smoke Tests: PASS (4/4 adapters)

Overall: 4/4 checks passed
```

Each check shows a human-readable summary in parentheses, extracted from the most
meaningful line of the tool's output.

## What to Do If a Check Fails

1. **Look at the last 5 lines** — the report prints truncated output for failing checks.
2. **Run the failing check directly** for the full output:
   ```bash
   node scripts/validate-secrets.mjs
   ```
3. **Fix the underlying issue**:
   - **Repo Validation failure**: missing files, broken cross-references, traceability drift, or injection found. Check the script's full output.
   - **Secret Scanning failure**: secrets found in staged changes. Remove them before committing or add to `.gitignore`.
   - **Memory Redaction failure**: the redaction function does not handle all test cases. Check `docs/tests/memory-redaction-test-cases.md`.
   - **Adapter Smoke Tests failure**: missing adapter files or malformed content in `adapters/`.
4. **Re-run the report** to confirm the fix.

If any check fails, the script exits with code 1 (non-zero) so CI pipelines will
also catch failures.

## File Reference

- **Script**: `scripts/evaluation-report.mjs`
- **Output (Markdown)**: `docs/reports/evaluation-report.md`
- **Individual checks**: `scripts/validate-repo.mjs`, `scripts/validate-secrets.mjs`,
  `scripts/verify-memory-redaction.mjs`, `scripts/smoke-test-adapters.mjs`
