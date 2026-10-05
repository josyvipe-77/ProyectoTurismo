"""Read only public inventory facts; do not retain personal contact fields."""
import concurrent.futures
import html
import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
raw = json.loads((ROOT / 'mincetur-apurimac-raw.geojson').read_text(encoding='utf-8'))
for key in ['13092','13295','14383','12256','14127','14655','11102','13915']:
    raw['features'].append({'properties': {'cod_reg': key}})
cache_file = ROOT / 'fichas-facts.json'
cache = json.loads(cache_file.read_text(encoding='utf-8')) if cache_file.exists() else {}

def clean(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub('<[^>]*>', ' ', s))).strip()

def fetch(feature):
    key = feature['properties']['cod_reg']
    if key in cache and cache[key].get('title') and cache[key].get('location', {}).get('Categoría'):
        return key, cache[key]
    url = 'https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=' + key
    try:
        response = urllib.request.urlopen(url, timeout=35)
        data = response.read()
        try:
            body = data.decode('utf-8')
        except UnicodeDecodeError:
            body = data.decode('windows-1252')
        spans = dict(re.findall(r'<span[^>]*id="([^"]+)"[^>]*>(.*?)</span>', body, re.S))
        # Whitelist name, administrative location and access tables only.
        facts = {k: clean(v) for k, v in spans.items()
                 if any(word in k.lower() for word in ['nombre', 'distrito', 'provincia', 'departamento'])}
        tables = [clean(t) for t in re.findall(r'<table\b.*?</table>', body, re.S)
                  if 'Recorrido' in clean(t) and 'Distancia' in clean(t)]
        title_match = re.search(r'<meta property="og:title" content="([^"]+)"', body)
        title = clean(title_match[1]) if title_match else ''
        for label in ['Departamento', 'Provincia', 'Distrito', 'Categoría']:
            match = re.search(label + r':\s*</span>\s*(?:</td>\s*)?<td[^>]*>(.*?)</td>', body, re.S)
            if match:
                facts[label] = clean(match[1])
        return key, {'title': title, 'location': facts, 'access': min(tables, key=len) if tables else '', 'source': url}
    except Exception as e:
        return key, {'error': str(e), 'source': url}

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    for key, result in pool.map(fetch, raw['features']):
        cache[key] = result
        cache_file.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'records': len(cache), 'names': sum(bool(v.get('title')) for v in cache.values()),
                  'sample': {k:cache.get(k) for k in ['575','578','8264','422','584','1316']}}, ensure_ascii=False))
