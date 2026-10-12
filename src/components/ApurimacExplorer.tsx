import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Mountain, RotateCcw, Satellite } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import boundary from '../data/apurimac-boundary.json';
import { adjacentPlace, projectedPoint, touristPlaces } from '../data/apurimac-places';
import type { TouristPlace } from '../data/apurimac-places';
import { nextRouteStop } from '../lib/route-navigation';
import { ModuleBoundary } from './ModuleBoundary';
import { DestinationGallery } from './DestinationGallery';
import './apurimac-explorer.css';

const AtlasCanvas = lazy(() => import('./AtlasCanvas'));
type MapStatus = 'loading' | 'ready' | 'unavailable';

function RegionalFallback({
  places,
  selected,
  onSelect,
}: {
  places: TouristPlace[];
  selected: number | null;
  onSelect: (index: number) => void;
}) {
  const outline = boundary.geometry.coordinates[0]
    .map((point) => projectedPoint(point as [number, number]).join(','))
    .join(' ');
  return (
    <svg
      className="atlas-fallback"
      viewBox="0 0 720 680"
      role="group"
      aria-label="Mapa 2D de Apurímac con destinos seleccionables"
    >
      <defs>
        <pattern id="atlas-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#ded2c9" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="720" height="680" fill="url(#atlas-grid)" />
      <polygon points={outline} fill="#e1dfc8" stroke="#284d40" strokeWidth="2" />
      <text x="410" y="470" className="atlas-region-label">
        APURÍMAC
      </text>
      {places.map((place, index) => {
        const [x, y] = projectedPoint(place.coordinates);
        // Alternate close northern labels; the live map handles collision with CSS.
        const below = index === 1 || index === 3 || index === 5;
        return (
          <g
            key={place.id}
            role="button"
            tabIndex={0}
            aria-label={`Explorar ${place.name}`}
            aria-pressed={selected === index}
            className={`atlas-svg-marker ${selected === index ? 'is-active' : ''}`}
            onClick={() => onSelect(index)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect(index);
              }
            }}
          >
            <circle cx={x} cy={y} r="15" />
            <text x={x} y={y + 5} textAnchor="middle" className="atlas-svg-number">
              {place.mapLabel ?? index + 1}
            </text>
            <text x={x} y={y + (below ? 34 : -25)} textAnchor="middle" className="atlas-svg-name">
              {place.shortName}
            </text>
          </g>
        );
      })}
      <text x="40" y="663" className="atlas-svg-credit">
        Límite referencial: geoBoundaries · Puntos: MINCETUR / OSM
      </text>
    </svg>
  );
}

