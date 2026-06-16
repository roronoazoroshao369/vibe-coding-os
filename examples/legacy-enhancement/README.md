# Example: Legacy Enhancement Workflow

This example shows how to apply the Brownfield Spec Enhancement workflow to extend an existing legacy feature. It emphasizes documenting current behavior first, pinning it with characterization tests, then making incremental, reversible changes.

## 1. Initial user intent

> The reporting module in `src/reporting/` has been running for two years with no documentation. We need to add CSV export support without breaking existing PDF and email report delivery.

Assumptions to confirm before implementation:

- The reporting module has existing tests (even if minimal) that can serve as starting points.
- CSV export should follow the same data pipeline as existing report formats.
- The change should be backward-compatible — existing PDF and email delivery must continue to work.

## 2. Command/skill order

1. `vibe-init` to inspect repo instructions, current reporting module structure, and existing tests.
2. `vibe-brownfield-spec` with `brownfield-spec-enhancement` to document current behavior, identify edge cases, and define desired CSV export behavior.
3. `vibe-implement` with `test-driven-development` to add characterization tests for current report formats first, then implement CSV export.
4. `vibe-plan-from-spec` with `plan-driven-execution` to sequence the characterization tests, CSV implementation, and verification steps.
5. `vibe-review` with `review-before-merge` to inspect the diff against the brownfield spec.
6. `vibe-verify` with `verification-before-done` to confirm all tests pass.
7. `vibe-memory` with `project-memory` to record the reporting module's structure and the enhancement rationale.

## 3. Sample brownfield spec

Based on [`templates/brownfield-spec-template.md`](../../templates/brownfield-spec-template.md).

```markdown
# Brownfield Spec: CSV Export for Reporting Module

## Current behavior

### Report generation pipeline

1. `src/reporting/engine.ts` accepts a report request object with `format`, `dateRange`, `metrics`, and `recipients`.
2. `src/reporting/pipeline.ts` orchestrates: data query → aggregation → format-specific rendering → delivery.
3. Existing formats: `pdf` and `email` (HTML email body).

### Data flow

- `engine.ts` queries `src/lib/db.ts` for raw metric data.
- `pipeline.ts` aggregates data using functions in `src/reporting/aggregate.ts`.
- Format-specific renderers: `renderPdf()` in `src/reporting/pdf.ts`, `renderEmail()` in `src/reporting/email.ts`.

### Edge cases and quirks

- Reports with zero data points produce an empty PDF with a "No data for this period" message.
- Email reports include a default header and footer defined in `src/reporting/email-templates.ts`.
- The `dateRange` parameter uses ISO 8601 date strings but does not validate timezone consistency.
- Aggregation functions silently skip null metric values.

### Existing tests

- `src/reporting/__tests__/engine.test.ts` — tests report request creation and validation.
- `src/reporting/__tests__/aggregate.test.ts` — tests aggregation functions with sample data.
- No tests for PDF rendering or email delivery.

### Dependencies

- `src/reporting/` is called by `src/scheduler/daily-reports.ts` and `src/admin/reports.ts`.
- `src/lib/db.ts` provides the database query layer.
- PDF rendering uses a third-party library (`pdfkit`) — check license in `package.json`.

## Desired behavior

### CSV export goals

- A new `format: 'csv'` option in the report request object.
- CSV output includes the same data as the PDF format — same columns, same aggregation.
- CSV is returned as a file buffer that can be downloaded or attached to an email.
- Empty data sets produce a CSV with headers only and an empty body.

### CSV export non-goals

- Do not change the existing PDF or email format behavior.
- Do not modify the aggregation logic.
- Do not change the report request validation schema (add `csv` as a valid format value).
- Do not add streaming or large-dataset pagination in this iteration.

## Diff (current vs desired)

| Aspect | Current | Desired |
| --- | --- | --- |
| Supported formats | `pdf`, `email` | `pdf`, `email`, `csv` |
| Format renderer | `renderPdf()`, `renderEmail()` | `renderPdf()`, `renderEmail()`, `renderCsv()` |
| Report request validation | Accepts `pdf` or `email` | Accepts `pdf`, `email`, or `csv` |
| Empty data handling | Empty PDF with message | CSV with headers only |
| Delivery pipeline | PDF attached or email body | CSV attached or email body |

## Risk assessment

- **Low risk**: Adding a new format does not change existing code paths.
- **Medium risk**: Report request validation change could break callers that enumerate format values.
- **Low risk**: CSV rendering is straightforward text generation.
- **Mitigation**: Add characterization tests for existing formats before adding CSV.

## Incremental plan

1. Characterize current behavior with tests for report request creation and aggregation.
2. Add `csv` as a valid format in the request validation.
3. Implement `renderCsv()` using the same aggregation output as `renderPdf()`.
4. Wire CSV into the delivery pipeline.
5. Add tests for CSV rendering and empty data handling.
6. Verify all existing tests still pass.
```

