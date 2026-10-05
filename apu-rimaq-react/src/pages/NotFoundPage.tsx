import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return (
    <div className="container page empty-state">
      <span className="eyebrow">Página no encontrada</span>
      <h1>
        Este camino
        <br />
        <em>todavía no está trazado.</em>
      </h1>
      <p>Vuelve al catálogo para descubrir una ruta disponible.</p>
      <Link to="/rutas" className="button">
        Explora las rutas
      </Link>
    </div>
  );
}
