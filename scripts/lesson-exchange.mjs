#!/usr/bin/env node
/**
 * lesson-exchange.mjs — v2.3 Multi-Repo Learning CLI
 *
 * Export lessons from templates/lesson-entry-template.md as exchange JSON,
 * or import exchange JSON (validated against lesson-exchange-schema.json)
 * into docs/lessons/imported-lessons.md.
 *
 * Usage:
 *   node scripts/lesson-exchange.mjs --export --output <file.json> [--dry-run]
 *   node scripts/lesson-exchange.mjs --import --input <file.json> [--output <file.md>] [--dry-run]
 *
 * No external dependencies.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SCHEMA_PATH = resolve(ROOT, 'schemas', 'lesson-exchange-schema.json');
const DEFAULT_OUTPUT_MD = resolve(ROOT, 'docs', 'lessons', 'imported-lessons.md');
const TEMPLATE_MD_PATH = resolve(ROOT, 'templates', 'lesson-entry-template.md');

// ── Argument parsing ──────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {
    mode: null,        // 'export' | 'import'
    input: null,
    output: null,
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--export') args.mode = 'export';
    else if (a === '--import') args.mode = 'import';
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--input' && argv[i + 1]) args.input = resolve(ROOT, argv[++i]);
    else if (a.startsWith('--input=')) args.input = resolve(ROOT, a.slice(8));
    else if (a === '--output' && argv[i + 1]) args.output = resolve(ROOT, argv[++i]);
    else if (a.startsWith('--output=')) args.output = resolve(ROOT, a.slice(9));
    else if (a === '--help' || a === '-h') { printHelp(); process.exit(0); }
  }
  return args;
}

function printHelp() {
  console.log(`
lesson-exchange.mjs — v2.3 Multi-Repo Learning CLI

Export:
  node scripts/lesson-exchange.mjs --export [--output out.json] [--dry-run]

Import:
  node scripts/lesson-exchange.mjs --import --input lessons.json [--output imported.md] [--dry-run]

Options:
  --export         Export lessons from templates/lesson-entry-template.md as exchange JSON
  --import         Import exchange JSON, validate against schema, write markdown
  --input <path>   Source file (for import: JSON exchange file; for export: optional template)
  --output <path>  Destination file
  --dry-run        Validate only; do not write any files
  --help           Show this help
`);
}

// ── Schema validator ──────────────────────────────────────────────────────────

function loadSchema() {
  if (!existsSync(SCHEMA_PATH)) {
    throw new Error(`Schema not found: ${SCHEMA_PATH}`);
  }
  return JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'));
}

function validateLesson(lesson, index) {
  const at = `lesson[${index}]`;
  const errs = [];

  if (!lesson || typeof lesson !== 'object') {
    errs.push(`${at}: expected object`);
    return errs;
  }

  const schema = loadSchema();
  const required = schema.required || [];
  for (const field of required) {
    if (lesson[field] === undefined || lesson[field] === null || lesson[field] === '') {
      errs.push(`${at}: missing required field "${field}"`);
    }
  }

  // Type / constraint checks
  if (lesson.lesson_id !== undefined && typeof lesson.lesson_id !== 'string') errs.push(`${at}.lesson_id: expected string`);
  if (lesson.source_repo !== undefined && typeof lesson.source_repo !== 'string') errs.push(`${at}.source_repo: expected string`);
  if (lesson.timestamp !== undefined && Number.isNaN(Date.parse(lesson.timestamp))) errs.push(`${at}.timestamp: invalid date-time`);
  if (lesson.severity !== undefined && !['low', 'medium', 'high', 'critical'].includes(lesson.severity)) {
    errs.push(`${at}.severity: must be one of low, medium, high, critical`);
  }
  if (lesson.privacy_level !== undefined && !['public', 'internal', 'restricted', 'private'].includes(lesson.privacy_level)) {
    errs.push(`${at}.privacy_level: must be one of public, internal, restricted, private`);
  }
  if (lesson.tags !== undefined) {
    if (!Array.isArray(lesson.tags)) {
      errs.push(`${at}.tags: expected array`);
    } else if (lesson.tags.length === 0) {
      errs.push(`${at}.tags: must have at least one tag`);
    } else {
      const seen = new Set();
      for (let i = 0; i < lesson.tags.length; i++) {
        const t = lesson.tags[i];
        if (typeof t !== 'string' || !/^[a-z0-9][a-z0-9._-]{0,63}$/.test(t)) {
          errs.push(`${at}.tags[${i}]: invalid tag "${t}"`);
        }
        if (seen.has(t)) errs.push(`${at}.tags: duplicate tag "${t}"`);
        seen.add(t);
      }
    }
  }

  return errs;
}

function validateBatch(data) {
  const errs = [];
  const looksLikeSingleLesson = data && typeof data === 'object' && !Array.isArray(data) && data.lesson_id;
  const lessons = Array.isArray(data) ? data : (Array.isArray(data.lessons) ? data.lessons : (looksLikeSingleLesson ? [data] : null));
  if (!lessons) {
    errs.push('Exchange data must be a JSON lesson object, a JSON array, or an object with a "lessons" array.');
    return errs;
  }
  for (let i = 0; i < lessons.length; i++) {
    errs.push(...validateLesson(lessons[i], i));
  }
  return errs;
}

// ── Export ─────────────────────────────────────────────────────────────────────

function parseTemplateToLesson(content) {
  // Extract YAML front-matter fields
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?/);
  const fm = {};
  if (fmMatch) {
    for (const line of fmMatch[1].split('\n')) {
      const sep = line.indexOf(':');
      if (sep > 0) {
        const key = line.slice(0, sep).trim();
        const val = line.slice(sep + 1).trim();
        fm[key] = val;
      }
    }
  }

  // Extract lesson title from first # heading
  const titleMatch = content.match(/^# Lesson:\s*(.+)$/m);
  const lessonTitle = titleMatch ? titleMatch[1].trim() : 'Untitled Lesson';

  // Extract root cause section
  const rootCauseMatch = content.match(/## Root cause\n\n([\s\S]*?)(?=\n##|\n$)/);
  const rootCause = rootCauseMatch ? rootCauseMatch[1].trim() : '';

  // Extract fix section
  const fixMatch = content.match(/## Fix\n\n([\s\S]*?)(?=\n##|\n$)/);
  const fix = fixMatch ? fixMatch[1].trim() : '';

  // Extract prevention rule section
  const prevMatch = content.match(/## Prevention rule\n\n([\s\S]*?)(?=\n##|\n$)/);
  const preventionRule = prevMatch ? prevMatch[1].trim() : '';

  // Determine severity from front matter
  const rawSeverity = (fm.severity || 'medium').toLowerCase();
  const severity = ['low', 'medium', 'high', 'critical'].includes(rawSeverity) ? rawSeverity : 'medium';

  // Determine area from front matter
  const rawArea = fm.area || 'general';
  const area = rawArea.includes('|') ? rawArea.split('|')[0].trim() : rawArea;

  // Extract model/agent from front matter
  const modelFromFm = fm.model || '';

  return {
    lesson_id: `lesson-export-${Date.now().toString(36)}`,
    source_repo: 'vibe-coding-os',
    timestamp: new Date().toISOString(),
    area,
    severity,
    root_cause: rootCause || 'Root cause not specified.',
    fix_pattern: fix || 'Fix not specified.',
    prevention_rule: preventionRule || 'Prevention rule not specified.',
    tags: [area.toLowerCase().replace(/[^a-z0-9.-]/g, '-').replace(/^-+|-+$/g, '').slice(0, 64) || 'general', severity],
    privacy_level: 'public',
  };
}

function doExport(args) {
  const templatePath = args.input || TEMPLATE_MD_PATH;
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  const content = readFileSync(templatePath, 'utf8');
  const lesson = parseTemplateToLesson(content);

  const batch = {
    schema: 'lesson-exchange-schema.json',
    exported_at: new Date().toISOString(),
    exported_by: 'lesson-exchange.mjs --export',
    lessons: [lesson],
  };

  // Validate before writing
  const errs = validateBatch(batch);
  if (errs.length > 0) {
    console.error('Export validation errors:');
    for (const e of errs) console.error(`  - ${e}`);
    process.exitCode = 1;
    return;
  }

  const outputPath = args.output || resolve(ROOT, 'docs/lessons/exchange-export.json');

  if (!args.dryRun) {
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, JSON.stringify(batch, null, 2) + '\n');
    console.log(`Exported 1 lesson to ${outputPath}`);
  } else {
    console.log(`[DRY RUN] Would export 1 lesson to ${outputPath}`);
  }
}

// ── Import ─────────────────────────────────────────────────────────────────────

function lessonToMarkdown(lesson) {
  const lines = [];
  lines.push(`---`);
  lines.push(`lesson_id: ${lesson.lesson_id}`);
  lines.push(`source_repo: ${lesson.source_repo}`);
  lines.push(`timestamp: ${lesson.timestamp}`);
  lines.push(`area: ${lesson.area}`);
  lines.push(`severity: ${lesson.severity}`);
  lines.push(`privacy_level: ${lesson.privacy_level}`);
  lines.push(`tags: ${(lesson.tags || []).join(', ')}`);
  lines.push(`---`);
  lines.push('');
  lines.push(`# Lesson: ${lesson.lesson_id}`);
  lines.push('');
  lines.push('## Root Cause');
  lines.push('');
  lines.push(lesson.root_cause);
  lines.push('');
  lines.push('## Fix Pattern');
  lines.push('');
  lines.push(lesson.fix_pattern);
  lines.push('');
  lines.push('## Prevention Rule');
  lines.push('');
  lines.push(lesson.prevention_rule);
  lines.push('');
  lines.push('## Privacy Check');
  lines.push('');
  lines.push('- [ ] No secrets, credentials, or tokens are present.');
  lines.push('- [ ] No private user data, internal hostnames, or private URLs are present.');
  lines.push('- [ ] Raw logs, if referenced, have been summarized and stripped of sensitive values.');
  lines.push('');
  lines.push('---');
  lines.push('');
  return lines.join('\n');
}

function doImport(args) {
  if (!args.input) {
    throw new Error('Usage: node scripts/lesson-exchange.mjs --import --input <file.json>');
  }
  if (!existsSync(args.input)) {
    throw new Error(`Input file not found: ${args.input}`);
  }

  const raw = readFileSync(args.input, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON: ${e.message}`);
  }

  const errs = validateBatch(data);
  if (errs.length > 0) {
    console.error('Schema validation failed:');
    for (const e of errs) console.error(`  - ${e}`);
    process.exitCode = 1;
    return;
  }

  const lessons = Array.isArray(data) ? data : (Array.isArray(data.lessons) ? data.lessons : [data]);
  console.log(`Validated ${lessons.length} lesson(s).`);

  const outputPath = args.output || DEFAULT_OUTPUT_MD;

  if (!args.dryRun) {
    const mdContent = lessons.map(lessonToMarkdown).join('\n');
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, mdContent + '\n');
    console.log(`Imported ${lessons.length} lesson(s) to ${outputPath}`);
  } else {
    console.log(`[DRY RUN] Would import ${lessons.length} lesson(s) to ${outputPath}`);
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.mode) {
    console.error('Specify --export or --import. Use --help for details.');
    process.exitCode = 1;
    return;
  }

  if (args.mode === 'export') {
    doExport(args);
  } else if (args.mode === 'import') {
    doImport(args);
  }
}

try {
  main();
} catch (error) {
  console.error(`lesson-exchange: ${error.message}`);
  process.exitCode = 1;
}
