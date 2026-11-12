const assert=require('node:assert/strict'),{createGuard,games}=require('../membership-policy.js');
(async()=>{
 const {hasAccess}=require('../membership-policy.js'),test={environment:'sandbox',verified:true,configured:true,subscription_active:false,games:['laser']};
 assert.equal(hasAccess(test,'laser'),false);assert.equal(hasAccess(test,'laser','sandbox'),true);assert.equal(hasAccess(test,'pack','sandbox'),false);assert.equal(hasAccess({...test,verified:false},'laser','sandbox'),false);

 let actor='one',reads=0,shown=[],result={environment:'live',configured:true,verified:true,subscription_active:false,games:[]};
 const free=createGuard({enforce:false,getActor:()=>{throw Error('Free play must not wait for auth')},readStatus:()=>{throw Error('Free play must not fetch billing')},show:()=>{throw Error('No paywall before launch')}});
 for(const game of games)assert.equal(free.allow(game,()=>{}),true);
 const paid=createGuard({enforce:true,getActor:()=>actor,readStatus:async()=>{reads++;return result;},show:value=>shown.push(value)});
 let starts=0;const start=()=>{if(paid.allow('laser',start))starts++;};
 start();await paid.pending;assert.equal(starts,0);assert.equal(shown.at(-1),'required');
 result={...result,games:['laser']};start();await paid.pending;assert.equal(starts,1,'Owned game resumes once');
 result={...result,games:[],subscription_active:true};start();await paid.pending;assert.equal(starts,2,'Monthly membership resumes once');
 result={...result,environment:'sandbox'};start();await paid.pending;assert.equal(starts,2);assert.equal(shown.at(-1),'unavailable','Sandbox receipts cannot grant live game access');
 result={...result,environment:'live',verified:false};start();await paid.pending;assert.equal(starts,2);
 actor=null;start();assert.equal(shown.at(-1),'signed-out');
 let release;actor='one';const delayed=createGuard({enforce:true,getActor:()=>actor,readStatus:()=>new Promise(r=>release=r),show:value=>shown.push(value)});
 let lateStarts=0;delayed.allow('laser',()=>lateStarts++);await Promise.resolve();actor='two';release({environment:'live',configured:true,verified:true,games:['laser']});await delayed.pending;assert.equal(lateStarts,0,'Account switch fences an in-flight purchase response');
 actor='one';delayed.allow('laser',()=>lateStarts++);await Promise.resolve();const pending=delayed.pending;delayed.cancel();release({environment:'live',configured:true,verified:true,games:['laser']});await pending;assert.equal(lateStarts,0,'Choosing Daily cancels a queued Unlimited launch');
 assert.throws(()=>paid.allow('retired-game',()=>{}),/Unknown/);assert(reads>=4);
 console.log('Membership policy: ten free games stay synchronous, verified live ownership only, monthly access, no sandbox grants, signout/account races and canceled launch passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
