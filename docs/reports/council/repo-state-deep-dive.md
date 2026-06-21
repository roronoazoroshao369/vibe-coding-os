# Repo State Audit (Post-v2.16.0) — Deep Dive

> **Verdict:** v2.16.0 là framework có xương sống tốt (security, validation pipeline, atomic stores) nhưng 3 lớp friction chồng chéo: **day-1 discoverability, runtime production-readiness, solo-maintainer sustainability**. Score: **6/10**.

---

## TL;DR (3 bullets)

- **Cross-panel convergence:** "Shipped but unwired" anti-pattern vẫn còn — `command-tools.mjs` dead code, MCP SDK thiếu, `vibe-spec`/`vibe-specify` chẻ đôi, ROADMAP hứa nhưng CHANGELOG rỗng.
- **Day-1 user mất 9 phút (may mắn) để tìm 1 skill OAuth** vì không có goal-finder, skill-decision-guide không link từ README, doc/CLI drift về spec destination.
- **Runtime "production-ready trên giấy" nhưng MCP server fail on fresh install** (`@modelcontextprotocol/sdk` không có trong package.json), approval gate chỉ enforce qua 1 trong nhiều call sites, privacy redactor không apply cho task/checkpoint.

---

## 1. Stats Hero

| Metric | Value |
|---|---|
| Head SHA | `5dd1f18` |
| Version | `2.16.0` |
| Last release date | 2026-06-20 |
| Validation gates | 38 (34 PASS, 4 FAIL, **18.3s wall**) |
| Skills | ~108 (README nói 149, FAQ nói 148) |
| Commands | 108 (README nói 116) |
| Templates | 128 (README nói 118) |
| Scripts | 117 (.mjs files) |
| Orphan templates | 38 / 111 |
| Skill-deps graph cycles | 0 (151 nodes, 76 edges) |
| Bus factor | **1/5** |
| Weekly effort | 14–18 hrs |

---

## 2. Three Panels — Verdicts

### Panel A: Newcomer Onboarding 🟠 5/10

> *"I'm a day-1 dev who just ran `npm install`. I want to add OAuth to my Express app. 9 minutes by luck to find the right skill."*

**Verified problems (with file:line citations):**

| Pain point | Evidence |
|---|---|
| 9-min-by-luck skill discovery | `grep -rE "oauth\|express" skills/` returns 0 actionable matches |
| Spec command bifurcation | `commands/vibe-spec.md` vs `commands/vibe-specify.md` 90% identical |
| Doc/CLI destination drift | `FIRST-WORKFLOW.md:114` says `docs/specs/<name>.md`; `scripts/vibe-cli.mjs:649` writes `SPEC.md` |
| `vibe-debug.md` is 33 lines vs peers 47–60 | `commands/vibe-debug.md:1-33` |
| README numbers disagree with disk | README 149 / FAQ 148 / filesystem 108 |
| `skill-decision-guide.md` not linked | `grep -n "skill-decision-guide" README.md` → 0 |
| `vibe-quality-auth` is audit not build | `commands/vibe-quality-auth.md:1-12` |

**10-step workflow trace (adding OAuth to Express):** 22 minutes to a usable spec; working OAuth flow not reachable in one session.

### Panel B: Runtime Realism 🟠 6/10

> *"I'm a platform engineer. If 50 devs run `npm run runtime:init` and try MCP, what breaks?"*

**Feature-vs-Reality matrix:**

| Claimed | Code reality | Status |
|---|---|---|
| Atomic JSON store | PID-suffixed tmp + rename | 🟡 Same-process only |
| Memory retention/stale | `stale` in docstring, no TTL code | 🟡 Doc lies |
| Task store with claim/lease | Real claim/lease + TTL + reaper | ✅ Real |
| MCP server (Claude Code plugin) | **`@modelcontextprotocol/sdk` not in package.json** | ❌ Broken |
| `command-tools.mjs` (5 tools) | Zero importers — dead code | ❌ Unwired |
| Approval gate | Only fires in MCP server, not tmux-runner | 🟡 Loophole |
| Privacy redactor everywhere | Not applied to task/checkpoint stores | ❌ Blind spots |
| Installer idempotent | `.mcp.json` write non-atomic | 🟡 Partial |
| Config at `.omc/config.json` | Code reads `.omc/runtime/config.json` | ❌ Doc/code mismatch |

**Top 5 production risks:** MCP dead on install, approval gate loophole, privacy blind spots, atomic write gap, init path drift.

### Panel C: Maintainer Sustainability 🟠 5/10

> *"I shipped 16 minor releases in 6 weeks. Can one person still maintain this?"*

**Health dashboard:**

- ✅ 38 gates in 18.3s
- ✅ 0 cycles in skill-deps graph (clean removal safe)
- ✅ 0.16% TODO/FIXME debt in scripts
- 🟠 101/117 scripts not referenced (cognitive load)
- 🟠 38/111 orphan templates
- 🟠 10/152 registry labels disagree with disk
- 🔴 `package.json` empty — `npm run validate` doesn't exist
- 🔴 Bus factor 1/5 (4-line `CONTRIBUTING-SKILLS.md`)
- 🔴 5 stale local branches pre-v2.0
- 🔴 ROADMAP promises Expert Mode + AI Testing Suite — CHANGELOG `[Unreleased]` empty

**Weekly effort:** 14–18 hrs sustained (0.4 FTE).

---

## 3. Cross-Panel Themes (issues flagged by 2+ panels)

