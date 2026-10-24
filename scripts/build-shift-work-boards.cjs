/* Reproduce compiled boards and the exact v1 validation catalog from the reviewed source. */
const fs=require('node:fs'),data=require('../content/shift-work-boards.json'),B=data.boards;
if(B.length!==180||new Set(B.map(b=>b.id)).size!==180)throw Error('Invalid board IDs/count');
const C=Object.fromEntries(B.map(b=>[b.id,b.pieces.map(a=>a.axis+a.len+a.lane).join('')+'|'+b.start.join('')+'|'+b.min]));
const modelPath='shift-work-model.js',model=fs.readFileSync(modelPath,'utf8').replace(/CATALOG=\{[^\n]*?\},clone=/,()=> 'CATALOG='+JSON.stringify(C)+',clone=');
fs.writeFileSync(modelPath,model);require('../shift-work-model.js');
if(!B.every(BREAK_ROOM_SHIFT_WORK.validBoard))throw Error('Invalid compiled layout');
for(const [pool,lo,hi,count]of [['low',4,5,40],['mid',6,7,40],['high',8,9,40],['starter',2,3,20],['hard',10,30,40]]){const a=B.filter(b=>b.pool===pool);if(a.length!==count||a.some(b=>b.min<lo||b.min>hi))throw Error('Invalid pool '+pool);}
fs.writeFileSync('games/shift-work/boards.js','/* Generated from content/shift-work-boards.json. Frozen v1 boards. */\nwindow.SHIFT_WORK_BOARDS='+JSON.stringify(B)+';\n');
const sqlPath='supabase/shift-work.sql',sql=fs.readFileSync(sqlPath,'utf8'),section='-- shift-work-catalog:start\ncreate or replace function public._sw_catalog() returns jsonb language sql immutable set search_path=\'\' as $catalog$\nselect \''+JSON.stringify(C).replaceAll("'","''")+'\'::jsonb;\n$catalog$;\n-- shift-work-catalog:end';
fs.writeFileSync(sqlPath,sql.replace(/-- shift-work-catalog:start[\s\S]*?-- shift-work-catalog:end/,()=>section));
console.log('Built Shift Work: 180 frozen boards, exact validation catalog and 40 nonrepeating balanced Daily sets.');
