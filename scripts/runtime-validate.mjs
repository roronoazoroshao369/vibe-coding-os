#!/usr/bin/env node
import { existsSync } from 'node:fs';
import path from 'node:path';
import { createStore, readJson } from '../runtime/core/fs-store.mjs';
import { CURRENT_SCHEMA_VERSION } from '../runtime/core/validation.mjs';
const store = createStore(process.cwd());
const errors = [];
const ROOT = process.cwd();
const expectedKinds = ['tasks', 'memory', 'checkpoints', 'teams', 'sessions'];
const requiredSchemas = [
  'runtime-collection.schema.json',
  'runtime-task.schema.json',
  'runtime-memory.schema.json',
  'runtime-checkpoint.schema.json',
  'runtime-team.schema.json',
  'runtime-session.schema.json'
];

for (const schema of requiredSchemas) {
  if (!existsSync(path.join(ROOT, 'schemas', schema))) errors.push(`missing schemas/${schema}`);
}

if (!existsSync(store.runtimeDir)) {
  console.error('Runtime not initialized. Run: npm run runtime:init -- --force');
  process.exit(1);
}
for (const kind of expectedKinds) {
  const file = `${kind}.json`;
  if (!existsSync(path.join(store.runtimeDir, file))) { errors.push(`missing ${file}`); continue; }
  const data = await readJson(store, file, null);
  if (!data || data.schemaVersion !== CURRENT_SCHEMA_VERSION) errors.push(`${file} schemaVersion must be ${CURRENT_SCHEMA_VERSION}`);
  if (data?.kind !== kind) errors.push(`${file} kind must be ${kind}`);
  if (!Array.isArray(data?.items)) errors.push(`${file} items must be an array`);
}
if (errors.length) { console.error('Runtime validation failed:'); for (const e of errors) console.error(`- ${e}`); process.exit(1); }
console.log('Runtime validation passed.');
