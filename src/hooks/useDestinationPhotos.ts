import { useEffect, useState } from 'react';
import availableGalleries from '../data/mincetur-gallery-index.json';

export interface DestinationPhoto {
  id: string;
  alt: string;
  thumbnail: string;
  full: string;
}
export interface DestinationPhotoGallery {
  name: string;
  source: string;
  photos: DestinationPhoto[];
}
const cache = new Map<string, Promise<DestinationPhotoGallery | null>>();

function ficheId(source: string) {
  try {
    const url = new URL(source);
    return url.hostname === 'consultasenlinea.mincetur.gob.pe'
      ? url.searchParams.get('cod_Ficha')
      : null;
  } catch {
    return null;
  }
}

export function useDestinationPhotos(source: string, galleryId?: string) {
  const id = galleryId ?? ficheId(source);
  const available = id !== null && availableGalleries.includes(id);
  const [result, setResult] = useState<{
    id: string;
    gallery: DestinationPhotoGallery | null;
  } | null>(null);
  const gallery = result?.id === id ? result.gallery : null;
  const loading = available && result?.id !== id;
  useEffect(() => {
    if (!id || !available) return;
    let active = true;
    let request = cache.get(id);
    if (!request) {
      request = fetch(`/images/mincetur/galleries/${id}.json`)
        .then(async (response) => {
          if (!response.ok) throw new Error('Gallery unavailable');
          const data = (await response.json()) as DestinationPhotoGallery;
          return Array.isArray(data.photos) && data.photos.length ? data : null;
        })
        .catch(() => {
          cache.delete(id);
          return null;
        });
      cache.set(id, request);
    }
    void request.then((data) => {
      if (active) {
        setResult({ id, gallery: data });
      }
    });
    return () => {
      active = false;
    };
  }, [id, available]);
  return { gallery, loading, available };
}
