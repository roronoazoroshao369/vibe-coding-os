#!/usr/bin/env node
// generate-dashboard.mjs — regenerate docs/DASHBOARD.md from live data

import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Dynamic import so dashboard-data top-level code runs in its own context
const { getDashboardSummary } = await import(join(ROOT, 'scripts', 'dashboard-data.mjs'));

const summary = await getDashboardSummary();

// Read existing DASHBOARD.md to preserve sections we don't generate
const dashboardPath = join(ROOT, 'docs', 'DASHBOARD.md');
let existing = '';
if (existsSync(dashboardPath)) {
  existing = await readFile(dashboardPath, 'utf8');
}

// Helper to format the date
const generatedDate = summary.generatedAt.slice(0, 10);
const version = summary.version;
const counts = summary.counts;
const trace = summary.traceability;

// Build skills-by-category table rows
const skillCatRows = Object.entries(counts.skillsByCategory)
  .map(([cat, count]) => `| ${cat} | ${count} |`)
  .join('\n');

// Check whether we should preserve the Version Progress, Safety Metrics, Validation Gate,
// Coverage Summary sections from the existing dashboard (they require running validate:all,
// which we don't want to do from this script). We'll preserve those sections by extracting
// them from the existing file.

function extractSection(text, heading) {
  // Find heading (## ...) and extract everything until the next ## heading or end
  const regex = new RegExp(`(^## ${heading}[\\s\\S]*?)(?=\\n## |\\z)`, 'm');
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

const versionProgress = extractSection(existing, 'Version Progress');
const safetyMetrics = extractSection(existing, 'Safety Metrics');
const qualityTrendDashboard = extractSection(existing, 'Quality Trend Dashboard');
const validationGate = extractSection(existing, 'Validation Gate');
const coverageSummary = extractSection(existing, 'Coverage Summary');

// Build the new DASHBOARD.md
const sections = [];

sections.push(`# Vibe Coding OS — Project Health Dashboard`);
sections.push(``);
sections.push(`> **Auto-generated** by \`scripts/generate-dashboard.mjs\` — do not edit manually.`);
sections.push(`> Last generated: ${generatedDate}`);
sections.push(``);
sections.push(`## Quick Status`);
sections.push(``);
sections.push(`| Metric | Value |`);
sections.push(`|---|---|`);
sections.push(`| Version | ${version} |`);
sections.push(`| Skills | ${counts.skills} |`);
sections.push(`| Commands | ${counts.commands} |`);
sections.push(`| Templates | ${counts.templates} |`);
sections.push(`| Narrative files | ${counts.narrativeFiles} |`);
sections.push(`| Upstream sources | ${counts.upstreamSources} |`);
sections.push(`| Broken refs | ${trace.brokenReferences ?? 0} |`);
sections.push(``);
sections.push(`### Skills by Category`);
sections.push(``);
sections.push(`| Category | Count |`);
sections.push(`|---|---|`);
sections.push(skillCatRows);
sections.push(``);

if (versionProgress) {
  sections.push(versionProgress);
  sections.push(``);
}

if (safetyMetrics) {
  sections.push(safetyMetrics);
  sections.push(``);
}

if (qualityTrendDashboard) {
  sections.push(qualityTrendDashboard);
  sections.push(``);
}

if (validationGate) {
  sections.push(validationGate);
  sections.push(``);
}

if (coverageSummary) {
  sections.push(coverageSummary);
  sections.push(``);
}

sections.push(`## How to Regenerate`);
sections.push(``);
sections.push('```bash');
sections.push(`# Dashboard data (JSON to stdout)`);
sections.push(`npm run dashboard:data`);
sections.push(``);
sections.push(`# Regenerate this dashboard markdown`);
sections.push(`npm run dashboard:generate`);
sections.push(``);
sections.push(`# Full validation gate (all checks)`);
sections.push(`npm run validate:all`);
sections.push('```');
sections.push(``);
sections.push(`## Related Documents`);
sections.push(``);
sections.push(`- [Evaluation Report](reports/evaluation-report.md) — detailed per-check output`);
sections.push(`- [Evaluation Report Runner](evaluation-report.md) — how the report works`);
sections.push(`- [Roadmap Status](ROADMAP-STATUS.md) — version progress tracker`);
sections.push(`- [Compatibility & Support Policy](compatibility-support-policy.md) — adapter tiers and validation requirements`);
sections.push(`- [Release Checklist](release-checklist.md) — operational release steps`);
sections.push(``);

await writeFile(dashboardPath, sections.join('\n'), 'utf8');
console.log(`✅ Dashboard written to ${dashboardPath}`);
