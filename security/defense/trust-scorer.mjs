// security/defense/trust-scorer.mjs
// v2.16.0 — Layer 0: TRUST SCORING (per ADR 0004)
//
// Implements:
// - 3 trust classes: trusted, read-only, isolated
// - Heuristic detection (12 patterns: WebFetch, fetch(), http.get, axios, requests, marketplace, https?://, CLAUDE.md, pip install, npm install -g, curl, subprocess)
// - Bypass loop detection (3+ attempts / 10 min window)
// - License class (5 classes: permissive, copyleft-weak, copyleft-strong, proprietary, unknown)
//
// Per-source: skill, URL, marketplace, user-prompt

// =============================================================================
// 1. Trust Class Scoring
// =============================================================================

const TRUST_CLASSES = {
  trusted: { level: 0, label: "trusted", description: "Loads only files within this repo, no network, no exec" },
  "read-only": { level: 1, label: "read-only", description: "Fetches docs from allowlisted domains, reads files" },
  isolated: { level: 2, label: "isolated", description: "Loads third-party marketplace content" }
};

const HEURISTIC_PATTERNS = [
  { id: "WebFetch", pattern: /WebFetch/gi, source_type: "skill" },
  { id: "fetch-call", pattern: /\bfetch\s*\(/gi, source_type: "skill" },
  { id: "http-get", pattern: /http\.get|http\.request/gi, source_type: "skill" },
  { id: "axios", pattern: /\baxios\b/gi, source_type: "skill" },
  { id: "requests", pattern: /\brequests\.(get|post|put|delete)/gi, source_type: "skill" },
  { id: "marketplace", pattern: /marketplace/gi, source_type: "skill" },
  { id: "https-url", pattern: /https?:\/\//gi, source_type: "skill" },
  { id: "CLAUDE-md", pattern: /CLAUDE\.md/gi, source_type: "skill" },
  { id: "pip-install", pattern: /pip\s+install/gi, source_type: "skill" },
  { id: "npm-install-global", pattern: /npm\s+install\s+-g/gi, source_type: "skill" },
  { id: "curl", pattern: /\bcurl\s+/gi, source_type: "skill" },
  { id: "subprocess", pattern: /subprocess\.(run|call|Popen)|os\.system/gi, source_type: "skill" }
];

/**
 * Score a source (skill, URL, marketplace, user-prompt) for trust class.
 * @param {string} source - the source identifier or content
 * @param {string} sourceType - one of: skill, url, marketplace, user-prompt
 * @returns {{ trust_class: string, risk_score: number, reasons: string[] }}
 */
export function scoreSource(source, sourceType = "skill") {
  if (!source || typeof source !== "string") {
    return { trust_class: "trusted", risk_score: 0, reasons: ["empty source"] };
  }

  const matches = [];
  let highestLevel = 0;
  const reasons = [];

  for (const p of HEURISTIC_PATTERNS) {
    if (p.source_type !== sourceType && sourceType !== "any") continue;
    const m = source.match(p.pattern);
    if (m && m.length > 0) {
      matches.push({ id: p.id, count: m.length });
      if (p.id === "marketplace" || p.id === "axios" || p.id === "requests") {
        highestLevel = Math.max(highestLevel, 2);
        reasons.push(`${p.id} detected: ${m.length} match(es) — isolated`);
      } else if (p.id === "https-url" || p.id === "WebFetch" || p.id === "fetch-call" || p.id === "http-get") {
        highestLevel = Math.max(highestLevel, 1);
        reasons.push(`${p.id} detected: ${m.length} match(es) — read-only`);
      } else {
        highestLevel = Math.max(highestLevel, 1);
        reasons.push(`${p.id} detected: ${m.length} match(es) — read-only`);
      }
    }
  }

  const trust_class = highestLevel === 2 ? "isolated" : highestLevel === 1 ? "read-only" : "trusted";
  const risk_score = Math.min(100, highestLevel * 50 + matches.length * 5);

  return { trust_class, risk_score, reasons, matches };
}

/**
 * Check if source requires sandbox declaration.
 */
export function requiresSandboxDeclaration(scoreResult) {
  return scoreResult.trust_class !== "trusted";
}

// =============================================================================
// 2. Bypass Loop Detection
// =============================================================================

const BYPASS_THRESHOLD = 3;     // 3 attempts
const BYPASS_WINDOW_MS = 10 * 60 * 1000;  // 10 minutes

/**
 * Detect bypass loops: ≥3 same-pattern attempts in 10-min window.
 * @param {Array<{pattern: string, timestamp: number, source: string}>} events
 * @returns {{
 *   isLoop: boolean,
 *   classification: string|null,
 *   sources: string[],
 *   attempts: number,
 *   recommendation: string
 * }}
 */
export function detectBypassLoop(events) {
  if (!Array.isArray(events) || events.length === 0) {
    return { isLoop: false, classification: null, sources: [], attempts: 0, recommendation: "log-only" };
  }

  const now = Date.now();
  const recent = events.filter(e => (now - e.timestamp) <= BYPASS_WINDOW_MS);

  // Group by pattern
  const byPattern = {};
  for (const e of recent) {
    if (!byPattern[e.pattern]) byPattern[e.pattern] = [];
    byPattern[e.pattern].push(e);
  }

  // Find a pattern with ≥3 attempts
  for (const [pattern, evts] of Object.entries(byPattern)) {
    if (evts.length >= BYPASS_THRESHOLD) {
      const sources = [...new Set(evts.map(e => e.source))];
      const classification = classifyBypassPattern(pattern);
      const isHighConfidence = evts.length >= 5;

      return {
        isLoop: true,
        classification,
        sources,
        attempts: evts.length,
        pattern,
        recommendation: isHighConfidence ? "escalate-to-human" : (evts.length >= 4 ? "lock-source" : "log-only")
      };
    }
  }

  return { isLoop: false, classification: null, sources: [], attempts: 0, recommendation: "log-only" };
}

function classifyBypassPattern(pattern) {
  if (pattern.startsWith("redactor:")) return "redactor-bypass";
  if (pattern.startsWith("injection:")) return "injection-bypass";
  if (pattern.startsWith("hook:")) return "hook-bypass";
  if (pattern.startsWith("tool:")) return "tool-bypass";
  return "unknown-bypass";
}

// =============================================================================
// 3. License Classification
// =============================================================================

const LICENSE_CLASSES = {
  permissive: { spdx: ["MIT", "BSD-2-Clause", "BSD-3-Clause", "Apache-2.0", "ISC", "Unlicense", "CC0-1.0"], label: "permissive" },
  "copyleft-weak": { spdx: ["LGPL-2.0", "LGPL-2.1", "LGPL-3.0", "MPL-2.0", "EPL-1.0", "EPL-2.0"], label: "copyleft-weak" },
  "copyleft-strong": { spdx: ["GPL-2.0", "GPL-3.0", "AGPL-3.0", "AGPL-1.0", "OSL-3.0"], label: "copyleft-strong" },
  proprietary: { spdx: ["Proprietary", "Commercial", "SEE-LICENSE-IN-README"], label: "proprietary" },
  unknown: { spdx: [], label: "unknown" }
};

/**
 * Classify a license string into one of 5 classes.
 * @param {string} licenseStr - SPDX identifier or license text snippet
 * @returns {string} - one of: permissive, copyleft-weak, copyleft-strong, proprietary, unknown
 */
export function classifyLicense(licenseStr) {
  if (!licenseStr || typeof licenseStr !== "string") return "unknown";

  const normalized = licenseStr.trim().toUpperCase();

  for (const [className, def] of Object.entries(LICENSE_CLASSES)) {
    if (className === "unknown") continue;
    for (const spdx of def.spdx) {
      if (normalized === spdx.toUpperCase() || normalized.includes(spdx.toUpperCase())) {
        return className;
      }
    }
  }

  return "unknown";
}

// =============================================================================
// 4. Combined Entry Point
// =============================================================================

/**
 * Score everything for a given source.
 */
export function scoreAll(source, sourceType = "skill", events = []) {
  const trust = scoreSource(source, sourceType);
  const bypass = detectBypassLoop(events);
  return {
    trust_class: trust.trust_class,
    risk_score: trust.risk_score,
    reasons: trust.reasons,
    bypass_loop: bypass,
    requires_sandbox_declaration: requiresSandboxDeclaration(trust)
  };
}

export default {
  scoreSource,
  requiresSandboxDeclaration,
  detectBypassLoop,
  classifyLicense,
  scoreAll,
  TRUST_CLASSES,
  HEURISTIC_PATTERNS,
  LICENSE_CLASSES
};
