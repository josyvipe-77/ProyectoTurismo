import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { spaEntryPages } from './scripts/spa-entry-pages.mjs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), spaEntryPages()],
});
