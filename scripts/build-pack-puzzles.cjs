/* Generate reviewed fictional puzzle values; never claim real product weights/usefulness. */
const fs=require('node:fs');require('../pack-model.js');const M=globalThis.BREAK_ROOM_PACK;
const themes=[
 ['Camp under the stars','One night outdoors. Comfort matters, but essentials come first.',[['Tent','⛺',24,10],['Sleeping bag','🛏️',16,9],['Water','💧',10,9],['Stove','🍳',8,7],['Rain jacket','🧥',6,8],['Boots','🥾',14,8],['First aid kit','🩹',5,8],['Torch','🔦',3,7],['Snacks','🥜',6,6],['Book','📕',5,3],['Guitar','🎸',28,4],['Pillow','☁️',6,4],['Map','🗺️',2,6],['Lantern','🏮',6,5],['Blanket','🧶',11,5],['Thermos','☕',5,4]]],
 ['A day at the beach','Sun, sea and a long afternoon. Make the most of the space.',[['Towel','🧺',4,9],['Sunscreen','🧴',3,10],['Water','💧',10,9],['Swimsuit','🩱',2,8],['Sandals','🩴',4,7],['Sunglasses','🕶️',2,8],['Cooler','🧊',20,7],['Snacks','🥜',6,8],['Book','📕',5,6],['Frisbee','🥏',3,5],['Umbrella','☂️',12,7],['Camera','📷',9,5],['Speaker','🔊',8,4],['Beach mat','🟦',10,6],['Hat','🧢',3,8],['Spare clothes','👕',8,6]]],
 ['Weekend in the city','Two days exploring, one small bag. Choose what earns its place.',[['Camera','📷',9,8],['Phone charger','🔌',2,9],['Rain jacket','🧥',6,7],['Walking shoes','👟',12,9],['Notebook','📓',3,4],['Book','📕',5,5],['Headphones','🎧',3,7],['Tablet','📱',5,6],['Water','💧',10,8],['Day map','🗺️',2,5],['Sweater','🧶',6,7],['Spare outfit','👕',10,8],['Dress shoes','👞',10,4],['Umbrella','☂️',5,6],['Toiletries','🪥',6,8],['Travel pillow','☁️',6,3]]],
 ['The long train ride','An all-day journey. Pack for a comfortable trip.',[['Headphones','🎧',3,10],['Book','📕',5,9],['Tablet','📱',5,8],['Phone charger','🔌',2,9],['Snacks','🥜',6,9],['Water','💧',10,8],['Travel pillow','☁️',6,7],['Blanket','🧶',11,6],['Notebook','📓',3,5],['Board game','🎲',9,6],['Laptop','💻',18,5],['Thermos','☕',5,7],['Sweater','🧥',6,6],['Camera','📷',9,3],['Magazine','📰',3,6],['Spare clothes','👕',8,4]]]
];
const bank=[];for(const [level,n,gap]of [['easy',6,.03],['medium',7,.08],['hard',8,.14]])for(let index=0;index<60;index++){
 const r=M.random('pack:bank:v1:'+level+':'+index),theme=themes[index%themes.length];let accepted;
 for(let attempt=0;attempt<20000;attempt++){
  const pool=theme[2].slice(),items=[];for(let j=0;j<n;j++){const [name,icon,w,p]=pool.splice(Math.floor(r()*pool.length),1)[0];items.push({name,icon,weight:Math.max(1,Math.round(w*(.6+r()*.9))),points:Math.max(2,Math.min(15,p+Math.floor(r()*7)-3))});}
  const limit=Math.round(items.reduce((s,i)=>s+i.weight,0)*(.4+r()*.22)),bag={id:`pack-v1-${level}-${index+1}`,title:theme[0],description:theme[1],difficulty:level,limit,items};if(!M.validBag(bag))continue;const best=M.solve(bag);if(best.count!==1)continue;
  let weight=0,points=0;for(const item of items.slice().sort((a,b)=>b.points/b.weight-a.points/a.weight))if(weight+item.weight<=limit){weight+=item.weight;points+=item.points;}
  const loss=1-points/best.points;if(loss<gap||(level==='easy'&&loss>.08)||(level==='medium'&&loss>.14))continue;
  accepted=bag;break;
 }if(!accepted)throw Error('No puzzle found: '+level+' '+index);bank.push(accepted);
}
fs.writeFileSync('games/pack/puzzles.js','/* Generated, exactly solved fictional game values. Rebuild with scripts/build-pack-puzzles.cjs. */\nwindow.PACK_PUZZLES='+JSON.stringify(bank)+';\n');console.log('Generated '+bank.length+' exactly solved puzzles: 60 per difficulty.');
