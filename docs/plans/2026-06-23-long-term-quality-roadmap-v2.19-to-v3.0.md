# Long-Term Quality Roadmap — Vibe Coding OS (v2.19 → v3.0)

**Created:** 2026-06-23
**Author:** Repo-wide review + roadmap pass
**Baseline reviewed:** v2.18.0 ("Surface Simplification") — 112 skills · 115 commands · 107 templates · 22 sources · 9 adapters · 14 validation gates
**Method:** Full directory-tree review + close reading of README, CONSTITUTION, ROADMAP-STATUS, CHANGELOG, and the two most recent expert council syntheses (`v2.17.7-expert-review`, `repo-state-COUNCIL-SYNTHESIS` post-v2.16.0). No live commands were run in this review.

---

## 0. TL;DR — One-sentence thesis

> The repo no longer has a *capability* problem; it has a **surface, sustainability, and "does-it-actually-work-at-runtime" problem.** The next phase must shift the project's measure of quality from *"how many gates pass"* to *"how good is the code the agent ships, proven by behavior"* — while shrinking cognitive surface and de-risking the single-maintainer bottleneck.

This roadmap is deliberately **consolidation-and-proof first, features last**. It directly continues the verdict of the v2.17.7 council ("v2.18 should be surface simplification, not feature addition") and extends it into a durable multi-quarter plan.

---

## 1. Where the repo actually stands (honest baseline)

### Real strengths (protect these — do not regress)
1. **Audit → fix discipline.** Every recent release closes the prior audit's Tier-1 items, with test counts. This is the rarest and most valuable cultural asset here.
2. **Fast, rich validation pipeline.** 14 gates in `validate:all`, plus property tests, benchmark gate, dead-export analyzer, and docs/source-of-truth sync.
3. **Security is the strongest layer.** ADR 0003 (3-layer defense), ADR 0004 (adaptive trust), 30-pattern redactor, MCP token auth + injection scan with real tests.
4. **Defensive runtime code.** `loop.mjs` has iteration caps and best-effort error handling; `doctor.mjs` has 11 health checks and degrades gracefully offline.
5. **Institutional memory.** CONSTITUTION + ADRs + traceability mean decisions survive without depending on one person's head.

### Verified open issues (the four "vibe-code" failure modes to solve)
The single biggest theme across both councils is the **"shipped-but-unwired" anti-pattern** — code that exists but isn't reachable, docs that disagree with code, gates that pass with weak assertions. That *is* the "vibe code" smell, applied to the framework itself. The four durable issues:

| # | Issue (verified by council) | Why it blocks "best quality" |
|---|---|---|
| **I1** | **Surface too large vs. core value.** 112 skills / 115 commands / 107 templates / ~97 npm scripts / ~30 root `.md`. | Newcomers have no single path; "kho công cụ" feeling, not an opinionated product. |
| **I2** | **Tests prove structure, not behavior.** Most gates check metadata/heading/import/orphan/traceability. A passing gate with a weak assertion is still a pass. | "Quality gate green" ≠ "the agent's output is correct." This is the core gap between *looking* disciplined and *being* reliable. |
| **I3** | **Bus factor ~1.5/5 + unsustainable release cadence** (16+ releases in 6 weeks, one person). | The same person who creates drift is the only one who cleans it. Not durable. |
| **I4** | **Inconsistent application of cross-cutting concerns** (redaction/approval historically uneven; two init paths; "runtime frozen" message vs. shipped autopilot runtime). | Uniformity is what separates a real OS from a pile of scripts. v2.18 closed redaction; the *pattern* of uneven application must be made structurally impossible. |

> Note: v2.18.0 already closed several of these partially (Core 10, README trim, `validate:privacy-coverage`, opt-in network in doctor, MAINTAINERS runbook). This roadmap takes the **next** step on each, plus the deferred-but-important item the council flagged as "🟡 partial": **end-to-end runtime behavior testing (I2)**.

---

## 2. Guiding principles for this roadmap (derived from the project's own Constitution)

1. **Consolidation beats addition.** No release adds a 116th skill unless it deletes or merges two others. Net surface should *trend down or flat*, never up, until I1 is resolved.
2. **Prove behavior, not shape.** Every release in this plan must add at least one *behavioral* assertion (runtime e2e, golden-output, or adversarial), not just another structural gate.
3. **Make uniformity structural, not manual.** Cross-cutting concerns (redaction, approval, init) are enforced by a single choke-point + a gate that fails if a new store bypasses it — never by "remember to call it."
4. **Distribute the steering wheel.** Every phase has an explicit "could a second person do this?" exit criterion: runbooks, fixed cadence, contributor on-ramps.
5. **Quality is measured by the agent's output, not the framework's.** The north-star metric moves from "14/14 gates" to a **first-try-correctness benchmark score** (the `benchmarks/deepseek-ab` harness already exists — make it the headline KPI).

