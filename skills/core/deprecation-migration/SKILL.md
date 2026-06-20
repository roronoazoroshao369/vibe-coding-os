---
name: deprecation-migration
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Deprecation & Migration

## Purpose

Manage the lifecycle of deprecating skills, commands, templates, registry entries, or any Vibe Coding OS artifact — distinguishing **Compulsory** deprecations (security breaks, irrecoverable errors) from **Advisory** deprecations (replacement available, convenience deprecation). Enforce a 5-question pre-deprecation gate and a structured sunset timeline that protects users from silent breakage.

## When to use

Use when an artifact (skill, command, template, registry entry, schema, API contract, external dependency) is being replaced, removed, or marked end-of-life. Triggers include:

- Replacing an existing skill/command with a better-designed one
- Marking a registry entry as deprecated due to a security issue
- Sunset a template that no longer reflects current best practice
- Removing a feature that has been superseded
- Communicating an end-of-life timeline to users

## Inputs

- Target artifact (path or identifier)
- Reason for deprecation (security, replacement, redundancy, end-of-life)
- Replacement artifact (if any)
- Migration path (steps users must take)
- Severity classification (compulsory vs advisory)

## Workflow

1. **Apply the 5 pre-deprecation questions.** Before marking ANY artifact as deprecated, answer ALL 5:
   1. **System value** — what does this artifact still provide that the replacement does not?
   2. **Consumers** — who depends on this artifact? (count, criticality, migration effort)
   3. **Replacement** — what is the replacement, and is it fully feature-equivalent? (gaps documented)
   4. **Migration cost** — what is the cost for consumers to migrate? (lines of config, steps, risk)
   5. **Maintenance cost of NOT deprecating** — what ongoing cost (bug surface, doc burden, support load) is the project paying to keep this artifact alive?
2. **Classify severity.**
   - **Compulsory** — security vulnerability, irrecoverable error, license violation, irreplaceable dependency failure. NOT an option; users MUST migrate by sunset date. Notice period: minimum 2 minor versions OR 30 days, whichever is longer.
   - **Advisory** — replacement available, redundancy cleanup, end-of-life of a convenience feature. Users SHOULD migrate; no forced deadline. Notice period: minimum 1 minor version OR 14 days.
3. **Document the deprecation notice.** Use `templates/deprecation-notice-template.md` with: target, reason, replacement, migration path, severity, sunset date, contact.
4. **Mark the artifact.** Add `status: "deprecated"` to the relevant registry entry, add a `## Deprecation` section to the skill/command file with severity, replacement, sunset date, and migration link.
5. **Add the deprecation gate.** During validation, surface a warning (advisory) or error (compulsory) for any reference to a deprecated artifact. Track in `registry/deprecation-tracker.json` (or `registry/sources.json` extension).
6. **Communicate.** Add entry to `CHANGELOG.md` under `### Deprecated`. For compulsory deprecations, also update README, layer READMEs, and any docs that reference the artifact.
7. **Sunset.** On sunset date, remove the artifact (or set `status: "sunset"` for compulsory migrations with a transitional grace period). Update the deprecation tracker.

## Outputs

- `templates/deprecation-notice-template.md` (filled)
- `registry/deprecation-tracker.json` entry (or extension to `registry/sources.json`)
- Updated `CHANGELOG.md`
- For compulsory: updated README + layer READMEs + adapter docs
- `## Deprecation` section in the target file
- Validation gate updates

## Failure modes

- Deprecating without a replacement (users stranded)
- Marking compulsory when advisory would suffice (panic; users revolt)
- Marking advisory when compulsory is required (security incident)
- Sunset date without notice period (silent breakage)
- Deprecation notice without migration path (users cannot comply)
- Removing the artifact before sunset date (premature)
- Failing to track which consumers are affected (no migration telemetry)

## Common rationalizations to reject

| Rationalization | Why it's wrong | Counter |
| --- | --- | --- |
| "Nobody uses it, we can just remove it" | You don't know that without measurement. | Check usage telemetry or run a deprecation notice. |
| "It's a security issue, remove it now" | Security issues still need a notice period; users need migration time. | Compulsory with 2-version/30-day notice minimum. |
| "The replacement is better, no need to document the gaps" | Replacement gaps are why users resist migration. | Document gaps in the deprecation notice. |
| "We'll deprecate it, but never actually remove it" | Deprecation without sunset is debt accumulation. | Set a hard sunset date in the notice. |
| "The migration is trivial" | Trivial for you ≠ trivial for users with custom configs. | Provide a one-command migration path or script. |
| "Just a template, not worth a notice" | Templates still appear in user workflows; breakage cascades. | Even templates get a deprecation entry. |
| "Advisory deprecation, no need to track" | Untracked advisories become silent debt. | Track all deprecations in the registry. |

## Red flags (must produce remediation)

- Compulsory deprecation without 2-version/30-day notice
- Advisory deprecation with no sunset date
- Deprecation notice without migration path
- Removing the artifact before sunset date
- No `registry/deprecation-tracker.json` entry
- `CHANGELOG.md` not updated
- README/layer-READMEs reference a deprecated artifact without the deprecation note

## Verification checklist

- [ ] All 5 pre-deprecation questions answered
- [ ] Severity classified (compulsory vs advisory) with justification
- [ ] `templates/deprecation-notice-template.md` filled
- [ ] Artifact marked with `status: "deprecated"`
- [ ] `## Deprecation` section in target file
- [ ] `CHANGELOG.md` updated under `### Deprecated`
- [ ] For compulsory: README + layer READMEs + adapter docs updated
- [ ] `registry/deprecation-tracker.json` (or extension) has the entry
- [ ] Validation gate warns (advisory) or errors (compulsory) on references
- [ ] Sunset date set and communicated

## Source alignment

Inspired by `addyosmani/agent-skills` `deprecation-and-migration` category (MIT, verified 2026-06-20). Adapted into Vibe Coding OS with original wording, Compulsory/Advisory classification, 5-question pre-deprecation gate, and bilingual maintainability notes. The skill is intentionally framework-agnostic — it applies to any artifact (skill, command, template, registry, schema) in Vibe Coding OS and generalizes to any framework following the same artifact pattern.

## Ghi chú tiếng Việt

Trước khi deprecate BẤT KỲ artifact nào (skill, command, template, registry, schema), phải trả lời 5 câu hỏi ở workflow step 1. Phân loại severity: **Compulsory** (security break, irrecoverable error) cần tối thiểu 2 minor versions hoặc 30 ngày notice; **Advisory** (replacement sẵn, redundancy cleanup) cần tối thiểu 1 minor version hoặc 14 ngày. Mọi deprecation PHẢI có migration path rõ ràng — không có nghĩa là "người dùng tự biết". Tracking trong `registry/deprecation-tracker.json` (hoặc extension của `registry/sources.json`). Validation gate phải warn (advisory) hoặc error (compulsory) khi reference đến deprecated artifact.
