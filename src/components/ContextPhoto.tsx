import { useState } from 'react';
import { Expand, ExternalLink } from 'lucide-react';
import { getContextPhoto } from '../data/catalog-context';
import { PhotoLightbox } from './PhotoLightbox';

export function ContextPhoto({ id, name }: { id: string; name: string }) {
  const [expanded, setExpanded] = useState(false);
  const image = getContextPhoto(id);
  if (!image) return null;
  return (
    <figure className="context-photo">
      <button
        type="button"
        className="context-photo-preview"
        aria-label={`Ampliar imagen de contexto: ${image.referenceName}`}
        onClick={() => setExpanded(true)}
      >
        <img
          src={image.photo.thumbnail}
          alt={`Imagen de contexto: ${image.referenceName}. Fotografía específica de ${name} pendiente.`}
          width={480}
          height={300}
          loading="lazy"
          decoding="async"
        />
        <span className="context-photo-badge">Imagen de contexto</span>
        <span className="context-photo-expand">
          <Expand size={18} aria-hidden="true" />
        </span>
      </button>
      <figcaption>
        <span>{image.referenceName}</span>
        <small>Fotografía específica del lugar por documentar.</small>
        <a href={image.source} target="_blank" rel="noopener noreferrer">
          Fuente de la imagen <ExternalLink size={12} aria-hidden="true" />
        </a>
      </figcaption>
      {expanded && (
        <PhotoLightbox
          photo={image.photo}
          name={`${image.referenceName} · Imagen de contexto`}
          description={`Referencia visual para ${name}. Esta imagen corresponde a ${image.referenceName}; la fotografía específica del lugar está por documentar.`}
          source={image.source}
          index={0}
          count={1}
          onStep={() => {}}
          onClose={() => setExpanded(false)}
        />
      )}
    </figure>
  );
}
