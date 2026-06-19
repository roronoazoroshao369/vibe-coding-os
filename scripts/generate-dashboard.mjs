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

// --- Embed live time-series trend data from quality-trend/dashboard.json ---
const qualityTrendPath = join(ROOT, 'docs', 'reports', 'quality-trend', 'dashboard.json');
let qualityTrendContent = qualityTrendDashboard;

if (existsSync(qualityTrendPath)) {
  try {
    const rawTrend = JSON.parse(await readFile(qualityTrendPath, 'utf8'));
    const daily = rawTrend.timeSeries?.daily || [];
    const latest7 = daily.slice(-7);

    if (latest7.length > 0) {
      const rows = latest7.map((d, i) => {
        const date = d.date;
        const runs = d.total ?? d.runs ?? 0;
        const rate = d.passRate != null ? d.passRate
          : (d.total > 0 ? (d.passes / d.total * 100) : 0);
        const rateStr = typeof rate === 'number' ? rate.toFixed(1) + '%' : 'N/A';
        const prevRate = i > 0
          ? (latest7[i - 1].passRate ?? (latest7[i - 1].total > 0 ? (latest7[i - 1].passes / latest7[i - 1].total * 100) : null))
          : null;
        const trend = d.trend
          || (prevRate != null
            ? (rate > prevRate + 1 ? '↑' : rate < prevRate - 1 ? '↓' : '→')
            : '→');
        return `| ${date} | ${runs} | ${rateStr} | ${trend} |`;
      }).join('\n');

      // Worst gates — only if any gates had failures in the last 7d window
      const gates = rawTrend.gates || [];
      const badGates = gates.filter(g => (g.failures ?? g.failed ?? 0) > 0);
      let worstGates = '';
      if (badGates.length > 0) {
        worstGates = '### Worst Gates (Last 7d)\n\n'
          + '| Gate | Failures | Pass rate |\n|---|---|---|\n'
          + badGates.map(g => {
              const failures = g.failures ?? g.failed ?? 0;
              const total = g.total ?? g.runs ?? 0;
              const pr = total > 0 ? ((total - failures) / total * 100).toFixed(1) + '%' : 'N/A';
              return `| ${g.name || g.gate || '?'} | ${failures}/${total} | ${pr} |`;
            }).join('\n') + '\n';
      }

      qualityTrendContent = '## Quality Trend Dashboard\n\n'
        + '### Time-Series Trend (Last 7 Days)\n\n'
        + '| Date | Runs | Pass rate | Trend |\n'
        + '|-----|------|-----------|-------|\n'
        + rows + '\n\n'
        + worstGates;
    }
  } catch (err) {
    console.error(`Warning: Could not parse quality trend data: ${err.message}`);
  }
}

if (!qualityTrendContent) {
  qualityTrendContent = '## Quality Trend Dashboard\n\n'
    + 'No trend data yet. Run `npm run dashboard:trend` to generate.';
}

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

sections.push(qualityTrendContent);
sections.push(``);

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
