#!/usr/bin/env node
/**
 * validate-schemas.mjs — Stable registry schema validation for Vibe Coding OS
 *
 * No external dependencies. Validates:
 *   1. Schema files themselves are valid JSON
 *   2. references/index.json against reference-index.schema.json
 *   3. SKILL.md files have a # Name heading and ## Purpose section
 *   4. Command .md files exist and have non-empty body content
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSchemas, validate } from './schema-validator.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iso = '2026-01-01T00:00:00.000Z';
const sampleItems = {
  tasks: { id: 'task-1', title: 'Sample task', status: 'pending', createdAt: iso },
  memory: { id: 'mem-1', content: 'Sample memory', scope: 'repo', createdAt: iso, sensitivity: 'internal', confidence: 'high' },
  checkpoints: { id: 'chk-1', type: 'gate', result: 'passed', phase: 'plan', status: 'passed', createdAt: iso },
  teams: { id: 'team-1', name: 'Sample team', roles: [{ name: 'implementer', purpose: 'Build', owned_paths: ['scripts/'], tools: ['node'], validation: 'npm run validate', handoff_fields: ['summary'] }] },
  sessions: { id: 'session-1', goal: 'test', createdAt: iso },
  'workflow-runs': { id: 'wf-1', status: 'pending', history: [{ event: 'init', timestamp: iso }] },
  actions: { id: 'act-1', tool: 'terminal', timestamp: iso, risk_level: 'safe' }
};

const ROOT = path.resolve(__dirname, '..');

const errors = [];
const warnings = [];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function readJson(file) {
  const text = await readFile(file, 'utf8');
  return JSON.parse(text);
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

// ---------------------------------------------------------------------------
// 1. Validate schema files are valid JSON
// ---------------------------------------------------------------------------

async function validateSchemaFiles() {
  const schemaDir = path.join(ROOT, 'schemas');
  if (!existsSync(schemaDir)) {
    errors.push('schemas/ directory does not exist');
    return [];
  }

  const entries = await readdir(schemaDir);
  const schemaFiles = entries
    .filter((f) => f.endsWith('.schema.json'))
    .map((f) => path.join(schemaDir, f));

  for (const sf of schemaFiles) {
    try {
      const parsed = await readJson(sf);
      // Basic structural check: must have $schema and type
      if (!isNonEmptyString(parsed.$schema)) {
        warnings.push(`${path.basename(sf)}: missing $schema field`);
      }
      if (parsed.type !== 'object') {
        warnings.push(`${path.basename(sf)}: top-level type should be 'object' (got '${parsed.type}')`);
      }
      if (typeof parsed.title !== 'string' || parsed.title.trim() === '') {
        warnings.push(`${path.basename(sf)}: missing or empty title`);
      }
    } catch (err) {
      errors.push(`Schema file ${path.basename(sf)} is not valid JSON: ${err.message}`);
    }
  }

  return schemaFiles;
}

// ---------------------------------------------------------------------------
// 2. Validate references/index.json against reference-index schema
// ---------------------------------------------------------------------------

async function validateReferenceIndex() {
  const indexFile = path.join(ROOT, 'references', 'index.json');
  if (!existsSync(indexFile)) {
    errors.push('references/index.json not found');
    return;
  }

  let index;
  try {
    index = await readJson(indexFile);
  } catch (err) {
    errors.push(`references/index.json is not valid JSON: ${err.message}`);
    return;
  }

  // Structural validation derived from the reference-index schema contract
  // (pragmatic field-level checks without requiring a full JSON Schema engine)

  // Top-level required fields
  if (!isNonEmptyString(index.version)) {
    errors.push('references/index.json: missing or empty "version"');
  }
  if (!isNonEmptyString(index.last_built)) {
    errors.push('references/index.json: missing or empty "last_built"');
  }
  if (!Array.isArray(index.sources)) {
    errors.push('references/index.json: "sources" must be an array');
    return;
  }

  // Dedup check
  const seenIds = new Set();
  for (let i = 0; i < index.sources.length; i++) {
    const s = index.sources[i];
    const label = s?.id || `source[${i}]`;

    if (typeof s !== 'object' || s === null) {
      errors.push(`references/index.json: ${label} is not an object`);
      continue;
    }

    // Required fields per schema
    const requiredFields = ['id', 'name', 'owner', 'url', 'category', 'status', 'import_mode', 'license', 'reference_doc', 'changelog'];
    for (const f of requiredFields) {
      if (!isNonEmptyString(s[f])) {
        errors.push(`references/index.json: ${label} missing or empty "${f}"`);
      }
    }

    // Enum validation
    const validImportModes = new Set(['none', 'inspiration', 'adapted', 'vendored']);
    if (s.import_mode && !validImportModes.has(s.import_mode)) {
      errors.push(`references/index.json: ${label} invalid import_mode "${s.import_mode}"`);
    }
    const validStatuses = new Set(['tracked', 'candidate', 'archived', 'blocked']);
    if (s.status && !validStatuses.has(s.status)) {
      errors.push(`references/index.json: ${label} invalid status "${s.status}"`);
    }

    // Dedup
    if (s.id) {
      if (seenIds.has(s.id)) {
        errors.push(`references/index.json: duplicate source id "${s.id}"`);
      }
      seenIds.add(s.id);
    }

    // Check local_targets exist
    if (s.local_targets !== undefined) {
      if (!Array.isArray(s.local_targets)) {
        errors.push(`references/index.json: ${label} local_targets must be an array`);
      } else {
        for (const t of s.local_targets) {
          if (!isNonEmptyString(t)) {
            errors.push(`references/index.json: ${label} has invalid local_target entry`);
          } else if (!existsSync(path.join(ROOT, t))) {
            errors.push(`references/index.json: ${label} local_target does not exist: ${t}`);
          }
        }
      }
    }

    // Check reference_doc and changelog exist
    if (s.reference_doc) {
      const refPath = path.join(ROOT, s.reference_doc);
      if (!existsSync(refPath)) {
        errors.push(`references/index.json: ${label} reference_doc not found: ${s.reference_doc}`);
      }
    }
    if (s.changelog) {
      const clPath = path.join(ROOT, s.changelog);
      if (!existsSync(clPath)) {
        errors.push(`references/index.json: ${label} changelog not found: ${s.changelog}`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Validate skills have # Name + ## Purpose
// ---------------------------------------------------------------------------

async function validateSkills() {
  const skillsBase = path.join(ROOT, 'skills');
  if (!existsSync(skillsBase)) {
    errors.push('skills/ directory not found');
    return;
  }

  async function walkSkills(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Check for SKILL.md in this directory
        const skillFile = path.join(fullPath, 'SKILL.md');
        if (existsSync(skillFile)) {
          const content = await readFile(skillFile, 'utf8');
          // Check for # Name heading (first line or first `# ` heading)
          const lines = content.split('\n');
          let hasNameHeading = false;
          let hasPurpose = false;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('# ') && !line.startsWith('## ') && !hasNameHeading) {
              hasNameHeading = true;
            }
            if (line === '## Purpose' || line.startsWith('## Purpose ')) {
              hasPurpose = true;
              // Check there's some content after the purpose heading
              let hasContent = false;
              for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
                if (lines[j].trim().startsWith('#')) break;
                if (lines[j].trim().length > 0) {
                  hasContent = true;
                  break;
                }
              }
              if (!hasContent) {
                warnings.push(`${skillFile}: ## Purpose section is empty or only blank lines`);
              }
            }
          }

          if (!hasNameHeading) {
            errors.push(`${skillFile}: missing # Name heading`);
          }
          if (!hasPurpose) {
            errors.push(`${skillFile}: missing ## Purpose section`);
          }
        } else {
          // Recurse into subdirectories
          await walkSkills(fullPath);
        }
      }
    }
  }

  await walkSkills(skillsBase);
}

// ---------------------------------------------------------------------------
// 4. Validate commands exist and have content
// ---------------------------------------------------------------------------

async function validateCommands() {
  const commandsDir = path.join(ROOT, 'commands');
  if (!existsSync(commandsDir)) {
    errors.push('commands/ directory not found');
    return;
  }

  const entries = await readdir(commandsDir);
  const mdFiles = entries.filter((f) => f.endsWith('.md')).sort();

  if (mdFiles.length === 0) {
    errors.push('commands/: no markdown files found');
    return;
  }

  for (const f of mdFiles) {
    const fullPath = path.join(commandsDir, f);
    let content;
    try {
      content = await readFile(fullPath, 'utf8');
    } catch {
      errors.push(`commands/${f}: could not read file`);
      continue;
    }

    // Strip optional YAML front matter
    const bodyMatch = content.match(/^---[\s\S]*?---\s*\n?([\s\S]*)$/);
    const body = bodyMatch ? bodyMatch[1].trim() : content.trim();

    if (body.length === 0) {
      errors.push(`commands/${f}: file exists but has no body content`);
    }

    // Check for at least one heading
    if (!content.match(/^#{1,6}\s/m)) {
      warnings.push(`commands/${f}: no markdown headings found`);
    }
  }
}

// ---------------------------------------------------------------------------
// 5. Validate runtime schemas have consistent shape
// ---------------------------------------------------------------------------
async function validateRuntimeSchemas() {
  const schemaDir = path.join(ROOT, 'schemas');
  const entries = await readdir(schemaDir);
  const runtimeSchemas = entries.filter((f) => (f.startsWith('runtime-') || f === 'workflow-run.schema.json') && f.endsWith('.schema.json'));
  for (const f of runtimeSchemas) {
    const fullPath = path.join(schemaDir, f);
    try {
      const parsed = await readJson(fullPath);
      if (!isNonEmptyString(parsed.$id)) warnings.push(`${f}: missing $id`);
      if (typeof parsed.description !== 'string' || parsed.description.trim() === '') warnings.push(`${f}: missing or empty description`);
      if (!Array.isArray(parsed.required)) warnings.push(`${f}: missing required array`);
    } catch (err) {
      errors.push(`Runtime schema ${f} is not valid JSON: ${err.message}`);
    }
  }
}

async function validateSampleInstances() {
  const schemas = await loadSchemas(path.join(ROOT, 'schemas'));
  const collSchema = schemas.get('runtime-collection.schema.json');
  for (const [kind, sample] of Object.entries(sampleItems)) {
    const itemSchemaKey = { tasks: 'runtime-task.schema.json', memory: 'runtime-memory.schema.json', checkpoints: 'runtime-checkpoint.schema.json', teams: 'runtime-team.schema.json', sessions: 'runtime-session.schema.json', 'workflow-runs': 'workflow-run.schema.json' }[kind];
    const itemResult = validate(sample, schemas.get(itemSchemaKey), schemas, `sample.${kind}`);
    for (const e of itemResult.errors) errors.push(e);
    const collResult = validate({ schemaVersion: 1, kind, items: [sample] }, collSchema, schemas, `sample.collection.${kind}`);
    for (const e of collResult.errors) errors.push(e);
  }
  const invalidSamples = [
    { label: 'task empty id', schema: 'runtime-task.schema.json', data: { id: '', title: 't', status: 'pending' } },
    { label: 'task bad status', schema: 'runtime-task.schema.json', data: { id: 't2', title: 't', status: 'bogus' } },
    { label: 'memory missing content', schema: 'runtime-memory.schema.json', data: { id: 'm2', scope: 'repo', createdAt: iso } },
    { label: 'workflow bad status', schema: 'workflow-run.schema.json', data: { id: 'wf2', status: 'bogus', history: [] } }
  ];
  for (const sample of invalidSamples) {
    const result = validate(sample.data, schemas.get(sample.schema), schemas, `invalid.${sample.label}`);
    if (result.valid) errors.push(`invalid sample passed unexpectedly: ${sample.label}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const schemaFiles = await validateSchemaFiles();
await validateReferenceIndex();
await validateSkills();
await validateCommands();
await validateRuntimeSchemas();
await validateSampleInstances();

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

if (errors.length > 0) {
  console.error('❌ Schema validation failed:');
  for (const err of errors) console.error(`  - ${err}`);
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    for (const w of warnings) console.log(`  - ${w}`);
  }
  process.exit(1);
}

console.log('✅ Schema validation passed.');
if (warnings.length > 0) {
  console.log(`⚠️  ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  - ${w}`);
}
if (schemaFiles.length > 0) {
  console.log(`Checked ${schemaFiles.length} schema file(s).`);
}
console.log('Checked references/index.json, skills/*/SKILL.md files, and commands/*.md files.');
