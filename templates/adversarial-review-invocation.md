---
description: "Template for invoking the vibe-adversarial-review command with full STRIDE walkthrough."
---

# Adversarial Review Invocation Template

## When to fill

When you are about to run `vibe-adversarial-review` on a feature, fill this template first to scope the review.

## Inputs

```yaml
target: <file path or PR URL>
adversary_model: <default: authenticated low-privilege user>
trust_boundaries:
  - <list of trust boundaries>
assets:
  - <list of protected assets>
threat_model: <STRIDE 6-letter lens application>
```

## Walkthrough

1. List the trust boundaries.
2. Enumerate assets per boundary.
3. Identify adversaries.
4. Apply STRIDE per (boundary, asset, adversary) tuple.
5. Write abuse cases alongside use cases.
6. Score mitigations: likelihood × impact.
7. Plan verification.
8. Write report.

## Output

- `docs/security/adversarial-reviews/<date>-<target>.md`
