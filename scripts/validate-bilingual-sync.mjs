#!/usr/bin/env node
// validate-bilingual-sync.mjs — verify README.md and README.vi.md are in sync

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const args = process.argv.slice(2);

if (args.includes('-h') || args.includes('--help')) {
  console.log(`validate-bilingual-sync — check README.md ↔ README.vi.md numeric fields match

Usage:
  node scripts/validate-bilingual-sync.mjs

Checks:
  - version banner (e.g. v1.0.0)
  - skill count
  - command count
  - template count
  - adapter count (tool adapter directories under adapters/)

Exit 0 on match, 1 on mismatch.`);
  process.exit(0);
}

function readText(rel) {
  const p = resolve(ROOT, rel);
  if (!existsSync(p)) {
    console.error(`File not found: ${rel}`);
    process.exit(1);
  }
  return readFileSync(p, 'utf8');
}

function countSubdirs(dir) {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((entry) => {
    try { return statSync(join(dir, entry)).isDirectory(); } catch { return false; }
  }).length;
}

function extractField(text, pattern) {
  const match = text.match(pattern);
  return match ? match[1].trim() : null;
}

const readmeEn = readText('README.md');
const readmeVi = readText('README.vi.md');

const failures = [];

function check(label, enVal, viVal) {
  const enDisplay = enVal ?? '(not found)';
  const viDisplay = viVal ?? '(not found)';

  if (enVal === viVal) {
    console.log(`✅ ${label}: ${enDisplay}`);
  } else {
    console.error(`❌ ${label}: English=${enDisplay}, Vietnamese=${viDisplay}`);
    failures.push(label);
  }
}

const versionEn = extractField(readmeEn, /Current release \((v[\d.]+)\)/);
const versionVi = extractField(readmeVi, /Bản phát hành hiện tại \((v[\d.]+)\)/);
check('Version', versionEn, versionVi);

const skillsEn = extractField(readmeEn, /\*\*(\d+) skills\*\*/);
const skillsVi = extractField(readmeVi, /\*\*(\d+) skills\*\*/);
check('Skill count', skillsEn, skillsVi);

const commandsEn = extractField(readmeEn, /\*\*(\d+) commands\*\*/);
const commandsVi = extractField(readmeVi, /\*\*(\d+) commands\*\*/);
check('Command count', commandsEn, commandsVi);

const templatesEn = extractField(readmeEn, /\*\*(\d+) templates\*\*/);
const templatesVi = extractField(readmeVi, /\*\*(\d+) templates\*\*/);
check('Template count', templatesEn, templatesVi);

// Adapter count — compare the listed adapter bullet links in each README
function adapterCountFromReadme(text) {
  // Match adapter bullet links like "- \`adapters/claude-code/\`" or "- \`adapters/codex/\`"
  const re = /^- `adapters\/([a-z0-9-]+)\/`/gm;
  const adapters = new Set();
  let m;
  while ((m = re.exec(text)) !== null) {
    adapters.add(m[1]);
  }
  return adapters.size;
}

// Alternatively, compute from the actual filesystem (tool adapters only)
const adaptersDir = join(ROOT, 'adapters');
const adapterNames = existsSync(adaptersDir)
  ? readdirSync(adaptersDir).filter((entry) => {
      try { return statSync(join(adaptersDir, entry)).isDirectory(); } catch { return false; }
    })
  : [];

// Use filesystem truth as canonical, but also compare what each README claims
const adapterCountActual = adapterNames.length;
const adapterCountEn = adapterCountFromReadme(readmeEn);
const adapterCountVi = adapterCountFromReadme(readmeVi);

// Check both READMEs agree
if (adapterCountEn === adapterCountVi) {
  console.log(`✅ Adapter count: both list ${adapterCountEn}`);
} else {
  console.error(`❌ Adapter count: English=${adapterCountEn}, Vietnamese=${adapterCountVi}`);
  failures.push('Adapter count (READMEs disagree)');
}

// Warn if READMEs don't match filesystem (non-fatal)
if (adapterCountEn !== adapterCountActual) {
  console.error(`⚠  English README lists ${adapterCountEn} adapters but filesystem has ${adapterCountActual}`);
}
if (adapterCountVi !== adapterCountActual) {
  console.error(`⚠  Vietnamese README lists ${adapterCountVi} adapters but filesystem has ${adapterCountActual}`);
}

console.log('');

if (failures.length > 0) {
  console.error(`Bilingual sync failed: ${failures.length} mismatch(es)`);
  process.exit(1);
}

console.log('✅ README.md and README.vi.md are in sync');
