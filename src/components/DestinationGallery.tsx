import { useState } from 'react';
import type { MouseEvent } from 'react';
import { ArrowLeft, ArrowRight, Expand, ExternalLink } from 'lucide-react';
import { useDestinationPhotos } from '../hooks/useDestinationPhotos';
import { PhotoFrame, PhotoLightbox } from './PhotoLightbox';
import './destination-gallery.css';

interface DestinationGalleryProps {
  source: string;
  name: string;
  galleryId?: string;
  variant?: 'default' | 'catalog';
}

export function DestinationGallery({
  source,
  name,
  galleryId,
  variant = 'default',
}: DestinationGalleryProps) {
  const { gallery, loading } = useDestinationPhotos(source, galleryId);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const photos = gallery?.photos ?? [];
  const photo = photos[index];
  const gallerySource = gallery?.source ?? source;
  function step(direction: -1 | 1) {
    setIndex((current) => (current + direction + photos.length) % photos.length);
  }
  function open(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.focus({ preventScroll: true });
    setExpanded(true);
  }

  if (!photo)
    return (
      <div className="destination-gallery-empty">
        <span>
          {loading ? 'Preparando fotografías…' : 'Consulta las fotografías y detalles en la ficha.'}
        </span>
        <a href={source} target="_blank" rel="noopener noreferrer">
          Ver ficha del destino <ExternalLink size={12} />
        </a>
      </div>
    );
  const controls = () => (
    <div className="destination-gallery-controls">
      <button
        type="button"
        disabled={photos.length < 2}
        onClick={() => step(-1)}
        aria-label={`Foto anterior de ${name}`}
      >
        <ArrowLeft size={18} />
      </button>
      <span role="status" aria-live="polite">
        {index + 1} / {photos.length}
      </span>
      <button
        type="button"
        disabled={photos.length < 2}
        onClick={() => step(1)}
        aria-label={`Foto siguiente de ${name}`}
      >
        <ArrowRight size={18} />
      </button>
    </div>
  );
  return (
    <section
      className={`destination-gallery destination-gallery--${variant}`}
      aria-label={`Fotografías de ${name}`}
      aria-roledescription="carrusel"
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          event.stopPropagation();
          step(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}
    >
      <div className="destination-gallery-media">
        <div className="destination-gallery-heading">
          <span className="eyebrow">El lugar, en imágenes</span>
          <button type="button" onClick={open} aria-label={`Ampliar fotos de ${name}`}>
            <Expand size={14} /> Ampliar
          </button>
        </div>
        <button
          type="button"
          className="destination-gallery-preview"
          onClick={open}
          aria-label={`Ampliar fotografía ${index + 1} de ${name}`}
        >
          <PhotoFrame key={photo.thumbnail} photo={photo} />
          <span className="destination-gallery-expand">
            <Expand size={18} />
          </span>
        </button>
        {controls()}
      </div>
      {photos.length > 1 && variant !== 'catalog' && (
        <div className="destination-gallery-dots" aria-label="Elegir fotografía">
          {photos.map((item, number) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Mostrar foto ${number + 1} de ${name}`}
              aria-pressed={number === index}
              onClick={() => setIndex(number)}
            >
              <span />
            </button>
          ))}
        </div>
      )}
      <a
        className="destination-gallery-source"
        href={gallerySource}
        target="_blank"
        rel="noopener noreferrer"
      >
        Fotos de la ficha MINCETUR <ExternalLink size={12} />
      </a>
      {expanded && (
        <PhotoLightbox
          photo={photo}
          name={name}
          source={gallerySource}
          index={index}
          count={photos.length}
          onStep={step}
          onClose={() => setExpanded(false)}
        />
      )}
    </section>
  );
}
