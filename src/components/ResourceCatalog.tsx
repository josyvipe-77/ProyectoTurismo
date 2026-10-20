import { useState } from 'react';
import { ArrowUpRight, Download, MapPin, Search } from 'lucide-react';
import {
  catalogCounts,
  geographicNeighbors,
  normalizeSearch,
  provinces,
  resources,
} from '../data/regional-tourism';
import type { TourismResource } from '../data/regional-tourism';
import { CatalogPhotos } from './CatalogPhotos';

export function ResourceCatalog({ onLocate }: { onLocate: (resource: TourismResource) => void }) {
  const [query, setQuery] = useState('');
  const [province, setProvince] = useState('');
  const [kind, setKind] = useState('Lugar');
  const needle = normalizeSearch(query.trim());
  const matches = resources.filter(
    (resource) =>
      (!province || resource.province === province) &&
      (!kind || resource.kind === kind) &&
      normalizeSearch(`${resource.name} ${resource.district} ${resource.id}`).includes(needle),
  );
  return (
    <section
      className="regional-catalog section"
      aria-labelledby="catalog-heading"
      id="catalogo-regional"
    >
      <span className="eyebrow blue">Inventario / 04.10.2026</span>
      <h2 id="catalog-heading">
        Un territorio, <em>muchas miradas.</em>
      </h2>
      <p>
        {catalogCounts.total} referencias documentadas: {catalogCounts.places} lugares o sectores,
        11 celebraciones y 2 registros de cultura y sabores. Incluye sectores internos de Ampay y
        registros históricos. {catalogCounts.mapped} puntos tienen coordenadas referenciales
        utilizables en este mapa.
      </p>
      <p className="small muted">
        Abre una provincia o busca un destino para ver sus fotografías. Las galerías disponibles
        conservan su ficha de origen; los registros sin imágenes se indican en cada tarjeta.
      </p>
      <div className="regional-downloads">
        <a
          href="/research/inventario-apurimac.csv"
          download="jacs-destinos-inventario-apurimac.csv"
        >
          <span className="download-heading">
            <Download size={18} /> Catálogo completo <span className="download-format">CSV</span>
          </span>
          <span className="download-description">
            Tabla de 135 referencias para abrir en Excel: lugares, provincia, distrito, coordenadas,
            observaciones y fuentes.
          </span>
        </a>
      </div>
      <div className="regional-search">
        <label>
          <span>Buscar lugar o distrito</span>
          <span className="regional-search-input">
            <Search size={18} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pacucha, Haquira, laguna…"
            />
          </span>
        </label>
        <label>
          <span>Provincia</span>
          <select value={province} onChange={(event) => setProvince(event.target.value)}>
            <option value="">Las siete provincias</option>
            {provinces.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Tipo de referencia</span>
          <select value={kind} onChange={(event) => setKind(event.target.value)}>
            <option value="">Todo el inventario</option>
            <option>Lugar</option>
            <option>Celebración</option>
            <option>Cultura y sabores</option>
          </select>
        </label>
      </div>
      <p className="small muted" role="status">
        {matches.length} referencias encontradas. «Sin pin» significa que falta una coordenada
        contrastada o hay una discrepancia; el lugar sigue en el catálogo.
      </p>
      {provinces.map((name) => {
        const entries = matches.filter((resource) => resource.province === name);
        if (!entries.length) return null;
        return (
          <details
            className="regional-province"
            key={`${name}-${province}-${needle}-${kind}`}
            open={!!province || !!needle}
          >
            <summary>
              <span>{name}</span>
              <span>{entries.length} referencias</span>
            </summary>
            <div className="regional-resource-grid">
              {entries.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} onLocate={onLocate} />
              ))}
            </div>
          </details>
        );
      })}
      {!matches.length && (
        <div className="empty-state">
          <p>No encontramos esa combinación. Prueba otro distrito o muestra todo el inventario.</p>
          <button
            className="button button-outline"
            onClick={() => {
              setQuery('');
              setProvince('');
              setKind('');
            }}
          >
            Mostrar todo
          </button>
        </div>
      )}
      <p className="small muted regional-scope">
        Fuentes: SIGMINCETUR, fichas de MINCETUR, PROMPERÚ y SERNANP. Este catálogo reúne todos los
        registros recuperados de esas consultas; no garantiza incluir cada lugar no inventariado de
        la región. Los accesos publicados pueden haber cambiado.
      </p>
    </section>
  );
}

function ResourceCard({
  resource,
  onLocate,
}: {
  resource: TourismResource;
  onLocate: (resource: TourismResource) => void;
}) {
  const neighbors = geographicNeighbors(resource);
  return (
    <article className="regional-resource">
      <CatalogPhotos id={resource.id} name={resource.name} source={resource.source} />
      <div className="regional-resource-body">
        <span className="eyebrow">
          {resource.category} · {resource.district}
        </span>
        <h3>{resource.name}</h3>
        <p className="regional-resource-status">
          {resource.coordinates
            ? 'Pin referencial'
            : resource.kind !== 'Lugar'
              ? 'Manifestación cultural'
              : 'Sin pin contrastado'}
          {resource.parent ? ' · Sector de otro atractivo' : ''}
        </p>
        {resource.coordinateNote && (
          <details className="regional-coordinate-note">
            <summary>Sobre esta ubicación</summary>
            <p>{resource.coordinateNote}</p>
          </details>
        )}
        <div className="regional-resource-actions">
          <a
            className="text-link small"
            href={resource.source}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar fuente <ArrowUpRight size={15} />
          </a>
          {resource.coordinates && (
            <button className="text-link small" onClick={() => onLocate(resource)}>
              <MapPin size={15} /> Ver en mapa
            </button>
          )}
        </div>
        {neighbors.length > 0 && (
          <details className="regional-neighbors">
            <summary>Otros puntos cercanos en el mapa</summary>
            <p>
              Distancia geográfica en línea recta. No indica carretera, sendero ni tiempo de viaje.
            </p>
            <ul>
              {neighbors.map(({ resource: other, distance }) => (
                <li key={other.id}>
                  {other.name} · {distance.toFixed(1)} km
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </article>
  );
}
