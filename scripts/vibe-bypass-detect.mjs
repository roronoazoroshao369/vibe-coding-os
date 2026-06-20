// scripts/vibe-bypass-detect.mjs
// v2.16.0 — Implementation of vibe-bypass-detect command
//
// Reads session audit logs, detects bypass loops (≥3 same-pattern attempts
// in 10-min window), classifies them, and recommends counter-action.
//
// Usage:
//   node scripts/vibe-bypass-detect.mjs [--date YYYY-MM-DD] [--threshold N] [--window MIN]
//
// Outputs to docs/security/security-event-log/<date>-bypass.jsonl

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { detectBypassLoop, scoreSource } from "../security/defense/trust-scorer.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

// Parse args
const args = process.argv.slice(2);
let targetDate = new Date().toISOString().slice(0, 10);  // today
let threshold = 3;
let windowMin = 10;

for (const arg of args) {
  if (arg.startsWith("--date=")) targetDate = arg.slice(7);
  if (arg.startsWith("--threshold=")) threshold = parseInt(arg.slice(12), 10);
  if (arg.startsWith("--window=")) windowMin = parseInt(arg.slice(9), 10);
}

const SESSION_AUDIT_DIR = resolve(REPO_ROOT, "docs/security/session-audit");
const EVENT_LOG_DIR = resolve(REPO_ROOT, "docs/security/security-event-log");
const BYPASS_LOG = resolve(REPO_ROOT, "docs/security/bypass-load-attempts.log");

/**
 * Read session audit events from a dated file.
 */
function readSessionEvents(date) {
  const filepath = resolve(SESSION_AUDIT_DIR, `${date}.jsonl`);
  if (!existsSync(filepath)) {
    return [];
  }
  const content = readFileSync(filepath, "utf8");
  return content
    .split("\n")
    .filter(line => line.trim())
    .map(line => {
      try { return JSON.parse(line); }
      catch { return null; }
    })
    .filter(Boolean);
}

/**
 * Filter events for bypass-relevant types: refusals, redactor, injection.
 */
function filterBypassEvents(events) {
  return events.filter(e => {
    const t = (e.type || e.event || "").toLowerCase();
    return t.includes("refus") || t.includes("redact") || t.includes("injection");
  });
}

/**
 * Convert events to bypass-detection format.
 */
function toBypassFormat(events) {
  return events.map(e => ({
    pattern: `${e.type || e.event}:${e.target || e.pattern || "unknown"}`,
    timestamp: new Date(e.timestamp || e.ts || Date.now()).getTime(),
    source: e.source || e.user || "unknown"
  }));
}

/**
 * Main scan.
 */
function scan(date) {
  const events = readSessionEvents(date);
  const filtered = filterBypassEvents(events);
  const bypassEvents = toBypassFormat(filtered);
  const result = detectBypassLoop(bypassEvents);

  // Also scan the bypass-load-attempts.log
  let loadEvents = [];
  if (existsSync(BYPASS_LOG)) {
    const logContent = readFileSync(BYPASS_LOG, "utf8");
    loadEvents = logContent
      .split("\n")
      .filter(line => line.trim())
      .map(line => {
        try {
          const e = JSON.parse(line);
          return {
            pattern: `loader:${e.type || "refusal"}`,
            timestamp: new Date(e.timestamp || Date.now()).getTime(),
            source: `loader:${e.authorization_ref || "unknown"}`
          };
        } catch { return null; }
      })
      .filter(Boolean);
  }

  const allBypassEvents = [...bypassEvents, ...loadEvents];
  const combined = detectBypassLoop(allBypassEvents);

  return {
    date,
    total_events: events.length,
    filtered_events: filtered.length,
    bypass_events: allBypassEvents.length,
    detection: combined,
    session_detection: result
  };
}

/**
 * Emit report to security-event-log.
 */
function emitReport(scanResult) {
  if (!existsSync(EVENT_LOG_DIR)) {
    mkdirSync(EVENT_LOG_DIR, { recursive: true });
  }
  const outfile = resolve(EVENT_LOG_DIR, `${scanResult.date}-bypass.jsonl`);
  const report = {
    timestamp: new Date().toISOString(),
    date: scanResult.date,
    total_events: scanResult.total_events,
    bypass_events: scanResult.bypass_events,
    is_loop: scanResult.detection.isLoop,
    classification: scanResult.detection.classification,
    sources: scanResult.detection.sources,
    attempts: scanResult.detection.attempts,
    recommendation: scanResult.detection.recommendation
  };
  writeFileSync(outfile, JSON.stringify(report) + "\n", "utf8");
  return outfile;
}

// Main
const result = scan(targetDate);
const outfile = emitReport(result);

// Print human-readable summary
console.log("=== Vibe Bypass Detect — " + targetDate + " ===");
console.log(`Total session events:   ${result.total_events}`);
console.log(`Bypass-relevant events: ${result.bypass_events}`);
console.log(`Loop detected:          ${result.detection.isLoop}`);
if (result.detection.isLoop) {
  console.log(`  Classification:       ${result.detection.classification}`);
  console.log(`  Attempts:             ${result.detection.attempts}`);
  console.log(`  Sources:              ${result.detection.sources.join(", ")}`);
  console.log(`  Recommendation:       ${result.detection.recommendation}`);
}
console.log(`\nReport written to: ${outfile}`);

// Exit non-zero if high-confidence bypass loop
if (result.detection.recommendation === "escalate-to-human") {
  process.exit(2);
}
if (result.detection.isLoop) {
  process.exit(1);
}
process.exit(0);
