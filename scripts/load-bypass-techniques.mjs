#!/usr/bin/env node
// scripts/load-bypass-techniques.mjs
//
// Loader for the offensive-payload portion of registry/bypass-techniques.json.
// Gated behind VIBE_ENABLE_OFFENSIVE_TECHNIQUES=1 and an authorization_ref audit trail.
//
// Usage:
//   VIBE_ENABLE_OFFENSIVE_TECHNIQUES=1 \
//   node scripts/load-bypass-techniques.mjs \
//     --authorization-ref=redteam-2026-06-20-incident-007
//
// Without VIBE_ENABLE_OFFENSIVE_TECHNIQUES=1:
//   - Exits 1
//   - Writes an entry to docs/security/bypass-load-attempts.log
//   - Prints a refusal message
//
// With the env var but without a valid --authorization-ref:
//   - Exits 1
//   - Writes an entry to docs/security/bypass-load-attempts.log
//   - Prints a refusal message

import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const args = process.argv.slice(2);
let authorizationRef = null;
for (const arg of args) {
  if (arg.startsWith('--authorization-ref=')) {
    authorizationRef = arg.split('=')[1];
  }
}

const LOG_DIR = resolve(process.cwd(), 'docs/security');
const LOG_FILE = resolve(LOG_DIR, 'bypass-load-attempts.log');

function writeAudit(entry) {
  if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });
  appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
}

const now = new Date().toISOString();
const enabled = process.env.VIBE_ENABLE_OFFENSIVE_TECHNIQUES === '1';

// Refusal path 1: env var not set
if (!enabled) {
  const entry = {
    timestamp: now,
    type: 'refusal-env-missing',
    env_var_present: false,
    authorization_ref: authorizationRef,
    pid: process.pid,
    args: process.argv.slice(2)
  };
  writeAudit(entry);
  console.error('[load-bypass-techniques] REFUSAL: VIBE_ENABLE_OFFENSIVE_TECHNIQUES=1 is required.');
  console.error('[load-bypass-techniques] This loader is for authorized red-team engagements only.');
  console.error('[load-bypass-techniques] To load the stripped catalog (descriptions only), read registry/bypass-techniques.json directly.');
  console.error('[load-bypass-techniques] Audit entry written to ' + LOG_FILE);
  process.exit(1);
}

// Refusal path 2: env var set but no authorization_ref
if (!authorizationRef || !/^[a-zA-Z0-9_-]{6,64}$/.test(authorizationRef)) {
  const entry = {
    timestamp: now,
    type: 'refusal-no-authorization',
    env_var_present: true,
    authorization_ref: authorizationRef,
    pid: process.pid,
    args: process.argv.slice(2)
  };
  writeAudit(entry);
  console.error('[load-bypass-techniques] REFUSAL: --authorization-ref=<id> is required.');
  console.error('[load-bypass-techniques] Authorization ID must be 6-64 alphanumeric chars, dashes, or underscores.');
  console.error('[load-bypass-techniques] Format: redteam-<YYYY-MM-DD>-<incident-id> or similar audit reference.');
  console.error('[load-bypass-techniques] Audit entry written to ' + LOG_FILE);
  process.exit(1);
}

// Authorized path — log success and print the techniques
const successEntry = {
  timestamp: now,
  type: 'authorized-load',
  env_var_present: true,
  authorization_ref: authorizationRef,
  pid: process.pid,
  args: process.argv.slice(2)
};
writeAudit(successEntry);

// In a real red-team engagement, this is where executable templates would be loaded
// from a separate offline vault. For the default repo distribution, the loader prints
// a reminder of the authorization and exits 0.
console.log('[load-bypass-techniques] AUTHORIZED LOAD');
console.log('[load-bypass-techniques] Authorization ref: ' + authorizationRef);
console.log('[load-bypass-techniques] Audit entry written to ' + LOG_FILE);
console.log('[load-bypass-techniques] Default distribution does NOT ship executable templates.');
console.log('[load-bypass-techniques] The stripped catalog (descriptions only) is in registry/bypass-techniques.json');
console.log('[load-bypass-techniques] For authorized red-team engagements, source executable templates from');
console.log('[load-bypass-techniques] your organization\'s offline red-team vault and audit each use.');
process.exit(0);
