const assert=require('node:assert/strict'),fs=require('node:fs'),{createHmac}=require('node:crypto'),{PGlite}=require('@electric-sql/pglite');
(async()=>{
 const {createHandler}=await import('../supabase/functions/billing-webhook/handler.mjs');
 const secret='whsec_testing_only',timestamp=1800000000,now=timestamp*1000;
 const event={id:'evt_test123',type:'checkout.session.completed',created:timestamp,livemode:false,data:{object:{id:'cs_test_123',customer_email:'private@example.com'}}};
 let saved=[];
 const handler=createHandler({secret,now:()=>now,enqueue:async row=>saved.push(row)});
 const request=(value=event,{offset=0,signSecret=secret,raw}={})=>{const body=raw??JSON.stringify(value),t=timestamp+offset;return new Request('https://example.com',{method:'POST',headers:{'stripe-signature':`t=${t},v1=${createHmac('sha256',signSecret).update(t+'.'+body).digest('hex')}`},body});};
 assert.equal((await handler(request())).status,200);assert.deepEqual(saved,[{p_event_id:event.id,p_event_type:event.type,p_object_id:'cs_test_123',p_created:timestamp}]);
 assert.equal((await handler(request(event,{offset:-301}))).status,400);
 assert.equal((await handler(request(event,{offset:301}))).status,400);
 assert.equal((await handler(request(event,{signSecret:'wrong'}))).status,400);
 assert.equal((await handler(request({...event,livemode:true}))).status,400);
 assert.equal((await handler(request(event,{raw:'invalid-json'}))).status,400);
 assert.equal((await handler(request({...event,type:'unhandled.test'}))).status,200);assert.equal(saved.length,1);
 assert.equal((await createHandler({secret,now:()=>now,enqueue:async()=>{throw Error('private db error')}})(request())).status,503);
 assert.equal((await createHandler({enqueue:async()=>{}})(request())).status,503);
 let processed=0;
 const processing=createHandler({secret,now:()=>now,enqueue:async()=>{},process:async id=>{assert.equal(id,event.id);processed++;}});
 assert.equal((await processing(request())).status,200);assert.equal(processed,1);
 assert.equal((await createHandler({secret,now:()=>now,enqueue:async()=>{},process:async()=>{throw Error('provider unavailable')}})(request())).status,503);
 const db=new PGlite();
 try {
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
  await db.exec(fs.readFileSync('supabase/migrations/20261109102638_sandbox_billing.sql','utf8'));
  for(const role of ['anon','authenticated']){
   await db.exec('set role '+role);
   await assert.rejects(()=>db.query('select * from br_billing.sandbox_events'),/permission denied/);
   await assert.rejects(()=>db.query("select public.billing_receive_sandbox_event('evt_fake','fake','fake',1)"),/permission denied/);
   await db.exec('reset role');
  }
  await db.exec('set role service_role');
  for(let i=0;i<2;i++)await db.query('select public.billing_receive_sandbox_event($1,$2,$3,$4)',[event.id,event.type,'cs_test_123',timestamp]);
  const rows=(await db.query('select * from br_billing.sandbox_events')).rows;
  assert.equal(rows.length,1);assert.equal(rows[0].processed_at,null);
 }finally{await db.close();}
 console.log('Billing webhook: signature, sandbox guard, retry, minimal storage, role isolation and duplicate delivery passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
