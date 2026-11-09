// Raw-body verification precedes parsing. This endpoint queues notifications only;
// it never grants access from browser claims or unverified Stripe payloads.
export const EVENTS = new Set([
 'checkout.session.completed','checkout.session.async_payment_succeeded',
 'checkout.session.async_payment_failed','customer.subscription.created',
 'customer.subscription.updated','customer.subscription.deleted','invoice.paid',
 'invoice.payment_failed','charge.refunded','charge.dispute.created',
 'charge.dispute.updated','charge.dispute.closed'
]);
export async function signatureValid(raw, header, secret, now = Date.now()) {
 if (!secret?.startsWith('whsec_') || !header) return false;
 const fields = header.split(',').map(part => part.trim().split('='));
 const timestamps = fields.filter(([k]) => k === 't').map(([,v]) => v);
 if (timestamps.length !== 1 || !/^\d+$/.test(timestamps[0])) return false;
 const timestamp = Number(timestamps[0]);
 if (!Number.isSafeInteger(timestamp) || Math.abs(now / 1000 - timestamp) > 300) return false;
 const encoder = new TextEncoder();
 const key = await crypto.subtle.importKey('raw', encoder.encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['verify']);
 for (const [kind, value] of fields) {
  if (kind !== 'v1' || !/^[a-fA-F0-9]{64}$/.test(value || '')) continue;
  const bytes = Uint8Array.from(value.match(/../g), hex => parseInt(hex,16));
  if (await crypto.subtle.verify('HMAC', key, bytes, encoder.encode(timestamp + '.' + raw))) return true;
 }
 return false;
}
export function createHandler({secret, enqueue, process, now = Date.now}) {
 return async request => {
  const reply = (body, status) => Response.json(body, {status,headers:{'Cache-Control':'no-store'}});
  if (request.method !== 'POST') return reply({error:'POST required'},405);
  if (!secret?.startsWith('whsec_')) return reply({error:'Webhook setup is incomplete'},503);
  if (Number(request.headers.get('content-length')) > 1048576) return reply({error:'Payload too large'},413);
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > 1048576) return reply({error:'Payload too large'},413);
  if (!await signatureValid(raw,request.headers.get('stripe-signature'),secret,now())) return reply({error:'Invalid signature'},400);
  let event;
  try { event = JSON.parse(raw); } catch { return reply({error:'Invalid JSON'},400); }
  if (event.livemode !== false || !/^evt_[A-Za-z0-9]+$/.test(event.id || '') || !Number.isSafeInteger(event.created)) return reply({error:'Sandbox event required'},400);
  if (!EVENTS.has(event.type)) return reply({received:true,ignored:true},200);
  if (typeof event.data?.object?.id !== 'string' || event.data.object.id.length > 255) return reply({error:'Object ID required'},400);
  try {
   await enqueue({p_event_id:event.id,p_event_type:event.type,p_object_id:event.data.object.id,p_created:event.created});
   if (process) await process(event.id);
   return reply({received:true,queued:true,processed:!!process},200);
  } catch { return reply({error:'Could not process event; retry delivery'},503); }
 };
}
