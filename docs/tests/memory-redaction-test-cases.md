# Memory Redaction Test Cases

Comprehensive test cases for validating the Vibe Coding OS privacy filter and memory redaction capabilities. These tests verify that secrets, credentials, and sensitive data are properly detected and redacted before memory storage, while safe content is preserved.

## Test Suite: Secret Detection

For each test case, provide:
- **Input**: Raw memory entry containing a secret
- **Expected**: What should be redacted
- **Fail patterns**: Regex patterns that must NOT appear in redacted output
- **Pass patterns**: Regex patterns that MUST appear in redacted output (if any safe content preserved)

### TC-01: API Key in plain text
- **Input**: `API key is STRIPE_SECRET_KEY_PLACEHOLDER`
- **Expected**: key replaced with `[REDACTED]`
- **Fail patterns**: `sk_live_`
- **Pass patterns**: `API key`

### TC-02: Password in sentence
- **Input**: `The password is SuperSecret123!`
- **Expected**: full password phrase redacted conservatively
- **Fail patterns**: `SuperSecret123`
- **Pass patterns**: (none — generic password phrase redacts the whole credential expression)

### TC-03: Bearer token
- **Input**: `Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U`
- **Expected**: token value redacted
- **Fail patterns**: `eyJhbGciOiJIUzI1NiJ9`
- **Pass patterns**: `Authorization`

### TC-04: AWS Access Key
- **Input**: `aws_access_key_id=AKIAIOSFODNN7EXAMPLE`
- **Expected**: key redacted
- **Fail patterns**: `AKIAIOSFODNN7EXAMPLE`
- **Pass patterns**: `aws_access_key_id`

### TC-05: Private key block
- **Input**: `-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA0Z3VS5JJcds3xfn/ygWyF8PbnGcY5unA67hql4MgHmMIE2Ml\n-----END RSA PRIVATE KEY-----`
- **Expected**: entire key block redacted
- **Fail patterns**: `BEGIN RSA PRIVATE KEY`, `MIIEpAIBAAKCAQEA0Z3VS5JJcds3xfn`
- **Pass patterns**: (none required)

### TC-06: Connection string
- **Input**: `mongodb://user:***@host:27017/db`
- **Expected**: full connection string redacted conservatively
- **Fail patterns**: `user:pass`
- **Pass patterns**: (none — full URL is redacted)

### TC-07: JWT token
- **Input**: `token = eyJhbG...sw5c`
- **Expected**: token redacted
- **Fail patterns**: `eyJhbG...VCJ9`
- **Pass patterns**: (none — generic assignment redacts the whole credential expression)

### TC-08: Stripe placeholder
- **Input**: `Stripe key: STRIPE_SECRET_KEY_PLACEHOLDER`
- **Expected**: placeholder text is not a real secret; conservative redactor leaves it as-is
- **Fail patterns**: (none)
- **Pass patterns**: `STRIPE_SECRET_KEY_PLACEHOLDER`

### TC-09: GitHub personal access token
- **Input**: `export GITHUB_TOKEN=ghp_PLACEHOLDER_TOKEN_VALUE_1234567890`
- **Expected**: placeholder-like token value is safe example text and remains visible
- **Fail patterns**: (none)
- **Pass patterns**: `GITHUB_TOKEN`, `ghp_PLACEHOLDER_TOKEN_VALUE_1234567890`
### TC-10: Database URL with password
- **Input**: `postgres://admin:***@db.example.com:5432/mydb`
- **Expected**: entire URL credential portion redacted (conservative redactor matches whole URL with credentials)
- **Fail patterns**: `s3cret`
- **Pass patterns**: (none — full URL is redacted)

### TC-11: Slack webhook placeholder (safe text passes through)
- **Input**: `POST SLACK_WEBHOOK_URL_PLACEHOLDER`
- **Expected**: placeholder text is not a real secret; conservative redactor leaves it as-is
- **Fail patterns**: (none — placeholder is intended test value, not actionable)
- **Pass patterns**: `SLACK_WEBHOOK_URL_PLACEHOLDER`

### TC-12: SSH public key (with private key pattern)
- **Input**: `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC7... user@host`
- **Expected**: key material redacted
- **Fail patterns**: `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC7`
- **Pass patterns**: (none required)

### TC-13: Personal email (PII - configurable)
- **Input**: `Contact john.doe@gmail.com for details about the deployment`
- **Expected**: email redacted
- **Fail patterns**: `john\.doe@gmail\.com`
- **Pass patterns**: `deployment`

### TC-14: Phone number (PII - configurable)
- **Input**: `Call me at +1-555-123-4567 for the server credentials`
- **Expected**: phone redacted
- **Fail patterns**: `555-123-4567`
- **Pass patterns**: `server`

