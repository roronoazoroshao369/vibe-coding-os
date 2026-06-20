#!/usr/bin/env node
// scripts/deprecate-skill.mjs
// Wave B1 Move 5 — Properly deprecate a skill (mark, log, redirect, don't delete)
// Appends to registry/deprecation-tracker.json and generates deprecation notice.

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();

const TRACKER_PATH = join(ROOT, 'registry/deprecation-tracker.json');
const NOTICE_PATH = join(ROOT, 'docs/deprecations');

// Find skill by name
function findSkillByName(name) {
  const skillsDir = join(ROOT, 'skills');
  if (!existsSync(skillsDir)) return null;
  for (const entry of readdirSync(skillsDir)) {
    const full = join(skillsDir, entry);
    if (!statSync(full).isDirectory()) continue;
    for (const sub of readdirSync(full)) {
      const subFull = join(full, sub);
      if (!statSync(subFull).isDirectory()) continue;
      const skillFile = join(subFull, 'SKILL.md');
      if (!existsSync(skillFile)) continue;
      const content = readFileSync(skillFile, 'utf8');
      const m = content.match(/^---\s*\nname:\s*([^\n]+)/);
      if (m && m[1].trim() === name) {
        return { path: skillFile, relPath: relative(ROOT, skillFile), category: entry };
      }
    }
  }
  return null;
}

// Load tracker (or initialize)
function loadTracker() {
  if (!existsSync(TRACKER_PATH)) {
    return { version: '0.1.0', description: 'Append-only tracker for deprecations', entries: [] };
  }
  return JSON.parse(readFileSync(TRACKER_PATH, 'utf8'));
}

function saveTracker(tracker) {
  writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2));
}

