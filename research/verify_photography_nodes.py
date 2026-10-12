import concurrent.futures
import json
from pathlib import Path
from urllib.request import Request, urlopen

def fetch(id):
    url = f'https://api.openstreetmap.org/api/0.6/node/{id}.json'
    with urlopen(Request(url, headers={'User-Agent':'JACS Destinos academic coordinate verification'}), timeout=25) as response:
        data = json.load(response)
    item = {key:value for key,value in data['elements'][0].items() if key in {'type','id','lat','lon','tags'}}
    item['tags'] = {key:value for key,value in item.get('tags', {}).items() if key in {'name','tourism','source'}}
    return item

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    items = list(pool.map(fetch, [3256930630,5980287486,6127094389,6582905286]))
Path(__file__).with_name('photography-osm-node-verification.json').write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf-8')
for item in items:
    print(json.dumps(item,ensure_ascii=True))
