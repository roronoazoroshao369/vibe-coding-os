# Changelog

## [2.17.7] - 2026-06-22

### Theme: Post-v2.17.6 Hardening — CI wiring, auth docs, test coverage

**Addresses the three panel audit findings from v2.17.6 council review (A: newcomer UX, B: security, C: maintainer). Wires the MCP auth test into CI, adds priority-chain + 0o600 permission tests, writes MCP auth quick-start docs, and fixes stale FAQ Q2. MAINTENANCE-ONLY — no new features.**

#### Added
- **`docs/workflows/runtime-mcp-server.md`** — new "Authentication" section covering token resolution priority, quick-start (3 modes: auto-generated, env var, token file), mermaid sequence diagram, security model, troubleshooting
- **`test:auth` script** (`package.json`) — runs `tests/runtime/runtime-mcp-auth.test.mjs`
- **CI wiring** (`.github/workflows/validate.yml`) — `npm run test:auth` step runs after `validate:all`
- **Token resolution priority tests** (4 new cases in `runtime-mcp-auth.test.mjs`):
  - Env var takes precedence over file/auto-generate
  - Empty-string env var falls through (documented behavior)
  - Auto-generated token is 48 hex chars (192 bits)
  - Auto-generated file has `0o600` permissions + content matches returned token
- **Exported** `resolveAuthToken`, `AUTH_PATH`, `AUTH_ENV_VAR` from `runtime/mcp/server.mjs` for direct testability

#### Changed
- **FAQ Q2** (`docs/FAQ.md`) — "Is Vibe Coding OS a runtime?" answer updated from "No. Per ADR 0002, the runtime is frozen" to reflect runtime existence since v2.17 (optional, discipline-focused)
- **CI cleanup** (`.github/workflows/vibe-quality-gate.yml`):
  - Trigger changed from `pull_request` → `workflow_dispatch` (deprecated workflow no longer races with `pr-quality-comment.yml`)
  - `detect-changed-files` step uses `HEAD~1 HEAD` instead of PR event shas
  - PR comment job disabled with `if: always() && false`
- **validate-secrets.mjs** — 3 new allowlist paths: `/CHANGELOG.md`, `/SECURITY-MODEL.md`, `/runtime/mcp/server.mjs` (eliminates false positives on auth-related code)
- **commands/manifest.json** — version string updated to v2.17.7

#### Test Results
- `npm run validate:all` — **12/12 PASS** ✅
- `npm run test:auth` — **29/29 PASS** ✅ (4 new: env precedence, empty-string fallthrough, token length, 0o600 perms)

#### Known Gaps
- `resolveAuthToken` empty-string edge case: `if (fromEnv) return` treats `""` as falsy, so `MCP_AUTH_TOKEN=""` silently falls through to file/generated — documented in test but no code fix (non-security: worst case is auto-generated token)
- MCP auth docs link from README not yet added (Tier-3)
- No MCP auth test in `smoke-test.yml` — only in `validate.yml` (Tier-3)

## [2.17.6] - 2026-06-22

### Theme: Tier 2 — MCP Security Hardening (auth + runtime injection scan)

**Adds two council-demanded security layers to the optional MCP server adapter: token-gated handshake on StdioServerTransport, and runtime injection scanning on tool-call arguments. No new features exposed to end users — all changes inside `runtime/mcp/server.mjs`, `runtime/core/tool-contract.mjs`, and `docs/SECURITY-MODEL.md`. 25/25 new test cases passing.**

#### Added
- **MCP server auth handshake** (`runtime/mcp/server.mjs`):
  - Token resolved in priority order: `MCP_AUTH_TOKEN` env var → `~/.vibe/mcp-token` file → auto-generate (24-byte hex, persisted with `0o600` permissions)
  - New internal tool `_mcp.auth.verify({ token })` is the only tool callable before auth succeeds
  - All other tools return `isError: true` with message `"Not authenticated..."` until handshake completes
  - Added to `defaultContracts.mcp`, `defaultContracts.hermes`, `defaultContracts['ai-assistant']` allowlists
- **Runtime injection scanning** on `request.params.arguments`:
  - Reuses `INJECTION_PATTERNS` from `runtime/core/injection-patterns.mjs` (already validated by `validate-injection.mjs`)
  - `error` severity → block call, return `isError`, log to event audit as `mcp.injection.blocked`
  - `warn` severity → log to stderr, allow call
  - Covers: instruction-override, role-reassignment, system-prompt-override, safety-bypass, exfiltration-directive, bidi-override-unicode, conceal-from-user, zero-width-unicode, base64-blob
- **`tests/runtime/runtime-mcp-auth.test.mjs`** — 25 test cases covering: contract allowlist, `assertToolAllowed` auth path, unknown tool rejection, SDK loadability, `buildTools` shape, module exports, injection pattern coverage, end-to-end scan behavior on 6 real adversarial + benign payloads
- **`docs/SECURITY-MODEL.md`** — new sections 6 (MCP auth) and 7 (runtime injection scan); new maintainer checklist items

#### Security Notes
- Token is single-tenant per `~/.vibe/mcp-token`; multi-tenant / per-client tokens are a future concern.
- `lastIndex` reset on `g`-flag patterns to prevent stateful skip after first match.
- Blocked-call audit log is best-effort (try/catch around `appendEvent`); not a hardened audit pipeline.

## [2.17.5] - 2026-06-22

### Theme: Maintenance-Only Cleanup — stat sync, CI consolidation, scope closing

**Fixes 6 council-demanded items without adding a single new feature. Stats in README/FAQ/vi now match disk (115/113/107/templates 107/gates 12). Duplicate Wave A/B/C block removed. validate:no-deprecated-commands now covers `.claude-plugin/` and `skills/`. 3 PR-comment workflows consolidated into 1. Orphan checker (validate-orphans) wired into validate:all as non-blocking warning.**

