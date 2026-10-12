import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Camera, Compass, Home, Map, Menu, NotebookPen, Users, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

const links = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/experiencia', label: 'La experiencia', icon: Camera },
  { to: '/rutas', label: 'Explora Apurímac', icon: Map },
  { to: '/cultura', label: 'Cultura viva', icon: Compass },
  { to: '/construye', label: 'Planifica tu viaje', icon: NotebookPen },
  { to: '/consultora', label: 'Sobre JACS', icon: Users },
];
const mobileLinks = links.filter((link) =>
  ['/', '/experiencia', '/rutas', '/construye'].includes(link.to),
);
export function Header() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(window.scrollY > 50);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const overlay = pathname === '/' && !scrolled && !menuOpen;
  return (
    <>
      <header className={`site-header ${overlay ? 'over-hero' : ''}`}>
        <div className="header-inner">
          <Link
            className="brand"
            to="/"
            aria-label="JACS Destinos · Inicio"
            onClick={() => setMenuOpen(false)}
          >
            <BrandLogo />
          </Link>
          <nav className="desktop-nav" aria-label="Navegación principal">
            {links.map((link) => (
              <NavLink to={link.to} end={link.to === '/'} key={link.to}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <span className="language" aria-label="Idioma: español">
              ES
            </span>
            <Link to="/construye" className="button button-small header-plan">
              Planificar viaje
            </Link>
            <button
              className="icon-button menu-toggle"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="mobile-menu" className="mobile-menu" aria-label="Menú móvil">
            {links.map((link) => (
              <NavLink
                to={link.to}
                end={link.to === '/'}
                key={link.to}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <nav className="bottom-nav" aria-label="Navegación móvil">
        {mobileLinks.map(({ to, label, icon: Icon }) => (
          <NavLink to={to} end={to === '/'} key={to} onClick={() => setMenuOpen(false)}>
            <Icon size={20} strokeWidth={1.5} />
            <span>
              {to === '/construye'
                ? 'Planifica'
                : to === '/rutas'
                  ? 'Explora'
                  : to === '/experiencia'
                    ? 'Experiencia'
                    : label}
            </span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