| Theme | A | B | C | Convergence |
|---|---|---|---|---|
| **Shipped-but-unwired** | ✅ | ✅ | ✅ | 🔴 **3-panel** |
| **README/registry drift** | ✅ | — | ✅ | 🟢 2-panel |
| **Doc/code drift** | ✅ | ✅ | — | 🟢 2-panel |
| **"Where do I start?" gap** | ✅ | ✅ | ✅ | 🔴 **3-panel** |
| **Single-author fragility** | — | ✅ | ✅ | 🟢 2-panel |

**Headline:** The "shipped but unwired" anti-pattern is the highest-leverage finding. v2.15.0 ("Wire the Shield") and v2.16.0 ("Close the Gaps") didn't quite reach everything.

---

## 4. Critical Pain Points (3-Panel Synthesis)

### 🔴 CRITICAL (3-panel flagged)

1. **Shipped-but-unwired persists.** Multiple features are documented/scaffolded but not reachable from the documented user path. (Panel A: spec command; Panel B: command-tools.mjs, MCP SDK; Panel C: 5 stale branches, ROADMAP drift)

2. **No "go from goal → workflow" path.** Day-1 user (Panel A), platform engineer (Panel B), maintainer (Panel C) all share the pain: there is no in-tool answer to "where do I start?"

3. **Bus factor 1/5.** Implicit in every other finding — only one person knows how the runtime works, only one person can find the right skill for a goal, only one person can tell which scripts are entry points.

### 🟠 MEDIUM

4. **Privacy / approval gate applied inconsistently** (Panel B).
5. **README numbers vs reality** (Panel A + C).
6. **Doc/code drift on spec destination, config path** (Panel A + B).

### 🟢 MINOR

7. `vibe-debug.md` is half the length of peers.
8. `vibe-quality-auth` is audit-only.
9. Two parallel init paths produce different directory layouts.
10. `CONTRIBUTING-SKILLS.md` is 4 lines.
11. Vietnamese-only column headers in skill-decision-guide.

---

## 5. Coverage Matrix (Pain × Solution × Status)

| Pain | Solution | Status |
|---|---|---|
| "Which skill for OAuth?" | `vibe find "<goal>"` + tag-index | ❌ Unsolved |
| Spec command bifurcation | Delete one, add alias | ❌ Unsolved |
| Markdown-prompt doesn't bind template | Add `## Template` section | ❌ Unsolved |
| Spec destination drift | Pick `docs/specs/<name>.md`, update CLI | ❌ Unsolved |
| `vibe-debug` undersized | Expand to 80–120 lines | 🟡 Partial |
| README/FAQ/disk count drift | `npm run count:skills\|commands\|templates` | 🟡 Partial |
| skill-decision-guide.md not linked | One line in README + QUICKSTART | 🟡 Partial |
| MCP server dead on install | Add `@modelcontextprotocol/sdk` | ❌ Unsolved |
| `command-tools.mjs` dead code | Wire or delete | ❌ Unsolved |
| Approval gate not in tmux-runner | `withApprovalGate` in `launchSession` | 🟡 Partial |
| Privacy not in task/checkpoint | `redactObject` in stores | 🟡 Partial |
| Atomic `.mcp.json` writes | Use `fs-store.mjs` pattern | ✅ Solved (just not reused) |
| `package.json` empty | Restore `scripts.validate` | 🟡 Partial |
| 5 stale branches | `git branch -D` | ❌ Unsolved |
| Bus factor 1/5 | `MAINTAINERS.md` | 🟡 Partial |
| Injection gate regressing on own reports | Per-file allowlist | ❌ Unsolved |
| ROADMAP vs CHANGELOG drift | Ship or mark deferred | ❌ Unsolved |
| Init path drift | Single collection list | 🟡 Partial |

**Coverage: 1 ✅ / 7 🟡 / 10 ❌ = ~44%.** Of the 10 unsolved, **7 are 1-day fixes**.

---

## 6. Top 10 Recommendations (Tiered)

### 🔴 TIER 1 — DO FIRST (1 dev-day)

1. Restore `package.json` `scripts.validate` → `node scripts/validate-all.mjs` — 1 line
2. Add `@modelcontextprotocol/sdk` to devDependencies — ~30 min
3. Delete 5 stale branches — 5 min
4. Per-file injection allowlist for `docs/reports/council/` + `docs/security/`
5. Unify `vibe-spec` + `vibe-specify` — delete one, add alias
6. Wire or delete `command-tools.mjs`
7. Reconcile spec destination — pick one, update both CLI + docs

### 🟠 TIER 2 — DO NEXT (1 dev-week)

8. Codify `MAINTAINERS.md` (closes bus factor)
9. Apply `redactObject` to task/checkpoint stores + add `validate:privacy-coverage` gate
10. `vibe find "<goal>"` command (NL-style goal matching)

### 🟡 TIER 3 — DEFER

- Tag-based skill browser, single-source count, brownfield auto-detect
- Ship Expert Mode + AI Testing Suite OR mark deferred
- End-to-end state recovery

---

## 7. The One-Question Decision

> **Ship v2.17.0 as a MAINTENANCE-ONLY release (Tier 1 + Tier 2, ~2 dev-weeks), then declare a 4-week feature freeze.**

**Why:** Every Tier 1 item is a removal, unification, or codification — not a new feature. The audit's #1 cross-panel finding is "shipped-but-unwired" anti-pattern. **Adding more skills/commands/templates would deepen the surface.** Consolidation is the theme.

---

## 8. Bottom Line

v2.16.0 is **real engineering, well-tested, well-documented, but unfinished at the seams**. Three independent personas converged on the same diagnosis: bones are good, wiring is fragile, next release should be consolidation not addition.

**Score: 6/10 → 8/10 with Tier 1 + Tier 2 applied.**