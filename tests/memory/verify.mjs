// verify.mjs — full verification suite for the local memory appliance.
import assert from 'node:assert';
import { rmSync, mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { embed, cosine } from '../../runtime/memory-local/embed.mjs';
import { redact, hasSecret } from '../../runtime/memory-local/redact.mjs';
import { chunk } from '../../runtime/memory-local/chunk.mjs';
import { createStore } from '../../runtime/memory-local/store.mjs';
import { search, contextPack } from '../../runtime/memory-local/retrieve.mjs';
import { ingestRepo, ingestRecords, ingestSessionSummaries } from '../../runtime/memory-local/ingest.mjs';
import { buildTools } from '../../runtime/mcp/memory-server.mjs';

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); pass++; console.log(`  PASS ${name}`); }
  catch (e) { fail++; console.log(`  FAIL ${name}: ${e.message}`); }
}
const fresh = () => mkdtempSync(join(tmpdir(), 'vibemem-'));

console.log('embed');
t('deterministic', () => assert.deepStrictEqual(embed('hello world'), embed('hello world')));
t('normalized', () => { const v = embed('abc def'); const n = Math.sqrt(v.reduce((s,x)=>s+x*x,0)); assert.ok(Math.abs(n-1)<1e-9); });
t('self-cosine ~1', () => { const v = embed('auth middleware'); assert.ok(cosine(v,v) > 0.999); });
t('related > unrelated', () => {
  const q = embed('token refresh cookie');
  const rel = cosine(q, embed('token refresh failed on expired cookie'));
  const unrel = cosine(q, embed('calculate tax amount percentage'));
  assert.ok(rel > unrel, `rel ${rel} <= unrel ${unrel}`);
});

console.log('redact');
t('api key', () => assert.ok(hasSecret('sk-ABCDEFGHIJKLMNOP1234')));
t('email', () => assert.strictEqual(redact('a@b.com').redactions, 1));
t('jwt', () => assert.ok(hasSecret('eyJhbGciOi.eyJzdWIiOi.SflKxwRJSM')));
t('clean text untouched', () => assert.strictEqual(redact('just normal text').redactions, 0));

console.log('chunk');
t('short stays whole', () => assert.strictEqual(chunk('small text').length, 1));
t('long splits', () => assert.ok(chunk('a\n'.repeat(2000)).length > 1));
t('code mode', () => assert.ok(chunk('function a(){}\nfunction b(){}', 'code').length >= 1));

console.log('store');
t('upsert + dedup', () => {
  const s = createStore(fresh());
  assert.strictEqual(s.upsert({text:'x decision', source:'a'}).status, 'added');
  assert.strictEqual(s.upsert({text:'x decision', source:'a'}).status, 'duplicate');
});
t('redaction on persist', () => {
  const s = createStore(fresh());
  const r = s.upsert({text:'token=supersecretvalue99', source:'log'});
  assert.ok(r.redactions >= 1);
  assert.ok(!s.getText(r.id).includes('supersecretvalue99'));
});
t('forget', () => {
  const s = createStore(fresh());
  s.upsert({text:'keep me', source:'keep'});
  s.upsert({text:'drop me', source:'drop'});
  assert.strictEqual(s.forget((e)=>e.source==='drop'), 1);
  assert.strictEqual(s.status().count, 1);
});
t('mark stale', () => {
  const s = createStore(fresh());
  s.upsert({text:'old fact', source:'x', metadata:{path:'a.js'}});
  assert.strictEqual(s.markStale((e)=>e.metadata.path==='a.js'), 1);
  assert.strictEqual(s.status().stale, 1);
});
t('audit trail grows', () => {
  const s = createStore(fresh());
  s.upsert({text:'audit me', source:'s'});
  const log = readFileSync(s.paths.audit, 'utf8').trim().split('\n').filter(Boolean);
  assert.ok(log.length >= 1);
  assert.ok(JSON.parse(log[0]).action === 'upsert');
});

