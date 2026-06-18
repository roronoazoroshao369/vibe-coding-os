---
description: "Run the Database Migration Quality Checklist on a schema change or migration."
---

# vibe-quality-db-migration

## Purpose

Run the database migration quality checklist against a pull request or commit that adds or alters a database migration. This validates the migration for backwards compatibility, rollback plan, data integrity, index coverage, NOT NULL defaults, transactional safety, dry-run readiness, and zero-downtime compatibility.

## When to use

Use when a PR or commit contains a migration file, a schema change (add/alter/drop column, table, index, enum), a data backfill, or any SQL that runs as part of deployment. Backs `skills/checklists/db-migration-quality/SKILL.md`.

## Required inputs

- The migration file(s) — both up (forward) and down (rollback)
- Current schema snapshot for related tables
- Data volume estimates for affected tables (row counts, write load)
- Deployment strategy (rolling, blue/green, or maintenance window)
- Query patterns the migration supports (new SELECTs, JOINs, WHERE clauses)

## Step-by-step behaviour

1. Confirm which migration files are included and whether a down migration exists.
2. Load the migration diff and current schema for related tables.
3. Run each quality dimension from the checklist:
   - Backwards compatibility (no breaking changes without deprecation window)
   - Rollback plan (down migration exists, correctly reverses schema and data)
   - Data integrity (foreign keys, constraints, triggers valid for existing rows)
   - Index coverage (new query patterns have an index, no full-table scans on large tables)
   - NOT NULL with default (new NOT NULL columns have defaults or a multi-step pattern)
   - Transactional safety (migration wrapped in a transaction where DDL transactions are supported)
   - Dry-run readiness (tested against staging or production copy)
   - Zero-downtime compatibility (additive-only patterns, no long locks)
4. For each dimension, record a pass/fail with evidence or a finding marker (`[Missing]`, `[Risky]`, `[Breaking]`, `[Assumption]`).
5. Merge near-duplicate findings.
6. Output a completed checklist with per-item status and a remediation section for any failures.

## Outputs

A completed database migration quality checklist with item-level pass/fail, traceability markers, and a summary of required fixes before merge.

## Stopping conditions

Stop and ask when no migration file is identifiable, when the current schema snapshot is unavailable and cannot be inferred, or when data volume estimates are unknown and critical for assessing lock risk or index necessity.

## Verification checklist

- [ ] Backwards compatible — no column drops/renames/type changes without deprecation window.
- [ ] Rollback migration exists and correctly reverses schema and data.
- [ ] Data integrity preserved (foreign keys, constraints valid).
- [ ] New query patterns covered by an index.
- [ ] New NOT NULL columns have a default or multi-step pattern.
- [ ] Migration runs inside a transaction (where supported).
- [ ] Migration tested against staging or production data copy (dry-run).
- [ ] Zero-downtime: additive-only patterns, no long locks or blocking queries.

## Related skills/commands

- `skills/checklists/db-migration-quality/SKILL.md`
- `skills/core/test-driven-development/SKILL.md`
- `commands/vibe-plan.md`
- `commands/vibe-review.md`

## Handoffs / next-step suggestion

- Failures in the migration → update the migration files or add a rollback plan, then re-run.
- All items pass → proceed with `commands/vibe-request-review.md` or merge preparation.

## Ghi chú tiếng Việt

Chạy checklist chất lượng migration: kiểm tra tương thích ngược, kế hoạch rollback, toàn vẹn dữ liệu, index, NOT NULL với default, giao dịch an toàn, dry-run, và zero-downtime. Gắn nhãn pass/fail cho từng mục, xuất bảng kết quả kèm hướng khắc phục. Dừng và hỏi nếu không tìm thấy file migration hoặc không biết schema hiện tại.
