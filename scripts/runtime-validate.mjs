#!/usr/bin/env node
/**
 * runtime-validate.mjs — Validate .omc/runtime collections against their schemas
 *
 * Uses the built-in schema-validator.mjs for zero-dependency JSON Schema
 * validation. Validates each collection file against runtime-collection.schema.json
 * which dispatches per-kind item validation via if/then/$ref.
 *
 * Supports both schemaVersion 1 (lightweight) and 2 (full strict) items
 * during migration from v1.2.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStore } from '../runtime/core/fs-store.mjs';
import { CURRENT_SCHEMA_VERSION, CONTRACT_VERSION } from '../runtime/core/validation.mjs';
import { loadSchemas, validate } from './schema-validator.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const store = createStore(process.cwd());
const ROOT = path.resolve(__dirname, '..');
const errors = [];
const expectedKinds = ['tasks', 'memory', 'checkpoints', 'teams', 'sessions', 'workflow-runs', 'actions'];
const requiredSchemas = [
  'runtime-collection.schema.json',
  'runtime-task.schema.json',
  'runtime-memory.schema.json',
  'runtime-checkpoint.schema.json',
  'runtime-team.schema.json',
  'runtime-session.schema.json',
  'runtime-action.schema.json',
  'workflow-run.schema.json',
];

const acceptedSchemaVersions = [CURRENT_SCHEMA_VERSION, CURRENT_SCHEMA_VERSION - 1];

// Check schema files exist
for (const schema of requiredSchemas) {
  if (!existsSync(path.join(ROOT, 'schemas', schema))) errors.push(`missing schemas/${schema}`);
}

if (!existsSync(store.runtimeDir)) {
  console.error('Runtime not initialized. Run: npm run runtime:init -- --force');
  process.exit(1);
}

// Load all schemas
let schemas;
try {
  schemas = await loadSchemas(path.join(ROOT, 'schemas'));
} catch (e) {
  errors.push(`Failed to load schemas: ${e.message}`);
  console.error('Runtime validation failed:');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

const collectionSchema = schemas.get('runtime-collection.schema.json');
if (!collectionSchema) errors.push('runtime-collection.schema.json not loaded');

function collectionWrapperSchema(schema) {
  if (!schema || typeof schema !== 'object') return schema;
  const wrapper = { ...schema };
  delete wrapper.allOf;
  return wrapper;
}

/**
 * Strip additionalProperties from a schema (and nested schemas) to create
 * a lightweight validation mode for legacy v1 items.
 */
function stripAdditionalProperties(schema) {
  if (!schema || typeof schema !== 'object') return schema;
  const patched = Array.isArray(schema) ? [...schema] : { ...schema };
  if ('additionalProperties' in patched && patched.additionalProperties === false) {
    delete patched.additionalProperties;
  }
  for (const key of Object.keys(patched)) {
    if (typeof patched[key] === 'object' && patched[key] !== null) {
      patched[key] = stripAdditionalProperties(patched[key]);
    }
  }
  return patched;
}

for (const kind of expectedKinds) {
  const file = `${kind}.json`;
  const fullPath = path.join(store.runtimeDir, file);
  if (!existsSync(fullPath)) { errors.push(`missing ${file}`); continue; }

  let data;
  try {
    data = JSON.parse(readFileSync(fullPath, 'utf8'));
  } catch (e) {
    errors.push(`${file}: invalid JSON — ${e.message}`);
    continue;
  }

  // Basic structural checks — accept both v1 and v2
  if (!data || !acceptedSchemaVersions.includes(data.schemaVersion)) {
    errors.push(`${file}: schemaVersion must be one of [${acceptedSchemaVersions.join(', ')}]`);
    continue;
  }
  if (data.kind !== kind) { errors.push(`${file}: kind must be ${kind}`); continue; }
  if (!Array.isArray(data?.items)) { errors.push(`${file}: items must be an array`); continue; }

  // Validate the collection wrapper against schema
  const collectionResult = validate(data, collectionSchema, schemas);
  for (const e of collectionResult.errors) errors.push(`${file}: ${e}`);

  // Validate each item against the per-kind schema directly
  const itemSchemaKey = {
    tasks: 'runtime-task.schema.json',
    memory: 'runtime-memory.schema.json',
    checkpoints: 'runtime-checkpoint.schema.json',
    teams: 'runtime-team.schema.json',
    sessions: 'runtime-session.schema.json',
    actions: 'runtime-action.schema.json',
    'workflow-runs': 'workflow-run.schema.json',
  }[kind];

  const itemSchema = schemas.get(itemSchemaKey);
  if (itemSchema && data.items.length > 0) {
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const itemVersion = item.schemaVersion || data.schemaVersion;

      let effectiveSchema;
      if (itemVersion === CURRENT_SCHEMA_VERSION) {
        // v2 items: full strict validation (additionalProperties enforced)
        effectiveSchema = itemSchema;
      } else {
        // v1 items: lightweight validation (skip additionalProperties checks)
        effectiveSchema = stripAdditionalProperties(itemSchema);
      }

      const itemResult = validate(item, effectiveSchema, schemas, `${file}.items[${i}]`);
      for (const e of itemResult.errors) errors.push(e);
    }
  }
}

if (errors.length) {
  console.error('Runtime validation failed:');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log(`✅ Runtime validation passed. (schema v${CURRENT_SCHEMA_VERSION}, contract ${CONTRACT_VERSION})`);
