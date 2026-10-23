-- Apply AFTER the current inner-clock.sql update. Safe to repeat; does not rewrite saves or sharing settings.
begin;
do $$ begin if to_regprocedure('public._friend_alibi_scenario(jsonb)') is null or to_regprocedure('public._friend_score(text,jsonb,date)') is null then raise exception 'Apply setup/friends and inner-clock.sql before playtest-feedback.sql';end if;end $$;

-- Evidence v3: all observations are verified; solve catalogue ownership independently.
create or replace function public._friend_alibi_evidence_rule(s jsonb,positions int[]) returns boolean language plpgsql immutable set search_path='' as $$
declare a int; b int; k int; ty text;
begin
 ty=s->>0;a=(s->>1)::int;b=(s->>2)::int;k=(s->>3)::int;
 if ty='oneof' then return (b & (1 << positions[a+1]))<>0;
 elsif ty='left' then return positions[a+1]<positions[b+1];
 elsif ty='next' then return positions[a+1]=positions[b+1]+1;
 elsif ty='apart' then return abs(positions[a+1]-positions[b+1])=k;end if;return null;
exception when others then return null;
end $$;
create or replace function public._friend_alibi_evidence(p jsonb) returns int language plpgsql immutable set search_path='' as $$
declare n int; lv int; i int; j int; a int; b int; k int; x numeric; ty text; s jsonb; e jsonb; o jsonb; clue jsonb; mechanism text;
 names text[]:='{}'; portraits int[]:='{}'; object_names text[]:='{}'; rules text[]:='{}'; moment int:=-1; positions int[]; fits boolean; solutions int:=0; winner int; before_mass int; after_mass int; broken boolean:=false;
