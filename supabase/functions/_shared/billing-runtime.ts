import catalog from './catalog.json' with {type:'json'};
import {BillingError,createBilling} from './billing-core.mjs';
const key=Deno.env.get('STRIPE_SECRET_KEY');
const webhookSecret=Deno.env.get('STRIPE_WEBHOOK_SECRET');
const url=Deno.env.get('SUPABASE_URL');
const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const anon=Deno.env.get('SUPABASE_ANON_KEY');
export const billing=createBilling({
 catalog,
 configured:()=>!!(key?.startsWith('sk_test_')&&webhookSecret?.startsWith('whsec_')&&url&&service&&anon),
 stripe:async(method:string,path:string,params?:Record<string,string>,idempotency?:string)=>{
  if(!key?.startsWith('sk_test_'))throw new BillingError('Stripe sandbox key required');
  const headers:Record<string,string>={Authorization:'Bearer '+key,'Stripe-Version':'2025-02-24.acacia'};
  if(idempotency)headers['Idempotency-Key']=idempotency;
  if(params)headers['Content-Type']='application/x-www-form-urlencoded';
  const response=await fetch('https://api.stripe.com/v1/'+path,{method,headers,body:params?new URLSearchParams(params):undefined,signal:AbortSignal.timeout(15000)});
  // Do not forward raw Stripe errors: an invalid-key message can contain a key.
  if(!response.ok){
   const details=await response.json().catch(()=>({}));
   const safe=(value:unknown)=>typeof value==='string'&&/^[a-zA-Z0-9_.\[\]-]{1,100}$/.test(value)?value:undefined;
   // Only fixed resource names and machine codes: never log raw error messages,
   // request bodies, customer IDs, authorization headers or secret values.
   console.error(JSON.stringify({event:'stripe_sandbox_request_failed',method,
    resource:path.startsWith('checkout/sessions')?'checkout/sessions':path.split('/')[0],
    status:response.status,type:safe(details.error?.type),code:safe(details.error?.code),
    param:safe(details.error?.param),request_id:safe(response.headers.get('request-id'))}));
   throw new BillingError('Stripe sandbox request failed. Please retry or contact support.');
  }
  return response.json();
 },
 db:async(action:string,data:Record<string,unknown>)=>{
  if(!url||!service)throw new BillingError('Billing storage is unavailable');
  const response=await fetch(url+'/rest/v1/rpc/billing_sandbox_server',{method:'POST',headers:{apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json'},body:JSON.stringify({p_action:action,p_data:data}),signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new BillingError('Billing is busy or unavailable. Please retry shortly.');
  return response.json();
 },
 user:async(authorization:string|null)=>{
  if(!authorization?.startsWith('Bearer ')||!url||!anon)throw new BillingError('Please sign in to test checkout',401);
  const response=await fetch(url+'/auth/v1/user',{headers:{apikey:anon,Authorization:authorization},signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new BillingError('Please sign in again',401);
  return response.json();
 }
});
