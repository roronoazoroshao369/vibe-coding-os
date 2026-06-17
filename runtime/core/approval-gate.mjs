import { makeId, nowIso } from './ids.mjs';
import { CURRENT_SCHEMA_VERSION } from './validation.mjs';
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

function approvalsEqual(a, b) {
  return (
    a &&
    b &&
    a.subject &&
    b.subject &&
    a.subject.type === b.subject.type &&
    a.subject.id === b.subject.id &&
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
 * @returns {Promise<object>} The created approval record
 */
export async function createApproval(store, action, context = {}) {
  const id = makeId('apr');
  const now = nowIso();

  const approval = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    id,
    subject: {
      type: context.subjectType || 'action',
      id: context.subjectId || action,
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

    if (!requiresApproval(action, risk)) {
      return handler(...args);
    }

    const decision = await findOrCreatePendingApproval(store, {
      subjectType: 'action',
      subjectId: action,
      risk,
      action,
      actor: args[0]?.actor || 'unknown',
    });

    if (decision.status === 'approved' || decision.status === 'not_required') {
      return handler(...args);
    }

    throw new Error(
      `Action "${action}" requires approval. Pending approvalId: ${decision.approvalId}`
    );
  };
}

async function findPendingApproval(store, { subjectType, subjectId, risk }) {
  const items = await loadApprovals(store);
  const latest = items
    .filter(
      (a) =>
        a.subject &&
        a.subject.type === subjectType &&
        a.subject.id === subjectId &&
        approvalsEqual(a, {
          subject: { type: subjectType, id: subjectId },
          riskLevel: risk,
        })
    )
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];

  if (!latest) return null;
  return ['approved', 'not_required'].includes(latest.approval?.status)
    ? latest
    : null;
}

/**
 * Atomically find an existing approval (approved/not_required) for the given
 * action+risk, or reuse an existing pending approval, or create a new one.
 * All three paths execute inside a single lock.
 *
 * @param {object} store - Runtime store
 * @param {object} spec
 * @param {string} spec.subjectType
 * @param {string} spec.subjectId
 * @param {object} [spec.risk]
 * @param {string} spec.action
 * @param {string} spec.actor
 * @returns {Promise<{status:string, approvalId:string|null}>}
 */
async function findOrCreatePendingApproval(store, { subjectType, subjectId, risk, action, actor }) {
  return withLock(store, 'approvals', async () => {
    const items = await loadApprovals(store);

    // 1. Look for an existing approved/not_required approval matching this subject
    const existing = items
      .filter(
        (a) =>
          a.subject &&
          a.subject.type === subjectType &&
          a.subject.id === subjectId &&
          approvalsEqual(a, { subject: { type: subjectType, id: subjectId }, riskLevel: risk })
      )
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];

    if (existing && ['approved', 'not_required'].includes(existing.approval?.status)) {
      return { status: existing.approval.status, approvalId: existing.id };
    }

    // 2. Look for an existing *pending* approval for the same subject — reuse it
    const pending = items.find(
      (a) =>
        a.subject &&
        a.subject.type === subjectType &&
        a.subject.id === subjectId &&
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
      subject: { type: subjectType, id: subjectId },
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
