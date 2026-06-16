# Release Packaging & Version Tagging

How to version, tag, and ship releases for Vibe Coding OS.

> **Current version:** `0.4.0` (see `package.json`)
>
> **Tagging note:** Do **not** create or push git tags on a PR branch. Create and push the actual `v<version>` tag only after the release PR has merged into the target branch (e.g. `main`).
>
> **Draft release notes:** See [`docs/releases/v0.4.0.md`](releases/v0.4.0.md) for the current v0.4.0 GitHub Release draft.
>
> **Post-release next step:** Create the v1.0 branch only after `v0.4.0` has been tagged and pushed from the merged release commit.

---
## Version Numbering

This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

| Bump | When | Example |
|------|------|---------|
| **Patch** (`0.1.x`) | Bug fixes, doc updates, internal refactors with no behavior change | `0.1.0` → `0.1.1` |
| **Minor** (`0.x.0`) | New features, new skills/commands/templates, backward-compatible additions | `0.1.1` → `0.2.0` |
| **Major** (`1.0.0`) | Breaking changes to core workflow contract, removed commands, incompatible adapter changes | `0.4.0` → `1.0.0` |

Since the project is pre-1.0, minor bumps may contain breaking changes. Document any breaking changes in `CHANGELOG.md` under a `### Changed` or `### Removed` section.

---

## Tag Naming Convention

Tags follow the pattern `v<version>`:

```
v0.1.0
v0.1.1
v0.2.0
v1.0.0
```

Pre-release tags use the standard semver suffix:

```
v0.2.0-beta.1
v1.0.0-rc.1
```

---

## Pre-Release Checklist

Every release **must** pass the full checklist in [`docs/release-checklist.md`](release-checklist.md).

The checklist covers 10 checks:

1. **Core Validation** — `npm run validate` passes
2. **Evaluation Report** — `npm run eval:report` shows ≥ 4/4 checks
3. **Secret Scan** — no secrets in new or changed files
4. **Adapter Smoke Tests** — all adapters pass
5. **Changelog Updated** — `[Unreleased]` section describes changes
6. **Documentation Sync** — README, quickstart, roadmap, registries current
7. **Compatibility** — adapter compatibility matrix is current
8. **No Broken References** — traceability validation passes
9. **No Secrets in Fixtures** — test data uses obvious placeholders only
10. **Attribution & Licensing** — upstream sources cited, no unlicensed content

**Release is blocked if any check fails.** Fix the issue and re-run.

---

## Release Dry-Run Automation

Use `scripts/release.mjs` to validate release readiness before creating or pushing any tag:

```bash
npm run release:dry-run -- --version 1.0.0-rc.1
# or
node scripts/release.mjs --dry-run --version 1.0.0-rc.1
```

The release script uses only Node.js built-ins and performs these checks:

1. Confirms the git working tree is clean, unless `--allow-dirty` is passed
2. Runs the full validation gate: `npm run validate:all`
3. Runs dashboard data validation: `node scripts/dashboard-data.mjs`
4. Confirms the requested tag does not already exist
5. Prints exact next steps for local tagging, pushing the tag, and creating the GitHub release

Default behavior is a dry run. No tag is created and nothing is pushed unless tagging is explicitly requested.

Supported options:

```bash
node scripts/release.mjs [--dry-run] [--version <semver>] [--allow-dirty] [--tag]
```

- `--dry-run` — validate and print commands without creating tags; this is the default
- `--version <semver>` — release version to validate, such as `1.0.0` or `1.0.0-rc.1`; defaults to `package.json` version
- `--allow-dirty` — allow validation with uncommitted local changes, useful for release PR dry-runs
- `--tag` — create the local annotated tag after validation; the script still does **not** push

When ready to create a local tag after the release commit has merged:

```bash
node scripts/release.mjs --tag --version 1.0.0
git show v1.0.0
git push origin v1.0.0
```

Create the GitHub release after pushing the tag:

```bash
gh release create v1.0.0 --title "v1.0.0" --generate-notes
```

