"""Import bounded, class-proven Wikidata captures without inventing membership."""
import argparse,collections,hashlib,json,pathlib
from import_sources import normal,write,update_manifest

def main():
    p=argparse.ArgumentParser();p.add_argument('--collection',required=True);p.add_argument('--json',required=True);p.add_argument('--query',required=True);p.add_argument('--out',default='content/sleeper-data/catalogues');a=p.parse_args()
    raw=pathlib.Path(a.json).read_bytes();rows=json.loads(raw)['results']['bindings'];records={}
    for r in rows:
        entity=r['item']['value'];key='wd:'+entity.rsplit('/',1)[-1];name=r['name']['value']
        if not name or len(name)>240 or not normal(name):continue
        record=records.setdefault(key,{'id':key,'name':name,'aliases':[],'sitelinks':int(r.get('sitelinks',{}).get('value',0)),'classProof':a.collection})
        for n in [name,r.get('alias',{}).get('value','')]:
            if n!=record['name'] and 0<len(n)<=240 and normal(n):record['aliases'].append(n)
        record['aliases']=list(dict.fromkeys(record['aliases']))
    out=pathlib.Path(a.out)/('wikidata-'+a.collection+'.json.gz')
    query=pathlib.Path(a.query).read_text()
    meta=write(out,{'source':'Wikidata '+a.collection+' bounded class query','license':'CC0-1.0','query':query,'records':list(records.values())})
    meta.update({'concepts':len(records),'sourceUrl':'https://query.wikidata.org/','rawSha256':hashlib.sha256(raw).hexdigest(),'query':query,'attribution':'Wikidata contributors, structured data under CC0. Class membership is a candidate filter; individual question eligibility and aliases require review.','reviewed':'2026-11-02'})
    update_manifest(out.parent.parent/'sources.json',[meta]);print(a.collection,len(records),flush=True)
if __name__=='__main__':main()