### TC-15: Mixed content (already-masked + safe)
- **Input**: `Deployed v2.1.0 to production. API key is ***. Server IP is 192.168.1.100.`
- **Expected**: already-masked `***` passes through as-is; version and IP kept
- **Fail patterns**: (none)
- **Pass patterns**: `v2\.1\.0`, `192\.168\.1\.100`, `\*\*\*`

### TC-16: Private key in PEM format (EC)
- **Input**: `-----BEGIN EC PRIVATE KEY-----\nMHQCAQEEIIB...privatekeydata...\noQYGZ3MEBGL0=\n-----END EC PRIVATE KEY-----`
- **Expected**: entire key block redacted
- **Fail patterns**: `BEGIN EC PRIVATE KEY`, `MHQCAQEEIIB`
- **Pass patterns**: (none required)

### TC-17: Base64-encoded credential
- **Input**: `Basic Auth header: Authorization: Basic cGFzc3dvcmQ6MTIzNA==`
- **Expected**: base64 credential redacted
- **Fail patterns**: `cGFzc3dvcmQ6MTIzNA==`
- **Pass patterns**: `Authorization`

### TC-18: Azure storage key
- **Input**: `DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=j1Hr0wN3+abc123...==;EndpointSuffix=core.windows.net`
- **Expected**: account key redacted
- **Fail patterns**: `AccountKey=j1Hr0wN3`
- **Pass patterns**: `AccountName=myaccount`

### TC-19: GCP service account key
- **Input**: `{"type": "service_account", "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEv...data...\n-----END PRIVATE KEY-----"}`
- **Expected**: private key redacted
- **Fail patterns**: `BEGIN PRIVATE KEY`, `MIIEv`
- **Pass patterns**: `service_account`

### TC-20: npm token
- **Input**: `npm config set //registry.npmjs.org/:_authToken=npm_AbCdEfGhIjKlMnOpQrStUvWxYz123456`
- **Expected**: token redacted
- **Fail patterns**: `npm_AbCdEfGhIjKlMnOpQrStUvWxYz123456`
- **Pass patterns**: `npm config`

---

## Test Suite: Safe Content (Should NOT be redacted)

These test cases verify that the privacy filter does NOT over-redact benign technical content.

### TC-21: Version numbers
- **Input**: `v2.1.0`
- **Expected**: kept as-is
- **Fail patterns**: (none)
- **Pass patterns**: `v2\.1\.0`

### TC-22: IP addresses (internal)
- **Input**: `192.168.1.100`
- **Expected**: kept as-is
- **Fail patterns**: (none)
- **Pass patterns**: `192\.168\.1\.100`

### TC-23: File paths
- **Input**: `src/notifications/types.ts`
- **Expected**: kept as-is
- **Fail patterns**: (none)
- **Pass patterns**: `src/notifications/types\.ts`

### TC-24: Error messages
- **Input**: `TypeError: Cannot read property 'id' of undefined`
- **Expected**: kept as-is
- **Fail patterns**: (none)
- **Pass patterns**: `TypeError`, `Cannot read property`

### TC-25: Public URLs
- **Input**: `https://github.com/public/repo`
- **Expected**: kept as-is
- **Fail patterns**: (none)
- **Pass patterns**: `github\.com/public/repo`

### TC-26: Environment variable names (not values)
- **Input**: `Set DATABASE_URL in your .env file`
- **Expected**: kept as-is (no secret value present)
- **Fail patterns**: (none)
- **Pass patterns**: `DATABASE_URL`, `.env`

### TC-27: Commit hashes
- **Input**: `Fixed in commit a1b2c3d4e5f6`
- **Expected**: kept as-is
- **Fail patterns**: (none)
- **Pass patterns**: `a1b2c3d4e5f6`

### TC-28: Port numbers
- **Input**: `Server listening on port 3000`
- **Expected**: kept as-is
- **Fail patterns**: (none)
- **Pass patterns**: `3000`

### TC-29: Docker image tags
- **Input**: `docker pull node:20-alpine`
- **Expected**: kept as-is
- **Fail patterns**: (none)
- **Pass patterns**: `node:20-alpine`

### TC-30: HTTP status codes and methods
- **Input**: `POST /api/login returned 401 Unauthorized`
- **Expected**: kept as-is
- **Fail patterns**: (none)
- **Pass patterns**: `POST`, `401`

---

## Scoring

- **Pass rate**: # passed / # total
- **Target**: 100% pass rate
- **Severity**: Any secret detection failure = **P0 bug**
- **Over-redaction**: Safe content test failures = **P1 bug** (affects usability)

### Severity Definitions

| Level | Definition | Action |
|-------|-----------|--------|
| P0 | Secret leaked through redaction | Block release, fix immediately |
| P1 | Safe content over-redacted | Fix before next release |
| P2 | False positive on low-risk pattern | Track, fix opportunistically |