> Safety rule: `scripts/release.mjs` never pushes tags. Pushing is always an explicit manual command.

---

## Version Bump Script

Use the automated script to bump versions:

```bash
bash scripts/bump-version.sh <new-version>
```

**Example:**

```bash
bash scripts/bump-version.sh 0.2.0
```

This script will:
1. Update the `version` field in `package.json`
2. Move `[Unreleased]` content in `CHANGELOG.md` under a dated `[0.2.0]` header
3. Create a git commit with the message `chore: release v0.2.0`
4. Create a git tag `v0.2.0`
5. Print next-step instructions

**After the script runs, you must:**
- Review the commit and tag
- Push the commit and tag: `git push origin main --tags`
- Create a GitHub release (see below)

---

## Creating a GitHub Release

### From a Git Tag (recommended)

1. Push the tag to GitHub:
   ```bash
   git push origin main --tags
   ```
2. Go to **Releases** → **Draft a new release**
3. Select the tag (e.g., `v0.2.0`)
4. Set the release title to `v0.2.0`
5. Paste release notes (see template below)
6. Click **Publish release**

### Using GitHub CLI

```bash
gh release create v0.2.0 --title "v0.2.0" --notes-file /tmp/release-notes.md
```

---

## Updating CHANGELOG.md

When cutting a release, move the `[Unreleased]` section to a versioned section:

**Before:**

```markdown
## [Unreleased]

### Added
- New feature X
- New feature Y

## [0.1.0] — 2026-06-06
...
```

**After:**

```markdown
## [Unreleased]

### Added

## [0.2.0] — 2026-07-01

### Added
- New feature X
- New feature Y

## [0.1.0] — 2026-06-06
...
```

Update the comparison links at the bottom:

```markdown
[Unreleased]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/roronoazoroshao369/vibe-coding-os/releases/tag/v0.1.0
```

---

## Release Notes Template

Copy this template for each release:

```markdown
## Vibe Coding OS vX.Y.Z — YYYY-MM-DD

### Highlights

- Bullet-point summary of the most important changes

### Added

- New features, skills, commands, or templates

### Changed

- Changes to existing functionality

### Fixed

- Bug fixes

### Removed

- Removed features (include migration path if applicable)

### Docs

- Documentation updates

### Contributors

- @username — description of contribution
```

---

## Full Release Workflow

1. **Ensure all changes are merged** to `main` (or the release branch)
2. **Run the full pre-release checklist** (`docs/release-checklist.md`)
3. **Run release dry-run validation:** `node scripts/release.mjs --dry-run --version <version>`
4. **Run validation:** `npm run validate && npm run eval:report`
5. **Bump the version:** `bash scripts/bump-version.sh <version>`
6. **Review the commit and tag** — verify CHANGELOG looks correct
7. **Push:** `git push origin main --tags`
8. **Create the GitHub release** with release notes
9. **Announce** in relevant channels (GitHub Discussions, README badge update, etc.)
10. **Update ROADMAP-STATUS.md** to reflect the release

---

## Patch Releases (0.1.x)

For critical fixes between minor releases:

1. Create a branch from the release tag: `git checkout -b hotfix/0.1.1 v0.1.0`
2. Apply fixes
3. Bump patch version: `bash scripts/bump-version.sh 0.1.1`
4. Push and merge back to `main`
5. Tag and release as above

---

## Pre-Release Versions

For testing unreleased features:

1. Create a pre-release tag: `v0.2.0-beta.1`
2. Follow the same checklist but mark it as pre-release on GitHub
3. Test with willing users
4. When stable, promote to `v0.2.0`

---

## Troubleshooting

**Script fails to update CHANGELOG:**
- Ensure the `[Unreleased]` header exists and has content below it
- Check there are no duplicate `[Unreleased]` sections

**Tag already exists:**
- Delete the local tag: `git tag -d v0.2.0`
- Delete the remote tag: `git push origin :refs/tags/v0.2.0`
- Re-run the bump script

**Version mismatch between package.json and CHANGELOG:**
- Edit manually to align, then commit with `chore: fix version alignment`
