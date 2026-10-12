import { useState } from 'react';
import { Camera } from 'lucide-react';
import { useDestinationPhotos } from '../hooks/useDestinationPhotos';

export function ExperiencePhoto({
  id,
  name,
  className = '',
}: {
  id: string;
  name: string;
  className?: string;
}) {
  const source = `https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=${id}`;
  const { gallery, loading } = useDestinationPhotos(source);
  const [failed, setFailed] = useState(false);
  const photo = gallery?.photos[0];
  return (
    <figure className={`experience-photo ${className}`}>
      {photo && !failed ? (
        <img
          src={photo.full}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="experience-photo-empty">
          <Camera size={38} />
          <span>{loading ? 'Preparando fotografía…' : name}</span>
        </div>
      )}
      <figcaption>
        <span>{name}</span>
        <a href={gallery?.source ?? source} target="_blank" rel="noreferrer">
          Fuente: ficha MINCETUR ↗
        </a>
      </figcaption>
    </figure>
  );
}
