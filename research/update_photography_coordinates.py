"""Apply independently retrieved feature coordinates and refresh the public inventory."""
import csv
import json
import math
from pathlib import Path

root = Path(__file__).resolve().parents[1]
proof_path = root / 'research/photography-osm-node-verification.json'
proof = [{key: value for key, value in item.items() if key in {'type', 'id', 'lat', 'lon', 'tags'}} for item in json.loads(proof_path.read_text(encoding='utf-8'))]
proof_path.write_text(json.dumps(proof, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
by_id = {item['id']: item for item in proof}
overrides_path = root / 'research/coordinate-overrides.json'
overrides = json.loads(overrides_path.read_text(encoding='utf-8'))
for resource_id, node_id, note in [
    ('577', 6127094389, 'Puesto de control de visitantes del Santuario Nacional de Ampay cartografiado en OpenStreetMap. Se señala el acceso, no una laguna: el sendero y la laguna de la jornada siguen por delimitar.'),
    ('2039', 5980287486, 'Mirador Capitán Rumi cartografiado en OpenStreetMap, contrastado con su ficha turística en Curahuasi. El recorrido y los tiempos de acceso están por comprobar.'),
    ('3055', 6582905286, 'Mirador San Cristóbal cartografiado en OpenStreetMap, contrastado con su ficha turística en Curahuasi. El recorrido y los tiempos de acceso están por comprobar.'),
]:
    node = by_id[node_id]
    overrides[resource_id] = dict(coordinates=[node['lon'], node['lat']], coordinateStatus='referencial', coordinateSource=f'https://www.openstreetmap.org/node/{node_id}', coordinateNote=note)
overrides_path.write_text(json.dumps(overrides, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
catalog_path = root / 'src/data/apurimac-catalog.json'
catalog = json.loads(catalog_path.read_text(encoding='utf-8'))
for resource in catalog:
    if resource['id'] in overrides:
        resource.update(overrides[resource['id']])
catalog_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def distance(a, b):
    lon1, lat1, lon2, lat2 = map(math.radians, [*a, *b])
    term = math.sin((lat2-lat1)/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin((lon2-lon1)/2)**2
    return 6371 * 2 * math.atan2(math.sqrt(term), math.sqrt(1-term))

csv_path = root / 'public/research/inventario-apurimac.csv'
with csv_path.open(encoding='utf-8-sig', newline='') as file:
    reader = csv.DictReader(file)
    fields, rows = reader.fieldnames, list(reader)
resources = {item['id']: item for item in catalog}
for row in rows:
    item = resources[row['id']]
    coords = item['coordinates']
    row.update(longitud=coords[0] if coords else '', latitud=coords[1] if coords else '', estado_coordenada=item['coordinateStatus'], observaciones=item['coordinateNote'])
    nearest = sorted(((distance(coords, other['coordinates']), other) for other in catalog if coords and other['coordinates'] and other['id'] != item['id']), key=lambda entry: entry[0])[:3]
    row['vecinos_linea_recta_no_carretera'] = ' | '.join(f'{other["name"]}: {km:.1f} km' for km, other in nearest)
with csv_path.open('w', encoding='utf-8', newline='') as file:
    writer = csv.DictWriter(file, fields)
    writer.writeheader()
    writer.writerows(rows)
print(f'{len(catalog)} recursos; {sum(bool(item["coordinates"]) for item in catalog)} puntos cartografiados.')
