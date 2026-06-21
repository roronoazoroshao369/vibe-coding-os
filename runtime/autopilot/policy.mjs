/**
 * runtime/autopilot/policy.mjs — Policy class for allow/deny rules
 *
 * Defines a Policy that controls which tools/actions the autopilot loop
 * may execute, which require approval, and how many times each may fire.
 *
 * v1.0.0 — Initial autopilot integration
 */

import { createHash } from 'node:crypto';

const VALID_RISKS = ['low', 'medium', 'high', 'critical'];
const VALID_APPROVAL = ['auto', 'require', 'block'];

const RESERVED_PATTERNS = ['write', 'network', 'dangerous', 'all'];

/**
 * Check whether a dotted action string matches a wildcard rule pattern.
 * Supports:
 *   - exact match:     "file.write" === "file.write"
 *   - prefix wildcard: "file.write.*" matches "file.write.foo"
 *   - single wildcard: "file.*" matches "file.write"
 *   - all wildcard:    "*" matches everything
 *
 * @param {string} action  - Dotted action name, e.g. "file.write.toolA"
 * @param {string} pattern - Rule pattern, e.g. "file.write.*"
 * @returns {boolean}
 */
function actionMatchesPattern(action, pattern) {
  if (pattern === '*' || pattern === 'all') return true;
  if (pattern.endsWith('.*')) {
    const prefix = pattern.slice(0, -2);
    return action === prefix || action.startsWith(prefix + '.');
  }
  if (pattern.endsWith('.')) {
    return action.startsWith(pattern);
  }
  return action === pattern;
}

/**
 * Resolve a reserved shorthand pattern to an expandable list of concrete actions.
 * These are illustrative defaults — the caller can override with explicit rules.
 *
 * @param {string} name - Reserved pattern name
 * @returns {string[]|null} Expanded patterns or null if not a reserved name
 */
function expandReservedPattern(name) {
  switch (name) {
    case 'write':
      return ['file.write', 'file.write.*'];
    case 'network':
      return ['network.request', 'network.request.*'];
    case 'dangerous':
      return ['shell.command', 'shell.command.*', 'tmux.launch'];
    case 'all':
      return ['*'];
    default:
      return null;
  }
}

/**
 * Normalize a rule definition into a canonical form.
 *
 * @param {object} rule - Raw rule {action, risk, approval, max_calls?}
 * @returns {object} Normalized rule
 */
function normalizeRule(rule) {
  const { action, risk = 'medium', approval = 'auto', max_calls } = rule;

  const resolvedAction = RESERVED_PATTERNS.includes(action)
    ? expandReservedPattern(action)
    : [action];

  if (!VALID_RISKS.includes(risk)) {
    throw new Error(`Invalid risk level "${risk}". Valid: ${VALID_RISKS.join(', ')}`);
  }
  if (!VALID_APPROVAL.includes(approval)) {
    throw new Error(`Invalid approval value "${approval}". Valid: ${VALID_APPROVAL.join(', ')}`);
  }
  const max = Number.isInteger(max_calls) ? max_calls : Infinity;

  return { patterns: resolvedAction, risk, approval, max_calls: max, raw: rule };
}

/**
 * @class Policy
 *
 * @param {object} options
 * @param {Array<{action:string, risk:string, approval:string, max_calls?:number}>} options.rules
 *
 * Example:
 *   new Policy({
 *     rules: [
 *       { action: 'file.read', risk: 'low', approval: 'auto' },
 *       { action: 'file.write', risk: 'high', approval: 'require', max_calls: 10 },
 *       { action: 'network.*', risk: 'high', approval: 'require' },
 *       { action: 'shell.command', risk: 'critical', approval: 'block' },
 *     ]
 *   })
 */
export class Policy {
  constructor(options = {}) {
    const { rules = [] } = options;

    /** @type {Array<{patterns:string[], risk:string, approval:string, max_calls:number, raw:object}>} */
    this._rules = rules.map(normalizeRule);

    /** @type {Map<string, number>} Per-pattern call counter */
    this._callCounts = new Map();
  }

  /**
   * Check whether the given action is allowed by the policy.
   * Returns true (allowed) unless a matching rule has approval='block'.
   *
   * @param {string} action - Dotted action name (e.g. "file.write.foo")
   * @param {object} [_context] - Optional context (reserved for future use)
   * @returns {boolean}
   */
  allows(action, _context) {
    const rule = this._findRule(action);
    if (!rule) return true; // no matching rule => allowed by default
    if (rule.approval === 'block') return false;

    // Check call limit
    const patternKey = rule.raw.action || action;
    const current = this._callCounts.get(patternKey) || 0;
    if (current >= rule.max_calls) return false;

    return true;
  }

  /**
   * Check whether the action requires human/reviewer approval before executing.
   *
   * @param {string} action - Dotted action name
   * @param {object} [_context] - Optional context
   * @returns {boolean}
   */
  requiresApproval(action, _context) {
    const rule = this._findRule(action);
    if (!rule) return false;
    return rule.approval === 'require';
  }

  /**
   * Mark one call for the given action (call-count tracking).
   *
   * @param {string} action - Dotted action name
   */
  recordCall(action) {
    const rule = this._findRule(action);
    const patternKey = rule ? rule.raw.action : action;
    const current = this._callCounts.get(patternKey) || 0;
    this._callCounts.set(patternKey, current + 1);
  }

  /**
   * Return a human-readable log of the policy rules.
   *
   * @returns {string}
   */
  log() {
    const lines = ['=== Autopilot Policy ==='];
    for (const rule of this._rules) {
      const maxStr = rule.max_calls === Infinity ? 'unlimited' : String(rule.max_calls);
      const count = [...this._callCounts.entries()]
        .filter(([k]) => rule.raw.action === k || rule.patterns.some(p => k === p))
        .reduce((sum, [, c]) => sum + c, 0);
      const displayMax = rule.max_calls === Infinity ? '∞' : String(rule.max_calls);
      lines.push(
        `  ${rule.raw.action.padEnd(24)} risk=${rule.risk.padEnd(8)} ` +
        `approval=${rule.approval.padEnd(7)} calls=${count}/${displayMax}`
      );
    }
    lines.push('---');
    return lines.join('\n');
  }

  /**
   * Reset all call counters.
   */
  resetCounters() {
    this._callCounts.clear();
  }

  /**
   * Find the most specific matching rule for an action.
   *
   * @param {string} action
   * @returns {object|null} Normalized rule or null
   */
  _findRule(action) {
    // Exact matches first, then wildcard
    for (const rule of this._rules) {
      for (const pattern of rule.patterns) {
        if (actionMatchesPattern(action, pattern)) {
          return rule;
        }
      }
    }
    return null;
  }
}
