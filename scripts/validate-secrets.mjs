#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { SECRET_PATTERNS } from '../runtime/core/privacy.mjs';

// Labels aligned by index with SECRET_PATTERNS from runtime/core/privacy.mjs.
// Keep this array in the SAME order as SECRET_PATTERNS. If privacy.mjs adds a
// pattern, add a matching label here (falls back to "secret" if missing).
const PATTERN_LABELS = [
  'AWS-access-key',
  'GitHub-token',
  'OpenAI-key',
  'Google-API-key',
  'Slack-token',
  'JWT',
  'Email-address',
  'Generic-credential',
  'Private-key-block'
];

const errors = [];

function getStagedDiff() {
  try {
    return execSync('git diff --cached --unified=0', {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024
    });
  } catch (error) {
    console.error(`Secret scan could not read staged diff: ${error.message}`);
    process.exit(1);
  }
}

// Scan added lines only. Track current file via "+++ b/" headers and line
// numbers via "@@ -a,b +c,d @@" hunk markers. NEVER print matched values.
function scanDiff(diff) {
  let currentFile = 'unknown';
  let addedLineNo = 0;

  for (const rawLine of diff.split('\n')) {
    if (rawLine.startsWith('+++ ')) {
      const target = rawLine.slice(4).trim();
      currentFile = target === '/dev/null' ? 'unknown' : target.replace(/^b\//, '');
      continue;
    }
    if (rawLine.startsWith('@@')) {
      const match = rawLine.match(/@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      addedLineNo = match ? Number(match[1]) : 0;
      continue;
    }
    if (rawLine.startsWith('+++')) continue;
    if (rawLine.startsWith('+')) {
      const content = rawLine.slice(1);
      for (let i = 0; i < SECRET_PATTERNS.length; i += 1) {
        const pattern = SECRET_PATTERNS[i];
        pattern.lastIndex = 0; // reset global-regex state between lines
        if (pattern.test(content)) {
          const label = PATTERN_LABELS[i] || 'secret';
          errors.push(`${currentFile}:${addedLineNo} — matches ${label} pattern`);
        }
      }
      addedLineNo += 1;
    }
    // context/removed lines do not advance the added-line counter
  }
}

const diff = getStagedDiff();
if (diff.trim() !== '') scanDiff(diff);

if (errors.length > 0) {
  console.error('Secret scan failed: potential secrets in staged changes:');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log('Secret scan passed: no secrets detected in staged changes.');
