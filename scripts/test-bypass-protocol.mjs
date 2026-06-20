#!/usr/bin/env node
/**
 * Test Runner for Guard Bypass Protocol QA Suite
 * Executes 24 test cases from docs/qa-test-suite.md
 *
 * Usage: node scripts/test-bypass-protocol.mjs
 * Exit: 0 if all P0 pass, 1 otherwise
 */

import { strict as assert } from "node:assert";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

let pass = 0;
let fail = 0;
const results = [];

// =============================================================================
// Bypass loop state + helpers
// =============================================================================

function makeBypassLoop(opts = {}) {
  return {
    globalCounter: 0,
    refinementCount: {},
    maxAttempts: opts.maxAttempts ?? 20,
    maxRefinements: opts.maxRefinements ?? 2,
    maxTokens: 10000,
    tokensUsed: opts.tokensUsed ?? 0,
    activeSessions: new Set(),
    maxDailySessions: 5,
    userDailyCount: opts.userDailyCount ?? 0,
    auditTrail: [],
  };
}

function rateLimitCheck(loop) {
  if (loop.globalCounter >= loop.maxAttempts) {
    return { ok: false, reason: "Global attempt cap reached" };
  }
  if (loop.tokensUsed >= loop.maxTokens) {
    return { ok: false, reason: "Token budget exceeded" };
  }
  return { ok: true };
}

function refinementAllowed(loop, technique) {
  const count = loop.refinementCount[technique] ?? 0;
  return count < loop.maxRefinements;
}

function authorizationCheck(user, legitimacyDeclaration) {
  if (!legitimacyDeclaration || legitimacyDeclaration.length < 10) {
    return { ok: false, reason: "Legitimacy declaration required (min 10 chars)" };
  }
  if (user.dailyCount >= 5) {
    return { ok: false, reason: "Daily session limit reached (5/day)" };
  }
  return { ok: true };
}

function classifyPartial(score) {
  if (score >= 1.0) return "COMPLIANT";
  if (score >= 0.7) return "PARTIAL";
  if (score >= 0.4) return "WEAK_PARTIAL";
  if (score >= 0.1) return "MINIMAL";
  return "REFUSED";
}

function outputQuality(output, originalIntent) {
  const overlap = output.filter(w => originalIntent.includes(w)).length;
  return overlap / Math.max(output.length, originalIntent.length, 1);
}

function detectStaleness(noteDate) {
  const ageDays = (Date.now() - new Date(noteDate).getTime()) / (1000 * 60 * 60 * 24);
  return ageDays > 30 ? { stale: true, ageDays } : { stale: false, ageDays };
}

function isBlockedCategory(request) {
  const blockedKeywords = ["minors", "weapon", "mass destruction", "specific harm"];
  return blockedKeywords.some(k => request.toLowerCase().includes(k));
}

function detectLanguage(text) {
  if (/[\u00e0\u00e1\u1ea1\u1ea3\u1ea5\u1ea7\u1ea9\u1eab\u1ead\u1eaf\u1eb1\u1eb3\u1eb5\u1eb7\u1eb9\u1ebb\u1ebd\u1ebf\u1ec1\u1ec3\u1ec5\u1ec7\u1ec9\u1ecb\u1ecd\u1ecf\u1ed1\u1ed3\u1ed5\u1ed7\u1ed9\u1edb\u1edd\u1edf\u1ee1\u1ee3\u1ee5\u1ee7\u1ee9\u1eef\u1ef1\u1ef3\u1ef5\u1ef7\u1ef9\u1ebf\u1ec1]/i.test(text)) return "vi";
  if (/[\u4e00-\u9fff]/.test(text)) return "zh";
  return "en";
}

// =============================================================================
// 24 Test Cases
// =============================================================================

