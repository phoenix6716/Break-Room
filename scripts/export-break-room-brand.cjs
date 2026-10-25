/* Derive production sizes from the owner-approved generated logo. No lettering/art is redrawn. */
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
(async()=>{
 const source='assets/source/break-room-option05.png',{data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true}),w=info.width,h=info.height;
 const seen=new Uint8Array(w*h),queue=new Int32Array(w*h),parts=[];
 for(let i=0;i<w*h;i++){if(seen[i]||data[i*4+3]<64)continue;let n=0,m=0,left=w,top=h,right=0,bottom=0;queue[n++]=i;seen[i]=1;
 while(m<n){const p=queue[m++],x=p%w,y=Math.floor(p/w);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
 for(const q of [x?p-1:-1,x<w-1?p+1:-1,y?p-w:-1,y<h-1?p+w:-1])if(q>=0&&!seen[q]&&data[q*4+3]>=64){seen[q]=1;queue[n++]=q;}}
 if(n>150)parts.push({left,top,right,bottom,pixels:n});}
 function bounds(parts){if(!parts.length)throw Error('Missing logo component');const left=Math.max(0,Math.min(...parts.map(p=>p.left))-2),top=Math.max(0,Math.min(...parts.map(p=>p.top))-2),right=Math.min(w-1,Math.max(...parts.map(p=>p.right))+2),bottom=Math.min(h-1,Math.max(...parts.map(p=>p.bottom))+2);return{left,top,width:right-left+1,height:bottom-top+1};}
 const main=bounds(parts),icon=bounds(parts.filter(p=>p.left<w*.32&&p.pixels>1000));if(icon.left+icon.width>w*.4)throw Error('Icon includes lettering');
 const outputs={},transparent={r:0,g:0,b:0,alpha:0};
 outputs['assets/break-room-wordmark.png']=await sharp(source).extract(main).resize({width:960}).png({compressionLevel:9}).toBuffer();
 outputs['assets/break-room-mark.png']=await sharp(source).extract(icon).resize(480,480,{fit:'contain',background:transparent}).extend({top:16,bottom:16,left:16,right:16,background:transparent}).png({compressionLevel:9}).toBuffer();
 outputs['assets/break-room-touch-icon.png']=await sharp(outputs['assets/break-room-mark.png']).resize(160,160).extend({top:10,bottom:10,left:10,right:10,background:'#f4eddc'}).flatten({background:'#f4eddc'}).png({compressionLevel:9}).toBuffer();
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="1.5" y="1.5" width="61" height="61" rx="5" fill="#f4eddc" stroke="#17263a" stroke-width="3"/><image x="5" y="5" width="54" height="54" href="data:image/png;base64,'+outputs['assets/break-room-mark.png'].toString('base64')+'"/></svg>\n';
 for(const file of ['assets/break-room-icon.svg','assets/favicon.svg','assets/logo.svg'])outputs[file]=Buffer.from(svg);
 for(const [file,buffer]of Object.entries(outputs)){fs.writeFileSync(file,buffer);if(process.env.EXPORT_BRAND==='1')console.log('BRAND_ASSET '+file+' '+buffer.toString('base64'));}
 console.log('BRAND_BOUNDS '+JSON.stringify({source:{width:w,height:h},main,icon,files:Object.keys(outputs)}));
})().catch(e=>{console.error(e);process.exitCode=1;});
