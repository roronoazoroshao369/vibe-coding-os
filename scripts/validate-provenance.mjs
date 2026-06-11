#!/usr/bin/env node
import { execSync } from 'node:child_process';

// §8.5 AI-generated code provenance gate.
//
// SELF-ATTESTED, NOT VERIFIED. This gate proves that every non-merge commit on
// the branch carries the required provenance trailers and that each value is in
// the allowed set. It does NOT — and cannot — verify the claim is true: it
// cannot tell whether AI really wrote the code, whether a human really reviewed
// it, or whether the stated tests actually ran. It enforces accountability
// hygiene (a deliberate, machine-checkable declaration per commit), not ground
// truth. Treat a pass as "the author declared provenance", not "provenance is
// correct".
//
// Scope: non-merge commits reachable from HEAD but not from the base ref
// (default `main`, override with PROVENANCE_BASE). Matches a PR's commit range,
// so it runs cleanly in CI and locally before opening a PR. On the base branch
// itself the range is empty and the gate passes with nothing to check.

const BASE_REF = process.env.PROVENANCE_BASE || 'main';

// Required commit trailers. Keys are matched case-insensitively; values are
// lowercased before comparison against the allowed enum.
const REQUIRED_TRAILERS = [
  { key: 'AI-Generated', allowed: ['yes', 'no', 'partial'] },
  { key: 'Human-Edited', allowed: ['yes', 'no'] },
  { key: 'Tested-By', allowed: ['human', 'ai', 'ci', 'none'] },
  { key: 'Human-Reviewed', allowed: ['yes', 'no'] }
];

function git(args) {
  return execSync(`git ${args}`, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024
  });
}

// Resolve the commit range, or null when the base ref cannot be found (e.g. a
// shallow CI clone without the base branch). A missing base ref is a skip, not
// a failure: failing every commit because we cannot compute the range would
// block unrelated work and hide the real signal.
function resolveRange() {
  try {
    execSync(`git rev-parse --verify --quiet ${BASE_REF}^{commit}`, {
      stdio: 'pipe'
    });
  } catch {
    return null;
  }
  return `${BASE_REF}..HEAD`;
}

function checkCommit(message) {
  const lines = message.split('\n');
  const subject = lines[0] || '';
  const problems = [];

  for (const { key, allowed } of REQUIRED_TRAILERS) {
    const re = new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'i');
    let value = null;
    for (const line of lines) {
      const match = line.match(re);
      if (match) value = match[1].trim().toLowerCase(); // last occurrence wins
    }
    if (value === null) {
      problems.push(`missing "${key}:" trailer`);
    } else if (!allowed.includes(value)) {
      problems.push(`"${key}:" invalid value (allowed: ${allowed.join(' | ')})`);
    }
  }

  return { subject, problems };
}

const range = resolveRange();
if (range === null) {
  console.log(
    `Provenance gate skipped: base ref "${BASE_REF}" not found (set PROVENANCE_BASE).`
  );
  process.exit(0);
}

let hashes;
try {
  const out = git(`rev-list --no-merges ${range}`).trim();
  hashes = out ? out.split('\n') : [];
} catch (error) {
  console.error(`Provenance gate could not list commits: ${error.message}`);
  process.exit(1);
}

const errors = [];
for (const hash of hashes) {
  const message = git(`show -s --format=%B ${hash}`);
  const { subject, problems } = checkCommit(message);
  for (const problem of problems) {
    errors.push(`${hash.slice(0, 9)} "${subject}" — ${problem}`);
  }
}

if (errors.length > 0) {
  console.error(
    `Provenance gate failed: ${errors.length} issue(s) across ${hashes.length} commit(s) on ${range}:`
  );
  for (const e of errors) console.error(`- ${e}`);
  console.error('\nEvery non-merge commit on the branch must carry these trailers:');
  for (const { key, allowed } of REQUIRED_TRAILERS) {
    console.error(`  ${key}: ${allowed.join(' | ')}`);
  }
  console.error('\nThese are self-attested declarations, not verified facts.');
  process.exit(1);
}

console.log(
  `Provenance gate passed: ${hashes.length} commit(s) on ${range} carry all required trailers.`
);
