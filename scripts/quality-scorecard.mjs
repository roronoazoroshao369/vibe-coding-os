#!/usr/bin/env node
// quality-scorecard.mjs — print a lightweight markdown-style quality review report.
//
// This script is intentionally dependency-free and advisory. It exits 0 unless the
// script itself crashes, so teams can use it during review without making it a gate.

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

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

function packageScriptExists(scriptName) {
  const packagePath = join(process.cwd(), 'package.json');
  if (!existsSync(packagePath)) return false;

  try {
    const raw = execSync('node -p "JSON.stringify(require(\'./package.json\').scripts || {})"', { encoding: 'utf8' });
    const scripts = JSON.parse(raw);
    return Object.prototype.hasOwnProperty.call(scripts, scriptName);
  } catch {
    return false;
  }
}

function classifyFiles(files) {
  const tests = files.filter((file) => /(^|\/)(test|tests|spec|__tests__)(\/|$)|\.(test|spec)\.[cm]?[jt]sx?$|^scripts\/test-/i.test(file));
  const docs = files.filter((file) => /(^docs\/|\.md$|^examples\/)/i.test(file));
  const configs = files.filter((file) => /(^package\.json$|^package-lock\.json$|^pnpm-lock\.yaml$|^yarn\.lock$|\.config\.|^tsconfig|^eslint|^\.github\/)/i.test(file));
  const generated = files.filter((file) => /(^dist\/|^build\/|^coverage\/|\.min\.|generated)/i.test(file));

  return { tests, docs, configs, generated };
}

function bulletList(items, emptyText = 'none detected') {
  if (!items.length) return `- ${emptyText}`;
  return items.map((item) => `- ${item}`).join('\n');
}

function riskNotes(files, groups, qualityResult) {
  const notes = [];
  if (files.length === 0) notes.push('No working-tree diff detected; scorecard is informational.');
  if (groups.tests.length === 0 && files.some((file) => !/\.md$/i.test(file))) {
    notes.push('Code or config changed without a test-file signal in the diff.');
  }
  if (groups.configs.length > 0) notes.push('Config or manifest files changed; review install/build impact.');
  if (groups.generated.length > 0) notes.push('Generated or build-output-like files changed; verify they should be committed.');
  if (!qualityResult.ok) notes.push('Quality diff audit reported findings or exited non-zero; inspect details below.');
  return notes;
}

function main() {
  const stat = run('git diff --stat HEAD');
  const names = run('git diff --name-only HEAD');
  const files = names.output ? names.output.split('\n').map((line) => line.trim()).filter(Boolean) : [];
  const groups = classifyFiles(files);

  const hasQualityDiff = packageScriptExists('validate:quality-diff');
  const qualityResult = hasQualityDiff
    ? run('npm run validate:quality-diff --silent')
    : { ok: true, output: 'validate:quality-diff script not found; skipped.' };

  const notes = riskNotes(files, groups, qualityResult);
  const suggestedCommands = [
    hasQualityDiff ? 'npm run validate:quality-diff' : null,
    groups.tests.length > 0 ? '<run the targeted test command for touched tests>' : null,
    'npm run validate',
  ].filter(Boolean);

  console.log('# Quality Scorecard');
  console.log('');
  console.log('## Scope');
  console.log('');
  console.log(`- Changed files: ${files.length}`);
  console.log(`- Tests touched: ${groups.tests.length}`);
  console.log(`- Docs touched: ${groups.docs.length}`);
  console.log(`- Config / manifest touched: ${groups.configs.length}`);
  console.log(`- Generated-file signal: ${groups.generated.length}`);
  console.log('');

  console.log('## Diff Summary');
  console.log('');
  if (stat.output) {
    console.log('```text');
    console.log(stat.output);
    console.log('```');
  } else {
    console.log('- No git diff stat available.');
  }
  console.log('');
  console.log('### Changed files');
  console.log('');
  console.log(bulletList(files));
  console.log('');

  console.log('## Test Coverage Signal');
  console.log('');
  console.log('### Test-like files touched');
  console.log('');
  console.log(bulletList(groups.tests));
  console.log('');
  console.log('### Suggested commands');
  console.log('');
  console.log(bulletList(suggestedCommands));
  console.log('');

  console.log('## Quality Diff Findings');
  console.log('');
  console.log(`- Command available: ${hasQualityDiff ? 'yes' : 'no'}`);
  console.log(`- Status: ${qualityResult.ok ? 'PASS or no blocking exit' : `non-zero exit ${qualityResult.code ?? ''}`.trim()}`);
  console.log('');
  console.log('```text');
  console.log(qualityResult.output || 'No quality diff output.');
  console.log('```');
  console.log('');

  console.log('## Risks');
  console.log('');
  console.log(bulletList(notes, 'no heuristic risk notes'));
  console.log('');

  console.log('## Recommendation');
  console.log('');
  if (!qualityResult.ok) {
    console.log('- Review quality diff findings before merge.');
  } else if (notes.length > 0) {
    console.log('- Proceed after reviewer confirms risk notes are acceptable.');
  } else {
    console.log('- Informational: no heuristic blockers detected.');
  }
}

main();
