/* Check every published answer against the checked-in reference values, not just counts. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const reference=JSON.parse(fs.readFileSync('content/reference-data.json'));
const audit=JSON.parse(fs.readFileSync('content/question-audit.json'));
const sandbox={window:{}};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('games/stack-up/stacks.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync('games/stake/questions.js','utf8'),sandbox);
const stacks=JSON.parse(JSON.stringify(sandbox.window.STACK_UP_STACKS));
const additions=JSON.parse(JSON.stringify(sandbox.window.STAKE_QUESTION_ADDITIONS));
assert.equal(stacks.length,112);assert.equal(additions.length,100);
assert.equal(audit.stack_up.filter(x=>x.kind==='expanded').length,100);
assert.equal(audit.stack_up.filter(x=>x.kind==='replacement').length,12);
assert.equal(new Set(stacks.map(x=>x.id)).size,112);
const signatures=new Set();
for(const stack of stacks){
 const row=audit.stack_up.find(x=>x.id===stack.id);assert(row,stack.id);
 assert.equal(stack.difficulty,'hard');assert.equal(stack.cards.length,5);
 const signature=row.source+':'+row.measure+':'+row.ordered.map(x=>x.key).join('|');assert(!signatures.has(signature),'Duplicate puzzle '+signature);signatures.add(signature);
 const values=[];
 for(const [i,card] of stack.cards.entries()){
  assert.equal(card.value,i+1);assert.equal(card.detail,'','Pre-answer answer/clue leak: '+stack.id);
  assert.equal(card.name,row.ordered[i].name);
  if(row.source!=='math')assert.equal(row.ordered[i].value,reference[row.source][row.ordered[i].key][row.measure],stack.id);
  values.push(row.ordered[i].value);assert(stack.fact.includes(card.name));
 }
 assert(values.every(Number.isFinite));assert(values.every((v,i)=>!i||v>values[i-1]),'Incorrect order '+stack.id);
}
const oldText=fs.readFileSync('games/stake/index.html','utf8').split('const BANK=`')[1].split('`.trim()')[0];
const oldQuestions=oldText.trim().split('\n').map(x=>x.split('|')[1].toLowerCase().replace(/[^a-z0-9]/g,''));
const seen=new Set(oldQuestions);
for(const q of additions){
 const row=audit.stake.find(x=>x.id===q.id);assert(row,q.id);assert.equal(q.o.length,3);assert.equal(new Set(q.o).size,3);
 const normalized=q.q.toLowerCase().replace(/[^a-z0-9]/g,'');assert(!seen.has(normalized),'Duplicate trivia '+q.q);seen.add(normalized);
 assert.equal(q.o[0],row.answer);
 if(row.source==='elements'){
  const e=reference.elements[row.key];
  if(row.field==='symbol')assert(q.q.includes(e.symbol));
  if(row.field==='number')for(const wrong of q.o.slice(1))assert(reference.elements[wrong].number<e.number);
  assert.equal(q.o[0],e.name);
 }else if(row.source==='countries')assert(reference.countries[row.key].capital.includes(q.o[0]));
 else if(row.source==='books')assert.equal(q.o[0],reference.books[row.key].author);
 else if(row.source==='movies')assert.equal(q.o[0],String(reference.movies[row.key].year));
}
assert.equal(oldQuestions.length,164);assert.equal(seen.size,264);console.log('PASS: 112 unique harder Stack Up sets, 264 unique Stake questions, blank pre-answer descriptions, all reference-backed orders and factual answer keys.');
