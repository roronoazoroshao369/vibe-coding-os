#!/usr/bin/env node
// security/redact/redactor.mjs
// v2.14.0 — Defense in Depth, Layer 2: CONTAIN
// Per ADR 0003: Three pipeline modes (postTool, postSession, postPublish).
// Pure ESM, no deps, allowlist-aware.

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 30 secret patterns across common cloud + dev tokens
const DEFAULT_PATTERNS = [
  { id: 'aws-access-key', regex: /AKIA[0-9A-Z]{16}/g, severity: 'critical' },
  { id: 'aws-secret-key', regex: /aws_secret_access_key\s*=\s*[A-Za-z0-9/+=]{40}/gi, severity: 'critical' },
  { id: 'github-pat-new', regex: /github_pat_[0-9a-zA-Z_]{50,}/g, severity: 'critical' },
  { id: 'github-pat-old', regex: /ghp_[0-9a-zA-Z]{30,}/g, severity: 'critical' },
  { id: 'github-oauth', regex: /gho_[0-9a-zA-Z]{30,}/g, severity: 'critical' },
  { id: 'github-app', regex: /(ghu|ghs)_[0-9a-zA-Z]{30,}/g, severity: 'critical' },
  { id: 'openai-key', regex: /sk-(?!ant-)[A-Za-z0-9]{20,}/g, severity: 'critical' },
  { id: 'anthropic-key', regex: /sk-ant-[A-Za-z0-9-]{20,}/g, severity: 'critical' },
  { id: 'jwt', regex: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, severity: 'high' },
  { id: 'stripe-test', regex: /sk_test_[0-9a-zA-Z]{20,}/g, severity: 'critical' },
  { id: 'stripe-live', regex: /sk_live_[0-9a-zA-Z]{20,}/g, severity: 'critical' },
  { id: 'stripe-restricted', regex: /rk_(test|live)_[0-9a-zA-Z]{20,}/g, severity: 'critical' },
  { id: 'gcp-service-account', regex: /"type":\s*"service_account"/g, severity: 'medium' },
  { id: 'google-api-key', regex: /AIza[0-9A-Za-z_-]{35}/g, severity: 'critical' },
  { id: 'slack-bot', regex: /xox[baprs]-[0-9a-zA-Z-]{10,}/g, severity: 'high' },
  { id: 'slack-webhook', regex: /https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]+\/B[A-Z0-9]+\/[A-Za-z0-9]+/g, severity: 'critical' },
  { id: 'npm-token', regex: /npm_[A-Za-z0-9]{36,}/g, severity: 'critical' },
  { id: 'pypi-token', regex: /pypi-AgEIcHlwaS5vcmc[A-Za-z0-9_-]{50,}/g, severity: 'critical' },
  { id: 'pem-private', regex: /-----BEGIN (RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/g, severity: 'critical' },
  { id: 'ssh-key-content', regex: /-----BEGIN OPENSSH PRIVATE KEY-----/g, severity: 'critical' },
  { id: 'basic-auth-url', regex: /https?:\/\/[A-Za-z0-9_]+:[A-Za-z0-9_]+@[\w.-]+/g, severity: 'high' },
  { id: 'bearer-header', regex: /Bearer\s+[A-Za-z0-9_\-.=]{20,}/gi, severity: 'medium' },
  { id: 'high-entropy-string', regex: /[A-Za-z0-9+\/]{40,}={0,2}/g, severity: 'low' },
  { id: 'heroku-api', regex: /[hH]eroku[a-zA-Z0-9_ .,]{0,20}([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/g, severity: 'high' },
  { id: 'twilio-sid', regex: /AC[a-f0-9]{32}/g, severity: 'high' },
  { id: 'sendgrid-key', regex: /SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}/g, severity: 'critical' },
  { id: 'mailgun-key', regex: /key-[0-9a-zA-Z]{32}/g, severity: 'critical' },
  { id: 'digitalocean-pat', regex: /dop_v1_[a-f0-9]{64}/g, severity: 'critical' },
  { id: 'cloudflare-api', regex: /[A-Za-z0-9_-]{40}/g, severity: 'low' },
  { id: 'private-ip', regex: /\b(?:10|172|192)\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, severity: 'low' },
];

/**
 * Load allowlist from JSON file. Allowlist patterns are NEVER redacted (test fixtures).
 */
function loadAllowlist(allowlistPath) {
  const defaultPath = resolve(__dirname, 'allowlist.json');
  const path = allowlistPath || defaultPath;
  if (!existsSync(path)) return [];
  try {
    const data = JSON.parse(readFileSync(path, 'utf8'));
    return data.entries || data;
  } catch {
    return [];
  }
}

/**
 * Check if a match is in the allowlist.
 */
function isAllowlisted(match, allowlist) {
  return allowlist.some(entry => {
    if (typeof entry === 'string') return entry === match;
    if (entry.exact) return entry.exact === match;
    if (entry.regex) return new RegExp(entry.regex).test(match);
    if (entry.prefix) return match.startsWith(entry.prefix);
    return false;
  });
}

/**
 * Redact secrets from text using pattern set + allowlist.
 *
 * @param {string} text - Input text potentially containing secrets
 * @param {object} options - { mode: 'postTool'|'postSession'|'postPublish', allowlist: [...], customPatterns: [...] }
 * @returns { { redacted: string, findings: Array<{pattern, severity, count}>, hasSecrets: boolean } }
 */
export function redact(text, options = {}) {
  if (!text) return { redacted: '', findings: [], hasSecrets: false };
  const mode = options.mode || 'postTool';
  // If allowlist explicitly provided (even empty array), use it; otherwise load default
  const allowlist = options.allowlist !== undefined ? options.allowlist : loadAllowlist();
  const patterns = options.customPatterns || DEFAULT_PATTERNS;

  // Check if full input is allowlisted
  if (isAllowlisted(text, allowlist)) {
    return { redacted: text, findings: [], hasSecrets: false };
  }

  let redacted = text;
  const findings = [];

  for (const p of patterns) {
    const matches = redacted.match(p.regex);
    if (!matches) continue;
    // Filter out allowlisted matches
    const realMatches = matches.filter(m => !isAllowlisted(m, allowlist));
    if (realMatches.length === 0) {
      // All matches are allowlisted — still flag if pattern matched (for visibility)
      // but DON'T replace text
      continue;
    }
    findings.push({
      pattern: p.id,
      severity: p.severity,
      count: realMatches.length,
      mode
    });
    // Replace non-allowlisted matches
    for (const m of realMatches) {
      // Escape regex special chars for literal replacement
      const escaped = m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const replaceRegex = new RegExp(escaped, 'g');
      redacted = redacted.replace(replaceRegex, `[REDACTED:${p.id}]`);
    }
  }

  return {
    redacted,
    findings,
    hasSecrets: findings.length > 0
  };
}

/**
 * Audit a payload for secrets without modifying it.
 * Used for dry-run before publish.
 */
export function audit(text, options = {}) {
  const result = redact(text, { ...options, customPatterns: options.customPatterns || DEFAULT_PATTERNS });
  return {
    hasSecrets: result.hasSecrets,
    findings: result.findings,
    secretCount: result.findings.reduce((sum, f) => sum + f.count, 0)
  };
}

// CLI mode
if (process.argv[1] && process.argv[1].includes('redactor.mjs')) {
  const args = process.argv.slice(2);
  const mode = args.find(a => a.startsWith('--mode='))?.split('=')[1] || 'postTool';
  const action = args.find(a => a.startsWith('--action='))?.split('=')[1] || 'redact';

  let input = '';
  process.stdin.on('data', c => input += c);
  process.stdin.on('end', () => {
    if (action === 'audit') {
      const result = audit(input, { mode });
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.hasSecrets ? 1 : 0);
    } else {
      const result = redact(input, { mode });
      console.log(result.redacted);
      process.exit(result.hasSecrets ? 1 : 0);
    }
  });
}
