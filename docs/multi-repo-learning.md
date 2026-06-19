# Multi-Repo Learning — Canonical Guide

> Version 2.3 · Part of the Vibe Coding OS lesson exchange system

Multi-repo learning lets teams exchange sanitized lessons between repositories without copying private code, raw logs, secrets, or project-specific data. A source repo exports a compact, privacy-reviewed lesson record; a receiving repo validates it, reviews for relevance, and can import it as a local lesson or promote it into a golden example.

---

## Table of Contents

- [Overview and principles](#overview-and-principles)
- [Schema: lesson-exchange-schema.json](#schema)
- [Export workflow](#export-workflow)
- [Import workflow](#import-workflow)
- [Privacy-level system](#privacy-level-system)
- [Import/export CLI reference](#cli-reference)
- [Golden examples](#golden-examples)
- [Verification checklist](#verification-checklist)

---

## Overview and principles

A cross-repo lesson is a **sanitized, self-contained record** of:

- What **root cause** pattern led to a failure or review finding.
- What **fix pattern** resolved it (safe for adaptation by another repo).
- What **prevention rule** would stop recurrence (checklist item, test, quality gate, prompt instruction).

**Key principles:**

1. **Pattern-level, not blame.** Describe the mistaken assumption or workflow gap, not who made it.
2. **Sanitized.** Use synthetic names, generic paths, summarized evidence. No secrets, credentials, tokens, private keys, certificates, customer data, internal hostnames, private URLs, or raw stack traces.
3. **Actionable.** Include a specific prevention rule that another team can apply.
4. **Scoped.** Tag the lesson with area, language, framework, severity, and privacy level.
5. **Time-bounded when appropriate.** Lessons tied to unstable tools, dependencies, or model behavior may expire.

---

## <a name="schema"></a>Schema: lesson-exchange-schema.json

Every exchange payload must conform to `schemas/lesson-exchange-schema.json` (JSON Schema draft-07).

### Required fields

| Field | Type | Max length | Description |
|---|---|---|---|
| `lesson_id` | string | 120 | Unique, non-secret identifier (regex: `^[a-zA-Z0-9._:-]+$`) |
| `source_repo` | string | 160 | Sanitized source repo identifier |
| `timestamp` | string (ISO 8601) | — | When the lesson was captured or exported |
| `area` | string | 120 | Subsystem, language, framework, or feature area |
| `severity` | string (enum) | — | One of `low`, `medium`, `high`, `critical` |
| `root_cause` | string | 2000 | Reusable root-cause pattern |
| `fix_pattern` | string | 2000 | Generalized fix that another repo can adapt |
| `prevention_rule` | string | 2000 | Checklist item, test, gate, or guard |
| `tags` | array of strings | — | 1+ lowercase alphanumeric tags, unique |
| `privacy_level` | string (enum) | — | One of `public`, `internal`, `restricted`, `private` |

See `schemas/lesson-exchange-schema.json` for the full schema including regex patterns, descriptions, and constraints.

---

## <a name="privacy-level-system"></a>Privacy-level system

Every exported lesson carries a **privacy_level** that governs how it may be shared:

| Level | Meaning | Sharing boundary |
|---|---|---|
| `public` | Safe to publish publicly. No sensitive data whatsoever. | Public internet, open source repos |
| `internal` | Safe inside the organization but not public. | Organization-internal repos, CI |
| `restricted` | Requires explicit maintainer approval before sharing. | Designated maintainers review |
| `private` | Must never leave the source repo. | Source repo only |

### Privacy review checklist

Before setting a privacy level, verify:

- [ ] No secrets, credentials, tokens, or private keys.
- [ ] No private user data or customer data.
- [ ] No internal hostnames, private URLs, or proprietary identifiers.
- [ ] No raw stack traces revealing internal architecture.
- [ ] No large copied source snippets without license review.
- [ ] No repo-local workarounds that cannot safely generalize.

---

## <a name="export-workflow"></a>Export workflow

### From a markdown lesson template

The template at `templates/lesson-entry-template.md` holds a YAML-front-matter lesson record. To export it as exchange JSON:

```bash
node scripts/lesson-exchange.mjs --export --output docs/lessons/exchange-export.json
```

This parses the template, extracts root cause / fix / prevention rule from the markdown sections, validates the resulting lesson against `lesson-exchange-schema.json`, and writes a JSON batch.

### Via the CLI with --dry-run

To validate without writing:

```bash
node scripts/lesson-exchange.mjs --export --dry-run
```

### Custom template input

```bash
node scripts/lesson-exchange.mjs --export --input /path/to/lesson.md --output out.json
```

---

## <a name="import-workflow"></a>Import workflow

### Basic import

```bash
node scripts/lesson-exchange.mjs --import --input path/to/lesson-exchange.json
```

This validates every lesson in the batch against the schema, then writes sanitized markdown entries to `docs/lessons/imported-lessons.md`.

### Custom output path

```bash
node scripts/lesson-exchange.mjs --import --input lessons.json --output docs/team-lessons.md
```

### Dry run (validate only)

```bash
node scripts/lesson-exchange.mjs --import --input lessons.json --dry-run
```

### Import decision flow

1. **Schema validation** — reject immediately if payload fails schema checks.
2. **Privacy review** — verify the `privacy_level` is acceptable for your repo's policy; reject lessons marked `private` from external sources.
3. **Relevance review** — does the pattern, area, and severity apply to your codebase?
4. **Accept as lesson** — import into your lessons DB or markdown log.
5. **Promote to golden example** (optional) — when the lesson can become a safe, concrete, validated pattern with test evidence.

---

## <a name="cli-reference"></a>Import/export CLI reference

```text
node scripts/lesson-exchange.mjs [options]

Options:
  --export           Export lessons from templates/ as exchange JSON
  --import           Import exchange JSON, validate, write markdown
  --input <path>     Source file (template for export, JSON for import)
  --output <path>    Destination file
  --dry-run          Validate only; do not write files
  --help             Show usage help
```

### Exit codes

| Code | Meaning |
|---|---|
| 0 | Success (or dry-run with no validation errors) |
| 1 | Validation error, missing argument, or I/O error |

---

## <a name="golden-examples"></a>Golden examples

A **golden example** is a lesson that has been promoted beyond its original source: it is fully sanitized, validated, and safe to reuse across any project. Golden examples live in `examples/multi-repo-learning/` or as standalone template documents.

### Promotion criteria

- Privacy review complete and recorded.
- Source and target repo scopes identified.
- Evidence summarized without raw sensitive content.
- Maintainer decision recorded: reject, import, or promote.
- Validation plan exists if the lesson changes checklists, prompts, or quality gates.

---

## <a name="verification-checklist"></a>Verification checklist

- [ ] Schema files are valid JSON (run `node scripts/validate-schemas.mjs`).
- [ ] Traceability is intact (run `node scripts/validate-traceability.mjs`).
- [ ] Export works: `node scripts/lesson-exchange.mjs --export --dry-run` passes.
- [ ] Import validates: `node scripts/lesson-exchange.mjs --import --input templates/lesson-exchange-sample.json --dry-run` passes.
- [ ] Sample file `templates/lesson-exchange-sample.json` contains no real secrets, credentials, or private data.
- [ ] Privacy level is set on every lesson (no default-less export).
- [ ] All required fields from the schema are populated.
- [ ] Golden examples have been privacy-reviewed before promotion.

---

## Related

- `schemas/lesson-exchange-schema.json` — the exchange schema
- `templates/lesson-entry-template.md` — markdown lesson entry template
- `templates/lesson-exchange-sample.json` — safe placeholder example
- `scripts/lesson-exchange.mjs` — import/export CLI
- `examples/multi-repo-learning/README.md` — example exchange workflow walkthrough
- `skills/core/lessons-learned-db/SKILL.md` — local lessons database skill
- `scripts/lesson-exporter.mjs` — low-level exporter for the lessons DB
- `scripts/lesson-importer.mjs` — low-level importer for the lessons DB
