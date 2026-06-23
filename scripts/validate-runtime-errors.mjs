#!/usr/bin/env node
// scripts/validate-runtime-errors.mjs
// Closes the feedback loop: parse .omc/runtime/events.jsonl for tool/loop errors,
// aggregate by pattern, and report repeated failures.
//
// Threshold: if any error pattern occurs >= 3 times in the last 100 events, warn.
// Threshold: if any 'mcp.injection.blocked' event appears, WARN (security concern).
//
// Exit 0 always (advisory gate). Use to detect recurring agent crashes that the
// event stream captures but no other validator aggregates.

import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const MAX_EVENTS = 100;
const PATTERN_THRESHOLD = 3;
const PATTERNS_OF_CONCERN = new Set([
  'mcp.injection.blocked',
  'daemon.error',
  'approval.denied',
  'runtime.lock.timeout',
]);

function normalizeMessage(msg) {
  if (!msg) return '<no message>';
  // Strip variable data: paths, timestamps, PIDs, hex tokens
  return msg
    .replace(/0x[0-9a-f]+/gi, '<hex>')
    .replace(/\/\S+\.mjs/g, '<file>')
    .replace(/\d{4}-\d{2}-\d{2}T[\d:.]+Z/g, '<ts>')
    .replace(/\b\d{3,}\b/g, '<n>')
    .slice(0, 80);
}

async function main() {
  // Default to the project repo's runtime dir; user can override via CLI arg or VIBE_RUNTIME_DIR.
  const runtimeDir = process.env.VIBE_RUNTIME_DIR
    || resolve(ROOT, '.omc', 'runtime');
  const eventsFile = resolve(runtimeDir, 'events.jsonl');

  if (!existsSync(eventsFile)) {
    console.log('Runtime error gate: no events.jsonl found (clean state).');
    return;
  }

  // Read tail of events file (last MAX_EVENTS lines)
  const content = await readFile(eventsFile, 'utf8');
  const allLines = content.split('\n').filter((l) => l.trim());
  const recentLines = allLines.slice(-MAX_EVENTS);

  if (recentLines.length === 0) {
    console.log('Runtime error gate: events.jsonl is empty.');
    return;
  }

  // Parse events and collect error patterns
  const errorEvents = [];
  for (const line of recentLines) {
    try {
      const event = JSON.parse(line);
      const type = event.type || event.eventType;
      if (!type) continue;

      // Detect "error" events by type name OR by payload.error/exitCode
      const hasErrorPayload = event.payload && (event.payload.error || event.payload.lastError);
      const isErrorType = type.includes('error') || type.includes('denied') || type.includes('blocked') || type.includes('timeout');
      if (isErrorType || hasErrorPayload) {
        const msg = (event.payload && (event.payload.message || event.payload.error || event.payload.lastError)) || '';
        errorEvents.push({ type, message: msg, ts: event.createdAt || event.timestamp });
      }
    } catch { /* skip malformed JSON lines */ }
  }

  // Aggregate by (type, normalizedMessage) signature
  const signatures = new Map();
  for (const e of errorEvents) {
    const sig = `${e.type} :: ${normalizeMessage(e.message)}`;
    if (!signatures.has(sig)) {
      signatures.set(sig, { type: e.type, message: e.message, count: 0, examples: [] });
    }
    const entry = signatures.get(sig);
    entry.count++;
    if (entry.examples.length < 3) entry.examples.push(e.ts);
  }

  // Report
  console.log(`Runtime error gate: scanned ${recentLines.length} recent events, found ${errorEvents.length} error-like.`);

  if (signatures.size === 0) {
    console.log('No error patterns detected.');
    return;
  }

  // Group: high-severity (pattern-of-concern) vs high-frequency
  const byConcern = [];
  const byFrequency = [];
  for (const sig of signatures.values()) {
    if (PATTERNS_OF_CONCERN.has(sig.type)) {
      byConcern.push(sig);
    } else if (sig.count >= PATTERN_THRESHOLD) {
      byFrequency.push(sig);
    }
  }

  let warnings = 0;

  if (byConcern.length > 0) {
    warnings += byConcern.length;
    console.log('');
    console.log(`🔒 ${byConcern.length} security/risk event(s) detected (any occurrence is a concern):`);
    for (const sig of byConcern) {
      console.log(`  - ${sig.type} (${sig.count}×): ${sig.message.slice(0, 60)}`);
    }
  }

  if (byFrequency.length > 0) {
    warnings += byFrequency.length;
    console.log('');
    console.log(`📈 ${byFrequency.length} recurring error pattern(s) (≥${PATTERN_THRESHOLD}× in last ${MAX_EVENTS} events):`);
    for (const sig of byFrequency) {
      console.log(`  - ${sig.type} (${sig.count}×): ${sig.message.slice(0, 60)}`);
    }
  }

  if (warnings === 0) {
    console.log('All error patterns below threshold. No action needed.');
  } else {
    console.log('');
    console.log(`⚠ ${warnings} pattern(s) flagged. Investigate recurring failures or security blocks.`);
    console.log('  View raw events: cat ' + eventsFile);
  }
}

main().catch((err) => {
  console.error(`Runtime error gate failed: ${err.message}`);
  process.exit(1);
});
