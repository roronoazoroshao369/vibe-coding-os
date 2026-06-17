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

// ---------------------------------------------------------------------------
// Minimal JSON Schema validator (built-in, zero external dependencies)
//
// This is intentionally narrow: it validates the subset of JSON Schema
// actually used by the runtime store schemas (required, type, enum,
// additionalProperties, properties, items, $ref within the same schema map).
// Full spec compliance is out of scope for the optional runtime layer.
// ---------------------------------------------------------------------------

function resolveRef(ref, schemaMap) {
  if (typeof ref !== 'string') return ref;
  const [filename, pointer] = ref.split('#');
  const key = filename || '';
  const base = schemaMap[key];
  if (!base) return null;

  if (!pointer) return base;

  const segments = pointer.replace(/^\//, '').split('/');
  let current = base;
  for (const segment of segments) {
    if (!current || typeof current !== 'object') return null;
    current = current[segment];
  }
  return current ?? null;
}

function resolveSchema(schema, schemaMap) {
  if (!schema || typeof schema !== 'object') return schema;
  if (schema.$ref) return resolveRef(schema.$ref, schemaMap) ?? schema;
  return schema;
}

function getActualType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  const raw = typeof value;
  if (raw === 'number' && Number.isInteger(value)) return 'integer';
  return raw;
}

