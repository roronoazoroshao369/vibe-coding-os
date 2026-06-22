# Vibe Coding OS Evaluation Report

Date: 2026-06-22

Overall: **4/4 checks passed**

## Summary

- ✅ **Repo Validation**: PASS (785 narrative files) — 7.02s
- ✅ **Secret Scanning**: PASS (0 secrets found) — 12.50s
- ✅ **Memory Redaction**: PASS (All tests passed! ✓) — 66ms
- ✅ **Adapter Smoke Tests**: PASS (10/10 adapters) — 84ms

## Details

### Repo Validation

- Command: `npm run validate`
- Status: PASS
- Exit code: 0
- Duration: 7.02s
- Last 10 lines of output:

```text
> vibe-coding-os@2.17.4 validate
> node scripts/validate-repo.mjs && node scripts/validate-references.mjs && node scripts/validate-traceability.mjs && node scripts/validate-injection.mjs
Vibe Coding OS validation passed.
Checked 11 required files, 115 skills, 116 commands, 107 templates, and 2 examples (skills/commands/templates discovered dynamically).
Reference Intelligence Layer validation passed.
Checked 22 sources, 25 feature docs, 4 mapping docs, and 5 reference commands.
Traceability validation passed.
Checked 116 commands, 115 skills, 125 templates against 785 narrative files. Broken references: 0. Orphans (warnings): 0 commands, 0 skills, 0 templates.
Injection scan passed: 596 text files + 1 MCP manifest(s) scanned, 0 blocking findings, 0 warning(s). Best-effort only — see docs/workflows/prompt-injection-handling.md.
```

### Secret Scanning

- Command: `node scripts/validate-secrets.mjs`
- Status: PASS
- Exit code: 0
- Duration: 12.50s
- Last 10 lines of output:

```text
Secret scan passed: no secrets detected in tracked repository files.
```

### Memory Redaction

- Command: `node scripts/verify-memory-redaction.mjs`
- Status: PASS
- Exit code: 0
- Duration: 66ms
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
- Duration: 84ms
- Last 10 lines of output:

```text
✅ Codex adapter: OK (5/5 checks passed)
✅ Cursor adapter: OK (6/6 checks passed)
✅ Gemini adapter: OK (7/7 checks passed)
✅ Memory adapters: OK (5/5 checks passed)
✅ Cline adapter: OK (8/8 checks passed)
✅ Continue.dev adapter: OK (10/10 checks passed)
✅ Aider adapter: OK (9/9 checks passed)
✅ Windsurf adapter: OK (9/9 checks passed)
✅ Compatibility matrix: OK (4/4 checks passed)
Results: 10/10 adapters passed
```