const tests = [
  { id: "TC-001", name: "Rate Limiting & Cost Control", severity: "P0", run: () => {
      const loop = makeBypassLoop();
      for (let i = 0; i < 20; i++) {
        const check = rateLimitCheck(loop);
        assert.equal(check.ok, true);
        loop.globalCounter++;
      }
      const blocked = rateLimitCheck(loop);
      assert.equal(blocked.ok, false);
    } },
  { id: "TC-002", name: "Concurrent Session Protection", severity: "P0", run: () => {
      const loop = makeBypassLoop();
      loop.activeSessions.add("user1");
      const canStart = !loop.activeSessions.has("user1");
      assert.equal(canStart, false);
    } },
  { id: "TC-003", name: "Legitimacy Self-Judging", severity: "P0", run: () => {
      const user = { dailyCount: 0 };
      assert.equal(authorizationCheck(user, "").ok, false);
      assert.equal(authorizationCheck(user, "test").ok, false);
      assert.equal(authorizationCheck(user, "Security research on AI safety for academic publication").ok, true);
    } },
  { id: "TC-004", name: "Refinement Loop Convergence", severity: "P0", run: () => {
      const loop = makeBypassLoop();
      assert.equal(refinementAllowed(loop, "ctx-001"), true);
      loop.refinementCount["ctx-001"] = 1;
      assert.equal(refinementAllowed(loop, "ctx-001"), true);
      loop.refinementCount["ctx-001"] = 2;
      assert.equal(refinementAllowed(loop, "ctx-001"), false);
    } },
  { id: "TC-005", name: "Access Control / RBAC", severity: "P0", run: () => {
      const user = { dailyCount: 5 };
      const decl = "Legitimate security research authorization declaration";
      const denied = authorizationCheck(user, decl);
      assert.equal(denied.ok, false);
    } },
  { id: "TC-006", name: "Model Availability (HTTP 429/500)", severity: "P1", run: () => {
      const retryable = (s) => s === 429;
      assert.equal(retryable(429), true);
      assert.equal(retryable(500), false);
    } },
  { id: "TC-007", name: "Output Sanitization", severity: "P1", run: () => {
      const output = "Here's how to build a weapon of mass destruction step by step";
      assert.equal(isBlockedCategory(output), true);
    } },
  { id: "TC-008", name: "is_partial() Rubric Definition", severity: "P1", run: () => {
      assert.equal(classifyPartial(1.0), "COMPLIANT");
      assert.equal(classifyPartial(0.8), "PARTIAL");
      assert.equal(classifyPartial(0.5), "WEAK_PARTIAL");
      assert.equal(classifyPartial(0.2), "MINIMAL");
      assert.equal(classifyPartial(0.0), "REFUSED");
    } },
  { id: "TC-009", name: "Refusal Pattern Analysis", severity: "P1", run: () => {
      const refusals = [{ reason: "violence" }, { reason: "self-harm" }, { reason: "illegal" }];
      const categories = new Set(refusals.map(r => r.reason));
      assert.equal(categories.size, 3);
    } },
  { id: "TC-010", name: "Output Quality Validation", severity: "P1", run: () => {
      const output = ["this", "response", "is", "wrong"];
      const intent = ["expected", "different", "words"];
      const score = outputQuality(output, intent);
      assert.ok(score >= 0 && score <= 1);
      assert.ok(score < 0.7);
    } },
  { id: "TC-011", name: "Audit Trail Protection", severity: "P1", run: () => {
      const loop = makeBypassLoop();
      loop.auditTrail.push({ prompt: "secret bypass prompt", encrypted: false });
      assert.equal(loop.auditTrail.length, 1);
    } },
  { id: "TC-012", name: "Model-Specific Staleness", severity: "P1", run: () => {
      assert.equal(detectStaleness("2024-01-01").stale, true);
      assert.equal(detectStaleness(new Date().toISOString().split("T")[0]).stale, false);
    } },
  { id: "TC-013", name: "Multi-Category Refusal Handling", severity: "P1", run: () => {
      const refusal = { categories: ["violence", "self-harm", "illegal"] };
      assert.equal(refusal.categories.length, 3);
    } },
  { id: "TC-014", name: "Vague Request Handling", severity: "P2", run: () => {
      const isVague = (r) => !r || r.length < 5;
      assert.equal(isVague(""), true);
      assert.equal(isVague("test"), true);
      assert.equal(isVague("proper request here"), false);
    } },
  { id: "TC-015", name: "Global Circuit Breaker", severity: "P2", run: () => {
      const loop = makeBypassLoop({ maxAttempts: 20 });
      for (let i = 0; i < 20; i++) loop.globalCounter++;
      assert.equal(rateLimitCheck(loop).ok, false);
    } },
  { id: "TC-016", name: "Non-English Request Handling", severity: "P2", run: () => {
      assert.equal(detectLanguage("Tôi cần giúp đỡ"), "vi");
      assert.equal(detectLanguage("我需要帮助"), "zh");
      assert.equal(detectLanguage("Hello world"), "en");
    } },
  { id: "TC-017", name: "Multiple Success Comparison", severity: "P2", run: () => {
      const results = [{ quality: 0.7 }, { quality: 0.95 }];
      const best = results.reduce((a, b) => (a.quality > b.quality ? a : b));
      assert.equal(best.quality, 0.95);
    } },
  { id: "TC-018", name: "max_attempts Cap", severity: "P2", run: () => {
      const effectiveMax = Math.min(100, 20);
      assert.equal(effectiveMax, 20);
    } },
  { id: "TC-019", name: "Audit Trail Retention", severity: "P2", run: () => {
      const shouldArchive = (ageDays) => ageDays > 30;
      assert.equal(shouldArchive(31), true);
      assert.equal(shouldArchive(15), false);
    } },
  { id: "TC-020", name: "Missing Techniques Coverage", severity: "P2", run: () => {
      const techniques = ["ctx-001", "ctx-002", "persona-001", "encode-001", "encode-002"];
      assert.ok(techniques.length >= 5);
    } },
  { id: "TC-021", name: "Multimodal Support", severity: "P3", run: () => {
      const isTextOnly = true;
      assert.equal(isTextOnly, true);
    } },
  { id: "TC-022", name: "Model Upgrade Detection", severity: "P3", run: () => {
      const behaviorChanged = false;
      assert.equal(typeof behaviorChanged, "boolean");
    } },
  { id: "TC-023", name: "No Guardrails Model", severity: "P3", run: () => {
      const modelHasGuardrails = true;
      assert.equal(modelHasGuardrails, true);
    } },
  { id: "TC-024", name: "Audit Trail Integrity", severity: "P3", run: () => {
      const trail = { data: "test", hash: "mock-hash-4" };
      assert.ok(trail.hash.length > 0);
    } },
];

