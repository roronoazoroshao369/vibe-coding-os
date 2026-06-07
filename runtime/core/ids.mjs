import { randomUUID } from 'node:crypto';

export function makeId(prefix = 'id') {
  return `${prefix}_${randomUUID().replaceAll('-', '').slice(0, 16)}`;
}

export function nowIso() {
  return new Date().toISOString();
}
