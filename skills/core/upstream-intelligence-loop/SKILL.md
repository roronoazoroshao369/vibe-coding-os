# Upstream Intelligence Loop

## Purpose

Turn high-signal public AI-coding repositories into maintainable local improvements without vendoring upstream code, prompts, or documentation.

## When to use

Use this skill when:

- a tracked reference repository changes;
- a user asks to learn from, clone, fork, compare, or merge ideas from upstream AI-coding projects;
- local skills, commands, templates, or adapters feel weaker than leading public workflows;
- you need to decide whether an upstream idea is worth adapting.

Do not use this skill to copy large upstream files into Vibe Coding OS.

## Inputs

- Source id from `references/index.json`.
- Local working copy under `references/upstreams/` or a temporary clone outside the repo.
- Source doc under `references/sources/`.
- Feature docs under `references/features/`.
- Local targets from `references/mappings/` and the source entry.
- License and attribution status from `registry/sources.json`, `NOTICE.md`, and `ATTRIBUTIONS.md`.

## Workflow

1. **Prepare safely.** Run `npm run references:clone` or inspect a temporary clone. Confirm cloned source trees remain ignored and are not part of the commit.
2. **Pin the baseline.** Record the upstream remote URL, default branch, commit hash, commit date, and root license file status.
3. **Read for patterns, not prose.** Look for reusable principles, workflow boundaries, failure modes, validation gates, memory rules, orchestration patterns, and adapter conventions.
4. **Score local fit.** Accept only ideas that improve Vibe Coding OS's goals: clarity, correctness, verification, memory safety, small changes, reviewability, and clean attribution.
5. **Map before editing.** Use `references/mappings/source-to-local-skills.md`, `feature-to-local-files.md`, and `update-impact-map.md` to identify local targets.
6. **Adapt in original language.** Rewrite ideas into local skills, templates, commands, or docs. Avoid close paraphrases when a general principle is enough.
7. **Record the audit.** Update the source changelog with what was inspected, what was adopted, what was deferred, and why.
8. **Update metadata.** Set `last_checked` and `last_known_commit` in `references/index.json` when known; update license fields when verified.
9. **Validate.** Run `npm run validate:references` for reference-only changes and `npm run validate` for broader changes.
10. **Review vendor risk.** Before commit, run `git status --short` and confirm no upstream clone contents are staged.

## Outputs

- Updated reference changelog entries.
- Updated source metadata in `references/index.json` and `registry/sources.json`.
- Local improvements to skills, commands, templates, adapters, or docs.
- A clear validation report.

## Failure modes

- Treating a popular repository as automatically relevant.
- Copying upstream prose or prompts instead of extracting durable principles.
- Forgetting license and attribution checks.
- Letting cloned repositories become committed source.
- Updating local files without mapping the affected feature first.
- Recording an upstream audit without a commit hash or date when those are available.

## Verification checklist

- The upstream working copy is ignored or outside the repo.
- The audit names the source id, commit hash, date, and license status.
- Local changes are traceable to feature mappings and local targets.
- `references/changelogs/<source-id>.md` records adopt/defer/ignore decisions.
- `references/index.json` has current `last_checked` and `last_known_commit` values.
- `npm run validate` passes, or the limitation is reported.