---

## 3. North-star metric (new)

Adopt a single, public, trend-tracked quality number and put it in the README instead of (or beside) the gate count:

```
First-Try Quality Score (FTQS)
= mean over benchmark tasks of:
    correctness(first attempt)  × 0.5
  + no-hallucinated-API         × 0.2
  + spec-adherence              × 0.2
  + minimalism (no over-eng)    × 0.1
```

- Source of truth: `benchmarks/deepseek-ab/` (arm-A control vs. arm-B framework). This already exists with `score-firsttry.mjs`, `score-hallucination.mjs`, `score-rubric.mjs`.
- **Action:** expand the task set from 2 (`01-parse-csv`, `04-no-invented-api`) to **≥20 tasks** across the workflow surface, run it per release, persist history (already supported via `docs/reports/benchmarks/history/`), and chart it on the dashboard.
- This converts the project's entire value proposition ("discipline makes mid-tier models ship better code") into a number you can move — and that a contributor can be handed.

---

## 4. Phased roadmap (v2.19 → v3.0)

Each phase is scoped to ~1–2 weeks of focused work at a **sustainable** cadence (1 minor / ~2 weeks, patches as needed — not daily releases).

### Phase 1 — v2.19.0 "Behavior over Shape" (PROOF)
**Goal:** Close I2. Make at least one full runtime path provably correct, and stand up the FTQS benchmark as the headline metric.

| Deliverable | Acceptance criterion |
|---|---|
| Runtime e2e test: `snapshot → replay → rebuild all stores` | A corrupted/partial store is recovered to a byte-stable state; test asserts store *contents*, not just "no throw". |
| `doctor.mjs` edge-case tests | Corrupt store, stale lock, `NaN createdAt` (the real v2.17.4 bug) each produce the correct diagnosis + exit code. |
| FTQS harness expanded to ≥20 benchmark tasks | `npm run benchmark` produces an FTQS number; history persisted; dashboard shows trend. |
| FTQS published in README + DASHBOARD | The headline number is FTQS, with gate count demoted to a secondary line. |
| New gate `validate:behavior-assertions` | Fails if a runtime test file contains only `assert(!throws)` style checks with no content assertion (anti-weak-assertion lint). |

**Exit:** A second person could run `npm run benchmark` and read one number that means "is the framework making output better."

---

### Phase 2 — v2.20.0 "One Front Door" (SURFACE)
**Goal:** Close I1. Collapse the cognitive surface so a newcomer reaches first value in <10 minutes without luck.

| Deliverable | Acceptance criterion |
|---|---|
| `vibe find "<goal>"` command (deferred since post-v2.16 council) | NL-style match against `registry/skills.json` + command manifest + frontmatter tags; returns the right skill for "add OAuth" on the first try. |
| Surface audit & merge pass | Net skill+command count **goes down** by ≥10% via merging near-duplicates (e.g. plan-* family) and demoting rarely-used ones to an `advanced/` tier in registries. |
| Root `.md` consolidation completed | ≤12 files at repo root; the rest moved to `docs/` with pointers (continue v2.18 direction). |
| `skills/core/INDEX.md` becomes the single map | Every skill tagged with one of the 8 lifecycle stages + a "core vs advanced" flag, consumed by `vibe find`. |
| Single source-of-truth count script | `npm run count:all` exists from the v2.18 source sync; v2.20 hardens adoption so README/FAQ/dashboard and future manifests keep reading from it. |

**Exit:** "Where do I start?" has one in-tool answer (`vibe find`) and one doc answer (Core 10). Counts can never drift again.

---

### Phase 3 — v2.21.0 "Structural Uniformity" (CORRECTNESS BY CONSTRUCTION)
**Goal:** Close I4 permanently. Make it *impossible* to add a store/path that skips a cross-cutting concern.

| Deliverable | Acceptance criterion |
|---|---|
| Single write choke-point for all user-data stores | task/checkpoint/memory/event/session/team stores all write through one `persist()` that calls `redactObject` + approval-gate; direct `fs.write` in store modules is banned. |
| `validate:privacy-coverage` upgraded to structural | Gate parses store modules and fails if any bypasses the choke-point — not just "redactObject appears somewhere". |
| Approval gate enforced at every call site | `tmux-runner` + CLI go through the same `withApprovalGate` as MCP; test asserts a denied approval blocks the action in all three. |
| Unify the two init paths (`runtime-init.mjs` vs `installer.mjs`) | One produces the layout; the other is a thin alias or deleted. Doctor confirms a single canonical layout. |
| Message-consistency sweep | No doc says "runtime frozen" without the v2.18 amendment context; `validate:roadmap-future-drift` extended to catch contradictory posture claims. |

