/* Extract generated atlas sprites into independent PNGs; no artwork is drawn here.
   Run from the repository root with Node, Sharp, and the checked-in source atlases. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../games/lowball/engine');
const output = path.join(root, 'icons/generated');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const items = vm.runInNewContext(source.match(/const ITEMS = (\[[\s\S]*?\n\]);/)[1]);
const utilities = ['trophy', 'lock', 'stats', 'gem-green', 'gem-yellow', 'gem-orange', 'gem-red', 'sound-on', 'sound-off'];
const slug = name => name.toLowerCase().replace(/['’+]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const sources = [1,2,3,4].map((number, i) => ({file: `items-${number}.png`, columns: 5, names: items.slice(i*25, i*25+25).map(item => item.name)}));
sources.push({file:'items-5.png',columns:4,rows:7,names:items.slice(100).map(item=>item.name),files:JSON.parse(fs.readFileSync('content/lowball-additions.json','utf8')).items.map(item=>item.art)});
sources.push({file: 'utilities.png', columns: 3, names: utilities});
function components(data, w, h) {
  const visited = new Uint8Array(w*h), queue = new Int32Array(w*h), found = [];
  for (let i=0; i<w*h; i++) {
    if (visited[i] || data[i*4+3]<96) continue;
    let n=0, m=0, left=w, top=h, right=0, bottom=0;
    queue[n++]=i; visited[i]=1;
    while (m<n) {
      const p=queue[m++], x=p%w, y=Math.floor(p/w);
      left=Math.min(left,x); right=Math.max(right,x); top=Math.min(top,y); bottom=Math.max(bottom,y);
      for (const q of [x?p-1:-1,x<w-1?p+1:-1,y?p-w:-1,y<h-1?p+w:-1]) {
        if(q>=0 && !visited[q] && data[q*4+3]>=96) { visited[q]=1; queue[n++]=q; }
      }
    }
    // Ignore isolated generation noise, but retain detached parts such as sound waves.
    if(n>100) found.push({left, top, right, bottom, pixels:n});
  }
  return found;
}
(async () => {
  const manifest = {version: 1, generator: 'image_gen', generatedOn: '2026-10-19', style: 'Generated shaded pixel art matching the original Lowball icons', items: {}, utilities: {}, sources: []};
  for (const sheet of sources) {
    const file = path.join(output, 'source', sheet.file);
    const {data, info} = await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject: true});
    const {width, height} = info;
    const cells = Array.from({length: sheet.names.length}, () => []);
    for (const part of components(data,width,height)) {
      const column = Math.min(sheet.columns-1,Math.floor((part.left+part.right)/2/width*sheet.columns));
      const row = Math.min((sheet.rows||sheet.columns)-1,Math.floor((part.top+part.bottom)/2/height*(sheet.rows||sheet.columns)));
      cells[row*sheet.columns+column].push(part);
    }
    for (let i=0; i<cells.length; i++) {
      const parts=cells[i];
      if(!parts.length || Math.max(...parts.map(p=>p.pixels))<1000) throw Error(`Missing sprite: ${sheet.names[i]}`);
      const left=Math.max(0,Math.min(...parts.map(p=>p.left))-2);
      const top=Math.max(0,Math.min(...parts.map(p=>p.top))-2);
      const right=Math.min(width-1,Math.max(...parts.map(p=>p.right))+2);
      const bottom=Math.min(height-1,Math.max(...parts.map(p=>p.bottom))+2);
      const filename=sheet.files?.[i]||slug(sheet.names[i])+'.png';
      await sharp(file).extract({left,top,width:right-left+1,height:bottom-top+1})
        .resize(176,176,{fit:'contain',kernel:'nearest',background:{r:0,g:0,b:0,alpha:0}})
        .extend({top:8,bottom:8,left:8,right:8,background:{r:0,g:0,b:0,alpha:0}})
        .png({compressionLevel:9}).toFile(path.join(output,filename));
      const entry={file:filename,source:sheet.file,cell:i,bounds:{left,top,width:right-left+1,height:bottom-top+1}};
      manifest[sheet.columns===3?'utilities':'items'][sheet.names[i]]=entry;
    }
    manifest.sources.push({file:sheet.file,columns:sheet.columns,...(sheet.rows?{rows:sheet.rows}:{}),count:sheet.names.length,width,height});
  }
  fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  // Apply the generic overrides after extracting historical source sheets.
  await require('./extract-lowball-unbranded.cjs')();
  console.log(`Extracted ${Object.keys(manifest.items).length} item PNGs and ${Object.keys(manifest.utilities).length} utility PNGs.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
