# CI/CD Integration Example

This example shows how to wire Vibe Coding OS quality checks into a pull-request pipeline while keeping the system markdown-first and repository-local.

## What this setup covers

- Run the full repository guard with `npm run validate:all`.
- Optionally run the Quality Engine for a structured gate report.
- Optionally emit local quality telemetry from the engine output.
- Publish a concise PR quality summary reviewers can scan before merge.

## Recommended PR workflow

1. Install dependencies with the package manager used by the repository.
2. Run the full validation suite:

```bash
npm run validate:all
```

3. Run the Quality Engine when you want a structured report:

```bash
node scripts/quality-engine.mjs --profile=standard --task-type=feature --output-json > quality-engine-report.json
node scripts/quality-engine-report.mjs --output-json=quality-engine-report.json > ci-quality-summary.md
```

4. Emit telemetry only when the repository has opted in to local telemetry storage:

```bash
node scripts/quality-telemetry.mjs \
  --engine quality-engine-report.json \
  --task-type feature \
  --profile standard
```

5. Attach or paste the generated quality summary into the pull request.

See [`ci-quality-summary-sample.md`](ci-quality-summary-sample.md) for a filled example where all 26 `validate:all` gates pass.

## GitHub Actions sketch

```yaml
name: Quality Guards

on:
  pull_request:
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - name: Full validation guard
        run: npm run validate:all
      - name: Quality Engine report
        run: |
          node scripts/quality-engine.mjs --profile=standard --task-type=unknown --output-json > quality-engine-report.json
          node scripts/quality-engine-report.mjs --output-json=quality-engine-report.json > ci-quality-summary.md
      - name: Upload quality summary
        uses: actions/upload-artifact@v4
        with:
          name: ci-quality-summary
          path: |
            quality-engine-report.json
            ci-quality-summary.md
```

## Required vs optional gates

- **Required for PR merge:** `npm run validate:all` should be the blocking check for this repository.
- **Recommended for reviewer context:** Quality Engine markdown reports make gate outcomes easier to review.
- **Optional and local:** telemetry is useful for trends, but should be enabled only with explicit repository policy because it writes local metrics artifacts.

## Reviewer checklist

- `validate:all` result is present and passing.
- Quality Engine profile matches the risk of the change (`lean`, `standard`, or `heavy`).
- Any warnings, skips, or failures have an owner and disposition.
- Telemetry, if emitted, stores only redacted metadata and no raw prompts, secrets, logs, or source snippets.

## Related documentation

- [`docs/quality-guard-integration.md`](../../docs/quality-guard-integration.md)
- [`docs/quality-engine-guide.md`](../../docs/quality-engine-guide.md)
- [`docs/quality-telemetry-guide.md`](../../docs/quality-telemetry-guide.md)
- [`docs/quality-shield.md`](../../docs/quality-shield.md)
