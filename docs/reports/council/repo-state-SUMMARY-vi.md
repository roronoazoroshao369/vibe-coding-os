# 🚀 Repo State Audit (Post-v2.16.0) — Council Synthesis

**Date:** 2026-06-21 · **Head SHA:** `5dd1f18` · **Version:** `2.16.0`

> **Verdict:** v2.16.0 là framework có xương sống tốt (security, validation pipeline, atomic stores, real task leases) nhưng **3 lớp friction chồng chéo** với nhau: day-1 discoverability, runtime production-readiness, solo-maintainer sustainability. **Score: 6/10 → 8/10 nếu áp dụng Tier 1 + Tier 2.**

---

## ⚡ TL;DR (3 bullets)

- **Cross-panel convergence (3/3 panels):** "Shipped but unwired" anti-pattern vẫn còn — `command-tools.mjs` dead code, MCP SDK thiếu trong package.json, `vibe-spec`/`vibe-specify` chẻ đôi, ROADMAP hứa nhưng CHANGELOG rỗng.
- **Day-1 user mất 9 phút (may mắn)** để tìm 1 skill OAuth vì không có goal-finder, `skill-decision-guide.md` không link từ README, doc/CLI drift về spec destination (`docs/specs/<name>.md` vs `SPEC.md`).
- **Runtime "production-ready trên giấy" nhưng MCP server fail on fresh install** (`@modelcontextprotocol/sdk` không có trong `package.json`), approval gate chỉ enforce qua 1 trong nhiều call sites (không có trong `tmux-runner`), privacy redactor không apply cho task description / checkpoint notes.

---

## 📊 Stats Hero

| Metric | Value |
|---|---|
| Head SHA | `5dd1f18` |
| Version | `2.16.0` |
| Last release | 2026-06-20 |
| Validation gates | **38** (34 ✅, 4 ❌, **18.3s wall**) |
| Skills | ~108 (README nói 149, FAQ nói 148 — drift) |
| Commands | 108 (README nói 116 — drift) |
| Templates | 128 (README nói 118 — drift) |
| Scripts (.mjs) | 117 |
| Orphan templates | 38 / 111 |
| Skill-deps cycles | **0** (151 nodes, 76 edges — clean removal) |
| Bus factor | **1/5** 🔴 |
| Weekly effort | **14–18 hrs** (0.4 FTE) |

---

## 🎭 Three Panels — Verdict riêng

### Panel A — Newcomer Onboarding 🟠 **5/10**

**Persona:** Day-1 dev vừa `npm install`, muốn add OAuth vào Express app, skeptical với overengineered frameworks.

**Verified problems (file:line citations):**

- **9-min-by-luck skill discovery** — `grep -rE "oauth|express" skills/` trả về 0 actionable match
- **Spec command bifurcation** — `commands/vibe-spec.md` vs `commands/vibe-specify.md` 90% identical
- **Doc/CLI destination drift** — `FIRST-WORKFLOW.md:114` nói `docs/specs/<name>.md`; `scripts/vibe-cli.mjs:649` ghi `SPEC.md`
- **`vibe-debug.md` chỉ 33 dòng** vs peers 47–60 dòng (`commands/vibe-debug.md:1-33`)
- **README numbers disagree with disk** — 149 vs 148 vs 108
- **`skill-decision-guide.md` không link từ README** — `grep -n "skill-decision-guide" README.md` → 0 matches
- **`vibe-quality-auth` là audit, không phải build command** — `commands/vibe-quality-auth.md:1-12`

**Workflow trace (10 bước add OAuth):** 22 phút mới tới usable spec; working OAuth flow **không reach được trong 1 session**.

### Panel B — Runtime Realism 🟠 **6/10**

**Persona:** Senior platform engineer @ 50-engineer org, hỏi "có production-deployable không?"

**Feature-vs-Reality matrix:**

| Claimed | Code reality | Status |
|---|---|---|
| Atomic JSON store | PID-suffixed tmp + rename | 🟡 Same-process only |
| Memory retention/stale | `stale` trong docstring, **no TTL code** | 🟡 Doc lies |
| Task store w/ claim/lease | Real claim/lease + TTL + reaper | ✅ Real |
| MCP server (Claude Code plugin) | **`@modelcontextprotocol/sdk` không có trong package.json** | ❌ Broken |
| `command-tools.mjs` (5 tools) | **Zero importers — dead code** | ❌ Unwired |
| Approval gate | Chỉ fire trong MCP server, **không có trong tmux-runner** | 🟡 Loophole |
| Privacy redactor everywhere | **Không apply cho task/checkpoint stores** | ❌ Blind spots |
| Installer idempotent | `.mcp.json` write **non-atomic** | 🟡 Partial |
| Config at `.omc/config.json` | Code reads `.omc/runtime/config.json` | ❌ Doc/code mismatch |

