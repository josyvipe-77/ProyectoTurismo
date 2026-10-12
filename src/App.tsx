import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { TravelProvider } from './hooks/TravelContext';
import { PhotographyRouteProvider } from './hooks/PhotographyRouteContext';
import { InfoProvider } from './hooks/InfoContext';
import HomePage from './pages/HomePage';
const RoutesPage = lazy(() => import('./pages/RoutesPage'));
const BuilderPage = lazy(() => import('./pages/BuilderPage'));
const CulturePage = lazy(() => import('./pages/CulturePage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const ConsultantPage = lazy(() => import('./pages/ConsultantPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <BrowserRouter>
      <TravelProvider>
        <PhotographyRouteProvider>
          <InfoProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="rutas" element={<RoutesPage />} />
                <Route path="rutas/chanka" element={<Navigate to="/construye" replace />} />
                <Route path="construye" element={<BuilderPage />} />
                <Route path="cultura" element={<CulturePage />} />
                <Route path="experiencia" element={<ExperiencePage />} />
                <Route path="consultora" element={<ConsultantPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </InfoProvider>
        </PhotographyRouteProvider>
      </TravelProvider>
    </BrowserRouter>
  );
}
