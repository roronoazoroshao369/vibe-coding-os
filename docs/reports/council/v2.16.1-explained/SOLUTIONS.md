# Giải pháp cho 5 "vấn đề giới hạn" của Vibe Coding OS

> Repo này thành thật thừa nhận **5 giới hạn** trong `docs/SECURITY-MODEL.md` và
> `README.md`. Đây là tài liệu song hành với file HTML, giải thích **cách giải quyết
> từng vấn đề** bằng cách kết hợp Vibe Coding OS với các công cụ chuyên dụng.

---

## Tổng quan nhanh

| # | Vấn đề | Giải pháp | Độ khó | Công cụ |
|---|--------|-----------|--------|---------|
| 1 | Cần distributed lock | SQLite WAL + file lock hoặc Postgres | Trung bình | `better-sqlite3`, Postgres, Redis |
| 2 | Cần sandbox OS-level | Docker + firejail + E2B cloud sandbox | Trung bình-cao | Docker SDK, E2B API |
| 3 | Cần hosted memory | Adapter interface đã có sẵn | Dễ | supermemory, Claude-mem, Qdrant |
| 4 | Cần AI tự quyết | Thay đổi triết lý, không phải vấn đề | Triết học | "Human-in-loop" pattern |
| 5 | Cần thay thế GitHub security | Repo **không thay thế**, **bổ trợ** | Dễ | gh CLI, gitleaks, GitHub Pro |

---

## 1. Distributed Lock — Vấn đề thực tế

**Hiện trạng trong Vibe Coding OS:**

```javascript
// runtime/core/fs-store.mjs — hiện tại
export async function withLock(store, name, fn, options = {}) {
  await ensureRuntime(store);
  const lock = path.join(store.runtimeDir, 'locks', `${name}.lock`);
  const timeoutMs = options.timeoutMs ?? 5000;
  const retryMs = options.retryMs ?? 25;

  while (true) {
    try {
      await writeFile(lock, String(process.pid), { flag: 'wx' });
      break;
    } catch {
      if (Date.now() - start >= timeoutMs) throw new Error(`Runtime store is locked: ${name}`);
      await new Promise((resolve) => setTimeout(resolve, retryMs));
    }
  }
  // ...
}
```

Đây là **POSIX file lock** (`O_EXCL` qua `flag: 'wx'`). Nó chỉ an toàn **trong 1 process
hoặc nhiều process trên cùng máy** chia sẻ filesystem. Nó **không** an toàn khi:

- Chạy trên nhiều máy (cluster)
- Chạy trong Docker container tách biệt
- Network filesystem (NFS) với cache không nhất quán

### Giải pháp A: SQLite WAL mode (đơn giản nhất, 1 máy)

```javascript
// runtime/core/sqlite-store.mjs (mới)
import Database from 'better-sqlite3';

export function createSqliteStore(root = process.cwd()) {
  const dbPath = path.join(root, '.omc', 'runtime', 'store.db');
  const db = new Database(dbPath);
  
  // WAL mode: nhiều reader, 1 writer, không block nhau
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');  // an toàn hơn FULL, nhanh hơn OFF
  db.pragma('foreign_keys = ON');
  
  // Tạo schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS collections (
      kind TEXT PRIMARY KEY,
      schema_version INTEGER NOT NULL,
      revision INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS items (
      id TEXT NOT NULL,
      kind TEXT NOT NULL,
      data JSON NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (kind, id)
    );
    
    CREATE INDEX IF NOT EXISTS items_kind ON items(kind);
  `);
  
  return { db, dbPath };
}

export async function withLock(store, name, fn) {
  // SQLite đã có row-level locking qua transactions
  return store.db.transaction(() => fn()).immediate();
}
```

**Cài đặt**: `npm install better-sqlite3` (native, cần Python để build). Hoặc dùng
`@vscode/sqlite3` (prebuild).

### Giải pháp B: Redis Redlock (multi-node)

```javascript
// runtime/core/redlock.mjs (mới)
import Redis from 'ioredis';
import Redlock from 'redlock';

const redis = new Redis({ host: 'redis-cluster.internal', port: 6379 });
const redlock = new Redlock([redis], {
  driftFactor: 0.01,
  retryCount: 32,
  retryDelay: 100,  // ms
  retryJitter: 200, // ms
  automaticExtensionThreshold: 500, // ms
});

