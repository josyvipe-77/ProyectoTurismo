import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  catalogCounts,
  geographicDistance,
  geographicNeighbors,
  nextRouteStop,
  normalizeSearch,
  provinces,
  regionalRoutes,
  resourceById,
  resources,
  routeMapPlaces,
} from '../src/data/regional-tourism.ts';

test('el inventario conserva su alcance y no cuenta fiestas ni Illanya dos veces como pins', () => {
  assert.equal(resources.length, 135);
  assert.equal(new Set(resources.map((resource) => resource.id)).size, resources.length);
  assert.equal(provinces.length, 7);
  assert.deepEqual(catalogCounts, { total: 135, places: 122, mapped: 62 });
  assert.equal(resourceById.has('4672'), false);
  assert.deepEqual(resourceById.get('11102')?.aliases, ['4672']);
  assert.equal(resourceById.get('8320')?.kind, 'Celebración');
  for (const resource of resources) {
    assert.ok(resource.source.startsWith('https://'));
    assert.ok(!resource.name.includes('\ufffd'));
    if (resource.kind !== 'Lugar' || resource.coordinateStatus === 'conflicto')
      assert.equal(resource.coordinates, null);
  }
});
test('las propuestas preservan escalas sin coordenadas y cada acceso tiene una fuente válida', () => {
  assert.equal(regionalRoutes.length, 15);
  for (const route of regionalRoutes) {
    for (const id of [...route.stops, ...route.branches.flatMap((branch) => branch.stops)])
      assert.ok(resourceById.has(id), `${route.id}: ${id}`);
    for (const leg of route.legs) {
      assert.ok(resourceById.has(leg.from));
      assert.ok(resourceById.has(leg.to));
      assert.ok(resourceById.has(leg.source));
    }
    for (const branch of route.branches) assert.ok(resourceById.has(branch.source));
    assert.ok(routeMapPlaces(route).every((place) => resourceById.get(place.id)?.coordinates));
  }
  const capuliyoc = regionalRoutes.find((route) => route.id === 'cachora')!;
  assert.deepEqual(capuliyoc.stops, ['8066']);
  assert.equal(routeMapPlaces(capuliyoc).length, 0);
  assert.equal(resourceById.get('422')?.coordinateStatus, 'conflicto');
});
test('Pacucha y Sóndor comparten circuito; Cconoc usa una conexión regional con escalas intermedias', () => {
  const local = regionalRoutes.find((route) => route.id === 'pacucha-sondor')!;
  assert.deepEqual(local.stops, ['8806', '1316', '578']);
  assert.ok(!local.stops.includes('575'));
  assert.match(local.legs[1].detail, /6 km/);
  const regional = regionalRoutes.find((route) => route.id === 'conexion-pacucha-cconoc')!;
  assert.deepEqual(regional.stops, ['1316', '8806', '1800', '8640', '571', '32', '575']);
  assert.equal(regional.kind, 'Conexión regional');
  assert.ok(regional.branches.some((branch) => branch.stops.includes('578')));
});
test('las flechas de un circuito no saltan de extremo a extremo ni fallan en rutas sin pins', () => {
  assert.equal(nextRouteStop(null, 1, 3), 0);
  assert.equal(nextRouteStop(null, -1, 3), 2);
  assert.equal(nextRouteStop(0, -1, 3), 0);
  assert.equal(nextRouteStop(2, 1, 3), 2);
  assert.equal(nextRouteStop(null, 1, 0), null);
  assert.equal(nextRouteStop(0, 1, 1), 0);
});

test('Karkatera aparece en su circuito sin atribuir coordenadas a Qello Yaku o al mirador de Ccoya', () => {
  const route = regionalRoutes.find((item) => item.id === 'karkatera')!;
  const pins = routeMapPlaces(route);
  assert.deepEqual(
    pins.map((place) => place.id),
    ['9023'],
  );
  assert.deepEqual(pins[0].coordinates, [-72.9768126, -13.5628083]);
  assert.equal(pins[0].coordinateSource, 'https://www.openstreetmap.org/way/310159538');
  assert.ok(resourceById.get('qello-yaku')!.coordinates === null);
  assert.ok(resourceById.get('ccoya')!.coordinates === null);
});
test('la cercanía se calcula como distancia geográfica sin convertirla en carretera', () => {
  assert.equal(geographicDistance([0, 0], [0, 0]), 0);
  assert.ok(Math.abs(geographicDistance([0, 0], [1, 0]) - 111.195) < 0.01);
  assert.equal(geographicNeighbors(resourceById.get('422')!).length, 0);
  const neighbors = geographicNeighbors(resourceById.get('573')!);
  assert.ok(neighbors.length === 3);
  assert.ok(neighbors[0].distance <= neighbors[1].distance);
  assert.ok(neighbors.every((entry) => entry.resource.id !== '422'));
  assert.equal(normalizeSearch('SÓNDOR'), 'sondor');
});
test('los pins referenciales pasan el límite regional usado; las discrepancias siguen documentadas', () => {
  const ring: number[][] = JSON.parse(
    readFileSync(new URL('../src/data/apurimac-boundary.json', import.meta.url), 'utf8'),
  ).geometry.coordinates[0];
  for (const resource of resources) {
    if (!resource.coordinates) continue;
    const [x, y] = resource.coordinates;
    let included = false;
    for (let index = 0; index < ring.length - 1; index++) {
      const [ax, ay] = ring[index],
        [bx, by] = ring[index + 1];
      if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) included = !included;
    }
    assert.ok(included, resource.name);
  }
  assert.match(resourceById.get('8066')!.coordinateNote, /límite/);
  assert.match(resourceById.get('1798')!.coordinateNote, /Cusco/);
});
