import { useState } from 'react';
import { Compass, MapPin } from 'lucide-react';

interface RouteMapProps {
  stops?: string[];
  compact?: boolean;
}
export function RouteMap({
  stops = ['Andahuaylas', 'Pacucha', 'Sóndor', 'Talavera'],
  compact = false,
}: RouteMapProps) {
  const [selected, setSelected] = useState(0);
  const points = stops.map((_, index) => ({
    x:
      stops.length > 4
        ? 14 + (index < 4 ? index : 7 - index) * 24
        : stops.length === 1
          ? 50
          : 12 + index * (76 / (stops.length - 1)),
    y: stops.length > 4 ? (index < 4 ? 28 : 70) : [60, 30, 42, 65][index],
  }));
  const active = Math.min(selected, stops.length - 1);
  const path = points
    .map((point, index) => `${index ? 'L' : 'M'} ${point.x * 5.6} ${point.y * 3.4}`)
    .join(' ');
  return (
    <div className={`route-map ${compact ? 'map-compact' : ''}`}>
      <div className="map-header">
        <span className="eyebrow blue">Cuaderno cartográfico</span>
        <Compass size={22} strokeWidth={1.4} />
      </div>
      <div
        className="map-canvas"
        role="group"
        aria-label="Diagrama del recorrido, no mapa geográfico"
      >
        <svg viewBox="0 0 560 340" aria-hidden="true" preserveAspectRatio="none">
          <path
            className="contour"
            d="M-50 60 Q200 -90 630 70 M-80 110 Q230 -60 620 130 M-40 180 Q190 20 600 190 M-20 230 Q200 90 600 280 M-70 280 Q210 210 610 310"
          />
          <path className="river" d="M0 330 Q190 160 250 190 T560 60" />
          <path className="map-path" d={path} />
        </svg>
        <span className="map-region">APURÍMAC</span>
        {points.map((point, index) => (
          <button
            key={`${stops[index]}-${index}`}
            className={`map-stop ${active === index ? 'selected' : ''}`}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            aria-label={`Escala ${index + 1}: ${stops[index]}`}
            aria-pressed={active === index}
            onClick={() => setSelected(index)}
          >
            <span>{index + 1}</span>
            <strong>{stops[index]}</strong>
          </button>
        ))}
        <span className="map-north">N ↑</span>
      </div>
      <div className="map-selection" aria-live="polite">
        <MapPin size={16} />
        <span>
          Escala {active + 1} · <strong>{stops[active]}</strong>
        </span>
      </div>
      <p className="map-disclaimer">
        Esquema editorial · No usar para navegación. Orden de escalas ilustrativo.
      </p>
    </div>
  );
}
