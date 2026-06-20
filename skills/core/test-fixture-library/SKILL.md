---
name: test-fixture-library
version: 1.0.0
introduced_in: v2.14.0
last_reviewed: 2026-06-20
category: core
tags: [testing, fixtures, declarative, reusable, json]
description: Reusable test fixtures in tests/fixtures/*.json with declarative schema. Generated test cases feed into injection counters, redactor, and validation gates.
---

# Skill: Test Fixture Library

## Purpose

Centralize test data as JSON files in `tests/fixtures/` so security and validation tests share input corpora, can be regenerated from a single source of truth, and are easy to extend without editing test scripts.

The fixture library solves three problems:
1. **Test duplication** — same input string repeated across multiple test files
2. **Hard-coded inputs in scripts** — making test changes require editing source
3. **No separation between data and assertions** — coupling inputs to assertion logic

## When to use

- Adding new test cases to the security regression suite
- Extending the redactor test corpus
- Building new validation gates that need fixture data
- Documenting known-bad inputs (canary corpus)
- Sharing test data across CLI + web UI tests

Do NOT use for:
- Ad-hoc one-off debugging (write inline)
- Tests that depend on filesystem state (use temp dirs)
- Performance benchmarks (use synthetic data generators)

## Inputs

- A test scenario (e.g. "AWS key in postTool mode")
- Expected behavior (detect? redact? warn? allow?)
- Optional: severity, mode, allowlist reference

## Workflow

1. **Choose the fixture type** — `injection`, `redactor`, `validation`, or a new type
2. **Create or extend** `tests/fixtures/<type>-test-cases.json` with new entries
3. **Validate** with `node scripts/test-fixture-library.mjs validate`
4. **Generate tests** with `inject-tests` or `redact-tests` to JSON
5. **Consume** the generated JSON from your test runner (e.g. via `JSON.parse`)
6. **Run the suite** — your test will pick up the new case automatically

### Example: Add a new redactor test case

```bash
cat >> tests/fixtures/redactor-test-cases.json << EOF
,{"id": "redact-006", "input": "ghp_NEWKEYHERE1234567890abc", "should_redact": true, "mode": "postPublish"}
EOF

node scripts/test-fixture-library.mjs validate
```

### Example: Generate injection tests for a CI runner

```bash
node scripts/test-fixture-library.mjs inject-tests > /tmp/inject-tests.json
node -e "const cases = require('/tmp/inject-tests.json'); console.log(cases.length + ' cases loaded');"
```

### Example: List available fixtures

```bash
node scripts/test-fixture-library.mjs list
```

## Outputs

- Validated JSON fixture files in `tests/fixtures/`
- Generated test case arrays for use in test runners
- CI-friendly exit codes (0 = valid, 1 = errors)
- Optional: auto-discovery of new fixture files via directory listing

## Failure modes

1. **Missing `name` field** — fixture won't be loadable; validator exits 1
2. **Case missing `id`** — can't reference individual cases; validator exits 1
3. **Empty input strings** — some tests require non-empty input; validate input per use case
4. **Schema drift** — when extending fixtures, ensure all consumers handle new fields
5. **Stale fixtures** — fixtures should be reviewed quarterly; deleted test cases may break consumers
6. **Sensitive data in fixtures** — fixture files are committed to git; use placeholders not real secrets

## Verification checklist

- [ ] Fixture file has `name`, `type`, `version`, `description`, `cases[]`
- [ ] Every case has unique `id` and required `input` field
- [ ] `node scripts/test-fixture-library.mjs validate` exits 0
- [ ] At least one consumer (test script, gate) reads from this fixture
- [ ] No real secrets — use allowlisted examples (AKIA_EXAMPLE_PLACEHOLDER, sk_test_PLACEHOLDER)
- [ ] Schema documented in fixture comment header
- [ ] PR adds both fixture entries AND consumer updates together

## Cross-references

- See `templates/test-fixture-template.json` — JSON template for new fixture files

- See `tests/security/regression.mjs` — primary consumer of injection fixtures
- See `scripts/validate-redact.mjs` — primary consumer of redactor fixtures
- See `security/defense/patterns/canary-corpus.v1.json` — canonical injection corpus
- See `skills/core/docs-author/SKILL.md` — for documenting new fixture types

## Review cadence

- Quarterly: audit all fixtures for staleness, sensitivity, coverage
- On new fixture type: extend `loadFixtures()` and add to `validate` action
- On retire: mark obsolete cases with `"deprecated": true` field rather than deleting
