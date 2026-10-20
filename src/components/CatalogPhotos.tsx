import { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import availableGalleries from '../data/mincetur-gallery-index.json';
import { DestinationGallery } from './DestinationGallery';
import { ContextPhoto } from './ContextPhoto';

export function CatalogPhotos({ id, name, source }: { id: string; name: string; source: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window));
  const available = availableGalleries.includes(id);

  useEffect(() => {
    const element = container.current;
    if (!element || !available || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [available]);

  if (!available) return <ContextPhoto id={id} name={name} />;

  return (
    <div className="catalog-photos" ref={container}>
      {visible ? (
        <DestinationGallery source={source} galleryId={id} name={name} variant="catalog" />
      ) : (
        <div className="catalog-photo-loading" aria-hidden="true">
          <div className="catalog-photo-preview">
            <Camera size={28} />
            <span>Fotografías del destino</span>
          </div>
          <span className="catalog-photo-loading-caption">Archivo fotográfico · MINCETUR</span>
        </div>
      )}
    </div>
  );
}
