/* Original Time Drop era artwork, retained from the owner-supplied prototype. */
(()=>{const $=id=>document.getElementById(id);
var SPR={
phone:[".oooooooo.","osssssssso","osccccccso","oscbbbbcso","osccccccso","oscpcgcyso","osccccccso","oscbcpcgso","osccccccso","oscycbcpso","osccccccso","osccwwccso","osssssssso","osssskksso",".oooooooo."],
laptop:["..oooooooooooo..","..osccccccccso..","..oscbbbbbbcso..","..oscbpbgbycso..","..osccccccccso..","..oscbbbbbbcso..","..osccccccccso..","..oooooooooooo..","oooooooooooooooo","oskkkkkkkkkkkkso",".oooooooooooooo."],
plant:["....gg..gg....","..gmlgg.glgg..",".gmllggggllmg.",".ggmlgddgmlgg.","..gggdggdggg..","....gdggdg....",".....dggd.....","....gdggdg....","...ggdggdgg...",".....dggd.....","..oaaaaaaaao..","..oenneennno..","...onnnnnno...","...onnaanno...","....onnnno....",".....oooo....."],
sunflower:["....yy","..yyjy",".yjyaa",".yyaan","yjyann","yyyann",".yyaan",".yjyaa","..yyjy","....yy",".....d","..gg.d",".gmggd","..ggmd",".oaaaa","..oenn","...ooo"],
rotary:["..rrrr",".rjjrr",".ro...","..oooo",".orrrr","orrkkk","orkwkw","orkkkk","orrkwk","orrrkk","orrrrr",".ooooo"],
bulb:["...oo","..oyy",".oyjj","oyjwj","oyjjy","oyyyy",".oyyy","..oyy","...ok","...oa","...ok","...oa","...ok","....o"],
radio:["..........k...",".........k....","oooooooooooooo","onnnnnnnnnnnno","onkkkkkonjjjno","onkokokonjyjno","onkkkkkonjjjno","onkokokonnnnno","onkkkkkonpnpno","onnnnnnnnnnnno","oooooooooooooo",".oo........oo."],
books:["..oooooooooo..",".orrrrrrrrrro.",".orjjrrrrjjro.",".oooooooooooo.","obbbbbbbbbbbbo","obccbbbbbbccbo","oooooooooooooo",".oggggggggggo.",".ogmmggggggmo.",".oooooooooooo."],
candle:["....y","...yj","...yj","....o","..ttt","..tjt","..tjt","..tjt","..ttt",".yyyy","yjjyy",".yyyy","..yaa","...oo"],
globe:["...oooooo...","..ocbbbbbo..",".obggbbbbbo.","obgggbbbgggo","obggbbbbgggo","obbbbbggbbbo","obbbbggggbbo","obgbbbgggbbo",".obgbbbggbo.",".obbbbbbbbo.","..obbbbbbo..","...oooooo...","....oaao....","...oaaaao...","..oooooooo.."],
column:["hhhhhh","fiiiii",".hffff","..iffh","..iffh","..iffh","..ifhh","..iffh","..iffh","..iffh","..iffh",".hffff","fiiiii","ffffff","hhhhhh"],
amphora:["..ooo","..onn","...on","..oen","oonnn","onoen",".onnn","onjjj","onnnn","onaaa","onnnn",".onnn","..onn","...oo"],
fishfossil:["oooooooooooooooo","ohhhhhhhhhhhhhho","ohhhhhhihihihhho","ohiiihhihihihiho","oiiwiiiiiiiiiiio","ohiiihhihihihiho","ohhhhhhihihihhho","ohhhhhhhhhhhhhho","oooooooooooooooo"],
femur:[".hff....","hfiif...","hfffffff","hffiiiii","hfffffff","hfiif...",".hff...."],
spider:["o.o..","oo.oo","..ooo","ooooo","..ooo",".o.oo","o.o.."]};
var SYM={sunflower:1,rotary:1,bulb:1,candle:1,column:1,amphora:1,femur:1,spider:1};
var PAL={o:"#17263a",g:"#6cae72",d:"#3f7a49",l:"#b8d957",m:"#8fcf8f",n:"#b5733d",a:"#7d4a22",e:"#e3c08d",p:"#ee6557",y:"#f2a44a",j:"#ffe08a",b:"#3e86a5",c:"#91c7dc",w:"#fffdf5",k:"#8d98a3",s:"#526273",t:"#d9c79a",r:"#c9473a",f:"#a89674",h:"#6e6144",i:"#cbbd9a"},DRY={g:"#b9a36b",d:"#8a7a4a",l:"#cdbb7e",m:"#cdbb7e",p:"#c9b98a",y:"#b9a36b",j:"#d9c79a"};
var WEB=(function(){var d="M0 0H60M0 0V60M0 0L58 18M0 0L50 36M0 0L36 50M0 0L18 58",dew="",rs=[7,14,21,28,36,45,54],i;
  rs.forEach(function(r){d+="M"+r+" 0Q"+(r*0.42).toFixed(1)+" "+(r*0.42).toFixed(1)+" 0 "+r;dew+='<circle cx="'+(r*0.36).toFixed(1)+'" cy="'+(r*0.36).toFixed(1)+'" r="1.1" fill="#91c7dc"/>'});
  return'<svg viewBox="0 0 60 60"><path d="'+d+'" fill="none" stroke="#8d98a3" stroke-width="1.1"/>'+dew+'</svg>'})();
var ERA=[
{n:"DIGITAL AGE",v:["#3f7a49","#6cae72",1],s:["phone","plant","sunflower","laptop","plant","sunflower","plant","phone","laptop","sunflower"]},
{n:"INDUSTRIAL AGE",v:["#3f7a49","#8fcf8f",0],s:["rotary","plant","bulb","radio","sunflower","bulb","plant","rotary","radio","plant"]},
{n:"OLD WORLD",v:["#8a7a4a","#cdbb7e",0],s:["books","candle","globe","dry:plant","candle","books","dry:sunflower","globe","candle","dry:plant"]},
{n:"ANCIENT WORLD",v:["#7d4a22","",0],s:["column","amphora","dry:plant","column","amphora","dry:sunflower","amphora","column","dry:plant","amphora"]},
{n:"EARLY HISTORY",v:null,s:["fishfossil","femur","spider","femur","fishfossil","spider","femur","fishfossil","spider","femur"]}],curStage=-1;
function spr(key){var dry=key.indexOf("dry:")===0,name=dry?key.slice(4):key,rows=SPR[name].map(function(r){return SYM[name]?r+r.split("").reverse().join(""):r}),
  w=Math.max.apply(null,rows.map(function(r){return r.length})),c=Object.assign({},PAL,dry?DRY:{}),r="";
  rows.forEach(function(row,y){for(var x=0;x<row.length;x++){var k=row[x];if(k!==".")r+='<rect x="'+x+'" y="'+y+'" width="1" height="1" fill="'+c[k]+'"/>'}});
  return'<svg viewBox="0 0 '+w+' '+rows.length+'" style="width:calc('+w+'*var(--px));height:calc('+rows.length+'*var(--px))">'+r+'</svg>'}
function vine(v,side){var d="M7 0",lv="",i,y,x,rot;
  for(i=0;i<14;i++){y=i*10;x=i%2?3.5:10.5;rot=i%2?-30:30;d+="C"+(i%2?2:12)+" "+(y+3)+","+(i%2?2:12)+" "+(y+7)+",7 "+(y+10);
    if(v[1]){lv+='<ellipse cx="'+x+'" cy="'+(y+5)+'" rx="3" ry="1.6" fill="'+v[1]+'" transform="rotate('+rot+' '+x+' '+(y+5)+')"/>';
      if(v[2]&&i%3===1)lv+='<circle cx="'+x+'" cy="'+(y+3)+'" r="1.7" fill="#ee6557"/><circle cx="'+x+'" cy="'+(y+3)+'" r=".6" fill="#ffe08a"/>'}}
  return'<svg class="vn '+side+'" viewBox="0 0 14 140" preserveAspectRatio="none"><path d="'+d+'" fill="none" stroke="'+v[0]+'" stroke-width="1.5"/>'+lv+'</svg>'}
function drawDeco(y){
  var st=y>=1980?0:y>=1850?1:y>=1000?2:y>=-500?3:4;if(st===curStage&&$('deco').hasChildNodes())return;curStage=st;
  var E=ERA[st],h="",tops=[8,27,46,65,84];
  if(E.v)h+=vine(E.v,"l")+vine(E.v,"r");
  E.s.forEach(function(k,i){var side=i<5?"l":"r",t=tops[i%5]+(side==="r"?5:0);h+='<span class="dc '+side+'" style="top:'+t+'%;animation-delay:'+(i*55)+'ms">'+spr(k)+'</span>'});
  (st===4?["tl","tr","bl","br"]:st===3?["tl"]:[]).forEach(function(c){h+='<span class="wb '+c+'">'+WEB+'</span>'});
  $("deco").innerHTML=h;$("era-tag").textContent=E.n}

window.BREAK_ROOM_TIME_DROP_ART={draw:drawDeco};})();
