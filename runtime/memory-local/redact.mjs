// redact.mjs — strip secrets/PII before anything is persisted.
const PATTERNS = [
  [/\b(?:sk|pk|rk)-[A-Za-z0-9]{16,}\b/g, '[REDACTED_API_KEY]'],
  [/\bghp_[A-Za-z0-9]{36}\b/g, '[REDACTED_GH_TOKEN]'],
  [/\bgithub_pat_[A-Za-z0-9_]{22,}\b/g, '[REDACTED_GH_PAT]'],
  [/\bAKIA[0-9A-Z]{16}\b/g, '[REDACTED_AWS_KEY]'],
  [/\bAIza[0-9A-Za-z\-_]{35}\b/g, '[REDACTED_GOOGLE_KEY]'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g, '[REDACTED_SLACK_TOKEN]'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, '[REDACTED_PRIVATE_KEY]'],
  [/\beyJ[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\b/g, '[REDACTED_JWT]'],
  [/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[REDACTED_EMAIL]'],
  [/\b(?:password|passwd|secret|token|api[_-]?key)\s*[:=]\s*['"]?[^\s'"]{6,}['"]?/gi, '[REDACTED_SECRET_ASSIGN]'],
];

export function redact(text) {
  let out = String(text || '');
  let count = 0;
  for (const [re, repl] of PATTERNS) {
    out = out.replace(re, () => { count++; return repl; });
  }
  return { text: out, redactions: count };
}

export function hasSecret(text) {
  return redact(text).redactions > 0;
}
