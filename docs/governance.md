# Governance — v1.0

This document defines how Vibe Coding OS maintainers make and review changes. It is intentionally lightweight: the goal is clear ownership, safe changes, and clean releases without heavyweight committee process.

## Maintainer Roles

- **Project maintainer** — owns repository direction, release readiness, final merge decisions, and conflict resolution.
- **Domain maintainer** — reviews changes in a focused area such as skills, commands, templates, adapters, runtime scripts, schemas, documentation, or references.
- **Release maintainer** — coordinates version bumps, changelog updates, validation evidence, release notes, and packaging steps.
- **Safety reviewer** — reviews changes that affect security, privacy, prompt-injection exposure, secrets handling, licensing, attribution, or data loss risk.

One person may hold multiple roles. For small changes, the same maintainer may perform project and domain review, but safety-sensitive changes should get a separate safety pass when practical.

## Decision Authority

Use the GitHub issue templates to route governance-sensitive work:

- Use `.github/ISSUE_TEMPLATE/release_checklist.md` for release tracking, RC readiness, and tag preparation.
- Use `.github/ISSUE_TEMPLATE/compatibility_report.md` for adapter compatibility regressions or support-tier questions.
- Use `.github/ISSUE_TEMPLATE/safety_eval_report.md` for safety check failures, eval regressions, security concerns, or licensing/attribution issues.

- **Routine changes** may be approved by the relevant domain maintainer after validation passes.
- **Cross-cutting workflow changes** require project maintainer approval and should be checked against `docs/core-workflow-contract.md`.
- **Compatibility or breaking changes** require project maintainer approval and must follow `docs/compatibility-support-policy.md`.
- **Release decisions** require release maintainer sign-off using `docs/release-checklist.md`.
- **Safety/security exceptions** may be expedited by the project maintainer, but the rationale must be documented in `CHANGELOG.md` or a follow-up issue.

When maintainers disagree, prefer the smallest reversible change. If the decision affects architecture, workflow contracts, compatibility guarantees, or long-term direction, record it using `docs/decision-record-process.md`.

## Change Categories

- **Docs** — README, guides, policies, examples, roadmap, changelog, and workflow documentation.
- **Skills** — `skills/*/*/SKILL.md` operating procedures and related registry entries.
- **Commands** — `commands/vibe-*.md` prompts and `registry/prompts.json` entries.
- **Templates** — reusable artifacts under `templates/` and their references.
- **Adapters** — tool-specific instruction surfaces, adapter READMEs, compatibility matrix entries, and smoke-test expectations.
- **Scripts** — validation, dashboard, evaluation, CLI, release, runtime, and maintenance scripts.
- **Schemas** — JSON schemas and schema validation behavior.
- **Releases** — version bumps, changelog migration, release notes, packaging, tags, and release checklist evidence.

## Review Requirements by Change Category

- **Docs**
  - Self-review for clarity, broken links, and consistency with current behavior.
  - Domain review if the doc defines policy, workflow, compatibility, or release process.
  - Run `npm run validate` when links, inventories, or policy docs change.

- **Skills**
  - Domain review for purpose, triggers, workflow quality, failure modes, and verification checklist.
  - Registry update required when adding, renaming, or removing a skill.
  - Run `npm run validate` and review traceability warnings.

- **Commands**
  - Domain review for phase fit, prompt clarity, safety boundaries, and expected output.
  - Registry update required when adding, renaming, or removing a command.
  - Run `npm run validate`.

- **Templates**
  - Domain review for required sections, usability, and consistency with workflow tiers.
  - Update docs that point contributors to the template.
  - Run `npm run validate`.

- **Adapters**
  - Domain review for instruction-surface correctness and compatibility claims.
  - Check `adapters/compatibility-matrix.md` and `docs/compatibility-support-policy.md`.
  - Run `npm run validate` and adapter smoke checks when adapter behavior changes.

- **Scripts**
  - Code review for correctness, idempotency, error handling, and dependency impact.
  - Add or update tests/smoke checks where possible.
  - Run the changed script directly and `npm run validate`.

- **Schemas**
  - Domain review for backward compatibility and validation strictness.
  - Review fixture/sample impact and migration notes.
  - Run `npm run validate:schemas` and `npm run validate`.

- **Releases**
  - Release maintainer review using `docs/release-checklist.md`.
  - Confirm changelog, roadmap/status docs, validation/evaluation evidence, compatibility matrix, and packaging instructions are current.
  - Run the full release gate documented in the checklist before tagging.

## Safety and Security Review Requirements

A safety/security review is required when a change:

- touches secret scanning, memory redaction, prompt-injection handling, provenance, or upstream import rules;
- changes runtime scripts, MCP surfaces, daemon behavior, shell execution, file deletion, or generated commands;
- adds dependencies, vendored content, copied prompts/docs/code, or new upstream material;
- changes adapter instruction surfaces in ways that could weaken safety boundaries;
- affects authentication, authorization, encryption, private data, or data retention in downstream projects;
- bypasses normal deprecation, compatibility, or validation requirements.

Minimum safety review checklist:

1. No secrets, tokens, private keys, or realistic credentials are introduced.
2. New examples use obvious placeholders only.
3. Prompt text does not instruct agents to ignore higher-priority instructions or exfiltrate data.
4. File-system or shell operations are bounded, documented, and reversible where practical.
5. Upstream material is attributed and license-compatible.
6. Required checks pass, especially `npm run validate`, plus targeted checks such as `npm run validate:secrets`, `npm run validate:references`, or `npm run validate:injection` when relevant.

## Upstream Import Governance

Vibe Coding OS studies upstream projects, but does not blindly copy or vendor their content.

Before importing or closely adapting upstream ideas:

1. Read `docs/UPSTREAM_ADOPTION_POLICY.md` and classify the source/adoption type.
2. Check `references/index.json` for an existing source entry.
3. Add or update source, feature, mapping, and changelog docs under `references/` when the adoption is substantive.
4. Update `ATTRIBUTIONS.md` and `NOTICE.md` when license or attribution obligations require it.
5. Prefer local rewrites in this project's language and structure over copied upstream text.
6. Do not import code, prompts, or docs with unclear or incompatible licensing.
7. Run `npm run validate:references` for reference-layer changes, or `npm run validate` for broader changes.

Risky upstream imports require project maintainer and safety reviewer approval.

## Deprecation Policy

Deprecations follow `docs/compatibility-support-policy.md`:

1. Add a clear `> **Deprecated:**` notice to the relevant file, including the replacement and migration path.
2. Keep the deprecated item functional for one minor version when practical.
3. Document migration guidance in `CHANGELOG.md`.
4. Remove the deprecated item only after the grace period, unless a security or critical correctness issue requires immediate removal.

Deprecating a published command, skill, adapter guarantee, schema field, or workflow contract requires project maintainer approval. Breaking workflow-contract changes require a major version bump.
