# Release Packaging & Version Tagging

How to version, tag, and ship releases for Vibe Coding OS.

> **Current version:** `1.4.2` (see `package.json`)
>
> **Tagging note:** Do **not** create or push git tags on a PR branch. Create and push the actual `v<version>` tag only after the release PR has merged into the target branch (e.g. `main`).
>
> **Draft release notes:** See [`docs/releases/`](releases/) for per-version release notes.
>
> **Post-release next step:** After release metadata lands on `main`, push the final tag and create the GitHub Release.

---

## Version Numbering

This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

| Bump | When | Example |
|------|------|---------|
| **Patch** (`x.y.Z`) | Bug fixes, doc updates, internal refactors with no behavior change | `1.4.2` → `1.4.3` |
| **Minor** (`x.Y.0`) | New features, new skills/commands/templates, backward-compatible additions | `1.4.2` → `1.5.0` |
| **Major** (`X.0.0`) | Breaking changes to core workflow contract, removed commands, incompatible adapter changes | `1.x.y` → `2.0.0` |

---

## Tag Naming Convention

Tags follow the pattern `v<version>`:

```
v1.4.2
v1.4.3
v1.5.0
```

Pre-release tags use the standard semver suffix:

```
v1.5.0-beta.1
v2.0.0-rc.1
```

---

## Pre-Release Checklist

Every release **must** pass the full checklist in [`docs/release-checklist.md`](release-checklist.md).

The key checks:

1. **Full Validation** — `npm run validate:all` passes (20/20)
2. **Runtime Tests** — `npm run runtime:behavior-tests` passes
3. **Secret Scan** — no secrets in new or changed files
4. **Changelog Updated** — version section exists in `CHANGELOG.md`
5. **Documentation Sync** — README, docs, release notes current
6. **No Broken References** — traceability validation passes
7. **No Secrets in Fixtures** — test data uses obvious placeholders only

**Release is blocked if any check fails.**

---

## Release Dry-Run Automation

Use `scripts/release.mjs` to validate release readiness before creating or pushing any tag:

```bash
npm run release:dry-run -- --version 1.5.0
# or
node scripts/release.mjs --dry-run --version 1.5.0
```

The release script:

1. Confirms the git working tree is clean (unless `--allow-dirty`)
2. Runs `npm run validate:all`
3. Runs `node scripts/dashboard-data.mjs`
4. Confirms the requested tag does not already exist
5. Prints exact next steps for local tagging, pushing, and creating the GitHub Release

Default behavior is a dry run. Nothing is created or pushed unless `--tag` is passed.

```bash
node scripts/release.mjs [--dry-run] [--version <semver>] [--allow-dirty] [--tag]
```

- `--dry-run` — validate and print commands without creating tags (default)
- `--version <semver>` — release version to validate; defaults to `package.json` version
- `--allow-dirty` — allow validation with uncommitted local changes
- `--tag` — create the local annotated tag after validation (still does **not** push)

---

## Full Release Workflow

1. **Ensure all changes are merged** to `main`
2. **Run the pre-release checklist** (`docs/release-checklist.md`)
3. **Run release dry-run:** `node scripts/release.mjs --dry-run --version <version>`
4. **Bump the version:**
   ```bash
   npm pkg set version=<version> --no-git-tag-version
   npm install --package-lock-only
   ```
5. **Update CHANGELOG, README, release notes**
6. **Commit, create PR, merge to main**
7. **Tag and push:**
   ```bash
   git tag v<version>
   git push origin v<version>
   ```
8. **Create GitHub Release** via `gh` or REST API
9. **Post-release validation:** `npm run validate:all` on main
10. **Update `docs/RELEASE-PACKAGING.md`** if version header needs refresh

---

## Patch Releases (x.y.Z)

For critical fixes between minor releases:

1. Create a branch from `main`: `git checkout -b fix/v1.4.3-patches`
2. Apply fixes
3. Validate: `npm run validate:all`
4. Bump version, commit, create PR, merge
5. Tag and release as above

---

## Pre-Release Versions

For testing unreleased features:

1. Create a pre-release tag: `v1.5.0-beta.1`
2. Follow the same checklist but mark as pre-release on GitHub
3. When stable, promote to `v1.5.0`

---

## Troubleshooting

**Tag already exists:**
- Delete the local tag: `git tag -d v1.5.0`
- Delete the remote tag: `git push origin :refs/tags/v1.5.0`
- Re-run the bump/tag flow

**Version mismatch between package.json and CHANGELOG:**
- Edit manually to align, then commit with `chore: fix version alignment`

**Push protection triggered:**
- Check for realistic-looking secret patterns in test/fixture files
- Use abstract placeholders (e.g. `STRIPE_SECRET_KEY_PLACEHOLDER`)
- Squash-fix with `git reset --soft` and re-push
