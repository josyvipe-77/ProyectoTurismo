import assert from 'node:assert/strict';
import { test } from 'node:test';

let caseId = 0;

async function setup(t: import('node:test').TestContext, ready = true, reduced = false) {
  const tasks = new Map<number, () => void>();
  let nextId = 0;
  let removed = false;
  const listeners = new Map<string, (event: unknown) => void>();
  const curtain = {
    remove() {
      removed = true;
    },
    addEventListener(name: string, listener: (event: unknown) => void) {
      listeners.set(name, listener);
    },
    removeEventListener(name: string) {
      listeners.delete(name);
    },
  };
  const pending = new Promise(() => {});
  const schedule = (callback: () => void) => {
    tasks.set(++nextId, callback);
    return nextId;
  };
  const cancel = (id: number) => tasks.delete(id);
  const document = {
    documentElement: {
      dataset: { appBoot: 'pending' } as Record<string, string>,
    },
    getElementById: () => (removed ? null : curtain),
    querySelector: () => ({
      decode: () => (ready ? Promise.reject(new Error('Image unavailable')) : pending),
    }),
    fonts: { load: () => (ready ? Promise.resolve([]) : pending) },
  };
  const globals = {
    document,
    window: {
      setTimeout: schedule,
      clearTimeout: cancel,
      matchMedia: () => ({ matches: reduced }),
    },
    requestAnimationFrame: schedule,
    cancelAnimationFrame: cancel,
  };
  for (const [name, value] of Object.entries(globals)) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { configurable: true, value });
    t.after(() => {
      if (previous) Object.defineProperty(globalThis, name, previous);
      else Reflect.deleteProperty(globalThis, name);
    });
  }
  const module = await import(`../src/lib/boot-scene.ts?case=${caseId++}`);
  const flush = () => {
    const first = tasks.entries().next().value;
    if (first) {
      tasks.delete(first[0]);
      first[1]();
    }
  };
  return {
    module,
    flush,
    tasks,
    document,
    curtain,
    listeners,
    removed: () => removed,
  };
}

test('un logo fallido libera el cargador y el temporizador cubre una transición ausente', async (t) => {
  const scene = await setup(t);
  scene.module.prepareBootReveal();
  await new Promise((resolve) => setImmediate(resolve));
  scene.flush();
  scene.flush();
  assert.equal(scene.document.documentElement.dataset.appBoot, 'revealing');
  scene.flush();
  assert.equal(scene.removed(), true);
  assert.equal(scene.document.documentElement.dataset.appBoot, undefined);
  assert.equal(scene.listeners.size, 0);
});

test('cancela una preparación desmontada y permite la siguiente aunque las fuentes no respondan', async (t) => {
  const scene = await setup(t, false);
  scene.module.prepareBootReveal()();
  assert.equal(scene.tasks.size, 0);
  assert.equal(scene.removed(), false);
  scene.module.prepareBootReveal();
  scene.flush();
  scene.flush();
  scene.flush();
  scene.flush();
  assert.equal(scene.removed(), true);
});

test('la recuperación de errores puede retirar el cargador sin esperar medios', async (t) => {
  const scene = await setup(t, false, true);
  scene.module.releaseBootScene(true);
  scene.module.releaseBootScene(true);
  assert.equal(scene.tasks.size, 1);
  scene.flush();
  assert.equal(scene.removed(), true);
});
