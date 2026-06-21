# Quality Impact Audit: QA ACCURACY ROI

**Auditor:** Quality Impact Analyst (trim audit)
**Repo:** Vibe Coding OS v2.16.1
**Date:** 2026-06-21
**Scope:** Does each feature actually IMPROVE CODE ACCURACY, or just LOOK like it does?

---

## EXECUTIVE VERDICT

**Vibe Coding OS is ~30% substantive, ~70% theater for code accuracy.**

The repo has **genuinely good process discipline** — execution contracts, safe-refactor protocols, and critique passes are well-designed workflows that, if followed, *would* prevent certain bugs. The secret-scan and injection-scan tools are real automated enforcement that catches real problems.

**But here's the problem:** the vast majority of quality features are **process prompts, not enforcement mechanisms**. They ask the LLM to "be careful" — but the LLM is the thing making the mistakes. The verification-before-completion skill tells the model "verify your own work," the critique-pass protocol tells the model "critique yourself," and the quality-rubric command tells the model "be disciplined." These are self-auditing processes with no independent verification. The AI that generated the buggy code is the same AI that's supposed to catch it.

**The most critical gap:** There is **zero automated checking for the two most damaging AI bug classes** — hallucinated APIs and wrong-type/wrong-shape data. No TypeScript, no linter, no import-exists checker, no contract-test runner, no static analysis tool. The repo validates *itself* (schema conformance, traceability, file structure) but never validates the *code the AI writes for users*.

The guard-bypass-protocol is worse than zero ROI — it's a tool for bypassing safety filters that has nothing to do with code accuracy and actively undermines responsible AI use.

**Bottom line:** If you use Vibe Coding OS, you'll write disciplined specs and have good intentions, but the AI will still hallucinate APIs, return wrong types, and introduce silent regressions — and **nothing in this repo will catch those bugs for you**.

---

## 5 BUG CLASS COVERAGE MATRIX

