import { useState } from 'react';
import { artworkUrl, destinationArtwork } from '../data/destination-illustrations';
import type { DestinationArtwork } from '../data/destination-illustrations';
import './destination-illustration.css';

interface DestinationIllustrationProps {
  placeId: string;
  variant?: 'map' | 'catalog' | 'stop';
}

export function DestinationIllustration({
  placeId,
  variant = 'catalog',
}: DestinationIllustrationProps) {
  const artwork = destinationArtwork(placeId);
  return artwork ? <Artwork key={artwork.id} artwork={artwork} variant={variant} /> : null;
}

function Artwork({
  artwork,
  variant,
}: {
  artwork: DestinationArtwork;
  variant: 'map' | 'catalog' | 'stop';
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const compact = variant === 'stop';
  return (
    <figure className={`destination-art destination-art--${variant}`} data-artwork={artwork.id}>
      <div className="destination-art-stage">
        {failed ? (
          <span className="destination-art-unavailable">{artwork.name}</span>
        ) : (
          <img
            src={artworkUrl(artwork.id, 320)}
            srcSet={
              compact
                ? undefined
                : `${artworkUrl(artwork.id, 320)} 320w, ${artworkUrl(artwork.id, 640)} 640w`
            }
            sizes={
              variant === 'map'
                ? '(max-width: 760px) 104px, 176px'
                : '(max-width: 760px) 280px, 320px'
            }
            width={640}
            height={640}
            alt={compact ? '' : artwork.alt}
            loading={variant === 'map' ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority="low"
            className={loaded ? 'is-loaded' : ''}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      {!compact && (
        <figcaption>
          {variant === 'map' && <strong>{artwork.name}</strong>}
          <span>{variant === 'map' ? 'Ilustración · IA' : 'Ilustración interpretativa · IA'}</span>
        </figcaption>
      )}
    </figure>
  );
}
