#!/usr/bin/env node
/**
 * reference-health-report.mjs — Lightweight reference health check and update-report stub
 *
 * Checks that:
 *  1. references/index.json exists and has expected top-level metadata
 *  2. Each source has existing reference_doc and changelog files
 *  3. Each source has existing local_targets (where listed)
 *  4. Generates a simple health report to stdout
 *
 * This is a low-risk read-only audit — no files are modified.
 */

import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const indexFile = path.join(ROOT, 'references', 'index.json');

const errors = [];
const warnings = [];
const info = [];

// ── 1. Load index.json ──────────────────────────────────────────────
if (!existsSync(indexFile)) {
  console.error('❌ references/index.json not found');
  process.exit(1);
}

let index;
try {
  index = JSON.parse(await readFile(indexFile, 'utf8'));
} catch (err) {
  console.error(`❌ references/index.json is not valid JSON: ${err.message}`);
  process.exit(1);
}

if (!isNonEmptyString(index.version)) errors.push('Missing "version" in index');
if (!isNonEmptyString(index.last_built)) errors.push('Missing "last_built" in index');
if (!Array.isArray(index.sources)) errors.push('"sources" must be an array');

// ── 2. Per-source health checks ─────────────────────────────────────
const sourceStats = { tracked: 0, candidate: 0, archived: 0, blocked: 0, missingFiles: 0, missingLocalTargets: 0 };
const staleThreshold = 30; // days

for (const source of (index.sources || [])) {
  if (!source?.id) { errors.push('Source entry has no id'); continue; }

  const status = source.status || 'unknown';
  if (sourceStats[status] !== undefined) sourceStats[status]++;

  // Check reference_doc exists
  if (source.reference_doc) {
    const rp = path.join(ROOT, source.reference_doc);
    if (!existsSync(rp)) { errors.push(`${source.id}: reference_doc not found: ${source.reference_doc}`); sourceStats.missingFiles++; }
  }

  // Check changelog exists
  if (source.changelog) {
    const cp = path.join(ROOT, source.changelog);
    if (!existsSync(cp)) { errors.push(`${source.id}: changelog not found: ${source.changelog}`); sourceStats.missingFiles++; }
  }

  // Check local_targets exist
  if (Array.isArray(source.local_targets)) {
    for (const target of source.local_targets) {
      if (!isNonEmptyString(target)) continue;
      const tp = path.join(ROOT, target);
      if (!existsSync(tp)) { warnings.push(`${source.id}: local_target missing: ${target}`); sourceStats.missingLocalTargets++; }
    }
  }

  // Check staleness
  if (source.last_checked) {
    const checkedDate = new Date(source.last_checked);
    const daysSince = Math.floor((Date.now() - checkedDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > staleThreshold) {
      warnings.push(`${source.id}: last_checked ${source.last_checked} is ${daysSince} days old (>${staleThreshold}d threshold)`);
    }
  } else {
    warnings.push(`${source.id}: no last_checked date`);
  }
}

// ── 3. Report ───────────────────────────────────────────────────────
console.log('=== Reference Health Report ===');
console.log(`Index version: ${index.version}`);
console.log(`Last built:    ${index.last_built || 'unknown'}`);
console.log(`Sources:       ${(index.sources || []).length}`);
console.log('');
console.log('Status breakdown:');
console.log(`  tracked:   ${sourceStats.tracked}`);
console.log(`  candidate: ${sourceStats.candidate}`);
console.log(`  archived:  ${sourceStats.archived}`);
console.log(`  blocked:   ${sourceStats.blocked}`);
console.log('');
console.log(`Missing files:       ${sourceStats.missingFiles}`);
console.log(`Missing local_targets: ${sourceStats.missingLocalTargets}`);

if (errors.length > 0) {
  console.log('');
  console.log(`❌ ${errors.length} error(s):`);
  for (const e of errors) console.log(`  - ${e}`);
}

if (warnings.length > 0) {
  console.log('');
  console.log(`⚠️  ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  - ${w}`);
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ All reference health checks passed.');
}

process.exit(errors.length > 0 ? 1 : 0);

// ── Helpers ─────────────────────────────────────────────────────────
function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}
