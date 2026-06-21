---
title: "Trim Audit — Panel A: Scope Auditor"
date: 2026-06-21
repo_version: v2.16.1
auditor: scope-auditor
status: draft
---

# Scope Audit Report — Vibe Coding OS

## Mission Definition

**ONE purpose:** Making AI coding **more accurate** and **more efficient**, ultimately allowing AI to **autonomously code + auto-approve + loop until done** without losing accuracy/quality.

Every feature must serve: **(1) code accuracy/quality** or **(2) AI autonomy/loop-to-done.**

---

## Inventory Summary

- 152 skills (89 core + 5 checklists + 15 prompts + 8 agents + 20 memory + 12 meta)
- 120 commands
- 110 templates
- Total skill lines: 13,551 (core skills alone)

---

## TOP 10 CANDIDATES FOR REMOVAL

### 1. `skills/core/guard-bypass-protocol/SKILL.md` — **DEFINITELY REMOVE**
- **Size:** 424 lines / 20KB — the single largest skill file in the entire repo
- **Reason:** Offensive adversarial prompt engineering tool for bypassing AI safety filters. Zero connection to code accuracy or AI coding autonomy. Contains 7 bypass technique categories, 30+ attack patterns, model-specific weakness notes for Claude/GPT/Gemini. This is a jailbreak playbook, not a coding tool.
- **Off-mission:** ✅ Completely off-mission. The mission is AI code quality, not AI red-teaming against guardrails.
- **Risk:** Maintaining this skill actively invites misuse and creates liability.

### 2. `red-team-bypass/SKILL.md` — **REMOVE or MERGE into checklists/**
- **Reason:** Defensive documentation of prompt injection attack patterns. While it claims to be "defensive," it has zero connection to AI coding accuracy or autonomy. Overlaps with `secure-coding-checklist` (OWASP LLM Top 10) which covers the same ground.
- **Off-mission:** ✅ Security research discipline, not coding accuracy.

### 3. `observability-design/SKILL.md` — **REMOVE**
- **Size:** 125 lines
- **Reason:** Full DevOps/SRE workflow for designing production instrumentation (metrics, logs, traces, SLOs, burn-rate alerts). This is a monitoring architecture skill for human ops teams, not an AI coding accuracy tool.
- **Off-mission:** ✅ Completely DevOps-focused. Has nothing to do with AI writing better code or looping autonomously.

### 4. `doubt-driven-development/SKILL.md` — **REMOVE**
- **Size:** 114 lines
- **Reason:** Meta-psychological "doubt posture" with CLS-DAR protocol (Claim → Locate → Scrutinize → Doubt → Adjudicate → Record). Excessively philosophical. Explicitly states "not suitable for autonomous CI/loop contexts" — the exact context the mission targets. Creates analysis paralysis, not accuracy.
- **Off-mission:** ✅ Incompatible with autonomous looping (self-admitted).

### 5. `install-skill/SKILL.md` — **REMOVE**
- **Reason:** Package management tooling (npm-installed CLI for copying skill files to target directories). Infrastructure work for distributing the framework itself, not a coding accuracy tool.
- **Off-mission:** ✅ Framework distribution, not AI coding.

### 6. `deprecate-skill/SKILL.md` — **REMOVE**
- **Size:** 118 lines
- **Reason:** Framework lifecycle management: marking skills deprecated, managing sunset periods, generating deprecation notices. Pure repo-admin work.
- **Off-mission:** ✅ Repo governance, not AI coding.

### 7. `writing-skills/SKILL.md` — **REMOVE from core**
- **Reason:** Recipe for authoring new SKILL.md files within the Vibe Coding OS repo. This is about contributing TO the framework, not using it to write better code.
- **Off-mission:** ✅ Meta-authoring for the framework itself.

### 8. `skills/core/writing-plans/SKILL.md` — **MERGE with plan-from-spec**
- **Reason:** Thin wrapper around plan authoring that overlaps substantially with `plan-from-spec` and `plan-driven-execution`. The decision tree docs already acknowledge these are near-interchangeable.
- **Duplicate of:** `skills/core/plan-from-spec/SKILL.md`, `skills/core/plan-driven-execution/SKILL.md`

### 9. `shared-domain-language/SKILL.md` — **REMOVE**
- **Reason:** Maintains a glossary of terms with "Avoid:" synonym lists and ambiguity logs. Nice project management aid but zero impact on code accuracy or AI autonomy.
- **Off-mission:** ✅ Terminology governance, not coding.

