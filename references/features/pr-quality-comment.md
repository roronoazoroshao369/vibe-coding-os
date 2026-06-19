# GitHub Actions PR Comment with Quality Summary

**Feature ID:** pr-quality-comment
**Status:** implemented (v2.7.0)
**Source:** Vibe Coding OS roadmap

## Summary

Auto-posts quality gate results and scorecard as a PR comment on every push to a pull request. Provides immediate visibility into validation status without leaving the PR conversation.

## Key capabilities

- Triggered on `pull_request` events (opened, synchronize)
- Runs `npm run validate:all` and quality scorecard
- Posts formatted markdown comment with:
  - Pass/fail summary per gate
  - Execution timing
  - Quality scorecard results
  - Trend dashboard links
- Uses GitHub API (`GITHUB_TOKEN`) for comment creation/update
- Reusable action for integration into other workflows

## Implementation references

- `.github/workflows/pr-quality-comment.yml` — Workflow definition
- `.github/actions/quality-summary-action/action.yml` — Reusable action
- `docs/pr-quality-comment.md` — Usage guide

## Related

- `validate:all` — Validation orchestration
- `quality:scorecard` — Quality evaluation
- `quality:trend-report` — Trend data
