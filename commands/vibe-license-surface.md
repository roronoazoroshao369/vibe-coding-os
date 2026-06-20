---
description: "Surface the license, copyright, and provenance metadata for any skill, command, template, or third-party content used in the project."
---

# Command: Vibe License Surface

## When to use

Invoke when generating a NOTICE file, a third-party attribution list, a compliance report (SOC 2, ISO 27001, GDPR Article 30), or a release manifest. The command aggregates license metadata from skills, commands, templates, and external content sources into a single human-readable + machine-parseable report.

## Required inputs

- Scope: `repo` | `runtime` | `external-content` (default: `repo`)
- Output format: `markdown` | `json` | `csv` | `notice` (default: `markdown`)
- License filter (optional): include only licenses matching this SPDX ID (e.g., `MIT`, `Apache-2.0`)

## Step-by-step behavior

1. **Discover** content based on scope:
   - `repo`: all skills, commands, templates under `skills/`, `commands/`, `templates/`
   - `runtime`: external content referenced in skill frontmatter `sandbox.content_sources`
   - `external-content`: marketplace skills and third-party packages
2. **Extract** license metadata from each item:
   - Skill frontmatter `license:` field (SPDX ID)
   - Inline `License:` / `SPDX-License-Identifier:` markers
   - `LICENSE` / `LICENSE.md` / `COPYING` file in the same directory
   - `package.json` `license` field (for marketplace skills)
3. **Classify** by license compatibility:
   - `permissive` (MIT, BSD-2/3, Apache-2.0, ISC) — safe for any use
   - `copyleft-weak` (LGPL, MPL, EPL) — compatible with most projects, attribution required
   - `copyleft-strong` (GPL, AGPL) — may require derivative works to be open
   - `proprietary` — requires explicit license grant
   - `unknown` — no license metadata found
4. **Compose** the report:
   - Sort by license class, then by item name
   - Group by directory for readability
   - Count items per class
5. **Flag** compliance issues:
   - Items with no license → `unknown` class
   - Items with `proprietary` → require explicit grant
   - Items with `copyleft-strong` → flag for legal review
6. **Write** the report to `docs/security/license-reports/<date>-<scope>.<format>`.

## Outputs

- License report at `docs/security/license-reports/<date>-<scope>.<format>`
- Summary table: `class | count | items`
- Compliance flags: items requiring legal review
- (Optional) NOTICE file ready to merge into the project

## Failure modes

1. **No items in scope** — emit "scope is empty" message; do not write a report.
2. **Malformed SPDX ID** — class as `unknown`, log warning.
3. **Missing LICENSE file** — class as `unknown` for that item, continue.
4. **Inconsistent metadata** (skill says MIT, but LICENSE file says Apache) — flag for human review.
5. **Marketplace skill without provenance** — block from report until provenance is established.

## Verification checklist

- [ ] Discovery phase returns ≥1 item (or scope-empty message)
- [ ] All SPDX IDs are valid (or flagged as `unknown`)
- [ ] Compatibility classes are assigned per the rubric
- [ ] Summary table sums to total item count
- [ ] Compliance flags are present for `unknown`, `proprietary`, `copyleft-strong`
- [ ] Report is written to dated file
- [ ] Tested with synthetic repo containing 5+ items of varied licenses — see `tests/commands/license-surface.test.mjs`

## Examples

### Repo scope report (excerpt)

```yaml
scope: repo
items: 358
classes:
  permissive: 340
  copyleft-weak: 5
  copyleft-strong: 0
  proprietary: 0
  unknown: 13
flags:
  - skills/core/external-skill/SKILL.md: unknown — no license metadata
  - templates/gpl-template.md: copyleft-strong — legal review required
```

### NOTICE output

```
This project includes software developed by third parties:

- sandbox-marker (MIT) — copyright 2026 vibe-coding-os contributors
- redactor (MIT) — copyright 2026 vibe-coding-os contributors
- ...
```
