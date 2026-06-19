# Multi-Repo Learning Examples

Multi-repo learning lets teams exchange sanitized lessons between repositories without copying private code, raw logs, secrets, or project-specific data. A source repo exports a compact lesson record; a receiving repo reviews it for privacy and relevance; then maintainers can keep it as an imported lesson or promote it into a golden example.

## Cross-repo lesson exchange

1. **Capture a local lesson** after a fix, audit, quality-gate failure, or repeated review finding.
2. **Sanitize the lesson** so it describes the reusable pattern, not private implementation details.
3. **Export the lesson** as JSON with metadata that helps another repo judge fit: source scope, tags, confidence, expiry, and whether it has been verified beyond the source repo.
4. **Import into another repo** only after privacy review and relevance review.
5. **Promote to a golden example** when the receiving repo can turn the lesson into a safe, concrete pattern with validation evidence.

## What should be shared

Good cross-repo lessons are:

- Pattern-level: describe a repeatable mistake, fix, or prevention rule.
- Sanitized: use synthetic names, generic paths, and summarized evidence.
- Actionable: include the check, test, prompt instruction, or workflow guard that prevents recurrence.
- Scoped: mark whether the lesson is global, language-specific, framework-specific, or repo-local.
- Time-bounded when appropriate: add an expiry date for lessons tied to unstable tools, dependencies, or model behavior.

Do not share:

- Secrets, credentials, tokens, private keys, or certificates.
- Private user data or customer data.
- Internal hostnames, private URLs, proprietary identifiers, or raw stack traces that reveal internals.
- Large copied source snippets or third-party material without license review.
- Repo-local workarounds that cannot safely generalize.

## Files in this example

- [`exported-lesson-sample.json`](exported-lesson-sample.json) — safe sample export payload.
- [`import-workflow.md`](import-workflow.md) — step-by-step import, privacy review, and golden-example promotion workflow.
- [`../../templates/golden-example-entry.md`](../../templates/golden-example-entry.md) — reusable template for documenting promoted cross-repo examples.

## Suggested review gates

Before accepting a cross-repo lesson, require:

- Privacy review completed and recorded.
- Source and target repo scopes identified.
- Evidence summarized without raw sensitive content.
- Maintainer decision: reject, import as lesson, or promote to golden example.
- Validation plan recorded if the lesson changes checklists, prompts, tests, or quality gates.
