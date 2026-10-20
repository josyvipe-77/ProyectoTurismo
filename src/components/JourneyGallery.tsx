import { useRef } from 'react';
import { ArrowLeft, ArrowRight, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDestinationPhotos } from '../hooks/useDestinationPhotos';

const places = [
  { id: '4678', day: 'taraccasa', name: 'Taraccasa', theme: 'Ciudad y paisaje' },
  { id: '8264', day: 'pampachiri', name: 'Pampachiri', theme: 'Las formas del tiempo' },
  { id: '31', day: 'pachachaca', name: 'Pachachaca', theme: 'La memoria en piedra' },
  { id: '577', day: 'ampay', name: 'Ampay', theme: 'El bosque y el agua' },
  { id: '3055', day: 'canon', name: 'San Cristóbal', theme: 'Una mirada al cañón' },
];

function JourneyCard({ place, index }: { place: (typeof places)[number]; index: number }) {
  const source = `https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=${place.id}`;
  const { gallery } = useDestinationPhotos(source);
  const photos = gallery?.photos.slice(0, 2) ?? [];
  return (
    <article className="journey-card">
      <Link className="journey-card-link" to={`/construye#${place.day}`}>
        <div className="journey-card-image">
          {photos.length ? (
            photos.map((photo, i) => (
              <img
                key={photo.id}
                src={photo.full}
                srcSet={`${photo.thumbnail} 480w, ${photo.full} 1400w`}
                sizes="(max-width: 760px) 78vw, 240px"
                alt={i === 0 ? photo.alt : ''}
                aria-hidden={i > 0 || undefined}
                loading="lazy"
                decoding="async"
                className={i === 1 ? 'journey-card-alternate' : undefined}
              />
            ))
          ) : (
            <Camera size={30} aria-hidden="true" />
          )}
          <span className="journey-card-number">0{index + 1}</span>
          <span className="journey-card-arrow" aria-hidden="true">
            <ArrowRight size={20} />
          </span>
        </div>
        <div className="journey-card-copy">
          <span className="eyebrow blue">{place.theme}</span>
          <h3>{place.name}</h3>
          <span className="journey-card-action">
            Conoce la jornada <ArrowRight size={14} />
          </span>
        </div>
      </Link>
      <a className="journey-photo-source" href={source} target="_blank" rel="noreferrer">
        Fotografías: ficha MINCETUR {place.id} ↗
      </a>
    </article>
  );
}

export function JourneyGallery() {
  const strip = useRef<HTMLDivElement>(null);
  function move(direction: number) {
    const container = strip.current;
    if (!container) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    container.scrollBy({
      left: direction * container.clientWidth * 0.82,
      behavior: reduced ? 'instant' : 'smooth',
    });
  }
  return (
    <section className="section journey-gallery" aria-labelledby="journey-gallery-title">
      <div className="journey-gallery-heading">
        <div>
          <span className="eyebrow blue">Un viaje, muchas perspectivas</span>
          <h2 id="journey-gallery-title">
            La próxima imagen
            <br />
            <em>empieza aquí.</em>
          </h2>
          <p>
            Cinco lugares para detener la mirada. Abre cada jornada para conocer su historia y
            preparar el recorrido.
          </p>
        </div>
        <div className="journey-gallery-controls">
          <button type="button" aria-label="Ver fotografías anteriores" onClick={() => move(-1)}>
            <ArrowLeft size={20} />
          </button>
          <button type="button" aria-label="Ver más fotografías" onClick={() => move(1)}>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      <div
        className="journey-gallery-strip"
        ref={strip}
        role="region"
        aria-label="Galería de las cinco jornadas"
        tabIndex={0}
      >
        {places.map((place, index) => (
          <JourneyCard key={place.id} place={place} index={index} />
        ))}
      </div>
      <p className="journey-gallery-hint">
        Desliza para descubrir los lugares. En el quinto día, San Cristóbal es una de las variantes
        elegibles.
      </p>
    </section>
  );
}
