"""Import existing published colour names; spelling variants never add colours."""
import argparse,collections,csv,hashlib,io,json,pathlib,re
from import_sources import normal,write,update_manifest

def main():
 p=argparse.ArgumentParser();p.add_argument('--csv',required=True);p.add_argument('--license',required=True);p.add_argument('--commit',required=True);p.add_argument('--out',default='content/sleeper-data/catalogues/colours.json.gz');a=p.parse_args()
 if not re.fullmatch('[a-f0-9]{40}',a.commit):raise ValueError('Pin the colour source commit')
 license=pathlib.Path(a.license).read_text()
 if 'MIT License' not in license or 'David Aerne' not in license:raise ValueError('Review the colour source licence')
 raw=pathlib.Path(a.csv).read_bytes();groups={}
 for row in csv.DictReader(io.StringIO(raw.decode('utf-8-sig'))):
  name=row['name'];hex=row['hex'].lower()
  if not re.fullmatch('#[0-9a-f]{6}',hex) or not 0<len(name)<=240 or not normal(name):raise ValueError('Invalid published colour')
  key=normal(name).replace('grey','gray');key={'aqua':'cyan','fuchsia':'magenta'}.get(key,key)
  r=groups.setdefault(key,{'id':'colour-names:'+a.commit+':'+key,'name':name,'aliases':[],'sourceNames':[],'hexValues':[]})
  r['sourceNames'].append(name);r['hexValues'].append(hex)
  variants=[name,hex]
  if 'gray' in name.lower():variants.append(re.sub('gray','grey',name,flags=re.I))
  if 'grey' in name.lower():variants.append(re.sub('grey','gray',name,flags=re.I))
  r['aliases'].extend(n for n in variants if normal(n)!=normal(r['name']))
 for r in groups.values():
  r['aliases']=list(dict.fromkeys(r['aliases']));r['hexValues']=list(dict.fromkeys(r['hexValues']))
 out=pathlib.Path(a.out);meta=write(out,{'source':'Color Names, David Aerne and contributors, pinned '+a.commit,'license':'MIT','records':list(groups.values())})
 meta.update({'concepts':len(groups),'sourceUrl':'https://github.com/meodai/color-names/tree/'+a.commit,'rawSha256':hashlib.sha256(raw).hexdigest(),'sourceCommit':a.commit,'attribution':'Color Names, Copyright (c) 2017 David Aerne and contributors, MIT licence. Existing published names/RGB definitions retained; UK/US grey/gray forms and the standard aqua/cyan and fuchsia/magenta synonym pairs merged.','reviewed':'2026-11-02','limitation':'Published named shades, including paint and digital palettes; not a universal authoritative name for every possible RGB value. No cross-product of adjectives or invented shade names is generated.'})
 target=out.parent.parent/'licenses/Color-Names-LICENSE.txt';target.write_text(license);update_manifest(out.parent.parent/'sources.json',[meta]);print(json.dumps({'canonicalColourCandidates':len(groups),'sourceNames':sum(len(r['sourceNames']) for r in groups.values())},indent=2))
if __name__=='__main__':main()
