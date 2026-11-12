// Shared provider-verified billing logic. Live and sandbox use separate runtimes/storage.
export class BillingError extends Error {
 constructor(message,status=503){super(message);this.status=status;}
}
const BASE='https://breakroomdaily.com/billing-test';
const objectId=value=>typeof value==='string'?value:value?.id;
export function createBilling({catalog,stripe,db,user,configured,now=Date.now,environment='sandbox',checkoutEnabled=()=>environment==='sandbox',enforcementEnabled=()=>false,returnURL=BASE}) {
 if(!['sandbox','live'].includes(environment))throw new Error('Unknown billing environment');
 const live=environment==='live';
 const provider=object=>{if(!object||object.livemode!==live)throw new BillingError(live?'Live provider object required':'Sandbox provider object required');return object;};
 const capabilities=()=>({environment,checkout_enabled:checkoutEnabled(),enforcement_enabled:enforcementEnabled(),live_payments:live&&checkoutEnabled()});
 let readyAt=0,readyTask=null;
 const expected=item=>item==='monthly'?catalog.subscription:catalog.games[item];
 async function price(item){
  const spec=expected(item);if(!spec)throw new BillingError('Choose a known plan or game',400);
  const p=provider(await stripe('GET','prices/'+spec.price_id+'?expand[]=product'));
  if(p.active!==true||p.currency!=='aud'||p.unit_amount!==spec.unit_amount||p.product?.active!==true)throw new BillingError('The sandbox price does not match the approved plan');
  if(item==='monthly'?(p.type!=='recurring'||p.recurring?.interval!=='month'||p.recurring?.interval_count!==1||p.product.id!==spec.product_id):(p.type!=='one_time'||p.recurring!==null))throw new BillingError('Incorrect sandbox billing type');
  return spec;
 }
 async function customer(uid,create=false){
  let c=await db('customer_get',{user_id:uid});if(c||!create)return c;
  const created=provider(await stripe('POST','customers',{'metadata[break_room_user]':uid},'br:'+environment+':customer:'+uid));
  c=await db('customer_set',{user_id:uid,customer_id:created.id});
  if(c.customer_id!==created.id)throw new BillingError('Customer mapping mismatch');return c;
 }
 async function locked(c,task){
  const token=crypto.randomUUID(),args={user_id:c.user_id,token};
  await db('lock',args);
  try{return await task(args);}finally{await db('unlock',args).catch(()=>{});}
 }
 async function list(path){
  let out=[],cursor='';
  for(let page=0;page<10;page++){
   const r=await stripe('GET',path+(path.includes('?')?'&':'?')+'limit=100'+(cursor?'&starting_after='+encodeURIComponent(cursor):''));
   if(!Array.isArray(r.data))throw new BillingError('Unexpected provider list');
   out.push(...r.data);if(!r.has_more)return out;
   if(!r.data.length)break;cursor=r.data.at(-1).id;
  }
  throw new BillingError('Provider history exceeds the sandbox verification limit');
 }
 async function paymentValid(paymentIntent){
  if(!paymentIntent)return false;
  const pi=provider(await stripe('GET','payment_intents/'+encodeURIComponent(objectId(paymentIntent))+'?expand[]=latest_charge'));
  if(pi.status!=='succeeded')return false;
  const charge=pi.latest_charge;
  if(!charge||typeof charge==='string'||charge.livemode!==live||charge.paid!==true||charge.refunded===true||charge.amount_refunded>=charge.amount)return false;
  // A won dispute restores access; open/lost disputes suspend it.
  const disputes=await list('disputes?payment_intent='+encodeURIComponent(pi.id));
  return disputes.every(d=>d.livemode===live&&['won','warning_closed'].includes(d.status));
 }
 async function sessionState(row,c){
  const s=provider(await stripe('GET','checkout/sessions/'+encodeURIComponent(row.session_id)));
  if(objectId(s.customer)!==c.customer_id||s.client_reference_id!==c.user_id||s.metadata?.break_room_user!==c.user_id||s.metadata?.break_room_item!==row.item)throw new BillingError('Checkout account binding mismatch');
  const spec=expected(row.item);
  const lines=await list('checkout/sessions/'+encodeURIComponent(row.session_id)+'/line_items');
  if(!spec||row.price_id!==spec.price_id||lines.length!==1||lines[0].quantity!==1||lines[0].price?.id!==spec.price_id||lines[0].price?.livemode!==live||lines[0].price?.currency!=='aud'||lines[0].price?.unit_amount!==spec.unit_amount||s.currency!=='aud')throw new BillingError('Checkout price mismatch');
  const result={session_id:row.session_id,state:s.status==='open'?'pending':'inactive',paid_through:null,cancel_at_period_end:false};
  if(s.status!=='complete'||s.payment_status!=='paid')return result;
  if(row.item!=='monthly'){
   if(s.mode!=='payment'||s.amount_total!==spec.unit_amount)throw new BillingError('Checkout total mismatch');
   if(await paymentValid(s.payment_intent))result.state='active';return result;
  }
  if(s.mode!=='subscription'||!s.subscription)throw new BillingError('Subscription binding missing');
  const sub=provider(await stripe('GET','subscriptions/'+encodeURIComponent(objectId(s.subscription))+'?expand[]=latest_invoice'));
  if(objectId(sub.customer)!==c.customer_id||sub.items?.data?.length!==1||sub.items.data[0].price?.id!==spec.price_id||sub.items.data[0].quantity!==1)throw new BillingError('Subscription plan mismatch');
  const invoice=sub.latest_invoice;
  const through=sub.current_period_end;
  if(!Number.isSafeInteger(through))throw new BillingError('Subscription paid period unavailable');
  result.paid_through=new Date(through*1000).toISOString();result.cancel_at_period_end=sub.cancel_at_period_end===true;
  // A sandbox simulation advances Stripe's clock, not the server's wall clock.
  let evaluatedAt=now();
  if(sub.test_clock){
   if(live)throw new BillingError('Test clocks cannot grant live access');
   const clockId=objectId(sub.test_clock);
   const clock=provider(await stripe('GET','test_helpers/test_clocks/'+encodeURIComponent(clockId)));
   if(clock.id!==clockId||clock.status!=='ready'||!Number.isSafeInteger(clock.frozen_time))throw new BillingError('Stripe simulation is still advancing or unavailable. Retry when it is ready.');
   evaluatedAt=clock.frozen_time*1000;
  }
  result.clock_now=evaluatedAt;
  // Never grant a new period from an unpaid/latest failed invoice or trial.
  if(['active','canceled'].includes(sub.status)&&through*1000>evaluatedAt&&invoice&&typeof invoice!=='string'&&invoice.livemode===live&&invoice.status==='paid'&&invoice.amount_paid>=spec.unit_amount&&await paymentValid(invoice.payment_intent))result.state='active';
  return result;
 }
 function summary(rows){
  const monthly=rows.filter(r=>r.item==='monthly'&&r.state==='active'&&Date.parse(r.paid_through)>(r.clock_now??now())).sort((a,b)=>Date.parse(b.paid_through)-Date.parse(a.paid_through))[0];
  const games=[...new Set(rows.filter(r=>r.item!=='monthly'&&r.state==='active').map(r=>r.item))];
  return {...capabilities(),configured:true,verified:true,has_billing_account:rows.length>0,subscription_active:!!monthly,paid_through:monthly?.paid_through||null,cancel_at_period_end:monthly?.cancel_at_period_end||false,games,ad_free:!!monthly||games.length>0,pending:rows.filter(r=>r.state==='pending').length};
 }
 async function reconcile(c,args){
  const rows=await db('sessions',args);
  if(rows.length>100)throw new BillingError('Sandbox session limit reached');
  const states=[];
  for(let i=0;i<rows.length;i+=4)states.push(...await Promise.all(rows.slice(i,i+4).map(async row=>({...row,...await sessionState(row,c)}))));
  await db('snapshot',{...args,rows:states});return {rows:states,status:summary(states)};
 }
 async function action(uid,body){
  if(body.action==='checkout'&&!checkoutEnabled())throw new BillingError('Purchases have not launched yet',403);
  if(!configured()){if(environment==='live'&&body.action==='status')return {...capabilities(),configured:false,verified:false};throw new BillingError('Sandbox billing setup is incomplete');}
  if(!['status','checkout','portal'].includes(body.action))throw new BillingError('Unknown billing action',400);
  if(body.action==='checkout'&&(!expected(body.item)||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.request_id||'')))throw new BillingError('Choose a known item and request ID',400);
  const c=await customer(uid,body.action==='checkout');
  if(!c){if(body.action==='status')return summary([]);throw new BillingError('No billing account is available yet',400);}
  return locked(c,async args=>{
   const {rows,status}=await reconcile(c,args);
   if(body.action==='status')return status;
   if(body.action==='portal'){
    let configuration=await db('setting_get',{key:'portal_config'});
    if(!configuration){
     const p=await stripe('POST','billing_portal/configurations',{'business_profile[headline]':live?'Break Room':'Break Room sandbox','features[customer_update][enabled]':'false','features[invoice_history][enabled]':'true','features[payment_method_update][enabled]':'true','features[subscription_cancel][enabled]':'true','features[subscription_cancel][mode]':'at_period_end'},'br:'+environment+':portal-config:v1');
     provider(p);configuration=await db('setting_set',{key:'portal_config',value:p.id});
    }
    const portal=await stripe('POST','billing_portal/sessions',{customer:c.customer_id,configuration,return_url:returnURL});
    return {url:trustedURL(portal.url,'billing.stripe.com')};
   }
   const spec=await price(body.item);
   if((body.item==='monthly'&&status.subscription_active)||(body.item!=='monthly'&&status.games.includes(body.item)))throw new BillingError('This account already has that purchase',409);
   // Reuse an existing open session to prevent double purchases across tabs.
   const pending=rows.find(r=>r.item===body.item&&r.state==='pending');
   if(pending){const s=provider(await stripe('GET','checkout/sessions/'+pending.session_id));return {url:trustedURL(s.url,'checkout.stripe.com')};}
   if(rows.length>=100)throw new BillingError('Sandbox session limit reached',429);
   const params=checkoutParams(uid,c.customer_id,body.item,spec.price_id,returnURL);
   const s=provider(await stripe('POST','checkout/sessions',params,'br:'+environment+':checkout:'+uid+':'+body.item+':'+body.request_id));
   if(s.status!=='open'||objectId(s.customer)!==c.customer_id)throw new BillingError('Unexpected Checkout session');
   await db('session_add',{...args,session_id:s.id,item:body.item,price_id:spec.price_id});
   return {url:trustedURL(s.url,'checkout.stripe.com')};
  });
 }
 async function event(eventId){
  const e=provider(await stripe('GET','events/'+encodeURIComponent(eventId)));
  let obj=e.data?.object;if(!obj)throw new BillingError('Provider event object missing');
  let cid=objectId(obj.customer);
  if(!cid&&e.type.startsWith('charge.dispute.')){const charge=provider(await stripe('GET','charges/'+encodeURIComponent(objectId(obj.charge))));cid=objectId(charge.customer);}
  const c=cid?await db('customer_lookup',{customer_id:cid}):null;
  if(c)await locked(c,args=>reconcile(c,args));
  await db('event_done',{event_id:eventId});
 }
 async function handler(request){
  const origin=request.headers.get('origin'),origins=['https://breakroomdaily.com','https://break-room.phillipsphoenix09.workers.dev','https://phoenix6716.github.io'];
  const headers={'Access-Control-Allow-Origin':origins.includes(origin)?origin:origins[0],'Access-Control-Allow-Headers':'authorization,apikey,content-type','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Cache-Control':'no-store','Vary':'Origin'};
  const json=(body,status=200)=>Response.json(body,{status,headers});
  if(origin&&!origins.includes(origin))return json({error:'Origin not allowed'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(request.method==='GET'){
   if(!configured())return json({...capabilities(),configured:false});
   try{
    if(!readyAt||now()-readyAt>300000){
     if(!readyTask)readyTask=Promise.all([price('monthly'),db('setting_get',{key:'readiness_probe'})]).then(()=>{readyAt=now();}).finally(()=>{readyTask=null;});
     await readyTask;
    }
    return json({...capabilities(),configured:true});
   }catch{return json({...capabilities(),configured:false,error:'Billing provider or storage check failed'},503);}
  }
  if(request.method!=='POST')return json({error:'POST required'},405);
  try{
   if(Number(request.headers.get('content-length'))>4096)throw new BillingError('Request too large',413);
   const actor=await user(request.headers.get('authorization'));
   if(!actor?.id||actor.is_anonymous===true)throw new BillingError('Please sign in to test checkout',401);
   const raw=await request.text();if(raw.length>4096)throw new BillingError('Request too large',413);
   let body;try{body=JSON.parse(raw);}catch{throw new BillingError('Invalid request',400);}
   if(!body||typeof body!=='object'||Array.isArray(body))throw new BillingError('Invalid request',400);
   // Only verified Auth user.id is passed to billing. Browser IDs/amounts ignored.
   return json(await action(actor.id,body));
  }catch(error){return json({error:error instanceof BillingError?error.message:'Billing could not be verified. Please retry shortly.'},error instanceof BillingError?error.status:503);}
 }
 return {handler,action,event,reconcile,sessionState,paymentValid};
}
export function trustedURL(value,hostname){
 let u;try{u=new URL(value);}catch{throw new BillingError('Provider redirect unavailable');}
 if(u.protocol!=='https:'||u.hostname!==hostname||u.username||u.password||u.port)throw new BillingError('Provider redirect rejected');return u.href;
}

// Sandbox uses the standard Checkout/Portal flow. Explicitly opt out per session
// because new Stripe accounts may default to the separate Managed Payments flow.
export function checkoutParams(uid,customer,item,priceId,baseURL=BASE){
 return {mode:item==='monthly'?'subscription':'payment',customer,client_reference_id:uid,
  'metadata[break_room_user]':uid,'metadata[break_room_item]':item,
  'line_items[0][price]':priceId,'line_items[0][quantity]':'1',
  'managed_payments[enabled]':'false',success_url:baseURL+'?returned=1',
  cancel_url:baseURL+'?canceled=1','allow_promotion_codes':'false'};
}
