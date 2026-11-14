const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const {createBilling}=await import('../supabase/functions/_shared/billing-core.mjs'),catalog=JSON.parse(fs.readFileSync('supabase/billing-live-prices.json','utf8'));
 const uid='account',customer='cus_bound',paidAt=1794614400,now=paidAt*1000;
 let proof,events=[],dbFail=false,variant={};
 const service=createBilling({catalog,environment:'live',configured:()=>true,now:()=>now,user:async()=>({id:uid}),db:async(action,data)=>{
  events.push(action);if(action==='sessions')return[{session_id:'cs_live_paid',item:'monthly',price_id:catalog.subscription.price_id}];
  if(action==='content_activate'){if(dbFail)throw Error('storage outage');proof=data;}
 },stripe:async(method,path)=>{
  if(path.includes('line_items'))return{data:[{quantity:1,price:{id:catalog.subscription.price_id,livemode:true,currency:'aud',unit_amount:499}}]};
  if(path.startsWith('checkout/sessions/'))return{livemode:true,customer,client_reference_id:uid,metadata:{break_room_user:uid,break_room_item:'monthly'},currency:'aud',status:'complete',payment_status:'paid',mode:'subscription',subscription:'sub_paid'};
  if(path.startsWith('subscriptions/'))return{livemode:true,id:'sub_paid',customer,items:{data:[{price:{id:catalog.subscription.price_id},quantity:1}]},current_period_end:paidAt+86400,status:'active',latest_invoice:{id:'in_paid',livemode:true,customer,subscription:'sub_paid',status:'paid',amount_paid:499,payment_intent:'pi_paid',status_transitions:{paid_at:paidAt},...variant}};
  if(path.startsWith('payment_intents/'))return{id:'pi_paid',livemode:true,status:'succeeded',latest_charge:{livemode:true,paid:true,refunded:false,amount_refunded:0,amount:499}};
  if(path.startsWith('disputes?'))return{data:[],has_more:false};throw Error(path);
 }});
 for(const wrong of [{amount_paid:0},{status:'open'},{livemode:false},{status_transitions:{}},{payment_intent:null},{customer:'cus_other'},{subscription:'sub_other'},{status_transitions:{paid_at:paidAt+10000}}]){
  variant=wrong;proof=null;await service.reconcile({user_id:uid,customer_id:customer},{});assert.equal(proof,null);
 }
 variant={};await service.reconcile({user_id:uid,customer_id:customer},{});assert.equal(proof.invoice_id,'in_paid');assert.equal(proof.amount_paid,499);
 dbFail=true;events=[];await assert.rejects(()=>service.reconcile({user_id:uid,customer_id:customer},{}),/storage outage/);assert(!events.includes('snapshot'),'Failure retries instead of claiming reconciliation completed');
 console.log('Only verified positive live monthly payments activate; trigger failures remain retryable.');
})().catch(e=>{console.error(e);process.exitCode=1});
