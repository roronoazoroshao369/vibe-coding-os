import { randomUUID } from 'node:crypto';

export const DEFAULT_CREATED_BY = process.env.USER || process.env.LOGNAME || 'unknown';

/**
 * Centralized enforcement module for runtime data validation.
 * All runtime stores call this before write operations.
 */
export class Enforcement {
  /**
   * @param {Function|null} schemaValidator - Optional function (instance, schema) => { valid: boolean, errors: string[] }
   */
  constructor(schemaValidator = null) {
    this._schemaValidator = schemaValidator;
  }

  /**
   * Validate an item against a JSON Schema before write.
   * Throws on first validation error when schemaValidator is configured.
   *
   * @param {*} item - The item to validate
   * @param {object} schema - JSON Schema to validate against
   * @param {string} label - Human-readable label for error messages
   */
  assertValidItem(item, schema, label = 'item') {
    if (!this._schemaValidator) return;
    const result = this._schemaValidator(item, schema);
    if (!result.valid && result.errors && result.errors.length > 0) {
      throw new Error(`${label}: ${result.errors[0]}`);
    }
  }

  /**
   * Ensure a collection object only has known top-level keys.
   * Enforces additionalProperties: false at the collection level.
   *
   * @param {object} collection - The collection object to validate
   * @param {string[]} allowedKeys - List of allowed top-level keys
   */
  assertStrictCollection(collection, allowedKeys) {
    const unknownKeys = Object.keys(collection).filter(k => !allowedKeys.includes(k));
    if (unknownKeys.length > 0) {
      throw new Error(`Strict collection: unknown fields: ${unknownKeys.join(', ')}`);
    }
  }

  /**
   * Reject extra fields not in the known fields list.
   *
   * @param {object} obj - The object to validate
   * @param {string[]} knownFields - List of allowed field names
   * @param {string} label - Human-readable label for error messages
   */
  assertKnownFields(obj, knownFields, label = 'object') {
    const extra = Object.keys(obj).filter(k => !knownFields.includes(k));
    if (extra.length > 0) {
      throw new Error(`${label}: unknown fields: ${extra.join(', ')}`);
    }
  }

  /**
   * Check that risk level does not exceed the maximum allowed level.
   * Risk order: safe < review < dangerous < blocked
   *
   * @param {object} risk - Risk object with a 'level' property
   * @param {string} maxLevel - Maximum allowed risk level
   */
  assertRiskWithin(risk, maxLevel) {
    if (!risk || !risk.level) return;
    const levels = ['safe', 'review', 'dangerous', 'blocked'];
    const idx = levels.indexOf(risk.level);
    const maxIdx = levels.indexOf(maxLevel);
    if (idx === -1) {
      throw new Error(`Unknown risk level: ${risk.level}`);
    }
    if (idx > maxIdx) {
      throw new Error(`Risk level "${risk.level}" exceeds max allowed "${maxLevel}"`);
    }
  }

  /**
   * Validate that action is in the allowed set.
   *
   * @param {string} action - The action to validate
   * @param {string[]} allowedActions - Array of allowed action names
   */
  assertAction(action, allowedActions) {
    if (!allowedActions.includes(action)) {
      throw new Error(`Action "${action}" not in allowed list: [${allowedActions.join(', ')}]`);
    }
  }
}

/**
 * Generate a trace identifier string.
 * Uses nano-id-style 16-char hex from randomUUID.
 *
 * @returns {string} Trace ID like "trc_a1b2c3d4e5f6g7h8"
 */
export function generateTrace() {
  return `trc_${randomUUID().replaceAll('-', '').slice(0, 16)}`;
}

/**
 * Apply generated defaults to a runtime item.
 * Adds createdBy, trace, and source if the item is an object and
 * they are not already set.
 *
 * @param {object} item - The item to apply defaults to
 * @param {object} [options] - Default options
 * @param {string} [options.source] - Source identifier
 * @param {string} [options.createdBy] - Creator identifier (defaults to env)
 * @returns {object} The item with defaults applied (mutated)
 */
export function applyItemDefaults(item, options = {}) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return item;

  if (item.createdBy === undefined && item.createdBy !== null) {
    item.createdBy = options.createdBy || DEFAULT_CREATED_BY;
  }
  if (item.trace === undefined && item.trace !== null) {
    item.trace = generateTrace();
  }
  if (item.source === undefined && item.source !== null) {
    item.source = options.source || 'runtime-store';
  }

  return item;
}
