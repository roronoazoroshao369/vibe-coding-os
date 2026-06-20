---
name: db-migration-quality
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: checklists
tags:
  - checklists
  - quality
status: stable
---

# Database Migration Quality Checklist

## Purpose

Validate the quality of any database schema change, new migration, or data backfill before merge. This checklist ensures migrations are safe, reversible, performant, and maintain data integrity — especially in production with zero-downtime requirements.

## When to use

Use whenever a pull request or commit contains a database migration file, a schema change (add/alter/drop column, table, index, constraint, enum), a data backfill script, or a SQL query that runs as part of deployment. Compose with `skills/core/test-driven-development/SKILL.md` and `skills/core/acceptance-criteria/SKILL.md`.

## Inputs

- Migration diff (the SQL or ORM migration file)
- Current schema snapshot and related table definitions
- Query patterns the migration supports or changes (new SELECTs, JOINs, WHERE clauses)
- Rollback migration (down migration)
- Deployment and zero-downtime strategy for the project
- Data volume estimates for affected tables

## Core principle: the migration must be safe to apply and safe to reverse

Every checklist item asks whether the migration is backwards-compatible, reversible, non-destructive under load, and correct for the data it touches. A migration that cannot be rolled back without data loss or that blocks reads/writes in production is a blocker.

## Quality dimensions

Group checklist items by these dimensions:

- **Backwards Compatibility** — does the change break existing queries, views, or application code without a deprecation window?
- **Rollback Plan** — does a down migration exist, and does it restore both schema and data correctly?
- **Data Integrity** — do constraints, foreign keys, and triggers preserve referential integrity?
- **Index Coverage** — are new query patterns covered by appropriate indexes?
- **NOT NULL with Default** — are new NOT NULL columns added with a default value so existing rows are valid?
- **Transactional Safety** — is the migration wrapped in a transaction where the engine supports it?
- **Dry-Run Readiness** — can the migration be tested against a staging copy or a dry-run mode?
- **Zero-Downtime** — does the migration avoid long locks, table rewrites, or queries that block reads/writes?

## Workflow

1. Confirm intent. Ask about deployment strategy (rolling vs blue/green vs downtime), data volume for affected tables, and whether the migration has been tested against a staging database.
2. Load the migration file(s) — both up and down — and the current schema for related tables.
3. Run each checklist item as a question about migration safety. Tag findings with a dimension and a traceability marker (file/line or `[Missing]` / `[Risky]` / `[Breaking]` / `[Assumption]`).
4. Group findings under the quality dimension headings above.
5. Merge near-duplicates.
6. Output the checklist with pass/fail status per item.
7. Record resolved findings — either by updating the migration, adding a rollback script, or documenting an explicit exception.

## Outputs

A completed database migration quality checklist with item-level pass/fail, a summary of findings, and any remediation steps required before merge.

## Failure modes

- Adding a NOT NULL column without a default value, breaking existing rows.
- Dropping or renaming a column without a deprecation window for downstream consumers.
- Running a migration outside a transaction (on engines that support DDL transactions) and leaving the schema in a partial state on failure.
- Skipping the rollback (down) migration — every up migration must be reversible.
- Not adding an index for a new query pattern, causing full-table scans at production scale.
- Assuming zero-downtime without confirming that the migration uses additive-only patterns and avoids long locks.
- Running a backfill that conflicts with concurrent writes.
- Using `password`, `secret`, `token`, `credential`, or `api_key` as a column name without scrubbing output in logs or error messages.

## Verification checklist

- [ ] The migration is backwards compatible: no column drops, renames, or type changes without a documented deprecation window.
- [ ] A rollback (down) migration exists and correctly reverses both schema and data changes.
- [ ] Data integrity is preserved: foreign keys, unique constraints, and NOT NULL constraints are valid for all existing rows.
- [ ] New query patterns (WHERE, JOIN, ORDER BY clauses) are covered by an index; no full-table scan is introduced on large tables.
- [ ] Any new NOT NULL column has a default value or a multi-step migration pattern (add nullable, backfill, add NOT NULL).
- [ ] The migration runs inside a transaction (DDL transaction where supported) so a partial failure does not leave the schema inconsistent.
- [ ] The migration has been tested against a staging or copy of production data (dry-run test) before deployment.
- [ ] Zero-downtime ideal: the migration uses additive-only patterns (add column/index, then backfill, then drop in a later release) and avoids long table locks or blocking queries.
