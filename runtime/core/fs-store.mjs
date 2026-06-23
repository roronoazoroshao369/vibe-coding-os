import { mkdir, readFile, writeFile, rename, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { CURRENT_SCHEMA_VERSION } from './validation.mjs';
import { Enforcement, applyItemDefaults } from './enforcement.mjs';

const ALLOWED_COLLECTION_KEYS = [
  'schemaVersion', 'kind', 'items', 'contractVersion',
  'runtimeId', 'revision', 'metadata', 'extensions',
];

export function createStore(root = process.cwd()) {
  const runtimeDir = path.join(root, '.omc', 'runtime');
  return { root, runtimeDir };
}

export function filePath(store, name) {
  return path.join(store.runtimeDir, name);
}

export async function ensureRuntime(store) {
  await mkdir(store.runtimeDir, { recursive: true });
  await mkdir(path.join(store.runtimeDir, 'locks'), { recursive: true });
}

export async function readJson(store, name, fallback) {
  const file = filePath(store, name);
  if (!existsSync(file)) return fallback;
  return JSON.parse(await readFile(file, 'utf8'));
}

export async function writeJsonAtomic(store, name, value, options = {}) {
  await ensureRuntime(store);
  const file = filePath(store, name);
  await mkdir(path.dirname(file), { recursive: true });

  // Auto-populate defaults for items in a collection
  if (value && typeof value === 'object' && Array.isArray(value.items)) {
    for (const item of value.items) {
      applyItemDefaults(item, {
        source: options.source || 'runtime-store',
        createdBy: options.createdBy,
      });
    }

    // Enforce strict collection schema (reject unknown top-level keys)
    if (options.enforcement) {
      options.enforcement.assertStrictCollection(value, ALLOWED_COLLECTION_KEYS);
    }

    // Validate each persisted item when an item schema is configured.
    if (options.enforcement && options.itemSchema) {
      value.items.forEach((item, index) => {
        options.enforcement.assertValidItem(item, options.itemSchema, `${name} item[${index}]`);
      });
    }
  }

  // Validate collection against its schema if enforcement is provided
  if (options.enforcement && options.collectionSchema) {
    options.enforcement.assertValidItem(value, options.collectionSchema, `collection ${name}`);
  }

  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(tmp, file);
}

export async function withLock(store, name, fn, options = {}) {
  await ensureRuntime(store);
  const lock = path.join(store.runtimeDir, 'locks', `${name}.lock`);
  const timeoutMs = options.timeoutMs ?? 5000;
  const retryMs = options.retryMs ?? 25;
  const staleMs = options.staleMs ?? 60000; // 60 seconds — default
  const start = Date.now();

  // eslint-disable-next-line no-constant-condition -- intentional retry loop with break
  while (true) {
    // Pre-check: if an existing lock file is stale (older than staleMs), it's a
    // leftover from a killed process. Steal it instead of waiting.
    try {
      const existingStat = await stat(lock);
      const lockAge = Date.now() - existingStat.mtimeMs;
      if (lockAge > staleMs) {
        // Lock is stale — try to remove it and retry. If another process raced
        // us, the rm will fail silently (force:true) and we'll wait a cycle.
        await rm(lock, { force: true });
      }
    } catch { /* lock doesn't exist yet — proceed to acquire */ }

    try {
      await writeFile(lock, String(process.pid), { flag: 'wx' });
      break;
    } catch (err) {
      if (Date.now() - start >= timeoutMs) {
        throw new Error(
          `Runtime store is locked: ${name}. ` +
          `If no other process is running, delete ${lock} manually.`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, retryMs));
    }
  }

  try {
    return await fn();
  } finally {
    await rm(lock, { force: true });
  }
}

export function emptyCollection(kind) {
  return { schemaVersion: CURRENT_SCHEMA_VERSION, kind, items: [] };
}

/** Create a default Enforcement instance (no schema validator attached). */
export function createEnforcement(schemaValidator = null) {
  return new Enforcement(schemaValidator);
}

export { Enforcement, applyItemDefaults, generateTrace, DEFAULT_CREATED_BY } from './enforcement.mjs';
