export const CURRENT_SCHEMA_VERSION = 2;
export const CONTRACT_VERSION = '1.2.0';
export const RUNTIME_ID_PREFIX = 'rt_';

export function assertSchemaVersion(record, label) {
  if (!record || record.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    throw new Error(`${label} schemaVersion must be ${CURRENT_SCHEMA_VERSION}`);
  }
}

export function assertString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${label} is required`);
}

export function assertArray(value, label) {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
}
