# Reference: mattpocock/skills

## Metadata

- Repo: https://github.com/mattpocock/skills
- Owner: mattpocock
- Name: skills
- Category: engineering-agent-skills
- Status: tracked
- Import mode: inspiration/adaptation
- License: MIT, verified from upstream `LICENSE` during the 2026-06-06 audit
- Last checked: 2026-06-06
- Last known commit: be55a7970319ede7965edbb02b5e41cba1ca82c9

## Why this repo matters

`mattpocock/skills` is a compact collection of engineering-agent skills focused on practical software work rather than unstructured vibe coding. It is valuable to Vibe Coding OS because it demonstrates a strong bias toward small composable skills, pre-implementation alignment, durable project context, ADR-backed decisions, TDD, diagnosis, PRD/issue workflows, architecture reasoning, handoffs, and guardrails.

## Key concepts

- Keep skills narrow enough to compose.
- Interview the user before building when intent is ambiguous.
- Maintain shared project language so agents and humans use the same terms.
- Capture durable decisions with ADRs.
- Prefer red-green-refactor and evidence-based debugging over speculative patches.
- Convert conversation context into PRDs and independently grabbable issues.
- Zoom out before architecture-sensitive changes and prototype before commitment when uncertainty is high.
- Preserve handoff context and protect git history.

## Features to study

| Feature | Why it matters | Local equivalent | Status | Target local files |
| --- | --- | --- | --- | --- |
| setup-per-repo-agent-config | Keeps agents disciplined around setup per repo agent config without copying upstream prompts. | skills/meta/using-vibe-coding-os/SKILL.md; commands/vibe-setup-skills.md | implemented | skills/meta/using-vibe-coding-os/SKILL.md; commands/vibe-setup-skills.md; references/features/agent-alignment.md |
| grill-me | Keeps agents disciplined around grill me without copying upstream prompts. | skills/core/grill-user-before-building/SKILL.md; commands/vibe-grill-me.md | implemented | skills/core/grill-user-before-building/SKILL.md; commands/vibe-grill-me.md; references/features/agent-alignment.md |
| grill-with-docs | Keeps agents disciplined around grill with docs without copying upstream prompts. | skills/core/grill-user-before-building/SKILL.md; commands/vibe-grill-with-docs.md | implemented | skills/core/grill-user-before-building/SKILL.md; commands/vibe-grill-with-docs.md; references/features/agent-alignment.md |
| ~~shared-domain-language~~ | ~~Removed in v2.17 trim (off-mission)~~ | removed-v2.17 |
| architecture-decision-records | Keeps agents disciplined around architecture decision records without copying upstream prompts. | skills/core/architecture-decision-records/SKILL.md; commands/vibe-grill-with-docs.md | implemented | skills/core/architecture-decision-records/SKILL.md; commands/vibe-grill-with-docs.md; references/features/architecture-decision-records.md |
| diagnose | Keeps agents disciplined around diagnose without copying upstream prompts. | skills/core/disciplined-diagnosis/SKILL.md; commands/vibe-diagnose.md | implemented | skills/core/disciplined-diagnosis/SKILL.md; commands/vibe-diagnose.md; references/features/diagnosis-loop.md |
| tdd | Keeps agents disciplined around tdd without copying upstream prompts. | skills/core/test-driven-development/SKILL.md; commands/vibe-tdd.md | implemented | skills/core/test-driven-development/SKILL.md; commands/vibe-tdd.md; references/features/diagnosis-loop.md |
| to-prd | Keeps agents disciplined around to prd without copying upstream prompts. | skills/core/prd-from-context/SKILL.md; commands/vibe-to-prd.md | implemented | skills/core/prd-from-context/SKILL.md; commands/vibe-to-prd.md; references/features/prd-from-context.md |
| to-issues | Keeps agents disciplined around to issues without copying upstream prompts. | skills/core/issue-slicing/SKILL.md; commands/vibe-to-issues.md | implemented | skills/core/issue-slicing/SKILL.md; commands/vibe-to-issues.md; references/features/issue-slicing.md |
| triage | Keeps agents disciplined around triage without copying upstream prompts. | skills/core/triage-workflow/SKILL.md; commands/vibe-plan.md (replaced vibe-triage v2.17) | implemented | skills/core/triage-workflow/SKILL.md; commands/vibe-plan.md (replaced vibe-triage v2.17); references/features/triage-workflow.md |
| improve-codebase-architecture | Keeps agents disciplined around improve codebase architecture without copying upstream prompts. | skills/core/improve-codebase-architecture/SKILL.md; commands/vibe-improve-architecture.md | implemented | skills/core/improve-codebase-architecture/SKILL.md; commands/vibe-improve-architecture.md; references/features/architecture-improvement.md |
| zoom-out | Keeps agents disciplined around zoom out without copying upstream prompts. | skills/core/brainstorming/SKILL.md; commands/vibe-brainstorm.md | implemented | skills/core/brainstorming/SKILL.md; commands/vibe-brainstorm.md; references/features/architecture-improvement.md |
| prototype | Keeps agents disciplined around prototype without copying upstream prompts. | skills/core/prototype-before-commitment/SKILL.md; commands/vibe-prototype.md | implemented | skills/core/prototype-before-commitment/SKILL.md; commands/vibe-prototype.md; references/features/architecture-improvement.md |
| caveman | Keeps agents disciplined around caveman without copying upstream prompts. | skills/prompts/compressed-technical-communication/SKILL.md; commands/vibe-caveman.md | implemented | skills/prompts/compressed-technical-communication/SKILL.md; commands/vibe-caveman.md; references/features/compressed-technical-communication.md |
| handoff | Keeps agents disciplined around handoff without copying upstream prompts. | skills/memory/session-capture/SKILL.md; commands/vibe-handoff.md | implemented | skills/memory/session-capture/SKILL.md; commands/vibe-handoff.md; references/features/agent-handoff.md |
| write-a-skill | Keeps agents disciplined around write a skill without copying upstream prompts. | skills/meta/write-reusable-skill/SKILL.md; commands/vibe-write-skill.md | implemented | skills/meta/write-reusable-skill/SKILL.md; commands/vibe-write-skill.md; references/features/agent-alignment.md |
| git-guardrails | Keeps agents disciplined around git guardrails without copying upstream prompts. | skills/core/git-guardrails/SKILL.md; commands/vibe-git-guardrails.md | implemented | skills/core/git-guardrails/SKILL.md; commands/vibe-git-guardrails.md; references/features/git-guardrails.md |
| setup-pre-commit | Keeps agents disciplined around setup pre commit without copying upstream prompts. | skills/core/setup-pre-commit-quality-gates/SKILL.md; commands/vibe-setup-pre-commit.md | implemented | skills/core/setup-pre-commit-quality-gates/SKILL.md; commands/vibe-setup-pre-commit.md; references/features/git-guardrails.md |

