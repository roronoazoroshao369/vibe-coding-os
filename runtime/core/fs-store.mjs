import { mkdir, readFile, writeFile, rename, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { CURRENT_SCHEMA_VERSION } from './validation.mjs';

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

export async function writeJsonAtomic(store, name, value) {
  await ensureRuntime(store);
  const file = filePath(store, name);
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(tmp, file);
}

export async function withLock(store, name, fn) {
  await ensureRuntime(store);
  const lock = path.join(store.runtimeDir, 'locks', `${name}.lock`);
  try {
    await writeFile(lock, String(process.pid), { flag: 'wx' });
  } catch {
    throw new Error(`Runtime store is locked: ${name}`);
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
