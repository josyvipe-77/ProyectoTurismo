import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const plan = {
  days: 4,
  destinations: ['Andahuaylas', 'Pacucha', 'Sóndor', 'Talavera'],
  interests: ['Cultura'],
  cost: 680,
  dailyCost: 170,
  createdAt: '2026-10-04T12:00:00.000Z',
};
const stored = new Map([
  ['apu-rimaq:plan:v1', JSON.stringify(plan)],
  ['apu-rimaq:favorites:v1', JSON.stringify(['chanka'])],
]);
const previousStorage = globalThis.localStorage;
let writes = 0;
globalThis.localStorage = {
  getItem: (key) => stored.get(key) ?? null,
  setItem: () => {
    writes += 1;
    throw new Error('Rendering must not overwrite previous notebooks');
  },
};
const modules = new Map();
const nodeRequire = createRequire(import.meta.url);
function loadTypeScript(path) {
  if (modules.has(path)) return modules.get(path).exports;
  const module = { exports: {} };
  modules.set(path, module);
  const compiled = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2023,
    },
  }).outputText;
  function requireFromSource(id) {
    if (!id.startsWith('.')) return nodeRequire(id);
    const base = resolve(dirname(path), id);
    const target = [base, `${base}.ts`, `${base}.tsx`].find(
      (candidate) => existsSync(candidate) && statSync(candidate).isFile(),
    );
    if (!target) throw new Error(`Missing module: ${id}`);
    return target.endsWith('.json') ? nodeRequire(target) : loadTypeScript(target);
  }
  new Function('require', 'module', 'exports', compiled)(requireFromSource, module, module.exports);
  return module.exports;
}
try {
  const { TravelProvider } = loadTypeScript(resolve('src/hooks/TravelContext.tsx'));
  const { useTravel } = loadTypeScript(resolve('src/hooks/useTravel.ts'));
  function ReadNotebook() {
    const state = useTravel();
    assert.deepEqual(state.savedPlan, plan);
    assert.deepEqual(state.favorites, ['chanka']);
    return createElement('span', null, state.savedPlan.destinations.join(' · '));
  }
  const output = renderToStaticMarkup(
    createElement(TravelProvider, null, createElement(ReadNotebook)),
  );
  assert.ok(output.includes('Pacucha'));
  assert.equal(writes, 0);
  assert.equal(stored.get('apu-rimaq:plan:v1'), JSON.stringify(plan));
  console.log(
    'Verified: the actual travel provider reads the previous notebook and favorites without rewriting storage.',
  );
} finally {
  if (previousStorage === undefined) delete globalThis.localStorage;
  else globalThis.localStorage = previousStorage;
}
