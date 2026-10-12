import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { photographyMapPlaces, validViewpointIds } from '../src/data/photography-map.ts';
import { photographyProgramText } from '../src/data/photography-experience.ts';
import { adjacentPlace, projectedPoint } from '../src/data/apurimac-places.ts';

test('el mapa comparte cinco destinos; varios miradores conservan la numeración del quinto día', () => {
  assert.deepEqual(
    photographyMapPlaces().map((place) => place.id),
    ['4678', '8264', '31', '577', '3055'],
  );
  const places = photographyMapPlaces(['8066', '2039', '3055']);
  assert.deepEqual(
    places.map((place) => place.mapLabel),
    ['1', '2', '3', '4', '5A', '5B', '5C'],
  );
  assert.equal(photographyMapPlaces([]).length, 4);
  assert.equal(validViewpointIds(['3055', '3055']), false);
  assert.equal(validViewpointIds(['inventado']), false);
  assert.equal(validViewpointIds([]), true);
});

test('los miradores y el acceso a Ampay coinciden con los nodos recuperados de OSM', () => {
  const nodes = JSON.parse(
    readFileSync(
      new URL('../research/photography-osm-node-verification.json', import.meta.url),
      'utf8',
    ),
  );
  for (const place of photographyMapPlaces(['3055', '2039', '8066'])) {
    const node = nodes.find((item: { id: number }) =>
      place.coordinateSource.endsWith(`/node/${item.id}`),
    );
    if (node) assert.deepEqual(place.coordinates, [node.lon, node.lat]);
    const projected = projectedPoint(place.coordinates);
    assert.ok(projected[0] > 0 && projected[0] < 720 && projected[1] > 0 && projected[1] < 680);
  }
  assert.match(photographyMapPlaces()[3].coordinateNote ?? '', /Puesto de control/);
});

test('las flechas funcionan con cuatro, cinco o siete destinos sin saltar a índices inexistentes', () => {
  for (const count of [4, 5, 7]) {
    assert.equal(adjacentPlace(count - 1, 1, count), 0);
    assert.equal(adjacentPlace(0, -1, count), count - 1);
  }
  assert.equal(adjacentPlace(null, 1, 0), null);
});

test('el programa exporta la selección y aclara la duración al combinar miradores', () => {
  const one = photographyProgramText(['8066']);
  assert.match(one, /Capuliyoc \(Cachora\)/);
  assert.doesNotMatch(one, /San Cristóbal \(Curahuasi\)/);
  const all = photographyProgramText(['3055', '2039', '8066']);
  assert.match(all, /Varios miradores seleccionados: recalcular/);
  for (const name of ['San Cristóbal', 'Capitán Rumi', 'Capuliyoc']) assert.ok(all.includes(name));
});
