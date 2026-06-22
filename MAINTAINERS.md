# Maintainers

> **Vibe Coding OS** — a markdown-first AI coding skill framework.

## Current maintainer

| Role | Name | Contact |
|------|------|---------|
| **BDFL / Maintainer** | Xich Chan | [GitHub](https://github.com/roronoazoroshao369) · [Twitter](https://x.com/nous_hermes) |

## Bus factor & sustainability

The project currently has a **bus factor of ~1.5/5**. All decisions, merges, and
releases flow through a single person. This is sustainable for a solo project
but carries risk:

- A sudden outage would stall any PRs, releases, and community contributions.
- No formal deputy or rotation.
- Plan: recruit 1–2 trusted contributors with commit access in Q3 2026.

## Project mission

**Constraint:** Vibe Coding OS is *not* a startup, product, hosted service, or
mandatory runtime. It is a portable engineering-discipline layer that lives
in your repo. Contributions should strengthen this constraint, not weaken it.

**Core contract:** `spec → plan → implement → verify → remember`. Every
skill, command, template, and validator serves these five phases.

## Decision process

1. **Trivial (typos, docs, single-file validation):** Merge at maintainer's
   discretion. No review needed.
2. **Minor (add a validator, improve an adapter, patch a workflow):** Open a
   PR. 24h review window. Merge if no objections.
3. **Major (new skill category, remove/merge skills, change project structure):**
   Open a PR tagged `council-required`. Summon a 3-panel expert council audit
   (docs/reports/council/). Audit must pass before merge.
4. **Cross-cutting (change core contract, add runtime dependency, change
   license):** Open an RFC + ADR. Minimum 72h review. Council audit required.

## Release engineering

- **CHANGELOG.md** — entries for every release with thematic heading, bullet
  list of changes, and validation results.
- **Version tag** — git tag `v${MAJOR}.${MINOR}.${PATCH}` on the merge commit.
- **Validate before tag** — `npm run validate:all` must pass 10/10.
- **Council tag** — trim/audit releases get an Expert Council audit before tag.

## Reviewers

Anyone with commit access can review PRs. Current reviewers (invited):

| Reviewer | Area |
|----------|------|
| *(none yet — recruit in Q3)* | |

## CODEOWNERS coverage

See [.github/CODEOWNERS](.github/CODEOWNERS) for auto-assignment. Every
top-level directory should have at least one owner (currently defaults to
the maintainer).

---

*Last updated: 2026-06-22 (v2.17.1)*
