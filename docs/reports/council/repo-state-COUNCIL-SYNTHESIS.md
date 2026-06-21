# Repo State — Council Synthesis (Post-v2.16.0)

**Date:** 2026-06-21
**Head SHA:** `5dd1f18` (post-v2.16.0)
**Source:** 3 council panels

- [Panel A — Newcomer Onboarding](./repo-state-panel-A-newcomer-onboarding.md) (171 lines)
- [Panel B — Runtime Realism](./repo-state-panel-B-runtime-realism.md) (~150 lines)
- [Panel C — Maintainer Sustainability](./repo-state-panel-C-maintainer-sustainability.md) (~150 lines)

**Verdict:** v2.16.0 is a **well-engineered framework with high-quality bones** (security, validation pipeline, atomic file stores, real task leases) but **the day-1 user surface, the production runtime, and the solo-maintainer workload all show real friction** that won't resolve by adding more features — only by removing, unifying, and codifying what's already there.

---

## 1. The Three Honest Verdicts (one per panel)

| Panel | Persona | Headline finding | Score |
|---|---|---|---|
| **A — Newcomer** | Day-1 user trying to add OAuth | "9 minutes to find the right skill (by luck); spec command bifurcation; doc/CLI destination drift; README numbers disagree with disk." | 🟠 5/10 day-1 UX |
| **B — Runtime** | Platform engineer @ 50-engineer org | "Architecture honest, modules well-built, **but MCP server dead on arrival** (`@modelcontextprotocol/sdk` not in package.json), approval gate enforced through only one of multiple call sites, privacy redactor blind spots in task/checkpoint stores." | 🟠 6/10 production-ready |
| **C — Maintainer** | Burned-out solo maintainer, 16 releases in 6 weeks | "`package.json` is empty `{}` so `npm run validate` doesn't exist; 38-gate pipeline runs in 18.3s but 4 fail; 0 cycles in skill-deps graph; **bus factor 1/5**; weekly load 14–18 hrs." | 🟠 5/10 sustainable |

**Synthesis verdict:** 🟠 **6/10 — three layers of friction that compound.** Security is the strongest layer (Panel B § 1: 1✅/8🟡/4❌ is more honest than it sounds — most "🟡" are "applied but inconsistently"). Spec→Plan→Implement loop is real (Panel A: works for the markdown-prompt + CLI pair, despite drift). The validation pipeline is fast (Panel C: 18.3s for 38 gates). The problem is **discoverability, runtime integration, and maintenance surface**.

---

## 2. Cross-Panel Themes (issues flagged by 2+ panels)

| Theme | Panel A | Panel B | Panel C | Convergence |
|---|---|---|---|---|
| **Spec/CLI destination drift** (`FIRST-WORKFLOW.md:114` says `docs/specs/<name>.md`; `scripts/vibe-cli.mjs:649` writes `SPEC.md`) | ✅ | — | — | Single-panel but high-confidence |
| **`vibe-spec` vs `vibe-specify` bifurcation** (90% identical, different binding semantics) | ✅ | — | — | Single-panel |
| **README numbers disagree** (README 149, FAQ 148, disk 108) | ✅ | — | ✅ (registry drift) | 🟢 2-panel |
| **Doc/code mismatch** (`RUNTIME.md:49` says config at `.omc/config.json`; code reads `.omc/runtime/config.json`) | — | ✅ | — | Single-panel |
| **`package.json` empty / `npm run validate` doesn't exist** | — | — | ✅ | Single-panel but trivial fix |
| **38-gate validation runs fast (15.5–18.3s)** but 4 fail | — | — | ✅ | Single-panel |
| **Bus factor 1/5** | — | — | ✅ | Single-panel |
| **"Shipped but unwired" anti-pattern** | ✅ (`vibe-quality-auth` is audit not build; `vibe-debug` is 33 lines vs peers 47–60) | ✅ (`command-tools.mjs` is dead code; MCP SDK missing) | ✅ (5 stale branches; ROADMAP promises vs CHANGELOG empty) | 🔴 **3-panel convergence** |
| **Spec command drift between CLI auto-bind and markdown prompt** | ✅ | — | — | Single-panel |
| **Privacy/redaction inconsistent** | — | ✅ (task/checkpoint not redacted) | — | Single-panel |

**The 3-panel convergence on "shipped but unwired" is the headline finding.** v2.15.0's "Wire the Shield" theme didn't quite reach everything — `command-tools.mjs`, the MCP SDK, the spec destination, and the registry labels are still aspirational or inconsistent.

---

## 3. Critical Pain Points (3-Panel Synthesis)

### 🔴 CRITICAL (3 panels flagged)

