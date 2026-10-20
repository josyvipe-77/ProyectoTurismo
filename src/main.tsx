import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/400-italic.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';
import './index.css';
import './phase-three.css';
import './review-refinements.css';
import './travel-planning.css';
import './project-completion.css';
import './home-media.css';
import './visual-finish.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
