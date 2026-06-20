# ADR 0004 — Adaptive Trust Levels (Per-Source Risk Scoring)

**Status:** Accepted
**Date:** 2026-06-20
**Deciders:** Security & Trust Council, Maintainer @musashishao
**Relates to:** ADR 0003 (Defense in Depth), ADR 0002 (Runtime Scope Freeze)

## Context

v2.14.0 đã ship Defense in Depth 3 lớp:

- Layer 1 DETECT: `injection-counters.mjs` (19 OWASP LLM01 patterns, 97.37% coverage)
- Layer 2 CONTAIN: `redactor.mjs` (30 secret patterns, 3 modes)
- Layer 3 RECOVER: regression test suite (51 cases, 3 modes)
- 5/6 Claude Code hooks wired to v2.14.0 redactor/defense

Tuy nhiên, ba gap còn tồn tại trong v2.15.0 review:

1. **Sandbox-marker gate is honest only because no skill declares `external_content: true`.** Heuristic detection finds 12 candidates that mention `WebFetch`, `marketplace`, or `CLAUDE.md` reads, but they have no frontmatter, so the gate can't enforce. New skills can silently add external content without a marker.
2. **Bypass rate-limit detection chưa tồn tại.** Same secret pattern tried in 3+ different encodings (base64, split, alternate API) — currently each is a single redactor hit, no loop detection, no escalation.
3. **License surface chỉ có trong `validate-licenses.mjs` cho marketplace content.** Skill/command/template internal licenses are not surfaced in the security output stream, so a maintainer can't see at a glance which MIT vs GPL items are in scope.

## Decision

Áp dụng **Adaptive Trust Levels** pattern cho mọi external content source trong v2.15.0+:

```
┌──────────────────────────────────────────────────────────┐
│ Layer 0 — TRUST SCORING (v2.15.0, new)                  │
│  - 3 trust classes: trusted, read-only, isolated         │
│  - Per-source: skill, URL, marketplace, user-prompt     │
│  - Heuristic detection (12 patterns) + declared block   │
│  - Bypass loop detection (3+ attempts / 10 min window)  │
│  - License class in security output (5 classes)         │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ Layer 1 — DETECT  (v2.14.0, unchanged)                   │
│  - 19 OWASP LLM01 patterns via injection-counters.mjs   │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ Layer 2 — CONTAIN  (v2.14.0, unchanged)                  │
│  - 30 secret patterns via redactor.mjs (3 modes)        │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ Layer 3 — RECOVER  (v2.14.0, unchanged)                  │
│  - 51 regression cases (17 patterns × 3 modes)          │
└──────────────────────────────────────────────────────────┘
```

### Trust classes (3 levels)

| Level        | Definition                                                            | Required marker                                      |
|--------------|-----------------------------------------------------------------------|------------------------------------------------------|
| `trusted`    | Loads only files within this repo, no network, no exec                | `sandbox.level: trusted`                             |
| `read-only`  | Fetches docs from allowlisted domains, reads files                    | `sandbox.level: read-only` + `content_sources: [...]` |
| `isolated`   | Loads third-party marketplace content                                 | `sandbox.level: isolated` + `content_sources: [...]` + `isolation: ...` |

### Heuristic detection (advisory)

`scripts/validate-sandbox-marker.mjs` scans 12 pattern types: `WebFetch`, `fetch()`, `http.get`, `axios`, `requests`, `marketplace`, `https?://`, `CLAUDE.md`, `pip install`, `npm install -g`, `curl`. Matches are WARN (not FAIL) when no frontmatter declaration exists; HARD FAIL when `external_content: true` is declared without `sandbox:` block.

### Bypass loop detection

`commands/vibe-bypass-detect.md` groups session audit events by source. Threshold: ≥3 attempts of the same pattern in a 10-minute window. Classification: `redactor-bypass`, `injection-bypass`, `hook-bypass`, `tool-bypass`. Counter-action: `log-only` (default), `escalate-to-human` (repeat), `lock-source` (high-confidence).

### License surface in security output

`commands/vibe-license-surface.md` aggregates license metadata into 5 classes: `permissive` (MIT, BSD, Apache-2.0, ISC), `copyleft-weak` (LGPL, MPL, EPL), `copyleft-strong` (GPL, AGPL), `proprietary`, `unknown`. Reports written to `docs/security/license-reports/<date>-<scope>.<format>`.

## Consequences

### Positive

- **Honest enforcement**: sandbox gate has heuristic backing, not just opt-in declaration.
- **Bypass loop visible**: 3+ same-pattern attempts trigger escalation instead of silent acceptance.
- **License compliance**: SOC 2 / ISO 27001 / GDPR Article 30 evidence can be auto-generated.

### Negative

- **12 heuristic warnings** at adoption. Each one is a maintainer decision: declare external_content or add a `trusted` marker. No silent compliance.
- **Bypass-detect output is advisory** by default (log-only). Need a separate config knob to make it blocking. v2.16.0 candidate.
- **License-surface requires SPDX discipline.** New skills must include `license:` in frontmatter. Enforced in v2.15.0 (Wave B).

### Neutral

- Adds 3 new commands (`vibe-bypass-detect`, `vibe-adversarial-detect`, `vibe-license-surface`).
- Adds heuristic scanner to `validate-sandbox-marker.mjs` (no new file).
- Hook coverage matrix test (`tests/hooks/hook-coverage-matrix.test.mjs`) locks in the v2.14.0 wiring.

## Compliance matrix

| Control                         | v2.13.0 | v2.14.0 | v2.15.0 |
|---------------------------------|---------|---------|---------|
| Sandbox marker (declared)       | ✗       | ✓       | ✓       |
| Sandbox marker (heuristic)      | ✗       | ✗       | ✓       |
| Bypass loop detection           | ✗       | ✗       | ✓       |
| License surface in security out | ✗       | ✗       | ✓       |
| OWASP LLM01 detection           | ✗       | ✓       | ✓       |
| 30-pattern redactor             | partial | ✓       | ✓       |
| 5/6 hooks wired                 | ✗       | ✗       | ✓       |
| Regression suite                | ✗       | ✓       | ✓       |

## References

- `skills/core/sandbox-marker/SKILL.md` — convention spec
- `scripts/validate-sandbox-marker.mjs` — heuristic + hard gate
- `commands/vibe-bypass-detect.md` — loop detection command
- `commands/vibe-adversarial-detect.md` — adversarial scan command
- `commands/vibe-license-surface.md` — license aggregation command
- `security/redact/redactor.mjs` — Layer 2 CONTAIN
- `security/defense/injection-counters.mjs` — Layer 1 DETECT
- `tests/hooks/hook-coverage-matrix.test.mjs` — wiring lock-in
- ADR 0003 — Defense in Depth (parent architecture)
- ADR 0002 — Runtime Scope Freeze (constraint)