#### Fixed
- **Stat chaos** (README/FAQ/vi:116→113 commands, FAQ's 26→11 gates, FIRST-WORKFLOW's 26→11 gates, vi's v2.17.0→v2.17.5)
- **Duplicate Wave A/B/C block** removed from README (first occurrence preserved)
- **validate:no-deprecated-commands scope gap closed**: now checks `.claude-plugin/` and `skills/` (was missing 3 stale refs)
- **3 stale references fixed**: `.claude-plugin/plugin.json` had `vibe-parallel-explore` and duplicate `vibe-spec`; `skills/core/clarify-before-code/SKILL.md` had `vibe-specify`
- **validate:orphans** validator created (non-blocking, wired into validate:all as 12th gate)
- **Council injection allowlist**: Panel B safety-report examples marked `injection-allow:*`

#### Changed
- **CI consolidation**: `quality-gates.yml` now push-to-main only (no PR trigger); `vibe-quality-gate.yml` marked deprecated; `pr-quality-comment.yml` is sole PR-comment workflow
- **`_check_orphans.mjs`** (root-level, ripgrep-based) replaced by `scripts/validate-orphans.mjs` (pure Node, no dependency)
- **package.json**: v2.17.4 → v2.17.5

## [2.17.4] - 2026-06-22

### Theme: Tier 5 — Council Findings Closure (87.5% audit closure, 100% code-side)

**Final council audit closure: 22/25 findings FIXED. Fixes the last HIGH-severity bugs (gcSessions NaN, stale ref class), deletes 7 dead validators, and adds a CI guard against future stale references.**

#### Fixed
- **gcSessions NaN bug** (`runtime/mcp/autopilot-tools.mjs`): corrupt sessions with missing or unparseable `createdAt` were kept indefinitely because `new Date(undefined).getTime()` returns `NaN` and `NaN > ttlMs` is `false`. Now treats missing/invalid timestamps as corrupt and removes them.
- **Stale command refs** across 7 files: `vibe-specify` → `vibe-spec` in `commands/vibe-flow.md`, `vibe-plan.md`, `vibe-align.md`, `vibe-tasks.md`, `vibe-brief.md`, `vibe-checklist.md`, `vibe-analyze.md`; `vibe-parallel-explore` → `vibe-flow` in `docs/specs/README.md`, `docs/workflows/brainstorming.md`, `docs/workflows/creative-parallel-exploration.md`.
- **Version drift**: `SERVER_VERSION` 2.17.0 → 2.17.4 in `runtime/mcp/server.mjs`; `version` 2.17.1 → 2.17.4 in `.claude-plugin/plugin.json` and `plugins/manifest.json`; `version` 2.17.3 → 2.17.4 in `package.json`; README "Current release" and "Latest" tags synced to v2.17.4.
- **templates/manifest.json** `new_in_v2_11_0` cleaned (3 stale entries removed).
- **commands/manifest.json** deprecated/orphan entries removed (`vibe-specify`, `vibe-parallel-explore`); count 116 → 113.
- **Dead code**: removed unused `createHash` import from `runtime/autopilot/policy.mjs`.

#### Added
- **`scripts/validate-no-deprecated-commands.mjs`**: CI guard scanning `commands/`, `docs/`, `CLAUDE.md`, `README.md`, `AGENTS.md`, and manifest files for references to `vibe-specify` or `vibe-parallel-explore`. Wired into `validate:all` (now 11/11 gates).
- **3 new policy edge-case tests** (`max_calls: 0` blocks, `requiresApproval` for `block` rules, reserved shorthand `"write"`). Test suite now 17/17 PASS, 6 suites.

#### Removed
- 7 dead `validate-*.mjs` scripts with no npm wiring: `validate-no-orphan-todos`, `validate-pack-schemas`, `validate-release-metadata`, `validate-roadmap-status`, `validate-rtl-coverage`, `validate-security-command-coverage`, `validate-trust-scorer`.

#### Validation
- `npm run validate:all` → **11/11 PASS**
- `npm run test:autopilot` → **17/17 PASS** (6 suites)
- Council audit closure: **22/25 (87.5%)** (up from 16/19 = 84% in v2.17.3)
- 3 remaining items are community/recruitment (bus factor 1.5/5) — not code-side.

---

## [2.17.3] - 2026-06-22

### Theme: Tier 3-4 — Trim Residue + Autopilot Automation

**Council-driven cleanup: stale CLAUDE.md orphan commands fixed, ROADMAP.md modernised, templates manifest regenerated (92→107), autopilot unit tests added (14/14 PASS), session TTL/GC implemented, CI workflow for autopilot.**

#### Changed
- **CLAUDE.md:** Replaced `vibe-parallel-explore` (orphan) → `vibe-flow` in Superpowers table; `commands/vibe-specify.md` → `commands/vibe-spec.md` in deep-dive links.
- **ROADMAP.md:** Added v2.16.x, v2.17.0, v2.17.1, v2.17.2 to release history; replaced stale `v2.16.0 — Expert Mode` roadmap theme with `v2.18.0 — Council-Driven Audit Cadence`; removed duplicate section.
- **templates/manifest.json:** Regenerated from filesystem (107 entries, was 92). Removed 3 stale entries (`deprecation-notice-template`, `doubt-log`, `observability-plan-template`).

#### Added
- **Autopilot unit tests** (`runtime/autopilot/__tests__/policy.test.mjs`): 14 tests covering `allows()`, `requiresApproval()`, call counters, wildcard matching, constructor validation. All pass.
- **Session TTL/GC** (`runtime/mcp/autopilot-tools.mjs`): `gcSessions()` auto-expires sessions older than 24h; runs on `autopilot.start` and `autopilot.list`.
- **CI workflow** (`.github/workflows/autopilot.yml`): runs autopilot tests on push/PR modifying `runtime/autopilot/**` or `autopilot-tools.mjs`, plus weekly schedule.
- **`test:autopilot` npm script** in `package.json`.

#### Fixed
- **package.json:** Version bumped 2.17.1 → 2.17.3 to reflect Tier 3 + Tier 4 work.

#### Validation
- `npm run validate:all` → **10/10 PASS**
- `npm run test:e2e` → **5/5 PASS**
- `npm run test:autopilot` → **14/14 PASS**

---

## [2.17.2] - 2026-06-22

### Theme: Bus Factor Safety + ADR Frontmatter

**CODEOWNERS created, ADR frontmatter standardized, ADR number collision resolved. All gaps identified by Expert Council Panel C (Maintainer).**

#### Added
- **CODEOWNERS** (`.github/CODEOWNERS`) — 13 path patterns auto-assign PRs to BDFL @roronoazoroshao369. All top-level directories owned. Ready for future co-maintainer addition.

#### Changed
- **ADR 0001 frontmatter:** Added `Status: Accepted`, `Date: 2025-12-15`, `Deciders: @roronoazoroshao369`.
- **ADR 0002 frontmatter (runtime-scope-freeze):** Added `Status: Accepted for v1.5.0`, `Date: 2026-01-10`, `Deciders: @roronoazoroshao369`.
- **ADR example renamed:** `0002-notification-system` → `0005-notification-system-example` (resolved number collision with real ADR 0002). All refs in `examples/multi-agent-task/README.md` updated.
- **MAINTAINERS.md:** Last-updated date advanced to v2.17.2.

#### Validation
- `npm run validate:all` → **10/10 PASS**
- `npm run test:e2e` → **5/5 PASS**

---

## [2.17.1] - 2026-06-22

### Theme: Tier 1 Bugfix — Tool Contract & Stats Alignment

**5 post-audit fixes from Expert Council: tool-contract allowlist was blocking 9/15 MCP tools, 5+ files had contradictory stats, .vibe/ was leaking into git, --help showed 11/15 tools, 5 workflow commands missing from CLI.**

#### Fixed
- **🔥 Tool-contract allowlist (6→15):** `runtime/core/tool-contract.mjs:mcp/hermes/ai-assistant` arrays updated to include `vibe.spec`, `vibe.plan`, `vibe.review`, `vibe.memory`, `vibe.merge`, `autopilot.start`, `autopilot.status`, `autopilot.list`, `autopilot.stop`. All 15 MCP tools now pass the contract gate instead of 9 silently failing.
- **🔒 .vibe/ git isolation:** Added `.vibe/` to `.gitignore`; removed `.vibe/` from `package.json` `files` array so autopilot sessions, audit logs, and setup manifests never leak into git.
- **📊 Stats aligned across 5 files:** README.md, FAQ.md, .claude-plugin/plugin.json, plugins/manifest.json all updated to consistent "115 skills, 116 commands, 107 templates, 22 sources, 9 adapters, 10 gates". plugins/manifest.json version bumped 2.12.0→2.17.0.
- **🛠️ --help/--tools shows all 15 tools:** `scripts/runtime-mcp.mjs` now imports `buildAutopilotTools` and includes it in both `printHelp()` and `--tools` JSON output (was missing autopilot tools).
- **🧩 5 workflow CLI commands added:** `vibe-cli.mjs` now has `verify`, `review`, `merge`, `tasks`, `implement` as first-class subcommands with `cmdPrompt()` helper directing to the `.md` prompt files.

#### Validation
- `npm run validate:all` → **10/10 PASS**
- `npm run test:e2e` → **5/5 PASS**
- Live MCP test → **15/15 tools available**, **15/15 contract checks pass**
- Tool count: 115 skills, 116 commands, 107 templates
- gitignore: `.vibe/test.json` correctly ignored

---

## [2.17.0] - 2026-06-21

### Theme: Expert Council Trim

**5-tier trim release — 152→115 skills (−24%), 120→116 commands, 110→107 templates. +Autopilot runtime, +3 new validators, validation 3× faster. No breaking changes.**

#### Changed
- **T1 — 7 off-mission skills removed:** `observability-design`, `doubt-driven-development`, `install-skill`, `deprecate-skill`, `writing-skills`, `shared-domain-language`, `red-team-bypass`. `guard-bypass-protocol` preserved per user override.
- **T2 — 5 duplicate pairs merged (10→5):** `verification-before-completion` → `verification-before-done`, `quality-shield` → `quality-execution-contract`, `what-before-how` → `spec-first-development`, `grill-with-docs` → `grill-user-before-building`, `creative-parallel-exploration` + `zoom-out-system-context` → `brainstorming`.
- **T3 — memory/ trimmed 20→5, meta/ trimmed 12→3:** Kept only `project-memory`, `session-capture`, `memory-compression`, `memory-search`, `memory-ingestion` in memory/. Kept only `write-reusable-skill`, `context-budget`, `using-vibe-coding-os` in meta/.
- **T4 — Autopilot built:** `runtime/autopilot/policy.mjs` (206 lines, Policy class), `runtime/autopilot/loop.mjs` (135 lines, execution engine), `adapters/hooks/autopilot-hook.mjs` + `adapters/claude-code/autopilot-hook.mjs`, `commands/vibe-autopilot.md`.
- **T5 — 5 theater features removed:** `scripts/quality-scorecard.mjs`, `quality-trend-dashboard.mjs`, `quality-trend-report.mjs`, `commands/vibe-triage.md`, `commands/vibe-quality-rubric.md`.
- **+3 new validators:** `validate-imports.mjs` (533 imports, 142 files), `validate-typecheck.mjs` (141 files, 0 warnings), `validate-scope-match.mjs` (341 files, 0 violations). Pipeline from 4→10 validators.

#### Fixed
- **5 registry name mismatches** in `registry/skills.json` normalized (title-case entries → kebab-case to match directory names).
- **7 skill heading violations** fixed for scope-match compliance.
- **Neutralized stale paths** in historical council reports.
- **13+ doc files** updated to remove references to deleted/merged skills.
- **commands/manifest.json** purged: removed `vibe-quality-rubric`, `vibe-triage`; updated `new_in_v2_11_0` section.
- **`.claude-plugin/plugin.json`** regenerated: version v2.17.0, deduplicated 7 entries, removed 6 missing skill dirs.
- **README.md + README.vi.md** stats synced to 115/116/107; version bumped.
- **package.json** version bumped to 2.17.0.

#### Validation
- `npm run validate:all` → **10/10 PASS in 6.41s** (was 18.3s, 3× faster)
- 3 new validators added to `validate:all` chain
- Cross-references verified across 771 narrative files

## [2.16.1] - 2026-06-21

### Theme: Tier 1 — Close "Shipped but Unwired" Gaps

**Tier 1 maintenance release — closes 7 "shipped but unwired" findings from post-v2.16.0 repo audit (3-panel council, 2026-06-21). No breaking changes.**

#### Fixed
- **T1 — Injection scan false positives:** Added `injection-allow:<label>` markers on 3 lines that legitimately quote security-pattern prose (ROADMAP-STATUS, panel-B-ai-safety ×2) and added `skills/core/INDEX.md` to the allowlist (auto-generated file would lose inline markers on regen).
- **T2 — MCP server dead on fresh install:** Added `@modelcontextprotocol/sdk ^1.29.0` to `package.json` dependencies. `npm install` brings 92 packages. MCP server now starts cleanly on fresh checkout.
- **T3 — 5 stale local branches:** Deleted `fix/v1.4.2-hardening-and-adoption`, `hotfix/v1.8.0-post-release-sync`, `release/v1.1.0`, `release/v1.2.0`, `release/v1.3.0`. All pre-v2.0, never re-merged into main.
- **T4 — `vibe-spec` / `vibe-specify` bifurcation:** Deprecated `commands/vibe-specify.md` (now a redirect notice). Updated 18+ references across CLAUDE.md, README files, registry/prompts.json, commands/manifest.json, 5 docs/workflows files, 2 docs/skill-packs, agent-alignment-template, superpowers plan. `vibe-spec` is now the single spec command.
- **T5 — `command-tools.mjs` dead code:** Wired 5 command tools (`vibe.spec`, `vibe.plan`, `vibe.review`, `vibe.memory`, `vibe.merge`) into the MCP server. Server now exposes **11 tools total** (6 runtime + 5 vibe commands).
- **T6 — Skill/command count drift:** README claimed 149/116/118; on-disk is 148/120/110. Updated README.md and README.vi.md. Regenerated `commands/manifest.json` (was out of sync — claimed 108, had 120).
- **T7 — `evaluate:all` dashboard sync:** Dashboard narrative count (805 expected) drifted from filesystem (803). Added `skills/core/INDEX.md` to injection allowlist, regenerated dashboard.

#### Hooks
- **SessionEnd hook schema fix:** Claude Code v2.1.92 rejected the legacy `{ decision, info }` output. Updated `.claude/hooks/session-end-audit-flush.mjs` to emit `{ continue: true, suppressOutput: false }` (current schema). Audit logging behavior unchanged.

#### Validation
- `npm run validate:all` → **38/38 PASS** (was 34/38 with 4 injection-scan + dashboard-sync fails)
- `npm run smoke-test:cli` → **70/70 PASS**
- `npm run smoke-test:adapters` → **10/10 PASS**
- `npm run test:e2e` → **5/5 PASS**
- `npm run smoke-test:runtime` → **PASS**
- `npm run test:project-setup` → **10/10 PASS**
- Live MCP server test → 11 tools (6 runtime + 5 vibe commands)
- Live test with Claude Code → all suites green

## [2.16.0] - 2026-06-20

### Theme: Close the Gaps

**Wave A — Security Wiring (Council of Security & Trust)**
- RTL coverage 100% — 0/126 RTL holes.
- Trust Scoring module (ADR 0004) — Adaptive Trust Levels per source.
- `vibe-bypass-detect` command + script (`scripts/bypass-detect.mjs`).
- 3 new security command tests.
- 4 orphan-TODO cleanups.
- 4 new validation gates.

**Wave B — Skill Maturity + Community Signals**
- YAML frontmatter sweep complete (149/149 skills, 109/109 templates).
- Stale-skill policy active.
- Adapter configs (Codex, Gemini, Cursor, Continue).
- 20 per-skill examples.
- 5 Vietnamese guides.

**Key metrics**
- `npm run validate:all` → 38/38 PASS
- Injection counters → 97.37% coverage
- Memory redaction → 60/60 tests
- Security regression gate → PASS

## [2.15.0] - 2026-06-20

### Theme: Wire the Shield + Skill Maturity + Community Signals

**Wave A — Wire the Shield (Council of Security & Trust)**
- Refactored 5/5 Claude Code hooks to use v2.14.0 redactor + injection-counters (ADR 0003 3-layer Defense in Depth).
- Auto-generated default-deny allowlist: `scripts/generate-hook-allowlist.mjs` (NEW).
- Sandbox-marker heuristic: 12 pattern types (WebFetch, fetch, axios, etc.) for Layer 0 trust scoring.
- 3 new security commands: `vibe-bypass-detect`, `vibe-adversarial-detect`, `vibe-license-surface`.
- ADR 0004 — Adaptive Trust Levels (Per-Source Risk Scoring) above the 3-layer defense.
- 2 regression tests: `tests/hooks/hook-coverage-matrix.test.mjs`, `tests/hooks/posttool-redactor-wiring.test.mjs`.

**Wave B — Skill Maturity Lift (Council of Engineering)**
- Bulk YAML frontmatter added to all 131 skills (was 18/149, now 149/149) and 98 templates (was 11/109, now 109/109).
- 2 bulk scripts: `scripts/add-skill-frontmatter.mjs`, `scripts/add-template-frontmatter.mjs`.
- 5 regression tests for top-priority skills: disciplined-diagnosis, bug-fix-lifecycle, safe-refactor, review-before-merge, writing-plans (49/49 assertions PASS).
- Stale-skill policy: `docs/stale-skill-policy.md` (Fresh ≤90d, Aging 91-180d, Stale >180d, Abandoned >365d).

**Wave C — Community Signals (Council of Adoption)**
- 4 adapter config files: `adapters/codex/config.yaml`, `adapters/gemini/config.yaml`, `adapters/cursor/settings.json`, `adapters/continue/config.json`.
- 20 per-skill examples: `examples/<skill>/example-1.md` for top 20 flagship skills.
- 5 Vietnamese guides: `docs/vi/getting-started.md`, `docs/vi/spec-plan-implement.md`, `docs/vi/skill-maturity.md`, `docs/vi/security-shield.md`, `docs/vi/adapters.md`.
- Community section: `docs/community.md` (contributor guide, code of conduct, maintainer track).
- Dependency policy: `docs/dependencies.md` (runtime frozen, minimal dev deps).

## [2.14.0] - 2026-06-20

### Theme: Defense in Depth + Engineering Quality

**Council of Security & Trust (Wave A)**
- 3-layer Defense in Depth (ADR 0003): DETECT (19 OWASP LLM01 patterns, 97.37% coverage) → CONTAIN (5 modes, 30-pattern redactor) → RECOVER (canary corpus, regression test, ≥95% floor).
- 5 redactor modes: `redact`, `audit`, `lockdown`, `quarantine`, `dry-run`.
- 30-pattern redactor (`security/redact/redactor.mjs`).
- 19 OWASP LLM01 patterns (`security/defense/injection-counters.mjs`).
- Canary corpus: 100 payloads, regression test asserts ≥95% coverage.
- Memory redaction: 30 patterns, deterministic.
- Secret scan: 24 patterns, 4-file format support.

**Council of Engineering (Wave B)**
- Skill Quality Gate: required sections (Purpose, When to use, Workflow) + recommended sections (Inputs, Outputs, Failure modes, Verification checklist, Related skills).
- Weak-verb detection in Workflow sections.
- Non-falsifiable checklist detection.
- 3-stage Quality Engine: lint → diff audit → scorecard report.
- 5 Bilingual README gates (en/vi sync).
- Prose lint: 7 weak-verb patterns, 6 hedge phrases, 12 maximizers.

**Council of Adoption (Wave C)**
- Discovery: README user/maintainer/runtime paths, layer READMEs.
- Adapter docs: Claude Code, Codex, Cursor, Gemini, Memory, Compatibility matrix.
- CLI onboarding UX: `vibe init --help`, `vibe doctor --project .`.
- 6 orphan template warnings (pre-existing, non-blocking).

**Validation**: 33/33 PASS. 149 skills, 116 commands, 80 templates, 727 narrative files.
## [2.13.0] - 2026-06-20

### Theme: Security Shield + Engineering Quality Lift

**Wave A — Security Critical (Council of Security & Trust)**
- Bypass authorization gate: `scripts/load-bypass-techniques.mjs` gates `registry/bypass-techniques.json` payloads behind `VIBE_ENABLE_OFFENSIVE_TECHNIQUES=1` + `--authorization-ref`. Executable templates stripped from JSON; only metadata remains. All load attempts logged to `docs/security/bypass-load-attempts.log`.
- Default-deny hooks baseline: `.claude/settings.json` + 6 hook scripts (PreToolUse default-deny with allowlist per (tool, action); UserPromptSubmit injection scan; PostToolUse secret scan; SessionStart context load; Stop session snapshot; SessionEnd audit flush).
- OWASP LLM Top 10 coverage in `skills/core/secure-coding-checklist/SKILL.md` — LLM01–LLM10 mapping layer added to existing OWASP table.
- Prompt anti-injection contract in `templates/prompt-template-7-section.md` — anti-injection checklist (treat tool output as untrusted, persona ≤2 sentences, constraint origin).
- License policy enforcement: `scripts/validate-licenses.mjs` fails CI if `import_mode=inspiration` + non-permissive license. Flagged eyaltoledano (Commons-Clause) and multica-ai (MIT-incomplete) as `tracked_inspiration`.

**Wave B — Engineering High-Value Additive (Council of Engineering)**
- `skills/core/safe-refactor/SKILL.md` + `commands/vibe-refactor.md` + `templates/refactor-plan.md` — 5-phase refactor protocol (characterize → cover → extract → migrate → cleanup).
- 3 ops templates: `templates/incident-postmortem.md`, `templates/rollout-plan.md`, `templates/runbook.md`. Linked from `skills/core/observability-design/SKILL.md`.
- `docs/workflows/plan-skill-decision-tree.md` — 6 plan-family skills disambiguated with 7-step decision tree. `## Choose instead` sections added to all 6 plan-* skills.
- `scripts/validate-traceability.mjs --strict-new --since=<tag>` — promotes orphan warnings to ERRORS for newly-added files since the tag.
- ADR refs in `registry/runtime-freeze-allowlist.json` — `adr` field points to `docs/adr/0002-runtime-scope-freeze.md`. New `scripts/validate-runtime-freeze.mjs` enforces policy.

**Quality metric**
- Validation gates: 28 → 30 (added License policy + Traceability strict-new).
- Skills: 142 → 143 (safe-refactor).
- Templates: 112 → 116 (refactor-plan, incident-postmortem, rollout-plan, runbook).
- All 30/30 gates PASS.

All notable changes to Vibe Coding OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.0] — 2026-06-20 — "Quality Shield + rohitg00 Adoption + GitHub SEO"

