# Repo State — Panel B: Runtime Realism (Post-v2.16.0)

**Date:** 2026-06-21
**Scope:** Optional runtime layer — `runtime/` (memory/tasks/teams/mcp/daemon/checkpoints/sessions) — feature-vs-reality audit
**Head SHA:** `5dd1f18` (post-v2.16.0)
**Persona:** Senior Platform Engineer @ 50-engineer org. Verdict-shaped: "is this production-deployable?"
**Method:** Read 25 files (`runtime/core/{fs-store,events,approval-gate,config,privacy}.mjs`, `runtime/memory/{memory-store,vector-store}.mjs`, `runtime/tasks/task-store.mjs`, `runtime/teams/{team-store,tmux-runner}.mjs`, `runtime/mcp/{server,command-tools}.mjs`, `runtime/daemon/daemon.mjs`, `runtime/install/installer.mjs`, `runtime/checkpoints/checkpoint-engine.mjs`, `runtime/sessions/session-store.mjs`); ran `node scripts/runtime-mcp.mjs --tools` (works) and `node scripts/runtime-mcp.mjs` (prints "package not installed"); cross-checked `package.json` for `@modelcontextprotocol/sdk`.
**Reads:** 25 files. **Time budget:** ~7 min.

> **Frame:** I'm asking one question: if I told 50 engineers to run `npm run runtime:init` and use the MCP server, what breaks?

---

## 1. Feature-vs-Reality Matrix

| Claimed in `docs/RUNTIME.md` / workflow docs | Code reality | Status |
|---|---|---|
| "Atomic, concurrent-safe JSON store" (`fs-store.mjs`) | Uses `PID-suffixed .tmp` + `rename` (line 64-66) + `mkdir wx` lock (line 76-84) | 🟡 Same-process safe. **Cross-process unsafe**: two writers can both win, no `fsync` before `rename` |
| "Memory store with retention/stale pruning" (`memory-store.mjs`) | Only exports `listMemory` + `ingestMemory` (lines 16, 21). Docstring claims `stale` (line 34) but **no TTL enforcement** | 🟡 Doc lies. Real implementation has no TTL |
| "Vector store with external provider support" (`vector-store.mjs`) | FNV-1a + L2 bag-of-words (default); external `embedFn` supported (line 62) but throws if missing — no shipped default | 🟡 Honest in code, **misleading in docs** |
| "Task store with claim/lease and reaper" (`task-store.mjs`) | Real claim/lease + TTL + heartbeat + reaper (`cancelExpiredClaims` line 332); state machine via `transitionTask` | ✅ Real |
| "MCP server: plug into Claude Code via `.mcp.json`" | `runtime/mcp/server.mjs:135` catches `ERR_MODULE_NOT_FOUND`; **`@modelcontextprotocol/sdk` NOT in `package.json`**, NOT in `node_modules` | ❌ Broken out of the box. Empirically fails |
| "command-tools.mjs provides 5 `vibe.*` MCP tools" | File exists (14 KB), exports `buildCommandTools(root)`. **Zero importers** — dead code | ❌ Unwired |
| "Approval gate protects dangerous actions" (`approval-gate.mjs`) | `RISK_FORCED_APPROVAL = ['review', 'dangerous', 'blocked']` (line 26), `ACTION_FORCE_APPROVAL` includes `tmux.launch` (line 30) | 🟡 Gate only fires inside MCP server (server.mjs:169). **CLI scripts and team-runner skip it** — `tmux-runner.mjs:167` spawns `claude` with no approval |
| "Installer is idempotent" (`installer.mjs`) | `planInstall` (line 47) skips existing files unless `--force` | 🟡 Mostly idempotent, but `.mcp.json` write (line 105) is **non-atomic** → corrupts on mid-write kill |
| "Daemon: file-watch with heartbeat + kill switch" (`daemon.mjs`) | `fs.watch` + heartbeat + kill file + SIGTERM; stale-pid via `kill(pid, 0)` (line 33) | 🟡 Real but `fs.watch` unreliable (no debounce, no recursive on Linux); only POSIX |
| "Privacy redactor applied everywhere" (`privacy.mjs`) | 21+ patterns. Applied to memory ingest, vector embed, event payloads | ❌ **Not applied to**: `task.description`, `task.acceptance_criteria`, `checkpoint.notes`, `checkpoint.command`. API keys land in `tasks.json` plaintext |
| "Config at `.omc/config.json` (project root)" (`RUNTIME.md:49`) | `runtime/core/config.mjs:34,87` reads from `.omc/runtime/config.json` (inside runtime dir) | ❌ Doc/code mismatch |
| "Snapshots + replay recovery" (`events.mjs`) | `createSnapshot` + `recoverFromSnapshot` (lines 57, 89); latter returns `applyEvents` callback — **caller must implement state reconstruction** | 🟡 Skeleton shipped; no end-to-end recovery implementation |
| "50-machine rollout: `npm run runtime:init`" | Writes `.omc/runtime/` (gitignored if `.omc/` is gitignored). **Two different code paths** produce two different layouts: `scripts/runtime-init.mjs` (line 15) creates `workflow-runs.json` + `actions.json` that `installer.mjs:RUNTIME_COLLECTIONS` (line 7) **does not list** | 🟡 Drift between init paths |
| "Tests cover runtime" | Only `tests/runtime/runtime-shape.test.mjs` (33 lines, asserts ADR 0002 freeze). Behavior tests live as 8 ad-hoc `scripts/test-runtime-*.mjs` — **not wired into a test runner** | 🟡 Minimal |
| "Recovery from corruption" | `events.mjs` has `cleanupEvents`/`removeSnapshots` (lines 96, 115); **no daemon/scheduler calls them** — only manual | 🟡 Manual recovery only |

