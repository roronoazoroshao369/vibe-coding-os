/**
 * runtime/core/approval-gate.mjs — Approval gate middleware
 *
 * Wraps write handlers with an approval workflow.
 * Approvals are scoped by subject (action + optional args hash) + risk level.
 *
 * v1.5.0: subject now includes argsHash for write tools,
 * so approving task.update(task-A) does NOT auto-approve task.update(task-B).
 */

import { makeId, nowIso } from './ids.mjs';
import { CURRENT_SCHEMA_VERSION } from './validation.mjs';
import { createHash } from 'node:crypto';
import {
  readJson,
  writeJsonAtomic,
  withLock,
  emptyCollection,
  ensureRuntime as ensureRuntimeDir,
} from './fs-store.mjs';
import { appendEvent } from './events.mjs';

const FILE = 'approvals.json';
const RISK_LEVELS = ['safe', 'review', 'dangerous', 'blocked'];

const RISK_FORCED_APPROVAL = new Set(['review', 'dangerous', 'blocked']);
const ACTION_FORCE_APPROVAL = new Set([
  'file.write',
  'shell.command',
  'tmux.launch',
  'mcp.call',
]);

function riskRequiresApproval(risk) {
  if (!risk || !risk.level) return false;
  if (risk.approvalRequired === true) return true;
  return RISK_FORCED_APPROVAL.has(risk.level);
}

/**
 * Check if an action requires approval before execution (based on risk level or action name).
 *
 * @param {string} action - Action name/type (e.g. 'file.write', 'shell.command')
 * @param {object} [risk] - Optional risk object with level property
 * @returns {boolean}
 */
export function requiresApproval(action, risk) {
  if (ACTION_FORCE_APPROVAL.has(action)) return true;
  return riskRequiresApproval(risk);
}

function riskLevelScore(level) {
  const idx = RISK_LEVELS.indexOf(level);
  return idx === -1 ? 0 : idx;
}

/**
 * Compute a stable hash of action arguments for approval subject matching.
 * Deterministic JSON serialization: keys sorted, no whitespace.
 */
function computeArgsHash(args) {
  if (!args || typeof args !== 'object' || Object.keys(args).length === 0) return undefined;
  // Strip non-arg metadata to avoid accidental hash churn
  const stripped = { ...args };
  delete stripped.risk;
  delete stripped.actor;
  const sorted = Object.keys(stripped).sort().reduce((obj, k) => {
    obj[k] = stripped[k];
    return obj;
  }, {});
  return createHash('sha256').update(JSON.stringify(sorted)).digest('hex').slice(0, 16);
}

function subjectEquals(a, b) {
  if (!a || !b) return false;
  if (a.type !== b.type || a.id !== b.id) return false;
  // argsHash: both undefined = match; both equal = match; one defined, other not = mismatch
  if (a.argsHash !== b.argsHash) return false;
  return true;
}

function approvalsEqual(a, b) {
  if (!a || !b) return false;
  return (
    subjectEquals(a.subject, b.subject) &&
    riskLevelScore(a.riskLevel?.level) === riskLevelScore(b.riskLevel?.level)
  );
}

async function loadApprovals(store) {
  const collection = await readJson(store, FILE, emptyCollection('approvals'));
  return collection.items || [];
}

async function saveApprovals(store, items) {
  await writeJsonAtomic(
    store,
    FILE,
    { schemaVersion: CURRENT_SCHEMA_VERSION, kind: 'approvals', items },
    { source: 'runtime-approval-gate' }
  );
}

/**
 * Create a pending approval record.
 *
 * @param {object} store - Runtime store
 * @param {string} action - Action that needs approval
 * @param {object} [context] - Additional context
 * @param {string} [context.subjectType] - Type of subject ('action', 'task', 'workflow-run')
 * @param {string} [context.subjectId] - Subject identifier
 * @param {object} [context.risk] - Risk object with level
 * @param {string} [context.reason] - Human-readable reason for approval
 * @param {string} [context.actor] - Who/what initiated the action
 * @param {object} [context.args] - Tool call arguments (for argsHash in subject)
 * @returns {Promise<object>} The created approval record
 */
export async function createApproval(store, action, context = {}) {
  const id = makeId('apr');
  const now = nowIso();
  const argsHash = computeArgsHash(context.args);

  const approval = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    id,
    subject: {
      type: context.subjectType || 'action',
      id: context.subjectId || action,
      ...(argsHash && { argsHash }),
    },
    riskLevel: context.risk || { level: 'review' },
    approval: {
      status: 'required',
      requiredBy: context.requiredBy || 'approval-gate',
      reason: context.reason || `Action "${action}" requires approval`,
    },
    createdAt: now,
    metadata: {
      action,
      actor: context.actor || 'unknown',
    },
  };

  return withLock(store, 'approvals', async () => {
    const items = await loadApprovals(store);
    items.push(approval);
    await saveApprovals(store, items);
    await appendEvent(store, 'approval.created', {
      approvalId: approval.id,
      action,
      riskLevel: approval.riskLevel.level,
      subjectType: approval.subject.type,
      subjectId: approval.subject.id,
    });
    return approval;
  });
}

/**
 * Approve a pending approval record.
 *
 * @param {object} store - Runtime store
 * @param {string} approvalId - Approval record ID
 * @param {string} approver - Who approved it
 * @returns {Promise<object>} Updated approval record
 */
