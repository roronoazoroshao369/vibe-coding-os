---
title: Incremental Review: <Change Title>
type: template
name: incremental-review-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: review
tags:
  - template
  - review
status: stable
---

# Incremental Review: <Change Title>

## Baseline

- **Baseline review**: <date/reference>
- **Baseline diff ID**: <commit or hash>
- **Files in baseline**: <list>
- **Intelligence map**: <yes/no — reference if yes>

---

## Diff Since Baseline

| Category | Files |
|----------|-------|
| Added | <list> |
| Removed | <list> |
| Modified | <list> |
| Unchanged (carried over) | <list> |

---

## Dependency-Impact Analysis

| Changed item | Direct impact | New dependency | Removed dependency | Broadcast impact |
|--------------|---------------|----------------|--------------------|------------------|
| <func/block> | <callers/callees affected> | <new imports/calls> | <removed imports/calls> | <shared interface changes> |
| <func/block> | <callers/callees affected> | <new imports/calls> | <removed imports/calls> | <shared interface changes> |

---

## Regression Checklist

- [ ] Previously reviewed paths — re-verified.
- [ ] Baseline blockers/suggestions — addressed.
- [ ] Baseline test suggestions — added or decision documented.
- [ ] Tests for changed functions — pass.
- [ ] Tests for dependent functions — pass.
- [ ] Integration tests for dependency chains — pass.
- [ ] New error paths — tested.
- [ ] Shared interface changes — backwards compatible or documented break.

---

## Findings

### Resolved (from baseline)

- <finding> — fixed in <file/commit>
- <finding> — verified no longer applicable

### New (this round)

- <finding> — <details>
- <finding> — <details>

### Persistent (still open from baseline)

- <finding> — <rationale for not addressing>
- <finding> — <renewed recommendation>

---

## Updated Baseline

- **New baseline diff ID**: <commit or hash>
- **Updated intelligence map**: <reference if generated>
- **Regression checklist status**: <pass / known failures / skipped>
