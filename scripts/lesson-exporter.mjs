#!/usr/bin/env node
// lesson-exporter.mjs — export local lessons into the v2.3 lesson exchange format.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_DB = resolve(ROOT, 'skills', 'core', 'lessons-learned-db', 'lessons.json');
const VERSION = '2.3.0';

function parseArgs(argv) {
  const args = { db: DEFAULT_DB, outputDir: ROOT, scope: null, confidence: null, tags: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--scope' && argv[i + 1]) args.scope = argv[++i];
    else if (arg.startsWith('--scope=')) args.scope = arg.slice(8);
    else if (arg === '--confidence' && argv[i + 1]) args.confidence = Number(argv[++i]);
    else if (arg.startsWith('--confidence=')) args.confidence = Number(arg.slice(13));
    else if (arg === '--tags' && argv[i + 1]) args.tags = splitTags(argv[++i]);
    else if (arg.startsWith('--tags=')) args.tags = splitTags(arg.slice(7));
    else if (arg === '--output-dir' && argv[i + 1]) args.outputDir = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--output-dir=')) args.outputDir = resolve(ROOT, arg.slice(13));
    else if (arg === '--db' && argv[i + 1]) args.db = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--db=')) args.db = resolve(ROOT, arg.slice(5));
  }
  return args;
}

function splitTags(value) {
  return String(value).split(',').map((tag) => tag.trim()).filter(Boolean);
}

function readLessons(path) {
  if (!existsSync(path)) throw new Error(`Lesson DB not found: ${path}`);
  const data = JSON.parse(readFileSync(path, 'utf8'));
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.lessons)) return data.lessons;
  throw new Error('Lesson DB must be a JSON array or an object with a lessons array.');
}

function stableRepoId() {
  try {
    return basename(readFileSync(resolve(ROOT, '.git', 'refs', 'heads', 'main'), 'utf8').trim()).slice(0, 12) || basename(ROOT);
  } catch {
    return basename(ROOT);
  }
}

function normalizeLesson(lesson, index) {
  const now = new Date().toISOString();
  return {
    version: String(lesson.version || VERSION),
    lessonId: String(lesson.lessonId || lesson.id || `lesson-${index + 1}`),
    repoId: String(lesson.repoId || stableRepoId()),
    repoName: String(lesson.repoName || basename(ROOT)),
    modelId: String(lesson.modelId || lesson.model || lesson.agent || 'unknown-model'),
    timestamp: String(lesson.timestamp || lesson.date || lesson.createdAt || now),
    lessonType: lesson.lessonType || lesson.type || 'code-pattern',
    pattern: String(lesson.pattern || lesson.preventionRule || lesson.error || '').trim(),
    context: String(lesson.context || lesson.rootCause || lesson.summary || '').trim(),
    fix: String(lesson.fix || lesson.resolution || lesson.prevention || '').trim(),
    tags: Array.isArray(lesson.tags) ? lesson.tags.map(String) : splitTags(lesson.tags || ''),
    confidence: Number.isFinite(Number(lesson.confidence)) ? Number(lesson.confidence) : 0.5,
    scope: lesson.scope || 'repo',
    source: lesson.source || 'user',
    expiry: lesson.expiry === undefined ? null : lesson.expiry,
    crossRepoVerified: Boolean(lesson.crossRepoVerified)
  };
}

function matchesFilters(lesson, args) {
  if (args.scope && lesson.scope !== args.scope) return false;
  if (args.confidence !== null && !(lesson.confidence > args.confidence)) return false;
  if (args.tags.length > 0 && !args.tags.every((tag) => lesson.tags.includes(tag))) return false;
  return true;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const lessons = readLessons(args.db).map(normalizeLesson).filter((lesson) => matchesFilters(lesson, args));
  mkdirSync(args.outputDir, { recursive: true });
  const exportedAt = new Date().toISOString();
  const outputPath = resolve(args.outputDir, `${basename(ROOT)}-${exportedAt.replace(/[:.]/g, '-')}.lesson-exchange.json`);
  const batch = { version: VERSION, exportedAt, exportedBy: 'lesson-exporter', lessons };
  writeFileSync(outputPath, `${JSON.stringify(batch, null, 2)}\n`);
  console.log(`Exported ${lessons.length} lesson(s) to ${outputPath}`);
}

try {
  main();
} catch (error) {
  console.error(`lesson-exporter: ${error.message}`);
  process.exitCode = 1;
}