### 10. `skills/core/multi-repo-learning/SKILL.md` — **REMOVE**
- **Reason:** Cross-repository lesson sharing with export/import/privacy workflows. Nice-to-have for teams, but not essential for the core mission of AI code accuracy or autonomy.
- **Off-mission:** ✅ Cross-team collaboration, not accuracy/autonomy.
- **Duplicate of:** `skills/core/lessons-learned-db/SKILL.md` (same concept, single-repo scope)

### Honorable Mentions (Borderline)
- `skills/core/external-skill/SKILL.md` — Example/template skill for marketplace. Pure meta.
- `skills/core/sandbox-marker/SKILL.md` — Metadata tagging. Useful but minimal impact.
- `skills/core/project-constitution/SKILL.md` — Useful but philosophical; 88 skills already imply "constitution"
- `skills/core/prompt-architecture/SKILL.md` — About writing prompts FOR the framework, not about AI code accuracy
- `skills/core/prototype-before-commitment/SKILL.md` — General engineering discipline, not accuracy-specific

---

## TOP 5 DUPLICATE PAIRS

### 1. `verification-before-done` ↔ `verification-before-done`
- **Files:** `skills/core/verification-before-done/SKILL.md` (previously also `skills/core/verification-before-done/SKILL.md` — merged)
- **Evidence:** `verification-before-done` literally says in its own "Superpowers alignment" section: *"Use with `verification-before-completion` as the local completion gate alias."* It openly admits it's an alias.
- **Resolution:** Merge into `verification-before-completion`. The "5-axis runtime verification" table from `verification-before-done` can be an additional section in the merged file.

### 2. `quality-execution-contract` ↔ `quality-execution-contract`
- **Files:** `skills/core/quality-execution-contract/SKILL.md` (previously also `skills/core/quality-execution-contract/SKILL.md` — merged)
- **Evidence:** `quality-shield` step 1 is literally: *"Use `skills/core/quality-execution-contract/SKILL.md` for the full contract format."* The shield is a 5-step wrapper where the contract is step 1, context-pack is step 2, then smallest-diff + self-review + scorecard. The core value lives in the contract.
- **Resolution:** Merge quality-shield into quality-execution-contract as a "full workflow" subsection. Keep one entry point, not two.

### 3. `brainstorming` ↔ `creative-parallel-exploration` ↔ `zoom-out-system-context`
- **Files:** `skills/core/brainstorming/SKILL.md`, `skills/core/brainstorming/SKILL.md`, `skills/core/brainstorming/SKILL.md (merged)`
- **Evidence:** All three are "explore options before coding" skills with nearly identical workflows (restate → list options → trade-offs → choose). Brainstorming offers 2-4 approaches. Creative-parallel-exploration adds scoring. Zoom-out adds system-level view. The differentiation is too thin for 3 separate 60-73 line files.
- **Resolution:** Merge into one skill with 3 tiers: lightweight (brainstorming), structured (parallel-exploration), architecture-focused (zoom-out).

### 4. `grill-user-before-building` ↔ `grill-with-docs`
- **Files:** `skills/core/grill-user-before-building/SKILL.md` vs `skills/core/grill-user-before-building/SKILL.md`
- **Evidence:** Both are user interview skills. The only difference: grill-with-docs also updates CONTEXT.md and ADR candidates. grill-user-before-building has the 95% confidence protocol. These should be one skill with an optional "update docs" flag.
- **Resolution:** Merge into `grill-user-before-building` with an optional "persist to CONTEXT.md" step.

### 5. `what-before-how` ↔ `spec-first-development`
- **Files:** `skills/core/spec-first-development/SKILL.md` vs `skills/core/spec-first-development/SKILL.md`
- **Evidence:** `spec-first-development` step 5 is: *"Apply what-before-how: keep technical choices out of the spec."* It literally invokes what-before-how as a step. These are the same discipline at different granularity levels.
- **Resolution:** Merge what-before-how into spec-first-development as a principle section.

---

## KEEP-DEFINITIVELY LIST

These skills DIRECTLY improve accuracy or enable autonomous looping:

