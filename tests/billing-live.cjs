const assert=require('node:assert/strict'),fs=require('node:fs'),{PGlite}=require('@electric-sql/pglite'),{createHmac}=require('node:crypto');
const uid='00000000-0000-4000-8000-000000000001',token='00000000-0000-4000-8000-000000000002';
(async()=>{
 const {createBilling}=await import('../supabase/functions/_shared/billing-core.mjs'),{createHandler}=await import('../supabase/functions/billing-webhook/handler.mjs');
 const catalog=JSON.parse(fs.readFileSync('supabase/billing-live-prices.json','utf8'));
 assert.deepEqual(JSON.parse(fs.readFileSync('supabase/functions/_shared/live-catalog.json','utf8')),catalog,'Deployed catalogue must match the verified live reference');
 const db=new PGlite();try{
  await db.exec('create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);');
  await db.query('insert into auth.users values($1)',[uid]);
  for(const file of ['20261109102638_sandbox_billing.sql','20261109104937_sandbox_checkout.sql','20261111011927_live_billing_preparation.sql'])await db.exec(fs.readFileSync('supabase/migrations/'+file,'utf8'));
  await db.exec("insert into br_billing.sandbox_customers(user_id,customer_id) values('"+uid+"','cus_sandbox');");
  for(const role of ['anon','authenticated']){
   await db.exec('set role '+role);
   await assert.rejects(()=>db.query("select public.billing_live_server('customer_set','{}')"),/permission denied/);
   await assert.rejects(()=>db.query("select public.billing_receive_live_event('evt_fake','fake','fake',1)"),/permission denied/);
   for(const table of ['live_customers','live_sessions','live_events','live_settings'])await assert.rejects(()=>db.query('select * from br_billing.'+table),/permission denied/);
   await db.exec('reset role');
  }
  await db.exec('set role service_role');
  const call=async(action,data)=>(await db.query('select public.billing_live_server($1,$2) r',[action,JSON.stringify(data)])).rows[0].r;
  assert.equal(await call('customer_get',{user_id:uid}),null,'Sandbox customer never appears in live storage');
  await call('customer_set',{user_id:uid,customer_id:'cus_live'});await call('lock',{user_id:uid,token});
  const args={user_id:uid,token,item:'laser',price_id:catalog.games.laser.price_id};
  await assert.rejects(()=>call('session_add',{...args,session_id:'cs_test_crossed'}),/check constraint/);
  await call('session_add',{...args,session_id:'cs_live_verified'});await call('unlock',{user_id:uid,token});
  assert.equal((await db.query('select count(*)::int n from br_billing.sandbox_sessions')).rows[0].n,0);
  let providerCalls=0;
  const service=createBilling({catalog,environment:'live',checkoutEnabled:()=>false,configured:()=>false,stripe:async()=>{providerCalls++;throw Error('Must not create a live customer or charge')},db:call,user:async()=>({id:uid})});
  assert.equal((await service.action(uid,{action:'status'})).verified,false);
  await assert.rejects(()=>service.action(uid,{action:'checkout',item:'laser',request_id:crypto.randomUUID()}),/not launched/);assert.equal(providerCalls,0);
  const health=await (await service.handler(new Request('https://example.com'))).json();assert.equal(health.live_payments,false);assert.equal(health.enforcement_enabled,false);
  const badMode=createBilling({catalog,environment:'live',configured:()=>true,stripe:async()=>({livemode:false}),db:call,user:async()=>({id:uid})});
  await assert.rejects(()=>badMode.sessionState({session_id:'cs_test_other'},{customer_id:'cus_live',user_id:uid}),/Live provider/);
  const valid=createBilling({catalog,environment:'live',configured:()=>true,checkoutEnabled:()=>false,db:call,user:async()=>({id:uid}),stripe:async(method,path)=>{
   if(path.startsWith('checkout/sessions/')&&path.includes('line_items'))return {data:[{quantity:1,price:{id:catalog.games.laser.price_id,livemode:true,currency:'aud',unit_amount:799}}],has_more:false};
   if(path.startsWith('checkout/sessions/'))return {livemode:true,customer:'cus_live',client_reference_id:uid,metadata:{break_room_user:uid,break_room_item:'laser'},currency:'aud',status:'complete',payment_status:'paid',mode:'payment',amount_total:799,payment_intent:'pi_live'};
   if(path.startsWith('payment_intents/'))return {id:'pi_live',livemode:true,status:'succeeded',latest_charge:{livemode:true,paid:true,refunded:false,amount_refunded:0,amount:799}};
   if(path.startsWith('disputes?'))return {data:[],has_more:false};throw Error(path);
  }});
  const status=await valid.action(uid,{action:'status'});assert.deepEqual(status.games,['laser']);assert.equal(status.environment,'live');assert.equal(status.checkout_enabled,false);assert.equal(status.has_billing_account,true);
  const secret='whsec_only_testing',time=1800000000,body=JSON.stringify({id:'evt_real',created:time,livemode:true,type:'checkout.session.completed',data:{object:{id:'cs_live_verified'}}});
  const sig=`t=${time},v1=${createHmac('sha256',secret).update(time+'.'+body).digest('hex')}`;
  const req=()=>new Request('https://example.com',{method:'POST',headers:{'stripe-signature':sig},body});let seen=0;
  const liveHook=createHandler({secret,environment:'live',now:()=>time*1000,enqueue:async()=>{seen++}}),sandboxHook=createHandler({secret,now:()=>time*1000,enqueue:async()=>{throw Error('Wrong environment')}});
  assert.equal((await liveHook(req())).status,200);assert.equal((await sandboxHook(req())).status,400);assert.equal(seen,1);
 }finally{await db.close();}
 console.log('Live billing preparation: separate PostgreSQL data/roles, test receipt rejection, signed event environment checks, live ownership and disabled checkout/enforcement passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
