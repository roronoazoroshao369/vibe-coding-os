#!/usr/bin/env node
// dashboard-data.mjs — repository health data extractor.
// Release-facing counts come from scripts/repo-metadata.mjs.

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getRepoMetadata } from './repo-metadata.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function runNodeScript(script) {
  try {
    const stdout = execFileSync(process.execPath, [join(ROOT, 'scripts', script)], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 50 * 1024 * 1024
    });
    return { ok: true, output: stdout };
  } catch (error) {
    return {
      ok: false,
      output: `${error.stdout ? String(error.stdout) : ''}\n${error.stderr ? String(error.stderr) : ''}`.trim(),
      exitCode: typeof error.status === 'number' ? error.status : 1
    };
  }
}

function parseTraceability(output) {
  const summary = output.match(/Checked\s+(\d+)\s+commands,\s+(\d+)\s+skills,\s+(\d+)\s+templates\s+against\s+(\d+)\s+narrative files\.\s+Broken references:\s+(\d+)\.\s+Orphans \(warnings\):\s+(\d+)\s+commands,\s+(\d+)\s+skills,\s+(\d+)\s+templates\./i);

  if (summary) {
    return {
      commands: Number(summary[1]),
      skills: Number(summary[2]),
      templates: Number(summary[3]),
      narrativeFiles: Number(summary[4]),
      brokenReferences: Number(summary[5]),
      orphanCommands: Number(summary[6]),
      orphanSkills: Number(summary[7]),
      orphanTemplates: Number(summary[8])
    };
  }

  return {
    commands: null,
    skills: null,
    templates: null,
    narrativeFiles: null,
    brokenReferences: (output.match(/references a missing path:/g) ?? []).length,
    orphanCommands: (output.match(/Orphan command /g) ?? []).length,
    orphanSkills: (output.match(/Orphan skill /g) ?? []).length,
    orphanTemplates: (output.match(/Orphan template /g) ?? []).length
  };
}

async function countNarrativeFallback() {
  // Lightweight fallback only used if traceability output cannot provide the count.
  const { readdir } = await import('node:fs/promises');
  const files = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(current, entry.name);
      const rel = relative(ROOT, full).split('\\').join('/');
      if (entry.name === 'node_modules' || entry.name === '.git' || rel.startsWith('references/upstreams/')) continue;
      if (entry.isDirectory()) await walk(full);
      else if (entry.isFile() && entry.name.endsWith('.md')) files.push(rel);
    }
  }
  if (existsSync(ROOT)) await walk(ROOT);
  return files.length;
}

export async function getDashboardSummary() {
  const metadata = await getRepoMetadata();
  const traceabilityRun = runNodeScript('validate-traceability.mjs');
  const traceability = parseTraceability(traceabilityRun.output);

  return {
    generatedAt: new Date().toISOString(),
    version: metadata.version,
    counts: {
      skills: metadata.counts.skills,
      skillsByCategory: metadata.counts.skillsByCategory ?? {},
      commands: metadata.counts.commands,
      templates: metadata.counts.templates,
      validationGates: metadata.counts.validationGates,
      narrativeFiles: traceability.narrativeFiles ?? await countNarrativeFallback(),
      upstreamSources: metadata.counts.upstreamSources
    },
    traceability: {
      validationPassed: traceabilityRun.ok,
      brokenReferences: traceability.brokenReferences,
      orphanCommands: traceability.orphanCommands,
      orphanSkills: traceability.orphanSkills,
      orphanTemplates: traceability.orphanTemplates
    },
    policy: metadata.policy
  };
}

const isMainModule = (() => {
  const entry = process.argv[1];
  try {
    return entry && resolve(entry) === resolve(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
})();

if (isMainModule) {
  const summary = await getDashboardSummary();
  console.log(JSON.stringify(summary, null, 2));
}
