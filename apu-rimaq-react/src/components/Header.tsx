import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Compass, Home, Map, Menu, NotebookPen, X } from 'lucide-react';
import { useInfo } from '../hooks/useInfo';

const links = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/rutas', label: 'Rutas', icon: Map },
  { to: '/cultura', label: 'Cultura viva', icon: Compass },
  { to: '/construye', label: 'Mi ruta', icon: NotebookPen },
];
export function Header() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(window.scrollY > 50);
  const openInfo = useInfo();
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
          <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
            Apu Rimaq<span className="brand-dot">•</span>
          </Link>
          <nav className="desktop-nav" aria-label="Navegación principal">
            {links.map((link) => (
              <NavLink to={link.to} end={link.to === '/'} key={link.to}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="language"
              aria-label="Idioma actual: español. Información sobre inglés"
              onClick={() =>
                openInfo({
                  title: 'Primero, en nuestra lengua.',
                  body: (
                    <p>
                      Esta versión está disponible en español. El selector ES / EN del prototipo
                      representa una futura versión en inglés.
                    </p>
                  ),
                })
              }
            >
              ES <span>/ EN</span>
            </button>
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
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink to={to} end={to === '/'} key={to} onClick={() => setMenuOpen(false)}>
            <Icon size={20} strokeWidth={1.5} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
