---
description: "Detect when an AI session is in a 'bypass-detection' loop, surface rate-limit/guardrail failures, and recommend counter-actions."
---

# Command: Vibe Bypass Detect

## When to use

Invoke when a session has had **3+ guardrail triggers** (refusals, redactor findings, or injection detections) within a short window, or when an AI agent is repeating attempts to access a blocked resource. The command surfaces the loop, summarizes the bypass attempts, and recommends escalation (defer to human, log the pattern, or apply a new policy).

## Required inputs

- Session log (or session ID)
- Trigger threshold (default: 3 attempts)
- Time window (default: 10 minutes)

## Step-by-step behavior

1. Read the session audit log (`docs/security/session-audit/<date>.jsonl`).
2. Filter for `refusals`, `redactor findings`, and `injection detections` events.
3. Group by source (file, URL, command, prompt pattern).
4. Apply trigger threshold: ≥3 events from same source within window = bypass attempt.
5. Classify the attempt:
   - `redactor-bypass`: same secret pattern tried in ≥3 different forms (encoding, split, alternate API)
   - `injection-bypass`: same prompt phrase tried in ≥3 different framings
   - `hook-bypass`: same blocked command tried in ≥3 different forms (alias, encoding, indirect)
   - `tool-bypass`: same denied tool tried via different delegation path
6. Emit a bypass report listing: source, attempt count, sample forms, classification.
7. Recommend counter-action:
   - `escalate-to-human`: route the attempt to a human reviewer
   - `lock-source`: temporarily refuse all requests from that source
   - `log-only`: continue without escalation (default for low-severity)
8. Update `docs/security/security-event-log/<date>.jsonl` with the detected pattern.

## Outputs

- Bypass report at `docs/security/security-event-log/<date>.jsonl`  <!-- injection-allow:safety-bypass -->
- Summary count of bypass attempts per session
- Counter-action recommendation (default: `log-only` for first detection, `escalate-to-human` for repeat)

## Failure modes

1. **No session log** — emit "no audit data" message; do not fabricate findings.
2. **Spurious loop** (3 unrelated refusals) — class as `low-signal`, recommend `log-only`.
3. **High-confidence loop** (same secret, ≥5 forms) — recommend `escalate-to-human`.
4. **Missing time window** — use default 10 minutes.
5. **Self-detection** (the command itself triggers redactor) — exempt the command from its own scan.

## Verification checklist

- [ ] Session log exists and is readable
- [ ] At least one trigger source is identified (if no triggers, command is a no-op)
- [ ] Classification matches the pattern type (redactor/injection/hook/tool)
- [ ] Bypass report is written to dated jsonl file
- [ ] Counter-action recommendation is non-empty and contextually appropriate
- [ ] If `escalate-to-human` is recommended, a summary is sent to the human channel
- [ ] Tested with synthetic session log containing 3+ refused attempts (see `tests/commands/bypass-detect.test.mjs`)

## Examples

### Auto-detected bypass

```yaml
session_id: 2026-06-20-001
attempts:
  - source: tool_input (Edit)
    pattern: aws-access-key
    forms: ["AKIA...", "akia-...", "AKIA+base64:..."]
    count: 4
classification: redactor-bypass
recommendation: escalate-to-human
```

### Low-signal (no action)

```yaml
session_id: 2026-06-20-002
attempts:
  - source: tool_input (Edit)
    pattern: pem-private
    forms: ["-----BEGIN RSA PRIVATE KEY-----"]
    count: 1
classification: single
recommendation: log-only
```
