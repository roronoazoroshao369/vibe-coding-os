# Maintainers

> **Vibe Coding OS** — a markdown-first AI coding skill framework.

## Current maintainer

| Role | Name | Contact |
|------|------|---------|
| **BDFL / Maintainer** | Xich Chan | [GitHub](https://github.com/roronoazoroshao369) · [Twitter](https://x.com/nous_hermes) |

## Bus factor & sustainability

The project currently has a **bus factor of ~1.5/5**. All decisions, merges, and
releases still flow through a single person. This is sustainable for a solo
project but carries risk:

- A sudden outage would stall PRs, releases, and community contributions.
- There is no formal deputy or rotation yet.
- Plan: recruit 1–2 trusted contributors with commit access in Q3 2026.
- When contributors are accepted, update both this file and `.github/CODEOWNERS`.

## Project mission

**Constraint:** Vibe Coding OS is *not* a startup, product, hosted service, or
mandatory runtime. It is a portable engineering-discipline layer that lives in
your repo. Contributions should strengthen this constraint, not weaken it.

**Core contract:** `spec → plan → implement → verify → remember`. Every skill,
command, template, validator, and optional runtime helper serves these phases.

## Decision process

1. **Trivial (typos, docs, single-file validation):** Merge at maintainer's
   discretion. No review needed.
2. **Minor (add a validator, improve an adapter, patch a workflow):** Open a PR.
   24h review window. Merge if no objections.
3. **Major (new skill category, remove/merge skills, change project structure):**
   Open a PR tagged `council-required`. Run an expert review if useful, but
   merge durable findings into `ROADMAP.md`, `MAINTAINERS.md`, ADRs, or user
   docs before merge. Do not leave panel reports as the source of truth.
4. **Cross-cutting (change core contract, add runtime dependency, change
   license):** Open an RFC + ADR. Minimum 72h review. Expert review recommended.

## How to maintain (runbook for a new co-maintainer)

This section codifies the day-to-day so the project does not depend on one
person's memory.

### Validate before any merge

```bash
npm run validate:all       # structural + privacy gates; must be all PASS
npm run test:auth          # MCP auth tests
npm run test:redact-object # privacy redaction behavior
npm run test:autopilot     # autopilot policy + loop
npm run test:e2e           # end-to-end CLI workflow
```

### Add a skill / command / template

1. Create the file under `skills/<category>/<name>/SKILL.md` (or `commands/`, `templates/`).
2. Register it in the matching `registry/*.json` and `*/manifest.json`.
3. Run `npm run validate:all` — the orphan and traceability gates catch unregistered files.
4. Update counts only via the documented stats; never hand-edit a number in one doc.

### Triage an injection / secret finding

1. Confirm it is a false positive: the line legitimately quotes attack prose or a placeholder.
2. Add an `injection-allow:<label>` marker on that line, or add the path to the
   relevant allowlist (`scripts/validate-secrets.mjs`, `security/redact/allowlist.json`).
3. Never broaden a pattern to silence a finding — narrow the allowlist instead.

### Privacy coverage

Any new runtime store that persists user free-text MUST scrub it with
`redactObject()` from `security/redact/redactor.mjs` before writing, and be added
to `COVERED_STORES` in `scripts/validate-privacy-coverage.mjs`. The
`validate:privacy-coverage` gate enforces this.

### Documentation and report hygiene

Historical reports are not product surface. Keep the active docs tree lean:

1. Keep `docs/reports/council/` to README only, except for a short-lived active
   synthesis that still has open findings.
2. When a report's findings are closed, merge durable decisions into
   `ROADMAP.md`, `MAINTAINERS.md`, `CHANGELOG.md`, ADRs, or the relevant user
   guide.
3. Move historical panels, deep dives, summaries, and superseded syntheses to
   `docs/reports/council/archive/`.
4. Do not keep generated HTML exports when a Markdown report or synthesis exists.
5. Cleanup-only changes do not bump `package.json`.

### Cut a release

1. `npm run validate:all` + the test suite above must pass.
2. Add a `CHANGELOG.md` entry with theme, bullets, and validation results.
3. Bump `package.json` version **only** for user-facing change. Cleanup/doc churn does not bump.
4. Tag `v${MAJOR}.${MINOR}.${PATCH}` on the merge commit.

### Release cadence (sustainability)

Prefer a **fixed cadence** — at most one minor per week, patches as needed — over
day-by-day releases. The high release frequency is what produced much of the
doc/stat/report drift the councils kept cleaning up. Batch related changes.

## Release engineering

- **CHANGELOG.md** — entries for every release with thematic heading, bullet list of changes, and validation results.
- **Version tag** — git tag `v${MAJOR}.${MINOR}.${PATCH}` on the merge commit.
- **Validate before tag** — `npm run validate:all` plus targeted tests must pass.
- **Council/report outputs** — temporary analysis only; archive or merge into living docs before release.

## Reviewers

Anyone with commit access can review PRs. Current reviewers invited:

| Reviewer | Area |
|----------|------|
| *(none yet — recruit in Q3)* | |

## CODEOWNERS coverage

See [.github/CODEOWNERS](.github/CODEOWNERS) for auto-assignment. Every top-level
directory should have at least one owner. Current ownership defaults to the
maintainer until real co-maintainers are added.

---

- Last updated: 2026-06-23 (v2.18.0 cleanup)
