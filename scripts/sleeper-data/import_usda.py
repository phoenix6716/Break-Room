"""Import actual USDA food records, collapsing historical UPC revisions first.

This creates source candidates, not independently reviewed answers. Ingredient and
category fields are evidence for later selectors; they do not certify every prompt.
"""
import argparse,csv,gzip,hashlib,io,json,pathlib,re,sqlite3,zipfile
from import_sources import normal,update_manifest

def product_name(name):
    # Pack sizes are input aliases, never extra food concepts.
    units=r'(?:fl\.?\s*oz|fluid\s*ounces?|ounces?|oz|pounds?|lbs?|kilograms?|kg|grams?|g|millilit(?:er|re)s?|ml|lit(?:er|re)s?|gallons?|gal|quarts?|qt|pints?|pt)'
    name=re.sub(r'\b\d+(?:[.,/]\d+)?\s*'+units+r'\b\.?',' ',name,flags=re.I)
    name=re.sub(r'\b(?:pack\s+of\s+\d+|\d+\s*[- ]?\s*(?:packs?|pk|ct|count|pcs?|pieces))\b',' ',name,flags=re.I)
    name=re.sub(r'\(\s*\)|\[\s*\]',' ',name)
    return re.sub(r'\s+',' ',name).strip(' ,;-')

def main():
    p=argparse.ArgumentParser();p.add_argument('--zip',required=True);p.add_argument('--database',required=True);p.add_argument('--out',default='content/sleeper-data/catalogues/usda-candidates.json.gz');p.add_argument('--review-date',default='2026-11-02');a=p.parse_args()
    db=sqlite3.connect(a.database);db.execute('pragma journal_mode=wal');db.execute('pragma synchronous=normal')
    db.executescript('create table if not exists food(id integer primary key,name text,published text);create table if not exists product(identity text primary key,id integer,brand text,subbrand text,ingredients text,category text,modified text,available text,country text,discontinued text);')
    with zipfile.ZipFile(a.zip) as z:
        def rows(name):
            file=next(n for n in z.namelist() if n.rsplit('/',1)[-1]==name)
            return csv.DictReader(io.TextIOWrapper(z.open(file),encoding='utf-8-sig'))
        batch=[]
        for i,r in enumerate(rows('food.csv')):
            batch.append((int(r['fdc_id']),r['description'],r['publication_date']))
            if len(batch)==5000:db.executemany('insert or replace into food values(?,?,?)',batch);db.commit();batch=[]
        if batch:db.executemany('insert or replace into food values(?,?,?)',batch);db.commit()
        print('food descriptions loaded',i+1,flush=True)
        insert='insert into product values(?,?,?,?,?,?,?,?,?,?) on conflict(identity) do update set id=excluded.id,brand=excluded.brand,subbrand=excluded.subbrand,ingredients=excluded.ingredients,category=excluded.category,modified=excluded.modified,available=excluded.available,country=excluded.country,discontinued=excluded.discontinued where (excluded.modified,excluded.available,excluded.id)>(product.modified,product.available,product.id)'
        batch=[]
        for i,r in enumerate(rows('branded_food.csv')):
            identity=(r['market_country']+':'+r['gtin_upc']) if r['gtin_upc'] else 'fdc:'+r['fdc_id']
            batch.append((identity,int(r['fdc_id']),r['brand_name'],r['subbrand_name'],r['ingredients'],r['branded_food_category'],r['modified_date'],r['available_date'],r['market_country'],r['discontinued_date']))
            if len(batch)==5000:db.executemany(insert,batch);db.commit();batch=[]
        if batch:db.executemany(insert,batch);db.commit()
        print('product revisions merged',i+1,flush=True)
    out=pathlib.Path(a.out);out.parent.mkdir(parents=True,exist_ok=True);categories={};n=0
    query='select p.id,f.name,p.brand,p.subbrand,p.ingredients,p.category,p.modified,p.available,p.country,p.identity from product p join food f on f.id=p.id where (p.discontinued="" or p.discontinued>?) and f.published<=? and p.available<=? order by p.id'
    temporary=out.with_suffix('.gz.tmp')
    with temporary.open('wb') as destination,gzip.GzipFile(filename='',mode='wb',fileobj=destination,mtime=0) as zipped:
        zipped.write(b'{"source":"USDA FoodData Central, October 2026","license":"CC0-1.0","status":"candidates; membership and ratings require review","records":[')
        for id,name,brand,subbrand,ingredients,category,modified,available,country,identity in db.execute(query,(a.review_date,a.review_date,a.review_date)):
            if not normal(name) or len(name)>240 or len(normal(name))>240:continue
            # Do not fabricate product names from corporate brand-owner names.
            cleaned=product_name(name)
            if not normal(cleaned):continue
            parts=[b.strip() for b in [brand,subbrand] if b.strip() and normal(b) not in normal(name)]
            label=' '.join([*dict.fromkeys(parts),cleaned]);original=' '.join([*dict.fromkeys(parts),name])
            if len(label)>240 or len(normal(label))>240:label=name
            record={'id':'fdc:'+str(id),'name':label,'aliases':[original] if normal(original)!=normal(label) and len(original)<=240 else [],'description':name,'brand':brand,'ingredients':ingredients,'category':category,'country':country,'modified':modified,'available':available,'productIdentity':identity}
            if n:zipped.write(b',')
            zipped.write(json.dumps(record,ensure_ascii=False,separators=(',',':')).encode());n+=1;categories[category]=categories.get(category,0)+1
        zipped.write(b']}\n')
    db.close();temporary.replace(out);raw=gzip.decompress(out.read_bytes());source={'file':str(out),'sha256':hashlib.sha256(raw).hexdigest(),'compressedSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'bytes':len(raw),'compressedBytes':out.stat().st_size,'concepts':n,'sourceUrl':'https://fdc.nal.usda.gov/download-datasets/','attribution':'USDA FoodData Central, CC0 1.0 public domain','rawSha256':hashlib.file_digest(open(a.zip,'rb'),'sha256').hexdigest(),'sourceRelease':'2026-10-29','reviewed':a.review_date,'license':'CC0-1.0','categories':categories,'limitation':'UPCs merge historical revisions; separate products still require concept/synonym review and must not inflate a generic-food question.'}
    update_manifest(out.parent.parent/'sources.json',[source]);print(json.dumps({'concepts':n,'compressedBytes':source['compressedBytes'],'categories':len(categories)},indent=2))
if __name__=='__main__':main()