**Coverage:** 1 ✅ / 8 🟡 / 4 ❌ = **8 critical problems**, **architecture honest but not production-safe**.

---

## 2. Top 5 Risks for 50-Engineer Rollout

### 🔴 Risk 1 — MCP server dead on arrival
**Symptom:** Engineer runs `npm run runtime:init`, opens Claude Code, MCP server fails to start. Error: "package not installed."
**Why:** `@modelcontextprotocol/sdk` is documented as the runtime's primary integration path but never added to `package.json` devDependencies. `runtime/mcp/server.mjs:135` (`loadSdk`) catches the resulting `ERR_MODULE_NOT_FOUND` and returns `null`. The graceful degradation is good engineering; the missing dependency is a release-process bug.
**Fix:** `npm install --save-dev @modelcontextprotocol/sdk`; verify `npm run runtime:install` writes a `.mcp.json` that actually launches the server.

### 🔴 Risk 2 — Approval gate only enforced through one code path
**Symptom:** User authorizes MCP-server-gated `review` action; meanwhile `runtime/teams/tmux-runner.mjs:167` spawns `claude` directly bypassing the same gate.
**Why:** `approval-gate.mjs` is a library — it only protects callers that actually invoke `withApprovalGate`. `tmux-runner.mjs` and several CLI scripts do not.
**Fix:** Add `withApprovalGate` to `tmux-runner.launchSession` and any CLI script that triggers `ACTION_FORCE_APPROVAL` actions. Add a `validate:approval-coverage` gate that fails CI if `ACTION_FORCE_APPROVAL` actions are reachable without `withApprovalGate` in the call path.