| Bug Class | Score | How Vibe Coding OS Catches It | What's Missed | Concrete Fix |
|---|---|---|---|---|
| **(a) Hallucinated API/library** | **1/10** | `model-weakness-memory`/SKILL.md line 17 mentions tracking "hallucinated imports, incorrect API usage" as a pattern to log. `quality-execution-contract` step 5 asks "New dependencies? (none / list and justify)". Both are **self-reported** by the LLM — the same LLM that hallucinated the API. | No import-exists checker. No static analysis. No TypeScript compiler. No `npm install --dry-run` verification that packages exist. No API surface validation. The LLM says "yes I checked" — but the LLM hallucinated in the first place. | Add a `validate-imports.sh` script that parses `import`/`require` statements in changed files and verifies they resolve in `node_modules` or `package.json`. Add `tsc --noEmit` or JS equivalent. **Effort: 2-4h** |
| **(b) Wrong-type/wrong-shape** | **2/10** | `validate-schemas.mjs` validates JSON schemas for *repo artifacts* (templates, registry, sessions). `acceptance-criteria-pack.md` Level 2 requires edge-case and error-path criteria. `verify-before-completion` demands evidence for acceptance criteria. All enforce **documentation discipline**, not runtime type safety. | No type checking for any language. No Zod/Joi/JSON Schema validation at runtime for generated code. No contract tests. No interface/shape assertions. The quality engine runs but never checks that function arguments match their declared types. | Add `npm run typecheck` (via tsc, or at minimum a runtime type-assertion scaffold). Wire it into `quality-engine.mjs` as a critical gate. Add shape-check tests for common patterns. **Effort: 4-8h** |
| **(c) Scope creep** | **6/10** | **BEST process coverage.** `quality-execution-contract` explicitly lists "Files NOT to touch" + "Non-goals" + risk tier. `quality-shield` step 3 mandates "Smallest Safe Diff — No refactoring, no scope creep." `validate-quality-diff.mjs` flags large (50+ line) additions and whitespace churn. `critique-pass-protocol` step 3 challenges "scope drift." `CONSTITUTION.md` line 19 cites scope creep as a core concern. Multiple review checklist templates include "No unrelated files modified." | Enforcement is **LLM-dependent** — the contract asks "do you promise not to touch other files?" and the LLM says "I promise." The diff-size check only catches volume, not subtle scope changes. There's no automated "diff strictly matches declared scope" validator. | Add `validate-scope-match.mjs` — parse the Quality Execution Contract for "files likely to change" and compare against the actual git diff. Fail if diff touches undeclared files. **Effort: 3-6h** |
| **(d) Silent regressions** | **4/10** | `safe-refactor` protocol is genuinely well-designed: characterize → cover → extract → migrate → cleanup, with characterization tests written FIRST, ≥80% coverage required, and each commit must keep tests green. `validate-security-regression.mjs` actually runs canary corpus against injection counters (real regression test). `quality-engine.mjs` orchestrates gates. `verification-before-completion` demands evidence mapping. | Characterization tests must be **written by the LLM** — which may miss edge cases. No diff-based regression detection (change in output for same input). No snapshot testing. No CI integration tying quality gates to PR status. The safe-refactor protocol is brilliant *if followed*, but it's a long process the LLM can skip "because this is a tiny change." | Add `validate-regression.mjs` that runs existing tests BEFORE and AFTER a change, capturing and comparing stdout/exit codes. Wire `safe-refactor` characterization into automated gate. Add snapshot testing scaffold. **Effort: 6-10h** |
| **(e) Security holes** | **7/10** | **STRONGEST coverage.** `validate-secrets.mjs` scans for 20 credential patterns (AWS keys, GitHub tokens, Stripe, OpenAI, etc.) — real regex enforcement. `validate-injection.mjs` scans all skills/commands/templates for known prompt-injection payloads against a 49+ payload canary corpus. `validate-quality-diff.mjs` detects hardcoded credential patterns in diffs. `secure-coding-checklist` SKILL.md is OWASP Top 10 + OWASP LLM Top 10 mapped across 3 layers (input validation, output encoding, identity/capability). `red-team-bypass` catalogs attack patterns with counter-measures. `tests/security/regression.mjs` runs canary corpus with baseline comparison. | SQL injection detection is only in the *checklist* (manual), not automated. No XSS pattern scanning. No dependency vulnerability scanning (no `npm audit` integration). No runtime security testing. The tools detect secrets in *the repo's own files* but not in generated code the LLM produces for users. OWASP checklist is text — humans/LLMs must remember to use it. | Add `validate-sql-injection.mjs` and `validate-xss.mjs` regex scanners for generated code. Wire `npm audit` into quality-engine. Add dependency vuln scan gate. Create automated OWASP checker for LLM output. **Effort: 8-16h** |

---

## HIGHEST-ROI FEATURES (Top 10 That ACTUALLY Catch Bugs)

| Rank | Feature | File(s) | Why It Works | ROI |
|---|---|---|---|---|
| 1 | **Secret Scanner** | `scripts/validate-secrets.mjs`, `runtime/core/privacy.mjs` | Real regex enforcement against 20 credential patterns. Catches accidental commits of API keys, tokens, DB strings. Works regardless of what the LLM thinks. | ★★★★★ |
| 2 | **Injection Scanner** | `scripts/validate-injection.mjs`, `runtime/core/injection-patterns.mjs` | Scans all shipped artifacts for prompt-injection payloads against 49+ canary corpus. Has allowlisting for legitimate false positives. Runs on every validation. | ★★★★★ |
| 3 | **Security Regression Test** | `tests/security/regression.mjs`, `tests/security/canary-corpus.test.mjs` | Actually runs injection counters against a canary corpus and asserts ≥95% coverage. Exit code matters. Independent validation. | ★★★★★ |
| 4 | **Quality Diff Audit** | `scripts/validate-quality-diff.mjs` | Detects silent catch blocks, TODO/FIXME placeholders, credential leaks, whitespace churn, and 50+ line additions in diffs. Automated and syntax-aware. | ★★★★☆ |
| 5 | **Safe Refactor Protocol** | `skills/core/safe-refactor/SKILL.md` | Characterize → cover → extract → migrate → cleanup is a genuinely correct pattern from Feathers/Fowler. Written test-first discipline prevents silent regressions. | ★★★★☆ |
| 6 | **Secure Coding Checklist** | `skills/core/secure-coding-checklist/SKILL.md` | OWASP Top 10 + OWASP LLM Top 10 across 3 enforcement layers. Comprehensive and authoritative. | ★★★★☆ |
| 7 | **Quality Engine Gates** | `scripts/quality-engine.mjs` | Orchestrates real automated checks (structure, schemas, secrets, injection, traceability). Profiles for lean/standard/heavy. Task-type gating. Exit code enforcement. | ★★★★☆ |
| 8 | **Quality Execution Contract** | `skills/core/quality-execution-contract/SKILL.md` | Forces explicit scope, risk tier, "files NOT to touch," new dependencies, test plan before any edit. Best scope-creep process defense. | ★★★☆☆ |
| 9 | **Critique Pass Protocol** | `skills/core/critique-pass-protocol/SKILL.md` | Structured second-look with severity-ranked findings and explicit verdict. Good for catching blind spots if followed. | ★★★☆☆ |
| 10 | **Verification Before Done** | `skills/core/verification-before-done/SKILL.md` (previously also `skills/core/verification-before-done/SKILL.md (merged)`, merged) | Maps acceptance criteria to concrete evidence. Prevents "looks correct" claims. | ★★☆☆☆ |