export async function approveAction(store, approvalId, approver) {
  return withLock(store, 'approvals', async () => {
    const items = await loadApprovals(store);
    const approval = items.find((a) => a.id === approvalId);
    if (!approval) throw new Error(`approval not found: ${approvalId}`);

    const previous = approval.approval.status;
    approval.approval.status = 'approved';
    approval.approval.approvedBy = approver;
    approval.approval.approvedAt = nowIso();

    await saveApprovals(store, items);
    await appendEvent(store, 'approval.approved', {
      approvalId: approval.id,
      previousStatus: previous,
      approver,
      action: approval.metadata?.action,
    });
    return approval;
  });
}

/**
 * Deny a pending approval record.
 *
 * @param {object} store - Runtime store
 * @param {string} approvalId - Approval record ID
 * @param {string} [reason] - Optional reason for denial
 * @param {string} [denier] - Who denied it
 * @returns {Promise<object>} Updated approval record
 */
export async function denyAction(store, approvalId, reason, denier) {
  return withLock(store, 'approvals', async () => {
    const items = await loadApprovals(store);
    const approval = items.find((a) => a.id === approvalId);
    if (!approval) throw new Error(`approval not found: ${approvalId}`);

    const previous = approval.approval.status;
    approval.approval.status = 'denied';
    approval.approval.approvedBy = denier || approval.approval.approvedBy;
    approval.approval.reason = reason || 'Denied by operator';

    await saveApprovals(store, items);
    await appendEvent(store, 'approval.denied', {
      approvalId: approval.id,
      previousStatus: previous,
      denier: denier || 'unknown',
      action: approval.metadata?.action,
      reason: approval.approval.reason,
    });
    return approval;
  });
}

/**
 * Middleware: wrap a handler with an approval gate.
 *
 * The gate:
 *  1. Checks whether the action (or its risk level) requires approval.
 *  2. Looks for an existing approved (or not_required) record.
 *  3. If none found and approval is needed, creates a pending record and
 *     throws an error so the caller knows the action was blocked.
 *  4. Otherwise, delegates to the original handler.
 *
 * v1.5.0: subject now includes argsHash when args are provided,
 * so approval is scoped per-argument-set, not per-action-name.
 *
 * @param {Function} handler - The original handler function
 * @param {object} store - Runtime store
 * @param {string} [actionName] - Explicit action name (default: extracted from args)
 * @returns {Function} Wrapped handler
 */
export function withApprovalGate(handler, store, actionName) {
  return async (...args) => {
    await ensureRuntimeDir(store);
    const action =
      actionName ||
      args[0]?.action ||
      args[0]?.type ||
      args[0]?.tool ||
      'unknown';
    const risk = args[0]?.risk;
    const toolArgs = args[0]?.args || args[0];

    if (!requiresApproval(action, risk)) {
      return handler(...args);
    }

    const decision = await findOrCreatePendingApproval(store, {
      subjectType: 'action',
      subjectId: action,
      risk,
      action,
      actor: args[0]?.actor || 'unknown',
      args: toolArgs,
    });

    if (decision.status === 'approved' || decision.status === 'not_required') {
      return handler(...args);
    }

    throw new Error(
      `Action "${action}" requires approval. Pending approvalId: ${decision.approvalId}`
    );
  };
}

/**
 * Atomically find an existing approval (approved/not_required) for the given
 * subject+risk, or reuse an existing pending approval, or create a new one.
 *
 * v1.5.0: subject matching includes argsHash when args are provided.
 *
 * @param {object} store - Runtime store
 * @param {object} spec
 * @param {string} spec.subjectType
 * @param {string} spec.subjectId
 * @param {object} [spec.risk]
 * @param {string} spec.action
 * @param {string} spec.actor
 * @param {object} [spec.args] - Tool call arguments for argsHash
 * @returns {Promise<{status:string, approvalId:string|null}>}
 */
async function findOrCreatePendingApproval(store, { subjectType, subjectId, risk, action, actor, args }) {
  const argsHash = computeArgsHash(args);

  return withLock(store, 'approvals', async () => {
    const items = await loadApprovals(store);

    // Build matching subject
    const matchSubject = { type: subjectType, id: subjectId, ...(argsHash && { argsHash }) };

    // 1. Look for an existing approved/not_required approval matching this subject
    const existing = items
      .filter(
        (a) =>
          a.subject &&
          approvalsEqual(a, { subject: matchSubject, riskLevel: risk })
      )
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];

    if (existing && ['approved', 'not_required'].includes(existing.approval?.status)) {
      return { status: existing.approval.status, approvalId: existing.id };
    }

    // 2. Look for an existing *pending* approval for the same subject — reuse it
    const pending = items.find(
      (a) =>
        a.subject &&
        subjectEquals(a.subject, matchSubject) &&
        a.approval?.status === 'required'
    );
    if (pending) {
      return { status: 'pending', approvalId: pending.id };
    }

    // 3. No existing approval found — create a new pending one
    const id = makeId('apr');
    const now = nowIso();
    const approval = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      id,
      subject: { type: subjectType, id: subjectId, ...(argsHash && { argsHash }) },
      riskLevel: risk || { level: 'review' },
      approval: {
        status: 'required',
        requiredBy: 'approval-gate',
        reason: `Action "${action}" requires approval`,
      },
      createdAt: now,
      metadata: { action, actor: actor || 'unknown' },
    };

    items.push(approval);
    await saveApprovals(store, items);
    await appendEvent(store, 'approval.created', {
      approvalId: id,
      action,
      riskLevel: approval.riskLevel.level,
      subjectType,
      subjectId,
    });
    return { status: 'pending', approvalId: id };
  });
}