**Top 5 production risks:** MCP dead on install · approval gate loophole · privacy blind spots · atomic write gap · init path drift.

### Panel C — Maintainer Sustainability 🟠 **5/10**

**Persona:** Burned-out solo maintainer, 16 minor releases trong 6 tuần.

**Health dashboard:**

- ✅ 38 gates / 18.3s
- ✅ 0 cycles trong skill-deps graph (clean removal safe)
- ✅ 0.16% TODO/FIXME debt trong scripts
- 🟠 101/117 scripts không ai reference (cognitive load)
- 🟠 38/111 orphan templates
- 🟠 10/152 registry labels disagree với disk
- 🔴 **`package.json` empty `{}`** — `npm run validate` không tồn tại
- 🔴 **Bus factor 1/5** — `CONTRIBUTING-SKILLS.md` chỉ 4 dòng
- 🔴 5 stale local branches pre-v2.0
- 🔴 ROADMAP promises "Expert Mode" + "AI Testing Suite" — CHANGELOG `[Unreleased]` rỗng

**Weekly effort:** 14–18 hrs sustained (0.4 FTE).

---

## 🔗 Cross-Panel Themes (flagged by 2+ panels)

| Theme | A | B | C | Convergence |
|---|---|---|---|---|
| **Shipped-but-unwired anti-pattern** | ✅ | ✅ | ✅ | 🔴 **3-panel** |
| **README/registry drift** | ✅ | — | ✅ | 🟢 2-panel |
| **Doc/code drift** | ✅ | ✅ | — | 🟢 2-panel |
| **"Where do I start?" gap** | ✅ | ✅ | ✅ | 🔴 **3-panel** |
| **Single-author fragility** | — | ✅ | ✅ | 🟢 2-panel |

**Headline finding:** "Shipped but unwired" là highest-leverage. v2.15.0 ("Wire the Shield") + v2.16.0 ("Close the Gaps") chưa chạm tới hết: MCP SDK, command-tools.mjs, spec destination, registry labels.

---

## 🎯 Critical Pain Points (3-Panel Synthesis)

### 🔴 CRITICAL (3-panel flagged)

1. **Shipped-but-unwired persists.** Multiple features documented nhưng không reachable from documented user path.
2. **No "goal → workflow" path.** Day-1 user + platform engineer + maintainer đều share pain này.
3. **Bus factor 1/5.** Implicit trong mọi finding khác — chỉ 1 người biết runtime hoạt động ra sao.

### 🟠 MEDIUM

4. Privacy / approval gate applied inconsistently (Panel B)
5. README numbers vs reality (Panel A + C)
6. Doc/code drift trên spec destination + config path (Panel A + B)

### 🟢 MINOR

`vibe-debug.md` half-length · `vibe-quality-auth` audit-only · 2 init paths · `CONTRIBUTING-SKILLS.md` 4 dòng · Vietnamese-only column headers.

---

## 📋 Coverage Matrix (Pain × Solution × Status)

| Pain point | Solution | Status |
|---|---|---|
| "Which skill for OAuth?" | `vibe find "<goal>"` + tag-index | ❌ Unsolved |
| Spec command bifurcation | Delete one, add alias | ❌ Unsolved |
| Markdown-prompt doesn't bind template | Add `## Template` section | ❌ Unsolved |
| Spec destination drift | Pick `docs/specs/<name>.md`, update CLI | ❌ Unsolved |
| `vibe-debug` undersized | Expand to 80–120 lines | 🟡 Partial |
| README/FAQ/disk count drift | `npm run count:skills\|commands\|templates` | 🟡 Partial |
| skill-decision-guide not linked | One line in README + QUICKSTART | 🟡 Partial |
| **MCP server dead on install** | Add `@modelcontextprotocol/sdk` | ❌ Unsolved |
| `command-tools.mjs` dead code | Wire or delete | ❌ Unsolved |
| Approval gate không trong tmux-runner | `withApprovalGate` in `launchSession` | 🟡 Partial |
| Privacy không trong task/checkpoint | `redactObject` in stores | 🟡 Partial |
| Atomic `.mcp.json` writes | Reuse `fs-store.mjs` pattern | ✅ Solved (just not reused) |
| `package.json` empty | Restore `scripts.validate` | 🟡 Partial |
| 5 stale branches | `git branch -D` | ❌ Unsolved |
| Bus factor 1/5 | `MAINTAINERS.md` | 🟡 Partial |
| Injection gate regress on own reports | Per-file allowlist | ❌ Unsolved |
| ROADMAP vs CHANGELOG drift | Ship or mark deferred | ❌ Unsolved |
| Init path drift | Single collection list | 🟡 Partial |

