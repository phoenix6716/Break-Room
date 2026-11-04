"""Import real occupations and work activities; job-title aliases do not increase counts."""
import argparse,collections,csv,gzip,hashlib,io,json,pathlib,re,zipfile
from import_sources import normal,write,update_manifest

def main():
    p=argparse.ArgumentParser();p.add_argument('--zip',required=True);p.add_argument('--out',default='content/sleeper-data/catalogues');a=p.parse_args();out=pathlib.Path(a.out)
    with zipfile.ZipFile(a.zip) as z:
        def rows(name):return csv.DictReader(io.TextIOWrapper(z.open(next(n for n in z.namelist() if n.rsplit('/',1)[-1]==name)),encoding='utf-8-sig'))
        occupations={r['O*NET-SOC Code']:{'id':'onet31:'+r['O*NET-SOC Code'],'name':r['Title'],'aliases':[],'soc':r['O*NET-SOC Code'],'definition':r['Description'],'contexts':{}} for r in rows('occupation_data.csv')}
        job_titles={}
        for r in rows('job_titles.csv'):
            title=r['Job Title'].strip()
            if normal(title) and len(title)<=240:
                key='onet31:job:'+normal(title)
                item=job_titles.setdefault(key,{'id':key,'name':title,'aliases':[],'socCodes':[],'kind':'job title'})
                item['socCodes'].append(r['O*NET-SOC Code'])
                if r['Short Title'].strip():item['aliases'].append(r['Short Title'].strip())
                # Published abbreviations and reversed directory wording are aliases.
                abbreviation=re.fullmatch(r'(.+?)\s*\(([A-Z][A-Z0-9/-]{1,15})\)',title)
                if abbreviation:item['aliases'].extend([abbreviation[1],abbreviation[2]])
                if ',' in title:item['aliases'].append(' '.join(reversed([x.strip() for x in title.split(',') if x.strip()])))
            occupation=occupations.get(r['O*NET-SOC Code'])
            if occupation:
                for alias in [r['Job Title'],r['Short Title']]:
                    if alias and len(alias)<=240 and normal(alias) and normal(alias)!=normal(occupation['name']):occupation['aliases'].append(alias)
        for r in rows('work_context.csv'):
            if r['Scale ID']=='CX' and r['Recommend Suppress']!='Y' and r['O*NET-SOC Code'] in occupations:
                occupations[r['O*NET-SOC Code']]['contexts'][r['Element Name']]={'value':float(r['Data Value']),'date':r['Date'],'source':r['Domain Source']}
        # WordNet joins actual lexical synonyms, never all titles sharing a SOC bucket.
        wn=json.loads(gzip.decompress((out/'wordnet.json.gz').read_bytes()))['records']
        synonym_index=collections.defaultdict(set)
        person_senses=collections.defaultdict(list)
        for record in wn:
            if record['domain']=='noun.person':
                for label in [record['name'],*record['aliases']]:person_senses[normal(label)].append(record)
        for label,senses in person_senses.items():
            # An ambiguous word such as fireman must not join firefighter and stoker.
            if len(senses)==1:synonym_index[label].update([senses[0]['name'],*senses[0]['aliases']])
        for item in job_titles.values():
            item['socCodes']=sorted(set(item['socCodes']));item['aliases'].extend(synonym_index[normal(item['name'])]);item['aliases']=list(dict.fromkeys(x for x in item['aliases'] if len(x)<=240 and normal(x)!=normal(item['name'])))
        for r in occupations.values():r['aliases']=list(dict.fromkeys(r['aliases']))
        tasks={}
        for r in rows('task_statements.csv'):
            key='onet31:task:'+r['Task ID'];name=r['Task'].strip()
            if not normal(name) or len(name)>240:continue
            task=tasks.setdefault(key,{'id':key,'name':name,'aliases':[],'occupations':[],'kind':'task'})
            if task['name']!=name:raise ValueError('Task ID changes meaning')
            task['occupations'].append(r['O*NET-SOC Code'])
        for r in rows('gwas_to_iwas_to_dwas.csv'):
            for level in ['IWA','DWA']:
                key='onet31:'+r[level+' Element ID'];name=r[level+' Element Name'].strip()
                if len(name)>240 or not normal(name):continue
                tasks.setdefault(key,{'id':key,'name':name,'aliases':[],'parent':r['GWA Element Name'],'kind':level})
        software={}
        for r in rows('software_skills.csv'):
            name=r.get('Workplace Example','')
            if not name:raise ValueError('Review the current software schema before import: '+str(r.keys()))
            if len(name)>240 or not normal(name):continue
            key='onet31:software:'+normal(name);item=software.setdefault(key,{'id':key,'name':name,'aliases':[],'occupations':[],'kind':'software'})
            item['occupations'].append(r['O*NET-SOC Code'])
        readme=next(n for n in z.namelist() if n.endswith('/Read Me.txt'));license=out.parent/'licenses/onet-31.0-ReadMe.txt';license.parent.mkdir(exist_ok=True);license.write_bytes(z.read(readme))
    sources=[]
    for label,records in [('occupations',list(occupations.values())),('job-titles',list(job_titles.values())),('activities',list(tasks.values())),('software',list(software.values()))]:
        meta=write(out/('onet-'+label+'.json.gz'),{'source':'O*NET 31.0','license':'CC-BY-4.0','status':'source candidates; not reviewed answer banks','records':records});meta.update({'concepts':len(records),'sourceUrl':'https://www.onetcenter.org/database.html','rawSha256':hashlib.file_digest(open(a.zip,'rb'),'sha256').hexdigest(),'attribution':'WordNet lexical aliases use the included Princeton licence. Based on O*NET 31.0, U.S. Department of Labor, Employment and Training Administration (USDOL/ETA), CC BY 4.0; transformed for source evaluation. O*NET is a trademark of USDOL/ETA. No endorsement is implied.'});sources.append(meta)
    update_manifest(out.parent/'sources.json',sources);print(json.dumps([{'file':s['file'],'concepts':s['concepts']} for s in sources],indent=2))
if __name__=='__main__':main()
