import contextualPhotos from './catalog-context-photos.json';
import type { DestinationPhoto } from '../hooks/useDestinationPhotos';

interface ContextImage {
  referenceId: string;
  referenceName: string;
  source: string;
  photo: DestinationPhoto;
}

export function getContextPhoto(id: string): ContextImage | undefined {
  return (contextualPhotos as Record<string, ContextImage>)[id];
}
