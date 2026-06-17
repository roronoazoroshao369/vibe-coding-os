import { makeId, nowIso } from '../core/ids.mjs';
import { CURRENT_SCHEMA_VERSION } from '../core/validation.mjs';
import { readJson, writeJsonAtomic, withLock, emptyCollection } from '../core/fs-store.mjs';
import { appendEvent } from '../core/events.mjs';
const FILE='sessions.json';
function withoutNullish(obj){return Object.fromEntries(Object.entries(obj).filter(([,value])=>value!==null&&value!==undefined));}
export async function listSessions(store){return (await readJson(store,FILE,emptyCollection('sessions'))).items;}
async function save(store,items){await writeJsonAtomic(store,FILE,{schemaVersion:CURRENT_SCHEMA_VERSION,kind:'sessions',items});}
export async function createSession(store,input){
  return withLock(store,'sessions',async()=>{
    const items=await listSessions(store);
    const item=withoutNullish({
      schemaVersion:CURRENT_SCHEMA_VERSION,
      id:makeId('sess'),
      goal:input.goal||'',
      summary:input.summary||'',
      status:input.status||'active',
      participants:input.participants||[],
      workflowRunIds:input.workflowRunIds||[],
      taskIds:input.taskIds||[],
      memoryIds:input.memoryIds||[],
      checkpointIds:input.checkpointIds||[],
      decisions:input.decisions||[],
      openQuestions:input.openQuestions||[],
      handoff:input.handoff||null,
      createdAt:nowIso(),
      updatedAt:nowIso()
    });
    items.push(item);
    await save(store,items);
    await appendEvent(store,'session.created',{id:item.id,goal:item.goal});
    return item;
  });
}
