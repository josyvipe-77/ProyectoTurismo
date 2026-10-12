"""Read public OSM geometries for the photography route; store only map tags."""
import json
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

query = '[out:json][timeout:20];(node(3256930630);node(5980287486);node(6127094389);node(6582905286););out body;'

url = 'https://overpass.kumi.systems/api/interpreter?' + urlencode({'data': query})
with urlopen(Request(url, headers={'User-Agent': 'JACS Destinos academic map verification'}), timeout=40) as response:
    data = json.load(response)
if data.get('remark'):
    raise RuntimeError(data['remark'])
for item in data['elements']:
    item['tags'] = {key: value for key, value in item.get('tags', {}).items()
                    if key in {'name', 'tourism', 'natural', 'leisure', 'highway', 'bridge', 'access', 'source'}}
path = Path(__file__).with_name('photography-osm-extra-verification.json')
path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
for item in data['elements']:
    print(json.dumps(item, ensure_ascii=True))
