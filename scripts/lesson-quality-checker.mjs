#!/usr/bin/env node
// lesson-quality-checker.mjs — validate local lesson DB quality for v2.3 sharing.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_DB = resolve(ROOT, 'skills', 'core', 'lessons-learned-db', 'lessons.json');
const REQUIRED = ['lessonId', 'repoId', 'repoName', 'modelId', 'timestamp', 'lessonType', 'pattern', 'context', 'fix', 'tags', 'confidence', 'scope', 'source', 'expiry', 'crossRepoVerified'];
const SKIP_DIRS = new Set(['.git', 'node_modules', '.omc']);
const TEXT_EXTS = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.json', '.md', '.yml', '.yaml', '.toml', '.txt', '.css', '.html', '.py', '.sh']);

function parseArgs(argv) {
  const args = { db: DEFAULT_DB, outputJson: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--output-json') args.outputJson = true;
    else if (arg === '--db' && argv[i + 1]) args.db = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--db=')) args.db = resolve(ROOT, arg.slice(5));
  }
  return args;
}

function readLessons(path) {
  if (!existsSync(path)) return [];
  const data = JSON.parse(readFileSync(path, 'utf8'));
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.lessons)) return data.lessons;
  throw new Error('Lesson DB must be a JSON array or an object with a lessons array.');
}

function isExpired(lesson, now = new Date()) {
  if (lesson.expiry === null || lesson.expiry === undefined || lesson.expiry === '') return false;
  const expiry = new Date(`${lesson.expiry}T23:59:59.999Z`);
  return Number.isNaN(expiry.getTime()) || expiry.getTime() < now.getTime();
}

function expiresSoon(lesson, now = new Date()) {
  if (!lesson.expiry) return false;
  const expiry = new Date(`${lesson.expiry}T23:59:59.999Z`);
  if (Number.isNaN(expiry.getTime())) return false;
  const days = (expiry.getTime() - now.getTime()) / 86400000;
  return days >= 0 && days <= 30;
}

function hasRequiredFields(lesson) {
  return REQUIRED.every((field) => Object.prototype.hasOwnProperty.call(lesson, field));
}

function invalidReasons(lesson) {
  const reasons = [];
  if (!hasRequiredFields(lesson)) reasons.push('missing required field');
  if (Number(lesson.confidence) < 0.3 || Number.isNaN(Number(lesson.confidence))) reasons.push('confidence below 0.3');
  if (isExpired(lesson)) reasons.push('expired');
  if (!String(lesson.pattern || '').trim()) reasons.push('empty pattern');
  if (!String(lesson.fix || '').trim()) reasons.push('empty fix');
  return reasons;
}

function listTextFiles(dir, output = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const path = resolve(dir, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) listTextFiles(path, output);
    else if (stats.isFile() && TEXT_EXTS.has(extname(path))) output.push(path);
  }
  return output;
}

function codebaseContains(pattern, files) {
  const needle = String(pattern || '').trim();
  if (!needle) return false;
  return files.some((file) => {
    try {
      return readFileSync(file, 'utf8').includes(needle);
    } catch {
      return false;
    }
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const lessons = readLessons(args.db);
  const files = listTextFiles(ROOT);
  const result = { valid: [], stale: [], invalid: [], orphaned: [] };

  lessons.forEach((lesson, index) => {
    const id = lesson.lessonId || lesson.id || `index-${index}`;
    const reasons = invalidReasons(lesson);
    if (reasons.length > 0) result.invalid.push({ id, reasons });
    else result.valid.push({ id });
    if (expiresSoon(lesson)) result.stale.push({ id, expiry: lesson.expiry });
    if (!codebaseContains(lesson.pattern, files)) result.orphaned.push({ id, pattern: lesson.pattern || '' });
  });

  if (args.outputJson) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.log(`Valid: ${result.valid.length}`);
  console.log(`Stale (expiring soon): ${result.stale.length}`);
  console.log(`Invalid: ${result.invalid.length}`);
  console.log(`Orphaned (no matching pattern in codebase): ${result.orphaned.length}`);
  if (result.invalid.length > 0) {
    for (const item of result.invalid) console.log(`- invalid ${item.id}: ${item.reasons.join(', ')}`);
  }
}

try {
  main();
} catch (error) {
  console.error(`lesson-quality-checker: ${error.message}`);
  process.exitCode = 1;
}
