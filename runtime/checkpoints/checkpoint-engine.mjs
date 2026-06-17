import { makeId, nowIso } from '../core/ids.mjs';
import { CURRENT_SCHEMA_VERSION } from '../core/validation.mjs';
import { readJson, writeJsonAtomic, withLock, emptyCollection } from '../core/fs-store.mjs';
import { appendEvent } from '../core/events.mjs';
import { assertString } from '../core/validation.mjs';
import { Enforcement } from '../core/enforcement.mjs';
const FILE='checkpoints.json';

const enforcement = new Enforcement();
const ALLOWED_CHECKPOINT_INPUT_FIELDS = [
  'type', 'result', 'status', 'subject', 'subjectType', 'subjectId',
  'notes', 'evidence', 'decision', 'resumeHint', 'resume_hint',
  'artifact_refs', 'limitations', 'command', 'phase', 'created_by',
  'metadata', 'extensions', 'source', 'createdBy', 'trace',
];

function withoutNullish(obj){return Object.fromEntries(Object.entries(obj).filter(([,value])=>value!==null&&value!==undefined));}

export async function listCheckpoints(store){return (await readJson(store,FILE,emptyCollection('checkpoints'))).items;}
async function save(store,items){await writeJsonAtomic(store,FILE,{schemaVersion:CURRENT_SCHEMA_VERSION,kind:'checkpoints',items},{enforcement,source:'runtime-checkpoint'});}

export async function createCheckpoint(store,input){
  assertString(input.type,'type');
  assertString(input.result,'result');
  enforcement.assertKnownFields(input, ALLOWED_CHECKPOINT_INPUT_FIELDS, 'checkpoint input');
  // Normalize status: if result is a valid status enum value, use it; otherwise default to 'skipped'
  const statusValues = ['passed', 'failed', 'blocked', 'skipped'];
  const normalizedStatus = statusValues.includes(input.result) ? input.result : (input.status || 'skipped');
  return withLock(store,'checkpoints',async()=>{
    const items=await listCheckpoints(store);
    const item=withoutNullish({
      schemaVersion:CURRENT_SCHEMA_VERSION,
      id:makeId('chk'),
      type:input.type,
      result:input.result,
      subject:input.subject||null,
      subjectType:input.subjectType||null,
      subjectId:input.subjectId||null,
      notes:input.notes||'',
      status:normalizedStatus,
      evidence:input.evidence||(input.artifact_refs?input.artifact_refs.map(r=>({type:'file',ref:r,status:normalizedStatus,timestamp:nowIso()})):[]),
      decision:input.decision||null,
      resumeHint:input.resumeHint||input.resume_hint||null,
      resume_hint:input.resume_hint||input.resumeHint||null,
      artifact_refs:input.artifact_refs||[],
      limitations:input.limitations||null,
      command:input.command||null,
      phase:input.phase||null,
      created_by:input.created_by||null,
      source:input.source||null,
      createdBy:input.createdBy||null,
      trace:input.trace||null,
      createdAt:nowIso(),
      metadata:input.metadata||{},
      extensions:input.extensions||{}
    });
    items.push(item);
    await save(store,items);
    await appendEvent(store,'checkpoint.recorded',{id:item.id,type:item.type,result:item.result,subject:item.subject});
    return item;
  });
}
