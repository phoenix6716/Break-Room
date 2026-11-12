/* Access decisions are made from fresh server-owned purchase records, never saves. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BREAK_ROOM_MEMBERSHIP_POLICY=api;})(typeof window==='undefined'?globalThis:window,()=>{
 'use strict';
 const games=Object.freeze(['laser','time-drop','clue-ladder','seating-chart','shift-work','codebreak','stack-up','pack','lowball','inner-clock']);
 function hasAccess(status,game,environment='live'){return games.includes(game)&&['live','sandbox'].includes(environment)&&status?.environment===environment&&status.verified===true&&status.configured===true&&(status.subscription_active===true||Array.isArray(status.games)&&status.games.includes(game));}
 function createGuard({enforce,getActor,readStatus,show}){
  let generation=0,pending=null,permit=null;
  const cancel=()=>{generation++;pending=null;permit=null;};
  function allow(game,resume){
   if(!games.includes(game))throw Error('Unknown game');
   if(!enforce)return true;
   const actor=getActor();
   if(permit?.game===game&&permit.actor===actor){permit=null;return true;}
   if(!actor){show('signed-out');return false;}
   if(pending)return false;
   const epoch=generation;show('checking');
   const task=Promise.resolve().then(()=>readStatus()).then(status=>{
    if(epoch!==generation||actor!==getActor())return;
    if(status.environment!=='live'||status.verified!==true||status.configured!==true)throw Error('Purchase status could not be verified.');
    if(hasAccess(status,game)){
     permit={game,actor};show('allowed');resume();permit=null;
    }else show('required');
   }).catch(()=>{if(epoch===generation&&actor===getActor())show('unavailable');}).finally(()=>{if(pending===task)pending=null;});
   pending=task;return false;
  }
  return Object.freeze({allow,cancel,get pending(){return pending;},enforced:enforce});
 }
 return Object.freeze({games,createGuard,hasAccess});
});
