/* Extract image_gen's visually reviewed logo-free replacement atlas. No artwork is drawn here. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),sharp=require('sharp');
async function run(){
 const root=path.resolve(__dirname,'../games/lowball/engine/icons'),out=path.join(root,'generated'),config=JSON.parse(fs.readFileSync('content/lowball-art-review.json','utf8')),atlas=path.join(out,'source',config.source),manifestPath=path.join(out,'manifest.json'),manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
 const {data,info}=await sharp(atlas).ensureAlpha().raw().toBuffer({resolveWithObject:true}),w=info.width,h=info.height,seen=new Uint8Array(w*h),queue=new Int32Array(w*h),cells=Array.from({length:config.items.length},()=>[]);
 for(let i=0;i<w*h;i++){
  if(seen[i]||data[i*4+3]<96)continue;
  let n=0,m=0,left=w,top=h,right=0,bottom=0;queue[n++]=i;seen[i]=1;
  while(m<n){const p=queue[m++],x=p%w,y=Math.floor(p/w);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
   for(const q of [x?p-1:-1,x<w-1?p+1:-1,y?p-w:-1,y<h-1?p+w:-1])if(q>=0&&!seen[q]&&data[q*4+3]>=96){seen[q]=1;queue[n++]=q;}
  }
  if(n>100){const col=Math.min(config.columns-1,Math.floor((left+right)/2/w*config.columns)),row=Math.min(config.rows-1,Math.floor((top+bottom)/2/h*config.rows));cells[row*config.columns+col].push({left,top,right,bottom,pixels:n});}
 }
 for(const [i,item]of config.items.entries()){
  const parts=cells[i];if(!parts.length||Math.max(...parts.map(p=>p.pixels))<1000)throw Error('Missing replacement '+item.name);
  const left=Math.max(0,Math.min(...parts.map(p=>p.left))-2),top=Math.max(0,Math.min(...parts.map(p=>p.top))-2),right=Math.min(w-1,Math.max(...parts.map(p=>p.right))+2),bottom=Math.min(h-1,Math.max(...parts.map(p=>p.bottom))+2),bounds={left,top,width:right-left+1,height:bottom-top+1};
  const buffer=await sharp(atlas).extract(bounds).resize(176,176,{fit:'contain',kernel:'nearest',background:{r:0,g:0,b:0,alpha:0}}).extend({top:8,bottom:8,left:8,right:8,background:{r:0,g:0,b:0,alpha:0}}).png({compressionLevel:9}).toBuffer();
  fs.writeFileSync(path.join(out,item.file),buffer);
  const legacy=path.join(root,item.file);if(fs.existsSync(legacy))fs.writeFileSync(legacy,buffer);
  manifest.items[item.name]={file:item.file,source:config.source,cell:i,bounds,generatedOn:config.reviewedOn,logoReview:config.reviewedOn,sha256:crypto.createHash('sha256').update(buffer).digest('hex')};
  if(process.env.EXPORT_LOGO_ART==='1')console.log('LOGO_ASSET '+item.file+' '+buffer.toString('base64'));
 }
 manifest.sources=manifest.sources.filter(x=>x.file!==config.source);manifest.sources.push({file:config.source,columns:config.columns,rows:config.rows,count:config.items.length,width:w,height:h,generatedOn:config.reviewedOn,logoReview:config.reviewedOn});
 fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
 if(process.env.EXPORT_LOGO_ART==='1')console.log('LOGO_MANIFEST '+JSON.stringify(manifest));
 console.log('PASS extracted '+config.items.length+' visually reviewed logo-free product illustrations; existing compatibility URLs updated.');
}
module.exports=run;
if(require.main===module)run().catch(e=>{console.error(e);process.exitCode=1;});