begin
 if jsonb_typeof(p) is distinct from 'object' or p->'version' is distinct from '3'::jsonb or jsonb_typeof(p->'id') is distinct from 'string' or p->>'id' !~ '^alibi-v3-[0-3]-[0-9]+$' or char_length(p->>'id')>80 or jsonb_typeof(p->'level') is distinct from 'number' then return null;end if;
 x=(p->>'level')::numeric;if x<>trunc(x) or x not between 0 and 3 then return null;end if;lv=x;n=case when lv=3 then 5 else 4 end;
 if p->'n' is distinct from to_jsonb(n) or coalesce(p->>'mechanism','') not in ('trace','access','inventory','custody') then return null;end if;mechanism=p->>'mechanism';
 foreach ty in array array['crime','detail','item','assignment','catalogue'] loop
  if jsonb_typeof(p->ty) is distinct from 'string' or char_length(trim(p->>ty))<1 or char_length(p->>ty)>(case ty when 'crime' then 140 when 'detail' then 800 when 'assignment' then 50 when 'catalogue' then 160 else 30 end) then return null;end if;
 end loop;
 foreach ty in array array['names','portraits','objects','s'] loop if jsonb_typeof(p->ty) is distinct from 'array' or jsonb_array_length(p->ty)<>n then return null;end if;end loop;
 if jsonb_typeof(p->'evidence') is distinct from 'array' or jsonb_array_length(p->'evidence') not between 1 and 4 or jsonb_typeof(p->'trace') is distinct from 'object' then return null;end if;
 clue=p->'trace';
 foreach ty in array array['title','detail'] loop if jsonb_typeof(clue->ty) is distinct from 'string' or char_length(trim(clue->>ty))<1 or char_length(clue->>ty)>(case when ty='title' then 100 else 500 end) then return null;end if;end loop;
 if mechanism in ('trace','access') then
  if jsonb_typeof(clue->'marks') is distinct from 'array' or jsonb_array_length(clue->'marks')<>2 or clue->'marks'->0=clue->'marks'->1 then return null;end if;
  for e in select value from jsonb_array_elements(clue->'marks') loop if jsonb_typeof(e) is distinct from 'string' or char_length(trim(e#>>'{}'))<1 or char_length(e#>>'{}')>40 then return null;end if;end loop;
 elsif mechanism='inventory' then
  foreach ty in array array['before','after'] loop if jsonb_typeof(clue->ty) is distinct from 'number' then return null;end if;x=(clue->>ty)::numeric;if x<>trunc(x) or x not between 0 and 10000 then return null;end if;end loop;
  before_mass=(clue->>'before')::int;after_mass=(clue->>'after')::int;if after_mass<=before_mass then return null;end if;
 else
  if jsonb_typeof(clue->'checks') is distinct from 'array' or jsonb_array_length(clue->'checks')<>n then return null;end if;
  for i in 0..n-1 loop
   if clue->'checks'->i='"broken"'::jsonb then if not broken then moment=i;end if;broken=true;
   elsif clue->'checks'->i is distinct from '"intact"'::jsonb or broken then return null;end if;
  end loop;if moment=-1 then return null;end if;
 end if;
 for i in 0..n-1 loop
  if jsonb_typeof(p->'names'->i) is distinct from 'string' or char_length(trim(p->'names'->>i))<1 or char_length(p->'names'->>i)>30 or p->'names'->>i=any(names) then return null;end if;names=array_append(names,p->'names'->>i);
  if jsonb_typeof(p->'portraits'->i) is distinct from 'number' then return null;end if;x=(p->'portraits'->>i)::numeric;if x<>trunc(x) or x not between 0 and 7 or x::int=any(portraits) then return null;end if;portraits=array_append(portraits,x::int);
  o=p->'objects'->i;if jsonb_typeof(o) is distinct from 'object' or jsonb_typeof(o->'name') is distinct from 'string' or char_length(trim(o->>'name'))<1 or char_length(o->>'name')>70 or o->>'name'=any(object_names) then return null;end if;object_names=array_append(object_names,o->>'name');
  if jsonb_typeof(o->'marks') is distinct from 'array' or jsonb_array_length(o->'marks')>4 or jsonb_typeof(o->'grams') is distinct from 'number' then return null;end if;
  x=(o->>'grams')::numeric;if x<>trunc(x) or x not between 1 and 1000 then return null;end if;
  for e in select value from jsonb_array_elements(o->'marks') loop if jsonb_typeof(e) is distinct from 'string' or char_length(trim(e#>>'{}'))<1 or char_length(e#>>'{}')>40 then return null;end if;end loop;
  if (mechanism in ('trace','access') and (o->'marks') @> (clue->'marks')) or (mechanism='inventory' and x=after_mass-before_mass) then if moment<>-1 then return null;end if;moment=i;end if;
  if p->'s'->i->1 is distinct from to_jsonb(i) then return null;end if;
 end loop;if moment=-1 then return null;end if;
 for s in select value from jsonb_array_elements(p->'s') union all select value->'rule' from jsonb_array_elements(p->'evidence') loop
  if jsonb_typeof(s) is distinct from 'array' or jsonb_array_length(s)<>4 or jsonb_typeof(s->0) is distinct from 'string' or coalesce(s->>0,'') not in ('oneof','left','next','apart') then return null;end if;ty=s->>0;
  for j in 1..3 loop if jsonb_typeof(s->j) is distinct from 'number' then return null;end if;x=(s->>j)::numeric;if x<>trunc(x) or x<0 or x>31 then return null;end if;end loop;
  a=(s->>1)::int;b=(s->>2)::int;k=(s->>3)::int;if a>=n then return null;end if;
  if ty='oneof' then if b<1 or b>=(1<<n) or k<>0 then return null;end if;
  elsif b>=n or a=b or (ty='apart' and k not between 1 and n-1) or (ty<>'apart' and k<>0) then return null;end if;
  if s::text=any(rules) then return null;end if;rules=array_append(rules,s::text);
 end loop;
 for e in select value from jsonb_array_elements(p->'evidence') loop
  foreach ty in array array['title','detail'] loop if jsonb_typeof(e->ty) is distinct from 'string' or char_length(trim(e->>ty))<1 or char_length(e->>ty)>(case when ty='title' then 60 else 300 end) then return null;end if;end loop;
 end loop;
 for positions in with recursive ownership(pos) as (select '{}'::int[] union all select ow.pos||g.entry from ownership ow cross join generate_series(0,n-1) as g(entry) where cardinality(ow.pos)<n and not g.entry=any(ow.pos)) select pos from ownership where cardinality(pos)=n loop
  fits=true;foreach ty in array rules loop if public._friend_alibi_evidence_rule(ty::jsonb,positions) is not true then fits=false;exit;end if;end loop;
  if fits then solutions=solutions+1;winner=array_position(positions,moment)-1;if solutions>1 then return null;end if;end if;
 end loop;
 if solutions<>1 then return null;end if;return winner;
exception when others then return null;
end $$;
create or replace function public._friend_alibi_culprit(p jsonb) returns int language plpgsql immutable set search_path='' as $$
begin
 if p->'version'='3'::jsonb then return public._friend_alibi_evidence(p);end if;
 if p->'version'='2'::jsonb then return public._friend_alibi_scenario(p);end if;
 return public._friend_alibi_v1_culprit(p);
end $$;
revoke all on function public._friend_alibi_evidence_rule(jsonb,int[]),public._friend_alibi_evidence(jsonb),public._friend_alibi_culprit(jsonb) from public,anon,authenticated;

create or replace function public._friend_alibi_score(v jsonb,d date) returns double precision language plpgsql immutable set search_path='' as $$
declare i int; j int; n int; x numeric; culprit int; correct int:=0; p jsonb; note jsonb; ids text[]:='{}';
begin
 if jsonb_typeof(v) is distinct from 'object' or v->'version' is distinct from '1'::jsonb or v->>'day' is distinct from d::text or v->'round' is distinct from '3'::jsonb or coalesce(v->>'phase','') not in ('review','summary') or jsonb_typeof(v->'edits') is distinct from 'number' then return null;end if;
 x=(v->>'edits')::numeric;if x<>trunc(x) or x not between 0 and 1000000 then return null;end if;
 if jsonb_typeof(v->'cases') is distinct from 'array' or jsonb_array_length(v->'cases')<>4 or jsonb_typeof(v->'picks') is distinct from 'array' or jsonb_array_length(v->'picks')<>4 or jsonb_typeof(v->'notes') is distinct from 'array' or jsonb_array_length(v->'notes')<>4 or v->'selection' is distinct from v->'picks'->3 then return null;end if;
 for i in 0..3 loop
  p=v->'cases'->i;culprit=public._friend_alibi_culprit(p);if culprit is null or p->>'id'=any(ids) then return null;end if;ids=array_append(ids,p->>'id');n=(p->>'n')::numeric;
  if jsonb_typeof(v->'picks'->i) is distinct from 'number' then return null;end if;x=(v->'picks'->>i)::numeric;if x<>trunc(x) or x not between 0 and n-1 then return null;end if;if x=culprit then correct=correct+1;end if;
  note=v->'notes'->i;if jsonb_typeof(note) is distinct from 'object' or jsonb_typeof(note->'truth') is distinct from 'array' or jsonb_array_length(note->'truth')<>n or jsonb_typeof(note->'excluded') is distinct from 'array' or jsonb_array_length(note->'excluded')<>n then return null;end if;
  if p->'version'='3'::jsonb then
   if jsonb_typeof(note->'objects') is distinct from 'array' or jsonb_array_length(note->'objects')<>n then return null;end if;
   for j in 0..n-1 loop if jsonb_typeof(note->'objects'->j) is distinct from 'number' then return null;end if;x=(note->'objects'->>j)::numeric;if x<>trunc(x) or x not between -1 and n-1 then return null;end if;end loop;
  end if;
  for j in 0..n-1 loop if jsonb_typeof(note->'truth'->j) is distinct from 'number' or (note->'truth'->>j)::numeric not in (-1,0,1) or jsonb_typeof(note->'excluded'->j) is distinct from 'boolean' then return null;end if;end loop;
 end loop;
 return correct*25;
exception when others then return null;
end $$;
create or replace function public._friend_score(g text,v jsonb,d date) returns double precision language plpgsql immutable set search_path='' as $$
declare i int; j int; n numeric; bet int; pick int; answer int; total int:=0; won int:=0; legacy int[]; q jsonb; c jsonb;
begin
 if jsonb_typeof(v) is distinct from 'object' then return null;end if;
 if g='stake' then
  if jsonb_typeof(v->'b')<>'array' or jsonb_typeof(v->'p')<>'array' or jsonb_array_length(v->'b')<>5 or jsonb_array_length(v->'p')<>5 then return null;end if;
  if v->>'rv' is not null and jsonb_typeof(v->'rv')<>'boolean' then return null;end if;
  if v->>'deadline' is not null and (jsonb_typeof(v->'deadline')<>'number' or (v->>'deadline')::numeric<=0) then return null;end if;
  if v->>'qs' is null then legacy=public._friend_legacy(d);
  elsif jsonb_typeof(v->'qs')<>'array' or jsonb_array_length(v->'qs')<>5 then return null;end if;
  for i in 0..4 loop
   if jsonb_typeof(v->'b'->i)<>'number' or jsonb_typeof(v->'p'->i)<>'number' then return null;end if;
   n=(v->'b'->>i)::numeric;if n<>trunc(n) or n<1 or n>3 then return null;end if;bet=n;
   n=(v->'p'->>i)::numeric;if n<>trunc(n) or n< -1 or n>2 then return null;end if;pick=n;
   if legacy is not null then answer=legacy[i+1];else
    q=v->'qs'->i;
    if jsonb_typeof(q->'q') is distinct from 'string' or jsonb_typeof(q->'c') is distinct from 'string' or jsonb_typeof(q->'f') is distinct from 'string' or jsonb_typeof(q->'o') is distinct from 'array' or jsonb_array_length(q->'o')<>3 or jsonb_typeof(q->'a') is distinct from 'number' then return null;end if;
    for j in 0..2 loop if jsonb_typeof(q->'o'->j)<>'string' then return null;end if;end loop;
    n=(q->>'a')::numeric;if n<>trunc(n) or n<0 or n>2 then return null;end if;answer=n;
   end if;
   total=total+bet;if pick=answer then won=won+bet;end if;
  end loop;return won::double precision/total*100;
 elsif g='inner-clock' then return public._friend_inner_clock_score(v,d);
 elsif g='bouncer' then return public._friend_bouncer_score(v,d);
 elsif g='alibi' then return public._friend_alibi_score(v,d);
 elsif g='laser' then return public._friend_laser_score(v,d);
 elsif g='prior' then return public._friend_prior_score(v,d);
 elsif g='pack' then return public._friend_pack_score(v,d);
 elsif g='stack-up' then
  if coalesce(v->>'version','') not in ('1','2') or v->>'day' is distinct from d::text or v->>'status' is distinct from 'complete' or v->'round' is distinct from '4'::jsonb then return null;end if;
  if jsonb_typeof(v->'version') is distinct from 'number' or jsonb_typeof(v->'score') is distinct from 'number' or jsonb_typeof(v->'deadline') is distinct from 'number' then return null;end if;
  foreach q in array array[v->'streak',v->'mistakes'] loop if jsonb_typeof(q) is distinct from 'number' or q::text::numeric<0 or q::text::numeric<>trunc(q::text::numeric) then return null;end if;end loop;
  if jsonb_typeof(v->'results') is distinct from 'array' or jsonb_array_length(v->'results')<>5 or jsonb_typeof(v->'order') is distinct from 'array' or jsonb_array_length(v->'order')<>5 then return null;end if;
  if (select count(distinct x) from jsonb_array_elements(v->'order') x where jsonb_typeof(x)='number' and x in ('1'::jsonb,'2'::jsonb,'3'::jsonb,'4'::jsonb,'5'::jsonb))<>5 then return null;end if;
  for i in 0..4 loop q=v->'results'->i;if jsonb_typeof(q->'correct') is distinct from 'boolean' or jsonb_typeof(q->'points') is distinct from 'number' or jsonb_typeof(q->'mistakes') is distinct from 'number' or (q->>'mistakes')::numeric<0 or (q->>'mistakes')::numeric<>trunc((q->>'mistakes')::numeric) then return null;end if;end loop;
  if not (v->>'version'='1' and v->>'stacks' is null) then
   if jsonb_typeof(v->'stacks') is distinct from 'array' or jsonb_array_length(v->'stacks')<>5 then return null;end if;
   for i in 0..4 loop q=v->'stacks'->i;
    if jsonb_typeof(q->'prompt') is distinct from 'string' or jsonb_typeof(q->'fact') is distinct from 'string' or jsonb_typeof(q->'ends') is distinct from 'array' or jsonb_array_length(q->'ends')<>2 or jsonb_typeof(q->'cards') is distinct from 'array' or jsonb_array_length(q->'cards')<>5 then return null;end if;
    for j in 0..4 loop c=q->'cards'->j;if jsonb_typeof(c->'name') is distinct from 'string' or c->'value' is distinct from to_jsonb(j+1) then return null;end if;end loop;
   end loop;
  end if;
  if v ? 'scoreVersion' and v->'scoreVersion' not in ('1'::jsonb,'2'::jsonb) then return null;end if;
  return greatest(0,least(100,(v->>'score')::double precision/(case when v->'scoreVersion'='2'::jsonb then 3100 else 31000 end)*100));
 end if;return null;
exception when others then return null;
end $$;
revoke all on function public._friend_alibi_score(jsonb,date),public._friend_score(text,jsonb,date) from public,anon,authenticated;
commit;
