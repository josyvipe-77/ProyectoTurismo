import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useTravel } from '../hooks/useTravel';

export function MainLayout() {
  const { pathname, hash } = useLocation();
  const main = useRef<HTMLElement>(null);
  const { storageWarning } = useTravel();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.current?.focus({ preventScroll: true });
    const title =
      pathname === '/'
        ? 'Apurímac no se visita, se escucha'
        : pathname === '/rutas'
          ? 'Explora las rutas'
          : pathname === '/cultura'
            ? 'Cultura viva'
            : pathname === '/construye'
              ? 'Construye tu ruta'
              : pathname === '/rutas/chanka'
                ? 'Ruta Chanka'
                : 'Página no encontrada';
    document.title = `${title} · Apu Rimaq`;
    const frame = requestAnimationFrame(() => {
      if (hash)
        document
          .getElementById(decodeURIComponent(hash.slice(1)))
          ?.scrollIntoView({ behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} ref={main}>
        <Outlet />
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
