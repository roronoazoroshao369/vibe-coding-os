import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

export async function loadSchemas(schemaDir) {
  const schemas = new Map();
  const entries = await readdir(schemaDir);
  for (const f of entries.filter((e) => e.endsWith('.schema.json'))) {
    const schema = JSON.parse(await readFile(path.join(schemaDir, f), 'utf8'));
    schemas.set(f, schema);
    if (schema.$id) schemas.set(schema.$id, schema);
    if (schema.$id) schemas.set(path.basename(schema.$id), schema);
  }
  return schemas;
}

export function validate(instance, schema, schemas = new Map(), at = '$') {
  const errors = [];
  visit(instance, schema, at, errors, schemas);
  return { valid: errors.length === 0, errors };
}

function typeOf(v) {
  if (Array.isArray(v)) return 'array';
  if (v === null) return 'null';
  if (Number.isInteger(v)) return 'integer';
  return typeof v;
}
function okType(v, t) {
  if (t === 'integer') return Number.isInteger(v);
  if (t === 'array') return Array.isArray(v);
  if (t === 'object') return v !== null && typeof v === 'object' && !Array.isArray(v);
  return typeof v === t;
}
function resolveRef(ref, schemas) {
  const [file, pointer = ''] = ref.split('#');
  let root = file ? schemas.get(file) || schemas.get(path.basename(file)) : null;
  if (!root) throw new Error(`unresolved $ref ${ref}`);
  if (!pointer) return root;
  return pointer.split('/').slice(1).reduce((acc, part) => acc?.[part.replace(/~1/g, '/').replace(/~0/g, '~')], root);
}
function visit(value, schema, at, errors, schemas) {
  if (!schema || typeof schema !== 'object') return;
  if (schema.$ref) {
    try { return visit(value, resolveRef(schema.$ref, schemas), at, errors, schemas); }
    catch (e) { errors.push(`${at}: ${e.message}`); return; }
  }
  if (schema.allOf) for (const s of schema.allOf) visit(value, s, at, errors, schemas);
  if (schema.if) {
    const probe = [];
    visit(value, schema.if, at, probe, schemas);
    if (probe.length === 0 && schema.then) visit(value, schema.then, at, errors, schemas);
  }
  if (schema.const !== undefined && value !== schema.const) errors.push(`${at}: expected const ${JSON.stringify(schema.const)}`);
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((t) => okType(value, t))) { errors.push(`${at}: expected ${types.join('|')}, got ${typeOf(value)}`); return; }
  }
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${at}: value ${JSON.stringify(value)} not in enum`);
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${at}: minLength ${schema.minLength}`);
    if (schema.maxLength !== undefined && value.length > schema.maxLength) errors.push(`${at}: maxLength ${schema.maxLength}`);
    if (schema.pattern !== undefined && !new RegExp(schema.pattern).test(value)) errors.push(`${at}: pattern mismatch ${schema.pattern}`);
    if (schema.format === 'date-time' && Number.isNaN(Date.parse(value))) errors.push(`${at}: invalid date-time`);
  }
  if (typeof value === 'number' && schema.minimum !== undefined && value < schema.minimum) errors.push(`${at}: minimum ${schema.minimum}`);
  if (Array.isArray(value) && schema.items) value.forEach((item, i) => visit(item, schema.items, `${at}[${i}]`, errors, schemas));
  if (Array.isArray(value) && schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${at}: minItems ${schema.minItems}`);
  if (Array.isArray(value) && schema.uniqueItems) {
    const seen = new Set();
    for (const item of value) {
      const key = JSON.stringify(item);
      if (seen.has(key)) { errors.push(`${at}: duplicate item`); break; }
      seen.add(key);
    }
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const k of schema.required || []) if (value[k] === undefined) errors.push(`${at}: missing required ${k}`);
    for (const [k, s] of Object.entries(schema.properties || {})) if (value[k] !== undefined) visit(value[k], s, `${at}.${k}`, errors, schemas);
    if (schema.additionalProperties === false) {
      const allowed = new Set([...(schema.required || []), ...Object.keys(schema.properties || {})]);
      for (const k of Object.keys(value)) {
        if (!allowed.has(k) && !Object.keys(schema.patternProperties || {}).some((p) => new RegExp(p).test(k))) {
          errors.push(`${at}: unexpected property ${k}`);
        }
      }
    }
  }
}