### Added
- 3 NEW core skills inspired by `RohitG00/awesome-claude-code-toolkit` (Apache-2.0, verified 2026-06-20):
  - `skills/core/claude-code-hooks-pack/SKILL.md` — declarative pattern for `PreToolUse`/`PostToolUse`/`Stop`/`SessionStart`/`SessionEnd` hooks with matchers and guard rails
  - `skills/core/secure-coding-checklist/SKILL.md` — OWASP Top 10-mapped three-layer review (input validation, output encoding, identity & capability)
  - `skills/core/prompt-architecture/SKILL.md` — 7-section prompt template (Persona → Context → Constraints → Toolset → Output Schema → Examples → Anti-patterns)
- 3 NEW commands: `vibe-hooks-pack`, `vibe-secure-coding`, `vibe-prompt-architect`
- 3 NEW templates: `hooks-pack-template`, `secure-coding-checklist-template`, `prompt-template-7-section`
- NEW skill files for broken refs: `skills/core/red-team-bypass/SKILL.md`, `skills/core/writing-skills/SKILL.md`
- NEW template: `templates/skill-template.md` (8-section canonical template enforced by `validate-skill-quality.mjs`)
- NEW validator: `scripts/validate-skill-quality.mjs` — lints every SKILL.md against the 8-section contract; flags weak verbs, non-falsifiable verification gates, missing required sections, and token bloat
- NEW adapter artifacts:
  - `adapters/windsurf/.windsurfrules.template` — drop-in `.windsurfrules` content
  - `adapters/windsurf/windsurf.json` + `adapters/windsurf/TROUBLESHOOTING.md`
  - `adapters/cline/MODE_ARTIFACTS.md` — 3 mode files (architect / ask / code)
  - `adapters/cline/mcp_settings.example.json` + `adapters/cline/TROUBLESHOOTING.md` + `adapters/cline/cline.json`
