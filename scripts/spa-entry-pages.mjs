// Physical entry files also support static hosts that ignore .htaccess.
export const entryPaths = [
  'rutas',
  'rutas/chanka',
  'construye',
  'cultura',
  'experiencia',
  'consultora',
];

/** @returns {import('vite').Plugin} */
export function spaEntryPages() {
  return {
    name: 'spa-entry-pages',
    enforce: 'post',
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        const entry = bundle['index.html'];
        if (!entry || entry.type !== 'asset') this.error('Missing SPA entry index.html');
        for (const path of entryPaths) {
          this.emitFile({
            type: 'asset',
            fileName: `${path}/index.html`,
            source: entry.source,
          });
        }
      },
    },
  };
}
