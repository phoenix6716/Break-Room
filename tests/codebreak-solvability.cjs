/* Exhaust the entire finite secret space with a feedback-only minimax player. */
const assert=require('node:assert/strict'),fs=require('node:fs');const archived={};require('node:vm').runInNewContext(fs.readFileSync('content/archive/2026-11-05-pre-codebreak-nine-digits/codebreak-model.js','utf8'),archived);const M=archived.BREAK_ROOM_CODEBREAK,N=1296;
const table=new Uint8Array(N*N);for(let a=0;a<N;a++)for(let b=0;b<N;b++){const f=M.feedback(M.CODES[a],M.CODES[b]);table[a*N+b]=f.placed*5+f.elsewhere;}
const distribution=Array(9).fill(0);let nodes=0;
function choose(ids,used){if(ids.length<=2)return ids[0];const possible=new Set(ids);let best=-1,worst=N+1;for(let g=0;g<N;g++){if(used.has(g))continue;const buckets=new Uint16Array(25);let bound=0;for(const s of ids){bound=Math.max(bound,++buckets[table[g*N+s]]);if(bound>worst)break;}if(bound<worst||bound===worst&&possible.has(g)&&!possible.has(best)){best=g;worst=bound;}}return best;}
function visit(ids,history=[],first=false){nodes++;assert(history.length<8,'A code must remain solvable inside the guess limit');const used=new Set(history),g=first?M.CODES.indexOf('1122'):choose(ids,used),groups=new Map();assert(!used.has(g));for(const s of ids){const f=table[g*N+s];if(f===20){distribution[history.length+1]++;continue;}if(!groups.has(f))groups.set(f,[]);groups.get(f).push(s);}for(const group of groups.values())visit(group,[...history,g]);}
visit(Array.from({length:N},(_,i)=>i),[],true);assert.equal(distribution.reduce((a,b)=>a+b,0),1296);const max=distribution.findLastIndex(x=>x>0);assert(max<=5);fs.mkdirSync('.artifacts',{recursive:true});fs.writeFileSync('.artifacts/codebreak-solvability.json',JSON.stringify({secrets:1296,method:'Feedback-only minimax, first guess 1122; not a human difficulty measurement',maximumGuesses:max,distribution,nodes},null,2)+'\n');console.log('PASS Codebreak solvability: a feedback-only strategy cracks every one of 1,296 codes within '+max+' guesses; the player has eight.');

// Version 3 uses per-digit feedback; exhaust a deterministic feedback-only strategy.
require('../codebreak-model.js');const V3=BREAK_ROOM_CODEBREAK,all=V3.CODES;
const pattern=(a,b)=>V3.digitFeedback(a,b).reduce((n,s)=>n*3+({absent:0,elsewhere:1,placed:2})[s],0);
const dist=Array(9).fill(0),probes=all.filter(c=>new Set(c).size===4&&[...c].sort().join('')===c);let v3nodes=0;
function solveTree(ids,depth=1){assert(depth<=8,'Nine-digit strategy must fit eight guesses');v3nodes++;let guess=ids[0],best=Infinity;
 const options=[...(ids.length<=64?ids:Array.from({length:64},(_,i)=>ids[Math.floor(i*ids.length/64)])),...probes];
 for(const candidate of options){const counts=new Uint16Array(81);let worst=0;for(const secret of ids){const p=pattern(secret,candidate);worst=Math.max(worst,++counts[p]);if(worst>=best)break;}if(worst<best){best=worst;guess=candidate;}}
 const groups=new Map();for(const secret of ids){if(secret===guess){dist[depth]++;continue;}const p=pattern(secret,guess);if(!groups.has(p))groups.set(p,[]);groups.get(p).push(secret);}for(const group of groups.values())solveTree(group,depth+1);
}
solveTree(all);assert.equal(dist.reduce((a,b)=>a+b,0),6561);const v3max=dist.findLastIndex(x=>x>0);assert(v3max<=8);
fs.writeFileSync('.artifacts/codebreak-v3-solvability.json',JSON.stringify({secrets:6561,method:'Candidate-partition strategy using only per-digit clues; not human difficulty calibration',maximumGuesses:v3max,distribution:dist,nodes:v3nodes},null,2)+'\n');console.log('PASS Codebreak v3: all 6,561 secrets solvable in '+v3max+' guesses using only digit feedback.');
