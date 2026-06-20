---
name: sandbox-marker
version: 1.0.0
introduced_in: v2.14.0
last_reviewed: 2026-06-20
category: core
tags: [security, sandbox, marker, convention]
---

# Skill: Sandbox Marker Convention

## Purpose

Mark skills, commands, or templates that load external or untrusted content so reviewers can audit the trust level at a glance, runtime hooks can apply isolation policies, and the marketplace can refuse unmarked content. Per ADR 0003, this convention implements a preventive layer that complements the injection counters (Layer 1 — Detect) and redactor (Layer 2 — Contain).

## When to use

Use this convention whenever a skill:

- Uses `WebFetch` to load content from a URL
- Includes or loads content from external files
- Installs code from a marketplace
- Uses `Read` on paths outside the current repo
- Includes user-submitted prompts in `.claude/CLAUDE.md`

Do NOT use when the skill only reads files in the current repo or calls local Node.js scripts in `scripts/`.

## Inputs

- Skill name and frontmatter
- Content sources (URLs, file paths, marketplace identifiers)
- Isolation policy (network, filesystem, execution constraints)

## Workflow

1. Identify every external content source the skill touches (network → app, app → file, marketplace → installer).
2. Apply the **3 trust levels**:
   - `trusted`: skill loads only files within this repo, no network, no exec → no isolation needed
   - `read-only`: skill fetches docs from allowlisted domains, reads files → `network=allowlist, fs=read-only, exec=none`
   - `isolated`: skill loads third-party marketplace content → `network=block, fs=read-only, exec=none, audit=on`
3. Declare the marker in the skill's YAML frontmatter as a `sandbox:` block with `level`, `external_content`, `content_sources`, and `isolation` (if `isolated`).
4. Run `npm run validate:sandbox-marker` to confirm compliance.
5. On violation, add the marker block before merging.

## Outputs

- Skill frontmatter annotated with `sandbox:` block
- Isolation policy expressed as comma-separated key=value pairs
- Validation report from `validate-sandbox-marker.mjs` showing compliant vs. non-compliant skills

## Failure modes

1. **Missing marker on external skill** — gate FAIL; add `sandbox:` block with valid level
2. **Invalid level** — gate FAIL; level must be `trusted`, `read-only`, or `isolated`
3. **Isolated without isolation policy** — gate FAIL; `isolated` level requires `isolation:` field
4. **Content sources not a list** — gate FAIL; `content_sources:` must be a YAML list of strings
5. **Drift over time** — review markers quarterly; new external sources require updated isolation policy

## Verification checklist

- [ ] Skill frontmatter has `sandbox:` block when `external_content: true`
- [ ] `level` field is one of: `trusted`, `read-only`, `isolated`
- [ ] `content_sources` is a YAML list of source patterns
- [ ] `isolated` level includes `isolation:` policy
- [ ] `npm run validate:sandbox-marker` exits 0
- [ ] Reviewed by Security & Trust Council if introducing new external source type
- [ ] Documented in CHANGELOG or ADR if convention changes

## Examples

### Compliant (read-only)

```yaml
---
name: fetch-react-docs
sandbox:
  level: read-only
  external_content: true
  content_sources:
    - "https://react.dev/**"
---
```

### Compliant (isolated)

```yaml
---
name: install-marketplace-skill
sandbox:
  level: isolated
  external_content: true
  content_sources:
    - "https://marketplace.example.com/*"
  isolation: network=block, audit=on
---
```

### Non-compliant (missing marker)

```yaml
---
name: suspicious-loader
external_content: true
# Missing sandbox block → gate will fail
---
```

## Cross-references

- See `security/sandbox/CONVENTION.md` for the full marker specification
- See `ADR 0003` (docs/adr/0003-defense-in-depth.md) for the 3-layer pattern
- See `security/defense/injection-counters.mjs` for Layer 1 (Detect)
- See `security/redact/redactor.mjs` for Layer 2 (Contain)
- See `tests/security/regression.mjs` for Layer 3 (Recover)
- See `skills/core/secure-coding-checklist/SKILL.md` for OWASP Top 10 mapping

## Review cadence

- Quarterly: review all skills with `external_content: true`
- Annual: downgrade review (can `isolated` become `read-only`?)
- On incident: add new pattern to canary corpus + rotate test
