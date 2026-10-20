import { useState } from 'react';
import { Camera, Expand, ExternalLink, Send } from 'lucide-react';
import selection from '../data/curated-photos.json';
import { resourceById } from '../data/regional-tourism';
import { useDestinationPhotos } from '../hooks/useDestinationPhotos';
import { PhotoFrame, PhotoLightbox } from './PhotoLightbox';
import { ContactLinks } from './ProjectContact';

type Selection = (typeof selection)[number];
const categories = ['Todas', 'Paisajes', 'Patrimonio', 'Cultura viva'];

function GalleryCard({ item, onOpen }: { item: Selection; onOpen: () => void }) {
  const resource = resourceById.get(item.resourceId)!;
  const { gallery, loading } = useDestinationPhotos(resource.source, resource.id);
  const photo = gallery?.photos.find((image) => image.id === item.photoId);
  return (
    <article className="curated-photo-card">
      <button
        className="curated-photo-preview"
        type="button"
        onClick={(event) => {
          event.currentTarget.focus({ preventScroll: true });
          onOpen();
        }}
        disabled={!photo}
        aria-label={`Ampliar fotografía de ${resource.name}`}
      >
        {photo ? (
          <PhotoFrame photo={photo} />
        ) : (
          <span className="curated-photo-placeholder">
            <Camera size={32} aria-hidden="true" />
            {loading ? 'Preparando fotografía…' : 'Fotografía no disponible'}
          </span>
        )}
        {photo && (
          <span className="curated-photo-expand">
            <Expand size={17} /> Ampliar
          </span>
        )}
      </button>
      <div className="curated-photo-copy">
        <span className="eyebrow blue">
          {item.category} · {resource.province}
        </span>
        <h3>{resource.name}</h3>
        <p>{item.description}</p>
      </div>
      <a
        className="curated-photo-source"
        href={resource.source}
        target="_blank"
        rel="noopener noreferrer"
      >
        Fuente: ficha MINCETUR <ExternalLink size={12} />
      </a>
    </article>
  );
}

export function CuratedGallery() {
  const [category, setCategory] = useState('Todas');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const items =
    category === 'Todas' ? selection : selection.filter((item) => item.category === category);
  const active = activeIndex === null ? undefined : items[activeIndex];
  const resource = active ? resourceById.get(active.resourceId) : undefined;
  const { gallery, loading } = useDestinationPhotos(resource?.source ?? '', resource?.id);
  const photo = gallery?.photos.find((item) => item.id === active?.photoId);
  function step(direction: -1 | 1) {
    setActiveIndex((index) =>
      index === null ? null : (index + direction + items.length) % items.length,
    );
  }
  return (
    <section
      className="section curated-gallery"
      id="galeria"
      aria-labelledby="curated-gallery-title"
    >
      <div className="curated-gallery-heading">
        <div>
          <span className="eyebrow blue">Cuaderno visual · Archivo del territorio</span>
          <h2 id="curated-gallery-title">
            Miradas de <em>Apurímac.</em>
          </h2>
        </div>
        <p>
          Paisajes, patrimonio y cultura viva en doce imágenes del inventario turístico. Una
          selección para detenerse, observar y preparar tu propia mirada.
        </p>
      </div>
      <p className="small muted">
        Archivo fotográfico de las fichas de MINCETUR, con fuente individual. La galería reúne
        referencias de toda la región; las cinco jornadas se detallan en el programa fotográfico.
      </p>
      <div
        className="curated-gallery-filters"
        role="group"
        aria-label="Filtrar la galería fotográfica"
      >
        {categories.map((value) => (
          <button
            type="button"
            key={value}
            aria-pressed={category === value}
            onClick={() => {
              setActiveIndex(null);
              setCategory(value);
            }}
          >
            {value}
          </button>
        ))}
      </div>
      <p className="curated-gallery-count" role="status">
        {items.length} imágenes · {category === 'Todas' ? 'Todos los temas' : category}
      </p>
      <div className="curated-gallery-grid">
        {items.map((item, index) => (
          <GalleryCard key={item.resourceId} item={item} onOpen={() => setActiveIndex(index)} />
        ))}
      </div>
      {active && resource && activeIndex !== null && (
        <PhotoLightbox
          photo={photo}
          loading={loading}
          name={resource.name}
          source={resource.source}
          description={active.description}
          index={activeIndex}
          count={items.length}
          onStep={step}
          onClose={() => setActiveIndex(null)}
        />
      )}
      <div className="photo-contributions" aria-labelledby="photo-contributions-title">
        <div className="photo-contributions-icon">
          <Send size={28} strokeWidth={1.3} aria-hidden="true" />
        </div>
        <div>
          <span className="eyebrow blue">Tu fotografía también cuenta</span>
          <h3 id="photo-contributions-title">Comparte tu mirada.</h3>
          <p>
            Envíanos tus fotografías de Apurímac por correo o Instagram. Incluye el lugar, tu nombre
            o crédito de autoría y tu autorización para publicarlas. Si aparecen personas
            reconocibles, indica que cuentas con su permiso.
          </p>
          <p className="small muted">
            El equipo revisará la ubicación, los créditos y las autorizaciones antes de incorporar
            cada aporte. El envío no implica publicación automática.
          </p>
          <ContactLinks subject="Aporte fotográfico para Miradas de Apurímac" />
        </div>
      </div>
    </section>
  );
}
