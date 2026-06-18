#!/usr/bin/env node
// lesson-importer.mjs — import v2.3 lesson exchange batches into the local lessons DB.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_DB = resolve(ROOT, 'skills', 'core', 'lessons-learned-db', 'lessons.json');

function parseArgs(argv) {
  const args = { input: null, db: DEFAULT_DB, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--db' && argv[i + 1]) args.db = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--db=')) args.db = resolve(ROOT, arg.slice(5));
    else if (!args.input) args.input = resolve(ROOT, arg);
  }
  return args;
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function readLessonArray(path) {
  const data = readJson(path, []);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.lessons)) return data.lessons;
  throw new Error(`Existing lessons DB must be a JSON array or object with lessons array: ${path}`);
}

function readBatch(path) {
  if (!path) throw new Error('Usage: node scripts/lesson-importer.mjs <file.lesson-exchange.json> [--dry-run]');
  const data = readJson(path, null);
  if (!data || !Array.isArray(data.lessons)) throw new Error('Exchange file must contain a lessons array.');
  return data.lessons;
}

function dedupeKey(lesson) {
  return `${String(lesson.pattern || '').trim().toLowerCase()}\u0000${String(lesson.modelId || '').trim().toLowerCase()}`;
}

function isExpired(lesson, now = new Date()) {
  if (lesson.expiry === null || lesson.expiry === undefined || lesson.expiry === '') return false;
  const expiry = new Date(`${lesson.expiry}T23:59:59.999Z`);
  return Number.isNaN(expiry.getTime()) || expiry.getTime() < now.getTime();
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const incoming = readBatch(args.input);
  const existing = readLessonArray(args.db);
  const seen = new Set(existing.map(dedupeKey));
  const toImport = [];
  const report = { imported: 0, skipped: 0, rejected: 0 };

  for (const lesson of incoming) {
    if (isExpired(lesson)) {
      report.rejected += 1;
      continue;
    }
    const key = dedupeKey(lesson);
    if (!String(lesson.pattern || '').trim() || !String(lesson.modelId || '').trim() || seen.has(key)) {
      report.skipped += 1;
      continue;
    }
    seen.add(key);
    toImport.push(lesson);
    report.imported += 1;
  }

  if (!args.dryRun) {
    mkdirSync(dirname(args.db), { recursive: true });
    writeFileSync(args.db, `${JSON.stringify([...existing, ...toImport], null, 2)}\n`);
  }

  console.log(`Imported: ${report.imported}`);
  console.log(`Skipped (duplicate): ${report.skipped}`);
  console.log(`Rejected (expired): ${report.rejected}`);
  if (args.dryRun) console.log('Dry run: no files were changed.');
}

try {
  main();
} catch (error) {
  console.error(`lesson-importer: ${error.message}`);
  process.exitCode = 1;
}
