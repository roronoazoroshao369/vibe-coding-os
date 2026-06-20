# ADR 0003 — Defense in Depth (Security Architecture Pattern)

**Status:** Accepted
**Date:** 2026-06-20
**Deciders:** Security & Trust Council, Maintainer @musashishao
**Relates to:** ADR 0002 (Runtime Scope Freeze)

## Context

v2.13.0 đã ship Security Shield gồm:

- `bypass-techniques.json` gated loader (env var `VIBE_ENABLE_OFFENSIVE_TECHNIQUES=1` + `--authorization-ref` arg)
- `.claude/hooks/` default-deny + injection scan + secret scan + audit (6 scripts)
- OWASP A01-A10 + LLM01-LLM10 mapping trong `skills/core/secure-coding-checklist/SKILL.md`
- License policy `validate-licenses.mjs` (inspiration requires permissive)
- Audit log gitignored

Tuy nhiên, ba gap đáng kể còn tồn tại:

1. **Injection defense là checklist, không phải code chạy được.** OWASP LLM01 mapping mô tả "cần phát hiện DAN-style, indirect injection, base64 smuggle" — nhưng chưa có detector thực thi. Maintainer phải đọc checklist rồi tự viết hook, dễ quên pattern mới.
2. **Redaction chỉ có ở 1 layer.** Audit log redact, nhưng post-tool output và post-publish payload chưa qua redactor. Secret có thể lọt qua `cat .env` rồi echo vào tool output, hoặc lọt vào published skill tarball.
3. **Không có regression test.** Một PR sửa `injection-counters.mjs` có thể vô tình vô hiệu hóa 30% corpus coverage — không ai phát hiện cho đến khi production incident.

## Decision

Áp dụng pattern **Defense in Depth 3 lớp** cho mọi security control mới trong v2.14.0+:

```
┌─────────────────────────────────────────────────────────────┐
│ LAYER 1 — DETECT                                            │
│   `security/defense/injection-counters.mjs`                 │
│   Input: raw text từ user / tool output / external content  │
│   Output: { detected: bool, threats: [...], confidence }    │
│   Counter: 47 canary payloads (OWASP LLM01/04/06)           │
├─────────────────────────────────────────────────────────────┤
│ LAYER 2 — CONTAIN                                           │
│   `security/redact/redactor.mjs` (3 pipeline modes)         │
│   postTool: post-tool-use hook                             │
│   postSession: pre-audit-log write                          │
│   postPublish: pre-marketplace upload                       │
│   Pattern set: 30 (AWS, GitHub PAT, JWT, Stripe, OpenAI…)  │
├─────────────────────────────────────────────────────────────┤
│ LAYER 3 — RECOVER                                           │
│   `tests/security/regression.mjs` + CI gate                 │
│   Canary corpus ≥95% phải bị block hoặc warn                │
│   Output: `docs/security/regression-report.md`              │
│   Baseline lưu trong `tests/security/baseline.json`        │
└─────────────────────────────────────────────────────────────┘
```

**Nguyên tắc áp dụng:**

- Mỗi layer phải là **pure ESM `.mjs`** có thể import và test độc lập, không phụ thuộc runtime hook.
- Mỗi layer có **validation gate riêng** trong `scripts/validate-all.mjs` (target v2.14.0: +3 gates → 33/33).
- Layer 2 dùng **allowlist + report** chứ không fail cứng → false positive rate < 2% (track qua gate `G_SEC_REDACT`).
- Layer 3 **fail build** nếu coverage giảm so với baseline → bảo vệ layer 1 và 2 khỏi regression ẩn.

## Alternatives Considered

1. **Single layer (chỉ detect).** Rẻ hơn nhưng nếu counter miss thì không có defense phụ. Từ chối — không đạt depth.
2. **Hard-fail redact.** False positive chặn workflow publish hợp lệ sẽ khiến maintainer tắt gate để làm việc yên. Từ chối — dùng allowlist + report.
3. **Skip regression test, dựa vào manual review.** Không scale. Từ chối — CI gate là bắt buộc cho mọi security control.

## Consequences

**Positive:**
- 3 gate mới (`G_SEC_CI_REGRESSION`, `G_SEC_INJ_REGRESSION`, `G_SEC_REDACT`) bảo vệ nhau lẫn nhau
- Counter library + canary corpus tái sử dụng cho v2.15 (redaction feed) và v2.16 (tabletop scenario)
- Redactor engine là dependency cho v2.15 (provenance attestation ký payload) và v2.16 (audit log integrity)

**Negative:**
- +1 maintainer load: phải review PR cập nhật corpus khi pattern injection mới xuất hiện
- False positive rate cần monitor và tune mỗi quý (track trong `docs/lessons/`)
- Canary corpus có thể bị "poisoned" nếu attacker biết pattern → phải rotate mỗi 90 ngày

**Operational:**
- Mỗi PR chạm `security/defense/` hoặc `security/redact/` sẽ chạy regression test, thêm ~12s vào CI
- Reviewer của security-related PR phải check coverage report không giảm

## Implementation Plan (v2.14.0)

| Move | Layer | Files | Gate |
|------|-------|-------|------|
| Injection Counters | 1 | `security/defense/injection-counters.mjs`, `patterns/canary-corpus.v1.json` | `G_SEC_INJ_REGRESSION` |
| Secret Redactor | 2 | `security/redact/redactor.mjs`, `policies/default.json`, `allowlist.json` | `G_SEC_REDACT` |
| CI Regression | 3 | `tests/security/regression.mjs`, `baseline.json`, `.github/workflows/security-regression.yml` | `G_SEC_CI_REGRESSION` |
| Sandbox Marker | Cross-cut | `skills/core/sandbox-marker/SKILL.md`, `templates/sandbox-mark.md` | `G_SANDBOX_MARKER` |

## Review Cadence

- **Quarterly** (mỗi release lớn): review canary corpus, cập nhật pattern mới từ OWASP LLM Top 10 updates
- **Per-incident**: nếu có injection bypass thực tế, thêm payload vào corpus + rotate test
- **Annual**: review scoring model, cân nhắc chuyển sang ML-based detection nếu corpus > 200

## References

- OWASP LLM Top 10 2025 (LLM01 Prompt Injection, LLM04 Data Poisoning, LLM06 Sensitive Info Disclosure)
- NIST SP 800-53 Rev. 5 (Defense-in-Depth pattern)
- CIS Controls v8 (Continuous Validation)
- Vibe Coding OS v2.13.0 Security Shield shipped (commit 409590b)
