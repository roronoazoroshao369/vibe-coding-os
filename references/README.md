# Reference Intelligence Layer

The Reference Intelligence Layer is the local, markdown-first system Vibe Coding OS uses to track upstream inspiration without copying it. It connects reference repositories, features we care about, local skills/templates/commands, and audit history in a way future AI agents can inspect quickly.

## Why this exists

Vibe Coding OS learns from the broader AI coding workflow ecosystem, but it must remain original, maintainable, and attribution-clean. This layer exists to answer four questions before anyone adapts an idea:

1. Which upstream repositories are tracked?
2. Which features or patterns are worth studying?
3. Which local files might be affected by an upstream change?
4. What has already been audited, decided, or intentionally ignored?

## How the layer is organized

- `references/index.json` is the automation-friendly source index. It lists tracked repos, docs, changelogs, feature links, local targets, and audit metadata.
- `references/sources/*.md` contains human-readable notes for each upstream repo: why it matters, what to study, local mappings, and watchlists.
- `references/features/*.md` describes cross-source capabilities such as spec-driven development, persistent memory, and review-before-merge.
- `references/mappings/*.md` maps sources to local skills, features to local files, and upstream changes to likely update targets.
- `references/changelogs/*.md` tracks local audit notes about upstream changes. These are not copied upstream changelogs.
- `references/snapshots/` is reserved for future local metadata snapshots. Do not store vendored source code here.
- `references/upstreams/` is an ignored local clone workspace for shallow audit working copies. Only its README is committed.
- `references/upstream-audit-workflow.md` documents how to clone, audit, distill, and validate upstream ideas safely.
- `references/maintenance-cadence.md` defines audit frequency, trigger conditions, source priority tiers, required audit outputs, and validation commands.
- `references/upstream-control-map.md` is the human control dashboard: upstream repo → merged/adapted feature → local files/index entries → maintenance workflow.

## How AI agents should use this layer

Before using upstream inspiration:

1. Read `references/index.json` to find the source id and local targets.
2. Read the matching `references/sources/*.md` file.
3. Read relevant `references/features/*.md` and mapping docs.
4. Inspect local files first and adapt only what benefits the local framework.
5. Update the source changelog if you audit upstream.
6. Check `references/maintenance-cadence.md` for audit priority, trigger conditions, and required outputs.
7. When local clones are needed, run `npm run references:clone`; inspect them only as disposable audit evidence.
8. Run `npm run validate:references` and, when appropriate, `npm run validate`.

## Adding a new reference repo

Use `commands/vibe-reference-add.md` as the prompt checklist. In short:

1. create `references/sources/<id>.md`;
2. create `references/changelogs/<id>.md`;
3. add an entry to `references/index.json`;
4. update mapping documents;
5. link any relevant feature docs;
6. update attribution files only when material is imported or closely adapted;
7. run reference validation.

## Auditing an upstream update

Use `commands/vibe-reference-audit.md` and the cadence in `references/maintenance-cadence.md`. The audit should summarize relevant upstream changes, record the upstream commit if known, update `last_checked`, update `last_known_commit`, update the local changelog, include a scorecard, and identify impacted local files. It should not automatically merge upstream ideas into Vibe Coding OS.

## Rules against blind copying

- Do not vendor external repositories into this repo.
- Do not copy large blocks of upstream code, prose, prompts, examples, or tests.
- Do not assume an upstream license permits reuse until verified.
- Do not treat popularity as product fit.
- Do not update local skills only because upstream changed; update only when the local framework benefits.

## Attribution expectations

When external material is imported or closely adapted, update `ATTRIBUTIONS.md`, `NOTICE.md` when required, and relevant registry/reference files. If no material is imported, keep the source as inspiration and document the reasoning in source notes or changelogs.
