#!/usr/bin/env node
// quality-event-emitter.mjs — v2.2 Quality Telemetry event emitter for Vibe Coding OS.
//
// Validates a quality telemetry event and appends it to docs/metrics/quality-events.ndjson.
// No external dependencies.
//
// Usage:
//   node scripts/quality-event-emitter.mjs --event '{"eventType":"gate-result",...}'
//   node scripts/quality-event-emitter.mjs --type gate-result --data '{"gateId":"x","pass":true,"duration":10,"warnings":0}'
//   echo '{"eventType":"session-start",...}' | node scripts/quality-event-emitter.mjs
//   node scripts/quality-event-emitter.mjs --event '{"eventType":"gate-result"}' --dry-run

import { appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const METRICS_DIR = resolve(ROOT, 'docs', 'metrics');
const EVENTS_FILE = resolve(METRICS_DIR, 'quality-events.ndjson');

const SCHEMA_VERSION = '2.2.0';

const VALID_EVENT_TYPES = [
  'quality-engine-run',
  'gate-result',
  'session-start',
  'session-end',
  'model-config-change',
  'weakness-logged',
  'lesson-logged',
];

const VALID_SOURCES = ['engine-runner', 'adapter-gate-selector', 'user-command'];

// Required fields on data object, keyed by eventType
const DATA_REQUIRED_FIELDS = {
  'quality-engine-run': ['sessionId', 'profile', 'gatesRun', 'gatesPassed', 'gatesFailed', 'duration'],
  'gate-result': ['gateId', 'pass', 'duration', 'warnings'],
  'session-start': ['sessionId', 'modelId', 'taskType', 'gatesRun', 'gatesPassed', 'gatesFailed', 'duration', 'outcomes'],
  'session-end': ['sessionId', 'modelId', 'taskType', 'gatesRun', 'gatesPassed', 'gatesFailed', 'duration', 'outcomes'],
  'model-config-change': ['modelId', 'previousProfile', 'newProfile'],
  'weakness-logged': ['modelId', 'category', 'summary'],
  'lesson-logged': ['lessonId', 'summary'],
};

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { eventType: null, data: null, event: null, dryRun: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg === '--event' && i + 1 < argv.length) {
      args.event = argv[++i];
    } else if (arg.startsWith('--event=')) {
      args.event = arg.slice('--event='.length);
    } else if (arg === '--type' && i + 1 < argv.length) {
      args.eventType = argv[++i];
    } else if (arg.startsWith('--type=')) {
      args.eventType = arg.slice('--type='.length);
    } else if (arg === '--data' && i + 1 < argv.length) {
      args.data = argv[++i];
    } else if (arg.startsWith('--data=')) {
      args.data = arg.slice('--data='.length);
    }
  }
  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/quality-event-emitter.mjs --event '<json-string>'
  node scripts/quality-event-emitter.mjs --type <eventType> --data '<json-data>'
  echo '<json>' | node scripts/quality-event-emitter.mjs
  node scripts/quality-event-emitter.mjs --event '<json-string>' --dry-run

Options:
  --event <json>    Full event JSON string
  --type <type>     Event type shorthand (used with --data)
  --data <json>     Event data payload (used with --type)
  --dry-run         Validate only, do not write to file
  --help, -h        Show this help

Event types:
  quality-engine-run, gate-result, session-start, session-end,
  model-config-change, weakness-logged, lesson-logged`);
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function validateEvent(obj) {
  const errors = [];

  if (!isNonEmptyString(obj.eventId)) {
    errors.push('eventId is required and must be a non-empty string');
  }
  if (!isNonEmptyString(obj.eventType)) {
    errors.push('eventType is required and must be a non-empty string');
  } else if (!VALID_EVENT_TYPES.includes(obj.eventType)) {
    errors.push(`eventType "${obj.eventType}" is not valid. Must be one of: ${VALID_EVENT_TYPES.join(', ')}`);
  }
  if (!isNonEmptyString(obj.timestamp)) {
    errors.push('timestamp is required and must be a non-empty string (ISO 8601)');
  }
  if (!isNonEmptyString(obj.source)) {
    errors.push('source is required and must be a non-empty string');
  } else if (!VALID_SOURCES.includes(obj.source)) {
    errors.push(`source "${obj.source}" is not valid. Must be one of: ${VALID_SOURCES.join(', ')}`);
  }
  if (typeof obj.private !== 'boolean') {
    errors.push('private is required and must be a boolean');
  }
  if (obj.data === undefined || obj.data === null || typeof obj.data !== 'object' || Array.isArray(obj.data)) {
    errors.push('data is required and must be an object');
  }

  // Validate data required fields for known event types
  if (typeof obj.data === 'object' && obj.data !== null && obj.eventType && DATA_REQUIRED_FIELDS[obj.eventType]) {
    for (const field of DATA_REQUIRED_FIELDS[obj.eventType]) {
      if (!(field in obj.data)) {
        errors.push(`data.${field} is required for eventType "${obj.eventType}"`);
      }
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  let rawEvent;

  // Resolve event JSON from --event flag, --type + --data shorthand, or stdin
  if (args.event) {
    rawEvent = args.event;
  } else if (args.eventType || args.data) {
    // Shorthand mode: build event from --type and --data
    let eventType = args.eventType;
    let dataObj = {};

    if (!eventType) {
      console.error('Error: --type is required when using --data shorthand.');
      process.exit(1);
    }
    if (!VALID_EVENT_TYPES.includes(eventType)) {
      console.error(`Error: eventType "${eventType}" is not valid. Must be one of: ${VALID_EVENT_TYPES.join(', ')}`);
      process.exit(1);
    }

    if (args.data) {
      try {
        dataObj = JSON.parse(args.data);
      } catch (e) {
        console.error(`Error: --data is not valid JSON: ${e.message}`);
        process.exit(1);
      }
      if (typeof dataObj !== 'object' || dataObj === null || Array.isArray(dataObj)) {
        console.error('Error: --data must be a JSON object.');
        process.exit(1);
      }
    }

    const event = {
      version: SCHEMA_VERSION,
      eventId: randomUUID(),
      eventType,
      timestamp: new Date().toISOString(),
      source: 'user-command',
      private: false,
      data: dataObj,
    };

    rawEvent = JSON.stringify(event);
  } else {
    // Read from stdin
    if (process.stdin.isTTY) {
      console.error('Error: No event provided. Use --event, --type/--data, or pipe JSON via stdin.');
      console.error('Use --help for usage information.');
      process.exit(1);
    }

    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    rawEvent = Buffer.concat(chunks).toString('utf8').trim();
  }

  // Parse JSON
  let parsed;
  try {
    parsed = JSON.parse(rawEvent);
  } catch (e) {
    console.error(`Error: Event is not valid JSON: ${e.message}`);
    process.exit(1);
  }

  // Validate event
  const errors = validateEvent(parsed);
  if (errors.length > 0) {
    console.error('Validation failed:');
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  if (args.dryRun) {
    console.log('Dry-run: event validated successfully.');
    console.log(JSON.stringify(parsed, null, 2));
    process.exit(0);
  }

  // Ensure metrics directory and file exist
  if (!existsSync(METRICS_DIR)) {
    mkdirSync(METRICS_DIR, { recursive: true });
  }

  // Append as NDJSON
  const line = JSON.stringify(parsed);
  appendFileSync(EVENTS_FILE, line + '\n', 'utf8');

  console.log(`Event appended to ${EVENTS_FILE}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