export async function withLock(name, fn, ttlMs = 5000) {
  const lock = await redlock.acquire([`vibe:${name}`], ttlMs);
  try {
    return await fn();
  } finally {
    await lock.release();
  }
}
```

**Use case**: Chạy Vibe Coding OS runtime trên K8s với nhiều pod cùng đọc/ghi state.
Cần Redis cluster (3+ nodes) cho quorum.

### Giải pháp C: PostgreSQL (production-grade)

```javascript
// runtime/core/pg-store.mjs (mới)
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function withLock(store, name, fn) {
  const client = await pool.connect();
  try {
    // Advisory lock — không cần row thật
    await client.query('SELECT pg_advisory_xact_lock($1)', [hashCode(name)]);
    return await fn();
  } finally {
    client.release();  // auto-unlock khi transaction kết thúc
  }
}
```

**Use case**: Vibe Coding OS team agent chạy trên cloud, cần strict consistency.

### Quyết định nên dùng

| Môi trường | Giải pháp | Lý do |
|-----------|-----------|-------|
| 1 dev, 1 máy | File lock hiện tại | Đủ dùng |
| 1 dev, nhiều terminal | SQLite WAL | Đơn giản, zero-config |
| Team 2-5 người, 1 server | Redis Redlock | Quorum, fast |
| Production, multi-region | Postgres advisory lock | ACID, battle-tested |

---

## 2. Sandbox OS-level

**Hiện trạng**: Repo chỉ sandbox ở mức "instruction contract". Nó không ngăn code
chạy ngoài ý muốn. Nếu AI đề xuất `rm -rf ~/*` và bạn paste vào shell, hết.

### Giải pháp A: Docker (phổ biến nhất)

**Tạo sandbox runtime trong Docker:**

```dockerfile
# runtime/sandbox/Dockerfile
FROM node:20-slim

# Drop privileges ngay lập tức
RUN useradd -m -u 1001 -s /bin/bash sandbox \
    && mkdir -p /workspace /runtime \
    && chown -R sandbox:sandbox /workspace /runtime

# Cài đặt giới hạn CPU + memory
RUN apt-get update && apt-get install -y --no-install-recommends \
    tini \
    && rm -rf /var/lib/apt/lists/*

# Không bao giờ chạy với root
USER sandbox
WORKDIR /workspace

# Tini = PID 1 đúng cách, xử lý signal
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "/runtime/sandbox-entry.mjs"]
```

**Sandbox entry point** — wrap mọi exec call:

```javascript
// runtime/sandbox/sandbox-entry.mjs
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const execAsync = promisify(exec);

// Whitelist commands được phép
const ALLOWED_COMMANDS = new Set([
  'ls', 'cat', 'grep', 'find', 'head', 'tail',
  'node', 'npm', 'npx', 'git',
  'echo', 'pwd', 'wc', 'sort', 'uniq',
]);

// Whitelist paths được phép đọc
const ALLOWED_READ_PREFIXES = ['/workspace/', '/runtime/'];

// Mọi command đi qua IPC từ parent
process.on('message', async ({ id, command, cwd }) => {
  const [bin, ...args] = command.split(/\s+/);
  
  if (!ALLOWED_COMMANDS.has(bin)) {
    return process.send({
      id, error: `Command not allowed: ${bin}`,
      allowed: [...ALLOWED_COMMANDS],
    });
  }
  
  // Path traversal check
  for (const arg of args) {
    if (arg.startsWith('/') && !ALLOWED_READ_PREFIXES.some(p => arg.startsWith(p))) {
      return process.send({
        id, error: `Path not allowed: ${arg}`,
        allowed: ALLOWED_READ_PREFIXES,
      });
    }
  }
  
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: resolve('/workspace', cwd || '.'),
      timeout: 30_000,
      maxBuffer: 10 * 1024 * 1024,  // 10MB
      env: { PATH: '/usr/local/bin:/usr/bin:/bin' },  // KHÔNG inherit env
    });
    process.send({ id, stdout, stderr });
  } catch (err) {
    process.send({ id, error: err.message });
  }
});

// Resource limits via Docker
// docker run --cpus=0.5 --memory=512m --pids-limit=100 --read-only \
//   --tmpfs /tmp:size=100m --network=none
```

**Bật sandbox từ Vibe Coding OS:**

```javascript
// scripts/sandbox-exec.mjs (mới)
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

export async function sandboxExec(command, options = {}) {
  return new Promise((resolve, reject) => {
    const docker = spawn('docker', [
      'run', '--rm', '-i',
      '--cpus=0.5',
      '--memory=512m',
      '--pids-limit=100',
      '--read-only',
      '--tmpfs', '/tmp:size=100m',
      '--network=none',
      '-v', `${process.cwd()}:/workspace:ro`,  // read-only mount
      '-v', `${process.env.HOME}/.vibe-sandbox:/runtime:rw`,
      'vibe-coding-os-sandbox:latest',
      'node', '/runtime/sandbox-entry.mjs',
    ], { stdio: ['pipe', 'pipe', 'pipe'] });
    
    docker.stdin.write(JSON.stringify({ id: 1, command }) + '\n');
    docker.stdin.end();
    
    let output = '';
    docker.stdout.on('data', (chunk) => output += chunk);
    docker.on('close', (code) => {
      if (code !== 0) reject(new Error(`sandbox exit ${code}`));
      else resolve(JSON.parse(output));
    });
  });
}
```

### Giải pháp B: firejail (Linux, lightweight, không cần Docker)

```bash
# Cài firejail: sudo apt install firejail

# Tạo profile cho Vibe Coding OS
# /etc/firejail/vibe-coding-os.profile
include /etc/firejail/default.profile
whitelist ${HOME}/projects
whitelist ${HOME}/.vibe-runtime
blacklist ${HOME}/.ssh
blacklist ${HOME}/.gnupg
blacklist /etc/shadow
noexec /tmp
nosound
noautopulse
nogroups
cpu.cgroup 0.5
memory-deny-write-execute  # chống shellcode
seccomp
```

```javascript
// scripts/firejail-exec.mjs
import { spawn } from 'node:child_process';

export async function firejailExec(command) {
  return new Promise((resolve, reject) => {
    const proc = spawn('firejail', [
      '--profile=/etc/firejail/vibe-coding-os.profile',
      '--',
      '/bin/bash', '-c', command,
    ], { stdio: 'pipe' });
    
    let out = '', err = '';
    proc.stdout.on('data', (d) => out += d);
    proc.stderr.on('data', (d) => err += d);
    proc.on('close', (code) => {
      if (code === 0 || code === 1) resolve({ stdout: out, stderr: err });
      else reject(new Error(`firejail exit ${code}: ${err}`));
    });
  });
}
```

### Giải pháp C: E2B (cloud sandbox cho AI agent)

```javascript
// scripts/e2b-exec.mjs
import { Sandbox } from '@e2b/sdk';

export async function e2bExec(command, options = {}) {
  // E2B cung cấp ephemeral Linux sandbox qua cloud
  const sandbox = await Sandbox.create({
    template: 'node-20',
    timeoutMs: options.timeoutMs || 5 * 60_000,  // 5 min
  });
  
  try {
    // Tất cả execution xảy ra trong E2B cloud, không chạm máy bạn
    const result = await sandbox.process.startAndWait(
      `cd /workspace && ${command}`,
      { timeoutMs: 30_000 }
    );
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
    };
  } finally {
    await sandbox.kill();
  }
}
```

**Use case**: Khi AI agent cần chạy code lạ mà bạn không tin tưởng 100% (vd: pull từ
GitHub random, chạy example, test thư viện mới). E2B cung cấp "throwaway Linux
VM" qua API, tự hủy sau khi xong.

### Quyết định nên dùng

| Môi trường | Giải pháp | Lý do |
|-----------|-----------|-------|
| Dev local, Linux | firejail | Zero-config, không cần Docker daemon |
| Dev local, cross-platform | Docker | Cùng Dockerfile chạy Mac/Win/Linux |
| Multi-tenant / cloud | E2B | Isolation cấp VM, không quản lý infra |
| Production CI/CD | Docker + seccomp + cgroups | Battle-tested |

---

## 3. Hosted Memory Service

**Hiện trạng**: Skill `memory-provider-adapter` đã có, mô tả contract. Nhưng không
bundle implementation cho provider nào.

### Cách integrate: 3 bước

**Bước 1**: Implement adapter theo contract:

```javascript
// adapters/memory/supermemory/index.mjs
import { createClient } from '@supermemory/sdk';

const client = createClient({ apiKey: process.env.SUPERMEMORY_API_KEY });

export const supermemoryAdapter = {
  name: 'supermemory',
  
  // === REQUIRED ===
  async search(query, options = {}) {
    const result = await client.search({
      q: query,
      limit: options.limit || 10,
      containerTags: ['vibe-coding-os'],
    });
    return result.results.map(r => ({
      id: r.id,
      content: r.content,
      score: r.score,
      tags: r.tags,
      createdAt: r.createdAt,
    }));
  },
  
  async ingest(item) {
    // Privacy: redact trước khi gửi cloud
    const redactedContent = redactText(item.content);
    
    return await client.add({
      content: redactedContent,
      type: item.kind || 'observation',
      containerTag: 'vibe-coding-os',
      metadata: { source: item.source, scope: item.scope },
    });
  },
  
  // === OPTIONAL ===
  async delete(id) {
    return await client.delete(id);
  },
  
  async update(id, patch) {
    return await client.update(id, patch);
  },
  
  // === LOCAL FALLBACK ===
  async healthCheck() {
    try {
      await client.ping();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message, fallback: 'local-fs' };
    }
  },
  
  capabilities: {
    vectorSearch: true,
    fullTextSearch: true,
    asyncIngest: true,
    privacyRedaction: false,  // chúng ta redact trước khi gửi
  },
};
```

**Bước 2**: Wire vào MCP server:

```javascript
// runtime/mcp/server.mjs — thêm vào
import { supermemoryAdapter } from '../../adapters/memory/supermemory/index.mjs';

const memoryBackend = process.env.MEMORY_BACKEND === 'supermemory'
  ? supermemoryAdapter
  : localMemoryAdapter;  // default: local JSON

export function buildMemoryTools(backend) {
  return [
    {
      name: 'memory.search',
      handler: async (args) => backend.search(args.query, { limit: args.limit }),
    },
    {
      name: 'memory.ingest',
      handler: async (args) => {
        // Local redaction luôn chạy, dù backend là gì
        return backend.ingest({
          content: redactText(args.content),
          kind: args.kind,
          scope: args.scope,
          source: args.source || 'runtime-mcp',
          tags: args.tags,
        });
      },
    },
  ];
}
```

**Bước 3**: Config qua env var:

```bash
# .env
MEMORY_BACKEND=supermemory
SUPERMEMORY_API_KEY=sm_xxx...
MEMORY_LOCAL_FALLBACK=true  # nếu cloud fail, fallback về local JSON
```

### So sánh các provider

| Provider | Self-host | Cost | Tốt cho |
|----------|-----------|------|---------|
| **Local JSON** (mặc định) | ✅ | Free | Solo dev, privacy-critical |
| **Local SQLite + FTS5** | ✅ | Free | Solo/small team, full-text search |
| **Local + sqlite-vec** | ✅ | Free | Solo, vector search offline |
| **supermemory** (hosted) | ❌ | $0-$99/mo | Multi-device sync, hosted search |
| **Claude-mem** (local daemon) | ✅ | Free | Claude Code integration sâu |
| **Qdrant** (self-host) | ✅ | Free (infra cost) | Team, scale, vector |
| **Pinecone** (hosted) | ❌ | $0-$70/mo | Team, scale, zero-ops |
| **pgvector** (Postgres extension) | ✅ | Free (DB cost) | Team, đã dùng Postgres |

### Quyết định nên dùng

- **Privacy-critical** (y tế, pháp lý, tài chính): local SQLite + FTS5, không bao giờ gửi ra ngoài.
- **Multi-device sync** (laptop + phone + work PC): supermemory hoặc hosted Qdrant.
- **Team scale** (5+ người, nhiều project): self-host Qdrant hoặc pgvector.
- **Quick start**: supermemory, 5 phút setup, có dashboard.

---

## 4. AI tự quyết không cần human

**Triết lý của Vibe Coding OS** (`CONSTITUTION.md` principle 1):

> **Human intent stays sovereign.** The assistant proposes; it does not invent
> requirements or silently expand scope.

### Tại sao repo này **CHỌN** không làm AI tự quyết

```javascript
// Đây không phải limitation, đây là feature.
// Lý do:

// 1. Hallucination — AI tin nó đúng khi nó sai
const aiProposes = "Tôi nghĩ user muốn thêm OAuth + 2FA + WebAuthn"
// Reality: user chỉ muốn OAuth cơ bản
// AI tự quyết → scope creep, mất thời gian, mất trust

// 2. Blast radius — AI tự quyết destructive action
const aiAutonomously = "rm -rf node_modules && npm install"
// Reality: ai không hiểu project có custom fork, mất 2 giờ setup lại
// Nếu có approval gate: user thấy "Xóa toàn bộ deps?", dừng lại

// 3. Accountability — khi AI sai, ai chịu trách nhiệm?
// Vibe Coding OS: con người chịu, vì con người approve cuối cùng
// "AI tự quyết": không ai chịu, không thể rollback
```

### Nhưng nếu bạn VẪN cần AI tự quyết (chấp nhận rủi ro)

Đây là pattern **"Human-on-the-loop"** thay vì **"Human-in-the-loop"**:

```javascript
// runtime/core/auto-approve.mjs
export function createAutoApprover(policy) {
  return {
    // Auto-approve khi:
    // - Risk level = 'safe' hoặc 'review' VÀ
    // - Action nằm trong whitelist VÀ
    // - Không phải destructive command
    
    shouldAutoApprove(action, risk) {
      if (risk?.level === 'dangerous' || risk?.level === 'blocked') return false;
      if (DESTRUCTIVE_ACTIONS.has(action)) return false;
      return policy.autoApproveActions.has(action);
    },
    
    async handle(action, context) {
      if (this.shouldAutoApprove(action, context.risk)) {
        // Log vàng — chỉ audit, không dừng
        await logAutoApproval(action, context);
        return { status: 'auto-approved', actor: 'auto-approver' };
      }
      // Ngược lại: yêu cầu human
      return await createPendingApproval(action, context);
    },
  };
}

const DESTRUCTIVE_ACTIONS = new Set([
  'git push', 'npm publish', 'rm', 'rmdir', 'drop table',
  'kubectl delete', 'terraform destroy', 'docker system prune',
  'release.publish',
]);

const policy = {
  autoApproveActions: new Set([
    'file.read', 'file.write',  // file ops trong workspace
    'npm.test', 'npm.lint',     // local validation
    'git.add', 'git.commit',    // local commit
    // KHÔNG auto-approve: git push, npm publish, rm
  ]),
};
```

**Trade-off chính**:

| Mode | Tốc độ | Rủi ro | Khi nào dùng |
|------|--------|--------|--------------|
| Human-in-loop (mặc định) | Chậm | Thấp | Production, code critical |
| Human-on-loop (auto-approve) | Trung bình | Trung bình | Local dev, scratch work |
| No-loop (fully autonomous) | Nhanh | Cao | Demo, throwaway experiment |

**Khuyến nghị**: Bắt đầu với default. Khi bạn đã tin tưởng AI với task X, thêm X vào
`autoApproveActions`. Luôn giữ destructive actions ngoài whitelist.

### Vibe Coding OS đã có sẵn approval gate — bạn chỉ cần bật auto-mode

```javascript
// runtime/mcp/server.mjs
import { withApprovalGate, requiresApproval } from '../core/approval-gate.mjs';

const AUTO_APPROVE = process.env.VIBE_AUTO_APPROVE === 'true';

export function startServer() {
  // ... tool definitions
  
  // Wrap mỗi tool với gate
  for (const tool of buildTools(store)) {
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const handler = tool.handler;
      
      if (AUTO_APPROVE && !DESTRUCTIVE_ACTIONS.has(tool.name)) {
        // Skip approval gate cho non-destructive
        return await handler(request.params.arguments);
      }
      
      // Mặc định: qua gate
      return await withApprovalGate(handler, store, tool.name)(
        request.params.arguments
      );
    });
  }
}
```

---

## 5. Thay thế GitHub Branch Protection / Secret Scanner

**Repo này là LỚP BỔ TRỢ, không phải THAY THẾ**. Đây không phải limitation, đây là
**separation of concerns**.

### Sơ đồ tích hợp

```
                    ┌─────────────────────────────────────┐
                    │  GitHub Platform (BẮT BUỘC)         │
                    │  - Branch protection rules          │
                    │  - Required reviews                 │
                    │  - Secret scanning (native)         │
                    │  - Dependabot                       │
                    └─────────────────────────────────────┘
                                       ▲
                                       │ events (push, PR)
                                       │
                    ┌─────────────────────────────────────┐
                    │  Vibe Coding OS (BỔ TRỢ)            │
                    │  - Pre-commit: validate-injection   │
                    │  - Pre-commit: validate-secrets     │
                    │  - Pre-commit: validate-skill-quality│
                    │  - Quality scorecard                │
                    │  - Approval gate                    │
                    └─────────────────────────────────────┘
                                       ▲
                                       │ dev commit
                                       │
                    ┌─────────────────────────────────────┐
                    │  Dev's machine                      │
                    │  - Husky / pre-commit hook          │
                    │  - gitleaks (extra secret scan)     │
                    │  - Local npm scripts                │
                    └─────────────────────────────────────┘
```

### Setup pre-commit hook

```bash
# Cài husky + lint-staged
npm install --save-dev husky lint-staged
npx husky init

# .husky/pre-commit
#!/usr/bin/env bash
set -e

# Layer 1: Vibe Coding OS validation
echo "🛡 Running Vibe Coding OS pre-commit validation..."
node scripts/validate-injection.mjs  # chặn prompt injection
node scripts/validate-secrets.mjs    # chặn secret leak
node scripts/validate-skill-quality.mjs  # chặn skill chất lượng thấp

# Layer 2: External secret scan
echo "🔍 Running gitleaks..."
gitleaks protect --staged --redact

# Layer 3: Format & lint
npx lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "*.{js,mjs,ts}": ["eslint --fix", "prettier --write"],
    "*.md": ["prettier --write"],
    "*.{json,yaml,yml}": ["prettier --write"]
  }
}
```

### GitHub Actions workflow

```yaml
# .github/workflows/vibe-quality.yml
name: Vibe Coding OS Quality Gate

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Vibe Coding OS validate:all
        run: npm run validate:all
      
      - name: Security regression
        run: npm run security:regression
      
      - name: Quality scorecard
        run: npm run quality:scorecard:report
      
      - name: Comment PR with scorecard
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('docs/reports/quality-scorecard.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: report
            });
```

### GitHub Branch Protection (UI / API)

```bash
# Set qua gh CLI
gh api repos/OWNER/REPO/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["validate:all","security:regression"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"dismiss_stale_reviews":true,"required_approving_review_count":2,"require_code_owner_reviews":true}' \
  --field restrictions='{"users":[],"teams":["maintainers"]}'
```

### gh-secret-scanning bổ sung (ngoài GitHub native)

```yaml
# .github/workflows/secret-scan.yml
name: Secret Scan
on: [push, pull_request]
jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Defense in depth: 5 layers

| Layer | Tool | Chặn |
|-------|------|------|
| 1. Editor | `.vscode/settings.json` secret detection | Real-time khi gõ |
| 2. Pre-commit | `validate-secrets.mjs` + gitleaks | Local commit |
| 3. Pre-push | `validate:injection` + `quality:scorecard` | Local push |
| 4. CI | GitHub Actions + gitleaks + validate:all | Trước merge |
| 5. Platform | GitHub branch protection + secret scanning | Sau merge |

**Vibe Coding OS chỉ chiếm layer 2-3 (dev-time).** Layer 1, 4, 5 thuộc về editor
và GitHub platform.

---

## Tổng kết

| Vấn đề | "Fix" bằng Vibe Coding OS | "Fix" bằng công cụ ngoài |
|--------|--------------------------|--------------------------|
| 1. Distributed lock | Chỉ đủ cho 1 máy | SQLite WAL / Redis / Postgres |
| 2. Sandbox OS | Không | Docker / firejail / E2B |
| 3. Hosted memory | Adapter interface có sẵn | supermemory / Qdrant / pgvector |
| 4. AI tự quyết | Anti-pattern by design | Auto-approve policy (có sẵn gate) |
| 5. GitHub security | Bổ trợ, không thay thế | gh CLI + gitleaks + branch protection |

**Triết lý**: Vibe Coding OS cung cấp **khung kiến trúc (architecture framework)**
và **workflow contract**. Nó tích hợp với các công cụ chuyên dụng qua interface
đã định nghĩa, không cố gắng làm tất cả. Đây là design principle tốt: mỗi tool
làm tốt một việc, ghép lại thành hệ thống tổng thể.

---

*Xem file HTML kèm theo để có visualization dark-theme với code samples, decision
trees, và so sánh chi tiết.*
