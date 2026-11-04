"""Import validated legacy DBpedia class captures with source-page attribution.

This uses the legacy Wikipedia-derived CC BY-SA dataset, not the separately
licensed Fusion KG. A capture is bounded; it is not a complete media inventory.
"""
import argparse,hashlib,json,pathlib,re
from import_sources import normal,write,update_manifest

def main():
 p=argparse.ArgumentParser();p.add_argument('--collection',required=True);p.add_argument('--json',required=True);p.add_argument('--query',required=True);p.add_argument('--out',default='content/sleeper-data/catalogues');a=p.parse_args();raw=pathlib.Path(a.json).read_bytes();rows=json.loads(raw)['results']['bindings'];records={}
 if not rows:raise ValueError('An empty class capture cannot establish a question bank')
 for r in rows:
  uri=r['item']['value'];name=r['name']['value']
  if not uri.startswith('http://dbpedia.org/resource/') or not normal(name) or len(name)>240:continue
  key='dbpedia:'+uri.split('/resource/',1)[1]
  # Wikipedia disambiguation suffixes are metadata; preserve full source titles as aliases.
  simple=re.sub(r'\s+\((?:(?:\d{4}\s+)?(?:film|novel|book|song|album|video game|board game|game|TV series|character|comics))\)$','',name,flags=re.I)
  item=records.setdefault(key,{'id':key,'name':simple,'aliases':[],'sourceTitle':name,'sourcePage':'https://en.wikipedia.org/wiki/'+uri.split('/resource/',1)[1],'classProof':a.collection})
  for form in [name,r.get('alias',{}).get('value','')]:
   if form and len(form)<=240 and normal(form)!=normal(item['name']):item['aliases'].append(form)
  item['aliases']=list(dict.fromkeys(item['aliases']))
 out=pathlib.Path(a.out)/('dbpedia-'+a.collection+'.json.gz');query=pathlib.Path(a.query).read_text()
 meta=write(out,{'source':'Legacy DBpedia Wikipedia-derived '+a.collection+' class capture','license':'CC-BY-SA-3.0','records':list(records.values())})
 meta.update({'concepts':len(records),'sourceUrl':'https://dbpedia.org/sparql','rawSha256':hashlib.sha256(raw).hexdigest(),'query':query,'attribution':'DBpedia and English Wikipedia contributors, legacy Wikipedia-derived data under CC BY-SA 3.0; source pages and their author histories retained per record. Labels and disambiguation metadata transformed. This does not use the Fusion KG.','licenseUrl':'https://creativecommons.org/licenses/by-sa/3.0/','licenseReference':'https://wiki.dbpedia.org/about','reviewed':'2026-11-02','limitation':'Bounded capture of the public legacy endpoint. Capture date is not a claim that every source article was updated that day.'})
 update_manifest(out.parent.parent/'sources.json',[meta]);print(a.collection,len(records),flush=True)
if __name__=='__main__':main()
