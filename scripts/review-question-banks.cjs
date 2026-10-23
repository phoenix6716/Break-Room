/* Reconcile measured answers without selecting/replacing any existing puzzle. */
const fs=require('node:fs'),vm=require('node:vm');
const ref=JSON.parse(fs.readFileSync('content/reference-data.json','utf8'));
const audit=JSON.parse(fs.readFileSync('content/question-audit.json','utf8'));
const box={window:{}};vm.runInNewContext(fs.readFileSync('games/stack-up/stacks.js','utf8'),box);
const rows=box.window.STACK_UP_STACKS;
for(const a of audit.stack_up){
 if(!['elements','countries','airports'].includes(a.source))continue;
 const s=rows.find(s=>s.id===a.id),cards=new Map(s.cards.map(c=>[c.name,c]));
 a.ordered=a.ordered.map(x=>({...x,value:ref[a.source][x.key][a.measure]})).sort((x,y)=>x.value-y.value);
 if(a.ordered.some((x,i)=>!Number.isFinite(x.value)||(i&&x.value<=a.ordered[i-1].value)))throw Error('Ambiguous measurement order '+a.id);
 s.cards=a.ordered.map((x,i)=>({...cards.get(x.name),value:i+1}));
 s.fact=a.ordered.map(x=>x.name+': '+x.value+(a.unit?' '+a.unit:'')).join('; ')+'.';
 if(a.source==='elements'&&a.measure==='melt')s.prompt='Order these pure metals by melting point at standard pressure, lowest first (RSC values).';
 if(a.source==='elements'&&a.measure==='density_g_cm3')s.prompt='Order these pure solid elements by density near room temperature, lowest first (RSC values).';
 if(a.source==='countries'&&a.measure==='area'){
  s.prompt='Order these countries by surface area, smallest first (UNdata, 2023).';
  if(a.ordered.some(x=>x.key==='Finland')){s.prompt+=' Finland excludes Åland.';s.fact+=' Finland excludes Åland Islands.';}
  if(a.ordered.some(x=>x.key==='Argentina'))s.fact+=' Argentina excludes Antarctic area.';
  a.convention='UNdata country profiles, 2023 surface area in km²; national profile territory notes apply.';
 }
 if(a.source==='airports'){
  if(a.measure==='elevation_ft')s.prompt='Order these airports by field elevation above sea level, lowest first.';
  if(a.measure==='latitude')s.prompt='Order these airports by approximate airport latitude, south to north.';
  if(a.measure==='longitude')s.prompt='Order these airports by approximate airport longitude, west to east (−180° to +180°).';
 }
}
fs.writeFileSync('games/stack-up/stacks.js','/* Reconcile with node scripts/review-question-banks.cjs; retain IDs and subject sets. */\nwindow.STACK_UP_STACKS='+JSON.stringify(rows)+';\n');
fs.writeFileSync('content/question-audit.json',JSON.stringify(audit,null,2)+'\n');
