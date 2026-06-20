# Claude Code Marketplace Submission

> Submission package for listing Vibe Coding OS in the Claude Code plugin marketplace.

## Why we are submitting

Claude Code 2.x ships with a marketplace primitive (`plugins/manifest.json` + `marketplace.json`) that lets users install any framework with one command. Vibe Coding OS already implements both files; this submission package documents the install flow, the verification we ran, and the support commitment.

## Submission channels

| Channel | Status | Target | Owner | Notes |
| ------- | ------ | ------ | ----- | ----- |
| `claude-code-marketplace` upstream | queued for v2.13.0 | Anthropic official | Addy Osmani + Anthropic | Submit when 1k★ reached |
| `addyosmani/agent-skills-marketplace` | n/a | addyosmani marketplace | n/a | Repo does not exist yet (verified 2026-06-20); tracked for v2.13.0 |
| **DIY install via `git clone`** | **available now** | All Claude Code users | Vibe Coding OS maintainers | Copy/paste install below |

## DIY install (Claude Code)

```bash
# 1. Clone the repo
git clone https://github.com/roronoazoroshao369/vibe-coding-os.git ~/.vibe-coding-os

# 2. Symlink into Claude Code's plugin directory
mkdir -p ~/.claude/plugins
ln -sf ~/.vibe-coding-os/plugins/manifest.json ~/.claude/plugins/vibe-coding-os.json

# 3. Verify the install
cat ~/.claude/plugins/vibe-coding-os.json | jq .

# 4. Run the smoke test
cd ~/.vibe-coding-os && npm run validate:all
```

Expected: `Overall: 28/28 checks passed`.

## What the marketplace listing shows

When listed, the Claude Code marketplace UI surfaces:

- **Name**: `vibe-coding-os`
- **Version**: `2.12.0`
- **Description**: 139 skills, 111 commands, 95 templates, 28/28 validation gates PASS
- **License**: MIT (with Apache-2.0 attribution for 2 sources)
- **Categories**: skills, agents, engineering, spec, tdd, review, ship, vibe-coding
- **Supported CLIs**: Claude Code, Codex, Cursor, Gemini, Cline, Continue, Aider, Windsurf
- **Validation gates**: 28/28 PASS
- **Maintainer**: roronoazoroshao369
- **Source**: https://github.com/roronoazoroshao369/vibe-coding-os

## Verification we ran before submitting

| Gate | Result |
| ---- | ------ |
| `npm run validate:all` | 28/28 PASS |
| `npm run validate:references` | 22 sources, 26 features |
| `npm run validate:skill-quality` | 139 skills, 0 errors, 249 warnings (informational) |
| `npm run quality:engine --profile=lean` | PASS |
| `plugins/manifest.json` validates against `claude-code-plugin.schema.json` | PASS |
| `plugins/marketplace.json` validates against `claude-code-marketplace.schema.json` | PASS |

## Support commitment

- **Bug reports**: open an issue at https://github.com/roronoazoroshao369/vibe-coding-os/issues
- **Security issues**: `SECURITY.md` workflow (private disclosure via GitHub Security Advisories).
- **Adapter compatibility**: 9 CLIs supported; new CLIs go through the `meta/multi-platform-skill-guide` rubric.
- **Roadmap**: public at `docs/ROADMAP-STATUS.md`; quarterly expert council reviews feed into the roadmap.
- **Response time**: best-effort 7 days for bugs; 30 days for feature requests.

## Screenshots

The `docs/assets/social-preview.png` (1200×630) is the marketing asset baked into the GitHub repo metadata.

## Workflow to re-submit on each release

1. Bump version in `package.json` (e.g., 2.12.0 → 2.13.0).
2. Update `plugins/manifest.json` and `plugins/marketplace.json` versions + counts.
3. Run `npm run validate:all`; require 28+/28+ PASS.
4. Run `npm run dashboard:generate`; commit the diff in `docs/DASHBOARD.md`.
5. Tag the release: `git tag -a v2.13.0 -m "release: v2.13.0"`; push the tag.
6. Re-run the GitHub PATCH on `description`, `topics`, `social_preview` to keep the metadata fresh.
7. Submit to upstream marketplaces (Anthropic official + community) following their intake form.

## Submission timeline

| Version | Date | Marketplace | Status |
| ------- | ---- | ----------- | ------ |
| v2.12.0 | 2026-06-20 | DIY install (this repo) | ✅ Live |
| v2.13.0 | target Q3 2026 | Anthropic official | ⏳ Pending 1k★ gate |
| v2.13.0 | target Q3 2026 | addyosmani/agent-skills-marketplace | ⏳ Pending repo creation |