## 4. Sample characterization tests

Based on [`skills/core/brownfield-spec-enhancement/SKILL.md`](../../skills/core/brownfield-spec-enhancement/SKILL.md).

```markdown
# Characterization Tests: Reporting Module

## Purpose

Pin current behavior before adding CSV export. These tests document what the module does today, not what it should do.

## Test cases

### Report request creation

- Test that `createReportRequest({ format: 'pdf', ... })` produces a valid request.
- Test that `createReportRequest({ format: 'email', ... })` produces a valid request.
- Test that `createReportRequest({ format: 'csv', ... })` currently throws or rejects (establishes the validation gap).

### Aggregation

- Test that `aggregateMetrics(data, dateRange)` groups data by day and computes sums.
- Test that null metric values are skipped in aggregation.
- Test that an empty dataset produces an empty aggregation result.

### Empty data handling

- Test that a PDF report with empty data produces output (document current behavior).
- Test that an email report with empty data produces output (document current behavior).
```

```typescript
// src/reporting/__tests__/characterization.test.ts

import { createReportRequest } from '../engine';
import { aggregateMetrics } from '../aggregate';

describe('characterization: report request creation', () => {
  it('accepts pdf format', () => {
    const req = createReportRequest({ format: 'pdf', dateRange: ['2026-01-01', '2026-01-31'], metrics: ['revenue'] });
    expect(req.format).toBe('pdf');
  });

  it('accepts email format', () => {
    const req = createReportRequest({ format: 'email', dateRange: ['2026-01-01', '2026-01-31'], metrics: ['revenue'] });
    expect(req.format).toBe('email');
  });

  it('rejects csv format today', () => {
    expect(() => createReportRequest({ format: 'csv', dateRange: ['2026-01-01', '2026-01-31'], metrics: ['revenue'] }))
      .toThrow();
  });
});

describe('characterization: aggregation', () => {
  it('groups metrics by day and computes sums', () => {
    const data = [
      { date: '2026-01-01', metric: 'revenue', value: 100 },
      { date: '2026-01-01', metric: 'revenue', value: 200 },
      { date: '2026-01-02', metric: 'revenue', value: 150 },
    ];
    const result = aggregateMetrics(data, ['2026-01-01', '2026-01-02']);
    expect(result).toEqual([
      { date: '2026-01-01', revenue: 300 },
      { date: '2026-01-02', revenue: 150 },
    ]);
  });

  it('skips null values', () => {
    const data = [
      { date: '2026-01-01', metric: 'revenue', value: null },
      { date: '2026-01-01', metric: 'revenue', value: 50 },
    ];
    const result = aggregateMetrics(data, ['2026-01-01', '2026-01-01']);
    expect(result[0].revenue).toBe(50);
  });

  it('returns empty result for empty data', () => {
    const result = aggregateMetrics([], ['2026-01-01', '2026-01-01']);
    expect(result).toEqual([]);
  });
});
```

## 5. Sample plan

Based on [`templates/plan-template.md`](../../templates/plan-template.md).

```markdown
# Plan: Add CSV Export to Reporting Module

## Context

Brownfield spec: CSV export for reporting module. Current behavior is pinned with characterization tests. The change adds a new format option without modifying existing behavior.

## Tasks

1. [ ] Add characterization tests for current report request creation and aggregation behavior.
2. [ ] Run characterization tests to confirm they pass against current code.
3. [ ] Add `'csv'` as a valid format value in report request validation.
4. [ ] Implement `renderCsv()` in `src/reporting/csv.ts` using the same aggregation output as `renderPdf()`.
5. [ ] Wire CSV format into the delivery pipeline in `src/reporting/pipeline.ts`.
6. [ ] Add tests for CSV rendering, including empty data handling.
7. [ ] Run all reporting tests (characterization + new CSV tests).
8. [ ] Review the diff against the brownfield spec.
9. [ ] Record memory note with reporting module structure and enhancement rationale.

## Risks

- Report request validation change could break callers that enumerate format values.
- CSV rendering must produce output compatible with standard spreadsheet applications.
- Empty data handling should match the established pattern (headers only).

## Verification

- Command: `npm test -- reporting`
- Expected result: all characterization tests and new CSV tests pass.
- Command: `npm test -- scheduler admin`
- Expected result: consuming module tests pass (report scheduling and admin UI).
- Command: `npm run validate`
- Expected result: repository validation passes.

## Rollback

- Revert the CSV format addition, `renderCsv()` implementation, and delivery pipeline changes. Characterization tests remain as documentation.
```