---

## ZERO-ROI FEATURES (Top 5 That Look Useful But Don't Catch Real Bugs)

| Rank | Feature | File(s) | Why It's Theater | False Claim |
|---|---|---|---|---|
| 1 | **Guard Bypass Protocol** | `skills/core/guard-bypass-protocol/SKILL.md` | 424-line prompt injection bypass toolkit. Purports to be "for safety testing" but catalogs 30+ jailbreak techniques with "Compliance Rubric" for detecting when bypass succeeded. **Actively harmful** in a quality framework — it teaches the LLM to subvert its own safety filters. Zero bug-catching value. (User override: preserved in v2.17.) | "Adversarial prompt engineering agent that iteratively attempts to bypass AI model guardrails"  `injection-allow:safety-bypass-example`
| 2 | **Quality Scorecard** | `scripts/validate-skill-quality.mjs (replaced quality-scorecard v2.17)` | **Original source code comment**: "exits 0 unless the script itself crashes, so teams can use it during review without making it a gate." It's advisory-only, runs shell commands but ignores results. Produces a pretty markdown report that means nothing. | "print a lightweight markdown-style quality review report" |
| 3 | **Vibe Triage** | `commands/vibe-plan.md (replaced vibe-triage v2.17)` | 36-line stub that says "classify, recommend, don't implement." No output enforcement, no automation, just a suggestion. | "Classify incoming work and recommend next state/action" |
| 4 | **Vibe Quality Rubric** | `commands/vibe-review.md (replaced vibe-quality-rubric v2.17)` | 10-step checklist that's entirely self-discipline: "Restate the goal... Define what done looks like... Make a surgical, minimal diff... Report passed/failed." The LLM writes the criteria AND judges itself AND reports outcome. No external check. | "Apply the Universal Code Quality Rubric before a coding task" |
| 5 | **Quality Trend Dashboard** | `scripts/validate-property-tests.mjs (replaced quality-trend v2.17)`, `scripts/validate-property-tests.mjs (replaced quality-trend v2.17)` | Telemetry and visualization of quality metrics that are themselves advisory. Dashboard shows trends of non-data. If the input metrics are noise, the dashboard is just pretty noise. | "Quality trend tracking" — but quality gates that exit 0 unconditionally produce no signal |

---

## BIGGEST QUALITY GAPS (Top 3 Missing Bug-Catchers)

### Gap 1: No Static Analysis Integration
**Severity: CRITICAL**

The repo has zero integration with any type checker, linter, or static analysis tool:
- No `tsconfig.json` / no TypeScript compiler run
- No `eslint` / `@typescript-eslint` integration
- No `mypy` / `pyright` for Python
- No `npm run typecheck` or equivalent
- No import-existence verification

**Impact:** The #1 AI bug class (hallucinated APIs) and #2 (wrong types) go entirely undetected. The LLM writes `import { nonexistentFunction } from 'made-up-lib'` and every single Vibe quality gate passes.

### Gap 2: No Automated Contract Testing
**Severity: HIGH**

There's no tool that verifies:
- Input/output shapes match expected contracts
- API endpoints return correct types
- Function signatures match their declarations
- JSON serialization round-trips correctly

