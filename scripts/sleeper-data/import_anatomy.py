"""Human-anatomy candidates with independently attested left/right counterparts.

A shared side-stripped label alone is not proof: both classes must share a parent
whose actual name/synonym matches it. This avoids turning left/right heart regions
into a claim that people have two hearts. The prompt must describe counterparts,
not promise every named variant occurs twice in every person.
"""
import argparse,collections,hashlib,json,pathlib,re,xml.etree.ElementTree as ET
from import_sources import normal,write,update_manifest
RDF='{http://www.w3.org/1999/02/22-rdf-syntax-ns#}';RDFS='{http://www.w3.org/2000/01/rdf-schema#}';OWL='{http://www.w3.org/2002/07/owl#}';FMA='{http://purl.org/sig/ont/fma/}'

def main():
    p=argparse.ArgumentParser();p.add_argument('--owl',required=True);p.add_argument('--out',default='content/sleeper-data/catalogues');a=p.parse_args();records={};parser=ET.iterparse(a.owl,events=('start','end'));root=None;depth=0;version=None
    for event,element in parser:
        if event=='start':
            depth+=1
            if root is None:root=element
            continue
        if depth==2 and element.tag==OWL+'Ontology':version=element.findtext(OWL+'versionInfo')
        if depth==2 and element.tag==OWL+'Class' and element.get(RDF+'about'):
            uri=element.get(RDF+'about');labels=[x.text for x in element.findall(RDFS+'label') if x.text];name=element.findtext(FMA+'preferred_name') or (labels[0] if labels else None)
            if name and len(name)<=240 and normal(name):
                aliases=list(dict.fromkeys([*labels,*[x.text for x in element.findall(FMA+'synonym') if x.text]]));aliases=[x for x in aliases if x!=name and 0<len(x)<=240 and normal(x)]
                records[uri]={'id':'fma:'+uri.rsplit('/',1)[-1],'uri':uri,'name':name,'aliases':aliases,'parentUris':[x.get(RDF+'resource') for x in element.findall(RDFS+'subClassOf') if x.get(RDF+'resource')],'definition':element.findtext(FMA+'definition') or ''}
        if depth==2:element.clear();root.remove(element)
        depth-=1
    roots=[uri for uri,r in records.items() if r['name']=='Anatomical structure']
    if version!='5.1.0' or len(roots)!=1:raise ValueError('Review this anatomy source version/schema before import')
    children=collections.defaultdict(list)
    for uri,r in records.items():
        for parent in r['parentUris']:children[parent].append(uri)
    material=set();todo=list(roots)
    while todo:
        uri=todo.pop()
        if uri in material:continue
        material.add(uri);todo.extend(children[uri])
    candidates=collections.defaultdict(lambda:collections.defaultdict(list))
    for uri in sorted(material):
        r=records[uri]
        for label in [r['name'],*r['aliases']]:
            sides=re.findall(r'\b(left|right)\b',label,re.I)
            if len(sides)!=1:continue
            shared=re.sub(r'\s+',' ',re.sub(r'\b(left|right)\b','',label,flags=re.I)).strip()
            if normal(shared):candidates[normal(shared)][sides[0].lower()].append((uri,shared))
    pairs=[]
    for key,sides in sorted(candidates.items()):
        if not sides['left'] or not sides['right']:continue
        evidence=[];aliases=[];canonical=None;parents=set()
        for left,shared in sorted(sides['left']):
            for right,_ in sorted(sides['right']):
                if left==right:continue
                common=set(records[left]['parentUris'])&set(records[right]['parentUris'])
                for parent in sorted(common):
                    r=records.get(parent)
                    if not r or re.search(r'\b(left|right)\b',r['name'],re.I) or key not in {normal(n) for n in [r['name'],*r['aliases']]}:continue
                    canonical=r['name'];aliases.extend(r['aliases']);parents.add(parent);evidence.extend([left,right])
        if not evidence:continue
        r=next(records[u] for u in sorted(parents) if records[u]['name']==canonical)
        pairs.append({'id':'fma-pair:'+key,'name':canonical,'aliases':list(dict.fromkeys(n for n in [key,*aliases] if normal(n)!=normal(canonical))),'sourceIds':sorted(set(records[u]['id'] for u in [*parents,*evidence])),'leftClasses':sorted(set(records[u]['id'] for u,_ in sides['left'])),'rightClasses':sorted(set(records[u]['id'] for u,_ in sides['right']))})
    out=pathlib.Path(a.out);sources=[]
    for label,rows in [('anatomy',list(records.values())),('pairs',pairs)]:
        meta=write(out/('fma-'+label+'.json.gz'),{'source':'Foundational Model of Anatomy 5.1.0','license':'CC-BY-4.0','status':'human anatomy source candidates; question wording and ratings require review','records':rows});meta.update({'concepts':len(rows),'sourceUrl':'https://github.com/uw-sig/FMA','rawSha256':hashlib.file_digest(open(a.owl,'rb'),'sha256').hexdigest(),'attribution':'University of Washington Structural Informatics Group; Cornelius Rosse, Jose Leonardo V. Mejino Jr. and FMA contributors; CC BY 4.0','sourceVersion':version,'limitation':'A side-specific class does not establish simultaneous bilateral occurrence. Use explicit counterpart wording; never infer that the whole heart is paired from its left/right regions.'});sources.append(meta)
    update_manifest(out.parent/'sources.json',sources);print(json.dumps([{'file':s['file'],'concepts':s['concepts']} for s in sources],indent=2))
if __name__=='__main__':main()
