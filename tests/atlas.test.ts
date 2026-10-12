import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { adjacentPlace, regionBounds, touristPlaces } from '../src/data/apurimac-places.ts';

const boundary = JSON.parse(
  readFileSync(new URL('../src/data/apurimac-boundary.json', import.meta.url), 'utf8'),
);
const ring: [number, number][] = boundary.geometry.coordinates[0];
function inside([x, y]: [number, number]) {
  let included = false;
  for (let index = 0; index < ring.length - 1; index++) {
    const [ax, ay] = ring[index];
    const [bx, by] = ring[index + 1];
    if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) included = !included;
  }
  return included;
}

test('las seis paradas están dentro del polígono de Apurímac y tienen fuentes de consulta', () => {
  assert.equal(boundary.properties.shapeISO, 'PE-APU');
  assert.deepEqual(ring[0], ring.at(-1));
  assert.equal(touristPlaces.length, 6);
  assert.equal(new Set(touristPlaces.map((place) => place.id)).size, 6);
  for (const place of touristPlaces) {
    assert.ok(inside(place.coordinates), `${place.name} queda fuera de Apurímac`);
    assert.ok(
      place.coordinates[0] >= regionBounds[0][0] && place.coordinates[0] <= regionBounds[1][0],
    );
    assert.ok(
      place.coordinates[1] >= regionBounds[0][1] && place.coordinates[1] <= regionBounds[1][1],
    );
    assert.equal(new URL(place.source).hostname, 'consultasenlinea.mincetur.gob.pe');
    assert.ok(place.coordinateSource.startsWith('https://'));
  }
});

test('anterior y siguiente parten de la vista general y recorren todas las paradas en ambos sentidos', () => {
  assert.equal(adjacentPlace(null, 1), 0);
  assert.equal(adjacentPlace(null, -1), 5);
  let current = 0;
  for (let index = 0; index < 6; index++) {
    assert.equal(current, index);
    current = adjacentPlace(current, 1);
  }
  assert.equal(current, 0);
  assert.equal(adjacentPlace(current, -1), 5);
  for (let index = 0; index < 6; index++) current = adjacentPlace(current, -1);
  assert.equal(current, 0);
});
