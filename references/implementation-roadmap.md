# Implementation Roadmap — Master Plan

> **Generated:** 2026-06-19
> **Purpose:** Track ALL implementation work needed to bring valuable features from 18 reference sources into Vibe Coding OS.
> **Treatment:** MASTER PLAN for the implementation loop — batch grouping, value/effort ranking, file-level specificity.
> **Constraint:** Vibe Coding OS is a docs/prompts/skills framework, NOT a runtime (ADR 0002). No vendored engines, no script runners.

---

## Contents

- [Priority Summary](#priority-summary)
- [Batch Grouping Overview](#batch-grouping-overview)
- [Batch 0: Hygiene Gate (PREREQUISITE)](#batch-0-hygiene-gate-prerequisite)
- [Batch 1: Deer-Flow SuperAgent & Sandbox Patterns](#batch-1-deer-flow-superagent--sandbox-patterns)
- [Batch 2: Code-Review-Graph Intelligence Patterns](#batch-2-code-review-graph-intelligence-patterns)
- [Batch 3: Antigravity Skill Design Patterns](#batch-3-antigravity-skill-design-patterns)
- [Batch 4: Claude-Code-Best-Practice Patterns](#batch-4-claude-code-best-practice-patterns)
- [Batch 5: Supermemory Memory Depth (planned→implemented)](#batch-5-supermemory-memory-depth-planned-implemented)
- [Batch 6: ECC Shallow→Depth](#batch-6-ecc-shallow-depth)
- [Batch 7: CCPM + BMAD/Agent-OS Merge + Depth](#batch-7-ccpm--bmadagent-os-merge--depth)
- [Batch 8: Deep Sources — Minor Improvements](#batch-8-deep-sources--minor-improvements)
- [Batch 9: Additional Candidates (planning-with-files, lean-ctx)](#batch-9-additional-candidates-planning-with-files-lean-ctx)
- [Validation Gates](#validation-gates-after-each-batch)
- [Attribution Checklist](#attribution-checklist)
- [Index & Registry Updates](#index--registry-updates)

---

## Priority Summary

| Priority | Source | Value | Effort | Value/Effort | Key Features |
|----------|--------|-------|--------|-------------|--------------|
| **P0** | bytedance/deer-flow | ⭐⭐⭐⭐⭐ | M | Very High | SuperAgent harness, sandboxed execution, research-to-code pipeline |
| **P0** | tirth8205/code-review-graph | ⭐⭐⭐⭐ | M | High | Code intelligence graph, incremental review, dependency graph |
| **P0** | sickn33/antigravity-awesome-skills | ⭐⭐⭐⭐⭐ | M | Very High | Skill composability at scale, multi-platform skills, plugin bundles |
| **P1** | shanraisshan/claude-code-best-practice | ⭐⭐⭐⭐ | L | High | Best-practice workflow, subagent patterns, hook patterns |
| **P1** | supermemoryai/supermemory (depth) | ⭐⭐⭐⭐ | L | High | Memory ingestion/retrieval/evaluation full implementation |
| **P1** | affaan-m/ecc (depth) | ⭐⭐⭐ | L | Medium | Continuous-learning, context-budget heuristics |
| **P2** | automazeio/ccpm + bmad/agent-os (depth/merge) | ⭐⭐⭐ | M | Medium | Deeper task-tracking, dedup workflow guidance |
| **P2** | OthmanAdi/planning-with-files | ⭐⭐⭐⭐ | M | Medium | Crash-proof planning, session-catchup |
| **P3** | github/spec-kit (minor) | ⭐⭐ | S | Medium | User-scenarios depth, extensions-and-presets |
| **P3** | mattpocock/skills (minor) | ⭐⭐ | S | Medium | Two-axis review enhancement |
| **P3** | obra/superpowers (minor) | ⭐⭐ | S | Low | Skill-testing methodology |
| **P3** | thedotmack/claude-mem (minor) | ⭐⭐ | S | Low | Lifecycle hooks completion |
| **P4** | yvgude/lean-ctx | ⭐⭐ | S | Low | Policy-based context/DLP patterns |

---

## Batch Grouping Overview

```
Batch 0 ─── Hygiene (prerequisite for all)
  ├── ├── Setup registries + attributions for 4 new sources
  │   └── Validate existing structure 
  │
  ├── Batch 1 ─── Deer-Flow (PARALLEL ✅ with Batch 2, 3)
  │   └── SuperAgent harness, sandboxed execution, research-to-code
  │
  ├── Batch 2 ─── Code-Review-Graph (PARALLEL ✅ with Batch 1, 3)
  │   └── Code intelligence graph, incremental review patterns
  │
  ├── Batch 3 ─── Antigravity Skills (PARALLEL ✅ with Batch 1, 2)
  │   └── Skill composability, multi-platform, plugin bundles
  │
  ├── Batch 4 ─── Claude-Code-Best-Practice (depends on Batches 1-3 via shared skill areas)
  │   └── Best-practice workflow, subagent/hook patterns
  │
  ├── Batch 5 ─── Supermemory Depth (depends on Batch 0)
  │   └── Memory ingestion/retrieval/search/evaluation full depth
  │
  ├── Batch 6 ─── ECC Depth (PARALLEL ✅ with Batch 5, 7)
  │   └── Continuous-learning, context-budget, instinct-extraction
  │
  ├── Batch 7 ─── CCPM + BMAD/Agent-OS Merge + Depth (PARALLEL ✅ with Batch 5, 6)
  │   └── Deeper task-tracking, merge duplicate workflows
  │
  ├── Batch 8 ─── Deep Sources Minor (PARALLEL ✅ with Batches 5-7)
  │   └── Spec-kit user-scenarios, two-axis review, skill-testing, lifecycle hooks
  │
  └── Batch 9 ─── Additional Candidates (lowest priority)
      └── Planning-with-files, lean-ctx
```

---

## Batch 0: Hygiene Gate (PREREQUISITE)

### B0.1: Update index.json for 4 new sources with local_targets

**Source:** shanraisshan/claude-code-best-practice, bytedance/deer-flow, sickn33/antigravity-awesome-skills, tirth8205/code-review-graph

**Why:** All 4 are tracked in index.json but have EMPTY `local_targets[]` arrays — no files are connected. Before implementing features, establish the mapping structure.

**Files to modify:**
- `references/index.json` — Add `local_targets[]` for each (even if just reference docs for now)
- `registry/sources.json` — Verify entries exist with correct license/status

**Estimated effort:** S (15 min)

### B0.2: Add missing attributions

**Sources:** affaan-m/ecc, yeachan-heo/oh-my-claudecode are MISSING from ATTRIBUTIONS.md

**Why:** Compliance requirement (from merge-feature-gap-map.md). Must fix before any new adaptation.

**Files to modify:**
- `ATTRIBUTIONS.md` — Add entries for ECC, yeachan-heo, and multica-ai (inspiration-only note)
- `NOTICE.md` — Add corresponding entries if applicable

**Estimated effort:** S (10 min)

### B0.3: Update affaan-m-ecc.md source doc — fix license and identify strong features

**Why:** Source doc marks license as "not verified" and lacks ECC's strongest portable patterns (continuous-learning, context-budget).

**Files to modify:**
- `references/sources/affaan-m-ecc.md` — Verify license, add continuous-learning/instinct-extraction/context-budget features

**Estimated effort:** S (15 min)

### B0.4: Run validation to establish baseline

**Commands:**
```bash
npm run validate:references  # Check index↔registry consistency
npm run validate             # Full structure validation
```

**Expected output:** Clean pass against 26 gates. Record any pre-existing failures.

**Estimated effort:** S (5 min)

---

## Batch 1: Deer-Flow SuperAgent & Sandbox Patterns (VH)

### B1.1: SuperAgent Harness Architecture Pattern

**Source:** bytedance/deer-flow — superagent-harness, subagent-orchestration

**What to implement:** An orchestrator-agent spawning pattern where a "supervisor" agent decomposes work, spawns worker agents, and aggregates results. Currently vibe-coding-os has basic subagent-driven-development, but lacks the orchestrator→worker model with explicit lifecycle.

**Files to create:**
- `skills/core/superagent-orchestration/SKILL.md` — Orchestrator-agent pattern: decompose → assign → monitor → aggregate workflow, with lifecycle states (planning, executing, reviewing, merging, complete)
- `commands/vibe-superagent.md` — Command prompt for invoking SuperAgent orchestration

**Files to modify:**
- `skills/core/subagent-driven-development/SKILL.md` — Link to superagent-orchestration for complex work; add orchestrator role

**Feature docs to update:**
- `references/features/team-agent-orchestration.md` — Add SuperAgent pattern description
- `references/features/multi-agent-workflow.md` — Reference orchestrator pattern

**Estimated effort:** M (2-3 hours)
**Dependencies:** None (parallel-safe with Batches 2-3)
**Value/Effort:** ⭐⭐⭐⭐⭐

### B1.2: Sandboxed Execution Pattern for Subagents

**Source:** bytedance/deer-flow — sandboxed-execution

**What to implement:** Portable isolation pattern for subagent work — define scope boundaries, side-effect prevention, and explicit handoff contracts between workers. Since we cannot implement actual sandboxing (runtime), document the pattern as workflow discipline.

**Files to create:**
- `skills/core/sandboxed-execution/SKILL.md` — Work- scoping pattern: explicit file boundaries, read-only vs write zones, side-effect declaration before execution, isolation checklist
- `templates/sandbox-scope-template.md` — Scope declaration template for each subagent

**Files to modify:**
- `skills/core/subagent-driven-development/SKILL.md` — Reference sandbox-scope when spawning workers
- `skills/core/superagent-orchestration/SKILL.md` (from B1.1) — Add isolation step to orchestrator workflow

**Feature docs to create:**
- `references/features/sandboxed-execution.md` — Design rationale and when-to-use guidance

**Estimated effort:** M (2 hours)
**Dependencies:** B1.1 (sequential — SuperAgent comes first)
**Value/Effort:** ⭐⭐⭐⭐

### B1.3: Research-to-Code Pipeline Depth

**Source:** bytedance/deer-flow — research-to-code-pipeline

**What to implement:** Structure the existing context-engineering flow into an explicit Research Phase → Synthesis Phase → Code Generation Phase → Validation Phase pipeline. Deer-Flow's deep-research-then-code pattern is more structured than current vibe-brief.

**Files to create:**
- `docs/workflows/research-to-code-pipeline.md` — Four-phase pipeline: Deep Research (explore/analyze) → Synthesis (consolidate findings) → Code Gen (implement) → Validation (verify against research)
- `templates/research-findings-template.md` — Structured research output: sources, patterns found, anti-patterns, design implications

**Files to modify:**
- `skills/core/context-rich-implementation/SKILL.md` — Add explicit research→synthesis→code→validate phases
- `commands/vibe-brief.md` — Add research-and-synthesis sub-steps before implementation brief
- `commands/vibe-brief-execute.md` — Add validate-against-research step after implementation

**Reference doc to create:**
- `references/features/research-to-code-pipeline.md` — Rationale and connection to deer-flow inspiration

**Estimated effort:** M (2 hours)
**Dependencies:** None (can be done alongside B1.1)
**Value/Effort:** ⭐⭐⭐⭐

### B1.4: Structured Memory in Agent Harness

**Source:** bytedance/deer-flow — structured-memory

**What to implement:** Deer-Flow's memory is scoped to agent harness sessions — worker agents share structured memory under orchestrator control. Add patterns for harness-scoped memory (ephemeral working memory for multi-agent sessions) distinct from project/durable memory.

**Files to modify:**
- `skills/memory/memory-architecture/SKILL.md` — Add harness-scoped memory layer (ephemeral, session-bound, orchestrator-managed)
- `docs/workflows/memory-lifecycle.md` — Add harness-memory lifecycle: create with session, share among workers, expire on completion

**Feature docs to modify:**
- `references/features/agent-memory-engine.md` — Reference harness-memory concept

**Estimated effort:** S (1 hour)
**Dependencies:** B1.1 (SuperAgent pattern needed first)
**Value/Effort:** ⭐⭐⭐

---

## Batch 2: Code-Review-Graph Intelligence Patterns (VH)

### B2.1: Code Intelligence Graph Pattern

**Source:** tirth8205/code-review-graph — code-intelligence-graph

**What to implement:** A lightweight, prompt-portable pattern for building a code intelligence map during review — not as a runtime graph, but as a structured review artifact that enumerates: (1) affected symbols/functions/classes, (2) their callers and callees, (3) data flow dependencies, and (4) test coverage gaps.

**Files to create:**
- `skills/core/code-intelligence-review/SKILL.md` — Review workflow that first builds a code intelligence map (scope, call graph, data/import dependencies, test gaps) before analyzing correctness
- `templates/code-intelligence-review-template.md` — Structured template for the intelligence map
- `commands/vibe-review-intelligence.md` — Command to invoke intelligence-aware review

**Files to modify:**
- `skills/core/requesting-code-review/SKILL.md` — Add option for intelligence-map generation before review
- `skills/core/receiving-code-review/SKILL.md` — Reference intelligence map in review context

**Feature docs to create:**
- `references/features/code-intelligence-review.md` — Pattern description and usage guidance

**Estimated effort:** M (2-3 hours)
**Dependencies:** None (parallel-safe with Batches 1, 3)
**Value/Effort:** ⭐⭐⭐⭐⭐ — fills a gap (no existing AI code-review category)

### B2.2: Incremental Review Pattern

**Source:** tirth8205/code-review-graph — incremental-review

**What to implement:** Token-efficient re-analysis pattern that only processes changed code between reviews. Currently vibe-review processes the whole diff every time. Add incremental review discipline: track baseline review state, diff only, analyze only changed symbols and their direct dependencies.

**Files to create:**
- `skills/core/incremental-review/SKILL.md` — Incremental review workflow: baseline capture, diff analysis, dependency-impact analysis, regression-checklist generation
- `templates/incremental-review-template.md` — Baseline snapshot + incremental findings

**Files to modify:**
- `skills/core/requesting-code-review/SKILL.md` — Add "incremental" mode flag
- `commands/vibe-request-review.md` — Add `--incremental` option

**Estimated effort:** M (1.5-2 hours)
**Dependencies:** B2.1 (incremental builds on code-intelligence concept)
**Value/Effort:** ⭐⭐⭐⭐

### B2.3: Dependency Graph for Review Context

**Source:** tirth8205/code-review-graph — dependency-graph

**What to implement:** Pattern for mapping dependency relationships between changed files and the broader codebase. Portable markdown format: produce a call-hierarchy snippet or import-graph listing in review artifacts.

**Files to modify:**
- `templates/code-intelligence-review-template.md` — Add dependency-graph section: imports, callers/callees, data-flow
- `skills/core/code-intelligence-review/SKILL.md` — Add dependency enumeration as step 2 of intelligence map

**Estimated effort:** S (45 min)
**Dependencies:** B2.1
**Value/Effort:** ⭐⭐⭐

### B2.4: MCP-Native Tool Integration Guidelines

**Source:** tirth8205/code-review-graph — mcp-native-review

**What to implement:** Document portable MCP design patterns for tool-agent integration without bundling an MCP server. Describe how code intelligence could be exposed as an MCP tool, and write adapter guidance for local-first tool usage.

**Files to create:**
- `adapters/mcp/code-intelligence-tool-pattern.md` — Guidelines for designing MCP tools for code review, with examples of tool schemas that vibe-coding-os skills could use

**Files to modify:**
- `docs/workflows/core-vs-optional-runtime.md` — Reference MCP tool integration guidance
- `skills/core/code-intelligence-review/SKILL.md` — Reference MCP adapter option

**Estimated effort:** S (45 min)
**Dependencies:** None (can be done standalone)
**Value/Effort:** ⭐⭐⭐

---

## Batch 3: Antigravity Skill Design Patterns (VH)

### B3.1: Skill Composability at Scale — Catalog & Discovery

**Source:** sickn33/antigravity-awesome-skills — skill-composability, skill-catalog

**What to implement:** Enhance skill organization from flat directory structure to a category/tag/bundle system. Current skills/ is organized by category (core/memory/meta) but lacks cross-cutting tags, domain bundles, and explicit composability conventions.

**Files to create:**
- `skills/meta/skill-catalog/SKILL.md` — Guidelines for organizing skills into discoverable catalog with tags, categories, domain bundles, and composability metadata
- `registry/skill-categories.json` — Machine-readable category→tag→bundle mapping for skill discovery

**Files to modify:**
- `registry/skills.json` — Add `tags[]`, `bundle`, `platforms[]` fields to each skill entry
- `skills/meta/writing-skills/SKILL.md` — Add composability and discoverability requirements
- `skills/meta/using-vibe-coding-os/SKILL.md` — Add skill discovery workflow

**Feature docs to create:**
- `references/features/skill-composability.md` — Design principles for composable skills

**Estimated effort:** M (2-3 hours)
**Dependencies:** None (parallel-safe with Batches 1, 2)
**Value/Effort:** ⭐⭐⭐⭐⭐ — unlocks skill discoverability

### B3.2: Multi-Platform Skill Adapters Enhancement

**Source:** sickn33/antigravity-awesome-skills — multi-platform-skills

**What to implement:** Currently vibe-coding-os has adapters/ for claude-code, codex, cursor, gemini. Enhance these with skill-format conventions for each platform. Anti-gravity shows how the same skill can be structured for Claude Code (SKILL.md), Cursor (.cursorrules), Codex (instructions), etc.

**Files to create:**
- `skills/meta/multi-platform-skill-guide/SKILL.md` — Guidelines for writing skills that work across Claude Code, Cursor, Codex CLI, Gemini CLI, Copilot, OpenCode

**Files to modify:**
- `adapters/claude-code/README.md` — Add skill-format convention section
- `adapters/codex/README.md` — Add skill-format convention section
- `adapters/cursor/README.md` — Add skill-format convention section
- `adapters/gemini/README.md` — Add skill-format convention section
- `adapters/compatibility-matrix.md` — Add skill support matrix column

**Estimated effort:** M (1.5-2 hours)
**Dependencies:** B3.1 (catalog structure needed first)
**Value/Effort:** ⭐⭐⭐⭐

### B3.3: Plugin Bundle System

**Source:** sickn33/antigravity-awesome-skills — plugin-bundle-system

**What to implement:** Domain-organized skill bundles — groups of skills that work together for specific use cases (e.g., "web-dev", "data-science", "security-audit"). Currently skills are standalone; add bundle concept with manifest and dependency declaration.

**Files to create:**
- `registry/bundles.json` — Bundle manifest: name, description, skills[], dependencies[], category
- `skills/meta/plugin-bundle-system/SKILL.md` — How to define, compose, and activate skill bundles

**Files to modify:**
- `skills/meta/using-vibe-coding-os/SKILL.md` — Add bundle activation workflow
- `commands/vibe-init.md` — Add `--bundle` option to activate a skill bundle on init

**Feature docs to create:**
- `references/features/plugin-bundle-system.md` — Design rationale for bundle system

**Estimated effort:** M (2 hours)
**Dependencies:** B3.1 (catalog needed for bundle definitions)
**Value/Effort:** ⭐⭐⭐⭐

### B3.4: SKILL.md Format Standards Enhancement

**Source:** sickn33/antigravity-awesome-skills — SKILL.md format conventions

**What to implement:** Deepen the existing writing-skills skill with format conventions inspired by antigravity's massive library: required frontmatter, trigger keywords, composability declaration, cross-platform notes, failure-modes taxonomy.

**Files to modify:**
- `skills/meta/writing-skills/SKILL.md` — Add: required frontmatter fields (triggers, platform, tags, composition), failure-modes section format, composability section (what skills this works with/conflicts with), token-budget guidance
- `commands/vibe-write-skill.md` — Add validation prompts for format requirements
- `templates/skill-template.md` — If exists, update with new required sections

**Estimated effort:** S (1 hour)
**Dependencies:** None (standalone)
**Value/Effort:** ⭐⭐⭐⭐ — improves every future skill

---

## Batch 4: Claude-Code-Best-Practice Patterns (H)

### B4.1: Structured Learning Path for Agentic Engineering

**Source:** shanraisshan/claude-code-best-practice — best-practice-workflow

**What to implement:** A progressive learning path that teaches users from "vibe coding" (basic) → "prompt engineering" → "agentic engineering" (advanced) → "orchestration" (expert). Currently vibe-coding-os has flat onboarding (using-vibe-coding-os skill). Add staged proficiency levels.

**Files to create:**
- `docs/proficiency-path.md` — Four-level proficiency path: (1) Vibe basics, (2) Prompt engineering with skills, (3) Agentic engineering with full workflow, (4) Orchestration with multi-agent teams
- `commands/vibe-proficiency.md` — Entry point for determining current level and next step

**Files to modify:**
- `skills/meta/using-vibe-coding-os/SKILL.md` — Reference proficiency path; add level-appropriate workflows
- `CLAUDE.md` — Add proficiency-level awareness for behavior adaptation

**Estimated effort:** M (1.5-2 hours)
**Dependencies:** None (standalone, but benefits from Batch 3 skill catalog)
**Value/Effort:** ⭐⭐⭐⭐

### B4.2: Best-Practice Badge/Tag System

**Source:** shanraisshan/claude-code-best-practice — organized badge system

**What to implement:** Borrow the concept of skill/workflow maturity badges: `✅ best-practice` / `✅ implemented` / `orchestration`. Add a maturity tracking system to the skill registry to indicate which workflows are production-ready vs experimental.

**Files to modify:**
- `registry/skills.json` — Add `maturity` field (stable/beta/experimental/draft)
- `registry/prompts.json` — Add `maturity` field to commands
- `skills/meta/writing-skills/SKILL.md` — Add maturity-level guidelines

**Estimated effort:** S (30 min)
**Dependencies:** B3.1 (skill registry format)
**Value/Effort:** ⭐⭐⭐

### B4.3: Subagent Orchestration Patterns Expansion

**Source:** shanraisshan/claude-code-best-practice — subagent-orchestration

**What to implement:** Beyond deer-flow's SuperAgent pattern (architectural), add concrete subagent orchestration patterns from best-practice: weather-orchestrator-style decomposition, parallel subagent execution, result aggregation, error handling in subagent chains.

**Files to modify:**
- `skills/core/superagent-orchestration/SKILL.md` — Add concrete orchestration patterns: fan-out/fan-in, pipeline, supervisor-with-reviewer, producer-consumer
- `skills/core/subagent-driven-development/SKILL.md` — Add error-handling patterns for subagent failures
- `docs/workflows/team-agent-orchestration.md` — Reference new patterns

**Estimated effort:** M (1.5 hours)
**Dependencies:** B1.1 (SuperAgent pattern)
**Value/Effort:** ⭐⭐⭐

### B4.4: Hook Patterns Documentation

**Source:** shanraisshan/claude-code-best-practice — hook-patterns

**What to implement:** Expand the existing hook-based-memory contract with general hook patterns: pre/post hooks for commands, lifecycle hooks for sessions, workflow hooks for phase transitions. Currently hooks are memory-only.

**Files to create:**
- `docs/workflows/hook-patterns.md` — General hook pattern taxonomy: command hooks (pre/post), session hooks (start/end), workflow hooks (phase transitions), verification hooks

**Files to modify:**
- `adapters/hooks/memory-hooks-contract.md` — Generalize beyond memory; reference general hook patterns
- `skills/memory/hook-based-memory/SKILL.md` — Reference general hook architecture

**Feature docs to create:**
- `references/features/hook-patterns.md` — Pattern taxonomy and rationale

**Estimated effort:** M (1.5 hours)
**Dependencies:** None (standalone)
**Value/Effort:** ⭐⭐⭐

---

## Batch 5: Supermemory Memory Depth (planned→implemented)

### B5.1: Memory Ingestion — Command & Workflow Depth

**Source:** supermemoryai/supermemory — memory-ingestion

**Current state:** `skills/memory/memory-ingestion/SKILL.md` exists but is basic (7-step workflow). `commands/vibe-memory-ingest.md` exists but is generic.

**What to improve:** Add structured ingestion lifecycle with explicit phases: capture → filter → extract → format → store. Add source-type-specific ingestion patterns (from session, from decision, from review, from debug). Deepen the privacy-check integration.

**Files to modify:**
- `skills/memory/memory-ingestion/SKILL.md` — Add ingestion lifecycle phases; add source-type routing table; deepen privacy-filter integration
- `commands/vibe-memory-ingest.md` — Add `--source` flag (session/decision/review/debug); add structured ingestion steps
- `templates/memory-entry-template.md` — Add required fields: source_type, lifecycle_stage, quality_checks_passed

**Feature doc to update:**
- `references/features/memory-ingestion.md` — Mark as implemented; detail the lifecycle

**Estimated effort:** S (1 hour)
**Dependencies:** Batch 0
**Value/Effort:** ⭐⭐⭐

### B5.2: Memory Retrieval — Workflow & Command Depth

**Source:** supermemoryai/supermemory — memory-retrieval

**Current state:** `skills/memory/memory-search/SKILL.md` covers search. No dedicated retrieval workflow with before-work integration.

**What to improve:** Create a dedicated `memory-retrieval` workflow that sits before planning/coding. Add progressive retrieval (search→narrow→fetch→cite). Add retrieval quality scoring.

**Files to create:**
- `skills/memory/memory-retrieval/SKILL.md` — Retrieval-before-work workflow: define question → search broad → narrow by scope → fetch details → evaluate → cite or discard
- `commands/vibe-memory-retrieve.md` — Restructure from generic to specific phased retrieval command

**Files to modify:**
- `docs/workflows/memory-retrieval-before-work.md` — Deepen with retrieval phases
- `templates/memory-retrieval-report-template.md` — Add retrieval quality scoring

**Feature doc to update:**
- `references/features/memory-retrieval.md` — Mark as implemented

**Estimated effort:** M (1.5 hours)
**Dependencies:** B5.1 (ingestion feeds retrieval)
**Value/Effort:** ⭐⭐⭐

### B5.3: Memory Provider Adapter — From Planned to Docs

**Source:** supermemoryai/supermemory — provider-integration, memory-adapter-interface

**Current state:** `skills/memory/memory-provider-adapter/SKILL.md` exists. `adapters/memory/README.md` exists. But the provider interface is not concretely specified.

**What to improve:** Define a concrete memory provider contract: required operations (store, retrieve, search, delete), optional operations (batch, stream, rank), error semantics, and stability expectations. Keep it as interface documentation only.

**Files to modify:**
- `skills/memory/memory-provider-adapter/SKILL.md` — Add concrete interface contract with operation signatures and expected behaviors
- `adapters/memory/README.md` — Reference the interface contract
- `templates/memory-provider-adapter-template.md` — Add provider contract compliance checklist

**Feature doc to update:**
- `references/features/memory-provider-adapter.md` — Add interface contract details
- `references/features/local-first-memory.md` — Reference fallback to local when provider unavailable

**Estimated effort:** S (45 min)
**Dependencies:** None
**Value/Effort:** ⭐⭐

### B5.4: Cloud-vs-Local Memory Decision Guide

**Source:** supermemoryai/supermemory — cloud-vs-local-memory

**Current state:** `skills/memory/local-first-memory/SKILL.md` exists. Need decision rubric.

**What to improve:** Add decision rubric: when to use local memory vs when to consider an external provider. Include privacy, latency, offline availability, and data sovereignty criteria.

**Files to modify:**
- `skills/memory/local-first-memory/SKILL.md` — Add decision rubric table with criteria (privacy, latency, offline, sovereignty, cost)
- `docs/workflows/memory-provider-adapter.md` — Add decision flow before provider config

**Estimated effort:** S (30 min)
**Dependencies:** None
**Value/Effort:** ⭐⭐

---

## Batch 6: ECC Shallow→Depth (M)

### B6.1: Continuous-Learning / Instinct Extraction Workflow

**Source:** affaan-m/ecc — continuous-learning (from merge-feature-gap-map.md #11)

**Current state:** Not implemented. The merge-feature-gap-map lists this as a strong ECC idea not yet adapted.

**What to implement:** Pattern for distilling reusable patterns from sessions into "instincts" — confidence-scored heuristics that guide future agent behavior. Different from durable memory (facts) — these are learned behavioral patterns.

**Files to create:**
- `skills/meta/instinct-extraction/SKILL.md` — Post-session instinct extraction: review session patterns → formulate instinct statements → confidence-score (1-10) → add to instinct store → reference in future sessions
- `commands/vibe-instinct.md` — Command to extract, review, or apply instincts
- `templates/instinct-template.md` — Structured instinct: pattern, evidence, confidence, expiry

**File listing note:** `skills/meta/instinct-extraction/` may already exist from earlier yeachan-heo adaptation. Verify and enhance.

**Feature docs to create:**
- `references/features/continuous-learning.md` — Design rationale and when-to-use guidance

**Estimated effort:** M (1.5-2 hours)
**Dependencies:** None (parallel with B5, B7)
**Value/Effort:** ⭐⭐⭐

### B6.2: Context-Budget Audit Heuristics

**Source:** affaan-m/ecc — context-budget (from merge-feature-gap-map.md #8)

**Current state:** Partially implemented via yeachan-heo inspiration in skills/meta/context-budget. ECC-specific heuristics not yet adapted.

**What to implement:** Add concrete context-budget audit rules from ECC: files >400 lines need summarizing or splitting, frontmatter >30 words needs trimming, duplicate content detection across files. Write as audit skill.

**Files to create or modify:**
- `skills/meta/context-budget/SKILL.md` — Add ECC-inspired heuristics: file-length thresholds, frontmatter limits, duplicate detection patterns, token-estimation formulas
- `commands/vibe-context-audit.md` — Enrich with specific heuristics checklist

**Estimated effort:** S (45 min)
**Dependencies:** None (parallel-safe)
**Value/Effort:** ⭐⭐⭐

### B6.3: ECC License Verification

**Source:** affaan-m/ecc

**Current state:** Source doc says "License: not verified", "Last checked: not checked"

**What to do:** Verify MIT license from upstream repo, update source doc metadata.

**Files to modify:**
- `references/sources/affaan-m-ecc.md` — Set license: MIT, last_checked: today, update status

**Estimated effort:** S (10 min)
**Dependencies:** None
**Value/Effort:** ⭐⭐⭐ (hygiene)

---

## Batch 7: CCPM + BMAD/Agent-OS Merge + Depth (M)

### B7.1: Deeper Task-State Tracking Conventions

**Source:** automazeio/ccpm, eyaltoledano/claude-task-master

**Current state:** `skills/core/task-state-tracking/SKILL.md` exists with basic states. CCPM's source-of-truth markdown task tracking and claude-task-master's status conventions are partially adapted.

**What to improve:** Define concrete task state machine: proposed → approved → in-progress → review → done | blocked | abandoned. Add state-transition rules, DONE criteria per state, and rollback paths. Add visual status badges.

**Files to modify:**
- `skills/core/task-state-tracking/SKILL.md` — Add explicit state machine with transitions, DONE criteria per state, merge-conflict handling, rollback rules
- `templates/tasks-template.md` — Add status badge convention, state-transition log, DONE criteria per task
- `commands/vibe-tasks.md` — Add `--status` reporting, `--transition` validation

**Feature docs to update:**
- `references/features/spec-issue-worktree-traceability.md` — Reference task-state conventions

**Estimated effort:** M (1.5 hours)
**Dependencies:** None
**Value/Effort:** ⭐⭐⭐

### B7.2: Merge BMAD-METHOD + Agent-OS Overlap

**Source:** bmad-code-org/bmad-method, buildermethods/agent-os

**Current state:** Both sources map to the SAME local targets (STANDARDS.md, ROADMAP.md, adaptive-flow/SKILL.md, vibe-flow.md). This is duplicate — the two sources should be tracked as a merged set.

**What to do:** Add a note to both source docs indicating merged status. If there's unique value in each (BMAD → product mission, Agent OS → standards-aware planning), document the distinction. Otherwise mark as duplicative.

**Files to modify:**
- `references/sources/bmad-code-org-bmad-method.md` — Add "Merged with buildermethods-agent-os" note; clarify unique value
- `references/sources/buildermethods-agent-os.md` — Add "Merged with bmad-code-org-bmad-method" note; clarify unique value
- `references/mappings/source-to-local-skills.md` — Add merge note for both entries
- `references/index.json` — Add merge cross-reference notes

**Estimated effort:** S (20 min)
**Dependencies:** None
**Value/Effort:** ⭐⭐ (housekeeping)

### B7.3: Standards-Aware Planning Rubric Depth

**Source:** buildermethods/agent-os — standards-aware-planning

**Current state:** STANDARDS.md exists. Adaptive-flow/SKILL.md has tier rubric. But the connection between project standards and flow selection is shallow.

**What to improve:** Add explicit rubric that maps project standards (security, performance, accessibility, etc.) to flow requirements. If standards require certain checks, the flow must include them regardless of task tier.

**Files to modify:**
- `skills/core/adaptive-flow/SKILL.md` — Add `standards-mandated-steps` section: each standard in STANDARDS.md maps to a non-skippable flow step
- `docs/workflows/adaptive-flow.md` — Add standards-flow mapping examples
- `STANDARDS.md` — Add flow-requirement metadata to each standard

**Estimated effort:** S (45 min)
**Dependencies:** None
**Value/Effort:** ⭐⭐⭐

---

## Batch 8: Deep Sources — Minor Improvements (L)

### B8.1: Spec-Kit — User Scenarios Depth

**Source:** github/spec-kit — user-scenarios (currently "partial")

**What to improve:** User scenarios in spec-template.md are basic. Add scenario pattern taxonomy: happy path, error path, edge case, performance expectation, security boundary. Add scenario validation checklist.

**Files to modify:**
- `skills/core/spec-first-development/SKILL.md` — Add scenario pattern taxonomy with examples
- `templates/spec-template.md` — Add per-scenario validation criteria

**Estimated effort:** S (30 min)
**Dependencies:** None
**Value/Effort:** ⭐⭐

### B8.2: Spec-Kit — Extensions and Presets (partial→doc-complete)

**Source:** github/spec-kit — extensions-and-presets (currently "not-applied (design only)")

**What to do:** The feature doc exists (`references/features/workflow-extensions-and-presets.md`) and skill exists (`skills/meta/workflow-extension-design/SKILL.md`). Document that this is design-only and reference why runtime preset engine is out of scope. Mark as complete from a portable-pattern perspective.

**Files to modify:**
- `references/features/workflow-extensions-and-presets.md` — Add "Status: design guidance only" with ADR reference
- `references/index.json` — Update spec-kit entry: extensions-and-presets → design-doc-only

**Estimated effort:** S (15 min)
**Dependencies:** None
**Value/Effort:** ⭐

### B8.3: MattPocock — Two-Axis Review Enhancement

**Source:** mattpocock/skills — two-axis review (from merge-feature-gap-map.md #5)

**Current state:** merge-feature-gap-map notes review-before-merge "currently single-axis". But local files may already have enhancement.

**What to verify and implement:** Check current review-before-merge implementation. If still single-axis (just code standards), add second axis: spec-compliance review (does code match the spec?). Add parallel subagent reviewers (standards agent + spec agent).

**Files to modify or verify:**
- `skills/core/review-before-merge/SKILL.md` — Verify if two-axis exists; if not, add spec-compliance axis as parallel track
- `skills/agents/reviewer-agent/SKILL.md` — Verify role covers spec compliance
- `commands/vibe-request-review.md` — Add spec-compliance flag

**Estimated effort:** S (30 min verify + 30 min implement)
**Dependencies:** None
**Value/Effort:** ⭐⭐

### B8.4: Obra/Superpowers — Skill-Testing Methodology

**Source:** obra/superpowers — skill-testing (from merge-feature-gap-map.md #1)

**Current state:** merge-feature-gap-map says writing-skills is a "42-line stub" that needs a real playbook with RED-GREEN-REFACTOR for skills, pressure scenarios, description = when-to-use, token budgets.

**What to verify and implement:** Check current `skills/meta/writing-skills/SKILL.md`. It may already be deeper since the gap-map was created. Add skill-testing methodology if missing.

**Files to modify:**
- `skills/meta/writing-skills/SKILL.md` — Add RED-GREEN-REFACTOR testing pattern for skills; add pressure scenarios; add when-to-use vs how-to-use description guidelines; add token-budget guidance per skill

**Estimated effort:** S (30 min verify + 45 min implement)
**Dependencies:** B3.4 (SKILL.md format standards)
**Value/Effort:** ⭐⭐

### B8.5: Claude-Mem — Lifecycle Hooks Completion

**Source:** thedotmack/claude-mem — lifecycle-hooks (currently "partial")

**Current state:** `adapters/hooks/memory-hooks-contract.md` exists. `skills/memory/hook-based-memory/SKILL.md` exists. Hooks are memory-specific only.

**What to improve:** Add general lifecycle event taxonomy (not just memory): session-start, session-end, phase-transition, decision-recorded, review-completed, merge-completed. Document as contract, not implementation.

**Files to modify:**
- `adapters/hooks/memory-hooks-contract.md` — Generalize to lifecycle-hooks-contract.md; add all lifecycle events
- `skills/memory/hook-based-memory/SKILL.md` — Reference expanded lifecycle events
- `docs/workflows/persistent-context-lifecycle.md` — Add lifecycle event flow

**Estimated effort:** S (30 min)
**Dependencies:** B4.4 (general hook patterns) — can merge with that work
**Value/Effort:** ⭐

### B8.6: Yeachan-Heo — Agent Skills Depth

**Source:** yeachan-heo/oh-my-claudecode — agent roles currently "sơ sài" (shallow)

**Current state:** 4 agent skills exist (architect, implementer, reviewer, tester). But they're basic role descriptions.

**What to improve:** Enrich agent roles with model-tier routing guidance (which model size for which role), role transition protocols, escalation paths, and cross-role communication patterns.

**Files to modify:**
- `skills/agents/architect-agent/SKILL.md` — Add model-tier guidance, role responsibilities escalation
- `skills/agents/implementer-agent/SKILL.md` — Add communication protocol with reviewer
- `skills/agents/reviewer-agent/SKILL.md` — Add review depth levels
- `skills/agents/tester-agent/SKILL.md` — Add test-strategy guidance, coverage expectations
- `docs/workflows/team-agent-orchestration.md` — Add role-transition and escalation protocols

**Estimated effort:** S (1 hour)
**Dependencies:** None
**Value/Effort:** ⭐⭐

---

## Batch 9: Additional Candidates (lowest priority)

### B9.1: Crash-Proof Planning & Session Recovery

**Source:** OthmanAdi/planning-with-files (23k★, MIT) — crash-proof planning, session-catchup

**What to implement:** Persistent markdown plans that survive context loss. Session-catchup command to re-engage agent without re-explaining. This fills a clear gap: current task-state-tracking doesn't address session crashes.

**Files to create:**
- `skills/core/crash-proof-planning/SKILL.md` — Persistent plan format: YAML frontmatter with plan-id, created, status, checkpoint fields; plan body with completion markers that survive re-read; recovery workflow after context loss
- `commands/vibe-session-catchup.md` — Catchup command that reads the persistent plan, re-establishes context, reports completion state, and suggests next action

**Files to modify:**
- `skills/core/task-state-tracking/SKILL.md` — Reference crash-proof format for plans
- `commands/vibe-plan-from-spec.md` — Add persistent-format option

**Feature docs to create:**
- `references/features/crash-proof-planning.md` — Design rationale

**Estimated effort:** M (2 hours)
**Dependencies:** None (standalone)
**Value/Effort:** ⭐⭐⭐⭐ — fills real pain point

### B9.2: Policy-Based Context Control (DLP)

**Source:** yvgude/lean-ctx (2.7k★, Apache-2.0) — policy-based context, DLP

**What to implement:** Ingress/egress context policies — rules for what content the agent is allowed to read (ingress) and write (egress). Extends the existing privacy-filter with policy-based controls.

**Files to create:**
- `skills/core/context-policy/SKILL.md` — Policy-based context control: file patterns, directory rules, sensitive content patterns, allowed/blocked paths
- `templates/context-policy-template.md` — Policy definition format: scope, rules (allow/block/flag), severity

**Files to modify:**
- `skills/memory/privacy-filter/SKILL.md` — Reference context-policy for ingress filtering
- `docs/workflows/context-engineering.md` — Add policy-based context section

**Estimated effort:** M (1.5 hours)
**Dependencies:** None (standalone)
**Value/Effort:** ⭐⭐⭐

---

## Validation Gates After Each Batch

| After Batch | Validation Command | Expected |
|-------------|-------------------|----------|
| **Batch 0** | `npm run validate:references` | Pass (check index↔registry) |
| **Batch 0** | `npm run validate` | Pass (26 gates) |
| **Batch 0** | `npm run validate:traceability` | Pass (no broken refs) |
| **Batch 1-9** (each) | `npm run validate:references` | Pass after every reference change |
| **Batch 1-9** (each) | `npm run validate` | Pass after every structural change |
| **Final** | `npm run validate:traceability` | Pass (check for orphans from new files) |
| **Final** | ATTRIBUTIONS.md review | All 18 sources present |

---

## Attribution Checklist

| Source | In ATTRIBUTIONS.md? | License | Notes |
|--------|-------------------|---------|-------|
| shanraisshan/claude-code-best-practice | ✅ (add when adapting) | MIT | Add when first feature is adapted |
| bytedance/deer-flow | ✅ (add when adapting) | MIT | Add when first feature is adapted |
| sickn33/antigravity-awesome-skills | ✅ (add when adapting) | MIT | Add when first feature is adapted |
| tirth8205/code-review-graph | ✅ (add when adapting) | MIT | Add when first feature is adapted |
| supermemoryai/supermemory | ✅ Already present | MIT | — |
| affaan-m/ecc | ❌ MISSING | MIT | ⚠️ FIX IN BATCH 0 |
| yeachan-heo/oh-my-claudecode | ❌ MISSING | MIT | ⚠️ FIX IN BATCH 0 |
| multica-ai/andrej-karpathy-skills | ❌ MISSING | MIT-declared-incomplete | ⚠️ FIX IN BATCH 0 — inspiration only |
| obra/superpowers | ✅ Already present | MIT | — |
| github/spec-kit | ✅ Already present | MIT | — |
| mattpocock/skills | ✅ Already present | MIT | — |
| thedotmack/claude-mem | ✅ Already present | Apache-2.0 | — |
| coleam00/context-engineering | ✅ Already present | MIT | — |
| revfactory/harness | ✅ Should be present | Apache-2.0 | Verify presence |
| automazeio/ccpm | ✅ Should be present | MIT | Verify presence |
| bmad-code-org/bmad-method | ✅ Should be present | MIT | Verify presence |
| buildermethods/agent-os | ✅ Should be present | MIT | Verify presence |
| eyaltoledano/claude-task-master | ✅ Should be present | MIT+Commons-Clause | Verify presence |

---

## Index & Registry Updates

After ALL batches complete, ensure these registries are updated:

### `references/index.json` updates needed:
- Each of the 4 new sources: add `local_targets[]` pointing to all created/modified files
- spec-kit: update `extensions-and-presets` → `design-doc-only`
- supermemory: update feature statuses from planned to implemented
- bmad + agent-os: add merge cross-reference notes
- ECC: update license, add continuous-learning, context-budget features

### `registry/skills.json` updates needed:
- Add entries for every new SKILL.md created in batches 1-9
- Add `tags[]`, `bundle`, `platforms[]`, `maturity` fields (Batch 3)

### `registry/prompts.json` updates needed:
- Add entries for every new vibe-* command created
- Add `maturity` field

### `registry/sources.json` updates needed:
- Verify all 18 sources present with correct license, status, import_mode

---

## Summary: Total Implementation Burndown

| Batch | Source(s) | Files to Create | Files to Modify | Effort |
|-------|-----------|----------------|-----------------|--------|
| **B0** | Hygiene | 0 | 4 | S (~30 min) |
| **B1** | Deer-Flow | 6-7 | 6-7 | M (~5-6h) |
| **B2** | Code-Review-Graph | 4-5 | 5-6 | M (~5h) |
| **B3** | Antigravity | 5-6 | 7-8 | M (~6h) |
| **B4** | Best-Practice | 2-3 | 5-6 | M (~4-5h) |
| **B5** | Supermemory Depth | 2-3 | 8-10 | M (~4h) |
| **B6** | ECC Depth | 3-4 | 3-4 | M (~3h) |
| **B7** | CCPM + BMAD Merge | 0 | 6-7 | L (~3h) |
| **B8** | Deep Sources Minor | 0 | 8-10 | S (~3h) |
| **B9** | Additional Candidates | 4-5 | 3-4 | M (~3.5h) |
| **Total** | **18 sources** | **~27 files create** | **~55 files modify** | **~37h** |

**Parallel execution strategy:** Run Batches 1, 2, 3 in parallel (independent). Then Batch 4, 5, 6, 7, 8 in parallel (mostly independent). Then Batch 9 standalone.

**Key dependencies:**
- B1.2 ← B1.1 (sandboxed execution needs SuperAgent pattern)
- B2.2 ← B2.1 (incremental review needs code intelligence)
- B3.2 ← B3.1 (multi-platform needs catalog)
- B3.3 ← B3.1 (plugin bundles need catalog)
- B4.3 ← B1.1 (subagent orchestration needs SuperAgent)
- B4.4 ← B8.5 (hook patterns can be combined with lifecycle hooks)
- B5.2 ← B5.1 (retrieval needs ingestion)
- B8.4 ← B3.4 (skill-testing needs format standards)
