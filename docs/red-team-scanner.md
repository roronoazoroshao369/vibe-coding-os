# Red Team Scanner — Design Document

> Version: 1.0.0 | Date: 2026-06-20 | Inspired by: Tencent/AI-Infra-Guard (3.9k stars)

## Overview

The **Red Team Scanner** is an automated security assessment tool for AI systems. It runs pattern-based detection against prompts, tool calls, and AI infrastructure to identify vulnerabilities **before** they are exploited.

### Goals

- **Detect**: Identify prompt injection, jailbreak, PII extraction, and infrastructure misconfigurations
- **Score**: Quantify risk on a 0-10 scale
- **Report**: Generate structured reports with remediation guidance
- **Integrate**: Work alongside `guard-bypass-protocol` skill and `/vibe-bypass` command

### Non-Goals

- **NOT a bypass tool**: This scanner does not generate attacks. It detects them.
- **NOT a replacement for human review**: Critical findings always require human validation
- **NOT a runtime enforcement layer**: This is a development-time and periodic-scan tool

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    RED TEAM SCANNER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  Input   │───▶│ Pattern  │───▶│ Severity │───▶│  Report  │  │
│  │ Collector│    │ Matcher  │    │  Scorer  │    │ Generator│  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│        │               │               │               │        │
│        ▼               ▼               ▼               ▼        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  registry/scanner-patterns.json  (20 patterns)           │  │
│  │  registry/cipher-attack-detection.json (15 patterns)     │  │
│  │  OWASP Top 10 for LLM Applications (2025)                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Components

#### 1. Input Collector

Captures scan target metadata:
- AI system endpoint URL
- Model identifier (claude-3.5-sonnet, gpt-4o, gemini-2.0, etc.)
- Configuration (auth, rate limits, tool permissions)
- Test prompt set (user-supplied or generated)

#### 2. Pattern Matcher

Loads `registry/scanner-patterns.json` (20 patterns) + `registry/cipher-attack-detection.json` (15 cipher patterns) and runs them against:
- User input prompts
- Model outputs
- Tool/function call requests
- System prompt (if accessible)
- Infrastructure configuration

#### 3. Severity Scorer

Calculates risk score (0-10) based on findings:

| Severity | Score Weight |
|----------|--------------|
| Critical | +3 per finding |
| High | +2 per finding |
| Medium | +1 per finding |
| Low | +0.5 per finding |

**Risk Bands**:
- **0-2**: Low risk — Continue normal operation
- **3-5**: Medium risk — Schedule remediation within 30 days
- **6-8**: High risk — Block deployment, remediate within 7 days
- **9-10**: Critical risk — Immediate action, take system offline

#### 4. Report Generator

Outputs scan results using `templates/red-team-scan-report.md`:
- Structured findings table by severity
- OWASP coverage matrix
- Recommended bypass-prevention techniques
- Remediation plan (immediate/short-term/long-term)

## Scan Types

### Static Scan (Default)

- Runs without sending requests to the model
- Pattern-matches system prompts, configs, exposed endpoints
- Fast (< 1 second per pattern set)
- Safe to run in CI/CD

### Dynamic Scan (Optional)

- Sends test prompts to the model and observes responses
- More accurate but requires authorization
- Slower (model latency dominates)
- Logs all test interactions for audit

### Hybrid Scan (Recommended)

- Static scan first, then dynamic for ambiguous cases
- Balances speed and accuracy
- Use for pre-deployment validation

## Integration Points

### With `/vibe-bypass` Command

When a bypass attempt is made via `/vibe-bypass`, the scanner runs in **monitor mode** to:
- Track which bypass techniques are tried
- Detect when techniques match known attack patterns
- Alert if attempted bypass is genuinely harmful (not just false positive)

### With `guard-bypass-protocol` Skill

The bypass protocol uses the scanner's pattern catalog to:
- Identify refusal category (multi-category support from TC-013)
- Adapt strategy based on detected category
- Trigger independent review for high-risk categories

