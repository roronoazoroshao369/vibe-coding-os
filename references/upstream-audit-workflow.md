# Upstream Audit Workflow

Vibe Coding OS learns from strong public AI-coding repositories through reference audits, not source vendoring. The goal is to keep a maintainable local kernel that can absorb useful workflow ideas while preserving original wording, license hygiene, and small reviewable changes.

## Local clone policy

- Use `npm run references:clone` to create shallow local working copies under `references/upstreams/`.
- `references/upstreams/*` is ignored by git except for `references/upstreams/README.md`.
- Do not stage or commit cloned upstream repositories.
- Treat local clones as disposable evidence for audits; durable knowledge belongs in `references/changelogs/`, `references/sources/`, `references/mappings/`, local skills, templates, commands, and attribution files.

## Audit loop

1. **Select a source.** Start from `references/index.json` and choose a source with high feature overlap or recent upstream activity.
2. **Refresh clones.** Run `npm run references:clone` to clone or fetch tracked repositories.
3. **Pin metadata.** Record the source URL, default branch, current commit hash, commit date, and root license status.
4. **Read the local source doc.** Use `references/sources/<source-id>.md` to understand why the source is tracked.
5. **Read feature mappings.** Use `references/mappings/source-to-local-skills.md`, `feature-to-local-files.md`, and `update-impact-map.md` to find local targets before editing.
6. **Extract principles.** Summarize reusable ideas as principles, checklists, gates, or failure modes in original language.
7. **Decide action.** Mark each idea as adopt, adapt, defer, or ignore. Popularity alone is not enough.
8. **Adapt locally.** Update the smallest relevant Vibe Coding OS skill, command, template, adapter, or doc.
9. **Record the audit.** Update `references/changelogs/<source-id>.md`, `references/index.json`, and `registry/sources.json` when metadata changes.
10. **Validate and review.** Run `npm run validate` and confirm no upstream clone contents are staged.

## Distillation principles

- Prefer workflow shape over exact wording.
- Convert broad upstream systems into small local skills or templates.
- Keep human intent sovereign: assistants may propose, but they must not silently expand scope.
- Require a spec or explicit assumption for non-trivial work.
- Make verification part of done; never report success without evidence.
- Treat memory as a safety-sensitive system: useful, concise, current, and free of secrets.
- Route multi-agent work through clear ownership, disjoint write scopes, and review gates.
- Use upstream popularity as a discovery signal, not an adoption decision.

## Baseline source priorities

1. Skill orchestration and disciplined execution: `obra-superpowers`, `mattpocock-skills`.
2. Spec-first planning and implementation gates: `github-spec-kit`, `affaan-m-ecc`.
3. Practical guardrails and anti-overengineering: `multica-ai-andrej-karpathy-skills`.
4. Persistent memory and retrieval safety: `supermemoryai-supermemory`, `thedotmack-claude-mem`.
5. Multi-agent orchestration and adapter ergonomics: `yeachan-heo-oh-my-claudecode`.

## Pre-commit guard

Before committing an upstream-related change, run:

```bash
git status --short
```

The commit may include local docs, skills, registries, changelogs, scripts, and templates. It must not include cloned upstream source trees under `references/upstreams/`.
