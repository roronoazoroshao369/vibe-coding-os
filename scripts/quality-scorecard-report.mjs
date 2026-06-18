#!/usr/bin/env node
// quality-scorecard-report.mjs — aggregate historical quality scorecard data.
//
// This script is intentionally dependency-free and advisory. It exits 0 unless the
// script itself crashes, so teams can use it during review without making it a gate.

import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

function run(command) {
  try {
    return {
      ok: true,
      output: execSync(command, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        maxBuffer: 20 * 1024 * 1024,
      }).trim(),
    };
  } catch (err) {
    const stdout = err.stdout ? String(err.stdout) : '';
    const stderr = err.stderr ? String(err.stderr) : '';
    return {
      ok: false,
      output: `${stdout}${stderr}`.trim(),
      code: typeof err.status === 'number' ? err.status : 1,
    };
  }
}

function collectScorecardRuns() {
  // Look for historical scorecard report files in common locations.
  const candidates = [
    'docs/reports',
    'docs',
  ];

  const runs = [];

  for (const dir of candidates) {
    if (!existsSync(dir)) continue;
    try {
      const entries = readdirSync(dir);
      for (const entry of entries) {
        const filePath = join(dir, entry);
        if (!entry.endsWith('.md')) continue;
        if (!statSync(filePath).isFile()) continue;
        try {
          const content = readFileSync(filePath, 'utf8');
          // Detect scorecard-like files by content markers.
          if (
            content.includes('## Scope') ||
            content.includes('## Diff Summary') ||
            content.includes('Quality Scorecard')
          ) {
            runs.push({ path: filePath, content });
          }
        } catch {
          // Skip unreadable files.
        }
      }
    } catch {
      // Skip inaccessible directories.
    }
  }

  return runs;
}

function countMatches(content, pattern) {
  const matches = content.match(pattern);
  return matches ? matches.length : 0;
}

function extractMetric(content, pattern, fallback) {
  const match = content.match(pattern);
  if (match && match[1]) {
    const num = parseInt(match[1], 10);
    return isNaN(num) ? fallback : num;
  }
  return fallback;
}

function detectTrend(notes) {
  const hasPositive = notes.some((n) => /improv/i.test(n));
  const hasNegative = notes.some((n) => /declin|wors|regress/i.test(n));
  if (hasPositive && !hasNegative) return 'improving';
  if (hasNegative && !hasPositive) return 'declining';
  if (hasPositive && hasNegative) return 'mixed';
  return 'stable';
}

function main() {
  const runs = collectScorecardRuns();

  console.log('# Quality Scorecard Report');
  console.log('');
  console.log('> Aggregated summary from local scorecard history');
  console.log('');

  if (runs.length === 0) {
    console.log('- No historical scorecard runs detected.');
    console.log('- Run `npm run quality:scorecard` to generate the first session scorecard.');
    console.log('');
    console.log('## Trend');
    console.log('');
    console.log('- Trend: unknown (no history)');
    return;
  }

  let totalFilesChanged = 0;
  let totalTestsTouched = 0;
  let totalDocsTouched = 0;
  let totalConfigsTouched = 0;
  let totalWarnings = 0;
  const notes = [];
  const sources = [];

  for (const run of runs) {
    const { path: filePath, content } = run;
    sources.push(basename(filePath));

    totalFilesChanged += extractMetric(content, /Changed files[:\s]*(\d+)/i, 0);
    totalTestsTouched += extractMetric(content, /Tests? (?:touched|added or updated)[:\s]*(\d+)/i, 0);
    totalDocsTouched += extractMetric(content, /Docs? touched[:\s]*(\d+)/i, 0);
    totalConfigsTouched += extractMetric(content, /Config.*touched[:\s]*(\d+)/i, 0);

    // Detect warning signals.
    const warningSignals = countMatches(content, /warning|blocker|risk|review|regress/gi);
    if (warningSignals > 0) totalWarnings += 1;

    // Detect trend notes from recommendation or risk sections.
    const riskSection = content.match(/## Risks[\s\S]*?(?=## |$)/i);
    if (riskSection) {
      if (/improv/i.test(riskSection[0])) notes.push('Improvement noted');
      if (/declin|wors|regress/i.test(riskSection[0])) notes.push('Possible regression');
    }
    const recSection = content.match(/## Recommendation[\s\S]*?(?=## |$)/i);
    if (recSection) {
      if (/BLOCK|fix/.test(recSection[0])) notes.push('Blockers detected in ' + basename(filePath));
      if (/INFORMATIONAL|no blockers/i.test(recSection[0])) notes.push('No blockers in ' + basename(filePath));
    }
  }

  const trend = detectTrend(notes);

  console.log('## Scope');
  console.log('');
  console.log(`- Historical runs scanned: ${runs.length}`);
  console.log(`- Source files: ${sources.join(', ')}`);
  console.log('');

  console.log('## Aggregated Metrics');
  console.log('');
  console.log(`- Total files changed: ${totalFilesChanged}`);
  console.log(`- Tests added or updated: ${totalTestsTouched}`);
  console.log(`- Docs touched: ${totalDocsTouched}`);
  console.log(`- Config / manifest touched: ${totalConfigsTouched}`);
  console.log(`- Runs with warnings or blockers: ${totalWarnings}`);
  console.log('');

  console.log('## Trend Notes');
  console.log('');
  if (notes.length > 0) {
    for (const note of notes) console.log(`- ${note}`);
  } else {
    console.log('- No strong trend signals detected.');
  }
  console.log('');

  console.log('## Recommendation');
  console.log('');
  if (totalWarnings === 0) {
    console.log('- Historical quality signals are healthy.');
  } else {
    console.log(`- ${totalWarnings} run(s) had warning signals; review source files for details.`);
  }
  console.log('');
}

main();
