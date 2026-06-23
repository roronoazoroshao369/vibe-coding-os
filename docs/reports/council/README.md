# Council & Process Reports

**Status: archived. Not part of the shipped framework.**

This directory intentionally contains only this README. Historical expert-council,
gap-analysis, readiness, panel, synthesis, and deep-dive reports are not active
product documentation. Old, already-fixed issues should not look like current
roadmap work.

## Current policy

1. **Keep this directory README-only by default.**
   A short-lived active synthesis may appear here while findings are still open,
   but it must be removed from the active docs tree after durable decisions are
   merged into living docs.

2. **Merge durable decisions into living docs.**
   If a report produced a durable rule, move that rule into `ROADMAP.md`,
   `MAINTAINERS.md`, `CHANGELOG.md`, `docs/adr/`, or the relevant user guide.
   Do not keep a report as the source of truth.

3. **Keep historical reports outside committed docs.**
   Resolved panels, deep dives, summaries, and superseded syntheses should live
   in an ignored local archive, external process repo, wiki, or release artifact
   only when the history is still useful.

4. **Do not keep generated HTML exports.**
   Generated `.html` deep dives should be deleted or kept outside the repo when
   a Markdown report or synthesis exists.

5. **Do not bump version for cleanup-only changes.**
   Documentation cleanup, report archiving, and process-report churn are not
   user-facing product changes.

## Cleanup performed

The active council directory was reduced to README only.

The v2.17.7 expert synthesis was merged into `ROADMAP.md` and `MAINTAINERS.md`,
then removed from active docs. Historical report files and generated HTML exports
were moved out of `docs/` so validation, traceability, and injection scans do not
keep reviewing stale process artifacts.
