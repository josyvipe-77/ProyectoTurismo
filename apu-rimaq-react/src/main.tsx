import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/newsreader';
import '@fontsource-variable/newsreader/standard-italic.css';
import '@fontsource-variable/public-sans';
import './index.css';
import App from './App';

if (location.pathname !== '/' || location.hash) {
  document.getElementById('boot-scene')?.remove();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
