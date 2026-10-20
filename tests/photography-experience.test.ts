import { test } from 'node:test';
import assert from 'node:assert/strict';
import { photographyDays, photographyProgramText } from '../src/data/photography-experience.ts';

test('el programa descargable contiene las cinco jornadas sin reutilizar las tarifas del constructor', () => {
  const text = photographyProgramText();
  assert.match(text, /^JACS DESTINOS/);
  assert.doesNotMatch(text, /Precio:|Presupuesto orientativo del cliente|margen sobre venta/i);
  assert.equal((text.match(/Qué nos cuenta este lugar:/g) ?? []).length, 5);
  assert.equal((text.match(/^DÍA \d:/gm) ?? []).length, 5);
  for (const place of ['Taraccasa', 'Pampachiri', 'Pachachaca', 'Ampay', 'cañón del Apurímac'])
    assert.ok(text.includes(place));
  assert.doesNotMatch(text, /S\/\s*(170|680|850)|1[.,]500|3[.,]500/);
  assert.match(text, /Mirador por elegir/);
  assert.match(text, /Angasq’ocha/);
  assert.match(text, /Sin reservas ni pagos/);
});

test('los horarios preliminares no se solapan y cada jornada conserva su referencia y pendientes', () => {
  const minutes = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute;
  };
  for (const day of photographyDays) {
    let lastEnd = 0;
    for (const item of day.schedule) {
      const [start, end] = item.time.split('–').map(minutes);
      assert.ok(start >= lastEnd, `${day.title}: ${item.time}`);
      assert.ok(end > start && end < 1440);
      lastEnd = end;
    }
    assert.ok(day.pending.length > 0);
    assert.equal(new URL(day.source).protocol, 'https:');
  }
});
