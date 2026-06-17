#!/usr/bin/env node
/**
 * reference-diff.mjs — Report tracked references that have not been checked recently.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

function parseArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help') flags.help = true;
    else if (a.startsWith('--')) { const k = a.slice(2); const n = argv[i + 1];
      if (n === undefined || n.startsWith('--')) flags[k] = true; else { flags[k] = n; i++; }
    }
  }
  return flags;
}

function usage() {
  console.log(`
Usage: reference-diff [--days N]

Reads references/index.json and reports sources whose last_checked date is older
than N days. Defaults to 30 days.
`.trim());
}

const flags = parseArgs(process.argv.slice(2));
if (flags.help) { usage(); process.exit(0); }

const thresholdDays = Number(flags.days) > 0 ? Number(flags.days) : 30;
const indexPath = path.join(process.cwd(), 'references', 'index.json');
const index = JSON.parse(await readFile(indexPath, 'utf8'));
const now = new Date();
const stale = [];

for (const source of index.sources || []) {
  if (!source.last_checked) {
    stale.push({ source, days: Infinity, reason: 'missing last_checked' });
    continue;
  }
  const checked = new Date(source.last_checked);
  if (Number.isNaN(checked.getTime())) {
    stale.push({ source, days: Infinity, reason: `invalid last_checked: ${source.last_checked}` });
    continue;
  }
  const days = Math.floor((now.getTime() - checked.getTime()) / (24 * 60 * 60 * 1000));
  if (days > thresholdDays) stale.push({ source, days, reason: `${days} days since last_checked` });
}

if (stale.length === 0) {
  console.log(`All references checked within ${thresholdDays} days.`);
} else {
  console.log(`References needing audit (> ${thresholdDays} days):`);
  for (const { source, reason } of stale) {
    console.log(`- ${source.id || '(missing id)'}: ${reason}`);
  }
}
