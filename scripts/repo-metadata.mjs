#!/usr/bin/env node
// repo-metadata.mjs — single source of truth for release-facing counts.
//
// Policy:
// - Version comes from package.json.
// - Validation gate count comes from package.json:scripts.validate:all.
// - Skill count is the active skill filesystem count: skills/<category>/<name>/SKILL.md.
// - Command count is the active public command manifest count. Deprecated
//   compatibility shims can remain on disk but are excluded from headline counts.
// - Template count is the active template manifest count.

import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

async function readJson(relPath) {
  return JSON.parse(await readFile(join(ROOT, relPath), 'utf8'));
}

async function walkFiles(dir, predicate = () => true) {
  const root = join(ROOT, dir);
  if (!existsSync(root)) return [];

  const found = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && predicate(relative(ROOT, full), entry.name)) {
        found.push(relative(ROOT, full).split('\\').join('/'));
      }
    }
  }

  await walk(root);
  return found.sort();
}

function countValidateAllGates(validateAllScript) {
  if (!validateAllScript || typeof validateAllScript !== 'string') return 0;
  return validateAllScript
    .split(/\s+&&\s+/)
    .map((part) => part.trim())
    .filter(Boolean).length;
}

async function countActiveSkills() {
  const skillFiles = await walkFiles('skills', (rel, name) => {
    if (name !== 'SKILL.md') return false;
    // Exclude the root aggregator skills/SKILL.md from active skill inventory.
    return rel.split('/').length >= 4;
  });
  const byCategory = {};
  for (const file of skillFiles) {
    const category = file.split('/')[1] ?? 'unknown';
    byCategory[category] = (byCategory[category] ?? 0) + 1;
  }
  return { count: skillFiles.length, files: skillFiles, byCategory: Object.fromEntries(Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b))) };
}

async function readActiveCommandManifest() {
  const manifest = await readJson('commands/manifest.json');
  const commands = Array.isArray(manifest.commands) ? manifest.commands : [];
  return {
    count: Number(manifest.count_real_excluding_README ?? manifest.count ?? commands.length),
    manifestCount: Number(manifest.count ?? commands.length),
    listCount: commands.length,
    commands,
    generated: manifest.generated ?? null,
    releaseVersion: manifest.releaseVersion ?? null
  };
}

async function readActiveTemplateManifest() {
  const manifest = await readJson('templates/manifest.json');
  const templates = Array.isArray(manifest.templates) ? manifest.templates : [];
  return {
    count: Number(manifest.count ?? templates.length),
    listCount: templates.length,
    templates,
    generated: manifest.generated ?? null,
    releaseVersion: manifest.releaseVersion ?? null
  };
}

async function readUpstreamCount() {
  const indexPath = join(ROOT, 'references', 'index.json');
  if (!existsSync(indexPath)) return 0;
  const index = JSON.parse(await readFile(indexPath, 'utf8'));
  return Array.isArray(index.sources) ? index.sources.length : 0;
}

export async function getRepoMetadata() {
  const pkg = await readJson('package.json');
  const activeSkills = await countActiveSkills();
  const activeCommands = await readActiveCommandManifest();
  const activeTemplates = await readActiveTemplateManifest();
  const validateAllScript = pkg.scripts?.['validate:all'] ?? '';

  return {
    generatedAt: new Date().toISOString(),
    version: pkg.version,
    counts: {
      skills: activeSkills.count,
      skillsByCategory: activeSkills.byCategory,
      commands: activeCommands.count,
      templates: activeTemplates.count,
      upstreamSources: await readUpstreamCount(),
      validationGates: countValidateAllGates(validateAllScript)
    },
    validation: {
      source: 'package.json:scripts.validate:all',
      command: validateAllScript,
      gates: countValidateAllGates(validateAllScript)
    },
    manifests: {
      commands: activeCommands,
      templates: activeTemplates
    },
    policy: {
      commandCount: 'Active public command count comes from commands/manifest.json. Deprecated compatibility shims may remain on disk but are excluded from headline docs.',
      skillCount: 'Active skill count is filesystem-based and excludes root skills/SKILL.md aggregator.',
      templateCount: 'Active template count comes from templates/manifest.json.',
      validationGateCount: 'Gate count is parsed from package.json scripts.validate:all.'
    }
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
  const metadata = await getRepoMetadata();
  console.log(JSON.stringify(metadata, null, 2));
}
