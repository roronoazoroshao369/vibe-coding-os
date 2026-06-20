---
title: Sandbox Scope Declaration
type: template
name: sandbox-scope-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: engineering
tags:
  - template
  - database
status: stable
---

# Sandbox Scope Declaration

## Subtask

<!-- Brief description of the subtask this sandbox serves -->

## Worker

<!-- Who will execute this subtask -->

## Write Zone

<!-- Files and directories the worker may create or modify. Be explicit. -->

```
- src/components/FeatureX/
- src/hooks/useFeatureX.ts
- tests/FeatureX.test.ts
```

## Read-Only Zone

<!-- Files the worker may inspect for context but must not modify. Explain why. -->

```
- src/types/api.ts          # API contract to follow
- src/components/Shared/    # Existing patterns to mimic
- package.json              # Dependency context only
```

## Forbidden Zone

<!-- Files the worker must not read or write. Include owned-by-other-worker zones. -->

```
- src/auth/                 # Owned by security subtask
- src/db/migrations/        # Owned by data subtask
- .env, .env.*              # Secrets
```

## Side-Effect Declaration

| Side effect | Intentional / Incidental | Notes |
|---|---|---|
| File writes in write zone | Intentional | Core subtask output |
| Test execution | Intentional | Must not modify test DB |
| NPM install | Incidental | Only if new deps needed |
| Log file creation | Incidental | Clean up after integration |

## Isolation Checklist

- [ ] Write zone does not overlap with any other worker's write zone.
- [ ] Read-only zone files are not in the write zone of any parallel worker.
- [ ] Forbidden zone is clearly documented and communicated to the worker.
- [ ] Side-effect declaration is shared with integration.
- [ ] Rollback plan exists (git revert or specific undo steps).
- [ ] Validation gates the worker should run before declaring done are listed.

## Rollback Plan

<!-- How to revert this worker's changes cleanly -->
```
git revert <commit-range>  # or
git checkout -- <paths>    # for uncommitted changes
```

## Validation Gates

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test -- --testPathPattern=FeatureX`
- [ ] `npm run validate` (full repo, after integration)

## Sandbox Compliance Review

<!-- Completed after worker finishes -->

- [ ] All changes are within the write zone.
- [ ] No read-only or forbidden files were modified.
- [ ] Side effects match the declaration.
- [ ] Every changed file is traceable to a task requirement.

## Release

<!-- Mark when sandbox is released after integration -->

Sandbox released by: **\_\_\_\_\_\_\_\_\_\_\_\_** Date: **\_\_\_\_\_\_\_\_\_\_\_\_**
