# Model Weakness Log

Track confirmed, repeatable model failure patterns by model type. Use this as a fillable project-local template, not as a place for raw transcripts.

## Privacy and redaction rules

- Do not record secrets, credentials, tokens, private keys, customer data, private URLs, internal hostnames, or sensitive raw logs.
- Keep examples synthetic or heavily summarized. Replace sensitive values with placeholders such as `<redacted-token>` or `<private-file-path>`.
- Record only the minimum evidence needed to recognize and prevent the weakness.
- Prune entries when model updates or local guardrails make them obsolete.

## Log

| Model | Pattern Category | Sanitized Example | Prevention Check | Evidence / Source | Last Seen | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `<model-or-provider>` | `<failure-pattern>` | `<sanitized summary of what went wrong; no private data>` | `<specific check to run before/during review>` | `<issue/review/test reference, sanitized>` | `YYYY-MM-DD` | `active | under-review | archived` |

## How to update

1. Add a row only after a confirmed incident or repeated near-miss.
2. Keep the example short, synthetic, and privacy-safe; never paste raw proprietary code, logs, prompts, API keys, or user data.
3. Write the prevention check as an action the agent can verify, not a vague reminder.
4. If the pattern stops reproducing after a model update or guardrail change, mark it `under-review`, then move it to an archived copy or remove it after review.
5. Review at least quarterly: merge duplicates, remove stale entries, and promote recurring high-impact patterns into stronger checklists.
