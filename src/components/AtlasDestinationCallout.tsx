import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Marker } from 'maplibre-gl';
import type { Map } from 'maplibre-gl';
import type { TouristPlace } from '../data/apurimac-places';
import { DestinationIllustration } from './DestinationIllustration';

interface AtlasDestinationCalloutProps {
  map: Map;
  place: TouristPlace;
}

export function AtlasDestinationCallout({ map, place }: AtlasDestinationCalloutProps) {
  const [container] = useState(() => {
    const element = document.createElement('div');
    element.className = 'atlas-destination-anchor';
    return element;
  });
  const [longitude, latitude] = place.coordinates;

  useEffect(() => {
    // Native markers share the terrain projection used by the numbered pins.
    // The arrow ends at the upper edge of the pin, keeping its click target free.
    const marker = new Marker({
      element: container,
      anchor: 'bottom',
      offset: [0, -48],
      pitchAlignment: 'viewport',
      rotationAlignment: 'viewport',
    })
      .setLngLat([longitude, latitude])
      .addTo(map);
    return () => {
      marker.remove();
    };
  }, [map, container, longitude, latitude]);

  return createPortal(<DestinationIllustration placeId={place.id} variant="map" />, container);
}
