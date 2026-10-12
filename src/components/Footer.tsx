import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInfo } from '../hooks/useInfo';
import { BrandLogo } from './BrandLogo';
const currentYear = new Date().getFullYear();
export function Footer() {
  const openInfo = useInfo();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="brand" aria-label="JACS Destinos · Inicio">
            <BrandLogo />
          </Link>
          <p>
            Apurímac a través de tu objetivo.
            <br />
            <em>Experiencias que se convierten en memorias.</em>
          </p>
        </div>
        <div>
          <span className="eyebrow">Descubre la propuesta</span>
          <Link to="/experiencia">
            La experiencia <ArrowUpRight size={15} />
          </Link>
          <Link to="/construye">
            Planifica tu viaje <ArrowUpRight size={15} />
          </Link>
          <Link to="/rutas">
            Explora Apurímac <ArrowUpRight size={15} />
          </Link>
          <Link to="/cultura">
            Cultura viva <ArrowUpRight size={15} />
          </Link>
        </div>
        <div>
          <span className="eyebrow">Nuestro equipo y compromiso</span>
          <Link to="/consultora">
            Sobre JACS Destinos <ArrowUpRight size={15} />
          </Link>
          <button
            onClick={() =>
              openInfo({
                title: 'Viaja con respeto',
                body: (
                  <p>
                    Respeta los senderos y las indicaciones locales. Observa la fauna a distancia y
                    solicita autorización para fotografiar personas. Las actividades con anfitriones
                    requieren coordinación previa.
                  </p>
                ),
              })
            }
          >
            Viaja con respeto <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {currentYear} JACS Destinos · Proyecto académico COIL USC–UNAMBA</span>
        <span>Programa preliminar · Precio por estimar · Fotografías con fuentes</span>
      </div>
    </footer>
  );
}
