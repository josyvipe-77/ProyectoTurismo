import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { festivalMonths, festivals } from '../src/data.ts';

test('cada mes del calendario tiene celebraciones y las épocas que cruzan meses se conservan', () => {
  assert.equal(new Set(festivals.map((festival) => festival.id)).size, festivals.length);
  for (const month of festivalMonths) {
    assert.match(month, /^(0[1-9]|1[0-2])$/);
    assert.ok(festivals.some((festival) => festival.months.includes(month)));
  }
  assert.deepEqual(festivals.find((festival) => festival.id === 'carnaval')?.months, ['02', '03']);
  assert.deepEqual(festivals.find((festival) => festival.id === 'ninuchanchik')?.months, [
    '12',
    '01',
  ]);
});

test('las celebraciones tienen fotografías locales con su ficha y procedencia', () => {
  for (const festival of festivals) {
    const gallery = JSON.parse(
      readFileSync(`public/images/mincetur/galleries/${festival.photoResourceId}.json`, 'utf8'),
    );
    assert.equal(new URL(gallery.source).searchParams.get('cod_Ficha'), festival.photoResourceId);
    assert.ok(gallery.photos[0].alt && festival.note);
    assert.ok(existsSync(`public${gallery.photos[0].full}`));
  }
});
