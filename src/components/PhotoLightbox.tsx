import { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, X } from 'lucide-react';
import type { DestinationPhoto } from '../hooks/useDestinationPhotos';
import './destination-gallery.css';

interface PhotoLightboxProps {
  photo?: DestinationPhoto;
  loading?: boolean;
  name: string;
  source: string;
  description?: string;
  index: number;
  count: number;
  onStep: (direction: -1 | 1) => void;
  onClose: () => void;
}

export function PhotoLightbox({
  photo,
  loading = false,
  name,
  source,
  description,
  index,
  count,
  onStep,
  onClose,
}: PhotoLightboxProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="destination-lightbox"
      aria-labelledby={titleId}
      onCancel={onClose}
      onClose={(event) => {
        if (!event.currentTarget.open) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          event.stopPropagation();
          onStep(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}
    >
      <div className="destination-lightbox-inner">
        <div className="destination-lightbox-heading">
          <div>
            <span className="eyebrow">Inventario turístico · MINCETUR</span>
            <h2 id={titleId}>{name}</h2>
            {description && <p className="lightbox-description">{description}</p>}
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Cerrar fotografías ampliadas"
          >
            <X size={24} />
          </button>
        </div>
        {photo ? (
          <PhotoFrame key={photo.full} photo={photo} full />
        ) : (
          <div className="destination-photo-unavailable" role="status">
            {loading
              ? 'Preparando fotografía…'
              : 'No se pudo cargar esta fotografía. Consulta la ficha de MINCETUR.'}
          </div>
        )}
        <div className="destination-lightbox-footer">
          <div className="destination-gallery-controls">
            <button
              type="button"
              disabled={count < 2}
              onClick={() => onStep(-1)}
              aria-label={`Foto anterior de ${name}, ampliada`}
            >
              <ArrowLeft size={18} />
            </button>
            <span role="status" aria-live="polite">
              {index + 1} / {count}
            </span>
            <button
              type="button"
              disabled={count < 2}
              onClick={() => onStep(1)}
              aria-label={`Foto siguiente de ${name}, ampliada`}
            >
              <ArrowRight size={18} />
            </button>
          </div>
          <a href={source} target="_blank" rel="noopener noreferrer">
            Ver ficha de MINCETUR <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </dialog>
  );
}

export function PhotoFrame({ photo, full = false }: { photo: DestinationPhoto; full?: boolean }) {
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
