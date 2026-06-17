# Vibe Coding OS Evaluation Report

Date: 2026-06-17

Overall: **4/4 checks passed**

## Summary

- ✅ **Repo Validation**: PASS (398 narrative files) — 788ms
- ✅ **Secret Scanning**: PASS (0 secrets found) — 2.81s
- ✅ **Memory Redaction**: PASS (All tests passed! ✓) — 59ms
- ✅ **Adapter Smoke Tests**: PASS (6/6 adapters) — 56ms

## Details

### Repo Validation

- Command: `npm run validate`
- Status: PASS
- Exit code: 0
- Duration: 788ms
- Last 10 lines of output:

```text
> vibe-coding-os@1.2.0 validate
> node scripts/validate-repo.mjs && node scripts/validate-references.mjs && node scripts/validate-traceability.mjs && node scripts/validate-injection.mjs
Vibe Coding OS validation passed.
Checked 11 required files, 90 skills, 68 commands, 52 templates, and 2 examples (skills/commands/templates discovered dynamically).
Reference Intelligence Layer validation passed.
Checked 14 sources, 26 feature docs, 4 mapping docs, and 5 reference commands.
Traceability validation passed.
Checked 68 commands, 90 skills, 54 templates against 398 narrative files. Broken references: 0. Orphans (warnings): 0 commands, 0 skills, 11 templates.
Injection scan passed: 303 text files + 1 MCP manifest(s) scanned, 0 blocking findings, 0 warning(s). Best-effort only — see docs/workflows/prompt-injection-handling.md.
```

### Secret Scanning

- Command: `node scripts/validate-secrets.mjs`
- Status: PASS
- Exit code: 0
- Duration: 2.81s
- Last 10 lines of output:

```text
Secret scan passed: no secrets detected in tracked repository files.
```

### Memory Redaction

- Command: `node scripts/verify-memory-redaction.mjs`
- Status: PASS
- Exit code: 0
- Duration: 59ms
- Last 10 lines of output:

```text
  ✓ TC-25:
  ✓ TC-26:
  ✓ TC-27:
  ✓ TC-28:
  ✓ TC-29:
  ✓ TC-30:
  ────────────────────────────────────────────────────────────
  Results: 30 passed, 0 failed, 30 total
  Pass rate: 100.0%
  All tests passed! ✓
```

### Adapter Smoke Tests

- Command: `node scripts/smoke-test-adapters.mjs`
- Status: PASS
- Exit code: 0
- Duration: 56ms
- Last 10 lines of output:

```text
Adapter Smoke Tests
===================
✅ Claude Code adapter: OK (7/7 checks passed)
✅ Codex adapter: OK (5/5 checks passed)
✅ Cursor adapter: OK (6/6 checks passed)
✅ Gemini adapter: OK (7/7 checks passed)
✅ Memory adapters: OK (5/5 checks passed)
✅ Compatibility matrix: OK (4/4 checks passed)
Results: 6/6 adapters passed
```