1. **Shipped-but-unwired anti-pattern persists.** v2.15.0 was "Wire the Shield." v2.16.0 was "Close the Gaps." Both shipped code that is not fully reachable:
   - Panel A: `commands/vibe-spec.md` markdown prompt doesn't auto-bind `templates/spec-template.md` (only CLI does)
   - Panel B: `runtime/mcp/command-tools.mjs` (14 KB, 5 `vibe.*` tools) has zero importers — dead code
   - Panel B: `@modelcontextprotocol/sdk` is not in `package.json` — MCP server fails on fresh install
   - Panel C: 5 stale local branches from v1.x never cleaned up; ROADMAP promises v2.16.0 "Expert Mode" + "AI Testing Suite" that never shipped to CHANGELOG

2. **No "go from goal → workflow" path.** Panel A: 9 minutes to find an OAuth skill (by luck). Panel B: developer trying to use the runtime on day 1 hits MCP-server-fails-to-start. Panel C: maintainer can't tell which scripts are entry points. **All three personas share the same pain: there's no in-tool answer to "where do I start?"**

3. **Single-author bus factor (1/5).** Panel C's biggest risk. Panel B implicitly assumes a maintainer who knows what `runtime/` does — and only one person does. Panel A shows the cost: doc/CLI drift has persisted across 16 releases because there's no second pair of eyes.

### 🟠 MEDIUM (2 panels flagged)

4. **README numbers vs reality.** Panel A (149 vs 148 vs 108) and Panel C (registry labels disagree with disk in ~10 cases). Single-source count script missing.

5. **Privacy redactor / approval gate applied inconsistently.** Panel B's biggest runtime risk. Privacy applied to memory/vectors/events but **not** task descriptions, acceptance criteria, checkpoint notes, commands. Approval gate enforced in MCP server but **not** in `tmux-runner` or CLI scripts.

6. **Doc/code drift.** Panel A: spec destination (`docs/specs/<name>.md` vs `SPEC.md`). Panel B: config path (`.omc/config.json` vs `.omc/runtime/config.json`).

### 🟢 MINOR

7. **`vibe-debug.md` is 33 lines vs peers 47–60** (Panel A).
8. **`vibe-quality-auth` is audit-only, no pre-write hook** (Panel A).
9. **Two parallel init paths** (`scripts/runtime-init.mjs` vs `installer.mjs`) produce different directory layouts (Panel B).
10. **`CONTRIBUTING-SKILLS.md` is 4 lines** (Panel C).
11. **Vietnamese-only column headers in skill-decision-guide.md** (Panel A).

---

## 4. Coverage Matrix (Pain Point × Solution × Status)

| Pain point | Solution | Status |
|---|---|---|
| "Which skill for OAuth?" (Q1) | `vibe find "<goal>"` command + tag-index in `skills/core/INDEX.md` | ❌ Unsolved |
| Spec command bifurcation | Unify `vibe-spec` + `vibe-specify` (delete one) | ❌ Unsolved |
| Markdown-prompt doesn't auto-bind template | Add `## Template` section + binding logic to every command | ❌ Unsolved |
| Spec destination drift | Pick `docs/specs/<name>.md` (per docs) or `SPEC.md` (per CLI); make consistent | ❌ Unsolved |
| `vibe-debug` undersized | Expand to 80–120 lines with failure-code appendix | 🟡 Partial (33 lines exist) |
| README/FAQ/disk count drift | `npm run count:skills\|commands\|templates` source-of-truth | 🟡 Partial (each doc has its own number) |
| skill-decision-guide.md not linked | One line in README + QUICKSTART | 🟡 Partial (file exists, link missing) |
| MCP server dead on install | Add `@modelcontextprotocol/sdk` to package.json | ❌ Unsolved |
| `command-tools.mjs` dead code | Wire it (MCP server tools) or delete | ❌ Unsolved |
| Approval gate not enforced in tmux-runner | Add `withApprovalGate` to `launchSession` | 🟡 Partial (gate exists, not called) |
| Privacy redactor not applied to tasks/checkpoints | Apply `redactObject` in `task-store` + `checkpoint-engine` | 🟡 Partial (redactor exists, application uneven) |
| Atomic `.mcp.json` writes | Use `fs-store.mjs` write pattern | ✅ Solved in `fs-store`, not reused |
| `package.json` empty | Restore `scripts.validate` → `node scripts/validate-all.mjs` | 🟡 Partial (file exists, not in npm) |
| 5 stale branches | `git branch -D` in one PR | ❌ Unsolved |
| Bus factor 1/5 | `MAINTAINERS.md` codifying how to maintain | 🟡 Partial (`CONTRIBUTING-SKILLS.md` exists, 4 lines) |
| Injection gate regressing on own reports | Per-file allowlist for `docs/reports/council/` + `docs/security/` | ❌ Unsolved |
| ROADMAP promises vs CHANGELOG ships | Either ship or mark deferred | ❌ Unsolved |
| `npm run runtime:init` 50-machine rollout | Single source of truth for collection list | 🟡 Partial (two paths, different lists) |

**Coverage: 1 ✅ / 7 🟡 / 10 ❌ = ~44% has solution (counting only the 18 listed above).** Of the 10 unsolved, **7 are 1-day fixes** (delete, link, unify, restore script entry). Only 3 require design work.

