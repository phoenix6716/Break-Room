const assert=require('node:assert/strict'),fs=require('node:fs'),{PGlite}=require('@electric-sql/pglite');
const catalog=JSON.parse(fs.readFileSync('supabase/billing-sandbox-prices.json','utf8'));
const UID='00000000-0000-4000-8000-000000000001',OTHER='00000000-0000-4000-8000-000000000002',TOKEN='00000000-0000-4000-8000-000000000003';
(async()=>{
 const {createBilling,trustedURL}=await import('../supabase/functions/_shared/billing-core.mjs');
 const db=new PGlite();
 try{
  await db.exec('create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);');
  await db.query('insert into auth.users values($1),($2)',[UID,OTHER]);
  for(const f of ['20261109102638_sandbox_billing.sql','20261109104937_sandbox_checkout.sql'])await db.exec(fs.readFileSync('supabase/migrations/'+f,'utf8'));
  for(const role of ['anon','authenticated']){
   await db.exec('set role '+role);
   await assert.rejects(()=>db.query("select public.billing_sandbox_server('customer_get','{}')"),/permission denied/);
   for(const table of ['sandbox_customers','sandbox_sessions','sandbox_settings'])await assert.rejects(()=>db.query('select * from br_billing.'+table),/permission denied/);
   await db.exec('reset role');
  }
  await db.exec('set role service_role');
  const callDB=async(action,data)=>(await db.query('select public.billing_sandbox_server($1,$2) result',[action,JSON.stringify(data)])).rows[0].result;
  await callDB('customer_set',{user_id:UID,customer_id:'cus_one'});
  await assert.rejects(()=>callDB('sessions',{user_id:UID}),/lease expired/);
  await callDB('lock',{user_id:UID,token:TOKEN});
  await assert.rejects(()=>callDB('lock',{user_id:UID,token:crypto.randomUUID()}),/busy/);
  const args={user_id:UID,token:TOKEN};
  await callDB('session_add',{...args,session_id:'cs_test_existing',item:'laser',price_id:catalog.games.laser.price_id});
  await assert.rejects(()=>callDB('snapshot',{...args,rows:[]}),/Incomplete/);
  await callDB('unlock',args);await assert.rejects(()=>callDB('snapshot',{...args,rows:[]}),/lease expired/);
  // Start clean for provider contracts, retaining real service-only PostgreSQL RPCs.
  await db.exec('reset role;delete from br_billing.sandbox_sessions;delete from br_billing.sandbox_customers;set role service_role;');
  const objects={},requests=[],now=1800000000000;
  let counter=0,piStatus='succeeded',refunded=false,disputes=[],subStatus='active',invoicePaid=true,periodEnd=now/1000+3600,cancel=false;
  const stripe=async(method,path,params,idem)=>{
   requests.push({method,path,params,idem});
   if(method==='POST'&&path==='customers')return {id:params['metadata[break_room_user]']===UID?'cus_one':'cus_other',livemode:false};
   if(method==='GET'&&path.startsWith('prices/')){const id=path.split('/')[1].split('?')[0],monthly=id===catalog.subscription.price_id,spec=monthly?catalog.subscription:Object.values(catalog.games).find(p=>p.price_id===id);return {id,livemode:false,active:true,currency:'aud',unit_amount:spec.unit_amount,product:{id:monthly?catalog.subscription.product_id:'prod_game',active:true},type:monthly?'recurring':'one_time',recurring:monthly?{interval:'month',interval_count:1}:null};}
   if(method==='POST'&&path==='checkout/sessions'){
    const s={id:'cs_test_'+(++counter),livemode:false,status:'open',payment_status:'unpaid',customer:params.customer,client_reference_id:params.client_reference_id,metadata:{break_room_user:params['metadata[break_room_user]'],break_room_item:params['metadata[break_room_item]']},currency:'aud',amount_total:params.mode==='subscription'?499:799,mode:params.mode,payment_intent:'pi_test',subscription:params.mode==='subscription'?'sub_test':null,url:'https://checkout.stripe.com/c/pay/test',price:params['line_items[0][price]']};objects[s.id]=s;return structuredClone(s);
   }
   const m=path.match(/^checkout\/sessions\/([^/?]+)(\/line_items.*)?$/);
   if(m){const s=objects[m[1]];if(!s)throw Error('missing session');return m[2]?{data:[{quantity:1,price:{id:s.price,livemode:false,currency:'aud',unit_amount:s.amount_total}}],has_more:false}:structuredClone(s);}
   if(path.startsWith('payment_intents/'))return {id:'pi_test',livemode:false,status:piStatus,latest_charge:{id:'ch_test',livemode:false,paid:true,refunded,amount_refunded:refunded?799:0,amount:799}};
   if(path.startsWith('disputes?'))return {data:structuredClone(disputes),has_more:false};
   if(path.startsWith('subscriptions/'))return {id:'sub_test',livemode:false,customer:'cus_one',status:subStatus,cancel_at_period_end:cancel,current_period_end:periodEnd,items:{data:[{quantity:1,price:{id:catalog.subscription.price_id}}]},latest_invoice:{id:'in_test',livemode:false,status:invoicePaid?'paid':'open',amount_paid:invoicePaid?499:0,payment_intent:'pi_sub'}};
   if(path.startsWith('events/'))return {id:path.slice(7),livemode:false,type:'customer.subscription.updated',data:{object:{customer:'cus_one'}}};
   if(path==='billing_portal/configurations')return {id:'bpc_test',livemode:false};
   if(path==='billing_portal/sessions')return {url:'https://billing.stripe.com/p/session/test'};
   throw Error('Unexpected request '+method+' '+path);
  };
  const service=createBilling({catalog,stripe,db:callDB,user:async auth=>auth==='Bearer valid'?{id:UID}:null,configured:()=>true,now:()=>now});
  const checkout=item=>service.action(UID,{action:'checkout',item,request_id:crypto.randomUUID(),user_id:OTHER,amount:1});
  await assert.rejects(()=>checkout('invalid'),/known item/);
  assert.equal(requests.length,0);
  await checkout('laser');assert.equal(counter,1);
  await checkout('laser');assert.equal(counter,1,'Pending session reused across tabs');
  assert.equal(requests.find(r=>r.path==='checkout/sessions'&&r.method==='POST').params.customer,'cus_one');
  assert.deepEqual((await service.action(OTHER,{action:'status'})).games,[],'Another account sees no purchases');
  const s=objects.cs_test_1;s.status='complete';s.payment_status='paid';
  assert.deepEqual((await service.action(UID,{action:'status'})).games,['laser']);
  await assert.rejects(()=>checkout('laser'),/already has/);
  const committed=await callDB('customer_get',{user_id:UID});
  s.customer='cus_other';await assert.rejects(()=>service.action(UID,{action:'status'}),/binding mismatch/);s.customer='cus_one';
  s.price='price_tampered';await assert.rejects(()=>service.action(UID,{action:'status'}),/price mismatch/);s.price=catalog.games.laser.price_id;
  refunded=true;assert.deepEqual((await service.action(UID,{action:'status'})).games,[]);refunded=false;
  disputes=[{livemode:false,status:'needs_response'}];assert.deepEqual((await service.action(UID,{action:'status'})).games,[]);
  disputes=[{livemode:false,status:'lost'}];assert.deepEqual((await service.action(UID,{action:'status'})).games,[]);
  disputes=[{livemode:false,status:'won'}];assert.deepEqual((await service.action(UID,{action:'status'})).games,['laser']);disputes=[];
  await checkout('monthly');const sub=objects.cs_test_2;sub.status='complete';sub.payment_status='paid';
  assert.equal((await service.action(UID,{action:'status'})).subscription_active,true);
  cancel=true;assert.equal((await service.action(UID,{action:'status'})).cancel_at_period_end,true);
  invoicePaid=false;assert.equal((await service.action(UID,{action:'status'})).subscription_active,false);invoicePaid=true;
  subStatus='past_due';assert.equal((await service.action(UID,{action:'status'})).subscription_active,false);
  subStatus='canceled';periodEnd=now/1000-1;
  const expired=await service.action(UID,{action:'status'});assert.equal(expired.subscription_active,false);assert.deepEqual(expired.games,['laser']);assert.equal(expired.ad_free,true);
  await service.event('evt_outoforder');await service.event('evt_outoforder');assert.equal((await service.action(UID,{action:'status'})).subscription_active,false,'Old events reconcile latest provider state');
  assert.equal((await service.action(UID,{action:'portal'})).url,'https://billing.stripe.com/p/session/test');
  const request=(body,auth='Bearer valid',origin='https://breakroomdaily.com')=>new Request('https://example.com',{method:'POST',headers:{authorization:auth,origin},body:JSON.stringify(body)});
  assert.equal((await service.handler(request({action:'status'},'Bearer invalid'))).status,401);
  assert.equal((await service.handler(request({action:'status'},'Bearer valid','https://evil.example'))).status,403);
  assert.equal((await service.handler(request({action:'status',user_id:OTHER}))).status,200);
  assert.throws(()=>trustedURL('https://checkout.stripe.com.evil.example','checkout.stripe.com'),/rejected/);
  assert.throws(()=>trustedURL('https://attacker@checkout.stripe.com','checkout.stripe.com'),/rejected/);
  const disabled=createBilling({catalog,stripe,db:callDB,configured:()=>false});await assert.rejects(()=>disabled.action(UID,{action:'checkout',item:'laser'}),/incomplete/);
  assert.equal(committed.customer_id,'cus_one');
  const health=await service.handler(new Request('https://example.com'));assert.equal(health.status,200);assert.equal((await health.json()).configured,true);
 }finally{await db.close();}
 console.log('Sandbox billing: real SQL role/lease isolation, price/account binding, pending reuse, refunds/disputes, monthly renewal/cancellation/expiry, permanent ownership, duplicate/out-of-order reconciliation and redirects passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