function generateNoticeId() {
  const d = new Date();
  return `DEP-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

const action = process.argv[2];
const skillName = process.argv[3];
const reason = process.argv[4];
const replacement = process.argv[5];

if (!action || action === '--help') {
  console.log('Usage: node scripts/deprecate-skill.mjs <action> [args]');
  console.log('');
  console.log('Actions:');
  console.log('  list                                       List all deprecations');
  console.log('  mark <skill-name> <reason> <replacement>   Mark skill as deprecated');
  console.log('  notice <skill-name>                        Generate deprecation notice file');
  console.log('  check <skill-name>                         Check if skill is deprecated');
  console.log('');
  process.exit(0);
}

if (action === 'list') {
  const tracker = loadTracker();
  if (tracker.entries.length === 0) {
    console.log('No deprecations recorded.');
    process.exit(0);
  }
  console.log(`Total deprecations: ${tracker.entries.length}\n`);
  for (const entry of tracker.entries) {
    console.log(`  [${entry.id}] ${entry.target.path}`);
    console.log(`    Reason: ${entry.reason.slice(0, 80)}...`);
    console.log(`    Replacement: ${entry.replacement.path}`);
    console.log(`    Severity: ${entry.severity}`);
    console.log(`    Sunset: ${entry.timeline.sunset_date}`);
    console.log('');
  }
  process.exit(0);
}

if (action === 'check') {
  if (!skillName) {
    console.error('Usage: node scripts/deprecate-skill.mjs check <skill-name>');
    process.exit(1);
  }
  const tracker = loadTracker();
  const entry = tracker.entries.find(e => e.target.path.includes(skillName));
  if (entry) {
    console.log(JSON.stringify(entry, null, 2));
    process.exit(0);
  } else {
    console.log(`Skill "${skillName}" is not deprecated.`);
    process.exit(1);
  }
}

if (action === 'mark') {
  if (!skillName || !reason) {
    console.error('Usage: node scripts/deprecate-skill.mjs mark <skill-name> <reason> [replacement]');
    process.exit(1);
  }
  const skill = findSkillByName(skillName);
  if (!skill) {
    console.error(`Skill "${skillName}" not found in skills/ tree.`);
    process.exit(1);
  }
  const tracker = loadTracker();
  const existing = tracker.entries.find(e => e.target.path === skill.relPath);
  if (existing) {
    console.error(`Skill already deprecated as ${existing.id}.`);
    process.exit(1);
  }

  const now = new Date();
  const sunset = new Date(now);
  sunset.setDate(sunset.getDate() + 30); // 30-day default notice

  const entry = {
    id: generateNoticeId(),
    target: {
      path: skill.relPath,
      type: 'skill',
      name: skillName,
      version_deprecated_in: process.env.RELEASE_VERSION || 'next'
    },
    reason,
    replacement: {
      path: replacement || 'none — sunset only',
      feature_equivalence: 'partial',
      gaps: []
    },
    severity: 'advisory',
    timeline: {
      announced: formatDate(now),
      notice_starts: formatDate(now),
      sunset_date: formatDate(sunset),
      grace_period_days: 0
    },
    affected_consumers: [],
    owner: process.env.GITHUB_USER || 'unassigned',
    created_at: now.toISOString()
  };

  tracker.entries.push(entry);
  saveTracker(tracker);

  // Add deprecation banner to skill frontmatter
  let content = readFileSync(skill.path, 'utf8');
  if (!content.match(/^deprecated:\s*true/m)) {
    content = content.replace(
      /^(---\s*\n)/,
      `$1deprecated: true\ndeprecated_in: ${entry.target.version_deprecated_in}\ndeprecation_id: ${entry.id}\nreplacement: ${entry.replacement.path}\nsunset_date: ${entry.timeline.sunset_date}\n`
    );
    writeFileSync(skill.path, content);
  }

  console.log(`Marked ${skill.relPath} as deprecated.`);
  console.log(`  Notice ID: ${entry.id}`);
  console.log(`  Sunset: ${entry.timeline.sunset_date}`);
  console.log(`  Replacement: ${entry.replacement.path}`);
  process.exit(0);
}

if (action === 'notice') {
  if (!skillName) {
    console.error('Usage: node scripts/deprecate-skill.mjs notice <skill-name>');
    process.exit(1);
  }
  const tracker = loadTracker();
  const entry = tracker.entries.find(e => e.target.path.includes(skillName));
  if (!entry) {
    console.error(`Skill "${skillName}" is not in deprecation tracker.`);
    process.exit(1);
  }

  const notice = `# Deprecation Notice: ${entry.target.name}

> Generated from ${entry.id} — ${formatDate(new Date(entry.created_at))}

## Target

- **Artifact:** \`${entry.target.path}\`
- **Type:** ${entry.target.type}
- **Version deprecated in:** \`${entry.target.version_deprecated_in}\`

## Reason

${entry.reason}

## Replacement

- **Replacement artifact:** \`${entry.replacement.path}\`
- **Feature equivalence:** ${entry.replacement.feature_equivalence}

## Severity

- **${entry.severity.toUpperCase()}**
- Sunset date: ${entry.timeline.sunset_date}
- Notice period starts: ${entry.timeline.notice_starts}

## Migration

1. Review \`${entry.target.path}\` for usages in your project.
2. Replace calls with \`${entry.replacement.path}\`.
3. Run \`node scripts/skill-content-search.mjs "${entry.target.name}"\` to find remaining references.
4. After sunset date, the skill may be removed.

## Contact

- **Owner:** ${entry.owner}
- **Notice ID:** ${entry.id}
`;

  if (!existsSync(NOTICE_PATH)) {
    const { mkdirSync } = await import('node:fs');
    mkdirSync(NOTICE_PATH, { recursive: true });
  }
  const filePath = join(NOTICE_PATH, `${entry.id}.md`);
  writeFileSync(filePath, notice);
  console.log(`Notice written to ${relative(ROOT, filePath)}`);
  process.exit(0);
}

console.error(`Unknown action: ${action}`);
process.exit(1);