function validateInstance(instance, rawSchema, schemaMap, path, errors) {
  const schema = resolveSchema(rawSchema, schemaMap);
  if (!schema || typeof schema !== 'object') return;

  // type check
  if (schema.type !== undefined) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actual = getActualType(instance);
    if (!types.includes(actual)) {
      errors.push(`${path || 'value'}: expected type ${types.join('|')} but got ${actual}`);
      return; // no point checking further when type is wrong
    }
  }

  // enum check
  if (schema.enum && !schema.enum.includes(instance)) {
    errors.push(`${path || 'value'}: value not in allowed enum: ${JSON.stringify(schema.enum)}`);
    return;
  }

  // required properties (on objects)
  if (instance && typeof instance === 'object' && !Array.isArray(instance) && Array.isArray(schema.required)) {
    for (const field of schema.required) {
      if (instance[field] === undefined || instance[field] === null) {
        errors.push(`${path || 'object'}: missing required field "${field}"`);
      }
    }
  }

  // additionalProperties: false (on objects)
  if (instance && typeof instance === 'object' && !Array.isArray(instance) && schema.additionalProperties === false && schema.properties) {
    const allowed = new Set(Object.keys(schema.properties));
    const extra = Object.keys(instance).filter(k => !allowed.has(k));
    if (extra.length > 0) {
      errors.push(`${path || 'object'}: unexpected fields: ${extra.join(', ')}`);
    }
  }

  // nested properties
  if (instance && typeof instance === 'object' && !Array.isArray(instance) && schema.properties) {
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (instance[key] !== undefined) {
        validateInstance(instance[key], propSchema, schemaMap, `${path ? `${path}.` : ''}${key}`, errors);
      }
    }
  }

  // array items
  if (Array.isArray(instance) && schema.items) {
    for (let i = 0; i < instance.length; i++) {
      validateInstance(instance[i], schema.items, schemaMap, `${path}[${i}]`, errors);
    }
  }

  // minimum / maximum (numbers and integers)
  if (typeof instance === 'number') {
    if (schema.minimum !== undefined && instance < schema.minimum) {
      errors.push(`${path || 'value'}: ${instance} is less than minimum ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && instance > schema.maximum) {
      errors.push(`${path || 'value'}: ${instance} is greater than maximum ${schema.maximum}`);
    }
  }

  // minLength / maxLength (strings)
  if (typeof instance === 'string') {
    if (schema.minLength !== undefined && instance.length < schema.minLength) {
      errors.push(`${path || 'value'}: string length ${instance.length} < minLength ${schema.minLength}`);
    }
    if (schema.maxLength !== undefined && instance.length > schema.maxLength) {
      errors.push(`${path || 'value'}: string length ${instance.length} > maxLength ${schema.maxLength}`);
    }
      // pattern (regex)
      if (schema.pattern) {
        try {
          const re = new RegExp(schema.pattern);
          if (!re.test(instance)) {
            errors.push(`${path || 'value'}: string does not match pattern "${schema.pattern}"`);
          }
        } catch {
          // Invalid regex in schema — skip validation rather than crash
        }
      }
      // format: date-time (ISO 8601)
      if (schema.format === 'date-time') {
        const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/;
        if (!isoRegex.test(instance)) {
          errors.push(`${path || 'value'}: string is not a valid date-time format (expected ISO 8601)`);
        }
      }
    }

  // minItems / maxItems (arrays)
  if (Array.isArray(instance)) {
    if (schema.minItems !== undefined && instance.length < schema.minItems) {
      errors.push(`${path || 'value'}: array has ${instance.length} items, minimum is ${schema.minItems}`);
    }
    if (schema.maxItems !== undefined && instance.length > schema.maxItems) {
      errors.push(`${path || 'value'}: array has ${instance.length} items, maximum is ${schema.maxItems}`);
    }
  }

  // oneOf — exactly one sub-schema must match
  if (schema.oneOf && Array.isArray(schema.oneOf)) {
    const matchCount = schema.oneOf.filter((sub) => {
      const subErrors = [];
      validateInstance(instance, sub, schemaMap, path, subErrors);
      return subErrors.length === 0;
    }).length;
    if (matchCount !== 1) {
      errors.push(`${path || 'value'}: must match exactly one of ${schema.oneOf.length} schemas (matched ${matchCount})`);
    }
  }

  // anyOf — at least one sub-schema must match
  if (schema.anyOf && Array.isArray(schema.anyOf)) {
    const anyMatch = schema.anyOf.some((sub) => {
      const subErrors = [];
      validateInstance(instance, sub, schemaMap, path, subErrors);
      return subErrors.length === 0;
    });
    if (!anyMatch) {
      errors.push(`${path || 'value'}: must match at least one of ${schema.anyOf.length} schemas`);
    }
  }

  // allOf — all sub-schemas must match
  if (schema.allOf && Array.isArray(schema.allOf)) {
    for (const sub of schema.allOf) {
      validateInstance(instance, sub, schemaMap, path, errors);
    }
  }

  // const — exact value match
  if (schema.const !== undefined && instance !== schema.const) {
    errors.push(`${path || 'value'}: must be exactly ${JSON.stringify(schema.const)}`);
  }
}

/**
 * Create a schema validator compatible with the Enforcement API.
 *
 * @param {object} schema - The JSON Schema to validate against
 * @param {object} [schemaMap={}] - Map of filename -> schema objects for $ref resolution
 * @returns {(instance: any, schemaOverride?: object) => {valid:boolean, errors:string[]}}
 */
export function createSchemaValidator(schema, schemaMap = {}) {
  const boundSchemaMap = { ...schemaMap, '': schema };
  return (instance, schemaOverride) => {
    const target = schemaOverride ?? schema;
    const errors = [];
    validateInstance(instance, target, boundSchemaMap, 'item', errors);
    return { valid: errors.length === 0, errors };
  };
}

// ---------------------------------------------------------------------------
// Convenience loader — reads a schema file from schemas/ and wires $ref
// resolution against the common schema map.
// ---------------------------------------------------------------------------

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __validationDir = dirname(fileURLToPath(import.meta.url));
const SCHEMAS_DIR = resolve(__validationDir, '../../schemas');

const _schemaCache = new Map();

function loadSchemaFile(name) {
  if (!_schemaCache.has(name)) {
    _schemaCache.set(name, JSON.parse(readFileSync(resolve(SCHEMAS_DIR, name), 'utf8')));
  }
  return _schemaCache.get(name);
}

/**
 * Create a store-friendly schema validator that loads a schema from the
 * schemas/ directory and pre-resolves $ref references to common types.
 *
 * @param {string} schemaFile - Filename in schemas/ (e.g. 'runtime-task.schema.json')
 * @returns {(instance: any) => {valid:boolean, errors:string[]}}
 */
export function createItemValidator(schemaFile) {
  const schema = loadSchemaFile(schemaFile);
  const common = loadSchemaFile('runtime-common.schema.json');
  const schemaMap = { 'runtime-common.schema.json': common };
  return createSchemaValidator(schema, schemaMap);
}
