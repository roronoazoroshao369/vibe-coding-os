# Secret Redaction — Layer 2 (Contain)

> v2.14.0 introduced this engine per ADR 0003.
> Module: `security/redact/redactor.mjs`

## Purpose

Redact hardcoded secrets from text at three lifecycle boundaries:
1. **postTool** — tool output before it reaches the user/LLM
2. **postSession** — session log before audit log write
3. **postPublish** — payload before marketplace upload

This is **Layer 2** of the 3-layer Defense in Depth pattern.

## API

```js
import { redact, audit } from "./security/redact/redactor.mjs";

// Redact: returns modified text + findings
const result = redact("My AWS key is AWS_DEMO_KEY_PLACEHOLDER", { mode: "postTool" });
// {
//   redacted: "My AWS key is [REDACTED:aws-access-key]",
//   findings: [{ pattern: "aws-access-key", severity: "critical", count: 1, mode: "postTool" }],
//   hasSecrets: true
// }

// Audit: dry-run, no modification
const audit = audit(payload, { mode: "postPublish" });
// { hasSecrets, findings, secretCount }
```

## Pattern Set

30 patterns across cloud + dev credentials. Defined in `policies/default.json`. Categories:

- **AWS**: access key, secret key
- **GitHub**: PAT (new + old), OAuth, App tokens
- **OpenAI / Anthropic**: API keys
- **Stripe**: test, live, restricted
- **Google Cloud**: API key, service account JSON
- **Slack**: bot token, webhook URL
- **npm / PyPI**: publish tokens
- **Cryptographic**: PEM private keys, SSH keys
- **Auth**: JWT, Bearer headers, basic auth URLs
- **High-entropy**: strings with Shannon entropy > 4.2

## Allowlist

Test fixtures and documentation examples are NOT redacted. Manage in `allowlist.json`:

```json
{
  "entries": [
    { "exact": "sk_test_PLACEHOLDER", "reason": "Stripe test placeholder" },
    { "regex": "^your-api-key-here$", "reason": "Common placeholder" }
  ]
}
```

## Three Modes

| Mode | Trigger | Behavior | Severity Threshold |
|------|---------|----------|---------------------|
| `postTool` | post-tool-use hook | Redact + warn | All severities |
| `postSession` | pre-audit-write | Redact all except `low` | medium+ |
| `postPublish` | pre-marketplace-upload | Redact all + abort if `critical` | medium+ abort on critical |

## CI Integration

```bash
node security/redact/redactor.mjs --mode=postPublish --action=audit < skill.tarball
```

Exit code 1 = secrets found, block publish.

## False Positive Target

< 2% false positive rate. Track via gate `G_SEC_REDACT`.

## Maintenance

- Review allowlist when new test fixtures added
- Update patterns quarterly for new cloud provider tokens
- Severity tuning in `policies/default.json` `severity_levels` block
