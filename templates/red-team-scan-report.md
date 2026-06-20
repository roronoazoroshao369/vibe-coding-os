---
scan_id: scan-{{timestamp}}
scanner_version: 1.0.0
target: {{target_system}}
scan_type: {{scan_type}}
executed_by: {{scanner_name}}
execution_date: {{iso_date}}
classification: internal
---

# Red Team Scan Report

## Summary

| Metric | Value |
|--------|-------|
| Total patterns checked | 20 |
| Patterns matched | {{match_count}} |
| Critical findings | {{critical_count}} |
| High findings | {{high_count}} |
| Medium findings | {{medium_count}} |
| Low findings | {{low_count}} |
| Risk score | {{risk_score}}/10 |
| Recommendation | {{recommendation}} |

## Scan Target

- **System**: {{target_system}}
- **Endpoint**: {{target_endpoint}}
- **Model**: {{model_name}}
- **Last tested**: {{last_tested_date}}

## Risk Assessment

{{risk_narrative}}

## Findings

### Critical ({{critical_count}})

| ID | Pattern | Category | Evidence | Recommendation |
|----|---------|----------|----------|----------------|
{{critical_findings_table}}

### High ({{high_count}})

| ID | Pattern | Category | Evidence | Recommendation |
|----|---------|----------|----------|----------------|
{{high_findings_table}}

### Medium ({{medium_count}})

| ID | Pattern | Category | Evidence | Recommendation |
|----|---------|----------|----------|----------------|
{{medium_findings_table}}

### Low ({{low_count}})

| ID | Pattern | Category | Evidence | Recommendation |
|----|---------|----------|----------|----------------|
{{low_findings_table}}

## OWASP Coverage

| OWASP Category | Findings | Status |
|----------------|----------|--------|
| LLM01: Prompt Injection | {{llm01_count}} | {{llm01_status}} |
| LLM02: Sensitive Information Disclosure | {{llm02_count}} | {{llm02_status}} |
| LLM04: Model DoS | {{llm04_count}} | {{llm04_status}} |
| LLM05: Supply Chain | {{llm05_count}} | {{llm05_status}} |
| LLM06: Excessive Agency | {{llm06_count}} | {{llm06_status}} |
| LLM07: System Prompt Leakage | {{llm07_count}} | {{llm07_status}} |
| LLM09: Misinformation | {{llm09_count}} | {{llm09_status}} |

## Recommended Bypass-Prevention Techniques

If prompt injection findings exist, integrate these techniques from `registry/cipher-attack-detection.json` and `skills/core/guard-bypass-protocol/SKILL.md`:

{{recommended_techniques}}

## Remediation Plan

### Immediate (Critical findings)

{{immediate_remediation}}

### Short-term (High findings)

{{short_term_remediation}}

### Long-term (Medium/Low findings)

{{long_term_remediation}}

## Re-scan Schedule

- **Next scheduled scan**: {{next_scan_date}}
- **Cadence**: {{scan_cadence}}
- **Trigger conditions**: {{rescan_triggers}}

## Audit Trail

- **Scan initiated by**: {{initiated_by}}
- **Authorization**: {{authorization_ref}}
- **Retention**: 30 days, then archive
- **Access control**: {{access_list}}

## References

- Pattern catalog: `registry/scanner-patterns.json`
- Cipher detection: `registry/cipher-attack-detection.json`
- Bypass protocol: `skills/core/guard-bypass-protocol/SKILL.md`
- Inspired by: Tencent/AI-Infra-Guard (3.9k stars)
- OWASP Top 10 for LLM Applications