export function ApurimacExplorer({
  places = touristPlaces,
  sequence = false,
  routeName,
  focusFirst = false,
}: {
  places?: TouristPlace[];
  sequence?: boolean;
  routeName?: string;
  focusFirst?: boolean;
}) {
  const isProgram = useLocation().pathname === '/construye';
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [selection, setSelection] = useState<{ list: TouristPlace[]; index: number | null }>({
    list: places,
    index: focusFirst && places.length ? 0 : null,
  });
  // Reset selection synchronously when the route changes, before any map effect runs.
  const selected =
    selection.list === places ? selection.index : focusFirst && places.length ? 0 : null;
  function setSelected(next: number | null | ((value: number | null) => number | null)) {
    setSelection({ list: places, index: typeof next === 'function' ? next(selected) : next });
  }
  const [threeD, setThreeD] = useState(true);
  const [satellite, setSatellite] = useState(true);
  const [status, setStatus] = useState<MapStatus>('loading');
  const [attempt, setAttempt] = useState(0);
  const [moduleFailed, setModuleFailed] = useState(false);
  const place = selected === null ? null : places[selected];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px' },
    );
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  function step(direction: -1 | 1) {
    setSelected((current) =>
      sequence
        ? nextRouteStop(current, direction, places.length)
        : adjacentPlace(current, direction, places.length),
    );
  }

  return (
    <section
      ref={root}
      id="explora-apurimac"
      className="section apurimac-explorer"
      aria-labelledby="atlas-heading"
      data-selected-place={place?.id ?? 'overview'}
      data-map-state={status}
      data-map-mode={threeD && status === 'ready' ? '3d' : '2d'}
      data-map-surface={satellite && status === 'ready' ? 'satellite' : 'map'}
    >
      <div className="atlas-heading">
        <div>
          <span className="eyebrow blue">02 / Cartografía de un encuentro</span>
          <h2 id="atlas-heading">
            Apurímac, <em>a tu ritmo.</em>
          </h2>
        </div>
        <p>
          {routeName
            ? `Paradas con coordenadas referenciales de ${routeName}. Las escalas sin pin aparecen en el itinerario.`
            : 'Seis lugares para empezar a escuchar el territorio. Elige una parada o avanza con las flechas.'}
        </p>
      </div>
      <div
        className="atlas-destinations"
        role="group"
        aria-label="Selecciona un destino de Apurímac"
      >
        {places.map((item, index) => (
          <button
            key={item.id}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <span>{(item.mapLabel ?? String(index + 1)).padStart(2, '0')}</span>
            {item.shortName}
          </button>
        ))}
      </div>
      <div
        className="atlas-layout"
        onKeyDown={(event) => {
          if (
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.target instanceof HTMLAnchorElement ||
            event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLSelectElement
          )
            return;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            step(event.key === 'ArrowRight' ? 1 : -1);
          }
        }}
      >
        <div
          className="atlas-story"
          role="region"
          aria-label="Información y fotografías del destino"
          tabIndex={0}
        >
          <div className="atlas-story-copy">
            <span className="eyebrow atlas-category">
              {place?.category ?? 'Cuaderno del territorio'}
            </span>
            <span className="atlas-chapter">
              {selected === null
                ? 'APU / PERÚ'
                : `${String(selected + 1).padStart(2, '0')} / ${String(places.length).padStart(2, '0')}`}
            </span>
            <h3 aria-live="polite" aria-atomic="true">
              {place?.title ?? 'Hay muchas formas de encontrar tu camino.'}
            </h3>
            {(!place || place.title !== place.name) && (
              <strong className="atlas-place-name">
                {place?.name ?? routeName ?? 'Una región. Seis primeras miradas.'}
              </strong>
            )}
            <p className="atlas-location">{place?.location ?? 'Apurímac · Andes del Perú'}</p>
            <p className={place ? 'atlas-place-description' : undefined}>
              {place?.description ??
                (sequence
                  ? 'El mapa muestra las paradas que cuentan con una coordenada referencial. El orden completo, los accesos publicados y los ramales están en el itinerario. Los pins no representan el trazado de una carretera.'
                  : 'Bosques, agua y memoria en piedra. Explora el relieve, acércate a cada lugar y empieza a imaginar tu próxima pausa.')}
            </p>
            {place && <DestinationGallery key={place.id} source={place.source} name={place.name} />}
            {place?.coordinateNote && (
              <p className="atlas-coordinate-note">
                <span>Referencia del mapa</span>
                {place.coordinateNote}
              </p>
            )}
            {place ? (
              <>
                <p className="atlas-respect">
                  <span>Viaja con respeto</span>
                  {place.respect}
                </p>
                <a
                  className="text-link small"
                  href={place.source}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Conoce el destino <ExternalLink size={14} />
                </a>
              </>
            ) : (
              <Link to={isProgram ? '/experiencia' : '/construye'} className="text-link">
                {isProgram ? 'Servicios y preparación' : 'Ver el programa fotográfico'}{' '}
                <ArrowRight size={17} />
              </Link>
            )}
          </div>
          <div className="atlas-pager" role="group" aria-label="Recorrido por destinos">
            <button
              onClick={() => step(-1)}
              disabled={!places.length || (sequence && selected === 0)}
              aria-label="Destino anterior"
            >
              <ArrowLeft size={21} />
              <span>Anterior</span>
            </button>
            <span>
              {selected === null
                ? `${places.length} puntos`
                : `${selected + 1} de ${places.length}`}
            </span>
            <button
              onClick={() => step(1)}
              disabled={!places.length || (sequence && selected === places.length - 1)}
              aria-label="Destino siguiente"
            >
              <span>Siguiente</span>
              <ArrowRight size={21} />
            </button>
          </div>
        </div>
        <div
          className="atlas-map"
          role="region"
          aria-label="Explorador geográfico de Apurímac"
          tabIndex={0}
        >
          {status !== 'ready' && (
            <RegionalFallback places={places} selected={selected} onSelect={setSelected} />
          )}
          {visible && status !== 'unavailable' && (
            <ModuleBoundary
              fallback={null}
              onError={() => {
                setModuleFailed(true);
                setStatus('unavailable');
              }}
            >
              <Suspense fallback={null}>
                <AtlasCanvas
                  key={attempt}
                  places={places}
                  sequence={sequence}
                  selected={selected}
                  threeD={threeD}
                  satellite={satellite}
                  onSatelliteChange={setSatellite}
                  onSelect={setSelected}
                  onStatus={setStatus}
                />
              </Suspense>
            </ModuleBoundary>
          )}
          <div className="atlas-tools" role="group" aria-label="Opciones del mapa">
            <button onClick={() => setSelected(null)} aria-label="Ver toda Apurímac">
              <RotateCcw size={15} />
              <span>Toda Apurímac</span>
            </button>
            <button
              onClick={() => setThreeD((value) => !value)}
              aria-pressed={threeD && status === 'ready'}
              disabled={status !== 'ready'}
              aria-label={
                status !== 'ready'
                  ? 'Relieve 3D no disponible'
                  : threeD
                    ? 'Cambiar a vista 2D'
                    : 'Cambiar a vista 3D'
              }
            >
              <Mountain size={17} />
              <span>{threeD && status === 'ready' ? 'Vista 3D' : 'Vista 2D'}</span>
            </button>
            <button
              onClick={() => setSatellite((value) => !value)}
              aria-pressed={satellite && status === 'ready'}
              disabled={status !== 'ready'}
              aria-label={satellite ? 'Cambiar a mapa ilustrado' : 'Cambiar a vista satelital'}
            >
              <Satellite size={16} />
              <span>{satellite && status === 'ready' ? 'Satélite' : 'Mapa'}</span>
            </button>
          </div>
          <button
            className="atlas-map-arrow atlas-map-previous"
            onClick={() => step(-1)}
            disabled={!places.length || (sequence && selected === 0)}
            aria-label="Destino anterior en el mapa"
          >
            <ArrowLeft size={21} />
          </button>
          <button
            className="atlas-map-arrow atlas-map-next"
            onClick={() => step(1)}
            disabled={!places.length || (sequence && selected === places.length - 1)}
            aria-label="Destino siguiente en el mapa"
          >
            <ArrowRight size={21} />
          </button>
          {status !== 'ready' && (
            <div className="atlas-status" role="status">
              {status === 'loading' ? (
                'Preparando el relieve…'
              ) : (
                <>
                  <span>Vista 2D · El relieve no pudo cargarse.</span>
                  <button
                    onClick={() => {
                      // Browsers can cache a rejected dynamic import until the page reloads.
                      if (moduleFailed) {
                        window.location.reload();
                        return;
                      }
                      setStatus('loading');
                      setAttempt((value) => value + 1);
                    }}
                  >
                    Reintentar
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="atlas-footer">
        <span>Selecciona un punto · Flechas para cambiar de lugar · Arrastra para explorar</span>
        <span>
          Relieve del terreno y señales de ubicación. Límites y puntos referenciales; no es un mapa
          de navegación.
        </span>
        <span>Imagen satelital histórica EOX · El detalle al acercarse es limitado.</span>
      </div>
    </section>
  );
}
