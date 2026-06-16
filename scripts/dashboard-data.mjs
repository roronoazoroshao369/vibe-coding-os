#!/usr/bin/env node
// dashboard-data.mjs — lightweight repository health data extractor

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

async function pathExists(path) {
  return existsSync(path);
}

async function listFiles(dir, predicate = () => true) {
  if (!(await pathExists(dir))) return [];

  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(fullPath, predicate));
    } else if (predicate(fullPath, entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function countSkillsByCategory() {
  const skillsDir = join(ROOT, 'skills');
  const categories = {};

  for (const entry of await readdir(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const categoryDir = join(skillsDir, entry.name);
    const skillFiles = await listFiles(categoryDir, (_path, name) => name === 'SKILL.md');
    categories[entry.name] = skillFiles.length;
  }

  return Object.fromEntries(Object.entries(categories).sort(([a], [b]) => a.localeCompare(b)));
}

async function countMarkdownFiles(dir) {
  return (await listFiles(join(ROOT, dir), (_path, name) => name.endsWith('.md'))).length;
}

async function countTemplateFiles() {
  return (await listFiles(join(ROOT, 'templates'), (_path, name) => name.endsWith('.md') || name.endsWith('.json'))).length;
}

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

async function readPackageVersion() {
  const packageJson = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'));
  return packageJson.version;
}

async function readUpstreamCount() {
  const indexPath = join(ROOT, 'references', 'index.json');
  if (!(await pathExists(indexPath))) return 0;
  const index = JSON.parse(await readFile(indexPath, 'utf8'));
  return Array.isArray(index.sources) ? index.sources.length : 0;
}

const skillsByCategory = await countSkillsByCategory();
const traceabilityRun = runNodeScript('validate-traceability.mjs');
const traceability = parseTraceability(traceabilityRun.output);
const commandFiles = await countMarkdownFiles('commands');
const templateFiles = await countTemplateFiles();
const narrativeFallback = (await listFiles(ROOT, (path, name) => {
  const rel = relative(ROOT, path);
  return name.endsWith('.md')
    && !rel.startsWith('node_modules/')
    && !rel.startsWith('references/upstreams/');
})).length;

const summary = {
  generatedAt: new Date().toISOString(),
  version: await readPackageVersion(),
  counts: {
    skills: Object.values(skillsByCategory).reduce((sum, count) => sum + count, 0),
    skillsByCategory,
    commands: traceability.commands ?? commandFiles,
    templates: traceability.templates ?? templateFiles,
    narrativeFiles: traceability.narrativeFiles ?? narrativeFallback,
    upstreamSources: await readUpstreamCount()
  },
  traceability: {
    validationPassed: traceabilityRun.ok,
    brokenReferences: traceability.brokenReferences,
    orphanCommands: traceability.orphanCommands,
    orphanSkills: traceability.orphanSkills,
    orphanTemplates: traceability.orphanTemplates
  }
};

console.log(JSON.stringify(summary, null, 2));
