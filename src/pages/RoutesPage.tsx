import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RegionalRoutes } from '../components/RegionalRoutes';
import { RespectNote } from '../components/Editorial';
import { CuratedGallery } from '../components/CuratedGallery';
export default function RoutesPage() {
  return (
    <div className="container page">
      <div className="page-intro">
        <span className="eyebrow blue">Explora Apurímac · Catálogo informativo</span>
        <h1>
          Un territorio.
          <br />
          <em>Muchos caminos por conocer.</em>
        </h1>
        <p>
          Quince circuitos de referencia con paradas, fuentes, mapas y fotografías para conocer
          Apurímac. Son información complementaria; no forman parte automáticamente de la
          experiencia fotográfica de cinco días.
        </p>
        <Link to="/experiencia" className="text-link">
          Conoce «Apurímac a través de tu objetivo» <ArrowRight size={18} />
        </Link>
      </div>
      <CuratedGallery />
      <RegionalRoutes />
      <RespectNote />
    </div>
  );
}
