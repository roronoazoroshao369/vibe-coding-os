# Reference: tirth8205/code-review-graph

## Metadata

- Repo: https://github.com/tirth8205/code-review-graph
- Owner: tirth8205
- Name: code-review-graph
- Category: ai-code-review
- Status: tracked
- Import mode: inspiration
- License: MIT, verified from upstream LICENSE via raw GitHub during 2026-06-19 audit
- Last checked: 2026-06-19
- Last known commit: unknown (initial tracking)

## Why this repo matters

`tirth8205/code-review-graph` introduces a local-first code intelligence graph for AI code review, building a persistent map of codebase structure with dependencies, call hierarchies, and relationships. With 18k stars and MIT licensing, it opens a new code-review category in the reference system and provides unique patterns for code intelligence in AI-assisted review workflows.

## Key concepts

- **Local-first code intelligence graph** — builds a persistent, structure-aware map of the entire codebase.
- **MCP-native design** — exposes the code graph via the Model Context Protocol for seamless agent integration.
- **Incremental review** — token-efficient re-analysis that only processes changed code between reviews.
- **Code relationship mapping** — surfaces dependency graphs, call hierarchies, and structural relationships.
- **Benchmark suite** — quality measurement for review accuracy and coverage.
- **CLI + MCP server** — dual interface for manual review and automated agent integration.

## Features to study

| Feature | Why it matters | Local equivalent | Status |
| --- | --- | --- | --- |
| Code intelligence graph | Provides AI agents with structured understanding of codebases for better review. | `skills/core/requesting-code-review/SKILL.md`, `skills/core/receiving-code-review/SKILL.md` | Inspiration only; not copied. |
| Incremental review | Token-efficient re-analysis pattern can inform review workflow optimization. | `skills/core/requesting-code-review/SKILL.md` | Inspiration only; not copied. |
| MCP-native tool integration | Model Context Protocol design pattern for tool-agent integration. | `docs/workflows/core-vs-optional-runtime.md` | Inspiration only; not copied. |
| Code relationship mapping | Dependency graph and call hierarchy patterns for codebase understanding. | `skills/core/systematic-debugging/SKILL.md` | Inspiration only; not copied. |

## Local mapping

This is an initial tracking entry. No local adaptations have been created yet. Future audits may identify specific patterns worth adapting into original Vibe Coding OS skills, commands, or workflow docs, particularly for the requesting-code-review and receiving-code-review skills.

## Update watchlist

When this upstream repo changes, future agents should inspect:

- changes to code graph structure or analysis algorithms;
- new MCP protocol patterns or integration methods;
- new review quality metrics or benchmark approaches;
- changes to incremental analysis or token optimization techniques;
- license, notice, or attribution changes before any closer adaptation;
- examples that reveal user experience gaps without copying their text.

## Do not copy

Future agents must not copy large chunks, prompts, docs, examples, tests, or vendor code from this repository without license review and an explicit local decision. Summarize ideas in original language and map them to Vibe Coding OS needs.

## Last audit notes

- Initial reference file created on 2026-06-19 based on research report upstream-research-report-2026-06-19.md.
- License verified as MIT from upstream LICENSE file.
