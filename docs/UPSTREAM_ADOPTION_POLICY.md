# Upstream Adoption Policy

Vibe Coding OS studies external repositories, books, articles, and tools to improve local workflows. Adoption must preserve the project's constitution: human intent, quality, simplicity, verification, maintainability, attribution, privacy, and markdown-first portability.

This policy decides what may become a local skill, command, template, doc, rule, adapter, or runtime helper.

## Default stance

The default is **inspiration only**. Treat upstream work as a source of ideas to rewrite in original local language, not as content to copy or engines to vendor.

Adopt only the smallest portable part that improves Vibe Coding OS.

## Source-selection criteria

Track a source when it meets most of these criteria:

1. **Relevant to agentic software work**: improves specification, planning, implementation, testing, review, memory, orchestration, attribution, or handoff.
2. **Portable idea surface**: the useful part can be expressed as markdown guidance, checklists, templates, command prompts, or a thin adapter contract.
3. **Evidence of maintenance**: public history, clear ownership, recent activity, or stable documented concepts.
4. **Clear license posture**: license file, copyright/notice data, and terms compatible with local use.
5. **Non-overlap**: fills a local gap instead of duplicating existing skills.
6. **Verifiable benefit**: creates observable behavior, a validation gate, a clearer artifact, or reduced ambiguity.
7. **Low lock-in**: does not require adopting a hosted service, daemon, database, proprietary workflow, or upstream CLI.
8. **Attribution traceability**: can be recorded in `references/`, changelogs, `ATTRIBUTIONS.md`, and `NOTICE.md` where required.

Reject or defer sources that are mostly branding, marketing claims, opaque automation, broad codebases without a portable idea, or license-unclear material.

## License and attribution gate

Before any close adaptation:

1. Read the source's license file, metadata, README, and notice/copyright files.
2. Record license status in `references/sources/<source>.md`.
3. Add or update attribution artifacts when the license requires it.
4. Prefer original local wording even when the license allows copying.
5. Never vendor upstream code, generated content, prompt packs, or large documentation blocks without explicit license and attribution review.

### Real cases

| Source | License posture | Local decision |
| --- | --- | --- |
| `mattpocock/skills` | MIT verified from upstream `LICENSE`. License and ownership are clear. | Safe for close idea adaptation with attribution. Local content still uses original wording. |
| `multica-ai/andrej-karpathy-skills` | MIT is declared in metadata/README only. No standalone `LICENSE` file and no copyright notice. | Treat as inspiration-only. Do not vendor text, prompts, or structure. Re-express only general ideas in original local language. |

A metadata-only license claim is not enough for vendoring. If a repository lacks a license file or has incomplete grant information, classify it as `inspiration-only` or `blocked-license` until the license is corrected.

## Engine-vs-skill decision gate

Most upstream value belongs in skills, commands, templates, docs, or rules. Runtime adoption is exceptional.

Answer these seven questions before adopting anything as `runtime-local` or `adapter-only`:

1. Does this add a real capability, not just a prompt or workflow convention?
2. Can native Claude Code, OMC, or existing local skills not already do it well enough?
3. Can the boundary stay small: CLI, JSON state, or adapter contract rather than a large engine?
4. Is the behavior testable with local validation or smoke checks?
5. Is the license clean enough for the intended use?
6. Is there a named maintenance owner or clear maintenance path?
7. Can the feature be removed in one pull request without breaking the markdown-first core?

Score at least **6/7** to adopt as runtime or adapter. If the score is lower, adapt the idea as a skill, command, template, doc, rule, or classify it as inspiration-only.

Runtime must stay optional. It must not become the place to import upstream engines.

## Adoption classes

| Class | Meaning | Typical local target |
| --- | --- | --- |
| `adapt-skill` | Rewrite an upstream operating practice as a local skill. | `skills/**/SKILL.md` |
| `adapt-command` | Add or revise a slash-command prompt that invokes local workflow behavior. | `commands/*.md` |
| `adapt-template` | Convert a useful artifact shape into an original local template. | `templates/*.md` |
| `adapt-doc` | Explain a concept, workflow, or boundary in local docs. | `docs/**/*.md` |
| `adapt-rule` | Add a durable convention, checklist, or constitution-compatible rule. | `CLAUDE.md`, `AGENTS.md`, `STANDARDS.md`, docs |
| `adapter-only` | Define a small optional integration boundary without importing an engine. | `adapters/**`, optional runtime CLI |
| `runtime-local` | Implement a small local helper owned by this repo. Must pass the engine-vs-skill gate. | `runtime/*.mjs`, `scripts/runtime-*.mjs` |
| `reject-runtime` | Explicitly reject an upstream runtime/engine while possibly adapting portable ideas. | `references/mappings/adoption-classification.md` |
| `inspiration-only` | Study concepts only; rewrite from first principles if used. | `references/sources/*.md`, local notes |
| `blocked-license` | Do not adapt closely until license/notice status is resolved. | reference note only |

## Books and long-form sources

Books are never runtime inputs. They may inform:

- principles;
- checklists;
- ADRs;
- review heuristics;
- vocabulary;
- examples described in original language.

Do not turn a book into a command pack, copied template set, generated skill library, or runtime engine. Cite the book or source in references, then express local practices in original Vibe Coding OS language.

## Adoption workflow

1. Add or update `references/sources/<source>.md`.
2. Classify each candidate feature in `references/mappings/adoption-classification.md`.
3. Decide the smallest target: skill, command, template, doc, rule, adapter, or runtime.
4. Confirm license and attribution.
5. Write original local content.
6. Update changelog and feature mappings when applicable.
7. Run the relevant validation (`npm run validate:references`; broader validation when structure changes).

## Ghi chú tiếng Việt

Mặc định chỉ học ý tưởng, không copy hoặc vendor engine upstream. Chỉ đưa vào runtime khi qua cổng 7 câu hỏi và đạt ít nhất 6/7; còn lại chuyển thành skill, command, template, doc, rule, adapter nhỏ, hoặc inspiration-only.