### With CI/CD

Add to release pipeline:
```yaml
- name: Red Team Scan
  run: node scripts/scan-red-team.mjs --target . --format json
- name: Block on Critical
  run: |
    SCORE=$(jq '.risk_score' scan-results.json)
    if [ "$SCORE" -ge 9 ]; then
      echo "Critical risk detected. Blocking deployment."
      exit 1
    fi
```

## Pattern Taxonomy (20 patterns)

| Category | Count | Severity Range |
|----------|-------|----------------|
| Prompt Injection | 4 | Critical-High |
| Jailbreak | 3 | Critical-High |
| PII Extraction | 3 | Critical-Medium |
| Hallucination Trigger | 1 | Medium |
| Role-Play Exploit | 1 | High |
| Encoding Attack | 3 | High |
| Agent Manipulation | 2 | Critical |
| MCP Injection | 1 | Critical |
| Skill Poisoning | 1 | High |
| Infra Misconfig | 3 | Critical-Medium |

## Bilingual Section (Tiếng Việt)

**Red Team Scanner** là công cụ quét bảo mật tự động cho hệ thống AI. Nó chạy pattern-based detection để tìm lỗ hổng **trước khi** bị khai thác.

**Các tính năng chính**:
- Phát hiện: prompt injection, jailbreak, PII extraction, misconfiguration
- Chấm điểm: thang 0-10 dựa trên findings
- Báo cáo: structured report với remediation guidance
- Tích hợp: hoạt động cùng `guard-bypass-protocol` skill

**Không phải tool để tấn công**: Scanner này phát hiện lỗ hổng, không tạo ra chúng. Critical findings luôn cần human review.

## Usage Example

```bash
# Static scan on current repo
node scripts/scan-red-team.mjs --target . --format json > scan-results.json

# Dynamic scan with authorization
node scripts/scan-red-team.mjs   --target https://api.example.com/v1/chat   --model claude-3.5-sonnet   --auth-token-file ~/.auth   --dynamic

# Generate human-readable report
node scripts/scan-red-team.mjs   --target .   --report-template templates/red-team-scan-report.md   --output report.md
```

## Security Controls

### Authorization Required

- Dynamic scans require explicit user authorization
- Audit trail records: who, what, when, target
- 30-day retention, then archive

### Rate Limiting

- Max 100 scan requests per hour per user
- Max 10 dynamic scans per day per user
- Cooldown 5 seconds between scans

### Sandboxing

- Test prompts never reach production model
- Isolated test environment recommended
- No real user data in test prompts

## Roadmap

### v1.0 (Current)

- 20 base patterns in `registry/scanner-patterns.json`
- 15 cipher patterns in `registry/cipher-attack-detection.json`
- Static scan mode
- Report template

### v1.1 (Planned)

- Dynamic scan mode
- CI/CD integration examples
- Webhook alerts for critical findings

### v2.0 (Future)

- ML-based pattern detection (beyond regex)
- Continuous monitoring mode
- Multi-model comparison

## References

- **Tencent/AI-Infra-Guard** (3.9k stars) — Full-stack AI Red Teaming platform
- **OWASP Top 10 for LLM Applications** (2025) — Industry-standard taxonomy
- **Microsoft PyRIT** — Open source risk identification toolkit
- **NVIDIA garak** — LLM vulnerability scanner
- `registry/scanner-patterns.json` — Pattern catalog
- `registry/cipher-attack-detection.json` — Cipher-specific patterns
- `templates/red-team-scan-report.md` — Report template
- `skills/core/guard-bypass-protocol/SKILL.md` — Companion skill

## Attribution

This design document and the pattern catalog are synthesized from public sources. No code is vendored. Original architecture by Tencent/AI-Infra-Guard team, OWASP AI Security working group, and Microsoft PyRIT contributors.
