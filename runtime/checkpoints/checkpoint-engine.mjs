import { makeId, nowIso } from '../core/ids.mjs';
import { CURRENT_SCHEMA_VERSION } from '../core/validation.mjs';
import { readJson, writeJsonAtomic, withLock, emptyCollection } from '../core/fs-store.mjs';
import { appendEvent } from '../core/events.mjs';
import { assertString } from '../core/validation.mjs';
const FILE='checkpoints.json';

function withoutNullish(obj){return Object.fromEntries(Object.entries(obj).filter(([,value])=>value!==null&&value!==undefined));}

export async function listCheckpoints(store){return (await readJson(store,FILE,emptyCollection('checkpoints'))).items;}
async function save(store,items){await writeJsonAtomic(store,FILE,{schemaVersion:CURRENT_SCHEMA_VERSION,kind:'checkpoints',items});}

export async function createCheckpoint(store,input){
  assertString(input.type,'type');
  assertString(input.result,'result');
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