### Core Accuracy (catch bugs, prevent errors, improve code quality)
| Skill | Why Keep |
|-------|----------|
| `quality-execution-contract` | Forces explicit intent + acceptance criteria before coding |
| `verification-before-completion` | Evidence bar — don't claim done without proof |
| `critique-pass-protocol` | Lightweight pre-delivery critic pass |
| `safe-refactor` | 5-phase protocol for safe refactoring |
| `self-review-before-response` | Mandatory diff self-review before delivery |
| `test-driven-development` | Red-green-refactor loop |
| `bug-fix-lifecycle` | Systematic bug fixing workflow |
| `code-context-pack` | Right-size context window (reduces hallucination) |
| `review-before-merge` | Pre-merge quality check |
| `incremental-review` | Efficient re-review after changes |
| `adversarial-code-review` | Red-team review of code changes |
| `code-intelligence-review` | Structure-aware code review |
| `secure-coding-checklist` | OWASP-mapped security checklist |

### Core Autonomy (loop without user intervention)
| Skill | Why Keep |
|-------|----------|
| `goal-driven-execution` | Turn imperative → verifiable goal + step checks (critical for auto-loop) |
| `adaptive-flow` | Tier-based workflow — lightweight for tiny tasks, heavy for risky ones |
| `adaptive-prompt-selection` | Auto-select quality packs by task type |
| `model-weakness-memory` | Track model failure patterns, auto-inject checks (self-improving) |
| `model-aware-config` | Adapt quality gates to model capabilities |
| `orchestration-workflows` | Multi-stage workflows with quality gates |
| `subagent-driven-development` | Delegated worker passes |
| `task-state-tracking` | Track task states without runtime (enables loop continuation) |
| `spec-first-development` | Spec discipline before coding |
| `plan-from-spec` / `plan-driven-execution` | Plan → ordered implementation steps |
| `task-breakdown-from-plan` | Decompose into grabbable tasks |
| `checkpoint-validation` | Phase gates between spec/plan/implement |
| `systematic-debugging` / `disciplined-diagnosis` | Structured debug workflow |

---

## FRAMEWORK-BLOAT SCORE

### Score: **8 / 10** — Significant bloat

**Breakdown by category:**

| Category | Skills | Mission-Relevant | Bloat % |
|----------|--------|-----------------|---------|
| Core (89 skills) | 89 | ~45 | ~50% |
| Checklists (5) | 5 | 4 | 20% |
| Prompts (15) | 15 | ~8 | ~47% |
| Agents (8) | 8 | ~5 | 37% |
| Memory (20) | 20 | ~5 | 75% |
| Meta (12) | 12 | ~2 | 83% |
| **TOTAL (152 skills)** | **152** | **~65** | **~57%** |

**Key findings:**
- The repo has **~65 skills that directly serve the mission** out of 152 total. The rest (~87) are framework administration, cross-repo collaboration, security red-teaming, DevOps operations, meta-authoring, philosophical frameworks, or duplicates.
- The `memory/` layer has 20 skills for what should be 4-5 core memory skills.
- The `meta/` layer has 12 skills that are almost entirely about maintaining the framework itself.
- `guard-bypass-protocol` alone is 20KB — more than 10 core skills combined — and serves zero mission purpose.
- 120 commands and 110 templates compound the bloat: many are thin wrappers around skills that are themselves thin wrappers around other skills.

**Impact on accuracy/autonomy:**
- Every unnecessary skill in the context window dilutes attention from mission-critical checks
- Loading 152 skills' worth of guidance guarantees the agent will optimize for process compliance over code quality
- The framework's own anti-pattern catalog (in `skills/README.md`) warns: *"Loading too many skills and overwhelming the context window"* — yet the framework has 152 skills

---

## RECOMMENDATIONS SUMMARY

1. **Immediate removals (6 skills):** guard-bypass-protocol, red-team-bypass, observability-design, install-skill, deprecate-skill, writing-skills
2. **Immediate merges (5 pairs → 5):** verification-before-done→before-completion, quality-shield→quality-execution-contract, brainstorming+creative-parallel-exploration+zoom-out→one, grill-user+grill-with-docs→one, what-before-how→spec-first
3. **Move to optional/runtime (3 skills):** doubt-driven-development, shared-domain-language, multi-repo-learning
4. **Trim memory/ from 20 → 5 core skills**
5. **Trim meta/ from 12 → 3 core skills** (skill-content-search, skill-deps-graph, using-vibe-coding-os)
6. **Target: 65-70 core skills, not 152**

After trimming: the repo would go from **152 skills to ~65** (57% reduction), with every remaining skill directly serving accuracy or autonomy. Context windows would load 2-3x faster. Agent behavior would sharpen from "follow the framework's process" to "write correct code, verify it, loop."
