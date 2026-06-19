# `vibe-lesson-exchange`

> Export, review, and import portable coding lessons across repositories using the v2.3 lesson exchange format.

## Usage

### Export lessons from the current repo

Export all framework-scope lessons with confidence >= 0.7:

```text
/vibe-lesson-exchange export --scope framework --confidence 0.7
```

Export lessons tagged with 'api' and 'validation':

```text
/vibe-lesson-exchange export --tags api,validation
```

### Check local lesson quality

```text
/vibe-lesson-exchange check
```

Reports valid, stale, invalid, and orphaned lessons.

### Import a lesson exchange batch

Dry run first:

```text
/vibe-lesson-exchange import ./exports/example.lesson-exchange.json --dry-run
```

Then import:

```text
/vibe-lesson-exchange import ./exports/example.lesson-exchange.json
```

The importer skips expired lessons and duplicates. A summary of imported, skipped, and rejected lessons is printed.

## Options

| Flag | Description |
|---|---|
| `--scope <scope>` | Filter by scope (repo, framework, cross-project) |
| `--confidence <n>` | Minimum confidence threshold (0.0–1.0) |
| `--tags <tags>` | Comma-separated required tags |
| `--dry-run` | Preview import without writing files |
| `--output-json` | Output results as structured JSON |

## Safety

- Always run `--dry-run` before importing an untrusted batch.
- Inspect exported batches for secrets, customer names, or private URLs before sharing.
- Lesson files are plain JSON — review diffs in code review before merge.

## Related

- `skills/core/multi-repo-learning/SKILL.md` — skill documentation
- `docs/multi-repo-learning.md` — full guide with workflow details
- `schemas/lesson-exchange-format.json` — exchange schema
- `scripts/lesson-exporter.mjs` — export implementation
- `scripts/lesson-importer.mjs` — import implementation
- `scripts/lesson-quality-checker.mjs` — quality checker
