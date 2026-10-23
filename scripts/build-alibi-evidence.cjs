/* Evidence-based Alibi files; v1/v2 banks remain frozen for old snapshots. */
const fs=require('node:fs');require('../alibi-model.js');const M=globalThis.BREAK_ROOM_ALIBI;
const kinds=['trace','access','inventory','custody'],people=[['Ben',0],['Dev',1],['Hari',2],['Owen',3],['Ava',4],['Cleo',5],['Gia',6],['Frankie',7]];
const premises={
 trace:[
  ['The forged festival pass.','A counterfeit backstage pass was found at the charity festival. The printed seal carries two distinctive marks. Each suspect borrowed a different seal stamp; test prints show exactly which marks each stamp makes. Only the borrowed stamp could have printed the counterfeit seal.','FESTIVAL PASS'],
  ['The raffle envelope.','The charity raffle envelope was opened and resealed. Its replacement seal has two clear marks. Each suspect borrowed one of the seal stamps shown below; the genuine seal used a different design. Identify who had the stamp that made the replacement.','RAFFLE SEAL'],
  ['The substituted concert ticket.','A genuine prize ticket was replaced with a copy. The copy carries a two-part mark from the workshop stamps. Each suspect signed out a different stamp, nobody exchanged them, and the copy was made with one of these stamps.','PRIZE TICKET'],
  ['The altered exhibition label.','An exhibition label was replaced with a fake approval slip. Two marks on the slip identify the stamp used. Each suspect alone controlled one workshop stamp; none was lent or shared.','APPROVAL SLIP']
 ],
 access:[
  ['The vanished audition recording.','The only copy of an audition recording was deleted from a locked editing booth. Opening the booth and its protected cabinet required both permissions shown below. Each suspect alone held a different badge; the badges were not lent or shared.','RECORDING'],
  ['The prize cupboard.','A donated prize vanished from a locked cupboard behind a staff-only door. The lock audit confirms one badge opened both barriers. Each suspect alone held a different badge, and there was no other entry.','DONATED PRIZE'],
  ['The overwritten final.','The final tournament bracket was overwritten at a protected terminal. The terminal required two permissions together. Each suspect controlled a different badge; the authenticated user made the change, with no shared login or remote access.','TOURNAMENT FINAL'],
  ['The cancelled booking.','A paid community booking was cancelled from a restricted kiosk. Both permissions shown below were needed to submit the cancellation. Each suspect had sole use of one badge; no badge was exchanged and the kiosk had no remote access.','BOOKING']
 ],
 inventory:[
  ['The missing brass medal.','A display medal disappeared during a closed rehearsal. Each suspect carried a different sealed bag. The bags were weighed before and after: only one gained the exact mass of the missing medal. Other gains are accounted for; the medal was not split or passed between bags.','BRASS MEDAL'],
  ['The vanished prototype.','A small prototype disappeared from the demo table. Each suspect carried one sealed bag. Independent before-and-after weighings show the gains below. Other gains have been checked and accounted for; only the intact prototype is unaccounted for.','PROTOTYPE'],
  ['The collectors’ token.','A donated collectors’ token disappeared at the fundraiser. Each suspect carried a different sealed bag. Only one bag gained the token’s exact mass; all other changes are accounted for, and the token was not divided or passed on.','COLLECTORS TOKEN'],
  ['The missing key weight.','A brass master-key weight vanished from the restoration bench. Each suspect carried a sealed kit bag. The missing piece was not divided; no unrecorded bag contents changed, so its exact mass identifies the bag containing it.','BRASS WEIGHT']
 ],
 custody:[
  ['The damaged master drawing.','A sealed folder containing a commissioned drawing passed through this group. Every handler checked the security seal immediately after handling it. The first broken seal identifies when the folder was opened; no handler shared their turn and the seal could not repair itself.','MASTER DRAWING'],
  ['The swapped prize card.','A sealed prize-card packet passed through several handlers. A signed check recorded the seal after each handover. The card was swapped when the seal was first broken, before any later handler received it.','PRIZE CARD'],
  ['The tampered set list.','A sealed set-list envelope arrived with a substituted page. The seal was checked after every handler. Only one person held it at each stage; the substitution happened during the first stage recorded with a broken seal.','SET LIST'],
  ['The opened ballot packet.','A sealed community-vote packet was opened before its public count. Reliable seal checks were taken after every handler. The first broken check identifies the responsible handover; earlier handlers returned it intact.','BALLOT PACKET']
 ]
};
function shuffle(a,r){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function bitCount(n){return n.toString(2).replaceAll('0','').length;}
function buildCase(level,index,r){
 const n=M.SIZES[level],mechanism=kinds[index%4],theme=premises[mechanism][Math.floor(index/4)%4],names=shuffle(people,r).slice(0,n),order=shuffle(Array.from({length:n},(_,i)=>i),r),slot=Math.floor(r()*n),colours=['blue','red','green','yellow','purple'],patterns=['stripe','dot','star','wave','cross'];
 const objects=Array.from({length:n},(_,i)=>({name:mechanism==='trace'?'Stamp '+(i+1):mechanism==='access'?'Badge '+(i+1):mechanism==='inventory'?'Bag '+(i+1):'Handover '+(i+1),marks:[colours[i],patterns[(i+Math.floor(index/4))%n]],grams:20*(i+1)}));
 let trace;
 if(mechanism==='trace'){
  // Share each individual mark across two entries; the pair identifies exactly one.
  for(let i=0;i<n;i++)objects[i].marks=[colours[Math.floor(i/2)],patterns[i%2]];
  trace={title:'THE MARK ON THE FALSE SEAL',marks:objects[slot].marks.slice(),detail:'The recovered seal shows '+objects[slot].marks.join(' and ')+'. The test-print catalogue below is reliable. Match both marks, then identify who borrowed that stamp.'};
 }else if(mechanism==='access'){
  const permissions=['staff door','protected cabinet','editing booth','archive terminal','prize store'];
  for(let i=0;i<n;i++)objects[i].marks=[permissions[i],permissions[(i+1)%n]];
  trace={title:'THE TWO REQUIRED PERMISSIONS',marks:objects[slot].marks.slice(),detail:'The audit requires BOTH '+objects[slot].marks.join(' and ')+'. A badge missing either permission could not perform the action. Find the badge, then its sole holder.'};
 }else if(mechanism==='inventory'){
  trace={title:'THE INDEPENDENT WEIGHING',before:200+index*5,after:200+index*5+objects[slot].grams,detail:'The missing item’s scale read '+(200+index*5+objects[slot].grams)+' g with the item and '+(200+index*5)+' g without it. The catalogue gives each bag’s measured increase. Find the matching gain, then the bag’s carrier.'};
 }else trace={title:'THE SEAL-CHECK REGISTER',checks:objects.map((_,i)=>i<slot?'intact':'broken'),detail:'The catalogue records the seal immediately AFTER each handover, in order. The item was altered during the first handover returning a broken seal. Find that handler.'};
 if(!names.some(x=>x[1]<4)||!names.some(x=>x[1]>=4))return null;
 const portraitPools=[shuffle([0,1,2,3],r),shuffle([4,5,6,7],r)];
 const p={version:3,id:'alibi-v3-'+level+'-'+String(index+1).padStart(3,'0'),n,level,mechanism,names:names.map(x=>x[0]),portraits:names.map(x=>portraitPools[x[1]<4?0:1].pop()),crime:theme[0],detail:theme[1],item:theme[2],assignment:mechanism==='trace'?'borrowed':mechanism==='access'?'held':mechanism==='inventory'?'carried':'handled',catalogue:mechanism==='custody'?'These are the handovers in order. Each suspect handled exactly one stage.':'Each suspect had exactly one entry. Every entry belonged to one suspect; entries were not exchanged. Catalogue numbers run left to right.',objects,trace,s:[],evidence:[]};
 for(let i=0;i<n;i++){const width=level<2?2:3,allowed=shuffle(Array.from({length:n},(_,j)=>j).filter(j=>j!==order[i]),r).slice(0,width-1);p.s.push(['oneof',i,allowed.reduce((mask,j)=>mask|(1<<j),1<<order[i]),0]);}
 const candidates=[];
 for(let a=0;a<n;a++)for(let b=0;b<n;b++)if(a!==b){for(const type of ['left','next','apart']){const rule=[type,a,b,type==='apart'?Math.abs(order[a]-order[b]):0];if(M.testRule(rule,order))candidates.push(rule);}}
 if(level===0){const person=order.findIndex(i=>i!==slot);candidates.push(['oneof',person,1<<order[person],0]);}
 const count=[1,2,3,3][level],chosen=shuffle(candidates,r).filter(rule=>level!==0||rule[0]==='oneof').slice(0,count);
 if(chosen.length!==count)return null;
 p.evidence=chosen.map((rule,i)=>({rule,title:['Independent witness','Equipment photograph','Signed register'][i],detail:M.ruleText(p,rule)}));
 return p;
}
function minimumClues(p){
 const worlds=M.deduce(p,{statements:false,evidence:[]}),rules=[...p.s,...p.evidence.map(e=>e.rule)],rows=worlds.map(w=>({c:w.culprit,ok:rules.map(r=>M.testRule(r,w.positions))}));let best=rules.length;
 for(let mask=1;mask<(1<<rules.length);mask++){const bits=bitCount(mask);if(bits>=best)continue;if(new Set(rows.filter(w=>w.ok.every((v,i)=>!(mask&(1<<i))||v)).map(w=>w.c)).size===1)best=bits;}return best;
}
const bank=[],seen=new Set();
for(let level=0;level<4;level++)for(let index=0;index<32;index++){
 const r=M.random('alibi:evidence-curation:1:'+level+':'+index);let chosen;
 for(let attempt=0;attempt<20000;attempt++){const p=buildCase(level,index,r);if(!p||!M.puzzle(p))continue;const solution=M.solve(p);if(solution.length!==1)continue;
  const proof=M.propagate(p);if(proof.domains.some(d=>d.length!==1)||proof.steps.filter(s=>s.after.length===1).length<3)continue;
  if(new Set(M.deduce(p,{evidence:[]}).map(w=>w.culprit)).size<2||new Set(M.deduce(p,{statements:false}).map(w=>w.culprit)).size<2)continue;
  if(minimumClues(p)<[2,3,4,5][level])continue;
  const key=M.signature(p);if(seen.has(key))continue;seen.add(key);chosen=p;break;}
 if(!chosen)throw Error('Could not curate evidence file '+level+':'+index);bank.push(chosen);
}
fs.writeFileSync('games/alibi/evidence-cases.js','/* Generated by scripts/build-alibi-evidence.cjs. Old files are retained separately. */\nwindow.ALIBI_EVIDENCE_CASES='+JSON.stringify(bank)+';\n');
