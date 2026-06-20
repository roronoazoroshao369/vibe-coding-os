---
description: "Template for content that uses a copyleft-strong (GPL, AGPL) license. Used to flag items for legal review."
---

# GPL Template (Example)

## When to use

When you are creating or reviewing a template, command, or skill that uses a copyleft-strong license (GPL-2.0, GPL-3.0, AGPL-3.0). This template is an example of how to mark such content for legal review.

## License class

- **copyleft-strong** — derivative works may be required to be open.
- **Required action**: legal review before merging.
- **Compatibility check**: ensure project license is compatible with GPL terms.

## Frontmatter

```yaml
---
license: GPL-3.0
sandbox:
  level: trusted
legal_review: required
---
```

## Verification

- [ ] License SPDX ID is valid (e.g., `GPL-3.0`)
- [ ] `legal_review: required` is set
- [ ] License is documented in NOTICE via `vibe-license-surface`
- [ ] Compatible with project's overall license (e.g., MIT, Apache-2.0)

## See also

- `templates/license-attribution-template.md` — NOTICE format
- `commands/vibe-license-surface.md` — auto-generate license report
- ADR 0004 — Adaptive Trust Levels (per-source risk scoring)
