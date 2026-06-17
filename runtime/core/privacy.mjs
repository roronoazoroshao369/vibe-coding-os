const SECRET_PATTERNS = [
  // ---- Provider-specific high-signal tokens (run before generic key=value) ----
  // AWS access key
  /\bAKIA[0-9A-Z]{16}\b/g,
  // GitHub PAT / app / oauth / refresh tokens
  /\bgh[pousr]_[A-Za-z0-9]{36,}\b/g,
  // Stripe live / test secret keys
  /\bsk_live_[A-Za-z0-9]{20,}\b/g,
  /\bsk_test_[A-Za-z0-9]{20,}\b/g,
  // Stripe webhook signing secret
  /\bwhsec_[A-Za-z0-9]{30,}\b/g,
  // OpenAI-style keys (sk-...)
  /\bsk-[A-Za-z0-9]{20,}\b/g,
  // Google API key
  /\bAIza[0-9A-Za-z_-]{35}\b/g,
  // Slack bot/webhook tokens
  /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
  // Slack incoming webhook URL
  /https:\/\/hooks\.slack\.com\/services\/[A-Za-z0-9/]+/g,
  // npm access token
  /\bnpm_[A-Za-z0-9]{30,}\b/g,
  // Twilio Account SID + Auth Token patterns
  /\bAC[a-f0-9]{32}\b/g,
  // SendGrid API key
  /\bSG\.[A-Za-z0-9_-]{22,}\.[A-Za-z0-9_-]{40,}\b/g,
  // Phone numbers (US format)
  /\+1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g,
  // Azure storage account key
  /AccountKey=[A-Za-z0-9+/=]+/g,
  // Base64-encoded Basic auth credential
  /Basic\s+[A-Za-z0-9+/=]{20,}/g,
  // SSH public keys (redact key material, keep label)
  /ssh-(?:rsa|ed25519|dss|ecdsa)\s+[A-Za-z0-9+/=]{10,}\s*/g,
  // JWT tokens
  /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
  // Generic credential patterns (run last — highest false-positive risk)
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  /\b(?:api[_-]?key|token|secret|password|private[_-]?key)\s*(?:[:=]|is)\s*[^\s,;]+/gi,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
  // Database connection strings with embedded credentials
  /(?:mongodb|postgres|mysql|redis|mssql):\/\/[^\s]+:[^\s]+@[^\s]+/gi,
];

export function redactText(value = '') {
  let text = String(value);
  for (const pattern of SECRET_PATTERNS) text = text.replace(pattern, '[REDACTED]');
  return text;
}

export function redactObject(value) {
  if (typeof value === 'string') return redactText(value);
  if (Array.isArray(value)) return value.map(redactObject);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, redactObject(item)]));
  }
  return value;
}

export { SECRET_PATTERNS };
