"""Normalise frozen public graph evidence without assuming missing facts false."""
import argparse,collections,hashlib,json,pathlib
from import_sources import write,update_manifest

def main():
 p=argparse.ArgumentParser();p.add_argument('--directory',required=True);p.add_argument('--out',default='content/sleeper-data/catalogues/dbpedia-evidence.json.gz');a=p.parse_args();directory=pathlib.Path(a.directory);records={};digest=hashlib.sha256();batches=0
 for file in sorted(directory.glob('*.json')):
  raw=file.read_bytes();data=json.loads(raw);keys=set(data['entities']);seen=set();digest.update(file.name.encode());digest.update(raw);batches+=1
  for r in data['response']['results']['bindings']:
   uri=r['item']['value'];key=uri.removeprefix('http://dbpedia.org/resource/')
   if key not in keys:raise ValueError('Evidence response includes an unexpected entity')
   record=records.setdefault(key,{'id':'dbpedia:'+key,'languageLinkCount':None,'facts':{}});property=r['property']['value'];value=r['value']
   if property=='urn:break-room:cross-language-links':
    count=int(value['value'])
    if count<0:raise ValueError('Invalid source coverage count')
    record['languageLinkCount']=max(record['languageLinkCount'] or 0,count);seen.add(key)
   else:
    name=property.removeprefix('http://dbpedia.org/ontology/');item={'value':value['value'],'type':value['type']}
    if value.get('datatype'):item['datatype']=value['datatype']
    values=record['facts'].setdefault(name,[])
    if item not in values:values.append(item)
  if seen!=keys:raise ValueError('Incomplete coverage count response')
 if not records:raise ValueError('No validated evidence batches')
 out=pathlib.Path(a.out);rows=sorted(records.values(),key=lambda r:r['id']);meta=write(out,{'source':'Legacy DBpedia public cross-language links and explicit graph predicates','license':'CC-BY-SA-3.0','records':rows})
 meta.update({'concepts':len(rows),'sourceUrl':'https://dbpedia.org/sparql','attribution':'DBpedia and Wikipedia contributors, legacy data under CC BY-SA 3.0. Cross-language link counts are a knowledge-base familiarity signal, not measured answer popularity or a player survey. Missing facts remain unknown.','rawBatchesSha256':digest.hexdigest(),'batches':batches,'reviewed':'2026-11-02','properties':['cross-language-links','computingPlatform','genre','publisher','developer','species','occupation','industry'],'limitation':'Only captured positive predicates establish membership. Source records without a requested property are not evidence that an answer is factually invalid.'})
 update_manifest(out.parent.parent/'sources.json',[meta]);print(json.dumps({'evidenceRecords':len(rows),'batches':batches},indent=2))
if __name__=='__main__':main()