The `acceptance-criteria-pack.md` defines how to *write* good criteria, but nothing *enforces* them. The safe-refactor protocol requires characterization tests, but the LLM writes those too.

**Impact:** Silent regressions in data shape changes slip through. The AI changes a return type from `User[]` to `{users: User[]}` and no gate catches it because no gate checks contracts.

### Gap 3: No Diff Regression Detection
**Severity: HIGH**

No tool captures "before and after" behavior:
- No snapshot testing framework
- No stdout capture/compare for existing tests
- No baseline comparison for characterization tests
- No "rerun same tests pre/post change and diff output"

The security regression test (`tests/security/regression.mjs`) is the *only* true regression test in the repo — it runs injection counters against a corpus and asserts coverage. Nothing similar exists for code changes.

**Impact:** Refactors that silently change behavior pass all gates because the gates don't run tests or compare outputs.

---

## CONCRETE PROPOSALS

### Proposal 1: Add Static Analysis Integration (Critical)
**Paths:**
- Create `scripts/validate-imports.mjs` — parse `import`/`require` in changed files, verify each resolves in `node_modules` or monorepo packages
- Create `scripts/validate-typecheck.mjs` — run `npx tsc --noEmit` or `npx eslint` if config files exist; gracefully skip if not
- Wire both into `quality-engine.mjs` as critical gates in the `standard` profile

**Effort:** 4 hours
**Bug classes caught:** (a) Hallucinated APIs, (b) Wrong types
**Automation:** Yes — exit code enforcement

### Proposal 2: Add Contract Validation for Generated Code (High)
**Paths:**
- Create `contract-test-template (removed v2.17)` for specifying input/output contracts
- Create `scripts/validate-contract.mjs` — parse contracts and generate simple assertion tests
- Add `validate-contract` gate to quality engine for `feature` and `refactor` task types
- Wire into `safe-refactor` characterization step

**Effort:** 6 hours
**Bug classes caught:** (b) Wrong types, (d) Silent regressions
**Automation:** Partially — contracts still human/LLM-written

### Proposal 3: Add Diff Regression & Snapshot Testing (High)
**Paths:**
- Create `scripts/validate-regression.mjs` — run `npm test`, capture output, diff against baseline
- Create `scripts/capture-baseline.mjs` — run before changes and save test output
- Integrate with `safe-refactor` protocol as automated characterization step
- Wire into quality engine under `heavy` profile

**Effort:** 8 hours
**Bug classes caught:** (d) Silent regressions
**Automation:** Yes — full automated run and compare

### Proposal 4: Add Dependency Vulnerability Scan (Medium)
**Paths:**
- Create `scripts/validate-dependencies.mjs` — run `npm audit --json`, parse for critical/high vulnerabilities
- Wire into `quality-engine.mjs` as a `security`-category gate
- Add to `bugfix` and `security` task profiles

**Effort:** 2 hours
**Bug classes caught:** (e) Security holes (dependency vulnerabilities)
**Automation:** Yes

### Proposal 5: Remove/Move Guard Bypass Protocol (Medium)
**Paths:**
- Remove `skills/core/guard-bypass-protocol/SKILL.md` from core skills
- Move to `skills/red-team/` if retention is desired
- Remove from registry/skills.json
- Update any references in commands or docs

**Effort:** 1 hour
**Rationale:** Zero quality accuracy value. Catalogs jailbreak techniques. Creates audit trail of "winning prompts" that could be weaponized. Does not catch any real bugs. If kept, must be gated as a restricted tool, not a core quality skill.

---

## Summary

| Metric | Value |
|---|---|
| Total features audited | ~30 (skills + commands + scripts) |
| Real bug-catching automated gates | 4 (secrets, injection, diff-audit, security-regression) |
| Process-only (LLM-disciplined) features | ~20 |
| Theater features (exit 0 always) | ~4 |
| Harmful features (wrong direction) | 1 (guard-bypass-protocol) |
| Effective coverage of Top 5 AI bug classes | ~25% |
| Coverage if gaps closed | ~75% |

**Vibe Coding OS needs a "vibe-check" on its quality claims.** The architecture is beautiful — contracts, checkpoints, scorecards, rubrics — but most of it assumes the LLM can be trusted to police itself. The automated security tools are genuinely good ($invest). The rest needs independent validation enforcement to match the ambition.
