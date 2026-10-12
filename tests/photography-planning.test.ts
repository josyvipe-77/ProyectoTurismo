import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  budgetEstimate,
  defaultTripPlanning,
  validTripPlanning,
} from '../src/data/photography-planning.ts';
import {
  photographyDays,
  photographyProgramText,
  plannedPhotographyDays,
} from '../src/data/photography-experience.ts';
import { photographyMapPlaces } from '../src/data/photography-map.ts';

test('las cotizaciones pendientes impiden publicar una simulación de precio completo', () => {
  const partial = budgetEstimate(defaultTripPlanning, 8);
  assert.equal(partial.admission, 15);
  assert.equal(partial.cost, 15);
  assert.equal(partial.complete, false);
  assert.equal(partial.estimate, null);
  const explicitZero = budgetEstimate(
    { ...defaultTripPlanning, transport: 0, guide: 0, meals: 0, insurance: 0 },
    8,
  );
  assert.equal(explicitZero.complete, true);
  assert.ok(Math.abs(explicitZero.estimate! - (15 * 1.1) / 0.85) < 0.0001);
});
test('vehículo y guía se reparten por grupo; el alojamiento queda fuera de los costos', () => {
  const settings = {
    ...defaultTripPlanning,
    transport: 3000,
    guide: 1500,
    meals: 400,
    insurance: 50,
    other: 100,
  };
  const six = budgetEstimate(settings, 6),
    eight = budgetEstimate(settings, 8),
    ten = budgetEstimate(settings, 10);
  assert.equal(eight.cost, 1127.5);
  assert.equal(six.cost - ten.cost, 300);
  assert.ok(Math.abs(eight.estimate! - (1127.5 * 1.1) / 0.85) < 0.0001);
  assert.equal(budgetEstimate(settings, 12).cost, 940);
  assert.ok(budgetEstimate(settings, 7).complete);
  for (const count of [5, 13, 6.5]) assert.throws(() => budgetEstimate(settings, count));
  assert.equal(budgetEstimate({ ...settings, admission: 'general' }, 8).admission, 34);
  assert.equal(budgetEstimate({ ...settings, admission: 'local' }, 8).admission, 9);
});
test('el almacenamiento rechaza importes inválidos y opciones desconocidas', () => {
  assert.equal(validTripPlanning(defaultTripPlanning), true);
  for (const patch of [
    { month: 13 },
    { ampayOption: 'nevado' },
    { transport: -1 },
    { guide: Infinity },
    { insurance: 'gratis' },
    { margin: 100 },
  ])
    assert.equal(validTripPlanning({ ...defaultTripPlanning, ...patch }), false);
});
test('cada variante mantiene horas ordenadas y evita las visitas después de los límites publicados', () => {
  const minutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };
  for (const month of [0, 1, 3, 6, 12])
    for (const ampayOption of ['angasqocha', 'bosque'] as const) {
      const days = plannedPhotographyDays({ ...defaultTripPlanning, month, ampayOption }, ['3055']);
      for (const day of days) {
        let previous = 0;
        for (const item of day.schedule) {
          const [start, end] = item.time.split('–').map(minutes);
          assert.ok(start >= previous && end > start && end < 1440, `${day.id}: ${item.time}`);
          previous = end;
        }
        assert.ok(day.tagline && day.stopDetails.length);
      }
      const pampachiri = days[1];
      const lastVisit = pampachiri.schedule.find((item) =>
        item.activity.includes('Últimos encuadres'),
      );
      if (month === 1 || month === 3) assert.equal(lastVisit?.time, '13:30–14:00');
      else assert.ok(pampachiri.schedule.some((item) => item.time === '15:00–16:00'));
      assert.ok(
        days[0].schedule.some(
          (item) => item.time === '15:45–16:45' && item.activity.includes('mirador'),
        ),
      );
      assert.ok(
        days[2].schedule.some(
          (item) => item.time === '16:00–17:10' && item.activity.includes('ribera'),
        ),
      );
    }
  assert.ok(photographyDays[1].schedule.some((item) => item.time === '15:00–16:00'));
});
test('el bosque cambia el recorrido y la descarga sin atribuir nuevas coordenadas al sendero', () => {
  const settings = { ...defaultTripPlanning, ampayOption: 'bosque' as const, month: 2, nights: 5 };
  const day = plannedPhotographyDays(settings, ['8066'])[3];
  assert.ok(!day.stops.some((stop) => stop.includes('Angasq')));
  assert.ok(!day.schedule.some((item) => item.activity.includes('hasta Angasq')));
  assert.deepEqual(
    photographyMapPlaces(['8066'], 'bosque')[3].coordinates,
    photographyMapPlaces(['8066'], 'angasqocha')[3].coordinates,
  );
  assert.match(
    photographyMapPlaces(['8066'], 'bosque')[3].description,
    /tramo autorizado del bosque/,
  );
  const text = photographyProgramText(['8066'], settings);
  assert.match(text, /Mes: Febrero/);
  assert.match(text, /Alojamiento no incluido/);
  assert.match(text, /13:30–14:00/);
  assert.ok(!text.split('DÍA 4:')[1].split('DÍA 5:')[0].includes('Laguna Angasq’ocha'));
});

test('los escenarios históricos de hotel no alteran el presupuesto ni se exportan', () => {
  const stored = JSON.parse(
    JSON.stringify({ ...defaultTripPlanning, lodgingId: 'siball', nights: 6 }),
  );
  assert.ok(validTripPlanning(stored));
  assert.equal(budgetEstimate(stored, 8).cost, budgetEstimate(defaultTripPlanning, 8).cost);
  const text = photographyProgramText(['3055'], stored);
  assert.doesNotMatch(text, /Siball|Dubal|habitación compartida|6 noches/);
  assert.match(text, /12 personas:/);
  assert.match(text, /6–12 participantes/);
  assert.match(text, /30–70 años/);
});
test('seleccionar varios miradores no conserva falsamente el horario de un solo mirador', () => {
  assert.equal(plannedPhotographyDays(defaultTripPlanning, ['3055'])[4].schedule.length, 7);
  assert.equal(plannedPhotographyDays(defaultTripPlanning, ['3055', '8066'])[4].schedule.length, 0);
  assert.equal(plannedPhotographyDays(defaultTripPlanning, [])[4].schedule.length, 0);
  const fifth = photographyProgramText(['3055', '8066'])
    .split('DÍA 5:')[1]
    .split('EXTENSIÓN DE AMPAY:')[0];
  assert.doesNotMatch(fifth, /08:00–10:30/);
  assert.match(fifth, /No hay horario cerrado/);
});
