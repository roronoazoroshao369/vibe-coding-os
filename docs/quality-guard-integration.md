# Quality Guard Integration

Quality guards are the repository checks that turn Vibe Coding OS quality practices into repeatable pull-request evidence. Use them as CI checks, PR artifacts, and reviewer prompts.

## Guard layers

- **Blocking validation:** `npm run validate:all` is the primary PR guard. It runs the full repository validation suite and should fail the CI job on any failed gate.
- **Structured reporting:** the Quality Engine (`scripts/quality-engine.mjs`) selects and runs quality gates by profile and task type, then produces JSON suitable for a markdown report.
- **Trend telemetry:** quality telemetry scripts can emit redacted metadata from engine runs so teams can review pass rates, recurring warnings, and gate health over time.

## Recommended PR check sequence

1. **Install and restore cache** using the repository's normal Node.js setup.
2. **Run the blocking guard:**

```bash
npm run validate:all
```

3. **Generate a Quality Engine report** for reviewer context:

```bash
node scripts/quality-engine.mjs --profile=standard --task-type=unknown --output-json > quality-engine-report.json
node scripts/quality-engine-report.mjs --output-json=quality-engine-report.json > ci-quality-summary.md
```

4. **Upload or paste artifacts:** attach `quality-engine-report.json` and `ci-quality-summary.md` to the CI run, or paste the markdown summary into the pull request.
5. **Emit telemetry only when opted in:**

```bash
node scripts/quality-telemetry.mjs \
  --engine quality-engine-report.json \
  --profile standard \
  --task-type unknown
```

## Choosing a Quality Engine profile

- `lean`: docs-only changes, typo fixes, or small low-risk edits where quick signal is enough.
- `standard`: normal feature, bugfix, refactor, and documentation work. This is the recommended default for PRs.
- `heavy`: release branches, broad refactors, public API changes, auth/security work, data migrations, or changes with unclear blast radius.

The profile choice should be visible in the PR summary. If a risky change uses `lean`, reviewers should ask why.

## Pass/fail policy

- `validate:all` failure: block merge until fixed or explicitly waived by maintainers.
- Quality Engine `fail`: block merge unless the failing gate is known flaky and has a tracked follow-up.
- Quality Engine `warn`: review before merge; convert to a fix, documented deferral, or issue.
- Quality Engine `skip`: acceptable only when explained by profile choice, task type, platform limits, or an intentional repository policy.
- Telemetry failure: should not block merge unless telemetry is part of the repository's explicit release policy.

## Telemetry and privacy

Telemetry is for local trend analysis, not for collecting raw task content. Events should contain metadata such as gate id, status, duration, model id, task type, profile, and evidence hash. Do not store raw prompts, private logs, secrets, source snippets, or personal data in telemetry artifacts.

Use telemetry to answer questions such as:

- Which gates fail most often?
- Are warnings increasing over time?
- Do certain task types need heavier default profiles?
- Are CI checks becoming too slow or too noisy?

## PR summary template

```md
## Quality guard summary

- validate:all: PASS/FAIL, link to CI job
- Quality Engine profile: lean/standard/heavy
- Task type: feature/bugfix/refactor/docs/security/unknown
- Gates: N/N pass, warnings, failures, skips
- Telemetry: emitted/not emitted, reason
- Reviewer action: approve/request changes/investigate warnings
```

## Example assets

- CI/CD setup example: [`examples/cicd-integration/README.md`](../examples/cicd-integration/README.md)
- Filled 26/26 sample summary: [`examples/cicd-integration/ci-quality-summary-sample.md`](../examples/cicd-integration/ci-quality-summary-sample.md)
- Quality Engine guide: [`quality-engine-guide.md`](quality-engine-guide.md)
- Quality Telemetry guide: [`quality-telemetry-guide.md`](quality-telemetry-guide.md)
- Quality Shield guide: [`quality-shield.md`](quality-shield.md)
