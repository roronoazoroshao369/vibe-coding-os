# Trim Audit — COUNCIL SYNTHESIS

**Date:** 2026-06-21 | **Repo:** vibe-coding-os v2.16.1  
**Mission:** Repo exists for ONE purpose: make AI coding MORE ACCURATE, and enable AI to AUTONOMOUSLY code + auto-approve + loop until done.

---

## EXECUTIVE VERDICT

**3-panel convergence: ~57% of the repo is bloat. The remaining 43% is genuinely useful — but lacks 3 critical capabilities to deliver the mission.**

| Finding | Severity | Confidence |
|---------|----------|------------|
| 152 skills → only ~65 on-mission (57% bloat) | 🔴 High | Panel A + B + C agree |
| ~70% "quality" features are self-policing prompts, not enforcement | 🔴 High | Panel B + C agree |
| Zero static analysis (hallucinated APIs undetected) | 🔴 Critical | Panel B |
| approval-gate blocks ALL writes (auto-pilot impossible) | 🔴 Critical | Panel C |
| grill-user-before-building is interactive-only (blocks loop) | 🟠 High | Panel C + A agree |
| guard-bypass-protocol is harmful (424 lines of jailbreak tools) | 🔴 Critical | Panel A + B agree |

---

## CROSS-PANEL CONVERGENCE (3/3 panels flagged)

### 1. Guard Bypass Protocol Must Be Removed
- **Panel A:** "424 lines, zero mission relevance, creates liability"
- **Panel B:** "Actively harmful — teaches LLM to subvert safety filters. Zero bug-catching value."
- **Panel C:** "Blocks autonomy; user must approve every bypass attempt"
- **Decision:** REMOVE from core. Move to `skills/red-team/` if retention needed.

### 2. Quality-Shield ↔ Quality-Execution-Contract Must Merge
- **Panel A:** "Shield step 1 literally invokes the contract. Two entry points = confusion."
- **Panel B:** "Contract is genuinely useful; shield adds bureaucracy without enforcement."
- **Panel C:** "Shield's contract step is human-bound; needs auto-contract replacement."
- **Decision:** Merge into quality-execution-contract. Add auto-contract (JSON schema + git diff enforcement).

### 3. Brainstorming/creative-parallel-exploration/zoom-out Must Consolidate
- **Panel A:** "Three near-identical 'explore options' skills. Too thin for 3 files."
- **Panel B:** "All three are process prompts; none catch real bugs."
- **Panel C:** "Non-deterministic in loop; auto-pick top option needed."
- **Decision:** Merge into 1 skill with 3 tiers. Auto-pick in autopilot mode.

---

## THE 3 CRITICAL CAPABILITIES MISSING

| Capability | What It Means | Who Found It | Effort |
|-----------|---------------|-------------|--------|
| **Static Analysis Integration** | TypeScript/linter/import-exists checker to catch hallucinated APIs | Panel B | 4h |
| **Auto-Approve Policy** | approval-gate inverted: default-approve safe ops, default-deny destructive | Panel C | 8h |
| **Auto-Review Layer** | Replace human-in-loop review with auto-council (3 independent contexts) | Panel C | 5h |

---

## TOP RECOMMENDATIONS (Tiered)

### Tier 1 — DO FIRST (1-2 dev-days, high impact)

| # | Action | Files | Impact |
|---|--------|-------|--------|
| 1 | Remove guard-bypass-protocol from core | `skills/core/guard-bypass-protocol/` | Removes liability + 20KB bloat |
| 2 | Remove observability-design | `observability-design/` | Off-mission DevOps |
| 3 | Remove doubt-driven-development | `doubt-driven-development/` | Self-admits incompatible with loops |
| 4 | Remove install-skill + deprecate-skill | `install-skill/`, `deprecate-skill/` | Framework distribution, not coding |
| 5 | Remove writing-skills | `writing-skills/` | Meta-authoring |
| 6 | Remove red-team-bypass | `red-team-bypass/` | Overlaps secure-coding-checklist |
| 7 | Remove shared-domain-language | `shared-domain-language/` | Glossary maintenance, no accuracy impact |

**Result:** 7 removals → 152 → 145 skills. Removes 40KB+ of off-mission content.

### Tier 2 — MERGE DUPLICATES (1 dev-day)