### 🟠 Risk 3 — Privacy redactor blind spots → secret leakage to disk
**Symptom:** User runs `vibe task add "deploy with AWS_SECRET_ACCESS_KEY=AKIA..."`. Task saved to `.omc/runtime/tasks.json` plaintext. Vector embed also stores it (vectors don't carry content, but the source is on disk).
**Why:** `privacy.mjs` (21+ patterns) is applied to memory, vectors, and events but not to task descriptions, acceptance criteria, or checkpoint notes. Inconsistent application of the same module.
**Fix:** Apply `redactObject` in `task-store.createTask`/`updateTask` and `checkpoint-engine.record`. Add a `validate:privacy-coverage` gate that fails if any `runtime/*/store.mjs` persists strings without going through `redactObject`.

### 🟠 Risk 4 — Atomicity gap in `.mcp.json` writes
**Symptom:** Engineer Ctrl-C's `npm run runtime:install` mid-write. `.mcp.json` is now half-written; Claude Code refuses to start with "invalid JSON".
**Why:** `runtime/install/installer.mjs:105` uses plain `writeFile` to merge the MCP entry. No `.tmp` + rename.
**Fix:** Use `fs-store.mjs` write pattern (`PID.tmp` + `rename`) or `write-file-atomic` (already a transitive dep — verify).

### 🟡 Risk 5 — Init path drift between two entry points
**Symptom:** Two engineers run `npm run runtime:init` vs `npm run runtime:install`. Their `.omc/runtime/` directories contain different collections (`workflow-runs.json` exists in one, not the other).
**Why:** `scripts/runtime-init.mjs:15` creates collections that `runtime/install/installer.mjs:RUNTIME_COLLECTIONS` (line 7) does not list, and vice versa.
**Fix:** Single source of truth for the collection list. Both scripts import it.

---

## 3. Strengths (what's actually well-built)

1. **`fs-store.mjs` is genuinely thoughtful** — same-process locking via `mkdir wx`, PID-suffixed tmp files, atomic rename. Good baseline.
2. **`task-store.mjs` is the most complete module** — claim/lease with TTL, reaper, state machine, import-from-markdown. This is what every other store should aspire to.
3. **ADR 0002 runtime-scope freeze is honest** — `.omc/` is opt-in, gitignored, never required. The architecture admits what's optional.
4. **Privacy redactor (`privacy.mjs`) has 21+ patterns** — the module itself is good; it just isn't applied uniformly.
5. **Daemon is opt-in and well-instrumented** — kill file, heartbeat, stale-pid check. Best-practice SRE pattern.

---

## 4. Recommendations for v2.17.0

### Tier 1 — DO FIRST (block release)
1. **Add `@modelcontextprotocol/sdk` to devDependencies.** Verify `npm run runtime:install` + restart actually launches a working MCP server in Claude Code.
2. **Wire `command-tools.mjs`** or delete it. Dead code is worse than missing code.
3. **Apply `redactObject` to `task-store` + `checkpoint-engine`** before any secret-leak report lands.

### Tier 2 — DO NEXT
4. **Extract `withApprovalGate` enforcement** into a CI gate. Audit every `ACTION_FORCE_APPROVAL` action's call sites.
5. **Unify init path**: single collection list imported by both `runtime-init.mjs` and `installer.mjs`.
6. **Atomic `.mcp.json` write** using existing `fs-store.mjs` pattern.

### Tier 3 — DEFER
7. **End-to-end state recovery** (snapshot → replay → rebuild all stores). Currently a skeleton — needs an actual implementation + tests.
8. **Behavior test runner** — wire 8 `scripts/test-runtime-*.mjs` into a real test runner (vitest/node:test) and assert results in CI.
9. **Doc/code reconciliation**: `RUNTIME.md:49` says config at `.omc/config.json`; fix to `.omc/runtime/config.json` or move the code.

---

## 5. One-paragraph verdict

The runtime layer is **architecturally honest and well-scoped (ADR 0002 freeze works)** but **not production-deployable to 50 engineers in its current state** because (a) the headline integration path — MCP server — fails on a fresh install (`@modelcontextprotocol/sdk` not in `package.json`); (b) the approval gate is enforced through only one of multiple call sites; (c) privacy redactor is inconsistently applied; (d) two parallel init scripts produce different directory layouts. The bones are real (`fs-store`, `task-store`, `events`, `privacy`, `daemon` are genuinely well-built modules) but the seams are fragile. **Effort to fix Tier 1: ~2 dev-days.** **Effort to fix all tiers: ~1 dev-week.** Without Tier 1 fixes, this is a demo, not a runtime.