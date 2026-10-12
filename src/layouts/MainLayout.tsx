import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useTravel } from '../hooks/useTravel';
import { ModuleBoundary, PageLoadFailure } from '../components/ModuleBoundary';
import { PageLoader } from '../components/PageLoader';
import { prepareBootReveal } from '../lib/boot-scene';

export function MainLayout() {
  const { pathname } = useLocation();
  const { storageWarning } = useTravel();
  return (
    <>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <ModuleBoundary key={pathname} fallback={<PageLoadFailure />}>
          <Suspense fallback={<PageLoader />}>
            <PageContent />
          </Suspense>
        </ModuleBoundary>
      </main>
      {storageWarning && (
        <div role="status" className="storage-warning">
          {storageWarning}
        </div>
      )}
      <Footer />
    </>
  );
}

// This effect commits only after the lazy page and its anchor targets are mounted.
function PageContent() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Home owns its cloud animation; all other entries release the same curtain.
    if (pathname === '/' && !hash) return;
    return prepareBootReveal();
  }, [pathname, hash]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('main-content')?.focus({ preventScroll: true });
    const titles: Record<string, string> = {
      '/': 'Apurímac a través de tu objetivo',
      '/experiencia': 'La experiencia fotográfica',
      '/rutas': 'Explora Apurímac',
      '/cultura': 'Cultura viva',
      '/construye': 'Planifica tu viaje',
      '/consultora': 'La consultora',
      '/rutas/chanka': 'Planifica tu viaje',
    };
    const title = titles[pathname.replace(/\/$/, '') || '/'] ?? 'Página no encontrada';
    document.title = `${title} · JACS Destinos`;
    const frame = requestAnimationFrame(() => {
      if (!hash) return;
      let target = hash.slice(1);
      try {
        target = decodeURIComponent(target);
      } catch {
        /* Keep malformed hashes harmless. */
      }
      document.getElementById(target)?.scrollIntoView({ behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return <Outlet />;
}
