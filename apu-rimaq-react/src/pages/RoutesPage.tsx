import { useState } from 'react';
import { Heart, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { journeys, interests } from '../data';
import { RouteCard, RespectNote, SavedBadge } from '../components/Editorial';
import { RouteMap } from '../components/RouteMap';
import { RegionalRoutes } from '../components/RegionalRoutes';
import { useTravel } from '../hooks/useTravel';

export default function RoutesPage() {
  const [interest, setInterest] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const { favorites } = useTravel();
  const filtered = journeys.filter(
    (route) =>
      (!interest || route.interests.includes(interest)) &&
      (!duration || String(route.days) === duration) &&
      (!difficulty || route.difficulty === difficulty) &&
      (!onlyFavorites || favorites.includes(route.id)),
  );
  function reset() {
    setInterest('');
    setDuration('');
    setDifficulty('');
    setOnlyFavorites(false);
  }
  return (
    <div className="container page">
      <div className="page-intro">
        <span className="eyebrow blue">Cuaderno N.º 02 · Catálogo de senderos</span>
        <h1>
          Cada camino tiene
          <br />
          <em>algo que contarte.</em>
        </h1>
        <p>
          Pausas junto al agua, memoria en piedra y comunidades que preservan la voz del territorio.
          Elige el ritmo de tu travesía.
        </p>
      </div>
      <RegionalRoutes />
      <div className="page-intro">
        <span className="eyebrow blue">Cuadernos de estancia · Presupuestos ilustrativos</span>
        <h2>
          Ideas para <em>quedarte más tiempo.</em>
        </h2>
        <p>
          Los circuitos y accesos documentados están arriba. Estos cuadernos conservan presupuestos
          de muestra.
        </p>
      </div>
      <div className="filter-bar">
        <label>
          <span>Interés principal</span>
          <select value={interest} onChange={(event) => setInterest(event.target.value)}>
            <option value="">Todos los intereses</option>
            {interests.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Duración disponible</span>
          <select value={duration} onChange={(event) => setDuration(event.target.value)}>
            <option value="">Cualquier duración</option>
            <option value="2">2 días</option>
            <option value="3">3 días</option>
            <option value="4">4 días</option>
          </select>
        </label>
        <label>
          <span>Dificultad física</span>
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option value="">Cualquier dificultad</option>
            <option>Suave</option>
            <option>Moderada</option>
          </select>
        </label>
        <button
          className={`button button-outline favorite-filter ${onlyFavorites ? 'selected-control' : ''}`}
          aria-pressed={onlyFavorites}
          onClick={() => setOnlyFavorites(!onlyFavorites)}
        >
          <Heart size={16} />
          Favoritos ({favorites.length})
        </button>
        <button className="text-link small" onClick={reset}>
          <RotateCcw size={15} />
          Limpiar
        </button>
      </div>
      <div className="results-count" role="status">
        <SlidersHorizontal size={16} />
        {filtered.length} {filtered.length === 1 ? 'ruta disponible' : 'rutas disponibles'}
        <span>Itinerarios y presupuestos de muestra</span>
      </div>
      <div className="routes-layout">
        <div className="route-results">
          {filtered.map((journey, index) => (
            <RouteCard key={journey.id} journey={journey} featured={index === 0} />
          ))}
          {!filtered.length && (
            <div className="empty-state">
              <Heart size={30} strokeWidth={1.3} />
              <h2>
                Tu próximo camino
                <br />
                todavía está por elegir.
              </h2>
              <p>
                {onlyFavorites
                  ? 'Guarda una ruta con el corazón para encontrarla aquí.'
                  : 'Prueba otra combinación de intereses, días o dificultad.'}
              </p>
              <button className="button button-outline" onClick={reset}>
                Mostrar todas las rutas
              </button>
            </div>
          )}
        </div>
        <aside className="routes-aside" aria-label="Sugerencias para tu itinerario">
          <RouteMap compact />
          <div className="paper-note">
            <span className="eyebrow blue">Dibuja tu propio camino</span>
            <h3>¿Una ruta a tu medida?</h3>
            <p>Combina destinos e intereses y crea un primer borrador de viaje.</p>
            <Link to="/construye" className="button button-outline">
              Construye tu ruta
            </Link>
          </div>
          <SavedBadge />
          <p className="small muted">
            Las propuestas requieren confirmación de acceso, condiciones y disponibilidad local. Las
            rutas secundarias aún no tienen detalle completo.
          </p>
        </aside>
      </div>
      <RespectNote />
    </div>
  );
}
