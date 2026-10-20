import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resourceById } from '../src/data/regional-tourism.ts';

const selection: { resourceId: string; photoId: string; category: string; description: string }[] =
  JSON.parse(readFileSync('src/data/curated-photos.json', 'utf8'));

test('la selección editorial conserva doce imágenes identificadas y sus archivos publicados', () => {
  assert.equal(selection.length, 12);
  assert.equal(new Set(selection.map((item) => item.resourceId)).size, 12);
  for (const category of ['Paisajes', 'Patrimonio', 'Cultura viva'])
    assert.equal(selection.filter((item) => item.category === category).length, 4);
  for (const item of selection) {
    const resource = resourceById.get(item.resourceId);
    assert.ok(resource);
    const gallery = JSON.parse(
      readFileSync(`public/images/mincetur/galleries/${item.resourceId}.json`, 'utf8'),
    );
    assert.equal(gallery.source, resource.source);
    assert.equal(item.photoId, gallery.photos[0].id, 'La selección usa la portada editorial');
    const photo = gallery.photos.find((image: { id: string }) => image.id === item.photoId);
    assert.ok(photo.alt.length > 0 && item.description.length > 0);
    for (const variant of ['thumbnail', 'full']) assert.ok(existsSync(`public${photo[variant]}`));
  }
});
