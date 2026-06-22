# Claude Code Instructions — Vibe Coding OS

**Quick start:** `git clone`, then `cp CLAUDE.md commands/ skills/ templates/ /your-project/`. See [`docs/QUICKSTART.md`](docs/QUICKSTART.md).

**Prime directive:** Build software quickly while preserving clarity, correctness, verification, and attribution hygiene.

## Workflow

`Intent → Spec → Plan → Implement → Test → Review → Memory → Merge`

| Layer | When | Key commands |
|-------|------|--------------|
| **Default** | Every session | all `vibe-*` |
| **Superpowers** | Brainstorming, exploration | `vibe-brainstorm`, `vibe-flow` |
| **Spec-Driven** | Multi-file features | `vibe-spec` → `vibe-plan` → `vibe-tasks` |
| **Real Engineering** | Debugging, legacy code | `vibe-diagnose`, TDD |

## Quick reference

| Command | When |
|---------|------|
| `vibe-spec` | Requirements or edge cases matter |
| `vibe-plan` | Spec → file-oriented plan |
| `vibe-implement` | Focused edits |
| `vibe-review` | Before task-complete |
| `vibe-merge` | Final readiness |

## Skills & commands

`skills/*/*/SKILL.md` for procedures, `commands/*.md` for prompts, `templates/*.md` for specs/plans/tasks/reviews/memory. Combine as needed; don't over-orchestrate simple work.

## Anti-patterns

Coding before understanding, scope creep, large rewrites without plan, faking tests, hiding uncertainty, storing secrets, copying content without attribution.

## Verification

`npm run validate` for structure. Targeted tests first, broader checks when feasible. Report honestly: passed, failed, or not run (with reason). Merge-ready: diff reviewed, criteria satisfied, verification clear, attribution clean.

## On-demand deep dives

- **Superpowers:** [`docs/workflows/superpowers-inspired-workflow.md`](docs/workflows/superpowers-inspired-workflow.md)
- **Spec-driven:** [`commands/vibe-spec.md`](commands/vibe-spec.md)
- **Memory rules:** [`skills/memory/memory-ingestion/SKILL.md`](skills/memory/memory-ingestion/SKILL.md)
- **Reference intelligence:** [`docs/workflows/runtime-mcp-server.md`](docs/workflows/runtime-mcp-server.md)
- **Proficiency levels:** [`commands/vibe-proficiency.md`](commands/vibe-proficiency.md)

## Ghi chú tiếng Việt

*Làm theo lớp spec-driven: constitution → specify → plan → tasks → implement, "cái gì" trước "làm thế nào". Coi `github/spec-kit` là cảm hứng, không vendor. Bộ nhớ: nạp vừa đủ, lọc dữ liệu nhạy cảm, ghi rõ trích dẫn.*