console.log('retrieve');
function seeded() {
  const s = createStore(fresh());
  s.upsert({text:'Decision: auth middleware stays in src/server/auth.ts', source:'session:1', scope:'doc'});
  s.upsert({text:'Bug: token refresh failed on expired cookie', source:'session:2', scope:'doc'});
  s.upsert({text:'We picked SQLite over Postgres for local memory', source:'session:3', scope:'doc'});
  s.upsert({text:'function calculateTax(a){return a*0.1}', source:'repo:tax.js', scope:'code'});
  return s;
}
t('auth query -> auth result', () => {
  const r = search(seeded(), 'where is auth middleware', { k: 1 });
  assert.strictEqual(r[0].source, 'session:1');
});
t('token query -> token result', () => {
  const r = search(seeded(), 'token refresh cookie expired', { k: 1 });
  assert.strictEqual(r[0].source, 'session:2');
});
t('scope filter code', () => {
  const r = search(seeded(), 'tax', { scope: 'code' });
  assert.ok(r.every((x)=>x.scope==='code'));
});
t('excludes stale by default', () => {
  const s = seeded();
  s.markStale((e)=>e.source==='session:2');
  const r = search(s, 'token refresh cookie', { k: 5 });
  assert.ok(!r.find((x)=>x.source==='session:2'));
});
t('context pack respects budget', () => {
  const p = contextPack(seeded(), 'auth token sqlite', { budget: 200 });
  assert.ok(p.used_chars <= 400);
  assert.ok(p.entries.length >= 1);
});
t('empty store -> graceful', () => {
  assert.deepStrictEqual(search(createStore(fresh()), 'anything'), []);
});

console.log('ingest');
t('records all source types', () => {
  const s = createStore(fresh());
  const r = ingestRecords(s, [
    {text:'PR #42 add rate limit', source:'pr:42'},
    {text:'Issue #7 token bug', source:'issue:7'},
    {text:'tool edit diff', source:'tool:log'},
  ]);
  assert.strictEqual(r.added, 3);
});
t('repo ingest code+docs', () => {
  const root = fresh();
  mkdirSync(join(root,'src'),{recursive:true});
  writeFileSync(join(root,'src','a.js'),'function hello(){return 1}');
  writeFileSync(join(root,'README.md'),'# Title\nsome docs');
  writeFileSync(join(root,'data.bin'),'xxxx');
  const s = createStore(root);
  const r = ingestRepo(s, root);
  assert.ok(r.added >= 2);
  const sc = s.status().by_source;
  assert.ok(Object.keys(sc).some((k)=>k.startsWith('repo:')));
});
t('session summaries', () => {
  const root = fresh();
  const dir = join(root,'sessions'); mkdirSync(dir,{recursive:true});
  writeFileSync(join(dir,'s1.md'),'Decision: use MCP for memory access');
  const s = createStore(root);
  assert.strictEqual(ingestSessionSummaries(s, dir).added, 1);
});

console.log('mcp tools');
t('8 tools exposed', () => assert.strictEqual(buildTools(fresh()).length, 8));
t('tool handlers run', () => {
  const tools = buildTools(fresh());
  const ingest = tools.find(x=>x.name==='memory_ingest_records');
  ingest.handler({ records: [{text:'mcp end to end memory', source:'t'}] });
  const srch = tools.find(x=>x.name==='memory_search');
  const res = srch.handler({ query: 'memory', k: 3 });
  assert.ok(res.length >= 1);
});
t('context_pack tool', () => {
  const tools = buildTools(fresh());
  tools.find(x=>x.name==='memory_ingest_records').handler({records:[{text:'auth decision here',source:'t'}]});
  const pack = tools.find(x=>x.name==='memory_context_pack').handler({query:'auth', budget: 1000});
  assert.ok(pack.context.includes('auth'));
});
t('forget tool', () => {
  const tools = buildTools(fresh());
  tools.find(x=>x.name==='memory_ingest_records').handler({records:[{text:'a',source:'drop:1'},{text:'b',source:'keep:1'}]});
  const r = tools.find(x=>x.name==='memory_forget').handler({sourcePrefix:'drop:'});
  assert.strictEqual(r.removed, 1);
});

console.log(`\n=== ${pass} passed, ${fail} failed ===`);
process.exit(fail ? 1 : 0);
