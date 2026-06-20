---
name: external-skill
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags: [external, sandbox, example]
status: example
sandbox:
  level: isolated
  external_content: true
  content_sources:
    - "https://marketplace.example.com/*"
  isolation: network=block,fs=read-only,exec=none,audit=on
---

# Skill: External Skill (Example)

## Purpose

Example skill demonstrating the `isolated` sandbox-marker level. Use as a template when authoring third-party or marketplace skills.

## When to use

When you are about to install or reference a third-party skill from a marketplace or external source. This skill shows the canonical frontmatter pattern for `sandbox.level: isolated`.

## Inputs

- Marketplace URL
- License metadata
- Provenance chain (signatures, hashes)

## Workflow

1. Verify the marketplace URL matches an allowlisted source.
2. Check the license (permissive/copyleft/proprietary).
3. Apply `sandbox: { level: isolated, isolation: network=block,fs=read-only,exec=none,audit=on }`.
4. Run `npm run validate:sandbox-marker` to confirm compliance.
5. Run `npm run validate:injection` to scan the imported content.
6. Run `vibe-license-surface` to update the project's NOTICE file.

## Outputs

- A sandboxed, licensed, audited external skill ready for use.

## Failure modes

1. **Missing sandbox marker** — gate FAIL. Apply the frontmatter above.
2. **Missing isolation policy** — gate FAIL. `isolated` level requires `isolation:` field.
3. **Missing license** — flag in NOTICE. Add `license:` to frontmatter.
4. **Provenance gap** — refuse to import.

## Verification checklist

- [ ] Frontmatter has `sandbox: { level: isolated, ... }`
- [ ] `content_sources` is a YAML list of source patterns
- [ ] `isolation:` policy is set
- [ ] `validate:sandbox-marker` exits 0
- [ ] License is declared and compatible
- [ ] Provenance is verified (signatures, hashes)
- [ ] NOTICE file is updated via `vibe-license-surface`
