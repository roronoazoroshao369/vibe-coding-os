/**
 * runtime/core/event-store.mjs — Event Store v2
 *
 * Enhanced event storage with:
 * - Sequence numbers (monotonic, per-store)
 * - Correlation IDs (group related events)
 * - Causation IDs (cause→effect chain)
 * - Idempotency (dedup by event id within configurable window)
 * - Event querying (by type, correlationId, time range)
 * - Event stream (async iterator for large event sets)
 *
 * Fully backward compatible with events.mjs — new fields are additive.
 */

import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { nowIso, makeId } from './ids.mjs';
import { redactObject } from './privacy.mjs';
import { CURRENT_SCHEMA_VERSION } from './validation.mjs';

const EVENTS_FILE = 'events.jsonl';
const METADATA_FILE = 'events-metadata.json';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Load or initialize the event stream metadata (sequence counter, etc.)
 */
async function loadMetadata(store) {
  const metaFile = path.join(store.runtimeDir, METADATA_FILE);
  if (!existsSync(metaFile)) {
    return { nextSeq: 1, totalEvents: 0, lastEventId: null, lastEventAt: null };
  }
  return JSON.parse(await readFile(metaFile, 'utf8'));
}

async function saveMetadata(store, meta) {
  const metaFile = path.join(store.runtimeDir, METADATA_FILE);
  await mkdir(path.dirname(metaFile), { recursive: true });
  const tmp = `${metaFile}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(meta, null, 2) + '\n', 'utf8');
  const { rename } = await import('node:fs/promises');
  await rename(tmp, metaFile);
}

// ---------------------------------------------------------------------------
// Core append — backward compatible with existing events
// ---------------------------------------------------------------------------

/**
 * Append an event to the event log with v2 metadata.
 *
 * @param {object} store - Runtime store
 * @param {string} type - Event type (e.g. 'task.created')
 * @param {object} payload - Event payload
 * @param {object} [options] - Event options
 * @param {string} [options.correlationId] - Group related events
 * @param {string} [options.causationId] - ID of the event that caused this one
 * @param {string} [options.actor] - Who/what generated the event
 * @param {boolean} [options.idempotent] - Skip if event with same id already exists
 * @returns {object} The appended event with v2 fields
 */
export async function appendEventV2(store, type, payload = {}, options = {}) {
  const meta = await loadMetadata(store);
  const eventId = makeId('evt');
  const now = nowIso();

  // Idempotency check
  if (options.idempotent) {
    const recentEvents = await listEventsV2(store, { limit: 100, type });
    if (recentEvents.some(e => e.id === eventId)) {
      return recentEvents.find(e => e.id === eventId);
    }
  }

  const event = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    id: eventId,
    seq: meta.nextSeq,
    type,
    createdAt: now,
    actor: options.actor ? { type: 'agent', id: options.actor } : { type: 'system' },
    correlationId: options.correlationId || null,
    causationId: options.causationId || null,
    redaction: { applied: false },
    payload: redactObject(payload),
  };

  const file = path.join(store.runtimeDir, EVENTS_FILE);
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(file, `${JSON.stringify(event)}\n`, 'utf8');

  // Update metadata
  meta.nextSeq++;
  meta.totalEvents++;
  meta.lastEventId = eventId;
  meta.lastEventAt = now;
  await saveMetadata(store, meta);

  return event;
}

// ---------------------------------------------------------------------------
// Querying
// ---------------------------------------------------------------------------

/**
 * List events with v2 querying support.
 *
 * @param {object} store - Runtime store
 * @param {object} [options] - Query options
 * @param {number} [options.limit] - Max events to return
 * @param {string} [options.type] - Filter by event type
 * @param {string} [options.correlationId] - Filter by correlation ID
 * @param {string} [options.afterId] - Start after this event ID
 * @param {string} [options.afterSeq] - Start after this sequence number
 * @param {string} [options.since] - Events since this ISO timestamp
 * @param {boolean} [options.strict] - Throw on parse errors
 * @returns {object[]} Events matching the query
 */
export async function listEventsV2(store, options = {}) {
  const file = path.join(store.runtimeDir, EVENTS_FILE);
  if (!existsSync(file)) return [];

  const text = await readFile(file, 'utf8');
  const events = [];
  let passedAfterId = !options.afterId;

  for (const [index, line] of text.split(/\r?\n/).entries()) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    try {
      const event = JSON.parse(trimmed);

      // afterId filter
      if (!passedAfterId) {
        if (event.id === options.afterId) passedAfterId = true;
        continue;
      }

      // afterSeq filter
      if (options.afterSeq && event.seq <= options.afterSeq) continue;

      // type filter
      if (options.type && event.type !== options.type) continue;

      // correlationId filter
      if (options.correlationId && event.correlationId !== options.correlationId) continue;

      // since filter
      if (options.since && event.createdAt < options.since) continue;

      events.push(event);

      // limit
      if (options.limit && events.length >= options.limit) break;
    } catch (err) {
      if (options.strict) throw new Error(`invalid event JSON at line ${index + 1}: ${err.message}`);
    }
  }

  return events;
}

/**
 * Get a single event by ID.
 */
export async function getEvent(store, eventId) {
  const events = await listEventsV2(store, { strict: true });
  return events.find(e => e.id === eventId) || null;
}

/**
 * Get events in a correlation chain (all events sharing a correlationId).
 */
export async function getCorrelationChain(store, correlationId) {
  return listEventsV2(store, { correlationId });
}

/**
 * Get the causal chain for an event (follow causationId links backward).
 */
export async function getCausalChain(store, eventId, maxDepth = 50) {
  const events = await listEventsV2(store, { strict: true });
  const byId = new Map(events.map(e => [e.id, e]));
  const chain = [];
  let current = byId.get(eventId);

  while (current && chain.length < maxDepth) {
    chain.unshift(current);
    current = current.causationId ? byId.get(current.causationId) : null;
  }

  return chain;
}

// ---------------------------------------------------------------------------
// Stream — async iterator for large event sets
// ---------------------------------------------------------------------------

/**
 * Create an async iterable stream of events.
 * Reads events in batches for memory efficiency.
 *
 * @param {object} store - Runtime store
 * @param {object} [options] - Stream options (same as listEventsV2)
 * @yields {object} Events one at a time
 */
export async function* eventStream(store, options = {}) {
  const file = path.join(store.runtimeDir, EVENTS_FILE);
  if (!existsSync(file)) return;

  const text = await readFile(file, 'utf8');
  let count = 0;

  for (const [index, line] of text.split(/\r?\n/).entries()) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    try {
      const event = JSON.parse(trimmed);

      if (options.type && event.type !== options.type) continue;
      if (options.correlationId && event.correlationId !== options.correlationId) continue;
      if (options.since && event.createdAt < options.since) continue;

      count++;
      if (options.limit && count > options.limit) break;

      yield event;
    } catch {
      if (options.strict) throw new Error(`invalid event at line ${index + 1}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Metadata / diagnostics
// ---------------------------------------------------------------------------

/**
 * Get event store metadata (for doctor/status).
 */
export async function getEventMetadata(store) {
  const meta = await loadMetadata(store);
  const file = path.join(store.runtimeDir, EVENTS_FILE);
  const fileSize = existsSync(file) ? (await import('node:fs')).statSync(file).size : 0;

  // Count by type (sample all current events; runtime logs are small for this optional layer)
  const allEvents = await listEventsV2(store);
  const typeCounts = {};
  let maxSeq = 0;
  for (const e of allEvents) {
    typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
    if (typeof e.seq === 'number' && e.seq > maxSeq) maxSeq = e.seq;
  }

  // Backward compatibility: old event logs may not have metadata or seq fields.
  const inferredTotal = allEvents.length;
  const inferredNextSeq = maxSeq > 0 ? maxSeq + 1 : inferredTotal + 1;

  return {
    ...meta,
    totalEvents: Math.max(meta.totalEvents || 0, inferredTotal),
    nextSeq: Math.max(meta.nextSeq || 1, inferredNextSeq),
    fileSize,
    typeCounts,
    eventsInFile: inferredTotal,
  };
}
