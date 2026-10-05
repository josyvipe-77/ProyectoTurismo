"""Verify public map geometry; do not store fiche contact details."""
import json
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent.parent
query = '[out:json][timeout:35];(way["tunnel"](-13.65,-73.01,-13.50,-72.94);nwr["name"~"Kark|Ccoya|Qello|Karc",i](-13.65,-73.04,-13.40,-72.87););out tags center geom;'
url = 'https://overpass-api.de/api/interpreter?' + urlencode({'data': query})
with urlopen(Request(url, headers={'User-Agent': 'Apu Rimaq coordinate verification'}), timeout=50) as response:
    data = json.load(response)
for item in data['elements']:
    item['tags'] = {key: value for key, value in item.get('tags', {}).items()
                    if key in {'name', 'place', 'highway', 'ref', 'tourism', 'tunnel', 'fixme', 'source'}}
(ROOT / 'research/karkatera-osm-verification.json').write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
for item in data['elements']:
    print(json.dumps({'type': item['type'], 'id': item['id'], 'center': item.get('center'), 'lat': item.get('lat'), 'lon': item.get('lon'), 'tags': item.get('tags')}, ensure_ascii=False))