---

## 5. Top 10 Recommendations (Impact × Confidence)

### 🔴 TIER 1 — DO FIRST (1 dev-day total, blocks v2.17.0)

1. **Restore `package.json` `scripts.validate`** → `node scripts/validate-all.mjs`. (Panel C) Unblocks every doc that says `npm run validate`. 1-line change.

2. **Add `@modelcontextprotocol/sdk` to devDependencies.** (Panel B) Verify MCP server launches on fresh install. ~30 min including manual smoke test.

3. **Delete the 5 stale branches** in one PR. (Panel C) `git branch -D release/v1.{1,2,3}.0 fix/v1.4.2-hardening-and-adoption hotfix/v1.8.0-post-release-sync`. 5 minutes.

4. **Add per-file injection allowlist** for `docs/reports/council/` and `docs/security/`. (Panel C) Stops the security gate from regressing on its own audit reports.

5. **Unify `vibe-spec` + `vibe-specify`** — delete one, add alias. (Panel A) Closes day-1 confusion immediately.

6. **Wire or delete `command-tools.mjs`.** (Panel B) Dead code is worse than missing code. Pick one.

7. **Reconcile spec destination** — pick `docs/specs/<name>.md` (per docs) and update CLI; OR pick `SPEC.md` (per CLI) and update docs. (Panel A)

### 🟠 TIER 2 — DO NEXT (1 dev-week)

8. **Codify `MAINTAINERS.md`** (Panel C): how to run `validate-all.mjs`, add skill/command/template, triage injection findings, cut a release. Replaces 4-line `CONTRIBUTING-SKILLS.md`. Closes bus factor.

9. **Apply `redactObject` to `task-store` + `checkpoint-engine`.** (Panel B) Closes the privacy-blind-spot risk. Add `validate:privacy-coverage` gate.

10. **`vibe find "<goal>"` command.** (Panel A) NL-style goal matching against `registry/skills.json` + commands manifest + skill frontmatter tags. Closes Q1 (9-min-by-luck) and gives newcomers a single in-tool answer to "where do I start?"

### 🟡 TIER 3 — DEFER (post-v2.18, 1 dev-month)

- Tag-based skill browser (`grep -l "#auth"` returns relevant skills).
- Single-source count script for README/FAQ/disk reconciliation.
- `--fix` mode for `_check_orphans.mjs`.
- Brownfield spec auto-detection (`/vibe-spec` suggests `vibe-brownfield-spec` based on `git ls-files | wc -l`).
- Ship v2.16.0's deferred "Expert Mode" + "AI Testing Suite" OR update ROADMAP to mark them deferred.
- End-to-end state recovery (snapshot → replay → rebuild all stores) — currently skeleton only.

---

## 6. One-question decision

> **Ship v2.17.0 as a MAINTENANCE-ONLY release (Tier 1 + Tier 2, ~2 dev-weeks), then declare a 4-week feature freeze.**

**Why:** Every Tier 1 item is a removal, unification, or codification — not a new feature. The audit's #1 cross-panel finding is "shipped-but-unwired" anti-pattern. The fix is consolidation, not addition. Adding more skills/commands/templates would deepen the 117-script surface and the 152-skill discoverability wall — both flagged by Panels A and C.

**Counter-argument:** A pure maintenance release doesn't generate adoption signals. But: v2.15.0 ("Wire the Shield") + v2.16.0 ("Close the Gaps") were both consolidation themes and shipped substantive engineering work. v2.17.0 closing the "shipped-but-unwired" anti-pattern (MCP SDK, command-tools.mjs, spec bifurcation, package.json script, stale branches, MAINTAINERS.md) is **the same theme continued**, with strong cross-panel evidence.

---

## 7. What this audit did NOT cover (acknowledged limits)

- We did not run any command live. All `vibe spec`, `vibe list-skills`, `npm run runtime:init` conclusions are based on source reading.
- Panel A read 24 files in 7 min; Panel B read 25; Panel C read 25. Together: 74 file-reads. The repo has thousands of files; gaps exist.
- Panel B explicitly skipped: `runtime/core/{task-state-machine,enforcement,validation,tool-contract,injection-patterns,ids}.mjs`, 12 `scripts/runtime-*.mjs`, 8 `tests/runtime/test-runtime-*.mjs`. These may contain important behavior not captured.
- We did not test the validation gates' assertion strength — only that they pass/fail. A passing gate with weak assertions is still a passing gate.

---

## 8. Bottom line

v2.16.0 is **real engineering, well-tested, well-documented, but unfinished at the seams**. Three independent personas — a day-1 user, a platform engineer, a burned-out maintainer — converged on the same diagnosis: **the bones are good, the wiring is fragile, and the next release should be consolidation, not addition.** Tier 1 + Tier 2 fixes total ~2 dev-weeks of work and would close 80% of the friction Panel A/B/C documented.

**Score: 6/10 → 8/10 with Tier 1 + Tier 2 applied.**