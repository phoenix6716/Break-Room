const assert=require('node:assert/strict'),fs=require('node:fs'),{PGlite}=require('@electric-sql/pglite');
const {catalogue}=require('../scripts/content-catalog.cjs');
const A='00000000-0000-4000-8000-000000000001',B='00000000-0000-4000-8000-000000000002';
(async()=>{
 const db=new PGlite();try{
 await db.exec('create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create schema br_billing;create table br_billing.live_sessions(user_id uuid,item text,state text,paid_through timestamptz);grant usage on schema br_billing to service_role;grant select on br_billing.live_sessions to service_role;');
 await db.query('insert into auth.users values($1),($2)',[A,B]);
 const migration=fs.readdirSync('supabase/migrations').find(f=>f.endsWith('_account_content_library.sql'));
 await db.exec(fs.readFileSync('supabase/migrations/'+migration,'utf8'));
 for(const role of ['anon','authenticated']){
  await db.exec('set role '+role);
  await assert.rejects(()=>db.query("select public.content_library_server('sync','{}')"),/permission denied/);
  await assert.rejects(()=>db.query('select * from br_content.exposures'),/permission denied/);
  await assert.rejects(()=>db.query('select * from br_content.programme'),/permission denied/);
  await db.exec('reset role');
 }
 await db.exec('set role service_role');
 const call=async(action,data)=>(await db.query('select public.content_library_server($1,$2) value',[action,JSON.stringify(data)])).rows[0].value;
 const args={user_id:A,game:'time-drop',allocate:true};
 const first=await call('sync',args);assert.equal(first.ids.length,100);assert.deepEqual(first.seen,[]);
 assert.deepEqual((await call('sync',args)).ids,first.ids,'Two devices share one selection');
 const shown=await call('shown',{...args,id:first.ids[0]});assert.equal(shown.replay,false);assert.equal(shown.seen.length,1);
 assert.equal((await call('shown',{...args,id:first.ids[0]})).replay,true,'Atomic duplicate exposure is a replay');
 assert.deepEqual((await call('sync',{...args,seen:[first.ids[1],'made-up']})).seen.sort(),first.ids.slice(0,2).sort());
 const newcomer=await call('sync',{...args,user_id:B});assert.equal(newcomer.seen.length,0);assert(newcomer.ids.includes(first.ids[0]),'New subscriber can use old questions');
 await db.query("update br_content.selections set week=week-7 where user_id=$1",[A]);
 const monday=await call('sync',args);assert.equal(monday.ids.length,100);assert(!monday.ids.includes(first.ids[0]));assert.equal(monday.seen.length,2);
 await assert.rejects(()=>call('shown',{...args,id:'bogus'}),/Unknown challenge/);
 assert.equal((await call('sync',{user_id:B,game:'laser',allocate:false})).ids.length,0,'Daily exposure does not assign future Unlimited');
 const proof={environment:'live',item:'monthly',invoice_id:'in_paid',subscription_id:'sub_paid',payment_intent:'pi_paid',amount_paid:499,paid_at:'2026-11-14T00:00:00Z'};
 for(const bad of [{}, {...proof,environment:'sandbox'},{...proof,item:'laser'},{...proof,amount_paid:0},{...proof,payment_intent:null}])await assert.rejects(()=>call('activate',bad));
 await call('activate',proof);await call('activate',{...proof,invoice_id:'in_later'});
 assert.equal((await db.query('select invoice_id from br_content.programme')).rows[0].invoice_id,'in_paid');
 const rows=(await db.query('select game,id,topic,eligible from br_content.catalogue order by game,id')).rows;
 const expected=catalogue().map(r=>({game:r.game,id:r.id,topic:r.group,eligible:r.eligible})).sort((a,b)=>a.game.localeCompare(b.game)||a.id.localeCompare(b.id));
 assert.equal(rows.length,expected.length);const map=new Map(rows.map(r=>[r.game+':'+r.id,r]));for(const row of expected)assert.deepEqual(map.get(row.game+':'+row.id),row);
 await db.exec('reset role');await db.query('delete from auth.users where id=$1',[A]);assert.equal((await db.query('select count(*)::int n from br_content.exposures where user_id=$1',[A])).rows[0].n,0);
 console.log('Private history, shared allocation, migration catalogue, idempotent payment gate and deletion checks passed.');
 }finally{await db.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
