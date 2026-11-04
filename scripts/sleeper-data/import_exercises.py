"""Import actually catalogued fitness exercises; never generate variation products."""
import argparse,hashlib,json,pathlib
from import_sources import normal,write,update_manifest

def main():
 p=argparse.ArgumentParser();p.add_argument('--json',required=True);p.add_argument('--out',default='content/sleeper-data/catalogues/exercises.json.gz');a=p.parse_args();raw=pathlib.Path(a.json).read_bytes();data=json.loads(raw)
 if data.get('next') or data.get('count')!=len(data.get('results',[])):raise ValueError('Exercise capture is incomplete')
 licenses={r['license']['id']:r['license'] for r in data['results']};records=[]
 for row in data['results']:
  english=[t for t in row['translations'] if t['language']==2]
  names=[];authors=[];used=[]
  for t in english:
   license=licenses.get(t['license'])
   if not license or license['short_name'] not in ['CC-BY-SA 4','CC-BY-SA 3','CC0']:raise ValueError('Review this exercise translation licence')
   used.append(license['url']);authors.extend(t.get('author_history',[]));authors.append(t.get('license_author',''))
   names.extend([t['name'],*[x['alias'] for x in t.get('aliases',[])]])
  names=list(dict.fromkeys(n for n in names if n and len(n)<=240 and normal(n)))
  if not names:continue
  records.append({'id':'wger:'+row['uuid'],'name':names[0],'aliases':names[1:],'sourceUrl':'https://wger.de/api/v2/exerciseinfo/'+str(row['id'])+'/','authors':sorted(set(x for x in authors if x)),'licenses':sorted(set(used)),'category':row['category']['name'],'equipment':[e['name'] for e in row['equipment']],'muscles':[m.get('name_en') or m['name'] for m in row['muscles']],'modified':row['last_update_global']})
 out=pathlib.Path(a.out);meta=write(out,{'source':'wger public exercise catalogue, English titles and aliases','license':'CC-BY-SA-4.0 / CC-BY-SA-3.0 / CC0-1.0, per-record terms retained','records':records})
 meta.update({'concepts':len(records),'sourceUrl':'https://wger.de/api/v2/exerciseinfo/?language=2&limit=1000','rawSha256':hashlib.sha256(raw).hexdigest(),'attribution':'wger exercise contributors. Individual author histories, source URLs and licences are retained per record. English titles and supplied aliases adapted; no images or exercise instructions copied.','reviewed':'2026-11-02','limitation':'Names are catalogued exercises, not invented combinations of equipment, repetitions or weights. Alternate spelling and synonymous exercise names must be merged before canonical counting.'})
 update_manifest(out.parent.parent/'sources.json',[meta]);print(json.dumps({'exercises':len(records),'authors':len({x for r in records for x in r['authors']})},indent=2))
if __name__=='__main__':main()
