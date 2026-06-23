# Council & Process Reports — Archived

**Status: archived. Not part of the shipped framework.**

This directory previously accumulated one or more "expert council",
"gap analysis", and "readiness" reports **per release** (v1.0 → v2.17.x).
That cadence produced significant repo noise and read, to an outside
reviewer, as process/audit theater rather than evidence of quality.

## New policy (effective v2.x cleanup)

1. **Council reports are no longer committed to the main tree.**
   They live under `docs/reports/council/archive/`, which is
   **git-ignored**. Keep them locally or in a separate `*-process`
   repo / wiki if you want the history.

2. **One living document replaces per-version reports.**
   Architectural decisions go in ADRs
   (`skills/core/architecture-decision-records/`). A single
   `ROADMAP.md` tracks direction. We do not snapshot a new council
   file for every patch release.

3. **Version bumps are reserved for user-facing change.**
   Cleanup, doc edits, and report churn must NOT bump the package
   version. See `tools/p0-cleanup/version-freeze.md`.

## How to migrate the existing reports

Run from the repo root:

```bash
bash tools/p0-cleanup/archive-council-reports.sh          # dry-run
bash tools/p0-cleanup/archive-council-reports.sh --apply  # move + stage
```

This moves the historical `v*.md` council/gap/readiness reports into
`docs/reports/council/archive/` (ignored) so Git stops tracking them,
while keeping the files on disk for reference.
