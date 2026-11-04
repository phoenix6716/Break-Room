/* Independent-source provenance and semantic selection safety. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),zlib=require('node:zlib'),crypto=require('node:crypto'),cp=require('node:child_process');
const manifest=require('../content/sleeper-data/sources.json');for(const s of manifest.sources){const bytes=fs.readFileSync(s.file),raw=zlib.gunzipSync(bytes),data=JSON.parse(raw);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),s.compressedSha256);assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),s.sha256);assert.equal(data.records.length,s.concepts);assert.equal(new Set(data.records.map(r=>r.id)).size,s.concepts);assert(data.license);assert(s.attribution);}
const probe=JSON.parse(cp.execFileSync('python3',['-c',String.raw`
import sys,json
sys.path.insert(0,'scripts/sleeper-data')
from import_sources import normal
from build_candidates import merge,select,qualify_places
records=[{'id':'wn:animal.n.01','name':'animal','aliases':[],'parents':[]},{'id':'wn:bird.n.01','name':'bird','aliases':[],'parents':['wn:animal.n.01']},{'id':'wn:sparrow.n.01','name':'sparrow','aliases':['house sparrow'],'parents':['wn:bird.n.01']},{'id':'wn:tree.n.01','name':'tree','aliases':[],'parents':[]}]
spec={'selector':{'kind':'wordnet','roots':['bird.n.01']},'familiar':['sparrow']}
a=select(spec,{'wordnet':records})
assert len(a)==1 and a[0]['name']=='sparrow'
assert len(merge([{'id':'one','name':'Trousers','aliases':['pants']},{'id':'two','name':'pants','aliases':['slacks']}]))==1
assert len(merge([{'id':'one','name':'Night','aliases':[]},{'id':'two','name':'Knight','aliases':[]}]))==2
places=qualify_places([{'id':'gn:one','name':'Sydney','aliases':[],'country':'AU','countryName':'Australia','admin1Name':'New South Wales','population':5000000},{'id':'gn:two','name':'Sydney','aliases':[],'country':'CA','countryName':'Canada','admin1Name':'Nova Scotia','population':30000}])
resolved=merge(places,['Sydney']);assert len(resolved)==2 and len({r['name'] for r in resolved})==2
assert next(r for r in resolved if 'Sydney' in r['aliases'])['population']==5000000
assert len(merge([{'id':'one','name':'European robin','aliases':['robin']},{'id':'two','name':'American robin','aliases':['robin']}]))==2
assert len(merge([{'id':'wn:generic','name':'treefrog','aliases':[]},{'id':'gbif:test:one','name':'treefrog','aliases':['Alpha beta'],'scientificName':'Alpha beta'},{'id':'gbif:test:two','name':'canopy treefrog','aliases':['treefrog','Gamma delta'],'scientificName':'Gamma delta'}]))==3
assert len(merge([{'id':'wn:specific','name':'European robin','aliases':['Erithacus rubecula']},{'id':'gbif:test:one','name':'robin','aliases':['Erithacus rubecula'],'scientificName':'Erithacus rubecula'}]))==1
spec={'selector':{'kind':'wordnet','roots':['bird.n.01'],'formsPattern':'double'},'familiar':[]}
assert select(spec,{'wordnet':records})==[]
spec={'selector':{'kind':'ncit','roots':['ncit:root']},'familiar':[]}
assert len(select(spec,{'ncit':[{'id':'ncit:root','name':'root','parents':[]},{'id':'ncit:child','name':'child','parents':['ncit:root']}]}))==1
print(json.dumps([normal(x) for x in ['Café','The Gambia','ABC東京DEF','Fish & chips','Macleay’s bat','the the horse']]))
`],{encoding:'utf8'}));require('../hidden-gem-model.js');assert.deepEqual(probe,['Café','The Gambia','ABC東京DEF','Fish & chips','Macleay’s bat','the the horse'].map(BREAK_ROOM_HIDDEN_GEM.normal));
assert(fs.existsSync('content/sleeper-data/licenses/wordnet-LICENSE.txt'));assert(fs.existsSync('content/sleeper-data/licenses/wordfreq-NOTICE.md'));assert(fs.readFileSync('content/sleeper-data/licenses/wordfreq-NOTICE.md','utf8').includes('Robyn Speer'));
console.log('PASS sources: pinned source hashes/licenses/counts, unique concept IDs, literal hierarchy membership, synonym collapse without homophone inflation, and Python/browser normalisation parity.');
