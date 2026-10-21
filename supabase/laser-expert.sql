-- Run after the current setup/Friends + alibi-scenarios.sql update.
-- Additive Laser Expert support only. Preserves every other game, ownership and sharing policy.
begin;
-- Laser v1/v2: derive first-fire hits from board/mirror snapshots, never claimed scores.
create or replace function public._friend_laser_hit(b jsonb,p jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare n int; lv int; cfg int[]; required int:=2; upgraded boolean; q jsonb; x numeric; rr int; cc int; ori text; coords text[]:='{}'; legal text[]:='{}'; mirrors jsonb:='{}'; walls text[]:='{}'; target text; k text; r int; c int:=-1; dx int:=1; dy int:=0; tmp int; seen text[]:='{}'; state text;
begin
 if jsonb_typeof(b) is distinct from 'object' or jsonb_typeof(b->'id') is distinct from 'string' or b->>'id' !~ '^(laser-v1-[0-3]-[0-9]+|laser-v2-3-[0-9]+)$' or char_length(b->>'id')>80 or jsonb_typeof(b->'level') is distinct from 'number' then return null;end if;
 x=(b->>'level')::numeric;if x<>trunc(x) or x not between 0 and 3 then return null;end if;lv=x;
 cfg=case lv when 0 then array[5,2,0] when 1 then array[6,3,0] when 2 then array[6,3,2] else array[7,4,3] end;upgraded=(b->>'id') like 'laser-v2-%';if upgraded then if lv<>3 then return null;end if;cfg=array[7,6,4];required=3;end if;n=cfg[1];
 if b->'n' is distinct from to_jsonb(n) or jsonb_typeof(b->'row') is distinct from 'number' then return null;end if;
 x=(b->>'row')::numeric;if x<>trunc(x) or x not between 0 and n-1 then return null;end if;r=x;
 if jsonb_typeof(b->'t') is distinct from 'array' or jsonb_array_length(b->'t')<>2 or jsonb_typeof(b->'fx') is distinct from 'array' or jsonb_array_length(b->'fx')<>cfg[2] or jsonb_typeof(b->'w') is distinct from 'array' or jsonb_array_length(b->'w')<>cfg[3] or jsonb_typeof(p) is distinct from 'array' or jsonb_array_length(p)<>required then return null;end if;
 -- Validate disjoint layout coordinates before tracing.
 for q in select value from jsonb_array_elements(jsonb_build_array(b->'t')||(b->'fx')||(b->'w')) loop
  if jsonb_typeof(q) is distinct from 'array' or jsonb_array_length(q) not in (2,3) then return null;end if;
  if jsonb_typeof(q->0) is distinct from 'number' or jsonb_typeof(q->1) is distinct from 'number' then return null;end if;
  x=(q->>0)::numeric;if x<>trunc(x) or x not between 0 and n-1 then return null;end if;rr=x;
  x=(q->>1)::numeric;if x<>trunc(x) or x not between 0 and n-1 then return null;end if;cc=x;k=rr||','||cc;
  if k=any(coords) then return null;end if;coords=array_append(coords,k);
 end loop;
 target=((b->'t'->>0)::numeric::int)::text||','||((b->'t'->>1)::numeric::int)::text;
 for q in select value from jsonb_array_elements(b->'fx') loop
  if jsonb_array_length(q)<>3 or jsonb_typeof(q->2) is distinct from 'string' or q->>2 not in ('/',E'\\') then return null;end if;
  mirrors=jsonb_set(mirrors,array[((q->>0)::numeric::int)::text||','||((q->>1)::numeric::int)::text],q->2);
 end loop;
 for q in select value from jsonb_array_elements(b->'w') loop if jsonb_array_length(q)<>2 then return null;end if;walls=array_append(walls,((q->>0)::numeric::int)::text||','||((q->>1)::numeric::int)::text);end loop;
 for q in select value from jsonb_array_elements(p) loop
  if jsonb_typeof(q) is distinct from 'array' or jsonb_array_length(q)<>3 or jsonb_typeof(q->0) is distinct from 'number' or jsonb_typeof(q->1) is distinct from 'number' or jsonb_typeof(q->2) is distinct from 'string' or q->>2 not in ('/',E'\\') then return null;end if;
  x=(q->>0)::numeric;if x<>trunc(x) or x not between 0 and n-1 then return null;end if;rr=x;
  x=(q->>1)::numeric;if x<>trunc(x) or x not between 0 and n-1 then return null;end if;cc=x;k=rr||','||cc;
  if k=any(coords) or k=any(legal) then return null;end if;legal=array_append(legal,k);mirrors=jsonb_set(mirrors,array[k],q->2);
 end loop;
 loop
  c=c+dx;r=r+dy;if c<0 or r<0 or c>=n or r>=n then return false;end if;
  state=r||','||c||','||dx||','||dy;if state=any(seen) then return false;end if;seen=array_append(seen,state);
  k=r||','||c;if k=target then return true;end if;if k=any(walls) then return false;end if;
  ori=mirrors->>k;if ori='/' then tmp=dx;dx=-dy;dy=-tmp;elsif ori=E'\\' then tmp=dx;dx=dy;dy=tmp;end if;
 end loop;
exception when others then return null;
end $$;
create or replace function public._friend_laser_score(v jsonb,d date) returns double precision language plpgsql immutable set search_path='' as $$
declare i int; b jsonb; hit boolean; solved int:=0; ids text[]:='{}';
begin
 if jsonb_typeof(v) is distinct from 'object' or v->'version' is distinct from '1'::jsonb or v->>'day' is distinct from d::text or jsonb_typeof(v->'edits') is distinct from 'number' or (v->>'edits')::numeric<0 or (v->>'edits')::numeric>1000000 or (v->>'edits')::numeric<>trunc((v->>'edits')::numeric) or v->'round' is distinct from '3'::jsonb or coalesce(v->>'phase','') not in ('review','summary') or jsonb_typeof(v->'boards') is distinct from 'array' or jsonb_array_length(v->'boards')<>4 or jsonb_typeof(v->'picks') is distinct from 'array' or jsonb_array_length(v->'picks')<>4 or v->'mirrors' is distinct from v->'picks'->3 then return null;end if;
 for i in 0..3 loop
  b=v->'boards'->i;if b->>'id'=any(ids) then return null;end if;ids=array_append(ids,b->>'id');
  hit=public._friend_laser_hit(b,v->'picks'->i);if hit is null then return null;end if;if hit then solved=solved+1;end if;
 end loop;
 return solved*25;
exception when others then return null;
end $$;
revoke all on function public._friend_laser_hit(jsonb,jsonb),public._friend_laser_score(jsonb,date) from public,anon,authenticated;


commit;
