/**
 * score-hallucination.mjs — flags symbols/imports the model used that are
 * NOT in: (a) the task's knownSymbols, or (b) the language stdlib allowlist.
 *
 * Heuristic, language-aware, deliberately conservative: it counts clear
 * invented imports and call targets. Returns { count, symbols }.
 */

const STDLIB = {
  python: new Set([
    'csv','io','os','sys','re','json','math','time','typing','collections',
    'itertools','functools','dataclasses','abc','enum','pathlib','random',
    'string','datetime','StringIO','print','len','range','list','dict','set',
    'tuple','str','int','float','bool','enumerate','zip','map','filter','open',
    'isinstance','sorted','reversed','min','max','sum','any','all','append',
    'split','join','strip','startswith','endswith','replace',
  ]),
  typescript: new Set([
    'console','Math','JSON','Object','Array','String','Number','Boolean',
    'Map','Set','Promise','Date','Error','RegExp','parseInt','parseFloat',
    'length','push','pop','map','filter','reduce','forEach','slice','split',
    'join','includes','indexOf','keys','values','entries',
  ]),
  go: new Set([
    'fmt','strings','strconv','errors','sort','os','io','bufio','bytes',
    'append','len','make','range','print','println','panic','recover',
  ]),
};

function pythonImports(code) {
  const imports = [];
  for (const m of code.matchAll(/^\s*import\s+([\w.]+)/gm)) imports.push(m[1].split('.')[0]);
  for (const m of code.matchAll(/^\s*from\s+([\w.]+)\s+import\s+(.+)$/gm)) {
    imports.push(m[1].split('.')[0]);
  }
  return imports;
}

function tsImports(code) {
  const imports = [];
  for (const m of code.matchAll(/import\s+.*?from\s+['"]([^'"]+)['"]/g)) imports.push(m[1]);
  for (const m of code.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)) imports.push(m[1]);
  return imports;
}

function goImports(code) {
  const imports = [];
  for (const m of code.matchAll(/"([\w./]+)"/g)) {
    if (code.includes('import')) imports.push(m[1].split('/').pop());
  }
  return imports;
}

export function scoreHallucination({ code, task }) {
  const lang = task.language;
  const allow = new Set([...(STDLIB[lang] || []), ...(task.knownSymbols || [])]);
  const flagged = new Set();

  let imports = [];
  if (lang === 'python') imports = pythonImports(code);
  else if (lang === 'typescript') imports = tsImports(code);
  else if (lang === 'go') imports = goImports(code);

  // Third-party / unknown imports are the strongest hallucination signal.
  for (const imp of imports) {
    const base = imp.replace(/^[./]+/, '').split('/')[0];
    if (!allow.has(base) && !base.startsWith('.') && base.length > 0) {
      // builtin-ish names that are fine even if not enumerated:
      if (!(STDLIB[lang] || new Set()).has(base)) flagged.add(`import:${base}`);
    }
  }

  // Calls to names that look like invented helpers (snake/camel) not in allow.
  // Only flag when the task provided knownSymbols (otherwise too noisy).
  if (task.knownSymbols && task.knownSymbols.length) {
    const callTargets = new Set();
    for (const m of code.matchAll(/(?:^|[^.\w])([a-z][a-zA-Z0-9_]{2,})\s*\(/g)) callTargets.add(m[1]);
    const ALWAYS_OK = new Set(['print','range','len','open','sorted','enumerate','main','test']);
    for (const c of callTargets) {
      if (allow.has(c) || ALWAYS_OK.has(c)) continue;
      // defined-in-file functions are fine
      if (new RegExp(`def\\s+${c}\\b|function\\s+${c}\\b|const\\s+${c}\\s*=`).test(code)) continue;
      // Only flag suspicious "retry/backoff/fetch" style invented APIs when
      // a real helper was provided (task.contextFiles present).
      if (task.contextFiles && task.contextFiles.length) flagged.add(`call:${c}`);
    }
  }

  return { count: flagged.size, symbols: [...flagged] };
}
