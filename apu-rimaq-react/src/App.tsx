import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { TravelProvider } from './hooks/TravelContext';
import { InfoProvider } from './hooks/InfoContext';
import HomePage from './pages/HomePage';
import RoutesPage from './pages/RoutesPage';
import DetailPage from './pages/DetailPage';
import BuilderPage from './pages/BuilderPage';
import CulturePage from './pages/CulturePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <TravelProvider>
        <InfoProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="rutas" element={<RoutesPage />} />
              <Route path="rutas/chanka" element={<DetailPage />} />
              <Route path="construye" element={<BuilderPage />} />
              <Route path="cultura" element={<CulturePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </InfoProvider>
      </TravelProvider>
    </BrowserRouter>
  );
}
