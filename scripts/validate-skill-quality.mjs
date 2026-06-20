#!/usr/bin/env node
/**
 * validate-skill-quality.mjs — Quality lint for SKILL.md files (v2.12.0).
 *
 * Cheap, local, no external deps. Walks every skills/**\/SKILL.md and checks:
 *
 *   1. Required sections
 *      - `# Skill: <Name>` heading (front matter or first heading)
 *      - `## Purpose`
 *      - `## When to use`
 *      - `## Inputs`
 *      - `## Workflow`
 *      - `## Outputs`
 *      - `## Failure modes`
 *      - `## Verification checklist`
 *      - `## Related skills`
 *
 *   2. Weak verbs / non-actionable verbs in Workflow
 *      Flags occurrences of: should, could, maybe, perhaps, try to, attempt to,
 *      hope, intend to, aim to, might, possibly. These signal fuzzy
 *      instructions — quality-engine and verification-before-done specifically
 *      need actionable verbs (run, capture, compare, fail-fast).
 *
 *   3. Falsifiable Verification checklist
 *      Every checklist item must contain a measurable verb (run, capture,
 *      verify, assert, fail, pass, exit, count, log, write, diff) OR be a
 *      concrete artifact check (checks ran, command exited 0, file exists,
 *      hash matches, count == N). Fuzzy items like "looks good", "feels
 *      right", "is honest" are non-falsifiable and degrade the gate value.
 *
 *   4. Token budget
 *      WARN at >3000 words per SKILL.md (rough proxy for token budget).
 *      Skills that bloat past 3000 words should be split or moved into
 *      references/. Hard fail is reserved for files >5000 words.
 *
 *   5. Related skills cross-check
 *      Every path under `## Related skills` must point to an existing
 *      `skills/**\/SKILL.md`. This catches dangling references after rename
 *      or deletion.
 *
 * Output: JSON-shaped report on stdout when invoked with --json.
 * Exits 0 on success (warnings allowed), exits 1 if any hard error found.
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Hard-required: skill is unusable without these.
// Soft-warned: present in flagship skills, valuable but not blocking.
const REQUIRED_SECTIONS = [
  /^## Purpose\s*$/m,
  /^## When to use\s*$/m,
  /^## Workflow\s*$/m
];

const RECOMMENDED_SECTIONS = [
  /^## Inputs\s*$/m,
  /^## Outputs\s*$/m,
  /^## Failure modes\s*$/m,
  /^## Verification checklist\s*$/m,
  // Broadened v2.13.0 — accept 17 variants documented by Engineering Council G2
  /^##\s+(Related skills?|Related skills\s*\/\s*commands?|Related skills and commands|Related assets|Related artifacts|Related quality packs|See also|Cross-references|Composability.*)$/mi
];

// Match any first-level heading — skill, agent, checklist, framework, etc.
// The exact name pattern is too strict; downstream content is what matters.
const NAME_HEADING = /^# .+$/m;

const WEAK_VERBS = [
  /\bshould\b/gi,
  /\bcould\b/gi,
  /\bmaybe\b/gi,
  /\bperhaps\b/gi,
  /\btry to\b/gi,
  /\battempt to\b/gi,
  /\bhope\b/gi,
  /\bintend to\b/gi,
  /\baim to\b/gi,
  /\bmight\b/gi,
  /\bpossibly\b/gi
];

const MEASURABLE_VERBS = [
  // Imperative / action verbs (concrete behaviors)
  'run', 'capture', 'verify', 'assert', 'fail', 'pass', 'exit', 'exits', 'exit 0', 'exits 0', 'non-zero',
  'count', 'log', 'write', 'writes', 'diff', 'compare', 'match', 'matches', 'exists', 'exist',
  'screenshot', 'lighthouse', 'p95', 'p99', 'p75', 'inspect', 'flush', 'fire', 'fires', 'fired',
  'return', 'returns', 'returned', 'receive', 'received', 'receives',
  // Expanded v2.13.0 — passive-but-concrete verbs
  'include', 'includes', 'included', 'name', 'names', 'named', 'list', 'lists', 'listed',
  'document', 'documents', 'documented', 'cover', 'covers', 'covered',
  'use', 'uses', 'used', 'apply', 'applies', 'applied',
  'map', 'maps', 'mapped', 'mapping',
  'contain', 'contains', 'contained',
  'state', 'states', 'stated', 'separate', 'separates', 'separated',
  'honor', 'honors', 'honored',
  'identify', 'identifies', 'identified',
  'consider', 'considers', 'considered',
  'record', 'records', 'recorded',
  'review', 'reviews', 'reviewed',
  'measure', 'measures', 'measured',
  'update', 'updates', 'updated',
  'fill', 'fills', 'filled',
  'satisfy', 'satisfies', 'satisfied',
  'complete', 'completes', 'completed',
  'answer', 'answers', 'answered',
  'address', 'addresses', 'addressed',
  'explicit', 'read', 'reads', 'loaded', 'emit', 'emits', 'emitted',
  'present', 'absent', 'zero', 'present and', 'present in', 'present at',
  // Numeric / comparison operators
  '>=', '<=', '>', '<', '==', '!=',
  '≥', '≤', '≠', '≡'
];

const SOFT_BUDGET = 3000;
const HARD_BUDGET = 5000;

const errors = [];
const warnings = [];
const stats = {
  total: 0,
  passed: 0,
  withWarnings: 0,
  withErrors: 0,
  sectionsMissing: 0,
  weakVerbs: 0,
  nonFalsifiable: 0,
  overBudget: 0,
  brokenRefs: 0
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function walk(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, acc);
    else if (e.isFile() && e.name === 'SKILL.md') acc.push(full);
  }
  return acc;
}

function extractBody(content) {
  const m = content.match(/^---[\s\S]*?---\s*\n?([\s\S]*)$/);
  return m ? m[1] : content;
}

function extractRelatedPaths(section) {
  const lines = section.split('\n');
  const paths = [];
  for (const line of lines) {
    const match = line.match(/`([^`]+\.md)`/);
    if (match) paths.push(match[1]);
  }
  return paths;
}

function extractChecklist(section) {
  const lines = section.split('\n');
  const items = [];
  let inChecklist = false;
  for (const line of lines) {
    if (/^##\s/.test(line)) {
      inChecklist = /^## Verification checklist/i.test(line);
      continue;
    }
    if (inChecklist) {
      const m = line.match(/^\s*-\s*\[\s*[xX ]?\s*\]\s*(.+)$/);
      if (m) items.push(m[1].trim());
    }
  }
  return items;
}

function isFalsifiable(item) {
  const lower = item.toLowerCase();
  for (const v of MEASURABLE_VERBS) {
    if (lower.includes(v)) return true;
  }
  // Patterns like "X is Y", "Y > N", "no N"
  if (/[><=]=?\s*\d/.test(item)) return true;
  if (/\bno\s+(new|unhandled|missing|errors?|failures?)\b/i.test(item)) return true;
  if (/\beach\s+\w+/.test(lower)) return true;
  if (/^\s*\w+\s+(is|are|exists?|present|absent|zero)\b/i.test(item)) return true;
  return false;
}

async function pathExistsRelative(ref) {
  // ref like "skills/core/foo/SKILL.md" or "templates/x.md" or "commands/y.md"
  const candidates = [
    path.join(ROOT, ref),
    path.join(ROOT, 'skills', ref.replace(/^skills\//, '')),
    path.join(ROOT, 'templates', path.basename(ref)),
    path.join(ROOT, 'commands', path.basename(ref))
  ];
  for (const c of candidates) {
    if (existsSync(c)) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Per-file lint
// ---------------------------------------------------------------------------

async function lintSkill(file) {
  const rel = path.relative(ROOT, file);
  const content = await readFile(file, 'utf8');
  const body = extractBody(content);
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const fileErrors = [];
  const fileWarnings = [];

  stats.total += 1;

  // 1. Required sections (hard) + recommended sections (soft warn)
  if (!NAME_HEADING.test(content)) {
    fileErrors.push(`${rel}: missing "# Skill: <Name>" heading`);
  }
  for (const re of REQUIRED_SECTIONS) {
    if (!re.test(body)) {
      stats.sectionsMissing += 1;
      fileErrors.push(`${rel}: missing required section (${re.source})`);
    }
  }
  for (const re of RECOMMENDED_SECTIONS) {
    if (!re.test(body)) {
      stats.sectionsMissing += 1;
      fileWarnings.push(`${rel}: missing recommended section (${re.source}) — consider adding for flagship skill coverage`);
    }
  }

  // 2. Weak verbs in Workflow section
  const workflowMatch = body.match(/## Workflow[\s\S]*?(?=\n##\s|$)/);
  if (workflowMatch) {
    let weakCount = 0;
    for (const re of WEAK_VERBS) {
      const m = workflowMatch[0].match(re);
      if (m) weakCount += m.length;
    }
    if (weakCount > 0) {
      stats.weakVerbs += 1;
      fileWarnings.push(`${rel}: workflow contains ${weakCount} weak verb(s) (should/could/maybe/...) — prefer run/capture/verify`);
    }
  }

  // 3. Falsifiable Verification checklist
  const checklist = extractChecklist(body);
  if (checklist.length === 0) {
    // Required section check already catches missing; this is for content lint.
  } else {
    const nonFalsifiable = checklist.filter((item) => !isFalsifiable(item));
    if (nonFalsifiable.length > 0) {
      stats.nonFalsifiable += 1;
      fileWarnings.push(
        `${rel}: ${nonFalsifiable.length}/${checklist.length} checklist item(s) are non-falsifiable (no measurable verb): ` +
          nonFalsifiable.slice(0, 3).map((i) => `"${i.slice(0, 60)}${i.length > 60 ? '…' : ''}"`).join('; ')
      );
    }
  }

  // 4. Token budget
  if (wordCount > HARD_BUDGET) {
    stats.overBudget += 1;
    fileErrors.push(`${rel}: ${wordCount} words exceeds hard budget of ${HARD_BUDGET}`);
  } else if (wordCount > SOFT_BUDGET) {
    stats.overBudget += 1;
    fileWarnings.push(`${rel}: ${wordCount} words exceeds soft budget of ${SOFT_BUDGET}`);
  }

  // 5. Related skills cross-check
  const relatedMatch = body.match(/## Related skills[\s\S]*?(?=\n##\s|$)/);
  if (relatedMatch) {
    const refs = extractRelatedPaths(relatedMatch[0]);
    for (const ref of refs) {
      if (!(await pathExistsRelative(ref))) {
        stats.brokenRefs += 1;
        fileWarnings.push(`${rel}: related path not found: ${ref}`);
      }
    }
  }

  if (fileErrors.length === 0) stats.passed += 1;
  else stats.withErrors += 1;
  if (fileWarnings.length > 0) stats.withWarnings += 1;

  errors.push(...fileErrors);
  warnings.push(...fileWarnings);

  return { file: rel, errors: fileErrors, warnings: fileWarnings, wordCount };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const jsonOut = args.includes('--json');

  const skillsDir = path.join(ROOT, 'skills');
  if (!existsSync(skillsDir)) {
    console.error('❌ skills/ directory not found');
    process.exit(1);
  }

  const files = await walk(skillsDir);
  if (files.length === 0) {
    console.error('❌ No SKILL.md files found under skills/');
    process.exit(1);
  }

  const results = [];
  for (const f of files) {
    results.push(await lintSkill(f));
  }

  if (jsonOut) {
    const jsonReport = {
      stats,
      errorCount: errors.length,
      warningCount: warnings.length,
      errors: errors.slice(0, 200),
      warnings: warnings.slice(0, 200),
      truncated: { errors: errors.length > 200, warnings: warnings.length > 200 }
    };
    process.stdout.write(JSON.stringify(jsonReport, null, 2) + '\n');
  } else {
    console.log('=== Skill Quality Lint ===');
    console.log(`Skills scanned: ${stats.total}`);
    console.log(`Passed (no errors): ${stats.passed}`);
    console.log(`With errors:       ${stats.withErrors}`);
    console.log(`With warnings:     ${stats.withWarnings}`);
    console.log('');
    console.log(`  sections missing: ${stats.sectionsMissing}`);
    console.log(`  weak verbs:       ${stats.weakVerbs}`);
    console.log(`  non-falsifiable:  ${stats.nonFalsifiable}`);
    console.log(`  over budget:      ${stats.overBudget}`);
    console.log(`  broken refs:      ${stats.brokenRefs}`);
    console.log('');

    if (errors.length > 0) {
      console.error('❌ Errors:');
      for (const e of errors) console.error(`  - ${e}`);
    }
    if (warnings.length > 0) {
      console.log('⚠️  Warnings:');
      for (const w of warnings) console.log(`  - ${w}`);
    }
    console.log('');
    console.log(errors.length === 0 ? '✅ Skill quality gate: PASS (warnings only)' : '❌ Skill quality gate: FAIL');
  }

  process.exit(errors.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('validate-skill-quality crashed:', err);
  process.exit(2);
});
