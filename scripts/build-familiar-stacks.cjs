/* Familiar default stacks. Original challenge bank and saved snapshots remain separate. */
const fs=require('node:fs'),ref=JSON.parse(fs.readFileSync('content/reference-data.json','utf8'));
function rng(seed){let h=2166136261;for(const c of seed)h=Math.imul(h^c.charCodeAt(0),16777619);return()=>{h+=0x6D2B79F5;let x=Math.imul(h^(h>>>15),1|h);x^=x+Math.imul(x^(x>>>7),61|x);return((x^(x>>>14))>>>0)/4294967296;};}
function shuffled(a,r){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function combos(items,k=5){const out=[];function add(a,start){if(a.length===k){out.push(a);return;}for(let i=start;i<items.length;i++)add([...a,items[i]],i+1);}add([],0);return out;}
const rows=[],audit=[],counts=Array(5).fill(0);
function add(lane,category,prompt,ends,values,unit,sources){
 const sorted=values.slice().sort((a,b)=>a.value-b.value);if(sorted.some((x,i)=>i&&x.value<=sorted[i-1].value))throw Error('Tied familiar stack');
 const id='stack-familiar-'+lane+'-'+String(++counts[lane]).padStart(3,'0');
 rows.push({id,collection:'familiar',lane,difficulty:lane<2?'easy':lane<4?'medium':'hard',category,prompt,ends,fact:sorted.map(x=>x.name+': '+(x.display||x.value)+(unit?' '+unit:'')).join('; ')+'.',cards:sorted.map((x,i)=>({name:x.name,detail:'',value:i+1,symbol:lane===2?'★':lane>=3?'∑':'◇'}))});
 audit.push({id,source:category,unit,sources,ordered:sorted});
}
function family(lane,category,prompt,ends,items,count,unit,sources,seed){
 const candidates=shuffled(combos(items).filter(r=>new Set(r.map(x=>x.value)).size===5),rng(seed));
 if(candidates.length<count)throw Error('Not enough familiar combinations');
 for(const values of candidates.slice(0,count))add(lane,category,prompt,ends,values,unit,sources);
}
const sequence=names=>names.map((name,i)=>({name,value:i+1}));
const calendar=['https://www.timeanddate.com/calendar/months/'];
family(0,'EVERYDAY','Put these days in order within a Monday-to-Sunday week.',['EARLIER','LATER'],sequence(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']),8,'',calendar,'familiar:week:1');
family(0,'EVERYDAY','Put these months in order within one calendar year.',['EARLIER','LATER'],sequence(['January','February','March','April','May','June','July','August','September','October','November','December']),12,'',calendar,'familiar:months:1');
family(0,'EVERYDAY','Order these lengths of time, shortest first.',['SHORTER','LONGER'],[
 ['One second',1],['One minute',60],['Quarter of an hour',900],['Half an hour',1800],['One hour',3600],['One day',86400],['One week',604800],['One fortnight',1209600],['One 365-day year',31536000]
].map(([name,value])=>({name,value})),12,'seconds',['https://www.bipm.org/en/publications/si-brochure'],'familiar:duration:1');
family(1,'SCIENCE','Order these planets by distance from the Sun, nearest first.',['NEARER','FARTHER'],sequence(['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune']),16,'(planet from the Sun)',['https://science.nasa.gov/solar-system/planets/'],'familiar:planets:1');
family(1,'SCIENCE','Order these metric lengths, shortest first.',['SHORTER','LONGER'],[
 ['One millimetre',.001],['Five centimetres',.05],['Ten centimetres',.1],['Half a metre',.5],['One metre',1],['One hundred metres',100],['One kilometre',1000],['Five kilometres',5000]
].map(([name,value])=>({name,value})),8,'metres',['https://www.bipm.org/en/measurement-units/si-prefixes'],'familiar:length:1');
family(1,'TECH','Order these decimal data sizes, smallest first (1000 bytes = 1 kilobyte).',['SMALLER','LARGER'],[
 ['One byte',1],['One kilobyte',1000],['One megabyte',1000000],['One gigabyte',1e9],['Two gigabytes',2e9],['One terabyte',1e12]
].map(([name,value])=>({name,value})),6,'bytes',['https://www.nist.gov/pml/owm/metric-si-prefixes'],'familiar:storage:1');
family(1,'SCIENCE','Order these metric masses, lightest first.',['LIGHTER','HEAVIER'],[
 ['One gram',1],['Fifty grams',50],['Two hundred grams',200],['Five hundred grams',500],['One kilogram',1000],['Two kilograms',2000]
].map(([name,value])=>({name,value})),2,'grams',['https://www.bipm.org/en/measurement-units/si-prefixes'],'familiar:mass:1');
const films=['The Lion King','Toy Story','Finding Nemo','Shrek','The Incredibles','Ratatouille','Up','Titanic','Jurassic Park','Back to the Future','The Dark Knight','The Matrix','Jaws','The Terminator','Monsters, Inc.','The Truman Show'];
family(2,'SCREEN TIME','Order these original films by their first US release, oldest first.',['OLDER','NEWER'],films.map(name=>({name,value:ref.movies[name].year})),32,'',['https://www.afi.com/afi-catalog/'],'familiar:films:1');
const seen=new Set();
for(let i=0;i<32;i++){
 const r=rng('familiar:arithmetic:'+i),items=[];
 while(items.length<5){const a=2+Math.floor(r()*11),b=2+Math.floor(r()*10),type=Math.floor(r()*(i<16?2:4));let name,value;
 if(type===0){name=a+' + '+b;value=a+b;}else if(type===1){name=(a+b)+' − '+b;value=a;}else if(type===2){name=a+' × '+b;value=a*b;}else{name=(a*b)+' ÷ '+b;value=a;}
 if(items.some(x=>x.value===value))continue;items.push({name,value});}
 const key=items.map(x=>x.name).sort().join('|');if(seen.has(key))throw Error('Duplicate arithmetic stack');seen.add(key);
 add(3,'NUMBER SENSE','Order these calculations by their answer, smallest first.',['SMALLER','LARGER'],items,'',['Exact arithmetic; operands retained in each card.']);
}
const rational=[
 ['1/8',1,8],['1/6',1,6],['20%',1,5],['1/4',1,4],['30%',3,10],['1/3',1,3],['40%',2,5],['1/2',1,2],['60%',3,5],['2/3',2,3],['3/4',3,4],['80%',4,5],['5/6',5,6],['90%',9,10],['7/8',7,8],['One whole',1,1]
].map(([name,numerator,denominator])=>({name,numerator,denominator,value:numerator/denominator,display:numerator+'/'+denominator}));
family(4,'NUMBER SENSE','Order these fractions and percentages by value, smallest first.',['SMALLER','LARGER'],rational,32,'',['Exact rational values retained in the audit.'],'familiar:fractions:1');
if(counts.some(n=>n!==32)||rows.length!==160)throw Error('Familiar lane coverage');
fs.writeFileSync('games/stack-up/familiar-stacks.js','/* Generated by scripts/build-familiar-stacks.cjs. */\nwindow.STACK_UP_FAMILIAR_STACKS='+JSON.stringify(rows)+';\n');
fs.writeFileSync('content/stack-up-familiar.json',JSON.stringify({version:1,reviewedAt:'2026-10-23',note:'Familiar default progression; old challenge bank remains available. Values stay behind the answer reveal.',stacks:audit},null,2)+'\n');