## Local mapping

The detailed local mapping lives in `references/mappings/source-to-local-skills.md`, `references/mappings/feature-to-local-files.md`, and `references/mappings/update-impact-map.md`. The core implementation spans `skills/core/`, `skills/meta/`, `skills/memory/`, `skills/prompts/`, `commands/`, `templates/`, `docs/workflows/`, `CONTEXT.md`, and `docs/adr/README.md`.

## Upstream structure notes

The 2026-06-06 audit observed a root README, root project context, Claude instructions, a Claude plugin manifest, bucketed skill directories, ADR docs, and helper scripts. These are studied for structure and update signals only; Vibe Coding OS keeps its own registry and markdown conventions.

## Integration strategy

Adapt ideas into original local artifacts with bilingual maintainability notes. Prefer dependency-free markdown and JSON indexes. Treat upstream as an inspiration source, not a package to vendor. When a similar local skill exists, cross-link and enhance rather than duplicate.

## Update watchlist

Watch upstream `README.md`, `CLAUDE.md`, `CONTEXT.md`, `skills/`, `docs/adr/`, `.claude-plugin/`, and `scripts/` for new skills, setup changes, context/ADR changes, TDD/diagnosis refinements, architecture guidance, handoff changes, and guardrail/hook behavior.

## Maintenance playbook

1. Run or perform a safe audit of the upstream repository without staging clones under `references/upstreams/`.
2. Verify license and latest commit.
3. Update this source doc metadata and `references/changelogs/mattpocock-skills.md`.
4. Update feature docs and mappings only for concepts being adapted.
5. Keep new local content original and run `npm run validate:references` plus `npm run validate`.

## Do not copy

Do not vendor upstream code, prompts, docs, examples, plugin manifests, hooks, or scripts. Do not paste large upstream text. Do not replace Vibe Coding OS philosophy with upstream language. Any closer adaptation requires explicit license and attribution review.

## Last audit notes

- Audited upstream at commit `be55a7970319ede7965edbb02b5e41cba1ca82c9` on 2026-06-06.
- MIT license verified from upstream `LICENSE`.
- Integrated concepts as original Vibe Coding OS skills, commands, templates, workflows, feature docs, mappings, context docs, and registry entries.
- No upstream content was vendored.

## Ghi chú tiếng Việt

Repo này đáng học vì biến “real engineering” thành các skill nhỏ: hỏi kỹ trước khi làm, context chung, ADR, TDD, debug có bằng chứng, PRD/issue slicing, zoom-out kiến trúc, handoff và guardrails. Vibe Coding OS dùng các ý tưởng đó bằng nội dung gốc trong `skills/`, `commands/`, `templates/`, `docs/workflows/`, `CONTEXT.md`, `docs/adr/README.md` và `references/mappings/`. Khi upstream update, maintainer nên audit commit/license, đọc skill thay đổi, cập nhật changelog/mapping trước, rồi mới sửa skill local nếu thật sự cần. Không chép prompt hoặc tài liệu upstream.