**Coverage: 1 ✅ / 7 🟡 / 10 ❌ = ~44%.** Trong 10 unsolved, **7 cái là 1-day fixes** (delete / link / unify / restore script entry). Chỉ 3 cái cần design work.

---

## 🏆 Top 10 Recommendations (Impact × Confidence)

### 🔴 TIER 1 — DO FIRST (1 dev-day total)

| # | Action | Effort | Source |
|---|---|---|---|
| 1 | Restore `package.json` `scripts.validate` → `node scripts/validate-all.mjs` | 1 line | Panel C |
| 2 | Add `@modelcontextprotocol/sdk` to devDependencies | ~30 min | Panel B |
| 3 | Delete 5 stale branches (1 PR) | 5 min | Panel C |
| 4 | Per-file injection allowlist cho `docs/reports/council/` + `docs/security/` | 1 hr | Panel C |
| 5 | Unify `vibe-spec` + `vibe-specify` (delete one, add alias) | 1 hr | Panel A |
| 6 | Wire or delete `command-tools.mjs` | 30 min | Panel B |
| 7 | Reconcile spec destination (pick `docs/specs/<name>.md` per docs) | 1 hr | Panel A |

### 🟠 TIER 2 — DO NEXT (1 dev-week)

| # | Action | Source |
|---|---|---|
| 8 | Codify `MAINTAINERS.md` (closes bus factor) | Panel C |
| 9 | Apply `redactObject` to task/checkpoint stores + add `validate:privacy-coverage` gate | Panel B |
| 10 | `vibe find "<goal>"` command (NL-style goal matching) | Panel A |

### 🟡 TIER 3 — DEFER (post-v2.18)

- Tag-based skill browser
- Single-source count script
- Brownfield spec auto-detection
- Ship "Expert Mode" + "AI Testing Suite" hoặc mark deferred
- End-to-end state recovery (snapshot → replay)

---

## 🎬 One-Question Decision

> **Ship v2.17.0 as a MAINTENANCE-ONLY release (Tier 1 + Tier 2, ~2 dev-weeks), then declare 4-week feature freeze.**

**Lý do:** Mọi Tier 1 item đều là removal, unification, hoặc codification — **không phải new feature**. Audit's #1 cross-panel finding là "shipped-but-unwired". **Adding more skills/commands/templates sẽ deepen 117-script surface và 152-skill discoverability wall** — cả hai đều flagged by Panels A và C.

**Counter-argument:** Pure maintenance release không generate adoption signals. Nhưng: v2.15.0 ("Wire the Shield") + v2.16.0 ("Close the Gaps") đều là consolidation themes và shipped substantive engineering work. v2.17.0 closing "shipped-but-unwired" anti-pattern (MCP SDK, command-tools.mjs, spec bifurcation, package.json script, stale branches, MAINTAINERS.md) là **same theme continued**, với strong cross-panel evidence.

---

## 📁 Câu hỏi cần bạn quyết

| # | Câu hỏi | Default đề xuất |
|---|---|---|
| 1 | Có triển khai Tier 1 (7 items, ~1 dev-day) ngay bây giờ không? | **Có** — 7/7 items đều low-risk |
| 2 | Tier 2 (3 items, ~1 dev-week) — làm luôn hay để sau? | Làm luôn Tier 2#10 (`vibe find`) vì đóng Q1 (9-min-by-luck) |
| 3 | Có declare 4-week feature freeze cho v2.17.0 không? | **Có** — đây là consolidation release |
| 4 | Có xóa luôn 5 stale branches không? | **Có** — không ai thấy trên origin |

---

## 📂 Files trong council audit này

- `repo-state-panel-A-newcomer-onboarding.md` (171 lines)
- `repo-state-panel-B-runtime-realism.md` (~150 lines)
- `repo-state-panel-C-maintainer-sustainability.md` (~150 lines)
- `repo-state-COUNCIL-SYNTHESIS.md` (~250 lines)
- `repo-state-deep-dive.md` (file này)
- `repo-state-deep-dive.html` (dark-theme visual)

**Tổng:** 6 files, ~1100 lines, ~74 file-reads across 3 panels.