# Security — v2.14.0 Defense in Depth

> Per ADR 0003, this directory implements a 3-layer security pattern.

## Architecture

```
┌──────────────────────────────────────────────┐
│ LAYER 1 — DETECT  (defense/)                 │
│   injection-counters.mjs                     │
├──────────────────────────────────────────────┤
│ LAYER 2 — CONTAIN  (redact/)                 │
│   redactor.mjs (3 pipeline modes)            │
├──────────────────────────────────────────────┤
│ LAYER 3 — RECOVER  (tests/)                  │
│   regression.mjs + CI gate                   │
└──────────────────────────────────────────────┘
```

## Quick Start

```bash
# Test Layer 1
node security/defense/injection-counters.mjs < suspicious.txt

# Test Layer 2
echo "AWS_DEMO_KEY_PLACEHOLDER" | node security/redact/redactor.mjs --mode=postTool

# Run full regression (Layer 3)
node tests/security/regression.mjs
```

## Modules

| Path | Purpose |
|------|---------|
| `defense/injection-counters.mjs` | Layer 1 — pattern-based injection detection |
| `defense/patterns/canary-corpus.v1.json` | 43 known-bad payloads for regression testing |
| `redact/redactor.mjs` | Layer 2 — secret redaction with allowlist |
| `redact/policies/default.json` | 30 secret patterns with severity levels |
| `redact/allowlist.json` | Test fixtures and docs exempted from redaction |
| `sandbox/CONVENTION.md` | Marker convention for skills loading external content |

## Validation Gates

| Gate ID | What it checks | Script |
|---------|----------------|--------|
| `G_SEC_CI_REGRESSION` | Defense coverage ≥95% vs baseline | `tests/security/regression.mjs` |
| `G_SEC_INJ_REGRESSION` | Injection counters flag canary corpus | `scripts/validate-security-regression.mjs` |
| `G_SEC_REDACT` | 30 patterns × 3 modes, 0 leaks | `scripts/validate-redact.mjs` |
| `G_SANDBOX_MARKER` | Skills loading external content have sandbox marker | `scripts/validate-sandbox-marker.mjs` |

## Audit Trail

Load attempts for offensive payloads (`scripts/load-bypass-techniques.mjs`) are logged to:
- `docs/security/bypass-load-attempts.log` (gitignored)
- `docs/security/session-audit/` (gitignored)

## License

All code original. Inspired by:
- OWASP LLM Top 10 2025
- NIST SP 800-53 Rev. 5
- CIS Controls v8