| # | Merge | Into |
|---|-------|------|
| 8 | verification-before-done → before-completion | verification-before-completion |
| 9 | quality-shield → quality-execution-contract | quality-execution-contract |
| 10 | brainstorming + creative-parallel-exploration + zoom-out → one | brainstorming-auto |
| 11 | grill-user-before-building + grill-with-docs → one | grill-auto-defaults |
| 12 | what-before-how → spec-first-development | spec-first-development |

**Result:** 5 merges → 145 → 140 skills. Each remaining skill has unique value.

### Tier 3 — TRIM MEMORY + META (2 dev-days)

| # | Action | Target |
|---|--------|--------|
| 13 | Trim memory/ from 20 → 5 core skills | Keep: project-memory, session-memory, memory-compression, model-weakness-memory, memory-search |
| 14 | Trim meta/ from 12 → 3 core skills | Keep: skill-content-search, skill-deps-graph, using-vibe-coding-os |

**Result:** 140 → ~108 skills. 29% total reduction from 152.

### Tier 4 — BUILD AUTOPILOT (3-5 dev-days)

| # | Action | Files | Effort |
|---|--------|-------|--------|
| 15 | Add `runtime/autopilot/policy.mjs` | New file (~80 lines) | 4h |
| 16 | Add `runtime/autopilot/loop.mjs` | New file (~60 lines) | 3h |
| 17 | Add `vibe-autopilot`` | New file (~30 lines) | 1h |
| 18 | Add `adapters/*/autopilot-hook.mjs` | New files (~40 lines each) | 4h |
| 19 | Add `validate-imports.mjs` | New script (~100 lines) | 4h |
| 20 | Add `validate-typecheck.mjs` | New script (~60 lines) | 2h |
| 21 | Add `validate-scope-match.mjs` | New script (~80 lines) | 3h |

**Result:** Full autopilot stack + static analysis. ~450 lines new code.

### Tier 5 — REMOVE THEATER (ongoing)

| # | Action | Why |
|---|--------|-----|
| 22 | Remove quality-scorecard.mjs | Exits 0 unconditionally — produces noise |
| 23 | Remove vibe-triage.md | 36-line stub, no enforcement |
| 24 | Remove vibe-quality-rubric.md | Entirely self-discipline, no external check |
| 25 | Remove quality-trend-dashboard.mjs + quality-trend-report.mjs | Dashboard of non-data |

---

## COVERAGE MATRIX

| Pain Point | Solution | Status |
|-----------|----------|--------|
| AI hallucinates APIs | `validate-imports.mjs` (not yet built) | ❌ Unsolved |
| AI returns wrong types | `validate-typecheck.mjs` (not yet built) | ❌ Unsolved |
| AI adds scope creep | `validate-scope-match.mjs` (not yet built) | ❌ Unsolved |
| AI introduces silent regressions | `safe-refactor` protocol + `validate-regression.mjs` (not yet built) | 🟡 Partial |
| Security holes | `validate-secrets.mjs` + `validate-injection.mjs` + regression test | ✅ Solved |
| AI can't loop without asking | `approval-gate.mjs` inverted + `policy.mjs` (not yet built) | ❌ Unsolved |
| Too many skills dilute focus | Tier 1-3 trim (152 → ~108) | ❌ Not started |
| Guard-bypass creates liability | Remove from core | ❌ Not started |
| Duplicated skills confuse AI | Merge 5 pairs | ❌ Not started |
| Theater features waste context | Remove 4 zero-ROI features | ❌ Not started |

**Coverage: 1 ✅ / 1 🟡 / 8 ❌ = 10% solved.**

---

## AFTER FULL IMPLEMENTATION

| Metric | Before | After |
|--------|--------|-------|
| Skills | 152 | ~108 (29% trim) |
| Bug class coverage | ~25% | ~75% |
| Autonomy capability | Human-in-loop only | Auto-loop with trust-but-verify |
| Static analysis | None | TypeScript + import-check + scope-check |
| Guard-bypass liability | Present | Removed |
| Theater features | 5+ | 0 |

**Score: 6/10 → 8.5/10 with full Tier 1-5 applied.**

---

*Expert Council: Panel A (Scope Auditor) + Panel B (Quality Impact Analyst) + Panel C (Auto-Pilot System Architect)*  
*Reports: `trim-audit-panel-A-scope-auditor.md`, `trim-audit-panel-B-quality-impact.md`, `trim-audit-panel-C-autopilot-architect.md`*