**Exit:** A new store *cannot* ship without redaction + approval; init has one canonical path.

---

### Phase 4 — v2.22.0 "Two Hands on the Wheel" (SUSTAINABILITY)
**Goal:** Close I3. Make the project survivable by more than one person and at a humane pace.

| Deliverable | Acceptance criterion |
|---|---|
| Fixed cadence codified + enforced | `MAINTAINERS.md` declares 1 minor / 2 weeks; a CI check warns if >2 releases land in 7 days (anti-burnout signal). |
| Council-report retention policy enforced | A gate keeps only synthesis + 2 most-recent audits in the live tree; older ones auto-zipped to `archive/` (script already exists — wire it to CI). |
| Co-maintainer on-ramp | `docs/maintainer-guide.md` has a "your first PR as co-maintainer" path; ≥3 "good first issue" templates created from the deferred Tier-3 list. |
| Contribution friction audit | A non-author can add a skill end-to-end (skill → registry → gate green) following only the runbook, in <30 min — recorded as a walkthrough. |
| Bus-factor metric on dashboard | Track + display contributor count and "files only one person has touched". |

**Exit:** The deferred items and routine maintenance can be handed off; cadence is sustainable.

---

### Phase 5 — v3.0.0 "Proven Discipline" (FLAGSHIP RELEASE)
**Goal:** Ship the consolidated, behavior-proven, single-front-door, two-maintainer framework as a confident 3.0.

| Deliverable | Acceptance criterion |
|---|---|
| FTQS ≥ target (set baseline in Phase 1, e.g. arm-B beats arm-A by ≥25% first-try correctness) | Headline claim is backed by the benchmark, not assertion. |
| Net surface flat-or-down vs v2.18 | Skill/command count ≤ v2.18 despite added capability. |
| All four issues (I1–I4) closed with structural gates, not manual discipline | Each has a gate that fails on regression. |
| 3.0 positioning rewrite | README leads with the FTQS number + Core 10 + `vibe find`; "shipped-but-unwired" anti-pattern declared structurally extinct. |
| Migration/upgrade notes v2.x → v3.0 | Clean, tested upgrade path. |

**Exit:** v3.0 is defensible as "the framework that *measurably* makes AI coding output better, proven by behavior, maintainable by a small team."

---

## 5. Cross-cutting workstreams (run through all phases)

- **Anti-weak-assertion discipline:** every new test must assert *content/behavior*, enforced by the Phase-1 lint gate.
- **Net-negative surface budget:** PR template gains a checkbox — "does this add net surface? If yes, what did it merge/remove?"
- **Benchmark-per-release:** FTQS runs in CI on every release tag; regressions block.
- **Bilingual sync:** keep `validate:bilingual-sync` green for every new doc (existing strength — don't drop it).
- **Security non-regression:** the security gate stays green; no phase trades security for speed.

---

## 6. Sequencing rationale (why this order)

1. **Proof first (Phase 1)** because without a behavior metric, every later "improvement" is unfalsifiable. You can't manage surface or sustainability if you can't tell whether quality moved.
2. **Surface second (Phase 2)** because discoverability is the #1 newcomer + product complaint and is mostly deletion/merging — high impact, low risk, and it shrinks the thing the next phases have to maintain.
3. **Uniformity third (Phase 3)** because once surface is smaller, making the remaining stores route through one choke-point is tractable and closes the only real security/integrity gap.
4. **Sustainability fourth (Phase 4)** because handing off a *smaller, proven, uniform* repo is realistic; handing off the v2.18 surface is not.
5. **Flagship last (Phase 5)** because 3.0 should be a statement of finished consolidation, not a feature dump.

---

## 7. What this roadmap deliberately does NOT do

- It does **not** add new agent capabilities, hosted services, or runtime expansion (respects ADR 0002 posture as amended in v2.18).
- It does **not** chase release count. Fewer, better, proven releases.
- It does **not** add structural gates for their own sake — each new gate must catch a real regression class (weak assertions, surface growth, choke-point bypass, count drift).

---

## 8. Open questions for the maintainer (resolve before Phase 1)

1. **FTQS target:** what uplift over the control arm counts as "success" for 3.0? (Suggested: ≥25% first-try correctness.)
2. **Surface reduction target:** is a 10% net cut acceptable, or more aggressive?
3. **Cadence:** is 1 minor / 2 weeks the right humane pace, or monthly?
4. **Co-maintainer:** is there a realistic candidate, or should Phase 4 focus on lowering contribution friction enough to attract one?

---

*This plan is intentionally falsifiable: every phase has a metric or a gate that proves it was actually done, in keeping with the project's own "prove behavior, not shape" principle.*
