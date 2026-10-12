import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Compass } from 'lucide-react';
import { ApurimacExplorer } from './ApurimacExplorer';
import { ResourceCatalog } from './ResourceCatalog';
import { DestinationIllustration } from './DestinationIllustration';
import {
  mapPlace,
  provinces,
  regionalRoutes,
  resourceById,
  routeMapPlaces,
} from '../data/regional-tourism';
import type { RegionalRoute, TourismResource } from '../data/regional-tourism';
import './regional-routes.css';

export function RegionalRoutes() {
  const [province, setProvince] = useState('');
  const [routeId, setRouteId] = useState(regionalRoutes[0].id);
  const [located, setLocated] = useState<TourismResource | null>(null);
  const route = regionalRoutes.find((item) => item.id === routeId) ?? regionalRoutes[0];
  const places = useMemo(() => {
    const pin = located ? mapPlace(located) : null;
    return pin ? [pin] : routeMapPlaces(route);
  }, [route, located]);
  const filtered = regionalRoutes.filter((item) => !province || item.province === province);
  function chooseRoute(id: string) {
    setRouteId(id);
    setLocated(null);
  }
  function locate(resource: TourismResource) {
    setLocated(resource);
    document.getElementById('explora-apurimac')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
      block: 'start',
    });
  }
  return (
    <>
      <section className="regional-planner" aria-labelledby="regional-heading">
        <div className="regional-planner-heading">
          <div>
            <span className="eyebrow blue">15 propuestas / accesos y cercanía</span>
            <h2 id="regional-heading">
              Paradas que <em>comparten camino.</em>
            </h2>
          </div>
          <p>
            Elige un circuito local o una conexión regional. Las extensiones se muestran como
            ramales; cada tramo conserva su fuente.
          </p>
        </div>
        <div className="regional-route-controls">
          <label>
            <span>Zona del recorrido</span>
            <select
              value={province}
              onChange={(event) => {
                const next = event.target.value;
                setProvince(next);
                const first = regionalRoutes.find((item) => !next || item.province === next);
                if (first) chooseRoute(first.id);
              }}
            >
              <option value="">Toda Apurímac</option>
              {provinces.map((name) => (
                <option key={name}>{name}</option>
              ))}
              <option>Interprovincial</option>
            </select>
          </label>
          <label>
            <span>Ruta para explorar</span>
            <select value={routeId} onChange={(event) => chooseRoute(event.target.value)}>
              {filtered.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <RouteNotebook route={route} onLocate={locate} />
        <details className="regional-all-routes">
          <summary>Comparar las {filtered.length} propuestas de esta zona</summary>
          <div className="regional-route-grid">
            {filtered.map((item, index) => (
              <button
                className="regional-route-choice"
                key={item.id}
                onClick={() => chooseRoute(item.id)}
                aria-pressed={routeId === item.id}
              >
                <span className="eyebrow">
                  {String(index + 1).padStart(2, '0')} / {item.province}
                </span>
                <strong>{item.name}</strong>
                <span>
                  {item.kind} · {item.duration}
                </span>
                <span className="regional-route-stops">
                  {item.stops.map((id) => resourceById.get(id)?.name).join(' → ')}
                </span>
                <ArrowRight size={18} />
              </button>
            ))}
          </div>
        </details>
      </section>
      {located && (
        <div className="regional-location-banner" role="status">
          <span>Consultando {located.name}. Esta vista individual no representa una ruta.</span>
          <button className="text-link small" onClick={() => setLocated(null)}>
            Volver al circuito <ArrowRight size={16} />
          </button>
        </div>
      )}
      <ApurimacExplorer
        places={places}
        sequence
        routeName={located?.name ?? route.name}
        focusFirst={!!located}
      />
      <ResourceCatalog onLocate={locate} />
    </>
  );
}

function RouteNotebook({
  route,
  onLocate,
}: {
  route: RegionalRoute;
  onLocate: (resource: TourismResource) => void;
}) {
  return (
    <article className="regional-notebook" aria-labelledby="route-notebook-heading">
      <div className="regional-notebook-intro">
        <span className="eyebrow">
          <Compass size={16} /> {route.kind} · {route.duration}
        </span>
        <h3 id="route-notebook-heading">{route.name}</h3>
        <p className="regional-base">Base / {route.base}</p>
        <p>{route.note}</p>
        <p className="small muted">
          Duración de estancia propuesta, sin incluir el viaje de llegada. Los tiempos de traslado
          citados pertenecen a las fichas y deben confirmarse.
        </p>
      </div>
      <div className="regional-itinerary">
        <span className="eyebrow">Orden de visita propuesto</span>
        <ol>
          {route.stops.map((id, index) => {
            const resource = resourceById.get(id);
            if (!resource) return null;
            return (
              <li key={id}>
                <span className="regional-stop-number">{index + 1}</span>
                <DestinationIllustration placeId={id} variant="stop" />
                <div>
                  <strong>{resource.name}</strong>
                  <span>
                    {resource.district} ·{' '}
                    {resource.coordinates
                      ? 'Pin referencial disponible'
                      : 'Escala documentada sin pin'}
                  </span>
                </div>
                {resource.coordinates && (
                  <button
                    aria-label={`Ver ${resource.name} en mapa`}
                    onClick={() => onLocate(resource)}
                  >
                    <ArrowUpRight size={18} />
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <details className="regional-access" open>
        <summary>Accesos publicados y ramales</summary>
        <ul>
          {route.legs.map((leg, index) => (
            <li key={`${leg.from}-${leg.to}-${index}`}>
              <p>{leg.detail}</p>
              <SourceLink id={leg.source} />
            </li>
          ))}
        </ul>
        {route.branches.length > 0 && (
          <div className="regional-branches">
            <span className="eyebrow">Extensiones opcionales · con desvío o regreso</span>
            {route.branches.map((branch) => (
              <div key={branch.name}>
                <strong>{branch.name}</strong>
                <p>{branch.note}</p>
                <SourceLink id={branch.source} />
              </div>
            ))}
          </div>
        )}
      </details>
      <p className="regional-itinerary-note">
        La secuencia y la estancia son propuestas de JACS Destinos. El mapa numera únicamente los
        puntos con coordenadas; no dibuja carreteras ni calcula un trayecto óptimo. Las miniaturas
        son ilustraciones interpretativas generadas con IA.
      </p>
    </article>
  );
}
function SourceLink({ id }: { id: string }) {
  const resource = resourceById.get(id);
  return resource ? (
    <a href={resource.source} target="_blank" rel="noopener noreferrer" className="text-link small">
      Fuente · {resource.name} <ArrowUpRight size={13} />
    </a>
  ) : null;
}