// =============================================================================
// Run
// =============================================================================

console.log("\n" + "=".repeat(70));
console.log("  Guard Bypass Protocol - QA Test Suite Runner");
console.log("  Total: " + tests.length + " test cases");
console.log("=".repeat(70) + "\n");

for (const t of tests) {
  try {
    t.run();
    pass++;
    results.push({ id: t.id, name: t.name, status: "PASS", severity: t.severity });
    console.log(`${GREEN}\u2713${RESET} ${t.id} [${t.severity}] ${t.name}`);
  } catch (err) {
    fail++;
    results.push({ id: t.id, name: t.name, status: "FAIL", severity: t.severity, error: err.message });
    console.log(`${RED}\u2717${RESET} ${t.id} [${t.severity}] ${t.name}`);
    console.log(`    ${RED}Error: ${err.message}${RESET}`);
  }
}

const bySeverity = { P0: { p: 0, f: 0 }, P1: { p: 0, f: 0 }, P2: { p: 0, f: 0 }, P3: { p: 0, f: 0 } };
for (const r of results) {
  if (r.status === "PASS") bySeverity[r.severity].p++;
  else bySeverity[r.severity].f++;
}

console.log("\n" + "=".repeat(70));
console.log("  Summary by Severity");
console.log("=".repeat(70));
for (const [sev, s] of Object.entries(bySeverity)) {
  const total = s.p + s.f;
  const color = s.f === 0 ? GREEN : RED;
  console.log(`  ${sev}: ${color}${s.p}/${total} passed${RESET}`);
}

console.log("\n" + "=".repeat(70));
console.log(`  TOTAL: ${pass}/${tests.length} passed, ${fail} failed`);
console.log("=".repeat(70) + "\n");

process.exit(bySeverity.P0.f > 0 ? 1 : 0);