- NEW docs: `docs/marketplace/SUBMISSION.md` (Claude Code marketplace submission package)
- NEW asset: `docs/assets/social-preview.png` (1200×630 marketing banner)
- NEW reference source: `RohitG00/awesome-claude-code-toolkit` (#22) — Apache-2.0, `references/sources/rohitg00-awesome-claude-code-toolkit.md` + changelog
- GitHub SEO overhaul: 15 repo topics, project description, Discussions enabled, social preview image

### Changed
- Enhanced `skills/core/quality-engine/SKILL.md` — falsifiable Verification checklist (LCP/INP/CLS/TTFB/API p99, FCP, console errors, network call budget, profile coverage)
- Enhanced `skills/core/verification-before-done/SKILL.md` — falsifiable 5-axis Verification checklist with concrete gates
- Enhanced `adapters/windsurf/README.md` — added "Files in this adapter" table, references to `.windsurfrules.template` + `TROUBLESHOOTING.md`
- Enhanced `adapters/cline/README.md` — added "Files in this adapter" table, references to `MODE_ARTIFACTS.md` + `TROUBLESHOOTING.md` + `mcp_settings.example.json`
- Enhanced `package.json` — added `validate:skill-quality` script
- Enhanced `scripts/validate-all.mjs` — wired in `validate-provenance.mjs` (Move 2a quick win) and `validate-skill-quality.mjs`
- Enhanced `registry/skills.json` — registered 5 new skills (claude-code-hooks-pack, secure-coding-checklist, prompt-architecture, red-team-bypass, writing-skills)
- Enhanced `registry/prompts.json` — registered 3 new commands (vibe-hooks-pack, vibe-secure-coding, vibe-prompt-architect)
- Enhanced `plugins/marketplace.json` — bumped to v2.12.0; updated description and inner plugin counts
- Enhanced `README.md`, `README.vi.md`, `docs/DASHBOARD.md` — all metadata bumped to v2.12.0 with new counts

### Fixed
- Provenance gate was not wired into `validate-all.mjs` (now wired — Move 2a).
- Three orphan skills were referenced but missing files (red-team-bypass, writing-skills, prompt-architecture — now created).
- One broken markdown link in `prompt-architecture/SKILL.md` (path now resolves).

### Validation
- `npm run validate:all` → **28/28 PASS**
- `npm run validate:references` → **22 sources, 26 features, 5 commands**
- `npm run validate:skill-quality` → **142 skills, 0 errors, 249 informational warnings**
- `npm run quality:engine` → **PASS**

## [Unreleased]

## [2.11.0] — 2026-06-20 — "Engineering Discipline Pack"

### Added
- 5 NEW core skills inspired by `addyosmani/agent-skills` (MIT, verified 2026-06-20):
  - `skills/core/doubt-driven-development/SKILL.md` — in-flight doubt posture with CLS-DAR protocol and Loading Constraints
  - `skills/core/observability-design/SKILL.md` — questions-before-signals workflow with metric/log/trace trade-off
  - `skills/core/deprecation-migration/SKILL.md` — Compulsory/Advisory classification with 5 pre-deprecation questions
  - `skills/core/threat-model-driven-security/SKILL.md` — STRIDE 6-letter lens on (boundary, asset, adversary) tuples + abuse cases
  - `skills/core/vertical-slicing/SKILL.md` — end-to-end vertical slice doctrine with 5-step cycle
- 7 NEW commands: `vibe-doubt`, `vibe-observability`, `vibe-deprecate`, `vibe-migrate`, `vibe-threat-model`, `vibe-slice`, `vibe-perf-budget`
- 6 NEW templates: `doubt-log`, `observability-plan-template`, `deprecation-notice-template`, `threat-model-template`, `slice-spec-template`, `performance-budget-template`
- NEW architectural artifacts: `plugins/manifest.json` (plugin metadata), `plugins/marketplace.json` (discovery index)
- NEW registry: `registry/deprecation-tracker.json` (append-only deprecation ledger)
- NEW reference source tracking: `addyosmani/agent-skills` (#21), `references/sources/addyosmani-agent-skills.md`, `references/changelogs/addyosmani-agent-skills.md`

### Changed
- Enhanced `skills/core/quality-engine/SKILL.md` — added Core Web Vitals targets table (LCP/INP/CLS/TTFB/API p99) and MEASURE → IDENTIFY → FIX → VERIFY → GUARD loop
- Enhanced `skills/core/grill-user-before-building/SKILL.md` — added 95% confidence stop condition, single-question cadence, Loading Constraints anti-pattern catalog
- Enhanced `skills/core/verification-before-done/SKILL.md` — added 5-axis runtime verification (DOM, Console, Network, Performance, Visual)
- Enhanced `docs/orchestration-guide.md` — added Anti-patterns section (persona-calls-persona, deep trees, single-agent-all-perspectives, summarize-for-handoff, sequential-when-parallel, mid-slice commits) + Loading Constraints table
- Enhanced `scripts/validate-schemas.mjs` — soft-warns on missing recommended skill sections (`## Common rationalizations`, `## Red flags`, `## Verification checklist`) without breaking existing skills
- Enhanced `commands/manifest.json` and `templates/manifest.json` — generated from filesystem (108 commands, 92 templates)

### Sources
- `addyosmani/agent-skills` (MIT) — full attribution in `ATTRIBUTIONS.md` and `NOTICE.md`

### Inspiration sources tracked
- 20 → 21 sources

## [2.9.0] — 2026-06-19

### Added
- Release pipeline automation for streamlined versioning and publish workflow.
- Plugin metadata support for adapter manifests and plugin discovery.
- MCP command tools for richer model-context-protocol integration.
- Dashboard trend persistence — CI-friendly trend data across releases.
- Context injection skill for runtime prompt augmentation.
- AC (acceptance criteria) quality pack for structured verification.
- Agent alignment workflow for multi-agent coordination.

### Changed
- CLAUDE.md slimmed down for faster agent onboarding and reduced token usage.
- Memory compression for more efficient session storage.
- Anti-overengineering guardrails applied across core workflows.

### Fixed
- Claude Code quality pass: AGENTS.md deduplication, CLAUDE.md polish, onboarding UX fixes.
- Post-release sync: README v2.8.0 sections, CLI tool listing, adapter smoke tests.

## [2.8.0] — 2026-06-19

### Added
- Adapter expansion: **Cline**, **Continue.dev**, **Aider**, and **Windsurf** adapters with setup manifests and documentation.
- Per-adapter README setup commands and compatibility notes.

### Changed
- Adapter support matrix expanded to cover 8 AI coding tools.

## [2.7.0] — 2026-06-19

### Added
- AI Testing Suite: property-based testing framework for skill and command validation.
- Benchmark harness for measuring workflow execution performance.
- Test generator for automated behavioral test creation from specs.
- Trend dashboard for visualizing test pass/fail rates over time.
- PR comment integration for automated test summary annotations.

## [2.6.0] — 2026-06-19

### Added
- Full implementation loop for all reference source features — upstream tracking, adoption scoring, provenance gates, and audit changelogs now fully wired end-to-end.
- AI Testing Suite roadmap and Docusaurus website scaffold.
- 4 new upstream sources added to reference index.
- Bug-fix lifecycle tracking in reference docs.
- MemScore triple metric in reference evaluation docs.

### Fixed
- Lesson-importer ISO expiry handling.
- Schema warnings and CLI bug fixes.
- Dashboard sync drift corrections.

## [2.5.0] — 2026-06-19

### Added
- Advanced Orchestration — roadmap 100% complete.
- Multi-agent task routing and parallelization rules.
- Team orchestration handoff contracts and conflict handling.

## [2.4.0] — 2026-06-19

### Added
- CI/CD Integration layer for automated validation, testing, and release gates.
- GitHub Actions workflow enhancements for full validation pipeline.

## [2.3.0] — 2026-06-19

### Added
- Multi-Repo Learning — cross-repository skill and pattern sharing.
- Upstream intelligence aggregation across linked repositories.

## [2.2.0] — 2026-06-19

### Added
- Quality Telemetry & Analytics: event emitter, metrics collector, and trend reports.
- Runtime quality metrics for skill execution and workflow outcomes.

## [2.1.0] — 2026-06-19

### Added
- Model-Aware Configuration: model profiles, task-risk classifier, and adaptive gate selector.
- Context-aware workflow tier selection based on model capabilities.

## [2.0.0] — 2026-06-19

### Added
- Quality Engine MVP: gate manifest, engine runner, report generator, quality skill, and quality command.
- Structured quality verification framework with configurable gate definitions.

## [1.9.0] — 2026-06-19

### Added
- Smart Adapt: model weakness memory, adaptive prompts, lessons learned, and scorecard report.
- Runtime adaptation based on observed model failure patterns.

## [1.8.0] — 2026-06-19

### Added
- Expert Mode: adversarial review pass, critique pass, 5 task-specific quality packs, and quality council.
- Structured expert-level review workflows for high-risk changes.

### Fixed
- Dashboard and roadmap sync corrections.

## [1.7.0] — 2026-06-19

### Added
- Quality Shield: quality-shield.md guide, quality-shield-workflow.md process, and quality-shield example.
- Code Context Pack, Pattern Library, and Quality Diff Audit (Sprint 2).
- Quality Shield completion artifacts and canonical guide.

## [1.6.0] — 2026-06-19

### Added
- Adoption Trust foundations: README user/maintainer paths, adapter documentation, layer entrypoints.
- CLI onboarding UX polish (`vibe init`, `vibe doctor`).
- Validation gates and governance documentation.
- Examples hub for discoverable workflow templates.
- Project-local scope-selecting setup flow.

### Changed
- Hardened v1.6 adoption trust foundations across roadmap and docs.

## [1.5.0] — 2026-06-17

### Added
- docs/adr/0002-runtime-scope-freeze.md: formal runtime scope freeze declaration.
- docs/vi/QUICKSTART.md: Vietnamese quickstart guide.
- .github/ISSUE_TEMPLATE/adoption-feedback.md: structured adoption feedback issue template.

### Fixed
- runtime/core/config.mjs: normalize unknown maxRiskLevel to default on load.
- runtime/core/config.mjs: validate tools.allowed / tools.denied are arrays of strings.
- runtime/core/approval-gate.mjs: approval subject includes argsHash so approval is scoped per argument set.
- runtime/tasks/task-store.mjs: reject negative TTL in claimTask, heartbeatTask, renewTaskLease.
- scripts/test-runtime-claim-lease.mjs: replace negative TTL test setup with backdated store writes; add explicit negative TTL rejection tests.

### Changed
- README.vi.md: dieted from 536 to 194 lines.
- docs/ROADMAP-STATUS.md: added v1.4.1, v1.4.2, v1.4.3, v1.5.0 sections.
- docs/support-matrix.md: runtime layer now documents scope freeze and ADR 0002.
- docs/adr/0001-optional-runtime-layer.md: reconcile with ADR 0002 scope freeze.
- CHANGELOG.md: fix runtime test count claim from 18/18 to 14/14 test files.
- docs/releases/v1.4.3.md: reconcile runtime test count.

## [1.4.3] — 2026-06-17

### Fixed
- task-store.mjs: `claimTask()` now rejects terminal states (completed/cancelled) — state machine contract is solid.
- task-store.mjs: `renewTaskLease()` now caps absolute expiration at `now + maxTaskLease`, preventing lease drift from migrated/corrupt data.
- tmux-runner.mjs: `requireTmux()` now throws an Error instead of calling `process.exit(1)`, making it safe for library and test use.
- tmux-runner.mjs: `mapResults()` now returns final task objects (after status updates) instead of stale pre-update objects.
- runtime/mcp/server.mjs: `task.update` handler now forwards `actor: mcp` into `updateTaskStatus()`.
- runtime/core/config.mjs: invalid `maxTaskLease` values (zero, negative, non-finite) silently reset to defaults with a `_configWarning` field.
- README.md: reduced from 618 → ~260 lines. Product identity is now unmistakable on first load.
- README.vi.md: updated to v1.4.3 with matching Vietnamese release notes.
- docs/README.md: rewritten as a full docs navigation hub with categorized template links (resolves 12 orphan template warnings).
- docs/vi/strategy-and-roadmap.md: updated from v1.4.0 → v1.4.2/v1.4.3 with current status metrics.
- docs/RELEASE-PACKAGING.md: version header updated from 1.0.0 → current; workflow modernized.

### Changed
- README.md: new "What's new in v1.4.3" section, clear "Core vs Optional Runtime" section, adapter bullet list for traceability.
- docs/QUICKSTART.md: rewritten with explicit doc role ("tool setup only, not a workflow guide").
- docs/FIRST-WORKFLOW.md: added scope statement linking to QUICKSTART and INSTALL.
- docs/RELEASE-PACKAGING.md: rewritten for v1.4.x workflow with modern `npm pkg set` flow.

### Tests
- Added `claimTask rejects terminal tasks` test (verifies terminal state guard).
- Added `renewTaskLease absolute expiration capped by config maxTaskLease` test (verifies absolute lease cap).
- Runtime behavior aggregate: 14/14 test files PASS; claim/lease test file includes terminal state, lease cap, and negative TTL cases.

## [1.4.1] — 2026-06-17

### Fixed
- Stale docs counts: README.vi template count (54→56), support-matrix version references, Vietnamese strategy/roadmap refreshed for v1.4.
- CHANGELOG.md now includes v1.1.0–v1.4.0 and v1.4.1 entries (previously missing).
- CLI pack `install-pack` usage help shows flags and required/optional args correctly.
- CLI `doctor` help now shows `--project <path>` (not `[--project]`), `events` shows `--limit=N`.
- Removed unused import `appendEventV2` in vibe-cli.mjs.
- Removed unreachable `if (json)` branch in `cmdDoctor` after early return.
- Task state machine: fixed misleading subtask guard comment.
- task-store.mjs: removed dead no-op conditional block.
- test-runtime-audit.mjs test data now uses valid status `in_progress` instead of `active`.
- tmux-runner.mjs: validated agent command before shell interpolation, single-quoted prompt path.

## [1.4.0] — 2026-06-17

### Added
- Runtime kernel with optional config layer, formal task state machine, and broader schema enforcement.
- Event Store v2 with sequence numbers, correlation/causation IDs, idempotency keys, and metadata consistency checks.
- Runtime observability via `vibe doctor --json` and `vibe events --json`.
- Config-enforced `maxTaskLease` behavior in claim/renew APIs.
- Event-store v2 tests, doctor tests, and CLI JSON contract tests.

### Changed
- Legacy events.mjs append path now wraps canonical v2 behavior.
- Expanded runtime behavioral test coverage to 14 suites.

### Fixed
- `vibe doctor --json` now emits JSON-only output.
- `vibe events` shows latest/recent events correctly.
- `--limit` validation for event CLI output.

## [1.3.0] — 2026-06-17

### Added
- Runtime enforcement core: centralized validation layer before runtime store writes with `assertValidItem`, `assertStrictCollection`, `assertKnownFields`, `assertRiskWithin`, `assertAction`.
- Claim/lease task APIs: `claimTask`, `releaseTask`, `heartbeatTask`, `renewTaskLease`, `listExpiredClaims`, `cancelExpiredClaims`.
- Safety & recovery: approval gate middleware, tool boundary enforcement (fail-closed), runtime safety audit, event replay/snapshot/migration utilities.
- Behavioral integration tests: 9 test files, 76 test cases (validation gate #18).
- 2 new templates: `session-metrics`, `skill-proposal`.

### Fixed
- Release-facing README, README.vi, and roadmap history updated.
- Heading-version validator added as validation gate #17.

## [1.2.0] — 2026-06-17

### Added
- Runtime schema v2 foundation with `contractVersion`, `runtimeId`, `revision`, `createdBy`, `source`, `trace`, `risk` fields.
- Multi-agent state contracts v2 for task, workflow-run, checkpoint, session, team, and memory schemas.
- Safety + traceability: action v2, runtime event, approval, tool-contract schemas.
- Migration manifest + dry-run engine for safer runtime-state upgrades.

### Fixed
- Docs drift hotfix: dashboard gate count, version progress, orphan wording, Vietnamese strategy wording corrected.
- Validators expanded to catch stale counts and dashboard/version drift earlier.

## [1.1.0] — 2026-06-17

### Added
- Schema alignment across registries, runtime payloads, and validation scripts.
- Workflow state hardening for task, memory, checkpoint, team, session, and MCP flows.
- Expanded CLI coverage: 20 CLI smoke tests passing.
- Adapter packs refreshed for Cursor, Codex, and Claude setups.
- Execution trace support for local runtime activity logging.
- Bilingual sync validation for English/Vietnamese documentation alignment.
- Markdown link validation to catch broken references before release.

### Changed
- Expanded release validation from 13 to 16 gates.
- Refreshed adapter documentation for portability across tools.

## [1.0.0] — 2026-06-17

### Added
- Dashboard sync validation (`scripts/check-dashboard-sync.mjs`, `npm run dashboard:check`) that verifies `docs/DASHBOARD.md` matches live package version, inventory counts, narrative file count, and orphan counts; added to `npm run validate:all`.
- Release checklist issue template (`.github/ISSUE_TEMPLATE/release_checklist.md`) for tracking RC progress, validation gates, documentation checks, and post-release verification.
- Compatibility report issue template (`.github/ISSUE_TEMPLATE/compatibility_report.md`) for adapter compatibility regressions and support-tier issues.
- Safety / eval report issue template (`.github/ISSUE_TEMPLATE/safety_eval_report.md`) for safety check failures, eval regressions, and security concerns.
- PR template updated with v1.0 gates section: `validate:all`, schema validation, CLI/E2E, release dry-run, and docs/dashboard sync.
- Governance doc updated to reference new issue templates for routing release, compatibility, and safety work.
- v1.0 release plan (`docs/v1.0-release-plan.md`) with scope definition, done criteria, required gates, RC strategy (`v1.0.0-rc.1` → feedback → final), and release manager workflow.
- v1.0 RC checklist (`docs/v1.0-rc-checklist.md`) with pre-RC validation, release notes requirements, documentation completeness checks, and post-merge verification steps.
- Support matrix (`docs/support-matrix.md`) with adapter support tiers, optional runtime vs core expectations, and compatibility policy summary.
- ROADMAP-STATUS.md updated: v0.4.0 marked as release-ready, v1.0 progress moved to ~65% with v1.0 planning deliverables.
- README status refresh with CI/status badges, compact current-status line (v0.4.0, 90 skills, 68 commands, 41 templates, validate:all 13/13, 0 broken refs, 0 orphans), and links to DASHBOARD, RELEASE-PACKAGING, ROADMAP-STATUS, QUICKSTART, tutorial, v0.4.0 release notes, and v1.0 release plan. Equivalent Vietnamese updates in README.vi.md.
- v0.4.0 GitHub Release notes draft (`docs/releases/v0.4.0.md`) with summary, highlights, validation status, upgrade notes, and post-merge tag instructions.
- RELEASE-PACKAGING.md now points to `docs/releases/v0.4.0.md` as the current release note draft.
- 15-minute onboarding tutorials in English and Vietnamese (`docs/TUTORIAL.md`, `docs/vi/TUTORIAL.vi.md`) covering clone/install, validation, CLI artifacts, eval reports, review/merge checklist, and troubleshooting.
- v1.0 contribution governance and maintainer process docs (`docs/governance.md`, `docs/decision-record-process.md`, `docs/maintainer-guide.md`), plus `CONTRIBUTING.md` links and roadmap updates.
- Stable registry schema contracts in `schemas/` for the reference index, skills, commands, and templates.
- Lightweight schema validation (`scripts/validate-schemas.mjs`, `npm run validate:schemas`) covering schema JSON validity, `references/index.json`, skill headings/descriptions, and command prompt content.
- Registry schema documentation (`docs/registry-schemas.md`) and full validation gate coverage via `npm run validate:all`.
- CLI smoke tests (`scripts/smoke-test-cli.mjs`, `npm run smoke-test:cli`) covering 7 read-only CLI commands with pass/fail per command and overall.
- Dashboard generator (`scripts/generate-dashboard.mjs`, `npm run dashboard:generate`) that regenerates `docs/DASHBOARD.md` from live dashboard data with auto-generated mark.
- `npm run dashboard:data` script alias for direct JSON data extraction.
- CLI smoke tests and dashboard data checks added to `npm run validate:all`.
- Release checklist updated with dashboard regeneration section.
- `scripts/vibe-cli.mjs` and `scripts/dashboard-data.mjs` refactored to export their command/functionality for reuse by other scripts.
- End-to-end CLI workflow integration test (`scripts/test-e2e-workflow.mjs`, `npm run test:e2e`) that copies templates to a temp dir, asserts content, runs read-only CLI commands, and cleans up. Added to validation gate (`npm run validate:all`) and release checklist.
- Release dry-run automation (`scripts/release.mjs`, `npm run release:dry-run`) that validates clean git status, runs the full validation gate and dashboard data check, and prints exact tag/GitHub release next steps without pushing tags.
- GitHub Actions validate workflow now runs the full `npm run validate:all` gate, with the adapter smoke workflow documented as fast path-focused coverage.

## [0.4.0] — 2026-06-16

### Added
- Release packaging guide (`docs/RELEASE-PACKAGING.md`) covering version numbering, tag naming conventions, pre-release checklist, GitHub release creation, CHANGELOG section header updates, and a release notes template
- Version bump script (`scripts/bump-version.sh`) — automated version updates to `package.json`, CHANGELOG section header migration, git tag creation, and next-step instructions
- CLI workflow examples (`examples/cli-workflows/README.md`) — practical examples for `vibe doctor`, `vibe spec`, `vibe plan`, `vibe task`, `vibe memory`, `vibe templates`, and `npm run eval:report` with expected outputs and usage guidance
- Project health dashboard (`docs/DASHBOARD.md`) with quick status, safety metrics, coverage summary, and regeneration commands
- Dashboard data extractor (`scripts/dashboard-data.mjs`) for clean JSON counts across skills, commands, templates, narrative files, upstream sources, and traceability warnings
- Full validation gate (`scripts/validate-all.mjs`, `npm run validate:all`) covering repo, references, traceability, injection, secrets, memory redaction, adapter smoke tests, and eval summary
- ROADMAP-STATUS.md updated to mark dashboard + validate-all as done under v1.0
- ROADMAP-STATUS.md updated to mark release packaging and CLI examples as done
- Detailed adapter install snippets for Claude Code, Codex, and Cursor, including `docs/adapter-install-snippets.md` and per-adapter README setup commands.
- v1.0 foundation docs: core workflow contract, release checklist, compatibility/support policy (docs/core-workflow-contract.md, docs/release-checklist.md, docs/compatibility-support-policy.md)
- Memory redaction test suite (30 cases in docs/tests/ + scripts/verify-memory-redaction.mjs)
- CLI helper MVP (`vibe init`, `vibe doctor`, `vibe stats`, `vibe list-skills`, `vibe list-commands`) in scripts/vibe-cli.mjs
- Adapter smoke tests + CI workflow (scripts/smoke-test-adapters.mjs, .github/workflows/smoke-test.yml)
- Upstream Intelligence Pack (`docs/skill-packs/upstream-intelligence-pack.md`) with Discover → Score → Provenance/License Gate → Adapt, don't copy → Attribute → Validate → Report workflow, safe import checklist, and upstream evaluation example
- Skill packs: Core Solo Developer, Memory-Safe, Multi-Agent (docs/skill-packs/)
- Skill decision guide (docs/skill-decision-guide.md)
- Runtime guide (docs/RUNTIME-GUIDE.md — MCP setup, commands, troubleshooting)
- ROADMAP-STATUS.md (docs/ROADMAP-STATUS.md)
- CHANGELOG.md (Keep a Changelog format)
- CONTRIBUTING.md (skill/command/template contribution guide)
- CODE_OF_CONDUCT.md (Contributor Covenant v2.1)
- .github/ (issue templates, PR template, CI workflows)
- docs/QUICKSTART.md (10-min guides for Claude Code, Codex, Cursor)
- 5 examples: bugfix-workflow, feature-workflow, legacy-enhancement, multi-agent-task, refactor-workflow
- docs/eval-scenarios.md (5 behavioral evaluation scenarios)
- references/upstream-intake-scorecard.md (1-5 rubric + decision matrix)
- docs/adr/0002-notification-system.md (ADR for multi-agent demo)
- Evaluation report runner (scripts/evaluation-report.mjs)
- 15-minute onboarding tutorials in English and Vietnamese (`docs/TUTORIAL.md`, `docs/vi/TUTORIAL.vi.md`) covering clone/install, validation, CLI artifacts, eval reports, review/merge checklist, and troubleshooting.
- v1.0 contribution governance trio: governance, decision-record process, and maintainer guide (`docs/governance.md`, `docs/decision-record-process.md`, `docs/maintainer-guide.md`), plus `CONTRIBUTING.md` links and roadmap updates.
- Stable registry schemas in `schemas/` for the reference index, skills, commands, and templates, with lightweight schema validation (`scripts/validate-schemas.mjs`, `npm run validate:schemas`) and full validation gate coverage.
- CLI smoke tests (`scripts/smoke-test-cli.mjs`, `npm run smoke-test:cli`) covering read-only CLI commands with pass/fail reporting.
- Dashboard generator (`scripts/generate-dashboard.mjs`, `npm run dashboard:generate`) plus `npm run dashboard:data` for direct JSON data extraction.
- End-to-end CLI workflow integration test (`scripts/test-e2e-workflow.mjs`, `npm run test:e2e`) that exercises template copies, read-only CLI commands, assertions, and cleanup.
- v0.4.0 GitHub Release notes draft (`docs/releases/v0.4.0.md`) with copy-ready release body and post-merge tag commands.

## [0.1.0] — 2026-06-06

First public release of Vibe Coding OS — a markdown-first AI coding skill framework for disciplined vibe coding.

### Added

#### Core Workflow
- Default workflow: **Intent → Spec → Plan → Implement → Test → Review → Memory → Merge**
- Adaptive workflow tiers: tiny, small, medium, large, and risky
- Spec-driven development layer with constitution, specify, plan, tasks, and implementation-readiness gate

#### Skills System
- 90 skills across 5 categories:
  - **Core** (47): clarify-before-code, spec-first-development, plan-driven-execution, TDD, review-before-merge, verification, anti-overengineering, and more
  - **Prompts** (13): Karpathy-inspired think/simplicity/surgical/goal-driven disciplines and coding book principles
  - **Memory** (17): session capture, summarization, privacy filtering, progressive retrieval, citation
  - **Meta** (9): skill writing, reuse, skillify-from-session
  - **Agents** (4): architect, implementer, reviewer, tester roles

#### Command Prompts
- 68 command prompts in `vibe-*` format covering initialization, specification, planning, implementation, review, memory, merge, diagnostics, reference, and team orchestration

#### Templates
- 41 reusable templates for specs, plans, tasks, PRDs, ADRs, architecture reviews, reviews, diagnoses, memory entries, session summaries, handoffs, upstream audits, reference scorecards, team specs, and runtime configs

#### Reference Intelligence Layer
- Tracking 14 upstream sources with source docs, feature maps, local file mappings, audit changelogs, and `references/index.json`
- Upstream adoption policy with 7-point adoption gate
- Clean attribution via `ATTRIBUTIONS.md` and `NOTICE.md`

#### Runtime Layer (Optional)
- JSON-first local state for tasks, memory, checkpoints, team, and sessions
- MCP server exposing task/memory/checkpoint tools
- Tmux team runner for parallel agent execution
- Daemon workflow support
- Vector memory search (optional)
- Idempotent installer (`runtime-install.mjs`)

#### Adapters
- **Claude Code**: plugin manifest (`.claude-plugin/plugin.json`), marketplace manifest, manual setup via `CLAUDE.md`
- **Codex CLI**: instruction surface via `AGENTS.md`
- **Cursor**: `.cursorrules` and manual chat workflow
- **Gemini CLI**: `GEMINI.md` instruction file

#### Validation System
- Repository structure validation
- Reference layer validation
- Traceability validation (broken internal references, orphan detection)
- Injection validation
- Secrets detection
- Provenance tracking

#### Documentation
- Bilingual documentation: Vietnamese (`docs/vi/`) and English
- Vietnamese README (`README.vi.md`)
- Vietnamese onboarding docs: index, skills-and-commands, folders-and-workflows, strategy-and-roadmap
- Adapter compatibility matrix
- Real engineering skills workflow documentation

#### Team-Agent Orchestration
- Team architecture templates
- Role routing (architect, implementer, tester, reviewer, memory architect)
- Handoff contracts and conflict handling
- Parallelization rules and review gates

#### Memory and Privacy Layer
- Session capture and summarization
- Privacy filter and redaction checklist
- Progressive memory disclosure
- Observation citation
- Secret and credential exclusion

### License

This project is licensed under the [MIT License](LICENSE).

[2.17.5]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.17.4...v2.17.5
[Unreleased]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.17.5...HEAD
[2.17.4]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.17.3...v2.17.4
[2.17.3]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.17.2...v2.17.3
[2.17.2]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.17.1...v2.17.2
[2.17.1]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.17.0...v2.17.1
[2.17.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.16.0...v2.17.0
[2.16.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.15.0...v2.16.0
[2.15.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.14.0...v2.15.0
[2.14.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.13.0...v2.14.0
[2.13.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.12.0...v2.13.0
[2.12.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.11.0...v2.12.0
[2.11.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.10.0...v2.11.0
[2.10.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.9.0...v2.10.0
[2.9.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.8.0...v2.9.0
[2.8.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.7.0...v2.8.0
[2.7.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.6.0...v2.7.0
[2.6.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.5.0...v2.6.0
[2.5.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.4.0...v2.5.0
[2.4.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.9.0...v2.0.0
[1.9.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.8.0...v1.9.0
[1.8.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.4.3...v1.5.0
[1.4.3]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.4.1...v1.4.3
[1.4.1]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v0.4.0...v1.0.0
[0.4.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v0.1.0...v0.4.0
[0.1.0]: https://github.com/roronoazoroshao369/vibe-coding-os/releases/tag/v0.1.0
