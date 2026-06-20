# Product Mission and Roadmap

> Use this file to keep long-running product direction visible without turning specs into strategy documents.

## Mission

Vibe Coding OS helps humans and coding agents turn intent into verified software work through portable markdown skills, commands, templates, and reference intelligence.

## Product principles

- Markdown-first: useful without a runtime, installer, or hosted service.
- Optional runtime: a lightweight local JSON companion may materialize state under `.omc/runtime/`, but it stays opt-in and never replaces the markdown baseline.
- Portable: applicable across Claude Code, Codex, Cursor, and similar agent harnesses.
- Verification-oriented: completion claims require evidence.
- Attribution-safe: external ideas are tracked, rewritten, and mapped.
- Lightweight by default: process depth scales with risk and scope.

## Current roadmap themes

| Theme | Goal | Signals of success |
| --- | --- | --- |
| Spec-to-implementation quality | Make specs, plans, tasks, and briefs sufficient for one-pass implementation. | Fewer clarifying loops; validation gates pass with less rework. |
| Memory and context hygiene | Preserve useful context while excluding secrets and stale noise. | Retrieval bundles are relevant, cited, fresh, and small. |
| Reference intelligence | Keep upstream inspiration auditable without vendoring. | Index, mappings, changelogs, and attribution stay synchronized. |
| Team-agent coordination | Use teams only when parallel work improves outcome. | Clear ownership, fewer conflicts, independent verification. |

## Using this roadmap in workflow artifacts

- Specs may cite roadmap themes to explain priority, but acceptance criteria must stay behavior-focused.
- Plans may cite roadmap themes to justify sequencing or trade-offs.
- Tasks should not copy roadmap prose; they should reference the relevant theme only when it changes priority.
- If a request conflicts with the roadmap but is explicit and safe, user intent wins; record the trade-off.

## Out of scope

- This roadmap is not a release promise.
- It does not authorize mandatory runtime dependencies, installers, or external services; the optional runtime layer stays opt-in and local-only.
- It does not replace per-feature specs, plans, or acceptance criteria.

## Ghi chú tiếng Việt

File này giữ mission/roadmap để spec và plan có định hướng sản phẩm mà không nhồi strategy vào từng spec. Roadmap giúp ưu tiên, nhưng acceptance criteria vẫn phải cụ thể và kiểm chứng được.

## Recent releases

- **v2.15.0** (2026-06-20) — Wire the Shield + Skill Maturity + Community Signals. Council of Security (3-layer defense + ADR 0004 adaptive trust), Council of Engineering (frontmatter 100% coverage + 5 regression tests), Council of Adoption (4 adapter configs + 20 per-skill examples + 5 VI guides + community + dependencies).
- **v2.14.0** (2026-06-20) — Defense in Depth + Engineering Quality. 3-layer defense (97.37% OWASP LLM01), 5 redactor modes, 30-pattern redactor, 19 OWASP patterns, canary corpus, skill quality gate, quality engine, 6 adapter docs.
- **v2.13.0** (2026-06-20) — Security Shield + Engineering Quality Lift (Bypass authorization gate, default-deny hooks, OWASP LLM Top 10).

## Next roadmap theme: v2.16.0 — Expert Mode (planned)

| Target | Description |
| --- | --- |
| Task risk classifier | Auto-classify incoming tasks as low/medium/high risk |
| Model-aware adapter | Switch adapter config based on model capability |
| Auto-scope decision | Decide whether to use a team or solo agent |
| Compact failure-mode library | 50+ named failure modes with mitigations |
| Adaptive prompt escalation | Adjust prompt specificity based on model + task |
| Critic pass | Run critic subagent to challenge assumptions |

| Theme | Goal | Signals of success |
| --- | --- | --- |
| AI Testing Suite | Automated quality infrastructure for AI coding | Property-based testing validates skills/commands/templates; benchmark harness measures validation gate performance; test generator creates tests from existing assets; quality score dashboard shows time-series trends from telemetry; GitHub Actions PR comments include quality summary. |

**Runtime:** Frozen per ADR 0002. No mandatory daemon or hosted service.

**Deliverables (proposed):**

a. **Property-based testing schema + runner** — Fuzz skills, commands, and templates with randomized inputs to detect edge cases, crashes, and invariant violations.

b. **Benchmark harness for validation gate performance** — Measure execution time, pass/fail rates, and regression trends across all 26 validation gates.

c. **Test generator from existing skills/commands** — Analyze existing skills and commands, then generate property-based tests automatically.

d. **Quality score trend dashboard** — Time-series visualization from telemetry data (quality-engine session metrics) showing quality trends across sessions.

e. **GitHub Actions PR comment with quality summary** — Auto-post quality gate results and scorecard as a PR comment on every push.

**Out of scope:** mandatory daemon, hosted service, expansion beyond opt-in runtime.

| Theme | Goal | Signals of success |
| --- | --- | --- |
| AI Testing Suite | Automated quality infrastructure for AI coding, from Agent Framework → Agent Platform | Property-based testing validates skills/commands/templates; benchmark harness measures validation gate performance; test generator creates tests from existing assets; quality score dashboard shows time-series trends from telemetry; GitHub Actions PR comments include quality summary. |

**Runtime:** Frozen per ADR 0002. No mandatory daemon or hosted service.

**Deliverables (proposed):**

a. **Property-based testing schema + runner** — Fuzz skills, commands, and templates with randomized inputs to detect edge cases, crashes, and invariant violations.

b. **Benchmark harness for validation gate performance** — Measure execution time, pass/fail rates, and regression trends across all 26 validation gates.

c. **Test generator from existing skills/commands** — Analyze existing skills and commands, then generate property-based tests automatically.

d. **Quality score trend dashboard** — Time-series visualization from telemetry data (quality-engine session metrics) showing quality trends across sessions.

e. **GitHub Actions PR comment with quality summary** — Auto-post quality gate results and scorecard as a PR comment on every push.

**Out of scope:** mandatory daemon, hosted service, expansion beyond opt-in runtime.