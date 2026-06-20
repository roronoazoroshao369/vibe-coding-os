#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { SECRET_PATTERNS } from '../runtime/core/privacy.mjs';

// Labels aligned by index with SECRET_PATTERNS from runtime/core/privacy.mjs.
// Keep this array in the SAME order as SECRET_PATTERNS. If privacy.mjs adds a
// pattern, add a matching label here (falls back to "secret" if missing).
const PATTERN_LABELS = [
  'AWS-access-key',
  'GitHub-token',
  'Stripe-live-key',
  'Stripe-test-key',
  'Stripe-webhook-secret',
  'OpenAI-key',
  'Google-API-key',
  'Slack-token',
  'Slack-webhook-URL',
  'npm-token',
  'Twilio-account-SID',
  'SendGrid-API-key',
  'Phone-number',
  'Azure-account-key',
  'Base64-auth',
  'SSH-public-key',
  'JWT',
  'Email-address',
  'Generic-credential',
  'Private-key-block',
  'DB-connection-string'
];

const errors = [];

const ALLOWLIST_PATHS = [
  /^docs\/tests\/memory-redaction-test-cases\.md$/,
  /^scripts\/validate-secrets\.mjs$/,
  /^scripts\/verify-memory-redaction\.mjs$/,
  /^runtime\/core\/privacy\.mjs$/,
  /^docs\/reports\/.*\.md$/,
  /^references\//,
  /^docs\/eval-scenarios\.md$/,
  /^docs\/memory-conventions\.md$/,
  /^runtime\/memory\/vector-store\.mjs$/,
  /^examples\/bypass-demo\//,  // Demo files contain password-related code
  /^scripts\/validate-redact\.mjs$/,  // Redactor test inputs (placeholders only)
  /^security\/redact\/allowlist\.json$/,  // Allowlist contains placeholder patterns
  /^security\/README\.md$/,  // Security docs contain example patterns
  /^security\/redact\/README\.md$/,  // Redactor docs contain example patterns
  /^tests\/fixtures\/.+\.json$/,  // Test fixtures contain example patterns
  /^skills\/core\/test-fixture-library\/SKILL\.md$/,  // Skill describing fixtures
];

const TEXT_EXTENSIONS = new Set([
  '.md', '.mdx', '.txt', '.json', '.jsonc', '.yaml', '.yml', '.toml', '.js', '.mjs', '.cjs',
  '.ts', '.tsx', '.jsx', '.py', '.sh', '.bash', '.zsh', '.env', '.example', '.template', '.lock'
]);

function isAllowedPath(path) {
  return ALLOWLIST_PATHS.some((pattern) => pattern.test(path));
}

function listTrackedFiles() {
  try {
    return execSync('git ls-files -z', {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024
    }).split('\0').filter(Boolean);
  } catch (error) {
    console.error(`Secret scan could not list tracked files: ${error.message}`);
    process.exit(1);
  }
}

function isTextCandidate(path) {
  if (path.includes('/node_modules/') || path.startsWith('node_modules/')) return false;
  if (path.includes('/.git/') || path.startsWith('.git/')) return false;
  const lower = path.toLowerCase();
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.gif') || lower.endsWith('.webp') || lower.endsWith('.pdf') || lower.endsWith('.zip') || lower.endsWith('.gz')) return false;
  const dot = lower.lastIndexOf('.');
  if (dot === -1) return true;
  return TEXT_EXTENSIONS.has(lower.slice(dot));
}

function scanLine(path, lineNo, content) {
  if (isAllowedPath(path)) return;
  for (let i = 0; i < SECRET_PATTERNS.length; i += 1) {
    const pattern = SECRET_PATTERNS[i];
    pattern.lastIndex = 0;
    if (pattern.test(content)) {
      const label = PATTERN_LABELS[i] || 'secret';
      errors.push(`${path}:${lineNo} — matches ${label} pattern`);
    }
  }
}

function scanRepository() {
  const files = listTrackedFiles().filter(isTextCandidate);
  for (const file of files) {
    let content;
    try {
      content = execSync(`git show HEAD:${JSON.stringify(file)}`, {
        encoding: 'utf8',
        maxBuffer: 20 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'ignore']
      });
    } catch {
      // Fall back to working tree for newly added/staged files or unusual paths.
      try {
        content = execSync(`python3 - <<'PY'\nfrom pathlib import Path\nprint(Path(${JSON.stringify(file)}).read_text(errors='ignore'), end='')\nPY`, {
          encoding: 'utf8',
          maxBuffer: 20 * 1024 * 1024,
          stdio: ['ignore', 'pipe', 'ignore']
        });
      } catch {
        continue;
      }
    }
    content.split('\n').forEach((line, index) => scanLine(file, index + 1, line));
  }
}

scanRepository();

if (errors.length > 0) {
  console.error('Secret scan failed: potential secrets in tracked repository files:');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log('Secret scan passed: no secrets detected in tracked repository files.');
