import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  budgetFor,
  createPlan,
  isRoutePlan,
  stopsForDay,
  validateSelection,
} from '../src/lib/plan.ts';
import { readStored, writeStored } from '../src/lib/storage.ts';

test('no genera una ruta con destinos, intereses o duración incompletos', () => {
  const selection = { days: 4, destinations: [], interests: [] };
  assert.match(validateSelection(selection) ?? '', /destino/);
  assert.throws(() => createPlan(selection));
  assert.match(validateSelection({ ...selection, destinations: ['Pacucha'] }) ?? '', /interés/);
  for (const days of [0, 1, 11, 3.5, NaN])
    assert.ok(validateSelection({ days, destinations: ['Pacucha'], interests: ['Cultura'] }));
});
test('evita comprimir más destinos que jornadas disponibles', () => {
  assert.match(
    validateSelection({
      days: 2,
      destinations: ['Andahuaylas', 'Pacucha', 'Sóndor'],
      interests: ['Cultura'],
    }) ?? '',
    /máximo/,
  );
});
test('el presupuesto mantiene el total por persona en todas las duraciones y el ejemplo Chanka', () => {
  for (let days = 2; days <= 10; days++) {
    const plan = createPlan({
      days,
      destinations: ['Andahuaylas', 'Pacucha'],
      interests: ['Cultura'],
    });
    assert.equal(
      budgetFor(days).reduce((total, item) => total + item.value, 0),
      plan.cost,
    );
    assert.equal(stopsForDay(plan).length, days);
    assert.equal(plan.cost, days * 170);
    assert.equal(isRoutePlan(plan), true);
  }
  assert.equal(
    createPlan({ days: 4, destinations: ['Andahuaylas'], interests: ['Cultura'] }).cost,
    680,
  );
});
test('las jornadas extra permanecen en la última escala y el borrador no muta con las selecciones', () => {
  const selection = { days: 4, destinations: ['Andahuaylas', 'Pacucha'], interests: ['Cultura'] };
  const plan = createPlan(selection);
  selection.destinations.push('Sóndor');
  assert.deepEqual(stopsForDay(plan), ['Andahuaylas', 'Pacucha', 'Pacucha', 'Pacucha']);
});
test('rechaza datos guardados con estructura o presupuesto inválidos', () => {
  const plan = createPlan({ days: 4, destinations: ['Pacucha'], interests: ['Cultura'] });
  for (const invalid of [
    null,
    [],
    { ...plan, cost: 0 },
    { ...plan, createdAt: 'ayer' },
    { ...plan, destinations: [] },
    { ...plan, interests: [42] },
  ])
    assert.equal(isRoutePlan(invalid), false);
});
test('un almacenamiento corrupto o bloqueado nunca rompe la aplicación', () => {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
    },
  });
  const isStrings = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((item) => typeof item === 'string');
  assert.equal(writeStored('favorites:v1', ['chanka']), true);
  assert.deepEqual(readStored('favorites:v1', [], isStrings), ['chanka']);
  store.set('favorites:v1', '{bad json');
  assert.deepEqual(readStored('favorites:v1', [], isStrings), []);
  store.set('favorites:v1', '[123]');
  assert.deepEqual(readStored('favorites:v1', [], isStrings), []);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get: () => {
      throw new Error('blocked');
    },
  });
  assert.equal(writeStored('favorites:v1', []), false);
  assert.deepEqual(readStored('favorites:v1', [], isStrings), []);
});
