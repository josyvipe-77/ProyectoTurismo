import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const catalog = JSON.parse(readFileSync('src/data/apurimac-catalog.json', 'utf8'));
const manifest = JSON.parse(readFileSync('src/data/mincetur-photos.json', 'utf8'));
const context = JSON.parse(readFileSync('src/data/catalog-context-photos.json', 'utf8'));

test('cada referencia dispone de una galería propia o una imagen de contexto identificada', () => {
  for (const item of catalog) {
    if (manifest[item.id]?.photos.length) continue;
    const image = context[item.id];
    assert.ok(image, `Falta imagen para ${item.name}`);
    assert.notEqual(image.referenceId, item.id);
    const original = manifest[image.referenceId];
    assert.equal(image.source, original.source);
    assert.ok(original.photos.some((photo: { id: string }) => photo.id === image.photo.id));
    assert.equal(
      image.referenceName,
      catalog.find((x: { id: string }) => x.id === image.referenceId).name,
    );
    for (const file of [image.photo.thumbnail, image.photo.full])
      assert.ok(existsSync(`public${file}`), file);
  }
});
