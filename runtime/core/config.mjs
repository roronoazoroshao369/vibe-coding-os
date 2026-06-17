/**
 * runtime/core/config.mjs — Runtime configuration loader
 *
 * Loads configuration from `.omc/config.json` in the project root,
 * merges with defaults, and provides access to policy rules.
 *
 * Config structure:
 * {
 *   version: "1.0.0",
 *   runtime: {
 *     maxRiskLevel: "review",       // safe | review | dangerous | blocked
 *     requireApproval: true,         // require approval gate for dangerous ops
 *     approvalTimeout: 300,          // seconds before approval expires
 *     maxTaskLease: 600,             // max seconds for task lease
 *     heartbeatInterval: 60,         // seconds between heartbeats
 *   },
 *   tools: {
 *     allowed: ["terminal", "browser", "file", "search"],
 *     denied: ["computer_use"],
 *   },
 *   policies: {
 *     requireTrace: true,            // all mutations must include trace
 *     requireSource: true,           // all mutations must include source
 *     maxItemsPerStore: 10000,       // max items per store collection
 *     eventRetentionDays: 90,        // days to keep events before cleanup
 *   }
 * }
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { nowIso } from './ids.mjs';

const CONFIG_FILE = 'config.json';
const DEFAULT_CONFIG = {
  version: '1.0.0',
  runtime: {
    maxRiskLevel: 'review',
    requireApproval: true,
    approvalTimeout: 300,
    maxTaskLease: 600,
    heartbeatInterval: 60,
    eventRetentionDays: 90,
  },
  tools: {
    allowed: [],
    denied: [],
  },
  policies: {
    requireTrace: true,
    requireSource: true,
    maxItemsPerStore: 10000,
  },
};

const RISK_LEVELS = ['safe', 'review', 'dangerous', 'blocked'];

/**
 * Deep merge two objects, with `source` values overriding `base`.
 */
function deepMerge(base, source) {
  const result = { ...base };
  for (const key of Object.keys(source || {})) {
    if (
      result[key] &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key]) &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

/**
 * Load configuration from the runtime directory.
 * Falls back to defaults if no config file exists.
 *
 * @param {object} store - Runtime store with runtimeDir property
 * @returns {object} Merged configuration
 */
export function loadConfig(store) {
  const configFile = join(store.runtimeDir, CONFIG_FILE);

  if (!existsSync(configFile)) {
    return { ...DEFAULT_CONFIG, _source: 'defaults' };
  }

  try {
    const raw = JSON.parse(readFileSync(configFile, 'utf8'));
    const merged = deepMerge(DEFAULT_CONFIG, raw);

    // Validate numeric config values
    if (typeof merged.runtime?.maxTaskLease === 'number') {
      if (merged.runtime.maxTaskLease <= 0 || !Number.isFinite(merged.runtime.maxTaskLease)) {
        merged.runtime.maxTaskLease = DEFAULT_CONFIG.runtime.maxTaskLease;
        merged._configWarning = `runtime.maxTaskLease must be a positive finite number, reset to default`;
      }
    }

    merged._source = 'config.json';
    merged._loadedAt = nowIso();
    return merged;
  } catch (err) {
    // Return defaults on parse error, but log the issue
    return { ...DEFAULT_CONFIG, _source: 'defaults (config parse error)', _error: err.message };
  }
}

/**
 * Get a nested config value by dot-separated path.
 * Example: getConfigValue(store, 'runtime.maxRiskLevel')
 *
 * @param {object} store - Runtime store
 * @param {string} path - Dot-separated config path
 * @param {*} fallback - Default value if path not found
 * @returns {*} Config value
 */
export function getConfigValue(store, dotPath, fallback = undefined) {
  const config = loadConfig(store);
  const keys = dotPath.split('.');
  let value = config;
  for (const key of keys) {
    if (value === null || value === undefined || typeof value !== 'object') return fallback;
    value = value[key];
  }
  return value !== undefined ? value : fallback;
}

/**
 * Validate that a risk level is within the configured maximum.
 *
 * @param {object} store - Runtime store
 * @param {string} riskLevel - Risk level to check
 * @returns {{ valid: boolean, maxAllowed: string, reason?: string }}
 */
export function validateRiskLevel(store, riskLevel) {
  const maxLevel = getConfigValue(store, 'runtime.maxRiskLevel', 'review');
  const riskIdx = RISK_LEVELS.indexOf(riskLevel);
  const maxIdx = RISK_LEVELS.indexOf(maxLevel);

  if (riskIdx === -1) {
    return { valid: false, maxAllowed: maxLevel, reason: `Unknown risk level: ${riskLevel}` };
  }
  if (riskIdx > maxIdx) {
    return {
      valid: false,
      maxAllowed: maxLevel,
      reason: `Risk level "${riskLevel}" exceeds configured maximum "${maxLevel}"`,
    };
  }
  return { valid: true, maxAllowed: maxLevel };
}

/**
 * Check if a tool is allowed by policy.
 *
 * @param {object} store - Runtime store
 * @param {string} toolName - Tool name to check
 * @returns {{ allowed: boolean, reason?: string }}
 */
export function isToolAllowed(store, toolName) {
  const config = loadConfig(store);
  const { allowed, denied } = config.tools;

  // Explicit deny takes precedence
  if (denied.length > 0 && denied.includes(toolName)) {
    return { allowed: false, reason: `Tool "${toolName}" is explicitly denied` };
  }

  // If allow list is non-empty, tool must be in it
  if (allowed.length > 0 && !allowed.includes(toolName)) {
    return { allowed: false, reason: `Tool "${toolName}" is not in the allowed list` };
  }

  return { allowed: true };
}

/**
 * Get the full config object (for doctor/diagnostics).
 *
 * @param {object} store - Runtime store
 * @returns {object} Full config with metadata
 */
export function getConfig(store) {
  const config = loadConfig(store);
  return {
    ...config,
    _diagnostics: {
      hasConfigFile: existsSync(join(store.runtimeDir, CONFIG_FILE)),
      riskLevels: RISK_LEVELS,
      maxRiskLevelIndex: RISK_LEVELS.indexOf(config.runtime?.maxRiskLevel || 'review'),
    },
  };
}

export { DEFAULT_CONFIG };