## 6. Sample task breakdown

Based on [`templates/task-template.md`](../../templates/task-template.md).

```markdown
# Task: Add CSV format support to report request validation

## Objective

Allow `format: 'csv'` in report request creation without breaking existing `pdf` and `email` formats.

## Scope

### In scope

- Update format validation in `src/reporting/engine.ts` to accept `'csv'`.
- Update any format enum or type definition.

### Out of scope

- CSV rendering logic (handled in a separate task).
- Delivery pipeline changes (handled in a separate task).
- Report request schema changes beyond adding `'csv'`.

## Files or areas

- `src/reporting/engine.ts` — report request creation and validation.
- `src/reporting/__tests__/engine.test.ts` — existing tests for report request creation.

## Steps

1. Find the format validation logic in `engine.ts`.
2. Add `'csv'` to the accepted format values.
3. Update the characterization test to expect `csv` to be accepted (flip the current failing assertion).
4. Run `npm test -- reporting.engine` to confirm the change.

## Done when

- [ ] `createReportRequest({ format: 'csv', ... })` succeeds.
- [ ] Existing `pdf` and `email` formats still succeed.
- [ ] Characterization test for csv rejection is updated to expect success.
- [ ] All engine tests pass.

## Notes

- This is a minimal, safe change that only adds a new valid value.
```

## 7. Sample review note

Based on [`templates/review-template.md`](../../templates/review-template.md).

```markdown
# Review: CSV Export for Reporting Module

## Summary

The diff adds CSV export support to the reporting module: a new `format: 'csv'` option, a `renderCsv()` function, and delivery pipeline integration. Characterization tests document current behavior before the change. All existing and new tests pass.

## Blockers

- None identified.

## Suggestions

- Consider adding a shared format registry if more formats are planned.
- The CSV renderer should handle special characters (commas, quotes, newlines) in metric values.

## Verification reviewed

- `npm test -- reporting` passed.
- `npm test -- scheduler admin` passed.
- `npm run validate` passed.

## Scope and attribution

- [x] Diff matches brownfield spec.
- [x] Attribution and license obligations are clean (no new third-party dependencies).

## Decision

Approve
```

## 8. Sample memory note

Based on [`templates/memory-template.md`](../../templates/memory-template.md).

```markdown
# Memory: 2026-06-16 CSV export for reporting module

## Durable facts

- Reporting module now supports three formats: `pdf`, `email`, and `csv`.
- `renderCsv()` uses the same aggregation output as `renderPdf()` — no separate data pipeline.
- Empty CSV reports produce headers only (no "No data" message like PDF).
- Characterization tests document current behavior for future reference.

## Decisions

- Used brownfield spec enhancement to characterize existing behavior before adding CSV.
- Kept CSV rendering simple — text generation without streaming or pagination.
- Added characterization tests as the first slice, before any behavioral changes.

## Commands and results

- `npm test -- reporting`: passed.
- `npm test -- scheduler admin`: passed.
- `npm run validate`: passed.

## Gotchas

- The format validation change initially broke a consuming test that enumerated valid formats — fixed by updating the test's format list.
- CSV special character handling needs attention for metrics with commas in labels.

## Follow-ups

- Add CSV special character escaping if metric values contain commas, quotes, or newlines.
- Consider streaming for large datasets in a future iteration.

## Sensitivity check

- [x] Contains no secrets, credentials, or unnecessary personal data.

## Confidence

High
```

## 9. Verification report

| Check | Command | Expected result | Status |
| --- | --- | --- | --- |
| Reporting tests | `npm test -- reporting` | All characterization and CSV tests pass. | Pass |
| Consuming module tests | `npm test -- scheduler admin` | No regressions in report scheduling or admin UI. | Pass |
| Static checks | `npm run lint && npm run typecheck` | Static checks pass, or unavailable scripts are documented. | Pass or documented limitation |
| Repository validation | `npm run validate` | Framework or host repo validation passes. | Pass |

## 10. Merge readiness checklist

- [ ] Brownfield spec is complete and reviewed.
- [ ] Characterization tests document current behavior.
- [ ] CSV format is accepted in report request validation.
- [ ] CSV rendering produces correct output for normal and empty data.
- [ ] Delivery pipeline handles CSV format.
- [ ] All existing tests pass (characterization + regression).
- [ ] Diff is limited to the reporting module and its tests.
- [ ] No secrets, personal data, vendored third-party code, or unattributed external content were added.
- [ ] Review decision is `Approve` or remaining changes are explicitly accepted by the human.
