import { useState } from 'react';
import { Compass, MapPin } from 'lucide-react';
import { projectedPoint } from '../data/apurimac-places';
import type { TouristPlace } from '../data/apurimac-places';
import boundary from '../data/apurimac-boundary.json';
import { resourceById } from '../data/regional-tourism';
import { photographyMapPlaces } from '../data/photography-map';

interface RouteMapProps {
  places?: TouristPlace[];
}
const outline = boundary.geometry.coordinates[0]
  .map((point) => projectedPoint(point as [number, number]).join(','))
  .join(' ');
const base = resourceById.get('8640');
// Callouts can move for readability; the small geographic dot and its leader stay exact.
const callouts: Record<string, [number, number]> = {
  '4678': [-65, 16],
  '577': [-64, -32],
  '31': [-68, 58],
  '3055': [85, 36],
  '2039': [85, -38],
  '8066': [-48, -58],
  '8264': [0, 30],
};
export function RouteMap({ places }: RouteMapProps) {
  const mapped = places ?? photographyMapPlaces();
  const [selectedId, setSelectedId] = useState('');
  const active = mapped.find((place) => place.id === selectedId) ?? mapped[0];
  const basePoint = base?.coordinates ? projectedPoint(base.coordinates) : null;
  return (
    <div className="route-map geographic-notebook">
      <div className="map-header">
        <span className="eyebrow blue">Cuaderno cartográfico · Cinco jornadas</span>
        <Compass size={22} strokeWidth={1.4} />
      </div>
      <div
        className="map-canvas"
        role="group"
        aria-label="Mapa geográfico de los destinos de la experiencia"
      >
        <svg
          role="group"
          viewBox="0 0 720 680"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Ubicación cartográfica de los destinos"
        >
          <polygon points={outline} className="notebook-region" />
          <text x="430" y="470" className="notebook-region-label">
            APURÍMAC
          </text>
          {basePoint && (
            <g className="notebook-base">
              <circle cx={basePoint[0]} cy={basePoint[1]} r="3" />
              <text x={basePoint[0] + 18} y={basePoint[1] + 10}>
                Abancay · Base
              </text>
            </g>
          )}
          {mapped.map((place, index) => {
            const [x, y] = projectedPoint(place.coordinates);
            const [dx, dy] = callouts[place.id] ?? [0, 30];
            const labelX = x + dx,
              labelY = y + dy;
            return (
              <g
                key={place.id}
                className={`notebook-pin ${active?.id === place.id ? 'is-selected' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`Día ${place.mapLabel ?? index + 1}: ${place.name}`}
                aria-pressed={active?.id === place.id}
                data-place-id={place.id}
                data-longitude={place.coordinates[0]}
                data-latitude={place.coordinates[1]}
                onClick={() => setSelectedId(place.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedId(place.id);
                  }
                }}
              >
                <line x1={x} y1={y} x2={labelX} y2={labelY} className="notebook-leader" />
                <circle cx={x} cy={y} r="4" className="notebook-location-dot" />
                <circle cx={labelX} cy={labelY} r="15" className="notebook-callout" />
                <text x={labelX} y={labelY + 5} textAnchor="middle" className="notebook-pin-number">
                  {place.mapLabel ?? index + 1}
                </text>
                <text x={labelX} y={labelY + 31} textAnchor="middle" className="notebook-pin-name">
                  {place.shortName}
                </text>
              </g>
            );
          })}
        </svg>
        <span className="map-north">N ↑</span>
      </div>
      <div className="notebook-legend" role="group" aria-label="Destinos del cuaderno cartográfico">
        {mapped.map((place, index) => (
          <button
            type="button"
            key={place.id}
            aria-pressed={active?.id === place.id}
            onClick={() => setSelectedId(place.id)}
          >
            <span>{place.mapLabel ?? index + 1}</span>
            {place.shortName}
          </button>
        ))}
      </div>
      <div className="map-selection" aria-live="polite">
        <MapPin size={16} />
        <span>
          {active ? (
            <>
              Día {active.mapLabel ?? mapped.indexOf(active) + 1} · <strong>{active.name}</strong>
            </>
          ) : (
            'Elige un destino para completar la ruta.'
          )}
        </span>
      </div>
      <p className="map-disclaimer">
        Los puntos pequeños marcan la ubicación; las líneas los unen con sus etiquetas. El contorno
        regional es referencial; no se representan carreteras ni tiempos de traslado.
      </p>
      {active?.coordinateNote && (
        <p className="notebook-coordinate-note">{active.coordinateNote}</p>
      )}
      {active && (
        <a
          className="notebook-source"
          href={active.coordinateSource}
          target="_blank"
          rel="noreferrer"
        >
          Consultar ubicación cartográfica ↗
        </a>
      )}
    </div>
  );
}
