/* Execute the real schema and RLS against PostgreSQL (PGlite), not a SQL mock. */
const assert=require('node:assert/strict'),fs=require('node:fs'),{PGlite}=require('@electric-sql/pglite');
const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002';
(async()=>{
 const db=new PGlite();try{
 await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated; insert into auth.users values ('${a}'),('${b}');`);
 await db.exec(fs.readFileSync('supabase/setup.sql','utf8'));
 await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub','${a}',false);`);
 let r=await db.query(`select public.save_game('stake',$1::jsonb,0) as r`,[JSON.stringify({'stake:d:2026-10-20':'{"b":[1],"p":[]}'})]);assert.equal(r.rows[0].r.revision,1);
 r=await db.query(`select public.save_game('stake','{}',0) as r`);assert.equal(r.rows[0].r.conflict,true);
 r=await db.query(`select public.save_game('stake','{}',1) as r`);assert.equal(r.rows[0].r.revision,2);
 assert.equal((await db.query('select * from public.game_saves')).rows.length,1);
 await assert.rejects(db.exec(`insert into public.game_saves(user_id,game) values ('${b}','lowball')`),/permission denied/i);
 await assert.rejects(db.exec(`update public.game_saves set data='{}'`),/permission denied/i);
 await assert.rejects(db.exec(`delete from public.game_saves`),/permission denied/i);
 await assert.rejects(db.query(`select public.save_game('lowball','{"br:supabase:auth":"stolen"}',0)`),/Unsupported save/i);
 await db.exec(`select set_config('request.jwt.claim.sub','${b}',false);`);
 assert.equal((await db.query('select * from public.game_saves')).rows.length,0,'Other user cannot read saves');
 await db.exec(`select public.save_game('stake','{}',0)`);
 const own=await db.query('select user_id from public.game_saves');assert.deepEqual(own.rows.map(r=>r.user_id),[b]);
 await db.exec(`reset role; set role anon;`);
 await assert.rejects(db.exec('select * from public.game_saves'),/permission denied/i);
 await assert.rejects(db.exec(`select public.save_game('stake','{}',0)`),/permission denied/i);
 await db.exec(`reset role; delete from auth.users where id='${a}';`);
 assert.equal((await db.query('select * from public.game_saves')).rows.length,1,'Deleting auth user cascades their saves only');
 console.log('PASS real PostgreSQL: schema, revision conflicts, account isolation, read RLS, no anonymous access/direct writes, key allowlist and account deletion cascade.');
 }finally{await db.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
