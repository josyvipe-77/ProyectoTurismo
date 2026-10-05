import { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand, ExternalLink, X } from 'lucide-react';
import { useDestinationPhotos } from '../hooks/useDestinationPhotos';
import type { DestinationPhoto } from '../hooks/useDestinationPhotos';
import './destination-gallery.css';

interface DestinationGalleryProps {
  source: string;
  name: string;
}

export function DestinationGallery({ source, name }: DestinationGalleryProps) {
  const { gallery, loading } = useDestinationPhotos(source);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const photos = gallery?.photos ?? [];
  const photo = photos[index];
  const gallerySource = gallery?.source ?? source;
  function step(direction: -1 | 1) {
    setIndex((current) => (current + direction + photos.length) % photos.length);
  }
  useEffect(() => {
    if (!expanded) return;
    const element = dialog.current;
    element?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [expanded]);

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
  const controls = (large = false) => (
    <div className="destination-gallery-controls">
      <button
        type="button"
        disabled={photos.length < 2}
        onClick={() => step(-1)}
        aria-label={`Foto anterior de ${name}${large ? ', ampliada' : ''}`}
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
        aria-label={`Foto siguiente de ${name}${large ? ', ampliada' : ''}`}
      >
        <ArrowRight size={18} />
      </button>
    </div>
  );
  return (
    <section
      className="destination-gallery"
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
      <div className="destination-gallery-heading">
        <span className="eyebrow">El lugar, en imágenes</span>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={`Ampliar fotos de ${name}`}
        >
          <Expand size={14} /> Ampliar
        </button>
      </div>
      <button
        type="button"
        className="destination-gallery-preview"
        onClick={() => setExpanded(true)}
        aria-label={`Ampliar fotografía ${index + 1} de ${name}`}
      >
        <PhotoFrame key={photo.thumbnail} photo={photo} />
        <span className="destination-gallery-expand">
          <Expand size={18} />
        </span>
      </button>
      {controls()}
      {photos.length > 1 && (
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
      <dialog
        ref={dialog}
        className="destination-lightbox"
        aria-labelledby={titleId}
        onCancel={() => setExpanded(false)}
        onClose={() => setExpanded(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setExpanded(false);
        }}
      >
        {expanded && (
          <div className="destination-lightbox-inner">
            <div className="destination-lightbox-heading">
              <div>
                <span className="eyebrow">Inventario turístico · MINCETUR</span>
                <h2 id={titleId}>{name}</h2>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setExpanded(false)}
                aria-label="Cerrar fotografías ampliadas"
              >
                <X size={24} />
              </button>
            </div>
            <PhotoFrame key={photo.full} photo={photo} full />
            <div className="destination-lightbox-footer">
              {controls(true)}
              <a href={gallerySource} target="_blank" rel="noopener noreferrer">
                Ver ficha de MINCETUR <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}

function PhotoFrame({ photo, full = false }: { photo: DestinationPhoto; full?: boolean }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className="destination-photo-unavailable">
      No se pudo cargar esta fotografía. Consulta la ficha de MINCETUR.
    </span>
  ) : (
    <img
      src={full ? photo.full : photo.thumbnail}
      alt={photo.alt}
      width={full ? 1400 : 480}
      height={full ? 1050 : 360}
      loading={full ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
