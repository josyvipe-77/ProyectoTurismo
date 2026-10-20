"""Give catalog entries a labeled contextual image without inventing photographic coverage."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
catalog = json.loads((ROOT / 'src/data/apurimac-catalog.json').read_text(encoding='utf-8'))
photos = json.loads((ROOT / 'src/data/mincetur-photos.json').read_text(encoding='utf-8'))
by_id = {item['id']: item for item in catalog}
# These are images of the named reference, never photographs attributed to a missing resource.
province_cover = {'Abancay': '8640', 'Andahuaylas': '1316', 'Antabamba': '580',
                  'Aymaraes': '33', 'Chincheros': '14127', 'Cotabambas': '573', 'Grau': '585'}
related = {'1798': '8066', 'qello-yaku': '9023', 'ccoya': '9023',
           '2041': '602', '5923': '602', 'catarata-pampachiri': '8264',
           '8646': '31', '8643': '8640', 'sig-8320-tres-cruces': '585'}
result = {}
for item in catalog:
    if photos.get(item['id'], {}).get('photos'):
        continue
    reference_id = item.get('parent') or related.get(item['id']) or province_cover[item['province']]
    gallery = photos[reference_id]
    photo = gallery['photos'][0]
    result[item['id']] = {
        'referenceId': reference_id, 'referenceName': by_id[reference_id]['name'],
        'source': gallery['source'],
        'photo': {key: photo[key] for key in ['id', 'alt', 'thumbnail', 'full']},
    }
(ROOT / 'src/data/catalog-context-photos.json').write_text(
    json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{len(result)} contextual covers; verified galleries unchanged.')
