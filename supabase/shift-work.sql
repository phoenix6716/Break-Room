-- Shift Work-only schema; legacy game_saves and existing save/Friends functions remain untouched.
begin;
create or replace function public._sw_int(v jsonb,lo int,hi int) returns boolean language sql immutable set search_path='' as $$
select case when jsonb_typeof(v)='number' then (v#>>'{}')::numeric=trunc((v#>>'{}')::numeric) and (v#>>'{}')::numeric between lo and hi else false end;
$$;
-- shift-work-catalog:start
create or replace function public._sw_catalog() returns jsonb language sql immutable set search_path='' as $catalog$
select '{"sw-v1-hard-001":"h22h23v22h21v22h20v35v21h25h23v20v23h24|2103431003244|13","sw-v1-hard-002":"h22v23v23v24h20v25v32h23v30h25v25v21|141331300040|14","sw-v1-hard-003":"h22v22h30h24h25h25v24v20v25h33v21h20v25|0323131313304|12","sw-v1-hard-004":"h22v20v21v20h20h35h21v21v24v23v35v22h24|1042234021233|10","sw-v1-hard-005":"h22h23h25v23v21h24v20v34v25v30v23|11204431103|14","sw-v1-hard-006":"h22h21h33h25h22h34v20h20v25h24h23v23h25|2030013414104|10","sw-v1-hard-007":"h22h25h23v25h34v20v21v22v24v23v24v21|130230442200|10","sw-v1-hard-008":"h22v24v22h23h20h20v24v31v20h24v23h25|213024300032|10","sw-v1-hard-009":"h22h35h24v25v21v24v32v20v25h21h30|01100313332|10","sw-v1-hard-010":"h22v23v25v22v25v20h21h20v24h24v20v23|242043443100|11","sw-v1-hard-011":"h22h25v21v22h23v23h34h30v35h21h25|00302123104|11","sw-v1-hard-012":"h22v20v25h35h20v22h21h23v25h21h34h25h20|0010223341234|11","sw-v1-hard-013":"h22h23v33v20h21v22v25v25h25v24h24v20|030014040033|13","sw-v1-hard-014":"h22v33v30v22h20h24h21v24v25v20h25h25v25|1224142020030|16","sw-v1-hard-015":"h22v25v32h20h34v23h25h21v25h23|0312031310|14","sw-v1-hard-016":"h22h25v25h23h23h24v34h20v35h31h24v30|030311003133|10","sw-v1-hard-017":"h22v20v20v32v34h25v25v21h20|241324212|10","sw-v1-hard-018":"h22v23v21v22v23v25v30h23v20h21v34v25|203044023422|12","sw-v1-hard-019":"h22v23v21v34h23v20h35h20v22v22|0032233114|10","sw-v1-hard-020":"h22h25h20v23v22v24h23v25v22h21v24|21430402342|10","sw-v1-hard-021":"h22h21v24v25v23v23v20v24h23v22|1444301210|10","sw-v1-hard-022":"h22h24v21v35h20v33v24h20v32|034131111|16","sw-v1-hard-023":"h22h25v25v24h21v32v25v23h24h23h34|03224041022|15","sw-v1-hard-024":"h22v33v22v20v34v25h20v25h24v21|0034140034|14","sw-v1-hard-025":"h22h30h25v24v32v33v35v21v24h21v20v20|021422202430|10","sw-v1-hard-026":"h22v24h20h20v22v23h34h31h35h23|0020213033|10","sw-v1-hard-027":"h22v23v20v34v35v21h25h24h20h25v23|11201334003|13","sw-v1-hard-028":"h22v20h24v20v22h31h20v23h25h25v31v25v25|2042323303102|12","sw-v1-hard-029":"h22h20h35h21v23h34h33v25v24h20h21v25v20|1422220221044|13","sw-v1-hard-030":"h22h25h21h24v22h33v24h25v35h34v20v23h20|0401130203300|10","sw-v1-hard-031":"h22v31h24v23h20v35h25h25h21v34v21|03322142210|13","sw-v1-hard-032":"h22v22v25h21h35v21h24v24v24v23h20v20h20|0212100142204|10","sw-v1-hard-033":"h22h23h24h35v32v20v24v21v35h21|0223002423|10","sw-v1-hard-034":"h22h24h24v24v22h21v22h20h25v23h25v23|030234004012|11","sw-v1-hard-035":"h22v33h20v20v24v24v25v21h24v22v25|01240340220|12","sw-v1-hard-036":"h22h20v24v25v23h24h25v31v35v22|2431003034|12","sw-v1-hard-037":"h22v34h24v22h25v23v22h20h23v20v23|01403330040|19","sw-v1-hard-038":"h22h21v30v23h23v34v25h35h20v25v21v22|240002224443|21","sw-v1-hard-039":"h22v35h33v24v22h24v21v20v24h30|2201001033|15","sw-v1-hard-040":"h22h23h24v20v23h24h20v24v21v25v21v20|142224410134|11","sw-v1-high-001":"h22h20v25v25v24v22h35v23v20h34v24|14421012014|9","sw-v1-high-002":"h22h21h24h21h20h24v34v22h23|224030142|8","sw-v1-high-003":"h22v22v21v33h20v25h23h20h21h24v24h24|130341023420|8","sw-v1-high-004":"h22v22h21v22v21v25h25h33h30v20h20h21v25|0234403324004|8","sw-v1-high-005":"h22h20h24v33h25v21h20v20v24|022103403|8","sw-v1-high-006":"h22v31v24h34v20h25h20h25h21v20v25v21h20|2212342220104|8","sw-v1-high-007":"h22v34h21h23v20v22h24h24h35|102013302|9","sw-v1-high-008":"h22v34v21h25h21v20v25h23h24h25h30h20h31|1242442124040|8","sw-v1-high-009":"h22h31h24v35h33h20h21v20h20v23|2240100234|8","sw-v1-high-010":"h22h35v22h20v20h24v20v24v21h20v25|03340432021|8","sw-v1-high-011":"h22v22v24v24h25v25h25v20v20v23h20|20310131304|8","sw-v1-high-012":"h22v24v30h25v22h25v25v25v34|003412312|8","sw-v1-high-013":"h22h21h23v25v22h24h25v23v22v34v35|00303301102|9","sw-v1-high-014":"h22v23v24h24h25h30h31v25h24h20|0222102243|8","sw-v1-high-015":"h22v20h20h20h21h21v24v24v20|204242242|8","sw-v1-high-016":"h22v33v24h24h25h25h20v30v22v21v20|10144141034|9","sw-v1-high-017":"h22h24h21h24h21h23h20v23v25h35h25v24v20|1321403222021|8","sw-v1-high-018":"h22h20v23h30v24h24v23v22h25|041014344|8","sw-v1-high-019":"h22h25h25h20v34h30v25v25h24v20v20h23v31|2131134124122|8","sw-v1-high-020":"h22h20h24v21h30v25v21v25v24h25v22v20h23|2032344212023|8","sw-v1-high-021":"h22v31h30h21h23h24v24h25v20v23h21v25|202404241422|9","sw-v1-high-022":"h22v20v23h21v23v20h20v35h25v24h23v21v24|2141044114321|8","sw-v1-high-023":"h22v24h25v30h23v31v25h34h20h25h20v21h21|2132202221432|9","sw-v1-high-024":"h22h31h20v24h25v21v23h34h23v20h24|12420020123|9","sw-v1-high-025":"h22v25h23v23h20h22h24v21v34h25h25v25h21|2100103402431|8","sw-v1-high-026":"h22v31h21v24h24h21v35h30h23h25h25h20v20|0322401224203|8","sw-v1-high-027":"h22v25h30h34h21h25v22h21h35h23h23h21h20|0400202020443|9","sw-v1-high-028":"h22h21h25v31h20v24v23h20v25v21v20v24v20|2412223440442|8","sw-v1-high-029":"h22h21v21v25h20v20v24h21h23v21v24h20|243401422123|8","sw-v1-high-030":"h22h20v25h34h25v22v25v23v24v22|0003102212|8","sw-v1-high-031":"h22v24h21v23h25h23h21h20v25v20v20h24v24|1442112232002|8","sw-v1-high-032":"h22h24h24v23v30h25v22v21v25h31h30h25v20|1312340023310|8","sw-v1-high-033":"h22h24h21h35v24v20v23v20v25v23h20v21|134120232013|9","sw-v1-high-034":"h22h25v33v24h23v25h34v20v20v21h25h20|111102214032|9","sw-v1-high-035":"h22v30h25v21h24v34h20h30v22|214331134|8","sw-v1-high-036":"h22v22h20h25v25v23v20h21v24v21h24h25v23|0443223123300|8","sw-v1-high-037":"h22h20v34v23h24v25v30h23h23h25h21v21|120220041324|8","sw-v1-high-038":"h22h20v23h30h25h23h23v25h34v20v21|13104420333|8","sw-v1-high-039":"h22v20v23v35h20v21v20v23h31v34v22|00202434113|9","sw-v1-high-040":"h22v22v25h35v30v24v33h24h21h20v25v24|012333120000|8","sw-v1-low-001":"h22h21h30v23v23v25v20h33v21v35v24h25|103141323310|5","sw-v1-low-002":"h22v23v34v20v35v22h23h20h30v20v23|11311403044|4","sw-v1-low-003":"h22v25v23v22v24h25v20h20h24|034121321|4","sw-v1-low-004":"h22v24v24h21h35h33v20v22v25|041001312|4","sw-v1-low-005":"h22h34h21h25v20v35v24h33v34v20|1124220120|4","sw-v1-low-006":"h22v23v23v25v25v32v24v21h20h25v20h21v24|0301421313303|4","sw-v1-low-007":"h22h31h23v31h30h25h25v35h21v22h20h24|203324224303|5","sw-v1-low-008":"h22h24h33v24h31h35h20v35h20h24v24v20|121210321041|5","sw-v1-low-009":"h22v21h21h34v24v35h25v30v20h20h23h20|241213314114|4","sw-v1-low-010":"h22v34h25h24h31v21v30h21v22h20|0232343124|5","sw-v1-low-011":"h22v21v23v23h21v20v35v24v24v22h20|04411313042|4","sw-v1-low-012":"h22v22h24v21h21h21h20h20h35h22v24|23442031202|4","sw-v1-low-013":"h22v25v25h23v22v23v21v24h24|002033014|5","sw-v1-low-014":"h22v20h23h21h25h24v32h20h24h23|0044410441|4","sw-v1-low-015":"h22v24v22v25v23h20v22v21v24|003241133|4","sw-v1-low-016":"h22h20h23h25v24v25h20h21h21v24h23|00223240210|4","sw-v1-low-017":"h22h24v23h21h25v23v34v25h20h25v20h20|113011134420|5","sw-v1-low-018":"h22v23v23h24v22v25h21h25h24v20h25h23v24|1021010432041|5","sw-v1-low-019":"h22v24h25h20h33h30v35h21v23h24h21v30v20|1313102412131|4","sw-v1-low-020":"h22v24h23h24h21v22v25h24h20|020332403|4","sw-v1-low-021":"h22v21h25v25v24v23h25h34h20|102112012|5","sw-v1-low-022":"h22h21v20v24h35v22v24v25h21h30|0442134421|4","sw-v1-low-023":"h22v21v23v22v25h35h20h24v24h23|0021303110|4","sw-v1-low-024":"h22h23v30v24h35v25v20v24v23h21h24v25|120212401130|5","sw-v1-low-025":"h22v22v25h34v34|13031|5","sw-v1-low-026":"h22h23h21h20v31v33h25v22v22|034030313|5","sw-v1-low-027":"h22h24v32h23h25v25h21h20v20|010312443|5","sw-v1-low-028":"h22h21v23v35h35h24h21h25v24v20h20v22|122030013213|5","sw-v1-low-029":"h22v20h24h23v20v24h35h20h23v25v23h35|132300321210|4","sw-v1-low-030":"h22h20h24v24h23v22v24v35h25|001201400|4","sw-v1-low-031":"h22v23h24v24h20h33v21h21v25|112220444|4","sw-v1-low-032":"h22v22v25v25v22h25v21h20v23|013144021|5","sw-v1-low-033":"h22h24h33v20h20h20h21h34h25v25h21v21v20|2124132342422|4","sw-v1-low-034":"h22h34h23v25h25v21v34h21v20h25h20|03110012344|5","sw-v1-low-035":"h22h23h20h24v21v25v24v22h25h21h20|23424110200|4","sw-v1-low-036":"h22h25v24v33v25v20h30v23v21h25h24h21v22|0122130034403|4","sw-v1-low-037":"h22h23h23v24h35v30v21h34v25v23|1141130111|4","sw-v1-low-038":"h22v24h23v25h24h21v25h23v20v21v22|01302220402|5","sw-v1-low-039":"h22v24h25v25v22h20h20v24h21h23v25v23v20|2213330420141|4","sw-v1-low-040":"h22v25v20h21h20h20h33h25v34|213331142|4","sw-v1-mid-001":"h22h20h34h20h23v35h25h23v20v24h21h25h20|2234111341030|6","sw-v1-mid-002":"h22h25h25h24v25v23v20v25v20v32v24h20|014211033121|7","sw-v1-mid-003":"h22h34h30v20v25v22v23h25h23|012022120|6","sw-v1-mid-004":"h22v24h30v24v22v25h25h24h33|011313111|7","sw-v1-mid-005":"h22v20v20v33h20h25h23v25h20v22v25|13104231134|6","sw-v1-mid-006":"h22v24h23v30v35h24v22v33h25|114201010|6","sw-v1-mid-007":"h22v25v21v22v23v20h21v21v24h23h30v24|232441404222|6","sw-v1-mid-008":"h22v25h31v25v21h25h20v32h30v34v23|03013403221|7","sw-v1-mid-009":"h22h34h23v34v23v22h23v25h25v25|0040201034|6","sw-v1-mid-010":"h22v23v25h25v24v20v33v22v22v25|0023102310|6","sw-v1-mid-011":"h22h23h30h34h20h21h25h25v23v24h21v25v20|0132103012433|6","sw-v1-mid-012":"h22h23v20v33v20v25h35h21v23h20v24h20|104202140144|6","sw-v1-mid-013":"h22v21h21h23v24v20v24v23v25v32|0402033120|6","sw-v1-mid-014":"h22v23h24h20v25h25v25v22h23h35|0142042230|6","sw-v1-mid-015":"h22h33v25h25h20v23h23h21h20h24h25|13140110222|6","sw-v1-mid-016":"h22v23v25v24h23h30v20v30h34h20v21|10313013243|6","sw-v1-mid-017":"h22v34h20v21h20v20h24h23h25h25h24v20|214023120341|7","sw-v1-mid-018":"h22v25v21v34v23v23h20v22h25v20|0132401444|6","sw-v1-mid-019":"h22h21h24h23v30h25h24v25v23v34|1121204110|7","sw-v1-mid-020":"h22v24h23v20h24v23v35h25h24v20h30h25h31|1222310114140|6","sw-v1-mid-021":"h22h30v24h34v20v23v35h31h23h35h25|11132210104|6","sw-v1-mid-022":"h22h23v25h21h25h23v21h30v20v24h24v23h25|1112140221044|6","sw-v1-mid-023":"h22v24h24h25v33v22v22h20v25|023012430|6","sw-v1-mid-024":"h22v20h24v34h23v35h21h25v23v21v20h20h21|1122122420344|6","sw-v1-mid-025":"h22h20v22h24h20v34h23h20h31|203321041|6","sw-v1-mid-026":"h22v22h30v20v22h21v34h20v25v23h35v21h21|0124342032340|7","sw-v1-mid-027":"h22v20v34v31v24h25v21h21v22v20h25|03230202204|7","sw-v1-mid-028":"h22h23v20v21v34h21v25h25v22|113400044|6","sw-v1-mid-029":"h22h20v24h20h21v24v21h23v23v25|0134214021|6","sw-v1-mid-030":"h22h34h25v22v23v24h24v25h20v25|0221010441|7","sw-v1-mid-031":"h22h23v23h35h30v25v34h34v20h21v25|01222021324|6","sw-v1-mid-032":"h22v20h31v21v25v25v24h35h24v22v21h20|212340203311|6","sw-v1-mid-033":"h22h33h24v23v24v25h25v25v21v20v32v24h23|0200411400010|6","sw-v1-mid-034":"h22v21v25h25v25v24h21v20v21h34h20h25v24|2301202212032|7","sw-v1-mid-035":"h22h34v22h23v25h25v24h20v20h21v23v20|012412123110|7","sw-v1-mid-036":"h22h21v25h20h34h21v23h24v22|001203232|6","sw-v1-mid-037":"h22h24v35v23h25h21h25v20v24h24v24h33h20|2230012110414|6","sw-v1-mid-038":"h22h24v34h33h25h20v20v25h20v21h21v25|113012114034|6","sw-v1-mid-039":"h22h21h21v24v22h23h20v25h24v20|1242401241|7","sw-v1-mid-040":"h22h25v24h21v22v24v23h24h23h25v22v23|012030040412|7","sw-v1-starter-001":"h22h24h21h23v34v25|002104|2","sw-v1-starter-002":"h22h21h33v25v24v34v20|2211033|2","sw-v1-starter-003":"h22v21h21v21h33v35v24|2224304|3","sw-v1-starter-004":"h22v35h31v20h35|02341|2","sw-v1-starter-005":"h22h23h34h21v34h20|211222|2","sw-v1-starter-006":"h22h20h31v22v25h20|200423|2","sw-v1-starter-007":"h22h20h33v21h24v23v25|1104431|2","sw-v1-starter-008":"h22v25h20v24v20v20|221113|3","sw-v1-starter-009":"h22h25h23v22v23v33v24|0004133|2","sw-v1-starter-010":"h22h35v23v24v25|10230|2","sw-v1-starter-011":"h22h24v25v23v23h30|010131|3","sw-v1-starter-012":"h22h25v24h24v25h25h23|2332211|2","sw-v1-starter-013":"h22v34h23v21v25v20|022033|2","sw-v1-starter-014":"h22v24h20h21v24h24v25|1132404|3","sw-v1-starter-015":"h22h25v25v20v24h23|233120|2","sw-v1-starter-016":"h22v25v24v25v20|14424|2","sw-v1-starter-017":"h22v21v35v20h20v34|212301|3","sw-v1-starter-018":"h22v22h20v25h25|01321|3","sw-v1-starter-019":"h22h31v24v23v22h25h33|1222400|3","sw-v1-starter-020":"h22h24h35v22v20v34|203011|3"}'::jsonb;
$catalog$;
-- shift-work-catalog:end
create or replace function public._sw_cells(b jsonb,p jsonb) returns int[] language plpgsql immutable set search_path='' as $$
declare g int[]:=array_fill(0,array[36]);a jsonb;i int;k int;x int;y int;v int;ln int;l int;
begin
if jsonb_typeof(p) is distinct from 'array' or jsonb_typeof(b->'pieces') is distinct from 'array' or jsonb_array_length(p)<>jsonb_array_length(b->'pieces') then return null;end if;
for i in 0..jsonb_array_length(p)-1 loop
a=b->'pieces'->i;if not public._sw_int(p->i,0,5) or not public._sw_int(a->'len',2,3) or not public._sw_int(a->'lane',0,5) or a->>'axis' not in ('h','v') then return null;end if;
v=(p->>i)::int;ln=(a->>'lane')::int;l=(a->>'len')::int;
for k in 0..l-1 loop
x=case when a->>'axis'='h' then v+k else ln end;y=case when a->>'axis'='v' then v+k else ln end;
if x<0 or x>5 or y<0 or y>5 or g[y*6+x+1]<>0 then return null;end if;g[y*6+x+1]=i+1;
end loop;end loop;return g;
exception when others then return null;end $$;
create or replace function public._sw_board(b jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare a jsonb;v jsonb;fp text:='';p text:='';pool text;tier text;label text;
begin
if jsonb_typeof(b) is distinct from 'object' or jsonb_typeof(b->'id') is distinct from 'string' or jsonb_typeof(b->'pieces') is distinct from 'array' or jsonb_array_length(b->'pieces') not between 5 and 15 or jsonb_typeof(b->'start') is distinct from 'array' or not public._sw_int(b->'min',1,30) then return false;end if;
pool=split_part(b->>'id','-',3);tier=case pool when 'starter' then 'Starter' when 'hard' then 'Hard' when 'high' then 'Medium' else 'Easy' end;label=case pool when 'low' then 'Easy' when 'mid' then 'Steady' when 'high' then 'Tricky' when 'starter' then 'Starter' when 'hard' then 'Hard' end;
if b->>'pool' is distinct from pool or b->>'tier' is distinct from tier or (b?'label' and b->>'label' is distinct from label) then return false;end if;
if public._sw_cells(b,b->'start') is null or b->'pieces'->0->>'axis' is distinct from 'h' or b->'pieces'->0->'lane' is distinct from '2'::jsonb or b->'pieces'->0->'len' is distinct from '2'::jsonb or b->'start'->0='4'::jsonb then return false;end if;
for a in select value from jsonb_array_elements(b->'pieces') loop fp=fp||(a->>'axis')||(a->>'len')||(a->>'lane');end loop;
for v in select value from jsonb_array_elements(b->'start') loop p=p||(v#>>'{}');end loop;fp=fp||'|'||p||'|'||(b->>'min');
return coalesce(public._sw_catalog()->>(b->>'id')=fp,false);
exception when others then return false;end $$;
create or replace function public._sw_replay(b jsonb,actions jsonb) returns jsonb language plpgsql immutable set search_path='' as $$
declare p jsonb:=b->'start';stack jsonb:='[]';a jsonb;car jsonb;i int;d int;step int;edge int;cell int;g int[];n int:=0;ln int;l int;v int;
begin
if not public._sw_board(b) or jsonb_typeof(actions) is distinct from 'array' or jsonb_array_length(actions)>2000 then return null;end if;
for a in select value from jsonb_array_elements(actions) loop
if p->0='4'::jsonb or jsonb_typeof(a) is distinct from 'array' or jsonb_array_length(a)<>2 or not public._sw_int(a->0,-1,14) or not public._sw_int(a->1,-5,5) then return null;end if;i=(a->>0)::int;d=(a->>1)::int;
if i=-1 and d=0 then
if jsonb_array_length(stack)=0 then return null;end if;p=stack->(jsonb_array_length(stack)-1);stack=stack-(jsonb_array_length(stack)-1);
else
if i<0 or i>=jsonb_array_length(b->'pieces') or d=0 then return null;end if;car=b->'pieces'->i;v=(p->>i)::int;ln=(car->>'lane')::int;l=(car->>'len')::int;g=public._sw_cells(b,p);if g is null then return null;end if;
for step in 1..abs(d) loop
edge=v+case when d<0 then -step else l-1+step end;if edge<0 or edge>5 then return null;end if;cell=case when car->>'axis'='h' then ln*6+edge+1 else edge*6+ln+1 end;if g[cell]<>0 and g[cell]<>i+1 then return null;end if;
end loop;stack=stack||jsonb_build_array(p);p=jsonb_set(p,array[i::text],to_jsonb(v+d));n=n+1;
end if;end loop;
return jsonb_build_object('pos',p,'undo',stack,'moves',n,'solved',p->0='4'::jsonb);
exception when others then return null;end $$;
create or replace function public._friend_shift_work_score(v jsonb,p_day date) returns double precision language plpgsql immutable set search_path='' as $$
declare b jsonb;r jsonb;trace jsonb;last_trace jsonb;s numeric:=0;expected int:=(((p_day-date '2026-10-25')%40)+40)%40+1;i int;rating int;mn int;h int;pool text;
begin
if jsonb_typeof(v) is distinct from 'object' or v->'version' is distinct from '1'::jsonb or v->>'kind' is distinct from 'daily' or v->>'day' is distinct from p_day::text or jsonb_typeof(v->'id') is distinct from 'string' or char_length(v->>'id')>100 or not public._sw_int(v->'edits',0,1000000000) or v->'round' is distinct from '2'::jsonb or coalesce(v->>'phase','') not in ('review','summary') or jsonb_typeof(v->'boards') is distinct from 'array' or jsonb_array_length(v->'boards')<>3 or jsonb_typeof(v->'results') is distinct from 'array' or jsonb_array_length(v->'results')<>3 then return null;end if;
for i in 0..2 loop b=v->'boards'->i;r=v->'results'->i;pool=case i when 0 then 'low' when 1 then 'mid' else 'high' end;
if b->>'id' is distinct from 'sw-v1-'||pool||'-'||lpad(expected::text,3,'0') or not public._sw_board(b) or r->>'id' is distinct from b->>'id' or r->'min' is distinct from b->'min' or not public._sw_int(r->'hints',0,10000) then return null;end if;
trace=public._sw_replay(b,r->'actions');if trace is null or trace->'solved' is distinct from 'true'::jsonb or r->'moves' is distinct from trace->'moves' then return null;end if;
mn=(b->>'min')::int;h=(r->>'hints')::int;rating=round(least(case when h>0 then 75 else 100 end,100.0*mn/greatest(mn,(trace->>'moves')::int)));
if r->'score' is distinct from to_jsonb(rating) then return null;end if;s=s+rating;last_trace=trace;
end loop;
if v->'pos' is distinct from last_trace->'pos' or v->'undo' is distinct from last_trace->'undo' or v->'moves' is distinct from last_trace->'moves' or v->'hints' is distinct from v->'results'->2->'hints' or v->'actions' is distinct from v->'results'->2->'actions' then return null;end if;
return round(s/3)::double precision;
exception when others then return null;end $$;
revoke all on function public._sw_int(jsonb,int,int),public._sw_catalog(),public._sw_cells(jsonb,jsonb),public._sw_board(jsonb),public._sw_replay(jsonb,jsonb),public._friend_shift_work_score(jsonb,date) from public,anon,authenticated;
commit;

-- Dedicated Shift Work storage; legacy game_saves and its RPCs are untouched.
begin;
create table if not exists public.shift_work_saves(
 user_id uuid not null references auth.users(id) on delete cascade,
 game text not null default 'shift-work' check(game='shift-work'),
 data jsonb not null default '{}'::jsonb check(jsonb_typeof(data)='object' and octet_length(data::text)<=2000000),
 revision bigint not null default 1 check(revision>0),
 updated_at timestamptz not null default now(),
 primary key(user_id,game)
);
alter table public.shift_work_saves enable row level security;
revoke all on public.shift_work_saves from public,anon,authenticated;
grant select on public.shift_work_saves to authenticated;
drop policy if exists own_shift_work_read on public.shift_work_saves;
create policy own_shift_work_read on public.shift_work_saves for select to authenticated using((select auth.uid())=user_id);
create or replace function public.save_shift_work(p_game text,p_data jsonb,p_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare owner_id uuid:=auth.uid();stored public.shift_work_saves;k text;
begin
if owner_id is null then raise exception 'Sign in required' using errcode='42501';end if;
if p_game is distinct from 'shift-work' or p_revision is null or p_revision<0 or p_data is null or jsonb_typeof(p_data)<>'object' or octet_length(p_data::text)>2000000 then raise exception 'Invalid Shift Work save';end if;
for k in select jsonb_object_keys(p_data) loop
if k !~ '^break-room:shift-work:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$' or jsonb_typeof(p_data->k)<>'string' or char_length(p_data->>k)>250000 then raise exception 'Unsupported Shift Work save entry';end if;end loop;
perform pg_advisory_xact_lock(hashtextextended(owner_id::text||':shift-work',0));
select * into stored from public.shift_work_saves where user_id=owner_id and game='shift-work' for update;
if coalesce(stored.revision,0)<>p_revision then return jsonb_build_object('conflict',true,'revision',coalesce(stored.revision,0));end if;
insert into public.shift_work_saves(user_id,game,data,revision) values(owner_id,'shift-work',p_data,1)
on conflict(user_id,game) do update set data=excluded.data,revision=shift_work_saves.revision+1,updated_at=now() returning * into stored;
return jsonb_build_object('conflict',false,'revision',stored.revision);
end $$;
revoke all on function public.save_shift_work(text,jsonb,bigint) from public,anon;
grant execute on function public.save_shift_work(text,jsonb,bigint) to authenticated;
create or replace function public._sw_records(p_user uuid,p_today date)
returns table(game text,day date,arcade_score double precision) language plpgsql stable set search_path='' as $$
declare r record;e record;d date;s double precision;v jsonb;
begin
for r in select h.data from public.shift_work_saves h where h.user_id=p_user loop
for e in select * from jsonb_each_text(r.data) loop
if e.key !~ '^break-room:shift-work:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$' then continue;end if;
d=public._friend_date(right(e.key,10));if d is null or d<p_today-119 or d>p_today then continue;end if;
v=public._friend_json(e.value);s=public._friend_shift_work_score(v,d);
if s is not null then game='shift-work';day=d;arcade_score=s;return next;end if;
end loop;end loop;
end $$;
revoke all on function public._sw_records(uuid,date) from public,anon,authenticated;
create or replace function public.shift_work_friend_scores()
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare me uuid:=auth.uid();today date:=timezone('Australia/Sydney',now())::date;result jsonb;
begin
if me is null then raise exception 'Sign in required' using errcode='42501';end if;
if not exists(select 1 from public.friend_profiles where user_id=me) then return jsonb_build_object('today',today,'records','[]'::jsonb);end if;
select coalesce(jsonb_agg(jsonb_build_object('user_id',p.user_id,'game',r.game,'date',r.day,'arcadeScore',r.arcade_score) order by p.user_id,r.day),'[]'::jsonb) into result
from public.friend_profiles p cross join lateral public._sw_records(p.user_id,today) r
where p.user_id=me or (p.share_scores and exists(select 1 from public.friend_links f where f.status='accepted' and ((f.requester=me and f.recipient=p.user_id) or (f.recipient=me and f.requester=p.user_id))) and not exists(select 1 from public.friend_blocks b where (b.owner_id=me and b.target_id=p.user_id) or (b.owner_id=p.user_id and b.target_id=me)));
return jsonb_build_object('today',today,'records',result);
end $$;
revoke all on function public.shift_work_friend_scores() from public,anon;
grant execute on function public.shift_work_friend_scores() to authenticated;
commit;
